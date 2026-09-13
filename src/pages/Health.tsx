import { useEffect, useState } from 'react';
import { CheckCircle2, Info, Loader2, XCircle } from 'lucide-react';
import { Card, CardTitle } from '@/components/ui';
import { Badge } from '@/components/ui/Badge';
import { PageShell } from '@/components/PageShell';
import { APP_VERSION } from '@/constants';
import { usePageMeta } from '@/hooks/usePageMeta';
import { getApiBase } from '@/lib/apiBase';

type ApiState = { ok: boolean; detail: string } | null;

export default function Health() {
  usePageMeta('System Health', 'What this page checks — and what a static site cannot check.');
  const apiBase = getApiBase();
  const [api, setApi] = useState<ApiState>(null);

  useEffect(() => {
    // Only probe when a backend origin is actually configured for this build.
    // With no base URL there is nothing to call, so the page makes no request
    // at all (a probe against a host that cannot answer is not a reading).
    if (!apiBase) return;
    let cancelled = false;
    fetch(`${apiBase}/api/v4/status`, { signal: AbortSignal.timeout(4000) })
      .then((res) => {
        if (!cancelled) setApi({ ok: res.ok, detail: `${apiBase} answered HTTP ${res.status}` });
      })
      .catch(() => {
        if (!cancelled) setApi({ ok: false, detail: `${apiBase} did not answer` });
      });
    return () => {
      cancelled = true;
    };
  }, [apiBase]);

  return (
    <PageShell
      title="System Health"
      description="What this page checks — and what a static site cannot check."
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Health' }]}
      maxWidth="max-w-lg"
    >
      <Card className="glass-panel">
        <CardTitle>Deployment</CardTitle>
        <div className="flex justify-between text-sm">
          <span className="text-muted">Version</span>
          <span className="font-mono font-bold">{APP_VERSION}</span>
        </div>
        <div className="flex justify-between text-sm mt-2">
          <span className="text-muted">Static site</span>
          <Badge variant="success" dot>Serving</Badge>
        </div>
      </Card>

      <Card className="glass-panel">
        <CardTitle>What this page checks</CardTitle>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-green mt-0.5 shrink-0" />
            <span>
              <strong>App version</strong> — read from the bundle this deployment serves, not from a request.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-green mt-0.5 shrink-0" />
            <span>
              <strong>Static site</strong> — if you can read this, Cloudflare Pages served the page and its assets.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <Info className="w-4 h-4 text-muted mt-0.5 shrink-0" />
            <span>
              <strong>Backend API</strong> —{' '}
              {apiBase
                ? 'configured for this build; result below.'
                : 'not configured in this build, so no status is shown. No request is made — a row fed by a host that cannot answer would look like a reading and would not be one.'}
            </span>
          </li>
        </ul>
      </Card>

      {apiBase && (
        <Card className="glass-panel">
          <CardTitle>Backend API</CardTitle>
          {!api ? (
            <div className="flex items-center gap-2 text-muted text-sm">
              <Loader2 className="w-4 h-4 animate-spin" /> Checking {apiBase}…
            </div>
          ) : (
            <div className="flex items-start gap-3">
              {api.ok ? (
                <CheckCircle2 className="w-5 h-5 text-green" />
              ) : (
                <XCircle className="w-5 h-5 text-accent" />
              )}
              <div>
                <p className="text-sm font-bold">{api.ok ? 'Answered' : 'No answer'}</p>
                <p className="text-xs text-muted mt-1 font-mono break-all">{api.detail}</p>
              </div>
            </div>
          )}
        </Card>
      )}

      <Card className="glass-panel">
        <CardTitle>Payments &amp; campaigns</CardTitle>
        <p className="text-xs text-muted leading-relaxed">
          The payment and campaign endpoints in this product live in the repository&apos;s own Node
          server (<span className="font-mono">server.ts</span>), which is not part of this static
          deployment. Until a backend origin is deployed and wired through{' '}
          <span className="font-mono">VITE_API_BASE_URL</span>, those flows stay in the browser and
          are not reported as healthy here.
        </p>
      </Card>
    </PageShell>
  );
}
