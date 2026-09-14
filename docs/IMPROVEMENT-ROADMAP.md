# Tadbuy — Improvement Roadmap

**Updated:** 2026-09-14
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
- [Kimi handoff](./KIMI-HANDOFF.md)

---
*Part of the [Give A Bit](https://giveabit.io) family.*
