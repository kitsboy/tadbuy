import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import {  Zap, Globe, Shield, TrendingUp, Users, BarChart3, Sparkles,
  ArrowRight, ExternalLink, Bitcoin,
} from 'lucide-react';
import { Button, Card, CardTitle } from '@/components/ui';
import { usePageMeta } from '@/hooks/usePageMeta';
import { PROJECT_STATE } from '@/data/projectState';
import { SafeLink } from '@/components/SafeLink';
import { ArtRocket } from '@/components/illustrations';

export default function Pitch() {
  usePageMeta('Investor Pitch', 'Tadbuy — a Bitcoin-native advertising marketplace connecting advertisers with independent distributors and transparent delivery proof.');

  const { executive, financials, marketing, fedimint } = PROJECT_STATE;

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
            {/* Not "Auto-Updated": nothing regenerates this page with new numbers.
                The release version is machine-written by scripts/sync-version.ts
                on every build, so it is the one freshness marker that is true. */}
            Static snapshot · {PROJECT_STATE.version}
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
            <span className="text-gradient-accent">Tadbuy</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted max-w-2xl mx-auto mb-2">{marketing.tagline}</p>
          <p className="text-sm text-muted max-w-xl mx-auto mb-8">{marketing.pitch}</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/"><Button size="lg" className="gap-2"><Zap className="w-4 h-4" />Plan a campaign preview</Button></Link>
            <SafeLink href={PROJECT_STATE.repo} target="_blank" showIcon>
              <Button variant="secondary" size="lg" className="gap-2"><ExternalLink className="w-4 h-4" />GitHub</Button>
            </SafeLink>
          </div>
          <p className="text-[10px] text-muted mt-6 font-mono">
            {PROJECT_STATE.version} · {PROJECT_STATE.liveUrl} · by giveabit.io
          </p>
          <div aria-hidden className="pointer-events-none mx-auto mt-8 hidden w-fit select-none md:block">
            <ArtRocket className="opacity-90" />
          </div>
        </div>
      </section>

      {/* Live Traction — live-only. No static fallback: the platform has no /api/metrics
          backend on the static host, so these show "—", never an estimate. */}
      <section>
        <h2 className="text-2xl font-extrabold mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-accent" /> Traction
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden border border-border">
          {[
            { label: 'Campaigns', value: '—' },
            { label: 'Impressions', value: '—' },
            { label: 'Publishers', value: '—' },
            { label: 'Settlement', value: '—' },
          ].map(s => (
            <div key={s.label} className="bg-card p-6 text-center">
              <div className="text-2xl md:text-3xl font-extrabold text-accent font-mono">
                {s.value}
              </div>
              <div className="text-xs text-muted font-bold uppercase tracking-widest mt-1">{s.label}</div>
            </div>
          ))}
        </div>
        <p className="text-center text-[10px] text-muted font-mono mt-3">
          Live counters only. Unmeasured metrics show “—” — no estimates are published.
        </p>
      </section>

      {/* Problem / Solution */}
      <section className="grid md:grid-cols-2 gap-6">
        <Card className="border-red/20">
          <CardTitle>The Problem — product thesis</CardTitle>
          <p className="text-sm text-muted leading-relaxed">
            Tadbuy&apos;s product thesis is that advertisers and independent publishers need
            transparent placement coordination, privacy-respecting measurement, and a future
            Bitcoin-native settlement option. Provider fees and market claims require current
            independent evidence.
          </p>
        </Card>
        <Card className="border-green/20">
          <CardTitle>Our Solution</CardTitle>
          <p className="text-sm text-muted leading-relaxed">
            Tadbuy is being prepared to coordinate independent placements and show delivery evidence. The current build has no approved live inventory, payment service, or campaign activation; provider APIs and automated buying remain later phases.
          </p>
        </Card>
      </section>

      {/* Fedimint */}
      <section className="rounded-2xl border border-border bg-surface/50 p-8">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-8 h-8 text-green" />
          <div>
            <h2 className="text-xl font-extrabold">Fedimint Ecash Strategy</h2>
            <p className="text-xs text-muted">Privacy-first payment rail · {fedimint.docsUrl}</p>
          </div>
        </div>
        <p className="text-sm text-muted mb-4">{fedimint.description}</p>
        <p className="text-xs text-muted mb-4">
          <strong className="text-text">Strategy only — not settling.</strong> No Tadbuy payment rail
          is connected. A future mint or synced node alone would not establish payment verification,
          ledger reconciliation, or launch approval.{' '}
          <Link to="/beta" className="text-accent hover:underline">Readiness status →</Link>
        </p>
        <div className="grid md:grid-cols-2 gap-3">
          {fedimint.benefits.map(b => (
            <div key={b} className="flex items-start gap-2 text-sm">
              <ArrowRight className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
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
        <h2 className="text-2xl font-extrabold mb-3 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-accent" /> Financial readiness
        </h2>
        <Card className="border-accent/20">
          <p className="text-sm font-semibold text-text">No validated forecast or unit economics are published.</p>
          <p className="mt-2 text-xs leading-relaxed text-muted">{financials.revenueModel} Revenue, ad-spend, acquisition, retention, and margin assumptions need evidence and owner approval before they are presented as projections.</p>
        </Card>
      </section>

      {/* Payment-rail roadmap; no Tadbuy campaign payment rail is connected. */}
      <section>
        <h2 className="text-2xl font-extrabold mb-2 flex items-center gap-2">
          <Globe className="w-6 h-6 text-accent" /> Sovereign Payment Rails
        </h2>
        <p className="text-xs text-muted mb-4">
          Rails this product is being built around — <strong className="text-text">none settle in this build</strong>.
          A synced Umbrel node is only one prerequisite; payment acceptance also needs an approved service, verified settlement, reconciled ledger, security/operations review, and explicit release approval.{' '}
          <Link to="/beta" className="text-accent hover:underline">See what works →</Link>
        </p>
        <div className="flex flex-wrap gap-2">
          {PROJECT_STATE.paymentMethods.map(p => (
            <span
              key={p.id}
              className="px-3 py-1.5 rounded-full text-xs font-bold border border-border text-muted"
            >
              {p.name}
            </span>
          ))}
        </div>
      </section>

      {/* Team / CTA */}
      <section className="text-center p-10 rounded-2xl border border-accent/30 bg-accent/5">
        <Users className="w-10 h-10 text-accent mx-auto mb-4" />
        <h2 className="text-2xl font-extrabold mb-2">Join the Revolution</h2>
        <p className="text-sm text-muted mb-6 max-w-md mx-auto">
          {financials.funding.ask}. Tadbuy is an early-stage preview; no revenue, runway, or financing claim is made here.
        </p>
        <Link to="/">
          <Button size="lg" className="gap-2">
            Build a campaign preview <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </section>


      <section>
        <h2 className="text-lg font-extrabold mb-4">100-Feature Roadmap Progress</h2>
        <div className="grid md:grid-cols-4 gap-3">
          {Object.entries(PROJECT_STATE.featureBatches).map(([key, batch]) => (
            <div key={key} className="p-4 rounded-xl border border-border bg-surface text-center">
              <div className="text-2xl font-extrabold text-accent">{batch.completed}/{batch.total}</div>
              <div className="text-[10px] text-muted font-bold uppercase mt-1">{batch.label}</div>
            </div>
          ))}
        </div>
      </section>

      <p className="text-center text-[10px] text-muted font-mono">
        Static project snapshot from projectState.ts. Last synced: {PROJECT_STATE.lastSynced}
      </p>
    </motion.div>
  );
}