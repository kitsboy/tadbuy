/**
 * Dynamic Yield Optimization — Real-time bidding adjustment based on campaign performance
 * 
 * Adjusts bid prices in real-time based on conversion rates, viewability,
 * and competitive landscape to maximize advertiser ROI.
 */

export interface YieldOptimizationConfig {
  campaignId: string;
  baseBidSats: number;
  minBidSats: number;
  maxBidSats: number;
  targetROAS: number; // Return on Ad Spend
  adjustmentInterval: number; // seconds
  metricsWindow: number; // seconds of data to consider
  enabled: boolean;
}

export interface YieldAdjustment {
  adjustmentId: string;
  campaignId: string;
  oldBid: number;
  newBid: number;
  reason: string;
  metrics: {
    currentROAS: number;
    viewabilityRate: number;
    conversionRate: number;
    avgFeeSats: number;
  };
  appliedAt: number;
}

/** Calculate optimal bid adjustment */
export function calculateBidAdjustment(
  config: YieldOptimizationConfig,
  currentMetrics: YieldAdjustment['metrics']
): YieldAdjustment | null {
  if (!config.enabled) return null;
  
  const { currentROAS, viewabilityRate, conversionRate, avgFeeSats } = currentMetrics;
  const targetROAS = config.targetROAS;
  
  // Simple adjustment logic (real impl uses ML)
  let adjustment = 0;
  let reason = '';
  
  if (currentROAS < targetROAS * 0.8) {
    adjustment = -0.15; // decrease bid 15%
    reason = `ROAS ${currentROAS.toFixed(2)} below target ${targetROAS}`;
  } else if (currentROAS > targetROAS * 1.2 && viewabilityRate > 0.7) {
    adjustment = 0.1; // increase bid 10%
    reason = `Strong performance: ROAS ${currentROAS.toFixed(2)}, viewability ${(viewabilityRate * 100).toFixed(1)}%`;
  }
  
  if (adjustment === 0) return null;
  
  const newBid = Math.max(config.minBidSats, Math.min(config.maxBidSats, 
    Math.round(config.baseBidSats * (1 + adjustment))
  ));
  
  if (newBid === config.baseBidSats) return null;
  
  return {
    adjustmentId: `adj_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    campaignId: config.campaignId,
    oldBid: config.baseBidSats,
    newBid,
    reason,
    metrics: currentMetrics,
    appliedAt: Date.now(),
  };
}

/** Apply adjustment to campaign */
export function applyBidAdjustment(
  config: YieldOptimizationConfig,
  adjustment: YieldAdjustment
): YieldOptimizationConfig {
  return {
    ...config,
    baseBidSats: adjustment.newBid,
  };
}

/** Mock yield optimization */
export const MOCK_YIELD_CONFIGS: YieldOptimizationConfig[] = [
  {
    campaignId: 'cmp_001',
    baseBidSats: 100,
    minBidSats: 50,
    maxBidSats: 500,
    targetROAS: 2.0,
    adjustmentInterval: 300,
    metricsWindow: 3600,
    enabled: true,
  },
];