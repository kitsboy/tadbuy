import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { Card, CardTitle } from "@/components/ui";
import { Bitcoin, Shield, Zap } from "lucide-react";
import { LightningLiquidity } from "@/components/payments/LightningLiquidity";
import { BitcoinProtocolSuite } from "@/components/widgets/BitcoinProtocolSuite";
import { FedimintPanel } from "@/components/payments/FedimintPanel";
import { usePageMeta } from "@/hooks/usePageMeta";
import { PageShell } from '@/components/PageShell';
import { SafeLink } from '@/components/SafeLink';

const readiness = [
  {
    title: 'Lightning',
    status: 'Not connected',
    detail: 'No Tadbuy Lightning node, account balance, invoice creation, or settlement verification is connected.',
    icon: Zap,
    tone: 'text-lightning',
  },
  {
    title: 'Give A Bit Fedimint',
    status: 'Staged',
    detail: 'No federation session, ecash balance, invite, or mint transaction is available in this preview.',
    icon: Shield,
    tone: 'text-muted',
  },
  {
    title: 'Bitcoin on-chain',
    status: 'Reference only',
    detail: 'No Tadbuy deposit address, confirmation monitor, or campaign crediting is connected.',
    icon: Bitcoin,
    tone: 'text-accent',
  },
];

export default function Wallet() {
  usePageMeta('Bitcoin Wallet Preview', 'Bitcoin payment rail readiness. No wallet balance, invoice, payment, or withdrawal is connected in this build.');

  return (
    <PageShell
      title="Bitcoin Wallet"
      description="A readiness preview for Bitcoin payment rails—not a wallet or account ledger."
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Wallet' }]}
      showDemoBadge
      maxWidth="max-w-5xl"
    >
      <Alert variant="warning" title="No Tadbuy wallet is connected">
        No balance, invoice, deposit, withdrawal, campaign payment, or settlement can be created or verified here. Do not send funds to this preview expecting a Tadbuy credit.
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {readiness.map(({ title, status, detail, icon: Icon, tone }) => (
          <Card key={title} className="glass-panel h-full">
            <div className="flex items-start justify-between gap-3">
              <div className={`rounded-xl border border-white/10 bg-black/20 p-2.5 ${tone}`}><Icon className="w-5 h-5" /></div>
              <Badge variant="outline">{status}</Badge>
            </div>
            <h2 className="mt-4 text-base font-extrabold">{title}</h2>
            <p className="mt-2 text-xs leading-relaxed text-muted">{detail}</p>
          </Card>
        ))}
      </div>

      <BitcoinProtocolSuite defaultTab="l1" />

      <Tabs defaultValue="lightning">
        <TabsList className="w-full">
          <TabsTrigger value="lightning">Lightning</TabsTrigger>
          <TabsTrigger value="fedimint">Fedimint</TabsTrigger>
          <TabsTrigger value="onchain">On-chain</TabsTrigger>
        </TabsList>

        <TabsContent value="lightning">
          <Card className="glass-panel">
            <CardTitle className="flex items-center gap-2"><Zap className="w-4 h-4 text-lightning" /> Lightning readiness</CardTitle>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-black/20 p-4">
                <div className="text-[10px] uppercase tracking-wider font-bold text-muted">Tadbuy balance</div>
                <div className="mt-1 text-lg font-extrabold">Unavailable</div>
                <div className="mt-1 text-[11px] text-muted">No account ledger or connected node.</div>
              </div>
              <div className="rounded-xl border border-border bg-black/20 p-4">
                <div className="text-[10px] uppercase tracking-wider font-bold text-muted">Invoice / withdrawal</div>
                <div className="mt-1 text-lg font-extrabold">Disabled</div>
                <div className="mt-1 text-[11px] text-muted">No payment service can create or settle a request in this build.</div>
              </div>
            </div>
            <div className="mt-4"><LightningLiquidity /></div>
          </Card>
        </TabsContent>

        <TabsContent value="fedimint">
          <FedimintPanel />
        </TabsContent>

        <TabsContent value="onchain">
          <Card className="glass-panel">
            <CardTitle className="flex items-center gap-2"><Bitcoin className="w-5 h-5 text-accent" /> On-chain Bitcoin readiness</CardTitle>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              This build has no Tadbuy deposit address or on-chain monitor. A Give A Bit family receiving address is not a Tadbuy wallet balance and cannot activate a campaign here.
            </p>
            <div className="mt-4 rounded-xl border border-accent/20 bg-accent/5 p-4 text-xs leading-relaxed">
              If you need to find independently published Give A Bit receiving details, use the official directory and verify the destination there. Do not send campaign funds through this Tadbuy preview.
              <div className="mt-3">
                <SafeLink href="https://giveabit.io/wallets.json" target="_blank" showIcon>
                  Open Give A Bit wallet directory
                </SafeLink>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}
