# ═══════════════════════════════════════════════════════════════════════
# TadBuy Metrics — Docker Image
# Bitcoin-denominated ad analytics & cost-of-value calculator
# Multi-arch: AMD64 + ARM64 (Umbrel / Raspberry Pi compatible)
# Multi-currency: BTC (sats), USD, CAD, EUR, GBP
#
# Build:  docker build -t giveabit/tadbuy-metrics .
# Run:    docker run -d -p 8080:8080 -v tadbuy-data:/data/tadbuy-metrics giveabit/tadbuy-metrics
# ═══════════════════════════════════════════════════════════════════════
FROM python:3.12-slim AS base

LABEL maintainer="GiveAbit <hello@giveabit.org>"
LABEL org.opencontainers.image.title="TadBuy Metrics"
LABEL org.opencontainers.image.description="Bitcoin-denominated advertising analytics with multi-currency support"
LABEL org.opencontainers.image.source="https://github.com/giveabit/tadbuy-metrics"
LABEL org.opencontainers.image.license="MIT"
LABEL org.opencontainers.image.version="1.0.0"

# ── System deps ─────────────────────────────────────────────────────────
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        curl \
        cron \
    && rm -rf /var/lib/apt/lists/*

# ── App setup ───────────────────────────────────────────────────────────
WORKDIR /app

# Copy application code
COPY scripts/ /app/scripts/
COPY api/ /app/api/
COPY lib/ /app/lib/
COPY entrypoint.sh /app/entrypoint.sh

RUN chmod +x /app/entrypoint.sh

# ── Cron jobs ───────────────────────────────────────────────────────────
COPY crontab /etc/cron.d/tadbuy-metrics
RUN chmod 0644 /etc/cron.d/tadbuy-metrics && \
    crontab /etc/cron.d/tadbuy-metrics

# ── Data volume ─────────────────────────────────────────────────────────
VOLUME /data/tadbuy-metrics

# ── Environment ─────────────────────────────────────────────────────────
ENV DATA_DIR=/data/tadbuy-metrics
ENV PORT=8080
ENV HOST=0.0.0.0
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app

# ── Health check ────────────────────────────────────────────────────────
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:${PORT}/health || exit 1

# ── Expose & run ────────────────────────────────────────────────────────
EXPOSE ${PORT}

ENTRYPOINT ["/app/entrypoint.sh"]
