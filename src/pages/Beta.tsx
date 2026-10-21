import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { FlaskConical, Server, Smartphone, Bitcoin, Shield, ExternalLink } from 'lucide-react';
import { Card, CardTitle, Button } from '@/components/ui';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { usePageMeta } from '@/hooks/usePageMeta';
import { PageShell } from '@/components/PageShell';
import { ConsumerWorkflow } from '@/components/ConsumerWorkflow';
import { EcosystemLinks } from '@/components/EcosystemLinks';
import { GIVEABIT_ECOSYSTEM } from '@/data/ecosystemConfig';
import { PROJECT_STATE } from '@/data/projectState';
import { SafeLink } from '@/components/SafeLink';
import { ArtBlueprint } from '@/components/illustrations';
import { PreviewReadinessPanel } from '@/components/PreviewReadinessPanel';

export default function Beta() {
  usePageMeta('BETA Status', 'What works now, what still needs a backend server, and the consumer payment workflow for Tadbuy.');

  const { federation, infrastructure } = GIVEABIT_ECOSYSTEM;

  return (
    <PageShell
      title="What Works Right Now"
      description={`Tadbuy UI is live on Cloudflare Pages. No backend API is deployed for this build. BETA ${PROJECT_STATE.version}.`}

      badge={<Badge variant="accent" className="gap-1.5"><FlaskConical className="w-3.5 h-3.5" /> BETA · {PROJECT_STATE.version}</Badge>}
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'BETA' }]}
      showDemoBadge
      art={<ArtBlueprint className="opacity-90" />}
    >

      <Card>
        <CardTitle>Published product roadmap</CardTitle>
        <Progress value={24} max={24} showLabel variant="accent" />
        <p className="text-xs text-muted mt-2">Feature-batch counts describe shipped interface work, not live payment, inventory, delivery, or marketplace readiness.</p>
      </Card>

      <PreviewReadinessPanel />

      <Card className="glass-panel">
        <CardTitle>API Status</CardTitle>
        <p className="text-sm font-bold">○ No backend API in this build</p>
        <p className="text-xs text-muted mt-1">
          The Tadbuy UI is a static SPA on Cloudflare Pages. Its payment and campaign endpoints live
          in the repo&apos;s own Node server, which is not deployed — so nothing is probed here and no
          status is claimed. <Link to="/health" className="underline">/health</Link> lists exactly what
          is checked.
        </p>
      </Card>

      <Card className="glass-panel">
        <CardTitle>Readiness by user step</CardTitle>
        <p className="text-xs text-muted mb-4">See what you can try now and what must be connected before a real campaign can run.</p>
        <ConsumerWorkflow />
      </Card>        <Card className="glass-panel border-border">
          <CardTitle className="flex items-center gap-2"><Shield className="w-4 h-4 text-muted" /> Fedimint roadmap status</CardTitle>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-muted">Status</span><span className="font-bold text-accent uppercase">{federation.status}</span></div>
          <div className="flex justify-between"><span className="text-muted">Domain</span><span className="font-mono">{federation.domain}</span></div>
          <div className="flex justify-between"><span className="text-muted">Gateway (M4)</span><span className="font-mono text-xs">{federation.stagedGateway}</span></div>            <p className="text-xs text-muted leading-relaxed pt-2">
            No federation is approved or connected to Tadbuy. Federation choice, guardian/quorum, recovery, governance, and release authorization remain open decisions.
          </p>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardTitle className="flex items-center gap-2"><Server className="w-4 h-4" /> Infrastructure checklist</CardTitle>
          <ul className="text-xs text-muted space-y-2">
            <li>• Umbrel Bitcoin node sync and health — operator verification required</li>
            <li>• Lightning daemon, liquidity, and recovery — separate verification required</li>
            <li>• Tadbuy API and durable records — not deployed</li>
            <li>• Payment service, settlement authority, ledger, and release approval — not established</li>
          </ul>
          <p className="text-[10px] text-muted mt-3">Do not expose node credentials or RPC endpoints to the browser or public internet.</p>
        </Card>
        <Card>
          <CardTitle className="flex items-center gap-2"><Bitcoin className="w-4 h-4 text-accent" /> Bitcoin node readiness</CardTitle>
          <p className="text-xs text-muted">
            Status: <strong className="text-accent">{infrastructure.umbrel.status.replace('_', ' ')}</strong>
          </p>
          <p className="text-xs text-muted mt-2">A synced Bitcoin node is a prerequisite, not a payment product by itself. Blockchain sync is in progress and this page cannot inspect its progress. After sync, an operator must verify node health and access locally. Before campaign funds can be accepted, we still need a separately approved payment service, authoritative settlement verification, ledger/reconciliation, spend limits, security review, support, and release approval. Do not send campaign funds to this preview.</p>
        </Card>
      </div>

      <Card>
        <CardTitle className="flex items-center gap-2"><Smartphone className="w-4 h-4" /> Ecosystem Apps (shared mint)</CardTitle>
        <EcosystemLinks highlight="tadbuy" />
      </Card>

      <div className="flex flex-wrap gap-3">
        <Link to="/"><Button>Plan a campaign preview</Button></Link>
        <Link to="/pitch"><Button variant="secondary">Investor Pitch</Button></Link>
          <SafeLink href="https://github.com/kitsboy/tadbuy/blob/main/docs/SETUP-GUIDE.md" target="_blank" showIcon>
            <Button variant="secondary">Setup Guide (GitHub)</Button>
          </SafeLink>
      </div>
    </PageShell>
  );
}