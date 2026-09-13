/**
 * Authenticated fetch helper — attaches Firebase ID token when available.
 */
import { getSafeAuth } from '@/firebase';
import { getApiBase } from '@/lib/apiBase';

export async function getAuthHeaders(
  extra?: HeadersInit,
  forceRefresh = false
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
      const token = await user.getIdToken(forceRefresh);
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

  const request = () => fetch(url, merged);
  try {
    const response = await request();
    if (response.status !== 401) return response;

    // Firebase ID tokens expire. Refresh once, then retry the original request;
    // never loop indefinitely on a genuinely unauthenticated request.
    const refreshedHeaders = await getAuthHeaders(init?.headers, true);
    const retryResponse = await fetch(url, { ...merged, headers: refreshedHeaders });
    if (retryResponse.status !== 401) return retryResponse;

    if (base !== '') return fetch(path, { ...merged, headers: refreshedHeaders });
    return retryResponse;
  } catch {
    if (base !== '') {
      return fetch(path, merged);
    }
    throw new Error('API unreachable');
  }
}
