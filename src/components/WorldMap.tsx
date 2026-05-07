import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface CountryData {
  country: string;
  code: string;
  impressions: number;
  clicks: number;
  campaigns: number;
}

const DEMO_DATA: CountryData[] = [
  { country: 'United States', code: 'US', impressions: 480000, clicks: 5760, campaigns: 12 },
  { country: 'Germany', code: 'DE', impressions: 125000, clicks: 1875, campaigns: 4 },
  { country: 'United Kingdom', code: 'GB', impressions: 98000, clicks: 1470, campaigns: 3 },
  { country: 'Japan', code: 'JP', impressions: 87000, clicks: 1044, campaigns: 3 },
  { country: 'Brazil', code: 'BR', impressions: 76000, clicks: 912, campaigns: 2 },
  { country: 'Canada', code: 'CA', impressions: 65000, clicks: 780, campaigns: 2 },
  { country: 'Australia', code: 'AU', impressions: 54000, clicks: 648, campaigns: 2 },
  { country: 'France', code: 'FR', impressions: 48000, clicks: 576, campaigns: 1 },
  { country: 'Netherlands', code: 'NL', impressions: 42000, clicks: 504, campaigns: 1 },
  { country: 'Singapore', code: 'SG', impressions: 38000, clicks: 456, campaigns: 1 },
  { country: 'El Salvador', code: 'SV', impressions: 35000, clicks: 420, campaigns: 2 },
  { country: 'Switzerland', code: 'CH', impressions: 28000, clicks: 336, campaigns: 1 },
  { country: 'Nigeria', code: 'NG', impressions: 22000, clicks: 264, campaigns: 1 },
  { country: 'Argentina', code: 'AR', impressions: 19000, clicks: 228, campaigns: 1 },
  { country: 'Portugal', code: 'PT', impressions: 15000, clicks: 180, campaigns: 1 },
];

// Approximate SVG path coordinates for world regions (simplified polygons)
// Coordinates are in [x, y] pairs as percentages of the container (0–1)
const REGION_BLOCKS = [
  {
    name: 'North America',
    codes: ['US', 'CA'],
    // Rough outline of North America
    points: '9,12 22,10 28,18 30,38 26,52 22,55 12,50 7,38 8,22',
  },
  {
    name: 'South America',
    codes: ['BR', 'AR'],
    points: '20,57 30,55 34,62 32,80 26,88 20,85 17,72 18,60',
  },
  {
    name: 'Europe',
    codes: ['DE', 'GB', 'FR', 'NL', 'CH', 'PT'],
    points: '42,10 56,10 58,28 54,36 44,36 40,24 41,14',
  },
  {
    name: 'Africa',
    codes: ['NG'],
    points: '44,38 56,38 58,56 56,75 50,82 44,78 42,60 43,42',
  },
  {
    name: 'Middle East / Asia',
    codes: ['JP', 'SG', 'SV'],
    points: '58,10 86,12 88,42 80,55 68,58 60,50 56,36 57,14',
  },
  {
    name: 'Oceania',
    codes: ['AU'],
    points: '72,62 86,60 88,76 82,82 72,80 70,70',
  },
];

interface WorldMapProps {
  className?: string;
}

