# Nostr Relay Infrastructure for Tadbuy

This directory contains the infrastructure for running Tadbuy-branded Nostr relays in Tier-1 jurisdictions.

## Overview

We are deploying Nostr relays to:
1. Provide censorship-resistant distribution of Tadbuy content
2. Enable Bitcoin-native social interactions (Zaps, NIP-07 login)
3. Support our geographic targeting strategy (US, Japan, Germany, Netherlands, Portugal, Singapore, El Salvador, Argentina)

## Relay Software

We recommend using [nostr-rs-relay](https://github.com/kyrias/nostr-rs-relay) for its:
- Performance and low resource usage
- Built-in spam protection
- Easy configuration via TOML
- Docker support

## Directory Structure

```
infrastructure/nostr-relay/
├── docker-compose.yml
├── relay-configs/
│   ├── us-wyoming.toml
│   ├── japan.toml
│   ├── germany.toml
│   ├── netherlands.toml
│   ├── portugal.toml
│   ├── singapore.toml
│   ├── el-salvador.toml
│   └── argentina.toml
├── scripts/
│   ├── health-check.sh
│   └── update-config.sh
├── README.md
└── .env.example
```

## Configuration Philosophy

Each relay is configured with:
- Location-specific optimizations
- Spam mitigation appropriate for regional threats
- LNURL/Zap support for Bitcoin integration
- Tadbuy-specific metadata and branding
- Compliance with local regulations where applicable

## Deployment

### Prerequisites
- Docker and Docker Compose
- Domain names for each relay (e.g., relay.us.tadbuy.com)
- SSL certificates (via Let's Encrypt or similar)
- Sufficient server resources (1GB RAM, 20GB SSD per relay recommended)

### Steps
1. Copy `.env.example` to `.env` and fill in variables
2. Adjust DNS to point to your servers
3. Run `docker-compose up -d`
4. Verify with `./scripts/health-check.sh`

## Maintenance
- Monitor logs: `docker-compose logs -f`
- Update software: `docker-compose pull && docker-compose up -d`
- Backup: Relay data is stored in `./data/` directory

## Tadbuy Integration Points

Relays will be configured to:
1. Prioritize Tadbuy content in feeds (via NIP-42)
2. Support NIP-07 browser extension signing for login
3. Enable NIP-57 Zaps for tipping content
4. Provide LNURL-withdrawal for creator payouts
5. Include Tadbuy branding in NIP-65 metadata

## Monitoring
- Health checks via `scripts/health-check.sh`
- Prometheus metrics available on port 9090 (if enabled)
- Regular SSL certificate renewal (automated with Certbot)

## References
- Nostr Relay Operators Guide: https://github.com/nostr-protocol/nostr/blob/master/nips.md
- nostr-rs-relay Documentation: https://github.com/kyrias/nostr-rs-relay
- Tadbuy Nostr NIPs: NIP-07 (login), NIP-57 (Zaps), NIP-42 (recommendations)