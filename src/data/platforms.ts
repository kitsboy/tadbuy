import {
  Twitter, Facebook, Instagram, Zap, Youtube, MessageSquare, Linkedin, Music,
  type LucideIcon,
} from 'lucide-react';
import { createElement, type ReactNode } from 'react';

// Example-only planning assumption; it is not an approved or active Tadbuy fee.
export const PLATFORM_FEE_RATE = 0.15;

export type BillingModel = 'CPM' | 'CPC' | 'CPV' | 'CPA' | 'FLAT' | 'ZAP';
export type IntegrationStatus = 'live' | 'beta' | 'planned' | 'manual';

export interface AdPlatform {
  id: string;
  slug: string;
  name: string;
  icon: LucideIcon;
  color: string;
  cpmUsdBase: number;
  billingModel: BillingModel;
  minSpendUsd: number;
  recommendedBudgetUsd: number;
  payoutCadence: string;
  payoutMethod: string;
  whoHoldsBudget: string;
  integrationStatus: IntegrationStatus;
  adFormats: string[];
  publisherPayoutThresholdSats: number;
  revSharePct: number;
  description: string;
  budgetingNotes: string;
  payoutNotes: string;
  bitcoinNotes: string;
  traditionalFeeRange: string;
}

function withFee(cpm: number): number {
  return cpm * (1 + PLATFORM_FEE_RATE);
}

