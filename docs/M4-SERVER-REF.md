# M4 Server Reference — HERMES / Kimi

**DO NOT install Fedimint/Umbrel on M3.**  
**DO NOT `git pull` or develop working trees on M4.** Working code lives on **M3 only**.

## Canonical split

| | **M3 (Grok / coding)** | **M4 (Kimi / HERMES)** |
|--|------------------------|-------------------------|
| **What lives here** | Full repo `~/projects/tadbuy/` | REF docs, env vault notes, long-running services |
| **Code** | Edit, lint, build, commit, push | **No working clone. No `git pull` for app source.** |
| **Deploy SPA** | Push `main` → Cloudflare Pages | — |
| **Docs for Kimi** | GitHub: `docs/M4-SERVER-REF.md`, `docs/KIMI-HANDOFF.md`, checklists | Obsidian / MASTER-BRAIN copies of **REF only** |
| **Runtime services** | `npm run dev` for local test | API proxy process, Fedimint, Umbrel (when live) |

If an API process already runs under HERMES (e.g. historical `tadbuy-api`), Kimi operates **that process and its env** — she does **not** re-clone the monorepo as a second working tree. Source of truth for code remains GitHub ← M3.

## Planned / live services on M4

| Service | Purpose | Port / URL |
|---------|---------|------------|
| Give A Bit Fedimint Mint | Shared ecash for all projects | `mint.giveabit.io` |
| Fedi Gateway | Mobile wallet access to mint | Fedi app deep link |
| API Proxy | Express APIs for static Cloudflare sites | `api.giveabit.io` → tunnel → local port |
| Umbrel | Full Bitcoin + LND node | Local LAN / Tailscale |

## Projects using Give A Bit Mint

- tadbuy.giveabit.io  
- giveabit.io  
- satohash.giveabit.io  
- motopass.giveabit.io  
- openstrata.giveabit.io  

## Env vars (M4 vault / process env — never commit)

```bash
# Server
NODE_ENV=production
PORT=3000
SESSION_SECRET=...
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...

# Outbound Lightning payouts — KEEP FALSE until wallet ledger exists
ENABLE_LN_PAYOUTS=false
LIGHTNING_WEBHOOK_SECRET=...

# LND (when Umbrel ready)
UMBREL_LND_CERT=...
UMBREL_LND_MACAROON=...
UMBREL_LND_SOCKET=umbrel.local:10009

# Fedimint (when mint ready)
FEDIMINT_GATEWAY_URL=https://mint.giveabit.io
```

### Auth / data stack (current truth)

| Layer | Technology | Notes |
|-------|------------|--------|
| **Database (server)** | **Supabase** (service_role) | Campaigns, bids, publisher_settings — **not** Firebase Admin |
| **Client login (code today)** | Firebase Auth still in SPA (`src/firebase.ts`, Profile) | **Legacy.** Cam intent: no Firebase. **Migrate to Supabase Auth on M3** (TODO) |
| **Agent API** | `AGENT_API_KEYS` JSON | Optional automation |

Do **not** treat Firebase Admin as required on M4 for DB. Prefer Supabase + (future) Supabase JWT verification.

## Setup checklist for Kimi

Full step-by-step REF: **[KIMI-M4-SETUP-CHECKLIST.md](./KIMI-M4-SETUP-CHECKLIST.md)**  
Priority: API proxy ops → Fedimint mint → Umbrel LND  

**Ignore any checklist lines that say “clone/pull tadbuy on M4 for development.”** That model is retired. REF docs only.

## Staged — not live yet

Fedimint and Umbrel integrations in the Tadbuy UI are **staged**. App works in demo mode until M4 services + env are online.

---
*M3 path: `~/projects/tadbuy/docs/M4-SERVER-REF.md` · Sync REF to Obsidian; never mirror the full working tree to M4.*
