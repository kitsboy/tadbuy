export interface Campaign {
  id: string;
  name: string;
  budgetSats: number;
  status: 'draft' | 'live' | 'paused' | 'completed';
  createdAt: string;
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
}

export interface CampaignRepository {
  getAll(): Promise<Campaign[]>;
  getById(id: string): Promise<Campaign | null>;
  create(campaign: Omit<Campaign, 'id'>): Promise<Campaign>;
  update(id: string, campaign: Partial<Campaign>): Promise<void>;
  delete(id: string): Promise<void>;
}