export const AD_PLATFORMS: AdPlatform[] = [
  {
    id: 'twitter',
    slug: 'twitter',
    name: 'Twitter/X',
    icon: Twitter,
    color: 'text-blue',
    cpmUsdBase: 6.45,
    billingModel: 'CPM',
    minSpendUsd: 5,
    recommendedBudgetUsd: 50,
    payoutCadence: 'Not connected in the Tadbuy preview',
    payoutMethod: 'Not available — roadmap concept only',
    whoHoldsBudget: 'No Tadbuy campaign budget is accepted or allocated in this preview.',
    integrationStatus: 'planned',
    adFormats: ['Promoted posts', 'Timeline ads', 'Follower ads'],
    publisherPayoutThresholdSats: 0,
    revSharePct: 0,
    description: 'Example guide to X ad concepts. No X provider buying, auction activity, or delivery is connected.',
    budgetingNotes: 'Provider pricing and minimums vary and must be verified with the provider. Tadbuy does not quote or place X ads in this preview.',
    payoutNotes: 'No direct publisher inventory or payout is connected to Tadbuy.',
    bitcoinNotes: 'Bitcoin and Lightning are design goals only; no Tadbuy campaign payment can be made here.',
    traditionalFeeRange: '15–25% agency + X fees',
  },
  {
    id: 'facebook',
    slug: 'facebook',
    name: 'Facebook',
    icon: Facebook,
    color: 'text-blue',
    cpmUsdBase: 8.20,
    billingModel: 'CPM',
    minSpendUsd: 5,
    recommendedBudgetUsd: 75,
    payoutCadence: 'Not connected in the Tadbuy preview',
    payoutMethod: 'Not available — roadmap concept only',
    whoHoldsBudget: 'No Tadbuy campaign budget is accepted or allocated in this preview.',
    integrationStatus: 'planned',
    adFormats: ['Feed ads', 'Stories', 'Reels cross-post'],
    publisherPayoutThresholdSats: 0,
    revSharePct: 0,
    description: 'Example guide to Meta placements. No provider buying, account access, or delivery is connected.',
    budgetingNotes: 'Provider pricing and minimums vary and must be verified with the provider. Tadbuy does not quote or place Meta ads in this preview.',
    payoutNotes: 'No direct publisher inventory or payout is connected to Tadbuy.',
    bitcoinNotes: 'Bitcoin funding is not available in this preview.',
    traditionalFeeRange: '20–40% + Meta margin',
  },
  {
    id: 'instagram',
    slug: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    color: 'text-accent2',
    cpmUsdBase: 9.85,
    billingModel: 'CPM',
    minSpendUsd: 5,
    recommendedBudgetUsd: 75,
    payoutCadence: 'Not connected in the Tadbuy preview',
    payoutMethod: 'Not available — roadmap concept only',
    whoHoldsBudget: 'No Tadbuy campaign budget is accepted or allocated in this preview.',
    integrationStatus: 'planned',
    adFormats: ['Feed', 'Stories', 'Reels'],
    publisherPayoutThresholdSats: 0,
    revSharePct: 0,
    description: 'Example guide to Instagram placements. No provider buying, account access, or delivery is connected.',
    budgetingNotes: 'Formats and pricing vary by provider, market, and objective. Tadbuy does not quote or place Instagram ads in this preview.',
    payoutNotes: 'No creator onboarding, inventory, or payout service is connected.',
    bitcoinNotes: 'Lightning checkout is not available in this preview.',
    traditionalFeeRange: '20–40%',
  },
  {
    id: 'nostr',
    slug: 'nostr',
    name: 'Nostr',
    icon: Zap,
    color: 'text-purple',
    cpmUsdBase: 1.20,
    billingModel: 'ZAP',
    minSpendUsd: 1,
    recommendedBudgetUsd: 25,
    payoutCadence: 'No Tadbuy campaign payout is connected',
    payoutMethod: 'User-initiated NIP-07 publication only; no payment settlement',
    whoHoldsBudget: 'No Tadbuy campaign budget is accepted or allocated in this preview.',
    integrationStatus: 'planned',
    adFormats: ['Note promotions', 'Zap-sponsored posts', 'Relay featured slots'],
    publisherPayoutThresholdSats: 0,
    revSharePct: 0,
    description: 'Nostr notes can be published only when a user chooses their own browser signer. This is not a paid ad placement.',
    budgetingNotes: 'No Nostr marketplace quote, auction, or campaign budget is active in Tadbuy.',
    payoutNotes: 'No Tadbuy publisher listing, fee, or zap distribution is connected.',
    bitcoinNotes: 'Nostr zaps are not part of a connected Tadbuy campaign payment flow.',
    traditionalFeeRange: 'N/A — decentralized',
  },
  {
    id: 'youtube',
    slug: 'youtube',
    name: 'YouTube',
    icon: Youtube,
    color: 'text-red',
    cpmUsdBase: 12.50,
    billingModel: 'CPV',
    minSpendUsd: 10,
    recommendedBudgetUsd: 100,
    payoutCadence: 'Not connected in the Tadbuy preview',
    payoutMethod: 'Not available — roadmap concept only',
    whoHoldsBudget: 'No Tadbuy campaign budget is accepted or allocated in this preview.',
    integrationStatus: 'planned',
    adFormats: ['In-stream skippable', 'Bumper', 'Discovery'],
    publisherPayoutThresholdSats: 0,
    revSharePct: 0,
    description: 'Example guide to YouTube ad formats. No Google Ads buying, creator inventory, or delivery is connected.',
    budgetingNotes: 'Formats and pricing vary by provider and placement. Tadbuy does not quote or place YouTube ads in this preview.',
    payoutNotes: 'No creator onboarding, inventory, or payout service is connected.',
    bitcoinNotes: 'No Tadbuy on-chain or Lightning campaign payment is available.',
    traditionalFeeRange: '45% Google take + agency',
  },
  {
    id: 'reddit',
    slug: 'reddit',
    name: 'Reddit',
    icon: MessageSquare,
    color: 'text-accent',
    cpmUsdBase: 4.90,
    billingModel: 'CPC',
    minSpendUsd: 5,
    recommendedBudgetUsd: 40,
    payoutCadence: 'Not connected in the Tadbuy preview',
    payoutMethod: 'Not available — roadmap concept only',
    whoHoldsBudget: 'No Tadbuy campaign budget is accepted or allocated in this preview.',
    integrationStatus: 'planned',
    adFormats: ['Promoted posts', 'Community targeting', 'Conversation ads'],
    publisherPayoutThresholdSats: 0,
    revSharePct: 0,
    description: 'Example guide to Reddit placements. No provider buying, community targeting, or delivery is connected.',
    budgetingNotes: 'Provider pricing and minimums vary and must be verified. Tadbuy does not quote or place Reddit ads in this preview.',
    payoutNotes: 'No community inventory, vendor approval, or payout service is connected.',
    bitcoinNotes: 'Lightning payments are not available in this preview.',
    traditionalFeeRange: '20–30%',
  },
  {
    id: 'linkedin',
    slug: 'linkedin',
    name: 'LinkedIn',
    icon: Linkedin,
    color: 'text-blue',
    cpmUsdBase: 24.50,
    billingModel: 'CPM',
    minSpendUsd: 10,
    recommendedBudgetUsd: 150,
    payoutCadence: 'Not connected in the Tadbuy preview',
    payoutMethod: 'Not available — roadmap concept only',
    whoHoldsBudget: 'No Tadbuy campaign budget is accepted or allocated in this preview.',
    integrationStatus: 'planned',
    adFormats: ['Sponsored content', 'Message ads', 'Lead gen'],
    publisherPayoutThresholdSats: 0,
    revSharePct: 0,
    description: 'Example guide to LinkedIn ad formats. No provider buying, audience targeting, or delivery is connected.',
    budgetingNotes: 'Provider pricing and minimums vary and must be verified. Tadbuy does not quote or place LinkedIn ads in this preview.',
    payoutNotes: 'No newsletter inventory, publisher approval, or payout service is connected.',
    bitcoinNotes: 'On-chain and Lightning campaign payments are not available in this preview.',
    traditionalFeeRange: '25–45%',
  },
  {
    id: 'tiktok',
    slug: 'tiktok',
    name: 'TikTok',
    icon: Music,
    color: 'text-text',
    cpmUsdBase: 5.75,
    billingModel: 'CPM',
    minSpendUsd: 5,
    recommendedBudgetUsd: 60,
    payoutCadence: 'Not connected in the Tadbuy preview',
    payoutMethod: 'Not available — roadmap concept only',
    whoHoldsBudget: 'No Tadbuy campaign budget is accepted or allocated in this preview.',
    integrationStatus: 'planned',
    adFormats: ['In-feed', 'Spark Ads', 'TopView'],
    publisherPayoutThresholdSats: 0,
    revSharePct: 0,
    description: 'Example guide to TikTok placements. No provider buying, creator inventory, or delivery is connected.',
    budgetingNotes: 'Provider pricing and minimums vary and must be verified. Tadbuy does not quote or place TikTok ads in this preview.',
    payoutNotes: 'No creator onboarding, inventory, or payout service is connected.',
    bitcoinNotes: 'Lightning payments are not available in this preview.',
    traditionalFeeRange: '20–35%',
  },
];

