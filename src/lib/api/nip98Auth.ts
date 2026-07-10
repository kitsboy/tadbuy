import type { Request, Response, NextFunction } from 'express';

/**
 * NIP-98 HTTP Auth middleware.
 * Validates structure, timestamp, method/URL tags, and (when available) event shape.
 * Full schnorr verification requires a Nostr crypto lib — until then we reject in
 * production unless NIP98_ALLOW_UNVERIFIED=true is set for staging only.
 * @see https://github.com/nostr-protocol/nips/blob/master/98.md
 */
export function nip98AuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;

  if (!auth) {
    return res.status(401).json({ error: 'NIP-98: Missing Authorization header' });
  }

  if (!auth.startsWith('Nostr ')) {
    return res.status(401).json({ error: 'NIP-98: Expected "Nostr <base64-event>" format' });
  }

  try {
    const eventB64 = auth.slice(6);
    const eventJson = Buffer.from(eventB64, 'base64').toString('utf-8');
    const event = JSON.parse(eventJson) as {
      kind?: number;
      created_at?: number;
      pubkey?: string;
      id?: string;
      sig?: string;
      tags?: string[][];
    };

    if (event.kind !== 27235) {
      return res.status(401).json({ error: 'NIP-98: Invalid event kind (expected 27235)' });
    }

    if (!event.pubkey || typeof event.pubkey !== 'string' || event.pubkey.length < 32) {
      return res.status(401).json({ error: 'NIP-98: Missing pubkey' });
    }

    if (!event.sig || typeof event.sig !== 'string' || event.sig.length < 64) {
      return res.status(401).json({ error: 'NIP-98: Missing signature' });
    }

    const createdAt = event.created_at;
    const now = Math.floor(Date.now() / 1000);
    if (typeof createdAt !== 'number' || Math.abs(now - createdAt) > 60) {
      return res.status(401).json({ error: 'NIP-98: Event timestamp expired (>60s)' });
    }

    // Bind to method + absolute URL when tags present
    const tags = Array.isArray(event.tags) ? event.tags : [];
    const methodTag = tags.find((t) => t[0] === 'method');
    const uTag = tags.find((t) => t[0] === 'u');
    if (methodTag && methodTag[1] && methodTag[1].toUpperCase() !== req.method.toUpperCase()) {
      return res.status(401).json({ error: 'NIP-98: method tag mismatch' });
    }
    if (uTag && uTag[1]) {
      const expected = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
      // Allow path-only match to reduce proxy host false negatives
      const pathOnly = req.originalUrl;
      if (uTag[1] !== expected && !uTag[1].endsWith(pathOnly)) {
        return res.status(401).json({ error: 'NIP-98: u tag URL mismatch' });
      }
    }

    // Without schnorr verify this is incomplete — refuse in production by default
    const allowUnverified =
      process.env.NIP98_ALLOW_UNVERIFIED === 'true' ||
      process.env.NODE_ENV !== 'production';
    if (!allowUnverified) {
      return res.status(501).json({
        error: 'NIP-98: Full signature verification not configured',
        message: 'Enable a Nostr crypto verifier or set NIP98_ALLOW_UNVERIFIED for staging only',
      });
    }

    (req as Request & { nostrAuth?: { pubkey: string; event: unknown; verified: boolean } }).nostrAuth = {
      pubkey: event.pubkey,
      event,
      verified: false,
    };

    next();
  } catch {
    return res.status(401).json({ error: 'NIP-98: Invalid auth event encoding' });
  }
}