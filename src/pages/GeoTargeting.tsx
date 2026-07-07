import { WorldMap } from '../components/WorldMap';
import { Globe, TrendingUp, Target, Users } from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';
import { StatCard, Badge } from '@/components/ui/index';
import { Card } from '@/components/ui';

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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Globe} label="Countries Reached" value={totalCountries} color="text-blue" />
        <StatCard icon={TrendingUp} label="Total Impressions" value={totalImpressions.toLocaleString()} color="text-accent" />
        <StatCard icon={Target} label="Top Market" value={topMarket.country} color="text-green" sub={`${topMarket.code} · ${topMarket.flag}`} />
        <StatCard icon={Users} label="Global CTR" value={`${globalCTR}%`} color="text-purple-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card
          className="lg:col-span-2 overflow-hidden flex flex-col p-0"
          style={{ minHeight: '420px' }}
        >
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold text-text">Campaign Activity Map</span>
            </div>
            <Badge variant="success" dot>LIVE</Badge>
          </div>
          <div className="flex-1 p-2">
            <WorldMap className="w-full h-full" />
          </div>
        </Card>

        <Card className="overflow-hidden flex flex-col p-0">
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
                  <div
                    className="absolute inset-y-0 left-0 bg-accent/5 group-hover:bg-accent/8 transition-all pointer-events-none"
                    style={{ width: `${barWidth}%` }}
                  />
                  <div className="relative flex items-center gap-3">
                    <span className="text-muted text-[10px] font-mono w-4 text-right shrink-0">
                      {i + 1}
                    </span>
                    <Badge variant="outline" className="normal-case tracking-normal shrink-0">
                      {country.flag} {country.code}
                    </Badge>
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

          <div className="px-4 py-3 border-t border-border bg-surface/20">
            <button className="w-full py-2 rounded-lg text-xs font-bold bg-accent/10 hover:bg-accent/20 text-accent border border-accent/20 hover:border-accent/40 transition-all">
              Configure Geo-Targeting
            </button>
          </div>
        </Card>
      </div>

      <Card className="p-4 flex items-start gap-3">
        <Globe className="w-4 h-4 text-accent mt-0.5 shrink-0" />
        <div className="text-xs text-muted leading-relaxed">
          <span className="text-text font-semibold">Geo-targeting</span> lets you direct your ad
          spend toward specific countries or regions. All campaigns use real-time bidding — your
          sats go furthest in high-CTR markets.{' '}
          <span className="text-accent cursor-pointer hover:underline">Learn more →</span>
        </div>
      </Card>
    </div>
  );
}