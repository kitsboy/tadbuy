#!/usr/bin/env python3
"""
X/Twitter Ad Metrics Scraper — TadBuy Metrics
Scrapes public X advertising benchmark data, converts to satoshis.
Supports multi-currency output: USD, CAD, EUR, GBP.

All values stored in satoshis (1 BTC = 100,000,000 sats).
Fiat conversions are derived at query time from exchange rates.

Run:  python x-ads-scraper.py
Cron: 0 6 * * * (daily at 6 AM UTC)

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
from urllib.error import URLError, HTTPError

# ── Config ──────────────────────────────────────────────────────────────
DATA_DIR = Path(os.environ.get("DATA_DIR", "/data/tadbuy-metrics"))
OUTPUT_FILE = DATA_DIR / "ad-metrics.json"
LOG_DIR = DATA_DIR / "logs"
MAX_RETRIES = int(os.environ.get("SCRAPER_MAX_RETRIES", "3"))
RETRY_DELAY = int(os.environ.get("SCRAPER_RETRY_DELAY", "10"))  # seconds
SATS_PER_BTC = 100_000_000

# BTC price + multi-currency source — CoinGecko (free, no key)
BTC_PRICE_URL = os.environ.get(
    "BTC_PRICE_URL",
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,cad,eur,gbp",
)

# Brave Search API (optional — for live benchmark scraping)
BRAVE_API_KEY = os.environ.get("BRAVE_API_KEY", "")
BRAVE_SEARCH_URL = "https://api.search.brave.com/res/v1/web/search"

# ── Logging ─────────────────────────────────────────────────────────────
LOG_DIR.mkdir(parents=True, exist_ok=True)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler(LOG_DIR / "x-ads-scraper.log"),
    ],
)
log = logging.getLogger("x-ads-scraper")


# ── Helpers ─────────────────────────────────────────────────────────────
def http_get_json(url: str, headers: dict | None = None, timeout: int = 15) -> dict:
    """Simple JSON GET — no external deps."""
    req = Request(url, headers=headers or {"User-Agent": "TadBuyMetrics/1.0"})
    with urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode())


def fetch_btc_prices() -> dict:
    """
    Get current BTC prices in all supported currencies.
    Returns: { "usd": 67450.0, "cad": 91150.0, "eur": 62100.0, "gbp": 53400.0 }
    """
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            data = http_get_json(BTC_PRICE_URL)
            prices = data["bitcoin"]
            log.info(
                f"BTC prices: USD=${prices['usd']:,.2f} | "
                f"CAD=CA${prices.get('cad', 0):,.2f} | "
                f"EUR=€{prices.get('eur', 0):,.2f} | "
                f"GBP=£{prices.get('gbp', 0):,.2f}"
            )
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
    """Convert USD amount to satoshis."""
    if btc_price_usd <= 0:
        return 0
    return round((usd / btc_price_usd) * SATS_PER_BTC)


def sats_to_fiat(sats: int, btc_price_fiat: float) -> float:
    """Convert satoshis to any fiat currency given BTC price in that currency."""
    return round((sats / SATS_PER_BTC) * btc_price_fiat, 2)


# ── Benchmark Sources ───────────────────────────────────────────────────
# Industry benchmarks as fallback (updated quarterly).
# Medians from Wordstream, Socialinsider, eMarketer.
FALLBACK_BENCHMARKS = {
    "x_twitter": {
        "cpm_usd": 6.46,       # Cost per 1000 impressions
        "cpc_usd": 0.58,       # Cost per click
        "cpa_usd": 26.00,      # Cost per acquisition
        "engagement_rate": 0.045,
        "source": "Industry benchmarks (Wordstream/Socialinsider 2025-Q4 median)",
        "last_updated": "2025-12-01",
    }
}


def search_brave_benchmarks() -> dict | None:
    """Search Brave for latest X/Twitter ad benchmarks. Returns parsed metrics or None."""
    if not BRAVE_API_KEY:
        log.info("No BRAVE_API_KEY — skipping live search, using fallback benchmarks")
        return None

    query = "X Twitter advertising CPM CPC benchmark 2026"
    headers = {
        "Accept": "application/json",
        "Accept-Encoding": "gzip",
        "X-Subscription-Token": BRAVE_API_KEY,
    }
    params = f"?q={query}&count=5&freshness=pm"

    try:
        data = http_get_json(BRAVE_SEARCH_URL + params, headers=headers)
        results = data.get("web", {}).get("results", [])
        if not results:
            return None

        snippets = " ".join(r.get("description", "") for r in results)
        log.info(f"Brave search returned {len(results)} results for benchmark data")

        import re
        metrics = {}

        # Look for CPM values like "$6.46 CPM" or "CPM of $6.46"
        cpm_match = re.search(r'\$(\d+\.?\d*)\s*(?:CPM|cpm)', snippets)
        if not cpm_match:
            cpm_match = re.search(r'(?:CPM|cpm)\s*(?:of|is|:)?\s*\$(\d+\.?\d*)', snippets)
        if cpm_match:
            metrics["cpm_usd"] = float(cpm_match.group(1))

        cpc_match = re.search(r'\$(\d+\.?\d*)\s*(?:CPC|cpc)', snippets)
        if not cpc_match:
            cpc_match = re.search(r'(?:CPC|cpc)\s*(?:of|is|:)?\s*\$(\d+\.?\d*)', snippets)
        if cpc_match:
            metrics["cpc_usd"] = float(cpc_match.group(1))

        cpa_match = re.search(r'\$(\d+\.?\d*)\s*(?:CPA|cpa)', snippets)
        if not cpa_match:
            cpa_match = re.search(r'(?:CPA|cpa)\s*(?:of|is|:)?\s*\$(\d+\.?\d*)', snippets)
        if cpa_match:
            metrics["cpa_usd"] = float(cpa_match.group(1))

        if metrics:
            metrics["source"] = "Brave Search live scrape"
            metrics["search_urls"] = [r.get("url", "") for r in results[:3]]
            return metrics

        return None

    except Exception as e:
        log.warning(f"Brave search failed: {e}")
        return None


# ── Main Scraper ────────────────────────────────────────────────────────
def scrape_x_ads() -> dict:
    """
    Scrape X/Twitter ad metrics and convert to satoshis.
    Returns a snapshot with multi-currency fiat equivalents.
    """
    now = datetime.now(timezone.utc)
    btc_prices = fetch_btc_prices()
    btc_usd = btc_prices["usd"]

    # Try live search first, fall back to hardcoded benchmarks
    live_data = search_brave_benchmarks()
    benchmarks = FALLBACK_BENCHMARKS["x_twitter"].copy()

    if live_data:
        log.info("Using live benchmark data from Brave Search")
        benchmarks.update(live_data)
    else:
        log.info("Using fallback benchmark data")

    cpm_usd = benchmarks.get("cpm_usd", 6.46)
    cpc_usd = benchmarks.get("cpc_usd", 0.58)
    cpa_usd = benchmarks.get("cpa_usd", 26.00)

    # Convert to sats (primary storage)
    cpm_sats = usd_to_sats(cpm_usd, btc_usd)
    cpc_sats = usd_to_sats(cpc_usd, btc_usd)
    cpa_sats = usd_to_sats(cpa_usd, btc_usd)

    # Build multi-currency fiat equivalents
    def fiat_equiv(sats: int) -> dict:
        """Calculate fiat equivalents for a sats amount in all currencies."""
        return {
            "usd": sats_to_fiat(sats, btc_prices["usd"]),
            "cad": sats_to_fiat(sats, btc_prices["cad"]),
            "eur": sats_to_fiat(sats, btc_prices["eur"]),
            "gbp": sats_to_fiat(sats, btc_prices["gbp"]),
        }

    snapshot = {
        "platform": "x_twitter",
        "date": now.strftime("%Y-%m-%d"),
        "timestamp": now.isoformat(),

        # BTC prices at snapshot time
        "btc_price_usd": btc_usd,
        "btc_prices": btc_prices,

        # Primary values (satoshis) — this is the source of truth
        "cpm_sats": cpm_sats,
        "cpc_sats": cpc_sats,
        "cpa_sats": cpa_sats,

        # Multi-currency fiat equivalents (derived from sats)
        "cpm_fiat": fiat_equiv(cpm_sats),
        "cpc_fiat": fiat_equiv(cpc_sats),
        "cpa_fiat": fiat_equiv(cpa_sats),

        # Legacy USD fields (for compatibility)
        "cpm_usd": cpm_usd,
        "cpc_usd": cpc_usd,
        "cpa_usd": cpa_usd,

        # Metadata
        "volume": None,
        "engagement_rate": benchmarks.get("engagement_rate"),
        "data_source": benchmarks.get("source", "unknown"),
        "notes": (
            f"BTC @ ${btc_usd:,.2f} USD / CA${btc_prices['cad']:,.2f} / "
            f"€{btc_prices['eur']:,.2f} / £{btc_prices['gbp']:,.2f}. "
            f"CPM={cpm_sats} sats (${cpm_usd:.2f}). "
            f"CPC={cpc_sats} sats (${cpc_usd:.2f}). "
            f"CPA={cpa_sats} sats (${cpa_usd:.2f})."
        ),
    }

    return snapshot


def save_snapshot(snapshot: dict) -> Path:
    """
    Append snapshot to the ad-metrics.json file.
    File is an array of snapshots (append-only).
    """
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

    existing.append(snapshot)
    filepath.write_text(json.dumps(existing, indent=2))
    log.info(f"Snapshot saved: {filepath} ({len(existing)} total snapshots)")
    return filepath


def run() -> dict:
    """Main entry point. Returns the snapshot."""
    log.info("=" * 60)
    log.info("TadBuy Metrics — X/Twitter Ad Scraper — starting")

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            snapshot = scrape_x_ads()
            filepath = save_snapshot(snapshot)
            log.info(f"✅ Scrape complete — {filepath}")
            return snapshot
        except Exception as e:
            log.error(f"Scrape attempt {attempt}/{MAX_RETRIES} failed: {e}")
            if attempt < MAX_RETRIES:
                log.info(f"Retrying in {RETRY_DELAY}s...")
                time.sleep(RETRY_DELAY)
            else:
                log.error("❌ All retries exhausted. Scrape failed.")
                fail_data = {
                    "error": str(e),
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                    "attempts": MAX_RETRIES,
                }
                fail_path = DATA_DIR / "ad-metrics-failures.json"
                fail_path.parent.mkdir(parents=True, exist_ok=True)
                failures = []
                if fail_path.exists():
                    try:
                        failures = json.loads(fail_path.read_text())
                    except json.JSONDecodeError:
                        failures = []
                failures.append(fail_data)
                fail_path.write_text(json.dumps(failures, indent=2))
                raise


if __name__ == "__main__":
    result = run()
    print(json.dumps(result, indent=2))
