/**
 * Ad Creative DAO Voting — Community votes on approved ad creatives via ecash
 * 
 * Federation members vote on which ad creatives are approved for display
 * using ecash tokens. Higher staked votes have more weight.
 */

export interface CreativeProposal {
  proposalId: string;
  campaignId: string;
  creativeUrl: string;
  creativeName: string;
  description: string;
  proposedBy: string;
  proposedAt: number;
  votes: Array<{ voterPubkey: string; vote: 'yes' | 'no'; stakedWeight: number; timestamp: number }>;
  totalYesWeight: number;
  totalNoWeight: number;
  thresholdWeight: number;
  status: 'pending' | 'open' | 'approved' | 'rejected' | 'expired';
  votingEndsAt: number;
}

export interface CreativeVotingStats {
  totalProposals: number;
  approved: number;
  rejected: number;
  pending: number;
  avgVotingTurnout: number;
}

/** Create a creative proposal */
export function createCreativeProposal(
  campaignId: string,
  creativeUrl: string,
  creativeName: string,
  description: string,
  proposedBy: string,
  thresholdWeight: number = 1000
): CreativeProposal {
  return {
    proposalId: `prop_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    campaignId,
    creativeUrl,
    creativeName,
    description,
    proposedBy,
    proposedAt: Date.now(),
    votes: [],
    totalYesWeight: 0,
    totalNoWeight: 0,
    thresholdWeight,
    status: 'open',
    votingEndsAt: Date.now() + 7 * 86400000,
  };
}

/** Cast a vote */
export function castCreativeVote(
  proposal: CreativeProposal,
  voterPubkey: string,
  vote: 'yes' | 'no',
  stakedWeight: number
): CreativeProposal {
  const existing = proposal.votes.find(v => v.voterPubkey === voterPubkey);
  if (existing) return proposal;
  
  const newVotes = [...proposal.votes, { voterPubkey, vote, stakedWeight, timestamp: Date.now() }];
  const yesWeight = newVotes.filter(v => v.vote === 'yes').reduce((s, v) => s + v.stakedWeight, 0);
  const noWeight = newVotes.filter(v => v.vote === 'no').reduce((s, v) => s + v.stakedWeight, 0);
  
  let status = proposal.status;
  if (yesWeight >= proposal.thresholdWeight) status = 'approved';
  else if (Date.now() > proposal.votingEndsAt && yesWeight < proposal.thresholdWeight) status = 'rejected';
  
  return {
    ...proposal,
    votes: newVotes,
    totalYesWeight: yesWeight,
    totalNoWeight: noWeight,
    status,
  };
}

/** Mock creative proposals */
export const MOCK_CREATIVE_PROPOSALS: CreativeProposal[] = [
  createCreativeProposal('cmp_001', 'https://nostr.build/i/creative1.jpg', 'Bitcoin Wallet Ad', 'Lightning-focused creative', 'npub1creator1...'),
  createCreativeProposal('cmp_002', 'https://nostr.build/i/creative2.jpg', 'LN Promo', 'Network fee promo creative', 'npub1creator2...'),
];