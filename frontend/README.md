# TadBuy Metrics Frontend

A Next.js 14 dashboard for Bitcoin-denominated ad analytics and cost-of-value calculations.

## Features

- **BTC-first display** — All values shown in satoshis by default, with fiat equivalents
- **Multi-currency support** — Toggle between BTC, USD, CAD, EUR, GBP
- **Live BTC price ticker** — Real-time rates from CoinGecko (5-min cache)
- **X/Twitter Ad Metrics** — CPM/CPC/CPA benchmarks in satoshis
- **Cost of Value calculator** — Energy-backed BTC valuation with buy/hold/sell signals
- **Dark theme** — Midnight background with orange and teal accents
- **Mobile-first responsive** — Works on all devices

## Tech Stack

- Next.js 14 (App Router)
- TypeScript (strict mode)
- Tailwind CSS
- No external UI libraries

## Getting Started

### Prerequisites

- Node.js 18+
- The Python backend running on port 8080 (optional, falls back to mock data)

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

The dev server runs on http://localhost:3000

### Environment Variables

Create a `.env.local` file (optional):

```env
# Backend API URL (defaults to http://localhost:8080)
API_URL=http://localhost:8080

# Data directory path (defaults to /data/tadbuy-metrics)
DATA_DIR=/data/tadbuy-metrics
```

## Project Structure

```
frontend/
  app/
    layout.tsx              # Root layout with dark theme
    page.tsx                # Main dashboard
    globals.css             # Tailwind imports + base styles
    cost-of-value/
      page.tsx              # CoV calculator page
    api/
      btc-price/
        route.ts            # API route for exchange rates
      ad-metrics/
        route.ts            # API route for ad metrics
      cost-of-value/
        route.ts            # API route for CoV data
  components/
    BtcTicker.tsx           # BTC price display
    AdMetricsTable.tsx      # Ad metrics table
    CostOfValueWidget.tsx   # CoV summary widget
    CurrencyToggle.tsx      # Currency selector
    SignalBadge.tsx         # Buy/Hold/Sell badge
  lib/
    types.ts                # TypeScript interfaces
    formatters.ts           # Value formatting utilities
```

## API Routes

The frontend provides these API endpoints that proxy to the Python backend:

- `GET /api/btc-price` — Exchange rates (5-min cache)
- `GET /api/ad-metrics` — Latest ad metrics (1-hour cache)
- `GET /api/cost-of-value` — Latest CoV calculation (5-min cache)

## Design System

- **Background**: `#1e293b` (Midnight)
- **Accent**: `#FF8C00` (Orange)
- **Secondary**: `#5BC0BE` (Teal)
- **Font**: Inter (system fallback)

## Brand

> "Fix the money, fix the world." — GiveAbit

## License

MIT
