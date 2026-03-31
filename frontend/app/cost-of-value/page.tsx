'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CostOfValue, Currency, BtcPrices } from '@/lib/types';
import { formatValue, formatFiat, getSignalColor, getSignalEmoji } from '@/lib/formatters';
import CurrencyToggle from '@/components/CurrencyToggle';

// Default BTC prices for calculations
const DEFAULT_BTC_PRICES: BtcPrices = {
  usd: 67450,
  cad: 91150,
  eur: 62100,
  gbp: 53400,
};

export default function CostOfValueCalculator() {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [energyCost, setEnergyCost] = useState<number>(0.05);
  const [miningEfficiency, setMiningEfficiency] = useState<number>(30);
  const [btcPrices, setBtcPrices] = useState<BtcPrices>(DEFAULT_BTC_PRICES);
  const [loading, setLoading] = useState(true);

  // Load currency preference and fetch BTC prices
  useEffect(() => {
    const saved = localStorage.getItem('tadbuy-currency') as Currency;
    if (saved && ['BTC', 'USD', 'CAD', 'EUR', 'GBP'].includes(saved)) {
      setCurrency(saved);
    }

    // Fetch BTC prices
    fetch('/api/btc-price')
      .then(res => res.json())
      .then(data => {
        if (data.data?.btc_prices) {
          setBtcPrices(data.data.btc_prices);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    localStorage.setItem('tadbuy-currency', newCurrency);
  };

  // Calculate cost of value
  // Formula: energy_cost_per_btc = (energy_cost_per_kwh * mining_efficiency_w_per_th * 1000) / 1000
  // Simplified: true_cost_usd = energy_cost * mining_efficiency * 100 (rough approximation for demo)
  const calculateCostOfValue = () => {
    const TH_PER_BTC = 100_000_000 / (1000 * 3600 * 24 * 30); // Rough TH needed per BTC per month
    const kWhPerBTC = (miningEfficiency * 1000 * 24 * 30) / 1000; // kWh per BTC
    const energyCostPerBTC = energyCost * kWhPerBTC;
    
    // Add mining and opportunity costs (simplified model)
    const miningCostPerBTC = energyCostPerBTC * 0.65; // Hardware/facility costs
    const opportunityCostPerBTC = energyCostPerBTC * 0.20; // Capital cost
    
    const trueCostUSD = energyCostPerBTC + miningCostPerBTC + opportunityCostPerBTC;
    const marketPriceUSD = btcPrices.usd;
    
    const premiumPct = ((marketPriceUSD - trueCostUSD) / trueCostUSD) * 100;
    
    // Determine signal
    let signal: 'buy' | 'hold' | 'sell' = 'hold';
    if (premiumPct < -20) signal = 'buy';
    else if (premiumPct > 30) signal = 'sell';
    
    // Calculate sats
    const satsPerBTC = 100_000_000;
    const trueCostSats = Math.round((trueCostUSD / marketPriceUSD) * satsPerBTC);
    
    return {
      trueCostUSD,
      trueCostSats,
      marketPriceUSD,
      premiumPct,
      signal,
      breakdown: {
        energy: energyCostPerBTC,
        mining: miningCostPerBTC,
        opportunity: opportunityCostPerBTC,
      },
    };
  };

  const result = calculateCostOfValue();
  const formattedTrueCost = formatValue(result.trueCostSats, currency, btcPrices);
  const formattedMarketPrice = formatValue(
    Math.round((result.marketPriceUSD / btcPrices.usd) * 100_000_000),
    currency,
    btcPrices
  );

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
                <p className="text-xs text-gray-400 hidden sm:block">Cost of Value Calculator</p>
              </div>
            </div>
            <nav className="flex items-center gap-4">
              <Link
                href="/"
                className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/cost-of-value"
                className="text-sm font-medium text-orange hover:text-orange-light transition-colors"
              >
                Calculator
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero */}
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Cost of Value{' '}
            <span className="text-gradient">Calculator</span>
          </h2>
          <p className="text-gray-400">
            Calculate the true energy-backed cost of producing 1 BTC. 
            Compare to market price for buy/hold/sell signals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="bg-midnight-light rounded-xl p-6 border border-white/5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Inputs</h3>
              <CurrencyToggle value={currency} onChange={handleCurrencyChange} />
            </div>

            <div className="space-y-6">
              {/* Energy Cost */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Energy Cost
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max="1"
                    value={energyCost}
                    onChange={(e) => setEnergyCost(parseFloat(e.target.value) || 0)}
                    className="flex-1 bg-midnight border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange"
                  />
                  <span className="text-sm text-gray-400 w-16">$/kWh</span>
                </div>
                <input
                  type="range"
                  min="0.03"
                  max="0.50"
                  step="0.01"
                  value={energyCost}
                  onChange={(e) => setEnergyCost(parseFloat(e.target.value))}
                  className="w-full mt-2 accent-orange"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>$0.03</span>
                  <span>$0.50</span>
                </div>
              </div>

              {/* Mining Efficiency */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Mining Efficiency
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    step="1"
                    min="15"
                    max="100"
                    value={miningEfficiency}
                    onChange={(e) => setMiningEfficiency(parseInt(e.target.value) || 0)}
                    className="flex-1 bg-midnight border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange"
                  />
                  <span className="text-sm text-gray-400 w-16">W/TH</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="100"
                  step="1"
                  value={miningEfficiency}
                  onChange={(e) => setMiningEfficiency(parseInt(e.target.value))}
                  className="w-full mt-2 accent-orange"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>15 W/TH (efficient)</span>
                  <span>100 W/TH (older)</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/5">
              <p className="text-xs text-gray-500">
                Default values based on global average electricity rates and modern ASIC efficiency.
              </p>
            </div>
          </div>

          {/* Results */}
          <div className="bg-midnight-light rounded-xl p-6 border border-white/5">
            <h3 className="text-lg font-semibold text-white mb-6">Results</h3>

            {/* Signal */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm text-gray-400">Signal</span>
              <span className={`inline-flex items-center gap-1.5 font-semibold uppercase tracking-wide border rounded-full px-3 py-1 text-sm ${getSignalColor(result.signal)}`}>
                <span>{getSignalEmoji(result.signal)}</span>
                <span>{result.signal}</span>
              </span>
            </div>

            {/* Key Metrics */}
            <div className="space-y-4 mb-6">
              <div className="bg-midnight rounded-lg p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">True Cost (Energy-Backed)</p>
                <p className="text-2xl font-bold text-white">{formattedTrueCost.primary}</p>
                <p className="text-xs text-gray-400 mt-1">{formattedTrueCost.secondary}</p>
              </div>
              <div className="bg-midnight rounded-lg p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Market Price</p>
                <p className="text-2xl font-bold text-white">{formattedMarketPrice.primary}</p>
                <p className="text-xs text-gray-400 mt-1">{formattedMarketPrice.secondary}</p>
              </div>
            </div>

            {/* Premium/Discount */}
            <div className="bg-midnight rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Market Premium/Discount</span>
                <span className={`text-xl font-bold ${result.premiumPct > 0 ? 'text-red-400' : 'text-green-400'}`}>
                  {result.premiumPct > 0 ? '+' : ''}{result.premiumPct.toFixed(1)}%
                </span>
              </div>
              <div className="mt-2 h-2 bg-midnight-light rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    result.signal === 'buy' ? 'bg-green-500' : result.signal === 'sell' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}
                  style={{
                    width: `${Math.min(Math.abs(result.premiumPct) * 2, 100)}%`,
                    marginLeft: result.premiumPct < 0 ? 'auto' : '0',
                    marginRight: result.premiumPct < 0 ? '0' : 'auto',
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Buy &lt; -20%</span>
                <span>Sell &gt; +30%</span>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="space-y-2">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Cost Breakdown</p>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-midnight rounded p-3 text-center">
                  <p className="text-lg font-semibold text-teal">
                    {((result.breakdown.energy / result.trueCostUSD) * 100).toFixed(0)}%
                  </p>
                  <p className="text-xs text-gray-400">Energy</p>
                </div>
                <div className="bg-midnight rounded p-3 text-center">
                  <p className="text-lg font-semibold text-orange">
                    {((result.breakdown.mining / result.trueCostUSD) * 100).toFixed(0)}%
                  </p>
                  <p className="text-xs text-gray-400">Mining</p>
                </div>
                <div className="bg-midnight rounded p-3 text-center">
                  <p className="text-lg font-semibold text-blue-400">
                    {((result.breakdown.opportunity / result.trueCostUSD) * 100).toFixed(0)}%
                  </p>
                  <p className="text-xs text-gray-400">Opportunity</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-midnight-light rounded-xl p-6 border border-white/5">
          <h4 className="font-semibold text-white mb-2">About Cost of Value</h4>
          <p className="text-sm text-gray-400 leading-relaxed">
            The Cost of Value (CoV) is an energy-backed valuation model for Bitcoin. 
            It calculates the true cost of producing 1 BTC based on electricity costs, 
            mining hardware efficiency, facility costs, and opportunity cost of capital. 
            When market price falls below true cost by 20% or more, it may be a buying opportunity. 
            When market price exceeds true cost by 30% or more, it may be overvalued.
          </p>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-white/5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              Built with 💜 by GiveAbit
            </p>
            <Link 
              href="/" 
              className="text-sm text-orange hover:text-orange-light transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