export function WorldMap({ className = '' }: WorldMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    data: CountryData;
  } | null>(null);
  const [dims, setDims] = useState({ w: 800, h: 400 });

  // Track container size with ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) setDims({ w: width, h: height });
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;
    const { w, h } = dims;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    svg.attr('viewBox', `0 0 ${w} ${h}`).attr('preserveAspectRatio', 'xMidYMid meet');

    // ── Background ────────────────────────────────────────────────────────────
    svg
      .append('rect')
      .attr('width', w)
      .attr('height', h)
      .attr('fill', '#080d1a')
      .attr('rx', 10);

    // Subtle grid lines
    const gridG = svg.append('g').attr('class', 'grid');
    const cols = 12;
    const rows = 6;
    for (let i = 1; i < cols; i++) {
      gridG
        .append('line')
        .attr('x1', (w / cols) * i)
        .attr('y1', 0)
        .attr('x2', (w / cols) * i)
        .attr('y2', h)
        .attr('stroke', '#1a2236')
        .attr('stroke-width', 0.5);
    }
    for (let i = 1; i < rows; i++) {
      gridG
        .append('line')
        .attr('x1', 0)
        .attr('y1', (h / rows) * i)
        .attr('x2', w)
        .attr('y2', (h / rows) * i)
        .attr('stroke', '#1a2236')
        .attr('stroke-width', 0.5);
    }

    // ── Color scale ───────────────────────────────────────────────────────────
    const dataByCode = new Map(DEMO_DATA.map(d => [d.code, d]));
    const maxImpressions = d3.max(DEMO_DATA, d => d.impressions) ?? 1;

    const colorScale = d3
      .scaleSequential()
      .domain([0, maxImpressions])
      .interpolator(d3.interpolate('#1a2e52', '#f7931a'));

    const g = svg.append('g');

    // ── Region polygons ───────────────────────────────────────────────────────
    REGION_BLOCKS.forEach(region => {
      // Convert percentage coords to pixel coords
      const pixelPoints = region.points
        .split(' ')
        .map(pair => {
          const [px, py] = pair.split(',').map(Number);
          return `${(px / 100) * w},${(py / 100) * h}`;
        })
        .join(' ');

      const totalImpressions = region.codes.reduce(
        (sum, code) => sum + (dataByCode.get(code)?.impressions ?? 0),
        0,
      );
      const avgImpressions = totalImpressions / region.codes.length;

      const poly = g
        .append('polygon')
        .attr('points', pixelPoints)
        .attr('fill', totalImpressions > 0 ? colorScale(avgImpressions) : '#0f1a2e')
        .attr('stroke', '#253554')
        .attr('stroke-width', 1.5)
        .attr('opacity', 0.82)
        .style('cursor', 'default');

      // Region label — centroid approximation
      const pts = region.points.split(' ').map(p => p.split(',').map(Number));
      const cx = (pts.reduce((s, p) => s + p[0], 0) / pts.length / 100) * w;
      const cy = (pts.reduce((s, p) => s + p[1], 0) / pts.length / 100) * h;
      const labelSize = Math.max(8, Math.min(12, w * 0.012));

      g.append('text')
        .attr('x', cx)
        .attr('y', cy)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', '#5a6e8a')
        .attr('font-size', labelSize)
        .attr('font-family', 'monospace')
        .attr('pointer-events', 'none')
        .text(region.name.split('/')[0].trim());

      // Hover glow on region
      poly
        .on('mouseover', function () {
          d3.select(this)
            .transition()
            .duration(150)
            .attr('opacity', 1)
            .attr('stroke', '#f7931a')
            .attr('stroke-width', 2);
        })
        .on('mouseout', function () {
          d3.select(this)
            .transition()
            .duration(200)
            .attr('opacity', 0.82)
            .attr('stroke', '#253554')
            .attr('stroke-width', 1.5);
        });
    });

    // ── Campaign dots ─────────────────────────────────────────────────────────
    // Seed-based deterministic positions so dots don't jump on re-render
    const seededRng = (seed: number) => {
      const s = Math.sin(seed) * 10000;
      return s - Math.floor(s);
    };

    DEMO_DATA.forEach((d, idx) => {
      const region = REGION_BLOCKS.find(r => r.codes.includes(d.code));
      if (!region) return;

      const pts = region.points.split(' ').map(p => p.split(',').map(Number));
      const rcx = (pts.reduce((s, p) => s + p[0], 0) / pts.length / 100) * w;
      const rcy = (pts.reduce((s, p) => s + p[1], 0) / pts.length / 100) * h;

      // Deterministic spread within region
      const spread = Math.min(w, h) * 0.07;
      const cx = rcx + (seededRng(idx * 3.7) - 0.5) * spread * 2;
      const cy = rcy + (seededRng(idx * 7.3) - 0.5) * spread;

      const r = Math.sqrt(d.impressions / maxImpressions) * (w * 0.018) + 3;

      // Outer pulse ring
      g.append('circle')
        .attr('cx', cx)
        .attr('cy', cy)
        .attr('r', r * 1.8)
        .attr('fill', 'none')
        .attr('stroke', '#f7931a')
        .attr('stroke-width', 0.8)
        .attr('opacity', 0.2);

      // Main dot
      g.append('circle')
        .attr('cx', cx)
        .attr('cy', cy)
        .attr('r', r)
        .attr('fill', '#f7931a')
        .attr('opacity', 0.72)
        .attr('stroke', '#ffa94d')
        .attr('stroke-width', 0.8)
        .style('cursor', 'pointer')
        .on('mouseover', function (event: MouseEvent) {
          d3.select(this)
            .transition()
            .duration(120)
            .attr('r', r * 1.4)
            .attr('opacity', 1);
          const rect = svgRef.current!.getBoundingClientRect();
          setTooltip({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
            data: d,
          });
        })
        .on('mousemove', function (event: MouseEvent) {
          const rect = svgRef.current!.getBoundingClientRect();
          setTooltip(prev =>
            prev ? { ...prev, x: event.clientX - rect.left, y: event.clientY - rect.top } : null,
          );
        })
        .on('mouseout', function () {
          d3.select(this).transition().duration(180).attr('r', r).attr('opacity', 0.72);
          setTooltip(null);
        });
    });

    // ── Legend ────────────────────────────────────────────────────────────────
    const legendW = Math.min(140, w * 0.17);
    const legendH = 8;
    const legendX = 16;
    const legendY = h - 36;

    const defs = svg.append('defs');
    const grad = defs
      .append('linearGradient')
      .attr('id', 'choropleth-grad')
      .attr('x1', '0%')
      .attr('x2', '100%');
    grad.append('stop').attr('offset', '0%').attr('stop-color', '#1a2e52');
    grad.append('stop').attr('offset', '100%').attr('stop-color', '#f7931a');

    svg
      .append('rect')
      .attr('x', legendX)
      .attr('y', legendY)
      .attr('width', legendW)
      .attr('height', legendH)
      .attr('rx', 3)
      .attr('fill', 'url(#choropleth-grad)')
      .attr('opacity', 0.9);

    svg
      .append('text')
      .attr('x', legendX)
      .attr('y', legendY - 5)
      .attr('fill', '#4a5568')
      .attr('font-size', 9)
      .attr('font-family', 'monospace')
      .text('Low');

    svg
      .append('text')
      .attr('x', legendX + legendW)
      .attr('y', legendY - 5)
      .attr('fill', '#f7931a')
      .attr('font-size', 9)
      .attr('font-family', 'monospace')
      .attr('text-anchor', 'end')
      .text('High impressions');

    svg
      .append('circle')
      .attr('cx', legendX + legendW + 16)
      .attr('cy', legendY + legendH / 2)
      .attr('r', 5)
      .attr('fill', '#f7931a')
      .attr('opacity', 0.8);

    svg
      .append('text')
      .attr('x', legendX + legendW + 25)
      .attr('y', legendY + legendH / 2 + 1)
      .attr('fill', '#4a5568')
      .attr('font-size', 9)
      .attr('font-family', 'monospace')
      .attr('dominant-baseline', 'middle')
      .text('Active campaign');
  }, [dims]);

  return (
    <div ref={containerRef} className={`relative w-full h-full ${className}`}>
      <svg ref={svgRef} className="w-full h-full" style={{ display: 'block' }} />
      {tooltip && (
        <div
          className="absolute pointer-events-none bg-card border border-border rounded-lg px-3 py-2 text-xs shadow-xl z-50 min-w-[140px]"
          style={{
            left: tooltip.x + 14,
            top: tooltip.y - 14,
            // Clamp so tooltip doesn't overflow right edge
            transform: tooltip.x > dims.w - 180 ? 'translateX(-110%)' : undefined,
          }}
        >
          <div className="font-bold text-text mb-1">{tooltip.data.country}</div>
          <div className="flex justify-between gap-3 text-muted">
            <span>Impressions</span>
            <span className="text-accent font-mono">{tooltip.data.impressions.toLocaleString()}</span>
          </div>
          <div className="flex justify-between gap-3 text-muted">
            <span>Clicks</span>
            <span className="text-green-400 font-mono">{tooltip.data.clicks.toLocaleString()}</span>
          </div>
          <div className="flex justify-between gap-3 text-muted">
            <span>Campaigns</span>
            <span className="text-orange-400 font-mono">{tooltip.data.campaigns}</span>
          </div>
        </div>
      )}
    </div>
  );
}
