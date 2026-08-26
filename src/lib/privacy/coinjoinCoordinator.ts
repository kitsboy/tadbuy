/**
 * CoinJoin Coordinator Interface — Whirlpool/JoinMarket style CoinJoin
 * 
 * Provides a unified interface for CoinJoin coordinators (Whirlpool,
 * JoinMarket, etc.) allowing publishers to mix earnings for privacy
 * before withdrawal.
 */

export interface CoinJoinPool {
  poolId: string;
  denomination: number; // standard denomination (e.g., 0.001 BTC = 100_000 sats)
  coordinator: string; // coordinator pubkey or identifier
  participants: number;
  minParticipants: number;
  maxParticipants: number;
  feePercent: number; // 0-1
  status: 'open' | 'registering' | 'mixing' | 'complete' | 'failed';
  registeredAt: number;
  mixStartedAt?: number;
  completedAt?: number;
}

export interface CoinJoinParticipant {
  participantId: string;
  pubkey: string;
  registeredAt: number;
  inputsCount: number;
  outputsCount: number;
  status: 'registered' | 'mixing' | 'completed' | 'failed';
  txid?: string;
}

export const COINJOIN_COORDINATORS = {
  whirlpool: { url: 'https://whirlpool.gandlaf.com', minDenom: 1000, fee: 0.05 },
  joinmarket: { url: 'https://joinmarket.io', minDenom: 100, fee: 0.02 },
  zerojoin: { url: 'https://0x0swap.com', minDenom: 50000, fee: 0 },
} as const;

export function registerCoinJoinParticipant(
  pool: CoinJoinPool,
  pubkey: string,
  inputsCount: number = 1,
  outputsCount: number = 1
): CoinJoinParticipant {
  return {
    participantId: `cjp_${pool.poolId}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    pubkey,
    registeredAt: Date.now(),
    inputsCount,
    outputsCount,
    status: 'registered',
  };
}

export function selectCoinJoinPool(
  amountSats: number,
  preferredCoordinator: keyof typeof COINJOIN_COORDINATORS = 'whirlpool'
): CoinJoinPool {
  const coord = COINJOIN_COORDINATORS[preferredCoordinator];
  // Round up to the next standard denomination
  const denom = Math.ceil(amountSats / coord.minDenom) * coord.minDenom;
  return {
    poolId: `cj_${Date.now()}`,
    denomination: denom,
    coordinator: preferredCoordinator,
    participants: 1,
    minParticipants: 5,
    maxParticipants: 20,
    feePercent: coord.fee,
    status: 'open',
    registeredAt: Date.now(),
  };
}

export function formatCoinJoinPool(pool: CoinJoinPool): string {
  return `${pool.coordinator} pool ${pool.poolId}: ${pool.denomination.toLocaleString()} sats denom, ` +
         `${pool.participants}/${pool.minParticipants} participants, ${(pool.feePercent * 100).toFixed(2)}% fee`;
}