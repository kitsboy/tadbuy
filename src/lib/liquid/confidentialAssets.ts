/**
 * Liquid Confidential Assets — Issue and track branded synthetic assets
 * 
 * Liquid supports issuing custom assets (e.g., TAD/USD) using the same
 * confidential transfer technology as L-BTC. Each asset has an asset_id
 * and is pegged to a specific denomination.
 */

export interface LiquidAsset {
  assetId: string;
  ticker: string;
  name: string;
  domain: string; // issuer domain for verification
  precision: number;
  totalSupply: number;
  circulatingSupply: number;
  peggedTo: 'USD' | 'BTC' | 'EUR' | 'free-floating';
  pegRatio: number; // 1.0 = 1:1 peg
  status: 'active' | 'paused' | 'deprecated';
  iconUrl?: string;
}

export interface ConfidentialAssetTransfer {
  txid: string;
  assetId: string;
  amount: number;
  blinded: boolean;
  sender: string;
  receiver: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
}

/** Register a new confidential asset on Liquid */
export function registerLiquidAsset(
  ticker: string,
  name: string,
  domain: string,
  peggedTo: LiquidAsset['peggedTo'],
  initialSupply: number
): LiquidAsset {
  // Asset ID is a 32-byte hex string derived from domain + ticker
  const assetId = Array.from({ length: 64 })
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join('');
  
  return {
    assetId,
    ticker,
    name,
    domain,
    precision: 8,
    totalSupply: initialSupply,
    circulatingSupply: initialSupply,
    peggedTo,
    pegRatio: peggedTo === 'free-floating' ? 0 : 1.0,
    status: 'active',
  };
}

/** Issue additional tokens */
export function mintAsset(asset: LiquidAsset, amount: number): LiquidAsset {
  return {
    ...asset,
    totalSupply: asset.totalSupply + amount,
    circulatingSupply: asset.circulatingSupply + amount,
  };
}

/** Burn tokens (remove from supply) */
export function burnAsset(asset: LiquidAsset, amount: number): LiquidAsset {
  return {
    ...asset,
    totalSupply: asset.totalSupply - amount,
    circulatingSupply: asset.circulatingSupply - amount,
  };
}

/** Create a confidential transfer */
export function createConfidentialAssetTransfer(
  assetId: string,
  amount: number,
  sender: string,
  receiver: string
): ConfidentialAssetTransfer {
  return {
    txid: Math.random().toString(36).slice(2, 64),
    assetId,
    amount,
    blinded: true,
    sender,
    receiver,
    timestamp: Date.now(),
    status: 'pending',
  };
}

/** Format asset for display */
export function formatAssetAmount(amount: number, asset: LiquidAsset): string {
  const displayAmount = amount / Math.pow(10, asset.precision);
  return `${displayAmount.toFixed(asset.precision)} ${asset.ticker}`;
}

/** Mock Liquid assets for demo */
export const MOCK_LIQUID_ASSETS: LiquidAsset[] = [
  registerLiquidAsset('TAD', 'Tadbuy Token', 'tadbuy.io', 'USD', 1_000_000),
  registerLiquidAsset('ADV', 'Advertiser Coin', 'tadbuy.io', 'USD', 500_000),
];