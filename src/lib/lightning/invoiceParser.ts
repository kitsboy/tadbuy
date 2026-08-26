/**
 * BOLT12 / BOLT11 Invoice Parser — Robust invoice handling
 * 
 * Provides parsing and validation of BOLT11 (Lightning) and BOLT12
 * (Offer) invoice strings, extracting metadata for display.
 */

export interface ParsedInvoice {
  type: 'bolt11' | 'bolt12' | 'lnurl' | 'unknown';
  raw: string;
  network?: 'mainnet' | 'testnet' | 'signet' | 'regtest';
  amountSats?: number;
  timestamp?: number;
  expirySeconds?: number;
  description?: string;
  paymentHash?: string;
  routingHints?: string[];
  offerId?: string;
  minFinalCltvExpiry?: number;
  metadata?: Record<string, string>;
}

const BOLT11_PREFIX = /^(lnbc|lntb|lnsb|lnbcrt)/i;
const BOLT12_PREFIX = /^lno1/i;
const LNURL_PREFIX = /^(lnurl1|lightning=lnurl1)/i;

export function parseInvoice(input: string): ParsedInvoice {
  const raw = input.trim();
  if (!raw) return { type: 'unknown', raw };

  if (BOLT12_PREFIX.test(raw)) {
    return parseBolt12(raw);
  }
  if (BOLT11_PREFIX.test(raw)) {
    return parseBolt11(raw);
  }
  if (LNURL_PREFIX.test(raw)) {
    return { type: 'lnurl', raw };
  }
  return { type: 'unknown', raw };
}

function parseBolt11(raw: string): ParsedInvoice {
  // Strip query params
  const [base, query] = raw.split('?');
  const amountMatch = base.match(/^(lnbc|lntb|lnsb|lnbcrt|lntbsb)(\d+)([munp])?/i);
  const networkMap: Record<string, 'mainnet' | 'testnet' | 'signet' | 'regtest'> = {
    lnbc: 'mainnet', lntb: 'testnet', lnsb: 'signet', lnbcrt: 'regtest',
  };

  let amountSats: number | undefined;
  if (amountMatch) {
    const n = parseInt(amountMatch[2], 10);
    const unit = (amountMatch[3] || '').toLowerCase();
    if (!isNaN(n)) {
      if (unit === 'm') amountSats = n * 100_000;
      else if (unit === 'u') amountSats = n * 100;
      else if (unit === 'n') amountSats = Math.floor(n / 10);
      else if (unit === 'p') amountSats = Math.floor(n / 10_000);
      else amountSats = n;
    }
  }

  const params: Record<string, string> = {};
  if (query) {
    for (const part of query.split('&')) {
      const [k, v] = part.split('=');
      if (k) params[k] = decodeURIComponent(v ?? '');
    }
  }

  return {
    type: 'bolt11',
    raw,
    network: networkMap[amountMatch?.[1]?.toLowerCase() ?? 'lnbc'],
    amountSats,
    timestamp: parseInt(params.timestamp) || undefined,
    expirySeconds: parseInt(params.expiry) || 3600,
    description: params.message || params.m,
    paymentHash: params.paymenthash,
    routingHints: params.route ? [params.route] : [],
    metadata: params,
  };
}

function parseBolt12(raw: string): ParsedInvoice {
  return {
    type: 'bolt12',
    raw,
    offerId: raw.slice(4, 14),
    description: 'BOLT12 offer (reusable)',
    metadata: { raw },
  };
}

export function formatInvoiceSummary(inv: ParsedInvoice): string {
  switch (inv.type) {
    case 'bolt11': {
      const amt = inv.amountSats != null ? `${inv.amountSats.toLocaleString()} sats` : 'any-amount';
      return `BOLT11 (${inv.network ?? 'mainnet'}) — ${amt} — ${inv.description ?? '(no memo)'}`;
    }
    case 'bolt12': return `BOLT12 offer — ${inv.offerId ?? 'unknown'} — ${inv.description ?? ''}`;
    case 'lnurl': return 'LNURL';
    default: return 'Unknown invoice format';
  }
}