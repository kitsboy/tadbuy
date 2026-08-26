/**
 * Atomic Swap Rate Alerts — Notify when L1↔L2 rates improve
 * 
 * Monitors submarine swap rates and triggers notifications when
 * rates cross user-defined thresholds. Supports L1→L2, L2→L1,
 * and Liquid↔Bitcoin cross-chain swaps.
 */

export interface SwapAlertRule {
  id: string;
  userId: string;
  direction: 'btc_to_lbtc' | 'lbtc_to_btc' | 'btc_to_lusdt' | 'lusdt_to_btc';
  targetRate: number; // target output/input ratio
  currentRate: number;
  thresholdBps: number; // basis points above/below target
  enabled: boolean;
  createdAt: number;
  triggeredAt?: number;
  notificationSent: boolean;
}

export interface SwapRateSnapshot {
  direction: SwapAlertRule['direction'];
  rate: number;
  provider: string;
  feeSats: number;
  timestamp: number;
}

/** Check if a swap alert should trigger */
export function checkSwapAlert(
  rule: SwapAlertRule,
  snapshot: SwapRateSnapshot
): boolean {
  if (!rule.enabled || rule.notificationSent) return false;
  if (snapshot.direction !== rule.direction) return false;

  const targetWithThreshold = rule.targetRate * (1 + rule.thresholdBps / 10000);
  
  // For buying, rate should be >= target; for selling, rate should be <= target
  const isBuying = ['btc_to_lbtc', 'btc_to_lusdt'].includes(rule.direction);
  
  if (isBuying) {
    return snapshot.rate >= targetWithThreshold;
  } else {
    return snapshot.rate <= targetWithThreshold;
  }
}

/** Format alert notification message */
export function formatSwapAlert(rule: SwapAlertRule, snapshot: SwapRateSnapshot): string {
  const directionLabel = {
    'btc_to_lbtc': 'BTC → L-BTC',
    'lbtc_to_btc': 'L-BTC → BTC',
    'btc_to_lusdt': 'BTC → L-USDt',
    'lusdt_to_btc': 'L-USDt → BTC',
  }[rule.direction];

  return `🔔 Swap Rate Alert: ${directionLabel} rate improved to ${snapshot.rate.toFixed(6)} ` +
         `(target: ${rule.targetRate.toFixed(6)}). Fee: ${snapshot.feeSats} sats via ${snapshot.provider}.`;
}

/** Mock rate monitoring */
export const MOCK_RATE_SNAPSHOTS: SwapRateSnapshot[] = [
  { direction: 'btc_to_lbtc', rate: 0.9995, provider: 'Boltz', feeSats: 300, timestamp: Date.now() },
  { direction: 'lbtc_to_btc', rate: 1.0005, provider: 'SideSwap', feeSats: 250, timestamp: Date.now() - 60000 },
  { direction: 'btc_to_lusdt', rate: 0.0501, provider: 'Boltz', feeSats: 200, timestamp: Date.now() - 120000 },
  { direction: 'lusdt_to_btc', rate: 19.95, provider: 'Oasis', feeSats: 500, timestamp: Date.now() - 180000 },
];