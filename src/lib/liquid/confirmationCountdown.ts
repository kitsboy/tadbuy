/**
 * L-BTC Confirmation Countdown — Visual countdown to finality
 * 
 * Tracks Liquid Bitcoin confirmation progress for on-chain
 * transactions that move L-BTC between parties.
 */

export interface LbtcConfirmation {
  txid: string;
  confirmed: boolean;
  confirmationHeight: number;
  confirmations: number;
  expectedConfirmations: number;
  estimatedFinalityTime: number; // timestamp
  estimatedProgressPercentage: number;
}

/** Calculate confirmation progress for L-BTC transaction */
export function calculateLbtcConfirmation(
  txid: string,
  confirmations: number,
  expectedConfirmations: number = 6
): LbtcConfirmation {
  const confirmed = confirmations >= expectedConfirmations;
  const confirmationHeight = confirmed ? confirmations : Math.floor(Math.random() * 1000); // mock
  const estimatedFinalityTime = !confirmed
    ? Date.now() + (Math.random() * 1000 + 500) * 1000 // 500-1500 seconds
    : Date.now();
  
  const progressPercentage = Math.min((confirmations / expectedConfirmations) * 100, 100);
  
  return {
    txid,
    confirmed,
    confirmationHeight,
    confirmations,
    expectedConfirmations,
    estimatedFinalityTime,
    estimatedProgressPercentage: Math.round(progressPercentage * 10) / 10,
  };
}

/** Format confirmation countdown for UI */
export function formatConfirmationCountdown(confirmation: LbtcConfirmation): string {
  if (confirmation.confirmed) {
    return '✅ Confirmed';
  }
  const remaining = confirmation.expectedConfirmations - confirmation.confirmations;
  const minutes = Math.ceil(remaining * 10); // rough estimate
  return `⏳ ${remaining} conf remaining (~${minutes} min)`;
}

/** Mock L-BTC confirmations for dashboard */
export const MOCK_LBTC_CONFIRMATIONS: LbtcConfirmation[] = [
  {
    txid: 'a1b2c3d4...',
    confirmed: false,
    confirmationHeight: 0,
    confirmations: 2,
    expectedConfirmations: 6,
    estimatedFinalityTime: Date.now() + 500000,
    estimatedProgressPercentage: 33.3,
  },
];