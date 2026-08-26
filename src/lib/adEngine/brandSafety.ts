/**
 * Advertiser Brand Safety Scoring — AI-powered content analysis
 * 
 * Scales campaign-creative fit from 0-100 using text analysis and
 * keyword classification. Filters unsafe content before display.
 */

export interface BrandSafetyScore {
  score: number; // 0-100 (higher = safer)
  category: 'green' | 'yellow' | 'red';
  triggers: string[]; // what triggered flags
  recommendations: string[];
  lastChecked: number;
}

/** Categorize content safety level */
export function categorizeScore(score: number): BrandSafetyScore['category'] {
  if (score >= 80) return 'green';
  if (score >= 50) return 'yellow';
  return 'red';
}

/** Evaluate brand safety for campaign creative */
export function evaluateBrandSafety(
  creativeContent: string,
  advertiserCategory: string,
  brandGuidelines?: string[]
): BrandSafetyScore {
  const triggers: string[] = [];
  let baseScore = 100;

  // Simple keyword filtering (mock - real impl uses AI model)
  const sensitiveKeywords = [
    'casino', 'gambling', 'drugs', 'weed', 'cannabis',
    'nsfw', 'explicit', 'violence', 'hate', 'weapon',
  ];

  for (const kw of sensitiveKeywords) {
    if (creativeContent.toLowerCase().includes(kw)) {
      triggers.push(`${kw} keyword detected`);
      baseScore -= 25;
    }
  }

  // Category check
  if (advertiserCategory === 'family' && baseScore < 80) {
    triggers.push('Category mismatch: advertiser is family-friendly');
    baseScore -= 20;
  }

  const score = Math.max(0, baseScore);
  const category = categorizeScore(score);

  return {
    score,
    category,
    triggers,
    recommendations: [
      ...(triggers.includes('gambling') ? ['Exclude gambling content'] : []),
      ...(triggers.includes('nsfw') ? ['Add safe search filter'] : []),
    ].filter(Boolean),
    lastChecked: Date.now(),
  };
}

/** Mock brand safety evaluation */
export const MOCK_BRAND_SAFETY: BrandSafetyScore[] = [
  evaluateBrandSafety(
    'Introducing the Lightning Network to newcomers',
    'family'
  ),
  evaluateBrandSafety(
    'Win big at the casino tonight! 50% bonus!',
    'gambling'
  ),
];