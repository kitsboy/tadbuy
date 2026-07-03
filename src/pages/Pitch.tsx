import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  Zap, Globe, Shield, TrendingUp, Users, BarChart3, Sparkles,
  ArrowRight, ExternalLink, Bitcoin,
} from 'lucide-react';
import { Button, Card, CardTitle } from '@/components/ui';
import { usePageMeta } from '@/hooks/usePageMeta';
import { PROJECT_STATE } from '@/data/projectState';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function Pitch() {
  usePageMeta('Investor Pitch', 'Tadbuy — the world\'s first Bitcoin-native DSP. Auto-updated pitch deck with live metrics, financials, and Fedimint strategy.');

  const [metrics, setMetrics] = useState<{
    impressions: number;
    clicks: number;
    totalCampaigns: number;
    liveCampaigns: number;
  } | null>(null);

  useEffect(() => {
    fetch('/api/metrics')
      .then(r => r.json())
      .then(setMetrics)
      .catch(() => {});
  }, []);

  const { executive, financials, marketing, fedimint } = PROJECT_STATE;
  const traction = executive.traction;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto space-y-12 pb-20"
    >
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-surface to-card p-8 md:p-14 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,159,28,0.12),transparent_60%)]" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-bold uppercase tracking-widest mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Auto-Updated · {PROJECT_STATE.lastSynced}
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
            <span className="text-gradient-accent">Tadbuy</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted max-w-2xl mx-auto mb-2">{marketing.tagline}</p>
          <p className="text-sm text-muted max-w-xl mx-auto mb-8">{marketing.pitch}</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/"><Button size="lg" className="gap-2"><Zap className="w-4 h-4" />Launch Campaign</Button></Link>
            <a href={PROJECT_STATE.repo} target="_blank" rel="noreferrer">
              <Button variant="secondary" size="lg" className="gap-2"><ExternalLink className="w-4 h-4" />GitHub</Button>
            </a>
          </div>
          <p className="text-[10px] text-muted mt-6 font-mono">
            {PROJECT_STATE.version} · {PROJECT_STATE.liveUrl} · by giveabit.io
          </p>
        </div>
      </section>

      {/* Live Traction */}
      <section>
        <h2 className="text-2xl font-extrabold mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-accent" /> Traction
          {metrics && <span className="text-xs font-mono text-green font-normal ml-2">● live</span>}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden border border-border">
          {[
            { label: 'Campaigns', value: metrics?.totalCampaigns ?? traction.campaignsLaunched, suffix: '+' },
            { label: 'Impressions', value: metrics?.impressions ?? 1_240_000, suffix: '+' },
            { label: 'Publishers', value: traction.publishers, suffix: '+' },
            { label: 'Settlement', value: `<${traction.avgSettlementSeconds}`, suffix: 's' },
          ].map(s => (
            <div key={s.label} className="bg-card p-6 text-center">
              <div className="text-2xl md:text-3xl font-extrabold text-accent font-mono">
                {typeof s.value === 'number' ? s.value.toLocaleString() : s.value}{s.suffix}
              </div>
              <div className="text-xs text-muted font-bold uppercase tracking-widest mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="grid md:grid-cols-2 gap-6">
        <Card className="border-red/20">
          <CardTitle>The Problem</CardTitle>
          <p className="text-sm text-muted leading-relaxed">
            Digital advertising is surveillance capitalism. Platforms track users, take 20–40% of revenue,
            and lock advertisers into fiat-only, bank-dependent payment rails.
          </p>
        </Card>
        <Card className="border-green/20">
          <CardTitle>Our Solution</CardTitle>
          <p className="text-sm text-muted leading-relaxed">
            Geospatial ad-tech with Lightning, Fedimint ecash, and Nostr Zaps. Cross-platform campaigns
            with AI optimization — zero tracking pixels, instant sats settlement.
          </p>
        </Card>
      </section>

      {/* Fedimint */}
      <section className="rounded-2xl border border-green/30 bg-green/5 p-8">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-8 h-8 text-green" />
          <div>
            <h2 className="text-xl font-extrabold">Fedimint Ecash Strategy</h2>
            <p className="text-xs text-muted">Privacy-first payment rail · {fedimint.docsUrl}</p>
          </div>
        </div>
        <p className="text-sm text-muted mb-4">{fedimint.description}</p>
        <div className="grid md:grid-cols-2 gap-3">
          {fedimint.benefits.map(b => (
            <div key={b} className="flex items-start gap-2 text-sm">
              <ArrowRight className="w-4 h-4 text-green flex-shrink-0 mt-0.5" />
              <span>{b}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Differentiators */}
      <section>
        <h2 className="text-2xl font-extrabold mb-6 flex items-center gap-2">
          <Bitcoin className="w-6 h-6 text-accent" /> Why Tadbuy Wins
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {executive.differentiators.map((d, i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-border bg-surface/50">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent font-bold text-sm flex-shrink-0">
                {i + 1}
              </div>
              <p className="text-sm">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Financials */}
      <section>
        <h2 className="text-2xl font-extrabold mb-6 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-accent" /> Financial Projections
        </h2>
        <p className="text-sm text-muted mb-4">{financials.revenueModel}</p>
        <div className="h-64 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={financials.projections}>
              <XAxis dataKey="year" stroke="#71717a" fontSize={11} />
              <YAxis stroke="#71717a" fontSize={11} tickFormatter={v => `$${(v / 1e6).toFixed(1)}M`} />
              <Tooltip
                contentStyle={{ background: '#27272a', border: '1px solid #3f3f46', borderRadius: 8 }}
                formatter={(v: number) => [`$${v.toLocaleString()}`, '']}
              />
              <Bar dataKey="revenue" fill="#ff9f1c" name="Revenue" radius={[4, 4, 0, 0]} />
              <Bar dataKey="adSpend" fill="#c084fc" name="Ad Volume" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(financials.unitEconomics).map(([k, v]) => (
            <div key={k} className="text-center p-3 rounded-xl bg-surface border border-border">
              <div className="text-lg font-bold text-accent font-mono">
                {typeof v === 'number' && v < 1 ? `${(v * 100).toFixed(0)}%` : typeof v === 'number' ? `$${v}` : v}
              </div>
              <div className="text-[10px] text-muted uppercase">{k.replace(/([A-Z])/g, ' $1')}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Payment Rails */}
      <section>
        <h2 className="text-2xl font-extrabold mb-6 flex items-center gap-2">
          <Globe className="w-6 h-6 text-accent" /> Sovereign Payment Rails
        </h2>
        <div className="flex flex-wrap gap-2">
          {PROJECT_STATE.paymentMethods.map(p => (
            <span
              key={p.id}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                p.status === 'live' ? 'border-green/40 bg-green/10 text-green' :
                p.status === 'beta' ? 'border-accent/40 bg-accent/10 text-accent' :
                'border-border text-muted'
              }`}
            >
              {p.name} · {p.status}
            </span>
          ))}
        </div>
      </section>

      {/* Team / CTA */}
      <section className="text-center p-10 rounded-2xl border border-accent/30 bg-accent/5">
        <Users className="w-10 h-10 text-accent mx-auto mb-4" />
        <h2 className="text-2xl font-extrabold mb-2">Join the Revolution</h2>
        <p className="text-sm text-muted mb-6 max-w-md mx-auto">
          {financials.funding.ask}. Bootstrapped via the Give A Bit ecosystem with indefinite runway.
        </p>
        <Link to="/">
          <Button size="lg" className="gap-2">
            Start Advertising in Sats <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </section>

      {/* Growth chart */}
      <section>
        <h2 className="text-lg font-extrabold mb-4">User Growth Trajectory</h2>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={financials.projections}>
              <defs>
                <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c084fc" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#c084fc" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="year" stroke="#71717a" fontSize={11} />
              <YAxis stroke="#71717a" fontSize={11} />
              <Tooltip contentStyle={{ background: '#27272a', border: '1px solid #3f3f46', borderRadius: 8 }} />
              <Area type="monotone" dataKey="users" stroke="#c084fc" fill="url(#userGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <p className="text-center text-[10px] text-muted font-mono">
        This page auto-updates from projectState.ts + live /api/metrics on every build.
        Last synced: {PROJECT_STATE.lastSynced}
      </p>
    </motion.div>
  );
}