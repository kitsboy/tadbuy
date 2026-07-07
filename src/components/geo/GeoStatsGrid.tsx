import { Globe, TrendingUp, Target, Users, Zap, BarChart2 } from 'lucide-react';
import { StatCard } from '@/components/ui/index';
import { Skeleton } from '@/components/ui/Skeleton';
import type { GeoMarket } from '@/data/geoMarkets';

type GeoTotals = {
  countries: number;
  impressions: number;
  ctr: number;
  spendSats: number;
  campaigns: number;
};

type GeoStatsGridProps = {
  totals: GeoTotals;
  topMarket: GeoMarket;
  loading?: boolean;
};

export function GeoStatsGrid({ totals, topMarket, loading }: GeoStatsGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
      <StatCard icon={Globe} label="Countries" value={totals.countries} color="text-blue" />
      <StatCard
        icon={TrendingUp}
        label="Impressions"
        value={totals.impressions.toLocaleString()}
        color="text-accent"
      />
      <StatCard
        icon={Users}
        label="Global CTR"
        value={`${totals.ctr.toFixed(2)}%`}
        color="text-purple-400"
      />
      <StatCard
        icon={Target}
        label="Top Market"
        value={topMarket.country}
        sub={`${topMarket.code} · ${topMarket.flag}`}
        color="text-green"
      />
      <StatCard
        icon={Zap}
        label="Total Spend"
        value={totals.spendSats.toLocaleString()}
        sub="sats"
        color="text-lightning"
      />
      <StatCard
        icon={BarChart2}
        label="Active Campaigns"
        value={totals.campaigns}
        color="text-accent"
      />
    </div>
  );
}