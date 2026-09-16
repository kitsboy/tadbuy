import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Terminal, ExternalLink, Copy, CheckCircle2 } from "lucide-react";
import { Card, CardTitle } from "@/components/ui";
import { Tabs, TabsList, TabsTrigger, TabsContent, Badge } from "@/components/ui/index";
import { usePageMeta } from "@/hooks/usePageMeta";
import { PageShell } from '@/components/PageShell';
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { ApiExplorer } from "@/components/ApiExplorer";
import { SafeLink } from "@/components/SafeLink";

const AUTH_CURL = `curl -X GET https://api.tadbuy.giveabit.io/v1/campaigns \\
  -H "Grpc-Metadata-macaroon: YOUR_MACAROON_HEX"`;

// Only paths that exist in the repository's own server (`server/routes/`) are listed.
// The two /v1/* rows that were here advertised paths implemented nowhere in the repo —
// an endpoint that does not exist is exactly the claim this page must not make
// (decision note t_1c9c0217 / t_a6f44865: cut the API-shaped UI).
const ENDPOINTS = [
  {
    method: 'GET' as const,
    path: '/api/marketplace/inventory',
    description: 'Browse available marketplace ad inventory slots.',
    request: null,
    explorer: '/api/marketplace/inventory',
    explorerLabel: 'Inventory',
  },
  {
    method: 'GET' as const,
    path: '/api/wallet/balances',
    description: 'Get wallet balance summary across Lightning, Fedimint, and on-chain.',
    request: null,
    explorer: '/api/wallet/balances',
    explorerLabel: 'Balances',
  },
];

const METHOD_VARIANT: Record<string, 'success' | 'info' | 'warning' | 'error'> = {
  GET: 'info',
  POST: 'success',
  PUT: 'warning',
  DELETE: 'error',
  PATCH: 'warning',
};

function CopyButton({ text, id }: { text: string; id: string }) {
  const { copied, copy } = useCopyToClipboard();
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <button
      onClick={() => { copy(text); setActiveId(id); }}
      className="absolute top-3 right-3 p-1.5 bg-surface rounded-md hover:bg-white/10 transition-colors"
      title="Copy to clipboard"
    >
      {copied && activeId === id
        ? <CheckCircle2 className="w-4 h-4 text-green" />
        : <Copy className="w-4 h-4" />
      }
    </button>
  );
}

export default function ApiReference() {
  usePageMeta('API Reference', 'Planned REST API for campaigns, metrics, wallet, and agent tools — no backend is deployed in this build.');
  const { copied, copy } = useCopyToClipboard();

  return (
    <PageShell
      title="API Reference"
      description="The planned developer surface — campaigns, metrics, settlements, and agent tools. Nothing here is callable in this build."
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'API' }]}
      maxWidth="max-w-4xl"
    >
      <Card className="glass-panel p-5 border-border mb-6">
        <p className="text-sm text-muted leading-relaxed">
          <strong className="text-text">Not deployed in this build.</strong> No backend API is deployed for this build
          (see <Link to="/beta" className="text-accent hover:underline">BETA status</Link>), so no request on this page
          can succeed and no key or macaroon can be issued. What follows is the planned specification — a label for
          work that is scoped, not a live service. <Link to="/health" className="text-accent hover:underline">System
          Health</Link> lists what this deployment actually checks.
        </p>
      </Card>
      <Tabs defaultValue="auth">
        <TabsList>
          <TabsTrigger value="auth">Authentication</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="agent">Agent Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="auth">
          <Card className="glass-panel p-6 border-accent/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <Terminal className="w-5 h-5 text-accent" />
              </div>
              <CardTitle className="text-xl m-0">Authentication</CardTitle>
            </div>
            <p className="text-sm text-muted mb-4 leading-relaxed">
              <strong className="text-text">Planned scheme.</strong> Tadbuy will use LSATs (Lightning Service
              Authentication Tokens) and Macaroons for API authentication, sent in the{' '}
              <code className="bg-bg px-1.5 py-0.5 rounded text-accent">Grpc-Metadata-macaroon</code> header. No macaroon
              can be issued yet — the host below is not deployed.
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-2">
              Example request — illustrative, not runnable today
            </p>
            <div className="bg-bg p-4 rounded-xl border border-border font-mono text-xs text-muted relative group">
              <pre>{AUTH_CURL}</pre>
              <button
                onClick={() => copy(AUTH_CURL.replace(/\n/g, ' '))}
                className="absolute top-3 right-3 p-1.5 bg-surface rounded-md hover:bg-white/10 transition-colors"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-green" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="endpoints">
          <div className="space-y-6">
            {ENDPOINTS.map((ep, i) => (
              <div key={ep.path} className="bg-surface/30 border border-border rounded-xl overflow-hidden">
                <div className="flex items-center gap-3 bg-surface/50 p-4 border-b border-border">
                  <Badge variant={METHOD_VARIANT[ep.method] ?? 'default'}>{ep.method}</Badge>
                  <code className="font-mono text-sm font-bold">{ep.path}</code>
                  <button
                    onClick={() => copy(ep.path)}
                    className="ml-auto p-1.5 rounded-md hover:bg-white/10 transition-colors text-muted"
                    title="Copy path"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="p-6">
                  <p className="text-sm text-muted mb-4">{ep.description}</p>
                  {ep.request && (
                    <>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-text mb-2">
                        {ep.method === 'GET' ? 'Response (JSON)' : 'Request Body (JSON)'}
                      </h4>
                      <div className="relative">
                        <pre className="bg-bg p-4 rounded-xl border border-border font-mono text-xs text-muted overflow-x-auto">
                          {ep.request}
                        </pre>
                        <CopyButton text={ep.request} id={`ep-${i}`} />
                      </div>
                    </>
                  )}
                  {ep.explorer && (
                    <ApiExplorer endpoint={ep.explorer} label={ep.explorerLabel ?? 'API'} method={ep.method} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="agent">
          <Card className="glass-panel p-6">
            <CardTitle>Agent Discovery</CardTitle>
            <p className="text-sm text-muted mb-4 leading-relaxed">
              <strong className="text-text">Planned.</strong> AI agents will be able to discover capabilities via{' '}
              <code className="text-accent">GET /api/agent/manifest/v2</code> and list tools at{' '}
              <code className="text-accent">GET /api/agent/tools</code>. Both paths exist in the repository's own server
              and are not served by this static deployment.
            </p>
            <ApiExplorer endpoint="/api/agent/discovery" label="Agent Discovery" method="GET" />
            <ApiExplorer endpoint="/api/api-reference/endpoints" label="All Endpoints" method="GET" />
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 pt-8 border-t border-border">
        <SafeLink href="https://swagger.io/specification/" target="_blank" showIcon className="inline-flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors">
          <ExternalLink className="w-4 h-4" /> OpenAPI specification format (external — Tadbuy publishes no spec yet)
        </SafeLink>
      </div>
    </PageShell>
  );
}