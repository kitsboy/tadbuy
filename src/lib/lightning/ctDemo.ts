/**
 * Liquid Confidential Transfer (CT) Demo — Show amount privacy
 * 
 * Demonstrates Liquid's Confidential Transactions feature, which hides
 * both the asset type and the amount in on-chain transactions.
 * The sender's blinding factors are revealed to sender/receiver, but
 * the Liquid network only sees cryptographic commitments.
 */

export interface ConfidentialTx {
  txid: string;
  blindedAmount: string; // commitment, not actual amount
  blindedAsset: string;
  rangeProof: string;
  actualAmount: number; // only visible to sender/receiver
  actualAsset: string;
  fee: number;
  timestamp: number;
  pegInFromBitcoin: boolean;
}

/** Create a confidential Liquid transaction */
export function createConfidentialTx(
  amountSats: number,
  asset: string,
  feeSats: number = 100
): ConfidentialTx {
  // Simulate blinding factors (in real use, secp256k1 + secp256k1 generator for Pedersen commitments)
  const blindingFactor = Math.random().toString(16).slice(2, 66).padEnd(64, '0');
  const assetBlindingFactor = Math.random().toString(16).slice(2, 66).padEnd(64, '0');
  
  // Pedersen commitment: C = amount*G + blinding*H
  const commitment = `${blindingFactor.slice(0, 8)}...${blindingFactor.slice(-8)}`;
  const assetCommitment = `${assetBlindingFactor.slice(0, 8)}...${assetBlindingFactor.slice(-8)}`;
  
  // Range proof (Bulletproof) ensures amount is in valid range
  const rangeProof = `bp_${Math.random().toString(36).slice(2, 30)}_${amountSats}`;
  
  return {
    txid: Math.random().toString(36).slice(2, 64),
    blindedAmount: commitment,
    blindedAsset: assetCommitment,
    rangeProof,
    actualAmount: amountSats,
    actualAsset: asset,
    fee: feeSats,
    timestamp: Date.now(),
    pegInFromBitcoin: asset === 'L-BTC',
  };
}

/** Verify a confidential transaction (only sender/receiver can see actual amount) */
export function revealConfidentialAmount(
  tx: ConfidentialTx,
  blindingFactor: string
): { amount: number; valid: boolean } {
  return { amount: tx.actualAmount, valid: true };
}

/** Format confidential transaction for display */
export function formatConfidentialTx(tx: ConfidentialTx, isInsider: boolean = false): string {
  if (isInsider) {
    return `CT: ${tx.actualAmount} ${tx.actualAsset} (fee: ${tx.fee}) | txid: ${tx.txid.slice(0, 8)}...`;
  }
  return `CT: ${tx.blindedAmount} ${tx.blindedAsset} (amount hidden) | range proof: ${tx.rangeProof.slice(0, 20)}...`;
}

/** Demo confidential transactions */
export const MOCK_CONFIDENTIAL_TXS: ConfidentialTx[] = [
  createConfidentialTx(50_000, 'L-BTC'),
  createConfidentialTx(1_000_000, 'L-USDt'),
  createConfidentialTx(10_000, 'TAD'),
];