/**
 * Nostr Content Warning System — Flag sensitive ad content before display
 * 
 * Uses NIP-36 (Content Warnings) and AI classification to flag
 * sensitive or potentially harmful content before showing ads.
 */

export interface ContentWarning {
  warningId: string;
  eventId: string;
  contentHash: string;
  severity: 'safe' | 'caution' | 'sensitive' | 'unsafe';
  categories: string[]; // e.g., ['nsfw', 'violence', 'politics', 'scam']
  confidence: number; // 0-1
  flaggedAt: number;
  resolved: boolean;
  reviewer?: string;
}

/** Classify ad content using keyword-based AI (mock) */
export function classifyAdContent(
  content: string,
  campaignCategory: string
): ContentWarning {
  const sensitiveKeywords = [
    'casino', 'gambling', 'bet', 'nsfw', 'nude', 'explicit',
    'violence', 'weapon', 'drugs', 'pharma', 'scam', 'phishing',
    'politics', 'election', 'conspiracy', 'hate', 'racist',
  ];

  const foundCategories = sensitiveKeywords.filter(kw =>
    content.toLowerCase().includes(kw)
  );

  let severity: ContentWarning['severity'] = 'safe';
  let confidence = 0.95;

  if (foundCategories.length > 0) {
    if (foundCategories.some(c => ['nsfw', 'nude', 'explicit'].includes(c))) {
      severity = 'unsafe';
      confidence = 0.99;
    } else if (foundCategories.some(c => ['casino', 'gambling', 'bet'].includes(c))) {
      severity = 'sensitive';
      confidence = 0.9;
    } else {
      severity = 'caution';
      confidence = 0.8;
    }
  }

  return {
    warningId: `warn_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    eventId: '',
    contentHash: Buffer.from(content).toString('base64').slice(0, 32),
    severity,
    categories: foundCategories,
    confidence: Math.round(confidence * 100),
    flaggedAt: Date.now(),
    resolved: false,
  };
}

/** User-level content filtering settings */
export interface UserContentSettings {
  maxSeverity: ContentWarning['severity'];
  blockedCategories: string[];
  allowListedCreators: string[];
  createdAt: number;
}

/** Check if content should be shown based on user settings */
export function shouldShowContent(
  warning: ContentWarning,
  settings: UserContentSettings
): boolean {
  if (settings.blockedCategories.some(cat => warning.categories.includes(cat))) {
    return false;
  }
  if (['safe', 'caution', 'sensitive', 'unsafe'].indexOf(warning.severity) >
      ['safe', 'caution', 'sensitive', 'unsafe'].indexOf(settings.maxSeverity)) {
    return false;
  }
  return true;
}

/** Mock NIP-36 warning */
export const MOCK_CONTENT_WARNINGS: ContentWarning[] = [
  classifyAdContent('Introducing the Lightning Network to newcomers', 'technology'),
  classifyAdContent('Win big at the casino tonight!', 'gambling'),
];