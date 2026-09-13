import type { Express } from 'express';
import { requireAuth } from '../../src/lib/api/userAuth.ts';

const staged = (message: string) => ({
  demo: true,
  supported: false,
  status: 'staged' as const,
  message,
});

export function registerBatch3Routes(app: Express) {
  // Publisher & Integrations (features 51-75)

  app.post('/api/v3/creative/detect-language', requireAuth, (req, res) => {
    const text = typeof req.body?.text === 'string' ? req.body.text.slice(0, 10_000) : '';
    const isArabic = /[\u0600-\u06FF]/.test(text);
    res.json({ demo: true, supported: false, language: isArabic ? 'ar' : 'en', rtl: isArabic, confidence: 0.92, message: 'Language detection is staged; connect the localization service for production confidence.' });
  });

  app.post('/api/v3/creative/tts', requireAuth, (_req, res) => {
    res.status(501).json(staged('TTS generation requires a configured voice provider.'));
  });

  app.post('/api/v3/creative/video', requireAuth, (_req, res) => {
    res.status(501).json(staged('Video processing requires a configured media worker.'));
  });

  app.get('/api/v3/creative/formats', (_req, res) => {
    res.json({ formats: ['carousel', 'story', 'reels', 'banner', 'native'], presets: { instagram: 'story', tiktok: 'reels', twitter: 'carousel' } });
  });

  app.post('/api/v3/nostr/kind-targeting', requireAuth, (req, res) => {
    const kinds = Array.isArray(req.body?.kinds) ? req.body.kinds.slice(0, 20) : [1, 6, 7];
    res.json({ demo: true, supported: false, kinds, reach: null, message: 'Reach estimates are staged until relay data is connected.' });
  });

  app.post('/api/v3/nostr/zap-pricing', requireAuth, (_req, res) => {
    res.status(501).json(staged('Zap pricing requires relay and payment data.'));
  });

  app.post('/api/v3/nostr/creator-split', requireAuth, (_req, res) => {
    res.status(501).json(staged('Creator splits require a configured payout ledger.'));
  });

  app.get('/api/v3/publisher/ledger', requireAuth, (_req, res) => {
    res.json({ demo: true, supported: false, entries: [], transparent: false, message: 'Publisher ledger is staged until settlement persistence is connected.' });
  });

  app.post('/api/v3/publisher/payout', requireAuth, (_req, res) => {
    res.status(501).json(staged('Publisher payouts require the wallet ledger and enabled payout rail.'));
  });

  app.get('/api/v3/settlements/export', requireAuth, (_req, res) => {
    res.status(501).json(staged('Settlement export is unavailable until persisted settlement history is connected.'));
  });

  app.get('/api/v3/tax/export', requireAuth, (_req, res) => {
    res.status(501).json(staged('Tax export requires verified settlement records.'));
  });

  app.get('/api/v3/teams', requireAuth, (_req, res) => {
    res.json({ demo: true, supported: false, members: [], rbac: ['admin', 'editor', 'viewer'], message: 'Teams are staged until organization membership storage is connected.' });
  });

  app.post('/api/v3/campaigns/approve', requireAuth, (_req, res) => {
    res.status(501).json(staged('Campaign approval requires organization roles and persisted workflow state.'));
  });

  app.get('/api/v3/whitelabel', requireAuth, (_req, res) => {
    res.json({ enabled: false, supported: false, domain: null, branding: { logo: null, colors: null }, message: 'White-labeling is not enabled.' });
  });

  app.post('/api/v3/embed/domain', requireAuth, (_req, res) => {
    res.status(501).json(staged('Domain verification requires DNS challenge persistence.'));
  });

  app.get('/api/v3/sdk/info', (_req, res) => {
    res.json({ package: '@tadbuy/embed', version: '1.0.0', cdn: 'https://tadbuy.giveabit.io/tadbuy.js', supported: true });
  });

  app.get('/api/v3/integrations/wordpress', (_req, res) => {
    res.json({ supported: false, plugin: null, message: 'The WordPress integration is staged.' });
  });

  app.get('/api/v3/integrations/shopify', (_req, res) => {
    res.json({ supported: false, app: null, message: 'The Shopify integration is staged.' });
  });

  app.post('/api/v3/webhooks/subscribe', requireAuth, (_req, res) => {
    res.status(501).json(staged('Webhook delivery requires persisted subscriptions and signed delivery workers.'));
  });

  app.post('/api/v3/graphql', requireAuth, (_req, res) => {
    res.status(501).json(staged('GraphQL is documented but not enabled on this deployment.'));
  });

  app.get('/api/v3/openapi.json', (_req, res) => {
    res.json({
      openapi: '3.1.0',
      info: { title: 'Tadbuy API', version: '5.0.161' },
      paths: {
        '/api/campaigns': { get: { summary: 'List caller-owned campaigns' }, post: { summary: 'Create a draft campaign' } },
        '/api/fedimint/pay': { post: { summary: 'Staged Fedimint ecash payment' } },
        '/api/metrics': { get: { summary: 'Platform metrics' } },
      },
    });
  });

  app.get('/api/v3/rate-limits', (_req, res) => {
    res.json({ limits: { default: 200, strict: 15, agent: 1000 }, window: '15m' });
  });
}
