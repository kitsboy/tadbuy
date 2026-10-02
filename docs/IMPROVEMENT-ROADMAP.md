# Tadbuy — Improvement Roadmap

**Updated:** 2026-10-01
**Current direction:** advertiser + independent vendor marketplace

## Product direction

> **One campaign. Independent distributors. Transparent proof.**

Tadbuy helps advertisers plan campaigns and buy placements from independent vendors across selected channels. Vendors publish through the accounts or properties they control and submit delivery proof. Tadbuy coordinates the relationship, status, reporting, and—once the backend ledger is ready—settlement.

Tadbuy should not describe a channel as automatically connected until its provider permissions, account connection, execution path, and reporting are implemented and verified.

## Current cycle — Phase 1

### P0 — Clear user flow

- [x] Add a dedicated Distribution step to Full Control campaign creation.
- [x] Default the first campaign plan to Nostr.
- [x] Show execution mode and proof requirements before payment.
- [x] Keep delivery state separate from payment state.
- [x] Persist selected distribution channels in campaign drafts.
- [ ] Add vendor placement records and offer/accept workflow.
- [ ] Add proof submission for URLs, screenshots, dates, and episode timestamps.
- [ ] Add the delivery timeline: planned → offered → accepted → published → proof submitted → verified.

### P1 — Nostr pilot

- [x] Support browser-controlled NIP-07 signing.
- [x] Publish sponsored campaign notes to configured relays.
- [x] Surface relay acknowledgements and the event ID.
- [ ] Add NIP-05 identity/profile connection for vendors and advertisers.
- [ ] Add a small approved relay set and clear failure/retry handling.
- [ ] Add vendor moderation and disclosure rules.
- [ ] Verify the Nostr pilot with Give A Bit, Satohash, MotoPass, and other approved ecosystem accounts.

### P2 — Direct publisher inventory

- [ ] Create vendor profiles with channel, format, audience, geography, price, availability, and proof requirements.
- [ ] Let vendors list websites, newsletters, podcasts, and Nostr inventory.
- [ ] Let advertisers request or purchase a placement without implying automatic publication.
- [ ] Add vendor acceptance, cancellation, revision, and dispute states.
- [ ] Keep inventory and performance claims partner-owned and evidence-backed.

## Channel roadmap

### Phase 1 — Now

- **Nostr:** NIP-07 publication with relay acknowledgements.
- **Websites and blogs:** vendor-assisted placement.
- **Newsletters:** vendor-assisted sponsorship.
- **Podcasts:** vendor-assisted host-read, pre-roll, or mid-roll placement.

### Phase 2 — Community distribution

- **Reddit:** begin with approved community and creator placements; investigate Ads API execution only after provider access, policy review, and reporting are real.

### Phase 3 — Provider-managed networks

- **Meta:** Facebook and Instagram as one integration.
- **Google/YouTube:** begin with creator sponsorships, then evaluate Google Ads API campaigns.
- **Spotify:** evaluate audio inventory and reporting.
- **Pinterest:** evaluate visual campaign execution.

Every provider integration needs OAuth/account permissions, policy handling, spend reconciliation, provider campaign IDs, and verified reporting.

### Phase 4 — Specialist channels

- **LinkedIn:** premium B2B and lead-generation inventory.
- **TikTok:** specialist short-form video and creator inventory.

These are valuable later, but should not delay the Phase 1 marketplace.

### Phase 5 — Digital out-of-home

Build a separate screen-owner marketplace for large displays. A listing should include location, format, operating hours, audience estimate, price, and playback evidence. Later, evaluate programmatic DOOH partners such as Broadsign or Place Exchange only after contracts and measurement are available.

Playback is not the same as a verified human impression; DOOH reporting must preserve that distinction.

## Business model

1. Advertiser creates one campaign and distribution plan.
2. Vendor lists or accepts a placement it controls.
3. Tadbuy coordinates creative, timing, status, proof, and reporting.
4. Advertiser pays an itemized campaign or coordination fee when a real payment rail is connected.
5. Tadbuy earns a marketplace commission or coordination fee.
6. Vendor settlement and payouts remain staged until a persisted backend ledger, refunds/disputes flow, and verified payment controls exist.

## Data and trust requirements

- Campaign distribution channels are explicit and stored with the draft.
- Vendor placement records include channel, vendor, inventory, price, status, and proof requirements.
- Payment status never implies delivery status.
- Nostr receipts store the signed event ID and acknowledged relay URLs.
- Reach, impressions, CTR, earnings, and settlement must come from real records—not decorative or fabricated numbers.
- Public copy must distinguish live, vendor-assisted, staged, and future capabilities.

## Design quality bar

- Mobile-first layouts with one clear decision per screen.
- Minimum 44px touch targets and visible keyboard focus.
- Responsive cards that remain readable without dense desktop tables.
- Desktop layouts with generous hierarchy and a clear plan summary.
- Reduced-motion support and readable contrast.
- Sticky actions must never cover essential content.
- World-class means the interface makes the business relationship understandable; it must not hide uncertainty behind decoration.

