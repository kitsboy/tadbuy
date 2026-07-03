# Tadbuy — SOP & Workflow

## Overview

Tadbuy is a Bitcoin-native advertising platform (DSP) — full-stack app with a React SPA client, Express server, Firebase backend, and Lightning Network payment integration. The Express server serves the SPA using Vite middleware in dev or static files in production.

**Domain:** tadbuy.giveabit.io  
**Port:** 3000 (default, configurable via `PORT` env)  
**Stack:** React 19 + Vite 6 + TypeScript + Tailwind CSS 4 (client) / Express + TypeScript (server) / Firebase Auth + Firestore / Lightning Network (ln-service + LND via Umbrel)

---

## 1. Prerequisites

- Node.js 20+
- npm
- Firebase project (Auth + Firestore)
- LND node (for Lightning payments; optional in dev/simulation)
- (Optional) Docker + Docker Compose (for full infra: Postgres, Redis, MinIO)

---

## 2. Installation

```bash
cd ~/projects/tadbuy
npm install
```

Install creates `node_modules/` from `package-lock.json`. No build step needed before dev.

---

## 3. Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Required env vars (see `.env.example` for full details):

| Variable | Purpose |
|---|---|
| `VITE_FIREBASE_*` | Client-side Firebase config (6 vars) — safe to expose |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | Server-side Firebase Admin JSON — **keep secret** |
| `SESSION_SECRET` | Required in production — crypto random hex |
| `GEMINI_API_KEY` | Google Gemini AI key for ad optimization |
| `UMBREL_LND_CERT/MACAROON/SOCKET` | LND gRPC credentials for Lightning Network |
| `SENTRY_DSN` | Error tracking (optional) |
| `AGENT_API_KEYS` | JSON map of API keys to roles for agent access |

---

## 4. Development Workflow

### Start Dev Server

```bash
npm run dev
```

This runs `tsx server.ts`, which:
1. Starts the Express API server on port 3000
2. Injects Vite dev middleware (HMR, React refresh)
3. The SPA is served at `http://127.0.0.1:3000`

The Vite config (`vite.config.ts`) has:
- `@` path alias → `./src`
- `tailwindcss` plugin
- Manual chunk splitting for React, Firebase, charts, i18n, PDF, QR

### File Structure

```
~projects/tadbuy/
├── server.ts            # Express API server (all routes, middleware)
├── src/                 # React SPA client
│   ├── App.tsx          # Root component with routing
│   ├── main.tsx         # Entry point
│   ├── firebase.ts      # Firebase client init
│   ├── components/      # Shared UI components
│   ├── pages/           # Page components (19 pages)
│   ├── lib/             # API client, DB, i18n, error handling
│   ├── services/        # lightningService.ts, geminiService.ts
│   ├── locales/         # i18n translations (7 languages)
│   ├── hooks/           # Custom React hooks
│   ├── data/            # Sample campaign data
│   └── constants.ts     # App constants
├── public/              # Static assets, manifest, service worker
├── LightningPay/        # Android app reference (Kotlin, Jetpack Compose)
├── dist/                # Production build output
├── vite.config.ts
├── tsconfig.json
└── docker-compose.yml   # Prod-like stack (Postgres, Redis, MinIO)
```

---

## 5. Building for Production

```bash
npm run build
```

This runs `vite build`, outputting the production SPA to `dist/`.

Other scripts:

| Command | Action |
|---|---|
| `npm run dev` / `npm start` | Run Express server with Vite middleware |
| `npm run build` | Vite production build → `dist/` |
| `npm run preview` | Vite preview of built SPA |
| `npm run clean` | Remove `dist/` |
| `npm run lint` | TypeScript type-check (`tsc --noEmit`) |

---

## 6. Production Deployment

### Docker Deployment

The project includes `docker-compose.yml` with:
- **tadbuy-app** — the Express + React app (port 3000)
- **db** — Postgres 15 (port 5432)
- **redis** — Redis 7 (port 6379)
- **minio** — S3-compatible storage (ports 9000, 9001)

Note: The app uses Firestore as its primary database. Postgres/Redis/MinIO are provisioned in docker-compose but the app currently connects to Firebase — these may be used for future features.

```bash
docker compose up -d
```

### Cloudflare Pages / Static Hosting

The SPA can also be deployed as a static site (the `dist/` folder) to Cloudflare Pages. The Express server would need to run separately for API routes.

### Environment Guards

