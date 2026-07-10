import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Globe, AlertCircle, ChevronDown, BarChart3, HelpCircle } from 'lucide-react';
import { WorldMap } from '@/components/WorldMap';
import { Card } from '@/components/ui';
import { Badge, Alert, Tabs, TabsList, TabsTrigger, TabsContent, EmptyState } from '@/components/ui/index';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useGeoPage } from '@/hooks/useGeoPage';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { GeoPageHeader } from '@/components/geo/GeoPageHeader';
import { GeoStatsGrid } from '@/components/geo/GeoStatsGrid';
import { GeoFiltersBar } from '@/components/geo/GeoFiltersBar';
import { GeoMarketsList } from '@/components/geo/GeoMarketsList';
import { GeoCountryDetail } from '@/components/geo/GeoCountryDetail';
import { GeoInsightsPanel } from '@/components/geo/GeoInsightsPanel';
import { GeoTargetingModal } from '@/components/geo/GeoTargetingModal';
import { GeoExportBar } from '@/components/geo/GeoExportBar';
import { GEO_MARKETS } from '@/data/geoMarkets';
import { cn } from '@/lib/utils';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

const FAQ = [
  { q: 'How does geo-targeting work?', a: 'Select countries or regions when launching a campaign. Tadbuy routes impressions via PPQ.AI to publishers with inventory in those markets.' },
  { q: 'Can I target multiple countries?', a: 'Yes — pick as many markets as you like. Budget is split by impression share unless you set manual weights in Full Control mode.' },
  { q: 'What about El Salvador?', a: 'El Salvador is a P1 Bitcoin-native market with legal tender status. We surface dedicated inventory and higher expected CTR for BTC brands.' },
  { q: 'Is this live data?', a: 'BETA uses demo aggregates until M4 analytics pipes are fully wired. Refresh pulls from /api/geo when the API is online.' },
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
        <span className="text-sm font-bold">Spend by market (USD)</span>
      </div>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#27272a', border: '1px solid #3f3f46', borderRadius: 8, fontSize: 12 }}
              formatter={(v: number) => [`$${v}`, 'Spend']}
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
      <h3 className="text-sm font-bold mb-3">Market comparison</h3>
      <table className="w-full text-xs">
        <thead>
          <tr className="text-muted border-b border-border">
            <th className="text-left py-2 pr-4">Market</th>
            <th className="text-right py-2 px-2">Impressions</th>
            <th className="text-right py-2 px-2">CTR</th>
            <th className="text-right py-2 px-2">Trend</th>
            <th className="text-right py-2 pl-2">Spend</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(m => m && (
            <tr key={m.code} className="border-b border-border/50">
              <td className="py-2.5 pr-4 font-medium">{m.flag} {m.country}</td>
              <td className="text-right py-2.5 px-2 font-mono text-accent">{m.impressions.toLocaleString()}</td>
              <td className="text-right py-2.5 px-2 font-mono">{m.ctr}%</td>
              <td className="text-right py-2.5 px-2 font-mono text-green">{m.trend > 0 ? '+' : ''}{m.trend}%</td>
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
    'Global Reach — Geo Targeting',
    'Explore 25+ Bitcoin ad markets. Map impressions, CTR, and spend by country. Configure geo-targeting for Lightning-native campaigns.'
  );

  const geo = useGeoPage();
  const reducedMotion = usePrefersReducedMotion();
  const online = useOnlineStatus();
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
      <GeoPageHeader
        marketCount={geo.allMarkets.length}
        onRefresh={geo.refetch}
        refreshing={geo.loading}
      />

      {!online && (
        <Alert variant="warning" title="Offline">
          Showing cached market data. Reconnect to refresh live stats.
        </Alert>
      )}

      {geo.error && (
        <Alert variant="error" title="API unavailable">
          Using local demo data. {geo.error}
          <button type="button" onClick={geo.refetch} className="ml-2 text-accent underline">
            Retry
          </button>
        </Alert>
      )}

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
                    <span className="text-sm font-semibold">Campaign Activity Map</span>
                  </div>
                  <Badge variant="success" dot>LIVE</Badge>
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
                  <span>Tap a country to inspect · real borders · {geo.filtered.length} markets</span>
                  <span className="text-muted/70">Natural Earth · open map data</span>
                </div>
              </Card>
            )}

            {showList && (
              <Card className="overflow-hidden flex flex-col p-0 flex-1">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold">Top Markets</span>
                  <button
                    type="button"
                    onClick={() => geo.setTargetingOpen(true)}
                    className="text-[10px] text-accent hover:text-accent/80 font-mono border border-accent/20 px-2 py-1.5 rounded-full hover:border-accent/50 min-h-[44px] touch-target touch-manipulation"
                  >
                    + Target New Market
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
                    Configure Geo-Targeting
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
              <span className="text-sm font-bold">Export & share</span>
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
                  <span className="text-text font-semibold">Geo-targeting</span> directs ad spend toward
                  specific countries or regions. All campaigns use real-time bidding — your sats go furthest
                  in high-CTR markets.
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
              Ready to launch? Hand off to Buy Ads with your selected market pre-filled.
            </span>
            <Link to={geo.selected ? `/?geo=${geo.selected.code}` : '/'}>
              <span className="inline-flex px-4 py-2.5 rounded-lg bg-accent text-black text-xs font-bold min-h-[44px] items-center touch-target">
                Start campaign
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