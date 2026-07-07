import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Brain, Target, BarChart3, CloudRain, MapPin, FlaskConical } from 'lucide-react';
import { Card, CardTitle, Button } from '@/components/ui';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { ConversionFunnel } from '@/components/widgets/ConversionFunnel';
import { RetentionChart } from '@/components/widgets/RetentionChart';
import { GeoHeatmap } from '@/components/widgets/GeoHeatmap';
import { PlatformBreakdown } from '@/components/widgets/PlatformBreakdown';
import { RevenueForecast } from '@/components/widgets/RevenueForecast';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function Intelligence() {
  usePageMeta('PPQ Intelligence', 'AI-powered targeting, A/B testing, funnel analytics, and weather-triggered campaign rules.');

  const [heatmap, setHeatmap] = useState<{ hour: number; cpc: number }[]>([]);
  const [abResult, setAbResult] = useState<{ significant: boolean; winner: string; confidence: number } | null>(null);

  useEffect(() => {
    fetch('/api/v2/analytics/bid-heatmap').then(r => r.json()).then(d => setHeatmap(d.heatmap ?? [])).catch(() => {});
  }, []);

  const runAbTest = () => {
    fetch('/api/v2/ab-test/significance', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })
      .then(r => r.json()).then(setAbResult).catch(() => {});
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2">
          <Brain className="w-7 h-7 text-purple" /> PPQ Intelligence Hub
        </h1>
        <p className="text-sm text-muted mt-1">Cookieless targeting, A/B testing, and real-time optimization — Batch 9 widgets.</p>
      </div>

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
              <Button size="sm" onClick={runAbTest} className="mb-4">Run Analysis</Button>
              {abResult && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted">Winner</span><span className="font-bold text-accent">Variant {abResult.winner}</span></div>
                  <div className="flex justify-between"><span className="text-muted">Confidence</span><span className="font-mono">{abResult.confidence}%</span></div>
                  <div className="flex justify-between"><span className="text-muted">Significant</span><span className={abResult.significant ? 'text-green' : 'text-muted'}>{abResult.significant ? 'Yes' : 'No'}</span></div>
                </div>
              )}
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
    </motion.div>
  );
}