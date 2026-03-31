'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ExchangeRates, AdMetrics, CostOfValue } from '@/lib/types';
import BtcTicker from '@/components/BtcTicker';
import AdMetricsTable from '@/components/AdMetricsTable';
import CostOfValueWidget from '@/components/CostOfValueWidget';

export default function Home() {
  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [adMetrics, setAdMetrics] = useState<AdMetrics | null>(null);
  const [cov, setCov] = useState<CostOfValue | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [ratesRes, adsRes, covRes] = await Promise.all([
          fetch('/api/btc-price'),
          fetch('/api/ad-metrics'),
          fetch('/api/cost-of-value'),
        ]);

        const [ratesData, adsData, covData] = await Promise.all([
          ratesRes.json(),
          adsRes.json(),
          covRes.json(),
        ]);

        setRates(ratesData.data);
        setAdMetrics(adsData.data);
        setCov(covData.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    // Refresh rates every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-midnight">
      {/* Header */}
      <header className="border-b border-white/5 bg-midnight-dark/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚡</span>
              <div>
                <h1 className="text-xl font-bold text-white">TadBuy Metrics</h1>
                <p className="text-xs text-gray-400 hidden sm:block">BTC-first ad analytics</p>
              </div>
            </div>
            <nav className="flex items-center gap-4">
              <Link
                href="/"
                className="text-sm font-medium text-orange hover:text-orange-light transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/cost-of-value"
                className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                Calculator
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero */}
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Fix the money,{' '}
            <span className="text-gradient">fix the world.</span>
          </h2>
          <p className="text-gray-400 max-w-2xl">
            Bitcoin-denominated metrics for understanding true value. 
            Energy-backed BTC valuation and ad performance in satoshis.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* BTC Price Ticker */}
          <BtcTicker rates={rates} loading={loading} />

          {/* Cost of Value Widget */}
          <CostOfValueWidget cov={cov} loading={loading} />

          {/* Ad Metrics Table - Full Width */}
          <div className="lg:col-span-2">
            <AdMetricsTable 
              metrics={adMetrics} 
              loading={loading}
              btcPrices={rates?.btc_prices || null}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-white/5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              Built with 💜 by GiveAbit
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Data: CoinGecko + Industry Benchmarks</span>
              <span className="hidden sm:inline">•</span>
              <Link 
                href="/cost-of-value" 
                className="text-orange hover:text-orange-light transition-colors"
              >
                Try the Calculator →
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
