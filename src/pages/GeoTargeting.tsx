import { WorldMap } from '../components/WorldMap';
import { Globe, TrendingUp, Target, Users } from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';

const COUNTRY_STATS = [
  { country: 'United States', code: 'US', flag: '🇺🇸', impressions: 480000, clicks: 5760, ctr: 1.2 },
  { country: 'Germany', code: 'DE', flag: '🇩🇪', impressions: 125000, clicks: 1875, ctr: 1.5 },
  { country: 'United Kingdom', code: 'GB', flag: '🇬🇧', impressions: 98000, clicks: 1470, ctr: 1.5 },
  { country: 'Japan', code: 'JP', flag: '🇯🇵', impressions: 87000, clicks: 1044, ctr: 1.2 },
  { country: 'Brazil', code: 'BR', flag: '🇧🇷', impressions: 76000, clicks: 912, ctr: 1.2 },
  { country: 'Canada', code: 'CA', flag: '🇨🇦', impressions: 65000, clicks: 780, ctr: 1.2 },
  { country: 'Australia', code: 'AU', flag: '🇦🇺', impressions: 54000, clicks: 648, ctr: 1.2 },
  { country: 'Singapore', code: 'SG', flag: '🇸🇬', impressions: 38000, clicks: 456, ctr: 1.2 },
  { country: 'El Salvador', code: 'SV', flag: '🇸🇻', impressions: 35000, clicks: 420, ctr: 1.2 },
  { country: 'Nigeria', code: 'NG', flag: '🇳🇬', impressions: 22000, clicks: 264, ctr: 1.2 },
];

export default function GeoTargeting() {
  usePageTitle('Global Reach');

  const totalImpressions = COUNTRY_STATS.reduce((s, c) => s + c.impressions, 0);
  const totalCountries = COUNTRY_STATS.length;
  const topMarket = COUNTRY_STATS[0];

  const globalCTR = (
    (COUNTRY_STATS.reduce((s, c) => s + c.clicks, 0) / totalImpressions) *
    100
  ).toFixed(2);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Global Reach</h1>
        <p className="text-sm text-muted mt-1">
          Campaign distribution and geo-targeting insights across{' '}
          <span className="text-accent font-semibold">{totalCountries} markets</span>
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Countries Reached',
            value: totalCountries,
            icon: Globe,
            color: 'text-blue-400',
            bg: 'bg-blue-400/5 border-blue-400/20',
          },
          {
            label: 'Total Impressions',
            value: totalImpressions.toLocaleString(),
            icon: TrendingUp,
            color: 'text-accent',
            bg: 'bg-accent/5 border-accent/20',
          },
          {
            label: 'Top Market',
            value: topMarket.country,
            icon: Target,
            color: 'text-green-400',
            bg: 'bg-green-400/5 border-green-400/20',
          },
          {
            label: 'Global CTR',
            value: `${globalCTR}%`,
            icon: Users,
            color: 'text-purple-400',
            bg: 'bg-purple-400/5 border-purple-400/20',
          },
        ].map(stat => (
          <div key={stat.label} className={`bg-card border ${stat.bg} rounded-xl p-4`}>
            <div className="flex items-center gap-2 text-muted text-xs mb-2">
              <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
              {stat.label}
            </div>
            <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Map + table layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map card */}
        <div
          className="lg:col-span-2 bg-card border border-border rounded-xl overflow-hidden flex flex-col"
          style={{ minHeight: '420px' }}
        >
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold text-text">Campaign Activity Map</span>
            </div>
            <span className="text-[10px] text-muted font-mono bg-surface px-2 py-0.5 rounded-full border border-border">
              LIVE
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 ml-1.5 animate-pulse" />
            </span>
          </div>
          <div className="flex-1 p-2">
            <WorldMap className="w-full h-full" />
          </div>
        </div>

        {/* Top markets sidebar */}
        <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <span className="text-sm font-semibold text-text">Top Markets</span>
            <button className="text-[10px] text-accent hover:text-accent/80 transition-colors font-mono border border-accent/20 px-2 py-0.5 rounded-full hover:border-accent/50">
              + Target New Market
            </button>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {COUNTRY_STATS.map((country, i) => {
              const barWidth = (country.impressions / COUNTRY_STATS[0].impressions) * 100;
              return (
                <div
                  key={country.code}
                  className="px-4 py-2.5 hover:bg-surface/30 transition-colors relative group"
                >
                  {/* impression bar background */}
                  <div
                    className="absolute inset-y-0 left-0 bg-accent/5 group-hover:bg-accent/8 transition-all pointer-events-none"
                    style={{ width: `${barWidth}%` }}
                  />
                  <div className="relative flex items-center gap-3">
                    <span className="text-muted text-[10px] font-mono w-4 text-right shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-lg leading-none shrink-0">{country.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-text truncate">{country.country}</div>
                      <div className="text-[10px] text-muted font-mono">
                        {country.impressions.toLocaleString()} imp
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-mono text-accent">{country.ctr}%</div>
                      <div className="text-[10px] text-muted">CTR</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA footer */}
          <div className="px-4 py-3 border-t border-border bg-surface/20">
            <button className="w-full py-2 rounded-lg text-xs font-bold bg-accent/10 hover:bg-accent/20 text-accent border border-accent/20 hover:border-accent/40 transition-all">
              Configure Geo-Targeting
            </button>
          </div>
        </div>
      </div>

      {/* Bottom info banner */}
      <div className="bg-card border border-border rounded-xl p-4 flex items-start gap-3">
        <Globe className="w-4 h-4 text-accent mt-0.5 shrink-0" />
        <div className="text-xs text-muted leading-relaxed">
          <span className="text-text font-semibold">Geo-targeting</span> lets you direct your ad
          spend toward specific countries or regions. All campaigns use real-time bidding — your
          sats go furthest in high-CTR markets.{' '}
          <span className="text-accent cursor-pointer hover:underline">Learn more →</span>
        </div>
      </div>
    </div>
  );
}
