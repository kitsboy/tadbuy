/**
 * Nostr Badge System — Verified publisher/advertiser badges
 * 
 * NIP-58 badge system for verifying publishers and advertisers.
 * Badges are stored as Nostr events (kind 30009) and can be displayed
 * next to profiles for credibility.
 */

export interface NostrBadge {
  badgeId: string;
  awardEventId: string;
  definitionEventId: string;
  badgeName: string;
  badgeDescription: string;
  badgeImage: string;
  awarderPubkey: string;
  recipientPubkey: string;
  awardedAt: number;
  expiresAt: number;
  scope: 'advertiser' | 'publisher' | 'both';
  category: 'verified' | 'reputation' | 'achievement' | 'sponsored';
}

export interface BadgeDefinition {
  badgeName: string;
  description: string;
  image: string;
  minStakeSats: number;
  minReputationScore: number;
}

/** Award a badge */
export function awardBadge(
  badgeDef: BadgeDefinition,
  awarderPubkey: string,
  recipientPubkey: string,
  validityDays: number = 365
): NostrBadge {
  return {
    badgeId: `badge_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    awardEventId: `award_${Date.now()}`,
    definitionEventId: `def_${Date.now()}`,
    badgeName: badgeDef.badgeName,
    badgeDescription: badgeDef.description,
    badgeImage: badgeDef.image,
    awarderPubkey,
    recipientPubkey,
    awardedAt: Date.now(),
    expiresAt: Date.now() + validityDays * 86400000,
    scope: 'both',
    category: 'verified',
  };
}

/** Check if recipient qualifies for badge */
export function qualifiesForBadge(
  badgeDef: BadgeDefinition,
  recipientStakeSats: number,
  recipientReputationScore: number
): boolean {
  return recipientStakeSats >= badgeDef.minStakeSats && 
         recipientReputationScore >= badgeDef.minReputationScore;
}

/** Mock badge definitions */
export const MOCK_BADGE_DEFS: BadgeDefinition[] = [
  {
    badgeName: 'Verified Publisher',
    description: 'Confirmed by platform as a legitimate publisher',
    image: 'https://tadbuy.io/badges/verified.png',
    minStakeSats: 100_000,
    minReputationScore: 80,
  },
  {
    badgeName: 'Bitcoin Champion',
    description: 'Awarded for promoting Bitcoin and Lightning adoption',
    image: 'https://tadbuy.io/badges/champion.png',
    minStakeSats: 1_000_000,
    minReputationScore: 90,
  },
];