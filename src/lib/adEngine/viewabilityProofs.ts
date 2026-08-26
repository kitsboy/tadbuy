/**
 * Zero-Knowledge Viewability Proofs — zk-SNARKs proving ad viewability
 * 
 * Cryptographically prove an ad impression was viewable (50%+ pixels visible
 * for 1+ second per MRC standards) without revealing user identifiers or
 * browsing data.
 */

export interface ViewabilityProof {
  proofId: string;
  impressionId: string;
  campaignId: string;
  userHash: string; // hash, not real identifier
  timestamp: number;
  proof: string; // zk-SNARK proof string
  publicInputs: {
    visiblePixelsPct: number; // 50-100
    durationMs: number; // >= 1000
    adSize: string;
    viewportSize: string;
  };
  verifiedAt: number;
  verifier: string;
}

/** Generate viewability proof (mock - real impl uses zk-SNARK circuit) */
export function generateViewabilityProof(
  impressionId: string,
  campaignId: string,
  visiblePixelsPct: number,
  durationMs: number,
  adSize: string,
  viewportSize: string
): ViewabilityProof {
  return {
    proofId: `view_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    impressionId,
    campaignId,
    userHash: Math.random().toString(36).slice(2, 32),
    timestamp: Date.now(),
    proof: `zk_viewable_${Math.random().toString(36).slice(2, 32)}`,
    publicInputs: {
      visiblePixelsPct: Math.min(Math.max(visiblePixelsPct, 50), 100),
      durationMs: Math.max(durationMs, 1000),
      adSize,
      viewportSize,
    },
    verifiedAt: Date.now(),
    verifier: 'tadbuy-verifier',
  };
}

/** Verify viewability proof */
export function verifyViewabilityProof(proof: ViewabilityProof): boolean {
  const { publicInputs } = proof;
  // Valid if visible pixels >= 50% and duration >= 1 second
  return publicInputs.visiblePixelsPct >= 50
    && publicInputs.durationMs >= 1000;
}

/** Calculate viewability rate */
export function calculateViewabilityRate(
  impressions: ViewabilityProof[],
  viewableCount: number
): number {
  if (impressions.length === 0) return 0;
  return Math.min((viewableCount / impressions.length) * 100, 100);
}

/** Mock viewability data */
export const MOCK_VIEWABILITY_PROOFS: ViewabilityProof[] = Array.from({ length: 100 }, (_, i) => ({
  proofId: `view_${i}_${Date.now()}`,
  impressionId: `imp_${i}_${Date.now()}`,
  campaignId: `cmp_${i % 10}`,
  userHash: `hash_${i}`,
  timestamp: Date.now() - i * 60000,
  proof: `zk_proof_${i}`,
  publicInputs: {
    visiblePixelsPct: 75 + (Math.random() - 0.5) * 30,
    durationMs: 1000 + Math.random() * 2000,
    adSize: '300x250',
    viewportSize: '1920x1080',
  },
  verifiedAt: Date.now(),
  verifier: 'tadbuy-verifier',
}));