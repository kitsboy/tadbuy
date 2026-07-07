import type { Express } from 'express';

/** Batch 13 — API & agent tools (features 301-325) */

const API_ENDPOINTS = [
  { method: 'GET', path: '/api/campaigns', description: 'List all campaigns', auth: 'optional' },
  { method: 'POST', path: '/api/campaigns', description: 'Create a new campaign', auth: 'optional' },
  { method: 'GET', path: '/api/metrics', description: 'Aggregate campaign metrics', auth: 'none' },
  { method: 'POST', path: '/api/lightning/invoice', description: 'Create BOLT11 invoice', auth: 'none' },
  { method: 'GET', path: '/api/lightning/info', description: 'Lightning node info', auth: 'none' },
  { method: 'POST', path: '/api/marketplace/bid', description: 'Place marketplace bid', auth: 'optional' },
  { method: 'POST', path: '/api/publisher/settings', description: 'Save publisher payout settings', auth: 'optional' },
  { method: 'POST', path: '/api/settle', description: 'Withdraw / settle funds', auth: 'session' },
  { method: 'GET', path: '/api/settlements', description: 'Settlement history', auth: 'none' },
  { method: 'POST', path: '/api/agent/campaigns', description: 'Agent: create campaign', auth: 'agent' },
  { method: 'GET', path: '/api/agent/metrics', description: 'Agent: fetch metrics', auth: 'agent' },
  { method: 'POST', path: '/api/agent/topup', description: 'Agent: Lightning top-up', auth: 'agent' },
  { method: 'POST', path: '/api/fedimint/pay', description: 'Pay with Fedimint ecash', auth: 'session' },
  { method: 'GET', path: '/api/publisher/stats', description: 'Publisher revenue stats', auth: 'none' },
  { method: 'GET', path: '/api/marketplace/inventory', description: 'Marketplace slot inventory', auth: 'none' },
  { method: 'GET', path: '/api/wallet/balances', description: 'Wallet balance summary', auth: 'none' },
  { method: 'GET', path: '/api/geo/stats', description: 'Geo-targeting stats', auth: 'none' },
];

const AGENT_TOOLS = [
  { name: 'create_campaign', endpoint: 'POST /api/agent/campaigns', description: 'Create and fund a campaign programmatically' },
  { name: 'get_metrics', endpoint: 'GET /api/agent/metrics', description: 'Fetch aggregate performance metrics' },
  { name: 'topup_wallet', endpoint: 'POST /api/agent/topup', description: 'Send Lightning payment to destination' },
  { name: 'place_bid', endpoint: 'POST /api/marketplace/bid', description: 'Bid on marketplace inventory slot' },
  { name: 'fedimint_pay', endpoint: 'POST /api/fedimint/pay', description: 'Pay with Fedimint ecash' },
  { name: 'list_endpoints', endpoint: 'GET /api/api-reference/endpoints', description: 'Discover all API endpoints' },
  { name: 'health_check', endpoint: 'GET /api/health', description: 'Check API availability' },
  { name: 'backup_data', endpoint: 'POST /api/admin/backup', description: 'Admin: backup all tables', auth: 'admin' },
];

export function registerBatch13Routes(app: Express) {
  app.get('/api/api-reference/endpoints', (_req, res) => {
    res.json({
      version: 'v5.0.0-PLATINUM',
      baseUrl: process.env.VITE_API_BASE_URL || 'https://api.giveabit.io',
      count: API_ENDPOINTS.length,
      endpoints: API_ENDPOINTS,
    });
  });

  app.get('/api/api-reference/openapi', (_req, res) => {
    res.json({
      openapi: '3.1.0',
      info: { title: 'Tadbuy API', version: 'v5.0.0-PLATINUM', description: 'Bitcoin-native ad platform REST API' },
      servers: [{ url: 'https://api.giveabit.io' }, { url: 'http://localhost:3000' }],
      paths: Object.fromEntries(
        API_ENDPOINTS.map(e => [
          e.path.replace('/api', ''),
          { [e.method.toLowerCase()]: { summary: e.description, security: e.auth !== 'none' ? [{ [e.auth]: [] }] : [] } },
        ])
      ),
    });
  });

  app.get('/api/agent/tools', (_req, res) => {
    res.json({ tools: AGENT_TOOLS, count: AGENT_TOOLS.length });
  });

  app.get('/api/agent/discovery', (_req, res) => {
    res.json({
      project: 'tadbuy',
      version: 'v5.0.0-PLATINUM',
      phase: 'BETA',
      capabilities: AGENT_TOOLS.map(t => t.name),
      endpoints: API_ENDPOINTS.length,
      docs: {
        api_reference: '/api-reference',
        openapi: '/api/api-reference/openapi',
        manifest: '/api/agent/manifest',
        tools: '/api/agent/tools',
      },
      auth: {
        agent: 'Bearer AGENT_API_KEY',
        admin: 'Bearer ADMIN_API_KEY',
        nip98: 'NIP-98 HTTP Auth event header',
        macaroon: 'Grpc-Metadata-macaroon header (LND)',
      },
    });
  });

  // Extend agent manifest with batch 11-13 endpoints
  app.get('/api/agent/manifest/v2', (_req, res) => {
    res.json({
      project: 'tadbuy',
      version: 'v5.0.0-PLATINUM',
      phase: 'BETA',
      batch: 13,
      docs: {
        ai_context: 'docs/.ai_docs/context_map.md',
        beta: 'docs/BETA.md',
        setup: 'docs/SETUP-GUIDE.md',
        m4_ref: 'docs/M4-SERVER-REF.md',
        ecosystem: 'docs/ECOSYSTEM.md',
        fedimint: 'docs/FEDIMINT.md',
        api_reference: '/api/api-reference/endpoints',
        openapi: '/api/api-reference/openapi',
      },
      automatable: [
        'sync-docs on build',
        'campaign create via /api/agent/campaigns',
        'fedimint pay via /api/fedimint/pay',
        'metrics via /api/metrics',
        'marketplace bid via /api/marketplace/bid',
        'publisher stats via /api/publisher/stats',
        'wallet balances via /api/wallet/balances',
        'geo stats via /api/geo/stats',
        'api discovery via /api/agent/discovery',
      ],
      tools: AGENT_TOOLS,
      endpoints: API_ENDPOINTS,
      requiresM4: ['fedimint mint', 'umbrel lnd', 'api proxy'],
      ui_pages: [
        '/publisher', '/marketplace', '/geo', '/wallet', '/settlements', '/api-reference',
      ],
    });
  });

  app.post('/api/agent/execute', (req, res) => {
    const { tool, params } = req.body;
    const known = AGENT_TOOLS.find(t => t.name === tool);
    if (!known) {
      return res.status(400).json({ error: `Unknown tool: ${tool}`, available: AGENT_TOOLS.map(t => t.name) });
    }
    res.json({
      tool,
      status: 'queued',
      params: params ?? {},
      endpoint: known.endpoint,
      message: `Tool "${tool}" queued — call ${known.endpoint} directly for execution`,
    });
  });
}