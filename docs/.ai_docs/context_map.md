# tadbuy — Agent Context Map

**Phase:** BETA · **Version:** v4.4.0-ELITE · **Updated:** auto-sync on build

## Machine Roles

| Machine | Role | Path |
|---------|------|------|
| M3 | Dev (Grok) | `~/projects/tadbuy/` |
| M4 | Server (Kimi/HERMES) | Obsidian — Fedimint, Umbrel, API proxy |

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite + Tailwind v4 |
| Hosting | Cloudflare Pages (static SPA) |
| API | Express server.ts — M3 dev or M4 proxy (`api.giveabit.io` live ✅) |
| DB (server) | Supabase (`cegzfjbsadwchonpxwmv`) via `supabaseAdmin.ts` |
| DB (client auth) | Firebase (`tadbuy-e3555`) — client SDK only |
| Payments | Lightning (Umbrel), Fedimint ecash, BTC, Nostr Zap |

## Give A Bit Mint (Fedimint)

- **Name:** Give A Bit Mint
- **Domain:** giveabit.io
- **Status:** staged (M4 not live yet)
- **Shared by:** tadbuy, giveabit, satohash, motopass, openstrata
- **Gateway:** mint.giveabit.io (planned M4)
- **Env:** `VITE_FEDIMINT_INVITE`, `FEDIMINT_GATEWAY_URL`

## Key Routes

| Route | Status |
|-------|--------|
| `/` | live — campaign builder |
| `/beta` | live — BETA status + consumer workflow |
| `/pitch` | live — auto-updating investor deck |
| `/wallet` | beta — API live, Lightning/Fedimint staged |
| `/intelligence` | live UI, beta API |
| `/integrations` | live — ApiExplorer |
| `/enterprise` | live |

## API Architecture

Cloudflare Pages = **static SPA**. `/api/*` routed via `VITE_API_BASE_URL=https://api.giveabit.io` → M4 PM2 (live ✅).
Local dev: `npm run dev` on M3.

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
| Setup (M3/M4/Fedi/Umbrel) | docs/SETUP-GUIDE.md |
| M4 server ref | docs/M4-SERVER-REF.md |
| Ecosystem | docs/ECOSYSTEM.md |
| Fedimint | docs/FEDIMINT.md |
| Executive | docs/EXECUTIVE.md |
| Handoff | docs/KIMI-HANDOFF.md |
| **Kimi M4 setup (GitHub)** | `docs/KIMI-M4-SETUP-CHECKLIST.md` |
| **Kimi M4 setup (Obsidian)** | `MASTER-BRAIN/Obsidian/03-Projects/M3/Tadbuy/M4-SETUP-CHECKLIST.md` |

## Consumer Workflow

1. Browse → 2. Create campaign → 3. Pay (Lightning/Fedimint/BTC) → 4. Live → 5. Analytics

Payment step = **staged** until M4 mint + Umbrel connected.

## External Services

| Service | Status | Machine |
|---------|--------|---------|
| API proxy | live | M4 (`api.giveabit.io`) |
| Fedimint mint | staged | M4 (Phase 2) |
| Umbrel LND | not_ready | M4 (Phase 3) |
| Fedi wallet | user phone | — |
| Firebase | live | cloud |
| Cloudflare Pages | live | cloud |