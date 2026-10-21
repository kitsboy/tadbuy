import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Globe, AlertCircle, ChevronDown, BarChart3, HelpCircle } from 'lucide-react';
import { WorldMap } from '@/components/WorldMap';
import { Card } from '@/components/ui';
import { Badge, Alert, Tabs, TabsList, TabsTrigger, TabsContent, EmptyState } from '@/components/ui/index';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useGeoPage } from '@/hooks/useGeoPage';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { GeoPageHeader } from '@/components/geo/GeoPageHeader';
import { GeoStatsGrid } from '@/components/geo/GeoStatsGrid';
import { GeoFiltersBar } from '@/components/geo/GeoFiltersBar';
import { GeoMarketsList } from '@/components/geo/GeoMarketsList';
import { GeoCountryDetail } from '@/components/geo/GeoCountryDetail';
import { GeoInsightsPanel } from '@/components/geo/GeoInsightsPanel';
import { GeoTargetingModal } from '@/components/geo/GeoTargetingModal';
import { PreviewReadinessPanel } from '@/components/PreviewReadinessPanel';
import { GeoExportBar } from '@/components/geo/GeoExportBar';
import { GEO_MARKETS } from '@/data/geoMarkets';
import { cn } from '@/lib/utils';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

const FAQ = [
  { q: 'How does geo-targeting work?', a: 'You can add example countries or regions to a local campaign draft. No audience segment, bidding, vendor selection, or delivery is activated in this preview.' },
  { q: 'Can I plan for multiple countries?', a: 'Yes. Add example markets to a local draft; budget weights and platform delivery are not applied.' },
  { q: 'What about El Salvador?', a: 'It appears in the illustrative market dataset only. Tadbuy has no verified country inventory, audience data, or market performance.' },
  { q: 'Is this live data?', a: 'No. Market figures are static examples in this build. Refresh does not fetch a live geo analytics API.' },
];

