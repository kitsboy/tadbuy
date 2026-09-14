# Tadbuy Distribution Roadmap

**Updated:** 2026-09-14
**Product decision:** Combine campaign coordination with a publisher/vendor placement marketplace.

## North-star product

> **One campaign. Independent distributors. Transparent proof.**

An advertiser creates one campaign plan in Tadbuy. The plan identifies the desired audience, creative, budget, and distribution channels. Independent vendors choose the placements they control, publish or display the campaign through their own accounts or properties, and submit delivery proof. Tadbuy coordinates the relationship and reports what was planned, accepted, published, and verified.

Tadbuy must never imply that it automatically posts to or buys inventory from a third-party platform until the provider permission, account connection, execution path, and reporting contract are real.

## Product roles

- **Advertiser:** Creates the campaign, supplies the creative, chooses the audience and budget, and approves the distribution plan.
- **Vendor / publisher:** Lists inventory, accepts placements, controls the publishing account or property, and submits proof.
- **Channel:** Nostr, a website, a newsletter, a podcast, Reddit, Meta, Google/YouTube, Spotify, Pinterest, LinkedIn, TikTok, or future DOOH.
- **Tadbuy:** Matches demand to inventory, explains fees, tracks status, stores proof, and eventually coordinates verified settlement.

## Phased roadmap

### Phase 1 — Accountable direct distribution (now)

**Channels:** Nostr, independent websites/blogs, newsletters, podcasts.

**Delivery modes:**

- Nostr: NIP-07 browser signing and relay publication for an advertiser-approved sponsored note.
- Websites/blogs/newsletters/podcasts: vendor-assisted placements, negotiated and published by the vendor.

**MVP user flow:**

1. Advertiser chooses campaign objective, budget, audience, creative, and Phase 1 channels.
2. Tadbuy shows the distribution plan before payment: selected channels, execution mode, expected proof, and what is not automated.
3. Advertiser can sign and publish the Nostr note with a NIP-07 extension; private keys never enter Tadbuy.
4. Advertiser or vendor selects inventory from the marketplace and agrees on a placement.
5. Vendor publishes through the channel they control and submits URL/screenshot/date or episode evidence.
6. Tadbuy reports planned, accepted, published, and verified delivery.

**Phase 1 success gates:**

- No fabricated reach, CTR, vendor earnings, or settlement claims.
- Nostr event ID and relay acknowledgements are stored when publication succeeds.
- Vendor inventory has a channel, format, audience description, price, and proof requirements.
- Campaigns remain draft/pending until a real payment and backend settlement path exists.

### Phase 2 — Community distribution (pilot foundation shipped)

**Channel:** Reddit, beginning with vendor-assisted community and creator placements.

**Shipped foundation:** Advertisers can request eligible vendor-assisted placements; vendors can accept or decline, mark a placement published, submit URL/screenshot/date/notes as proof, and review the proof record. The current pilot uses browser-local records and does not activate payment or Reddit API automation.

**Operational gates before a live pilot:** Confirm approved communities and vendors, durable authenticated storage, ownership and moderation rules, sponsorship disclosure, cancellation/refund/dispute policy, and a real proof-review process.

Evaluate Reddit Ads API campaign execution and reporting only after provider approval, policy review, and a real account connection. Community rules and disclosure remain mandatory.

### Phase 3 — Provider-managed networks

**Channels:** Meta (Facebook + Instagram), Google/YouTube, Spotify, Pinterest.

Treat Meta as one integration. Start YouTube with creator sponsorships before Google Ads execution. Each provider requires OAuth/account permissions, policy handling, spend reconciliation, and provider campaign IDs before being described as automated.

### Phase 4 — Specialist premium channels

**Channels:** LinkedIn and TikTok.

- LinkedIn is a premium B2B channel for enterprise advertisers and lead campaigns.
- TikTok is a specialist short-form video channel, not an early Tadbuy dependency. It requires careful creative, policy, and provider-access review.

### Phase 5 — Digital out-of-home / large screens

Create a separate screen-owner marketplace rather than pretending there is one universal screen API. A screen vendor lists location, format, operating hours, audience estimate, price, and playback proof. Later, connect to programmatic DOOH supply such as Broadsign/Place Exchange after contracts and measurement are available.

**Required DOOH proof:** playback logs plus independent audience measurement. A screen showing an ad is not the same as a verified human impression.

## Phase 1 data model direction

A campaign needs:

- `distributionChannels`: selected channel IDs.
- `platforms`: execution or buying platforms where applicable.
- Vendor placement records: channel, vendor, inventory, price, status, and proof requirements.
- Delivery states: `planned` → `offered` → `accepted` → `published` → `proof_submitted` → `verified`.
- Nostr publication receipt: signed event ID and acknowledged relay URLs.
- Payment state kept separate from delivery state.

## Business model

- Advertiser pays a clearly itemized campaign/coordination fee.
- Vendor sets or accepts the placement price.
- Tadbuy earns a coordination or marketplace commission when the real payment and settlement ledger are connected.
- Until that backend exists, the public UI must label payment, campaign activation, and payouts as staged or demo.

## Design and quality bar

- Mobile-first: one clear decision per screen, 44px touch targets, no dense tables as the only view, sticky actions that do not cover content.
- Desktop: spacious hierarchy, clear plan summary, high-signal metrics, and no decorative numbers presented as measurement.
- Accessible: keyboard-operable channel cards, visible focus, semantic labels, reduced-motion support, and readable contrast.
- World-class means clarity first: a beautiful interface should make the business relationship easier to understand, not hide uncertainty.

## External research anchors

- Reddit Ads API: https://ads-api.reddit.com/docs/v3/api/reddit-advertising-api
- Meta Marketing API: https://developers.facebook.com/documentation/ads-commerce/marketing-api
- Google Ads campaigns: https://developers.google.com/google-ads/api/docs/campaigns/overview
- Spotify Ads API: https://developer.spotify.com/documentation/ads-api
- Pinterest Ads API: https://developers.pinterest.com/usecase/ads/
- Broadsign / Place Exchange DOOH: https://www.placeexchange.com/

---
*Part of the [Give A Bit](https://giveabit.io) family. See `docs/KIMI-HANDOFF.md` for the current agent handoff.*
