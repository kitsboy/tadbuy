import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import { feature } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import type { Feature, FeatureCollection, Geometry } from 'geojson';
import worldAtlas from 'world-atlas/countries-110m.json';
import { numericIdToAlpha2 } from '@/data/isoNumericToAlpha2';

export interface CountryData {
  country: string;
  code: string;
  impressions: number;
  clicks: number;
  campaigns: number;
}

export const DEMO_DATA: CountryData[] = [
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

type CountryProps = { name?: string };
type CountryFeature = Feature<Geometry, CountryProps> & { id?: string | number };

const COLORS = {
  ocean: '#070b14',
  oceanEdge: '#0c1424',
  landEmpty: '#121a2b',
  landEmptyStroke: '#1e2a40',
  landMuted: '#0f1624',
  heatLow: '#1a2e52',
  heatHigh: '#f7931a',
  selected: '#ffa94d',
  hoverStroke: '#f7931a',
  label: '#6b7c99',
  grid: '#152033',
};

interface WorldMapProps {
  className?: string;
  data?: Array<{ country: string; code: string; impressions: number; clicks: number; campaigns: number }>;
  selectedCode?: string | null;
  highlightedCodes?: string[];
  onCountrySelect?: (code: string) => void;
  reducedMotion?: boolean;
}

function buildCountryFeatures(): CountryFeature[] {
  const topology = worldAtlas as unknown as Topology<{ countries: GeometryCollection }>;
  const fc = feature(topology, topology.objects.countries) as FeatureCollection<Geometry, CountryProps>;
  return fc.features as CountryFeature[];
}

export function WorldMap({
  className = '',
  data,
  selectedCode = null,
  highlightedCodes,
  onCountrySelect,
  reducedMotion = false,
}: WorldMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    name: string;
    code: string | null;
    data: CountryData | null;
  } | null>(null);
  const [dims, setDims] = useState({ w: 800, h: 400 });
  const [hoverCode, setHoverCode] = useState<string | null>(null);

  const mapData = data ?? DEMO_DATA;
  const hasHighlights = Boolean(highlightedCodes?.length);

  const features = useMemo(() => buildCountryFeatures(), []);

  const dataByCode = useMemo(() => {
    const m = new Map<string, CountryData>();
    for (const d of mapData) m.set(d.code, d);
    return m;
  }, [mapData]);

  const maxImpressions = useMemo(
    () => d3.max(mapData, d => d.impressions) ?? 1,
    [mapData],
  );

  const colorScale = useMemo(
    () =>
      d3
        .scaleSequential(d3.interpolateRgb(COLORS.heatLow, COLORS.heatHigh))
        .domain([0, maxImpressions]),
    [maxImpressions],
  );

  // Track container size
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) setDims({ w: width, h: height });
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const fillForCode = useCallback(
    (code: string | null): string => {
      if (!code) return COLORS.landEmpty;
      const d = dataByCode.get(code);
      if (!d || d.impressions <= 0) return COLORS.landEmpty;
      const dimmed = hasHighlights && !highlightedCodes!.includes(code);
      if (dimmed) return COLORS.landMuted;
      return colorScale(d.impressions);
    },
    [colorScale, dataByCode, hasHighlights, highlightedCodes],
  );

  useEffect(() => {
    if (!svgRef.current) return;
    const { w, h } = dims;
    if (w < 40 || h < 40) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    svg.attr('viewBox', `0 0 ${w} ${h}`).attr('preserveAspectRatio', 'xMidYMid meet');

    // Ocean background with soft radial glow
    const defs = svg.append('defs');

    const oceanGrad = defs
      .append('radialGradient')
      .attr('id', 'ocean-glow')
      .attr('cx', '50%')
      .attr('cy', '45%')
      .attr('r', '65%');
    oceanGrad.append('stop').attr('offset', '0%').attr('stop-color', '#0e1a30');
    oceanGrad.append('stop').attr('offset', '100%').attr('stop-color', COLORS.ocean);

    const heatGrad = defs
      .append('linearGradient')
      .attr('id', 'choropleth-grad')
      .attr('x1', '0%')
      .attr('x2', '100%');
    heatGrad.append('stop').attr('offset', '0%').attr('stop-color', COLORS.heatLow);
    heatGrad.append('stop').attr('offset', '100%').attr('stop-color', COLORS.heatHigh);

    // Selected country soft glow
    const glow = defs
      .append('filter')
      .attr('id', 'country-glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');
    glow
      .append('feDropShadow')
      .attr('dx', 0)
      .attr('dy', 0)
      .attr('stdDeviation', 3)
      .attr('flood-color', COLORS.heatHigh)
      .attr('flood-opacity', 0.55);

    svg
      .append('rect')
      .attr('width', w)
      .attr('height', h)
      .attr('fill', 'url(#ocean-glow)')
      .attr('rx', 12);

    // Subtle lat/lon grid
    const projection = d3
      .geoNaturalEarth1()
      .fitExtent(
        [
          [12, 16],
          [w - 12, h - 40],
        ],
        { type: 'Sphere' },
      );

    const path = d3.geoPath(projection);
    const g = svg.append('g').attr('class', 'map-root');

    // Sphere outline (map edge)
    g.append('path')
      .datum({ type: 'Sphere' } as d3.GeoPermissibleObjects)
      .attr('d', path)
      .attr('fill', 'none')
      .attr('stroke', COLORS.oceanEdge)
      .attr('stroke-width', 1.25)
      .attr('opacity', 0.9);

    // Graticule
    const graticule = d3.geoGraticule().step([30, 30]);
    g.append('path')
      .datum(graticule())
      .attr('d', path)
      .attr('fill', 'none')
      .attr('stroke', COLORS.grid)
      .attr('stroke-width', 0.5)
      .attr('opacity', 0.55)
      .attr('pointer-events', 'none');

    // Country paths
    const countriesG = g.append('g').attr('class', 'countries');

    countriesG
      .selectAll('path.country')
      .data(features)
      .join('path')
      .attr('class', 'country')
      .attr('d', d => path(d) ?? '')
      .attr('data-code', d => numericIdToAlpha2(d.id) ?? '')
      .attr('fill', d => {
        const code = numericIdToAlpha2(d.id);
        return fillForCode(code);
      })
      .attr('stroke', d => {
        const code = numericIdToAlpha2(d.id);
        if (code && code === selectedCode) return COLORS.selected;
        return COLORS.landEmptyStroke;
      })
      .attr('stroke-width', d => {
        const code = numericIdToAlpha2(d.id);
        if (code && code === selectedCode) return 1.75;
        return 0.45;
      })
      .attr('opacity', d => {
        const code = numericIdToAlpha2(d.id);
        if (!code) return 0.85;
        if (hasHighlights && dataByCode.has(code) && !highlightedCodes!.includes(code)) return 0.35;
        return 1;
      })
      .style('cursor', d => {
        const code = numericIdToAlpha2(d.id);
        return code && dataByCode.has(code) && onCountrySelect ? 'pointer' : 'default';
      })
      .attr('filter', d => {
        const code = numericIdToAlpha2(d.id);
        return code && code === selectedCode ? 'url(#country-glow)' : null;
      })
      .on('pointerenter', function (event: PointerEvent, d) {
        const code = numericIdToAlpha2(d.id);
        const name = d.properties?.name ?? code ?? 'Unknown';
        const row = code ? dataByCode.get(code) ?? null : null;
        setHoverCode(code);

        d3.select(this)
          .raise()
          .transition()
          .duration(reducedMotion ? 0 : 120)
          .attr('stroke', COLORS.hoverStroke)
          .attr('stroke-width', code === selectedCode ? 2 : 1.25);

        const rect = svgRef.current!.getBoundingClientRect();
        setTooltip({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
          name: row?.country ?? name,
          code,
          data: row,
        });
      })
      .on('pointermove', function (event: PointerEvent) {
        const rect = svgRef.current!.getBoundingClientRect();
        setTooltip(prev =>
          prev
            ? { ...prev, x: event.clientX - rect.left, y: event.clientY - rect.top }
            : null,
        );
      })
      .on('pointerleave', function (_event, d) {
        const code = numericIdToAlpha2(d.id);
        setHoverCode(null);
        setTooltip(null);
        d3.select(this)
          .transition()
          .duration(reducedMotion ? 0 : 150)
          .attr('stroke', code && code === selectedCode ? COLORS.selected : COLORS.landEmptyStroke)
          .attr('stroke-width', code && code === selectedCode ? 1.75 : 0.45);
      })
      .on('click', function (_event, d) {
        const code = numericIdToAlpha2(d.id);
        if (code && dataByCode.has(code) && onCountrySelect) {
          onCountrySelect(code);
        }
      });

    // Activity markers (centroids) for markets with data
    const markersG = g.append('g').attr('class', 'markers').attr('pointer-events', 'none');

    for (const d of mapData) {
      const feat = features.find(f => numericIdToAlpha2(f.id) === d.code);
      if (!feat) continue;

      const centroid = path.centroid(feat);
      if (!centroid || Number.isNaN(centroid[0]) || Number.isNaN(centroid[1])) continue;

      const [cx, cy] = centroid;
      const isSelected = selectedCode === d.code;
      const isHighlighted = !hasHighlights || highlightedCodes!.includes(d.code);
      const r = Math.sqrt(d.impressions / maxImpressions) * Math.min(w, h) * 0.014 + 2.5;
      const opacity = isHighlighted ? (isSelected ? 1 : 0.85) : 0.2;

      if (!reducedMotion && isHighlighted) {
        markersG
          .append('circle')
          .attr('cx', cx)
          .attr('cy', cy)
          .attr('r', r * 2.2)
          .attr('fill', 'none')
          .attr('stroke', COLORS.heatHigh)
          .attr('stroke-width', 0.8)
          .attr('opacity', isSelected ? 0.35 : 0.18);
      }

      if (isSelected) {
        markersG
          .append('circle')
          .attr('cx', cx)
          .attr('cy', cy)
          .attr('r', r * 1.55)
          .attr('fill', 'none')
          .attr('stroke', COLORS.selected)
          .attr('stroke-width', 2)
          .attr('opacity', 0.95);
      }

      markersG
        .append('circle')
        .attr('cx', cx)
        .attr('cy', cy)
        .attr('r', r)
        .attr('fill', COLORS.heatHigh)
        .attr('opacity', opacity)
        .attr('stroke', isSelected ? COLORS.selected : '#ffb347')
        .attr('stroke-width', isSelected ? 1.4 : 0.6);
    }

    // Legend
    const legendW = Math.min(148, w * 0.22);
    const legendH = 8;
    const legendX = 16;
    const legendY = h - 28;

    svg
      .append('rect')
      .attr('x', legendX - 8)
      .attr('y', legendY - 18)
      .attr('width', legendW + 110)
      .attr('height', 36)
      .attr('rx', 8)
      .attr('fill', 'rgba(8, 12, 22, 0.72)')
      .attr('stroke', COLORS.landEmptyStroke)
      .attr('stroke-width', 0.5);

    svg
      .append('rect')
      .attr('x', legendX)
      .attr('y', legendY)
      .attr('width', legendW)
      .attr('height', legendH)
      .attr('rx', 3)
      .attr('fill', 'url(#choropleth-grad)');

    svg
      .append('text')
      .attr('x', legendX)
      .attr('y', legendY - 6)
      .attr('fill', COLORS.label)
      .attr('font-size', 9)
      .attr('font-family', 'ui-monospace, monospace')
      .text('Low');

    svg
      .append('text')
      .attr('x', legendX + legendW)
      .attr('y', legendY - 6)
      .attr('fill', COLORS.heatHigh)
      .attr('font-size', 9)
      .attr('font-family', 'ui-monospace, monospace')
      .attr('text-anchor', 'end')
      .text('High activity');

    svg
      .append('circle')
      .attr('cx', legendX + legendW + 18)
      .attr('cy', legendY + legendH / 2)
      .attr('r', 4)
      .attr('fill', COLORS.heatHigh)
      .attr('opacity', 0.9);

    svg
      .append('text')
      .attr('x', legendX + legendW + 28)
      .attr('y', legendY + legendH / 2 + 1)
      .attr('fill', COLORS.label)
      .attr('font-size', 9)
      .attr('font-family', 'ui-monospace, monospace')
      .attr('dominant-baseline', 'middle')
      .text('Market');
  }, [
    dims,
    features,
    mapData,
    selectedCode,
    highlightedCodes,
    hasHighlights,
    onCountrySelect,
    reducedMotion,
    dataByCode,
    maxImpressions,
    fillForCode,
  ]);

  // Keep hoverCode referenced so TS doesn't complain if unused in render
  void hoverCode;

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full ${className}`}
      aria-label="World map showing campaign activity by country"
      role="img"
    >
      <svg ref={svgRef} className="w-full h-full rounded-xl" style={{ display: 'block' }} />
      {tooltip && (
        <div
          className="absolute pointer-events-none z-50 min-w-[160px] max-w-[220px] rounded-xl border border-border/80 bg-card/95 px-3 py-2.5 text-xs shadow-2xl backdrop-blur-md"
          style={{
            left: tooltip.x + 14,
            top: tooltip.y - 12,
            transform: tooltip.x > dims.w - 200 ? 'translateX(-110%)' : undefined,
          }}
        >
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <span className="font-bold text-text">{tooltip.name}</span>
            {tooltip.code && (
              <span className="font-mono text-[10px] text-muted">{tooltip.code}</span>
            )}
          </div>
          {tooltip.data ? (
            <>
              <div className="flex justify-between gap-3 text-muted">
                <span>Impressions</span>
                <span className="font-mono text-accent">
                  {tooltip.data.impressions.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between gap-3 text-muted">
                <span>Clicks</span>
                <span className="font-mono text-green-400">
                  {tooltip.data.clicks.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between gap-3 text-muted">
                <span>Campaigns</span>
                <span className="font-mono text-orange-400">{tooltip.data.campaigns}</span>
              </div>
              {onCountrySelect && (
                <div className="mt-1.5 border-t border-border/60 pt-1.5 text-[10px] text-muted">
                  Click to select market
                </div>
              )}
            </>
          ) : (
            <div className="text-[11px] text-muted">No active campaigns in BETA data</div>
          )}
        </div>
      )}
    </div>
  );
}
