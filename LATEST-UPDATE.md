# tadbuy — Last Updated 2026-08-28 by Grok

Brief: v5.0.125 — Navbar facelift, complete component replacement, responsive redesign
Commit: aef5b44

## What Changed
- **NEW `src/components/Navbar.tsx`** — complete replacement for legacy Header component
  - Desktop: Brand | Dropdown (Campaigns) + direct links (Marketplace/Campaigns/Metrics/Wallet/Dashboard) | Utility (currency, search, BTC chart, theme, lang, notifications, profile)
  - Mobile: Hamburger menu with sectioned drawer (6 primary + 6 "More Tools") + sticky action bar
  - Hover-activated dropdowns with motion animations
  - 44px minimum touch targets throughout
  - Full keyboard navigation and ARIA compliance
- Removed legacy Header function from App.tsx (was ~200 lines of inline markup)
- All imports cleaned (removed unused icons: ChevronDown → ChevronDown, MoreHorizontal, Zap)
- Footer unchanged but now uses `<Footer />` named import correctly

## Build Status
- TypeScript lint: clean
- Build: 74 JS chunks verified
- Post-build verification: passed

## Files Changed
- `src/App.tsx` (replaced Header with Navbar import)
- `src/components/Navbar.tsx` (new file)

Docs synced: 2026-08-28
