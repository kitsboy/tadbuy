/**
 * Single source of truth for auto-evolving docs, pitch page, and marketing.
 * Updated by sync-docs.ts on every build from live metrics when available.
 */
export const PROJECT_STATE = {
  version: 'v5.0.21',
  phase: 'BETA' as const,
  lastSynced: '2026-07-07',
  liveUrl: 'https://tadbuy.giveabit.io',
  repo: 'https://github.com/kitsboy/tadbuy',

  executive: {
    mission: 'Build the first truly sovereign advertising platform — advertisers buy with Bitcoin, creators earn in sats, no intermediary takes a cut of attention.',
    vision: 'Every ad impression settled in sats. Zero surveillance. Global reach via geospatial intelligence.',
    traction: {
      campaignsLaunched: 12847,
      satsProcessed: 4_200_000_000,
      publishers: 340,
      platforms: 8,
      languages: 8,
      avgSettlementSeconds: 0.8,
    },
    differentiators: [
      'Only Bitcoin-native DSP with Lightning, BOLT12, Fedimint ecash, and Nostr Zaps',
      'PPQ.AI optimization without surveillance pixels',
      'Agent API for autonomous Nostr bots',
      'Give A Bit ecosystem integration',
    ],
  },

  financials: {
    currency: 'USD',
    fiscalYear: 2026,
    revenueModel: '15% platform fee on ad spend + publisher marketplace commission',
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
    tagline: 'Buy ads with Bitcoin. Pay in sats, not surveillance.',
    pitch: 'Tadbuy is the world\'s first Bitcoin-native DSP. Launch cross-platform campaigns and pay via Lightning, Fedimint ecash, BOLT12, on-chain, or Nostr Zaps.',
    cta: 'Start your first campaign at tadbuy.giveabit.io',
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

  paymentMethods: [
    { id: 'lightning', name: 'Lightning', status: 'live' },
    { id: 'fedimint', name: 'Fedimint Ecash', status: 'live' },
    { id: 'bolt12', name: 'BOLT12 Offers', status: 'beta' },
    { id: 'btc', name: 'On-chain BTC', status: 'live' },
    { id: 'zap', name: 'Nostr Zap', status: 'live' },
    { id: 'cashu', name: 'Cashu Ecash', status: 'beta' },
    { id: 'lnurl', name: 'LNURL-pay', status: 'live' },
    { id: 'silent', name: 'Silent Payments', status: 'beta' },
    { id: 'bip47', name: 'BIP-47 Codes', status: 'beta' },
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