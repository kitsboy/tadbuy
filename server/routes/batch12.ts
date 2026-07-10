import type { Express } from 'express';

/** Batch 12 — Wallet & payments polish (features 276-300) */

export function registerBatch12Routes(app: Express) {
  // Never expose live node balance without ENABLE_LN_PAYOUTS (wallet is demo by default)
  app.get('/api/wallet/balances', async (_req, res) => {
    let lightningSats = 125_000;
    let status: 'available' | 'demo' = 'demo';
    if (process.env.ENABLE_LN_PAYOUTS === 'true') {
      try {
        const { getLightningNodeInfo } = await import('../../src/services/lightningService.ts');
        const info = await getLightningNodeInfo();
        lightningSats = info.confirmed_balance ?? 0;
        status = 'available';
      } catch {
        lightningSats = 0;
        status = 'demo';
      }
    }
    res.json({
      lightning: { sats: lightningSats, status },
      fedimint: { sats: 5_000, status: process.env.FEDIMINT_GATEWAY_URL ? 'connected' : 'demo' },
      onchain: { sats: 0, btc: 0, status: 'pending' },
      totalSats: lightningSats + 5_000,
      demo: status === 'demo',
    });
  });

  app.get('/api/wallet/payment-methods', (_req, res) => {
    res.json({
      methods: [
        { id: 'lightning', name: 'Lightning', icon: 'zap', enabled: true, minSats: 1, settlement: 'instant' },
        { id: 'fedimint', name: 'Fedimint Ecash', icon: 'shield', enabled: !!process.env.FEDIMINT_GATEWAY_URL || true, minSats: 21, settlement: 'instant' },
        { id: 'onchain', name: 'On-chain BTC', icon: 'bitcoin', enabled: false, minSats: 10000, settlement: '~10 min' },
        { id: 'bolt12', name: 'BOLT12 Offer', icon: 'bolt', enabled: false, minSats: 100, settlement: 'instant' },
      ],
    });
  });

  app.get('/api/wallet/transactions', (_req, res) => {
    res.json({
      transactions: [
        { id: 'tx_001', type: 'deposit', amountSats: 10000, method: 'lightning', status: 'completed', ts: Date.now() - 86400000 },
        { id: 'tx_002', type: 'withdrawal', amountSats: 2500, method: 'lightning', status: 'completed', ts: Date.now() - 172800000 },
        { id: 'tx_003', type: 'deposit', amountSats: 5000, method: 'fedimint', status: 'pending', ts: Date.now() - 3600000 },
      ],
    });
  });

  app.post('/api/wallet/topup', (req, res) => {
    const { amountSats, method } = req.body;
    if (!amountSats || amountSats < 1) {
      return res.status(400).json({ error: 'amountSats required (min 1)' });
    }
    res.json({
      success: true,
      method: method || 'lightning',
      amountSats,
      invoice: 'lnbc' + amountSats + 'n1p...demo',
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
    });
  });

  app.get('/api/payments/liquidity', async (_req, res) => {
    // Live channel balances are sensitive — demo numbers unless payouts enabled
    if (process.env.ENABLE_LN_PAYOUTS !== 'true') {
      return res.json({
        alias: 'Tadbuy Node (demo)',
        outbound: 4_200_000,
        inbound: 13_300_000,
        channelCount: 3,
        inboundPct: 76,
        demo: true,
      });
    }
    try {
      const { getChannels, authenticatedLndGrpc } = await import('ln-service');
      const cert = process.env.UMBREL_LND_CERT;
      const macaroon = process.env.UMBREL_LND_MACAROON;
      const socket = process.env.UMBREL_LND_SOCKET;
      if (!cert || !macaroon || !socket) {
        return res.json({
          alias: 'Tadbuy Node (demo)',
          outbound: 4_200_000,
          inbound: 13_300_000,
          channelCount: 3,
          inboundPct: 76,
          demo: true,
        });
      }
      const { lnd } = authenticatedLndGrpc({ cert, macaroon, socket });
      const { channels } = await getChannels({ lnd, is_active: true });
      const outbound = channels.reduce((s, c) => s + c.local_balance, 0);
      const inbound = channels.reduce((s, c) => s + c.remote_balance, 0);
      const total = outbound + inbound;
      res.json({
        alias: 'LND Node',
        outbound,
        inbound,
        channelCount: channels.length,
        inboundPct: total > 0 ? Math.round((inbound / total) * 100) : 0,
        demo: false,
      });
    } catch {
      res.json({ alias: 'Unavailable', outbound: 0, inbound: 0, channelCount: 0, inboundPct: 0, demo: true });
    }
  });

  app.get('/api/payments/settlements/summary', (_req, res) => {
    res.json({
      total: 0,
      completed: 0,
      pending: 0,
      totalBtc: 0,
      lastSettlement: null,
      message: 'Settlement history available at GET /api/settlements',
    });
  });
}