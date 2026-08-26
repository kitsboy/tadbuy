/**
 * Lightning Channel Jamming Defense — Detect and mitigate routing attacks
 * 
 * Identifies and mitigates Lightning Network routing attacks where malicious
 * actors flood channels with HTLCs to grief routing nodes.
 */

export interface JamEvent {
  jamId: string;
  channelId: string;
  peerPubkey: string;
  jamType: 'hash-flood' | 'time-lock' | 'sat-flood' | '混合';
  htlcCount: number;
  satsLocked: number;
  detectedAt: number;
  resolvedAt?: number;
  resolution: 'closed' | 'dropped' | 'waiting';
  mitigationApplied: boolean;
}

/** Analyze channel for jamming patterns */
export function detectJamming(
  channelId: string,
  peerPubkey: string,
  recentHtlcs: Array<{ amount: number; status: string; createdAt: number }>
): JamEvent | null {
  const failedHtlcs = recentHtlcs.filter(h => h.status === 'failed');
  const totalSatsLocked = recentHtlcs.reduce((s, h) => s + h.amount, 0);
  
  // Detection thresholds (mock)
  const jamThreshold = 50; // failed HTLCs per hour
  const satsThreshold = 1_000_000;
  
  if (failedHtlcs.length > jamThreshold || totalSatsLocked > satsThreshold) {
    return {
      jamId: `jam_${Date.now()}`,
      channelId,
      peerPubkey,
      jamType: failedHtlcs.length > jamThreshold ? 'hash-flood' : 'sat-flood',
      htlcCount: failedHtlcs.length,
      satsLocked: totalSatsLocked,
      detectedAt: Date.now(),
      resolution: 'waiting',
      mitigationApplied: false,
    };
  }
  
  return null;
}

/** Apply mitigation strategy */
export function mitigateJamming(jam: JamEvent): JamEvent {
  return {
    ...jam,
    mitigationApplied: true,
    resolution: 'dropped',
  };
}

/** Mock jam events */
export const MOCK_JAM_EVENTS: JamEvent[] = [
  {
    jamId: 'jam_001',
    channelId: 'ch_malicious',
    peerPubkey: 'npub1attacker...',
    jamType: 'hash-flood',
    htlcCount: 234,
    satsLocked: 2_500_000,
    detectedAt: Date.now() - 3600000,
    mitigationApplied: true,
    resolution: 'closed',
  },
];