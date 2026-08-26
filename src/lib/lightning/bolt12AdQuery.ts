/**
 * Lightning Offers (BOLT12) Query System — Discover ad inventory
 * 
 * Advertisers can query publishers for available ad inventory via
 * BOLT12 Offers. Publishers list inventory as offers; advertisers
 * query and subscribe via repeating offers.
 */

export interface Bolt12AdOffer {
  offerId: string;
  publisherPubkey: string;
  campaignId: string;
  slotType: 'banner' | 'sidebar' | 'native' | 'sponsored' | 'ppq' | 'ppi';
  offerString: string; // lno1...
  minSatsPerImpression: number;
  maxSatsPerImpression: number;
  estimatedImpressionsPerDay: number;
  status: 'available' | 'sold_out' | 'paused';
  recurring: boolean;
  expiresAt: number;
}

export interface OfferQuery {
  queryId: string;
  advertiserPubkey: string;
  filters: {
    slotTypes?: Bolt12AdOffer['slotType'][];
    maxCpmSats?: number;
    minDailyImpressions?: number;
  };
  results: Bolt12AdOffer[];
  queryAt: number;
}

/** Query BOLT12 offers for ad inventory */
export function queryBolt12Offers(
  filters: OfferQuery['filters'],
  availableOffers: Bolt12AdOffer[]
): OfferQuery {
  let filtered = availableOffers.filter(o => o.status === 'available');
  
  if (filters.slotTypes && filters.slotTypes.length > 0) {
    filtered = filtered.filter(o => filters.slotTypes!.includes(o.slotType));
  }
  
  if (filters.maxCpmSats !== undefined) {
    filtered = filtered.filter(o => o.minSatsPerImpression <= filters.maxCpmSats!);
  }
  
  if (filters.minDailyImpressions !== undefined) {
    filtered = filtered.filter(o => o.estimatedImpressionsPerDay >= filters.minDailyImpressions!);
  }
  
  return {
    queryId: `query_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    advertiserPubkey: `npub1advertiser...`,
    filters,
    results: filtered,
    queryAt: Date.now(),
  };
}

/** Create a BOLT12 ad offer */
export function createBolt12AdOffer(
  publisherPubkey: string,
  campaignId: string,
  slotType: Bolt12AdOffer['slotType'],
  cpmSats: number,
  dailyImpressions: number,
  recurring: boolean = false
): Bolt12AdOffer {
  return {
    offerId: `ad_offer_${Date.now()}`,
    publisherPubkey,
    campaignId,
    slotType,
    offerString: `lno1${Math.random().toString(36).slice(2, 50)}`,
    minSatsPerImpression: Math.floor(cpmSats / 1000),
    maxSatsPerImpression: cpmSats,
    estimatedImpressionsPerDay: dailyImpressions,
    status: 'available',
    recurring,
    expiresAt: Date.now() + 30 * 86400000,
  };
}

/** Mock BOLT12 ad offers */
export const MOCK_BOLT12_AD_OFFERS: Bolt12AdOffer[] = [
  createBolt12AdOffer('npub1pub1...', 'cmp_001', 'banner', 250, 10000, true),
  createBolt12AdOffer('npub1pub2...', 'cmp_002', 'sidebar', 180, 8000, true),
  createBolt12AdOffer('npub1pub3...', 'cmp_003', 'native', 300, 5000, false),
];