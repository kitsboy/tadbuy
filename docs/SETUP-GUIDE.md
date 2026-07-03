# Tadbuy Setup Guide — M3 + M4 + Fedi + Umbrel

## Quick: What Goes Where

| Thing | Machine | Location |
|-------|---------|----------|
| Code & docs | **M3** | `~/projects/tadbuy/` |
| Fedimint mint | **M4** | HERMES / Obsidian server |
| Umbrel BTC node | **M4** | When ready |
| Fedi wallet | **Your phone** | App Store / fedi.xyz |
| Live website | **Cloudflare** | Auto-deploy from GitHub |

---

## Step 1 — M3 Development (now)

```bash
cd ~/projects/tadbuy
npm install
cp .env.example .env.local
npm run dev
```

Open http://127.0.0.1:3000 — full API + UI works locally.

---

## Step 2 — Create Give A Bit Mint (M4, when ready)

On **M4 only**, install Fedimint and create a federation for `giveabit.io`:

1. Follow [fedimint.org/docs](https://docs.fedimint.org) guardian setup
2. Create federation named **Give A Bit Mint**
3. Generate invite code: `fm-invite://...`
4. Expose gateway at `mint.giveabit.io` (or Tailscale hostname)
5. Save invite to M4 env — **never commit to git**

Share the same invite across: tadbuy, satohash, giveabit, motopass, openstrata.

---

## Step 3 — Fedi Wallet (your phone)

1. Install **Fedi** from [fedi.xyz](https://fedi.xyz)
2. Scan the `fm-invite://` code from Step 2
3. Deposit Bitcoin → receive ecash
4. Pay on Tadbuy by selecting **Fedimint** at checkout

---

## Step 4 — Umbrel Lightning (M4, when node is ready)

1. Enable LND on Umbrel
2. Export TLS cert + admin macaroon (base64)
3. Set on M4 API server:
   ```
   UMBREL_LND_CERT=...
   UMBREL_LND_MACAROON=...
   UMBREL_LND_SOCKET=your-umbrel-host:10009
   ```
4. Real Lightning invoices work at checkout

---

## Step 5 — API Proxy (M4 → production)

Cloudflare Pages serves **static files only**. For live payments:

1. Run `server.ts` on M4 (or PM2/systemd)
2. Point `api.giveabit.io` to M4 (Tailscale or public IP)
3. Set in Cloudflare Pages env:
   ```
   VITE_API_BASE_URL=https://api.giveabit.io
   ```

---

## Step 6 — Consumer Workflow

```
Visit tadbuy.giveabit.io
  → Create campaign (4 steps)
  → Choose payment: Lightning | Fedimint | BTC | Zap
  → Pay (needs API + mint/node online)
  → Campaign goes live
  → View metrics
```

See [/beta](https://tadbuy.giveabit.io/beta) for live/ beta / staged status.

---

## Easiest Path (minimal setup)

1. **Now:** Use `npm run dev` on M3 — everything works in demo mode
2. **Next:** Kimi sets up mint on M4 → paste invite into `.env.local`
3. **Later:** Umbrel ready → add LND vars on M4
4. **Production:** M4 API proxy + `VITE_API_BASE_URL`

---
*Auto-maintained · Part of the [Give A Bit](https://giveabit.io) family.*