'use client';

import { Currency } from '@/lib/types';

interface CurrencyToggleProps {
  value: Currency;
  onChange: (currency: Currency) => void;
}

const currencies: Currency[] = ['BTC', 'USD', 'CAD', 'EUR', 'GBP'];

export default function CurrencyToggle({ value, onChange }: CurrencyToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-midnight-light rounded-lg p-1">
      {currencies.map((currency) => (
        <button
          key={currency}
          onClick={() => onChange(currency)}
          className={`
            px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200
            ${value === currency
              ? 'bg-orange text-white shadow-sm'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
            }
          `}
        >
          {currency}
        </button>
      ))}
    </div>
  );
}
