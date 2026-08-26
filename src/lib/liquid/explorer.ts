/**
 * Liquid Network Mempool Explorer — Block explorer integration
 * 
 * Provides Liquid Network block, transaction, and asset explorers
 * via the Blockstream API. Used for displaying L-BTC, L-USDt, and
 * custom asset transaction details.
 */

const LIQUID_API = 'https://blockstream.info/liquid/api';

export interface LiquidBlock {
  id: string;
  height: number;
  version: number;
  timestamp: number;
  tx_count: number;
  size: number;
  weight: number;
  merkle_root: string;
  previousblockhash?: string;
  mediantime: number;
  nonce: number;
  bits: number;
  chainwork: string;
}

export interface LiquidTx {
  txid: string;
  version: number;
  locktime: number;
  vin: Array<{
    txid: string;
    vout: number;
    prevout: { scriptpubkey: string; scriptpubkey_asm: string; scriptpubkey_type: string; value: number; asset: string; assetblinder: string; amountblinder: string };
    scriptsig: string;
    scriptsig_asm: string;
    inner_redeemscript_asm?: string;
    inner_witnessscript_asm?: string;
    is_coinbase: boolean;
    sequence: number;
    witness?: string[];
  }>;
  vout: Array<{
    scriptpubkey: string;
    scriptpubkey_asm: string;
    scriptpubkey_type: string;
    value: number;
    asset: string;
    assetblinder: string;
    amountblinder: string;
  }>;
  size: number;
  weight: number;
  fee: number;
  status: {
    confirmed: boolean;
    block_height?: number;
    block_hash?: string;
    block_time?: number;
  };
}

export async function fetchLiquidBlock(heightOrHash: string | number): Promise<LiquidBlock | null> {
  try {
    const res = await fetch(`${LIQUID_API}/block/${heightOrHash}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchLiquidTx(txid: string): Promise<LiquidTx | null> {
  try {
    const res = await fetch(`${LIQUID_API}/tx/${txid}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchLiquidBlocksTip(): Promise<{ height: number; hash: string } | null> {
  try {
    const res = await fetch(`${LIQUID_API}/blocks/tip/height`);
    if (!res.ok) return null;
    const height = await res.text();
    const hashRes = await fetch(`${LIQUID_API}/blocks/tip/hash`);
    const hash = hashRes.ok ? await hashRes.text() : '';
    return { height: parseInt(height, 10), hash };
  } catch {
    return null;
  }
}

export function getLiquidExplorerUrl(txid: string, network: 'mainnet' | 'testnet' = 'mainnet'): string {
  const base = network === 'testnet' ? 'https://blockstream.info/liquidtestnet' : 'https://blockstream.info/liquid';
  return `${base}/tx/${txid}`;
}

export function formatLiquidAmount(asset: string, value: number): string {
  if (asset === 'L-BTC' || asset === '6f0282057ed51ce86027034be72918077926b4859a2072f52be56d78701510e4') {
    return `${(value / 100_000_000).toFixed(8)} L-BTC`;
  }
  if (asset === 'L-USDt') {
    return `$${(value / 100_000_000).toFixed(2)} L-USDt`;
  }
  return `${(value / 100_000_000).toFixed(8)} (asset: ${asset.slice(0, 8)}…)`;
}