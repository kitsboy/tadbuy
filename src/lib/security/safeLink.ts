/**
 * External link safety — guarantees target="_blank" anchors use
 * rel="noopener noreferrer" and only allow safe URL schemes.
 *
 * Blocks javascript:, data:, vbscript:, file: etc. that can be used
 * for XSS via opener/tabnabbing or anchor hijacking.
 */

export type SafeUrlTarget = '_blank' | '_self' | '_parent' | '_top';

const SAFE_PROTOCOLS = /^(https?:|mailto:|tel:|sms:|bitcoin:|lightning:|lnurl:|nostr:)/i;
const DANGEROUS_PROTOCOLS = /^(javascript|data|vbscript|file|about):/i;

export function isSafeUrl(url: string | undefined | null): url is string {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith('/') || trimmed.startsWith('#') || trimmed.startsWith('?')) return true;
  if (DANGEROUS_PROTOCOLS.test(trimmed)) return false;
  return SAFE_PROTOCOLS.test(trimmed);
}

export function sanitizeUrl(url: string | undefined | null, fallback: string = '/'): string {
  return isSafeUrl(url) ? url!.trim() : fallback;
}

/**
 * Build a rel attribute that's safe for target="_blank" links.
 * Always includes noopener + noreferrer unless caller already provided one.
 */
export function safeRel(existing?: string): string {
  const tokens = new Set(
    (existing ?? '')
      .split(/\s+/)
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean)
  );
  tokens.add('noopener');
  tokens.add('noreferrer');
  return Array.from(tokens).join(' ');
}

/**
 * Compose a fully hardened external link props object:
 *   { href, target, rel } — with noopener/noreferrer enforced.
 */
export function safeExternalProps(
  href: string | undefined | null,
  opts: { target?: SafeUrlTarget; rel?: string; fallback?: string } = {}
): { href: string; target: SafeUrlTarget; rel: string } {
  const safe = sanitizeUrl(href, opts.fallback ?? '#');
  return {
    href: safe,
    target: opts.target ?? '_blank',
    rel: safeRel(opts.rel),
  };
}

/**
 * Strip everything after the # in a URL to remove fragment-based attacks
 * while preserving the actual path. Useful for redirect URLs.
 */
export function stripFragment(url: string): string {
  return url.split('#')[0] ?? url;
}

/**
 * Validate that a returnTo / redirect URL is same-origin to prevent
 * open-redirect / phishing. Used by OAuth flows.
 */
export function isSameOriginUrl(
  url: string,
  expectedOrigin: string
): boolean {
  if (!url) return false;
  try {
    if (url.startsWith('/') && !url.startsWith('//')) return true;
    const u = new URL(url, expectedOrigin);
    return u.origin === expectedOrigin;
  } catch {
    return false;
  }
}
