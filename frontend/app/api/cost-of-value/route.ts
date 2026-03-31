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
    const filePath = join(dataDir, 'cost-of-value.json');

    let data;
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const allData = JSON.parse(fileContent);
      // Return the latest entry
      data = Array.isArray(allData) ? allData[allData.length - 1] : allData;
    } catch {
      // Fallback: try to fetch from backend API
      const apiUrl = process.env.API_URL || 'http://localhost:8080';
      const response = await fetch(`${apiUrl}/api/v1/cost-of-value/latest`, {
        next: { revalidate: 300 },
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
    console.error('Error fetching cost of value:', error);
    
    // Return fallback data
    const fallback = {
      timestamp: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0],
      hour: `${new Date().getHours()}:00`,
      inputs: {
        energy_cost_usd: 14500,
        mining_cost_usd: 9500,
        opportunity_cost_usd: 3000,
      },
      btc_prices: {
        usd: 67450,
        cad: 91150,
        eur: 62100,
        gbp: 53400,
      },
      true_cost_sats: 40207561,
      true_cost_usd: 27000,
      true_cost_fiat: {
        usd: 27000,
        cad: 36495,
        eur: 24858,
        gbp: 21366,
      },
      market_price_usd: 67450,
      market_price_fiat: {
        usd: 67450,
        cad: 91150,
        eur: 62100,
        gbp: 53400,
      },
      premium_pct: 149.8,
      premium_usd: 40450,
      premium_fiat: {
        usd: 40450,
        cad: 54655,
        eur: 37242,
        gbp: 32034,
      },
      signal: 'sell' as const,
      signal_strength: 119.8,
      signal_note: 'Market $67,450 is 149.8% above true cost $27,000. BTC overvalued.',
      thresholds: {
        buy_below_pct: -20,
        sell_above_pct: 30,
      },
      cost_breakdown: {
        energy_pct: 53.7,
        mining_pct: 35.2,
        opportunity_pct: 11.1,
      },
      formula_version: 'lenny-v1',
      note: 'Fallback data - calculator may not have run yet',
    };
    
    return NextResponse.json({ data: fallback, fallback: true });
  }
}
