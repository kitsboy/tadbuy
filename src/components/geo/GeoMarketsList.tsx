import { Link } from 'react-router-dom';
import {
  TrendingUp, TrendingDown, Star, Target, Check, Globe,
} from 'lucide-react';
import { Badge } from '@/components/ui/index';
import { EmptyState } from '@/components/ui/EmptyState';
import type { GeoMarket } from '@/data/geoMarkets';
import { cn } from '@/lib/utils';

type GeoMarketsListProps = {
  markets: GeoMarket[];
  selectedCode: string | null;
  watchlist: string[];
  compareCodes: string[];
  onSelect: (code: string) => void;
  onWatchlist: (code: string) => void;
  onCompare: (code: string) => void;
  onTargetMarket?: (code: string) => void;
  maxCompare?: number;
};

export function GeoMarketsList({
  markets,
  selectedCode,
  watchlist,
  compareCodes,
  onSelect,
  onWatchlist,
  onCompare,
  onTargetMarket,
  maxCompare = 3,
}: GeoMarketsListProps) {
  const maxImpressions = markets[0]?.impressions ?? 1;

  if (!markets.length) {
    return (
      <EmptyState
        icon={Globe}
        title="No markets match"
        description="Try adjusting your filters or search query."
        className="py-12"
      />
    );
  }

  return (
    <div className="flex-1 overflow-y-auto divide-y divide-border" role="listbox" aria-label="Markets">
      {markets.map((market, i) => {
        const barWidth = (market.impressions / maxImpressions) * 100;
        const isSelected = selectedCode === market.code;
        const isWatched = watchlist.includes(market.code);
        const isCompared = compareCodes.includes(market.code);
        const compareFull = compareCodes.length >= maxCompare && !isCompared;

        return (
          <div
            key={market.code}
            role="option"
            aria-selected={isSelected}
            className={cn(
              'px-3 md:px-4 py-3 hover:bg-surface/30 transition-colors relative group cursor-pointer touch-manipulation',
              isSelected && 'bg-accent/5'
            )}
            onClick={() => onSelect(market.code)}
          >
            <div
              className="absolute inset-y-0 left-0 bg-accent/5 group-hover:bg-accent/8 transition-all pointer-events-none"
              style={{ width: `${barWidth}%` }}
            />
            <div className="relative flex items-center gap-2 md:gap-3">
              <span className="text-muted text-[10px] font-mono w-4 text-right shrink-0">
                {i + 1}
              </span>

              <Badge variant="outline" className="normal-case tracking-normal shrink-0 hidden sm:inline-flex">
                {market.flag} {market.code}
              </Badge>
              <span className="text-base sm:hidden shrink-0" aria-hidden>{market.flag}</span>

              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-text truncate">{market.country}</div>
                <div className="text-[10px] text-muted font-mono">
                  {market.impressions.toLocaleString()} imp
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-mono text-accent">{market.ctr}%</div>
                  <div className="text-[10px] text-muted">CTR</div>
                </div>

                <div
                  className={cn(
                    'flex items-center gap-0.5 text-[10px] font-bold font-mono',
                    market.trend >= 0 ? 'text-green' : 'text-red'
                  )}
                  title={`${market.trend >= 0 ? '+' : ''}${market.trend}% trend`}
                >
                  {market.trend >= 0
                    ? <TrendingUp className="w-3 h-3" />
                    : <TrendingDown className="w-3 h-3" />}
                  <span className="hidden sm:inline">{Math.abs(market.trend).toFixed(1)}%</span>
                </div>

                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); onWatchlist(market.code); }}
                  className="p-2 rounded-lg hover:bg-surface border border-transparent hover:border-border transition-colors touch-target touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label={isWatched ? `Remove ${market.country} from watchlist` : `Add ${market.country} to watchlist`}
                  aria-pressed={isWatched}
                >
                  <Star className={cn('w-4 h-4', isWatched ? 'fill-lightning text-lightning' : 'text-muted')} />
                </button>

                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); if (!compareFull) onCompare(market.code); }}
                  disabled={compareFull}
                  className={cn(
                    'p-2 rounded-lg border transition-colors touch-target touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center',
                    isCompared
                      ? 'bg-accent/15 border-accent/40 text-accent'
                      : 'border-transparent hover:bg-surface hover:border-border text-muted',
                    compareFull && 'opacity-40 cursor-not-allowed'
                  )}
                  aria-label={isCompared ? `Remove ${market.country} from compare` : `Compare ${market.country}`}
                  aria-pressed={isCompared}
                >
                  <Check className="w-4 h-4" />
                </button>

                <Link
                  to={`/?geo=${market.code}`}
                  onClick={e => {
                    e.stopPropagation();
                    onTargetMarket?.(market.code);
                  }}
                  className="p-2 rounded-lg hover:bg-accent/10 border border-transparent hover:border-accent/30 text-accent transition-colors touch-target touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label={`Target ${market.country}`}
                >
                  <Target className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}