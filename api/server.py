#!/usr/bin/env python3
"""
TadBuy Metrics — API Server
HTTP API for ad metrics, cost-of-value, exchange rates, and health checks.
Multi-currency support: BTC (sats), USD, CAD, EUR, GBP.

No framework dependencies — Python stdlib only.

@license MIT
@author GiveAbit
"""

import json
import os
import sys
import logging
import traceback
import time
from datetime import datetime, timezone
from http.server import HTTPServer, BaseHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlparse, parse_qs
from urllib.request import urlopen, Request

# ── Config ──────────────────────────────────────────────────────────────
PORT = int(os.environ.get("PORT", "8080"))
HOST = os.environ.get("HOST", "0.0.0.0")
DATA_DIR = Path(os.environ.get("DATA_DIR", "/data/tadbuy-metrics"))
LOG_DIR = DATA_DIR / "logs"
VERSION = "1.0.0"
SATS_PER_BTC = 100_000_000

# BTC + multi-currency price URL
BTC_PRICE_URL = os.environ.get(
    "BTC_PRICE_URL",
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,cad,eur,gbp",
)

# Exchange rate cache
_rate_cache = {"data": None, "expires": 0}
RATE_CACHE_TTL = 300  # 5 minutes

LOG_DIR.mkdir(parents=True, exist_ok=True)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler(LOG_DIR / "api-server.log"),
    ],
)
log = logging.getLogger("api-server")

START_TIME = datetime.now(timezone.utc)


# ── Exchange Rate Helper ────────────────────────────────────────────────
def get_exchange_rates() -> dict:
    """Fetch and cache exchange rates. Returns multi-currency rate object."""
    now = time.time()
    if _rate_cache["data"] and now < _rate_cache["expires"]:
        return _rate_cache["data"]

    try:
        req = Request(BTC_PRICE_URL, headers={"User-Agent": "TadBuyMetrics/1.0"})
        with urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode())

        btc = data["bitcoin"]
        btc_usd = float(btc["usd"])
        btc_cad = float(btc.get("cad", btc_usd * 1.35))
        btc_eur = float(btc.get("eur", btc_usd * 0.92))
        btc_gbp = float(btc.get("gbp", btc_usd * 0.79))

        rates = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "source": "coingecko",
            "btc_usd": btc_usd,
            "btc_prices": {
                "usd": btc_usd,
                "cad": btc_cad,
                "eur": btc_eur,
                "gbp": btc_gbp,
            },
            "fiat_rates": {
                "cad_usd": round(btc_usd / btc_cad, 6),
                "eur_usd": round(btc_usd / btc_eur, 6),
                "gbp_usd": round(btc_usd / btc_gbp, 6),
            },
            "sats_per_usd": round(SATS_PER_BTC / btc_usd, 2),
            "sats_per_cad": round(SATS_PER_BTC / btc_cad, 2),
            "sats_per_eur": round(SATS_PER_BTC / btc_eur, 2),
            "sats_per_gbp": round(SATS_PER_BTC / btc_gbp, 2),
        }

        _rate_cache["data"] = rates
        _rate_cache["expires"] = now + RATE_CACHE_TTL

        # Save to file
        rates_file = DATA_DIR / "exchange-rates.json"
        rates_file.write_text(json.dumps(rates, indent=2))

        return rates

    except Exception as e:
        log.warning(f"Exchange rate fetch failed: {e}")
        if _rate_cache["data"]:
            return _rate_cache["data"]
        # Return fallback
        return {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "source": "fallback",
            "btc_usd": 67450,
            "btc_prices": {"usd": 67450, "cad": 91150, "eur": 62100, "gbp": 53400},
            "fiat_rates": {"cad_usd": 0.74, "eur_usd": 1.086, "gbp_usd": 1.263},
            "sats_per_usd": 1482,
            "sats_per_cad": 1097,
            "sats_per_eur": 1610,
            "sats_per_gbp": 1873,
        }


