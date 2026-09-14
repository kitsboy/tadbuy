# BACKEND-SCOPE — the scoped path to a real Tadbuy API

**Plan only. Nothing here is deployed, provisioned, or changed.** Companion to the product call in
`t_1c9c0217` (Tadbuy ships as a demo-mode preview; the backend is deferred, not cancelled). Every
"today" claim was measured 2026-09-13 against `origin/main` @ `700abed` and the live host; §7 has the
re-runnable checks.

## 1. Where the code stands (measured, not remembered)

| Check | Result |
|---|---|
| `server.ts` + `server/routes/` | 26 files, **213 registrations, 210 distinct paths** |
| `/api/*` paths the SPA actually calls | **44 implemented**, **1 not** (`/api/ai/optimize`) |
| Declared-only in the SPA (catalogues/prose) | 13 implemented, **18 fiction** (`src/lib/devTools/openApiSpec.ts`) |
| Server paths with no client at all | **156 of 210** |
| Deployed endpoints | **0** — live `GET`/`POST` on any `/api/*` = `404 application/json` |
| Env names in `server/` | **20**; 6 are hard prerequisites |
| Data layer | Supabase **service-role** Postgres, 5 tables (`supabase-schema.sql`) |
| That Supabase project | **does not exist** — `cegzfjbsadwchonpxwmv.supabase.co` = NXDOMAIN from THOR |
| `docker-compose.yml` | builds `./Dockerfile`, which is **not in the repo** |

`SOURCE-OF-TRUTH.md` is no longer wrong here: lines 21/107 were corrected on 2026-09-13 to mark the
M4-tunnel `api.giveabit.io` proxy **RETIRED** (HTTP 530 / CF 1033, 0 tunnels — `t_5fc250b7`). Take the
line as current; take any older checkout as stale.

Two consequences shape everything else:

1. **A real API is a split, not a vhost.** `server.ts` is the whole SPA server — 25 `batch*.ts`
   modules and, in production, `express.static(dist)` + `app.get('*') → dist/index.html`
   (`server.ts:1029-1031`). Hosting it as "the API" moves the site off Cloudflare Pages.
2. **Nothing is half-deployed.** The live host answers every `/api/*` with an honest JSON 404
   (`700abed`), so the backend is a greenfield addition, not a repair.

## 2. The minimal real API

An endpoint earns a server only where the browser must not be trusted: money truth, ownership, shared
inventory. Everything else is static JSON on Pages, or a public source the client already calls.

**Keep — 11 endpoints, all already implemented in `server/`**

| Endpoint | Why a server | Code today |
|---|---|---|
| `POST /api/campaigns` · `GET /api/campaigns` · `PATCH /api/campaigns/:id/status` | writes + per-user rows + owner checks, status forced to `draft` | real (Supabase) |
| `POST /api/lightning/invoice` · `GET /api/lightning/check/:id` | needs the node; payment truth | real (`ln-service`; 503/pending without LND) |
| `POST /api/payments/confirm` | activates a paid campaign, **fails closed 402** if LND cannot verify | real (Supabase + LND) |
| `POST /api/marketplace/bid` | money commitment, idempotency-keyed | real (Supabase) |
| `POST /api/publisher/settings` | payout destination | real (Supabase) |
| `GET /api/settlements` | ledger read | **fixture** — in-memory `[]` |
| `GET /api/wallet/balances` | balance must not be client-computed | **fixture** — hardcoded 125,000 sats demo |
| `GET /api/marketplace/slots/live` | shared inventory | **fixture** — in-memory `LIVE_SLOTS` |

`POST /api/settle` stays in the tree behind `ENABLE_LN_PAYOUTS` but is out of scope until the §5
ledger gate; `/api/auth/session` is replaced by §4.

**Serve as static on Pages instead (delete the route):** `/api/metrics` (already generated to
`public/metrics.json` at prebuild), `feature-flags`, `trust/ad-policy`, `campaigns/templates`,
`payments/fees`, `payments/recommend`, `seo/changelog`, `delight/share-card`. **Call the public source
directly:** `blockchain/info` + `mempool/fees` (mempool.space), `lightning/info` (a static redacted
node card).

