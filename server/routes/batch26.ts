import type { Express } from 'express';
import { requireAuth, type AuthedRequest } from '../../src/lib/api/userAuth.ts';
import {
  createDurablePlacementRequest,
  createVendorInventory,
  getVendorProfile,
  listDurablePlacementRequests,
  listVendorInventory,
  recordNip05Verification,
  transitionDurablePlacementRequest,
  updateVendorInventory,
  upsertVendorProfile,
} from '../../src/lib/db/supabaseAdmin.ts';
import { decodeNpub } from '../../src/lib/nostr/nip19.ts';
import type { DurablePlacementRequestRecord, VendorInventoryRecord } from '../../src/lib/db/types.ts';

function validNip05(value: string): { name: string; domain: string } | null {
  const match = value.trim().toLowerCase().match(/^([a-z0-9._-]+)@([a-z0-9.-]+)$/);
  if (!match || match[2].includes('..') || match[2].startsWith('.') || match[2].endsWith('.')) return null;
  return { name: match[1], domain: match[2] };
}

async function resolveNip05(identifier: string): Promise<{ pubkey: string; relays: string[]; url: string } | null> {
  const parsed = validNip05(identifier);
  if (!parsed) return null;
  const url = `https://${parsed.domain}/.well-known/nostr.json?name=${encodeURIComponent(parsed.name)}`;
  const response = await fetch(url, { signal: AbortSignal.timeout(5000), headers: { Accept: 'application/json' } });
  if (!response.ok) return null;
  const payload = await response.json() as { names?: Record<string, unknown>; relays?: Record<string, unknown> };
  const pubkey = typeof payload.names?.[parsed.name] === 'string' ? payload.names[parsed.name] : '';
  if (!/^[0-9a-f]{64}$/.test(pubkey)) return null;
  const relays = Array.isArray(payload.relays?.[pubkey])
    ? payload.relays[pubkey].filter((relay): relay is string => typeof relay === 'string' && /^wss:\/\//.test(relay)).slice(0, 10)
    : [];
  return { pubkey, relays, url };
}

function staged(res: Parameters<Parameters<Express['get']>[1]>[1], message: string) {
  return res.status(503).json({
    error: 'Durable marketplace storage is not configured',
    staged: true,
    message,
  });
}

function bodyString(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function bodyStringArray(value: unknown, maxItems: number, maxItemLength: number): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string')
    .map(item => item.trim().slice(0, maxItemLength))
    .filter(Boolean)
    .slice(0, maxItems);
}

function validPublishedDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const timestamp = Date.parse(`${value}T00:00:00.000Z`);
  return Number.isFinite(timestamp) && timestamp <= Date.now();
}

function publicSlot(inventory: VendorInventoryRecord) {
  return {
    id: inventory.id,
    name: inventory.name,
    publisher: inventory.vendorDisplayName || 'Independent vendor',
    publisherVerified: false,
    placement: inventory.placement,
    format: inventory.format,
    category: inventory.channel,
    audience: inventory.audience,
    geo: inventory.geography,
    minBidSats: inventory.minBidSats,
    currentBidSats: inventory.currentBidSats,
    impressionsPerDay: 0,
    ctr: 0,
    status: 'available' as const,
    tags: [],
    platformType: inventory.channel,
    durable: true,
    inventoryId: inventory.id,
    disclosureRequired: inventory.disclosureRequired,
    proofRequirements: inventory.proofRequirements,
  };
}

