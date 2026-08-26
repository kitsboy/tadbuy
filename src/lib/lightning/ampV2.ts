/**
 * Atomic Multi-Path Payments (AMP) v2 — Improved reliability for large campaign budgets
 * 
 * Splits large payments across multiple Lightning channels to reduce risk
 * of channel failure and improve settlement reliability.
 */

export interface Ampv2Payment {
  paymentId: string;
  campaignId: string;
  amountSats: number;
  paths: Ampv2Path[];
  thresholdSats: number;
  lockTime: number;
  status: 'pending' | 'partially_paid' | 'completed' | 'failed';
  createdAt: number;
  paidAt?: number;
}

export interface Ampv2Path {
  id: string;
  paymentId: string;
  channelId: string;
  hopPubkey: string;
  amountSats: number;
  cltvDelta: number;
  status: 'pending' | 'paid' | 'failed';
}

export interface Ampv2PaymentRequest {
  campaignId: string;
  amountSats: number;
  numberOfPaths: number;
  requiredSignatures: number;
}

/** Create an AMPv2 payment request */
export function createAmpv2Payment(
  request: Ampv2PaymentRequest,
  availableChannels: Array<{ channelId: string; capacity: number; feePpm: number }>
): Ampv2Payment {
  const paymentId = `amp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  
  // Create multiple paths with different channels
  const paths: Ampv2Path[] = [];
  const amountPerPath = Math.ceil(request.amountSats / request.numberOfPaths);
  
  for (let i = 0; i < request.numberOfPaths; i++) {
    const channel = availableChannels[i % availableChannels.length];
    paths.push({
      id: `${paymentId}_path_${i}`,
      paymentId,
      channelId: channel.channelId,
      hopPubkey: Math.random().toString(36).slice(2, 58),
      amountSats: amountPerPath,
      cltvDelta: 144,
      status: 'pending',
    });
  }
  
  const totalAmount = request.numberOfPaths * amountPerPath;
  const thresholdSats = Math.floor(totalAmount * 0.6); // 60% threshold for settlement
  
  return {
    paymentId,
    campaignId: request.campaignId,
    amountSats: totalAmount,
    paths,
    thresholdSats,
    lockTime: Math.floor(Date.now() / 1000) + 144, // 24 hours
    status: 'pending',
    createdAt: Date.now(),
  };
}

/** Mock AMPv2 payments */
export const MOCK_AMPV2_PAYMENTS: Ampv2Payment[] = [
  createAmpv2Payment(
    {
      campaignId: 'cmp_001',
      amountSats: 5_000_000,
      numberOfPaths: 3,
      requiredSignatures: 2,
    },
    [
      { channelId: 'ch_001', capacity: 5_000_000, feePpm: 200 },
      { channelId: 'ch_002', capacity: 3_000_000, feePpm: 500 },
      { channelId: 'ch_003', capacity: 7_000_000, feePpm: 300 },
    ]
  ),
];