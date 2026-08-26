/**
 * Fedimint Federation Heatmap — Show mint distribution, liquidity, uptime
 * 
 * Visual rendering of global Fedimint node distribution with
 * liquidity depth and uptime metrics overlaid on a world map.
 */

export interface FederationHeat {
  lat: number;
  lng: number;
  name: string;
  mintUrl: string;
  liquiditySats: number;
  nodeCount: number;
  uptime24h: number; // 0-1
  status: 'healthy' | 'degraded' | 'offline';
}

export const MOCK_FEDIMINT_HEATMAP: FederationHeat[] = [
  { lat: 51.5074, lng: -0.1278, name: 'London Mint', mintUrl: 'https://mint.london.sats', liquiditySats: 5_000_000_000, nodeCount: 8, uptime24h: 0.998, status: 'healthy' },
  { lat: 40.7128, lng: -74.0060, name: 'NYC Mint', mintUrl: 'https://mint.nyc.sats', liquiditySats: 10_000_000_000, nodeCount: 12, uptime24h: 0.996, status: 'healthy' },
  { lat: 35.6762, lng: 139.6503, name: 'Tokyo Mint', mintUrl: 'https://mint.tokyo.sats', liquiditySats: 3_000_000_000, nodeCount: 5, uptime24h: 0.985, status: 'degraded' },
  { lat: 48.8566, lng: 2.3522, name: 'Paris Mint', mintUrl: 'https://mint.paris.sats', liquiditySats: 2_500_000_000, nodeCount: 4, uptime24h: 0.999, status: 'healthy' },
  { lat: -33.8688, lng: 151.2093, name: 'Sydney Mint', mintUrl: 'https://mint.sydney.sats', liquiditySats: 1_500_000_000, nodeCount: 3, uptime24h: 0.95, status: 'degraded' },
];

export function getHeatColor(liquidity: number): string {
  if (liquidity > 5_000_000_000) return '#22c55e';
  if (liquidity > 2_000_000_000) return '#84cc16';
  if (liquidity > 1_000_000_000) return '#f59e0b';
  return '#ef4444';
}

export function formatLiquidity(liquidity: number): string {
  if (liquidity >= 1_000_000_000) return `${(liquidity / 1_000_000_000).toFixed(1)}B sats`;
  if (liquidity >= 1_000_000) return `${(liquidity / 1_000_000).toFixed(1)}M sats`;
  return `${liquidity.toLocaleString()} sats`;
}