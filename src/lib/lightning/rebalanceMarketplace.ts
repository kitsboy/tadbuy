/**
 * Lightning Network Rebalancing Marketplace — Peer-to-peer liquidity exchange
 * 
 * Connect node operators who need outbound capacity with those who need inbound.
 * Supports submarine swaps, loop-outs, and direct channel rebalancing.
 */

export interface RebalanceOffer {
  offerId: string;
  initiator: {
    nodeId: string;
    alias: string;
    canReceive: number; // sats they can receive
    canSend: number; // sats they can send
  };
  target: {
    nodeId: string;
    alias: string;
    canReceive: number;
    canSend: number;
  };
  feeSats: number;
  status: 'open' | 'matched' | 'completed' | 'cancelled';
  createdAt: number;
  expiresAt: number;
}

/** Create a rebalance offer */
export function createRebalanceOffer(
  nodeId: string,
  alias: string,
  canReceive: number,
  canSend: number,
  feeSats: number = 100
): RebalanceOffer {
  return {
    offerId: `rebal_${Date.now()}`,
    initiator: { nodeId, alias, canReceive, canSend },
    target: { nodeId: '', alias: '', canReceive: 0, canSend: 0 },
    feeSats,
    status: 'open',
    createdAt: Date.now(),
    expiresAt: Date.now() + 3600000, // 1 hour
  };
}

/** Match two rebalance offers */
export function matchRebalanceOffers(
  offerA: RebalanceOffer,
  offerB: RebalanceOffer
): RebalanceOffer {
  return {
    ...offerA,
    target: offerB.initiator,
    status: 'matched',
  };
}

/** Mock marketplace offers */
export const MOCK_REBALANCE_OFFERS: RebalanceOffer[] = [
  createRebalanceOffer('npub1abc123...', 'Alby Hub', 5_000_000, 1_000_000, 50),
  createRebalanceOffer('npub1xyz789...', 'ACINQ Node', 2_000_000, 500_000, 30),
  createRebalanceOffer('npub1def456...', 'Bitrefill', 10_000_000, 2_500_000, 100),
];