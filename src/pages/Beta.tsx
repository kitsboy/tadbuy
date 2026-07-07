import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { FlaskConical, Server, Smartphone, Bitcoin, Shield, ExternalLink } from 'lucide-react';
import { Card, CardTitle, Button } from '@/components/ui';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { usePageMeta } from '@/hooks/usePageMeta';
import { ConsumerWorkflow } from '@/components/ConsumerWorkflow';
import { EcosystemLinks } from '@/components/EcosystemLinks';
import { GIVEABIT_ECOSYSTEM } from '@/data/ecosystemConfig';
import { checkApiHealth } from '@/lib/apiBase';
import { PROJECT_STATE } from '@/data/projectState';

export default function Beta() {
  usePageMeta('BETA Status', 'What works now, what needs M4 server setup, and the consumer payment workflow for Tadbuy.');

  const [apiHealth, setApiHealth] = useState<Awaited<ReturnType<typeof checkApiHealth>> | null>(null);

  useEffect(() => {
    checkApiHealth().then(setApiHealth);
  }, []);

  const { federation, infrastructure } = GIVEABIT_ECOSYSTEM;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-4xl mx-auto pb-16">
      <div>
        <Badge variant="accent" className="mb-4 text-xs px-3 py-1">
          <FlaskConical className="w-3.5 h-3.5" />
          BETA · {PROJECT_STATE.version}
        </Badge>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">What Works Right Now</h1>
        <p className="text-sm text-muted mt-2 leading-relaxed">
          Tadbuy UI is live on Cloudflare Pages. API proxy is live at <code className="text-accent">api.giveabit.io</code>. Fedimint mint is parked until the Fedi app updates (FM 0.10 → Guardian 0.11). Umbrel LND parked until the node syncs.
        </p>
      </div>

      <Card>
        <CardTitle>v5 Enhancement Progress</CardTitle>
        <Progress value={350} max={350} showLabel variant="accent" />
        <p className="text-xs text-muted mt-2">14 batches × 25 enhancements = 350 total shipped</p>
      </Card>

      {apiHealth && (
        <Card className={apiHealth.ok ? 'border-green/30' : 'border-accent/30'}>
          <CardTitle>API Status</CardTitle>
          <p className={`text-sm font-bold ${apiHealth.ok ? 'text-green' : 'text-accent'}`}>
            {apiHealth.ok ? '● Online' : '○ Offline / Static Mode'}
          </p>
          <p className="text-xs text-muted mt-1">{apiHealth.message}</p>
        </Card>
      )}

      <Card className="glass-panel">
        <CardTitle>Consumer Workflow</CardTitle>
        <p className="text-xs text-muted mb-4">Your journey from browsing to paying for ads:</p>
        <ConsumerWorkflow />
      </Card>

      <Card className="glass-panel border-green/20">
        <CardTitle className="flex items-center gap-2"><Shield className="w-4 h-4 text-green" /> Give A Bit Mint (Fedimint)</CardTitle>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-muted">Status</span><span className="font-bold text-accent uppercase">{federation.status}</span></div>
          <div className="flex justify-between"><span className="text-muted">Domain</span><span className="font-mono">{federation.domain}</span></div>
          <div className="flex justify-between"><span className="text-muted">Gateway (M4)</span><span className="font-mono text-xs">{federation.stagedGateway}</span></div>
          <p className="text-xs text-muted leading-relaxed pt-2">
            One mint for all Give A Bit projects: Tadbuy, Satohash, Give A Bit, MotoPass, OpenStrata.
            Federation runs on <strong>M4 HERMES</strong> — not M3.
          </p>
          <a href={infrastructure.fedi.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-accent font-bold hover:underline">
            Get Fedi wallet <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardTitle className="flex items-center gap-2"><Server className="w-4 h-4" /> M4 Server (HERMES)</CardTitle>
          <ul className="text-xs text-muted space-y-2">
            <li>• Fedimint guardian + mint</li>
            <li>• Umbrel full BTC node (when ready)</li>
            <li>• API proxy at api.giveabit.io ✅</li>
            <li>• Fedi gateway for mint.giveabit.io</li>
          </ul>
          <p className="text-[10px] text-muted mt-3 font-mono">Ref: docs/M4-SERVER-REF.md</p>
        </Card>
        <Card>
          <CardTitle className="flex items-center gap-2"><Bitcoin className="w-4 h-4 text-accent" /> Umbrel Node</CardTitle>
          <p className="text-xs text-muted">
            Status: <strong className="text-accent">{infrastructure.umbrel.status.replace('_', ' ')}</strong>
          </p>
          <p className="text-xs text-muted mt-2">When ready, set UMBREL_LND_* env vars on M4 for real Lightning invoices.</p>
        </Card>
      </div>

      <Card>
        <CardTitle className="flex items-center gap-2"><Smartphone className="w-4 h-4" /> Ecosystem Apps (shared mint)</CardTitle>
        <EcosystemLinks highlight="tadbuy" />
      </Card>

      <div className="flex flex-wrap gap-3">
        <Link to="/"><Button>Try Campaign Builder</Button></Link>
        <Link to="/pitch"><Button variant="secondary">Investor Pitch</Button></Link>
        <a href="https://github.com/kitsboy/tadbuy/blob/main/docs/SETUP-GUIDE.md" target="_blank" rel="noreferrer">
          <Button variant="secondary">Setup Guide (GitHub)</Button>
        </a>
      </div>
    </motion.div>
  );
}