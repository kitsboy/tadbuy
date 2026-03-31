/**
 * Multi-Currency Exchange Rate Module — TadBuy Metrics
 *
 * Fetches and caches USD, CAD, EUR, GBP exchange rates.
 * Converts any fiat amount to/from satoshis.
 * Primary denomination: BTC (satoshis)
 *
 * Usage:
 *   import { MultiCurrency } from './multi-currency';
 *   const mc = new MultiCurrency();
 *   await mc.refreshRates();
 *   const sats = mc.fiatToSats(5.00, 'CAD');
 *   const cad = mc.satsToFiat(100_000, 'CAD');
 *
 * @license MIT
 * @author GiveAbit
 */

// ── Types ──────────────────────────────────────────────────────────────

export type FiatCurrency = 'USD' | 'CAD' | 'EUR' | 'GBP';

export interface ExchangeRates {
  /** BTC price in USD */
  btc_usd: number;
  /** Fiat-to-USD rates (how many USD per 1 unit of fiat) */
  rates: Record<FiatCurrency, number>;
  /** ISO 8601 timestamp of last fetch */
  fetched_at: string;
  /** Source of the data */
  source: string;
}

export interface CachedRates extends ExchangeRates {
  /** Cache expiry timestamp (ms since epoch) */
  expires_at: number;
}

export interface FormattedValue {
  /** Raw numeric amount */
  amount: number;
  /** Formatted string with currency symbol */
  display: string;
  /** Currency code */
  currency: FiatCurrency | 'BTC' | 'sats';
}

// ── Constants ──────────────────────────────────────────────────────────

const SATS_PER_BTC = 100_000_000;

/** Cache duration in milliseconds (5 minutes) */
const CACHE_TTL_MS = 5 * 60 * 1000;

/** Currency display config */
const CURRENCY_CONFIG: Record<FiatCurrency, {
  symbol: string;
  prefix: string;
  locale: string;
  decimals: number;
}> = {
  USD: { symbol: '$', prefix: '', locale: 'en-US', decimals: 2 },
  CAD: { symbol: '$', prefix: 'CA', locale: 'en-CA', decimals: 2 },
  EUR: { symbol: '€', prefix: '', locale: 'de-DE', decimals: 2 },
  GBP: { symbol: '£', prefix: '', locale: 'en-GB', decimals: 2 },
};

/**
 * Primary BTC price API — CoinGecko (free, no key)
 * Returns BTC price in USD, CAD, EUR, GBP simultaneously
 */
const BTC_PRICE_URL =
  'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,cad,eur,gbp';

/**
 * Fallback: exchangerate.host (free, no key)
 * For fiat cross-rates if CoinGecko only returns USD
 */
const FIAT_RATES_URL =
  'https://api.exchangerate.host/latest?base=USD&symbols=CAD,EUR,GBP';

// ── Main Class ─────────────────────────────────────────────────────────

export class MultiCurrency {
  private cache: CachedRates | null = null;
  private fetchPromise: Promise<ExchangeRates> | null = null;

  /**
   * Get current rates, refreshing if cache is expired.
   * Deduplicates concurrent requests.
   */
  async getRates(): Promise<ExchangeRates> {
    if (this.cache && Date.now() < this.cache.expires_at) {
      return this.cache;
    }
    return this.refreshRates();
  }

  /**
   * Force-refresh exchange rates from APIs.
   * Uses CoinGecko for BTC prices in all 4 currencies,
   * then derives cross-rates from those.
   */
  async refreshRates(): Promise<ExchangeRates> {
    // Deduplicate concurrent refreshes
    if (this.fetchPromise) {
      return this.fetchPromise;
    }

    this.fetchPromise = this._fetchRates();
    try {
      const rates = await this.fetchPromise;
      this.cache = {
        ...rates,
        expires_at: Date.now() + CACHE_TTL_MS,
      };
      return rates;
    } finally {
      this.fetchPromise = null;
    }
  }

  /**
   * Convert a fiat amount to satoshis.
   *
   * @param amount - Fiat amount (e.g., 5.00)
   * @param currency - Fiat currency code (USD, CAD, EUR, GBP)
   * @returns Satoshi amount (integer)
   *
   * @example
   *   // $5.00 CAD at BTC=$67,450 USD, CAD/USD=0.74
   *   const sats = await mc.fiatToSats(5.00, 'CAD');
   *   // → ~5,496 sats
   */
  async fiatToSats(amount: number, currency: FiatCurrency): Promise<number> {
    const rates = await this.getRates();
    const usdAmount = this.fiatToUsd(amount, currency, rates);
    const btcAmount = usdAmount / rates.btc_usd;
    return Math.round(btcAmount * SATS_PER_BTC);
  }

