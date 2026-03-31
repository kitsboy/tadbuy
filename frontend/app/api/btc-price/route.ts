import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { join } from 'path';

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
let cache: { data: unknown; timestamp: number } | null = null;

export async function GET() {
  try {
    // Check cache
    if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
      return NextResponse.json({ data: cache.data, cached: true });
    }

    // Try to read from data file
    const dataDir = process.env.DATA_DIR || '/data/tadbuy-metrics';
    const filePath = join(dataDir, 'exchange-rates.json');

    let data;
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      data = JSON.parse(fileContent);


    // Update cache
    cache = { data, timestamp: Date.now() };

    return NextResponse.json({ data, cached: false });
  } catch (error) {
    console.error('Error fetching BTC price:', error);
    
    // Return fallback data
    const fallback = {
      timestamp: new Date().toISOString(),
      source: 'fallback',
      btc_usd: 67450,
      btc_prices: {
        usd: 67450,
        cad: 91150,
        eur: 62100,
        gbp: 53400,
      },
      fiat_rates: {
        cad_usd: 0.74,
        eur_usd: 1.086,
        gbp_usd: 1.263,
      },
      sats_per_usd: 1482,
      sats_per_cad: 1097,
      sats_per_eur: 1610,
      sats_per_gbp: 1873,
    };
    
    return NextResponse.json({ data: fallback, fallback: true });
  }
}
