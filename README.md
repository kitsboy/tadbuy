# 🟠 TadBuy Metrics

**Bitcoin-denominated advertising analytics & cost-of-value calculator.**

See your ad spend in satoshis. Know what Bitcoin really costs to produce. Multi-currency support out of the box: **BTC, USD, CAD, EUR, GBP**.

> *Fix the money, fix the world.* — GiveAbit

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📊 **X/Twitter Ad Metrics** | CPM, CPC, CPA in satoshis — scraped daily |
| 💱 **Multi-Currency** | BTC primary; USD, CAD 🇨🇦, EUR, GBP fiat display |
| ⚡ **Cost-of-Value Calculator** | Energy-backed BTC valuation with buy/hold/sell signals |
| 🔄 **Live Exchange Rates** | CoinGecko-powered, cached 5 minutes |
| 🐳 **Docker** | One command: `docker run giveabit/tadbuy-metrics` |
| 🏗️ **Multi-arch** | AMD64 + ARM64 — runs on Umbrel, Raspberry Pi, VPS |
| 🌐 **REST API** | Clean JSON endpoints for everything |
| 💯 **100% Open Source** | MIT license, zero vendor lock-in |

---

## 🚀 Quick Start

### Docker (recommended)

```bash
docker run -d \
  -p 8080:8080 \
  -v tadbuy-data:/data/tadbuy-metrics \
  --name tadbuy-metrics \
  giveabit/tadbuy-metrics
```

Then open: http://localhost:8080

### Docker Compose

```bash
git clone https://github.com/giveabit/tadbuy-metrics.git
cd tadbuy-metrics
cp .env.example .env      # Edit your settings
docker compose up -d
```

### From Source (Python 3.12+)

```bash
git clone https://github.com/giveabit/tadbuy-metrics.git
cd tadbuy-metrics
python scripts/x-ads-scraper.py    # Scrape ad metrics
python scripts/cost-of-value.py    # Run CoV calculator
python api/server.py               # Start API server
```

---

## 💱 Multi-Currency Support

All monetary values are **stored in satoshis** (primary denomination). Fiat values are derived at display time using live exchange rates.

**Supported currencies:**

| Code | Currency | Region |
|------|----------|--------|
| `BTC` | Bitcoin (satoshis) | Global 🌍 |
| `USD` | US Dollar | United States 🇺🇸 |
| `CAD` | Canadian Dollar | Canada 🇨🇦 |
| `EUR` | Euro | Europe 🇪🇺 |
| `GBP` | British Pound | United Kingdom 🇬🇧 |

**Conversion formula:**
```
sats = (fiat_amount / btc_price_in_fiat) × 100,000,000

Example: CA$8.73 CPM at BTC = CA$117,885
sats = (8.73 / 117,885) × 100,000,000 = 7,402 sats
```

**Live conversion API:**
```bash
# How much is 100,000 sats in CAD?
curl "http://localhost:8080/api/v1/rates/convert?sats=100000&currency=CAD"

# Returns:
{
  "input": { "sats": 100000, "btc": 0.001 },
  "output": { "amount": 117.89, "currency": "CAD" },
  "all_currencies": {
    "usd": 87.25,
    "cad": 117.89,
    "eur": 80.34,
    "gbp": 68.92
  }
}
```

---

## 📡 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/v1/status` | System status + data counts |
| GET | `/api/v1/rates` | Current exchange rates (all currencies) |
| GET | `/api/v1/rates/convert?sats=100000&currency=CAD` | Convert sats → fiat |
| GET | `/api/v1/rates/convert?amount=50&currency=CAD&direction=to_sats` | Convert fiat → sats |
| GET | `/api/v1/ads/x/latest` | Latest X/Twitter ad metrics |
| GET | `/api/v1/ads/x/history?days=30` | Historical ad metrics |
| POST | `/api/v1/ads/x/scrape` | Trigger manual scrape |
| GET | `/api/v1/cost-of-value/latest` | Latest cost-of-value calculation |
| GET | `/api/v1/cost-of-value/history?days=7` | Historical calculations |
| POST | `/api/v1/cost-of-value/calculate` | Calculate with custom inputs |

### Example: Latest Ad Metrics

```bash
curl http://localhost:8080/api/v1/ads/x/latest | jq
```

```json
{
  "data": {
    "platform": "x_twitter",
    "date": "2026-03-01",
    "btc_price_usd": 87250.0,
    "cpm_sats": 7402,
    "cpc_sats": 665,
    "cpa_sats": 29770,
    "cpm_fiat": {
      "usd": 6.46,
      "cad": 8.73,
      "eur": 5.95,
      "gbp": 5.11
    }
  }
}
```

### Example: Cost-of-Value with Custom Inputs

```bash
curl -X POST http://localhost:8080/api/v1/cost-of-value/calculate \
  -H "Content-Type: application/json" \
  -d '{"energy_cost_usd": 14500, "mining_cost_usd": 9500, "opportunity_cost_usd": 3000}'
```

```json
{
  "data": {
    "true_cost_sats": 100000000,
    "true_cost_fiat": {
      "usd": 27000.0,
      "cad": 36493.0,
      "eur": 24872.0,
      "gbp": 21326.0
    },
    "market_price_fiat": {
      "usd": 87250.0,
      "cad": 117885.0
    },
    "premium_pct": 223.15,
    "signal": "sell",
    "signal_note": "Market $87,250 is 223.1% above true cost $27,000."
  }
}
```