  /**
   * Convert satoshis to a fiat amount.
   *
   * @param sats - Satoshi amount
   * @param currency - Target fiat currency
   * @returns Fiat amount (decimal)
   *
   * @example
   *   const cad = await mc.satsToFiat(100_000, 'CAD');
   *   // → ~91.22 CAD
   */
  async satsToFiat(sats: number, currency: FiatCurrency): Promise<number> {
    const rates = await this.getRates();
    const btcAmount = sats / SATS_PER_BTC;
    const usdAmount = btcAmount * rates.btc_usd;
    return this.usdToFiat(usdAmount, currency, rates);
  }

  /**
   * Convert satoshis to all 4 fiat currencies at once.
   *
   * @param sats - Satoshi amount
   * @returns Object with amounts in all currencies
   */
  async satsToAllFiat(sats: number): Promise<Record<FiatCurrency, number>> {
    const rates = await this.getRates();
    const btcAmount = sats / SATS_PER_BTC;
    const usdAmount = btcAmount * rates.btc_usd;

    return {
      USD: round2(usdAmount),
      CAD: round2(this.usdToFiat(usdAmount, 'CAD', rates)),
      EUR: round2(this.usdToFiat(usdAmount, 'EUR', rates)),
      GBP: round2(this.usdToFiat(usdAmount, 'GBP', rates)),
    };
  }

  /**
   * Format a satoshi amount for display in a given currency.
   *
   * @param sats - Satoshi amount
   * @param currency - Target fiat currency (or 'BTC' or 'sats')
   * @returns Formatted string
   *
   * @example
   *   mc.formatSats(100_000, 'CAD') // → "CA$91.22"
   *   mc.formatSats(100_000, 'USD') // → "$67.45"
   *   mc.formatSats(100_000, 'sats') // → "100,000 sats"
   *   mc.formatSats(100_000, 'BTC') // → "₿0.00100000"
   */
  async formatSats(
    sats: number,
    currency: FiatCurrency | 'BTC' | 'sats',
  ): Promise<string> {
    if (currency === 'sats') {
      return `${sats.toLocaleString('en-US')} sats`;
    }

    if (currency === 'BTC') {
      const btc = sats / SATS_PER_BTC;
      return `₿${btc.toFixed(8)}`;
    }

    const fiatAmount = await this.satsToFiat(sats, currency);
    return formatFiatAmount(fiatAmount, currency);
  }

  /**
   * Format a fiat amount with proper currency symbol.
   * CAD uses "CA$" prefix to distinguish from USD "$".
   */
  formatFiat(amount: number, currency: FiatCurrency): string {
    return formatFiatAmount(amount, currency);
  }

  /**
   * Get the current BTC price in a specific fiat currency.
   */
  async getBtcPrice(currency: FiatCurrency = 'USD'): Promise<number> {
    const rates = await this.getRates();
    if (currency === 'USD') return rates.btc_usd;
    return this.usdToFiat(rates.btc_usd, currency, rates);
  }

  /**
   * Check if cache is still valid.
   */
  isCacheValid(): boolean {
    return this.cache !== null && Date.now() < this.cache.expires_at;
  }

  /**
   * Get cache age in seconds, or null if no cache.
   */
  getCacheAge(): number | null {
    if (!this.cache) return null;
    return Math.round((Date.now() - new Date(this.cache.fetched_at).getTime()) / 1000);
  }

  /**
   * Export current rates as a JSON-serializable object.
   * Suitable for saving to /data/tadbuy-metrics/exchange-rates.json
   */
  async exportRates(): Promise<object> {
    const rates = await this.getRates();
    const btcPrices: Record<string, number> = {};
    for (const cur of ['USD', 'CAD', 'EUR', 'GBP'] as FiatCurrency[]) {
      btcPrices[cur] = round2(await this.getBtcPrice(cur));
    }

    return {
      timestamp: rates.fetched_at,
      source: rates.source,
      btc_usd: rates.btc_usd,
      btc_prices: btcPrices,
      fiat_rates: {
        USD_USD: 1.0,
        CAD_USD: rates.rates.CAD,
        EUR_USD: rates.rates.EUR,
        GBP_USD: rates.rates.GBP,
      },
      cache_ttl_seconds: CACHE_TTL_MS / 1000,
    };
  }

  // ── Internal helpers ─────────────────────────────────────────────────

  /**
   * Convert fiat to USD using stored rates.
   * Rates are stored as "1 unit of fiat = X USD".
   */
  private fiatToUsd(
    amount: number,
    currency: FiatCurrency,
    rates: ExchangeRates,
  ): number {
    if (currency === 'USD') return amount;
    return amount * rates.rates[currency];
  }