# ── Request Handler ─────────────────────────────────────────────────────
class TadBuyHandler(BaseHTTPRequestHandler):
    """Handles all API routes."""

    def log_message(self, format, *args):
        log.info(f"{self.address_string()} - {format % args}")

    def send_json(self, data: dict, status: int = 200):
        body = json.dumps(data, indent=2).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)

    def send_error_json(self, status: int, message: str):
        self.send_json({"error": message, "status": status}, status)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path.rstrip("/")
        params = parse_qs(parsed.query)

        routes = {
            "": self.handle_root,
            "/health": self.handle_health,
            "/api/v1/health": self.handle_health,
            "/api/v1/status": self.handle_status,
            "/api/v1/rates": self.handle_rates,
            "/api/v1/rates/convert": self.handle_convert,
            "/api/v1/ads/x/latest": self.handle_ads_latest,
            "/api/v1/ads/x/history": self.handle_ads_history,
            "/api/v1/cost-of-value/latest": self.handle_cov_latest,
            "/api/v1/cost-of-value/history": self.handle_cov_history,
        }

        handler = routes.get(path)
        if handler:
            try:
                handler(params)
            except Exception as e:
                log.error(f"Error handling {path}: {e}\n{traceback.format_exc()}")
                self.send_error_json(500, str(e))
        else:
            self.send_error_json(404, f"Not found: {path}")

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path.rstrip("/")

        if path == "/api/v1/ads/x/scrape":
            self.handle_ads_scrape()
        elif path == "/api/v1/cost-of-value/calculate":
            self.handle_cov_calculate()
        else:
            self.send_error_json(404, f"Not found: {path}")

    # ── Route Handlers ──────────────────────────────────────────────────

    def handle_root(self, params=None):
        self.send_json({
            "name": "TadBuy Metrics",
            "version": VERSION,
            "description": "Bitcoin-denominated ad analytics & cost-of-value calculator",
            "currencies": ["BTC (sats)", "USD", "CAD", "EUR", "GBP"],
            "endpoints": {
                "health": "/health",
                "rates": "/api/v1/rates",
                "convert": "/api/v1/rates/convert?sats=100000&currency=CAD",
                "ads_latest": "/api/v1/ads/x/latest",
                "ads_history": "/api/v1/ads/x/history?days=30",
                "ads_scrape": "POST /api/v1/ads/x/scrape",
                "cov_latest": "/api/v1/cost-of-value/latest",
                "cov_history": "/api/v1/cost-of-value/history?days=7",
                "cov_calculate": "POST /api/v1/cost-of-value/calculate",
                "status": "/api/v1/status",
            },
            "denomination": "All monetary values stored in satoshis (1 BTC = 100,000,000 sats)",
            "license": "MIT",
            "source": "https://github.com/giveabit/tadbuy-metrics",
        })

    def handle_health(self, params=None):
        now = datetime.now(timezone.utc)
        uptime = (now - START_TIME).total_seconds()
        self.send_json({
            "status": "healthy",
            "uptime_seconds": round(uptime),
            "version": VERSION,
            "timestamp": now.isoformat(),
        })

    def handle_status(self, params=None):
        now = datetime.now(timezone.utc)
        uptime = (now - START_TIME).total_seconds()

        ad_file = DATA_DIR / "ad-metrics.json"
        cov_file = DATA_DIR / "cost-of-value.json"

        ad_count = 0
        cov_count = 0
        if ad_file.exists():
            try:
                ad_count = len(json.loads(ad_file.read_text()))
            except (json.JSONDecodeError, TypeError):
                pass
        if cov_file.exists():
            try:
                cov_count = len(json.loads(cov_file.read_text()))
            except (json.JSONDecodeError, TypeError):
                pass

        self.send_json({
            "status": "running",
            "version": VERSION,
            "uptime_seconds": round(uptime),
            "start_time": START_TIME.isoformat(),
            "current_time": now.isoformat(),
            "data": {
                "ad_snapshots": ad_count,
                "cov_calculations": cov_count,
                "data_dir": str(DATA_DIR),
            },
            "currencies": ["BTC", "USD", "CAD", "EUR", "GBP"],
        })

    def handle_rates(self, params=None):
        """Current exchange rates."""
        rates = get_exchange_rates()
        self.send_json({"data": rates})

    def handle_convert(self, params=None):
        """Convert sats to fiat or vice versa.
        
        GET /api/v1/rates/convert?sats=100000&currency=CAD
        GET /api/v1/rates/convert?amount=50&currency=CAD&direction=to_sats
        """
        rates = get_exchange_rates()
        currency = (params.get("currency", ["USD"])[0]).upper()
        direction = params.get("direction", ["to_fiat"])[0]

        if currency not in ("USD", "CAD", "EUR", "GBP"):
            self.send_error_json(400, f"Unsupported currency: {currency}. Use USD, CAD, EUR, GBP.")
            return

        btc_price = rates["btc_prices"].get(currency.lower(), rates["btc_usd"])

        if direction == "to_sats":
            amount = float(params.get("amount", ["0"])[0])
            sats = round((amount / btc_price) * SATS_PER_BTC)
            self.send_json({
                "input": {"amount": amount, "currency": currency},
                "output": {"sats": sats, "btc": sats / SATS_PER_BTC},
                "rate": {"btc_price": btc_price, "currency": currency},
                "timestamp": rates["timestamp"],
            })
        else:
            sats = int(params.get("sats", ["0"])[0])
            fiat_amount = round((sats / SATS_PER_BTC) * btc_price, 2)
            self.send_json({
                "input": {"sats": sats, "btc": sats / SATS_PER_BTC},
                "output": {"amount": fiat_amount, "currency": currency},
                "all_currencies": {
                    "usd": round((sats / SATS_PER_BTC) * rates["btc_prices"]["usd"], 2),
                    "cad": round((sats / SATS_PER_BTC) * rates["btc_prices"]["cad"], 2),
                    "eur": round((sats / SATS_PER_BTC) * rates["btc_prices"]["eur"], 2),
                    "gbp": round((sats / SATS_PER_BTC) * rates["btc_prices"]["gbp"], 2),
                },
                "rate": {"btc_price": btc_price, "currency": currency},
                "timestamp": rates["timestamp"],
            })

    def _read_json_file(self, filepath: Path) -> list:
        """Read a JSON array file, return list."""
        if not filepath.exists():
            return []
        try:
            data = json.loads(filepath.read_text())
            return data if isinstance(data, list) else [data]
        except json.JSONDecodeError:
            return []

    def handle_ads_latest(self, params=None):
        data = self._read_json_file(DATA_DIR / "ad-metrics.json")
        if not data:
            self.send_json({"data": None, "note": "No snapshots yet. Run scraper first."})
            return
        self.send_json({"data": data[-1]})

    def handle_ads_history(self, params=None):
        days = int(params.get("days", ["30"])[0])
        data = self._read_json_file(DATA_DIR / "ad-metrics.json")
        # Return last N days worth
        self.send_json({"data": data[-days:] if len(data) > days else data, "count": min(len(data), days)})

    def handle_ads_scrape(self):
        """Trigger manual scrape. Import scraper inline to avoid circular deps."""
        sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "scripts"))
        # We import the functions from the scraper module
        from importlib import import_module
        import importlib.util
        spec = importlib.util.spec_from_file_location(
            "x_ads_scraper",
            str(Path(__file__).resolve().parent.parent / "scripts" / "x-ads-scraper.py"),
        )
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        snapshot = mod.scrape_x_ads()
        mod.save_snapshot(snapshot)
        self.send_json({"data": snapshot, "note": "Scrape complete"})

    def handle_cov_latest(self, params=None):
        data = self._read_json_file(DATA_DIR / "cost-of-value.json")
        if not data:
            self.send_json({"data": None, "note": "No calculations yet."})
            return
        self.send_json({"data": data[-1]})

    def handle_cov_history(self, params=None):
        days = int(params.get("days", ["7"])[0])
        data = self._read_json_file(DATA_DIR / "cost-of-value.json")
        self.send_json({"data": data[-days:] if len(data) > days else data, "count": min(len(data), days)})

    def handle_cov_calculate(self):
        content_length = int(self.headers.get("Content-Length", 0))
        body = {}
        if content_length > 0:
            raw = self.rfile.read(content_length)
            body = json.loads(raw.decode())

        sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "scripts"))
        import importlib.util
        spec = importlib.util.spec_from_file_location(
            "cost_of_value",
            str(Path(__file__).resolve().parent.parent / "scripts" / "cost-of-value.py"),
        )
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)

        calc = mod.calculate_cost_of_value(
            energy_cost_usd=body.get("energy_cost_usd"),
            mining_cost_usd=body.get("mining_cost_usd"),
            opportunity_cost_usd=body.get("opportunity_cost_usd"),
            btc_price_usd=body.get("btc_price_usd"),
        )
        mod.save_calculation(calc)
        self.send_json({"data": calc})


# ── Server ──────────────────────────────────────────────────────────────
def run_server():
    server = HTTPServer((HOST, PORT), TadBuyHandler)
    log.info(f"🚀 TadBuy Metrics API v{VERSION}")
    log.info(f"   Listening on {HOST}:{PORT}")
    log.info(f"   Data dir: {DATA_DIR}")
    log.info(f"   Currencies: BTC, USD, CAD, EUR, GBP")
    log.info(f"   Health: http://{HOST}:{PORT}/health")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        log.info("Shutting down...")
        server.shutdown()


if __name__ == "__main__":
    run_server()
