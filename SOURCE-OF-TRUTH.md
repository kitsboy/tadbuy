# SOURCE-OF-TRUTH.md — Tadbuy (Give A Bit Project)

**Last Updated**: 2026-07-13

## Project Overview (Marketing Pitch)
Tadbuy is a Bitcoin-native advertising platform (DSP). Advertisers buy ads on Twitter/X, Facebook, Instagram, YouTube, Reddit, LinkedIn, TikTok, and Nostr. Pay in Bitcoin via Lightning, Fedimint ecash, BOLT12, on-chain, or Nostr Zaps. Features: campaign builder, **Global Reach geo dashboard** (`/geo`), geospatial targeting, AI creative (Gemini), PPQ.AI, publisher portal, analytics, wallet, settlements, 8 languages, Agent API. Part of Give A Bit (giveabit.io).

## GitHub (Code Source of Truth)
- Repo: https://github.com/kitsboy/tadbuy.git
- Branch: main (production)
- Version: **v5.0.17** (BETA — CDN deploy incident fixed 2026-07-13)
- M3 workspace: `~/projects/tadbuy/`
- Last commit: `f429f8a` (CDN cache fix + goodbye handoff)

## Deployment Details
- **Live URL**: https://tadbuy.giveabit.io/
- **Geo Reach**: https://tadbuy.giveabit.io/geo
- **Platform**: Cloudflare Pages (static SPA)
  - Build: `npm run build` → `dist/` (runs `sync-docs` via prebuild)
  - Node 20, auto-deploy on push to `main`
- **API proxy**: `api.giveabit.io` → Cloudflare Tunnel → M4 process (ops/env on M4; **no working git pull on M4**) ✅
- **Supabase**: Project `cegzfjbsadwchonpxwmv` — **server DB** via service_role (canonical data store)
- **Auth**: SPA still has **legacy Firebase Auth** client (`VITE_FIREBASE_*`) — intent is **Supabase Auth**; migration TODO on M3. Do not treat Firebase Admin as the server stack.
- **Local dev**: `npm run dev` or `npm start` on **M3 only**

## Recent M3 Work (2026-07-06)
- [x] Router fix — URL changes now update page content (`unstable_useTransitions={false}`)
- [x] Header/nav click fixes (More menu backdrop, Search command palette)
- [x] **/geo page — 100 enhancements** (batch 24): map, 25 markets, insights, export
- [x] Buy Ads `?geo=CODE` handoff from geo page
- [x] Batches 15–23 (85 enhancements): health, analytics, marketplace, mobile polish
- [x] Auto version bump on push (pre-push hook)

## Platform Split

| Machine | Role | Do | Don't |
|---------|------|-----|-------|
| **M3** | Dev (Grok) | Code, git, docs, CF deploy | Install Fedimint/Umbrel; touch M4 vault |
| **M4** | Server (Kimi) | REF docs, env vault, API/Fedimint/Umbrel ops | **Never git pull/clone working app tree**; no app development |

## M4 Setup (Kimi — HERMES)

Phased checklist (API proxy → Fedimint mint → Umbrel LND):

| Copy | Location |
|------|----------|
| GitHub (Grok maintains) | [docs/KIMI-M4-SETUP-CHECKLIST.md](./docs/KIMI-M4-SETUP-CHECKLIST.md) |
| Obsidian (Kimi maintains) | `MASTER-BRAIN/Obsidian/03-Projects/M3/Tadbuy/M4-SETUP-CHECKLIST.md` |

**Status:** Phase 1 COMPLETE ✅ (verified by Kimi). Phases 2 & 3 **parked** on external blockers — see Kanban below.

