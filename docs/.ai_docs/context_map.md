# tadbuy — Agent Context Map

**Phase:** BETA · **Version:** v5.0.6 · **Updated:** 2026-07-07

## Machine Roles

| Machine | Role | Path |
|---------|------|------|
| M3 | Dev (Grok) | `~/projects/tadbuy/` |
| M4 | Server (Kimi/HERMES) | Obsidian — Fedimint, Umbrel, API proxy |

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite + Tailwind v4 + React Router v7 |
| Hosting | Cloudflare Pages (static SPA) |
| API | Express server.ts — M3 dev or M4 proxy (`api.giveabit.io` live ✅) |
| DB (server) | Supabase (`cegzfjbsadwchonpxwmv`) via `supabaseAdmin.ts` |
| DB (client auth) | Firebase (`tadbuy-e3555`) — client SDK only |
| Payments | Lightning (Umbrel), Fedimint ecash, BTC, Nostr Zap |

## Give A Bit Mint (Fedimint)

- **Name:** Give A Bit Mint
- **Domain:** giveabit.io
- **Status:** staged — **blocked** (Fedi 26.6.0 / FM 0.10 incompatible with Guardian 0.11 invite; Andrea `t_8ee7c976`)
- **Shared by:** tadbuy, giveabit, satohash, motopass, openstrata
- **Gateway:** mint.giveabit.io (planned M4)
- **Env:** `VITE_FEDIMINT_INVITE`, `FEDIMINT_GATEWAY_URL`

## Key Routes

| Route | Status |
|-------|--------|
| `/` | live — campaign builder |
| `/geo` | live — Global Reach (100 enhancements, 25 markets) |
| `/marketplace` | live — publisher slot bidding |
| `/beta` | live — BETA status + consumer workflow |
| `/health` | live — system health |
| `/changelog` | live |
| `/compare` | live |
| `/case-studies` | live |
| `/pitch` | live — auto-updating investor deck |
| `/wallet` | beta — API live, Lightning/Fedimint staged |
| `/intelligence` | live UI, beta API |
| `/integrations` | live — ApiExplorer |
| `/enterprise` | live |

## SPA Routing Note
`BrowserRouter` uses `unstable_useTransitions={false}` — required for lazy-loaded routes to render on nav click.

## API Architecture

Cloudflare Pages = **static SPA**. `/api/*` routed via `VITE_API_BASE_URL=https://api.giveabit.io` → M4 PM2 (live ✅).
Local dev: `npm run dev` on M3.

## Geo Page APIs (batch 24)

| Endpoint | Purpose |
|----------|---------|
| GET /api/geo/page/stats | Aggregate stats |
| GET /api/geo/page/insights | Recommendations |
| GET /api/geo/page/trends | Regional trends |
| GET /api/geo/countries | Country list |

## Agent-Automatable Endpoints

| Endpoint | Purpose |
|----------|---------|
| GET /api/agent/manifest | Agent discovery |
| GET /api/beta/status | BETA phase info |
| GET /api/ecosystem/config | Shared mint config |
| POST /api/fedimint/pay | Ecash payment |
| POST /api/agent/campaigns | Create campaign |
| GET /api/metrics | Live metrics |

## Docs for Agents

| Doc | Path |
|-----|------|
| BETA status | docs/BETA.md |
| Geo page | docs/GEO.md |
| Geo 100 manifest | docs/GEO-PAGE-100.md |
| Setup (M3/M4/Fedi/Umbrel) | docs/SETUP-GUIDE.md |
| M4 server ref | docs/M4-SERVER-REF.md |
| Ecosystem | docs/ECOSYSTEM.md |
| Fedimint | docs/FEDIMINT.md |
| Executive | docs/EXECUTIVE.md |
| Handoff | docs/KIMI-HANDOFF.md |
| Source of truth | SOURCE-OF-TRUTH.md |
| **Kimi M4 setup (GitHub)** | `docs/KIMI-M4-SETUP-CHECKLIST.md` |

## Consumer Workflow

1. Browse → 2. Create campaign → 3. Pay (Lightning/Fedimint/BTC) → 4. Live → 5. Analytics

Payment step = **staged** until M4 mint + Umbrel connected.

## External Services

- Cloudflare Pages + Tunnel
- Supabase, Firebase Auth
- blockchain.info (BTC ticker)
- mempool.space (fee estimates)

*Safe Harbour · Part of the [Give A Bit](https://giveabit.io) family.*