**Delete in the same PR as the split:** the **156** routes nothing calls — 23 `/api/v3/*`, 23
`/api/v2/*`, 13 `/api/v4/*`, plus the Fedimint/Ark/Cashu/RGB/UTXO/ZKP/carbon/IPFS/TTS/video/
weather-rule stubs and the self-describing `/api/agent/*` + `/api/api-reference/*` catalogues — and
the 18 fictional declared paths + `POST /api/ai/optimize`, so nothing is advertised that does not
exist. Keep `/api/csp-report` (the only real Cloudflare Function; not part of this API).

## 3. Serving shape

```
tadbuy.giveabit.io      → Cloudflare Pages static SPA (unchanged)
api.tadbuy.giveabit.io  → THOR Caddy vhost → 127.0.0.1:<port> → tadbuy-api container (keep-list only)
                          → Supabase (or THOR Postgres); secrets live here, never in the SPA
```

- Reuse the running pattern: Caddy terminates `api.satohash.io` → `127.0.0.1:3001` already.
- **Split the process:** a new entrypoint mounting only the keep-list with the existing middleware (CORS
  allow-list, rate limits, request ids, error handler). `server.ts` is untouched by this card and is
  not what gets deployed.
- **Why not `VITE_API_BASE_URL` → a laptop:** that is the `api.giveabit.io` failure exactly. A
  production origin may not depend on a machine being awake; the client's same-origin fallback on a
  static host is a JSON 404, so a down API must be visible, not silent.
- **CORS is real work:** every call is same-origin relative today. A sibling host needs an allow-list,
  credentials for session cookies, and the new host added to `connect-src` in `public/_headers` **and**
  `src/lib/security/csp.ts` — neither currently names any API host (the retired `api.giveabit.io` was
  removed 2026-09-13). The CSP is scoped to `/` only (`t_69ff1772`) — land that first.
- **DNS is Cam's:** `api.tadbuy.giveabit.io` is NXDOMAIN today (checked). One A record to
  `169.58.32.160`, **grey cloud / DNS-only** so Caddy keeps its own TLS (precedent:
  `relay.motopass.giveabit.io`).

## 4. Auth

Today: **client Firebase** (project `tadbuy-e3555`) issues ID tokens and `server/` verifies them
against Identity Toolkit with `FIREBASE_API_KEY` — no service account (`src/lib/api/userAuth.ts`);
sessions exist as a cookie via `POST /api/auth/session`. Accounts leave the live UI in this build
(`t_69ff1772`), so nothing breaks meanwhile.

`.env.example` intends Supabase Auth; **the stronger fit is NIP-98.** The repo already ships
`src/lib/api/nip98Auth.ts` with real BIP-340 schnorr verification (kind 27235, 60s window, method/URL
tag checks), and the family runs the `@giveabit.io` NIP-05 identity surface. Order of preference:
(1) NIP-98 for API identity — Lightning/Nostr-native, no new vendor, no new secret class; (2) keep
Firebase tokens while they cost nothing; (3) Supabase Auth only if Supabase is already the data plane,
since it buys a second account store for no capability the family lacks. Whichever wins, the account
surface is rebuilt deliberately (today `/profile` only "works" because it ships without a CSP).
Per-user authorization on writes (`requireAuth` + ownership checks) is implemented and must survive
the split.

## 5. Money

- **Reads need a reachable node:** `ln-service` over `UMBREL_LND_{CERT,MACAROON,SOCKET}` (gRPC). THOR's
  `lnd` container publishes no gRPC port and is unfunded — `lncli getinfo` today: `num_active_channels 0`,
  `num_peers 0`, `uris []` — and it is not the Umbrel node the code assumes. Until a funded node is
  wired: invoice → 503, check → `pending`, confirm → 402.
- **Payouts stay off.** `ENABLE_LN_PAYOUTS=false` until a wallet ledger exists — per-user balances,
  double-entry records, spend limits, human-visible audit. A wallet that cannot be reconciled is worse
  than no wallet.
