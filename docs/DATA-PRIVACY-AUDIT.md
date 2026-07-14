# Tadbuy Personal Data & Impression Tracking Audit

**Date:** 2026-07-13  
**Task:** t_1dbcb58f — Tadbuy Firestore Data Audit  
**Scope:** Map personal data fields, document impression tracking, IP anonymization on ingress, 30-day purge on raw impression logs.

---

## Executive summary

| Item | Finding |
|------|---------|
| Primary production DB | **Supabase PostgreSQL** (`src/lib/db/supabaseAdmin.ts` is what `server.ts` imports) |
| Legacy Firestore | Client + admin repos still present; **only `campaigns` collection** referenced in code |
| Impression logging today | `/api/v1/{retargeting,ads/view,conversions,heatmap}` are **demo stubs** (no persist) until this change |
| Personal data risk | Campaigns, bids, publisher payout addresses, Fedimint invites, session email, settlements |
| This delivery | Schema + privacy ingress + purge path for `impression_logs`; IP strip helper; SDK fp still client-side but hashed at server |

---

## 1. Firestore collections (legacy)

Code paths that touch Firestore:

| Collection | File | Personal / sensitive fields |
|------------|------|-----------------------------|
| `campaigns` | `src/lib/db/firestore.ts`, `firestoreAdmin.ts` | `userId` (Firebase uid), `invoiceId`, `name`, creative `url`/`targetUrl`, optional `s2sPostbackUrl`, `splitPayments[].address`, `auditLogs[].userId`, aggregated `impressions`/`clicks` (not raw events) |

No other Firestore collection names appear in the repo. If the live Firebase project has extra collections, they are **not** used by current code — verify in Firebase console before decommissioning.

**Migration note:** Server campaign CRUD uses Supabase only. Firebase remains for Auth token verification (`verifyFirebaseIdToken`) and optional client SDK.

---

## 2. Supabase tables (production)

From `supabase-schema.sql` + `backupAllTables()`:

### `campaigns`

| Column / JSON `data` | Personal? | Notes |
|----------------------|-----------|--------|
| `user_id` | Yes | Owner identifier (Firebase/auth uid string) |
| `invoice_id` | Quasi | Lightning payment id |
| `name`, `headline`, `description` | Low | Advertiser content |
| `url`, `targetUrl` | Low–med | May embed UTM/email params |
| `s2sPostbackUrl` (in `data`) | Med | Partner URL |
| `splitPayments` (in `data`) | Yes | BTC/LN payout addresses |
| `auditLogs` (in `data`) | Yes | `userId` + action timestamps |
| `impressions`, `clicks`, `ctr` | No | Aggregates only |

### `bids`

| Column | Personal? |
|--------|-----------|
| `user_id` | Yes |
| `slot_id`, `slot_name`, amounts | No |

### `publisher_settings`

| Column | Personal? |
|--------|-----------|
| `user_id` | Yes (PK) |
| `lightning_address` | **Yes** — payout identity |
| `bitcoin_address` | **Yes** — payout identity |

### `fedimint_sessions`

| Column | Personal? |
|--------|-----------|
| `session_id` | Yes (session / uid) |
| `invite` | **Yes** — federation invite secret |
| `federation_id`, balances | Low–med |

### `settlements`

| Column | Personal? |
|--------|-----------|
| `address` | **Yes** — LN invoice or on-chain address |
| `txid` | Quasi |
| amounts, status | Low |

In-memory (not DB): `server.ts` settlements array may include `userId`; Fedimint map keys can fall back to `req.ip` (fixed in this change to use anonymized IP only as last resort after cookie).

### Auth / session (not Supabase tables)

| Store | Fields |
|-------|--------|
| express-session | `userId`, `userEmail` (from Firebase ID token) |

---

## 3. Impression tracking data fields

### Client SDK (`public/tadbuy.js`)

| Field sent | Endpoint | Risk |
|------------|----------|------|
| `fp` (base64 of UA + screen + WebGL renderer) | retargeting, conversions, ads/serve, ads/view | **Device fingerprint** — treated as personal under many privacy regimes |
| `url` (full `window.location.href`) | retargeting/track | May contain query tokens |
| `advertiserId` / `pub` / `adId` | various | Business ids |
| `value` | conversions | Business |
| `scroll` depth | heatmap | Behavioral |

