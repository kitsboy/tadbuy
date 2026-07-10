import type { Express, Request, Response } from 'express';

// In-memory Fedimint session store (production: use encrypted session/DB)
const fedimintSessions = new Map<string, {
  federationId: string;
  federationName: string;
  balanceMsats: number;
  invite: string;
}>();

function getSessionId(req: Request): string {
  const cookie = req.headers.cookie ?? '';
  const match = cookie.match(/connect\.sid=([^;]+)/);
  return match?.[1] ?? req.ip ?? 'anonymous';
}

export function registerBatch1Routes(app: Express) {

  // ─── Fedimint Ecash ───────────────────────────────────────────────────────
  app.get('/api/fedimint/status', (req, res) => {
    const session = fedimintSessions.get(getSessionId(req));
    if (!session) {
      return res.json({
        connected: false,
        balanceMsats: 0,
        message: 'No federation joined. Use POST /api/fedimint/join with an invite code.',
      });
    }
    res.json({
      connected: true,
      federationId: session.federationId,
      federationName: session.federationName,
      balanceMsats: session.balanceMsats,
    });
  });

  app.post('/api/fedimint/join', (req, res) => {
    const { invite } = req.body;
    if (!invite || typeof invite !== 'string') {
      return res.status(400).json({ message: 'invite code required (fm-invite://...)' });
    }
    const federationId = 'fm_' + Buffer.from(invite).toString('base64url').slice(0, 12);
    const session = {
      federationId,
      federationName: process.env.FEDIMINT_FEDERATION_NAME || 'Give A Bit Mint',
      balanceMsats: 5_000_000, // 5000 sats demo balance
      invite,
    };
    fedimintSessions.set(getSessionId(req), session);
    res.json({ connected: true, ...session });
  });

  app.post('/api/fedimint/pay', (req, res) => {
    const { amountSats, memo } = req.body;
    const session = fedimintSessions.get(getSessionId(req));
    if (!session) return res.status(400).json({ message: 'Join a federation first' });
    const amountMsats = (amountSats || 0) * 1000;
    if (amountMsats > session.balanceMsats) {
      return res.status(400).json({ message: 'Insufficient ecash balance' });
    }
    session.balanceMsats -= amountMsats;
    const operationId = 'fmop_' + Date.now().toString(36);
    console.log(`Fedimint payment: ${amountSats} sats — ${memo}`);
    res.json({ success: true, operationId, amountMsats, message: 'Ecash payment settled' });
  });

  app.post('/api/fedimint/redeem', (req, res) => {
    const { notes } = req.body;
    if (!notes) return res.status(400).json({ message: 'ecash notes required' });
    const session = fedimintSessions.get(getSessionId(req));
    if (!session) return res.status(400).json({ message: 'Join a federation first' });
    session.balanceMsats += 1_000_000; // demo redeem
    res.json({ balanceMsats: session.balanceMsats });
  });

  // ─── Nostr (NIP-57, NIP-98, NIP-46, NIP-90) ─────────────────────────────
  app.post('/api/nostr/zap', (req, res) => {
    const { amountSats, campaignId, relays } = req.body;
    res.json({
      lnurl: `https://tadbuy.giveabit.io/api/nostr/lnurl/zap?amount=${amountSats}&campaign=${campaignId}`,
      pubkey: process.env.NOSTR_PUBKEY || 'npub1tadbuydemo',
      relays: relays || ['wss://relay.damus.io'],
      amount: amountSats,
      campaignId,
    });
  });

  app.post('/api/nostr/nip98/verify', (req, res) => {
    const { event } = req.body;
    if (!event) return res.status(400).json({ valid: false, reason: 'event required' });
    // Structural checks only — full schnorr verify not yet wired
    if (event.kind !== 27235 || !event.pubkey || !event.sig) {
      return res.json({ valid: false, reason: 'invalid NIP-98 event shape' });
    }
    const now = Math.floor(Date.now() / 1000);
    if (typeof event.created_at !== 'number' || Math.abs(now - event.created_at) > 60) {
      return res.json({ valid: false, reason: 'timestamp expired' });
    }
    res.json({
      valid: false,
      method: 'NIP-98',
      reason: 'signature not cryptographically verified — use full Nostr verifier in production',
      structureOk: true,
    });
  });

  app.post('/api/nostr/nip46/sign', (req, res) => {
    const { pubkey, payload } = req.body;
    res.json({
      pubkey,
      signature: 'sig_demo_' + Buffer.from(payload || '').toString('base64url').slice(0, 16),
      method: 'NIP-46-bunker',
      message: 'Connect NIP-46 bunker signer for production signatures',
    });
  });

  app.post('/api/nostr/nip90/dvm', (req, res) => {
    const { kind, input } = req.body;
    res.json({
      status: 'completed',
      kind: kind || 5000,
      result: { optimized: input, model: 'ppq-ai-v1' },
      payment: { amount: 21, unit: 'sats' },
    });
  });

  // ─── Lightning Channels / Liquidity ───────────────────────────────────────
  // Public demo numbers only when LND unset; live channel data requires auth via server.ts patterns
  app.get('/api/lightning/channels', async (_req, res) => {
    try {
      const { getChannels, authenticatedLndGrpc } = await import('ln-service');
      const cert = process.env.UMBREL_LND_CERT;
      const macaroon = process.env.UMBREL_LND_MACAROON;
      const socket = process.env.UMBREL_LND_SOCKET;
      if (!cert || !macaroon || !socket) {
        return res.json({
          alias: 'Tadbuy Node (demo)',
          channels: [
            { localBalance: 2_500_000, remoteBalance: 8_000_000, capacity: 10_500_000, active: true },
            { localBalance: 1_200_000, remoteBalance: 3_800_000, capacity: 5_000_000, active: true },
            { localBalance: 500_000, remoteBalance: 1_500_000, capacity: 2_000_000, active: true },
          ],
        });
      }
      const { lnd } = authenticatedLndGrpc({ cert, macaroon, socket });
      const { channels } = await getChannels({ lnd, is_active: true });
      res.json({
        alias: 'LND Node',
        channels: channels.map(c => ({
          localBalance: c.local_balance,
          remoteBalance: c.remote_balance,
          capacity: c.capacity,
          active: c.is_active,
        })),
      });
    } catch {
      res.json({ alias: 'Unavailable', channels: [] });
    }
  });

  // ─── BOLT12 Offers (enhanced) ─────────────────────────────────────────────
  app.post('/api/lightning/bolt12/offer', (req, res) => {
    const { amountSats, description } = req.body;
    res.json({
      offer: `lno1qgsq${Buffer.from(`${amountSats}-${description}`).toString('base64url').slice(0, 20)}...`,
      supported: !!process.env.UMBREL_LND_SOCKET,
      amountSats,
      description,
      recurring: true,
    });
  });

  // ─── LNURL-pay ────────────────────────────────────────────────────────────
  app.get('/api/lnurl/pay/:user', (req, res) => {
    res.json({
      tag: 'payRequest',
      callback: `https://tadbuy.giveabit.io/api/lnurl/invoice/${req.params.user}`,
      minSendable: 1000,
      maxSendable: 100_000_000_000,
      metadata: JSON.stringify([['text/plain', `Pay ${req.params.user} via Tadbuy`]]),
    });
  });

  app.get('/api/lnurl/invoice/:user', (req, res) => {
    const amount = parseInt(req.query.amount as string, 10) || 1000;
    res.json({
      pr: `lnbc${Math.ceil(amount / 1000)}n1p...tadbuy-${req.params.user}`,
      routes: [],
    });
  });

  // ─── Cashu Ecash ──────────────────────────────────────────────────────────
  app.post('/api/cashu/redeem', (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'Cashu token required' });
    res.json({ success: true, amountSats: 5000, message: 'Cashu token redeemed' });
  });

  // ─── Silent Payments (BIP-352) ────────────────────────────────────────────
  app.post('/api/payments/silent', (req, res) => {
    const { amountSats } = req.body;
    res.json({
      address: 'sp1qgiveabitdemo' + Date.now().toString(36),
      amountSats,
      bip: 352,
      message: 'Scan with silent payment compatible wallet',
    });
  });

  // ─── BIP-47 Payment Codes ─────────────────────────────────────────────────
  app.post('/api/payments/bip47/code', (req, res) => {
    res.json({
      paymentCode: 'PM8tQYN3fqxnjV8K8vKqJqZqJqZqJqZqJqZqJqZqJqZqJqZqJqZqJqZqJqZq',
      label: 'Tadbuy Recurring Campaign',
      bip: 47,
    });
  });

  // ─── PYNYM Privacy Layer ──────────────────────────────────────────────────
  app.post('/api/privacy/pynym/register', (_req, res) => {
    res.json({ pynymId: 'pynym_' + Date.now().toString(36), status: 'registered' });
  });

  // ─── Ark / LSP Submarine Swap ─────────────────────────────────────────────
  app.post('/api/ark/swap', (req, res) => {
    const { amountSats } = req.body;
    res.json({
      status: 'pending',
      swapId: 'ark_' + Date.now().toString(36),
      amountSats,
      invoice: `lnbc${Math.ceil((amountSats || 1000) / 1000)}n1p...ark`,
      eta: '30s',
    });
  });

  // ─── RGB Protocol ─────────────────────────────────────────────────────────
  app.get('/api/rgb/inventory', (_req, res) => {
    res.json({
      contracts: [
        { id: 'rgb1', asset: 'Ad Slot — Nostr Feed', supply: 10000, priceSats: 500 },
        { id: 'rgb2', asset: 'Premium Banner — Bitcoin Magazine', supply: 100, priceSats: 50000 },
      ],
    });
  });

  // ─── Hardware Wallet ──────────────────────────────────────────────────────
  app.get('/api/hardware/status', (_req, res) => {
    res.json({
      supported: ['ledger', 'trezor', 'keystone'],
      connected: false,
      message: 'Connect via WebHID in browser for signing',
    });
  });

  // ─── Multi-sig Treasury ───────────────────────────────────────────────────
  app.get('/api/treasury/multisig', (_req, res) => {
    res.json({
      address: 'bc1q...multisig-demo',
      threshold: '2-of-3',
      signers: ['Give A Bit Ops', 'Kimi Custody', 'Cam Cold'],
      balanceSats: 50_000_000,
    });
  });

  // ─── UTXO Consolidation ───────────────────────────────────────────────────
  app.post('/api/utxo/consolidate', (_req, res) => {
    res.json({
      status: 'scheduled',
      jobId: 'utxo_' + Date.now().toString(36),
      estimatedFee: 2500,
      utxoCount: 12,
      message: 'Consolidation scheduled for next low-fee window',
    });
  });

  // ─── Coin Selection Strategy ──────────────────────────────────────────────
  app.post('/api/utxo/select', (req, res) => {
    const { strategy, amountSats } = req.body;
    const strategies = ['privacy', 'speed', 'economy'] as const;
    const selected = strategies.includes(strategy) ? strategy : 'economy';
    res.json({
      strategy: selected,
      amountSats,
      utxos: 3,
      estimatedFee: selected === 'privacy' ? 4500 : selected === 'speed' ? 3200 : 1800,
    });
  });

  // ─── RBF Fee Bump ─────────────────────────────────────────────────────────
  app.post('/api/bitcoin/rbf/bump', (req, res) => {
    const { txid, newFeeRate } = req.body;
    res.json({
      txid,
      newFeeRate: newFeeRate || 10,
      status: 'bumped',
      childTxid: 'child_' + Date.now().toString(36),
    });
  });

  // ─── Project State API (for pitch page live sync) ─────────────────────────
  app.get('/api/project/state', (_req, res) => {
    res.json({
      version: 'v4.2.0-ELITE',
      syncedAt: new Date().toISOString(),
      paymentMethods: 9,
      fedimintEnabled: true,
    });
  });
}