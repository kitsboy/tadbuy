import type { Express } from 'express';

/** Batch 17 — Payments (enhancements 21-30) */
export function registerBatch17Routes(app: Express) {
  app.get('/api/payments/recommend', (req, res) => {
    const budgetSats = Number(req.query.budgetSats) || 100_000;
    const lightningLive = !!process.env.UMBREL_LND_SOCKET;

    const rails = [
      {
        id: 'lightning',
        name: 'Lightning',
        reason: budgetSats < 1_000_000
          ? 'Best for sub-1M sats — instant settlement'
          : 'Fast settlement for most campaign sizes',
        settlement: 'instant',
        recommended: budgetSats < 1_000_000,
        enabled: lightningLive || true,
      },
      {
        id: 'fedimint',
        name: 'Fedimint Ecash',
        reason: 'Privacy-preserving ecash for micro-budgets',
        settlement: 'instant',
        recommended: budgetSats < 100_000,
        enabled: !!process.env.FEDIMINT_GATEWAY_URL || true,
      },
      {
        id: 'onchain',
        name: 'On-chain BTC',
        reason: budgetSats >= 1_000_000
          ? 'Recommended for large budgets (1M+ sats)'
          : 'Higher fees — best for 1M+ sats only',
        settlement: '~10 min',
        recommended: budgetSats >= 1_000_000,
        enabled: true,
      },
      {
        id: 'bolt12',
        name: 'BOLT12 Offer',
        reason: 'Reusable offers with enhanced privacy',
        settlement: 'instant',
        recommended: false,
        enabled: false,
      },
    ];

    res.json({ budgetSats, rails, demoMode: !lightningLive });
  });

  app.get('/api/payments/fees', (req, res) => {
    const amountSats = Number(req.query.amountSats) || 0;
    const platformFeePct = 15;
    const platformFeeSats = Math.round(amountSats * (platformFeePct / 100));
    const publisherSats = amountSats - platformFeeSats;

    res.json({
      amountSats,
      platformFeePct,
      platformFeeSats,
      publisherSats,
      totalSats: amountSats,
      note: '15% platform fee covers PPQ.AI optimization, settlement, and infrastructure',
    });
  });

  app.get('/api/payments/status/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const { getInvoice, authenticatedLndGrpc } = await import('ln-service');
      const cert = process.env.UMBREL_LND_CERT;
      const macaroon = process.env.UMBREL_LND_MACAROON;
      const socket = process.env.UMBREL_LND_SOCKET;

      if (!cert || !macaroon || !socket) {
        return res.json({
          id,
          status: 'demo',
          paid: false,
          message: 'Demo mode — LND not configured',
        });
      }

      const { lnd } = authenticatedLndGrpc({ cert, macaroon, socket });
      const invoice = await getInvoice({ lnd, id });
      res.json({
        id,
        status: invoice.is_confirmed ? 'settled' : 'pending',
        paid: invoice.is_confirmed,
        amountSats: invoice.tokens,
        createdAt: invoice.created_at,
        expiresAt: invoice.expires_at,
      });
    } catch {
      res.json({
        id,
        status: 'unknown',
        paid: false,
        message: 'Could not verify payment status',
      });
    }
  });
}