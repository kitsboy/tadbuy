/**
 * Build gab.product-metrics.v1 envelope from illustrative app campaign state.
 * Used by scripts/generate-metrics.ts (writes public/metrics.json for HQ / CF Pages).
 * The values are not live campaign, settlement, publisher, or uptime records.
 * Secret-free only — no keys, PII, or macaroons.
 */
import type { Campaign } from '../db/types';

export const PRODUCT_METRICS_SCHEMA = 'gab.product-metrics.v1' as const;

const PLATFORM_LABELS: Record<string, string> = {
  twitter: 'Twitter/X',
  facebook: 'Facebook',
  instagram: 'Instagram',
  youtube: 'YouTube',
  reddit: 'Reddit',
  linkedin: 'LinkedIn',
  tiktok: 'TikTok',
  nostr: 'Nostr',
};

export interface MetricsBuildInput {
  campaigns: Campaign[];
  /** Unique publisher names from marketplace inventory */
  publisherCount: number;
  /** Platform catalog size (e.g. AD_PLATFORMS.length) */
  platformCatalogSize: number;
  now?: Date;
}

export interface ProductMetricsEnvelope {
  schema: typeof PRODUCT_METRICS_SCHEMA;
  productId: string;
  name: string;
  updatedAt: string;
  window: { label: string; from: string; to: string };
  health: {
    status: 'green' | 'amber' | 'red';
    message: string;
    latencyMs: number;
    uptimePct24h: number;
    dependencies: Array<{ id: string; status: string; detail: string }>;
  };
  kpis: Array<Record<string, unknown>>;
  series: Array<Record<string, unknown>>;
  funnels: Array<Record<string, unknown>>;
  segments: Array<Record<string, unknown>>;
  offers: Array<Record<string, unknown>>;
  education: Array<Record<string, unknown>>;
  links: Array<{ label: string; url: string }>;
  raw: Record<string, unknown>;
  coverage?: Record<string, unknown>;
}

function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function noonIso(day: string): string {
  return `${day}T12:00:00.000Z`;
}

/** Aggregate platform spend/impressions (budget split evenly across campaign platforms). */
function platformBreakdown(campaigns: Campaign[]) {
  const map = new Map<string, { sats: number; impressions: number; clicks: number }>();

  for (const c of campaigns) {
    const platforms = c.platforms?.length ? c.platforms : ['unknown'];
    const share = 1 / platforms.length;
    const sats = (c.budgetSats || 0) * share;
    const impressions = (c.impressions || 0) * share;
    const clicks = (c.clicks || 0) * share;
    for (const p of platforms) {
      const cur = map.get(p) ?? { sats: 0, impressions: 0, clicks: 0 };
      cur.sats += sats;
      cur.impressions += impressions;
      cur.clicks += clicks;
      map.set(p, cur);
    }
  }

  const totalSats = [...map.values()].reduce((s, r) => s + r.sats, 0) || 1;
  const rows = [...map.entries()]
    .map(([id, r]) => {
      const ctr = r.impressions > 0 ? (r.clicks / r.impressions) * 100 : 0;
      return {
        id,
        label: PLATFORM_LABELS[id] ?? id,
        value: Math.round(r.sats),
        meta: {
          impressions: Math.round(r.impressions),
          ctr: parseFloat(ctr.toFixed(2)),
          share_pct: Math.round((r.sats / totalSats) * 100),
        },
      };
    })
    .sort((a, b) => b.value - a.value);

  return rows;
}

/** Build N-day series from campaign createdAt + totals attributed to create day. */
function buildSeries(campaigns: Campaign[], now: Date, days: number) {
  const pointsImpr: Array<{ t: string; v: number }> = [];
  const pointsSats: Array<{ t: string; v: number }> = [];
  const pointsCamp: Array<{ t: string; v: number }> = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    const key = dayKey(d);
    const dayCampaigns = campaigns.filter((c) => dayKey(new Date(c.createdAt)) === key);
    pointsCamp.push({ t: noonIso(key), v: dayCampaigns.length });
    pointsImpr.push({
      t: noonIso(key),
      v: dayCampaigns.reduce((s, c) => s + (c.impressions || 0), 0),
    });
    pointsSats.push({
      t: noonIso(key),
      v: dayCampaigns.reduce((s, c) => s + (c.budgetSats || 0), 0),
    });
  }

  return { pointsImpr, pointsSats, pointsCamp };
}

/**
 * Count illustrative campaigns, budgets, and performance values for the HQ envelope.
 */
