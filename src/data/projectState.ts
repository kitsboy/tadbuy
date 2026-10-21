/**
 * Single source of truth for auto-evolving docs, pitch page, and marketing.
 *
 * `version` and `lastSynced` are rewritten by scripts/sync-version.ts on every
 * build (prebuild hook) — do not hand-edit them. Everything else in here is
 * hand-maintained and must stay verifiable: no unmeasured counters, no claims
 * a reader cannot check.
 */
export const PROJECT_STATE = {
  version: 'v5.0.226',
  phase: 'BETA' as const,
  lastSynced: '2026-10-21',
  liveUrl: 'https://tadbuy.giveabit.io',
  repo: 'https://github.com/kitsboy/tadbuy',

  executive: {
    mission: 'Prepare a sovereign advertising marketplace where advertisers can plan transparent placements with independent publishers and verifiable delivery.',
    vision: 'One campaign plan across independent distributors — privacy-oriented by design, clear fees, and Bitcoin-native settlement only after verified rails and release approval.',
    // No traction counters live here on purpose. Unmeasured numbers (campaigns,
    // sats processed, publishers, settlement time) must never ship as if they
    // were measured — the /pitch page and docs/EXECUTIVE.md render live metrics
    // only and show "—" when /api/metrics is unavailable.
    differentiators: [
      'Bitcoin-first campaign planning with no Tadbuy checkout connected in this preview',
      'Sample vendor marketplace concepts; no approved live inventory yet',
      'Privacy-oriented direction; audience targeting and campaign reporting are not connected',
      'Give A Bit ecosystem integration',
    ],
  },

  financials: {
    currency: 'USD',
    fiscalYear: 2026,
    revenueModel: 'No revenue model or fee schedule has been approved. Any future fee or commission requires product approval and a connected service.',
    funding: {
      stage: 'Early-stage preview',
      runway: 'Not stated',
      ask: 'Product discovery and infrastructure planning',
    },
  },

  marketing: {
    tagline: 'Plan across independent channels. Build toward transparent proof.',
    pitch: 'Tadbuy is preparing local campaign planning and illustrative publisher workflows. Live inventory, provider buying, delivery evidence, payment, and settlement are not connected in this preview.',
    cta: 'Explore a local campaign preview at tadbuy.giveabit.io',
    audiences: ['Bitcoin businesses', 'Independent creators', 'Nostr communities', 'Privacy-conscious brands'],
  },

  fedimint: {
    enabled: false,
    description: 'Fedimint ecash is a roadmap option only. No Tadbuy federation, invite, gateway, or campaign settlement is configured.',
    docsUrl: 'https://fedimint.org',
    sdkUrl: 'https://sdk.fedimint.org',
    defaultInvite: '',
    benefits: [
      'Potential future ecash payment option, subject to an approved federation and operational design',
      'Privacy properties require review of the selected federation, wallets, metadata, and threat model',
      'Federation governance, reserves, quorum, recovery, limits, and support remain unverified',
      'No offline token transfer or campaign settlement is available in this preview',
    ],
  },

  // Rails the product is being designed around. No Tadbuy campaign payment rail
  // is connected in this build. A synced Umbrel node would not by itself create a
  // payment service, authoritative settlement verification, or an account ledger.
  // `/wallet` and `/beta` describe the current readiness gates.
  paymentMethods: [
    { id: 'lightning', name: 'Lightning' },
    { id: 'fedimint', name: 'Fedimint Ecash' },
    { id: 'bolt12', name: 'BOLT12 Offers' },
    { id: 'btc', name: 'On-chain BTC' },
    { id: 'zap', name: 'Nostr Zap' },
    { id: 'cashu', name: 'Cashu Ecash' },
    { id: 'lnurl', name: 'LNURL-pay' },
    { id: 'silent', name: 'Silent Payments' },
    { id: 'bip47', name: 'BIP-47 Codes' },
  ],

  featureBatches: {
    batch1: { completed: 25, total: 25, label: 'Sovereign Payments & Fedimint' },
    batch2: { completed: 25, total: 25, label: 'Targeting & Intelligence' },
    batch3: { completed: 25, total: 25, label: 'Publisher & Integrations' },
    batch4: { completed: 25, total: 25, label: 'Enterprise & Scale' },
    batch5: { completed: 25, total: 25, label: 'Ecosystem Pipes & BETA' },
    batch6: { completed: 25, total: 25, label: 'Agent Automation & Onboarding' },
    batch7: { completed: 25, total: 25, label: 'Premium Design System' },
    batch8: { completed: 25, total: 25, label: 'Hooks, A11y & Performance' },
    batch9: { completed: 25, total: 25, label: 'Analytics & Intelligence Widgets' },
    batch10: { completed: 25, total: 25, label: 'Campaign Flow Excellence' },
    batch11: { completed: 25, total: 25, label: 'Publisher & Marketplace' },
    batch12: { completed: 25, total: 25, label: 'Wallet & Payments' },
    batch13: { completed: 25, total: 25, label: 'API & Agent Tools' },
    batch14: { completed: 25, total: 25, label: 'Docs & Platinum Polish' },
    batch15: { completed: 25, total: 25, label: 'Foundation & Ops' },
    batch16: { completed: 25, total: 25, label: 'Campaign Builder Pro' },
    batch17: { completed: 25, total: 25, label: 'Payments Transparency' },
    batch18: { completed: 25, total: 25, label: 'Analytics Live Wiring' },
    batch19: { completed: 25, total: 25, label: 'Marketplace Auctions' },
    batch20: { completed: 25, total: 25, label: 'SEO & Content Pages' },
    batch21: { completed: 25, total: 25, label: 'Trust & Legal UX' },
    batch22: { completed: 25, total: 25, label: 'Performance & Agent' },
    batch23: { completed: 25, total: 25, label: 'Delight & Mobile Polish' },
    batch24: { completed: 100, total: 100, label: 'Geo Reach Page (/geo)' },
  },
} as const;

export type ProjectState = typeof PROJECT_STATE;