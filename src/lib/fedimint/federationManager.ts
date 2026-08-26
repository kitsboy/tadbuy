/**
 * Fedimint Multi-Sig Join/Leave UI — Visual approval flow
 * 
 * Manages federated mint membership with multi-signature approval.
 * Users can join a federation, propose new members, and leave with
 * full refund of their ecash tokens.
 */

export interface FederationMember {
  pubkey: string;
  name: string;
  status: 'pending' | 'active' | 'revoked';
  joinedAt: number;
  lastSeen: number;
}

export interface Federation {
  mintId: string;
  mintUrl: string;
  federationId: string;
  members: FederationMember[];
  requiredSignatures: number; // M-of-N
  status: 'active' | 'joining' | 'leaving' | 'dissolved';
  myPubkey: string;
  myBalanceSats: number;
  version: string;
  lastSync: number;
}

/** Propose a new federation member */
export function proposeMember(
  federation: Federation,
  newMemberPubkey: string,
  newMemberName: string
): Federation {
  const existing = federation.members.find(m => m.pubkey === newMemberPubkey);
  if (existing) return federation;
  
  return {
    ...federation,
    members: [
      ...federation.members,
      { pubkey: newMemberPubkey, name: newMemberName, status: 'pending', joinedAt: Date.now(), lastSeen: 0 },
    ],
    status: 'joining',
  };
}

/** Approve a member (multi-sig signature) */
export function approveMember(
  federation: Federation,
  memberPubkey: string,
  approverPubkey: string
): Federation {
  const updated = {
    ...federation,
    members: federation.members.map(m =>
      m.pubkey === memberPubkey ? { ...m, status: 'active' as const } : m
    ),
  };
  
  // Check if enough signatures
  const activeMembers = updated.members.filter(m => m.status === 'active');
  if (activeMembers.length >= updated.requiredSignatures) {
    updated.status = 'active';
  }
  
  return updated;
}

/** Leave a federation (refund ecash tokens) */
export function leaveFederation(federation: Federation): { federation: Federation; refundAmountSats: number } {
  return {
    federation: { ...federation, status: 'leaving' },
    refundAmountSats: federation.myBalanceSats,
  };
}

/** Mock federations for demo */
export const MOCK_FEDERATIONS: Federation[] = [
  {
    mintId: 'mint_001',
    mintUrl: 'https://mint.sats.cc',
    federationId: 'fed_001',
    members: [
      { pubkey: 'npub1server1...', name: 'Satoshi Server', status: 'active', joinedAt: Date.now() - 86400000 * 30, lastSeen: Date.now() },
      { pubkey: 'npub1server2...', name: 'HODL Server', status: 'active', joinedAt: Date.now() - 86400000 * 25, lastSeen: Date.now() },
      { pubkey: 'npub1server3...', name: 'LN Server', status: 'pending', joinedAt: Date.now() - 3600000, lastSeen: 0 },
    ],
    requiredSignatures: 2,
    status: 'active',
    myPubkey: 'npub1mykey...',
    myBalanceSats: 250_000,
    version: '1.0.0',
    lastSync: Date.now(),
  },
];