import type { Request, Response, NextFunction } from 'express';

/**
 * NIP-98 HTTP Auth middleware.
 * Verifies Authorization header contains a valid Nostr HTTP auth event.
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
    const event = JSON.parse(eventJson);

    if (event.kind !== 27235) {
      return res.status(401).json({ error: 'NIP-98: Invalid event kind (expected 27235)' });
    }

    const createdAt = event.created_at;
    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - createdAt) > 60) {
      return res.status(401).json({ error: 'NIP-98: Event timestamp expired (>60s)' });
    }

    (req as Request & { nostrAuth?: { pubkey: string; event: unknown } }).nostrAuth = {
      pubkey: event.pubkey,
      event,
    };

    next();
  } catch {
    return res.status(401).json({ error: 'NIP-98: Invalid auth event encoding' });
  }
}