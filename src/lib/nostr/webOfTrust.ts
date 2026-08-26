/**
 * Nostr WOT (Web of Trust) — Trust graph from follow network
 * 
 * Computes trust scores for Nostr pubkeys based on the follow
 * network (kind 3 events) and attestation events. Used to
 * filter spam/sybil attackers from legitimate publishers.
 */

export interface FollowGraph {
  pubkey: string;
  follows: string[];
  followers: number;
  totalFollows: number;
  mutes: string[];
  reports: string[];
  lastUpdated: number;
}

export interface WotScore {
  pubkey: string;
  trustScore: number; // 0-100
  hops: number; // 0 = direct, 1 = friend-of-friend, etc.
  verifiedFollows: number;
  muted: boolean;
  reported: boolean;
  reason: string;
}

export const MAX_HOPS = 3;

export async function fetchFollowGraph(pubkey: string, relays: string[] = ['wss://relay.damus.io']): Promise<FollowGraph> {
  // In production, this would query relays for kind 3 (contact list) events
  return {
    pubkey,
    follows: [],
    followers: 0,
    totalFollows: 0,
    mutes: [],
    reports: [],
    lastUpdated: Date.now(),
  };
}

export async function buildTrustGraph(seedPubkeys: string[], depth: number = 2): Promise<Map<string, WotScore>> {
  // Build a simple BFS trust graph from seed pubkeys
  const scores = new Map<string, WotScore>();
  const visited = new Set<string>();
  const queue: Array<{ pubkey: string; hops: number }> = seedPubkeys.map(pk => ({ pubkey: pk, hops: 0 }));

  while (queue.length > 0) {
    const { pubkey, hops } = queue.shift()!;
    if (visited.has(pubkey) || hops > MAX_HOPS) continue;
    visited.add(pubkey);

    const graph = await fetchFollowGraph(pubkey);
    const trustScore = Math.max(0, 100 - hops * 30);

    scores.set(pubkey, {
      pubkey,
      trustScore,
      hops,
      verifiedFollows: graph.totalFollows,
      muted: graph.mutes.length > 0,
      reported: graph.reports.length > 0,
      reason: hops === 0 ? 'Direct follow' : `${hops} hops away`,
    });

    if (hops < depth) {
      for (const follow of graph.follows.slice(0, 50)) {
        if (!visited.has(follow)) {
          queue.push({ pubkey: follow, hops: hops + 1 });
        }
      }
    }
  }

  return scores;
}

export function evaluateTrust(score: WotScore): 'high' | 'medium' | 'low' | 'blocked' {
  if (score.reported) return 'blocked';
  if (score.trustScore >= 70) return 'high';
  if (score.trustScore >= 40) return 'medium';
  return 'low';
}

export function formatWotScore(score: WotScore): string {
  return `npub1${score.pubkey.slice(0, 8)}… — ${score.trustScore}/100 (${score.hops} hops, ${score.verifiedFollows} follows)`;
}