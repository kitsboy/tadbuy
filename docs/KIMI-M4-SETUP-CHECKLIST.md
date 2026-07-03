# Kimi M4 Setup Checklist — Give A Bit Mint + API Proxy

**Machine:** M4 (HERMES / Obsidian)  
**Owner:** Kimi  
**Code lives on M3:** `~/projects/tadbuy/` — pull only, do not develop here  
**Goal:** One shared Fedimint mint + API proxy for all Give A Bit apps

> **Dual canonical copies**
> - **GitHub (M3 edits):** `docs/KIMI-M4-SETUP-CHECKLIST.md` in tadbuy repo
> - **Obsidian (M4/Kimi):** `MASTER-BRAIN/Obsidian/03-Projects/M3/Tadbuy/M4-SETUP-CHECKLIST.md`
>
> Keep both in sync when phases complete. Kimi owns Obsidian; Grok owns GitHub.

---

## Before You Start

- [ ] Confirm you are on **M4**, not M3
- [ ] Tailscale running (M3 ↔ M4 mesh)
- [ ] Git access: `git clone https://github.com/kitsboy/tadbuy.git`
- [ ] Node.js 20+ installed on M4
- [ ] Secrets vault ready (Obsidian secure note or 1Password — **never commit secrets**)

### Apps that will share this mint

| Project | URL |
|---------|-----|
| Tadbuy | https://tadbuy.giveabit.io |
| Give A Bit | https://giveabit.io |
| Satohash | https://satohash.giveabit.io |
| MotoPass | https://motopass.giveabit.io |
| OpenStrata | https://openstrata.giveabit.io |

---

## Phase 1 — Clone & API Proxy ✅ COMPLETE (2026-07-03)

Gets `/api/*` working for the live Cloudflare site.

**Actual deployment (Kimi):** `~/.hermes/servers/tadbuy-api/` — NOT `~/projects/tadbuy`.  
**Public URL:** `api.giveabit.io` via Cloudflare Tunnel → `localhost:3000`.  
**DB:** Supabase (`cegzfjbsadwchonpxwmv`) — not Firebase Admin.

### 1.1 Clone repo on M4

```bash
cd ~/projects   # or your HERMES projects folder
git clone https://github.com/kitsboy/tadbuy.git
cd tadbuy
npm install
```

- [ ] `npm run lint` passes
- [ ] `npm run build` passes

### 1.2 Create `.env` on M4 (not `.env.local` — this is the server)

```bash
cp .env.example .env
```

Fill in (minimum for API proxy):

```bash
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
SESSION_SECRET=<run: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">

# Firebase Admin (from Firebase Console → Service Accounts)
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}

# Gemini (for /api/ai/optimize)
GEMINI_API_KEY=...

# Agent API keys (optional)
AGENT_API_KEYS={"kimi-agent-key":"admin"}
```

- [ ] `.env` created
- [ ] `.env` is in `.gitignore` (never commit)

### 1.3 Run API server

**Test run:**
```bash
npm start
# Should show: 🚀 Tadbuy server running on http://0.0.0.0:3000
```

**Verify from M4:**
```bash
curl http://localhost:3000/api/health
curl http://localhost:3000/api/beta/status
curl http://localhost:3000/api/ecosystem/config
```

Expected: JSON responses, `"ok": true` on health.

- [ ] `/api/health` returns OK
- [ ] `/api/beta/status` returns BETA phase info

### 1.4 Keep it running (PM2 recommended)

```bash
npm install -g pm2
pm2 start "npm start" --name tadbuy-api
pm2 save
pm2 startup   # follow the printed command
```

- [ ] `pm2 status` shows `tadbuy-api` online
- [ ] Survives reboot

### 1.5 Expose via Tailscale (fastest path)

```bash
# On M4 — note your Tailscale hostname, e.g. m4-hermes.tailXXXX.ts.net
tailscale status
```

From **M3**, test:
```bash
curl http://m4-hermes.tailXXXX.ts.net:3000/api/health
```

- [ ] M3 can reach M4 API over Tailscale

### 1.6 DNS — api.giveabit.io (when ready for production)

Option A — **Tailscale Funnel** (quick, private-ish)  
Option B — **Cloudflare Tunnel** on M4 pointing to localhost:3000  
Option C — **Public IP + port forward** (least preferred)

