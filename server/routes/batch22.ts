import type { Express } from 'express';

/** Batch 22 — Performance & agent (features 526-550) */

const AGENT_OPENAPI_PATHS = {
  '/agent/campaigns': {
    post: {
      summary: 'Agent: create campaign',
      tags: ['agent'],
      security: [{ agentAuth: [] }],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['name', 'budgetSats'],
              properties: {
                name: { type: 'string' },
                budgetSats: { type: 'integer' },
                status: { type: 'string', enum: ['draft', 'live', 'paused', 'completed'] },
              },
            },
          },
        },
      },
    },
  },
  '/agent/metrics': {
    get: {
      summary: 'Agent: aggregate metrics',
      tags: ['agent'],
      security: [{ agentAuth: [] }],
    },
  },
  '/agent/topup': {
    post: {
      summary: 'Agent: Lightning top-up',
      tags: ['agent'],
      security: [{ agentAuth: [] }],
    },
  },
  '/agent/sandbox': {
    post: {
      summary: 'Agent: dry-run tool execution',
      tags: ['agent'],
      security: [{ agentAuth: [] }],
    },
  },
  '/agent/openapi': {
    get: {
      summary: 'Agent-scoped OpenAPI document',
      tags: ['agent'],
    },
  },
};

const webhookSubscriptions: Array<{
  id: string;
  url: string;
  events: string[];
  createdAt: string;
}> = [];

export function registerBatch22Routes(app: Express) {
  app.get('/api/agent/openapi', (_req, res) => {
    res.json({
      openapi: '3.1.0',
      info: {
        title: 'Tadbuy Agent API',
        version: 'v5.0.2',
        description: 'Authenticated agent endpoints for autonomous campaign management',
      },
      servers: [{ url: 'https://api.giveabit.io' }, { url: 'http://localhost:3000' }],
      components: {
        securitySchemes: {
          agentAuth: { type: 'http', scheme: 'bearer', description: 'AGENT_API_KEY' },
        },
      },
      paths: AGENT_OPENAPI_PATHS,
    });
  });

  app.post('/api/agent/sandbox', (req, res) => {
    const { tool, params } = req.body ?? {};
    if (!tool || typeof tool !== 'string') {
      return res.status(400).json({ error: 'tool (string) is required' });
    }

    res.json({
      sandbox: true,
      dryRun: true,
      tool,
      params: params ?? {},
      result: {
        status: 'simulated',
        message: `Sandbox executed "${tool}" without side effects`,
        estimatedLatencyMs: 42,
      },
      timestamp: new Date().toISOString(),
    });
  });

  app.post('/api/webhooks/subscribe', (req, res) => {
    const { url, events } = req.body ?? {};
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'url (string) is required' });
    }

    const allowed = ['campaign.created', 'campaign.activated', 'invoice.paid', 'settlement.completed'];
    const selected = Array.isArray(events)
      ? events.filter((e: string) => allowed.includes(e))
      : allowed;

    const sub = {
      id: `wh_${Date.now().toString(36)}`,
      url,
      events: selected.length ? selected : allowed,
      createdAt: new Date().toISOString(),
    };
    webhookSubscriptions.push(sub);

    res.status(201).json({
      subscription: sub,
      total: webhookSubscriptions.length,
      hint: 'Deliveries are queued — configure WEBHOOK_SECRET for HMAC verification in production',
    });
  });

  app.get('/api/webhooks/subscribe', (_req, res) => {
    res.json({ subscriptions: webhookSubscriptions, count: webhookSubscriptions.length });
  });
}