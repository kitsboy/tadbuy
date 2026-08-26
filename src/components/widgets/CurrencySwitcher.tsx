import React, { createContext, useContext, useState, useEffect } from 'react';

export type CurrencyMode = 'SAT' | 'BTC' | 'USD' | 'EUR' | 'GBP';

interface CurrencyContextType {
  currency: CurrencyMode;
  setCurrency: (c: CurrencyMode) => void;
  formatAmount: (sats: number) => string;
  btcPriceUsd: number;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'SAT',
  setCurrency: () => {},
  formatAmount: (sats) => `${sats.toLocaleString()} sats`,
  btcPriceUsd: 95000,
});

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyMode>(() => {
    return (localStorage.getItem('tadbuy_currency') as CurrencyMode) || 'SAT';
  });
  const btcPriceUsd = 95000;

  const setCurrency = (c: CurrencyMode) => {
    setCurrencyState(c);
    localStorage.setItem('tadbuy_currency', c);
  };

  const formatAmount = (sats: number): string => {
    if (currency === 'BTC') {
      return `${(sats / 100_000_000).toFixed(6)} ₿`;
    }
    if (currency === 'USD') {
      const usd = (sats / 100_000_000) * btcPriceUsd;
      return `$${usd.toFixed(2)}`;
    }
    if (currency === 'EUR') {
      const eur = (sats / 100_000_000) * btcPriceUsd * 0.92;
      return `€${eur.toFixed(2)}`;
    }
    if (currency === 'GBP') {
      const gbp = (sats / 100_000_000) * btcPriceUsd * 0.78;
      return `£${gbp.toFixed(2)}`;
    }
    return `${sats.toLocaleString()} sats`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatAmount, btcPriceUsd }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencySelectToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className={`inline-flex items-center bg-zinc-900/80 border border-white/10 rounded-full p-1 shadow-inner text-xs ${className}`}>
      {(['SAT', 'BTC', 'USD', 'EUR'] as CurrencyMode[]).map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => setCurrency(c)}
          className={`px-2.5 py-1 rounded-full font-mono text-[11px] font-semibold transition-all touch-manipulation ${
            currency === c
              ? 'bg-gradient-to-r from-accent to-fuchsia-500 text-zinc-950 shadow-md font-bold'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          {c}
        </button>
      ))}
    </div>
  );
};
