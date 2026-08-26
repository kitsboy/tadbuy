/**
 * Fedimint Lightning Gateway — Seamless L-BTC <-> ecash swaps
 * 
 * Federated mint bridges between Lightning Network and Fedimint ecash tokens.
 * Users can deposit Lightning → mint ecash tokens, and redeem ecash → withdraw Lightning.
 */

export interface MintDeposit {
  id: string;
  amountSats: number;
  mintUrl: string;
  mintedAt: number;
  redeemed: boolean;
  redeemedAt?: number;
  lightningTxid?: string;
}

export interface RedeemRequest {
  tokenId: string;
  amountSats: number;
  destinationPubkey: string;
  lightningAddress: string;
  requestCreatedAt: number;
  settlementTimeout: number;
}

export interface FedimintBridgeStats {
  totalDepositedSats: number;
  totalRedeemedSats: number;
  activeDeposits: number;
  avgConversionRate: number;
}

/** Deposit Lightning into mint */
export function depositLightningToMint(
  amountSats: number,
  mintUrl: string,
  userPubkey: string
): MintDeposit {
  return {
    id: `dep_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    amountSats,
    mintUrl,
    mintedAt: Date.now(),
    redeemed: false,
  };
}

/** Redeem mint ecash to Lightning */
export function redeemMintToLightning(
  tokenId: string,
  amountSats: number,
  destinationPubkey: string,
  lightningAddress: string
): RedeemRequest {
  return {
    tokenId,
    amountSats,
    destinationPubkey,
    lightningAddress,
    requestCreatedAt: Date.now(),
    settlementTimeout: 3600000, // 1 hour
  };
}

/** Calculate conversion rate between L-BTC and ecash */
export function calculateConversionRate(
  depositedSats: number,
  redeemedSats: number
): number {
  if (depositedSats === 0) return 1.0;
  return redeemedSats / depositedSats;
}

/** Mock bridge stats */
export const MOCK_BRIDGE_STATS: FedimintBridgeStats = {
  totalDepositedSats: 12_500_000,
  totalRedeemedSats: 9_800_000,
  activeDeposits: 12,
  avgConversionRate: 0.98,
};