- **Alternative rail:** the family's public receive rail is already live and does not need this backend —
  `giveabit.io/wallets.json` (v3, 2026-08-27) lists 9 non-custodial Breez Spark lightning addresses,
  including **`tadbuy@breez.tips`**; LNbits/LND on THOR was retired from the public rail and is kept
  sovereign/private. If Tadbuy ever needs receive-only money, LNURL-pay against that rail is proven and
  needs no node custody; self-hosted LND gRPC is only required for custody-style flows.

## 6. The gates — ordered, with owners

| # | Gate (true before anything is built) | Owner | Human? |
|---|---|---|---|
| G1 | Decide that Tadbuy transacts at all — the backend only matters if it does | **Cam** + Nova | **Yes — Cam** |
| G2 | A funded Lightning node with channels + reachable gRPC; whose node (THOR vs Umbrel) | **Cam** (funding) · Ziggy (wiring) | **Yes — Cam** |
| G3 | Service-role key custody: it bypasses RLS and would sit on a VPS | **Lenny** · Cam sign-off | **Yes — Cam + Lenny** |
| G4 | Data plane chosen: Supabase cloud vs self-hosted Postgres on THOR (the repo layer speaks Supabase) | Nova + Ziggy | No |
| G5 | Identity decided (§4) and the account surface rebuilt | Nova + Ziggy | No |
| G6 | Capacity: THOR runs load ~12.2 on 3 cores with ~2.9 GB free | Ziggy | No |
| G7 | The split landed: keep-list entrypoint, 156 dead routes deleted | Ziggy | No |
| G8 | Ops for the new origin: secrets + `SESSION_SECRET`, Caddy vhost, DNS record, CSP `connect-src`, uptime-guard entry, deploy + rollback | Ziggy (Cam for DNS) | **Cam — DNS only** |
| G9 | Ledger + spend limits before `ENABLE_LN_PAYOUTS=true` | Lenny + Ziggy | No |
| G10 | CI/deploy for a container (Pages deploys only the static site) | Ziggy | No |

## 7. Checks (re-runnable)

```bash
python3 census.py   # route census vs client call sites → api-census.txt (attached to the card)
curl -s -o /dev/null -w '%{http_code} %{content_type}\n' https://tadbuy.giveabit.io/api/campaigns
curl -s -X POST -H 'content-type: application/json' -d '{}' https://tadbuy.giveabit.io/api/campaigns
grep -n "SESSION_SECRET env var must be set\|requiredEnvVars" server.ts   # hard boot gate
sed -n '1029,1031p' server.ts                                           # serves dist/ + app.get('*')
getent hosts cegzfjbsadwchonpxwmv.supabase.co   # NXDOMAIN → no database
getent hosts api.tadbuy.giveabit.io             # NXDOMAIN → no API host
docker exec lnd lncli getinfo | grep -E 'num_active_channels|num_peers'   # 0 / 0 → unfunded node
```

## 8. Cost honesty

- **Cash:** the static site stays free on Pages; the API is someone's box or plan.
- **THOR is not idle:** 7.9 GB RAM (~2.9 GB available), 3 cores at load ~12.2, already running LNbits,
  Postgres, umami, the Satohash API and an LND node. A Node container is small (~150-250 MB), but a
  THOR restart takes the whole family API plane down — and this API would share a box with the wallets.
  That is a real availability trade, not a footnote.
- **Supabase free tier is a trap for money records:** idle projects pause, and PITR/backups are paid. A
  ledger there with no backups is one pause from loss. Self-hosting Postgres on THOR removes the
  third-party trust decision (G3) and the cost, but `supabaseAdmin.ts` (the Supabase client) would need
  rewriting — schedule that, don't discover it.
- **Nobody watches it yet.** The edge `giveabit-uptime-guard` Worker covers 8 sites + the Satohash API
  every 15 min (verified live — `tadbuy` is one); it can take the API host, but it is liveness only — no
  error-rate alerting, no DB-size/disk watch, no backup verification. **The failure mode is silence, not
  downtime:** an invoice settles and the campaign never activates, or the DB pauses, while the static
  site stays green. Worse than an outage, because nobody looks.

**Board summary:** nothing was deployed or changed in production by this card. Blockers needing Cam:
**G1** (does Tadbuy transact?), **G2** (fund a Lightning node), **G3** (service-role key custody, with
Lenny), and one DNS record in **G8**.
