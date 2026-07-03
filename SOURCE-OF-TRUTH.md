# SOURCE-OF-TRUTH.md — Tadbuy (Give A Bit Project)

**Last Updated**: 2026-07-03

## Project Overview (Marketing Pitch)
Tadbuy is a Bitcoin-native advertising platform (DSP). Advertisers buy ads on Twitter/X, Facebook, Instagram, YouTube, Reddit, LinkedIn, TikTok, and Nostr. Pay in Bitcoin via Lightning, Fedimint ecash, BOLT12, on-chain, or Nostr Zaps. Features: campaign builder, geospatial targeting, AI creative (Gemini), PPQ.AI, publisher portal, analytics, wallet, settlements, 8 languages, Agent API. Part of Give A Bit (giveabit.io).

## GitHub (Code Source of Truth)
- Repo: https://github.com/kitsboy/tadbuy.git
- Branch: main (production)
- Version: **v4.4.0-ELITE** (BETA phase)
- M3 workspace: `~/projects/tadbuy/`

## Deployment Details
- **Live URL**: https://tadbuy.giveabit.io/
- **Platform**: Cloudflare Pages (static SPA)
  - Build: `npm run build` → `dist/`
  - Node 20, auto-deploy on push to `main`
- **API proxy**: M4 HERMES → `localhost:3000` (PM2 `tadbuy-api`) → Tailscale Funnel → `api.giveabit.io`
- **Supabase**: Project `cegzfjbsadwchonpxwmv` (server-side DB via service_role)
- **Firebase**: Project ID `tadbuy-e3555` (client auth only — VITE_FIREBASE_*)
- **Local dev**: `npm run dev` or `npm start` on M3

## Platform Split

| Machine | Role | Do | Don't |
|---------|------|-----|-------|
| **M3** | Dev (Grok) | Code, git, docs, CF deploy | Install Fedimint/Umbrel |
| **M4** | Server (Kimi) | API proxy, Fedimint mint, Umbrel | Clone repo for development |

## M4 Setup (Kimi — HERMES)

Phased checklist (API proxy → Fedimint mint → Umbrel LND):

| Copy | Location |
|------|----------|
| GitHub (Grok maintains) | [docs/KIMI-M4-SETUP-CHECKLIST.md](./docs/KIMI-M4-SETUP-CHECKLIST.md) |
| Obsidian (Kimi maintains) | `MASTER-BRAIN/Obsidian/03-Projects/M3/Tadbuy/M4-SETUP-CHECKLIST.md` |

**Status:** M4 API deployed ✅ (PM2 `tadbuy-api` on :3000). Cam: run `supabase-schema.sql` + enable Tailscale Funnel. Grok: Supabase swap pushed to main.

Also: [docs/M4-SERVER-REF.md](./docs/M4-SERVER-REF.md) · [docs/SETUP-GUIDE.md](./docs/SETUP-GUIDE.md) · [/beta](https://tadbuy.giveabit.io/beta)

## Agent Docs (.ai_docs)

For automated agents (Grok, Kimi, Qwen):

| File | Purpose |
|------|---------|
| `docs/.ai_docs/context_map.md` | Stack, routes, M3/M4 roles, Fedimint |
| `docs/.ai_docs/sop_workflow.md` | Dev, deploy, payment SOPs |
| `docs/.ai_docs/dashboard_manifest.json` | Endpoints, pages, kimi_checklist path |
| `GET /api/agent/manifest` | Runtime discovery (when API online) |

## Give A Bit Mint (Fedimint)

- **Name:** Give A Bit Mint · **Domain:** giveabit.io
- **Status:** staged (M4 not live yet)
- **Shared by:** tadbuy, giveabit, satohash, motopass, openstrata
- **Config:** `src/data/ecosystemConfig.ts`

## Key Files
- `src/` — React 19 + Vite + TypeScript
- `server.ts` + `server/routes/` — Express API (runs M3 dev or M4 production)
- `scripts/sync-docs.ts` — Auto-syncs docs on build
- `docs/KIMI-HANDOFF.md` — Cross-agent handoff log

## Gaps / Next
- [ ] M4 Phase 1: API proxy live
- [ ] M4 Phase 2: Fedimint mint + fm-invite
- [ ] M4 Phase 3: Umbrel LND
- [ ] Automated E2E tests
- [ ] Propagate ecosystemConfig to sibling repos

## How to Start (M3)
```bash
cd ~/projects/tadbuy && npm install && npm run dev
```

**This file is the M3 code source of truth.** Obsidian on M4 is the server/ops source of truth for Kimi.

*Safe Harbour · Part of the [Give A Bit](https://giveabit.io) family.*