---

## 📁 Data Structure

```
/data/tadbuy-metrics/
├── ad-metrics.json           # X/Twitter ad benchmarks (daily, sats)
├── cost-of-value.json        # Energy-backed valuations (hourly)
├── exchange-rates.json       # USD/CAD/EUR/GBP rates (5 min cache)
├── nostr-feed.json           # NOSTR data stream (Phase 2)
├── reports/                  # Generated reports
└── logs/
    ├── x-ads-scraper.log
    ├── cost-of-value.log
    ├── api-server.log
    └── cron.log
```

---

## 🔧 Configuration

All settings via environment variables (see `.env.example`):

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `8080` | API server port |
| `DATA_DIR` | `/data/tadbuy-metrics` | Data storage path |
| `BRAVE_API_KEY` | _(empty)_ | Brave Search key for live ad benchmarks |
| `BTC_PRICE_URL` | CoinGecko | URL for BTC + multi-currency prices |
| `COV_ENERGY_COST_USD` | `14500` | Electricity cost to mine 1 BTC |
| `COV_MINING_COST_USD` | `9500` | Hardware + facility cost per BTC |
| `COV_OPPORTUNITY_COST_USD` | `3000` | Opportunity cost per BTC |
| `COV_BUY_THRESHOLD` | `-0.20` | Buy signal threshold (-20%) |
| `COV_SELL_THRESHOLD` | `0.30` | Sell signal threshold (+30%) |
| `SCRAPER_MAX_RETRIES` | `3` | Retry count on failure |
| `SCRAPER_RETRY_DELAY` | `10` | Seconds between retries |

---

## ⏰ Cron Schedule

| Job | Schedule | Description |
|-----|----------|-------------|
| X ads scraper | `0 6 * * *` | Daily at 6 AM UTC |
| Cost-of-value | `0 * * * *` | Every hour |
| Log rotation | `0 0 * * 0` | Weekly |

---

## 🏗️ Architecture

```
tadbuy-metrics/
├── scripts/
│   ├── x-ads-scraper.py      # X/Twitter ad benchmark scraper
│   └── cost-of-value.py      # Energy-backed BTC valuation
├── lib/
│   └── multi-currency.ts     # TypeScript exchange rate module
├── api/
│   └── server.py             # HTTP API (stdlib, no framework)
├── data/
│   └── tadbuy-metrics/       # Runtime data (gitignored)
├── .github/workflows/
│   └── docker-publish.yml    # AMD64 + ARM64 auto-build
├── Dockerfile                # Multi-arch container
├── docker-compose.yml
├── crontab                   # Scheduled jobs
├── entrypoint.sh
└── .env.example
```

**Design principles:**
- BTC-first: sats are stored, fiat is derived
- Zero Python dependencies beyond stdlib
- TypeScript module for frontend integration
- Single Docker container — `docker run` just works

---

## 🧪 Testing

```bash
# Run scraper (outputs JSON to stdout + saves file)
python scripts/x-ads-scraper.py

# Run CoV calculator
python scripts/cost-of-value.py

# Test multi-currency conversion (requires tsx or ts-node)
npx tsx lib/multi-currency.ts

# Test API
python api/server.py &
curl http://localhost:8080/health
curl "http://localhost:8080/api/v1/rates/convert?sats=100000&currency=CAD"
curl http://localhost:8080/api/v1/ads/x/latest

# Docker build test (multi-arch)
docker buildx build --platform linux/amd64,linux/arm64 -t giveabit/tadbuy-metrics .
```

**Quick verification:**
```bash
# 100,000 sats in CAD at BTC = CA$117,885 should be ≈ CA$117.89
curl "http://localhost:8080/api/v1/rates/convert?sats=100000&currency=CAD" | jq .output.amount
```

---

## ☁️ One-Click Deploy

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/tadbuy-metrics?referralCode=giveabit)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/giveabit/tadbuy-metrics)

**Fly.io:**
```bash
fly launch --dockerfile Dockerfile
```

**Umbrel (ARM64):**
```bash
docker pull giveabit/tadbuy-metrics:latest
docker run -d -p 8080:8080 -v tadbuy-data:/data/tadbuy-metrics giveabit/tadbuy-metrics
```

---

## 🗺️ Roadmap

- [x] **Phase 1** — X/Twitter scraper + CoV calculator + multi-currency + Docker ✅ **COMPLETE**
- [ ] **Phase 2** — Next.js dashboard with BTC/fiat toggle widgets + OpenTimestamps
- [ ] **Phase 3** — Google Ads + Meta Ads scrapers
- [ ] **Phase 4** — NOSTR authentication + report publishing (kind:30078)
- [ ] **Phase 5** — BOLT 12 payment widget
- [ ] **Phase 6** — GiveAbit hosted SaaS offering

---

## 🤝 Contributing

PRs welcome. MIT licensed — fork it, use it, improve it.

See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md).

---

## 📄 License

MIT — see [LICENSE](LICENSE).

```
Copyright (c) 2026 GiveAbit

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software...
```

---

*Built by [GiveAbit](https://giveabit.org) — Fix the money, fix the world. 🟠*  
*Renamed from Trad Research Lite → TadBuy Metrics — 2026-03-01*
