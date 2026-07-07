import type { Express } from 'express';

/** Batch 9 — Analytics & intelligence widgets (features 201-225) */
export function registerBatch9Routes(app: Express) {
  app.get('/api/v3/analytics/funnel', (_req, res) => {
    res.json({
      steps: [
        { name: 'Visit', count: 12400, dropoff: 0 },
        { name: 'Configure', count: 5200, dropoff: 58 },
        { name: 'Pay', count: 2100, dropoff: 60 },
        { name: 'Live', count: 1920, dropoff: 9 },
      ],
      alert: 'High dropoff at Configure → Pay — consider simplifying payment step',
    });
  });

  app.get('/api/v3/analytics/retention', (_req, res) => {
    res.json({
      cohorts: [
        { week: 'W1', retention: [100, 72, 58, 45, 38] },
        { week: 'W2', retention: [100, 75, 61, 48, 41] },
        { week: 'W3', retention: [100, 68, 52, 40, 34] },
        { week: 'W4', retention: [100, 78, 64, 51, 44] },
      ],
    });
  });

  app.get('/api/v3/analytics/geo', (_req, res) => {
    res.json({
      regions: [
        { code: 'US', name: 'United States', intensity: 0.92, impressions: 520000 },
        { code: 'GB', name: 'United Kingdom', intensity: 0.68, impressions: 180000 },
        { code: 'DE', name: 'Germany', intensity: 0.55, impressions: 142000 },
        { code: 'SV', name: 'El Salvador', intensity: 0.78, impressions: 95000 },
        { code: 'NG', name: 'Nigeria', intensity: 0.48, impressions: 88000 },
        { code: 'JP', name: 'Japan', intensity: 0.42, impressions: 72000 },
        { code: 'BR', name: 'Brazil', intensity: 0.38, impressions: 64000 },
        { code: 'CA', name: 'Canada', intensity: 0.52, impressions: 110000 },
      ],
    });
  });

  app.get('/api/v3/analytics/platforms', (_req, res) => {
    res.json({
      platforms: [
        { id: 'twitter', name: 'Twitter/X', spendSats: 1_240_000, impressions: 420000, ctr: 10.4, share: 32 },
        { id: 'nostr', name: 'Nostr', spendSats: 980_000, impressions: 380000, ctr: 8.0, share: 26 },
        { id: 'facebook', name: 'Facebook', spendSats: 720_000, impressions: 290000, ctr: 2.1, share: 20 },
        { id: 'youtube', name: 'YouTube', spendSats: 540_000, impressions: 180000, ctr: 0.18, share: 14 },
        { id: 'reddit', name: 'Reddit', spendSats: 320_000, impressions: 95000, ctr: 3.4, share: 8 },
      ],
    });
  });

  app.get('/api/v3/analytics/forecast', (_req, res) => {
    res.json({
      points: [
        { month: 'Jan', actual: 2_800_000, forecast: 2_750_000 },
        { month: 'Feb', actual: 3_100_000, forecast: 3_050_000 },
        { month: 'Mar', actual: 3_400_000, forecast: 3_350_000 },
        { month: 'Apr', forecast: 3_720_000 },
        { month: 'May', forecast: 4_100_000 },
        { month: 'Jun', forecast: 4_580_000 },
      ],
      growth: 18.4,
      confidence: 87,
      currency: 'sats',
    });
  });

  app.get('/api/v3/analytics/summary', (_req, res) => {
    res.json({
      impressions: 1_240_000,
      clicks: 14_820,
      ctr: 1.2,
      spendSats: 4_230_000,
      conversions: 842,
      roas: 4.2,
    });
  });
}