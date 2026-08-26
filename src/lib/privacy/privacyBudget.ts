/**
 * Privacy Budget Explorer — Visualize privacy spend vs. protection gained
 * 
 * Tracks how much "privacy budget" a user has spent on Bitcoin privacy
 * techniques (CoinJoin, Lightning, ecash, etc.) and shows what level
 * of protection they currently have.
 */

export interface PrivacyBudgetEntry {
  entryId: string;
  userId: string;
  technique: 'coinjoin' | 'lightning' | 'silent-payments' | 'ecash' | 'tor' | 'fedimint';
  costSats: number;
  privacyGainScore: number; // 0-100
  timestamp: number;
  expiresAt?: number;
}

export interface PrivacyBudget {
  userId: string;
  totalSpentSats: number;
  currentPrivacyScore: number; // 0-100
  recommendedActions: PrivacyBudgetEntry[];
  lastUpdated: number;
  history: PrivacyBudgetEntry[];
}

/** Add privacy budget entry */
export function addPrivacyBudgetEntry(
  userId: string,
  technique: PrivacyBudgetEntry['technique'],
  costSats: number,
  privacyGainScore: number
): PrivacyBudgetEntry {
  return {
    entryId: `pb_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    userId,
    technique,
    costSats,
    privacyGainScore,
    timestamp: Date.now(),
  };
}

/** Calculate total privacy score */
export function calculatePrivacyScore(history: PrivacyBudgetEntry[]): number {
  if (history.length === 0) return 0;
  
  // Use the most recent (max 10) privacy gains
  const recent = history
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 10);
  
  // Weighted average
  const totalWeight = recent.reduce((s, e) => s + e.privacyGainScore, 0);
  return Math.min(Math.round(totalWeight / recent.length), 100);
}

/** Get recommended privacy actions */
export function getRecommendedActions(
  currentScore: number,
  userId: string
): PrivacyBudgetEntry[] {
  const recommendations: { technique: PrivacyBudgetEntry['technique']; costSats: number; gain: number }[] = [];
  
  if (currentScore < 30) {
    recommendations.push({ technique: 'lightning', costSats: 200, gain: 25 });
    recommendations.push({ technique: 'ecash', costSats: 100, gain: 20 });
  } else if (currentScore < 60) {
    recommendations.push({ technique: 'coinjoin', costSats: 1000, gain: 35 });
    recommendations.push({ technique: 'silent-payments', costSats: 0, gain: 30 });
  } else {
    recommendations.push({ technique: 'fedimint', costSats: 500, gain: 25 });
    recommendations.push({ technique: 'tor', costSats: 0, gain: 20 });
  }
  
  return recommendations.map(r => 
    addPrivacyBudgetEntry(userId, r.technique, r.costSats, r.gain)
  );
}

/** Format privacy budget for display */
export function formatPrivacyBudget(budget: PrivacyBudget): string {
  return `Privacy Score: ${budget.currentPrivacyScore}/100 | Spent: ${budget.totalSpentSats.toLocaleString()} sats | ` +
         `Last updated: ${new Date(budget.lastUpdated).toLocaleString()}`;
}