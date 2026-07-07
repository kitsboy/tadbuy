# Tadbuy Technical Documentation

**Version:** v5.0.6 · **Last updated:** 2026-07-07

## Overview
Tadbuy is a Bitcoin-native demand-side platform (DSP). Advertisers launch cross-platform campaigns and pay via Lightning, Fedimint ecash, BOLT12, on-chain BTC, or Nostr Zaps. The **Global Reach** page (`/geo`) provides geospatial market intelligence across 25 countries.

## Tech Stack
- **Frontend:** React 19, Vite, Tailwind v4, React Router v7, Motion, Lucide React, D3 (world map)
- **Backend:** Node.js, Express, TypeScript (`server.ts` + `server/routes/`)
- **Database:** Supabase (server-side via `supabaseAdmin.ts`); Firebase Auth (client SDK only)
- **Payments:** Lightning (Umbrel LND), Fedimint ecash, BOLT12, on-chain, Nostr Zap
- **AI/ML:** Gemini API, PPQ.AI (edge-based federated learning)
- **Infrastructure:** Cloudflare Pages (static SPA) + M4 API proxy at `api.giveabit.io`

## Core Architecture
- **Repository Pattern:** Decouples business logic from database implementation for swappability.
- **Serverless API:** Express-based backend for handling sensitive operations (payments, API key management).
- **Edge AI:** PPQ.AI runs quantized models on publisher nodes to ensure user privacy.

## Implementation Status (BETA v5.0.6)
| Area | Status |
|------|--------|
| Campaign builder UI | ✅ Live |
| Global Reach `/geo` | ✅ Live (batch 24 — 100 enhancements) |
| Marketplace auctions | ✅ Live UI |
| Publisher portal | ✅ Live UI |
| API proxy (M4) | ✅ Live at api.giveabit.io |
| Fedimint payments | ⏳ Staged — Fedi 0.10 blocker |
| Umbrel Lightning | ⏳ Staged — node offline |
| Real payments | 🔶 Demo mode |
| Sentry monitoring | ✅ Integrated |
| Docs auto-sync | ✅ `npm run sync-docs` on build |

535+ enhancements shipped across batches 1–24. See `docs/ENHANCEMENTS-V5.md`, `docs/ENHANCEMENTS-85.md`, `docs/GEO-PAGE-100.md`.

## Agent API (For AI Agents)
The Tadbuy platform provides a secure API for AI agents (e.g., Nostr agents) to interact with the platform.
- **Authentication**: Requires `x-agent-api-key` header with a valid API key.
- **Base URL**: `/api/agent`
- **Endpoints**:
  - `POST /api/agent/campaigns`: Create a campaign.
  - `GET /api/agent/metrics`: Fetch real-time performance metrics.
  - `POST /api/agent/topup`: Trigger a Lightning payment to top up a campaign.

### Targeting Capabilities
The platform supports granular targeting, including:
- Interest-based targeting
- Age range
- Sex (All, Male, Female)
- Geographic (Country/State/City)
- Language
- Device/Network
- Socio-economic (Education, Income, Behaviors, Industries)

### Future Path: Agent Admin Control
To grant an agent (e.g., `kimi@giveabit.io`) administrative control, we will:
1. Update `AGENT_API_KEYS` environment variable to a JSON object mapping keys to roles: `{"key": "admin"}`.
2. Use `agentAuthMiddleware('admin')` in the router for privileged endpoints.
3. Implement new `/api/admin` routes for site-wide management.

## Hardening Improvements
To ensure platform security and reliability, the following hardening measures have been implemented:
- **Input Validation**: All API endpoints now use `Joi` schema validation to prevent malformed data and injection attacks.
- **Centralized Error Handling**: A global error handling middleware has been implemented to capture and log errors, preventing sensitive information leakage.
- **Role-Based Access Control (RBAC)**: The Agent API now supports role-based access, allowing us to distinguish between `agent` and `admin` roles.
- **SPA Routing**: `BrowserRouter` uses `unstable_useTransitions={false}` so lazy-loaded routes render on navigation without manual refresh.
- **Atomic Transactions**: Critical database operations use atomic transactions to guarantee data consistency.
- **Real-Time Metrics**: The dashboard now implements polling (every 5 seconds) to fetch and display real-time ad performance metrics from the backend.
- **Centralized Error Logging**: A new `/api/logs` endpoint allows client-side errors to be captured and logged on the server, facilitating easier debugging and future integration with Sentry.
