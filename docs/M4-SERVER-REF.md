# M4 Server Reference — HERMES / Kimi

**DO NOT install on M3.** This document describes what runs on the Mac M4 (Obsidian + HERMES).

## Planned Services on M4

| Service | Purpose | Port / URL |
|---------|---------|------------|
| Give A Bit Fedimint Mint | Shared ecash for all projects | `mint.giveabit.io` |
| Fedi Gateway | Mobile wallet access to mint | Fedi app deep link |
| API Proxy | Express APIs for static Cloudflare sites | `api.giveabit.io` |
| Umbrel | Full Bitcoin + LND node | Local LAN / Tailscale |

## Projects Using Give A Bit Mint

- tadbuy.giveabit.io
- giveabit.io
- satohash.giveabit.io
- motopass.giveabit.io
- openstrata.giveabit.io

## M3 ↔ M4 Split

| M3 (`~/projects/`) | M4 (HERMES) |
|---------------------|-------------|
| React UI code | Fedimint guardian binaries |
| Git commits → GitHub | Umbrel node |
| Docs + .ai_docs | API proxy (server.ts) |
| `npm run dev` for testing | Fedi gateway |
| Cloudflare Pages deploy | Tailscale for M3↔M4 |

## Env Vars (set on M4, not committed)

```bash
FEDIMINT_GATEWAY_URL=https://mint.giveabit.io
VITE_FEDIMINT_INVITE=fm-invite://...   # from mint creation
UMBREL_LND_CERT=...
UMBREL_LND_MACAROON=...
UMBREL_LND_SOCKET=umbrel.local:10009
```

## Setup Checklist for Kimi

Full step-by-step: **[KIMI-M4-SETUP-CHECKLIST.md](./KIMI-M4-SETUP-CHECKLIST.md)**

Priority: API proxy → Fedimint mint → Umbrel LND

## Staged — Not Live Yet

All Fedimint and Umbrel integrations in Tadbuy UI are **staged**. The app works in demo mode until M4 services are online.

---
*Referenced from M3 at `~/projects/tadbuy/docs/M4-SERVER-REF.md`*