#!/usr/bin/env python3
"""
Cost-of-Value Calculator — TadBuy Metrics
Energy-backed BTC valuation with multi-currency support.

Formula: true_cost = energy_cost + mining_cost + opportunity_cost
Signal:  buy if market < true_cost by 20%, sell if > 30%, else hold

All values stored in satoshis. Multi-currency fiat display.

Run:  python cost-of-value.py
Cron: 0 * * * * (hourly)

@license MIT
@author GiveAbit
"""

import json
import logging
import os
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from urllib.request import urlopen, Request

# ── Config ──────────────────────────────────────────────────────────────
DATA_DIR = Path(os.environ.get("DATA_DIR", "/data/tadbuy-metrics"))
OUTPUT_FILE = DATA_DIR / "cost-of-value.json"
LOG_DIR = DATA_DIR / "logs"
SATS_PER_BTC = 100_000_000

# Thresholds for signal generation
BUY_THRESHOLD = float(os.environ.get("COV_BUY_THRESHOLD", "-0.20"))   # -20% = buy
SELL_THRESHOLD = float(os.environ.get("COV_SELL_THRESHOLD", "0.30"))   # +30% = sell

# BTC price + multi-currency source
BTC_PRICE_URL = os.environ.get(
    "BTC_PRICE_URL",
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,cad,eur,gbp",
)

# ── Default cost inputs ────────────────────────────────────────────────
# Energy: avg global electricity cost to mine 1 BTC
DEFAULT_ENERGY_COST_USD = float(os.environ.get("COV_ENERGY_COST_USD", "14500"))
# Mining: hardware amortization + facility costs per BTC
DEFAULT_MINING_COST_USD = float(os.environ.get("COV_MINING_COST_USD", "9500"))
# Opportunity: capital cost of mining investment per BTC
DEFAULT_OPPORTUNITY_COST_USD = float(os.environ.get("COV_OPPORTUNITY_COST_USD", "3000"))

MAX_RETRIES = int(os.environ.get("SCRAPER_MAX_RETRIES", "3"))
RETRY_DELAY = int(os.environ.get("SCRAPER_RETRY_DELAY", "10"))

# ── Logging ─────────────────────────────────────────────────────────────
LOG_DIR.mkdir(parents=True, exist_ok=True)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler(LOG_DIR / "cost-of-value.log"),
    ],
)
log = logging.getLogger("cost-of-value")


# ── Helpers ─────────────────────────────────────────────────────────────
def http_get_json(url: str, timeout: int = 15) -> dict:
    req = Request(url, headers={"User-Agent": "TadBuyMetrics/1.0"})
    with urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode())


def fetch_btc_prices() -> dict:
    """Get BTC price in all supported currencies."""
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            data = http_get_json(BTC_PRICE_URL)
            prices = data["bitcoin"]
            return {
                "usd": float(prices["usd"]),
                "cad": float(prices.get("cad", prices["usd"] * 1.35)),
                "eur": float(prices.get("eur", prices["usd"] * 0.92)),
                "gbp": float(prices.get("gbp", prices["usd"] * 0.79)),
            }
        except Exception as e:
            log.warning(f"BTC price fetch attempt {attempt}/{MAX_RETRIES} failed: {e}")
            if attempt < MAX_RETRIES:
                time.sleep(RETRY_DELAY)
    raise RuntimeError("Failed to fetch BTC prices after all retries")


def usd_to_sats(usd: float, btc_price_usd: float) -> int:
    if btc_price_usd <= 0:
        return 0
    return round((usd / btc_price_usd) * SATS_PER_BTC)


def sats_to_fiat(sats: int, btc_price_fiat: float) -> float:
    return round((sats / SATS_PER_BTC) * btc_price_fiat, 2)


