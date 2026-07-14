import { createHash } from "node:crypto";

/**
 * Privacy utilities for tracking/ingress data.
 * Never persist raw client IPs. Truncate to coarse network prefixes only.
 */

/** Strip last octet of IPv4 (192.168.1.45 → 192.168.1.0). */
export function anonymizeIPv4(ip: string): string {
  const parts = ip.split('.');
  if (parts.length !== 4) return '0.0.0.0';
  if (!parts.every((p) => /^\d{1,3}$/.test(p) && Number(p) <= 255)) return '0.0.0.0';
  return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
}

/**
 * Truncate IPv6 to /48 (first 3 hextets) for coarse geo only.
 * Example: 2001:db8:85a3::8a2e:370:7334 → 2001:db8:85a3::
 */
export function anonymizeIPv6(ip: string): string {
  const cleaned = ip.replace(/^\[|\]$/g, '').split('%')[0];
  const lower = cleaned.toLowerCase();
  if (lower === '::' || lower === '::1') return '::';
  const [head, tail = ''] = lower.split('::');
  const headParts = head ? head.split(':').filter(Boolean) : [];
  const tailParts = tail ? tail.split(':').filter(Boolean) : [];
  const missing = 8 - headParts.length - tailParts.length;
  const full = [
    ...headParts,
    ...Array(Math.max(0, missing)).fill('0'),
    ...tailParts,
  ].slice(0, 8);
  while (full.length < 3) full.push('0');
  return `${full[0]}:${full[1]}:${full[2]}::`;
}

/** Detect family and anonymize. Returns null for empty/unknown. */
export function anonymizeIp(ip: string | undefined | null): string | null {
  if (!ip || typeof ip !== 'string') return null;
  let raw = ip.trim();
  if (raw.startsWith('::ffff:')) {
    raw = raw.slice(7);
  }
  if (/^\d{1,3}(\.\d{1,3}){3}:\d+$/.test(raw)) {
    raw = raw.split(':')[0];
  }
  if (raw.includes(':') && raw.includes('.')) {
    raw = raw.replace(/^\[|\]$/g, '').split('%')[0];
  }
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(raw)) {
    return anonymizeIPv4(raw);
  }
  if (raw.includes(':')) {
    return anonymizeIPv6(raw);
  }
  return null;
}

/**
 * Best-effort client IP from Express request (trust proxy aware).
 * Does NOT return raw IP for storage — always run through anonymizeIp.
 */
export function extractClientIp(req: {
  ip?: string;
  headers: Record<string, string | string[] | undefined>;
  socket?: { remoteAddress?: string };
}): string | null {
  const xf = req.headers['x-forwarded-for'];
  const forwarded = Array.isArray(xf) ? xf[0] : xf;
  const firstHop = forwarded?.split(',')[0]?.trim();
  const realIp = req.headers['x-real-ip'];
  const real = Array.isArray(realIp) ? realIp[0] : realIp;
  const candidate = firstHop || real || req.ip || req.socket?.remoteAddress || null;
  return typeof candidate === 'string' ? candidate : null;
}

/** Hash a fingerprint/user-agent string into a short non-reversible token (SHA-256 hex prefix). */
export async function hashIdentifier(
  value: string | undefined | null,
  salt = 'tadbuy-fp-v1',
): Promise<string | null> {
  if (!value || typeof value !== 'string') return null;
  const data = new TextEncoder().encode(`${salt}:${value}`);
  try {
    if (typeof globalThis.crypto?.subtle?.digest === 'function') {
      const digest = await globalThis.crypto.subtle.digest('SHA-256', data);
      return Buffer.from(digest).toString('hex').slice(0, 32);
    }
  } catch {
    // fall through
  }
  const { createHash } = await import('node:crypto');
  return createHash('sha256').update(`${salt}:${value}`).digest('hex').slice(0, 32);
}

/** Synchronous hash for hot paths (Node only). */
export function hashIdentifierSync(
  value: string | undefined | null,
  salt = 'tadbuy-fp-v1',
): string | null {
  if (!value || typeof value !== 'string') return null;
  return createHash('sha256').update(`${salt}:${value}`).digest('hex').slice(0, 32);
}
