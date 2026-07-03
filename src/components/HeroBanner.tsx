import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Zap, Globe, Shield, Sparkles } from 'lucide-react';
import { Button } from './ui';

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-surface to-card mb-8">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-72 h-72 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,159,28,0.08),transparent_50%)]" />
      </div>

      <div className="relative px-5 py-10 md:px-12 md:py-14 grid md:grid-cols-2 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-[11px] font-bold uppercase tracking-widest mb-5">
            <Sparkles className="w-3 h-3" />
            Bitcoin-Native DSP
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.1] mb-4">
            Buy ads with{' '}
            <span className="bg-gradient-to-r from-accent via-lightning to-accent bg-clip-text text-transparent">
              Bitcoin
            </span>
            .<br className="hidden sm:block" />
            Pay in sats, not surveillance.
          </h1>

          <p className="text-sm md:text-base text-muted leading-relaxed max-w-lg mb-6">
            Launch cross-platform campaigns on 8 networks. Settle instantly via Lightning,
            BOLT12, on-chain, or Nostr Zaps — with AI-powered creative and geospatial targeting.
          </p>

          <div className="flex flex-wrap gap-3">
            <a href="#campaign-builder">
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
            { icon: Zap, label: 'Lightning', value: '<1s', sub: 'settlement', color: 'text-lightning' },
            { icon: Globe, label: 'Platforms', value: '8', sub: 'networks', color: 'text-blue' },
            { icon: Shield, label: 'Privacy', value: '0', sub: 'tracking pixels', color: 'text-green' },
            { icon: Sparkles, label: 'AI', value: 'PPQ', sub: 'optimization', color: 'text-purple' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="glass-panel rounded-xl p-4 hover:border-accent/30 transition-colors group"
            >
              <stat.icon className={`w-5 h-5 ${stat.color} mb-2 group-hover:scale-110 transition-transform`} />
              <div className="text-2xl font-extrabold tracking-tight">{stat.value}</div>
              <div className="text-[10px] text-muted uppercase tracking-widest font-bold">{stat.label}</div>
              <div className="text-[10px] text-muted/70">{stat.sub}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}