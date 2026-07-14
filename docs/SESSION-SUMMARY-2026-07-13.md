# Session Summary — 2026-07-13

**Project:** tadbuy  
**Agent:** Grok (M3)  
**Obsidian-friendly**

---

## Chat Topic

Recovered prior session context, shipped the v5.0.11–v5.0.17 feature pass, then fixed critical production outages where the live site showed only an orange background or a "Something went wrong" error on the homepage.

## Key Things We Did

- `/whatsup` recovery — continued roadmap ship (platforms hub, NIP-98, Hubhash, PageShell, E2E, SEO)
- Diagnosed blank site: JS bundles missing on Cloudflare; SPA fallback served `index.html` as JavaScript
- Diagnosed homepage crash: CDN cached poisoned HTML-as-JS (especially with `Origin` header on ES module imports)
- Shipped infra hardening: service worker content-type guard, boot-fallback UI, postbuild `verify-dist`, `check-origin-cache`
- Cache-bust: all Vite outputs now suffixed `-cb3.js`; asset cache TTL shortened to 5 min (no immutable)
- Verified homepage live; wrote TUI handoff for Kimi

## What We Finished

- [x] v5.0.11–v5.0.17 feature batches pushed to `main` (prior pass in session)
- [x] Blank overlay / invisible UI — root cause identified and mitigated
- [x] Homepage RouteErrorBoundary crash — fixed on production (`-cb3` build)
- [x] `public/sw.js` v5.0.21, `index.html` boot-fallback, `scripts/verify-dist.mjs`
- [x] `npm run check:prod-cache` for CDN poisoning detection
- [x] E2E: 6/6 passing locally
- [x] TUI handoff + goodbye docs committed

## What We Are Still Aiming to Finish

- [ ] **Kimi: purge all CDN cache** for `tadbuy.giveabit.io` (critical)
- [ ] **Kimi: verify CF Pages uploads full `dist/assets/`** (partial deploys caused incident)
- [ ] `/marketplace` — `Marketplace-BfNJB2j5-cb3.js` missing on origin (1 of 70 chunks)
- [ ] Real Lightning / Umbrel LND (Rosa `t_46208fbe`)
- [ ] Fedimint mint (Andrea `t_8ee7c976`)
- [ ] Full Supabase Auth migration (scaffold only; Firebase login still active)
- [ ] `ENABLE_LN_PAYOUTS=true` needs wallet ledger first

## Update / Status

As of **2026-07-13**, Tadbuy is **v5.0.17** on `main`, SHA `f429f8a`. Live homepage at https://tadbuy.giveabit.io/ renders the Buy Ads wizard. The outage was infrastructure (Cloudflare partial deploy + poisoned CDN cache), not a React overlay bug. Users with stale service worker or browser cache may need a hard refresh (`Cmd+Shift+R`).

## Key Decisions / Notes

- Not a motion/opacity UI bug — JS never loaded or lazy chunks returned HTML
- `immutable` 1-year asset caching made poison permanent; replaced with 5-min `must-revalidate`
- M3 codes and pushes; M4 is REF/ops only — no git pull on M4
- `npm run check:prod-cache` should run after every CF deploy

## Mission Tie-in

Tadbuy stays live as Give A Bit's Bitcoin-native DSP. Fixing deploy/CDN reliability keeps advertisers able to buy ads in sats without surveillance — core to the giveabit.io mission.