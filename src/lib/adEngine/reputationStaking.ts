/**
 * Advertiser Reputation Staking — Lock funds to boost ad priority
 * 
 * Advertisers stake sats to increase their campaign's priority in
 * the auction system. Higher stake = higher placement. Unbonding
 * period prevents sybil attacks.
 */

export interface StakedBalance {
  advertiserPubkey: string;
  campaignId: string;
  stakedSats: number;
  unlockedSats: number;
  totalRewardsSats: number;
  status: 'staked' | 'unstaking' | 'unstaked';
  createdAt: number;
  lastRewardAt: number;
  unlockAt?: number; // timestamp when fully unlocked
  priorityBoost: number; // multiplier 1.0 - 5.0
}

export interface StakeTransaction {
  txid: string;
  advertiserPubkey: string;
  campaignId: string;
  amountSats: number;
  type: 'stake' | 'unstake' | 'claim_reward';
  status: 'pending' | 'confirmed';
  timestamp: number;
  blockHeight: number;
}

/** Stake sats for campaign priority */
export function stakeForCampaign(
  advertiserPubkey: string,
  campaignId: string,
  amountSats: number
): StakedBalance {
  const priorityBoost = calculatePriorityBoost(amountSats);
  
  return {
    advertiserPubkey,
    campaignId,
    stakedSats: amountSats,
    unlockedSats: amountSats,
    totalRewardsSats: 0,
    status: 'staked',
    createdAt: Date.now(),
    lastRewardAt: Date.now(),
    priorityBoost,
  };
}

/** Calculate priority boost based on staked amount */
export function calculatePriorityBoost(stakedSats: number): number {
  // Logarithmic boost: 1M sats = 2x, 10M = 3x, 100M = 4x, 1B = 5x
  const logStake = Math.log10(Math.max(1, stakedSats / 1_000_000));
  return Math.min(1 + logStake, 5.0);
}

/** Unstake (with cooldown period) */
export function unstake(
  balance: StakedBalance,
  amountSats?: number
): StakedBalance {
  const unstakeAmount = amountSats || balance.unlockedSats;
  
  return {
    ...balance,
    unlockedSats: Math.max(0, balance.unlockedSats - unstakeAmount),
    status: 'unstaking',
    unlockAt: Date.now() + 7 * 86400000, // 7-day cooldown
  };
}

/** Calculate staking rewards */
export function calculateStakingRewards(staked: StakedBalance, apy: number = 0.12): number {
  const daysStaked = (Date.now() - staked.createdAt) / 86400000;
  const dailyReward = staked.stakedSats * apy / 365;
  return Math.floor(dailyReward * daysStaked);
}

/** Mock staked balances */
export const MOCK_STAKED_BALANCES: StakedBalance[] = [
  stakeForCampaign('npub1adv1...', 'cmp_001', 10_000_000),
  stakeForCampaign('npub1adv2...', 'cmp_002', 1_000_000),
];