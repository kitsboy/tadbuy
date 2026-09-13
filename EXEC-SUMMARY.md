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
Tadbuy is the world's first Bitcoin-native DSP. The campaign builder targets 8 platforms — Twitter/X, Facebook, Instagram, Nostr, YouTube, Reddit, LinkedIn, TikTok (`src/data/platforms.ts`). Payment rails: Lightning, Fedimint ecash, BOLT12, on-chain BTC, Nostr Zaps — **payments are in demo mode**: a campaign that cannot obtain a real invoice is saved as a draft instead of being marked paid, so no ad spend moves and no sats are custodied today. PPQ.AI optimization without surveillance pixels. **Global Reach** (`/geo`) — 25-market geo dashboard with map, insights, and CSV export.

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
- **i18n:** 8 locales wired (en/es/fr/de/pt/ja/zh/ar). Checked 2026-09-13: all eight carry the *same* 102 UI keys — full parity, no English fallback in any locale; RTL is applied for Arabic by `src/lib/i18n.ts` (`RTL_LANGS`), not by the locale file. The `_meta` block (language list, currency list, `rtl` marker) exists only in `en.json` and is not read by the app.
- **Quick-wins:** All 10 shipped (BackToTop, SkipToContent, Toast, OnlineIndicator, copy-link, EmptyState, BlockHeightTicker fallback, PriceTicker, OfflineBanner, LanguageSwitcher). PriceTicker shows the 24h change badge **only when the upstream API reports one** — it no longer generates a fallback percentage (removed 2026-09-13); see the open ticket on its price endpoint.
- **Phase 1 — API proxy is NOT live.** `https://api.giveabit.io` answered **HTTP 530 / Cloudflare error 1033** (tunnel or origin unreachable) when checked on 2026-09-13, and the site's `/pitch` page calls `/api/metrics` on its own origin, rendering “—” for every row it cannot measure. Do not describe this proxy as live until someone re-verifies it.
- **Phase 2 (parked):** Fedimint mint — blocked on the Fedi app ↔ Fedimint version gap. *(unverified — not checkable from the ops box)*
- **Phase 3 (parked):** Umbrel LND — node not reachable from the ops box, no channels funded. *(unverified — not checkable from the ops box)*

## Strategic Direction
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
