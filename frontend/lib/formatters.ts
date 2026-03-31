import { Currency, Signal } from './types';

const SATS_PER_BTC = 100_000_000;

export function satsToBtc(sats: number): number {
  return sats / SATS_PER_BTC;
}

export function btcToSats(btc: number): number {
  return Math.round(btc * SATS_PER_BTC);
}

export function formatSats(sats: number): string {
  if (sats >= 1_000_000) {
    return `${(sats / 1_000_000).toFixed(2)}M`;
  }
  if (sats >= 1_000) {
    return `${(sats / 1_000).toFixed(1)}k`;
  }
  return sats.toLocaleString();
}

export function formatSatsFull(sats: number): string {
  return sats.toLocaleString();
}

export function formatBtc(btc: number): string {
  if (btc >= 1) {
    return `${btc.toFixed(4)} BTC`;
  }
  return `${(btc * 1000).toFixed(2)} mBTC`;
}

export function formatFiat(amount: number, currency: Currency): string {
  const symbols: Record<Currency, string> = {
    BTC: '₿',
    USD: '$',
    CAD: 'CA$',
    EUR: '€',
    GBP: '£',
  };

  if (currency === 'BTC') {
    return formatBtc(amount);
  }

  return `${symbols[currency]}${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function satsToFiat(sats: number, btcPrice: number): number {
  return (sats / SATS_PER_BTC) * btcPrice;
}

export function fiatToSats(fiat: number, btcPrice: number): number {
  if (btcPrice <= 0) return 0;
  return Math.round((fiat / btcPrice) * SATS_PER_BTC);
}

export function formatValue(
  sats: number,
  currency: Currency,
  btcPrices: { usd: number; cad: number; eur: number; gbp: number }
): { primary: string; secondary: string } {
  if (currency === 'BTC') {
    const btc = satsToBtc(sats);
    return {
      primary: formatSats(sats) + ' sats',
      secondary: btc >= 0.01 ? `${btc.toFixed(4)} BTC` : `${sats.toLocaleString()} sats`,
    };
  }

  const btcPrice = btcPrices[currency.toLowerCase() as keyof typeof btcPrices] || btcPrices.usd;
  const fiatAmount = satsToFiat(sats, btcPrice);
  const btc = satsToBtc(sats);

  return {
    primary: formatFiat(fiatAmount, currency),
    secondary: `${formatSats(sats)} sats`,
  };
}

export function getSignalColor(signal: Signal): string {
  switch (signal) {
    case 'buy':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'sell':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'hold':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
}

export function getSignalEmoji(signal: Signal): string {
  switch (signal) {
    case 'buy':
      return '🟢';
    case 'sell':
      return '🔴';
    case 'hold':
      return '🟡';
    default:
      return '⚪';
  }
}

export function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function timeAgo(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
