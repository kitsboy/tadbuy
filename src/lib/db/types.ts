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
  getById(id: string): Promise<Campaign | null>;
  create(campaign: Omit<Campaign, 'id'>): Promise<Campaign>;
  update(id: string, campaign: Partial<Campaign>): Promise<void>;
  delete(id: string): Promise<void>;
}
