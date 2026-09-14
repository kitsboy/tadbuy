# Tadbuy — Multi-channel marketplace plan

**Updated:** 2026-09-14
**Status:** Phase 2 community-distribution pilot foundation shipped on M3; Kimi/THOR operational response is pending.

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
- Added Phase 2 Playwright coverage for the complete advertiser-to-vendor proof lifecycle.

## Next work

1. Receive Kimi/THOR’s response with confirmed pilot communities, identities, policies, and Otto/Grok Bot agent assignments.
2. Move placement requests, vendor profiles, and inventory to durable authenticated backend storage.
3. Add real vendor inventory creation/editing and advertiser/vendor ownership controls.
4. Define and implement moderation, disclosure, cancellation, refund, dispute, and pilot acceptance rules.
5. Test NIP-05 resolution and Nostr publication with real identities and an unlocked signer.
6. Evaluate a controlled Reddit provider/API connection only after provider access, policy, account, and reporting gates are satisfied.
7. Add durable settlement before treating campaign payments, vendor balances, escrow, or payouts as live.

## Product rules

- Never call a channel automated without provider permission, execution access, and verified reporting.
- Never equate a published Nostr event or vendor proof record with impressions, clicks, or conversions.
- Keep payment state separate from distribution and delivery state.
- Keep `api.giveabit.io` retired until a durable origin exists.
- M3 owns code; THOR owns operations and Kimi/HERMES coordination.
- Browser-local pilot data is for workflow validation only, not live marketplace settlement.

## Git and verification

- Feature commit: `45bd22c`.
- Remote tip after automatic version bumps: `9b18acc` / v5.0.188.
- Focused Phase 2 E2E: 1/1 passed; typecheck, route integrity, bundle check, and diff check passed.
- The pre-existing local `public/sw.js` change remains intentionally uncommitted.

*Safe Harbour · Part of the [Give A Bit](https://giveabit.io) family.*
