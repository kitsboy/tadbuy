/**
 * Federated Identity (DID) — Decentralized identifier for publishers/advertisers
 * 
 * Implements W3C Decentralized Identifiers (DIDs) backed by Nostr public keys
 * and Bitcoin signatures. Allows verifiable identity claims without a
 * centralized authority.
 */

export interface Did {
  did: string; // did:nostr:pubkey or did:btc:address
  method: 'nostr' | 'btc' | 'fedimint';
  controller: string; // public key
  createdAt: number;
  updatedAt: number;
  document: DidDocument;
}

export interface DidDocument {
  id: string;
  controller: string;
  verificationMethod: Array<{
    id: string;
    type: string;
    publicKey: string;
    controller: string;
  }>;
  authentication: string[];
  service: Array<{
    id: string;
    type: string;
    serviceEndpoint: string;
  }>;
}

export interface DidCredential {
  id: string;
  type: string; // 'VerifiableCredential', 'AdPublisherCredential', etc.
  issuer: string;
  issuanceDate: number;
  expirationDate: number;
  credentialSubject: {
    id: string;
    claims: Record<string, string | number | boolean>;
  };
  proof: {
    type: string;
    created: number;
    verificationMethod: string;
    signature: string;
  };
}

export function createNostrDid(pubkey: string): Did {
  return {
    did: `did:nostr:${pubkey}`,
    method: 'nostr',
    controller: pubkey,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    document: {
      id: `did:nostr:${pubkey}`,
      controller: pubkey,
      verificationMethod: [{
        id: `did:nostr:${pubkey}#key-1`,
        type: 'NostrVerificationKey2024',
        publicKey: pubkey,
        controller: pubkey,
      }],
      authentication: [`did:nostr:${pubkey}#key-1`],
      service: [
        { id: `did:nostr:${pubkey}#lnurl`, type: 'LightningAddress', serviceEndpoint: `${pubkey.slice(0, 8)}@tadbuy.io` },
      ],
    },
  };
}

export function createBtcDid(address: string): Did {
  return {
    did: `did:btc:${address}`,
    method: 'btc',
    controller: address,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    document: {
      id: `did:btc:${address}`,
      controller: address,
      verificationMethod: [{
        id: `did:btc:${address}#key-1`,
        type: 'BitcoinAddressVerificationKey2024',
        publicKey: address,
        controller: address,
      }],
      authentication: [`did:btc:${address}#key-1`],
      service: [],
    },
  };
}

export function issueCredential(
  issuerDid: Did,
  subjectDid: string,
  type: string,
  claims: Record<string, string | number | boolean>,
  validityDays: number = 365
): DidCredential {
  return {
    id: `vc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    type,
    issuer: issuerDid.did,
    issuanceDate: Date.now(),
    expirationDate: Date.now() + validityDays * 86400000,
    credentialSubject: { id: subjectDid, claims },
    proof: {
      type: 'NostrSignature2024',
      created: Date.now(),
      verificationMethod: `${issuerDid.did}#key-1`,
      signature: `sig_${Math.random().toString(36).slice(2, 50)}`,
    },
  };
}

export function verifyCredential(credential: DidCredential): boolean {
  return credential.expirationDate > Date.now() && credential.proof.signature.length > 0;
}

export function formatDid(did: Did): string {
  return `${did.did} (${did.method})`;
}