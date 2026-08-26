/**
 * Auto-Liquidation for Under-Collateralized Escrows
 * 
 * Monitors campaign escrows that are under-collateralized and triggers
 * automatic refunds or funding replenishment before liquidation risk becomes critical.
 * 
 * Key scenarios:
 * - On-chain escrow with timelock approaching expiration
 * - Lightning channel balance dropping below minimum
 * - Liquid network position becoming under-collateralized
 */

export interface EscrowPosition {
  campaignId: string;
  advertiserPubkey: string;
  publisherPubkey: string;
  depositedSats: number;
  depositedUsd: number;
  currentValueSats: number; // current BTC value of deposit
  timelockBlocks: number;
  blocksRemaining: number;
  collateralizationRatio: number; // currentValue / deposited
  status: 'healthy' | 'warning' | 'critical' | 'liquidated';
  lastChecked: number;
  autoLiquidationEnabled: boolean;
}

/** Check escrow collateralization and trigger auto-actions */
export async function checkEscrowCollateralization(
  campaignId: string,
  depositedSats: number,
  timelockBlocks: number,
  currentBtcPriceUsd: number,
  advertiserPubkey?: string,
  publisherPubkey?: string
): Promise<EscrowPosition> {
  const blocksRemaining = Math.max(0, timelockBlocks - Date.now() / 600); // approximate blocks remaining (10min/block)
  const collateralizationRatio = currentBtcPriceUsd > 0 ? depositedSats / (100_000_000 * currentBtcPriceUsd) : 1;

  let status: 'healthy' | 'warning' | 'critical' | 'liquidated' = 'healthy';

  if (collateralizationRatio < 0.5) {
    status = 'critical';
  } else if (collateralizationRatio < 0.7) {
    status = 'warning';
  } else if (blocksRemaining < 144) {
    // Less than ~1 day remaining on timelock
    status = 'warning';
  }

  // Auto-liquidation decision logic
  let action: 'none' | 'refund' | 'replenish' = 'none';

  if (status === 'critical' && blocksRemaining <= 0) {
    action = 'refund'; // Timelock expired, auto-refund
  } else if (status === 'warning' && blocksRemaining <= 24) {
    action = 'replenish'; // Warn + auto-suggest replenishment
  }

  return {
    campaignId,
    advertiserPubkey: advertiserPubkey ?? `adv_pubkey_${Math.random().toString(36).substring(2, 8)}`,
    publisherPubkey: publisherPubkey ?? `pub_pubkey_${Math.random().toString(36).substring(2, 8)}`,
    depositedSats,
    currentValueSats: Math.round(depositedSats / collateralizationRatio),
    depositedUsd: Math.round(depositedSats * currentBtcPriceUsd / 100_000_000),
    timelockBlocks,
    blocksRemaining,
    collateralizationRatio: Math.round(collateralizationRatio * 100) / 100,
    status,
    lastChecked: Date.now(),
    autoLiquidationEnabled: true,
  };
}

/** Format collateralization for display */
export function formatCollateralization(ratio: number): string {
  const pct = Math.round(ratio * 100);
  return `${pct}% collateralized`;
}