Point `api.giveabit.io` → M4 proxy.

- [x] `curl https://api.giveabit.io/api/health` returns OK from internet

### 1.7 Cloudflare Pages env vars (Cam or Kimi via CF dashboard)

On **tadbuy** Cloudflare Pages project → Settings → Environment variables:

```
VITE_API_BASE_URL=https://api.giveabit.io
```

Trigger redeploy.

- [x] Live site at tadbuy.giveabit.io/beta shows "API Online"
- [ ] Integrations page "Try API" buttons return JSON

**Handoff to Cam:** "API proxy is live at api.giveabit.io"

---

## Phase 2 — Give A Bit Fedimint Mint ⏸ PARKED

> **Blocker (2026-07-03):** Fedi app 26.6.0 ships Fedimint 0.10.0. Guardian 0.11.0 needed for single-guardian mode — invite format incompatible. Kanban: **Andrea** `t_8ee7c976` — deploy when Fedi updates.
>
> **Cam:** Keep Fedi installed. Do not join a federation until invite is issued post-blocker.

### 2.1 Install Fedimint guardian on M4

Follow official docs: https://docs.fedimint.org

```bash
# Example — check fedimint.org for current install method
# Guardian binary or Docker — M4 only
```

- [ ] Fedimint guardian binary installed
- [ ] Guardian starts without errors

### 2.2 Create federation

| Setting | Value |
|---------|-------|
| Federation name | `Give A Bit Mint` |
| Domain | `giveabit.io` |
| Guardians | Start with 1 (expand to 3+ later for production) |

- [ ] Federation created
- [ ] Guardian logs show "running"

### 2.3 Generate invite code

```bash
# Federation CLI — generate invite
# Output looks like: fm-invite://...
```

- [ ] Invite code generated
- [ ] Saved to Obsidian secrets vault (NOT git)

### 2.4 Configure gateway

Expose at `mint.giveabit.io` (Cloudflare Tunnel or Tailscale).

Add to M4 `.env`:
```bash
FEDIMINT_GATEWAY_URL=https://mint.giveabit.io
FEDIMINT_INVITE=fm-invite://...
FEDIMINT_FEDERATION_NAME=Give A Bit Mint
```

Restart API:
```bash
pm2 restart tadbuy-api
```

Verify:
```bash
curl http://localhost:3000/api/ecosystem/config
# fedimint.status should change from "staged" to "beta"
```

- [ ] Gateway reachable
- [ ] API reports fedimint configured

### 2.5 Cloudflare Pages — Fedimint invite (all 5 apps)

For each Pages project (tadbuy, satohash, etc.):
```
VITE_FEDIMINT_INVITE=fm-invite://...
VITE_FEDIMINT_GATEWAY_URL=https://mint.giveabit.io
```

- [ ] Tadbuy redeployed with invite
- [ ] Same invite works on other Give A Bit apps

### 2.6 Test with Fedi (Cam's phone)

1. Install Fedi: https://fedi.xyz
2. Scan `fm-invite://` code
3. Deposit small amount of BTC (testnet first if available)
4. On tadbuy.giveabit.io → create campaign → pay with **Fedimint**

- [ ] Fedi connects to mint
- [ ] Ecash balance shows in Fedi
- [ ] Tadbuy checkout shows Fedimint panel connected
- [ ] Test payment completes

**Handoff to Cam:** "Give A Bit Mint is live — invite code in vault"

---

## Phase 3 — Umbrel Lightning ⏸ PARKED

> **Blocker (2026-07-03):** Umbrel offline **93 days**. Kanban: **Rosa** `t_46208fbe` — Lightning when node syncs.

### 3.1 Enable LND on Umbrel

- [ ] Umbrel fully synced
- [ ] LND app installed and running
- [ ] Note Umbrel hostname (LAN or Tailscale)

### 3.2 Export LND credentials

On Umbrel → LND → Settings:
- TLS certificate → base64 encode
- Admin macaroon → base64 encode

```bash
# Example
base64 -i ~/.lnd/tls.cert | tr -d '\n'
base64 -i ~/.lnd/data/chain/bitcoin/mainnet/admin.macaroon | tr -d '\n'
```

### 3.3 Add to M4 `.env`

```bash
UMBREL_LND_CERT=<base64 tls cert>
UMBREL_LND_MACAROON=<base64 macaroon>
UMBREL_LND_SOCKET=<umbrel-hostname>:10009
```

