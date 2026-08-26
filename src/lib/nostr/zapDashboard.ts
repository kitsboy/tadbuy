/**
 * Nostr Zap Dashboard — Live Zaps per publisher with earnings
 * 
 * Implements NIP-57 Zap receipts (kind 9735) tracking for publishers.
 * Shows live zap earnings, cumulative totals, top contributors, and
 * real-time zap flow with satoshi-denominated receipts.
 * 
 * NIP-57: https://github.com/nostr-protocol/nips/blob/master/57.md
 */

export interface ZapEvent {
  id: string;
  pubkey: string;
  zapperName: string;
  zapperNpub: string;
  amountSats: number;
  bolt11?: string;
  preimage?: string;
  comment?: string;
  campaignId: string;
  campaignName: string;
  timestamp: number;
  relays: string[];
  verified: boolean;
}

export interface PublisherZapStats {
  publisherId: string;
  publisherName: string;
  totalZaps: number;
  totalSats: number;
  avgZapSize: number;
  topZappers: Array<{ npub: string; name: string; sats: number }>;
  zapHistory: Array<{ date: string; sats: number; count: number }>;
  lastZapAt: number;
  verified: boolean;
}

export interface ZapDashboardFeed {
  stats: PublisherZapStats;
  recentZaps: ZapEvent[];
  zapRatePerHour: number;
  estimatedDailyEarningsSats: number;
  unconfirmedZaps: number;
  lastUpdated: number;
}

/** Parse a NIP-57 zap receipt event (kind 9735) */
export function parseZapReceipt(eventContent: string): ZapEvent | null {
  try {
    const parts = eventContent.split('&');
    const params: Record<string, string> = {};
    parts.forEach((p) => {
      const [k, v] = p.split('=');
      if (k && v) params[k] = decodeURIComponent(v);
    });

    if (!params.amount) return null;

    return {
      id: params.id || `zap_${Date.now().toString(36)}`,
      pubkey: params.pubkey || '',
      zapperName: params.npub ? npubToName(params.npub) : 'Anonymous',
      zapperNpub: params.npub || '',
      amountSats: parseInt(params.amount) / 1000, // msats → sats
      bolt11: params.bolt11,
      preimage: params.preimage,
      comment: params.comment,
      campaignId: params.campaign || 'unknown',
      campaignName: params.name || 'Campaign',
      timestamp: parseInt(params.created_at || '0') * 1000,
      relays: params.relays ? params.relays.split(',') : [],
      verified: !!params.preimage,
    };
  } catch {
    return null;
  }
}

/** Convert npub to short display name */
function npubToName(npub: string): string {
  if (!npub || npub.length < 8) return 'Anonymous';
  return `⚡${npub.slice(0, 4)}…${npub.slice(-4)}`;
}

/** Simulate a batch of zap events for dashboard display */
export function simulateZapFeed(
  publisherId: string,
  publisherName: string,
  count: number = 20
): ZapDashboardFeed {
  const campaigns = ['Bitcoin Ad Q3', 'Lightning Promo', 'DSP Launch', 'Nostr Boost'];
  const zappers = [
    { npub: 'npub1a2b3c4d5e6f', name: 'BitcoinMaxi_21' },
    { npub: 'npub1x2y3z4a5b6c', name: 'LightningLover' },
    { npub: 'npub1q9w0e1r2t3y', name: 'NostrBuilder' },
    { npub: 'npub9m8n7l6k5j4', name: 'SatsAccumulator' },
    { npub: 'npub8v7u6t5s4r3', name: 'GiveabitFan' },
  ];

  const recentZaps: ZapEvent[] = Array.from({ length: count }, (_, i) => {
    const zapper = zappers[Math.floor(Math.random() * zappers.length)];
    const amount = [21, 55, 100, 233, 500, 1000, 2500, 5000][Math.floor(Math.random() * 8)];
    return {
      id: `zap_${Date.now().toString(36)}_${i}`,
      pubkey: zapper.npub,
      zapperName: zapper.name,
      zapperNpub: zapper.npub,
      amountSats: amount,
      campaignId: `cmp_${i % 4}`,
      campaignName: campaigns[i % campaigns.length],
      timestamp: Date.now() - Math.floor(Math.random() * 86400000),
      relays: ['wss://relay.damus.io', 'wss://nos.lol'],
      verified: Math.random() > 0.1,
    };
  }).sort((a, b) => b.timestamp - a.timestamp);

  const totalSats = recentZaps.reduce((s, z) => s + z.amountSats, 0);
  const topZappers = zappers
    .map((z) => ({
      npub: z.npub,
      name: z.name,
      sats: recentZaps.filter((zap) => zap.zapperNpub === z.npub).reduce((s, z) => s + z.amountSats, 0),
    }))
    .filter((z) => z.sats > 0)
    .sort((a, b) => b.sats - a.sats);

  const now = Date.now();
  const zapHistory = Array.from({ length: 30 }, (_, i) => {
    const day = new Date(now - i * 86400000);
    const dateStr = day.toISOString().slice(0, 10);
    const dayZaps = recentZaps.filter((z) => z.timestamp >= day.getTime() && z.timestamp < day.getTime() + 86400000);
    return {
      date: dateStr,
      sats: dayZaps.length > 0 ? dayZaps.reduce((s, z) => s + z.amountSats, 0) : Math.floor(Math.random() * 5000),
      count: dayZaps.length > 0 ? dayZaps.length : Math.floor(Math.random() * 20) + 1,
    };
  }).reverse();

  const stats: PublisherZapStats = {
    publisherId,
    publisherName,
    totalZaps: count,
    totalSats,
    avgZapSize: Math.round(totalSats / count),
    topZappers: topZappers.slice(0, 5),
    zapHistory,
    lastZapAt: recentZaps[0]?.timestamp ?? now,
    verified: true,
  };

  const last24h = recentZaps.filter((z) => now - z.timestamp < 86400000);
  const zapRatePerHour = last24h.length / 24;

  return {
    stats,
    recentZaps: recentZaps.slice(0, 10),
    zapRatePerHour,
    estimatedDailyEarningsSats: Math.round(stats.totalSats * (24 / Math.max(count, 1))),
    unconfirmedZaps: Math.floor(Math.random() * 3),
    lastUpdated: now,
  };
}

/** Format satoshi amount for display */
export function formatSats(sats: number): string {
  if (sats >= 1_000_000) return `₿${(sats / 100_000_000).toFixed(4)}`;
  if (sats >= 1_000) return `${(sats / 1000).toFixed(1)}k sats`;
  return `${sats} sats`;
}
