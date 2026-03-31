'use client';

import { useState, useEffect } from 'react';
import { ExchangeRates, Currency } from '@/lib/types';
import { formatFiat, formatSats, timeAgo } from '@/lib/formatters';
import CurrencyToggle from './CurrencyToggle';

interface BtcTickerProps {
  rates: ExchangeRates | null;
  loading?: boolean;
}

export default function BtcTicker({ rates, loading = false }: BtcTickerProps) {
  const [currency, setCurrency] = useState<Currency>('USD');

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

  if (loading || !rates) {
    return (
      <div className="bg-midnight-light rounded-xl p-6 border border-white/5">
        <div className="animate-pulse">
          <div className="h-4 bg-white/10 rounded w-24 mb-4"></div>
          <div className="h-12 bg-white/10 rounded w-48 mb-2"></div>
          <div className="h-3 bg-white/10 rounded w-32"></div>
        </div>
      </div>
    );
  }

  const btcPrice = rates.btc_prices[currency.toLowerCase() as keyof typeof rates.btc_prices] || rates.btc_usd;
  const satsPerUnit = rates[`sats_per_${currency.toLowerCase()}` as keyof typeof rates] || rates.sats_per_usd;

  return (
    <div className="bg-midnight-light rounded-xl p-6 border border-white/5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">₿</span>
          <h2 className="text-lg font-semibold text-white">Bitcoin Price</h2>
        </div>
        <CurrencyToggle value={currency} onChange={handleCurrencyChange} />
      </div>

      <div className="space-y-1">
        {currency === 'BTC' ? (
          <>
            <p className="text-4xl font-bold text-white">1.00000000 BTC</p>
            <p className="text-sm text-gray-400">
              = {formatFiat(btcPrice, 'USD')} USD
            </p>
          </>
        ) : (
          <>
            <p className="text-4xl font-bold text-white">
              {formatFiat(btcPrice, currency)}
            </p>
            <p className="text-sm text-teal">
              {formatSats(Math.round(satsPerUnit as number))} sats per {currency}
            </p>
          </>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
        <span>Source: {rates.source}</span>
        <span>Updated {timeAgo(rates.timestamp)}</span>
      </div>
    </div>
  );
}
