/**
 * Nostr services for campaign distribution and Bitcoin-native identity.
 * Private keys stay inside the user's NIP-07 browser signer.
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

export interface NostrSignedEvent {
  id: string;
  pubkey: string;
  created_at: number;
  kind: number;
  tags: string[][];
  content: string;
  sig: string;
}

export interface NostrPublishResult {
  event: NostrSignedEvent;
  relays: string[];
}

export const DEFAULT_RELAYS = [
  'wss://relay.damus.io',
  'wss://nos.lol',
  'wss://relay.snort.social',
];

/** Create a backend payment intent for a NIP-57 campaign zap. */
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

export function getNostrExtension(): { getPublicKey: () => Promise<string>; signEvent: (event: object) => Promise<NostrSignedEvent> } | null {
  if (typeof window === 'undefined') return null;
  const ext = (window as unknown as {
    nostr?: { getPublicKey: () => Promise<string>; signEvent: (event: object) => Promise<NostrSignedEvent> };
  }).nostr;
  return ext ?? null;
}

function publishToRelay(relayUrl: string, event: NostrSignedEvent): Promise<boolean> {
  return new Promise(resolve => {
    let settled = false;
    let socket: WebSocket;
    const finish = (ok: boolean) => {
      if (settled) return;
      settled = true;
      try { socket.close(); } catch { /* already closed */ }
      resolve(ok);
    };

    try {
      socket = new WebSocket(relayUrl);
      const timeout = window.setTimeout(() => finish(false), 8_000);
      socket.addEventListener('open', () => {
        socket.send(JSON.stringify(['EVENT', event]));
      });
      socket.addEventListener('message', message => {
        try {
          const [type, , accepted] = JSON.parse(String(message.data)) as [string, string, boolean];
          if (type === 'OK') {
            window.clearTimeout(timeout);
            finish(accepted === true);
          }
        } catch {
          // Ignore non-standard relay frames until timeout.
        }
      });
      socket.addEventListener('error', () => {
        window.clearTimeout(timeout);
        finish(false);
      });
      socket.addEventListener('close', () => {
        window.clearTimeout(timeout);
        finish(false);
      });
    } catch {
      finish(false);
    }
  });
}

/**
 * Sign a sponsored campaign note with NIP-07 and publish it to the default
 * relays. The extension owns the private key; Tadbuy only sees the signed event.
 */
export async function publishCampaignNote(input: {
  campaignName: string;
  headline: string;
  description: string;
  url: string;
  relays?: string[];
}): Promise<NostrPublishResult> {
  const extension = getNostrExtension();
  if (!extension) {
    throw new Error('Install or unlock a NIP-07 Nostr browser extension to publish.');
  }

  const pubkey = await extension.getPublicKey();
  const content = [
    '[Sponsored]',
    input.headline.trim(),
    input.description.trim(),
    input.url.trim(),
    `Campaign: ${input.campaignName.trim()}`,
    '#ad #bitcoin #nostr',
  ].filter(Boolean).join('\n\n');
  const unsigned = {
    kind: 1,
    created_at: Math.floor(Date.now() / 1000),
    tags: [['t', 'sponsored'], ['t', 'bitcoin'], ['r', input.url.trim()]],
    content,
  };
  const event = await extension.signEvent(unsigned);
  if (!event.id || !event.sig || !event.pubkey) {
    throw new Error('The Nostr signer returned an incomplete event.');
  }

  const relayResults = await Promise.all(
    (input.relays ?? DEFAULT_RELAYS).map(async relay => ({ relay, accepted: await publishToRelay(relay, event) }))
  );
  const accepted = relayResults.filter(result => result.accepted).map(result => result.relay);
  if (accepted.length === 0) throw new Error('No configured Nostr relay acknowledged the signed note.');
  return { event, relays: accepted };
}
