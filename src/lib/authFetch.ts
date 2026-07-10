/**
 * Authenticated fetch helper — attaches Firebase ID token when available.
 */
import { getSafeAuth } from '@/firebase';
import { getApiBase } from '@/lib/apiBase';

export async function getAuthHeaders(
  extra?: HeadersInit
): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (extra) {
    const h = new Headers(extra);
    h.forEach((v, k) => {
      headers[k] = v;
    });
  }

  try {
    const auth = getSafeAuth();
    const user = auth?.currentUser;
    if (user) {
      const token = await user.getIdToken();
      headers['Authorization'] = `Bearer ${token}`;
    }
  } catch {
    // leave unauthenticated
  }

  return headers;
}

export async function authFetch(path: string, init?: RequestInit): Promise<Response> {
  const base = getApiBase();
  const url = path.startsWith('http') ? path : `${base}${path}`;
  const authHeaders = await getAuthHeaders(init?.headers);
  const merged: RequestInit = {
    ...init,
    headers: authHeaders,
  };

  try {
    return await fetch(url, merged);
  } catch {
    if (base !== '') {
      return fetch(path, merged);
    }
    throw new Error('API unreachable');
  }
}
