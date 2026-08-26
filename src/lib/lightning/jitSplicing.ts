/**
 * Lightning JIT Channel Splicing — Auto-splice inbound/outbound liquidity
 * 
 * Predicts campaign spend and automatically splices channels to ensure
 * sufficient outbound capacity for Lightning payments.
 * 
 * Reference: https://github.com/lightning/bolts/blob/master/11-payment-encoding.md
 */

export interface SpliceRequest {
  channelId: string;
  spliceAmountSats: number;
  direction: 'inbound' | 'outbound';
  reason: string;
  campaignId?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'queued' | 'processing' | 'completed' | 'failed';
  createdAt: number;
  completedAt?: number;
  txid?: string;
}

export interface SplicePrediction {
  campaignId: string;
  predictedDailySpendSats: number;
  confidence: number; // 0-1
  recommendedSpliceAmount: number;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  reason: string;
}

/** Predict required splice based on campaign spend forecast */
export function predictSplice(
  campaignId: string,
  currentOutboundSats: number,
  predictedDailySpendSats: number,
  daysUntilNextPayout: number = 7
): SplicePrediction {
  const totalNeeded = predictedDailySpendSats * daysUntilNextPayout;
  const shortfall = Math.max(0, totalNeeded - currentOutboundSats);
  
  let urgency: SplicePrediction['urgency'] = 'low';
  let reason = 'Sufficient outbound capacity';
  
  if (shortfall > 0) {
    if (shortfall < currentOutboundSats * 0.2) urgency = 'low';
    else if (shortfall < currentOutboundSats * 0.5) urgency = 'medium';
    else if (shortfall < currentOutboundSats) urgency = 'high';
    else urgency = 'urgent';
    reason = `Shortfall of ${shortfall.toLocaleString()} sats for next ${daysUntilNextPayout} days`;
  }
  
  return {
    campaignId,
    predictedDailySpendSats,
    confidence: 0.85,
    recommendedSpliceAmount: shortfall,
    urgency,
    reason,
  };
}

/** Create a splice request */
export function createSpliceRequest(
  channelId: string,
  spliceAmountSats: number,
  direction: SpliceRequest['direction'],
  reason: string,
  campaignId?: string,
  priority: SpliceRequest['priority'] = 'medium'
): SpliceRequest {
  return {
    channelId,
    spliceAmountSats,
    direction,
    reason,
    campaignId,
    priority,
    status: 'pending',
    createdAt: Date.now(),
  };
}

/** Process a splice request (mock) */
export async function processSplice(request: SpliceRequest): Promise<SpliceRequest> {
  // In production, this would:
  // 1. Open a channel with the peer
  // 2. Create a splice transaction
  // 3. Sign and broadcast
  // 4. Wait for confirmation
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    ...request,
    status: 'completed',
    completedAt: Date.now(),
    txid: `sp_${Date.now()}`,
  };
}

/** Mock splice predictions for dashboard */
export const MOCK_SPLICE_PREDICTIONS: SplicePrediction[] = [
  predictSplice('cmp_001', 5_000_000, 1_500_000, 7),
  predictSplice('cmp_002', 1_000_000, 500_000, 7),
  predictSplice('cmp_003', 100_000, 2_000_000, 7),
];