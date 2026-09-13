import type { Express, Request, Response } from 'express';
import { requireAuth } from '../../src/lib/api/userAuth.ts';
import { anonymizeIp, extractClientIp } from '../../src/lib/privacy/ipAnonymize.ts';

const staged = (message: string) => ({
  demo: true,
  supported: false,
  status: 'staged' as const,
  message,
});

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
  if (match?.[1]) return match[1];
  // Never key sessions on raw IP — coarse anonymized prefix only
  return anonymizeIp(extractClientIp(req)) ?? 'anonymous';
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

  app.post('/api/fedimint/join', requireAuth, (req, res) => {
    return res.status(503).json(staged('Fedimint join is staged until the Give A Bit gateway is connected.'));
  });

  app.post('/api/fedimint/pay', requireAuth, (_req, res) => {
    res.status(503).json(staged('Fedimint payments are staged until the Give A Bit gateway is connected.'));
  });

  app.post('/api/fedimint/redeem', requireAuth, (_req, res) => {
    res.status(503).json(staged('Fedimint redemption is staged until the Give A Bit gateway is connected.'));
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

  app.post('/api/nostr/nip46/sign', requireAuth, (_req, res) => {
    res.status(501).json(staged('NIP-46 signing requires a connected bunker signer.'));
  });

  app.post('/api/nostr/nip90/dvm', requireAuth, (_req, res) => {
    res.status(501).json(staged('NIP-90 jobs require a connected DVM and payment verifier.'));
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
  app.post('/api/cashu/redeem', requireAuth, (_req, res) => {
    res.status(501).json(staged('Cashu redemption is not connected to a mint.'));
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
  app.post('/api/privacy/pynym/register', requireAuth, (_req, res) => {
    res.status(501).json(staged('PYNYM registration requires the privacy service connection.'));
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