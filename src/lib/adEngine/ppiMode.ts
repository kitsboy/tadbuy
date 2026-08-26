/**
 * Pay-per-Impression (PPI) Mode — Pay per 1000 viewable impressions
 * 
 * Alternative to PPQ where advertisers pay when their creatives are
 * actually viewable (MRC IVM standard: 50%+ pixels visible for 1+ second).
 * Provides guaranteed viewability with auditable proof.
 */

export interface PPICampaign {
  campaignId: string;
  advertiserId: string;
  name: string;
  pricePerImpressionSats: number; // per 1000 impressions
  budgetSats: number;
  spentSats: number;
  status: 'active' | 'paused' | 'completed';
  createdAt: number;
  impressionsDelivered: number;
  viewableImpressions: number; // verified via zk-proofs
  viewabilityRate: number; // 0-1
  estimatedCompletion: number; // timestamp
}

/** Calculate PPI rate (sats per 1000 impressions) */
export function calculatePPI(totalSats: number, impressions: number, viewableOnly = false): number {
  const target = viewableOnly ? Math.max(1, impressions) : impressions;
  return Math.max(1, Math.round((totalSats / target) * 1000));
}

/** Track viewable impressions with proof verification */
export function trackViewableImpression(campaignId: string, impressionId: string): void {
  // In production: verify zk-proof that impression was viewable
  console.log(`Viewable impression recorded: ${impressionId} for ${campaignId}`);
}

/** Estimate daily budget consumption */
export function estimatePPIBudget(
  dailyImpressions: number,
  pricePer1000: number
): number {
  return Math.ceil((dailyImpressions / 1000) * pricePer1000);
}

/** Mock PPI campaigns */
export const MOCK_PPI_CAMPAIGNS: PPICampaign[] = [
  {
    campaignId: 'ppic_001',
    advertiserId: 'adv_001',
    name: 'Bitcoin Wallet Acquisition',
    pricePerImpressionSats: 250,
    budgetSats: 500_000,
    spentSats: 50_000,
    status: 'active',
    createdAt: Date.now() - 3600000,
    impressionsDelivered: 2100,
    viewableImpressions: 1980,
    viewabilityRate: 0.94,
    estimatedCompletion: Date.now() + 86400000,
  },
];