# ── Core Calculator ─────────────────────────────────────────────────────
def calculate_cost_of_value(
    energy_cost_usd: float | None = None,
    mining_cost_usd: float | None = None,
    opportunity_cost_usd: float | None = None,
    btc_price_usd: float | None = None,
) -> dict:
    """
    Calculate true cost of producing 1 BTC and compare to market.

    Formula:
        true_cost = energy + mining + opportunity
        premium = (market - true_cost) / true_cost
        signal = buy/hold/sell based on thresholds

    Returns dict with sats-primary values and multi-currency fiat.
    """
    now = datetime.now(timezone.utc)

    energy = energy_cost_usd if energy_cost_usd is not None else DEFAULT_ENERGY_COST_USD
    mining = mining_cost_usd if mining_cost_usd is not None else DEFAULT_MINING_COST_USD
    opportunity = opportunity_cost_usd if opportunity_cost_usd is not None else DEFAULT_OPPORTUNITY_COST_USD

    # Fetch multi-currency BTC prices
    btc_prices = fetch_btc_prices()
    market_price = btc_price_usd if btc_price_usd is not None else btc_prices["usd"]

    # ── Core formula ────────────────────────────────────────────────────
    true_cost_usd = energy + mining + opportunity

    if true_cost_usd <= 0:
        raise ValueError("True cost must be positive")

    premium_pct = (market_price - true_cost_usd) / true_cost_usd

    # Signal generation
    if premium_pct < BUY_THRESHOLD:
        signal = "buy"
        signal_strength = abs(premium_pct - BUY_THRESHOLD)
        signal_note = (
            f"Market ${market_price:,.0f} is {abs(premium_pct)*100:.1f}% below "
            f"true cost ${true_cost_usd:,.0f}. BTC undervalued."
        )
    elif premium_pct > SELL_THRESHOLD:
        signal = "sell"
        signal_strength = premium_pct - SELL_THRESHOLD
        signal_note = (
            f"Market ${market_price:,.0f} is {premium_pct*100:.1f}% above "
            f"true cost ${true_cost_usd:,.0f}. BTC overvalued."
        )
    else:
        signal = "hold"
        signal_strength = 0.0
        signal_note = (
            f"Market ${market_price:,.0f} within normal range of "
            f"true cost ${true_cost_usd:,.0f} (premium: {premium_pct*100:+.1f}%)."
        )

    # Convert true cost to sats
    true_cost_sats = usd_to_sats(true_cost_usd, market_price)

    # Multi-currency true cost
    # true_cost is in USD; convert to other currencies
    usd_to_cad = btc_prices["cad"] / btc_prices["usd"]
    usd_to_eur = btc_prices["eur"] / btc_prices["usd"]
    usd_to_gbp = btc_prices["gbp"] / btc_prices["usd"]

    true_cost_fiat = {
        "usd": round(true_cost_usd, 2),
        "cad": round(true_cost_usd * usd_to_cad, 2),
        "eur": round(true_cost_usd * usd_to_eur, 2),
        "gbp": round(true_cost_usd * usd_to_gbp, 2),
    }

    market_price_fiat = {
        "usd": round(btc_prices["usd"], 2),
        "cad": round(btc_prices["cad"], 2),
        "eur": round(btc_prices["eur"], 2),
        "gbp": round(btc_prices["gbp"], 2),
    }

    premium_fiat = {
        "usd": round(market_price - true_cost_usd, 2),
        "cad": round((market_price - true_cost_usd) * usd_to_cad, 2),
        "eur": round((market_price - true_cost_usd) * usd_to_eur, 2),
        "gbp": round((market_price - true_cost_usd) * usd_to_gbp, 2),
    }

    result = {
        "timestamp": now.isoformat(),
        "date": now.strftime("%Y-%m-%d"),
        "hour": now.strftime("%H:00"),

        # Inputs
        "inputs": {
            "energy_cost_usd": energy,
            "mining_cost_usd": mining,
            "opportunity_cost_usd": opportunity,
        },

        # BTC prices at calculation time
        "btc_prices": btc_prices,

        # Core output (sats primary)
        "true_cost_sats": true_cost_sats,
        "true_cost_usd": true_cost_usd,
        "true_cost_fiat": true_cost_fiat,

        "market_price_usd": market_price,
        "market_price_fiat": market_price_fiat,

        # Premium/discount
        "premium_pct": round(premium_pct * 100, 2),
        "premium_usd": round(market_price - true_cost_usd, 2),
        "premium_fiat": premium_fiat,

        # Signal
        "signal": signal,
        "signal_strength": round(signal_strength, 4),
        "signal_note": signal_note,

        # Thresholds
        "thresholds": {
            "buy_below_pct": BUY_THRESHOLD * 100,
            "sell_above_pct": SELL_THRESHOLD * 100,
        },

        # Cost breakdown
        "cost_breakdown": {
            "energy_pct": round(energy / true_cost_usd * 100, 1),
            "mining_pct": round(mining / true_cost_usd * 100, 1),
            "opportunity_pct": round(opportunity / true_cost_usd * 100, 1),
        },

        "formula_version": "lenny-v1",
        "note": "Energy-backed valuation. Thresholds: buy < -20%, sell > +30%.",
    }

    log.info(
        f"Cost-of-Value: true_cost=${true_cost_usd:,.0f} | "
        f"market=${market_price:,.0f} | premium={premium_pct*100:+.1f}% | "
        f"signal={signal.upper()} | "
        f"CAD: true=CA${true_cost_fiat['cad']:,.0f} market=CA${market_price_fiat['cad']:,.0f}"
    )

    return result


def save_calculation(calc: dict) -> Path:
    """Append calculation to cost-of-value.json."""
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    filepath = OUTPUT_FILE

    existing = []
    if filepath.exists():
        try:
            existing = json.loads(filepath.read_text())
            if not isinstance(existing, list):
                existing = [existing]
        except json.JSONDecodeError:
            existing = []

    existing.append(calc)
    filepath.write_text(json.dumps(existing, indent=2))
    log.info(f"Calculation saved: {filepath} ({len(existing)} total)")
    return filepath


def run(
    energy_cost_usd: float | None = None,
    mining_cost_usd: float | None = None,
    opportunity_cost_usd: float | None = None,
    btc_price_usd: float | None = None,
) -> dict:
    """Main entry point."""
    log.info("=" * 60)
    log.info("TadBuy Metrics — Cost-of-Value Calculator — starting")

    calc = calculate_cost_of_value(
        energy_cost_usd=energy_cost_usd,
        mining_cost_usd=mining_cost_usd,
        opportunity_cost_usd=opportunity_cost_usd,
        btc_price_usd=btc_price_usd,
    )
    save_calculation(calc)
    log.info(f"✅ Calculation complete — signal: {calc['signal'].upper()}")
    return calc


if __name__ == "__main__":
    result = run()
    print(json.dumps(result, indent=2))
