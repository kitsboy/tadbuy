---
title: Tadbuy — v0 index
project: tadbuy
version: v1 (blueprint)
audience: devs + agents
last_updated: 2026-10-21
owner: Give A Bit / M3 coding agents
status: v1 PROPOSED — awaiting Cam's go on flat fee + rate-card-first
---

# Tadbuy v0 — index

> Ad space you can prove. Named placements on real publishers, paid in sats over Lightning, delivered with an OpenTimestamps proof. No account, no card, no KYC.

**Read this first, then the blueprint.** `README.md` in this folder is the *current live build* (v5.0.161, the old DSP). Everything below describes the **proposed pivot**, which is not built and not deployed.

## Live
- Site: https://tadbuy.giveabit.io — **old DSP build, do not change until Cam says go**
- Repo: https://github.com/kitsboy/tadbuy · Cloudflare Pages (static SPA) · Supabase · Node 20
- M3 workspace: `~/projects/tadbuy/`

## Status (2026-10-21)
v1 proposed, not built. An external review killed the percentage markup and the "we accept sats" pitch; v1 replaces both (pass-through + flat fee, receipt over OTS) and gates everything on a 14-day, 20-quote demand test. Tadbuy stops selling "ads on 14 platforms" and starts brokering *provable placements*. Everything already built (campaign builder, publisher portal, wallet, settlements, 8 languages, geo, AI creative) keeps a job — only the promise changes.

**Next gate:** one real paid deal in 30 days. No site changes before sign-off.

## Documents, in reading order

| # | File | What it is |
|---|---|---|
| 1 | [`TADBUY-v1-BLUEPRINT.md`](./TADBUY-v1-BLUEPRINT.md) | **The live charter (v1).** Review findings, where we disagree, pass-through + flat fee, six plays, 14-day demand test, legal posture |
| 1b | [`TADBUY-v0-BLUEPRINT.md`](./TADBUY-v0-BLUEPRINT.md) | v0, frozen history — the first pivot draft |
| 2 | [`proposal/TADBUY-v0-EXEC-PROPOSAL-PRINT.pdf`](./proposal/TADBUY-v0-EXEC-PROPOSAL-PRINT.pdf) | One-page executive & mission proposal — **print version** (white, black text) |
| 3 | [`proposal/TADBUY-v0-EXEC-PROPOSAL.pdf`](./proposal/TADBUY-v0-EXEC-PROPOSAL.pdf) | Same one-pager, screen/share version (Ember dark) |
| 4 | [`proposal/TADBUY-v0-EXEC-PROPOSAL-PRINT.html`](./proposal/TADBUY-v0-EXEC-PROPOSAL-PRINT.html) | Editable source of the print one-pager |
| 5 | [`../giveabit/AADS-TADBUY-BRIEF-2026-10-21.md`](../giveabit/AADS-TADBUY-BRIEF-2026-10-21.md) | Vendor research: how AADS actually works, three plays, ten support questions |
| 6 | [`REVIEW-PROMPT-2026-10-21.md`](./REVIEW-PROMPT-2026-10-21.md) | Handoff prompt for an external premium LLM review |
| 7 | [`CLAUDE-MASTER-PROMPT-2026-10-21.md`](./CLAUDE-MASTER-PROMPT-2026-10-21.md) | **Master prompt:** hurdles, creativity gaps, passive-income architecture, 20 scored revenue ideas across the whole family (not just Tadbuy) |

Public copy of the one-pager: https://agents.giveabit.io/tadbuy-v0-proposal.pdf

## The four parts of v0
1. **Rate card** — placements + prices in sats, public, no login.
2. **One listing** — CryptoSlate press release at 708,580 sats.
3. **Sats checkout** — Lightning invoice, 15-minute rate lock.
4. **Proof** — OTS receipt on the live URL.

## Money model
Brokerage, not custody: buy the placement, sell the placement, keep the spread, never hold client funds.
Worked example (BTC $84,500): buy 497,041 sats → sell 708,580 → keep 211,539 (~$179).

## Agent access
Identity = npub (no KYC). Permission = `R` read / `W` create / `E` edit (human-granted). Reputation = settled history on the key.
**Hard rule:** models propose and price; a deterministic engine moves sats.

## Rules for anyone editing Tadbuy
- Read the blueprint before proposing anything.
- Cite the section you are changing; flag contradictions against §10 (decisions).
- Never re-add multi-platform DSP claims (Meta/Google/TikTok).
- Never add custody, escrow or KYC without Cam's explicit go.
- Verify live after every deploy — a green build is not a live page.