function GeoSpendChart({ markets }: { markets: typeof GEO_MARKETS }) {
  const data = useMemo(
    () => markets.slice(0, 8).map(m => ({ name: m.code, spend: m.spendUsd, fill: '#ff9f1c' })),
    [markets]
  );
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-4 h-4 text-accent" />
        <span className="text-sm font-bold">Example spend by market (USD)</span>
      </div>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#27272a', border: '1px solid #3f3f46', borderRadius: 8, fontSize: 12 }}
              formatter={(v: number) => [`$${v}`, 'Example spend']}
            />
            <Bar dataKey="spend" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function GeoCompareTable({ codes, markets }: { codes: string[]; markets: typeof GEO_MARKETS }) {
  const rows = codes.map(c => markets.find(m => m.code === c)).filter(Boolean);
  if (!rows.length) return null;
  return (
    <Card className="p-4 overflow-x-auto">
      <h3 className="text-sm font-bold mb-3">Example market comparison</h3>
      <table className="w-full text-xs">
        <thead>
          <tr className="text-muted border-b border-border">
            <th className="text-left py-2 pr-4">Example market</th>
            <th className="text-right py-2 px-2">Sample impressions</th>
            <th className="text-right py-2 px-2">Sample CTR</th>
            <th className="text-right py-2 px-2">Sample trend</th>
            <th className="text-right py-2 pl-2">Example spend</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(m => m && (
            <tr key={m.code} className="border-b border-border/50">
              <td className="py-2.5 pr-4 font-medium">{m.flag} {m.country}</td>
              <td className="text-right py-2.5 px-2 font-mono text-accent">{m.impressions.toLocaleString()}</td>
              <td className="text-right py-2.5 px-2 font-mono">{m.ctr}%</td>
              <td className="text-right py-2.5 px-2 font-mono text-green">{m.trend > 0 ? '+' : ''}{m.trend}% sample</td>
              <td className="text-right py-2.5 pl-2 font-mono">${m.spendUsd}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

export default function GeoTargeting() {
  usePageMeta(
    'Global Reach — Geo Planning',
    'Explore illustrative market-planning examples. This page has no live campaign or audience reporting and does not activate targeting.'
  );

  const geo = useGeoPage();
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useMediaQuery('(max-width: 767px)');

  const topMarket = geo.apiStats?.topMarket ?? geo.filtered[0] ?? GEO_MARKETS[0];
  const mapData = geo.filtered.map(m => ({
    country: m.country,
    code: m.code,
    impressions: m.impressions,
    clicks: m.clicks,
    campaigns: m.campaigns,
  }));

  const hasActiveFilters = geo.region !== 'all' || geo.search.trim() !== '' || geo.minCtr > 0;

  const showMap = geo.viewMode !== 'list';
  const showList = geo.viewMode !== 'map';

  return (
    <div className="space-y-6 pb-safe px-safe print:space-y-4" id="geo-page">
      <GeoPageHeader marketCount={geo.allMarkets.length} />

      <PreviewReadinessPanel compact />
      <Alert variant="info" title="Static example market data" className="geo-sample-data-notice">
        The map, country figures, spending, CTR, campaigns, and trends below are illustrative dataset values—not live Tadbuy results or verified audience data. Filters and exports operate only on these examples.
      </Alert>

      <GeoStatsGrid totals={geo.totals} topMarket={topMarket} loading={geo.loading} />

      <GeoFiltersBar
        search={geo.search}
        onSearchChange={geo.setSearch}
        region={geo.region}
        onRegionChange={geo.setRegion}
        sortKey={geo.sortKey}
        onSortChange={geo.setSortKey}
        minCtr={geo.minCtr}
        onMinCtrChange={geo.setMinCtr}
        viewMode={geo.viewMode}
        onViewModeChange={geo.setViewMode}
        onClearFilters={geo.clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <Tabs defaultValue="overview">
        <TabsList className="w-full sm:w-auto overflow-x-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="learn">Learn</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div
            className={cn(
              'grid gap-6',
              showMap && showList ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'
            )}
          >
            {showMap && (
              <Card
                className={cn(
                  'overflow-hidden flex flex-col p-0',
                  showList ? 'lg:col-span-2' : 'w-full'
                )}
                style={{ minHeight: isMobile ? 320 : 460 }}
              >
                <div className="px-4 py-3 border-b border-border flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-accent" />
                    <span className="text-sm font-semibold">Sample market map</span>
                  </div>
                  <Badge variant="warning">Sample map · not live</Badge>
                </div>
                <div className="flex-1 p-1.5 sm:p-2 min-h-[280px] md:min-h-[400px]">
                  <WorldMap
                    className="w-full h-full min-h-[260px] md:min-h-[380px]"
                    data={mapData}
                    selectedCode={geo.selected?.code ?? null}
                    highlightedCodes={geo.filtered.map(m => m.code)}
                    onCountrySelect={code => geo.selectCountry(code)}
                    reducedMotion={reducedMotion}
                  />
                </div>
                <div className="px-4 py-2 border-t border-border text-[10px] text-muted font-mono flex flex-wrap items-center justify-between gap-2">
                  <span>Sample markets shown · no delivery data · {geo.filtered.length} examples</span>
                  <span className="text-muted/70">Natural Earth · open map data</span>
                </div>
              </Card>
            )}

            {showList && (
              <Card className="overflow-hidden flex flex-col p-0 flex-1">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold">Example markets</span>
                  <button
                    type="button"
                    onClick={() => geo.setTargetingOpen(true)}
                    className="text-[10px] text-accent hover:text-accent/80 font-mono border border-accent/20 px-2 py-1.5 rounded-full hover:border-accent/50 min-h-[44px] touch-target touch-manipulation"
                  >
                    + Plan example market
                  </button>
                </div>
                <GeoMarketsList
                  markets={geo.filtered}
                  selectedCode={geo.selected?.code ?? null}
                  watchlist={geo.watchlist}
                  compareCodes={geo.compareCodes}
                  onSelect={geo.selectCountry}
                  onWatchlist={geo.toggleWatchlist}
                  onCompare={geo.toggleCompare}
                />
                <div className="px-4 py-3 border-t border-border bg-surface/20">
                  <button
                    type="button"
                    onClick={() => geo.setTargetingOpen(true)}
                    className="w-full py-3 rounded-lg text-xs font-bold bg-accent/10 hover:bg-accent/20 text-accent border border-accent/20 hover:border-accent/40 transition-all min-h-[44px] touch-target touch-manipulation"
                  >
                    Configure example regions
                  </button>
                </div>
              </Card>
            )}
          </div>

          {geo.selected && (
            <Card className={cn('mt-6 overflow-hidden p-0', isMobile && 'lg:mt-6')}>
              <GeoCountryDetail
                market={geo.selected}
                onAddToCampaign={() => geo.setTargetingOpen(true)}
              />
            </Card>
          )}

          {geo.compareCodes.length > 0 && (
            <div className="mt-6">
              <GeoCompareTable codes={geo.compareCodes} markets={geo.allMarkets} />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <GeoSpendChart markets={geo.filtered} />
            <Card className="p-4 flex flex-col justify-center gap-3">
              <span className="text-sm font-bold">Export & share examples</span>
              <GeoExportBar markets={geo.filtered} />
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights">
          <GeoInsightsPanel markets={geo.allMarkets} />
        </TabsContent>

        <TabsContent value="learn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-4 flex items-start gap-3">
              <Globe className="w-4 h-4 text-accent mt-0.5 shrink-0" />
              <div className="text-xs text-muted leading-relaxed space-y-2">
                <p>
                  <span className="text-text font-semibold">Geo planning</span> lets you add example
                  countries or regions to a local draft. No live targeting, bidding, or market performance is available.
                </p>
                <Link to="/ppq" className="text-accent font-bold hover:underline inline-flex items-center gap-1 min-h-[44px] touch-target">
                  PPQ.AI targeting guide →
                </Link>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <HelpCircle className="w-4 h-4 text-accent" />
                <span className="text-sm font-bold">FAQ</span>
              </div>
              <div className="space-y-2">
                {FAQ.map(item => (
                  <details key={item.q} className="group border border-border rounded-lg">
                    <summary className="flex items-center justify-between px-3 py-3 text-xs font-semibold cursor-pointer list-none min-h-[44px] touch-target">
                      {item.q}
                      <ChevronDown className="w-4 h-4 text-muted group-open:rotate-180 transition-transform" />
                    </summary>
                    <p className="px-3 pb-3 text-[11px] text-muted leading-relaxed">{item.a}</p>
                  </details>
                ))}
              </div>
            </Card>
          </div>

          <Card className="p-4 mt-6 flex flex-wrap gap-3 items-center">
            <AlertCircle className="w-4 h-4 text-accent" />
            <span className="text-xs text-muted flex-1">
              Continue to a local planning draft; the selected example market is not an activated target.
            </span>
            <Link to={geo.selected ? `/?geo=${geo.selected.code}` : '/'}>
              <span className="inline-flex px-4 py-2.5 rounded-lg bg-accent text-black text-xs font-bold min-h-[44px] items-center touch-target">
                Plan campaign preview
              </span>
            </Link>
            <Link to="/marketplace" className="text-xs text-accent font-bold hover:underline min-h-[44px] inline-flex items-center touch-target">
              Browse inventory →
            </Link>
          </Card>
        </TabsContent>
      </Tabs>

      <GeoTargetingModal
        isOpen={geo.targetingOpen}
        onClose={() => geo.setTargetingOpen(false)}
        geoCode={geo.selected?.code}
      />
    </div>
  );
}