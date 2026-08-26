/**
 * On-chain UTXO Tracker — Track Bitcoin wallet UTXOs
 * 
 * Fetches and tracks Unspent Transaction Outputs for a given address,
 * with label support for distinguishing between hot/cold storage and
 * budget vs. operational funds.
 */

export interface UtxoEntry {
  txid: string;
  vout: number;
  valueSats: number;
  status: {
    confirmed: boolean;
    block_height?: number;
    block_hash?: string;
    block_time?: number;
  };
  address: string;
  label?: string;
}

export interface UtxoSet {
  address: string;
  totalSats: number;
  confirmedSats: number;
  unconfirmedSats: number;
  utxos: UtxoEntry[];
  lastUpdated: number;
}

const MEMPOOL_API = 'https://mempool.space/api';

export async function fetchAddressUtxos(address: string): Promise<UtxoSet> {
  try {
    const res = await fetch(`${MEMPOOL_API}/address/${address}/utxo`);
    if (!res.ok) throw new Error(`mempool.space ${res.status}`);
    const raw = (await res.json()) as Array<{
      txid: string;
      vout: number;
      value: number;
      status: { confirmed: boolean; block_height?: number; block_hash?: string; block_time?: number };
    }>;

    const utxos: UtxoEntry[] = raw.map(u => ({
      txid: u.txid,
      vout: u.vout,
      valueSats: u.value,
      status: u.status,
      address,
    }));

    const confirmedSats = utxos.filter(u => u.status.confirmed).reduce((s, u) => s + u.valueSats, 0);
    const unconfirmedSats = utxos.filter(u => !u.status.confirmed).reduce((s, u) => s + u.valueSats, 0);

    return {
      address,
      totalSats: confirmedSats + unconfirmedSats,
      confirmedSats,
      unconfirmedSats,
      utxos,
      lastUpdated: Date.now(),
    };
  } catch (e) {
    console.error('fetchAddressUtxos failed', e);
    return { address, totalSats: 0, confirmedSats: 0, unconfirmedSats: 0, utxos: [], lastUpdated: Date.now() };
  }
}

export function suggestCoinSelection(
  utxos: UtxoEntry[],
  targetSats: number,
  feeRateSatsPerVb: number = 5
): UtxoEntry[] | null {
  // Simple largest-first coin selection
  const sorted = [...utxos].sort((a, b) => b.valueSats - a.valueSats);
  const selected: UtxoEntry[] = [];
  let total = 0;
  for (const u of sorted) {
    selected.push(u);
    total += u.valueSats;
    // ~150 vB per input, ~34 vB for output + 10 vB overhead
    const fee = feeRateSatsPerVb * (selected.length * 150 + 44);
    if (total >= targetSats + fee) return selected;
  }
  return null;
}

export function formatUtxos(utxos: UtxoEntry[]): string {
  return utxos
    .map(u => `${u.txid.slice(0, 8)}…:${u.vout} = ${u.valueSats.toLocaleString()} sats ${u.status.confirmed ? '✓' : '⏳'}`)
    .join('\n');
}