export interface Campaign {
  id: string;
  name: string;
  budgetSats: number;
  status: 'draft' | 'live' | 'paused' | 'completed';
  createdAt: string;
  /** Firebase uid of owner — set server-side only */
  userId?: string;
  invoiceId?: string;
  updatedAt?: string;
  paymentConfirmedAt?: string;
  // Display/analytics fields
  dates?: string;
  platforms?: string[];
  /** Channels selected for the advertiser's delivery plan. */
  distributionChannels?: string[];
  /** NIP-07 publication receipt when the advertiser publishes to Nostr. */
  nostrPublication?: { eventId: string; relays: string[] };
  spendBtc?: number;
  spendUsd?: number;
  impressions?: number;
  clicks?: number;
  ctr?: number;
  cpc?: string;
  pacing?: number;
  payment?: string;
  // Creative fields
  headline?: string;
  description?: string;
  url?: string;
  targetUrl?: string;
  bgHue?: number;
  bgLightness?: number;
  textColor?: string;
  // Core 20-Point Phase Upgrades
  biddingStrategy?: 'maximize_clicks' | 'target_cpa' | 'manual';
  targetCpa?: number;
  keywords?: string[];
  frequencyCapPer24h?: number;
  s2sPostbackUrl?: string;
  retargetingEnabled?: boolean;
  // Financial & Security
  splitPayments?: { address: string; percentage: number }[];
  auditLogs?: { timestamp: string; action: string; userId: string }[];
}
export interface CampaignRepository {
  getAll(): Promise<Campaign[]>;
  getByUserId?(userId: string): Promise<Campaign[]>;
  getById(id: string): Promise<Campaign | null>;
  create(campaign: Omit<Campaign, 'id'>): Promise<Campaign>;
  update(id: string, campaign: Partial<Campaign>): Promise<void>;
  delete(id: string): Promise<void>;
}

export type VendorIdentityStatus = 'unverified' | 'pending' | 'verified' | 'failed';
export type VendorProfileStatus = 'draft' | 'published' | 'suspended';
export type VendorInventoryStatus = 'draft' | 'published' | 'paused';

export interface VendorProfileRecord {
  id: string;
  ownerId: string;
  displayName: string;
  npub: string;
  pubkeyHex?: string;
  nip05: string;
  nip05Status: VendorIdentityStatus;
  nip05CheckedAt?: string;
  nip05Evidence?: Record<string, unknown>;
  lightningAddress: string;
  audience: string;
  geography: string;
  channels: string[];
  status: VendorProfileStatus;
  createdAt: string;
  updatedAt: string;
}

export interface VendorInventoryRecord {
  id: string;
  ownerId: string;
  vendorProfileId: string;
  vendorDisplayName?: string;
  name: string;
  channel: string;
  format: string;
  placement: string;
  audience: string;
  geography: string[];
  minBidSats: number;
  currentBidSats: number;
  proofRequirements: string[];
  disclosureRequired: boolean;
  status: VendorInventoryStatus;
  createdAt: string;
  updatedAt: string;
}

export interface DurablePlacementRequestRecord {
  id: string;
  advertiserId: string;
  vendorId: string;
  inventoryId: string;
  slotName: string;
  publisher: string;
  channel: string;
  format: string;
  audience: string;
  budgetSats: number;
  advertiserLabel: string;
  message: string;
  disclosureRequired: boolean;
  proofRequirements: string[];
  status: 'offered' | 'accepted' | 'declined' | 'published' | 'proof_submitted' | 'verified';
  createdAt: string;
  acceptedAt?: string;
  publishedAt?: string;
  proof?: { url: string; screenshotRef: string; publishedAt: string; notes: string; disclosureConfirmed: boolean };
}
