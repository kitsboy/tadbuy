'use client';

import { useState, useEffect } from 'react';
import { AdMetrics, Currency, BtcPrices } from '@/lib/types';
import { formatValue, formatSats, formatTimestamp } from '@/lib/formatters';
import CurrencyToggle from './CurrencyToggle';

interface AdMetricsTableProps {
  metrics: AdMetrics | null;
  loading?: boolean;
  btcPrices: BtcPrices | null;
}

export default function AdMetricsTable({ metrics, loading = false, btcPrices }: AdMetricsTableProps) {
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

  if (loading || !metrics) {
    return (
      <div className="bg-midnight-light rounded-xl p-6 border border-white/5">
        <div className="animate-pulse space-y-4">
          <div className="flex justify-between">
            <div className="h-6 bg-white/10 rounded w-32"></div>
            <div className="h-8 bg-white/10 rounded w-48"></div>
          </div>
          <div className="h-32 bg-white/10 rounded"></div>
        </div>
      </div>
    );
  }

  const prices = btcPrices || metrics.btc_prices;

  const metricsData = [
    { label: 'CPM', description: 'Cost per 1,000 impressions', sats: metrics.cpm_sats, fiat: metrics.cpm_fiat },
    { label: 'CPC', description: 'Cost per click', sats: metrics.cpc_sats, fiat: metrics.cpc_fiat },
    { label: 'CPA', description: 'Cost per acquisition', sats: metrics.cpa_sats, fiat: metrics.cpa_fiat },
  ];

  return (
    <div className="bg-midnight-light rounded-xl p-6 border border-white/5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📊</span>
            <h2 className="text-lg font-semibold text-white">X/Twitter Ad Metrics</h2>
          </div>
          <p className="text-sm text-gray-400 mt-1">Benchmark rates in satoshis</p>
        </div>
        <CurrencyToggle value={currency} onChange={handleCurrencyChange} />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Metric</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">
                {currency === 'BTC' ? 'Sats' : currency}
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-400 hidden sm:table-cell">
                {currency === 'BTC' ? 'BTC' : 'Sats'}
              </th>
            </tr>
          </thead>
          <tbody>
            {metricsData.map((item) => {
              const formatted = formatValue(item.sats, currency, prices);
              return (
                <tr key={item.label} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4">
                    <div>
                      <span className="font-semibold text-white">{item.label}</span>
                      <p className="text-xs text-gray-500">{item.description}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-lg font-bold text-white">
                      {formatted.primary}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right hidden sm:table-cell">
                    <span className="text-sm text-gray-400">
                      {formatted.secondary}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-gray-500">
        <span>Source: {metrics.data_source}</span>
        <div className="flex items-center gap-4">
          {metrics.engagement_rate && (
            <span>Engagement: {(metrics.engagement_rate * 100).toFixed(1)}%</span>
          )}
          <span>Updated {formatTimestamp(metrics.timestamp)}</span>
        </div>
      </div>
    </div>
  );
}
