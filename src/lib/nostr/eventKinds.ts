/**
 * Nostr Event Kind Registry — Standardized kinds for ad industry events
 * 
 * Defines Nostr event kinds for ad-related events: campaign creation,
 * impressions, clicks, conversions, escrow releases, etc.
 * 
 * Follows NIP-33 (replaceable events) and NIP-72 (moderated communities)
 * patterns for industry-wide compatibility.
 */

export interface KindDefinition {
  kind: number;
  name: string;
  description: string;
  contentSchema: Record<string, string>;
  tags: string[];
  replaceable: boolean;
  expiration: boolean;
}

export const NOSTR_AD_KINDS: Record<string, KindDefinition> = {
  AD_CAMPAIGN: {
    kind: 30000,
    name: 'ad.campaign',
    description: 'Ad campaign metadata, budget, targeting, schedule',
    contentSchema: {
      name: 'string',
      budgetSats: 'number',
      platform: 'string',
      startAt: 'number',
      endAt: 'number',
      creatives: 'array<url>',
    },
    tags: ['d', 'platform', 'budget', 'start', 'end'],
    replaceable: true,
    expiration: true,
  },
  
  AD_IMPRESSION: {
    kind: 30001,
    name: 'ad.impression',
    description: 'Individual ad impression with viewability proof',
    contentSchema: {
      creativeUrl: 'string',
      campaignId: 'string',
      publisherDomain: 'string',
      viewable: 'boolean',
      durationMs: 'number',
    },
    tags: ['d', 'campaign', 'publisher', 'proof'],
    replaceable: false,
    expiration: false,
  },
  
  AD_CLICK: {
    kind: 30002,
    name: 'ad.click',
    description: 'User clicked an ad',
    contentSchema: {
      campaignId: 'string',
      creativeUrl: 'string',
      clickUrl: 'string',
      timestamp: 'number',
    },
    tags: ['d', 'campaign', 'click_url'],
    replaceable: false,
    expiration: false,
  },
  
  AD_CONVERSION: {
    kind: 30003,
    name: 'ad.conversion',
    description: 'Conversion event (purchase, signup, etc.)',
    contentSchema: {
      campaignId: 'string',
      conversionType: 'string',
      valueSats: 'number',
      attributionMethod: 'string',
    },
    tags: ['d', 'campaign', 'type', 'value'],
    replaceable: false,
    expiration: false,
  },
  
  AD_ESCROW: {
    kind: 30004,
    name: 'ad.escrow',
    description: 'Escrow funding and release events',
    contentSchema: {
      escrowId: 'string',
      campaignId: 'string',
      amountSats: 'number',
      status: 'string',
      releaseAt: 'number',
    },
    tags: ['d', 'escrow', 'campaign', 'status'],
    replaceable: true,
    expiration: true,
  },
  
  AD_PAYOUT: {
    kind: 30005,
    name: 'ad.payout',
    description: 'Publisher payout notification',
    contentSchema: {
      payoutId: 'string',
      publisherPubkey: 'string',
      amountSats: 'number',
      paymentType: 'string',
      timestamp: 'number',
    },
    tags: ['d', 'publisher', 'amount', 'type'],
    replaceable: false,
    expiration: false,
  },
};

/** Helper to create a tagged Nostr event for a kind */
export function createAdEvent(
  kind: keyof typeof NOSTR_AD_KINDS,
  data: Record<string, any>,
  pubkey: string
): { kind: number; content: string; tags: string[][] } {
  const def = NOSTR_AD_KINDS[kind];
  return {
    kind: def.kind,
    content: JSON.stringify(data),
    tags: def.tags.map(tag => [tag, String(data[tag] ?? '')]),
  };
}

/** Format kind for display */
export function formatKind(kind: number): string {
  const def = Object.values(NOSTR_AD_KINDS).find(k => k.kind === kind);
  return def ? def.name : `kind:${kind}`;
}