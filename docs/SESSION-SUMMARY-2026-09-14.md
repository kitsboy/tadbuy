# Tadbuy — Multi-channel marketplace plan

**Updated:** 2026-09-14
**Status:** Phase 2 community-distribution foundation shipped; durable marketplace, owned inventory, and NIP-05 evidence groundwork are now implemented on M3. Supabase migration and THOR operational approval remain required before a live pilot.

## What changed

- Tadbuy is now positioned as an advertiser + independent vendor marketplace, not an already-automated universal DSP.
- Full Control campaign creation has a dedicated Distribution step.
- Phase 1 starts with Nostr, websites/blogs, newsletters, and podcasts.
- Phase 2 now has a vendor-assisted community placement pilot foundation, with Reddit selectable only through a controlled vendor/manual path.
- Nostr uses a user-controlled NIP-07 signer and relay acknowledgements.
- Websites, newsletters, podcasts, and community placements remain vendor-assisted until listings, agreements, proof, and backend records exist.
- Meta, Google/YouTube, Spotify, Pinterest, LinkedIn, TikTok, and digital signage remain later roadmap phases.

## Finished this session

- Added `src/data/distributionChannels.ts` with channel maturity, execution mode, phase, and proof requirements; Reddit is now explicitly vendor-assisted/manual for Phase 2.
- Added `src/components/buyads/DistributionPlan.tsx` with responsive channel selection and Nostr launch action.
- Added NIP-07 campaign-note signing and multi-relay publication in `src/services/nostrService.ts`.
- Added `distributionChannels` and `nostrPublication` to campaign data types and validated server input.
- Stored the distribution plan in campaign drafts and campaign creation payloads.
- Added `relay.snort.social` to the CSP WebSocket allowlist.
- Made Nostr the default execution/distribution choice for a new campaign.
- Updated product language in the hero, onboarding, campaign creative, docs metadata, and pitch page to remove unsupported automatic-delivery claims.
- Added `docs/DISTRIBUTION-ROADMAP.md` and replaced the stale improvement roadmap with the approved phased plan.
- Added advertiser **Request placement** flow for vendor-assisted marketplace inventory.
- Added browser-local placement records and the lifecycle `offered → accepted → published → proof_submitted → verified`.
- Added vendor inbox controls, delivery-proof fields, and a browser-local vendor profile with NIP-05/npub, Lightning Address, audience, geography, and channel permissions.
- Added durable authenticated server routes and `supabase-vendor-marketplace.sql` for vendor profiles, owned inventory, and placement requests.
- Added owner-controlled inventory creation/editing with draft, published, and paused states; published listings merge into Marketplace.
- Added server-derived vendor ownership, durable lifecycle transitions, and role checks for vendor actions versus advertiser proof review.
- Added NIP-19 npub decoding and read-only NIP-05 resolver evidence with explicit UI states; no blanket trust claim is created.

## Next work

1. Kimi/THOR: apply and review `supabase-vendor-marketplace.sql`, configure server-only Supabase credentials, and confirm the API origin/backup path.
2. Receive Kimi’s confirmed pilot communities, identities, moderation rules, and Otto/Grok Bot/sub-agent assignments.
3. Complete manual approval and identity policy before opening public vendor onboarding.
4. Add cancellation, refund, dispute, and settlement ledger controls before any real campaign payment or payout.
5. Test NIP-05 resolution and Nostr publication with approved identities and an unlocked signer.
6. Evaluate a controlled Reddit provider/API connection only after provider access, policy, account, and reporting gates are satisfied.

## Product rules

- Never call a channel automated without provider permission, execution access, and verified reporting.
- Never equate a published Nostr event or vendor proof record with impressions, clicks, or conversions.
- Keep payment state separate from distribution and delivery state.
- Keep `api.giveabit.io` retired until a durable origin exists.
- M3 owns code; THOR owns operations and Kimi/HERMES coordination.
- Browser-local pilot data is for workflow validation only, not live marketplace settlement.

## Git and verification

- Feature commits: `be2f362`, `67ad9ff`, `7802b3b` (pending push).
- Typecheck, route integrity, production build/dist verification, bundle check, full E2E **12/12**, and diff check passed.
- Generated docs/metrics and the pre-existing local `public/sw.js` change remain intentionally excluded from the feature commits.

*Safe Harbour · Part of the [Give A Bit](https://giveabit.io) family.*
