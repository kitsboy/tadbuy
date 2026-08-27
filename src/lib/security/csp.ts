/**
 * CSP nonce + helper for safely rendering Content-Security-Policy
 * headers. We use per-request nonces in production; this module gives the
 * app a stable helper for building the policy string.
 */

export interface CspDirectives {
  defaultSrc: string[];
  scriptSrc: string[];
  styleSrc: string[];
  imgSrc: string[];
  connectSrc: string[];
  fontSrc: string[];
  frameSrc: string[];
  frameAncestors: string[];
  objectSrc: string[];
  baseUri: string[];
  formAction: string[];
  upgradeInsecureRequests: boolean;
}

export const DEFAULT_CSP: CspDirectives = {
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'", "'unsafe-inline'", 'https://mempool.space', 'https://analytics.giveabit.io'],
  styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
  imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
  connectSrc: [
    "'self'",
    'https://mempool.space',
    'https://api.giveabit.io',
    'https://*.supabase.co',
    'https://api.satohash.io',
    'https://*.nostr.build',
    'wss://relay.damus.io',
    'wss://nos.lol',
    'https://analytics.giveabit.io',
  ],
  fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
  frameSrc: ["'self'"],
  frameAncestors: ["'self'"],
  objectSrc: ["'none'"],
  baseUri: ["'self'"],
  formAction: ["'self'"],
  upgradeInsecureRequests: true,
};

/** Render directives into a CSP header value. */
export function buildCspHeader(directives: CspDirectives = DEFAULT_CSP): string {
  const lines: string[] = [];
  if (directives.upgradeInsecureRequests) lines.push('upgrade-insecure-requests');
  for (const [k, v] of Object.entries(directives)) {
    if (k === 'upgradeInsecureRequests') continue;
    if (!v || (Array.isArray(v) && v.length === 0)) continue;
    const key = k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
    lines.push(`${key} ${(v as string[]).join(' ')}`);
  }
  return lines.join('; ');
}

/** Recommended security headers for the platform. */
export const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
};
