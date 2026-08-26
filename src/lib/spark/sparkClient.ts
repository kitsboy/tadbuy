/**
 * Spark — Spark L2 client (Bitcoin L3 with statechains)
 * 
 * Spark is a Bitcoin Layer 3 built on statechains — allows instant,
 * fee-less transfers of Bitcoin ownership with on-chain exit options.
 * Integrates Lightning for the swap-in/swap-out.
 */

export interface SparkNode {
  url: string;
  pubkey: string;
  status: 'online' | 'offline' | 'syncing';
  version: string;
  lastSeen: number;
}

export interface SparkTransfer {
  transferId: string;
  amountSats: number;
  senderPubkey: string;
  receiverPubkey: string;
  status: 'pending' | 'in_transfer' | 'completed' | 'failed' | 'cancelled';
  createdAt: number;
  completedAt?: number;
  txid?: string;
  signature?: string;
}

export interface SparkLeaf {
  leafId: string;
  amountSats: number;
  statechainId: string;
  ownerPubkey: string;
  signatureChain: string[];
  exitTxid?: string;
  status: 'active' | 'transferred' | 'exited';
}

export const SPARK_NETWORK = {
  mainnet: 'https://api.spark.xyz',
  testnet: 'https://testnet-api.spark.xyz',
};

export async function fetchSparkNodes(network: 'mainnet' | 'testnet' = 'mainnet'): Promise<SparkNode[]> {
  try {
    const res = await fetch(`${SPARK_NETWORK[network]}/nodes`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function createSparkTransfer(
  amountSats: number,
  senderPubkey: string,
  receiverPubkey: string,
  network: 'mainnet' | 'testnet' = 'mainnet'
): Promise<SparkTransfer> {
  const transferId = `spark_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  return {
    transferId,
    amountSats,
    senderPubkey,
    receiverPubkey,
    status: 'pending',
    createdAt: Date.now(),
  };
}

export function formatSparkTransfer(transfer: SparkTransfer): string {
  return `${transfer.transferId}: ${transfer.amountSats.toLocaleString()} sats (${transfer.status})`;
}