export function registerBatch26Routes(app: Express) {
  app.get('/api/marketplace/inventory/public', async (_req, res) => {
    try {
      const inventory = await listVendorInventory({ publishedOnly: true });
      return res.json({ source: 'supabase', durable: true, total: inventory.length, slots: inventory.map(publicSlot) });
    } catch {
      return staged(res, 'Apply supabase-vendor-marketplace.sql and configure the server database before publishing vendor inventory.');
    }
  });

  app.get('/api/vendor/profile', requireAuth, async (req, res) => {
    try {
      const profile = await getVendorProfile((req as AuthedRequest).userId!);
      return res.json({ source: 'supabase', durable: true, profile });
    } catch {
      return staged(res, 'Vendor profiles become durable after Supabase is configured.');
    }
  });

  app.put('/api/vendor/profile', requireAuth, async (req, res) => {
    const ownerId = (req as AuthedRequest).userId!;
    const displayName = bodyString(req.body?.displayName, 80);
    if (!displayName) return res.status(400).json({ error: 'displayName is required' });
    try {
      const existing = await getVendorProfile(ownerId);
      const profile = await upsertVendorProfile({
        ownerId,
        displayName,
        npub: bodyString(req.body?.npub, 120),
        nip05: bodyString(req.body?.nip05, 120),
        lightningAddress: bodyString(req.body?.lightningAddress, 120),
        audience: bodyString(req.body?.audience, 500),
        geography: bodyString(req.body?.geography, 300),
        channels: bodyStringArray(req.body?.channels, 10, 80),
        // Public profile publication is an operator-controlled action. Preserve an existing approval.
        status: existing?.status ?? 'draft',
      });
      return res.json({ source: 'supabase', durable: true, profile });
    } catch {
      return staged(res, 'Vendor profile was validated but not persisted because durable storage is unavailable.');
    }
  });

  app.post('/api/vendor/nip05/verify', requireAuth, async (req, res) => {
    const ownerId = (req as AuthedRequest).userId!;
    const nip05 = bodyString(req.body?.nip05, 120).toLowerCase();
    const npub = bodyString(req.body?.npub, 120);
    const profile = await getVendorProfile(ownerId).catch(() => null);
    if (!profile) return res.status(409).json({ error: 'Save a vendor profile before checking NIP-05' });
    if (!nip05 || !npub || nip05 !== profile.nip05.toLowerCase() || npub !== profile.npub) {
      return res.status(400).json({ error: 'NIP-05 and npub must match the saved vendor profile' });
    }
    const expectedPubkey = decodeNpub(npub);
    if (!expectedPubkey) return res.status(400).json({ error: 'Invalid npub format' });

    try {
      const resolved = await resolveNip05(nip05);
      const matched = Boolean(resolved && resolved.pubkey === expectedPubkey);
      const status = matched ? 'verified' : 'failed';
      const evidence = {
        resolverUrl: resolved?.url ?? null,
        resolvedPubkey: resolved?.pubkey ?? null,
        relays: resolved?.relays ?? [],
        matched,
      };
      const updated = await recordNip05Verification({ ownerId, nip05, pubkeyHex: expectedPubkey, status, evidence });
      return res.json({ source: 'supabase', durable: true, status, profile: updated, evidence });
    } catch {
      try {
        const updated = await recordNip05Verification({ ownerId, nip05, pubkeyHex: expectedPubkey, status: 'failed', evidence: { matched: false, error: 'resolver_unavailable' } });
        return res.status(502).json({ error: 'NIP-05 resolver unavailable', status: 'failed', profile: updated });
      } catch {
        return staged(res, 'NIP-05 verification requires durable vendor profile storage.');
      }
    }
  });

  app.get('/api/vendor/inventory', requireAuth, async (req, res) => {
    try {
      const inventory = await listVendorInventory({ ownerId: (req as AuthedRequest).userId! });
      return res.json({ source: 'supabase', durable: true, inventory });
    } catch {
      return staged(res, 'Vendor inventory becomes durable after Supabase is configured.');
    }
  });

  app.post('/api/vendor/inventory', requireAuth, async (req, res) => {
    const ownerId = (req as AuthedRequest).userId!;
    const name = bodyString(req.body?.name, 120);
    const channel = bodyString(req.body?.channel, 60);
    const format = bodyString(req.body?.format, 120);
    const placement = bodyString(req.body?.placement, 160);
    if (!name || !channel || !format || !placement) {
      return res.status(400).json({ error: 'name, channel, format, and placement are required' });
    }
    try {
      const profile = await getVendorProfile(ownerId);
      if (!profile) return res.status(409).json({ error: 'Create a vendor profile before adding inventory' });
      const inventory = await createVendorInventory({
        ownerId,
        vendorProfileId: profile.id,
        name,
        channel,
        format,
        placement,
        audience: bodyString(req.body?.audience, 500),
        geography: bodyStringArray(req.body?.geography, 20, 30),
        minBidSats: Math.max(0, Math.floor(Number(req.body?.minBidSats) || 0)),
        proofRequirements: bodyStringArray(req.body?.proofRequirements, 10, 120),
        disclosureRequired: req.body?.disclosureRequired !== false,
        status: 'draft',
      });
      return res.status(201).json({ source: 'supabase', durable: true, inventory });
    } catch (error) {
      if (error instanceof Error && error.message.includes('Create a vendor profile')) return res.status(409).json({ error: error.message });
      return staged(res, 'Inventory was validated but not persisted because durable storage is unavailable.');
    }
  });

  app.patch('/api/vendor/inventory/:id', requireAuth, async (req, res) => {
    try {
      const requestedStatus = req.body?.status as VendorInventoryRecord['status'] | undefined;
      if (requestedStatus === 'published') {
        const profile = await getVendorProfile((req as AuthedRequest).userId!);
        if (profile?.status !== 'published') {
          return res.status(409).json({ error: 'Vendor profile approval is required before publishing inventory' });
        }
      }
      const inventory = await updateVendorInventory((req as AuthedRequest).userId!, req.params.id, {
        ...(req.body?.name !== undefined ? { name: bodyString(req.body.name, 120) } : {}),
        ...(req.body?.channel !== undefined ? { channel: bodyString(req.body.channel, 60) } : {}),
        ...(req.body?.format !== undefined ? { format: bodyString(req.body.format, 120) } : {}),
        ...(req.body?.placement !== undefined ? { placement: bodyString(req.body.placement, 160) } : {}),
        ...(req.body?.audience !== undefined ? { audience: bodyString(req.body.audience, 500) } : {}),
        ...(req.body?.geography !== undefined ? { geography: bodyStringArray(req.body.geography, 20, 30) } : {}),
        ...(req.body?.minBidSats !== undefined ? { minBidSats: Math.max(0, Math.floor(Number(req.body.minBidSats) || 0)) } : {}),
        ...(req.body?.proofRequirements !== undefined ? { proofRequirements: bodyStringArray(req.body.proofRequirements, 10, 120) } : {}),
        ...(req.body?.disclosureRequired !== undefined ? { disclosureRequired: req.body.disclosureRequired !== false } : {}),
        ...(req.body?.status !== undefined && ['draft', 'published', 'paused'].includes(req.body.status) ? { status: req.body.status as VendorInventoryRecord['status'] } : {}),
      });
      return res.json({ source: 'supabase', durable: true, inventory });
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        return res.status(404).json({ error: 'Inventory not found or not owned by this user' });
      }
      if (error instanceof Error && error.message.includes('violates')) {
        return res.status(400).json({ error: 'Inventory update violates a marketplace constraint' });
      }
      return staged(res, 'Inventory update was validated but durable storage is unavailable.');
    }
  });

  app.get('/api/placement-requests', requireAuth, async (req, res) => {
    try {
      const requests = await listDurablePlacementRequests((req as AuthedRequest).userId!);
      return res.json({ source: 'supabase', durable: true, requests });
    } catch {
      return staged(res, 'Placement records become durable after Supabase is configured.');
    }
  });

  app.post('/api/placement-requests', requireAuth, async (req, res) => {
    const advertiserId = (req as AuthedRequest).userId!;
    const inventoryId = bodyString(req.body?.inventoryId, 80);
    const advertiserLabel = bodyString(req.body?.advertiserLabel, 80);
    const budgetSats = Math.floor(Number(req.body?.budgetSats));
    if (!inventoryId || !advertiserLabel || !Number.isFinite(budgetSats) || budgetSats < 0) {
      return res.status(400).json({ error: 'inventoryId, advertiserLabel, and non-negative budgetSats are required' });
    }
    try {
      const inventory = (await listVendorInventory()).find(item => item.id === inventoryId && item.status === 'published');
      if (!inventory) return res.status(404).json({ error: 'Published inventory not found' });
      if (inventory.ownerId === advertiserId) return res.status(409).json({ error: 'You cannot request your own inventory' });
      if (budgetSats < inventory.minBidSats) return res.status(400).json({ error: `Budget must be at least ${inventory.minBidSats} sats for this listing` });
      const request = await createDurablePlacementRequest({ advertiserId, vendorId: inventory.ownerId, publisher: inventory.vendorDisplayName, inventory, advertiserLabel, budgetSats, message: bodyString(req.body?.message, 500) });
      return res.status(201).json({ source: 'supabase', durable: true, request });
    } catch {
      return staged(res, 'Placement request was validated but durable storage is unavailable.');
    }
  });

  app.patch('/api/placement-requests/:id', requireAuth, async (req, res) => {
    const status = req.body?.status as DurablePlacementRequestRecord['status'];
    if (!['accepted', 'declined', 'published', 'proof_submitted', 'verified'].includes(status)) {
      return res.status(400).json({ error: 'Invalid placement status' });
    }
    try {
        const proof = req.body?.proof && typeof req.body.proof === 'object' ? {
          url: bodyString(req.body.proof.url, 500),
          screenshotRef: bodyString(req.body.proof.screenshotRef, 500),
          publishedAt: bodyString(req.body.proof.publishedAt, 40),
          notes: bodyString(req.body.proof.notes, 500),
          disclosureConfirmed: req.body.proof.disclosureConfirmed === true,
        } : undefined;
        if (status === 'proof_submitted' && (!proof?.url || !proof.publishedAt || !validPublishedDate(proof.publishedAt) || !proof.disclosureConfirmed)) {
          return res.status(400).json({ error: 'Proof requires a valid non-future publication date, reference, and sponsorship disclosure confirmation' });
        }
      const request = await transitionDurablePlacementRequest((req as AuthedRequest).userId!, req.params.id, status, proof);
      return res.json({ source: 'supabase', durable: true, request });
    } catch (error) {
      if (error instanceof Error && error.message.includes('not allowed')) {
        return res.status(403).json({ error: error.message });
      }
      if (error instanceof Error && error.message.includes('Invalid placement transition')) {
        return res.status(409).json({ error: error.message });
      }
      return staged(res, 'Placement transition was validated but durable storage is unavailable.');
    }
  });
}
