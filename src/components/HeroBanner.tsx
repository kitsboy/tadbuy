import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Zap, Globe, Activity, ShieldAlert, Sparkles } from 'lucide-react';
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
            Campaign preview · payments disabled
          </Badge>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.1] mb-4">
            Plan Bitcoin-first ads.<br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-accent via-fuchsia-300 to-accent bg-clip-text text-transparent">
              No surveillance.
            </span>
          </h1>

          <p className="text-sm md:text-base text-muted leading-relaxed max-w-lg mb-6">
            Build a campaign preview and explore sample placements. Nostr notes can be published with your own signer; payment, vendor orders, and campaign delivery are not connected in this build.
          </p>

          <div className="flex flex-wrap gap-3">
            <a href="#campaign-builder" className="inline-flex">
              <Button size="lg" className="gap-2">
                <Zap className="w-4 h-4" />
                Build campaign preview
              </Button>
            </a>
            <Link to="/marketplace">
              <Button variant="secondary" size="lg" className="gap-2">
                <Globe className="w-4 h-4" />
                Explore sample placements
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
            { icon: ShieldAlert, label: 'Payments', value: 'Off', sub: 'no rail connected', color: 'text-accent', tip: 'This preview cannot create or verify a Tadbuy payment. Bitcoin and Lightning rails are not connected.' },
            { icon: Globe, label: 'Inventory', value: 'Sample', sub: 'no live vendors', color: 'text-blue', tip: 'Marketplace listings are illustrative concepts. No publisher supply is approved or available for purchase.' },
            { icon: Activity, label: 'Reporting', value: 'Offline', sub: 'no metrics API', color: 'text-muted', tip: 'No campaign impression, click, conversion, or spend records are connected to this preview.' },
            { icon: Zap, label: 'Nostr', value: 'Signer', sub: 'user-initiated', color: 'text-purple', tip: 'You may publish a signed Nostr note through your own browser signer. A relay acknowledgement is not proof of reach or payment.' },
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