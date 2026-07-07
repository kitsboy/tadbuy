import { Link } from 'react-router-dom';
import {
  Sparkles, Bitcoin, Globe, Languages, Clock, ArrowRight,
} from 'lucide-react';
import { Card, CardTitle } from '@/components/ui';
import { Badge, Progress, Alert } from '@/components/ui/index';
import { GEO_INSIGHTS, type GeoMarket } from '@/data/geoMarkets';
import { cn } from '@/lib/utils';

type GeoInsightsPanelProps = {
  markets: GeoMarket[];
};

function resolveMarkets(codes: string[], markets: GeoMarket[]) {
  return codes
    .map(code => markets.find(m => m.code === code))
    .filter(Boolean) as GeoMarket[];
}

function buildLanguageBreakdown(markets: GeoMarket[]) {
  const counts = new Map<string, number>();
  for (const m of markets) {
    for (const lang of m.languages) {
      counts.set(lang, (counts.get(lang) ?? 0) + m.impressions);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
}

function buildTimezoneList(markets: GeoMarket[]) {
  const seen = new Set<string>();
  const list: { tz: string; country: string; flag: string }[] = [];
  for (const m of markets) {
    if (!seen.has(m.timezone)) {
      seen.add(m.timezone);
      list.push({ tz: m.timezone, country: m.country, flag: m.flag });
    }
  }
  return list.slice(0, 8);
}

export function GeoInsightsPanel({ markets }: GeoInsightsPanelProps) {
  const recommended = resolveMarkets(GEO_INSIGHTS.recommended, markets);
  const underperforming = resolveMarkets(GEO_INSIGHTS.underperforming, markets);
  const spotlight = markets.find(m => m.code === GEO_INSIGHTS.spotlight);
  const languages = buildLanguageBreakdown(markets);
  const maxLangImp = languages[0]?.[1] ?? 1;
  const timezones = buildTimezoneList(markets);

  return (
    <div className="space-y-4">
      <Card className="glass-panel p-4">
        <CardTitle className="mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent" />
          Recommended Markets
        </CardTitle>
        <div className="space-y-2">
          {recommended.map(m => (
            <Link
              key={m.code}
              to={`/?geo=${m.code}`}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface/50 transition-colors group touch-manipulation min-h-[44px]"
            >
              <span className="text-lg">{m.flag}</span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-text truncate">{m.country}</div>
                <div className="text-[10px] text-muted font-mono">+{m.trend}% trend · {m.ctr}% CTR</div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted group-hover:text-accent transition-colors shrink-0" />
            </Link>
          ))}
        </div>
      </Card>

      {underperforming.length > 0 && (
        <Alert variant="warning" title="Underperforming markets">
          {underperforming.map(m => m.country).join(', ')} — consider pausing or reallocating spend to higher-CTR regions.
        </Alert>
      )}

      {spotlight && (
        <Card className="glass-panel p-4 border-accent/20 bg-accent/5">
          <CardTitle className="mb-3 flex items-center gap-2">
            <Bitcoin className="w-4 h-4 text-accent" />
            El Salvador Spotlight
          </CardTitle>
          <div className="flex items-start gap-3">
            <span className="text-2xl">{spotlight.flag}</span>
            <div className="flex-1">
              <p className="text-xs text-muted leading-relaxed">
                Legal tender market with <span className="text-accent font-bold">+{spotlight.trend}%</span> growth.
                {spotlight.impressions.toLocaleString()} impressions across {spotlight.campaigns} campaigns.
              </p>
              <Link
                to={`/?geo=${spotlight.code}`}
                className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline mt-2 min-h-[44px] touch-manipulation"
              >
                Target El Salvador <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </Card>
      )}

      <Card className="glass-panel p-4">
        <CardTitle className="mb-3 flex items-center gap-2">
          <Globe className="w-4 h-4" />
          Coverage
        </CardTitle>
        <Progress value={GEO_INSIGHTS.coveragePercent} showLabel variant="accent" />
        <p className="text-[10px] text-muted mt-2">
          {GEO_INSIGHTS.coveragePercent}% of priority markets actively targeted · avg CPM ${GEO_INSIGHTS.avgCpmUsd}
        </p>
      </Card>

      <Card className="glass-panel p-4">
        <CardTitle className="mb-3 flex items-center gap-2">
          <Languages className="w-4 h-4" />
          Language Breakdown
        </CardTitle>
        <div className="space-y-2.5">
          {languages.map(([lang, imp]) => (
            <div key={lang}>
              <div className="flex justify-between text-[10px] mb-1">
                <span className="font-bold text-text">{lang}</span>
                <span className="text-muted font-mono">{imp.toLocaleString()}</span>
              </div>
              <div className="h-1.5 rounded-full bg-surface border border-border overflow-hidden">
                <div
                  className="h-full bg-accent/70 rounded-full transition-all"
                  style={{ width: `${(imp / maxLangImp) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="glass-panel p-4">
        <CardTitle className="mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Active Timezones
        </CardTitle>
        <div className="space-y-1.5">
          {timezones.map(({ tz, country, flag }) => (
            <div
              key={tz}
              className="flex items-center gap-2 text-xs py-1.5 px-2 rounded-lg hover:bg-surface/40 transition-colors"
            >
              <span>{flag}</span>
              <span className="font-mono text-muted flex-1 truncate">{tz.replace(/_/g, ' ')}</span>
              <Badge variant="outline" className={cn('normal-case tracking-normal shrink-0')}>{country}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}