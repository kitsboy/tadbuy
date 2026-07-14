/**
 * Raw impression / tracking event store with privacy defaults.
 * - IP is always anonymized before insert
 * - Fingerprints/UAs are hashed
 * - 30-day retention via purgeImpressionLogsOlderThan()
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import { getAdminDb } from './supabaseAdmin.ts';
import {
  anonymizeIp,
  extractClientIp,
  hashIdentifierSync,
} from '../privacy/ipAnonymize.ts';

export type ImpressionEventType =
  | 'view'
  | 'retargeting'
  | 'conversion'
  | 'heatmap'
  | 'serve'
  | 'fraud_audit';

export interface ImpressionIngress {
  type: ImpressionEventType;
  adId?: string | null;
  campaignId?: string | null;
  publisherId?: string | null;
  advertiserId?: string | null;
  /** Client-supplied fingerprint — will be hashed, never stored raw */
  fp?: string | null;
  url?: string | null;
  scrollDepth?: number | null;
  value?: number | null;
  /** Optional extra non-PII metadata */
  meta?: Record<string, unknown> | null;
  req?: {
    ip?: string;
    headers: Record<string, string | string[] | undefined>;
    socket?: { remoteAddress?: string };
  };
}

export interface ImpressionLogRow {
  id?: string;
  event_type: ImpressionEventType;
  ad_id: string | null;
  campaign_id: string | null;
  publisher_id: string | null;
  advertiser_id: string | null;
  fp_hash: string | null;
  ip_anonymized: string | null;
  page_path: string | null;
  scroll_depth: number | null;
  value_sats: number | null;
  meta: Record<string, unknown>;
  created_at?: string;
}

const TABLE = 'impression_logs';
const RETENTION_DAYS = 30;

function safePath(url: string | null | undefined): string | null {
  if (!url || typeof url !== 'string') return null;
  try {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      const u = new URL(url);
      return `${u.origin}${u.pathname}`.slice(0, 500);
    }
    return url.split('?')[0].split('#')[0].slice(0, 500);
  } catch {
    return url.slice(0, 200);
  }
}

/** Build a privacy-safe row from ingress payload + request. */
export function sanitizeImpressionIngress(input: ImpressionIngress): ImpressionLogRow {
  const rawIp = input.req ? extractClientIp(input.req) : null;
  const ipAnonymized = anonymizeIp(rawIp);
  const fpHash = hashIdentifierSync(input.fp);

  const meta: Record<string, unknown> = { ...(input.meta ?? {}) };
  for (const k of Object.keys(meta)) {
    const lower = k.toLowerCase();
    if (
      lower.includes('ip') ||
      lower === 'fp' ||
      lower === 'fingerprint' ||
      lower.includes('useragent') ||
      lower.includes('user-agent') ||
      lower.includes('email') ||
      lower.includes('phone')
    ) {
      delete meta[k];
    }
  }

  return {
    event_type: input.type,
    ad_id: input.adId ?? null,
    campaign_id: input.campaignId ?? null,
    publisher_id: input.publisherId ?? null,
    advertiser_id: input.advertiserId ?? null,
    fp_hash: fpHash,
    ip_anonymized: ipAnonymized,
    page_path: safePath(input.url),
    scroll_depth:
      typeof input.scrollDepth === 'number' && Number.isFinite(input.scrollDepth)
        ? Math.max(0, Math.min(100, Math.round(input.scrollDepth)))
        : null,
    value_sats:
      typeof input.value === 'number' && Number.isFinite(input.value)
        ? Math.max(0, Math.round(input.value))
        : null,
    meta,
  };
}

export async function insertImpressionLog(
  input: ImpressionIngress,
  db: SupabaseClient = getAdminDb(),
): Promise<{ ok: boolean; demo?: boolean; id?: string; error?: string }> {
  const row = sanitizeImpressionIngress(input);
  try {
    const { data, error } = await db
      .from(TABLE)
      .insert({
        event_type: row.event_type,
        ad_id: row.ad_id,
        campaign_id: row.campaign_id,
        publisher_id: row.publisher_id,
        advertiser_id: row.advertiser_id,
        fp_hash: row.fp_hash,
        ip_anonymized: row.ip_anonymized,
        page_path: row.page_path,
        scroll_depth: row.scroll_depth,
        value_sats: row.value_sats,
        meta: row.meta,
      })
      .select('id')
      .maybeSingle();
    if (error) {
      if (error.message?.includes('does not exist') || error.code === '42P01') {
        return { ok: true, demo: true };
      }
      console.warn('[impressionLogs] insert failed:', error.message);
      return { ok: false, error: error.message };
    }
    return { ok: true, id: data?.id };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes('SUPABASE_URL') || msg.includes('SERVICE_ROLE')) {
      return { ok: true, demo: true };
    }
    console.warn('[impressionLogs] insert exception:', msg);
    return { ok: false, error: msg };
  }
}

/**
 * Remove raw impression logs older than retention (default 30 days).
 * Call on a schedule (startup + admin/cron). Safe to re-run.
 */
export async function purgeImpressionLogsOlderThan(
  days: number = RETENTION_DAYS,
  db: SupabaseClient = getAdminDb(),
): Promise<{ deleted: number; cutoff: string; error?: string }> {
  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const cutoff = cutoffDate.toISOString();
  try {
    const rpc = await db.rpc('purge_impression_logs', { retention_days: days });
    if (!rpc.error && typeof rpc.data === 'number') {
      return { deleted: rpc.data, cutoff };
    }

    const { data: oldRows, error: selErr } = await db
      .from(TABLE)
      .select('id')
      .lt('created_at', cutoff)
      .limit(5000);
    if (selErr) {
      if (selErr.message?.includes('does not exist') || selErr.code === '42P01') {
        return { deleted: 0, cutoff };
      }
      return { deleted: 0, cutoff, error: selErr.message };
    }
    const ids = (oldRows ?? []).map((r: { id: string }) => r.id);
    if (ids.length === 0) return { deleted: 0, cutoff };

    const { error: delErr } = await db.from(TABLE).delete().in('id', ids);
    if (delErr) return { deleted: 0, cutoff, error: delErr.message };
    return { deleted: ids.length, cutoff };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes('SUPABASE_URL') || msg.includes('SERVICE_ROLE')) {
      return { deleted: 0, cutoff };
    }
    return { deleted: 0, cutoff, error: msg };
  }
}

export { RETENTION_DAYS };
