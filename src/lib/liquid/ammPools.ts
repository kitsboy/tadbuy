/**
 * Liquid Network Automated Market Makers — On-Liquid AMM pools
 * 
 * AMM pools for L-BTC/L-USDt, L-BTC/TAD, and other Liquid assets
 * with constant product formula (x*y=k) for instant swaps.
 */

export interface AmmPool {
  poolId: string;
  assetA: string;
  assetB: string;
  reserveA: number;
  reserveB: number;
  totalLps: number;
  feeBps: number; // 30 = 0.30%
  volume24h: number;
  apy: number; // estimated annual percentage yield
  lastUpdated: number;
}

export interface SwapQuote {
  fromAsset: string;
  toAsset: string;
  fromAmount: number;
  toAmount: number;
  fee: number;
  priceImpact: number; // 0-1
  slippage: number;
  poolId: string;
}

/** Get swap quote from AMM */
export function getAmmSwapQuote(
  pool: AmmPool,
  fromAsset: string,
  fromAmount: number
): SwapQuote {
  const isAssetA = fromAsset === pool.assetA;
  const reserveIn = isAssetA ? pool.reserveA : pool.reserveB;
  const reserveOut = isAssetA ? pool.reserveB : pool.reserveA;
  
  // Constant product formula with fee
  const feeMultiplier = 1 - pool.feeBps / 10000;
  const amountInWithFee = fromAmount * feeMultiplier;
  const numerator = amountInWithFee * reserveOut;
  const denominator = reserveIn + amountInWithFee;
  const amountOut = Math.floor(numerator / denominator);
  
  const fee = Math.floor(fromAmount * pool.feeBps / 10000);
  const priceImpact = (fromAmount / reserveIn);
  const idealRate = reserveOut / reserveIn;
  const actualRate = amountOut / fromAmount;
  const slippage = (idealRate - actualRate) / idealRate;
  
  return {
    fromAsset,
    toAsset: isAssetA ? pool.assetB : pool.assetA,
    fromAmount,
    toAmount: amountOut,
    fee,
    priceImpact,
    slippage,
    poolId: pool.poolId,
  };
}

/** Add liquidity to AMM */
export function addLiquidity(
  pool: AmmPool,
  amountA: number,
  amountB: number
): { pool: AmmPool; lpTokens: number } {
  // Calculate LP tokens based on contribution ratio
  const ratio = Math.min(
    amountA / pool.reserveA,
    amountB / pool.reserveB
  );
  const lpTokens = Math.floor(pool.totalLps * ratio);
  
  return {
    pool: {
      ...pool,
      reserveA: pool.reserveA + amountA,
      reserveB: pool.reserveB + amountB,
      totalLps: pool.totalLps + lpTokens,
    },
    lpTokens,
  };
}

/** Remove liquidity from AMM */
export function removeLiquidity(
  pool: AmmPool,
  lpTokens: number
): { pool: AmmPool; amountA: number; amountB: number } {
  const share = lpTokens / pool.totalLps;
  
  return {
    pool: {
      ...pool,
      reserveA: Math.floor(pool.reserveA * (1 - share)),
      reserveB: Math.floor(pool.reserveB * (1 - share)),
      totalLps: pool.totalLps - lpTokens,
    },
    amountA: Math.floor(pool.reserveA * share),
    amountB: Math.floor(pool.reserveB * share),
  };
}

/** Mock AMM pools */
export const MOCK_AMM_POOLS: AmmPool[] = [
  {
    poolId: 'pool_001',
    assetA: 'L-BTC',
    assetB: 'L-USDt',
    reserveA: 10_000_000_000, // 100 L-BTC
    reserveB: 6_500_000_000_000, // 65M L-USDt
    totalLps: 25_000_000,
    feeBps: 30, // 0.30%
    volume24h: 500_000_000,
    apy: 0.12, // 12% APY
    lastUpdated: Date.now(),
  },
];