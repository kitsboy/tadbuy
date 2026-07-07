import type { Express } from 'express';
import {
  GEO_MARKETS,
  GEO_INSIGHTS,
  GEO_REGIONS,
  getGeoTotals,
  type GeoMarket,
  type GeoRegion,
} from '../../src/data/geoMarkets.ts';

/** Batch 24 — Geo Reach page APIs (features 1-20) */

const REGION_LABELS: Record<Exclude<GeoRegion, 'all'>, string> = {
  'north-america': 'North America',
  europe: 'Europe',
  apac: 'Asia-Pacific',
  latam: 'Latin America',
  africa: 'Africa',
  oceania: 'Oceania',
};

function buildRegionTrends() {
  const regions = GEO_REGIONS.filter((r): r is typeof GEO_REGIONS[number] & { id: Exclude<GeoRegion, 'all'> } => r.id !== 'all');
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return regions.map(region => {
    const markets = GEO_MARKETS.filter(m => m.region === region.id);
    const baseImpressions = markets.reduce((s, m) => s + m.impressions, 0) / 7;

    return {
      region: region.id,
      label: REGION_LABELS[region.id],
      icon: region.icon,
      totalImpressions: markets.reduce((s, m) => s + m.impressions, 0),
      trend: days.map((day, i) => ({
        day,
        impressions: Math.round(baseImpressions * (0.88 + i * 0.04 + (region.id.length % 3) * 0.02)),
      })),
    };
  });
}

function buildLanguageBreakdown() {
  const totals = new Map<string, { language: string; markets: number; impressions: number; clicks: number }>();
  const totalImpressions = GEO_MARKETS.reduce((s, m) => s + m.impressions, 0);

  for (const market of GEO_MARKETS) {
    for (const language of market.languages) {
      const entry = totals.get(language) ?? { language, markets: 0, impressions: 0, clicks: 0 };
      entry.markets += 1;
      entry.impressions += market.impressions;
      entry.clicks += market.clicks;
      totals.set(language, entry);
    }
  }

  return [...totals.values()]
    .map(row => ({
      ...row,
      sharePercent: totalImpressions > 0
        ? parseFloat(((row.impressions / totalImpressions) * 100).toFixed(1))
        : 0,
    }))
    .sort((a, b) => b.impressions - a.impressions);
}

export function registerBatch24Routes(app: Express) {
  app.get('/api/geo/page/stats', (_req, res) => {
    const totals = getGeoTotals(GEO_MARKETS);
    const topMarket = [...GEO_MARKETS].sort((a, b) => b.impressions - a.impressions)[0];

    res.json({
      ...totals,
      countries: GEO_MARKETS.length,
      spendUsd: GEO_MARKETS.reduce((s, m) => s + m.spendUsd, 0),
      avgCpmUsd: GEO_INSIGHTS.avgCpmUsd,
      topMarket,
      markets: GEO_MARKETS,
    });
  });

  app.get('/api/geo/page/insights', (_req, res) => {
    const spotlightMarket = GEO_MARKETS.find(m => m.code === GEO_INSIGHTS.spotlight) ?? null;
    const recommended = GEO_INSIGHTS.recommended
      .map(code => GEO_MARKETS.find(m => m.code === code))
      .filter((m): m is GeoMarket => Boolean(m));
    const underperforming = GEO_INSIGHTS.underperforming
      .map(code => GEO_MARKETS.find(m => m.code === code))
      .filter((m): m is GeoMarket => Boolean(m));

    res.json({
      ...GEO_INSIGHTS,
      spotlightMarket,
      recommended,
      underperforming,
      activeMarkets: GEO_MARKETS.filter(m => m.targeting === 'active').length,
      availableMarkets: GEO_MARKETS.filter(m => m.targeting === 'available').length,
    });
  });

  app.get('/api/geo/page/trends', (_req, res) => {
    res.json({
      period: '7d',
      regions: buildRegionTrends(),
    });
  });

  app.get('/api/geo/page/languages', (_req, res) => {
    res.json({
      totalLanguages: buildLanguageBreakdown().length,
      languages: buildLanguageBreakdown(),
    });
  });

  app.get('/api/geo/page/export', (_req, res) => {
    res.json({
      exportedAt: new Date().toISOString(),
      version: '1.0',
      count: GEO_MARKETS.length,
      insights: GEO_INSIGHTS,
      markets: GEO_MARKETS,
    });
  });

  app.post('/api/geo/page/target', (req, res) => {
    const codes = Array.isArray(req.body?.codes)
      ? req.body.codes.filter((c: unknown) => typeof c === 'string')
      : [];

    if (codes.length === 0) {
      return res.status(400).json({ error: 'codes (string[]) is required' });
    }

    const valid = codes.filter((code: string) => GEO_MARKETS.some(m => m.code === code));
    const invalid = codes.filter((code: string) => !GEO_MARKETS.some(m => m.code === code));

    res.json({
      success: true,
      targeted: valid,
      invalid,
      message: `Geo targeting updated for ${valid.length} market(s) (stub)`,
      timestamp: new Date().toISOString(),
    });
  });
}