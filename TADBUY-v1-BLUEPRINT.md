# Tadbuy — v1 Blueprint
## Provable Placements, second cut

**Status:** LIVING DOCUMENT · v1 · 2026-10-21 · supersedes `TADBUY-v0-BLUEPRINT.md` (kept as history)
**Owner:** Cam · **Code lane:** M3 (Grok) · **Ops lane:** THOR/Kimi
**Input:** external premium-LLM review of v0 (2026-10-21), synthesised below with our disagreements
**It does NOT authorise site changes.**

---

# 1. What the review got right (adopted without argument)

| Finding | What we do about it |
|---|---|
| **The maths was wrong, and buyers will notice.** $479 → $598.75 is a **25% markup on list**, not a "20% margin". | Kill percentage markup entirely. See §3. |
| **"We accept sats" is not a wedge.** AADS already settles in crypto. | Stop leading with Bitcoin. Lead with price transparency and the receipt. |
| **OTS alone is a weak headline.** It proves a file existed at a time, not that anyone saw it. | Keep OTS, demote it. The hero is the **receipt**, of which OTS is one line. |
| **No exclusivity on supply.** The buyer can see the same listing at the source. | AADS becomes price discovery + filler. Direct vendor deals become the moat. |
| **No proven buyers.** Supply is solved; demand is not. | Nothing gets built until 20 written quotes go out. See §6. |
| **Agent API is premature.** Nobody is buying through bots yet. | Defer the API. Keep one free piece (§4, play 5). |
| **Escrow is the legal cliff.** Holding other people's sats is where MSB risk starts. | Sell as **principal**, never as agent holding funds. See §7. |
| **Price in USD, invoice in sats, 15-minute expiry, pay the vendor inside 24h.** | Adopted verbatim. |

**The single most important line in the review:** *"You have supply but no proven buyer."* Everything below is organised around fixing that, not around building.

---

# 2. Where we disagree (and why it matters)

Bold where it counts, because three of these change the plan.

### 2.1 The rate card is not week 4 — it is day 1
The review schedules a static rate card for week 4, after two sales. Backwards. **The rate card is the outreach asset, not the product feature.** Sending 25 cold messages with "we can broker placements" is a pitch. Sending them a link that already shows 40 real placements at real prices is a *reference*. It costs nothing, it needs no supply permission, and it is the only asset that makes a stranger trust the numbers.
**Decision:** publish a read-only rate card first, before any sale. It is also the SEO play (§4, play 3).

### 2.2 Pricing and structure are two separate questions
Earlier drafts fused them. They are independent:

- **Pricing** = how the buyer sees the number (flat fee vs percentage). A *commercial* decision. Answered here.
- **Structure** = whose money moves and whose invoice it is (principal vs agent). A *legal and accounting* decision. Answered in **§7**.

You can have principal + percentage, principal + flat fee, agent + percentage. Any combination is legal; they simply behave differently.

**On pricing: abandon markup, charge a named flat fee on pass-through cost.**
The review tiered the markup (25–30% small, 8–12% large). That is still a percentage on someone else's price, and it invites the fatal question — *"why not buy direct?"* — with no answer that survives a spreadsheet.

**Instead: pass the publisher's price through at cost, and charge a named flat fee.**

| Ticket | Fee | Why it works |
|---|---|---|
| under $1,000 | **$99** | Trivial decision, no negotiation |
| $1,000–$5,000 | **$249** | Still a rounding error against the placement |
| $5,000–$15,000 | **$499** | Cheaper than negotiating it yourself |
| above $15,000 | **2%, capped at $900** | Defensible; no gouging optics |

What this buys us:
- **The objection dies.** "Their price is $479. Our fee is $99. Here's both lines on the invoice." No other broker in this market does that.
- **The rate card can show real prices**, because we are not hiding a margin inside them.
- **Repeat business** — a fee is a service relationship; a markup is a tax people route around.
- **Negotiated discounts get passed on.** If we talk AADS down to $420, the client pays $420 + $99 and *sees* the win. That converts our negotiation skill into loyalty instead of hidden profit.

Trade-off, stated plainly: we earn less per deal at the top end. At $21k the fee is $420, not $5,250. We are betting that a smaller, defensible, repeatable fee beats a large one that gets discovered. **If demand proves otherwise, this is the first thing to revisit.**

