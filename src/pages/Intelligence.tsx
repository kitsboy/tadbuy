import { Target, BarChart3, CloudRain, MapPin, FlaskConical } from 'lucide-react';
import { Card, CardTitle } from '@/components/ui';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { ConversionFunnel } from '@/components/widgets/ConversionFunnel';
import { RetentionChart } from '@/components/widgets/RetentionChart';
import { GeoHeatmap } from '@/components/widgets/GeoHeatmap';
import { PlatformBreakdown } from '@/components/widgets/PlatformBreakdown';
import { RevenueForecast } from '@/components/widgets/RevenueForecast';
import { usePageMeta } from '@/hooks/usePageMeta';
import { PageShell } from '@/components/PageShell';

// Labelled demo sample — the platform has no analytics/AI backend on the static host,
// so these surfaces render representative figures and never make a request.
const HEATMAP_SAMPLE = [
  { hour: 0, cpc: 0.02 }, { hour: 1, cpc: 0.015 }, { hour: 2, cpc: 0.01 }, { hour: 3, cpc: 0.01 },
  { hour: 4, cpc: 0.012 }, { hour: 5, cpc: 0.015 }, { hour: 6, cpc: 0.02 }, { hour: 7, cpc: 0.03 },
  { hour: 8, cpc: 0.045 }, { hour: 9, cpc: 0.06 }, { hour: 10, cpc: 0.07 }, { hour: 11, cpc: 0.075 },
  { hour: 12, cpc: 0.08 }, { hour: 13, cpc: 0.085 }, { hour: 14, cpc: 0.09 }, { hour: 15, cpc: 0.095 },
  { hour: 16, cpc: 0.1 }, { hour: 17, cpc: 0.105 }, { hour: 18, cpc: 0.1 }, { hour: 19, cpc: 0.09 },
  { hour: 20, cpc: 0.075 }, { hour: 21, cpc: 0.06 }, { hour: 22, cpc: 0.045 }, { hour: 23, cpc: 0.03 },
];

export default function Intelligence() {
  usePageMeta('PPQ Intelligence', 'AI-powered targeting, A/B testing, funnel analytics, and weather-triggered campaign rules.');

  const heatmap = HEATMAP_SAMPLE;

  return (
    <PageShell
      title="PPQ Intelligence Hub"
      description="Cookieless targeting, A/B testing, and real-time optimization."
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Intelligence' }]}
      showDemoBadge
      maxWidth="max-w-5xl"
    >

      <Tabs defaultValue="funnel">
        <TabsList className="flex-wrap">
          <TabsTrigger value="funnel">Funnel</TabsTrigger>
          <TabsTrigger value="retention">Retention</TabsTrigger>
          <TabsTrigger value="geo">Geo</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="forecast">Forecast</TabsTrigger>
          <TabsTrigger value="experiments">Experiments</TabsTrigger>
        </TabsList>

        <TabsContent value="funnel">
          <ConversionFunnel />
        </TabsContent>

        <TabsContent value="retention">
          <RetentionChart />
        </TabsContent>

        <TabsContent value="geo">
          <div className="grid md:grid-cols-2 gap-6">
            <GeoHeatmap />
            <Card className="glass-panel">
              <CardTitle className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Geo Intelligence</CardTitle>
              <p className="text-xs text-muted">Postal-level targeting, cookieless contextual segments, and Nostr interest graphs — all without surveillance pixels.</p>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="platforms">
          <PlatformBreakdown />
        </TabsContent>

        <TabsContent value="forecast">
          <RevenueForecast />
        </TabsContent>

        <TabsContent value="experiments">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="glass-panel">
              <CardTitle className="flex items-center gap-2"><FlaskConical className="w-4 h-4" /> A/B Significance</CardTitle>
              <p className="text-xs text-muted mb-3">
                Sample outcome for a typical test — no analysis is run here (no backend on the static host).
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted">Winner</span><span className="font-bold text-accent">Variant B</span></div>
                <div className="flex justify-between"><span className="text-muted">Confidence</span><span className="font-mono">96%</span></div>
                <div className="flex justify-between"><span className="text-muted">Significant</span><span className="text-green">Yes</span></div>
              </div>
            </Card>

            <Card className="glass-panel md:col-span-1">
              <CardTitle className="flex items-center gap-2"><Target className="w-4 h-4" /> Bid Time Heatmap (24h)</CardTitle>
              <div className="grid grid-cols-12 gap-1 mt-2">
                {heatmap.map(h => (
                  <div key={h.hour} className="text-center">
                    <div
                      className="h-8 rounded"
                      style={{ backgroundColor: `rgba(255,159,28,${0.2 + h.cpc * 10})` }}
                      title={`${h.hour}:00 — CPC $${h.cpc.toFixed(3)}`}
                    />
                    <span className="text-[8px] text-muted">{h.hour}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="glass-panel">
              <CardTitle className="flex items-center gap-2"><CloudRain className="w-4 h-4" /> Weather Rules</CardTitle>
              <p className="text-xs text-muted">Auto-boost bids during sunny weather in target regions. Configure in campaign advanced mode.</p>
            </Card>

            <Card className="glass-panel">
              <CardTitle className="flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Competitive Intel</CardTitle>
              <p className="text-xs text-muted">Compare Tadbuy CPMs vs surveillance-based DSPs. Cookieless attribution with 4.2x average ROAS.</p>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}