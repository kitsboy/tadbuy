import { Request, Response, NextFunction } from 'express';

// AGENT_API_KEYS must be a JSON string mapping keys to roles.
// Example: AGENT_API_KEYS={"my-agent-key": "agent", "my-admin-key": "admin"}
let AGENT_CONFIG: Record<string, string> = {};
try {
  const raw = process.env.AGENT_API_KEYS || '{}';
  AGENT_CONFIG = JSON.parse(raw);
} catch {
  console.warn(
    'Warning: AGENT_API_KEYS is not valid JSON. ' +
    'Expected format: {"key1":"agent","key2":"admin"}. ' +
    'Agent API routes will reject all requests until this is fixed.'
  );
}

export function agentAuthMiddleware(requiredRole: 'agent' | 'admin' = 'agent') {
  return (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers['x-agent-api-key'] as string;

    if (!apiKey) {
      return res.status(401).json({ error: 'Unauthorized: Missing X-Agent-API-Key header' });
    }

    const role = AGENT_CONFIG[apiKey];

    if (!role) {
      return res.status(401).json({ error: 'Unauthorized: Invalid Agent API Key' });
    }

    if (requiredRole === 'admin' && role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Admin role required' });
    }

    next();
  };
}
