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

  // NOTE (2026-09-16): the client no longer reads this route. Demo state is pinned
  // at build time by VITE_DEMO_PAYMENTS (src/components/payments/DemoModeBadge.tsx),
  // because a flag derived from an HTTP response meant the money UI's "demo" badge
  // could silently disappear. `demoPayments` below is NOT that condition (the honest
  // one is a wallet ledger + spend limits, per requireLnPayoutsEnabled) — do not
  // re-wire the client to it.
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