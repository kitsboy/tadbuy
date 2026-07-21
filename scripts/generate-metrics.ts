/**
 * Option A — live campaign counts from app state → public/metrics.json
 *
 * Counts campaigns, sats, impressions from src/data and writes the
 * gab.product-metrics.v1 envelope HQ polls at /metrics.json.
 *
 * Run: npm run generate-metrics
 * Also runs on prebuild so CF Pages deploys stay current.
 */
import fs from 'fs';
import path from 'path';
import { campaigns } from '../src/data/campaigns.ts';
import { MARKETPLACE_SLOTS } from '../src/data/marketplaceSlots.ts';
import { AD_PLATFORMS } from '../src/data/platforms.ts';
import { buildProductMetrics } from '../src/lib/metrics/productMetrics.ts';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'public', 'metrics.json');

function main() {
  const publisherCount = new Set(MARKETPLACE_SLOTS.map((s) => s.publisher)).size;

  const envelope = buildProductMetrics({
    campaigns,
    publisherCount,
    platformCatalogSize: AD_PLATFORMS.length,
  });

  fs.writeFileSync(OUT, JSON.stringify(envelope, null, 2) + '\n', 'utf-8');

  const kpi = (key: string) =>
    (envelope.kpis.find((k) => k.key === key)?.value as number | undefined) ?? 0;

  console.log('📊 public/metrics.json written from app state');
  console.log(`   campaigns_total:     ${kpi('campaigns_total')}`);
  console.log(`   campaigns_active:    ${kpi('campaigns_active')}`);
  console.log(`   sats_processed:      ${kpi('sats_processed_total')}`);
  console.log(`   impressions:         ${kpi('impressions_delivered')}`);
  console.log(`   clicks:              ${kpi('clicks_delivered')}`);
  console.log(`   active_publishers:   ${kpi('active_publishers')}`);
  console.log(`   active_platforms:    ${kpi('active_platforms')}`);
  console.log(`   source:              ${envelope.raw.source}`);
}

main();
