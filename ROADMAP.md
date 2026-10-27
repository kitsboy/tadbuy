# Tadbuy Roadmap

**Canonical charter:** [`TADBUY-v1-BLUEPRINT.md`](TADBUY-v1-BLUEPRINT.md) — v1, 2026-10-21.
This file keeps the same order so either path reads the same.

> **Status (2026-10-22):** v1 PROPOSED — not built, not deployed. Live site is still the old DSP build (https://tadbuy.giveabit.io). The 10-21 pivot turned Tadbuy from a multi-platform ad DSP into a brokerage of **provable placements**: named placements on real publishers at the publisher's own price plus a flat fee, delivered with a dated receipt (OTS is one line inside it). Index: [`INDEX.md`](INDEX.md).

## Next milestone — the only gate: 14-day demand test (owner: Cam)

> Nothing gets built until this runs (blueprint §6).

**Send 20 written quotes at $479 + $99 to 20 named humans** from Cam's own contacts and the family's customers.

| Result in 14 days | Verdict |
|---|---|
| 3+ ask for an invoice | **Go.** Build v1. |
| 1–2 ask | **Adjust.** Change the offer, re-test 20 more. |
| 0 ask | **Stop.** Do not build, do not "try harder". |

In parallel, cost-nothing day-1 asset: **publish the read-only rate card** (40+ real placements, USD + sats, dated rows) — code lane M3 (Grok).

**Blocking question (unanswered):** has AADS confirmed **in writing** that resale is permitted, at what broker price, with what refund terms? If not, the supply plan is a guess (§6).

## v1 build (after Go)

1. **Rate card** — read-only, 40+ placements, publisher price in USD + fee + sats below, no login. Published before any sale.
2. **One listing, sold by hand** — CryptoSlate press release: publisher $479 + $99 fee = **$578** (684,024 sats @ $84,500).
3. **Checkout** — Lightning invoice, 15-minute rate lock, USD and sats shown together.
4. **Receipt** — public proof page: status, screenshot, checkpoint log (day 1/7/14/30), hashes + OTS behind "technical details", boxed "this does not attest: views, clicks, traffic quality, results".

Plus six plays (§4): sell the audit ($99), receipt-as-marketing, rate card as SEO wedge, Launch Kit bundle, public book (read-only signed listings — a shop window, not agent trading), founding buyers #1–3 at cost.

**Deliberately not on the list:** escrow, auctions, reputation scores, the agent API, any multi-platform claim (§4).

## Pruned — do not re-promote as scope

- Multi-platform DSP / provider-managed network execution (Meta, Google/YouTube, LinkedIn, TikTok, DOOH, Reddit automation)
- Percentage markup on publisher price (killed: "$479 → $598.75 is a 25% markup, not a 20% margin")
- "We accept sats" as the pitch (AADS already settles in crypto — sats alone persuades nobody)
- Escrow, custody, holding client funds (the MSB legal cliff — structure is **principal, pre-funded**: our own invoice, our own risk, no client funds ever held for a third party)
- Agent API with tiers and permissions (premature — nobody buys through bots yet)

## Decisions pending from Cam (blueprint §10)

| # | Decision | Recommendation |
|---|---|---|
| 1 | Flat fee vs percentage | Flat fee |
| 2 | Publish rate card before first sale | Yes |
| 3 | Run 20-quote test before any build | Yes — non-negotiable |
| 4 | Sell the audit at $99 | Yes |
| 5 | Founding buyers at cost (3, named) | Yes |
| 6 | Ask AADS for written resale terms this week | Yes — blocking |
| 7 | Accountant on the 3 review questions | Yes, before deal #2 |
| 8 | Principal, pre-funded — not commission | Yes |
| 9 | Tagline "Bitcoin ads you can prove. Prices you can see." | Yes |

## History

- **2026-10-21** — Pivot v0 → v1: DSP → provable placements; markup → pass-through + flat fee; OTS headline → receipt; demand-test gate becomes the only gate. Blueprints: `TADBUY-v0-BLUEPRINT.md` (frozen history), `TADBUY-v1-BLUEPRINT.md` (live charter).
- **Pre-pivot** — old multi-platform distribution phases archived; see `docs/DISTRIBUTION-ROADMAP.md` (superseded 2026-10-22), `docs/IMPROVEMENT-ROADMAP.md` (P0/P1 backlog, still valid as engineering backlog).

---
*Part of the [Give A Bit](https://giveabit.io) family. Vault mirror — repo-side sync via M3 (Grok).*
