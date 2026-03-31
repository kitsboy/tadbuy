// TypeScript types for TadBuy Metrics

export type Currency = 'BTC' | 'USD' | 'CAD' | 'EUR' | 'GBP';

export type Signal = 'buy' | 'hold' | 'sell';

export interface FiatRates {
  cad_usd: number;
  eur_usd: number;
  gbp_usd: number;
}

export interface BtcPrices {
  usd: number;
  cad: number;
  eur: number;
  gbp: number;
}

export interface ExchangeRates {
  timestamp: string;
  source: string;
  btc_usd: number;
  btc_prices: BtcPrices;
  fiat_rates: FiatRates;
  sats_per_usd: number;
  sats_per_cad: number;
  sats_per_eur: number;
  sats_per_gbp: number;
}

export interface AdMetrics {
  platform: string;
  date: string;
  timestamp: string;
  btc_price_usd: number;
  btc_prices: BtcPrices;
  cpm_sats: number;
  cpc_sats: number;
  cpa_sats: number;
  cpm_fiat: BtcPrices;
  cpc_fiat: BtcPrices;
  cpa_fiat: BtcPrices;
  cpm_usd: number;
  cpc_usd: number;
  cpa_usd: number;
  volume: number | null;
  engagement_rate: number | null;
  data_source: string;
  notes: string;
}

export interface CostOfValueInputs {
  energy_cost_usd: number;
  mining_cost_usd: number;
  opportunity_cost_usd: number;
}

export interface CostBreakdown {
  energy_pct: number;
  mining_pct: number;
  opportunity_pct: number;
}

export interface Thresholds {
  buy_below_pct: number;
  sell_above_pct: number;
}

export interface CostOfValue {
  timestamp: string;
  date: string;
  hour: string;
  inputs: CostOfValueInputs;
  btc_prices: BtcPrices;
  true_cost_sats: number;
  true_cost_usd: number;
  true_cost_fiat: BtcPrices;
  market_price_usd: number;
  market_price_fiat: BtcPrices;
  premium_pct: number;
  premium_usd: number;
  premium_fiat: BtcPrices;
  signal: Signal;
  signal_strength: number;
  signal_note: string;
  thresholds: Thresholds;
  cost_breakdown: CostBreakdown;
  formula_version: string;
  note: string;
}

export interface ConvertResult {
  input: {
    sats?: number;
    btc?: number;
    amount?: number;
    currency?: Currency;
  };
  output: {
    sats?: number;
    btc?: number;
    amount?: number;
    currency?: Currency;
  };
  all_currencies?: BtcPrices;
  rate: {
    btc_price: number;
    currency: Currency;
  };
  timestamp: string;
}