export function buildProductMetrics(input: MetricsBuildInput): ProductMetricsEnvelope {
  const now = input.now ?? new Date();
  const campaigns = input.campaigns;
  const windowDays = 30;
  const seriesDays = 15;
  const from = new Date(now.getTime() - windowDays * 86400000);

  const live = campaigns.filter((c) => c.status === 'live');
  const completed = campaigns.filter((c) => c.status === 'completed');
  const draft = campaigns.filter((c) => c.status === 'draft');
  const funded = campaigns.filter((c) => c.status !== 'draft');

  const impressions = campaigns.reduce((s, c) => s + (c.impressions || 0), 0);
  const clicks = campaigns.reduce((s, c) => s + (c.clicks || 0), 0);
  const satsTotal = campaigns.reduce((s, c) => s + (c.budgetSats || 0), 0);
  const sats30d = campaigns
    .filter((c) => new Date(c.createdAt).getTime() >= from.getTime())
    .reduce((s, c) => s + (c.budgetSats || 0), 0);

  const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
  const avgCpm = impressions > 0 ? Math.round((satsTotal / impressions) * 1000) : 0;

  const activePlatforms = new Set(
    campaigns.flatMap((c) => c.platforms ?? [])
  ).size || input.platformCatalogSize;

  const { pointsImpr, pointsSats, pointsCamp } = buildSeries(campaigns, now, seriesDays);
  const platformRows = platformBreakdown(campaigns);

  return {
    schema: PRODUCT_METRICS_SCHEMA,
    productId: 'tadbuy',
    name: 'Tadbuy',
    updatedAt: now.toISOString(),
    window: {
      label: '30d',
      from: from.toISOString(),
      to: now.toISOString(),
    },
    health: {
      status: 'amber',
      message:
        'Illustrative app-state metrics only. Service health is not measured; zero values below are unavailable placeholders, not measurements.',
      latencyMs: 0,
      uptimePct24h: 0,
      dependencies: [
        {
          id: 'cloudflare-pages',
          status: 'amber',
          detail: 'Hosting is configured separately; this build does not measure origin availability.',
        },
        {
          id: 'app-state',
          status: 'amber',
          detail: `Illustrative seed data for ${campaigns.length} campaigns from src/data; not live activity.`,
        },
        {
          id: 'satohash',
          status: 'amber',
          detail: 'No live Tadbuy campaign receipt integration is connected.',
        },
        {
          id: 'lnbits',
          status: 'amber',
          detail: 'No Tadbuy campaign payment or settlement integration is connected.',
        },
      ],
    },
    kpis: [
      {
        key: 'campaigns_total',
        label: 'Example campaign records',
        value: campaigns.length,
        unit: 'campaigns',
        format: 'number',
        priority: 1,
        hint: 'Illustrative seed campaigns in app state; not live or approved campaigns.',
      },
      {
        key: 'campaigns_active',
        label: 'Example live-labelled records',
        value: live.length,
        unit: 'campaigns',
        format: 'number',
        priority: 1,
        hint: 'Seed records labelled live; this build does not activate campaigns.',
      },
      {
        key: 'sats_processed_total',
        label: 'Example campaign budget (sats)',
        value: satsTotal,
        unit: 'sats',
        format: 'sats',
        priority: 1,
        hint: 'Sum of illustrative seed budget values; no sats were processed or settled.',
      },
      {
        key: 'sats_processed_30d',
        label: 'Example 30-day budget (sats)',
        value: sats30d,
        unit: 'sats',
        format: 'sats',
        priority: 1,
        hint: 'Illustrative seed budget values by sample creation date; no sats were processed.',
      },
      {
        key: 'impressions_delivered',
        label: 'Example impressions (unverified)',
        value: impressions,
        unit: 'impressions',
        format: 'number',
        priority: 2,
        hint: 'Illustrative seed values only; no publisher delivery or impression measurement is connected.',
      },
      {
        key: 'clicks_delivered',
        label: 'Example clicks (unverified)',
        value: clicks,
        unit: 'clicks',
        format: 'number',
        priority: 2,
        hint: 'Illustrative seed values only; no campaign click measurement is connected.',
      },
      {
        key: 'ctr_pct',
        label: 'Example CTR (unverified)',
        value: parseFloat(ctr.toFixed(2)),
        unit: '%',
        format: 'percent',
        priority: 2,
        hint: 'Derived from illustrative seed values; not measured campaign performance.',
      },
      {
        key: 'active_publishers',
        label: 'Publisher types in demo inventory',
        value: input.publisherCount,
        unit: 'types',
        format: 'number',
        priority: 3,
        hint: 'Distinct publisher descriptions in the demo marketplace catalog. No external publisher has listed inventory with Tadbuy.',
      },
      {
        key: 'active_platforms',
        label: 'Platforms in sample catalog',
        value: activePlatforms,
        unit: 'platforms',
        format: 'number',
        priority: 3,
        hint: 'Number of entries in the illustrative platform catalog; not active integrations.',
      },
      {
        key: 'avg_cpm_sats',
        label: 'Example CPM (sats)',
        value: avgCpm,
        unit: 'sats',
        format: 'sats',
        priority: 3,
        hint: 'Derived from illustrative seed values; not a measured price or quote.',
      },
      {
        key: 'campaigns_completed',
        label: 'Example completed campaigns',
        value: completed.length,
        unit: 'campaigns',
        format: 'number',
        priority: 2,
        hint: 'Seed records labelled completed; no campaign flight ran in this preview.',
      },
    ],
    series: [
      {
        key: 'impressions_daily',
        label: 'Example impressions / day',
        unit: 'impressions',
        color: '#ff9f1c',
        points: pointsImpr,
      },
      {
        key: 'sats_daily',
        label: 'Example budget / day (sats)',
        unit: 'sats',
        color: '#f7931a',
        points: pointsSats,
      },
      {
        key: 'campaigns_daily',
        label: 'Example campaign records / day',
        unit: 'campaigns',
        color: '#e879f9',
        points: pointsCamp,
      },
    ],
    funnels: [
      {
        id: 'campaign_funnel',
        label: 'Example campaign lifecycle (not operational)',
        steps: [
          {
            id: 'created',
            label: 'Example records',
            count: campaigns.length,
            hint: 'Illustrative campaign objects in app state.',
          },
          {
            id: 'funded',
            label: 'Non-draft examples',
            count: funded.length,
            hint: 'Seed status only; no payment or readiness is implied.',
          },
          {
            id: 'running',
            label: 'Example live-labelled records',
            count: live.length,
            hint: 'Seed status only; this build has no active delivery.',
          },
          {
            id: 'completed',
            label: 'Example completed records',
            count: completed.length,
            hint: 'Seed status only; no flight completion is verified.',
          },
        ],
      },
    ],
    segments: [
      {
        id: 'platform_breakdown',
        label: 'Example platform breakdown (sats)',
        rows: platformRows,
      },
    ],
    offers: [
      {
        id: 'btc_ads',
        title: 'Bitcoin-native ad buys',
        for: ['katoa', 'giveabit'],
        status: 'planned',
        endpoint: 'https://tadbuy.giveabit.io/buy',
        hint: 'Bitcoin and Lightning are design goals; Tadbuy does not accept campaign payments in this preview.',
      },
      {
        id: 'ots_receipt',
        title: 'Campaign OTS receipts',
        for: ['satohash'],
        status: 'planned',
        hint: 'Receipt integration is not connected to Tadbuy campaigns in this preview.',
      },
      {
        id: 'metrics_v1',
        title: 'Product metrics v1',
        for: ['hq'],
        status: 'beta',
        endpoint: 'GET /metrics.json',
        hint: 'Build-generated illustrative data only; not a live campaign or settlement feed.',
      },
    ],
    education: [
      {
        id: 'mold_gmv',
        title: 'Example budget is not GMV',
        body: `${satsTotal.toLocaleString()} example budget sats across ${campaigns.length} illustrative campaign records; no funds were processed.`,
        action: 'Only report GMV from reconciled payment and ledger records.',
        opportunity: 'opportunity',
      },
      {
        id: 'mold_funnel',
        title: 'Sample status labels',
        body: `${funded.length} non-draft, ${live.length} live-labelled, and ${draft.length} draft seed records; no activation occurred.`,
        action: 'Use approved backend lifecycle events when a real service is authorized.',
        opportunity: 'plan',
      },
      {
        id: 'mold_ctr',
        title: 'Example CTR is not measured',
        body: `${ctr.toFixed(2)}% derived from illustrative seed values, not delivered campaign traffic.`,
        action: 'Only publish CTR with attributable publisher or provider evidence.',
        opportunity: 'info',
      },
    ],
    links: [
      { label: 'Tadbuy', url: 'https://tadbuy.giveabit.io' },
      { label: 'Buy ads', url: 'https://tadbuy.giveabit.io/buy' },
      {
        label: 'Schema',
        url: 'https://hq.giveabit.io/schemas/product-metrics.v1.schema.json',
      },
    ],
    raw: {
      demo: true,
      source: 'illustrative-app-state',
      enriched: true,
      schemaDepth: 'full-v1',
      umamiWebsiteId: 'e75632e3-b6f4-4fa3-9ec5-8b3107adf783',
      campaignsInState: campaigns.length,
      note:
        'All campaign, budget, impression, click, and platform values come from illustrative seed data in src/data; they do not represent live orders, settlement, delivery, or publisher activity. Rebuild via npm run generate-metrics (prebuild). Replace this generator only after an approved live source and verified metric provenance are available.',
    },
  };
}
