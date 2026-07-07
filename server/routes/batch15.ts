import type { Express } from 'express';

/** Batch 15 — Foundation & ops (enhancements 1-10) */
export function registerBatch15Routes(app: Express) {
  app.get('/api/health/full', (_req, res) => {
    res.json({
      ok: true,
      version: process.env.npm_package_version ?? '5.0.2',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      services: { api: true, supabase: !!process.env.SUPABASE_URL, sentry: !!process.env.SENTRY_DSN },
    });
  });

  app.get('/api/feature-flags', (_req, res) => {
    res.json({
      lightningLive: !!process.env.UMBREL_LND_SOCKET,
      fedimintLive: !!process.env.FEDIMINT_GATEWAY_URL,
      demoPayments: !process.env.UMBREL_LND_SOCKET,
      staging: process.env.TADBUY_STAGING === 'true',
    });
  });

  app.get('/api/mempool/fees', async (_req, res) => {
    try {
      const r = await fetch('https://mempool.space/api/v1/fees/recommended');
      res.json(await r.json());
    } catch {
      res.json({ fastestFee: 5, halfHourFee: 4, hourFee: 3, economyFee: 2 });
    }
  });
}