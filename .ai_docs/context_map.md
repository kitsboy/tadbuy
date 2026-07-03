# Tadbuy — Context Map

## Directory Structure

```
~projects/tadbuy/
├── server.ts                    # Express API server (~650 lines) — all routes, Vite middleware, Firebase Admin
├── package.json                 # Scripts & dependencies
├── tsconfig.json                # TypeScript config (ES2022, ESNext modules, React JSX)
├── vite.config.ts               # Vite config (React, Tailwind, path alias, chunk splitting)
├── index.html                   # SPA entry HTML
├── docker-compose.yml           # Prod stack: tadbuy-app, postgres, redis, minio
├── firebase-applet-config.json  # Firebase applet config (TODO placeholder)
├── firestore.rules              # Firestore security rules
├── metadata.json                # App metadata for Give A Bit
├── .env.example                 # Environment variable template
│
├── src/                         # React SPA client
│   ├── main.tsx                 # Entry point
│   ├── App.tsx                  # Root component with routes (15KB)
│   ├── firebase.ts              # Firebase client initialization
│   ├── index.css                # Global styles / Tailwind
│   ├── constants.ts             # App constants
│   │
│   ├── components/              # Shared UI components
│   │   ├── AuthProvider.tsx      # Firebase Auth wrapper
│   │   ├── CommandMenu.tsx      # Command palette
│   │   ├── ErrorBoundary.tsx    # React error boundary
│   │   ├── Footer.tsx           # Site footer
│   │   ├── LanguageSwitcher.tsx # i18n language selector
│   │   ├── LiveActivityWidget.tsx
│   │   ├── LocalAvatar.tsx
│   │   ├── NotificationCenter.tsx
│   │   ├── PriceTicker.tsx      # BTC price ticker
│   │   ├── Toast.tsx            # Toast notifications
│   │   ├── WorldMap.tsx         # Geo map visualization (D3)
│   │   ├── ui.tsx               # Generic UI primitives
│   │   └── buyads/              # Buy Ads wizard components
│   │       ├── PaymentModal.tsx
│   │       ├── StepCreative.tsx
│   │       ├── StepPlatformBudget.tsx
│   │       ├── StepReviewPay.tsx
│   │       ├── StepTargeting.tsx
│   │       └── SuccessScreen.tsx
│   │
│   ├── pages/                   # Page components (19 pages)
│   │   ├── ApiReference.tsx
│   │   ├── Bolt12Info.tsx
│   │   ├── BuyAds.tsx           # 84KB — largest page (ad creation wizard)
│   │   ├── CampaignAnalytics.tsx
│   │   ├── Campaigns.tsx        # 30KB — campaign management
│   │   ├── Dashboard.tsx
│   │   ├── DebugLightning.tsx
│   │   ├── Documentation.tsx
│   │   ├── GeoTargeting.tsx
│   │   ├── Hubhash.tsx
│   │   ├── Marketplace.tsx      # 37KB — ad slot marketplace
│   │   ├── Metrics.tsx          # 19KB — analytics dashboard
│   │   ├── NotFound.tsx
│   │   ├── PpqGuide.tsx
│   │   ├── Profile.tsx
│   │   ├── ProfileSettings.tsx
│   │   ├── PublisherPortal.tsx
│   │   ├── Settlements.tsx
│   │   └── Wallet.tsx
│   │
│   ├── lib/                     # Shared libraries
│   │   ├── api/
│   │   │   └── agentAuth.ts     # Agent API key authentication middleware
│   │   ├── db/
│   │   │   ├── firestore.ts     # Client Firestore helpers
│   │   │   ├── firestoreAdmin.ts# Server-side Firestore (Admin SDK) with repository pattern
│   │   │   └── types.ts         # Campaign type definitions (incl. 20-point roadmap fields)
│   │   ├── errorHandling.ts     # Error handling utilities
│   │   ├── i18n.ts              # i18next configuration
│   │   ├── sentry.ts            # Sentry client setup
│   │   └── utils.ts             # Misc utilities
│   │
│   ├── services/                # Business logic services
│   │   ├── lightningService.ts  # LND gRPC via ln-service (get info, create invoice, pay)
│   │   └── geminiService.ts     # Google Gemini AI integration
│   │
│   ├── locales/                 # i18n translations
│   │   ├── en.json, es.json, fr.json, de.json
│   │   ├── pt.json, ja.json, ar.json, zh.json
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── useLocalStorage.ts
│   │   └── usePageTitle.ts
│   │
│   └── data/                    # Sample/seed data
│       └── campaigns.ts
│
├── public/                      # Static assets
│   ├── _headers                 # Cloudflare headers config
│   ├── _redirects               # Cloudflare redirects
│   ├── favicon.png / .svg
│   ├── giveabit.png
│   ├── manifest.json            # PWA manifest
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── sw.js                    # Service worker
│   └── tadbuy.js               # Legacy script
│
├── LightningPay/                # Android Lightning wallet app (Kotlin, Jetpack Compose)
│   └── README.md                # Full reference implementation
│
├── dist/                        # Production build output
├── archive/                     # Archived files
├── docs/                        # Additional documentation
│
├── .env.example                 # Environment template
├── .gitignore
├── .claude/                     # Claude AI configuration
├── AGENTS.md
├── CHANGELOG.md
├── CONTRIBUTING.md
├── EXEC-SUMMARY.md              # Executive summary template
├── GROK-SESSION-PROTOCOL.md
├── KIMI-HANDOFF-tadbuy-2026-06-05.md
├── MARKETING-ONELINER.md
├── NOTES.md
├── README.md
├── SETUP-REMINDERS-FOR-FUTURE-GOOSE.txt
├── SOURCE-OF-TRUTH.md
├── TECHNICAL_DOCUMENTATION.md
├── replace.cjs
├── tadbuy-dashboard.html
├── tadbuy-dashboard-enterprise.html
├── tadbuy.code-workspace
└── zapcampaign/                 # Zap campaign data
```

