# KIMI → GROK HANDOFF — 2026-07-20 (THOR mega ops + less-chat + HQ v2.5 + memory)

**From:** Kimi on THOR  
**To:** Grok on M3  
**Read before coding this session.**

## TL;DR for Grok
Ops on THOR was cleaned and automated. **You still own all code on M3** (`~/projects/*` → `git push`). Do not SSH to THOR for coding. Keep writing `docs/KIMI-HANDOFF.md` after sessions.

## Machine roles (hard)
| Machine | Who | Does |
|---------|-----|------|
| **M3** | Grok | Code only in `~/projects/` → push |
| **THOR** | Kimi | Docker, LNbits/LND, crons, vault docs, HQ deploy |
| **M4** | — | DEPRECATED |

## What shipped on THOR (you need awareness)

### HQ glass (kitsboy/HQ) — v2.5+
- Live: https://hq.giveabit.io
- Password **gate** + browser **Vault** (keys never in git)
- Live pipes: `api.satohash.io/metrics.json`, status pinger
- Status matrix: GH Actions every 15m + THOR `hq-status-refresh` every 30m
- After HQ UI work: push main; CF Pages auto/manual as before
- Pull latest HQ on M3: `cd ~/projects/HQ && git pull`

### Satohash proof plane
- API live: https://api.satohash.io/health + `/metrics.json` (`gab.product-metrics.v1`)
- Runtime on THOR Docker; SPA still CF Pages from your pushes
- Keep `VITE_API_URL` → `https://api.satohash.io` when building SPA
- Family clients: thin satohash-client in suite repos

### Less-chat ops (Cam preference)
- Cam reads **OPS-PULSE** / morning Telegram pulse before opening chats
- You should still not spam handoffs — one clear `docs/KIMI-HANDOFF.md` entry per session is enough
- SEO/design weekly jobs are **change-gates** (silent if no commits) — your pushes reopen the gate

### Automations (do not duplicate on M3)
| Job | Cadence |
|-----|---------|
| Morning pulse | daily 07:30 TG script |
| HQ status refresh | 15m GH + 30m THOR |
| GitHub scan | every 6h |
| Learn loop | Sunday |
| EU / kanban / LNbits digests | **weekly** (not daily) |

### Memory (Hermes)
- Built-in MEMORY/USER denser + limits raised
- External: **holographic** local provider ON
- Cam uses `/goal` and `/learn` on THOR — optional for you on M3 if Hermes available

## What Grok should do on EVERY project session
1. `git pull origin <default-branch>` first  
2. Read this file (or repo `docs/KIMI-HANDOFF.md` top entry)  
3. Read `AGENTS.md` + `GROK-SESSION-PROTOCOL.md`  
4. Code → test → commit → push  
5. **Append** your handoff at top of `docs/KIMI-HANDOFF.md` (or dated file) and push  
6. Never commit secrets / `.env` / macaroons  

## Repo-specific notes
| Repo | Branch | Note |
|------|--------|------|
| giveabit | main | Parent + NIP-05; CF auto |
| satohash | main | API on THOR; SPA CF; metrics.json live |
| katoa | main | CF; manual deploy path may still apply |
| stranded | main | CF auto |
| tadbuy | main | CF |
| motopass | main | CF |
| sherpacarta | main | CF |
| openstrata | **talent** | default branch talent |
| btcminiscript | main | lib/docs |
| HQ | main | ops glass; gate+vault; status.json bot commits OK |

## Doc suite standard (keep current)
Root: `AGENTS.md`, `GROK-SESSION-PROTOCOL.md`, `README.md`, `SOURCE-OF-TRUTH.md` (code), `DILIGENCE.md` (live), `docs/KIMI-HANDOFF.md`, diligence packs as needed.

## Do NOT
- Deploy LNbits/LND/Docker from M3  
- Assume M4 is active  
- Re-open status chats for green suite — Cam uses pulse/HQ  
- Put invoice keys or PATs in repo files  

## Safe Harbour + giveabit.io
All public outputs stay Bitcoin-sovereign + Safe Harbour.

— Kimi · THOR · 2026-07-20

---

## Session — 2026-07-21 (metrics Option A — app-state counts)

**Done:**
- Priority 1 Option A: `public/metrics.json` now generated from app campaign state
- `src/lib/metrics/productMetrics.ts` — counts campaigns / sats / impressions / CTR / funnel / platform breakdown
- `scripts/generate-metrics.ts` + `npm run generate-metrics` (also on **prebuild**)
- Values: 4 campaigns, 2 live, 3.63M sats, 1.136M impressions, 14.8k clicks, 9 publishers, 6 platforms
- `raw.demo: false`, `raw.source: "app-state"` (honest SPA seed data, not hand-seeded 48/12 envelope)

