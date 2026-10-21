# Tadbuy — product, pilot and market defaults

**Status:** Working proposal for later Cam/Kimi/Lenny review. Not legal advice, a launch decision, or operating authorization. Tadbuy remains a public demo preview: no live campaign payments, payouts, escrow, approved backend, or confirmed vendor supply.

## Choices defined for the requested items (7, 9–13, 15–19)

1. **Campaign payments (7):** no Tadbuy campaign payments today. Revisit only after Cam explicitly approves transacting intent and a scoped test. Umbrel sync is not a payment processor, authoritative payment status, backend, or release signal.
2. **Identity and authorization (9):** no new login requirement for preview browsing. If durable records are approved later, use server-verified account identity for ownership. NIP-05/npub are optional linked evidence, not authentication or approval by themselves.
3. **Ledger (10):** no fee schedule, balances, or revenue share until approved. Before funds move require an auditable double-entry ledger, immutable event history, idempotency, provider reconciliation, limits, receipts, backups, retention, and independent review.
4. **Payment verification and exceptions (11):** accept no payment until a provider/node can authoritatively verify status server-side. Handle expiry, late payment, duplicates, retries, signed/replay-protected callbacks, refunds, disputes, and failure states. Refunds and payouts are not operational; fail closed.
5. **Settlement preference (12):** explore direct advertiser-to-publisher payment with independently controlled non-custodial rails only as a future design option. It is not approved or implemented. Do not use the donation address for campaigns; no pooled escrow for an initial pilot absent separate approval and review.
6. **Pilot participation (13):** no vendors, communities, moderators, or advertisers are confirmed. Any later research/pilot must be opt-in, explicitly consented, scoped, withdrawable, and owner-approved. No scraping, cold outreach, or partner claims.
7. **Disclosure and proof (15):** proposed conspicuous “Sponsored” disclosure (or stricter publisher/platform wording). Collect canonical URL/event reference, date/time, placement location, and redacted screenshot or episode timestamp as appropriate. Proof means evidence of publication only—not reach, views, clicks, endorsement, conversion, or payment.
8. **Operating rules (16):** propose human preflight and exclude deceptive claims, investment-return promises, price predictions, financial advice, gambling, undisclosed affiliate content, impersonation, malware, illegal offers, and content forbidden by publisher/platform. Vendors can decline or pause. Counsel and platform reviews remain required; these are not a legal-compliance claim.
9. **Support/disputes:** no real transaction until a named reviewer/support owner, response target, retention period, takedown/escalation path, cancellation cutoff, refund authority, dispute process, and rollback plan are approved. Until then, preview only; unresolved cases block rather than auto-settle.
10. **API/data safety (17):** no approved/reachable Tadbuy API or database. Keep secrets and personal data out of the browser. Any future data plane requires THOR operational design, Lenny security/custody review, least privilege, backups/restore proof, retention/deletion policy, monitoring, rate limits, and rollback.
11. **Fixtures/pilot exercise (18–19):** use synthetic fixture tests for pending/expired/paid/late/duplicate/invalid-signature cases, ledger balance, idempotency, disputes, and proof review. Assert no external calls or payment effects. A future non-production exercise still needs named consent and written scope; production funds remain gated.
12. **Social and geographic research (13):** use English/global Nostr plus independent sites, newsletters, and podcasts as the research baseline. Reddit stays manual and vendor-owned. India is a research candidate—not a launch recommendation or ban. Explore WhatsApp, YouTube, Instagram, and ShareChat/Moj through policy review and opt-in publisher discovery. No account, integration, supply, or crypto-ad approval is assumed.

## Blocking release gates

- **G0 Product intent — Cam:** decide whether Tadbuy should transact and define the exact approved journey.
- **G1 Policy/jurisdiction — Cam + qualified counsel:** products, claims, countries, channels, disclosure, moderation, privacy, retention, refund/dispute terms.
- **G2 Supply/consent — Cam:** named advertiser and publisher, verified property control, explicit scope and withdrawal path.
- **G3 Backend/data plane — Kimi/THOR + Cam:** architecture, ownership/auth, data records, custody, backups, retention, monitoring, support, rollback.
- **G4 Security/custody — Lenny + Cam:** threat model, permissions, credential handling, payment authority and incident plan.
- **G5 Payment truth — Cam + ops/security:** authoritative provider/node status, expiry/retry/duplicate/failure tests.
- **G6 Accounting — Kimi/THOR + Lenny:** balanced ledger, reconciliation, controlled refunds/disputes, independent review.
- **G7 Release — Cam:** dated written go/no-go after all other gates. CI, node sync, and demo success do not satisfy this gate.

## Research anchors (re-check at campaign time)

- [DataReportal Digital 2025: India](https://datareportal.com/reports/digital-2025-india): context on reach; reported social-media identities are not necessarily unique people or Tadbuy supply.
- [ShareChat Ads](https://ads.sharechat.com/): publisher description of its advertising offering, not Tadbuy access or partnership.
- [Google cryptocurrency advertising policy](https://support.google.com/adspolicy/answer/14009787?hl=en): category/location-specific restrictions and certification.
- [Meta cryptocurrency products and services policy](https://transparency.meta.com/policies/ad-standards/restricted-goods-services/cryptocurrency-products-and-services/): prior written permission for listed categories.
- [ASCI VDA advertising guideline notice (PDF)](https://www.ascionline.in/wp-content/uploads/2022/09/vda-guidelines-press-release-feb-23.pdf): confirm current applicability and wording with qualified India counsel.
- Repository source of truth: `docs/KIMI-HANDOFF.md` and `docs/BACKEND-SCOPE.md`; neither document authorizes deployment or a pilot.

Cam reviews product intent, scope, pilot consent, policy and release. Kimi/THOR owns future ops/data-plane planning. Lenny reviews security/custody. Qualified counsel reviews local legal questions. These are proposals, deliberately reversible.
