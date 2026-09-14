---
title: Executive Summary
project: Tadbuy
audience: investors
phase: BETA
last_reviewed: 2026-09-13
release_version: from package.json (mirrored into the live footer on every build — never restated in this file)
owner: Give A Bit
---

# Tadbuy — Executive Summary

> **This is a hand-reviewed summary, not a generated document.** Volatile facts
> — release version, live counters, service reachability — are deliberately not
> restated here: each one names the source that owns it. Every status line below
> was checked against the live system on 2026-09-13; anything that could not be
> checked from this machine is marked *(unverified)*.

## Problem
Digital advertising runs on surveillance capitalism — banks, credit cards, 20–40% platform fees, and tracking pixels everywhere.

## Solution
Tadbuy is a Bitcoin-native advertising marketplace connecting advertisers with independent vendors. Phase 1 coordinates Nostr, websites, newsletters, and podcasts: advertisers plan once, vendors publish through channels they control, and delivery proof is explicit. Reddit, Meta, Google/YouTube, Spotify, Pinterest, LinkedIn, TikTok, and digital out-of-home are later phases. Payment rails remain in demo/staged mode: a campaign that cannot obtain a real invoice is saved as a draft instead of being marked paid, so no ad spend moves and no sats are custodied today. PPQ.AI helps adapt creative without surveillance pixels; **Global Reach** (`/geo`) provides a 25-market geo dashboard.

## Traction
No measured traction counters are published yet. The platform is in BETA with
payments in demo mode, and unmeasured figures are rendered as “—” rather than
estimated. Live counters, when available, come from /api/metrics.

## Current Status (BETA)
- **UI:** Live at https://tadbuy.giveabit.io (Cloudflare Pages). Release version is machine-generated into the footer from `package.json` on every build — read it there rather than trusting a copy.
- **Navbar:** Componentized (`BrandMark`, `MoreMenu`, `MobileDrawer`). Desktop labels at 1280px+; hamburger drawer below.
- **Global Reach:** https://tadbuy.giveabit.io/geo — 25-market dataset, world map, insights, CSV export.
- **SPA routing:** Fixed — nav clicks update content immediately
- **Security:** Hardened — CSP headers, URL sanitization, open-redirect protection, SafeLink component
- **i18n:** 8 locales wired (en/es/fr/de/pt/ja/zh/ar). Checked 2026-09-13: the eight locale files carry the *same* 102 keys — no locale is missing a key another has (this is key-set parity only; it does not assert that no component hardcodes English). RTL is applied for Arabic by `src/lib/i18n.ts` (`RTL_LANGS`), not by the locale file. The `_meta` block (language list, currency list, `rtl` marker) exists only in `en.json` and is not read by the app.
- **Quick-wins:** All 10 shipped (BackToTop, SkipToContent, Toast, OnlineIndicator, copy-link, EmptyState, BlockHeightTicker fallback, PriceTicker, OfflineBanner, LanguageSwitcher). PriceTicker renders BTC spot from the single live source (`mempool.space/api/v1/prices`, via App) and shows “—” when a value is unavailable; it never invents a 24h change chip (the old `Math.random()` fallback was removed 2026-09-13).
- **Phase 1 — API proxy is NOT live.** `https://api.giveabit.io` answered **HTTP 530 / Cloudflare error 1033** (tunnel or origin unreachable) when checked on 2026-09-13, and the site's `/pitch` page calls `/api/metrics` on its own origin, rendering “—” for every row it cannot measure. Do not describe this proxy as live until someone re-verifies it.
- **Phase 2 (parked):** Fedimint mint — blocked on the Fedi app ↔ Fedimint version gap. *(unverified — not checkable from the ops box)*
- **Phase 3 (parked):** Umbrel LND — node not reachable from the ops box, no channels funded. *(unverified — not checkable from the ops box)*

## Strategic Direction

- **Product:** advertiser campaign coordination plus an independent publisher/vendor placement marketplace.
- **Phase 1:** NIP-07 Nostr publishing, plus vendor-assisted websites, newsletters, and podcasts.
- **Later:** Reddit community/API work; Meta, Google/YouTube, Spotify, Pinterest; specialist LinkedIn/TikTok; then DOOH screen inventory.
- **Truth rule:** no automatic provider execution, live reach, vendor payout, or settlement claim without real access and verified records.
- **Code & deploys:** the family's own machines — no third-party PaaS, no managed host holding keys.
- **M4-hosted services** (Fedimint guardian, API proxy, Umbrel, Fedi gateway) are only as available as that machine is; the API proxy is currently down (see Phase 1).
- **Not using:** Railway/Fly.io.

## Market
Bitcoin businesses, independent creators, Nostr communities, privacy-conscious brands.

## Team
Give A Bit family — Cam (founder, product) with the in-house agent team covering ops, code, design, legal, research and product.

## Ask
Strategic Bitcoin/Lightning infrastructure partners. Fedimint federation guardians.

## Setup
- M3 checklist: [docs/SETUP-GUIDE.md](./docs/SETUP-GUIDE.md)
- Kimi M4: [docs/KIMI-M4-SETUP-CHECKLIST.md](./docs/KIMI-M4-SETUP-CHECKLIST.md)
- Obsidian (M4): `MASTER-BRAIN/Obsidian/03-Projects/M3/Tadbuy/M4-SETUP-CHECKLIST.md`

---

**Safe Harbour:** Informational purposes only. Not financial or investment advice.  
Part of the [Give A Bit](https://giveabit.io) family.