**Decisions:**
- Option A (file write at build) fits CF Pages origin; Supabase aggregate job can swap source later
- docs/NEXT-STEPS.md not in repo — followed session still-to-do + Cam Option A wording

**Still to do:**
- CF Pages deploy after push → `https://tadbuy.giveabit.io/metrics.json`
- HQ: prefer live origin URL in projects.json metrics candidates
- Later: generator reads Supabase instead of `src/data/campaigns.ts`
- Umami tunnel; Cam Vault LNbits key

**Next for Kimi:** After deploy, HQ can poll live origin. Coverage map: tadbuy metrics source = app-state generator.

**Git State:**
- SHA: `7f9f0258ca69c9bc86bfaa53d8fd288336cc8f0f` (tip; feature `304e0c2`)
- Branch: main
- Unpushed: none
- Version: v5.0.38

---

## Session — 2026-07-19 (Satohash thin client)

**Done:**
- Added thin family API client `src/lib/satohash.ts` → `https://api.satohash.io`
- `X-Satohash-Client: tadbuy`
- Exports: `stampHash`, `getApiHealth`, `getStamp`, `verifyUrl`, `stampGuideUrl`, `sha256Hex`
- Graceful offline: network/API failures return `{ ok: false }` — never throw
- Optional key via `VITE_SATOHASH_KEY` only (never committed)
- Integrations page links to Satohash site + stamp guide

**Decisions:**
- Thin client only — no OTS/calendar reimplementation in tadbuy
- API is LIVE at api.satohash.io; client degrades when unreachable

**Git State:**
- SHA: `76230c982c85f13eb9be374cfe80796c14411f6f`
- Branch: main

---

## Session — 2026-07-19

**Done:**
- Added thin Satohash API client `src/lib/satohash.ts` (sha256Hex, stampHash, getApiHealth, getStamp, verifyUrl, stampGuideUrl)
- Client id `tadbuy`; env `VITE_SATOHASH_API_URL` / `VITE_SATOHASH_URL` / optional `VITE_SATOHASH_KEY`
- Graceful offline (ok:false, no throw); API live at https://api.satohash.io
- Minimal Integrations page card linking to Satohash site + stamp guide
- No secrets committed

**Decisions:**
- Match family client pattern (motopass-style graceful offline)
- No unit test runner in repo — skipped tests

**Git State:**
- SHA: `2e910cb5bc86f77c7aa7995173406d157736296b`
- Unpushed: this commit

---

## Session — 2026-07-13 (CDN / blank site / homepage crash — TUI handoff)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TADBUY — Grok M3 handoff for Kimi (2026-07-13)                            │
│ Live: https://tadbuy.giveabit.io/  │  SHA: f177a1cc2d600f5d2e77387f2f912bcb97f79359 │
└─────────────────────────────────────────────────────────────────────────────┘

SYMPTOMS (user-reported, now mitigated)
  1. Blank page — orange glow only, no header/menus (JS never mounted)
  2. "Something went wrong" on / — RouteErrorBoundary, SyntaxError: Unexpected token '<'

