import { generateZkImpressionProof, applyDifferentialPrivacyNoise } from '@/lib/privacy/zkProofEngine';

/**
 * Ad Auction Engine for Tadbuy
 * 
 * Implements real-time eCPM calculation, Vickrey auction mechanics,
 * anti-fraud scoring, and frequency cap enforcement for the ad marketplace.
 */

export interface Bid {
  advertiserId: string;
  campaignId: string;
  bidAmount: number; // in satoshis
  bidType: 'CPM' | 'CPC' | 'PPQ' | 'CPA';
  targeting: TargetingOptions;
  frequencyCap: FrequencyCap;
  antiFraudScore: number; // 0-100, higher is better
  timestamp: number;
}

export interface TargetingOptions {
  geoTarget?: string[]; // Country codes
  deviceTarget?: ('mobile' | 'desktop' | 'tablet')[];
  timeTarget?: { startHour: number; endHour: number };
  keywordTarget?: string[];
  excludedKeywords?: string[];
  audienceSegments?: string[];
  minViewability?: number; // percentage
  maxFrequencyPerUser?: number;
}

export interface FrequencyCap {
  impressionsPerHour?: number;
  impressionsPerDay?: number;
  impressionsPerWeek?: number;
  uniqueUsersPerDay?: number;
}

export interface AuctionResult {
  winner: Bid | null;
  winningPrice: number; // Actual price paid (Vickrey)
  ecpm: number; // Effective CPM
  secondPrice: number; // Second highest bid
  allBids: Bid[];
  fraudScores: Record<string, number>;
  frequencyViolations: Record<string, boolean>;
  timestamp: number;
}

export interface AdSlot {
  slotId: string;
  publisherId: string;
  domain: string;
  viewabilityScore: number; // 0-100
  floorPrice: number; // Minimum bid in satoshis
  allowedAdTypes: ('CPM' | 'CPC' | 'PPQ' | 'CPA')[];
  targetingOverrides?: TargetingOptions;
}

/**
 * Calculates effective CPM (eCPM) for different bid types
 */
export function calculateEcpm(bid: Bid, estimatedCtr: number = 0.02, estimatedCvr: number = 0.05): number {
  switch (bid.bidType) {
    case 'CPM':
      // CPM is already cost per mille
      return bid.bidAmount;
    
    case 'CPC':
      // eCPM = CPC * estimated CTR * 1000
      return bid.bidAmount * estimatedCtr * 1000;
    
    case 'CPA':
      // eCPM = CPA * estimated CVR * estimated CTR * 1000
      return bid.bidAmount * estimatedCvr * estimatedCtr * 1000;
    
    case 'PPQ':
      // For PPQ, we need to estimate queries per mille
      // Assuming 50 queries per 1000 impressions as baseline
      const estimatedQueriesPerMille = 50;
      return bid.bidAmount * estimatedQueriesPerMille;
    
    default:
      return 0;
  }
}

/**
 * Applies frequency capping to a bid for a specific user
 */
export function applyFrequencyCap(
  bid: Bid,
  userId: string,
  impressionHistory: Record<string, number[]> // userId => [timestamps]
): boolean {
  const userHistory = impressionHistory[userId] || [];
  const now = Date.now();
  
  // Check hourly cap
  if (bid.frequencyCap.impressionsPerHour !== undefined) {
    const hourAgo = now - (60 * 60 * 1000);
    const recentImpressions = userHistory.filter(ts => ts > hourAgo).length;
    if (recentImpressions >= bid.frequencyCap.impressionsPerHour) {
      return false;
    }
  }
  
  // Check daily cap
  if (bid.frequencyCap.impressionsPerDay !== undefined) {
    const dayAgo = now - (24 * 60 * 60 * 1000);
    const dailyImpressions = userHistory.filter(ts => ts > dayAgo).length;
    if (dailyImpressions >= bid.frequencyCap.impressionsPerDay) {
      return false;
    }
  }
  
  // Check weekly cap
  if (bid.frequencyCap.impressionsPerWeek !== undefined) {
    const weekAgo = now - (7 * 24 * 60 * 60 * 1000);
    const weeklyImpressions = userHistory.filter(ts => ts > weekAgo).length;
    if (weeklyImpressions >= bid.frequencyCap.impressionsPerWeek) {
      return false;
    }
  }
  
  return true;
}

/**
 * Calculates anti-fraud score for a bid based on various signals
 */
