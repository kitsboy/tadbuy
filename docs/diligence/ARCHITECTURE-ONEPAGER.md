---
title: Technical Architecture One-Pager
project: Tadbuy
version: 1.0.0
audience: developers, technical partners
last_updated: 2026-07-13
owner: Kimi (Orchestrator) + Nova (Docs)
self_evolving: true
update_rule: >
  Any material change to product, stack, deploy path, traction, or ask
  MUST update this file in the same PR/commit when possible.
  Weekly freshness target: score >= 7 (see nova-product-management).
tags: [diligence, pitch, mvp, giveabit]
---
# Tadbuy — Technical Architecture One-Pager

**Live:** https://tadbuy.giveabit.io · **Repo:** https://github.com/kitsboy/tadbuy · **Version:** `5.0.17`

## Stack
React/Vite · Express API (M4 path) · Lightning · Nostr · Cloudflare Pages SPA

## System map (boxes)
```
[User browser]
     |
     v
[SPA / static app on Cloudflare Pages]
     |
        +--------+--------+
|                 |
        v                 v
[Public APIs / LN / Nostr / OTS]   [Optional M3/M4 services]
```

## Architecture notes
- SPA on CF Pages
- API proxy path (M4 / api.giveabit.io planned/active phases)
- Campaign state (BroadcastChannel + optional Firestore notes in docs)
- Lightning invoices + Nostr ZAP endpoints
- Agent docs in docs/.ai_docs/ for automation

## Deploy path
Frontend: wrangler pages deploy; API: M4 service + tunnel/funnel story

## Data & privacy posture
Prefer client-side and user-held keys. Minimize PII. Bitcoin rails where payments exist. See project privacy/security docs if present.

## MVP boundary
- **In MVP now:** Live ad UX frontend; Lightning-oriented product narrative; geo tooling.
- **Explicitly later:** Hardened API, Fedimint mint, publisher dashboard, OTS campaign proofs.

## Dependencies
Lightning; optional Fedimint; Nostr; M4 runtime

## How a technical helper starts (15 min)
```bash
git clone https://github.com/kitsboy/tadbuy.git
cd tadbuy
# typically:
npm install
npm run dev
```
Read `README.md`, `docs/DEPLOYMENT.md` (or `DEPLOY.md`), and this file.

## Known gaps (full disclosure)
See Investor one-pager risks + project `LATEST-UPDATE.md` / handoffs. Do not claim production hardness without tests/deploy verification.

## Related
- [Investor one-pager](./INVESTOR-ONEPAGER.md)
- [Ask sheet](./ASK-SHEET.md)
- Deeper docs: `docs/ARCHITECTURE.md` (if present), `SOURCE-OF-TRUTH.md`, `docs/.ai_docs/`

---
**Safe Harbour:** Educational / informational only. Not financial, legal, or investment advice.
Bitcoin involves risk. DYOR. Not your keys, not your cheese.
Part of the [Give A Bit](https://giveabit.io) family.
