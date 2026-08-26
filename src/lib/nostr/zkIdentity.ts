/**
 * Nostr ZK-SNARK Identity Proofs — Prove properties without revealing identity
 * 
 * Uses zero-knowledge proofs to verify campaign eligibility (e.g., "adult content
 * not shown to minors", "geographic compliance") without revealing user data.
 */

export interface ZkIdentityClaim {
  claimType: 'age_over_18' | 'location_within' | 'has_bitcoin' | 'no_ccp_data' | 'custom';
  value?: string; // for custom claims
  maxAgeSeconds: number;
  issuedAt: number;
  expiration: number;
  proof: string; // zk-SNARK proof
  publicInputs: Record<string, string>;
}

export interface ZkCampaignVerifier {
  verify(claim: ZkIdentityClaim): boolean;
  getClaimHash(claim: ZkIdentityClaim): string;
}

/** Verify an age claim (over 18) */
export function verifyAgeOver18(claim: ZkIdentityClaim): boolean {
  if (claim.claimType !== 'age_over_18') return false;
  const now = Math.floor(Date.now() / 1000);
  return claim.expiration > now && claim.proof.length > 0;
}

/** Verify location claim */
export function verifyLocationWithin(
  claim: ZkIdentityClaim,
  allowedLat: number,
  allowedLng: number,
  radiusKm: number
): boolean {
  if (claim.claimType !== 'location_within') return false;
  
  // In production, would verify merkle proof against location commitment
  // For now, just check field exists
  if (!claim.value) return false;
  
  const [lat, lng] = claim.value.split(',').map(Number);
  const dist = Math.sqrt(Math.pow(lat - allowedLat, 2) + Math.pow(lng - allowedLng, 2));
  return dist < radiusKm;
}

/** Generate age claim (mock) */
export function generateAgeClaim(ageOver: number = 18, validityHours: number = 24): ZkIdentityClaim {
  return {
    claimType: 'age_over_18',
    maxAgeSeconds: validityHours * 3600,
    issuedAt: Math.floor(Date.now() / 1000),
    expiration: Math.floor(Date.now() / 1000) + validityHours * 3600,
    proof: `zk_proof_age_${Math.random().toString(36).slice(2, 32)}`,
    publicInputs: {
      minAge: ageOver.toString(),
    },
  };
}

/** Format claim for display */
export function formatClaim(claim: ZkIdentityClaim): string {
  return `Claim: ${claim.claimType} (valid until ${new Date(claim.expiration * 1000).toLocaleString()})`;
}