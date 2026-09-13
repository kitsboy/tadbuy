/**
 * API base URL resolver.
 *
 * Cloudflare Pages serves this app as a static SPA, so there is no API host
 * baked into the build. Set `VITE_API_BASE_URL` at build time to point the
 * `/api/*` calls at a real origin; when it is unset the calls stay same-origin
 * (Cloudflare Pages Functions, e.g. `/api/csp-report`).
 *
 * History: this file used to hardcode `https://api.giveabit.io` as a "staged"
 * base. That hostname is a Cloudflare Tunnel to the M4 laptop that no longer
 * exists (0 tunnels on the account → every path = HTTP 530 / CF error 1033),
 * so every page that probed it produced CORS + net::ERR_FAILED console errors.
 * Removed 2026-09-13 rather than re-pointed: a production origin must not
 * depend on a laptop being awake, and a hardcoded host is not how the API is
 * meant to be wired (see GIVEABIT_ECOSYSTEM.api).
 */

export function getApiBase(): string {
  const env = import.meta.env.VITE_API_BASE_URL;
  if (env && env.trim()) return env.trim().replace(/\/+$/, '');
  return '';
}

export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const base = getApiBase();
  const url = path.startsWith('http') ? path : `${base}${path}`;
  try {
    return await fetch(url, init);
  } catch {
    // Fallback to same-origin when a configured API base is unreachable
    if (base !== '' && !path.startsWith('http')) {
      return fetch(path, init);
    }
    throw new Error('API unreachable');
  }
}
