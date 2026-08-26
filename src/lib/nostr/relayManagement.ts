/**
 * Nostr NIP-65 Relay List Management — Curated relay sets per campaign type
 */

export interface RelayList {
  relays: Array<{
    url: string;
    pubkey: string;
    permission: 'read' | 'write' | 'subscribe' | 'event';
    rate_limits?: {
      max_rate: number;
      rate_limited: boolean;
    };
  }>;
  created_at: number;
  sig: string;
}

export interface CampaignRelaySet {
  id: string;
  name: string;
  description: string;
  type: 'advertiser' | 'publisher' | 'analytics' | 'community';
  recommendedRelays: string[];
  minimumRelayCount: number;
}

/** Get recommended relays for campaign type */
export function getRelaysForCampaign(type: CampaignRelaySet['type']): string[] {
  const maps = {
    advertiser: ['wss://relay.damus.io', 'wss://relay.nostr.info', 'wss://nos.lol'],
    publisher: ['wss://relay.damus.io', 'wss://nostr.wine', 'wss://relay.primal.net'],
    analytics: ['wss://analytics.nostr.com', 'wss://relay.damus.io', 'wss://nostr.wine'],
    community: ['wss://relay.damus.io', 'wss://nos.lol', 'wss://nostr.wine'],
  };
  return maps[type];
}

/** Create relay list for campaign */
export function createCampaignRelayList(campaignId: string, type: CampaignRelaySet['type']): RelayList {
  const urls = getRelaysForCampaign(type);
  return {
    relays: urls.map(url => ({
      url,
      pubkey: Math.random().toString(36).slice(2, 10),
      permission: 'subscribe' as const,
    })),
    created_at: Math.floor(Date.now() / 1000),
    sig: 'signed_by_campaign_owner',
  };
}

/** Campaign relay sets for different use cases */
export const CAMPAIGN_RELAY_SETS: CampaignRelaySet[] = [
  {
    id: 'crs_001',
    name: 'Global Publisher Network',
    description: 'Wide distribution for brand awareness campaigns',
    type: 'advertiser',
    recommendedRelays: ['wss://relay.damus.io', 'wss://nos.lol', 'wss://relay.primal.net'],
    minimumRelayCount: 2,
  },
];