/**
 * Server-side Supabase repository using service_role key.
 * Drop-in replacement for firestoreAdmin.ts in server.ts (Node.js context).
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Campaign, CampaignRepository } from './types';

const TABLE = 'campaigns';

type CampaignRow = {
  id: string;
  name: string;
  budget_sats: number;
  status: string;
  user_id: string | null;
  invoice_id: string | null;
  created_at: string;
  updated_at: string | null;
  payment_confirmed_at: string | null;
  data: Record<string, unknown>;
};

let adminClient: SupabaseClient | null = null;

function getAdminDb(): SupabaseClient {
  if (adminClient) return adminClient;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
  }

  adminClient = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return adminClient;
}

function rowToCampaign(row: CampaignRow): Campaign {
  const extra = (row.data ?? {}) as Partial<Campaign>;
  return {
    ...extra,
    id: row.id,
    name: row.name,
    budgetSats: row.budget_sats,
    status: row.status as Campaign['status'],
    createdAt: row.created_at,
    ...(row.user_id ? { userId: row.user_id } : {}),
    ...(row.invoice_id ? { invoiceId: row.invoice_id } : {}),
    ...(row.updated_at ? { updatedAt: row.updated_at } : {}),
    ...(row.payment_confirmed_at ? { paymentConfirmedAt: row.payment_confirmed_at } : {}),
  } as Campaign;
}

function campaignToRow(campaign: Omit<Campaign, 'id'> | Partial<Campaign>): Omit<CampaignRow, 'id'> {
  const {
    name,
    budgetSats,
    status,
    createdAt,
    userId,
    invoiceId,
    updatedAt,
    paymentConfirmedAt,
    ...rest
  } = campaign as Campaign & {
    userId?: string;
    invoiceId?: string;
    updatedAt?: string;
    paymentConfirmedAt?: string;
  };

  return {
    name: name ?? '',
    budget_sats: budgetSats ?? 0,
    status: status ?? 'draft',
    user_id: userId ?? null,
    invoice_id: invoiceId ?? null,
    created_at: createdAt ?? new Date().toISOString(),
    updated_at: updatedAt ?? null,
    payment_confirmed_at: paymentConfirmedAt ?? null,
    data: rest,
  };
}

export class SupabaseCampaignRepository implements CampaignRepository {
  private get db() { return getAdminDb(); }

  async getAll(): Promise<Campaign[]> {
    try {
      const { data, error } = await this.db
        .from(TABLE)
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data as CampaignRow[]).map(rowToCampaign);
    } catch {
      return [];
    }
  }

  async getByUserId(userId: string): Promise<Campaign[]> {
    try {
      const { data, error } = await this.db
        .from(TABLE)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data as CampaignRow[]).map(rowToCampaign);
    } catch {
      return [];
    }
  }

  async getById(id: string): Promise<Campaign | null> {
    try {
      const { data, error } = await this.db
        .from(TABLE)
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      return data ? rowToCampaign(data as CampaignRow) : null;
    } catch {
      return null;
    }
  }

  async create(campaign: Omit<Campaign, 'id'>): Promise<Campaign> {
    const row = campaignToRow(campaign);
    const { data, error } = await this.db
      .from(TABLE)
      .insert(row)
      .select()
      .single();
    if (error) throw error;
    return rowToCampaign(data as CampaignRow);
  }

  async update(id: string, campaign: Partial<Campaign>): Promise<void> {
    const existing = await this.getById(id);
    if (!existing) throw new Error(`Campaign not found: ${id}`);

    const merged = { ...existing, ...campaign, updatedAt: new Date().toISOString() };
    const row = campaignToRow(merged);
    const { error } = await this.db
      .from(TABLE)
      .update(row)
      .eq('id', id);
    if (error) throw error;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.db.from(TABLE).delete().eq('id', id);
    if (error) throw error;
  }
}

export async function activateCampaignByInvoice(invoiceId: string): Promise<boolean> {
  const db = getAdminDb();
  const { data, error } = await db
    .from(TABLE)
    .select('id')
    .eq('invoice_id', invoiceId)
    .limit(1)
    .maybeSingle();
  if (error || !data) return false;

  const now = new Date().toISOString();
  const { error: updateError } = await db
    .from(TABLE)
    .update({
      status: 'live',
      updated_at: now,
      payment_confirmed_at: now,
    })
    .eq('id', data.id);
  return !updateError;
}

export async function createBid(bid: {
  slotId: string;
  slotName: string;
  bidSats: number;
  budgetSats?: number | null;
  userId?: string | null;
}): Promise<{ id: string }> {
  const db = getAdminDb();
  const { data, error } = await db
    .from('bids')
    .insert({
      slot_id: bid.slotId,
      slot_name: bid.slotName,
      bid_sats: bid.bidSats,
      budget_sats: bid.budgetSats ?? null,
      user_id: bid.userId ?? null,
      status: 'pending',
      created_at: new Date().toISOString(),
    })
    .select('id')
    .single();
  if (error) throw error;
  return { id: data.id };
}

export async function upsertPublisherSettings(settings: {
  userId: string;
  lightningAddress: string;
  bitcoinAddress?: string | null;
}): Promise<void> {
  const db = getAdminDb();
  const { error } = await db
    .from('publisher_settings')
    .upsert({
      user_id: settings.userId,
      lightning_address: settings.lightningAddress,
      bitcoin_address: settings.bitcoinAddress ?? null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });
  if (error) throw error;
}

export async function backupAllTables(): Promise<Record<string, unknown[]>> {
  const db = getAdminDb();
  const tables = ['campaigns', 'bids', 'publisher_settings', 'fedimint_sessions', 'settlements'] as const;
  const backup: Record<string, unknown[]> = {};

  for (const table of tables) {
    const { data, error } = await db.from(table).select('*');
    if (error) throw error;
    backup[table] = data ?? [];
  }

  return backup;
}

export { getAdminDb };