import type { Express } from 'express';

/** Batch 6 — Agent automation, onboarding, pipes (features 126-150) */
export function registerBatch6Routes(app: Express) {
  app.get('/api/agent/manifest', (_req, res) => {
    res.json({
      project: 'tadbuy',
      version: 'v4.4.0-ELITE',
      phase: 'BETA',
      docs: {
        ai_context: 'docs/.ai_docs/context_map.md',
        beta: 'docs/BETA.md',
        setup: 'docs/SETUP-GUIDE.md',
        m4_ref: 'docs/M4-SERVER-REF.md',
        kimi_checklist: 'docs/KIMI-M4-SETUP-CHECKLIST.md',
        ecosystem: 'docs/ECOSYSTEM.md',
        fedimint: 'docs/FEDIMINT.md',
      },
      automatable: [
        'sync-docs on build',
        'campaign create via /api/agent/campaigns',
        'fedimint pay via /api/fedimint/pay',
        'metrics via /api/metrics',
      ],
      requiresM4: ['fedimint mint', 'umbrel lnd', 'api proxy'],
    });
  });

  app.post('/api/onboarding/complete', (req, res) => {
    res.json({ step: req.body.step || 'welcome', completed: true, next: '/marketplace' });
  });

  app.get('/api/checkout/readiness', (_req, res) => {
    res.json({
      ready: false,
      blockers: [
        ...(process.env.FEDIMINT_GATEWAY_URL ? [] : ['Fedimint gateway not on M4']),
        ...(process.env.UMBREL_LND_SOCKET ? [] : ['Umbrel LND not configured']),
      ],
      canDemo: true,
      message: 'UI fully functional — payments in demo until M4 connected',
    });
  });

  app.post('/api/webhooks/test', (_req, res) => {
    res.json({ delivered: true, event: 'test.ping', ts: Date.now() });
  });

  app.get('/api/cross-project/mint', (_req, res) => {
    res.json({
      sharedMint: 'giveabit-mint',
      projects: [
        { id: 'tadbuy', url: 'https://tadbuy.giveabit.io' },
        { id: 'satohash', url: 'https://satohash.giveabit.io' },
        { id: 'giveabit', url: 'https://giveabit.io' },
        { id: 'motopass', url: 'https://motopass.giveabit.io' },
        { id: 'openstrata', url: 'https://openstrata.giveabit.io' },
      ],
    });
  });
}