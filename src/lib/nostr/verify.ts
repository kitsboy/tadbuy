import { schnorr } from '@noble/secp256k1';
import { sha256 } from '@noble/hashes/sha2.js';

export type NostrEventLike = {
  id?: string;
  pubkey: string;
  created_at: number;
  kind: number;
  tags: string[][];
  content: string;
  sig: string;
};

function hexToBytes(hex: string): Uint8Array {
  const h = hex.replace(/^0x/i, '').toLowerCase();
  if (h.length % 2 !== 0) throw new Error('Invalid hex');
  const out = new Uint8Array(h.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(h.slice(i * 2, i * 2 + 2), 16);
  return out;
}

/** NIP-01 event id = sha256 of serialized array (no id/sig fields). */
export function nostrEventId(event: Omit<NostrEventLike, 'id' | 'sig'>): string {
  const serialized = JSON.stringify([0, event.pubkey, event.created_at, event.kind, event.tags, event.content]);
  const bytes = new TextEncoder().encode(serialized);
  return Buffer.from(sha256(bytes)).toString('hex');
}

/** BIP-340 schnorr verify for Nostr events (x-only pubkey). */
export function verifyNostrEventSignature(event: NostrEventLike): boolean {
  try {
    const id = event.id && event.id.length === 64 ? event.id : nostrEventId(event);
    const pubkey = hexToBytes(event.pubkey);
    const sig = hexToBytes(event.sig);
    const hash = hexToBytes(id);
    if (pubkey.length !== 32 || sig.length !== 64 || hash.length !== 32) return false;
    return schnorr.verify(sig, hash, pubkey);
  } catch {
    return false;
  }
}