### 2.3 "Proof" is not the headline — the **receipt** is
The review is right that OTS is weak as a claim and right that nobody asks for it. It then throws out something better than either original position: *"Every placement comes with a receipt."*

Adopt that. A receipt is a thing a buyer can forward to their boss without explaining Bitcoin. OTS is a line inside it, one click down, labelled in plain English.

### 2.4 Keep one piece of "agent-ready" — the public book
The review scores npub agents 3/10 and says defer. Agreed on the API, the tiers and the escrow. But there is a version that costs one page and zero auth: **publish each placement as a signed public listing** (Nostr classified-style event) on a read-only page. Agents and LLMs can read the book without an API key, a login or a permission model. That is not an agent market — it is a shop window with a machine-readable door. Cheap, on-brand, and it means the day an agent *does* want to buy, the book already exists.

### 2.5 The product nobody in the review considered: sell the **audit**
Both drafts assume we must sell supply. We do not. **Sell verification to people who already bought direct.** See §4, play 1. It needs no inventory, no vendor permission and no discount — and it produces exactly the buyer list the main product needs.

---

# 3. The v1 offer

**One line:** *Buy a named ad placement on a crypto news site at the publisher's own price, plus a flat fee. Get a dated receipt you can show anyone. Pay in bitcoin if you want to.*

Note what moved: price first, receipt second, bitcoin last. Bitcoin is a payment option, not the pitch — because the review is right that AADS already takes crypto, so sats alone persuades nobody who isn't already Bitcoin-only.

## The four parts (still four, still small)

1. **Rate card** — 40+ real placements, publisher price in USD, fee in USD, sats equivalent below, filter by type/site/price. No login. **Published first, before any sale.**
2. **One listing, sold by hand** — CryptoSlate press release, publisher $479 + $99 fee = **$578** (684,024 sats at $84,500). Founding-buyer price available (§4, play 6).
3. **Checkout** — Lightning invoice, 15-minute rate lock, one screen, QR code, countdown, USD and sats shown together.
4. **Receipt** — public proof page: status, screenshot, checkpoint log (day 1/7/14/30), hashes and OTS behind "technical details", plus a boxed **"this does not attest: views, clicks, traffic quality, results."**

## What we can and cannot prove (say this out loud, on the page)

| We prove | We label as vendor-reported |
|---|---|
| A URL served specific content at a specific time (hash + OTS) | Impressions |
| It was still live at each checkpoint | Clicks and CTR |
| What the buyer paid, against the publisher's listed price | Audience size and traffic quality |
| Who signed it | Anything about results |

Never publish a vendor number without the label and the source. Never compute a "performance score" from vendor data.

---

# 4. Six bold plays (each with the catch)

**1. Sell the audit — "Did your ad actually run?" — $99**
Anyone who has ever bought a placement direct has the same doubt and no way to settle it. Sell them a dated verification of a URL they already paid for: screenshot, hash, OTS, checkpoint log. **No supply, no vendor permission, no discount, ~90% margin.**
*Catch:* low ticket, and it advertises the fact that this market is opaque. That is the point — it makes us the honest party, and every audit customer is a warm lead for a placement.

**2. The receipt is the marketing**
Every delivery produces a public, shareable proof page with its own OG image: *"Receipt #001 — live, verified 3 times."* Buyers post receipts. Receipts are the only ad we can afford that also proves the product.
*Catch:* buyers may not share. Design the page so the *publisher* wants to be named and the buyer looks smart — status and timeline first, cryptography last.

**3. The rate card as the SEO wedge**
Publish 40–100 real placements with real prices. Nobody in this niche publishes prices; everybody hides behind "request a media kit". Own the queries: *how much does a crypto press release cost*, *CoinGecko sponsored article price*.
*Catch:* prices age. Date-stamp every row and state the refresh cadence, or the page becomes a liability.

**4. The Launch Kit bundle**
Press release + two social posts + receipt, one price. Same supply, higher ticket, and it answers "what else should I buy?" before the buyer asks.
*Catch:* bundling third-party items makes refunds and delivery windows messier. Fix the delivery window in writing.