```bash
pm2 restart tadbuy-api
```

### 3.4 Verify Lightning

```bash
curl http://localhost:3000/api/lightning/info
curl http://localhost:3000/api/lightning/channels
curl http://localhost:3000/api/umbrel/status
```

- [ ] Node alias returned (not 503 error)
- [ ] Channels listed (or empty but connected)
- [ ] Umbrel status = `configured`

### 3.5 Test Lightning payment on Tadbuy

1. tadbuy.giveabit.io → create campaign
2. Choose **Lightning** payment
3. Generate invoice → pay from Phoenix/Breez/Zeus
4. Confirm campaign goes live

- [ ] Invoice created via real LND
- [ ] Payment detected
- [ ] Campaign status → `live` in Firestore

**Handoff to Cam:** "Umbrel LND connected — real Lightning live"

---

## Phase 4 — Propagate to Other Projects

Same env vars for each Give A Bit app's Cloudflare Pages:

```
VITE_API_BASE_URL=https://api.giveabit.io
VITE_FEDIMINT_INVITE=fm-invite://...
VITE_FEDIMINT_GATEWAY_URL=https://mint.giveabit.io
```

Copy `src/data/ecosystemConfig.ts` pattern to:
- [ ] satohash
- [ ] giveabit
- [ ] motopass
- [ ] openstrata

Or create shared package `@giveabit/ecosystem-config` (future).

---

## Phase 5 — Verification Matrix

Run all checks before marking DONE:

| Check | Command / URL | Expected |
|-------|---------------|----------|
| API health | `curl api.giveabit.io/api/health` | `ok: true` |
| BETA status | https://tadbuy.giveabit.io/beta | API Online (green) |
| Fedimint status | `curl api.giveabit.io/api/fedimint/status` | connected or join prompt |
| Ecosystem | `curl api.giveabit.io/api/ecosystem/config` | giveabit-mint, beta |
| Lightning | `curl api.giveabit.io/api/lightning/info` | node alias (when Umbrel ready) |
| Agent manifest | `curl api.giveabit.io/api/agent/manifest` | docs paths listed |
| Checkout | tadbuy.giveabit.io → pay Fedimint | real ecash deducts |
| Fedi | Phone app | balance updates |

- [ ] All applicable checks pass
- [ ] Append results to `docs/KIMI-HANDOFF.md`
- [ ] Echo to `~/projects/PROJECT-UPDATE-LOG.md` on M4 (or M3 mirror)

---

## Secrets Reference (M4 vault only)

| Secret | Where used | Never commit |
|--------|-----------|--------------|
| `fm-invite://...` | All 5 apps CF env | ✅ |
| `FEDIMINT_GATEWAY_URL` | M4 .env | ✅ |
| `UMBREL_LND_*` | M4 .env | ✅ |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | M4 .env | ✅ |
| `GEMINI_API_KEY` | M4 .env | ✅ |
| `SESSION_SECRET` | M4 .env | ✅ |

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `/beta` shows API Offline | PM2 not running, or `VITE_API_BASE_URL` not set in CF |
| Fedimint join fails | Check gateway URL, firewall, Tailscale |
| Lightning 503 | Umbrel not ready or wrong cert/macaroon/socket |
| CORS errors | API proxy must be same-origin or configure CORS in server.ts |
| Payments work locally but not live | CF Pages is static — need M4 API proxy |

---

## When Done — Tell Cam

One-liner for handoff:
> "M4 live: API at api.giveabit.io ✅ | Give A Bit Mint at mint.giveabit.io ✅ | Umbrel LND [ready/not yet] | invite in vault"

Update on M3 (Grok will sync on next session):
- `docs/KIMI-HANDOFF.md`
- `docs/BETA.md` status table
- `src/data/ecosystemConfig.ts` → `federation.status: 'live'`

---

## Priority Order (if doing incrementally)

1. **Phase 1** — API proxy (unblocks everything else)
2. **Phase 2** — Fedimint mint (ecash payments)
3. **Phase 3** — Umbrel (Lightning payments)
4. **Phase 4** — Other projects
5. **Phase 5** — Full verification

---

*Safe Harbour · Part of the [Give A Bit](https://giveabit.io) family.*  
*Written by Grok on M3 · For Kimi on M4 HERMES*