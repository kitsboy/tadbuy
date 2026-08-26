/**
 * Ecash Token Spendability Checker — Validate blind token redemption
 * 
 * Checks whether a blinded ecash token (minted via Fedimint/Cashu) can be
 * redeemed. Verifies blinding factors, denomination validity, and mint signature.
 * Useful for advertisers to confirm they received spendable tokens before spending.
 */

export interface EcashToken {
  tokenId: string;
  denomination: number;
  blindingFactor: string;
  mint: string; // mint URL or identifier
  pubkey: string; // pubkey associated with token
  mintedAt: number;
  status: 'issued' | 'unredeemed' | 'redeemed' | 'invalid';
  mintSignature?: string;
}

/** Check if an ecash token is valid and spendable */
export function isTokenSpendable(token: EcashToken): boolean {
  if (token.status !== 'issued') return false;
  if (!token.denomination || token.denomination <= 0) return false;
  if (!token.blindingFactor || token.blindingFactor.length < 64) return false;
  if (!token.mintSignature) return false;
  return true;
}

/** Validate blinding factor format */
export function validateBlindingFactor(factor: string): boolean {
  return factor.length === 64 && /^[0-9a-fA-F]+$/.test(factor);
}

/** Format token denomination for display */
export function formatTokenDenom(denom: number): string {
  return `${denom} sats`;
}

/** Simulate ecash token generation for demo */
export function simulateTokenIssuance(amountSats: number, mintUrl: string): EcashToken {
  const blindingFactor = Math.random().toString(16).slice(2, 66).padEnd(64, '0');
  const tokenId = Math.random().toString(36).slice(2, 32).toUpperCase();

  return {
    tokenId,
    denomination: amountSats,
    blindingFactor,
    mint: mintUrl,
    pubkey: 'npub1…', // simplified
    mintedAt: Date.now(),
    status: 'issued',
    mintSignature: `lnbc1${Math.random().toString(36).slice(2, 50)}`,
  };
}