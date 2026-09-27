/** Shared marketplace inventory — used by Marketplace page and Buy Ads slot handoff.
 *
 *  Publisher identities here are DESCRIPTIVE ARCHETYPES, not real companies. No publisher has
 *  listed inventory with Tadbuy and no auction has run; every slot below is example inventory.
 *  Rule (see HQ docs/legal/LENNY-BRAND-SAMPLE-FIGURES-RULING.md): a real mark carrying invented
 *  performance figures is a false attribution a label cannot cure — so never name a real
 *  publisher, brand, property or show in this file. Keep the slot mechanic legible instead.
 */

export interface MarketplaceSlot {
  id: string;
  name: string;
  publisher: string;
  placement: string;
  format: string;
  category: string;
  audience: string;
  geo: string[];
  minBidSats: number;
  /** Illustrative example budget for seeded previews; not a real bid. */
  currentBidSats: number;
  tags: string[];
  platformType?: string;
  /** Set for records loaded from the durable vendor marketplace. */
  durable?: boolean;
  vendorId?: string;
  inventoryId?: string;

}

export const FEATURED_SLOT_IDS = [
  'slot_youtube_preroll',
  'slot_podcast_midroll',
  'slot_community_banner',
] as const;

export const MARKETPLACE_SLOTS: MarketplaceSlot[] = [
  {
    id: 'slot_education_hero',
    name: 'Bitcoin Education Site Hero',
    publisher: 'A Bitcoin education site',
    placement: 'Above the fold',
    format: '728×90 Leaderboard',
    category: 'Bitcoin & Crypto',
    audience: 'Example audience description · no verified visitor count',
    geo: ['US', 'EU', 'APAC'],
    minBidSats: 5000,
    currentBidSats: 18500,
    tags: ['bitcoin', 'finance', 'tech'],
    platformType: 'Blogs',
  },
  {
    id: 'slot_social_sidebar',
    name: 'Nostr Client Sidebar',
    publisher: 'A Nostr social client',
    placement: 'Article sidebar',
    format: '300×250 Rectangle',
    category: 'Social / Nostr',
    audience: 'Example audience description · no verified visitor count',
    geo: ['Global'],
    minBidSats: 2000,
    currentBidSats: 7200,
    tags: ['nostr', 'social', 'decentralized'],
    platformType: 'Nostr',
  },
  {
    id: 'slot_community_banner',
    name: 'Bitcoin Community Top Banner',
    publisher: 'A Bitcoin community forum',
    placement: 'Top of feed',
    format: '970×250 Billboard',
    category: 'Bitcoin Community',
    audience: 'Example audience description · no verified visitor count',
    geo: ['US', 'EU'],
    minBidSats: 8000,
    currentBidSats: 22000,
    tags: ['bitcoin', 'community', 'news'],
    platformType: 'Blogs',
  },
  {
    id: 'slot_lightning_sidebar',
    name: 'Lightning Trading App Sidebar',
    publisher: 'A Lightning trading app',
    placement: 'Dashboard sidebar',
    format: '300×600 Half Page',
    category: 'Lightning / Finance',
    audience: 'Example audience description · no verified visitor count',
    geo: ['Global'],
    minBidSats: 3500,
    currentBidSats: 9800,
    tags: ['lightning', 'trading', 'finance'],
    platformType: 'Newsletters',
  },
  {
    id: 'slot_tools_footer',
    name: 'Open-Source Payments Docs Footer',
    publisher: 'A Bitcoin payments project',
    placement: 'Documentation footer',
    format: '728×90 Leaderboard',
    category: 'Bitcoin Tools',
    audience: 'Example audience description · no verified visitor count',
    geo: ['Global'],
    minBidSats: 1500,
    currentBidSats: 4100,
    tags: ['payments', 'open-source', 'tools'],
    platformType: 'Blogs',
  },
  {
    id: 'slot_social_feed',
    name: 'Nostr Client In-Feed Ad',
    publisher: 'A Nostr social client',
    placement: 'Social feed',
    format: 'Native Feed Post',
    category: 'Social / Nostr',
    audience: 'Example audience description · no verified visitor count',
    geo: ['Global'],
    minBidSats: 4000,
    currentBidSats: 11200,
    tags: ['nostr', 'native', 'social'],
    platformType: 'Nostr',
  },
  {
    id: 'slot_podcast_midroll',
    name: 'Bitcoin Podcast Mid-Roll',
    publisher: 'A Bitcoin podcast',
    placement: 'Mid-roll',
    format: '60s Audio Ad',
    category: 'Bitcoin Community',
    audience: 'Example listener profile · no verified audience count',
    geo: ['US', 'EU'],
    minBidSats: 6000,
    currentBidSats: 14500,
    tags: ['podcast', 'bitcoin', 'audio'],
    platformType: 'Podcasts',
  },
  {
    id: 'slot_youtube_preroll',
    name: 'Bitcoin YouTube Pre-Roll',
    publisher: 'A Bitcoin YouTube channel',
    placement: 'YouTube pre-roll',
    format: '15s Video Ad',
    category: 'Bitcoin & Crypto',
    audience: 'Example channel profile · no verified subscriber count',
    geo: ['US', 'CA', 'EU'],
    minBidSats: 7500,
    currentBidSats: 16800,
    tags: ['youtube', 'bitcoin', 'education'],
    platformType: 'YouTube',
  },
  {
    id: 'slot_newsletter_sponsor',
    name: 'Bitcoin Newsletter Sponsor',
    publisher: 'A Bitcoin newsletter',
    placement: 'Newsletter top sponsor',
    format: 'Sponsored Section',
    category: 'Bitcoin & Crypto',
    audience: 'Example newsletter profile · no verified subscriber count',
    geo: ['US'],
    minBidSats: 3000,
    currentBidSats: 8900,
    tags: ['newsletter', 'bitcoin', 'finance'],
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
