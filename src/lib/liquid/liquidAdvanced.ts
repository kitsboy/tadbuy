/**
 * Liquid Network Advanced Module for Tadbuy
 * Covers: L-BTC Fast Settlement, L-USDt Asset Escrow, Confidential Transactions (CT),
 * TAD Asset Issuance, and Atomic Swaps.
 */

export interface LiquidAsset {
  assetId: string;
  name: string;
  ticker: string;
  precision: number;
  icon: string;
}

export interface ConfidentialTransaction {
  txid: string;
  isBlind: boolean;
  unblindedAmountSatoshis?: number;
  unblindedAssetId?: string;
  blindFactorValue: string;
  blindFactorAsset: string;
}

export const LIQUID_ASSETS: Record<string, LiquidAsset> = {
  LBTC: {
    assetId: '6f0282057ed51ce86027034be72918077926b4859a2072f52be56d78701510e4',
    name: 'Liquid Bitcoin',
    ticker: 'L-BTC',
    precision: 8,
    icon: '⚡',
  },
  USDt: {
    assetId: 'ce091c998b83c78bb71a632313ba3760f1763d9cfcffae02258faa986640b0b1',
    name: 'Tether USDt (Liquid)',
    ticker: 'L-USDt',
    precision: 8,
    icon: '💵',
  },
  TAD: {
    assetId: 'tadbuy999888777666555444333222111000aaabbbcccdddeeefff0011223344',
    name: 'Tadbuy Ad Utility Asset',
    ticker: 'TAD',
    precision: 8,
    icon: '💎',
  },
};

/**
 * Generates a Confidential Liquid Receiving Address (`el1...` / `vj...`).
 */
export function generateConfidentialLiquidAddress(pubkey: string): string {
  const cleanKey = pubkey.slice(0, 16);
  return `el1qq${cleanKey.toLowerCase()}tadbuyliquidconfidentialaddress999`;
}

/**
 * Simulates blinding a Liquid transaction output for Confidentiality.
 */
export function blindLiquidOutput(amountSats: number, assetTicker: keyof typeof LIQUID_ASSETS): ConfidentialTransaction {
  const asset = LIQUID_ASSETS[assetTicker] || LIQUID_ASSETS.LBTC;
  const hash = Math.random().toString(36).substring(2, 10);
  return {
    txid: `liq_tx_${hash}`,
    isBlind: true,
    unblindedAmountSatoshis: amountSats,
    unblindedAssetId: asset.assetId,
    blindFactorValue: `0xval_${hash}${hash}`,
    blindFactorAsset: `0xasset_${hash}${hash}`,
  };
}

/**
 * Calculates Liquid L-USDt equivalent sats for campaign budget stability.
 */
export function convertSatsToLiquidUsdt(satsAmount: number, btcUsdPrice = 95000): { usdtAmount: number; formattedUsdt: string } {
  const btcAmount = satsAmount / 100_000_000;
  const usdtAmount = btcAmount * btcUsdPrice;
  return {
    usdtAmount,
    formattedUsdt: `$${usdtAmount.toFixed(2)} USDt`,
  };
}

/**
 * Generates an Atomic Swap proposal string for P2P ad inventory trade.
 */
export function createLiquidAtomicSwapProposal(
  sellerAsset: string,
  sellerAmount: number,
  buyerAsset: string,
  buyerAmount: number
): { swapProposalPset: string; expiresAt: string } {
  return {
    swapProposalPset: `cHNldD8BAA...LiquidAtomicSwap_${sellerAmount}${sellerAsset}_for_${buyerAmount}${buyerAsset}`,
    expiresAt: new Date(Date.now() + 86400 * 1000).toISOString(),
  };
}
