import { Request, Response, NextFunction } from 'express';

// Future-proofing: Expecting AGENT_API_KEYS to be a JSON string mapping keys to roles
// Example: {"key1": "agent", "key2": "admin"}
const AGENT_CONFIG = JSON.parse(process.env.AGENT_API_KEYS || '{}');

export function agentAuthMiddleware(requiredRole: 'agent' | 'admin' = 'agent') {
  return (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers['x-agent-api-key'] as string;
    const role = AGENT_CONFIG[apiKey];

    if (!role) {
      return res.status(401).json({ error: 'Unauthorized: Invalid or missing Agent API Key' });
    }

    if (requiredRole === 'admin' && role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Admin role required' });
    }

    next();
  };
}