## UI/UX workstream

*Added 2026-10-01. Five proposals surfaced by the art theme audit and routed here from
`docs/KIMI-HANDOFF.md` so they sit next to the product roadmap. **None are started** — this is a
menu for Cam/Kimi to pick from. None require a backend, payment, provider, secret, or deploy
change, so each is a self-contained batch an LLM can execute without a product gate.*

### 1. PageShell everywhere — 11 of 31 pages still bypass it

`PageShell` provides breadcrumbs, a consistent H1 scale, copy-link, optional FAQ JSON-LD,
`BreadcrumbList` JSON-LD, the demo badge, and the illustration slot. Eleven pages hand-roll their
own header: `BuyAds`, `CampaignAnalytics`, `DebugLightning`, `GeoTargeting`, `Metrics`,
`NotFound`, `Pitch`, `Profile`, `ProfileSettings`, `PublisherPortal`, `ThankYou`.

- [ ] Convert the remaining 11 pages, choosing `maxWidth` and breadcrumbs deliberately per page.
- [ ] Prioritise `/` (BuyAds) and `/metrics` — the latter is both the most-stalled route in
      production and one of the two heaviest chunks.
- [ ] Verify JSON-LD coverage stops depending on which page author remembered to hand-roll it.
- Low risk, mechanical; highest leverage of the five.

### 2. Persistent demo/staging banner — trust, not decoration

The product is strictly demo-only (no live payments), and `DemoModeBadge` / `AccountPreviewBanner`
exist but are per-page and easy to miss. One banner (session-dismissable, `role="status"`, never
covering content per the design quality bar) stating "demo data, no live payments" would make the
posture unmissable on `/`, `/campaigns`, `/wallet`, `/settlements`, `/analytics`, `/dashboard`.

- [ ] Cam approves the exact wording (this is a product statement, not just an implementation).
- [ ] Session-dismissible, never covers essential content, survives navigation.
- Highest trust-per-line of the five, and it guards the worst failure mode for a payments-shaped product.

### 3. Light theme as real tokens, not scattered overrides

`src/index.css` carries 8 separate `[data-theme="light"]` blocks and the `--color-*` tokens in
`@theme` never swap — light mode works only because specific utilities are re-skinned. That is why
the illustration kit needed its own `--art-*` variables, and why any new component can silently
land dark-only.

- [ ] Consolidate to semantic tokens (`--surface-1/2`, `--text-primary/secondary`, `--border`) that
      swap in one place; keep `--art-*` as the proven special case.
- [ ] Convert one theme at a time, re-running `npm run check:art-themes` as the guard.
- [ ] Extend the contrast sweep beyond the illustration kit to real page text and controls.
- Medium risk: this is a visual regression surface across every page.

### 4. Illustration coverage — extend and rebalance

22 of 31 pages carry header art; the `sm:`/`lg:` gates intentionally hide it on mobile. Gaps:
pages that reached `EmptyState` art but not header art, and `/` plus the highest-traffic marketing
pages carry no scene. Separately, long-form pages (`/docs`, `/pitch`, `/enterprise`) may read as
walls of text — worth testing whether one scene per *section* beats one per page header.

- [ ] Close the header-art gaps.
- [ ] Trial per-section art on one long-form page and judge it.
- [ ] Verify with `npm run check:art-themes` (already covers all six scenes and both gates).
- Low risk.

### 5. Fix the two heaviest routes before adding features

`/metrics` and `/pitch` are the only routes that stalled in **both** production verification
rounds, and they are also the two heaviest chunks (`jspdf` / `autotable` on `/metrics`). The
correlation is consistent enough to act on even though the root cause is still unconfirmed.

- [ ] Lazy-load the PDF export behind an explicit user action.
- [ ] Confirm the initial route chunk is preloaded (the open root-cause candidate).
- [ ] Manually verify export still works end to end.
- Medium risk: touches the export path people actually use.

### Standing UI constraints

- Every UI batch ships with `npm run lint`, `npm run check:routes`, `npm run build`, and
  `npm run check:art-themes` green.
- Art color changes are gated per-shape across all four theme combos — do not lower the thresholds
  to make a shape pass.
- Theme colors belong in tokens, not inline hexes in components.

## Verification gates

Before calling Phase 1 ready:

- `npm run lint`
- `npm run check:routes`
- `npm run build`
- `npm run check:bundle` when available
- `CI=true npm run test:e2e`
- `git diff --check`
- Manual mobile and desktop review of the campaign flow
- Manual NIP-07 test with a browser signer and configured relay set

## Related documents

- [Distribution roadmap](./DISTRIBUTION-ROADMAP.md)
- [Session summary](./SESSION-SUMMARY-2026-09-14.md)
- [Kimi handoff](./KIMI-HANDOFF.md) — see the 2026-10-01 top entry for the five UI proposals
  and the open stall/push-URL threads

---
*Part of the [Give A Bit](https://giveabit.io) family.*
