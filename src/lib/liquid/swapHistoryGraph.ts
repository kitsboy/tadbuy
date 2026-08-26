/**
 * Cross-Chain Swap History Graph — Interactive graph of swaps with fees
 * 
 * Tracks and visualizes cross-chain swap history (BTC↔L-BTC, L-USDt↔L-BTC,
 * etc.) with fee analysis and rate comparison graphs.
 */

export interface SwapHistoryEntry {
  id: string;
  timestamp: number;
  fromAsset: string;
  toAsset: string;
  fromAmount: number;
  toAmount: number;
  feeSats: number;
  feeUsd: number;
  rate: number;
  provider: string;
  txid: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  direction: 'l1_to_l2' | 'l2_to_l1' | 'cross_chain';
}

export interface SwapHistoryGraph {
  entries: SwapHistoryEntry[];
  feeAnalysis: {
    totalFeesSats: number;
    avgFeePerSwap: number;
    feeVolatility: number;
    cheapestProvider: string;
    mostExpensiveProvider: string;
  };
  rateComparison: {
    avgRateL1ToL2: number;
    avgRateL2ToL1: number;
    bestRateTimestamp: number;
    worstRateTimestamp: number;
  };
  lastUpdated: number;
}

/** Parse swap history from blockchain/explorer data */
export function parseSwapHistory(rawData: any[]): SwapHistoryEntry[] {
  return rawData.map(d => ({
    id: d.id || `swap_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    timestamp: d.timestamp,
    fromAsset: d.from_asset || d.fromAsset,
    toAsset: d.to_asset || d.toAsset,
    fromAmount: d.from_amount || d.fromAmount,
    toAmount: d.to_amount || d.toAmount,
    feeSats: d.fee_sats || d.feeSats || 0,
    feeUsd: d.fee_usd || d.feeUsd || 0,
    rate: d.to_amount / d.from_amount,
    provider: d.provider || 'Unknown',
    txid: d.txid || '',
    status: d.status || 'completed',
    direction: d.direction || 'l1_to_l2',
  }));
}

/** Calculate fee analysis from swap history */
export function calculateFeeAnalysis(entries: SwapHistoryEntry[]): SwapHistoryGraph['feeAnalysis'] {
  const completed = entries.filter(e => e.status === 'completed');
  const totalFeesSats = completed.reduce((s, e) => s + e.feeSats, 0);
  const avgFeePerSwap = completed.length > 0 ? totalFeesSats / completed.length : 0;
  
  const fees = completed.map(e => e.feeSats);
  const feeVolatility = fees.length > 0
    ? Math.sqrt(fees.reduce((s, f) => s + Math.pow(f - avgFeePerSwap, 2), 0) / fees.length)
    : 0;
  
  const byProvider = completed.reduce((map, e) => {
    map[e.provider] = (map[e.provider] || 0) + e.feeSats;
    return map;
  }, {} as Record<string, number>);
  
  const sortedProviders = Object.entries(byProvider).sort(([,a], [,b]) => a - b);
  
  return {
    totalFeesSats,
    avgFeePerSwap,
    feeVolatility: Math.round(feeVolatility),
    cheapestProvider: sortedProviders[0]?.[0] || 'N/A',
    mostExpensiveProvider: sortedProviders[sortedProviders.length - 1]?.[0] || 'N/A',
  };
}

/** Generate mock swap history */
export const MOCK_SWAP_HISTORY: SwapHistoryEntry[] = Array.from({ length: 24 }, (_, i) => ({
  id: `swap_${i}_${Date.now()}`,
  timestamp: Date.now() - (24 - i) * 3600_000,
  fromAsset: 'BTC',
  toAsset: 'L-BTC',
  fromAmount: 100_000,
  toAmount: 99_980,
  feeSats: 500 + Math.floor(Math.random() * 500),
  feeUsd: 1.5,
  rate: 0.9998,
  provider: 'Boltz',
  txid: `tx_${Math.random().toString(36).slice(2, 66)}`,
  status: 'completed',
  direction: 'l1_to_l2',
}));

export const MOCK_SWAP_GRAPH: SwapHistoryGraph = {
  entries: MOCK_SWAP_HISTORY,
  feeAnalysis: calculateFeeAnalysis(MOCK_SWAP_HISTORY),
  rateComparison: {
    avgRateL1ToL2: 0.9998,
    avgRateL2ToL1: 1.0002,
    bestRateTimestamp: MOCK_SWAP_HISTORY[0].timestamp,
    worstRateTimestamp: MOCK_SWAP_HISTORY[MOCK_SWAP_HISTORY.length - 1].timestamp,
  },
  lastUpdated: Date.now(),
};