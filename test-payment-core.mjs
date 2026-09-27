import assert from 'node:assert/strict';
import test from 'node:test';
import { paymentPlug } from './src/lib/payment-plug.mjs';
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
