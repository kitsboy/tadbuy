/**
 * Fedimint Ecash Dividends — Distribute campaign profits as ecash tokens
 * 
 * Federation members can distribute campaign revenue as ecash tokens
 * to token holders. This creates yield-bearing assets without requiring
 * smart contracts.
 */

export interface EcashDividend {
  dividendId: string;
  federationId: string;
  assetId: string;
  totalAmountSats: number;
  totalHolders: number;
  perHolderSats: number;
  distributionTxid: string;
  status: 'pending' | 'confirmed' | 'failed';
  scheduledAt: number;
  executedAt?: number;
  blockHeight: number;
}

export interface DividendEligibility {
  holderPubkey: string;
  assetId: string;
  balanceSats: number;
  eligibleSats: number;
  estimatedPayoutSats: number;
  claimed: boolean;
}

/** Create a dividend distribution */
export function createEcashDividend(
  federationId: string,
  assetId: string,
  totalAmountSats: number,
  totalHolders: number
): EcashDividend {
  return {
    dividendId: `div_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    federationId,
    assetId,
    totalAmountSats,
    totalHolders,
    perHolderSats: Math.floor(totalAmountSats / totalHolders),
    distributionTxid: `dist_${Math.random().toString(36).slice(2, 16)}`,
    status: 'pending',
    scheduledAt: Date.now(),
    blockHeight: 850000,
  };
}

/** Calculate eligibility for a holder */
export function calculateDividendEligibility(
  holderPubkey: string,
  assetId: string,
  balanceSats: number,
  totalAssetSupplySats: number,
  dividendAmountSats: number
): DividendEligibility {
  const proportion = balanceSats / totalAssetSupplySats;
  const estimatedPayoutSats = Math.floor(dividendAmountSats * proportion);
  
  return {
    holderPubkey,
    assetId,
    balanceSats,
    eligibleSats: balanceSats,
    estimatedPayoutSats,
    claimed: false,
  };
}

/** Claim a dividend */
export function claimDividend(
  eligibility: DividendEligibility
): { success: boolean; ecashToken: string } {
  return {
    success: true,
    ecashToken: `FM1${Math.random().toString(36).slice(2, 40)}_${eligibility.estimatedPayoutSats}`,
  };
}

/** Mock dividend distribution */
export const MOCK_DIVIDEND: EcashDividend = createEcashDividend(
  'fed_001',
  'tad_asset',
  1_000_000, // 1M sats to distribute
  500 // 500 holders
);