/** Marketplace inventory types aligned with social + publisher channels */
export const MARKETPLACE_PLATFORM_TYPES = [
  'Nostr', 'YouTube', 'Podcasts', 'Newsletters', 'Blogs', 'Twitter/X', 'Reddit', 'TikTok',
] as const;

export type MarketplacePlatformType = (typeof MARKETPLACE_PLATFORM_TYPES)[number];

export function getPlatformById(id: string): AdPlatform | undefined {
  return AD_PLATFORMS.find(p => p.id === id || p.slug === id);
}

export function getPlatformCpm(id: string): number {
  const p = getPlatformById(id);
  return p ? withFee(p.cpmUsdBase) : 0;
}

export function getPlatformIconNode(id: string, className = 'w-6 h-6'): ReactNode {
  const p = getPlatformById(id);
  if (!p) return null;
  return createElement(p.icon, { className });
}

export function usdToMinSats(usd: number, btcUsdRate: number): number {
  if (btcUsdRate <= 0) return 0;
  return Math.round((usd / btcUsdRate) * 100_000_000);
}

export function estimateImpressions(budgetUsd: number, cpm: number): number {
  if (cpm <= 0) return 0;
  return Math.floor((budgetUsd / cpm) * 1000);
}

export interface BudgetAllocation {
  platformId: string;
  weightPct: number;
  budgetUsd: number;
  impressions: number;
  cpm: number;
}

export function allocateBudget(
  platformIds: string[],
  totalBudgetUsd: number,
  weights: Record<string, number> | 'even' | 'ppq',
): BudgetAllocation[] {
  if (!platformIds.length || totalBudgetUsd <= 0) return [];

  const platforms = platformIds.map(id => getPlatformById(id)).filter(Boolean) as AdPlatform[];
  let weightMap: Record<string, number> = {};

  if (weights === 'even') {
    const each = 100 / platforms.length;
    platforms.forEach(p => { weightMap[p.id] = each; });
  } else if (weights === 'ppq') {
    const inverseCpm = platforms.map(p => 1 / withFee(p.cpmUsdBase));
    const sum = inverseCpm.reduce((a, b) => a + b, 0);
    platforms.forEach((p, i) => { weightMap[p.id] = (inverseCpm[i] / sum) * 100; });
  } else {
    weightMap = { ...weights };
    const sum = platformIds.reduce((s, id) => s + (weightMap[id] ?? 0), 0);
    if (sum > 0 && Math.abs(sum - 100) > 0.01) {
      platformIds.forEach(id => { weightMap[id] = ((weightMap[id] ?? 0) / sum) * 100; });
    }
  }

  return platforms.map(p => {
    const w = weightMap[p.id] ?? 0;
    const budgetUsd = (totalBudgetUsd * w) / 100;
    const cpm = withFee(p.cpmUsdBase);
    return {
      platformId: p.id,
      weightPct: w,
      budgetUsd,
      impressions: estimateImpressions(budgetUsd, cpm),
      cpm,
    };
  });
}

export function platformToCheckoutShape(btcRate: number) {
  return AD_PLATFORMS.map(p => ({
    id: p.id,
    name: p.name,
    icon: getPlatformIconNode(p.id),
    cpm: withFee(p.cpmUsdBase),
    minSpendSats: usdToMinSats(p.minSpendUsd, btcRate),
  }));
}