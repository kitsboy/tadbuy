import assert from 'node:assert/strict';
import test from 'node:test';
import { paymentPlug } from './src/lib/payment-plug.mjs';
import { campaigns } from './src/data/campaigns.ts';
import { MARKETPLACE_SLOTS } from './src/data/marketplaceSlots.ts';
import { AD_PLATFORMS } from './src/data/platforms.ts';
import { buildProductMetrics } from './src/lib/metrics/productMetrics.ts';
import {
  assertUniqueIncomeStreams,
  createFakePlug,
  paymentLabel,
  referenceCodeFor,
} from './src/lib/family-payment-core.mjs';

test('Tadbuy exports only its demo payment plug', () => {
  assert.equal(paymentPlug.site, 'tadbuy');
  assert.equal(paymentPlug.mode, 'demo');
  assert.equal(paymentPlug.walletId, 'tadbuy');
  assert.equal(paymentPlug.utxoSet, 'utxo:tadbuy');
});

test('family income streams use unique prefixes, wallets, and UTXO sets', () => {
  assert.doesNotThrow(() => assertUniqueIncomeStreams());
});

test('reference codes and labels are explicitly demo-labelled by default', () => {
  assert.equal(referenceCodeFor({ site: 'tadbuy', kind: 'gift', seq: 7 }), 'tb-g-000007-demo');
  assert.equal(paymentLabel({ site: 'tadbuy', kind: 'gift', seq: 7 }), 'TADBUY-DEMO tb-g-000007-demo');
  assert.throws(() => referenceCodeFor({ site: 'unknown-service' }), /Unknown site/);
});

test('Tadbuy fake intents remain pending demo records and reject invalid amounts', async () => {
  const plug = createFakePlug('tadbuy');

  await assert.rejects(() => plug.createIntent({ amountSats: 0 }), /positive integer/);
  await assert.rejects(() => plug.createIntent({ amountSats: 1.5 }), /positive integer/);

  const intent = await plug.createIntent({
    amountSats: 2500,
    memo: 'test campaign',
    metadata: { mode: 'live', site: 'giveabit' },
  });

  assert.equal(plug.mode, 'demo');
  assert.equal(intent.state, 'pending');
  assert.equal(intent.metadata.mode, 'demo');
  assert.equal(intent.metadata.site, 'tadbuy');
  assert.match(intent.id, /^fake-lnaddress-tadbuy-tb-/);
  assert.deepEqual((await plug.listEvents(intent.id)).map((event) => event.type), ['Created']);
  assert.equal((await plug.getStatus(intent.id)).state, 'pending');
});

test('fixture settlement is scoped to the in-memory demo plug and records on-chain confirmation', async () => {
  const tadbuy = createFakePlug('tadbuy');
  const giveabit = createFakePlug('giveabit');
  const intent = await tadbuy.createIntent({ amountSats: 1000, rail: 'onchain' });

  assert.equal((await tadbuy.settleForFixture(intent.id)).state, 'settled');
  assert.deepEqual(
    (await tadbuy.listEvents(intent.id)).map((event) => event.type),
    ['Created', 'TransactionDetected', 'Settled'],
  );
  await assert.rejects(() => giveabit.getStatus(intent.id), /Unknown payment intent/);
  assert.equal(giveabit.mode, 'demo');
});

test('non-receiving streams cannot create a payment plug', () => {
  assert.throws(() => createFakePlug('hq'), /does not receive payments/);
});

test('public metrics clearly identify sample activity and never invent service health', () => {
  const metrics = buildProductMetrics({
    campaigns,
    publisherCount: new Set(MARKETPLACE_SLOTS.map((slot) => slot.publisher)).size,
    platformCatalogSize: AD_PLATFORMS.length,
    now: new Date('2026-10-21T12:00:00.000Z'),
  });
  const kpi = (key) => metrics.kpis.find((item) => item.key === key);

  assert.equal(metrics.raw.demo, true);
  assert.equal(metrics.raw.source, 'illustrative-app-state');
  assert.equal(metrics.health.status, 'amber');
  assert.equal(metrics.health.latencyMs, 0);
  assert.equal(metrics.health.uptimePct24h, 0);
  assert.ok(metrics.health.message.includes('not measured'));
  assert.ok(kpi('campaigns_total').label.includes('Example'));
  assert.ok(kpi('campaigns_active').hint.includes('does not activate campaigns'));
  assert.ok(kpi('sats_processed_total').hint.includes('no sats were processed'));
  assert.ok(kpi('impressions_delivered').hint.includes('no publisher delivery'));
  assert.ok(metrics.education.some((item) => item.title === 'Example budget is not GMV'));
  assert.equal(metrics.offers.find((offer) => offer.id === 'btc_ads').status, 'planned');
  assert.equal(metrics.offers.find((offer) => offer.id === 'ots_receipt').status, 'planned');
  assert.ok(metrics.offers.find((offer) => offer.id === 'metrics_v1').hint.includes('illustrative data'));
});
