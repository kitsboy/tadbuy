import { motion } from 'motion/react';
import { Plug, Code, Webhook, ShoppingBag, Globe, Users } from 'lucide-react';
import { Card, CardTitle, Button } from '@/components/ui';
import { usePageMeta } from '@/hooks/usePageMeta';

const INTEGRATIONS = [
  { name: 'WordPress', icon: Globe, desc: 'Publisher inventory plugin', endpoint: '/api/v3/integrations/wordpress' },
  { name: 'Shopify', icon: ShoppingBag, desc: 'Merchant ad buying app', endpoint: '/api/v3/integrations/shopify' },
  { name: 'Embed SDK', icon: Code, desc: 'npm: @tadbuy/embed', endpoint: '/api/v3/sdk/info' },
  { name: 'Webhooks', icon: Webhook, desc: 'campaign.live, payment.confirmed', endpoint: null },
  { name: 'GraphQL', icon: Plug, desc: 'Flexible query API', endpoint: '/api/v3/graphql' },
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
        <p className="text-sm text-muted mt-1">Connect Tadbuy to your stack — Batch 3 features.</p>
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
                {int.endpoint && (
                  <a href={int.endpoint} target="_blank" rel="noreferrer">
                    <Button variant="secondary" size="sm" className="mt-3">View API</Button>
                  </a>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="glass-panel">
        <CardTitle>OpenAPI 3.1 Spec</CardTitle>
        <p className="text-sm text-muted mb-4">Interactive API playground and full endpoint reference.</p>
        <a href="/api/v3/openapi.json" target="_blank" rel="noreferrer">
          <Button className="gap-2"><Code className="w-4 h-4" /> Open API Spec</Button>
        </a>
      </Card>
    </motion.div>
  );
}