export function calculateAntiFraudScore(
  bid: Bid,
  publisherReputation: number = 80, // 0-100
  historicalPerformance: Record<string, number> = {} // advertiserId => score
): number {
  let score = 100; // Start with perfect score
  
  // Publisher reputation factor (0-30 points)
  score -= (100 - publisherReputation) * 0.3;
  
  // Historical performance factor (0-25 points)
  const advertiserScore = historicalPerformance[bid.advertiserId] || 50;
  score -= (100 - advertiserScore) * 0.25;
  
  // Bid amount sanity check (0-20 points)
  // Extremely low or high bids are suspicious
  const bidAmount = bid.bidAmount;
  if (bidAmount < 1) {
    score -= 20; // Below minimum bid
  } else if (bidAmount > 10000) { // Above 10,000 sats per impression/query
    score -= 15; // Suspiciously high
  }
  
  // Targeting specificity (0-15 points)
  // Very broad targeting might indicate low quality
  const targeting = bid.targeting;
  let specificityScore = 15;
  if (!targeting.geoTarget || targeting.geoTarget.length === 0) {
    specificityScore -= 5;
  }
  if (!targeting.keywordTarget || targeting.keywordTarget.length === 0) {
    specificityScore -= 5;
  }
  if (!targeting.deviceTarget || targeting.deviceTarget.length === 0) {
    specificityScore -= 5;
  }
  score -= (15 - specificityScore);
  
  // Time-based patterns (0-10 points)
  // Ads running at unusual hours might be suspicious
  const now = new Date();
  const hour = now.getUTCHours();
  if (targeting.timeTarget) {
    const { startHour, endHour } = targeting.timeTarget;
    if (hour < startHour || hour >= endHour) {
      score -= 10; // Outside targeting window
    }
  } else {
    // No time targeting - check if it's unusual hours (2-5 AM UTC)
    if (hour >= 2 && hour <= 5) {
      score -= 5;
    }
  }
  
  // Ensure score stays in bounds
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Runs a Vickrey auction (second-price auction) for ad slots
 */
export function runVickreyAuction(
  bids: Bid[],
  slot: AdSlot,
  userId: string,
  impressionHistory: Record<string, number[]> = {}
): AuctionResult {
  if (bids.length === 0) {
    return {
      winner: null,
      winningPrice: 0,
      ecpm: 0,
      secondPrice: 0,
      allBids: [],
      fraudScores: {},
      frequencyViolations: {},
      timestamp: Date.now(),
    };
  }
  
  // Filter bids by slot compatibility and targeting
  const validBids = bids.filter(bid => {
    // Check if ad type is allowed for this slot
    if (!slot.allowedAdTypes.includes(bid.bidType)) {
      return false;
    }
    
    // Check floor price
    const ecpm = calculateEcpm(bid);
    if (ecpm < slot.floorPrice) {
      return false;
    }
    
    // Check basic targeting compatibility (simplified)
    // In reality, this would be more sophisticated
    return true;
  });
  
  if (validBids.length === 0) {
    return {
      winner: null,
      winningPrice: 0,
      ecpm: 0,
      secondPrice: 0,
      allBids: bids,
      fraudScores: {},
      frequencyViolations: {},
      timestamp: Date.now(),
    };
  }
  
  // Calculate fraud scores for all bids
  const fraudScores: Record<string, number> = {};
  validBids.forEach(bid => {
    fraudScores[bid.advertiserId + '_' + bid.campaignId] = 
      calculateAntiFraudScore(bid);
  });
  
  // Apply frequency capping and track violations
  const frequencyViolations: Record<string, boolean> = {};
  const frequencyValidBids = validBids.filter(bid => {
    const key = bid.advertiserId + '_' + bid.campaignId;
    const isValid = applyFrequencyCap(bid, userId, impressionHistory);
    frequencyViolations[key] = !isValid;
    return isValid;
  });
  
  if (frequencyValidBids.length === 0) {
    // All bids violated frequency caps - return highest bid but mark as invalid
    const sortedByEcpm = [...validBids].sort((a, b) => 
      calculateEcpm(b) - calculateEcpm(a)
    );
    const highestBid = sortedByEcpm[0];
    
    return {
      winner: highestBid,
      winningPrice: 0, // Won't actually win due to frequency cap
      ecpm: calculateEcpm(highestBid),
      secondPrice: 0,
      allBids: bids,
      fraudScores,
      frequencyViolations,
      timestamp: Date.now(),
    };
  }
  
  // Calculate eCPM for all valid bids
  const bidsWithEcpm = frequencyValidBids.map(bid => ({
    bid,
    ecpm: calculateEcpm(bid),
    fraudScore: fraudScores[bid.advertiserId + '_' + bid.campaignId] || 50
  }));
  
  // Sort by eCPM (descending) then by fraud score (descending) for tie-breaking
  const sortedBids = [...bidsWithEcpm].sort((a, b) => {
    if (a.ecpm !== b.ecpm) {
      return b.ecpm - a.ecpm; // Higher eCPM first
    }
    return b.fraudScore - a.fraudScore; // Higher fraud score first
  });
  
  // Determine winner and second price (Vickrey auction)
  const winnerBid = sortedBids[0];
  let secondPriceEcpm = 0;
  
  if (sortedBids.length > 1) {
    secondPriceEcpm = sortedBids[1].ecpm;
  } else {
    // Only one bid - second price is the floor price or half the bid
    secondPriceEcpm = Math.max(slot.floorPrice, winnerBid.ecpm / 2);
  }
  
  // Apply discount for fraud risk (higher fraud score = discount)
  const fraudDiscount = 1 - (winnerBid.fraudScore / 100) * 0.2; // Max 20% discount
  const winningPriceEcpm = winnerBid.ecpm * fraudDiscount;
  
  // Ensure winning price is at least second price (Vickrey principle)
  const finalWinningPrice = Math.max(winningPriceEcpm, secondPriceEcpm);
  
  return {
    winner: winnerBid.bid,
    winningPrice: finalWinningPrice,
    ecpm: winnerBid.ecpm,
    secondPrice: secondPriceEcpm,
    allBids: bids,
    fraudScores,
    frequencyViolations,
    timestamp: Date.now(),
  };
}

/**
 * Generates a real-time auction simulation for dashboard display
 */
export function simulateAuction(
  slot: AdSlot,
  bidCount: number = 5
): AuctionResult {
  const bidTypes: ('CPM' | 'CPC' | 'PPQ' | 'CPA')[] = ['CPM', 'CPC', 'PPQ', 'CPA'];
  
  const bids: Bid[] = [];
  for (let i = 0; i < bidCount; i++) {
    const bidType = bidTypes[Math.floor(Math.random() * bidTypes.length)];
    let bidAmount: number;
    
    switch (bidType) {
      case 'CPM':
        bidAmount = Math.floor(Math.random() * 500) + 50; // 50-550 sats
        break;
      case 'CPC':
        bidAmount = Math.floor(Math.random() * 50) + 5; // 5-55 sats per click
        break;
      case 'CPA':
        bidAmount = Math.floor(Math.random() * 500) + 50; // 50-550 sats per action
        break;
      case 'PPQ':
        bidAmount = Math.floor(Math.random() * 10) + 1; // 1-10 sats per query
        break;
    }
    
    bids.push({
      advertiserId: `adv_${Math.random().toString(36).substring(2, 8)}`,
      campaignId: `cmp_${Math.random().toString(36).substring(2, 8)}`,
      bidAmount,
      bidType,
targeting: {
          geoTarget: ['US', 'CA', 'GB', 'DE', 'FR'].slice(0, Math.floor(Math.random() * 5) + 1) as string[],
          deviceTarget: ['mobile', 'desktop', 'tablet'].filter(() => Math.random() > 0.5) as ('mobile' | 'desktop' | 'tablet')[],
          keywordTarget: ['bitcoin', 'lightning', 'ads', 'crypto', 'blockchain']
            .filter(() => Math.random() > 0.7),
          timeTarget: Math.random() > 0.5 
            ? { startHour: Math.floor(Math.random() * 24), endHour: Math.floor(Math.random() * 24) } 
            : undefined,
        },
      frequencyCap: {
        impressionsPerHour: Math.floor(Math.random() * 100) + 10,
        impressionsPerDay: Math.floor(Math.random() * 1000) + 100,
      },
      antiFraudScore: Math.floor(Math.random() * 30) + 70, // 70-100 range
      timestamp: Date.now() - Math.floor(Math.random() * 30000), // Last 30 seconds
    });
  }
  
  return runVickreyAuction(bids, slot, 'user_123');
}