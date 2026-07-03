/**
 * API base URL resolver.
 * Cloudflare Pages = static only. APIs run on M3 dev server or future M4 proxy.
 */
const STAGED_API = 'https://api.giveabit.io';

export function getApiBase(): string {
  const env = import.meta.env.VITE_API_BASE_URL;
  if (env) return env.replace(/\/$/, '');
  if (import.meta.env.DEV) return '';
  // Production static host — try staged M4 proxy, fall back to same-origin (will 404 on CF Pages)
  return STAGED_API;
}

export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const base = getApiBase();
  const url = path.startsWith('http') ? path : `${base}${path}`;
  try {
    const res = await fetch(url, init);
    return res;
  } catch {
    // Fallback to same-origin if M4 proxy unreachable
    if (base !== '') {
      return fetch(path, init);
    }
    throw new Error('API unreachable');
  }
}

export async function checkApiHealth(): Promise<{
  ok: boolean;
  source: 'm4-proxy' | 'local' | 'unavailable';
  message: string;
}> {
  for (const base of [getApiBase(), '']) {
    if (base === STAGED_API && !import.meta.env.VITE_API_BASE_URL) {
      try {
        const res = await fetch(`${STAGED_API}/api/v4/status`, { signal: AbortSignal.timeout(3000) });
        if (res.ok) return { ok: true, source: 'm4-proxy', message: 'M4 API proxy online' };
      } catch { /* try next */ }
    }
    try {
      const res = await fetch(`${base}/api/v4/status`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) return { ok: true, source: base ? 'm4-proxy' : 'local', message: 'API online' };
    } catch { /* continue */ }
  }
  return {
    ok: false,
    source: 'unavailable',
    message: 'API offline — static mode (UI works, payments need M4 server or npm run dev)',
  };
}