- Server fails to start in production without `SESSION_SECRET`
- Firebase Admin init warns without `FIREBASE_SERVICE_ACCOUNT_KEY`

---

## 7. Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** (at least email/password or Google sign-in)
3. Enable **Firestore Database** (start in test mode, then apply `firestore.rules`)
4. Create a **Web App** in Firebase Console → get the config values for `VITE_FIREBASE_*`
5. Generate a **Service Account Key**: Project Settings → Service Accounts → Generate new private key
6. Apply `firestore.rules` for security rules

Firebase config files:
- `src/firebase.ts` — Client SDK initialization
- `firebase-applet-config.json` — Firebase applet config (TODO placeholders)
- `firestore.rules` — Firestore security rules

---

## 8. Lightning Network Integration

The app connects to an LND node (typically on Umbrel) via gRPC:

- **Service:** `src/services/lightningService.ts`
- **Library:** `ln-service` (Node.js LND client)
- **Routes in server.ts:**
  - `GET /api/lightning/info` — Node info
  - `POST /api/lightning/invoice` — Create invoice
  - `GET /api/lightning/check/:id` — Check invoice status
  - `POST /api/lightning/offer` — BOLT12 offer
  - `POST /api/webhooks/lightning` — Payment webhook

The `LightningPay/` directory contains a reference Android app (Kotlin + Jetpack Compose) for accepting Lightning payments on mobile.

---

## 9. Express API Routes

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/admin/backup` | admin | Firestore backup |
| GET | `/api/metrics` | none | Aggregate metrics |
| GET | `/api/settlements` | none | Settlement info |
| POST | `/api/campaigns` | none | Create campaign |
| GET | `/api/campaigns` | none | List campaigns |
| GET | `/api/docs/pdf` | none | Generate PDF docs |
| GET | `/api/lightning/info` | none | LND node info |
| POST | `/api/lightning/invoice` | none | Create lightning invoice |
| GET | `/api/lightning/check/:id` | none | Check invoice |
| POST | `/api/lightning/offer` | none | BOLT12 offer |
| POST | `/api/webhooks/lightning` | none | LND webhook |
| GET | `/api/blockchain/info` | none | Blockchain info |
| POST | `/api/settle` | rate-limited | Settle payment |
| POST | `/api/marketplace/bid` | none | Place bid |
| POST | `/api/publisher/settings` | none | Publisher settings |
| POST | `/api/ai/optimize` | none | AI ad optimization (Gemini) |
| POST | `/api/v1/*` | varies | Analytics/tracking endpoints |

---

## 10. Internationalization

Supported locales (in `src/locales/`):
- English (`en.json`), Spanish (`es.json`), French (`fr.json`), German (`de.json`), Portuguese (`pt.json`), Japanese (`ja.json`), Arabic (`ar.json`), Chinese (`zh.json`)

Uses `i18next` + `react-i18next`.

---

## 11. Key Pages

| Route | Component | Description |
|---|---|---|
| `/` (or `/campaigns`) | Campaigns.tsx | Campaign management |
| `/dashboard` | Dashboard.tsx | Main dashboard |
| `/metrics` | Metrics.tsx | Analytics & metrics |
| `/marketplace` | Marketplace.tsx | Ad slot marketplace |
| `/buy-ads` | BuyAds.tsx | Ad creation wizard (4-step) |
| `/wallet` | Wallet.tsx | Lightning wallet |
| `/publisher` | PublisherPortal.tsx | Publisher portal |
| `/settlements` | Settlements.tsx | Payment settlements |
| `/profile` | Profile.tsx | User profile |
| `/settings` | ProfileSettings.tsx | Settings |
| `/api-docs` | ApiReference.tsx | API docs |
| `/geo` | GeoTargeting.tsx | Geo page |
| `/bolt12` | Bolt12Info.tsx | BOLT12 info |
| `/ppq-guide` | PpqGuide.tsx | PPQ guide |
| `/hubhash` | Hubhash.tsx | Hubhash info |
| `/debug-lightning` | DebugLightning.tsx | LN debug |
| `/documentation` | Documentation.tsx | App docs |

---

## 12. Error Handling & Monitoring

- **Sentry:** Integrated via `@sentry/node` (server) and `@sentry/react` (client), gated on `SENTRY_DSN`
- **Rate Limiting:** `express-rate-limit` — general (100 req/15min) and strict (20 req/15min)
- **Validation:** Joi schemas on POST endpoints
- **Centralized error middleware** at the bottom of server.ts
