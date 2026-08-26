/**
 * Lightning Network Probe — Channel liquidity & route estimation
 * 
 * Probes a target node to estimate inbound/outbound liquidity without
 * leaking route hints. Uses the BOLT-11 probing pattern with dummy
 * payments that fail at the destination.
 */

export interface ProbeResult {
  probeId: string;
  sourceNode: string;
  targetNode: string;
  amountSats: number;
  success: boolean;
  failureReason?: 'unknown_next_peer' | 'temporary_channel_failure' | 'expiry_too_soon' | 'amount_below_minimum' | 'route_not_found' | 'invoice_already_used';
  probedAt: number;
  hopHints: Array<{ node: string; feePpm: number; cltvDelta: number }>;
}

export interface LiquidityEstimate {
  channelId: string;
  sourceNode: string;
  targetNode: string;
  estimatedInboundSats: number;
  estimatedOutboundSats: number;
  confidence: number; // 0-1
  lastProbedAt: number;
}

export async function probeChannel(
  sourceNode: string,
  targetNode: string,
  amountSats: number,
  maxAttempts: number = 5
): Promise<ProbeResult> {
  // Binary search for liquidity — mock implementation
  let lo = 0;
  let hi = amountSats;
  let lastSuccess = false;
  let hops: ProbeResult['hopHints'] = [];

  for (let i = 0; i < maxAttempts; i++) {
    const mid = Math.floor((lo + hi) / 2);
    const success = Math.random() > 0.3; // 70% success rate
    lastSuccess = success;
    if (success) {
      lo = mid;
      hops.push({ node: targetNode, feePpm: 50 + Math.floor(Math.random() * 200), cltvDelta: 144 });
    } else {
      hi = mid;
    }
  }

  return {
    probeId: `probe_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    sourceNode,
    targetNode,
    amountSats: lastSuccess ? lo : hi,
    success: lastSuccess,
    failureReason: lastSuccess ? undefined : 'temporary_channel_failure',
    probedAt: Date.now(),
    hopHints: hops,
  };
}

export function estimateLiquidity(
  probes: ProbeResult[],
  channelId: string
): LiquidityEstimate {
  if (probes.length === 0) {
    return {
      channelId,
      sourceNode: '',
      targetNode: '',
      estimatedInboundSats: 0,
      estimatedOutboundSats: 0,
      confidence: 0,
      lastProbedAt: 0,
    };
  }

  const successful = probes.filter(p => p.success);
  const inbound = successful.reduce((s, p) => s + p.amountSats, 0) / (successful.length || 1);
  const outbound = successful.reduce((s, p) => s + p.amountSats, 0) / (probes.length || 1);

  return {
    channelId,
    sourceNode: probes[0].sourceNode,
    targetNode: probes[0].targetNode,
    estimatedInboundSats: Math.floor(inbound),
    estimatedOutboundSats: Math.floor(outbound),
    confidence: successful.length / probes.length,
    lastProbedAt: probes[0].probedAt,
  };
}

export function formatProbeResult(result: ProbeResult): string {
  return `${result.success ? '✓' : '✗'} Probe ${result.amountSats.toLocaleString()} sats from ` +
         `${result.sourceNode.slice(0, 8)}… → ${result.targetNode.slice(0, 8)}… (${result.failureReason ?? 'success'})`;
}