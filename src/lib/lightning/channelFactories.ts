/**
 * Channel Factories — Statechain-style multi-party channels
 * 
 * Implements Channel Factories (Burchert, Decker, Wattenhofer 2016) —
 * allows multiple parties to settle large numbers of off-chain updates
 * with a single on-chain transaction.
 */

export interface ChannelFactory {
  factoryId: string;
  participants: string[]; // pubkeys
  totalCapacitySats: number;
  nOfN: number; // required signatures
  statechainId?: string;
  status: 'open' | 'splitting' | 'closed' | 'rebalancing';
  createdAt: number;
  closesAt?: number;
}

export interface FactoryChannel {
  channelId: string;
  factoryId: string;
  partyA: string;
  partyB: string;
  balanceA: number;
  balanceB: number;
  capacity: number;
  stateChain: Array<{ stateNum: number; signatures: Record<string, string>; timestamp: number }>;
  status: 'active' | 'split' | 'closed';
}

export function createChannelFactory(
  participants: string[],
  totalCapacitySats: number
): ChannelFactory {
  return {
    factoryId: `cf_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    participants,
    totalCapacitySats,
    nOfN: participants.length,
    status: 'open',
    createdAt: Date.now(),
  };
}

export function splitFactory(
  factory: ChannelFactory,
  splits: Array<{ partyA: string; partyB: string; capacity: number }>
): FactoryChannel[] {
  return splits.map((s, i) => ({
    channelId: `ch_${factory.factoryId}_${i}`,
    factoryId: factory.factoryId,
    partyA: s.partyA,
    partyB: s.partyB,
    balanceA: Math.floor(s.capacity / 2),
    balanceB: Math.floor(s.capacity / 2),
    capacity: s.capacity,
    stateChain: [{ stateNum: 0, signatures: {}, timestamp: Date.now() }],
    status: 'active',
  }));
}

export function updateChannelState(
  channel: FactoryChannel,
  newState: { balanceA: number; balanceB: number; signature: string; signer: string }
): FactoryChannel {
  const stateChain = [
    ...channel.stateChain,
    {
      stateNum: channel.stateChain.length,
      signatures: { ...channel.stateChain.at(-1)?.signatures, [newState.signer]: newState.signature },
      timestamp: Date.now(),
    },
  ];

  return {
    ...channel,
    balanceA: newState.balanceA,
    balanceB: newState.balanceB,
    stateChain,
  };
}

export function closeFactory(
  factory: ChannelFactory,
  finalSettlements: Array<{ party: string; amountSats: number; txid: string }>
): ChannelFactory {
  return {
    ...factory,
    status: 'closed',
    closesAt: Date.now(),
  };
}

export function formatFactory(factory: ChannelFactory): string {
  return `Factory ${factory.factoryId}: ${factory.participants.length} parties, ` +
         `${factory.totalCapacitySats.toLocaleString()} sats, status: ${factory.status}`;
}