---

## Dependencies Table

### Runtime Dependencies

| Package | Version | Purpose |
|---|---|---|
| `express` | ^4.21.2 | Web server framework |
| `express-session` | ^1.19.0 | Session management |
| `express-rate-limit` | ^8.3.1 | Rate limiting |
| `cookie-parser` | ^1.4.7 | Cookie parsing |
| `firebase` | ^12.12.0 | Firebase client SDK (auth, firestore) |
| `firebase-admin` | ^13.8.0 | Firebase admin SDK (server-side) |
| `ln-service` | ^58.0.2 | LND gRPC client for Lightning Network |
| `@google/genai` | ^1.29.0 | Google Gemini AI API |
| `react` | ^19.0.0 | UI framework |
| `react-dom` | ^19.0.0 | React DOM renderer |
| `react-router-dom` | ^7.13.1 | Client-side routing |
| `vite` | ^6.2.0 | Build tool & dev server |
| `@vitejs/plugin-react` | ^5.0.4 | React Vite plugin |
| `@tailwindcss/vite` | ^4.1.14 | Tailwind CSS Vite plugin |
| `tailwindcss` | ^4.1.14 | Utility CSS framework |
| `recharts` | ^3.8.0 | Chart library |
| `d3` | ^7.9.0 | Data visualization |
| `i18next` | ^23.0.0 | Internationalization |
| `react-i18next` | ^14.0.0 | React i18n bindings |
| `jspdf` | ^4.2.1 | PDF generation |
| `jspdf-autotable` | ^5.0.7 | PDF table plugin |
| `qrcode.react` | ^4.2.0 | QR code component |
| `lucide-react` | ^0.546.0 | Icon library |
| `motion` | ^12.23.24 | Animation library (framer-motion successor) |
| `clsx` | ^2.1.1 | Class name utility |
| `tailwind-merge` | ^3.5.0 | Tailwind class merging |
| `@sentry/react` | ^10.48.0 | Error tracking (client) |
| `@sentry/node` | ^10.48.0 | Error tracking (server) |
| `joi` | ^18.0.2 | Request validation |
| `dotenv` | ^17.2.3 | Environment variable loading |
| `date-fns` | ^4.1.0 | Date utilities |
| `@fontsource/inter` | ^5.2.8 | Inter font |
| `@fontsource/jetbrains-mono` | ^5.2.8 | JetBrains Mono font |

### Dev Dependencies

| Package | Version | Purpose |
|---|---|---|
| `typescript` | ~5.8.2 | TypeScript compiler |
| `tsx` | ^4.21.0 | TypeScript execution (dev server runner) |
| `@types/express` | ^4.17.21 | Express type definitions |
| `@types/node` | ^22.14.0 | Node.js type definitions |
| `@types/d3` | ^7.4.3 | D3 type definitions |
| `@types/jspdf` | ^1.3.3 | jsPDF type definitions |
| `autoprefixer` | ^10.4.21 | CSS vendor prefixes |

---

## Port Information

| Service | Port | Description |
|---|---|---|
| Express server | **3000** (default) | Main app — API + SPA serving |
| Vite HMR | 24679 (optional) | Hot module replacement via VITE_HMR_PORT |
| Postgres (docker) | 5432 | Database (provisioned but currently unused) |
| Redis (docker) | 6379 | Cache (provisioned but currently unused) |
| MinIO API (docker) | 9000 | S3 storage (provisioned but currently unused) |
| MinIO Console (docker) | 9001 | MinIO admin UI |

---

## Environment Variables

Refer to `.env.example` for the full template. Key groups:

### Client-side (VITE_* → exposed in browser)
- `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`
- `VITE_FIRESTORE_DATABASE_ID`

### Server-side (never exposed)
- `FIREBASE_SERVICE_ACCOUNT_KEY` — JSON service account
- `SESSION_SECRET` — Session signing (required in production)
- `GEMINI_API_KEY` — Gemini AI API key
- `UMBREL_LND_CERT`, `UMBREL_LND_MACAROON`, `UMBREL_LND_SOCKET` — LND gRPC credentials
- `SENTRY_DSN` — Sentry error tracking
- `AGENT_API_KEYS` — JSON map of agent API keys
- `NODE_ENV` — Development/production mode
- `HOST` — Bind address (default: 127.0.0.1)

---

## Express API Routes (Detailed)

### Admin
- `POST /api/admin/backup` — Full Firestore backup (auth: admin agent key)

### Campaigns
- `GET /api/campaigns` — List all campaigns
- `POST /api/campaigns` — Create campaign (validates via Joi schema)

### Metrics & Analytics
- `GET /api/metrics` — Aggregated campaign metrics (real data from Firestore with fallback defaults)

### Lightning Network
- `GET /api/lightning/info` — LND node wallet info
- `POST /api/lightning/invoice` — Create BOLT11 invoice
- `GET /api/lightning/check/:id` — Check invoice status
- `POST /api/lightning/offer` — Create BOLT12 offer
- `POST /api/webhooks/lightning` — LND payment webhook → auto-activates campaigns

### Blockchain
- `GET /api/blockchain/info` — Bitcoin blockchain info

### Settlements
- `GET /api/settlements` — List settlements
- `POST /api/settle` — Settle payment (rate-limited)

### Marketplace
- `POST /api/marketplace/bid` — Place ad slot bid

### Publisher
- `POST /api/publisher/settings` — Save publisher Lightning address

### AI
- `POST /api/ai/optimize` — Generate ad creative via Gemini API (server-side proxy)

### Agent API (v1 — Nostr agents)
- `POST /api/v1/retargeting/track` — Retargeting pixel
- `POST /api/v1/conversions` — Conversion tracking
- `POST /api/v1/ads/view` — Ad view tracking
- `POST /api/v1/analytics/heatmap` — Heatmap data
- `POST /api/v1/lightning/split` — Split payment (auth: admin)
- `POST /api/v1/lightning/jit-channel` — JIT channel (auth: admin)
- `POST /api/v1/fiat/onramp` — Fiat onramp
- `POST /api/v1/fraud/audit` — Fraud check

### Documentation
- `GET /api/docs/pdf` — Generate documentation PDF via jsPDF

---

## Lightning Network Integration

- **Library:** `ln-service` (Node.js LND gRPC client)
- **Credentials:** Base64-encoded TLS cert + macaroon, socket host:port from Umbrel
- **Service file:** `src/services/lightningService.ts`
- **Functions:**
  - `getLightningNodeInfo()` — Connect and verify LND node
  - `createLightningInvoice(tokens, description)` — 1hr expiry
  - `executeLightningPayment(destination, tokens)` — Pay BOLT11 invoice
- **Client-side wallet:** Lightning wallet page (`Wallet.tsx`)
- **Android companion:** `LightningPay/` — Kotlin Android app with Jetpack Compose for accepting Lightning payments

---

## Internationalization

- **Library:** i18next + react-i18next
- **Setup:** `src/lib/i18n.ts` — detects browser locale, configures fallback (English)
- **Resources:** JSON files in `src/locales/` (8 languages)
- **Language switcher:** `LanguageSwitcher.tsx` component
- **Storage:** Selected language persisted in `useLocalStorage`

---

## Firebase Data Model

**Campaign** (Firestore collection, via `src/lib/db/types.ts`):

| Field | Type | Description |
|---|---|---|
| `id` | string | Auto-generated document ID |
| `name` | string | Campaign name |
| `budgetSats` | number | Budget in satoshis |
| `status` | enum | draft / live / paused / completed |
| `createdAt` | string (ISO date) | Creation timestamp |
| `headline`, `description` | string | Ad creative text |
| `url`, `targetUrl` | string | Ad URLs |
| `impressions`, `clicks` | number | Performance metrics |
| `spendBtc`, `spendUsd` | number | Spend tracking |
| `platforms` | string[] | Target platforms |
| `biddingStrategy` | enum | maximize_clicks / target_cpa / manual |
| `targetCpa` | number | Target CPA in sats |
| `frequencyCapPer24h` | number | Frequency capping |
| `splitPayments` | array[] | Split payment config |
| `auditLogs` | array[] | Audit trail |

**Repository:** `AdminFirestoreCampaignRepository` in `src/lib/db/firestoreAdmin.ts`
**Client accesses:** Via Firestore SDK directly in `src/lib/db/firestore.ts`
