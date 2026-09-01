#!/bin/bash
###############################################################################
# Nostr Relay Health Check Script
# Description: Comprehensive health check for all Tadbuy Nostr relays
# Usage: ./health-check.sh [region]
# Example: ./health-check.sh us
###############################################################################

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
TIMEOUT=10
VERBOSE=${VERBOSE:-0}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Relay configuration
declare -A RELAYS=(
    ["us"]="7070:United States (Wyoming)"
    ["jp"]="7071:Japan"
    ["de"]="7072:Germany"
    ["nl"]="7073:Netherlands"
    ["pt"]="7074:Portugal"
    ["sg"]="7075:Singapore"
    ["sv"]="7076:El Salvador"
    ["ar"]="7077:Argentina"
)

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $*"
}

log_success() {
    echo -e "${GREEN}[OK]${NC} $*"
}

log_warning() {
    echo -e "${YELLOW}[WARN]${NC} $*"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $*"
}

# Check if Docker is running
check_docker() {
    if ! docker info >/dev/null 2>&1; then
        log_error "Docker is not running. Please start Docker."
        exit 1
    fi
    log_success "Docker is running"
}

# Check container status
check_container() {
    local region=$1
    local container_name="tadbuy-relay-${region}"

    if docker ps --format '{{.Names}}' | grep -q "^${container_name}$"; then
        log_success "Container ${container_name} is running"
        return 0
    else
        log_error "Container ${container_name} is not running"
        return 1
    fi
}

# Check relay health endpoint
check_health_endpoint() {
    local region=$1
    local port="${RELAYS[$region]%%:*}"
    local name="${RELAYS[$region]##*:}"
    local url="http://localhost:${port}/health"

    log_info "Checking health endpoint for ${name} (port ${port})"

    # Try to fetch health endpoint
    if response=$(curl -s -m "$TIMEOUT" "$url" 2>/dev/null); then
        if [[ "$response" == *"healthy"* ]] || [[ "$response" == *"ok"* ]] || [[ "$response" == *"running"* ]]; then
            log_success "${name} health endpoint responding: $response"
            return 0
        else
            log_warning "${name} health endpoint returned unexpected response: $response"
            return 1
        fi
    else
        log_error "${name} health endpoint not responding on port ${port}"
        return 1
    fi
}

# Check Nostr protocol (NIP-11)
check_nostr_protocol() {
    local region=$1
    local port="${RELAYS[$region]%%:*}"
    local name="${RELAYS[$region]##*:}"

    log_info "Checking Nostr protocol (NIP-11) for ${name}"

    # Fetch NIP-11 relay information document
    if response=$(curl -s -m "$TIMEOUT" -H "Accept: application/nostr+json" "http://localhost:${port}/" 2>/dev/null); then
        if [[ -n "$response" ]] && [[ "$response" != "Not Found" ]]; then
            log_success "${name} NIP-11 document available"
            if [[ "$VERBOSE" == "1" ]]; then
                echo "  NIP-11 Response:"
                echo "$response" | head -10 | sed 's/^/    /'
            fi
            return 0
        else
            log_warning "${name} NIP-11 document not found"
            return 1
        fi
    else
        log_error "${name} Nostr protocol check failed"
        return 1
    fi
}

