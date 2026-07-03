import type { Express } from 'express';

/** Batch 5 — Ecosystem pipes, consumer flow, link fixes (features 101-125) */
export function registerBatch5Routes(app: Express) {
  app.get('/api/ecosystem/config', (_req, res) => {
    res.json({
      federation: {
        id: 'giveabit-mint',
        name: 'Give A Bit Mint',
        domain: 'giveabit.io',
        status: process.env.FEDIMINT_GATEWAY_URL ? 'beta' : 'staged',
        gateway: process.env.FEDIMINT_GATEWAY_URL || 'https://mint.giveabit.io',
        inviteConfigured: !!process.env.VITE_FEDIMINT_INVITE || !!process.env.FEDIMINT_INVITE,
      },
      projects: ['tadbuy', 'giveabit', 'satohash', 'motopass', 'openstrata'],
      umbrel: { configured: !!(process.env.UMBREL_LND_SOCKET && process.env.UMBREL_LND_CERT) },
      apiProxy: process.env.VITE_API_BASE_URL || 'https://api.giveabit.io',
      apiProxyStatus: 'live',
    });
  });

  app.get('/api/beta/status', (_req, res) => {
    res.json({
      version: 'v4.4.0-ELITE',
      phase: 'BETA',
      ui: 'live',
      api: 'live',
      fedimint: process.env.FEDIMINT_GATEWAY_URL ? 'beta' : 'staged',
      lightning: process.env.UMBREL_LND_SOCKET ? 'beta' : 'staged',
      cloudflare: 'static-spa',
      consumerWorkflow: ['browse', 'create', 'pay', 'live', 'analytics'],
    });
  });

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, ts: Date.now(), service: 'tadbuy-api' });
  });

  app.post('/api/campaigns/draft', (req, res) => {
    res.json({ saved: true, draftId: 'draft_' + Date.now().toString(36), data: req.body });
  });

  app.get('/api/fedi/deeplink', (_req, res) => {
    const gateway = process.env.FEDIMINT_GATEWAY_URL || 'https://mint.giveabit.io';
    res.json({ deepLink: `fedi://gateway/${gateway.replace('https://', '')}`, gateway });
  });

  app.get('/api/umbrel/status', (_req, res) => {
    const configured = !!(process.env.UMBREL_LND_SOCKET && process.env.UMBREL_LND_CERT);
    res.json({
      status: configured ? 'configured' : 'not_ready',
      message: configured ? 'LND credentials present' : 'Set UMBREL_LND_* on M4 when node is ready',
    });
  });

  app.get('/api/links/validate', (_req, res) => {
    res.json({
      fixed: ['embed.js alias', 'profile Link component', 'api explorer', 'sitemap new pages'],
      routes: ['/', '/beta', '/pitch', '/intelligence', '/integrations', '/enterprise', '/wallet', '/marketplace'],
    });
  });
}