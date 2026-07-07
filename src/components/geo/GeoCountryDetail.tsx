import { Link } from 'react-router-dom';
import {
  Target, Plus, Clock, Languages, TrendingUp, BarChart2, Zap, Users,
} from 'lucide-react';
import { Button } from '@/components/ui';
import { Badge } from '@/components/ui/index';
import { EmptyState } from '@/components/ui/EmptyState';
import { MapPin } from 'lucide-react';
import type { GeoMarket } from '@/data/geoMarkets';

type GeoCountryDetailProps = {
  market: GeoMarket | null;
  onAddToCampaign?: (code: string) => void;
};

const BTC_VARIANTS = {
  high: 'success',
  medium: 'warning',
  low: 'outline',
} as const;

const TARGETING_VARIANTS = {
  active: 'success',
  paused: 'warning',
  available: 'info',
} as const;

const TARGETING_LABELS = {
  active: 'Active targeting',
  paused: 'Paused',
  available: 'Available',
} as const;

export function GeoCountryDetail({ market, onAddToCampaign }: GeoCountryDetailProps) {
  if (!market) {
    return (
      <EmptyState
        icon={MapPin}
        title="Select a market"
        description="Tap a country in the list or on the map to view detailed stats and targeting options."
        className="py-16 px-4"
      />
    );
  }

  const stats = [
    { icon: BarChart2, label: 'Impressions', value: market.impressions.toLocaleString() },
    { icon: Users, label: 'CTR', value: `${market.ctr}%` },
    { icon: Zap, label: 'Spend', value: `${market.spendSats.toLocaleString()} sats` },
    { icon: TrendingUp, label: 'Trend', value: `${market.trend >= 0 ? '+' : ''}${market.trend}%` },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-4 border-b border-border">
        <div className="flex items-start gap-3">
          <span className="text-3xl" aria-hidden>{market.flag}</span>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-extrabold text-text truncate">{market.country}</h2>
            <p className="text-xs font-mono text-muted mt-0.5">{market.code} · {market.priority}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <Badge variant={BTC_VARIANTS[market.btcAdoption]}>
                BTC {market.btcAdoption}
              </Badge>
              <Badge variant={TARGETING_VARIANTS[market.targeting]} dot>
                {TARGETING_LABELS[market.targeting]}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        <div className="grid grid-cols-2 gap-3">
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="glass-panel rounded-xl p-3">
              <Icon className="w-4 h-4 text-accent mb-2" />
              <div className="text-sm font-extrabold tabular-nums">{value}</div>
              <div className="text-[10px] text-muted uppercase tracking-wider font-bold mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <Languages className="w-4 h-4 text-muted mt-0.5 shrink-0" />
            <div>
              <div className="text-[10px] font-bold text-muted uppercase tracking-wider">Languages</div>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {market.languages.map(lang => (
                  <Badge key={lang} variant="outline" className="normal-case tracking-normal">{lang}</Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Clock className="w-4 h-4 text-muted mt-0.5 shrink-0" />
            <div>
              <div className="text-[10px] font-bold text-muted uppercase tracking-wider">Timezone</div>
              <p className="text-xs text-text font-mono mt-1">{market.timezone.replace(/_/g, ' ')}</p>
            </div>
          </div>

          <div className="text-[10px] text-muted font-mono space-y-1 pt-2 border-t border-border">
            <div className="flex justify-between">
              <span>Campaigns</span>
              <span className="text-text">{market.campaigns}</span>
            </div>
            <div className="flex justify-between">
              <span>CPM</span>
              <span className="text-text">${market.cpmUsd.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Population reach</span>
              <span className="text-text">{(market.populationReach / 1_000_000).toFixed(1)}M</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 border-t border-border bg-surface/20 space-y-2">
        <Link to={`/?geo=${market.code}`} className="block">
          <Button variant="primary" className="w-full gap-2 min-h-[44px] touch-target touch-manipulation">
            <Target className="w-4 h-4" />
            Target this market
          </Button>
        </Link>
        <Button
          variant="outline"
          className="w-full gap-2 min-h-[44px] touch-target touch-manipulation"
          onClick={() => onAddToCampaign?.(market.code)}
        >
          <Plus className="w-4 h-4" />
          Add to campaign
        </Button>
      </div>
    </div>
  );
}