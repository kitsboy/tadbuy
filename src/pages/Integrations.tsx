import { motion } from 'motion/react';
import { Plug, Code, Webhook, ShoppingBag, Globe, Users } from 'lucide-react';
import { Card, CardTitle, Button } from '@/components/ui';
import { usePageMeta } from '@/hooks/usePageMeta';
import { ApiExplorer } from '@/components/ApiExplorer';
import { Link } from 'react-router-dom';

const INTEGRATIONS = [
  { name: 'WordPress', icon: Globe, desc: 'Publisher inventory plugin', endpoint: '/api/v3/integrations/wordpress' },
  { name: 'Shopify', icon: ShoppingBag, desc: 'Merchant ad buying app', endpoint: '/api/v3/integrations/shopify' },
  { name: 'Embed SDK', icon: Code, desc: 'CDN: tadbuy.js + embed.js', endpoint: '/api/v3/sdk/info' },
  { name: 'Webhooks', icon: Webhook, desc: 'campaign.live, payment.confirmed', endpoint: '/api/webhooks/test' },
  { name: 'GraphQL', icon: Plug, desc: 'POST /api/v3/graphql', endpoint: null },
  { name: 'Teams & RBAC', icon: Users, desc: 'Multi-user agency accounts', endpoint: '/api/v3/teams' },
];

export default function Integrations() {
  usePageMeta('Integrations', 'WordPress, Shopify, webhooks, GraphQL, and embed SDK for Tadbuy publishers and agencies.');

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2">
          <Plug className="w-7 h-7 text-blue" /> Integrations Hub
        </h1>
        <p className="text-sm text-muted mt-1">
          API explorers run against M4 proxy or local dev server.{' '}
          <Link to="/beta" className="text-accent hover:underline">Check API status →</Link>
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {INTEGRATIONS.map(int => (
          <Card key={int.name} className="glass-panel hover:border-accent/30 transition-colors">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue/10 flex items-center justify-center">
                <int.icon className="w-5 h-5 text-blue" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-sm">{int.name}</div>
                <div className="text-xs text-muted mt-0.5">{int.desc}</div>
                {int.endpoint && <ApiExplorer endpoint={int.endpoint} label={int.name} />}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="glass-panel">
        <CardTitle>OpenAPI 3.1 Spec</CardTitle>
        <p className="text-sm text-muted mb-4">Fetch the machine-readable API spec (requires API server online).</p>
        <ApiExplorer endpoint="/api/v3/openapi.json" label="OpenAPI" />
        <Link to="/api-docs" className="inline-block mt-4">
          <Button variant="secondary" className="gap-2"><Code className="w-4 h-4" /> Human Docs</Button>
        </Link>
      </Card>
    </motion.div>
  );
}