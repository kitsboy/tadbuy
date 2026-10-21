import { Activity, BarChart3, MousePointerClick, Wallet } from 'lucide-react';
import { Card, CardTitle } from '@/components/ui';
import { Alert } from '@/components/ui/Alert';
import { PageShell } from '@/components/PageShell';
import { usePageMeta } from '@/hooks/usePageMeta';
import { ArtCampaignScene } from '@/components/illustrations';
import { PreviewReadinessPanel } from '@/components/PreviewReadinessPanel';

const UNAVAILABLE_METRICS = [
  { title: 'Impressions / reach', detail: 'No publisher delivery or audience measurement is connected.', icon: Activity },
  { title: 'Clicks / conversions', detail: 'No campaign links or conversion events are being collected.', icon: MousePointerClick },
  { title: 'Spend / settlement', detail: 'No Tadbuy payment rail or campaign ledger is connected.', icon: Wallet },
  { title: 'Platform performance', detail: 'No provider reporting or approved publisher reports are connected.', icon: BarChart3 },
];

export default function Metrics() {
  usePageMeta('Metrics readiness', 'Campaign reporting is not connected in this preview; no impression, click, conversion, or payment results are available.');

  return (
    <PageShell
      title="Measurement readiness"
      description="This page will show campaign evidence when a real, attributable data source is connected. It does not display simulated performance as if it were measured."
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Metrics' }]}
      showDemoBadge
      maxWidth="max-w-5xl"
      art={<ArtCampaignScene className="opacity-90" />}
    >
      <PreviewReadinessPanel compact />

      <Alert variant="warning" title="No live campaign reporting is connected">
        This preview has no live publisher inventory, campaign delivery backend, or settlement ledger. There are no Tadbuy impressions, clicks, conversions, spend, or payout results to report. No estimate is presented as a measured result.
      </Alert>

      <section aria-label="Unavailable campaign metrics" className="grid gap-4 sm:grid-cols-2">
        {UNAVAILABLE_METRICS.map(({ title, detail, icon: Icon }) => (
          <Card key={title} className="glass-panel" data-testid="metric-unavailable-card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted">{title}</div>
                <div className="mt-2 text-2xl font-extrabold text-muted">Not connected</div>
              </div>
              <Icon className="h-5 w-5 text-muted" aria-hidden="true" />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted">{detail}</p>
          </Card>
        ))}
      </section>

      <Card className="border-blue/20 bg-blue/5">
        <CardTitle>What must exist before results appear?</CardTitle>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-xs leading-relaxed text-muted">
          <li>An approved campaign and publisher, with consent and a defined delivery window.</li>
          <li>A documented measurement source for each metric, including timestamp and attribution limits.</li>
          <li>Durable campaign and payment records with reconciliation before any spend or payout total is shown.</li>
          <li>Privacy-safe reporting and an evidence-retention policy reviewed by the product and security owners.</li>
        </ol>
      </Card>
    </PageShell>
  );
}
