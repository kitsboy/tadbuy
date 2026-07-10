# Fedimint Integration — Tadbuy

**Auto-generated:** 2026-07-10

## Overview
Privacy-preserving ecash payments via federated mints. Lower fees, instant settlement, Chaumian blind signatures.

## Why Fedimint for Ads?
- Instant ecash settlement without on-chain fees
- Privacy via blind signatures
- Federation-backed Bitcoin reserves
- Offline-capable token transfers

## Configuration
```bash
# .env.local
VITE_FEDIMINT_INVITE=fm-invite://...
FEDIMINT_GATEWAY_URL=https://your-mint-gateway
```

## User Flow
1. Advertiser selects **Fedimint Ecash** at checkout
2. Join federation via invite code (one-time)
3. Pay campaign budget in ecash notes
4. Federation settles to Tadbuy Lightning node
5. Campaign goes live instantly

## Resources
- [Fedimint.org](https://fedimint.org)
- [Fedimint SDK](https://sdk.fedimint.org)
- [Bitcoin Design Guide — Ecash](https://bitcoin.design/guide/how-it-works/ecash/fedimint/)

## API Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/fedimint/status | GET | Federation connection status |
| /api/fedimint/balance | GET | Ecash balance (session) |
| /api/fedimint/pay | POST | Pay campaign with ecash |

---
*Tadbuy v5.0.8*
