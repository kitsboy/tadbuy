import { Search, X, LayoutPanelLeft, Map, List, SlidersHorizontal } from 'lucide-react';
import { Button, Input, Select } from '@/components/ui';

import { Slider } from '@/components/ui/Slider';
import { GEO_REGIONS, type GeoRegion } from '@/data/geoMarkets';
import type { GeoSortKey, GeoViewMode } from '@/hooks/useGeoPage';
import { cn } from '@/lib/utils';

type GeoFiltersBarProps = {
  search: string;
  onSearchChange: (v: string) => void;
  region: GeoRegion;
  onRegionChange: (v: GeoRegion) => void;
  sortKey: GeoSortKey;
  onSortChange: (v: GeoSortKey) => void;
  minCtr: number;
  onMinCtrChange: (v: number) => void;
  viewMode: GeoViewMode;
  onViewModeChange: (v: GeoViewMode) => void;
  onClearFilters: () => void;
  hasActiveFilters?: boolean;
};

const SORT_OPTIONS: { value: GeoSortKey; label: string }[] = [
  { value: 'impressions', label: 'Impressions' },
  { value: 'ctr', label: 'CTR' },
  { value: 'spend', label: 'Spend' },
  { value: 'trend', label: 'Trend' },
  { value: 'name', label: 'Name' },
];

const VIEW_MODES: { value: GeoViewMode; icon: typeof Map; label: string }[] = [
  { value: 'split', icon: LayoutPanelLeft, label: 'Split view' },
  { value: 'map', icon: Map, label: 'Map view' },
  { value: 'list', icon: List, label: 'List view' },
];

export function GeoFiltersBar({
  search,
  onSearchChange,
  region,
  onRegionChange,
  sortKey,
  onSortChange,
  minCtr,
  onMinCtrChange,
  viewMode,
  onViewModeChange,
  onClearFilters,
  hasActiveFilters,
}: GeoFiltersBarProps) {
  const active = hasActiveFilters ?? (search.trim() !== '' || region !== 'all' || minCtr > 0 || sortKey !== 'impressions');

  return (
    <div className="sticky top-0 z-20 -mx-4 px-4 py-3 md:static md:mx-0 md:px-0 md:py-0 bg-bg/95 backdrop-blur-md border-b border-border md:bg-transparent md:backdrop-blur-none md:border-0 pb-safe">
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
            <Input
              value={search}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Search countries..."
              className="pl-9 min-h-[44px] touch-manipulation"
              aria-label="Search markets"
            />
          </div>
          <div className="flex gap-2">
            <Select
              value={sortKey}
              onChange={e => onSortChange(e.target.value as GeoSortKey)}
              className="min-h-[44px] w-full sm:w-40 touch-manipulation"
              aria-label="Sort markets"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </Select>
            <div
              className="flex items-center gap-0.5 p-1 rounded-xl bg-surface border border-border shrink-0"
              role="group"
              aria-label="View mode"
            >
              {VIEW_MODES.map(({ value, icon: Icon, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => onViewModeChange(value)}
                  className={cn(
                    'p-2.5 rounded-lg transition-all touch-target touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center',
                    viewMode === value
                      ? 'bg-card text-accent border border-border shadow-sm'
                      : 'text-muted hover:text-text hover:bg-card/50'
                  )}
                  aria-label={label}
                  aria-pressed={viewMode === value}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="md:hidden overflow-x-auto -mx-1 px-1 scrollbar-none">
          <div
            className="inline-flex items-center gap-1 p-1 rounded-xl bg-surface border border-border min-w-max"
            role="tablist"
            aria-label="Filter by region"
          >
            {GEO_REGIONS.map(r => (
              <button
                key={r.id}
                type="button"
                role="tab"
                aria-selected={region === r.id}
                onClick={() => onRegionChange(r.id)}
                className={cn(
                  'px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap min-h-[44px] touch-manipulation',
                  region === r.id
                    ? 'bg-card text-text shadow-sm border border-border'
                    : 'text-muted hover:text-text hover:bg-card/50'
                )}
              >
                <span className="mr-1">{r.icon}</span>
                {r.id === 'all' ? 'All' : r.label.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted uppercase tracking-wider shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Region
          </div>
          <Select
            value={region}
            onChange={e => onRegionChange(e.target.value as GeoRegion)}
            className="w-48 min-h-[44px] touch-manipulation"
            aria-label="Filter by region"
          >
            {GEO_REGIONS.map(r => (
              <option key={r.id} value={r.id}>{r.icon} {r.label}</option>
            ))}
          </Select>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end gap-3">
          <Slider
            min={0}
            max={20}
            value={Math.round(minCtr * 10)}
            onChange={v => onMinCtrChange(v / 10)}
            label={`Min CTR: ${minCtr.toFixed(1)}%`}
            className="flex-1"
          />
          {active && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="gap-1.5 min-h-[44px] touch-target touch-manipulation shrink-0"
            >
              <X className="w-4 h-4" />
              Clear filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}