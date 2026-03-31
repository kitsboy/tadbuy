import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { join } from 'path';

const CACHE_TTL = 60 * 60 * 1000; // 1 hour
let cache: { data: unknown; timestamp: number } | null = null;

export async function GET() {
  try {
    // Check cache
    if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
      return NextResponse.json({ data: cache.data, cached: true });
    }

    // Try to read from data file
    const dataDir = process.env.DATA_DIR || '/data/tadbuy-metrics';
    const filePath = join(dataDir, 'ad-metrics.json');

    let data;
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const allData = JSON.parse(fileContent);
      // Return the latest entry
      data = Array.isArray(allData) ? allData[allData.length - 1] : allData;
    } catch {
      // Fallback: try to fetch from backend API
      const apiUrl = process.env.API_URL || 'http://localhost:8080';
      const response = await fetch(`${apiUrl}/api/v1/ads/x/latest`, {
        next: { revalidate: 3600 },
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const apiData = await response.json();
      data = apiData.data;
    }

    // Update cache
    cache = { data, timestamp: Date.now() };

    return NextResponse.json({ data, cached: false });
  } catch (error) {
    console.error('Error fetching ad metrics:', error);
    
    // Return fallback data
    const fallback = {
      platform: 'x_twitter',
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString(),
      btc_price_usd: 67450,
      btc_prices: {
        usd: 67450,
        cad: 91150,
        eur: 62100,
        gbp: 53400,
      },
      cpm_sats: 9575,
      cpc_sats: 859,
      cpa_sats: 38533,
      cpm_fiat: {
        usd: 6.46,
        cad: 8.73,
        eur: 5.95,
        gbp: 5.11,
      },
      cpc_fiat: {
        usd: 0.58,
        cad: 0.78,
        eur: 0.53,
        gbp: 0.46,
      },
      cpa_fiat: {
        usd: 26.00,
        cad: 35.13,
        eur: 23.93,
        gbp: 20.58,
      },
      cpm_usd: 6.46,
      cpc_usd: 0.58,
      cpa_usd: 26.00,
      volume: null,
      engagement_rate: 0.045,
      data_source: 'Industry benchmarks (Wordstream/Socialinsider 2025-Q4 median)',
      notes: 'Fallback data - scraper may not have run yet',
    };
    
    return NextResponse.json({ data: fallback, fallback: true });
  }
}
