import type { Express } from 'express';
import fs from 'fs';
import path from 'path';

/** Batch 20 — Pages & SEO (features 376-400) */

const SITEMAP_URLS = [
  { loc: 'https://tadbuy.giveabit.io/', changefreq: 'daily', priority: 1.0 },
  { loc: 'https://tadbuy.giveabit.io/marketplace', changefreq: 'hourly', priority: 0.9 },
  { loc: 'https://tadbuy.giveabit.io/health', changefreq: 'daily', priority: 0.5 },
  { loc: 'https://tadbuy.giveabit.io/changelog', changefreq: 'weekly', priority: 0.6 },
  { loc: 'https://tadbuy.giveabit.io/compare', changefreq: 'monthly', priority: 0.7 },
  { loc: 'https://tadbuy.giveabit.io/case-studies', changefreq: 'monthly', priority: 0.7 },
  { loc: 'https://tadbuy.giveabit.io/docs', changefreq: 'weekly', priority: 0.8 },
  { loc: 'https://tadbuy.giveabit.io/beta', changefreq: 'weekly', priority: 0.8 },
  { loc: 'https://tadbuy.giveabit.io/terms', changefreq: 'yearly', priority: 0.3 },
  { loc: 'https://tadbuy.giveabit.io/privacy', changefreq: 'yearly', priority: 0.3 },
];

export function registerBatch20Routes(app: Express) {
  app.get('/api/seo/sitemap', (_req, res) => {
    res.json({
      generatedAt: new Date().toISOString(),
      baseUrl: 'https://tadbuy.giveabit.io',
      urls: SITEMAP_URLS,
    });
  });

  app.get('/api/seo/changelog', (_req, res) => {
    const changelogPath = path.join(process.cwd(), 'CHANGELOG.md');
    try {
      if (fs.existsSync(changelogPath)) {
        const content = fs.readFileSync(changelogPath, 'utf-8');
        return res.json({ source: 'CHANGELOG.md', content });
      }
    } catch {
      // fall through to static
    }
    res.json({
      source: 'static',
      content: `# Changelog\n\n## [5.0.0-PLATINUM] — 2026-07-06\n\n350 enhancements shipped across batches 1–14.\n`,
    });
  });

  app.get('/api/openapi.json', (_req, res) => {
    res.json({
      openapi: '3.1.0',
      info: {
        title: 'Tadbuy API',
        version: '5.0.2',
        description: 'Bitcoin-native advertising platform API — Lightning, Fedimint, Nostr agents.',
        contact: { name: 'Give A Bit', url: 'https://giveabit.io' },
      },
      servers: [
        { url: 'https://api.giveabit.io', description: 'Production' },
        { url: 'http://127.0.0.1:3000', description: 'Local dev' },
      ],
      paths: {
        '/api/campaigns': {
          get: { summary: 'List campaigns', tags: ['Campaigns'] },
          post: { summary: 'Create campaign', tags: ['Campaigns'] },
        },
        '/api/marketplace/bids': {
          get: { summary: 'List marketplace bids', tags: ['Marketplace'] },
        },
        '/api/marketplace/slots/live': {
          get: { summary: 'Live slot inventory with auction state', tags: ['Marketplace'] },
        },
        '/api/lightning/invoice': {
          post: { summary: 'Create BOLT11 invoice', tags: ['Lightning'] },
        },
        '/api/trust/fees-transparent': {
          get: { summary: 'Transparent fee schedule', tags: ['Trust'] },
        },
        '/api/trust/ad-policy': {
          get: { summary: 'Advertising content policy', tags: ['Trust'] },
        },
        '/api/seo/sitemap': {
          get: { summary: 'Sitemap URL manifest', tags: ['SEO'] },
        },
      },
      components: {
        securitySchemes: {
          AgentApiKey: { type: 'apiKey', in: 'header', name: 'X-Agent-API-Key' },
          NostrNip98: { type: 'http', scheme: 'Nostr' },
        },
      },
    });
  });
}