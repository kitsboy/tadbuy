/**
 * NIP-72 Petname Integration — Human-readable .bitcoin names
 * 
 * Maps Nostr pubkeys to human-readable names following NIP-72.
 * Useful for branding campaigns with memorable identifiers.
 */

export interface Petname {
  petname: string; // e.g. "satoshi.gm.com"
  pubkey: string; // the pubkey this name resolves to
  registeredAt: number;
  expiresAt: number;
  verified: boolean;
  signature: string; // cryptographic proof of ownership
}

export interface PetnameRecord {
  record: Petname;
  ownerPubkey: string;
  displayName: string;
  about?: string;
  picture?: string;
  nip05?: string;
  relayHints: string[];
}

/** Resolve a petname to pubkey */
export function resolvePetname(petname: string): PetnameRecord | null {
  // In production, this would query DNS-over-HTTPS or NIP-05 server
  // For demo, return mock data
  return {
    record: {
      petname,
      pubkey: `npub1${Math.random().toString(36).slice(2, 58)}`,
      registeredAt: Date.now() - 86400000 * 30,
      expiresAt: Date.now() + 86400000 * 365,
      verified: true,
      signature: 'mock_sig_' + Math.random().toString(36).slice(2, 32),
    },
    ownerPubkey: `npub1${Math.random().toString(36).slice(2, 58)}`,
    displayName: petname.split('.')[0],
    about: `Campaign managed by ${petname}`,
    picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${petname}`,
    nip05: `${petname}@tadbuy.io`,
    relayHints: ['wss://relay.damus.io', 'wss://nos.lol'],
  };
}

/** Register a new petname */
export function registerPetname(
  petname: string,
  pubkey: string,
  relayHints: string[] = ['wss://relay.damus.io']
): PetnameRecord {
  return {
    record: {
      petname,
      pubkey,
      registeredAt: Date.now(),
      expiresAt: Date.now() + 86400000 * 365,
      verified: true,
      signature: 'mock_sig_' + Math.random().toString(36).slice(2, 32),
    },
    ownerPubkey: pubkey,
    displayName: petname.split('.')[0],
    relayHints,
  };
}

/** Format petname for display */
export function formatPetname(petname: string): string {
  return `@${petname}`;
}

/** Mock petnames for demo */
export const MOCK_PETNAMES: PetnameRecord[] = [
  resolvePetname('bitcoin.gm.com')!,
  resolvePetname('satoshi.gm.com')!,
  resolvePetname('lightning.gm.com')!,
];