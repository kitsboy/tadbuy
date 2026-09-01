#!/bin/bash
###############################################################################
# Nostr Relay Update Script
# Description: Update Tadbuy Nostr relays with new configurations and images
# Usage: ./update-config.sh [region] [config_file]
# Example: ./update-config.sh us relay-configs/us-wyoming.toml
###############################################################################

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

# Backup existing configuration
backup_config() {
    local region=$1
    local config_file=$2
    local backup_dir="${PROJECT_DIR}/backups/$(date +%Y%m%d_%H%M%S)"

    log_info "Backing up existing configuration to ${backup_dir}"
    mkdir -p "$backup_dir"
    cp "$config_file" "${backup_dir}/$(basename "$config_file").bak"
    log_success "Backup created"
}

# Update container
update_container() {
    local region=$1
    local container_name="tadbuy-relay-${region}"

    log_info "Updating container for ${region}"

    # Pull latest image
    log_info "Pulling latest nostr-rs-relay image"
    docker pull rustdocker/nostr-rs-relay:latest

    # Stop and remove existing container
    log_info "Stopping existing container"
    docker stop "$container_name" || true
    docker rm "$container_name" || true

    # Recreate with new config
    log_info "Recreating container with new configuration"
    cd "$PROJECT_DIR"
    docker compose up -d "$container_name"

    log_success "Container ${region} updated"
}

# Verify update
verify_update() {
    local region=$1
    local container_name="tadbuy-relay-${region}"

    log_info "Verifying update for ${region}"

    # Wait for container to be healthy
    local retries=0
    local max_retries=30
    while [[ $retries -lt $max_retries ]]; do
        if docker ps --format '{{.Names}}' | grep -q "^${container_name}$"; then
            log_success "Container ${region} is running"
            return 0
        fi
        sleep 2
        ((retries++))
    done

    log_error "Container ${region} failed to start"
    return 1
}

# Main
main() {
    local region="${1:-}"
    local config_file="${2:-}"

    if [[ -z "$region" ]] || [[ -z "$config_file" ]]; then
        log_error "Usage: $0 <region> <config_file>"
        log_info "Example: $0 us relay-configs/us-wyoming.toml"
        exit 1
    fi

    if [[ ! -f "$PROJECT_DIR/$config_file" ]]; then
        log_error "Config file not found: $PROJECT_DIR/$config_file"
        exit 1
    fi

    log_info "Updating relay for region: $region"
    log_info "Config file: $config_file"

    # Backup
    backup_config "$region" "$PROJECT_DIR/$config_file"

    # Update
    update_container "$region"

    # Verify
    verify_update "$region"

    log_success "Update complete for ${region}"
}

main "$@"