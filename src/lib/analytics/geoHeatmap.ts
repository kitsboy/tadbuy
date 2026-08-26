/**
 * Campaign Geo-Heatmap — Interactive world map showing ad spend by region
 * 
 * Renders a SVG/Canvas heatmap overlay with color-coded intensity
 * based on campaign spend per country/region. Uses campaign analytics
 * data from the platform backend.
 */

export interface GeoRegionData {
  code: string; // ISO 3166-1 alpha-2 country code
  name: string;
  spendSats: number;
  spendUsd: number;
  impressions: number;
  clicks: number;
  ctr: number;
}

export interface GeoHeatmapConfig {
  width: number;
  height: number;
  regions: GeoRegionData[];
  colorScheme: 'viridis' | 'plasma' | 'inferno' | 'custom';
  minSpend: number;
  maxSpend: number;
}

/** Get color intensity based on spend percentile */
function getSpendColor(spend: number, minSpend: number, maxSpend: number, scheme: 'viridis' | 'plasma' | 'inferno' | 'custom'): string {
  const normalized = (spend - minSpend) / (maxSpend - minSpend || 1);

  if (scheme === 'custom') {
    // Custom scheme: use orange/pink palette
    if (normalized <= 0) return '#f0f9e8';
    if (normalized >= 1) return '#00441b';
    return `hsl(${Math.round(300 - normalized * 200)}, 80%, 60%)`;
  }

  // Simplified viridis/plasma/inferno mapping using CSS-friendly hex
  const colors = {
    viridis: ['#f0f9e8', '#a8e6cf', '#5bc0de', '#023866'],
    plasma: ['#fff0f3', '#e94e79', '#ce2029', '#960f3e'],
    inferno: ['#fff5f0', '#fd7f6f', '#e74c3c', '#b91d2a'],
  };

  const gradient = colors[scheme];
  const start = parseInt(gradient[0].replace('#', ''), 16);
  const end = parseInt(gradient[gradient.length - 1].replace('#', ''), 16);
  const inter = Math.round(start + (end - start) * normalized);

  // Convert single hex to a usable gradient stop
  const r = Math.round((inter >> 16) & 255);
  const g = Math.round((inter >> 8) & 255);
  const b = inter & 255;
  return `rgb(${r},${g},${b})`;
}

/** Render heatmap as Canvas data URL */
export function renderGeoHeatmap(config: GeoHeatmapConfig): string {
  const canvas = document.createElement('canvas');
  canvas.width = config.width;
  canvas.height = config.height;
  const ctx = canvas.getContext('2d')!;

  const { regions, colorScheme, minSpend, maxSpend } = config;

  // Fill background
  ctx.fillStyle = '#0d1b2a';
  ctx.fillRect(0, 0, config.width, config.height);

  // Sort regions by spend for rendering order
  const sorted = [...regions].sort((a, b) => b.spendSats - a.spendSats);

  // Calculate percentile thresholds
  const thresholdCount = 5;
  const thresholds = [];
  for (let i = 0; i < thresholdCount; i++) {
    const idx = Math.floor((sorted.length * i) / thresholdCount);
    thresholds.push(sorted[idx]?.spendSats ?? 0);
  }

  // Render each region as a simplified country tile
  // In a full implementation, this would use GeoJSON country paths
  const tileWidth = config.width / 30; // 30 columns approx
  const tileHeight = config.height / 20; // 20 rows approx

  sorted.forEach((region, i) => {
    const color = getSpendColor(region.spendSats, minSpend, maxSpend, colorScheme);
    const col = i % 30;
    const row = Math.floor(i / 30);

    ctx.fillStyle = color;
    ctx.fillRect(
      col * tileWidth,
      row * tileHeight,
      tileWidth,
      tileHeight
    );

    // Add text for top-spend regions only
    if (i < 10 && region.spendSats > minSpend * 3) {
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px Inter';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        `${region.code}: ${formatSatsShort(region.spendSats)}`,
      col * tileWidth + tileWidth / 2,
      row * tileHeight + tileHeight / 2
      );
    }
  });

  // Legend
  ctx.fillStyle = '#ffffff';
  ctx.font = '10px Inter';
  ctx.fillText(
    `Spend: ${formatSatsShort(minSpend)} – ${formatSatsShort(maxSpend)}`,
    10,
    config.height - 20
  );

  return canvas.toDataURL();
}

/** Short format for satoshis */
function formatSatsShort(sats: number): string {
  if (sats >= 1_000_000) return `${(sats / 1_000_000).toFixed(1)}M sats`;
  if (sats >= 1_000) return `${(sats / 1_000).toFixed(1)}k sats`;
  return `${sats} sats`;
}

/** Mock data for heatmap rendering */
export const mockGeoRegions: GeoRegionData[] = [
  { code: 'US', name: 'United States', spendSats: 2_500_000, spendUsd: 225_000, impressions: 500_000, clicks: 45_000, ctr: 9.0 },
  { code: 'GB', name: 'United Kingdom', spendSats: 800_000, spendUsd: 72_000, impressions: 200_000, clicks: 18_000, ctr: 9.0 },
  { code: 'CA', name: 'Canada', spendSats: 450_000, spendUsd: 40_500, impressions: 120_000, clicks: 10_800, ctr: 9.0 },
  { code: 'DE', name: 'Germany', spendSats: 380_000, spendUsd: 34_200, impressions: 90_000, clicks: 8_100, ctr: 9.0 },
  { code: 'FR', name: 'France', spendSats: 320_000, spendUsd: 28_800, impressions: 80_000, clicks: 7_200, ctr: 9.0 },
  { code: 'JP', name: 'Japan', spendSats: 280_000, spendUsd: 25_200, impressions: 70_000, clicks: 6_300, ctr: 9.0 },
  { code: 'AU', name: 'Australia', spendSats: 180_000, spendUsd: 16_200, impressions: 50_000, clicks: 4_500, ctr: 9.0 },
  { code: 'IN', name: 'India', spendSats: 150_000, spendUsd: 13_500, impressions: 40_000, clicks: 3_600, ctr: 9.0 },
  { code: 'BR', name: 'Brazil', spendSats: 120_000, spendUsd: 10_800, impressions: 35_000, clicks: 3_150, ctr: 9.0 },
  { code: 'KR', name: 'South Korea', spendSats: 100_000, spendUsd: 9_000, impressions: 30_000, clicks: 2_700, ctr: 9.0 },
];