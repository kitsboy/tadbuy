import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Target, Zap, ArrowRight, ShieldCheck, Bitcoin, RefreshCw } from 'lucide-react';
import { Card, CardTitle, Button } from '@/components/ui';
import { Badge } from '@/components/ui/Badge';
import { cn, formatSats } from '@/lib/utils';
import { PageShell, StatusPill } from '@/components/PageShell';
import { usePageMeta } from '@/hooks/usePageMeta';
import { HUBHASH_CAMPAIGNS, type HubhashCampaign } from '@/data/hubhashCampaigns';
import { FeeBreakdown } from '@/components/FeeBreakdown';
import { useToast } from '@/components/Toast';

export default function Hubhash() {
  usePageMeta('Hubhash', 'Crowdfund Bitcoin ad campaigns with provable escrow and automatic refunds.');
  const [campaigns, setCampaigns] = useState<HubhashCampaign[]>(HUBHASH_CAMPAIGNS);
  const { addToast } = useToast();

  useEffect(() => {
    fetch('/api/hubhash/campaigns')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.campaigns) setCampaigns(d.campaigns); })
      .catch(() => {});
  }, []);

  const pledge = async (campaign: HubhashCampaign) => {
    try {
      const res = await fetch('/api/hubhash/contribute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId: campaign.id, amountSats: 10_000 }),
      });
      const data = await res.json();
      if (data.demo) {
        addToast('Demo pledge recorded — refundable if goal not met', 'success');
      }
    } catch {
      addToast('Pledge API unavailable — demo mode', 'error');
    }
  };

  return (
    <PageShell
      title="Hubhash"
      description="Crowdfund ad campaigns with Lightning, on-chain BTC, or Fedimint ecash. Threshold triggers deploy; failed goals refund contributors."
      badge={<Badge variant="accent">Beta</Badge>}
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Hubhash' }]}
      showDemoBadge
      maxWidth="max-w-5xl"
      actions={
        <Link to="/"><Button size="sm">Create campaign</Button></Link>
      }
      faq={[
        { question: 'What happens if the goal is not met?', answer: 'Contributions are returned to original Lightning pubkeys when the funding window closes without hitting threshold.' },
        { question: 'How do I pay?', answer: 'Lightning, on-chain Bitcoin, or Fedimint ecash — same rails as Buy Ads checkout.' },
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-panel">
          <Users className="w-6 h-6 text-blue mb-2" />
          <div className="font-bold text-sm mb-1">Community funded</div>
          <p className="text-xs text-muted">Pool sats with others for campaigns you could not fund alone.</p>
        </Card>
        <Card className="glass-panel">
          <Target className="w-6 h-6 text-accent mb-2" />
          <div className="font-bold text-sm mb-1">Threshold triggers</div>
          <p className="text-xs text-muted">Ads deploy only when the Bitcoin budget goal is reached.</p>
        </Card>
        <Card className="glass-panel">
          <ShieldCheck className="w-6 h-6 text-green mb-2" />
          <div className="font-bold text-sm mb-1">Provable refunds</div>
          <p className="text-xs text-muted">Failed campaigns route sats back to contributors automatically.</p>
        </Card>
      </div>

      <Card className="glass-panel border-accent/20">
        <CardTitle className="flex items-center gap-2"><Bitcoin className="w-5 h-5 text-accent" /> Escrow & refund flow</CardTitle>
        <ol className="text-xs text-muted space-y-2 list-decimal list-inside leading-relaxed">
          <li>Contributor pays via Lightning / BTC / Fedimint → demo escrow holds sats</li>
          <li>Goal reached → PPQ.AI deploys to selected <Link to="/platforms" className="text-accent hover:underline">platforms</Link></li>
          <li>Goal missed → <RefreshCw className="w-3 h-3 inline" /> automatic refund to contributor pubkeys</li>
        </ol>
        <StatusPill status="demo" />
        <FeeBreakdown budgetSats={100_000} budgetUsd={100} compact className="mt-3" />
      </Card>

      <h2 className="text-lg font-bold">Trending campaigns</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {campaigns.map(campaign => {
          const progress = Math.min(100, (campaign.raisedBtc / campaign.targetBtc) * 100);
          const isUnleashed = campaign.status === 'unleashed';

          return (
            <Card key={campaign.id} className={cn('glass-panel relative', isUnleashed && 'border-green/30 bg-green/5')}>
              {isUnleashed ? (
                <div className="absolute top-4 right-4 bg-green/20 text-green text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                  <Zap className="w-3 h-3" /> UNLEASHED
                </div>
              ) : (
                <div className="absolute top-4 right-4 text-[11px] text-muted font-mono">{campaign.daysLeft} days left</div>
              )}
              <div className="text-sm font-bold text-muted mb-1">{campaign.creator}</div>
              <h3 className="text-lg font-extrabold mb-2">{campaign.title}</h3>
              <p className="text-xs text-muted leading-relaxed mb-3">{campaign.description}</p>
              <p className="text-[10px] text-muted mb-4">{campaign.refundPolicy}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {campaign.hashtags.map(tag => (
                  <span key={tag} className="bg-surface border border-border text-[10px] px-2 py-1 rounded-md">{tag}</span>
                ))}
              </div>
              <div className="mb-2 flex justify-between text-xs font-mono">
                <span className={isUnleashed ? 'text-green font-bold' : 'text-accent'}>
                  {formatSats(campaign.raisedSats)} raised
                </span>
                <span className="text-muted">Goal: {formatSats(campaign.targetSats)}</span>
              </div>
              <div className="bg-surface rounded-full h-2 overflow-hidden mb-4 border border-border/50">
                <div className={cn('h-full rounded-full', isUnleashed ? 'bg-green' : 'bg-accent')} style={{ width: `${progress}%` }} />
              </div>
              <Button
                variant={isUnleashed ? 'secondary' : 'primary'}
                className="w-full gap-2"
                disabled={isUnleashed}
                onClick={() => pledge(campaign)}
              >
                {isUnleashed ? 'Campaign live on platforms' : 'Pledge sats (refundable)'}
                {!isUnleashed && <ArrowRight className="w-4 h-4" />}
              </Button>
            </Card>
          );
        })}
      </div>
    </PageShell>
  );
}