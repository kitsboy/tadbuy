import crypto from 'node:crypto';
import type { NextFunction, Request, RequestHandler, Response } from 'express';

export type RequestWithId = Request & { requestId?: string };

const REQUEST_ID_PATTERN = /^[a-zA-Z0-9._:-]{8,128}$/;

/** Attach a bounded correlation id to every request and response. */
export function requestIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  const supplied = req.header('x-request-id');
  const requestId = supplied && REQUEST_ID_PATTERN.test(supplied)
    ? supplied
    : crypto.randomUUID();
  (req as RequestWithId).requestId = requestId;
  res.setHeader('X-Request-ID', requestId);
  next();
}

/** Keep externally visible errors stable while retaining server-side details in logs. */
export function redactError(error: unknown): string {
  if (error instanceof Error && error.name === 'AbortError') return 'Request timed out';
  return 'Internal Server Error';
}

/** Add an abort signal to outbound requests so an upstream cannot hang a route forever. */
export function withTimeout(init: RequestInit = {}, timeoutMs = 5_000): RequestInit {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  controller.signal.addEventListener('abort', () => clearTimeout(timer), { once: true });
  return { ...init, signal: init.signal ?? controller.signal };
}

/** Validate an idempotency key before it is used as an in-memory map key. */
export function getIdempotencyKey(req: Request): string | null {
  const key = req.header('idempotency-key')?.trim();
  return key && key.length >= 8 && key.length <= 128 ? key : null;
}

export function getRequestFingerprint(req: Request): string {
  return crypto.createHash('sha256').update(JSON.stringify(req.body ?? {})).digest('hex');
}

/** Stable replay key for signed/webhook-style requests without logging the payload. */
export function getReplayKey(req: Request): string {
  const supplied = req.header('x-webhook-id')?.trim();
  if (supplied && supplied.length <= 128) return supplied;
  return crypto.createHash('sha256').update(JSON.stringify(req.body ?? {})).digest('hex');
}

export function rememberWithTtl(store: Map<string, number>, key: string, ttlMs: number): boolean {
  const now = Date.now();
  for (const [storedKey, expiresAt] of store) {
    if (expiresAt <= now) store.delete(storedKey);
  }
  if (store.has(key)) return false;
  store.set(key, now + ttlMs);
  return true;
}

/** A small request logger that intentionally excludes authorization, cookies, and bodies. */
export const requestLogger: RequestHandler = (req, res, next) => {
  const started = Date.now();
  res.on('finish', () => {
    const requestId = (req as RequestWithId).requestId ?? '-';
    console.info(`[http] ${requestId} ${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - started}ms`);
  });
  next();
};
