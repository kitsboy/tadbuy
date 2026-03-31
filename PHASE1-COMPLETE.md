# TadBuy Metrics — Phase 1 Completion Report

**Date:** March 13, 2026  
**Status:** ✅ COMPLETE  
**Lead:** Ziggy (Full Stack)  
**Location:** `/data/.openclaw/workspace/tadbuy-metrics/`

---

## ✅ Completed Components

### 1. X/Twitter Ad Metrics Scraper
- **File:** `scripts/x-ads-scraper.py`
- **Features:**
  - Live Brave Search API integration (optional) for fresh benchmarks
  - Industry fallback data (Wordstream/Socialinsider Q4 2025)
  - Multi-currency support (USD, CAD, EUR, GBP)
  - All values stored in **satoshis** (BTC-first)
  - Automatic retry logic with configurable delays
  - Outputs JSON with full fiat equivalents

### 2. Cost-of-Value Calculator
- **File:** `scripts/cost-of-value.py`
- **Features:**
  - Lenny's energy-backed valuation model
  - Formula: `true_cost = energy + mining + opportunity`
  - Signals: BUY (< -20%), HOLD, SELL (> +30%)
  - Multi-currency output (all values derived from sats)
  - Cost breakdown percentages
  - Runs hourly via cron

### 3. Python API Server
- **File:** `api/server.py`
- **Features:**
  - **Zero dependencies** — Python stdlib only
  - Endpoints:
    - `GET /health` — Health check
    - `GET /api/v1/rates` — Live exchange rates
    - `GET /api/v1/rates/convert` — Sats ↔ Fiat conversion
    - `GET /api/v1/ads/x/latest` — Latest ad metrics
    - `GET /api/v1/ads/x/history` — Historical data
    - `POST /api/v1/ads/x/scrape` — Trigger manual scrape
    - `GET /api/v1/cost-of-value/latest` — Latest CoV calculation
    - `GET /api/v1/cost-of-value/history` — Historical CoV
    - `POST /api/v1/cost-of-value/calculate` — Custom calculation
  - 5-minute exchange rate cache
  - Reads from JSON files written by scrapers

### 4. Docker Containerization
- **File:** `Dockerfile`
- **Features:**
  - Multi-arch support: AMD64 + ARM64
  - Based on `python:3.12-slim`
  - Includes cron daemon for scheduled tasks
  - Health check endpoint
  - Volume mount for persistent data
  - One-command deploy: `docker run -p 8080:8080 giveabit/tadbuy-metrics`

### 5. Docker Compose
- **File:** `docker-compose.yml`
- **Features:**
  - Full environment variable configuration
  - Persistent volume (`tadbuy-data`)
  - Health checks
  - Auto-restart policy

### 6. GitHub Actions
- **File:** `.github/workflows/docker-publish.yml`
- **Features:**
  - Auto-build on push to `main`
  - Multi-arch builds (AMD64 + ARM64)
  - Tag-based versioning
  - Publishes to Docker Hub (`giveabit/tadbuy-metrics`)
  - Requires `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` secrets

### 7. Frontend Scaffold
- **Location:** `frontend/`
- **Features:**
  - Next.js 14 with App Router
  - TypeScript + Tailwind CSS
  - Components: `BtcTicker`, `AdMetricsTable`, `CostOfValueWidget`, `CurrencyToggle`, `SignalBadge`
  - API routes for server-side data fetching
  - BTC/fiat display toggle ready

### 8. Scheduled Jobs (Cron)
- **File:** `crontab`
- **Schedule:**
  - X/Twitter scraper: Daily at 6 AM UTC
  - Cost-of-value: Hourly
  - Log rotation: Weekly

---

## 🧪 Testing Commands

```bash
# Run scrapers manually
python scripts/x-ads-scraper.py
python scripts/cost-of-value.py

# Start API server
python api/server.py

# Test endpoints
curl http://localhost:8080/health
curl http://localhost:8080/api/v1/rates
curl "http://localhost:8080/api/v1/rates/convert?sats=100000&currency=CAD"
curl http://localhost:8080/api/v1/ads/x/latest
curl http://localhost:8080/api/v1/cost-of-value/latest

# Docker build (requires Docker)
docker build -t tadbuy-metrics .
docker run -d -p 8080:8080 -v tadbuy-data:/data/tadbuy-metrics tadbuy-metrics
```

---

## 📊 Data Structure

All data stored in `/data/tadbuy-metrics/`:

```
/data/tadbuy-metrics/
├── ad-metrics.json           # X/Twitter snapshots (append-only array)
├── cost-of-value.json        # CoV calculations (append-only array)
├── exchange-rates.json       # Latest rates cache
├── logs/
│   ├── x-ads-scraper.log
│   ├── cost-of-value.log
│   └── api-server.log
└── reports/                  # Generated reports (future)
```

---

## 🔧 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `8080` | API server port |
| `DATA_DIR` | `/data/tadbuy-metrics` | Data storage path |
| `BRAVE_API_KEY` | _(empty)_ | Brave Search API key |
| `COV_ENERGY_COST_USD` | `14500` | Electricity cost per BTC |
| `COV_MINING_COST_USD` | `9500` | Hardware/facility cost per BTC |
| `COV_OPPORTUNITY_COST_USD` | `3000` | Opportunity cost per BTC |
| `COV_BUY_THRESHOLD` | `-0.20` | Buy signal threshold (-20%) |
| `COV_SELL_THRESHOLD` | `0.30` | Sell signal threshold (+30%) |

---

## 🚀 Deployment Options

### 1. Self-Hosted (Docker)
```bash
docker run -d \
  -p 8080:8080 \
  -v tadbuy-data:/data/tadbuy-metrics \
  --name tadbuy-metrics \
  giveabit/tadbuy-metrics
```

### 2. Docker Compose
```bash
git clone https://github.com/giveabit/tadbuy-metrics.git
cd tadbuy-metrics
cp .env.example .env  # Edit settings
docker compose up -d
```

### 3. Umbrel (ARM64 Raspberry Pi)
```bash
docker pull giveabit/tadbuy-metrics:latest
docker run -d -p 8080:8080 -v tadbuy-data:/data/tadbuy-metrics giveabit/tadbuy-metrics
```

---

## 📋 Phase 2 Plan

- [ ] Next.js dashboard polish (responsive, error states)
- [ ] OpenTimestamps integration (data provenance)
- [ ] Google Ads scraper plugin
- [ ] Meta Ads scraper plugin
- [ ] NOSTR authentication (NIP-07)
- [ ] Report publishing (kind:30078)

---

## 📝 Notes

- **Philosophy:** BTC-first. All monetary values stored in satoshis. Fiat is display-only.
- **Multi-currency:** Native support for USD, CAD, EUR, GBP out of the box.
- **Zero dependencies:** Python scripts use stdlib only. No pip install required.
- **Cleaned up:** Removed duplicate `backend/` folder (was mock Node.js server).

---

**Built with ❤️ by GiveAbit**  
*Fix the money, fix the world.* 🟠
