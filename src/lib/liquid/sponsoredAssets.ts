/**
 * Sponsored Liquid Assets — Branded assets that pay yield to holders
 * 
 * Custom Liquid assets that automatically distribute a portion of
 * transaction fees or campaign revenue to asset holders.
 */

export interface SponsoredAsset {
  assetId: string;
  ticker: string;
  name: string;
  sponsor: string;
  yieldRateBps: number; // basis points per year
  totalSupply: number;
  circulatingSupply: number;
  lastDistribution: number;
  distributionInterval: number; // seconds
  status: 'active' | 'paused' | 'deprecated';
}

/** Calculate yield distribution */
export function calculateYieldDistributed(
  asset: SponsoredAsset,
  now: number = Date.now()
): number {
  const elapsedSeconds = now - asset.lastDistribution;
  const periods = elapsedSeconds / asset.distributionInterval;
  
  if (periods < 1) return 0;
  
  const annualYieldFraction = asset.yieldRateBps / 10000;
  const periodYield = annualYieldFraction * (asset.distributionInterval / (365 * 24 * 3600));
  const distributable = Math.floor(asset.circulatingSupply * periodYield * periods);
  
  return distributable;
}

/** Create a sponsored asset */
export function createSponsoredAsset(
  ticker: string,
  name: string,
  sponsor: string,
  yieldRateBps: number,
  initialSupply: number
): SponsoredAsset {
  return {
    assetId: `spons_${Math.random().toString(36).slice(2, 32)}`,
    ticker,
    name,
    sponsor,
    yieldRateBps,
    totalSupply: initialSupply,
    circulatingSupply: initialSupply,
    lastDistribution: Date.now(),
    distributionInterval: 86400 * 30, // monthly
    status: 'active',
  };
}

/** Mock sponsored assets */
export const MOCK_SPONSORED_ASSETS: SponsoredAsset[] = [
  createSponsoredAsset('TADY', 'Tadbuy Yield', 'tadbuy.io', 500, 10_000_000), // 5% APY
  createSponsoredAsset('LIGHT', 'Lightning Network Fund', 'lnf.io', 300, 5_000_000), // 3% APY
];