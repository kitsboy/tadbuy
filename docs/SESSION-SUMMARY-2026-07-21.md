# Session Summary — 2026-07-21

**Chat Topic:** Suite metrics pipe for Tadbuy — publish `gab.product-metrics.v1` + Umami tracking so HQ can consume live origin data.

## Key Things We Did
- Followed suite plan from `ALL-SITE-METRICS.md` (Steps 1–2; `ref/GROK-BOOT.md` missing in repo)
- Built origin `public/metrics.json` per `gab.product-metrics.v1` (schema from HQ)
- Wired Umami visitor tracking in `index.html` with Tadbuy website ID
- Added Cloudflare `_headers` CORS + short cache for `/metrics.json` so HQ can poll

## What We Finished
- [x] **Step 1** — `public/metrics.json` with:
  - 11 KPIs: `campaigns_total`, `campaigns_active`, `sats_processed_total`, `sats_processed_30d`, `impressions_delivered`, `clicks_delivered`, `ctr_pct`, `active_publishers`, `active_platforms`, `avg_cpm_sats`, `campaigns_completed`
  - 3 series: `impressions_daily`, `sats_daily`, `campaigns_daily`
  - 1 funnel: created → funded → running → completed
  - 1 segment: `platform_breakdown` (sats per network)
- [x] **Step 2** — Umami script (`data-website-id=e75632e3-b6f4-4fa3-9ec5-8b3107adf783`)
- [x] CORS headers for HQ cross-origin fetch

## What We Are Still Aiming to Finish
- [ ] Deploy: push → CF Pages so `https://tadbuy.giveabit.io/metrics.json` is live
- [ ] HQ: prefer live origin URL in `projects.json` metrics candidates (HQ repo)
- [ ] Nova/Kimi: CF tunnel for Umami — `analytics.giveabit.io` → THOR `:3002` (host does not resolve yet)
- [ ] Replace seed metrics with live Supabase / LNbits aggregates; set `raw.demo: false`
- [ ] Cam: LNbits invoice key in HQ Vault for Tadbuy money pill
- [ ] Prior infra: Supabase Auth migration, Fedimint mint, Umbrel LND (parked)

## Update / Status
As of **2026-07-21**, Tadbuy has a product-origin metrics envelope ready for HQ. Values are **demo seed** aligned with in-app analytics APIs until DB aggregates land. Umami script is in the SPA head; analytics host needs tunnel wiring before pageviews hit Umami.

## Key Decisions / Notes
- Schema: `gab.product-metrics.v1` — same envelope Satohash / HQ cards use
- Umami host: `https://analytics.giveabit.io/script.js` (no port) for public HTTPS CF Pages; docs placeholder was `ANALYTICS_HOST:3002`
- `raw.demo: true` until live pipes; never put secrets/PII in metrics.json
- `ref/GROK-BOOT.md` was not present; Steps 1–2 taken from suite ALL-SITE-METRICS deploy plan

## Mission Tie-in
HQ stays the glass; Tadbuy stays compartmentalized. Publishing secret-free metrics + privacy-friendly Umami keeps the suite ops narrative honest without KYC surveillance. Bitcoin-settled ad GMV becomes visible for diligence when live.

## Recovery
Use **/whatsup** in a new chat to load this summary and continue.
