export interface Campaign {
  id: string;
  name: string;
  budgetSats: number;
  status: 'draft' | 'live' | 'paused' | 'completed';
  createdAt: string;
}

export interface CampaignRepository {
  getAll(): Promise<Campaign[]>;
  getById(id: string): Promise<Campaign | null>;
  create(campaign: Omit<Campaign, 'id'>): Promise<Campaign>;
  update(id: string, campaign: Partial<Campaign>): Promise<void>;
  delete(id: string): Promise<void>;
}
