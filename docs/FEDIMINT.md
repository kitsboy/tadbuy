# Fedimint Integration — Tadbuy

**Auto-generated:** 2026-10-21

## Overview
Fedimint ecash is a roadmap option only. No Tadbuy federation, invite, gateway, or campaign settlement is configured.

## Future design questions (not a payment flow)
- Potential future ecash payment option, subject to an approved federation and operational design
- Privacy properties require review of the selected federation, wallets, metadata, and threat model
- Federation governance, reserves, quorum, recovery, limits, and support remain unverified
- No offline token transfer or campaign settlement is available in this preview

## Configuration
```bash
# .env.local
# No invite or gateway is configured; do not paste federation or node secrets into the public app.
```

## Future design gates (not an available user flow)
1. Product owner approves whether Tadbuy should accept campaign funds.
2. Select and review a federation, guardians/quorum, governance, recovery, limits, and support plan.
3. Define payment-status authority, replay protection, ledger/reconciliation, refunds, and failure handling.
4. Complete security and operational review; use test-only fixtures before any real funds.
5. Obtain explicit release approval. No step is enabled by this documentation.

## Resources
- [Fedimint.org](https://fedimint.org)
- [Fedimint SDK](https://sdk.fedimint.org)
- [Bitcoin Design Guide — Ecash](https://bitcoin.design/guide/how-it-works/ecash/fedimint/)

## API
No Fedimint API endpoint is deployed or approved for Tadbuy. The legacy status/balance/pay path names are not a deployed integration.

---
*Tadbuy v5.0.230*