### Server v1 tracking (after this change)

Persisted only via `insertImpressionLog` → `impression_logs`:

| Column | Source | Privacy treatment |
|--------|--------|-------------------|
| `event_type` | route | view / retargeting / conversion / heatmap / serve / fraud_audit |
| `ad_id`, `campaign_id`, `publisher_id`, `advertiser_id` | body | as-is (ids) |
| `fp_hash` | body.fp | **SHA-256 salt hash prefix** — raw fp never stored |
| `ip_anonymized` | request | **IPv4 /24** (last octet 0), **IPv6 /48** |
| `page_path` | body.url | origin+path only; query/hash stripped |
| `scroll_depth` | body.scroll | 0–100 |
| `value_sats` | body.value | integer |
| `meta` | optional | keys matching ip/fp/ua/email/phone stripped |
| `created_at` | server | TTL index for purge |

### Not stored

- Raw IP  
- Raw fingerprint / user-agent  
- Full URL query strings  
- Email / phone  

---

## 4. IP stripping / anonymization on ingress

Implementation:

| File | Role |
|------|------|
| `src/lib/privacy/ipAnonymize.ts` | `anonymizeIp`, `extractClientIp`, `hashIdentifierSync` |
| `src/lib/db/impressionLogs.ts` | `sanitizeImpressionIngress` + insert/purge |
| `server.ts` | Tracking routes call `insertImpressionLog` with `req`; admin purge route; startup purge |
| `server/routes/batch1.ts` | Fedimint session fallback uses anonymized IP, not raw `req.ip` |

**Rule:** any future tracking write must go through `sanitizeImpressionIngress` / `insertImpressionLog`. Never `req.ip` into SQL/JSON logs.

---

## 5. 30-day auto-purge

| Mechanism | Detail |
|-----------|--------|
| SQL | `purge_impression_logs(retention_days int default 30)` in `supabase-impression-logs.sql` |
| App | `purgeImpressionLogsOlderThan(30)` — prefers RPC, falls back to batch delete |
| When | Server startup (fire-and-forget) + `POST /api/admin/purge-impression-logs` (agent admin auth) |
| Optional | Uncomment `pg_cron` schedule in SQL (03:15 UTC daily) if extension enabled |

**Operator step required:** run `supabase-impression-logs.sql` in Supabase SQL editor for project `cegzfjbsadwchonpxwmv` before production traffic hits the new table.

---

## 6. Residual risks / follow-ups

1. **Apply SQL** on live Supabase (agent cannot run dashboard SQL without credentials).  
2. **SDK:** still *generates* a strong fingerprint client-side; server hashes it — consider hashing client-side with a rotating salt or using ephemeral daily tokens.  
3. **Cookies page claims** "we do not fingerprint" — conflicts with `tadbuy.js` bot-mitigation fingerprint; legal copy should be reconciled.  
4. **Publisher payout addresses** and **Fedimint invites** are long-lived PII/secrets — not covered by 30-day impression TTL; need separate retention policy.  
5. **Admin backups** (`/api/admin/backup`) dump full tables including payout addresses — protect backup files and retention.  
6. **Decommission Firestore** campaigns after data export if any production rows remain.

---

## 7. Files changed (this task)

- `src/lib/privacy/ipAnonymize.ts` (new)
- `src/lib/db/impressionLogs.ts` (new)
- `supabase-impression-logs.sql` (new; also append note in schema docs)
- `server.ts` — tracking routes + purge
- `server/routes/batch1.ts` — anonymized session IP fallback
- `docs/DATA-PRIVACY-AUDIT.md` (this file)
- `scripts/test-ip-anonymize.mjs` (smoke test)

---

## 8. Verification checklist

- [ ] Unit smoke: IPv4 `1.2.3.4` → `1.2.3.0`; IPv6 truncated to 3 hextets  
- [ ] `sanitizeImpressionIngress` strips raw fp from meta  
- [ ] SQL applied in Supabase  
- [ ] `POST /api/v1/ads/view` with body `{adId,fp}` returns logged (or demo:true if table missing)  
- [ ] `POST /api/admin/purge-impression-logs` with agent auth returns `{deleted,cutoff}`  
