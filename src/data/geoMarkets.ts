/** Geo Reach page — markets dataset (single source for map + list + API fallback). */

export type GeoRegion = 'all' | 'north-america' | 'europe' | 'apac' | 'latam' | 'africa' | 'oceania';

export type GeoMarket = {
  country: string;
  code: string;
  flag: string;
  region: GeoRegion;
  impressions: number;
  clicks: number;
  ctr: number;
  campaigns: number;
  spendSats: number;
  spendUsd: number;
  cpmUsd: number;
  languages: string[];
  timezone: string;
  btcAdoption: 'high' | 'medium' | 'low';
  trend: number;
  targeting: 'active' | 'paused' | 'available';
  populationReach: number;
  priority: 'P1' | 'P2' | 'P3';
};

export const GEO_REGIONS: { id: GeoRegion; label: string; icon: string }[] = [
  { id: 'all', label: 'All Regions', icon: '🌍' },
  { id: 'north-america', label: 'North America', icon: '🌎' },
  { id: 'europe', label: 'Europe', icon: '🇪🇺' },
  { id: 'apac', label: 'Asia-Pacific', icon: '🌏' },
  { id: 'latam', label: 'Latin America', icon: '🌎' },
  { id: 'africa', label: 'Africa', icon: '🌍' },
  { id: 'oceania', label: 'Oceania', icon: '🌊' },
];

