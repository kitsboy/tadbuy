# Changelog

All notable changes to Tadbuy are documented here.

## [5.0.14] — 2026-07-13

### Added
- Full NIP-98 BIP-340 schnorr signature verification (`@noble/secp256k1`)
- Hubhash escrow API + refund flow UI (`/api/hubhash/*`)
- Playwright E2E suite: buy flow, platforms hub, compare (`npm run test:e2e`)
- Sitemap + locale SEO for `/platforms` and all 8 platform guides

### Changed
- PageShell uniformity: Health, Beta, Hubhash, ApiReference, Bolt12, Enterprise, Intelligence, Changelog, Dashboard, Campaigns, Marketplace
- Hubhash campaigns use central data module with sats-first display

## [5.0.11] — 2026-07-13

### Added
- `/platforms` hub and per-platform budget/payout guides (`/platforms/:slug`)
- Central `platforms.ts` data module (CPM, billing model, min spend, payout rules)
- `PageShell`, `FeeBreakdown`, `PlatformWeightAllocator` shared components
- Budget allocator in Buy Ads (even split, custom weights, PPQ-optimized)
- Campaign `PATCH /api/campaigns/:id/status` for pause/live persist
- CSV export (Google Sheets import) on Campaigns page
- JSON-LD FAQ/Breadcrumb structured data via `PageJsonLd`
- Supabase browser client scaffold (`src/lib/supabaseClient.ts`)
- Playwright `@playwright/test` dev dependency

### Changed
- Site uniformity pass: Wallet, Settlements, Compare, Integrations, PPQ, Docs, Case Studies
- Marketplace platform tabs aligned with social + publisher taxonomy
- Server v1 stub APIs return explicit `{ demo: true }`
- Integrations cards show honest Live/Beta/Planned status
- Wallet on-chain tab shows deposit address (staged until Umbrel sync)

### Unchanged (infra blockers)
- Real Lightning/Fedimint still require Umbrel + Fedi guardian updates on M4
- Full Supabase Auth migration still TODO (scaffold only)

## [5.0.6] — 2026-07-07

### Changed
- Version alignment after pre-push auto-bump; auto-generated docs synced to v5.0.6

## [5.0.5] — 2026-07-07

### Changed
- Full documentation sync for v5.0.4 features (/geo, routing fix, batches 15–24)
- Auto-generated docs: EXECUTIVE, BETA, GEO, locale SEO, context maps, sitemap

## [5.0.4] — 2026-07-06

### Added
- **Global Reach (/geo)** — 100 enhancements (batch 24): 25 markets, interactive map, filters, insights, CSV export, compare, FAQ
- Geo page API routes (`/api/geo/page/*`) in batch24
- Buy Ads `?geo=CODE` handoff from geo page
- `docs/GEO-PAGE-100.md` and `docs/GEO.md` manifests
- Full documentation sync: EXEC-SUMMARY, locale SEO, context maps, sitemap, KIMI-HANDOFF

### Fixed
- **SPA routing** — URL changes now update page content immediately (`unstable_useTransitions={false}`)
- Desktop nav clicks blocked by More-menu fullscreen backdrop
- Search chip opens command palette via CustomEvent (not synthetic keyboard events)
- Service worker navigation uses network-first for HTML

## [5.0.3] — 2026-07-06

### Added
- 85 enhancements (batches 15–23): health page, analytics, marketplace auctions, SEO pages, mobile polish
- Auto version bump on git push (pre-push hook)
- 13 workflow audit fixes (Quick Launch, Full Control wizard, auth gate)

## [5.0.0-PLATINUM] — 2026-07-06

### Added — 200 enhancements (batches 7–14)
- **Batch 7:** Premium UI primitives — Badge, Skeleton, Tabs, Progress, Alert, Chip, Switch, Spinner, EmptyState, StatCard, Divider
- **Batch 8:** React hooks — useDebounce, useMediaQuery, useIntersectionObserver, useKeyboardShortcut, usePrefersReducedMotion, useOnlineStatus, useCopyToClipboard, useDocumentTitle
- **Batch 9:** Analytics widgets — ConversionFunnel, RetentionChart, GeoHeatmap, PlatformBreakdown, RevenueForecast
- **Batch 10:** Campaign wizard polish — Chips, Progress bars, AI badges, StatCard summary, celebration SuccessScreen
- **Batch 11:** Publisher & Marketplace — Tabs, Chip filters, Skeleton loading, GeoTargeting badges
- **Batch 12:** Wallet & Payments — Tabs, Alert status, Fedimint/Lightning Progress, settlement badges
- **Batch 13:** API & Agent tools — ApiReference Tabs, method badges, expanded CommandMenu, agent manifest v2
- **Batch 14:** Docs sync, v5 release APIs, favicon.svg restored, version bump across codebase

### Changed
- Button variants: ghost, outline, danger, icon size
- Modal: escape key, backdrop blur, focus trap, size variants
- HeroBanner uses StatCard and Badge components
- Metrics and Intelligence pages use tabbed widget layouts
- Version: v4.4.0-ELITE → **v5.0.0-PLATINUM** (350 total enhancements)

### Fixed
- Restored `public/favicon.svg` (was deleted)
- React 19 typing for UI primitives
- Server batch route registration (8–14)

## [4.1.0] — 2026-07-03

### Added
- Premium hero banner, trust badges, and live stats bar on homepage
- Scroll progress indicator and back-to-top button
- Skip-to-content accessibility link
- Full SEO meta tags, Open Graph, Twitter Cards, and JSON-LD structured data
- OG image (`public/og-image.svg`) for social sharing
- Service worker registration for PWA offline resilience
- `usePageMeta` hook for per-page meta descriptions
- Platform marquee showcasing all 8 ad networks
- Mobile floating campaign CTA
- Safe-area inset support for iOS notch devices
- Reduced-motion and pause-on-hover for price ticker

### Changed
- README, CONTRIBUTING, MARKETING-ONELINER updated with real Tadbuy content
- Footer responsive padding for mobile
- 404 page responsive typography
- Manifest theme colors aligned with app design system
- Button tactile feedback with active scale states

### Fixed
- Missing `og-image.svg` referenced in manifest and sitemap
- Placeholder documentation templates replaced with project-specific content

## [4.0.0] — 2026-06-06

### Added
- 20-point enterprise roadmap implementation
- Give A Bit branding integration
- Lightning/AI integration with server-side Gemini proxy
- Firebase auth safe initialization (`getSafeAuth()`)
- 8-language i18n support
- Campaign builder with A/B testing, geo targeting, PPQ.AI

### Fixed
- Black screen / `document is not defined` Firebase SSR errors
- `onAuthStateChanged of undefined` auth provider crash

## [0.1.0] — 2026-03-01

### Added
- Initial Tadbuy scaffold from AI Studio template