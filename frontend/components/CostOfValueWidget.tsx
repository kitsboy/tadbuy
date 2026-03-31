'use client';

import { useState, useEffect } from 'react';
import { CostOfValue, Currency } from '@/lib/types';
import { formatValue, formatSats, formatTimestamp, formatFiat } from '@/lib/formatters';
import SignalBadge from './SignalBadge';
import CurrencyToggle from './CurrencyToggle';

interface CostOfValueWidgetProps {
  cov: CostOfValue | null;
  loading?: boolean;
}

export default function CostOfValueWidget({ cov, loading = false }: CostOfValueWidgetProps) {
  const [currency, setCurrency] = useState<Currency>('BTC');

  // Load saved currency preference
  useEffect(() => {
    const saved = localStorage.getItem('tadbuy-currency') as Currency;
    if (saved && ['BTC', 'USD', 'CAD', 'EUR', 'GBP'].includes(saved)) {
      setCurrency(saved);
    }
  }, []);

  // Save currency preference
  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    localStorage.setItem('tadbuy-currency', newCurrency);
  };

  if (loading || !cov) {
    return (
      <div className="bg-midnight-light rounded-xl p-6 border border-white/5">
        <div className="animate-pulse space-y-4">
          <div className="flex justify-between">
            <div className="h-6 bg-white/10 rounded w-40"></div>
            <div className="h-8 bg-white/10 rounded w-24"></div>
          </div>
          <div className="h-24 bg-white/10 rounded"></div>
          <div className="h-16 bg-white/10 rounded"></div>
        </div>
      </div>
    );
  }

  const trueCostFormatted = formatValue(cov.true_cost_sats, currency, cov.btc_prices);
  const marketPriceFormatted = formatValue(
    Math.round((cov.market_price_usd / cov.btc_prices.usd) * 100_000_000),
    currency,
    cov.btc_prices
  );

  const isPremium = cov.premium_pct > 0;
  const premiumColor = isPremium ? 'text-red-400' : 'text-green-400';

  return (
    <div className="bg-midnight-light rounded-xl p-6 border border-white/5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xl">⚡</span>
          <h2 className="text-lg font-semibold text-white">Cost of Value</h2>
        </div>
        <div className="flex items-center gap-3">
          <SignalBadge signal={cov.signal} size="sm" />
          <CurrencyToggle value={currency} onChange={handleCurrencyChange} />
        </div>
      </div>

      {/* Signal Note */}
      <p className="text-sm text-gray-300 mb-6 leading-relaxed">
        {cov.signal_note}
      </p>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-midnight rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">True Cost (Energy-Backed)</p>
          <p className="text-2xl font-bold text-white">{trueCostFormatted.primary}</p>
          <p className="text-xs text-gray-400 mt-1">{trueCostFormatted.secondary}</p>
        </div>
        <div className="bg-midnight rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Market Price</p>
          <p className="text-2xl font-bold text-white">{marketPriceFormatted.primary}</p>
          <p className="text-xs text-gray-400 mt-1">{marketPriceFormatted.secondary}</p>
        </div>
      </div>

      {/* Premium/Discount */}
      <div className="bg-midnight rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Market Premium/Discount</span>
          <span className={`text-xl font-bold ${premiumColor}`}>
            {cov.premium_pct > 0 ? '+' : ''}{cov.premium_pct.toFixed(1)}%
          </span>
        </div>
        <div className="mt-2 h-2 bg-midnight-light rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              cov.signal === 'buy' ? 'bg-green-500' : cov.signal === 'sell' ? 'bg-red-500' : 'bg-yellow-500'
            }`}
            style={{
              width: `${Math.min(Math.abs(cov.premium_pct) * 2, 100)}%`,
              marginLeft: cov.premium_pct < 0 ? 'auto' : '0',
              marginRight: cov.premium_pct < 0 ? '0' : 'auto',
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Buy &lt; {cov.thresholds.buy_below_pct}%</span>
          <span>Sell &gt; +{cov.thresholds.sell_above_pct}%</span>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="space-y-2 mb-4">
        <p className="text-xs text-gray-500 uppercase tracking-wide">Cost Breakdown</p>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-midnight rounded p-3 text-center">
            <p className="text-lg font-semibold text-teal">{cov.cost_breakdown.energy_pct}%</p>
            <p className="text-xs text-gray-400">Energy</p>
          </div>
          <div className="bg-midnight rounded p-3 text-center">
            <p className="text-lg font-semibold text-orange">{cov.cost_breakdown.mining_pct}%</p>
            <p className="text-xs text-gray-400">Mining</p>
          </div>
          <div className="bg-midnight rounded p-3 text-center">
            <p className="text-lg font-semibold text-blue-400">{cov.cost_breakdown.opportunity_pct}%</p>
            <p className="text-xs text-gray-400">Opportunity</p>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-white/5 text-xs text-gray-500 flex justify-between">
        <span>Formula: {cov.formula_version}</span>
        <span>Updated {formatTimestamp(cov.timestamp)}</span>
      </div>
    </div>
  );
}
