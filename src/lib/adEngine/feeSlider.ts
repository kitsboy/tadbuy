/**
 * Dynamic Fee Slider per Campaign — Users set max sats/vB
 * 
 * Enables campaigns to set custom on-chain fee rates for optimal
 * mempool placement while respecting budget constraints.
 */

export interface FeeSliderConfig {
  campaignId: string;
  maxFeeSatsPerVb: number; // User's maximum fee setting
  recommendedFeeSatsPerVb: number; // Current network recommended fee
  urgencyLevel: 'low' | 'medium' | 'high' | 'urgent';
  warningText: string;
  estimatedConfirmationTimeBlocks: number;
}

/** Calculate optimal fee based on slider setting */
export function calculateOptimalFee(
  maxFee: number,
  recommended: number,
  urgency: FeeSliderConfig['urgencyLevel']
): number {
  if (urgency === 'urgent') return maxFee;
  if (urgency === 'high') return Math.min(maxFee, recommended * 1.2);
  if (urgency === 'medium') return Math.min(maxFee, recommended * 1.1);
  return Math.min(maxFee, recommended);
}

/** Validate fee slider range */
export function validateFeeSlider(maxFee: number): { valid: boolean; warning?: string } {
  if (maxFee < 1) return { valid: false, warning: 'Fee must be at least 1 sat/vB' };
  if (maxFee > 1000) return { valid: false, warning: 'Fee exceeds recommended maximum (1000 sat/vB)' };
  return { valid: true };
}

/** Get urgency level based on mempool size */
export function getUrgencyLevel(blocksToConfirm: number): FeeSliderConfig['urgencyLevel'] {
  if (blocksToConfirm <= 1) return 'urgent';
  if (blocksToConfirm <= 3) return 'high';
  if (blocksToConfirm <= 6) return 'medium';
  return 'low';
}

/** Estimate confirmation time based on fee rate */
export function estimateConfirmationTime(feeRate: number, mempoolSize: number): number {
  const blocksPerHour = 6;
  const blocksNeeded = Math.ceil(mempoolSize / (feeRate * 4)); // estimate
  return Math.ceil(blocksNeeded / blocksPerHour);
}