  /**
   * Convert USD to fiat using stored rates.
   */
  private usdToFiat(
    usdAmount: number,
    currency: FiatCurrency,
    rates: ExchangeRates,
  ): number {
    if (currency === 'USD') return usdAmount;
    return usdAmount / rates.rates[currency];
  }

  /**
   * Fetch rates from CoinGecko.
   * CoinGecko returns BTC price in each currency directly,
   * so we derive the fiat cross-rates from that.
   *
   * Example response:
   *   { "bitcoin": { "usd": 67450, "cad": 91150, "eur": 62100, "gbp": 53400 } }
   *
   * From this we derive:
   *   CAD/USD = btc_usd / btc_cad = 67450 / 91150 ≈ 0.74
   *   (i.e., 1 CAD = 0.74 USD)
   */
  private async _fetchRates(): Promise<ExchangeRates> {
    const now = new Date().toISOString();

    try {
      const resp = await fetch(BTC_PRICE_URL);
      if (!resp.ok) throw new Error(`CoinGecko HTTP ${resp.status}`);

      const data = await resp.json();
      const btc = data.bitcoin;

      if (!btc?.usd) throw new Error('Missing BTC/USD from CoinGecko');

      const btcUsd = btc.usd;
      const btcCad = btc.cad ?? btcUsd * 1.35; // fallback estimate
      const btcEur = btc.eur ?? btcUsd * 0.92;
      const btcGbp = btc.gbp ?? btcUsd * 0.79;

      // Derive fiat-to-USD rates:
      // If 1 BTC = $67,450 USD and 1 BTC = CA$91,150,
      // then 1 CAD = 67450/91150 = 0.74 USD
      return {
        btc_usd: btcUsd,
        rates: {
          USD: 1.0,
          CAD: btcUsd / btcCad,  // 1 CAD = X USD
          EUR: btcUsd / btcEur,  // 1 EUR = X USD
          GBP: btcUsd / btcGbp,  // 1 GBP = X USD
        },
        fetched_at: now,
        source: 'coingecko',
      };
    } catch (err) {
      // Fallback: use hardcoded approximate rates
      console.warn(`[multi-currency] API fetch failed, using fallback rates: ${err}`);
      return {
        btc_usd: 67_450,
        rates: {
          USD: 1.0,
          CAD: 0.74,   // 1 CAD ≈ 0.74 USD
          EUR: 1.08,   // 1 EUR ≈ 1.08 USD
          GBP: 1.27,   // 1 GBP ≈ 1.27 USD
        },
        fetched_at: now,
        source: 'fallback',
      };
    }
  }
}

// ── Utility Functions ──────────────────────────────────────────────────

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * Format a fiat amount with proper currency symbol.
 *
 * USD → "$1,234.56"
 * CAD → "CA$1,234.56"
 * EUR → "€1,234.56"
 * GBP → "£1,234.56"
 */
function formatFiatAmount(amount: number, currency: FiatCurrency): string {
  const config = CURRENCY_CONFIG[currency];
  const formatted = Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: config.decimals,
    maximumFractionDigits: config.decimals,
  });

  const sign = amount < 0 ? '-' : '';
  return `${sign}${config.prefix}${config.symbol}${formatted}`;
}

/**
 * Convert satoshis to BTC (decimal).
 */
export function satsToBtc(sats: number): number {
  return sats / SATS_PER_BTC;
}

/**
 * Convert BTC to satoshis.
 */
export function btcToSats(btc: number): number {
  return Math.round(btc * SATS_PER_BTC);
}

// ── Singleton Export ───────────────────────────────────────────────────

/** Default singleton instance */
export const multiCurrency = new MultiCurrency();

// ── CLI Test (run with ts-node or tsx) ─────────────────────────────────

if (typeof require !== 'undefined' && require.main === module) {
  (async () => {
    const mc = new MultiCurrency();
    console.log('Fetching exchange rates...');
    const rates = await mc.refreshRates();
    console.log('\n📊 Exchange Rates:');
    console.log(`  BTC/USD: $${rates.btc_usd.toLocaleString()}`);
    console.log(`  CAD/USD: ${rates.rates.CAD.toFixed(4)}`);
    console.log(`  EUR/USD: ${rates.rates.EUR.toFixed(4)}`);
    console.log(`  GBP/USD: ${rates.rates.GBP.toFixed(4)}`);

    const testSats = 100_000;
    console.log(`\n💰 ${testSats.toLocaleString()} sats =`);
    for (const cur of ['USD', 'CAD', 'EUR', 'GBP'] as FiatCurrency[]) {
      const formatted = await mc.formatSats(testSats, cur);
      console.log(`  ${formatted}`);
    }

    console.log(`\n📦 Exported rates:`);
    console.log(JSON.stringify(await mc.exportRates(), null, 2));
  })();
}