export const GEO_MARKETS: GeoMarket[] = [
  { country: 'United States', code: 'US', flag: '🇺🇸', region: 'north-america', impressions: 480000, clicks: 5760, ctr: 1.2, campaigns: 12, spendSats: 8_400_000, spendUsd: 4200, cpmUsd: 8.75, languages: ['English'], timezone: 'America/New_York', btcAdoption: 'high', trend: 4.2, targeting: 'active', populationReach: 331_000_000, priority: 'P1' },
  { country: 'Germany', code: 'DE', flag: '🇩🇪', region: 'europe', impressions: 125000, clicks: 1875, ctr: 1.5, campaigns: 4, spendSats: 2_100_000, spendUsd: 1050, cpmUsd: 8.4, languages: ['German', 'English'], timezone: 'Europe/Berlin', btcAdoption: 'high', trend: 6.1, targeting: 'active', populationReach: 83_000_000, priority: 'P1' },
  { country: 'United Kingdom', code: 'GB', flag: '🇬🇧', region: 'europe', impressions: 98000, clicks: 1470, ctr: 1.5, campaigns: 3, spendSats: 1_680_000, spendUsd: 840, cpmUsd: 8.57, languages: ['English'], timezone: 'Europe/London', btcAdoption: 'high', trend: 3.8, targeting: 'active', populationReach: 67_000_000, priority: 'P1' },
  { country: 'Japan', code: 'JP', flag: '🇯🇵', region: 'apac', impressions: 87000, clicks: 1044, ctr: 1.2, campaigns: 3, spendSats: 1_440_000, spendUsd: 720, cpmUsd: 8.28, languages: ['Japanese'], timezone: 'Asia/Tokyo', btcAdoption: 'medium', trend: 2.1, targeting: 'active', populationReach: 125_000_000, priority: 'P2' },
  { country: 'Brazil', code: 'BR', flag: '🇧🇷', region: 'latam', impressions: 76000, clicks: 912, ctr: 1.2, campaigns: 2, spendSats: 1_260_000, spendUsd: 630, cpmUsd: 8.29, languages: ['Portuguese'], timezone: 'America/Sao_Paulo', btcAdoption: 'high', trend: 8.4, targeting: 'active', populationReach: 214_000_000, priority: 'P1' },
  { country: 'Canada', code: 'CA', flag: '🇨🇦', region: 'north-america', impressions: 65000, clicks: 780, ctr: 1.2, campaigns: 2, spendSats: 1_080_000, spendUsd: 540, cpmUsd: 8.31, languages: ['English', 'French'], timezone: 'America/Toronto', btcAdoption: 'high', trend: 5.0, targeting: 'active', populationReach: 38_000_000, priority: 'P2' },
  { country: 'Australia', code: 'AU', flag: '🇦🇺', region: 'oceania', impressions: 54000, clicks: 648, ctr: 1.2, campaigns: 2, spendSats: 900_000, spendUsd: 450, cpmUsd: 8.33, languages: ['English'], timezone: 'Australia/Sydney', btcAdoption: 'high', trend: 4.5, targeting: 'active', populationReach: 26_000_000, priority: 'P2' },
  { country: 'France', code: 'FR', flag: '🇫🇷', region: 'europe', impressions: 48000, clicks: 576, ctr: 1.2, campaigns: 1, spendSats: 800_000, spendUsd: 400, cpmUsd: 8.33, languages: ['French'], timezone: 'Europe/Paris', btcAdoption: 'medium', trend: 3.2, targeting: 'paused', populationReach: 67_000_000, priority: 'P2' },
  { country: 'Netherlands', code: 'NL', flag: '🇳🇱', region: 'europe', impressions: 42000, clicks: 504, ctr: 1.2, campaigns: 1, spendSats: 700_000, spendUsd: 350, cpmUsd: 8.33, languages: ['Dutch', 'English'], timezone: 'Europe/Amsterdam', btcAdoption: 'high', trend: 7.2, targeting: 'active', populationReach: 17_000_000, priority: 'P2' },
  { country: 'Singapore', code: 'SG', flag: '🇸🇬', region: 'apac', impressions: 38000, clicks: 456, ctr: 1.2, campaigns: 1, spendSats: 630_000, spendUsd: 315, cpmUsd: 8.29, languages: ['English', 'Mandarin'], timezone: 'Asia/Singapore', btcAdoption: 'high', trend: 5.8, targeting: 'active', populationReach: 5_900_000, priority: 'P2' },
  { country: 'El Salvador', code: 'SV', flag: '🇸🇻', region: 'latam', impressions: 35000, clicks: 420, ctr: 1.2, campaigns: 2, spendSats: 580_000, spendUsd: 290, cpmUsd: 8.29, languages: ['Spanish'], timezone: 'America/El_Salvador', btcAdoption: 'high', trend: 12.4, targeting: 'active', populationReach: 6_300_000, priority: 'P1' },
  { country: 'Switzerland', code: 'CH', flag: '🇨🇭', region: 'europe', impressions: 28000, clicks: 336, ctr: 1.2, campaigns: 1, spendSats: 460_000, spendUsd: 230, cpmUsd: 8.21, languages: ['German', 'French', 'Italian'], timezone: 'Europe/Zurich', btcAdoption: 'high', trend: 4.0, targeting: 'active', populationReach: 8_700_000, priority: 'P2' },
  { country: 'Nigeria', code: 'NG', flag: '🇳🇬', region: 'africa', impressions: 22000, clicks: 264, ctr: 1.2, campaigns: 1, spendSats: 360_000, spendUsd: 180, cpmUsd: 8.18, languages: ['English'], timezone: 'Africa/Lagos', btcAdoption: 'high', trend: 15.2, targeting: 'available', populationReach: 213_000_000, priority: 'P1' },
  { country: 'Argentina', code: 'AR', flag: '🇦🇷', region: 'latam', impressions: 19000, clicks: 228, ctr: 1.2, campaigns: 1, spendSats: 310_000, spendUsd: 155, cpmUsd: 8.16, languages: ['Spanish'], timezone: 'America/Buenos_Aires', btcAdoption: 'high', trend: 18.6, targeting: 'available', populationReach: 45_000_000, priority: 'P1' },
  { country: 'Portugal', code: 'PT', flag: '🇵🇹', region: 'europe', impressions: 15000, clicks: 180, ctr: 1.2, campaigns: 1, spendSats: 250_000, spendUsd: 125, cpmUsd: 8.33, languages: ['Portuguese'], timezone: 'Europe/Lisbon', btcAdoption: 'medium', trend: 6.8, targeting: 'available', populationReach: 10_000_000, priority: 'P3' },
  { country: 'India', code: 'IN', flag: '🇮🇳', region: 'apac', impressions: 14000, clicks: 168, ctr: 1.2, campaigns: 1, spendSats: 230_000, spendUsd: 115, cpmUsd: 8.21, languages: ['Hindi', 'English'], timezone: 'Asia/Kolkata', btcAdoption: 'medium', trend: 22.1, targeting: 'available', populationReach: 1_400_000_000, priority: 'P1' },
  { country: 'South Korea', code: 'KR', flag: '🇰🇷', region: 'apac', impressions: 12000, clicks: 144, ctr: 1.2, campaigns: 1, spendSats: 200_000, spendUsd: 100, cpmUsd: 8.33, languages: ['Korean'], timezone: 'Asia/Seoul', btcAdoption: 'medium', trend: 1.8, targeting: 'paused', populationReach: 51_000_000, priority: 'P3' },
  { country: 'Mexico', code: 'MX', flag: '🇲🇽', region: 'latam', impressions: 11000, clicks: 132, ctr: 1.2, campaigns: 1, spendSats: 185_000, spendUsd: 92, cpmUsd: 8.36, languages: ['Spanish'], timezone: 'America/Mexico_City', btcAdoption: 'medium', trend: 9.3, targeting: 'available', populationReach: 128_000_000, priority: 'P2' },
  { country: 'Kenya', code: 'KE', flag: '🇰🇪', region: 'africa', impressions: 9500, clicks: 114, ctr: 1.2, campaigns: 1, spendSats: 160_000, spendUsd: 80, cpmUsd: 8.42, languages: ['English', 'Swahili'], timezone: 'Africa/Nairobi', btcAdoption: 'high', trend: 14.7, targeting: 'available', populationReach: 54_000_000, priority: 'P2' },
  { country: 'Poland', code: 'PL', flag: '🇵🇱', region: 'europe', impressions: 8800, clicks: 106, ctr: 1.2, campaigns: 1, spendSats: 145_000, spendUsd: 72, cpmUsd: 8.18, languages: ['Polish'], timezone: 'Europe/Warsaw', btcAdoption: 'medium', trend: 5.5, targeting: 'available', populationReach: 38_000_000, priority: 'P3' },
  { country: 'South Africa', code: 'ZA', flag: '🇿🇦', region: 'africa', impressions: 8200, clicks: 98, ctr: 1.2, campaigns: 1, spendSats: 135_000, spendUsd: 67, cpmUsd: 8.17, languages: ['English'], timezone: 'Africa/Johannesburg', btcAdoption: 'medium', trend: 7.9, targeting: 'available', populationReach: 60_000_000, priority: 'P2' },
  { country: 'New Zealand', code: 'NZ', flag: '🇳🇿', region: 'oceania', impressions: 7500, clicks: 90, ctr: 1.2, campaigns: 1, spendSats: 125_000, spendUsd: 62, cpmUsd: 8.27, languages: ['English'], timezone: 'Pacific/Auckland', btcAdoption: 'medium', trend: 3.1, targeting: 'available', populationReach: 5_100_000, priority: 'P3' },
  { country: 'Vietnam', code: 'VN', flag: '🇻🇳', region: 'apac', impressions: 6800, clicks: 82, ctr: 1.2, campaigns: 1, spendSats: 112_000, spendUsd: 56, cpmUsd: 8.24, languages: ['Vietnamese'], timezone: 'Asia/Ho_Chi_Minh', btcAdoption: 'low', trend: 11.2, targeting: 'available', populationReach: 98_000_000, priority: 'P3' },
  { country: 'Ghana', code: 'GH', flag: '🇬🇭', region: 'africa', impressions: 5200, clicks: 62, ctr: 1.2, campaigns: 1, spendSats: 86_000, spendUsd: 43, cpmUsd: 8.27, languages: ['English'], timezone: 'Africa/Accra', btcAdoption: 'high', trend: 19.4, targeting: 'available', populationReach: 31_000_000, priority: 'P2' },
  { country: 'Philippines', code: 'PH', flag: '🇵🇭', region: 'apac', impressions: 4800, clicks: 58, ctr: 1.2, campaigns: 1, spendSats: 80_000, spendUsd: 40, cpmUsd: 8.33, languages: ['English', 'Filipino'], timezone: 'Asia/Manila', btcAdoption: 'medium', trend: 10.5, targeting: 'available', populationReach: 110_000_000, priority: 'P3' },
];

