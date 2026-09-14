import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Zap, Globe, Shield, Sparkles } from 'lucide-react';
import { Button } from './ui';
import { StatCard } from './ui/StatCard';
import { Badge } from './ui/Badge';

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-surface to-card mb-8">
      <div className="absolute inset-0 pointer-events-none">
        <div className="hero-jewel-orbit" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(244,114,182,0.08),transparent_50%)]" />
      </div>

      <div className="relative px-5 py-10 md:px-12 md:py-14 grid md:grid-cols-2 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="accent" dot className="mb-5 normal-case tracking-normal text-[11px] px-3 py-1">
            <Sparkles className="w-3 h-3" />
            Bitcoin-Native DSP
          </Badge>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.1] mb-4">
            Buy ads with{' '}
            <span className="bg-gradient-to-r from-accent via-fuchsia-300 to-accent bg-clip-text text-transparent" data-tip="Tadbuy coordinates transparent campaign placements. Vendors control their channels, and advertisers keep a clear proof trail.">
              Bitcoin
            </span>
            .<br className="hidden sm:block" />
            Pay in sats, not surveillance.
          </h1>

          <p className="text-sm md:text-base text-muted leading-relaxed max-w-lg mb-6">
            Start with Nostr, websites, newsletters, and podcasts. Vendors control their channels; Tadbuy coordinates the plan and proof.
            Pay in sats when settlement is connected.
          </p>

          <div className="flex flex-wrap gap-3">
            <a href="#campaign-builder" className="inline-flex">
              <Button size="lg" className="gap-2">
                <Zap className="w-4 h-4" />
                Start Campaign
              </Button>
            </a>
            <Link to="/marketplace">
              <Button variant="secondary" size="lg" className="gap-2">
                <Globe className="w-4 h-4" />
                Browse Marketplace
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="hidden md:grid grid-cols-2 gap-3"
        >
          {[
            { icon: Zap, label: 'Lightning', value: '<1s', sub: 'settlement', color: 'text-lightning', tip: 'Settlement over Bitcoin Lightning is near-instant — your campaign goes live and your budget settles in under a second, not days.' },
            { icon: Globe, label: 'Channels', value: '4', sub: 'Phase 1', color: 'text-blue', tip: 'Start with Nostr, websites, newsletters, and podcasts. More channels arrive only when vendor relationships, provider access, and reporting are ready.' },
            { icon: Shield, label: 'Privacy', value: '0', sub: 'tracking pixels', color: 'text-green', tip: 'No tracking pixels, no cross-site fingerprinting, no data resale. Your campaign and your audience stay private — that is the product.' },
            { icon: Sparkles, label: 'AI', value: 'PPQ', sub: 'optimization', color: 'text-purple', tip: 'Pays-Per-Qualified-view: the AI strategist helps you target the audience that actually converts — not vanity impressions.' },
          ].map((stat) => (
            <div key={stat.label} data-tip={stat.tip}>
              <StatCard icon={stat.icon} label={stat.label} value={stat.value} sub={stat.sub} color={stat.color} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}