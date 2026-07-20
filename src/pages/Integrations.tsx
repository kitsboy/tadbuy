import { Plug, Code, Webhook, ShoppingBag, Globe, Users, ShieldCheck } from 'lucide-react';
import { Card, Button } from '@/components/ui';
import { PageShell, StatusPill } from '@/components/PageShell';
import { usePageMeta } from '@/hooks/usePageMeta';
import { ApiExplorer } from '@/components/ApiExplorer';
import { Link } from 'react-router-dom';
import { getSatohashUrl, stampGuideUrl } from '@/lib/satohash';

const INTEGRATIONS = [
  { name: 'WordPress', icon: Globe, desc: 'Publisher inventory plugin', endpoint: '/api/v3/integrations/wordpress', status: 'planned' as const },
  { name: 'Shopify', icon: ShoppingBag, desc: 'Merchant ad buying app', endpoint: '/api/v3/integrations/shopify', status: 'planned' as const },
  { name: 'Embed SDK', icon: Code, desc: 'CDN: tadbuy.js + embed.js', endpoint: '/api/v3/sdk/info', status: 'beta' as const },
  { name: 'Webhooks', icon: Webhook, desc: 'campaign.live, payment.confirmed', endpoint: '/api/webhooks/test', status: 'beta' as const },
  { name: 'GraphQL', icon: Plug, desc: 'POST /api/v3/graphql', endpoint: null, status: 'planned' as const },
  { name: 'Teams & RBAC', icon: Users, desc: 'Multi-user agency accounts', endpoint: '/api/v3/teams', status: 'planned' as const },
];

export default function Integrations() {
  usePageMeta('Integrations', 'WordPress, Shopify, webhooks, GraphQL, and embed SDK for Tadbuy publishers and agencies.');

  return (
    <PageShell
      title="Integrations Hub"
      description="API explorers run against M4 proxy or local dev server. Status badges reflect honest rollout — not all endpoints are production-ready."
      badge={<StatusPill status="beta" />}
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Integrations' }]}
      actions={
        <Link to="/beta" className="text-xs text-accent hover:underline font-semibold">API status →</Link>
      }
    >
      <div className="grid md:grid-cols-2 gap-4">
        {INTEGRATIONS.map(int => (
          <Card key={int.name} className="glass-panel hover:border-accent/30 transition-colors">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue/10 flex items-center justify-center">
                <int.icon className="w-5 h-5 text-blue" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm">{int.name}</span>
                  <StatusPill status={int.status} />
                </div>
                <div className="text-xs text-muted mt-0.5">{int.desc}</div>
                {int.endpoint && <ApiExplorer endpoint={int.endpoint} label={int.name} />}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="glass-panel">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-blue/10 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-blue" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">Satohash</span>
              <StatusPill status="beta" />
            </div>
            <p className="text-xs text-muted mt-0.5">
              Bitcoin-anchored timestamps via family API (<code className="text-[10px]">src/lib/satohash.ts</code>).
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href={getSatohashUrl()} target="_blank" rel="noopener noreferrer">
            <Button variant="secondary" className="gap-2 text-xs">Open Satohash</Button>
          </a>
          <a href={stampGuideUrl()} target="_blank" rel="noopener noreferrer">
            <Button variant="secondary" className="gap-2 text-xs">Stamp guide</Button>
          </a>
        </div>
      </Card>

      <Card className="glass-panel">
        <h2 className="text-sm font-bold mb-2">OpenAPI 3.1 Spec</h2>
        <p className="text-sm text-muted mb-4">Fetch the machine-readable API spec (requires API server online).</p>
        <ApiExplorer endpoint="/api/v3/openapi.json" label="OpenAPI" />
        <Link to="/api-docs" className="inline-block mt-4">
          <Button variant="secondary" className="gap-2"><Code className="w-4 h-4" /> Human Docs</Button>
        </Link>
      </Card>
    </PageShell>
  );
}