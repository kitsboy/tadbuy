/**
 * Nostr payment & auth services (NIP-57 Zaps, NIP-98 HTTP Auth, NIP-46 remote signer).
 */

export interface ZapRequest {
  pubkey: string;
  amount: number;
  comment?: string;
  relays?: string[];
}

export interface Nip98AuthHeader {
  authorization: string;
  pubkey: string;
}

const DEFAULT_RELAYS = [
  'wss://relay.damus.io',
  'wss://nos.lol',
  'wss://relay.snort.social',
];

export async function createZapEndpoint(amountSats: number, campaignId: string): Promise<{
  lnurl: string;
  pubkey: string;
  relays: string[];
}> {
  const res = await fetch('/api/nostr/zap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amountSats, campaignId, relays: DEFAULT_RELAYS }),
  });
  if (!res.ok) throw new Error('Failed to create Zap endpoint');
  return res.json();
}

export async function verifyNip98Auth(event: string): Promise<boolean> {
  const res = await fetch('/api/nostr/nip98/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event }),
  });
  return res.ok;
}

export async function requestNip46Sign(pubkey: string, payload: string): Promise<string | null> {
  const res = await fetch('/api/nostr/nip46/sign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pubkey, payload }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.signature ?? null;
}

export function getNostrExtension(): { getPublicKey: () => Promise<string>; signEvent: (e: object) => Promise<object> } | null {
  const ext = (window as unknown as { nostr?: { getPublicKey: () => Promise<string>; signEvent: (e: object) => Promise<object> } }).nostr;
  return ext ?? null;
}