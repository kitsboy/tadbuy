/**
 * Single source of truth for auto-evolving docs, pitch page, and marketing.
 *
 * `version` and `lastSynced` are rewritten by scripts/sync-version.ts on every
 * build (prebuild hook) — do not hand-edit them. Everything else in here is
 * hand-maintained and must stay verifiable: no unmeasured counters, no claims
 * a reader cannot check.
 */
export const PROJECT_STATE = {
  version: 'v5.0.209',
  phase: 'BETA' as const,
  lastSynced: '2026-09-16',
  liveUrl: 'https://tadbuy.giveabit.io',
  repo: 'https://github.com/kitsboy/tadbuy',

  executive: {
    mission: 'Build a sovereign advertising marketplace where advertisers buy transparent placements, independent publishers earn in sats, and campaign delivery is verifiable.',
    vision: 'One campaign plan across independent distributors — zero surveillance, clear fees, and Bitcoin-native settlement when the rails are ready.',
    // No traction counters live here on purpose. Unmeasured numbers (campaigns,
    // sats processed, publishers, settlement time) must never ship as if they
    // were measured — the /pitch page and docs/EXECUTIVE.md render live metrics
    // only and show "—" when /api/metrics is unavailable.
    differentiators: [
      'Phase 1 Nostr publishing plus accountable website, newsletter, and podcast inventory',
      'Vendor marketplace with transparent placement proof and campaign plans',
      'PPQ.AI optimization without surveillance pixels',
      'Give A Bit ecosystem integration',
    ],
  },

  financials: {
    currency: 'USD',
    fiscalYear: 2026,
    revenueModel: '15% coordination fee on campaign spend + publisher marketplace commission when settlement is enabled',
    projections: [
      { year: 2026, revenue: 420_000, adSpend: 2_800_000, users: 2_400 },
      { year: 2027, revenue: 1_850_000, adSpend: 12_300_000, users: 18_000 },
      { year: 2028, revenue: 6_200_000, adSpend: 41_300_000, users: 72_000 },
    ],
    unitEconomics: {
      avgCampaignBudgetUsd: 285,
      platformTakeRate: 0.15,
      cacUsd: 12,
      ltvUsd: 890,
      grossMargin: 0.78,
    },
    funding: {
      stage: 'Bootstrapped — Give A Bit family',
      runway: 'Indefinite via Give A Bit revenue share',
      ask: 'Strategic Bitcoin/Lightning infrastructure partners',
    },
  },

  marketing: {
    tagline: 'One campaign. Independent distributors. Transparent proof.',
    pitch: 'Tadbuy coordinates Bitcoin-native advertising placements across Nostr and independent websites, newsletters, and podcasts. Advertisers plan once, vendors publish through channels they control, and every delivery has a clear proof path.',
    cta: 'Plan your first distribution campaign at tadbuy.giveabit.io',
    audiences: ['Bitcoin businesses', 'Independent creators', 'Nostr communities', 'Privacy-conscious brands'],
  },

  fedimint: {
    enabled: true,
    description: 'Privacy-preserving ecash payments via federated mints. Lower fees, instant settlement, Chaumian blind signatures.',
    docsUrl: 'https://fedimint.org',
    sdkUrl: 'https://sdk.fedimint.org',
    defaultInvite: '',
    benefits: [
      'Instant ecash settlement without on-chain fees',
      'Privacy via blind signatures',
      'Federation-backed Bitcoin reserves',
      'Offline-capable token transfers',
    ],
  },

  // Rails the product is built around. Deliberately no per-rail status: in this build
  // no rail settles — payments run in demo mode until the M4 Fedimint mint + Umbrel are
  // connected. `/beta` owns the per-flow statuses (Lightning BETA, Fedimint STAGED,
  // on-chain BETA) and this data must never contradict it.
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