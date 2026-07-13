import {
  Twitter, Facebook, Instagram, Zap, Youtube, MessageSquare, Linkedin, Music,
  type LucideIcon,
} from 'lucide-react';
import { createElement, type ReactNode } from 'react';

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
    payoutCadence: 'Real-time to publishers via Lightning when inventory is direct',
    payoutMethod: 'Lightning / LNURL',
    whoHoldsBudget: 'Advertiser pays Tadbuy in Bitcoin; spend allocated per auction rules on X',
    integrationStatus: 'beta',
    adFormats: ['Promoted posts', 'Timeline ads', 'Follower ads'],
    publisherPayoutThresholdSats: 10_000,
    revSharePct: 85,
    description: 'Reach Bitcoin-curious audiences on X with promoted posts and timeline placements.',
    budgetingNotes: 'X Ads uses auction CPM/CPE. Self-serve min ~$5/day. Budget pacing is daily or lifetime. Tadbuy quotes CPM with 15% platform fee.',
    payoutNotes: 'Direct publishers receive Lightning sats when inventory is in Tadbuy marketplace. X-owned inventory settles per X billing (fiat layer) — Bitcoin in via Tadbuy.',
    bitcoinNotes: 'Pay campaign in sats via Lightning, on-chain, or Fedimint. No credit card required.',
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
    payoutCadence: 'Publisher Lightning when direct; Meta billing cycle for Meta inventory',
    payoutMethod: 'Lightning / on-chain',
    whoHoldsBudget: 'Advertiser → Tadbuy (Bitcoin) → Meta ad account spend',
    integrationStatus: 'planned',
    adFormats: ['Feed ads', 'Stories', 'Reels cross-post'],
    publisherPayoutThresholdSats: 10_000,
    revSharePct: 85,
    description: 'Meta Feed and Stories placements for broad reach.',
    budgetingNotes: 'Meta bills CPM/CPC/CPA by campaign objective. Daily or lifetime budgets. Advantage+ can shift spend between placements.',
    payoutNotes: 'External publishers paid in sats. Meta-owned inventory follows Meta prepay/settlement — Tadbuy maps Bitcoin deposit to spend cap.',
    bitcoinNotes: 'Fund in sats; Tadbuy converts to spend authorization without holding fiat custody long-term.',
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
    payoutCadence: 'Same as Meta stack',
    payoutMethod: 'Lightning',
    whoHoldsBudget: 'Advertiser → Tadbuy → Meta/IG ad account',
    integrationStatus: 'planned',
    adFormats: ['Feed', 'Stories', 'Reels'],
    publisherPayoutThresholdSats: 10_000,
    revSharePct: 85,
    description: 'Visual-first campaigns on Instagram Feed, Stories, and Reels.',
    budgetingNotes: 'Reels CPM often lower than Feed. Stories are CPM with short view windows. Min daily budget similar to Facebook.',
    payoutNotes: 'Creator/influencer deals via marketplace settle in Lightning when publisher provides LN address.',
    bitcoinNotes: 'Ideal for Lightning checkout on smaller daily budgets.',
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
    payoutCadence: 'Instant zap settlement (NIP-57)',
    payoutMethod: 'Lightning Zaps to pubkey',
    whoHoldsBudget: 'Self-custodial zaps — no central escrow',
    integrationStatus: 'beta',
    adFormats: ['Note promotions', 'Zap-sponsored posts', 'Relay featured slots'],
    publisherPayoutThresholdSats: 1_000,
    revSharePct: 95,
    description: 'Censorship-resistant social ads via Nostr notes and zaps.',
    budgetingNotes: 'No central billing — budget is zap pool or CPM-equivalent on relay inventory. Lowest min spend on Tadbuy.',
    payoutNotes: 'Publishers receive zaps directly to npub. Tadbuy takes 15% only on managed campaigns.',
    bitcoinNotes: 'Native Bitcoin rail — zaps are Lightning. Best sovereignty story.',
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
    payoutCadence: 'Creator AdSense monthly; direct deals via Lightning',
    payoutMethod: 'Lightning for direct publishers',
    whoHoldsBudget: 'Advertiser → Tadbuy → Google Ads account',
    integrationStatus: 'planned',
    adFormats: ['In-stream skippable', 'Bumper', 'Discovery'],
    publisherPayoutThresholdSats: 10_000,
    revSharePct: 80,
    description: 'Video reach via in-stream and discovery placements.',
    budgetingNotes: 'CPV/CPM by format. Reserved buys vs auction. Higher CPM for in-stream skippable.',
    payoutNotes: 'YouTube creators traditionally paid via AdSense. Tadbuy direct sponsorships pay Lightning to creator LNURL.',
    bitcoinNotes: 'On-chain recommended for larger video budgets; Lightning for tests.',
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
    payoutCadence: 'Daily pacing; publisher Lightning for community deals',
    payoutMethod: 'Lightning',
    whoHoldsBudget: 'Advertiser → Tadbuy → Reddit ad account',
    integrationStatus: 'beta',
    adFormats: ['Promoted posts', 'Community targeting', 'Conversation ads'],
    publisherPayoutThresholdSats: 10_000,
    revSharePct: 85,
    description: 'Community-native promoted posts and subreddit targeting.',
    budgetingNotes: 'CPC common for traffic campaigns; CPM for awareness. Subreddit targeting affects CPM.',
    payoutNotes: 'Subreddit moderators/publishers on marketplace receive sats per impression share.',
    bitcoinNotes: 'Lightning-friendly for sub-$100 tests.',
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
    payoutCadence: 'Invoice cycle for LI; Lightning for newsletter B2B inventory',
    payoutMethod: 'Lightning / wire equivalent',
    whoHoldsBudget: 'Advertiser → Tadbuy → LinkedIn Campaign Manager',
    integrationStatus: 'planned',
    adFormats: ['Sponsored content', 'Message ads', 'Lead gen'],
    publisherPayoutThresholdSats: 25_000,
    revSharePct: 80,
    description: 'B2B sponsored content and lead generation.',
    budgetingNotes: 'Highest CPM of major social platforms. Min budgets often $10+/day for self-serve.',
    payoutNotes: 'B2B newsletter publishers in marketplace paid in sats above threshold.',
    bitcoinNotes: 'On-chain or Lightning — larger budgets typical.',
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
    payoutCadence: 'Daily; creator marketplace via Lightning',
    payoutMethod: 'Lightning',
    whoHoldsBudget: 'Advertiser → Tadbuy → TikTok Ads Manager',
    integrationStatus: 'planned',
    adFormats: ['In-feed', 'Spark Ads', 'TopView'],
    publisherPayoutThresholdSats: 10_000,
    revSharePct: 85,
    description: 'Short-form video ads and Spark creator collaborations.',
    budgetingNotes: 'Spark Ads reuse creator posts. CPM varies by region. Daily min ~$5–$20.',
    payoutNotes: 'Creators on Tadbuy marketplace receive rev-share in sats per Spark deal.',
    bitcoinNotes: 'Lightning for rapid creative tests.',
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