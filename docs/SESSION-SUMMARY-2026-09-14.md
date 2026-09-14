# Tadbuy — Multi-channel marketplace plan

**Updated:** 2026-09-14
**Status:** Phase 1 started on M3; Nostr-first distribution UI and NIP-07 publishing path are in code.

## What changed

- Tadbuy is now positioned as an advertiser + independent vendor marketplace, not an already-automated universal DSP.
- Full Control campaign creation has a dedicated Distribution step.
- Phase 1 starts with Nostr, websites/blogs, newsletters, and podcasts.
- Nostr uses a user-controlled NIP-07 signer and relay acknowledgements.
- Websites, newsletters, and podcasts are vendor-assisted until listings, agreements, proof, and backend records exist.
- Reddit, Meta, Google/YouTube, Spotify, Pinterest, LinkedIn, TikTok, and digital signage are roadmap phases.

## Finished this session

- Added `src/data/distributionChannels.ts` with channel maturity, execution mode, phase, and proof requirements.
- Added `src/components/buyads/DistributionPlan.tsx` with responsive channel selection and Nostr launch action.
- Added NIP-07 campaign-note signing and multi-relay publication in `src/services/nostrService.ts`.
- Added `distributionChannels` and `nostrPublication` to campaign data types and validated server input.
- Stored the distribution plan in campaign drafts and campaign creation payloads.
- Added `relay.snort.social` to the CSP WebSocket allowlist.
- Made Nostr the default execution/distribution choice for a new campaign.
- Updated product language in the hero, onboarding, campaign creative, docs metadata, and pitch page to remove unsupported automatic-delivery claims.
- Added `docs/DISTRIBUTION-ROADMAP.md` and replaced the stale improvement roadmap with the approved phased plan.

## Next work

1. Test NIP-07 publication in Chromium with a real unlocked signer and verify relay acknowledgements.
2. Add vendor profiles: npub/NIP-05, Lightning Address, audience, inventory, channel permissions, and proof contract.
3. Add placement records and offer/accept workflow.
4. Add delivery timeline and proof-submission UI.
5. Replace seeded demo inventory with pilot inventory labels and partner-owned records.
6. Coordinate NIP-05 identity rollout with Kimi across Give A Bit, Satohash, MotoPass, Stranded, and related apps.
7. Add durable backend persistence before treating campaign payments, vendor balances, or payouts as live.

## Product rules

- Never call a channel automated without provider permission, execution access, and verified reporting.
- Never equate a published Nostr event with impressions, clicks, or conversions.
- Keep payment state separate from distribution and delivery state.
- Keep `api.giveabit.io` retired until a durable origin exists.
- M3 owns code; THOR owns operations and Kimi/HERMES coordination.

*Safe Harbour · Part of the [Give A Bit](https://giveabit.io) family.*