**5. The public book (the cheap 10% of agent-ready)**
Each placement also exists as a signed public listing on a read-only page. Machines can read it; humans see the same thing. No API key, no tiers, no escrow.
*Catch:* it is a shop window, not a market. Do not describe it as agent trading.

**6. Founding Buyer #1/2/3**
Three named buyers at cost, publicly credited, in exchange for a case study and a quote. Scarcity is real because there are three.
*Catch:* at cost means ~$99 of foregone fee each. Cheap for proof that someone paid. Disclose it as a founding price — never as a secret discount.

**Deliberately not on this list:** escrow, auctions, reputation scores, the 293-item catalogue, any multi-platform claim. The review's "do not build for 6 months" table stands, with one exception (play 5).

---

# 5. Revenue, honestly

At the flat fee:

| Month | Volume | Fee mix | Revenue |
|---|---|---|---|
| 6 | 4 deals × ~$1,200 | $249 | **~$1,000/mo** |
| 18 | 12 deals × ~$2,000 | $249–$499 | **~$4,000/mo** |
| 18 + audits | 20 audits × $99 | $99 | **+$2,000/mo** |

This is a lean, high-margin side business that can pay for itself and prove the model. It is not a venture-scale business, and pretending otherwise is how small companies die. If Cam wants large, the path is audits + receipt-as-a-service + direct vendor exclusivity, not more placements.

**Volatility rule:** quote USD, invoice sats at the live rate with 15-minute expiry, pay the vendor within 24 hours, never hold unhedged sats past 48 hours. At these sizes, do not hedge — the fee absorbs a 5–8% swing.

---

# 6. The 14-day demand test (the only gate that matters)

Nothing gets built until this runs. The review's kill criteria, sharpened:

**Send 20 written quotes at $479 + $99 to 20 named humans.** Not a segment — names, from Cam's own contacts and the family's customers.

| Result in 14 days | Verdict |
|---|---|
| 3+ ask for an invoice | **Go.** Build v1. |
| 1–2 ask | **Adjust.** Change the offer (bundle, guarantee, founding price), re-test 20 more. |
| 0 ask | **Stop.** The premium does not exist for this service. Do not build, do not "try harder". |

While the test runs, two things happen in parallel and cost nothing: the rate card goes live, and the AADS questions get answered (§7.5).

**Blocking question, unanswered by anyone so far:** has AADS confirmed **in writing** that resale is permitted, at what broker price, with what refund terms? If not, the supply plan is a guess and the test is the only thing that matters.

---

# 7. Structure and money flow

## 7.1 The axis is "whose money do you touch?"

| | **Principal** (buy, then resell) | **Agent / commission** (broker for them) |
|---|---|---|
| Whose invoice is it | Ours, for the full amount | Publisher's (or ours as a disclosed agent) |
| Books show | $578 revenue − $479 cost = **$99 profit** | **$99 revenue only** |
| Do we hold someone else's money | **No** — we spend our own | Often yes — that is the risk |
| Cash needed up front | ~$479 per deal | none |
| Delivery risk | Ours | Publisher's (but our reputation) |
| Legal exposure | Seller's liability — ordinary | Agency + money-transmission questions |
| Accounting | Two lines: revenue, cost | Agent accounting, "who sold what" notes |
| GST (if registered) | On the full $578, ITC unlikely from a non-resident supplier | On the $99 only |

**"Commission" sounds simpler because the number on the books is smaller. In practice it means we handled other people's money — the exact pattern that turns a media seller into something a regulator wants to discuss.**

## 7.2 Why principal is not a choice — it is a description

We buy from AADS in our own name. The client is never AADS's customer, and AADS will not contract with them on our behalf. So the money already moves as principal: we spend $479 of our own, we sell at $578. Calling that a "commission" would be a label that does not match the paperwork.

**Decision:** principal, pre-funded, our own invoice, our own risk. No client funds are ever held for a third party.

**What we give up:** ~$479 of float per concurrent deal, and we carry the refund if a publisher fails. At these ticket sizes that is a few hundred dollars, not a treasury function.

## 7.3 Financial workflow — deal #1, step by step

Worked at **BTC $84,500 → 1,183 sats/USD**. Every row names the artefact that proves it happened.

