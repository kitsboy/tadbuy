import type { Express } from 'express';

/** Batch 14 — Docs, polish, v5 release (features 326-350) */
export function registerBatch14Routes(app: Express) {
  app.get('/api/v5/release', (_req, res) => {
    res.json({
      version: 'v5.0.0-PLATINUM',
      releaseDate: '2026-07-06',
      totalEnhancements: 350,
      newInV5: 200,
      batches: [
        { id: 7, label: 'Premium Design System', items: '151-175' },
        { id: 8, label: 'Hooks, A11y & Performance', items: '176-200' },
        { id: 9, label: 'Analytics & Intelligence', items: '201-225' },
        { id: 10, label: 'Campaign Flow Excellence', items: '226-250' },
        { id: 11, label: 'Publisher & Marketplace', items: '251-275' },
        { id: 12, label: 'Wallet & Payments', items: '276-300' },
        { id: 13, label: 'API & Agent Tools', items: '301-325' },
        { id: 14, label: 'Docs & Platinum Polish', items: '326-350' },
      ],
      highlights: [
        'Full UI primitive library',
        '8 new React hooks',
        '5 analytics widgets',
        'Campaign wizard polish',
        'Wallet & payment UX',
        'Agent API v2 manifest',
      ],
    });
  });

  app.get('/api/v5/changelog', (_req, res) => {
    res.json({
      version: 'v5.0.0-PLATINUM',
      sections: {
        added: ['UI primitives', 'Analytics widgets', 'Perf/a11y hooks', 'Batch 7-14 APIs'],
        changed: ['Campaign wizard', 'Wallet', 'Marketplace', 'Metrics', 'Intelligence'],
        fixed: ['Modal escape key', 'favicon.svg restored', 'React 19 typing'],
      },
    });
  });

  app.get('/api/health/v5', (_req, res) => {
    res.json({
      ok: true,
      version: 'v5.0.0-PLATINUM',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });
}