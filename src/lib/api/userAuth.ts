/**
 * Server-side user auth via Firebase ID tokens.
 * Verifies Bearer tokens with Identity Toolkit (no service-account required).
 */
import type { Request, Response, NextFunction } from 'express';

export type AuthedRequest = Request & {
  userId?: string;
  userEmail?: string;
};

type TokenCacheEntry = { userId: string; email?: string; exp: number };
const tokenCache = new Map<string, TokenCacheEntry>();
const CACHE_TTL_MS = 5 * 60 * 1000;

function getFirebaseApiKey(): string | undefined {
  return process.env.FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY;
}

function getBearerToken(req: Request): string | null {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return null;
  const token = auth.slice(7).trim();
  return token.length > 0 ? token : null;
}

/**
 * Verify a Firebase ID token via Google Identity Toolkit accounts:lookup.
 */
export async function verifyFirebaseIdToken(
  idToken: string
): Promise<{ userId: string; email?: string } | null> {
  const cached = tokenCache.get(idToken);
  if (cached && cached.exp > Date.now()) {
    return { userId: cached.userId, email: cached.email };
  }

  const apiKey = getFirebaseApiKey();
  if (!apiKey) {
    // Dev-only bypass: allow explicit X-Dev-User-Id when auth not configured
    return null;
  }

  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      users?: Array<{ localId?: string; email?: string }>;
    };
    const user = data.users?.[0];
    if (!user?.localId) return null;

    const result = { userId: user.localId, email: user.email };
    tokenCache.set(idToken, { ...result, exp: Date.now() + CACHE_TTL_MS });
    // Bound cache size
    if (tokenCache.size > 500) {
      const first = tokenCache.keys().next().value;
      if (first) tokenCache.delete(first);
    }
    return result;
  } catch {
    return null;
  }
}

async function resolveUser(req: Request): Promise<{ userId: string; email?: string } | null> {
  const token = getBearerToken(req);
  if (token) {
    const verified = await verifyFirebaseIdToken(token);
    if (verified) return verified;
  }

  // Session established via POST /api/auth/session
  const session = (req as Request & {
    session?: { userId?: string; userEmail?: string };
  }).session;
  if (session?.userId) {
    return { userId: session.userId, email: session.userEmail };
  }

  // Non-production only: X-Dev-User-Id when Firebase API key is missing
  if (
    process.env.NODE_ENV !== 'production' &&
    !getFirebaseApiKey() &&
    typeof req.headers['x-dev-user-id'] === 'string' &&
    req.headers['x-dev-user-id'].length > 0 &&
    req.headers['x-dev-user-id'].length <= 128
  ) {
    return { userId: req.headers['x-dev-user-id'] };
  }

  return null;
}

/** Require authenticated user. Sets req.userId. */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  resolveUser(req)
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Valid Firebase ID token required (Authorization: Bearer <token>)',
        });
      }
      const r = req as AuthedRequest;
      r.userId = user.userId;
      r.userEmail = user.email;
      next();
    })
    .catch(() => {
      res.status(401).json({ error: 'Unauthorized', message: 'Auth verification failed' });
    });
}

/** Attach user if present; never fails. */
export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  resolveUser(req)
    .then((user) => {
      if (user) {
        const r = req as AuthedRequest;
        r.userId = user.userId;
        r.userEmail = user.email;
      }
      next();
    })
    .catch(() => next());
}

/** Lightning payouts only when explicitly enabled. */
export function requireLnPayoutsEnabled(_req: Request, res: Response, next: NextFunction) {
  if (process.env.ENABLE_LN_PAYOUTS !== 'true') {
    return res.status(403).json({
      error: 'Lightning payouts disabled',
      message: 'Set ENABLE_LN_PAYOUTS=true only after wallet ledger and spend limits are live.',
    });
  }
  next();
}
