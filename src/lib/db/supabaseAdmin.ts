/**
 * Server-side Supabase repository using service_role key.
 * Drop-in replacement for firestoreAdmin.ts in server.ts (Node.js context).
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Campaign, CampaignRepository, DurablePlacementRequestRecord, VendorInventoryRecord, VendorProfileRecord } from './types';

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


function rowToVendorProfile(row: Record<string, unknown>): VendorProfileRecord {
  return {
    id: String(row.id),
    ownerId: String(row.owner_id),
    displayName: String(row.display_name ?? ''),
    npub: String(row.npub ?? ''),
    ...(row.pubkey_hex ? { pubkeyHex: String(row.pubkey_hex) } : {}),
    nip05: String(row.nip05 ?? ''),
    nip05Status: String(row.nip05_status ?? 'unverified') as VendorProfileRecord['nip05Status'],
    ...(row.nip05_checked_at ? { nip05CheckedAt: String(row.nip05_checked_at) } : {}),
    nip05Evidence: (row.nip05_evidence ?? {}) as Record<string, unknown>,
    lightningAddress: String(row.lightning_address ?? ''),
    audience: String(row.audience ?? ''),
    geography: String(row.geography ?? ''),
    channels: Array.isArray(row.channels) ? row.channels.map(String) : [],
    status: String(row.status ?? 'draft') as VendorProfileRecord['status'],
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

function rowToVendorInventory(row: Record<string, unknown>): VendorInventoryRecord {
  return {
    id: String(row.id),
    ownerId: String(row.owner_id),
    vendorProfileId: String(row.vendor_profile_id),
    ...(row.vendor_profiles && typeof row.vendor_profiles === 'object' && 'display_name' in (row.vendor_profiles as Record<string, unknown>) ? { vendorDisplayName: String((row.vendor_profiles as Record<string, unknown>).display_name) } : {}),
    name: String(row.name ?? ''),
    channel: String(row.channel ?? ''),
    format: String(row.format ?? ''),
    placement: String(row.placement ?? ''),
    audience: String(row.audience ?? ''),
    geography: Array.isArray(row.geography) ? row.geography.map(String) : [],
    minBidSats: Number(row.min_bid_sats ?? 0),
    currentBidSats: Number(row.current_bid_sats ?? 0),
    proofRequirements: Array.isArray(row.proof_requirements) ? row.proof_requirements.map(String) : [],
    disclosureRequired: row.disclosure_required !== false,
    status: String(row.status ?? 'draft') as VendorInventoryRecord['status'],
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

function rowToPlacementRequest(row: Record<string, unknown>): DurablePlacementRequestRecord {
  return {
    id: String(row.id),
    advertiserId: String(row.advertiser_id),
    vendorId: String(row.vendor_id),
    inventoryId: String(row.inventory_id),
    slotName: String(row.slot_name ?? ''),
    publisher: String(row.publisher ?? ''),
    channel: String(row.channel ?? ''),
    format: String(row.format ?? ''),
    audience: String(row.audience ?? ''),
    budgetSats: Number(row.budget_sats ?? 0),
    advertiserLabel: String(row.advertiser_label ?? ''),
    message: String(row.message ?? ''),
    disclosureRequired: row.disclosure_required !== false,
    proofRequirements: Array.isArray(row.proof_requirements) ? row.proof_requirements.map(String) : [],
    status: String(row.status ?? 'offered') as DurablePlacementRequestRecord['status'],
    createdAt: String(row.created_at),
    ...(row.accepted_at ? { acceptedAt: String(row.accepted_at) } : {}),
    ...(row.published_at ? { publishedAt: String(row.published_at) } : {}),
    ...(row.proof ? { proof: {
      ...(row.proof as Record<string, unknown>),
      disclosureConfirmed: (row.proof as Record<string, unknown>).disclosureConfirmed === true,
    } as DurablePlacementRequestRecord['proof'] } : {}),
  };
}

export async function upsertVendorProfile(profile: {
  ownerId: string;
  displayName: string;
  npub: string;
  nip05: string;
  lightningAddress: string;
  audience: string;
  geography: string;
  channels: string[];
  status?: VendorProfileRecord['status'];
}): Promise<VendorProfileRecord> {
  const { data, error } = await getAdminDb().from('vendor_profiles').upsert({
    owner_id: profile.ownerId,
    display_name: profile.displayName,
    npub: profile.npub,
    nip05: profile.nip05,
    lightning_address: profile.lightningAddress,
    audience: profile.audience,
    geography: profile.geography,
    channels: profile.channels,
    status: profile.status ?? 'draft',
    updated_at: new Date().toISOString(),
  }, { onConflict: 'owner_id' }).select().single();
  if (error) throw error;
  return rowToVendorProfile(data as Record<string, unknown>);
}

export async function recordNip05Verification(input: {
  ownerId: string;
  nip05: string;
  pubkeyHex: string;
  status: VendorProfileRecord['nip05Status'];
  evidence: Record<string, unknown>;
}): Promise<VendorProfileRecord> {
  const { data, error } = await getAdminDb().from('vendor_profiles').update({
    nip05: input.nip05,
    pubkey_hex: input.pubkeyHex,
    nip05_status: input.status,
    nip05_checked_at: new Date().toISOString(),
    nip05_evidence: input.evidence,
    updated_at: new Date().toISOString(),
  }).eq('owner_id', input.ownerId).select().single();
  if (error) throw error;
  return rowToVendorProfile(data as Record<string, unknown>);
}

export async function setVendorProfileStatus(ownerId: string, status: VendorProfileRecord['status']): Promise<VendorProfileRecord> {
  const { data, error } = await getAdminDb().from('vendor_profiles').update({ status, updated_at: new Date().toISOString() }).eq('owner_id', ownerId).select().single();
  if (error) throw error;
  return rowToVendorProfile(data as Record<string, unknown>);
}
export async function getVendorProfile(ownerId: string): Promise<VendorProfileRecord | null> {
  const { data, error } = await getAdminDb().from('vendor_profiles').select('*').eq('owner_id', ownerId).maybeSingle();
  if (error) throw error;
  return data ? rowToVendorProfile(data as Record<string, unknown>) : null;
}

export async function listVendorInventory(options?: { ownerId?: string; publishedOnly?: boolean }): Promise<VendorInventoryRecord[]> {
  let query = getAdminDb().from('vendor_inventory').select('*, vendor_profiles!inner(display_name, status)').order('created_at', { ascending: false });
  if (options?.ownerId) query = query.eq('owner_id', options.ownerId);
  if (options?.publishedOnly) {
    query = query.eq('status', 'published').eq('vendor_profiles.status', 'published');
  }
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(row => rowToVendorInventory(row as Record<string, unknown>));
}

export async function createVendorInventory(input: {
  ownerId: string;
  vendorProfileId: string;
  name: string;
  channel: string;
  format: string;
  placement: string;
  audience: string;
  geography: string[];
  minBidSats: number;
  proofRequirements: string[];
  disclosureRequired: boolean;
  status?: VendorInventoryRecord['status'];
}): Promise<VendorInventoryRecord> {
  const { data, error } = await getAdminDb().from('vendor_inventory').insert({
    owner_id: input.ownerId,
    vendor_profile_id: input.vendorProfileId,
    name: input.name,
    channel: input.channel,
    format: input.format,
    placement: input.placement,
    audience: input.audience,
    geography: input.geography,
    min_bid_sats: input.minBidSats,
    current_bid_sats: input.minBidSats,
    proof_requirements: input.proofRequirements,
    disclosure_required: input.disclosureRequired,
    status: input.status ?? 'draft',
    updated_at: new Date().toISOString(),
  }).select().single();
  if (error) throw error;
  return rowToVendorInventory(data as Record<string, unknown>);
}

export async function updateVendorInventory(ownerId: string, id: string, input: Partial<Omit<VendorInventoryRecord, 'id' | 'ownerId' | 'vendorProfileId' | 'createdAt' | 'updatedAt'>>): Promise<VendorInventoryRecord> {
  const update: Record<string, unknown> = {
    ...(input.name !== undefined ? { name: input.name } : {}),
    ...(input.channel !== undefined ? { channel: input.channel } : {}),
    ...(input.format !== undefined ? { format: input.format } : {}),
    ...(input.placement !== undefined ? { placement: input.placement } : {}),
    ...(input.audience !== undefined ? { audience: input.audience } : {}),
    ...(input.geography !== undefined ? { geography: input.geography } : {}),
    ...(input.minBidSats !== undefined ? { min_bid_sats: input.minBidSats } : {}),
    ...(input.proofRequirements !== undefined ? { proof_requirements: input.proofRequirements } : {}),
    ...(input.disclosureRequired !== undefined ? { disclosure_required: input.disclosureRequired } : {}),
    ...(input.status !== undefined ? { status: input.status } : {}),
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await getAdminDb().from('vendor_inventory').update(update).eq('id', id).eq('owner_id', ownerId).select().single();
  if (error) throw error;
  return rowToVendorInventory(data as Record<string, unknown>);
}

export async function createDurablePlacementRequest(input: {
  advertiserId: string;
  vendorId: string;
  publisher?: string;
  inventory: VendorInventoryRecord;
  advertiserLabel: string;
  budgetSats: number;
  message: string;
}): Promise<DurablePlacementRequestRecord> {
  const { data, error } = await getAdminDb().from('placement_requests').insert({
    advertiser_id: input.advertiserId,
    vendor_id: input.vendorId,
    inventory_id: input.inventory.id,
    slot_name: input.inventory.name,
    publisher: input.publisher ?? input.vendorId,
    channel: input.inventory.channel,
    format: input.inventory.format,
    audience: input.inventory.audience,
    budget_sats: input.budgetSats,
    advertiser_label: input.advertiserLabel,
    message: input.message,
    disclosure_required: input.inventory.disclosureRequired,
    proof_requirements: input.inventory.proofRequirements,
    status: 'offered',
  }).select().single();
  if (error) throw error;
  return rowToPlacementRequest(data as Record<string, unknown>);
}

export async function listDurablePlacementRequests(userId: string): Promise<DurablePlacementRequestRecord[]> {
  const { data, error } = await getAdminDb().from('placement_requests').select('*').or(`advertiser_id.eq.${userId},vendor_id.eq.${userId}`).order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(row => rowToPlacementRequest(row as Record<string, unknown>));
}

export async function transitionDurablePlacementRequest(userId: string, id: string, status: DurablePlacementRequestRecord['status'], proof?: DurablePlacementRequestRecord['proof']): Promise<DurablePlacementRequestRecord> {
  const existing = await getAdminDb().from('placement_requests').select('*').eq('id', id).or(`advertiser_id.eq.${userId},vendor_id.eq.${userId}`).single();
  if (existing.error || !existing.data) throw new Error('Placement request not found');
  const current = rowToPlacementRequest(existing.data as Record<string, unknown>);
  const isVendor = current.vendorId === userId;
  const isAdvertiser = current.advertiserId === userId;
  const vendorStatuses: DurablePlacementRequestRecord['status'][] = ['accepted', 'declined', 'published', 'proof_submitted'];
  const advertiserStatuses: DurablePlacementRequestRecord['status'][] = ['verified'];
  if ((vendorStatuses.includes(status) && !isVendor) || (advertiserStatuses.includes(status) && !isAdvertiser)) {
    throw new Error('User is not allowed to perform this placement transition');
  }
  const allowed: Record<string, string[]> = { offered: ['accepted', 'declined'], accepted: ['published'], published: ['proof_submitted'], proof_submitted: ['verified'] };
  if (!allowed[current.status]?.includes(status)) throw new Error('Invalid placement transition');
  const update: Record<string, unknown> = { status };
  if (status === 'accepted') update.accepted_at = new Date().toISOString();
  if (status === 'published') update.published_at = new Date().toISOString();
  if (status === 'proof_submitted') update.proof = proof ?? null;
  const { data, error } = await getAdminDb().from('placement_requests').update(update).eq('id', id).select().single();
  if (error) throw error;
  return rowToPlacementRequest(data as Record<string, unknown>);
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