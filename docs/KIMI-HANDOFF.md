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