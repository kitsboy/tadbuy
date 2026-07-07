import type { Express } from 'express';

/** Batch 21 — Trust & legal UX (features 401-425) */

const FEE_SCHEDULE = {
  platformFeePercent: 15,
  publisherCommissionPercent: 5,
  lightningFeeSats: 0,
  onChainFeeNote: 'Pass-through mempool fees only — no markup',
  settlementSpeed: '< 1 second via Lightning',
  noHiddenFees: true,
  items: [
    { label: 'Campaign spend', fee: '15% platform fee', example: '10,000 sats spend → 1,500 sats fee' },
    { label: 'Marketplace bids', fee: '5% on winning bid', example: '20,000 sats bid → 1,000 sats commission' },
    { label: 'Lightning payments', fee: '0 sats (network fees only)', example: 'Instant settlement' },
    { label: 'Fedimint ecash', fee: '0.1% federation fee', example: 'Lower than on-chain' },
    { label: 'Publisher payouts', fee: 'Free via Lightning address', example: 'No withdrawal fee' },
  ],
};

const AD_POLICY = {
  version: '1.0',
  lastUpdated: '2026-07-06',
  prohibited: [
    'Scams, phishing, or fraudulent investment schemes',
    'Malware, exploits, or unauthorized data collection',
    'Adult content, gambling, or illegal substances',
    'Hate speech, harassment, or discriminatory content',
    'Misleading claims about Bitcoin returns or guaranteed profits',
    'Counterfeit goods or trademark infringement',
    'Surveillance-based retargeting pixels (third-party trackers)',
  ],
  allowed: [
    'Bitcoin businesses, exchanges, and wallets',
    'Lightning infrastructure and node services',
    'Open-source Bitcoin tools and education',
    'Nostr clients, relays, and community projects',
    'Privacy-preserving products aligned with Bitcoin values',
  ],
  reviewProcess: 'All campaigns are reviewed within 24 hours. Violations result in immediate suspension and forfeiture of unspent budget.',
  appealContact: 'support@giveabit.io',
};

export function registerBatch21Routes(app: Express) {
  app.get('/api/trust/fees-transparent', (_req, res) => {
    res.json(FEE_SCHEDULE);
  });

  app.get('/api/trust/ad-policy', (_req, res) => {
    res.json(AD_POLICY);
  });
}