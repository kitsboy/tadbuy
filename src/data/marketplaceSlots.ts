/** Shared marketplace inventory — used by Marketplace page and Buy Ads slot handoff */

export interface MarketplaceSlot {
  id: string;
  name: string;
  publisher: string;
  publisherVerified: boolean;
  placement: string;
  format: string;
  category: string;
  audience: string;
  geo: string[];
  minBidSats: number;
  currentBidSats: number;
  impressionsPerDay: number;
  ctr: number;
  status: 'available' | 'hot';
  tags: string[];
  platformType?: string;
}

export const MARKETPLACE_SLOTS: MarketplaceSlot[] = [
  {
    id: 'slot_btc_hero',
    name: 'Bitcoin.org Homepage Hero',
    publisher: 'Bitcoin.org',
    publisherVerified: true,
    placement: 'Above the fold',
    format: '728×90 Leaderboard',
    category: 'Bitcoin & Crypto',
    audience: '2.4M monthly visitors',
    geo: ['US', 'EU', 'APAC'],
    minBidSats: 5000,
    currentBidSats: 18500,
    impressionsPerDay: 45000,
    ctr: 2.1,
    status: 'available',
    tags: ['bitcoin', 'finance', 'tech'],
    platformType: 'Blogs',
  },
  {
    id: 'slot_nostr_sidebar',
    name: 'Nostr.com Sidebar',
    publisher: 'Nostr.com',
    publisherVerified: true,
    placement: 'Article sidebar',
    format: '300×250 Rectangle',
    category: 'Social / Nostr',
    audience: '890K monthly visitors',
    geo: ['Global'],
    minBidSats: 2000,
    currentBidSats: 7200,
    impressionsPerDay: 18000,
    ctr: 1.8,
    status: 'available',
    tags: ['nostr', 'social', 'decentralized'],
    platformType: 'Nostr',
  },
  {
    id: 'slot_stacker_banner',
    name: 'Stacker News Top Banner',
    publisher: 'Stacker News',
    publisherVerified: true,
    placement: 'Top of feed',
    format: '970×250 Billboard',
    category: 'Bitcoin Community',
    audience: '320K monthly visitors',
    geo: ['US', 'EU'],
    minBidSats: 8000,
    currentBidSats: 22000,
    impressionsPerDay: 12000,
    ctr: 3.2,
    status: 'hot',
    tags: ['bitcoin', 'community', 'news'],
    platformType: 'Blogs',
  },
  {
    id: 'slot_ln_markets',
    name: 'LN Markets Sidebar',
    publisher: 'LN Markets',
    publisherVerified: false,
    placement: 'Dashboard sidebar',
    format: '300×600 Half Page',
    category: 'Lightning / Finance',
    audience: '145K monthly visitors',
    geo: ['Global'],
    minBidSats: 3500,
    currentBidSats: 9800,
    impressionsPerDay: 8500,
    ctr: 2.7,
    status: 'available',
    tags: ['lightning', 'trading', 'finance'],
    platformType: 'Newsletters',
  },
];

export function getMarketplaceSlot(id: string): MarketplaceSlot | undefined {
  return MARKETPLACE_SLOTS.find(s => s.id === id);
}

/** Map publisher category to default platform ids for campaign prefill */
export function slotToPlatforms(slot: MarketplaceSlot): string[] {
  if (slot.platformType === 'Nostr' || slot.tags.includes('nostr')) return ['nostr'];
  if (slot.category.toLowerCase().includes('bitcoin')) return ['twitter', 'nostr'];
  return ['twitter', 'reddit'];
}