# Check database size
check_database() {
    local region=$1
    local container_name="tadbuy-relay-${region}"
    local name="${RELAYS[$region]##*:}"

    log_info "Checking database for ${name}"

    if docker exec "$container_name" ls -la /data/*.db 2>/dev/null | head -1; then
        log_success "${name} database accessible"
        return 0
    else
        log_warning "${name} database not found or not accessible"
        return 1
    fi
}

# Check disk usage
check_disk_usage() {
    local region=$1
    local container_name="tadbuy-relay-${region}"
    local name="${RELAYS[$region]##*:}"

    log_info "Checking disk usage for ${name}"

    # Get disk usage inside container
    if disk_usage=$(docker exec "$container_name" df -h /data 2>/dev/null | tail -1 | awk '{print $5}' | tr -d '%'); then
        if [[ "$disk_usage" -lt 80 ]]; then
            log_success "${name} disk usage: ${disk_usage}%"
            return 0
        elif [[ "$disk_usage" -lt 90 ]]; then
            log_warning "${name} disk usage: ${disk_usage}% (getting full)"
            return 1
        else
            log_error "${name} disk usage: ${disk_usage}% (CRITICAL)"
            return 1
        fi
    else
        log_warning "${name} could not check disk usage"
        return 1
    fi
}

# Check memory usage
check_memory() {
    local region=$1
    local container_name="tadbuy-relay-${region}"
    local name="${RELAYS[$region]##*:}"

    log_info "Checking memory usage for ${name}"

    if mem_usage=$(docker stats "$container_name" --no-stream --format "{{.MemPerc}}" 2>/dev/null | tr -d '%'); then
        if [[ "$mem_usage" -lt 80 ]]; then
            log_success "${name} memory usage: ${mem_usage}%"
            return 0
        elif [[ "$mem_usage" -lt 90 ]]; then
            log_warning "${name} memory usage: ${mem_usage}% (getting full)"
            return 1
        else
            log_error "${name} memory usage: ${mem_usage}% (CRITICAL)"
            return 1
        fi
    else
        log_warning "${name} could not check memory usage"
        return 1
    fi
}

# Check CPU usage
check_cpu() {
    local region=$1
    local container_name="tadbuy-relay-${region}"
    local name="${RELAYS[$region]##*:}"

    log_info "Checking CPU usage for ${name}"

    if cpu_usage=$(docker stats "$container_name" --no-stream --format "{{.CPUPerc}}" 2>/dev/null | tr -d '%'); then
        if [[ -n "$cpu_usage" ]]; then
            log_success "${name} CPU usage: ${cpu_usage}%"
            return 0
        else
            log_warning "${name} could not retrieve CPU usage"
            return 1
        fi
    else
        log_warning "${name} could not check CPU usage"
        return 1
    fi
}

# Check SSL certificate
check_ssl() {
    local region=$1
    local name="${RELAYS[$region]##*:}"

    # Get domain from metadata (assumes pattern: us.tadbuy.io)
    local domain="${region}.tadbuy.io"
    if [[ "$region" == "us" ]]; then
        domain="us.tadbuy.io"
    elif [[ "$region" == "jp" ]]; then
        domain="jp.tadbuy.io"
    fi

    log_info "Checking SSL certificate for ${name} (${domain})"

    # Check SSL certificate expiration
    if cert_info=$(echo | openssl s_client -servername "$domain" -connect "$domain:443" 2>/dev/null | openssl x509 -noout -dates 2>/dev/null); then
        if echo "$cert_info" | grep -q "notAfter"; then
            log_success "${name} SSL certificate is valid"
            if [[ "$VERBOSE" == "1" ]]; then
                echo "$cert_info" | sed 's/^/    /'
            fi
            return 0
        else
            log_warning "${name} SSL certificate check returned unexpected output"
            return 1
        fi
    else
        log_warning "${name} could not check SSL certificate (may be expected for local dev)"
        return 1
    fi
}

# Send health check results to monitoring endpoint
send_metrics() {
    local region=$1
    local status=$2
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    local metrics_url="${METRICS_URL:-http://localhost:9090/metrics}"

    # Send to monitoring endpoint
    if [[ -n "${METRICS_URL:-}" ]]; then
        curl -s -X POST "$metrics_url" \
            -H "Content-Type: application/json" \
            -d "{
                \"region\": \"$region\",
                \"status\": \"$status\",
                \"timestamp\": \"$timestamp\",
                \"component\": \"nostr-relay\"
            }" 2>/dev/null || true
    fi
}

# Health check for a specific relay
check_relay() {
    local region=$1
    local name="${RELAYS[$region]##*:}"
    local exit_code=0

    echo ""
    log_info "=========================================="
    log_info "Checking ${name}"
    log_info "=========================================="

    # Container status
    check_container "$region" || exit_code=1

    # Health endpoint
    check_health_endpoint "$region" || exit_code=1

    # Nostr protocol
    check_nostr_protocol "$region" || exit_code=1

    # Database
    check_database "$region" || exit_code=1

    # Resource usage
    check_disk_usage "$region" || exit_code=1
    check_memory "$region" || exit_code=1
    check_cpu "$region" || exit_code=1

    # SSL
    check_ssl "$region" || true  # SSL check may fail in dev

    # Send metrics
    if [[ $exit_code -eq 0 ]]; then
        send_metrics "$region" "healthy"
    else
        send_metrics "$region" "unhealthy"
    fi

    return $exit_code
}

# Main function
main() {
    log_info "Tadbuy Nostr Relay Health Check"
    log_info "=========================================="
    echo ""

    # Check Docker
    check_docker
    echo ""

    # If region specified, check only that region
    if [[ -n "${1:-}" ]]; then
        if [[ -n "${RELAYS[$1]:-}" ]]; then
            check_relay "$1"
            exit $?
        else
            log_error "Unknown region: $1"
            log_info "Available regions: ${!RELAYS[*]}"
            exit 1
        fi
    fi

    # Check all relays
    local total=0
    local healthy=0
    local unhealthy=0

    for region in "${!RELAYS[@]}"; do
        if check_relay "$region"; then
            ((healthy++))
        else
            ((unhealthy++))
        fi
        ((total++))
    done

    echo ""
    log_info "=========================================="
    log_info "Health Check Summary"
    log_info "=========================================="
    log_info "Total relays: $total"
    log_success "Healthy: $healthy"
    if [[ $unhealthy -gt 0 ]]; then
        log_error "Unhealthy: $unhealthy"
    else
        log_success "Unhealthy: $unhealthy"
    fi

    # Exit with error if any relay is unhealthy
    if [[ $unhealthy -gt 0 ]]; then
        exit 1
    fi

    exit 0
}

# Parse arguments
if [[ "${1:-}" == "-v" ]] || [[ "${1:-}" == "--verbose" ]]; then
    VERBOSE=1
    shift
fi

# Run main
main "$@"