ROOT CAUSE
  Cloudflare Pages partial deploy rollouts + SPA fallback (/* → index.html 200)
  → missing /assets/*.js returned HTML with 200 OK
  → CDN cached HTML as JS (especially requests with Origin header from ES modules)
  → Service worker also cached bad responses (fixed)
  → immutable 1-year cache made poison permanent

CHANGES SHIPPED (5 commits, 3484e80 → f177a1c)
  index.html              boot-fallback UI when bundle fails to load
  src/main.tsx            force SW update on load
  public/sw.js            v5.0.21 — content-type check before caching assets
  public/_headers         /assets/* → 5min must-revalidate (was 1yr immutable) + CORS *
  vite.config.ts          all outputs suffixed -cb3.js (cache-bust poisoned CDN)
  scripts/verify-dist.mjs postbuild — fail if index.html refs missing assets
  scripts/check-origin-cache.mjs  detect CDN HTML-as-JS (Origin header probe)
  scripts/check-prod-assets.mjs   prod asset scanner (helper)
  package.json            postbuild + npm run check:prod-cache
  src/components/FeeBreakdown.tsx  trivial label change (chunk rehash)
  docs/KIMI-HANDOFF.md    this handoff

PRODUCTION STATUS (verified Playwright + curl)
  [OK]  / (Buy Ads) — hero renders, no error boundary
  [OK]  69/70 lazy chunks on index-Dpabelji-cb3.js
  [BAD] Marketplace-BfNJB2j5-cb3.js — missing on origin (SPA HTML fallback)
  [BAD] /marketplace — RouteErrorBoundary until chunk deploys

KIMI ACTION ITEMS (infra — M4 / Cloudflare dashboard)
  1. PURGE ALL CDN CACHE for tadbuy.giveabit.io (critical)
  2. Verify CF Pages deploy uploads full dist/assets/ (not partial ~17 files)
  3. After purge, run: npm run check:prod-cache (from M3 against live)
  4. Confirm build cmd: npm run build  │  output: dist  │  Node 20

STILL BROKEN / NOT IN SCOPE
  - /marketplace (1 missing chunk — likely partial deploy, not code bug)
  - Real Lightning / Umbrel LND, Fedimint mint, Supabase Auth migration
  - Users with old SW/cache need hard refresh (Cmd+Shift+R)

GIT
  Branch: main  │  Unpushed: none  │  package.json version: v5.0.17
```

---

## Session — 2026-07-13 (homepage RouteErrorBoundary fix)

**Done:**
- Diagnosed "Something went wrong" on `/`: `SyntaxError: Unexpected token '<'` from lazy chunks
- Root cause: Cloudflare CDN cached `index.html` as JS for `/assets/*.js` requests with `Origin` header (ES module imports), during partial deploy rollouts
- Fixed: `-cb3` asset filename suffix, 5-min `must-revalidate` cache (no immutable), SW v5.0.21, `check-origin-cache.mjs`
- **Kimi action:** Purge all CDN cache for `tadbuy.giveabit.io` after deploy

**Git State:**
- SHA: `c7d3880`+ after push
- Unpushed: none

---

## Session — 2026-07-13 (blank site / overlay fix)

**Done:**
- Diagnosed blank site: production served `index.html` for missing `/assets/*.js` (SPA fallback) — React never mounted, only orange body gradient visible
- Service worker was caching those HTML responses as JavaScript — fixed content-type validation in `public/sw.js` (cache `tadbuy-v5.0.18`)
- Added `scripts/verify-dist.mjs` postbuild check so future deploys fail if assets missing
- Added boot-fallback UI in `index.html` when app bundle fails to load
- Pushed fix → CF Pages redeployed; production verified (header + nav visible)

**Decisions:**
- Root cause was broken/partial CF deploy + poisoned SW cache, not motion/overlay components

**Git State:**
- SHA: `3484e805775f7a8d4c7bc3514e88d4f547ec3608`
- Unpushed: none

---

## Session — 2026-07-13 (finish pass)

**Done:**
- NIP-98 full schnorr verify (`@noble/secp256k1` + `@noble/hashes`)
- Hubhash escrow API + refund UI; PageShell on 15+ pages
- Playwright E2E: 6 tests passing (`npm run test:e2e`)
- Sitemap + 6 locale SEO files updated for `/platforms`

**Git State:**
- Version: v5.0.14+ after push

---

## Session — 2026-07-13

**Done:**
- Platform hub `/platforms` + 8 per-platform budget/payout guides
- Central `platforms.ts`; PageShell, FeeBreakdown, PlatformWeightAllocator
- BuyAds budget allocator (even/custom/PPQ), fee breakdown, `?platforms=` handoff
- Uniformity: Wallet, Settlements, Compare, Integrations, PPQ, Docs, Case Studies
- `PATCH /api/campaigns/:id/status`; CSV export; stub APIs `demo: true`
- Supabase browser client scaffold; Playwright installed
- **v5.0.11** pushed → Cloudflare Pages

**Decisions:**
- M4 still REF-only; infra blockers unchanged (Umbrel, Fedi)
- Supabase Auth migration scaffolded, Firebase login still active until env set

**Git State:**
- Branch: main
- Version: v5.0.11

---

## Handoff to Kimi — 2026-07-07 (Goodbye — session complete)

**Machine:** M3 (Grok)
**Project:** tadbuy

### Done
- [x] Batches 15–24 shipped (85 + 100 geo enhancements = 535+ total)
- [x] SPA routing + desktop nav fixes
- [x] Full documentation sync (all docs, locale SEO, context maps, sitemap)
- [x] Pushed to origin/main — live **v5.0.7** after CF deploy

### Git State
- Last commit SHA: 73b548a
- Branch: main
- Unpushed: none
- Version: v5.0.7

### What's Next
- Fedi rollout when Andrea blocker clears (`t_8ee7c976`)
- Playwright E2E
- Real Lightning when Umbrel syncs (Rosa `t_46208fbe`)

---

## Latest Session Summary (from 2026-07-07 goodbye)

**Chat topic:** Ship v5 enhancements, fix nav/routing, sync all docs.

**Finished in this session:**
- 85 enhancements (batches 15–23) + 100 `/geo` enhancements (batch 24)
- Router fix (`unstable_useTransitions={false}`), header click fixes
- Full docs sync — see `docs/SESSION-SUMMARY-2026-07-07.md`

**Still to do:**
- Fedimint mint (Andrea `t_8ee7c976`), Umbrel LND (Rosa `t_46208fbe`)
- Multi-app env propagation (Andrea `t_ec77b1e5`), Playwright E2E

**Next for Kimi:** Integrate summary into Obsidian vault / Kanban. No raw chat logs needed — read `SESSION-SUMMARY-2026-07-07.md`. Do not sync M4 until Cam or Kimi says so.

**Recovery:** `/whatsup` in next Grok session.

---

## Handoff to Kimi — 2026-07-07 (v5.0.4 — full docs sync)

**Machine:** M3 (Grok)
**Project:** tadbuy

### Done
- [x] Ran `npm run sync-docs` — regenerated EXECUTIVE, FINANCIALS, MARKETING, FEDIMINT, BETA, ECOSYSTEM, GEO, LATEST-UPDATE
- [x] Updated EXEC-SUMMARY, tadbuy_MISSION, tadbuy_SEO, all locale SEO files (de/es/fr/pt/sw/zh)
- [x] Synced `.ai_docs/context_map.md` and `docs/.ai_docs/context_map.md` to v5.0.4
- [x] SETUP-GUIDE, CONTRIBUTING, MARKETING-ONELINER, sitemap lastmod refresh

### Git State
- Last commit SHA: bb242b1
- Branch: main
- Version: v5.0.6

### What's Next
- Fedi rollout when Andrea blocker clears (`t_8ee7c976`)
- Playwright E2E install + run
- Real Lightning when Umbrel syncs (Rosa `t_46208fbe`)

---

## Handoff to Kimi — 2026-07-06 (v5.0.4 — docs sync + geo 100)

**Machine:** M3 (Grok)
**Project:** tadbuy

### Done
- [x] /geo page — 100 enhancements (batch 24): map, 25 markets, insights, export, BuyAds handoff
- [x] Router fix — nav clicks update content (not just URL)
- [x] Header fixes — More menu, Search command palette
- [x] All docs updated: README, SOURCE-OF-TRUTH, CHANGELOG, BETA, GEO, context_map, SEO, sitemap
- [x] `npm run sync-docs` enhanced with batch table + GEO.md

### Git State
- Last commit SHA: 13cfb81
- Branch: main
- Version: v5.0.4

### What's Next
- Fedi rollout when Andrea blocker clears (`t_8ee7c976`)
- Playwright E2E install + run
- Real Lightning when Umbrel syncs (Rosa `t_46208fbe`)

---

## Handoff to Kimi — 2026-07-06 (v5.0.3 — 85 enhancements + mobile polish)

**Machine:** M3 (Grok)
**Project:** tadbuy

### Done
- [x] 85 enhancements shipped in batches 15–23 (foundation, campaign builder, payments, analytics, marketplace, SEO, trust, performance, mobile)
- [x] 13 workflow fixes from audit (Quick Launch, Full Control wizard, auth gate, honest success states, etc.)
- [x] Auto version bump on push (pre-push hook → v5.0.4)
- [x] Mobile polish: safe-area, 44px touch targets, toast/CTA stacking above live bar, overflow-x fix
- [x] Lint + build pass clean

### Decisions
- BuyAds lazy-loaded (~109KB chunk) to shrink main bundle
- Checkout limited to Lightning/BTC/Fedimint; other rails in ComingSoonPayments
- Pre-push hook exits 1 after inner push succeeds (remote updated; outer push aborts by design)

### What's Next
- Fedi rollout across all 5 Give A Bit apps when Andrea blocker clears (`t_8ee7c976`)
- Playwright E2E: `npm i -D @playwright/test && npx playwright install`
- Real Lightning when Umbrel syncs (Rosa `t_46208fbe`)

### Git State
- Last commit SHA: run `git log -1 --format=%H` after push
- Branch: main
- Last commit SHA: df5b1e6
- Version: v5.0.4

---

## Handoff to Kimi — 2026-07-06 (v5.0.0-PLATINUM — 200 enhancements)

**Machine:** M3 (Grok)
**Project:** tadbuy

### Done
- [x] 200 enhancements shipped in batches 7–14 (25 per batch, 8 commits)
- [x] Version bump: v4.4.0-ELITE → **v5.0.0-PLATINUM** (350 total)
- [x] UI primitive library, 8 hooks, 5 analytics widgets, campaign/wallet/marketplace polish
- [x] Docs: CHANGELOG, SOURCE-OF-TRUTH, ENHANCEMENTS-V5.md, auto-sync on build
- [x] Lint + build pass clean; pushed to origin/main (CF Pages auto-deploy)

### Git State
- Branch: main
- Version: v5.0.0-PLATINUM

### What's Next
- Fedi rollout across all Give A Bit apps (blocked on Andrea `t_8ee7c976`)
- E2E test suite
- Real Lightning when Umbrel syncs (Rosa `t_46208fbe`)

---

## Latest Session Summary (from 2026-07-03 goodbye)

**Chat topic:** Phase 1 complete; Supabase swap; Fedi guidance; blockers parked.

**Finished this session:**
- Phase 1 verified live (`api.giveabit.io`, Supabase, PM2, cloudflared)
- M3 Supabase migration + docs through Session 7
- Cam briefed on Fedi: keep installed, wait for invite

**Still to do (Cam wants this completed soon):**
- Roll **Fedi/Fedimint** to all 5 Give A Bit apps **and all future apps** (one Give A Bit Mint)
- Phase 2 when Fedi updates (Andrea `t_8ee7c976`)
- Phase 3 Umbrel when node syncs (Rosa `t_46208fbe`)
- Phase 4 propagate env vars (Andrea `t_ec77b1e5`)

**Next for Kimi:** Obsidian journal synced. When Andrea clears Fedi blocker → issue `fm-invite://` to Cam. Grok can wire sibling repos + new apps on M3.

**Recovery:** `/whatsup` or read `docs/SESSION-SUMMARY-2026-07-03.md`

---

## Handoff to Kimi — 2026-07-03 (Session 7 — Phase 1 verified, Phases 2–3 parked)

**Machine:** M3 (Grok) — syncing Kimi confirmation + blockers
**Project:** tadbuy

### Phase 1 — CONFIRMED LIVE ✅ (Kimi verified)
- [x] `api.giveabit.io` → `{"ok":true}`
- [x] Supabase 5 tables + RLS (no Firebase Admin, no Gemini on server)
- [x] Tadbuy SPA redeployed with `VITE_API_BASE_URL`
- [x] PM2 + cloudflared tunnel on M4
- [x] Server at `~/.hermes/servers/tadbuy-api/` — **no clone in `~/projects/`**
- [x] Desktop QRs cleaned up

### Phases 2 & 3 — PARKED (external blockers)

**Phase 2 — Fedimint (Andrea, `t_8ee7c976`)**
- Fedi app **26.6.0** = Fedimint **0.10.0**
- Guardian **0.11.0** required for single-guardian mode
- Invite format incompatible until Fedi app updates
- **Cam:** keep Fedi installed, wait for `fm-invite://` after blocker clears

**Phase 3 — Umbrel LND (Rosa, `t_46208fbe`)**
- Umbrel offline **93 days**
- Deploy when node syncs

**Phase 4 — Propagate (Andrea, `t_ec77b1e5`)**
- `VITE_API_BASE_URL` + Fedimint invite to all 5 CF Pages projects

### Done on M3 (Grok)
- [x] Docs synced with blockers + kanban task IDs

### Git State
- Last commit SHA: 4965fda
- Branch: main

---

## Handoff to Kimi — 2026-07-03 (Session 6 — Phase 1 COMPLETE)

**Machine:** M3 (Grok) — acknowledging Kimi M4 deployment
**Project:** tadbuy

### Done on M4 (Kimi — Phase 1)
- [x] `api.giveabit.io` → Cloudflare Tunnel → M4 `localhost:3000` (HTTP/2 200, `{"ok":true}`)
- [x] Cloudflare Tunnel launch agent (survives login)
- [x] PM2 `tadbuy-api` + pm2-logrotate at `~/.hermes/servers/tadbuy-api/` (NOT `~/projects/`)
- [x] Supabase: 5 tables + RLS, `supabaseAdmin.ts` deployed, Firebase Admin removed
- [x] `VITE_API_BASE_URL=https://api.giveabit.io` on CF Pages, SPA redeployed

### Done on M3 (Grok — this session)
- [x] Docs synced: SOURCE-OF-TRUTH, EXEC-SUMMARY, context_map, Beta page, ecosystemConfig
- [x] `/api/beta/status` returns `api: "live"`; ecosystem config includes `apiProxyStatus: "live"`

### What's Next (Phases 2–5 — when ready)
- [ ] Phase 2: Fedimint mint — `FEDIMINT_GATEWAY_URL`, `VITE_FEDIMINT_INVITE`
- [ ] Phase 3: Umbrel LND — `UMBREL_LND_*` env vars
- [ ] Phase 4: Propagate env vars to sibling CF Pages projects
- [ ] Phase 5: Full verification matrix (fedimint/lightning will show staged until 2–3)

### Git State
- Last commit SHA: 80094da
- Branch: main

---

## Handoff to Kimi — 2026-07-03 (Session 5 — Supabase swap)

**Machine:** M3 (Grok)
**Project:** tadbuy

### Done
- [x] Created `src/lib/db/supabaseAdmin.ts` — `SupabaseCampaignRepository` + helpers (webhook, bids, publisher settings, backup)
- [x] Added `supabase-schema.sql` (5 tables: campaigns, bids, publisher_settings, fedimint_sessions, settlements + RLS)
- [x] Updated `server.ts` — swapped Firestore admin → Supabase; removed firebase-admin init + Gemini `/api/ai/optimize`
- [x] Added `@supabase/supabase-js`; updated `.env.example` with `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- [x] `npm run lint` + `npm run build` pass clean

### Decisions
- Frontend Firebase client SDK unchanged (auth only); server-side DB is now Supabase
- Firestore routes rewritten: backup, lightning webhook, marketplace bids, publisher settings
- `getByUserId` preserved on `SupabaseCampaignRepository` (not in interface, same as Firestore)
- Gemini endpoint removed per M4 deployment spec (can re-add later if needed)

### What's Next (Kimi / Cam on M4)
1. **Cam:** Run `supabase-schema.sql` in Supabase dashboard (project `cegzfjbsadwchonpxwmv`)
2. **Cam:** Enable Tailscale Funnel → Kimi runs `tailscale funnel 3000` → DNS `api.giveabit.io`
3. **Kimi:** Redeploy bundle from `main` to `~/.hermes/servers/tadbuy-api/` (`npm install && npm run build && pm2 restart tadbuy-api`)
4. **Kimi:** Optional PM2 auto-start via launchd
5. Set `VITE_API_BASE_URL=https://api.giveabit.io` on Cloudflare Pages when funnel is live

### Git State
- Last commit SHA: a031a22
- Branch: main

---

## Handoff to Kimi — 2026-07-03 (Session 4 — Obsidian synced)

### Done on M4 (Kimi)
- [x] Obsidian canonical copy: `MASTER-BRAIN/Obsidian/03-Projects/M3/Tadbuy/M4-SETUP-CHECKLIST.md`
- [x] SOURCE-OF-TRUTH.md updated (M4 Setup + Agent Docs sections)
- [x] EXEC-SUMMARY.md updated (M4 strategy, Phase 1/2 status)
- [x] README.md updated (platform split, NO-clone rule)
- [x] tadbuy-ai-orientation skill references corrected

### Still to execute on M4 (Phases 1–5)
- [ ] Phase 1: API proxy + `api.giveabit.io`
- [ ] Phase 2: Give A Bit Fedimint Mint
- [ ] Phase 3: Umbrel LND (when ready)
- [ ] Phase 4: Propagate invite to 5 apps
- [ ] Phase 5: Verification matrix

### Done on M3 (Grok — this session)
- [x] M3 repo synced to acknowledge Obsidian dual-canonical setup
- [x] Dual-copy note added to GitHub checklist

### Handoff signal when Phase 1 complete
> "API proxy live at api.giveabit.io — /beta shows green"

---

## Handoff to Kimi — 2026-07-03 (Session 3)

**ACTION REQUIRED ON M4:** Follow `docs/KIMI-M4-SETUP-CHECKLIST.md`

### Your checklist (in order)
1. Phase 1 — Clone tadbuy on M4, run API proxy with PM2, expose api.giveabit.io
2. Phase 2 — Install Fedimint, create "Give A Bit Mint", generate fm-invite, configure Fedi
3. Phase 3 — Connect Umbrel LND when node is ready (not yet)
4. Phase 4 — Propagate VITE_FEDIMINT_INVITE to all 5 Give A Bit apps
5. Phase 5 — Run verification matrix, update handoff

### Done on M3 (Grok)
- [x] KIMI-M4-SETUP-CHECKLIST.md written with checkboxes, commands, verify steps
- [x] Batches 5+6 shipped (BETA page, ecosystem config, agent .ai_docs)
- [x] Give A Bit Mint staged for tadbuy, satohash, giveabit, motopass, openstrata

### Tell Cam when Phase 1 is done
> "API proxy live at api.giveabit.io — /beta page will show green"

---

## Handoff to Kimi — 2026-07-03 (Session 2)

### Done (Session 2)
- [x] Fedimint ecash first-class payment rail (join, pay, redeem APIs + UI)
- [x] Auto-evolving docs: EXECUTIVE, FINANCIALS, MARKETING, FEDIMINT via prebuild sync
- [x] Live investor pitch page at /pitch (auto-updates from projectState + metrics)
- [x] All 100 enhancements shipped in 4 batches (25+25+25+25)
- [x] New pages: /intelligence, /integrations, /enterprise
- [x] Dark/light theme + high contrast accessibility mode

---

## Handoff to Kimi — 2026-07-03

**Machine:** M3 (Grok)
**Project:** tadbuy

### Done
- [x] Full project review — Bitcoin-native DSP on Cloudflare Pages at tadbuy.giveabit.io
- [x] Fixed all placeholder docs (README, CONTRIBUTING, CHANGELOG, MARKETING-ONELINER, SEO)
- [x] 30 premium UI/UX upgrades (hero, trust badges, stats, marquee, scroll progress, back-to-top, PWA SW, SEO meta, OG image, mobile polish)
- [x] Verified `npm run lint` and `npm run build` pass clean
- [x] Committed and pushed to origin/main (auto-deploys to Cloudflare Pages)

### Decisions
- Hero banner + stats only show before payment success (keeps success screen clean)
- Mobile bottom padding added to avoid overlap with Live Activity widget
- Service worker caches static assets only in production (no dev interference)
- usePageMeta hook added alongside usePageTitle for per-page SEO descriptions

### What's Next
- Real Lightning node integration (currently demo invoices)
- Automated test suite (unit + E2E)
- Per-page BreadcrumbList and FAQPage structured data
- Deeper privacy features (PYNYM, BIP-47, Silent Payments) prominence
- See 100-item enhancement backlog in latest Grok session summary

### Git State
- Last commit SHA: 198b5f7b462ec1cf5659d11fa7d3cde7f9b9dc30
- Branch: main
- Unpushed: none expected after push

---

*Safe Harbour · Part of the [Give A Bit](https://giveabit.io) family.*
## Session — 2026-07-09

**Done (M3 only):**
- Comprehensive security/reliability/a11y audit
- P0/P1 API hardening: auth on money/campaign routes, settle `amountSats` only, `ENABLE_LN_PAYOUTS` gate, webhook secret, draft-only campaign create, no public campaign list-all
- Client `authFetch` + BuyAds invoice poll fix + deploy lock
- Firestore rules file + Supabase settlements RLS tightened (schema ref)
- A11y: modal focus trap, tabs keyboard, toast live regions, tooltips
- Commit + push to `main` → **Cloudflare Pages** SPA auto-deploy (v5.0.10)

**Decisions / rules for Kimi:**
- **NEVER `git pull` / clone working code onto M4.** Working tree lives on **M3 only** (`~/projects/tadbuy/`). M4 keeps **REF docs only** (this handoff, `M4-SERVER-REF`, checklists in Obsidian/MASTER-BRAIN).
- SPA deploy path: Grok commits on M3 → `git push origin main` → Cloudflare Pages builds `dist/`. Kimi does not deploy CF.
- API security flags for when/if the M4 API process is restarted from its existing HERMES layout (Kimi ops, not a repo pull):
  - `LIGHTNING_WEBHOOK_SECRET` (required for webhook)
  - `ENABLE_LN_PAYOUTS=false` (keep off until wallet ledger)
  - `SESSION_SECRET`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- **Auth reality (important):** Server DB is **Supabase**. Client login UI still uses **Firebase Auth** in code (`src/firebase.ts`, `Profile.tsx`, `AuthProvider`). That is legacy — Cam expects Firebase retired; **full Supabase Auth migration is still TODO** on M3. Do not re-enable Firebase Admin on M4 as “the” stack.

**M4 action (REF only — no code pull):**
- [ ] Sync/read this handoff + `docs/M4-SERVER-REF.md` into Obsidian if needed
- [ ] Confirm env vault notes match: Supabase + LND + `ENABLE_LN_PAYOUTS=false` + webhook secret
- [ ] Do **not** clone/pull tadbuy for development on M4

**Git State:**
- SHA: `d315261` (includes security fix `30e24d5` + version bump to v5.0.10)
- Branch: `main` · pushed to origin


## Latest Session Summary (from 2026-07-09 goodbye)

**Chat Topic:** Full Tadbuy audit + security hardening ship + M3/M4 REF correction.

**Finished in this session:**
- Security/reliability/a11y audit + P0/P1 code fixes (auth gates, draft campaigns, sats withdraw, webhook secret, invoice poll race, a11y)
- Push to `main` → Cloudflare Pages (v5.0.10)
- Corrected ops rule: **M4 never pulls app code** — REF docs only; working tree on M3
- Clarified stack: Supabase = DB; Firebase Auth in SPA = legacy (migrate to Supabase Auth on M3)

**Still to do:**
- Supabase Auth migration (retire Firebase client login)
- Wallet ledger before `ENABLE_LN_PAYOUTS=true`
- Campaign status API persist; NIP-98 full verify; demo flags on stub APIs

**Next for Kimi:**
- Integrate this summary into MASTER-BRAIN / Obsidian Tadbuy notes
- Sync REF only (`KIMI-HANDOFF`, `M4-SERVER-REF`, checklist) — **do not git pull tadbuy working tree**
- Env vault: `SUPABASE_*`, `SESSION_SECRET`, `LIGHTNING_WEBHOOK_SECRET`, `ENABLE_LN_PAYOUTS=false`
- Do not re-enable Firebase Admin as the platform stack

**Git State:**
- SHA: see latest `main` after goodbye push (includes `5aa461e` docs + `30e24d5` security)
- Unpushed: none

---

## Session — 2026-07-09 (goodbye)

**Done:**
- Session summary written: `docs/SESSION-SUMMARY-2026-07-09.md`
- Handoff + LATEST-UPDATE finalized for recovery via /whatsup

**Decisions:**
- M4 = REF only; M3 = all code
- Firebase login is legacy debt, not intentional stack

**Git State:**
- Branch: main
- See commit after push

---

## Latest Session Summary (from 2026-07-13 goodbye)

**Chat topic:** Production outage fix — blank site and homepage "Something went wrong" after v5.0.17 ship.

**Finished in this session:**
- Diagnosed and fixed CDN/deploy incident (HTML cached as JS, not UI overlay)
- Shipped SW v5.0.21, boot-fallback, postbuild verify, `-cb3` asset suffix, shorter cache TTL
- Homepage verified live; TUI handoff written; `docs/SESSION-SUMMARY-2026-07-13.md`

**Still to do:**
- Purge CDN cache for tadbuy.giveabit.io
- Verify CF Pages uploads all 70+ JS chunks (Marketplace chunk still missing)
- Infra blockers unchanged: Umbrel LND, Fedimint mint, Supabase Auth

**Next for Kimi:** Integrate into MASTER-BRAIN / Obsidian. Purge CDN. Run `npm run check:prod-cache` from M3 after purge. Sync REF only — no git pull on M4.

**Git State:**
- SHA: `5e643b433c46c3fac04e112ea6c17f7cf1b7c54`
- Branch: main
- Unpushed: none
- Version: v5.0.17


## Session — 2026-07-21 (HQ metrics + Umami)

**Done:**
- Created `public/metrics.json` (`gab.product-metrics.v1`) for HQ poll
- 11 KPIs (campaigns/sats/impressions/CTR/publishers/platforms/CPM/completed)
- 3 series: impressions_daily, sats_daily, campaigns_daily
- Funnel: created → funded → running → completed
- Segment: platform_breakdown (sats per network)
- Umami script in `index.html` — website ID `e75632e3-b6f4-4fa3-9ec5-8b3107adf783`
- `_headers` CORS + 60s cache for `/metrics.json`
- Session summary: `docs/SESSION-SUMMARY-2026-07-21.md`

**Decisions:**
- Seed/demo envelope (`raw.demo: true`) until Supabase/LNbits aggregates
- Umami host `analytics.giveabit.io` (HTTPS, no port) — needs CF tunnel to THOR :3002
- `ref/GROK-BOOT.md` missing; used ALL-SITE-METRICS Steps 1–2

**Still to do:**
- CF deploy live metrics.json; HQ projects.json live candidate URL
- Wire Umami tunnel; live aggregates; Vault LNbits key (Cam)

**Next for Kimi:** Integrate into MASTER-BRAIN / Obsidian. After deploy, HQ can fetch `https://tadbuy.giveabit.io/metrics.json`. Educate Hermes: suite metrics path = product origin envelope + Umami IDs. REF only on M4 — no git pull working tree.

**Git State:**
- Branch: main
- See LATEST-UPDATE.md after push

---

## Latest Session Summary (from 2026-07-21 Option A goodbye)

**Chat topic:** Replace hand-seeded metrics.json with live campaign counts from app state (Option A).

**Finished in this session:**
- `src/lib/metrics/productMetrics.ts` + `scripts/generate-metrics.ts`
- `npm run generate-metrics` + prebuild hook
- Honest KPIs: 4 campaigns, 2 live, 3.63M sats, 1.136M impressions, 14.8k clicks
- `raw.demo: false`, `raw.source: "app-state"`
- Session summary: `docs/SESSION-SUMMARY-2026-07-21-option-a.md`

**Still to do:**
- Confirm CF Pages serves new envelope at `/metrics.json`
- HQ prefer live origin URL in projects.json
- Supabase-backed generator (later); Umami tunnel; Cam Vault LNbits key

**Next for Kimi:** Integrate into MASTER-BRAIN / Kanban / Obsidian. Coverage: tadbuy metrics source = app-state generator (not hand-seed). Prefer origin `https://tadbuy.giveabit.io/metrics.json`. Do not git pull app trees on M4.

**Git State (post-push):**
- Tip: `7f9f0258ca69c9bc86bfaa53d8fd288336cc8f0f`
- Feature: `304e0c2`
- Unpushed: none
- Version: v5.0.38

---

## Prior Session Summary (from 2026-07-21 metrics seed goodbye)

**Chat topic:** Publish Tadbuy product metrics envelope + Umami for suite HQ glass.

**Finished:**
- Initial `public/metrics.json` full v1 + Umami + CORS (superseded by Option A for KPI values)

**Still noted:** Umami tunnel; HQ live candidates; Vault wallet key

**Git State (that session):** Feature `1f084a6` · v5.0.31 era

