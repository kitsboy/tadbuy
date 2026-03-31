#!/bin/bash
set -e

echo "═══════════════════════════════════════════════"
echo "  TadBuy Metrics v1.0.0"
echo "  Bitcoin-denominated ad analytics"
echo "  Currencies: BTC, USD, CAD, EUR, GBP"
echo "═══════════════════════════════════════════════"

# Create data directories
mkdir -p "${DATA_DIR:-/data/tadbuy-metrics}/reports"
mkdir -p "${DATA_DIR:-/data/tadbuy-metrics}/logs"

# Start cron daemon in background (for scheduled scraping)
if command -v cron &> /dev/null; then
    echo "Starting cron daemon..."
    cron
fi

# Run initial data collection on startup
echo "Running initial data collection..."
python /app/scripts/x-ads-scraper.py || echo "⚠️  Initial scrape failed (will retry via cron at 6 AM UTC)"
python /app/scripts/cost-of-value.py || echo "⚠️  Initial CoV calculation failed (will retry via cron hourly)"

# Start API server
echo ""
echo "Starting API server on port ${PORT:-8080}..."
echo "Endpoints: /health  /api/v1/rates  /api/v1/ads/x/latest  /api/v1/cost-of-value/latest"
exec python /app/api/server.py