| # | When | What happens | Money | Artefact produced |
|---|---|---|---|---|
| 1 | T+0 | Client asks for the CryptoSlate release. We confirm the placement is still available. | — | Quote with 15-minute rate lock |
| 2 | T+4m | Client pays the Lightning invoice **684,024 sats** ($578 = $479 supply + $99 fee) | **+684,024 sats in** | Invoice + payment hash |
| 3 | T+30m | We buy the placement from AADS **566,864 sats** ($479) | **−566,864 sats out** | Vendor invoice / order ID |
| 4 | T+2h | Order submitted with artwork and copy to the publisher (via AADS) | — | Order confirmation |
| 5 | T+3–5d | Page goes live. Screenshot + HTML hash captured. | — | Screenshot + hash |
| 6 | T+5d | OTS stamp the live page; sign the receipt | — | `.ots` file + signed receipt |
| 7 | T+5d | Receipt published at `/proof/<id>`; sent to the client | — | Public proof page |
| 8 | T+7/14/30d | Checkpoints: page still live? HTTP status logged | — | Checkpoint log |
| 9 | Month end | Reconcile sats in/out, book revenue and cost | **117,160 sats retained** | Ledger + books |

**Net on the deal: 117,160 sats (~$99).** The sats never sit idle for more than a day — they are earned and spent inside the same window, which is also why no hedging is needed at these sizes.

## The cash picture

```
client sats ──► [ Tadbuy Lightning node ] ──► AADS ──► publisher
   +684,024              holds minutes              −566,864
                              │
                              └──► retained 117,160 sats (≈ $99)
```

## 7.4 The books on deal #1

**Principal (what we do):**

| Line | USD | Sats |
|---|---|---|
| Revenue — placement sold | 578.00 | 684,024 |
| Cost of goods sold — placement bought | (479.00) | (566,864) |
| **Gross profit** | **99.00** | **117,160** |
| Lightning fees (2 payments) | ~(0.01) | ~(12) |
| **Net** | **~98.99** | **~117,148** |

**Agent (what we are not doing)** — same deal, for contrast:

