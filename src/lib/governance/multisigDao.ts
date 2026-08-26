/**
 * Multisig DAO Voting for Grants — On-chain/Lightning-vote
 * 
 * Allows community governance of grants/funding via:
 * - Bitcoin on-chain multisig voting
 * - Lightning Network signed messages (NIP-98 style)
 * - Threshold signatures for execution
 */

export interface GrantProposal {
  id: string;
  title: string;
  description: string;
  amountSats: number;
  recipient: string;
  multisig: string; // P2SH/P2WSH address
  requiredSignatures: number;
  signers: string[]; // pubkeys
  votes: { pubkey: string; vote: 'yes' | 'no'; timestamp: number; signature: string }[];
  status: 'pending' | 'voting' | 'approved' | 'rejected' | 'executed';
  createdAt: number;
  votingEndsAt: number;
}

/** Create a grant proposal */
export function createGrantProposal(
  title: string,
  description: string,
  amountSats: number,
  recipient: string,
  multisig: string,
  signers: string[],
  requiredSignatures: number
): GrantProposal {
  return {
    id: `grant_${Date.now()}`,
    title,
    description,
    amountSats,
    recipient,
    multisig,
    requiredSignatures,
    signers,
    votes: [],
    status: 'pending',
    createdAt: Date.now(),
    votingEndsAt: Date.now() + 7 * 86400_000, // 7 days
  };
}

/** Cast a vote on a proposal */
export function castVote(
  proposal: GrantProposal,
  voterPubkey: string,
  vote: 'yes' | 'no',
  signature: string
): GrantProposal {
  const existing = proposal.votes.find(v => v.pubkey === voterPubkey);
  if (existing) return proposal; // already voted
  
  const updated = {
    ...proposal,
    votes: [...proposal.votes, { pubkey: voterPubkey, vote, timestamp: Date.now(), signature }],
  };
  
  const yesVotes = updated.votes.filter(v => v.vote === 'yes').length;
  const noVotes = updated.votes.filter(v => v.vote === 'no').length;
  const totalVoters = updated.votes.length;
  
  if (yesVotes >= updated.requiredSignatures) {
    updated.status = 'approved';
  } else if (totalVoters >= updated.signers.length && yesVotes < updated.requiredSignatures) {
    updated.status = 'rejected';
  } else {
    updated.status = 'voting';
  }
  
  return updated;
}

/** Execute an approved proposal (on-chain or Lightning) */
export function executeProposal(proposal: GrantProposal): { success: boolean; txid?: string } {
  if (proposal.status !== 'approved') {
    return { success: false };
  }
  // In production, construct and broadcast PSBT from multisig
  return { success: true, txid: `tx_${Date.now()}` };
}

/** Mock grant proposals */
export const MOCK_GRANTS: GrantProposal[] = [
  createGrantProposal(
    'Lightning Education Fund',
    'Fund free Lightning workshops in emerging markets',
    1_000_000,
    'npub1educationfund...',
    '3MultisigAddress...',
    ['npub1signer1...', 'npub1signer2...', 'npub1signer3...'],
    2
  ),
];