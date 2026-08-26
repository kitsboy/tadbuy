import { useEffect, useState, useRef } from 'react';
import { PageShell, StatusPill } from '@/components/PageShell';
import { usePageMeta } from '@/hooks/usePageMeta';
import { Button, Card } from '@/components/ui';
import { Download, RefreshCw, ExternalLink, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ApiDocs() {
  usePageMeta('API Docs', 'Interactive Swagger UI for Tadbuy API. Try endpoints live with your API key.');

  const [specUrl, setSpecUrl] = useState('/api/v3/openapi.json');
  const [swaggerLoaded, setSwaggerLoaded] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [copied, setCopied] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const loadSwaggerUI = () => {
    if (iframeRef.current) {
      iframeRef.current.src = `https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.11.0/swagger-ui.html?url=${encodeURIComponent(specUrl)}`;
      setSwaggerLoaded(true);
      setLastRefreshed(new Date());
    }
  };

  const copySpecUrl = async () => {
    try {
      await navigator.clipboard.writeText(specUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      prompt('Copy this URL:', specUrl);
    }
  };

  const refreshSpec = () => {
    const cacheBuster = `?t=${Date.now()}`;
    setSpecUrl(`/api/v3/openapi.json${cacheBuster}`);
    loadSwaggerUI();
  };

  useEffect(() => {
    loadSwaggerUI();
  }, [specUrl]);

  const renderFallback = () => (
    <Card className="glass-panel space-y-4">
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
          <RefreshCw className="w-8 h-8 text-accent" />
        </div>
        <h3 className="font-bold text-lg">Swagger UI failed to load</h3>
        <p className="text-sm text-muted mt-1">The CDN might be blocked. Using iframe fallback below.</p>
      </div>
      <div className="space-y-3 border-t border-border pt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">OpenAPI Spec URL</span>
          <code className="text-[10px] bg-surface px-2 py-1 rounded font-mono">{specUrl}</code>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={copySpecUrl} className="flex-1 gap-1">
            {copied ? <Check className="w-3.5 h-3.5 text-green" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy URL'}
          </Button>
          <Button variant="secondary" size="sm" onClick={refreshSpec} className="flex-1 gap-1">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </Button>
          <a href={specUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="flex-1 gap-1">
              <ExternalLink className="w-3.5 h-3.5" /> Open Raw JSON
            </Button>
          </a>
        </div>
      </div>
    </Card>
  );

  return (
    <PageShell
      title="API Documentation"
      description="Interactive Swagger UI — try endpoints live with your API key. Schema auto-generated from internal route definitions."
      badge={<StatusPill status="beta" />}
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Integrations', href: '/integrations' }, { label: 'API Docs' }]}
      maxWidth="max-w-6xl"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-muted">
            <span className="w-2 h-2 rounded-full bg-green animate-pulse" />
            Live API
          </div>
          {lastRefreshed && (
            <span className="text-[10px] text-muted font-mono">
              Refreshed: {lastRefreshed.toLocaleTimeString()}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={refreshSpec} className="gap-1">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Spec
          </Button>
          <a href={specUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="gap-1">
              <Download className="w-3.5 h-3.5" /> Download JSON
            </Button>
          </a>
        </div>
      </div>

      <Card className="glass-panel overflow-hidden" style={{ minHeight: '70vh' }}>
        <iframe
          ref={iframeRef}
          src={`https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.11.0/swagger-ui.html?url=${encodeURIComponent(specUrl)}`}
          title="Swagger UI"
          className="w-full border-0"
          style={{ height: '70vh', minHeight: '600px' }}
          onLoad={() => setSwaggerLoaded(true)}
          onError={() => setSwaggerLoaded(false)}
        />
      </Card>

      {!swaggerLoaded && renderFallback()}

      <Card className="glass-panel mt-4">
        <div className="flex items-center gap-3 mb-3">
          <ExternalLink className="w-5 h-5 text-muted" />
          <h3 className="font-bold text-sm">Direct Links</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-2 text-sm">
          <a href={specUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline flex items-center gap-1">
            <ExternalLink className="w-3.5 h-3.5" /> OpenAPI JSON Spec
          </a>
          <a href="https://editor.swagger.io/?url=https://api.tadbuy.giveabit.io/api/v3/openapi.json" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline flex items-center gap-1">
            <ExternalLink className="w-3.5 h-3.5" /> Open in Swagger Editor
          </a>
        </div>
      </Card>
    </PageShell>
  );
}