Also: [docs/M4-SERVER-REF.md](./docs/M4-SERVER-REF.md) · [docs/SETUP-GUIDE.md](./docs/SETUP-GUIDE.md) · [/beta](https://tadbuy.giveabit.io/beta)

## Agent Docs (.ai_docs)

For automated agents (Grok, Kimi, Qwen):

| File | Purpose |
|------|---------|
| `docs/.ai_docs/context_map.md` | Stack, routes, M3/M4 roles, Fedimint |
| `docs/.ai_docs/sop_workflow.md` | Dev, deploy, payment SOPs |
| `docs/.ai_docs/dashboard_manifest.json` | Endpoints, pages, kimi_checklist path |
| `GET /api/agent/manifest` | Runtime discovery (when API online) |

## Enhancement Manifests
| Doc | Scope |
|-----|-------|
| [docs/ENHANCEMENTS-V5.md](./docs/ENHANCEMENTS-V5.md) | Batches 7–14 (200 items) |
| [docs/ENHANCEMENTS-85.md](./docs/ENHANCEMENTS-85.md) | Batches 15–23 (85 items) |
| [docs/GEO-PAGE-100.md](./docs/GEO-PAGE-100.md) | Batch 24 — /geo page only |

## Give A Bit Mint (Fedimint)

- **Name:** Give A Bit Mint · **Domain:** giveabit.io
- **Status:** staged — **blocked** (see Phase 2 blocker)
- **Shared by:** tadbuy, giveabit, satohash, motopass, openstrata
- **Config:** `src/data/ecosystemConfig.ts`

## Phase Blockers (Kanban — high priority)

| Phase | Blocker | Assignee | Task ID |
|-------|---------|----------|---------|
| 2 — Fedimint Mint | Fedi app 26.6.0 ships Fedimint **0.10.0**. Guardian **0.11.0** needed for single-guardian mode. Invite format incompatible until Fedi updates. | Andrea | `t_8ee7c976` |
| 3 — Umbrel LND | Umbrel offline **93 days**. Node must sync before LND env vars. | Rosa | `t_46208fbe` |
| 4 — Multi-app | Propagate `VITE_API_BASE_URL` + Fedimint invite to all 5 CF Pages projects | Andrea | `t_ec77b1e5` |

**Cam (Fedi phone):** Keep app installed; do not join a federation until Andrea's task clears and Kimi issues `fm-invite://`.

## Key Files
- `src/` — React 19 + Vite + TypeScript
- `src/pages/GeoTargeting.tsx` — Global Reach page
- `src/data/geoMarkets.ts` — 25-country geo dataset
- `server.ts` + `server/routes/` — Express API (batch1–batch24)
- `scripts/sync-docs.ts` — Auto-syncs docs on build
- `docs/KIMI-HANDOFF.md` — Cross-agent handoff log

## Recent M3 Work (2026-07-13)
- [x] Central `src/data/platforms.ts` — billing, payout, CPM for all 8 platforms
- [x] `/platforms` hub + `/platforms/:slug` landing pages
- [x] `PageShell`, `FeeBreakdown`, `PlatformWeightAllocator` — site uniformity
- [x] BuyAds: budget allocator (even / custom / PPQ), fee breakdown, platform handoff
- [x] Campaign status PATCH API + CSV/Sheets export
- [x] Server stub `demo: true` flags; Supabase client scaffold for auth migration
- [x] Playwright installed; Compare/Integrations/Wallet/Settlements/PPQ/docs updated

## Gaps / Next
- [x] M4 Phase 1: API proxy live (`api.giveabit.io`)
- [x] /geo page — 100 enhancements
- [x] SPA routing fix
- [ ] M4 Phase 2: Fedimint mint — **blocked** (Fedi 0.10 vs Guardian 0.11, Andrea `t_8ee7c976`)
- [ ] M4 Phase 3: Umbrel LND — **blocked** (node offline 93d, Rosa `t_46208fbe`)
- [ ] Automated E2E tests (Playwright stub ready)
- [ ] **Cam priority (soon):** Fedi/Fedimint on all 5 apps + **every future Give A Bit app** — one mint, one invite
- [ ] Propagate `VITE_FEDIMINT_INVITE` + `VITE_API_BASE_URL` to sibling CF Pages (Andrea `t_ec77b1e5`)

## How to Start (M3)
```bash
cd ~/projects/tadbuy && npm install && npm run dev
```

**This file is the M3 code source of truth.** Obsidian on M4 is the server/ops source of truth for Kimi.

*Safe Harbour · Part of the [Give A Bit](https://giveabit.io) family.*


## Diligence Pack (partner + technical disclosure)
**Self-evolving.** Canonical path in-repo:
- `docs/diligence/README.md` — index
- `docs/diligence/INVESTOR-ONEPAGER.md`
- `docs/diligence/ARCHITECTURE-ONEPAGER.md`
- `docs/diligence/ASK-SHEET.md`
- Portfolio: `giveabit` → `docs/diligence/PORTFOLIO-FAMILY-OF-8.md`

Update rule: material product changes update diligence in the same change-set.
Last pack generation: 2026-07-13