| Line | USD |
|---|---|
| Commission revenue | 99.00 |
| Cost of goods sold | — (the publisher's sale, not ours) |
| **Net** | **99.00** |

Identical profit, different paperwork — and in the agent version we would have been holding $479 that was never ours.

## 7.5 If it goes wrong

| Failure | What we do | What it costs |
|---|---|---|
| Publisher never publishes | Refund the client in full (684,024 sats) and chase AADS | **−566,864 sats** if AADS does not refund us |
| Publishes late | Client chooses: accept with a documented late date, or refund | Reputation, not sats |
| Page removed after day 3 | Pro-rata refund; receipt shows the checkpoint failure | Partial |
| BTC drops 10% between invoice and purchase | Nothing — the invoice expired in 15 minutes and we bought inside 24 hours | ~0 |

**This is why the AADS refund terms are a blocking question.** The entire downside of principal is concentrated in one clause we do not yet have in writing.

## 7.6 Tax wrinkle (verify before deal #1)

- **GST/HST:** small-supplier threshold is around **$30k in 12 months** — below it, no registration and no GST charged. Confirm with an accountant.
- **If registered, principal costs more GST than agent:** 5% on $578 = $28.90, versus 5% on $99 = $4.95. And because AADS is a non-resident supplier, there is probably **no input tax credit** on the $479. So principal can genuinely cost ~$24 more per deal in tax than agent.
- **Foreign clients** may be zero-rated exports — which removes the issue entirely for a US or EU buyer.
- **BTC is property for tax purposes:** record the USD value at receipt, and the disposal value when spent. That burden is identical in both structures.

**Conclusion:** choose principal for control and simplicity, not for tax. If volume grows and clients are mostly Canadian, revisit §7.6 with the accountant — that is the one place agent genuinely wins.

## 7.7 Risk map (not legal advice)

| Behaviour | Risk |
|---|---|
| Receiving BTC for our own sale | Lower |
| Holding a client's sats for a week | **High** |
| Holding supply funds in escrow | **High** |
| Converting client sats to pay a vendor *on their behalf* | **Highest — reads as agency/transmission** |
| Paying vendors in fiat from our own funds | Lower |
| Non-Canadian clients | Medium (sanctions, tax) |

## 7.8 Records to keep from deal #1

Our invoice + written terms · vendor invoice and payment proof · payment hash and rate source with timestamp · signed receipt · sats ledger · BTC disposal records · sanctions notes.

## 7.9 Ask the accountant

1. Selling my own service for BTC as principal — any FINTRAC registration obligation? When does it start?
2. Does converting received sats to pay my own vendor change that status?
3. Would holding funds — including a Lightning hold invoice — make me an MSB? What is the smallest structure that avoids it?
4. How do I record BTC for GST/HST, especially from foreign buyers, and do I get any credit on a purchase from a non-resident supplier?
5. Which entity sells — sole proprietor or the existing company?

**No new corporation is needed to start.** Entity choice is about liability and scale, not about how we charge. Incorporate when contracts are large enough to want a wall between them and Cam personally.

---

# 8. Design direction (v1)

- **Price first, sats second.** USD is the anchor; sats sits beside it, smaller, with a Bitcoin-native toggle. A newcomer cannot parse 708,580.
- **The receipt is a ticket, not a compliance annex.** Status in plain words ("Live · verified 3 times"), a visual timeline, the screenshot. Cryptography one click down.
- **One accent rule:** flame orange marks exactly two things — the next action, and a verified status. Nothing else.
- **Tokens:** spacing 4/8/12/16/24/32/48/64 · type 1.2 scale from 16 (14, 16, 19, 23, 28, 34) · radius 8 controls / 12 cards · 1px borders at 12% cream.
- **RTL:** CSS logical properties, isolate BTC and numeric runs left-to-right, +2px Arabic body size, never mirror the logo.
- **Five anti-patterns to refuse:** anonymous team with no company name · unverifiable "trusted by" counters · prices with no source or date · neon gradients and ticker clutter · "guaranteed ROI" or forcing a wallet connect to browse.
- **Multi-language:** 8 locales stay, but v1 ships English + one proof-of-concept locale (German), not eight half-checked ones.

---

# 9. What v1 changes in the documents

| Doc | Change |
|---|---|
| `TADBUY-v0-BLUEPRINT.md` | Frozen as history. Superseded by this file. |
| `TADBUY-v1-BLUEPRINT.md` | This file. New pricing, new sequencing, six plays, adopted review. |
| `INDEX.md` | Reading order updated; v1 is the live plan. |
| One-pagers (PDF) | **Not yet re-cut.** Held until Cam approves the new one-line and the flat fee. |
| `REVIEW-PROMPT-2026-10-21.md` | Add a "round 2" section once Cam answers the three blocking questions. |

---

# 10. Decisions needed from Cam

| # | Decision | Recommendation |
|---|---|---|
| 1 | Flat fee vs percentage | **Flat fee.** It is the only answer to "why not buy direct". |
| 2 | Publish the rate card before the first sale | **Yes.** It is the outreach asset. |
| 3 | Run the 20-quote test before any build | **Yes.** Non-negotiable. |
| 4 | Sell the audit at $99 | **Yes** — it manufactures the buyer list. |
| 5 | Founding buyers at cost | **Yes, three, publicly named.** |
| 6 | Ask AADS for written resale terms this week | **Yes — this is blocking.** |
| 7 | Take the three review questions to a Canadian accountant | **Yes, before deal #2.** |
| 8 | Structure: **principal, pre-funded** — not commission | **Yes.** It is what already happens; no new corporation needed. See §7.2 |
| 9 | Tagline: "Bitcoin ads you can prove. Prices you can see." | **Yes** — "priceless" fights the price-transparency pitch |

---

## Change log

| Date | Version | Change |
|---|---|---|
| 2026-10-21 | v0 | First pivot: DSP → provable placements. |
| 2026-10-21 | v1.1 | Separated pricing (flat fee) from structure (principal vs agent) — earlier drafts fused them. Added §7 money-flow walkthrough, the books for deal #1, the failure/refund table, the GST wrinkle, and the "no new entity needed" note. |
| 2026-10-21 | v1 | Review adopted (maths, sats-is-not-a-wedge, receipt-over-OTS, no exclusivity, no agents yet, no escrow). Markup replaced with pass-through + flat fee. Rate card moved to day 1. Receipt defined. Six plays added (audit, receipt-as-marketing, SEO rate card, launch kit, public book, founding buyers). 14-day demand test becomes the only gate. |
