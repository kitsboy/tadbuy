/**
 * Thin Satohash API client for tadbuy.
 * Public OTS create runs on api.satohash.io; this module only calls HTTP.
 * Graceful offline: network/API failures return ok:false — never throw.
 *
 * Env (Vite):
 *   VITE_SATOHASH_API_URL=https://api.satohash.io
 *   VITE_SATOHASH_URL=https://satohash.io
 *   VITE_SATOHASH_KEY=  (optional family key — never commit)
 */

const DEFAULT_API_URL = 'https://api.satohash.io';
const DEFAULT_SITE_URL = 'https://satohash.io';
const CLIENT_ID = 'tadbuy';
const HEX64 = /^[a-f0-9]{64}$/i;

function stripTrailingSlash(url: string): string {
  return url.replace(/\/+$/, '');
}

/** API base (stamp + health). Override with VITE_SATOHASH_API_URL. */
export function getSatohashApiUrl(): string {
  return stripTrailingSlash(
    (import.meta.env.VITE_SATOHASH_API_URL as string | undefined) || DEFAULT_API_URL,
  );
}

/** Frontend base (verify + stamp guide). Override with VITE_SATOHASH_URL. */
export function getSatohashUrl(): string {
  return stripTrailingSlash(
    (import.meta.env.VITE_SATOHASH_URL as string | undefined) || DEFAULT_SITE_URL,
  );
}

export const SATOHASH_API_BASE = getSatohashApiUrl();
export const SATOHASH_SITE = getSatohashUrl();

export type SatohashHealthResult = {
  ok: boolean;
  status?: number;
  data?: unknown;
  error?: string;
};

export type SatohashStampResult = {
  ok: boolean;
  id?: string;
  status?: string;
  hash?: string;
  error?: string;
  httpStatus?: number;
  data?: unknown;
};

export type SatohashGetStampResult = {
  ok: boolean;
  id?: string;
  status?: string;
  hash?: string;
  filename?: string;
  bitcoin_block_height?: number | null;
  created_at?: string;
  confirmed_at?: string | null;
  error?: string;
  httpStatus?: number;
  data?: unknown;
};

/** SHA-256 hex digest of a string or binary payload (Web Crypto). */
export async function sha256Hex(
  input: string | ArrayBuffer | Uint8Array,
): Promise<string> {
  let data: BufferSource;
  if (typeof input === 'string') {
    data = new TextEncoder().encode(input);
  } else if (input instanceof Uint8Array) {
    data = input;
  } else {
    data = input;
  }
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Public verify page for a stamp id or hash. */
export function verifyUrl(hashOrId: string): string {
  return `${getSatohashUrl()}/verify/${encodeURIComponent(hashOrId)}`;
}

/** Public stamp guide / web stamp UI (optional prefilled hash). */
export function stampGuideUrl(hash?: string): string {
  const base = `${getSatohashUrl()}/stamp`;
  if (!hash) return base;
  return `${base}?hash=${encodeURIComponent(hash)}`;
}

function stampHeaders(apiKey?: string): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Satohash-Client': CLIENT_ID,
  };
  const key =
    apiKey ?? (import.meta.env.VITE_SATOHASH_KEY as string | undefined) ?? '';
  if (key) headers['X-Satohash-Key'] = key;
  return headers;
}

/**
 * GET /health — family API liveness. Never throws; returns ok:false when unreachable.
 */
export async function getApiHealth(signal?: AbortSignal): Promise<SatohashHealthResult> {
  try {
    const res = await fetch(`${getSatohashApiUrl()}/health`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'X-Satohash-Client': CLIENT_ID,
      },
      signal,
    });
    let data: unknown;
    try {
      data = await res.json();
    } catch {
      data = undefined;
    }
    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        data,
        error: `Satohash API health returned HTTP ${res.status}`,
      };
    }
    return { ok: true, status: res.status, data };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Satohash API unreachable',
    };
  }
}

/**
 * POST /api/stamp — submit a SHA-256 hex hash for OpenTimestamps anchoring.
 * Graceful offline: returns ok:false (does not throw) when the API is down.
 */
export async function stampHash(
  hash: string,
  opts?: { filename?: string; apiKey?: string; signal?: AbortSignal },
): Promise<SatohashStampResult> {
  const normalized = hash.trim().toLowerCase().replace(/^0x/, '');
  if (!HEX64.test(normalized)) {
    return { ok: false, error: 'Hash must be 64 hex characters (SHA-256)' };
  }

  try {
    const res = await fetch(`${getSatohashApiUrl()}/api/stamp`, {
      method: 'POST',
      headers: stampHeaders(opts?.apiKey),
      body: JSON.stringify({
        hash: normalized,
        ...(opts?.filename ? { filename: opts.filename } : {}),
      }),
      signal: opts?.signal,
    });

    let body: Record<string, unknown> = {};
    try {
      body = (await res.json()) as Record<string, unknown>;
    } catch {
      /* non-JSON body */
    }

    if (!res.ok) {
      const msg =
        (typeof body.error === 'string' && body.error) ||
        (typeof body.message === 'string' && body.message) ||
        `Satohash stamp failed (HTTP ${res.status})`;
      return { ok: false, error: msg, httpStatus: res.status, data: body };
    }

    return {
      ok: true,
      id: typeof body.id === 'string' ? body.id : undefined,
      status: typeof body.status === 'string' ? body.status : undefined,
      hash: typeof body.hash === 'string' ? body.hash : normalized,
      httpStatus: res.status,
      data: body,
    };
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : 'Satohash API unreachable — use stamp guide link',
    };
  }
}

/**
 * GET /api/stamps/:id — proof status for a stamp id. Never throws.
 */
export async function getStamp(
  id: string,
  signal?: AbortSignal,
): Promise<SatohashGetStampResult> {
  const stampId = id.trim();
  if (!stampId) {
    return { ok: false, error: 'Stamp id is required' };
  }

  try {
    const res = await fetch(
      `${getSatohashApiUrl()}/api/stamps/${encodeURIComponent(stampId)}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'X-Satohash-Client': CLIENT_ID,
        },
        signal,
      },
    );

    let body: Record<string, unknown> = {};
    try {
      body = (await res.json()) as Record<string, unknown>;
    } catch {
      /* non-JSON */
    }

    if (!res.ok) {
      const msg =
        (typeof body.error === 'string' && body.error) ||
        `Satohash getStamp failed (HTTP ${res.status})`;
      return { ok: false, error: msg, httpStatus: res.status, data: body };
    }

    return {
      ok: true,
      id: typeof body.id === 'string' ? body.id : stampId,
      status: typeof body.status === 'string' ? body.status : undefined,
      hash: typeof body.hash === 'string' ? body.hash : undefined,
      filename: typeof body.filename === 'string' ? body.filename : undefined,
      bitcoin_block_height:
        typeof body.bitcoin_block_height === 'number'
          ? body.bitcoin_block_height
          : null,
      created_at: typeof body.created_at === 'string' ? body.created_at : undefined,
      confirmed_at:
        typeof body.confirmed_at === 'string' ? body.confirmed_at : null,
      httpStatus: res.status,
      data: body,
    };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Satohash API unreachable',
    };
  }
}
