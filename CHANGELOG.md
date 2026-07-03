# Changelog

All notable changes to Tadbuy are documented here.

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