/**
 * Channel Health Score — Score channels 0–100 based on routing success,
 * capacity, and latency.
 * (Duplicate from earlier - keep going)
 */

export interface ChannelMetrics {
  channelId: string;
  peerName: string;
  capacitySats: number;
  localBalanceSats: number;
  remoteBalanceSats: number;
  routingSuccessRate: number;
  avgRoutingTimeMs: number;
  feeRatePpm: number;
  uptimeLast7Days: number;
  lastPaymentAt: number;
  pendingHtlcs: number;
}

export interface ChannelHealthScore {
  channelId: string;
  score: number;
  tier: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  issues: string[];
  recommendations: string[];
}

export function calculateChannelHealth(metrics: ChannelMetrics): ChannelHealthScore {
  const issues: string[] = [];
  const recommendations: string[] = [];

  const balanceRatio = Math.min(metrics.localBalanceSats / metrics.capacitySats, 1);
  const balanceScore = Math.min(balanceRatio * 30, 30);
  if (balanceRatio < 0.2) {
    issues.push('Severely imbalanced — local balance under 20%');
    recommendations.push('Rebalance: push outbound capacity to peer');
  } else if (balanceRatio > 0.8) {
    issues.push('Local balance high — consider receiving more payments');
  }

  const successScore = metrics.routingSuccessRate * 25;
  if (metrics.routingSuccessRate < 0.8) {
    issues.push(`High failure rate (${(metrics.routingSuccessRate * 100).toFixed(1)}% success)`);
    recommendations.push('Monitor peer for maintenance');
  }

  const latencyScore = Math.max(0, 15 - (metrics.avgRoutingTimeMs / 200) * 15);
  if (metrics.avgRoutingTimeMs > 500) {
    issues.push('High routing latency');
    recommendations.push('Peer may be geographically distant');
  }

  const feeScore = Math.max(0, 15 - (metrics.feeRatePpm / 500) * 15);
  if (metrics.feeRatePpm > 1000) {
    issues.push('High routing fees');
    recommendations.push('Compare with cheaper alternative channels');
  }

  const uptimeScore = metrics.uptimeLast7Days * 15;
  if (metrics.uptimeLast7Days < 0.95) {
    issues.push('Recent downtime detected');
    recommendations.push('Consider setting peer online/offline flags');
  }

  const totalScore = Math.round(balanceScore + successScore + latencyScore + feeScore + uptimeScore);

  let tier: ChannelHealthScore['tier'];
  if (totalScore >= 90) tier = 'excellent';
  else if (totalScore >= 75) tier = 'good';
  else if (totalScore >= 50) tier = 'fair';
  else if (totalScore >= 25) tier = 'poor';
  else tier = 'critical';

  if (tier === 'critical' && !issues.length) {
    issues.push('Overall score critically low');
  }
  if (tier === 'poor') {
    recommendations.push('Close or replace this channel if possible');
  }

  return {
    channelId: metrics.channelId,
    score: totalScore,
    tier,
    issues,
    recommendations,
  };
}

export const MOCK_CHANNELS: ChannelMetrics[] = [
  {
    channelId: 'ch_001',
    peerName: 'ACINQ',
    capacitySats: 5_000_000,
    localBalanceSats: 2_500_000,
    remoteBalanceSats: 2_500_000,
    routingSuccessRate: 0.98,
    avgRoutingTimeMs: 120,
    feeRatePpm: 200,
    uptimeLast7Days: 1.0,
    lastPaymentAt: Date.now() - 3_600_000,
    pendingHtlcs: 2,
  },
];

export const MOCK_HEALTH_SCORES = MOCK_CHANNELS.map(calculateChannelHealth);