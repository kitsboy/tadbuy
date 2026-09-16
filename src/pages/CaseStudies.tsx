import { Link } from 'react-router-dom';
import { TrendingUp, Zap, Users, ArrowRight } from 'lucide-react';
import { Card, CardTitle, Button } from '@/components/ui';
import { Badge } from '@/components/ui/Badge';
import { PageShell } from '@/components/PageShell';
import { usePageMeta } from '@/hooks/usePageMeta';
import { AD_PLATFORMS } from '@/data/platforms';

function platformGuideHref(label: string): string | null {
  const key = label.toLowerCase();
  const p = AD_PLATFORMS.find(
    ap => ap.name.toLowerCase().includes(key) || key.includes(ap.id) || key.includes(ap.name.toLowerCase().split('/')[0]),
  );
  return p ? `/platforms/${p.slug}` : null;
}

// Brand names removed on legal ruling (Lenny, card t_902d8e2e): pairing a real
// trademark with invented performance figures is not cured by a label — a real mark
// next to "Sample ROI 3.2×" still reads as a claim about that company, and nominative
// fair use fails its no-endorsement prong. Cards stay (the mechanic is the point),
// counterparties become descriptive archetypes; figures stay, now attached to nobody.
// Ruling: /root/hq/docs/legal/LENNY-BRAND-SAMPLE-FIGURES-RULING.md
const CASE_STUDIES = [
  {
    id: 'dca-exchange',
    brand: 'A DCA exchange',
    tagline: 'DCA messaging to cold audiences',
    budget: '₿ 0.012',
    budgetSats: '1,200,000 sats',
    ctr: '4.8%',
    roi: '3.2×',
    platforms: ['Nostr', 'Newsletters', 'Twitter'],
    summary:
      'How a DCA exchange would run a Lightning-funded campaign targeting Bitcoin-curious audiences via Nostr zaps and newsletter sponsorships. PPQ.AI can help refine headlines around "stack sats" without surveillance retargeting.',
    results: [
      { label: 'Impressions', value: '2.1M' },
      { label: 'Sign-ups', value: '8,420' },
      { label: 'Cost per signup', value: '142 sats' },
    ],
  },
  {
    id: 'lightning-payments-app',
    brand: 'A Lightning payments app',
    tagline: 'Lightning payments awareness',
    budget: '₿ 0.008',
    budgetSats: '800,000 sats',
    ctr: '3.6%',
    roi: '2.7×',
    platforms: ['YouTube', 'Podcasts', 'Blogs'],
    summary:
      'How a payments app would promote instant global payments using marketplace slots on Bitcoin podcasts and YouTube. Lightning settlement lands in under a second per impression.',
    results: [
      { label: 'Impressions', value: '1.4M' },
      { label: 'App installs', value: '12,100' },
      { label: 'Cost per install', value: '66 sats' },
    ],
  },
  {
    id: 'bitcoin-rewards-card',
    brand: 'A Bitcoin rewards card',
    tagline: 'Bitcoin rewards for everyday spend',
    budget: '₿ 0.005',
    budgetSats: '500,000 sats',
    ctr: '5.1%',
    roi: '4.1×',
    platforms: ['Nostr', 'Community forums', 'Reddit'],
    summary:
      'How a Bitcoin rewards card would target Bitcoin community feeds with native ad formats. Fedimint ecash checkout would let it test creatives without exposing card data or waiting for invoice NET-30 terms.',
    results: [
      { label: 'Impressions', value: '890K' },
      { label: 'Card activations', value: '4,200' },
      { label: 'Cost per activation', value: '119 sats' },
    ],
  },
] as const;

export default function CaseStudies() {
  usePageMeta('Case Studies', 'Illustrative campaign walkthroughs with sample figures — no campaign has run on Tadbuy yet.');

  return (
    <PageShell
      title="Bitcoin Brand Case Studies"
      description="Illustrative walkthroughs of how a campaign is meant to work once the backend is connected. Sample figures — not reported results."
      badge={<Badge variant="outline" className="gap-1.5"><TrendingUp className="w-3.5 h-3.5" /> Illustrative</Badge>}
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Case Studies' }]}
    >

      {/* Truth label (t_913bf909). No campaign has ever run on Tadbuy: there is no
          backend and no settlement in this build (see /beta), and /pitch shows every
          campaign counter as "—". Without this line the cards read as reported results
          from named brands. Keep it above the cards. */}
      <p className="text-xs text-muted leading-relaxed border border-border rounded-xl p-3 bg-surface">
        <strong className="text-text">Sample content — nothing here is a reported result.</strong> No campaign has run
        on Tadbuy yet: this build has no backend and no settlement (see{' '}
        <Link to="/beta" className="text-accent hover:underline">BETA status</Link>), so no brand is named below and no
        figure below was measured. Each card shows the shape of a campaign a brand would run; treat every number as a
        sample.
      </p>

      {CASE_STUDIES.map(study => (
        <Card key={study.id} className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <CardTitle>{study.brand}</CardTitle>
              <p className="text-xs text-accent font-semibold mt-1">{study.tagline}</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline">Illustrative — not a real campaign</Badge>
              <Badge variant="default">Sample ROI {study.roi}</Badge>
              <Badge variant="default">Sample CTR {study.ctr}</Badge>
            </div>
          </div>

          <p className="text-sm text-muted leading-relaxed">{study.summary}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-surface border border-border rounded-xl p-3">
              <div className="text-[10px] uppercase font-bold text-muted mb-1 flex items-center gap-1">
                <Zap className="w-3 h-3" /> Budget
              </div>
              <div className="text-sm font-extrabold text-accent">{study.budget}</div>
              <div className="text-[10px] text-muted">{study.budgetSats}</div>
            </div>
            {study.results.map(r => (
              <div key={r.label} className="bg-surface border border-border rounded-xl p-3">
                <div className="text-[10px] uppercase font-bold text-muted mb-1">{r.label}</div>
                <div className="text-sm font-extrabold">{r.value}</div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Users className="w-3.5 h-3.5 text-muted" />
            {study.platforms.map(p => {
              const href = platformGuideHref(p);
              return href ? (
                <Link key={p} to={href} className="text-[10px] font-bold bg-accent/10 text-accent border border-accent/20 px-2 py-0.5 rounded hover:underline">
                  {p}
                </Link>
              ) : (
                <span key={p} className="text-[10px] font-bold bg-accent/10 text-accent border border-accent/20 px-2 py-0.5 rounded">{p}</span>
              );
            })}
          </div>
        </Card>
      ))}

      <div className="text-center pt-4">
        <Link to="/">
          <Button className="inline-flex items-center gap-2">
            Start your campaign <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </PageShell>
  );
}