export const GEO_INSIGHTS = {
  recommended: ['NG', 'AR', 'IN', 'GH', 'MX'],
  underperforming: ['KR', 'FR'],
  spotlight: 'SV',
  coveragePercent: 68,
  avgCpmUsd: 8.31,
};

export function getGeoTotals(markets: GeoMarket[]) {
  const impressions = markets.reduce((s, m) => s + m.impressions, 0);
  const clicks = markets.reduce((s, m) => s + m.clicks, 0);
  const spendSats = markets.reduce((s, m) => s + m.spendSats, 0);
  const campaigns = markets.reduce((s, m) => s + m.campaigns, 0);
  const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
  return { impressions, clicks, spendSats, campaigns, ctr, countries: markets.length };
}

export function exportGeoCsv(markets: GeoMarket[]): string {
  const header = 'Country,Code,Region,Impressions,Clicks,CTR,Campaigns,SpendSats,SpendUSD,CPM,BTC Adoption,Trend';
  const rows = markets.map(m =>
    `"${m.country}",${m.code},${m.region},${m.impressions},${m.clicks},${m.ctr},${m.campaigns},${m.spendSats},${m.spendUsd},${m.cpmUsd},${m.btcAdoption},${m.trend}`
  );
  return [header, ...rows].join('\n');
}