/**
 * Tadbuy OpenAPI 3.1 Specification Source
 * Documents the public API surface. The Swagger UI is mounted at /api-docs.
 * For a runtime, fetched from /api/v3/openapi.json served by server.ts.
 */

export interface OpenApiPath {
  path: string;
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
  summary: string;
  tags: string[];
  requestBodySchema?: Record<string, unknown>;
  responseSchema: Record<string, unknown>;
  auth: 'none' | 'api_key' | 'nip98' | 'bearer';
}

export const OPENAPI_PATHS: OpenApiPath[] = [
  {
    path: '/api/v1/campaigns',
    method: 'get',
    summary: 'List all campaigns for the authenticated user',
    tags: ['campaigns'],
    responseSchema: {
      campaigns: 'array<Campaign>',
      total: 'number',
      page: 'number',
    },
    auth: 'bearer',
  },
  {
    path: '/api/v1/campaigns',
    method: 'post',
    summary: 'Create a new ad campaign',
    tags: ['campaigns'],
    requestBodySchema: {
      name: 'string',
      budgetSats: 'number',
      platform: 'string',
      targeting: 'TargetingOptions',
      creatives: 'array<Creative>',
    },
    responseSchema: { campaign: 'Campaign', invoice: 'string (BOLT11)' },
    auth: 'bearer',
  },
  {
    path: '/api/v1/campaigns/{id}',
    method: 'get',
    summary: 'Get campaign details and live analytics',
    tags: ['campaigns'],
    responseSchema: { campaign: 'Campaign', analytics: 'Analytics' },
    auth: 'bearer',
  },
  {
    path: '/api/v1/campaigns/{id}/pause',
    method: 'post',
    summary: 'Pause a live campaign',
    tags: ['campaigns'],
    responseSchema: { success: 'boolean' },
    auth: 'bearer',
  },
  {
    path: '/api/v1/wallet',
    method: 'get',
    summary: 'Get current wallet balances (Lightning, On-Chain, Fedimint)',
    tags: ['wallet'],
    responseSchema: { lightningSats: 'number', onchainSats: 'number', fedimintMsats: 'number' },
    auth: 'bearer',
  },
  {
    path: '/api/v1/wallet/invoice',
    method: 'post',
    summary: 'Create a new Lightning invoice (BOLT11)',
    tags: ['wallet'],
    requestBodySchema: { amountSats: 'number', memo: 'string', expirySeconds: 'number' },
    responseSchema: { invoice: 'string', paymentHash: 'string' },
    auth: 'bearer',
  },
  {
    path: '/api/v1/wallet/pay',
    method: 'post',
    summary: 'Pay a BOLT11 invoice',
    tags: ['wallet'],
    requestBodySchema: { invoice: 'string', amountSats: 'number' },
    responseSchema: { preimage: 'string', feeSats: 'number' },
    auth: 'bearer',
  },
  {
    path: '/api/v1/auction/bid',
    method: 'post',
    summary: 'Submit a bid for an ad slot auction',
    tags: ['auction'],
    requestBodySchema: { slotId: 'string', bidSats: 'number', bidType: 'CPM|CPC|PPQ|CPA' },
    responseSchema: { auctionId: 'string', status: 'pending|won|lost' },
    auth: 'bearer',
  },
  {
    path: '/api/v1/analytics/{campaignId}',
    method: 'get',
    summary: 'Get analytics for a campaign',
    tags: ['analytics'],
    responseSchema: { impressions: 'number', clicks: 'number', ctr: 'number', ecpmSats: 'number' },
    auth: 'bearer',
  },
  {
    path: '/api/v1/analytics/export',
    method: 'get',
    summary: 'Export campaign analytics (CSV or JSON)',
    tags: ['analytics'],
    responseSchema: { downloadUrl: 'string' },
    auth: 'bearer',
  },
  {
    path: '/api/v1/publishers/slots',
    method: 'get',
    summary: 'List all ad slots for a publisher',
    tags: ['publishers'],
    responseSchema: { slots: 'array<AdSlot>' },
    auth: 'bearer',
  },
  {
    path: '/api/v1/publishers/payouts',
    method: 'get',
    summary: 'Get publisher payout history',
    tags: ['publishers'],
    responseSchema: { payouts: 'array<Payout>' },
    auth: 'bearer',
  },
  {
    path: '/api/v1/publishers/payouts/request',
    method: 'post',
    summary: 'Request a publisher payout (LNURL-Withdraw or on-chain)',
    tags: ['publishers'],
    requestBodySchema: { amountSats: 'number', method: 'lnurl|onchain', address: 'string' },
    responseSchema: { payoutId: 'string' },
    auth: 'bearer',
  },
  {
    path: '/api/v1/nostr/event',
    method: 'post',
    summary: 'Publish a campaign event to Nostr (NIP-78 application-specific data)',
    tags: ['nostr'],
    requestBodySchema: { event: 'NostrEvent (signed, kind 30078)' },
    responseSchema: { success: 'boolean', eventId: 'string' },
    auth: 'nip98',
  },
  {
    path: '/api/v1/zkproofs/{campaignId}',
    method: 'get',
    summary: 'Get zk-SNARK Proof-of-Viewability proofs for a campaign',
    tags: ['privacy'],
    responseSchema: { proofs: 'array<ZkProof>', totalImpressions: 'number' },
    auth: 'bearer',
  },
  {
    path: '/api/v1/health',
    method: 'get',
    summary: 'Liveness and readiness check',
    tags: ['system'],
    responseSchema: { status: 'ok|degraded|down', uptimeSeconds: 'number' },
    auth: 'none',
  },
  {
    path: '/api/v1/metrics',
    method: 'get',
    summary: 'Public platform metrics (impressions, sats processed, publishers)',
    tags: ['system'],
    responseSchema: { campaigns: 'number', satsProcessed: 'number', impressions: 'number' },
    auth: 'none',
  },
];

/** Generate the OpenAPI 3.1 JSON document from the path list */
export function generateOpenApiDocument() {
  return {
    openapi: '3.1.0',
    info: {
      title: 'Tadbuy API',
      description: 'Bitcoin-native advertising DSP — pay in sats via Lightning, BOLT12, on-chain, or Nostr Zaps.',
      version: '5.0.63',
      contact: { name: 'Give A Bit', url: 'https://giveabit.io' },
      license: { name: 'MIT', url: 'https://github.com/kitsboy/tadbuy/blob/main/LICENSE' },
    },
    servers: [
      { url: 'https://tadbuy.giveabit.io', description: 'Production' },
      { url: 'https://staging.tadbuy.giveabit.io', description: 'Staging' },
      { url: 'http://localhost:5173', description: 'Local Dev' },
    ],
    paths: OPENAPI_PATHS.reduce<Record<string, Record<string, unknown>>>((acc, p) => {
      acc[p.path] = acc[p.path] ?? {};
      acc[p.path][p.method] = {
        summary: p.summary,
        tags: p.tags,
        requestBody: p.requestBodySchema ? { content: { 'application/json': { schema: p.requestBodySchema } } } : undefined,
        responses: {
          '200': { description: 'OK', content: { 'application/json': { schema: p.responseSchema } } },
        },
      };
      return acc;
    }, {}),
    components: {
      securitySchemes: {
        bearer: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        nip98: { type: 'apiKey', in: 'header', name: 'Authorization', description: 'Nostr NIP-98 auth: "Nostr <base64-event>"' },
      },
    },
  };
}
