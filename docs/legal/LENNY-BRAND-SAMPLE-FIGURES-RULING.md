# Lenny — RULING: real brand marks carrying sample figures (Tadbuy `/case-studies`)

**Card:** `t_902d8e2e` · **Author:** Lenny (Legal & Compliance) · **Date:** 2026-09-16
**Parent:** `t_913bf909` (which shipped the `sample`/`illustrative` labelling, v5.0.210, `1a726be`)
**Status:** RULING — binding. Names go. Replaced with generic archetypes; wording in §2, shipped
strings in §4. Label-ling was correct but insufficient; it is not withdrawn.
**Evidence:** my own real-Chromium render of the live page 2026-09-16 (whole-body `innerText`,
Chromium 1234) — the table in §1 is what the live DOM printed, not the source file.

---

## 0. Ruling in one line

**Naming a real brand next to invented performance figures is not curable by a label, so the
names go.** `Swan Bitcoin`, `Strike` and `Fold` are removed from `/case-studies` and replaced
with descriptive archetypes; the invented figures stay because they are now attached to nobody.
The existing footer "Safe Harbor" line does **not** cover this and is not part of the fix.

---

## 1. What is live today (rendered, v5.0.210)

Rendered `/case-studies` prints, per card: `SWAN BITCOIN` / `ILLUSTRATIVE — NOT A REAL CAMPAIGN` /
`SAMPLE ROI 3.2×` / `SAMPLE CTR 4.8%` / `IMPRESSIONS 2.1M` / `SIGN-UPS 8,420` / `COST PER SIGNUP 142 sats`
(and the Strike / Fold equivalents). Source: `src/pages/CaseStudies.tsx` `CASE_STUDIES[].brand`.
This is a public, indexable page — it is in `public/sitemap.xml` (`https://tadbuy.giveabit.io/case-studies`).

---

## 2. Decisions

### Q1 — May real brands (Swan Bitcoin, Strike, Fold) carry sample figures at all? **NO.**

Tier: **material** now, **catastrophic-by-asymmetry** if a brand responds. Reasons, in weight order:

1. **A label cannot cure a false attribution.** The shipped notice is good, but a disclaimer is
   measured against the *net impression* of the thing it sits next to, and it cannot rescue an
   express statement of fact. `SWAN BITCOIN … SAMPLE ROI 3.2×` reads as "Swan ran a campaign here
   and got 3.2×". Screenshots travel; labels get cropped. Under US FTC Act §5 an express false
   representation of a third party's performance is actionable regardless of a nearby disclaimer,
   and under the EU Unfair Commercial Practices Directive (2005/29/EC) a claim that a trader has
   the endorsement or approval of another undertaking is in **Annex I point 4 — false endorsement,
   blacklisted in all circumstances, no "reasonable consumer" defence**.
2. **Trademark: the third prong of nominative fair use fails.** Nominative use (*New Kids on the
   Block v. News America*, 971 F.2d 302 (9th Cir. 1992)) requires that the reference (a) identify
   something not readily identifiable otherwise, (b) use no more of the mark than necessary, and
   (c) **do nothing to suggest sponsorship or endorsement**. Prong (c) is exactly what a
   performance figure next to a real mark does. In the EU/UK the exposure is worse: Swan, Strike
   and Fold all have reputation in the Bitcoin market, so Art. 10(2)(c) EUTMR / s.10(3) TMA 1994
   apply — use without due cause that takes unfair advantage of, or is detrimental to, a
   distinctive character is actionable *without* confusion, and these are Bitcoin-native marks on a
   Bitcoin advertising product (unfair advantage, plus tarnishment if the numbers look invented).
3. **False light about their own marketing practices.** The narratives do not only invent results,
   they invented *methods* ("PPQ.AI optimized headlines around 'stack sats' without surveillance
   retargeting", "Fedimint ecash checkout let them A/B test creatives without exposing card data").
   That attributes a business practice to a named company that it never adopted — a separate head
   of harm from the numbers.
4. **The page is investor/partner-facing.** Public, in the sitemap, framed as "Case Studies". If a
   prospective investor, partner or grant reviewer later relies on "Swan/Strike/Fold campaigns" as
   traction, the invented attribution becomes a material misstatement of commercial traction in due
   diligence. No offering is live today, so this is a tail risk, not a present one — but it is the
   reason the stakes are not merely reputational.
5. **Asymmetry decides it.** Upside of keeping the names: slightly more vivid sample cards. Downside:
   a C&D or a public "we never advertised with Tadbuy" from any of three funded, well-counselled
   companies, against a project with no entity, no revenue and no litigation budget. That is an
   uncapped downside bought with cosmetic upside — refuse it.
6. **House practice is the other way.** Where B2B products show worked examples with real metrics
   they use anonymised or invented counterparties ("a leading DCA exchange", "Acme Corp"). Naming a
   real vendor with invented numbers is precisely what house practice avoids.

**What I am not saying:** the archetypes are not "less true" — they are *more* true. And the numbers
staying is deliberate: once attached to nobody, a labelled sample figure is honest shorthand for the
shape of a campaign, which is the only thing this build can honestly show.

### Q2 — What replaces them? **Generic archetypes. The three cards stay.**

The page's own rule was "do not delete the page; make it true", and the cards explain the product
mechanic — deleting them loses the explanation and gains nothing. Replacements (exact strings in §4):

| Slot | Out | In |
|---|---|---|
| `brand` #1 | `Swan Bitcoin` | `A DCA exchange` |
| `brand` #2 | `Strike` | `A Lightning payments app` |
| `brand` #3 | `Fold` | `A Bitcoin rewards card` |

`tagline` fields are descriptive ("DCA messaging to cold audiences") and carry no mark — **keep**
them, they are what makes the card legible after the name goes.

Also renamed the internal `id` keys (`swan`/`strike`/`fold` → `dca-exchange`/`lightning-payments-app`/
`bitcoin-rewards-card`). They are not rendered, but they ship inside the JS bundle, and the
machine-readable copy is the one that outlives the page in a search index. A stale `id:"swan"` next
to sample figures is the same attribution surviving in a surface nobody re-reads.

**Generalisation I accept:** a generic phrase can still *point* at one company when the category has
a single famous occupant ("a Bitcoin rewards card" ⇒ Fold in the US). That is acceptable — it is a
category noun, not a mark, it is not offered as an endorsement, and no reasonable reader treats "a
X" as a claim about a specific X. It is not acceptable once the sentence also states results *of that
company*, which is the line §2 Q1 draws.

### Q3 — Nominative-use nod, "not affiliated" line, Safe Harbor? **No, no, and no.**

- **Nominative-use note: not needed.** Nominative fair use is a defence for *referring to a mark you
  must refer to*. Once no mark is named there is nothing to defend; a disclaimer about brands would
  be a disclaimer about nothing.
- **"Not affiliated with" line: do NOT add — in either form.** The named list version
  ("…not affiliated with Swan Bitcoin, Strike or Fold") reintroduces the exact attribution we are
  removing, and does so in the most quotable sentence on the page. The generic version ("not
  affiliated with any company mentioned") is noise on a page that mentions no company, and invites
  the question it is trying to close. The page notice + per-card badge already say the true thing.
- **Footer Safe Harbor: it does not cover this, and must not be relied on.** The clause reads
  "Forward-looking statements involve risks and uncertainties. Tadbuy and giveabit.io are provided
  'as is' without warranty. Always verify addresses before sending funds." Its first sentence covers
  *projections about our own future*. A claimed past campaign and its measured results is a statement
  of **historical fact about a third party** — the opposite of a forward-looking statement, and not
  ours to disclaim. An "as is" warranty disclaimer is about product quality, not about the truth of
  marketing claims. Leave the line where it is for its own purpose; count it as zero protection here.

### Stale-copy consequence of the fix (in scope, one string)

The page notice said "no **brand below** has advertised with us". With no brand named below, that
sentence becomes inaccurate about its own page. Adjusted to "no **brand is named below** and no
figure below was measured" (§4). This is a necessary consequence of Q2, not a re-open of the shipped
labelling.

---

## 3. Residual risk after the fix (honest)

- The three figures sets (ROI/CTR/impressions/sign-ups) remain on the page and remain invented.
  Accepted: they are labelled `Sample`, in scenario voice, attached to no one, and the page states no
  campaign has ever run. This is standard illustrative-sample practice.
- `/marketplace` (`src/data/marketplaceSlots.ts`) is **the same defect class and is NOT fixed by this
  card**: it lists real publishers — `Swan Bitcoin` ("Swan Signal Newsletter Sponsor",
  `publisherVerified: true`), `BTC Sessions`, `Bitcoin Audible`, `Stacker News` — with subscriber
  counts, impressions/day, CTRs and live-looking auction countdowns. It carries a `DEMO MODE — NO REAL
  LIGHTNING SETTLEMENT` badge, which labels the *settlement*, not the *publisher relationships*. My
  ruling in §2 Q1 applies to it as a class, but it is a different page with a different fix
  (archetype inventory vs. real publisher names) and it needs its own card — raised separately, not
  silently folded in here.
- No counsel has reviewed this ruling. It is a defensible internal position with a dated rationale,
  not legal advice.

---

## 4. Shipped strings (before → after)

See the card metadata and commit message for the diff; verbatim:

| # | Before (source) | After (source) |
|---|---|---|
| 1 | `brand: 'Swan Bitcoin'` + `id: 'swan'` | `brand: 'A DCA exchange'` + `id: 'dca-exchange'` |
| 2 | `brand: 'Strike'` + `id: 'strike'` | `brand: 'A Lightning payments app'` + `id: 'lightning-payments-app'` |
| 3 | `brand: 'Fold'` + `id: 'fold'` | `brand: 'A Bitcoin rewards card'` + `id: 'bitcoin-rewards-card'` |
| 4 | notice: `so no brand below has advertised with us and no figure below was measured.` | notice: `so no brand is named below and no figure below was measured.` |

Rendered verification (real Chromium, live URL) and the deploy commit are recorded on the card.

**Shipped and verified:** commits `e4199ed` and `b802185` (version v5.0.211) on `kitsboy/tadbuy`
`main`; CI (`Deploy tadbuy to Cloudflare Pages`) green on the head commit; CF Pages live. Real-Chromium render of
`https://tadbuy.giveabit.io/case-studies` on 2026-09-16 prints card titles `A DCA EXCHANGE`,
`A LIGHTNING PAYMENTS APP`, `A BITCOIN REWARDS CARD` and the string `no brand is named below`; the
words `swan`, `strike`, `fold` appear **nowhere** in the rendered page text, and the served
`CaseStudies-*.js` chunk carries only the archetype strings.

---

## 5. Follow-ups raised

1. **`/marketplace` publisher names** — same class, own card (§3). Not fixed here.
   Raised as **`t_dc16c07f`** (assignee: ziggy, parent `t_902d8e2e`), which carries the four named
   slots, the archetype rule and the rendered-verification requirement.
2. Nothing else in `src/`, `public/`, `docs/` or the repo-wide grep carries a real brand plus
   invented performance as of this ruling (`Swan Signal … / Swan Bitcoin` in `marketplaceSlots.ts`
   is item 1; `docs/GEMINI-RESEARCH-PROMPT.md` mentions brands only as external research examples in
   an internal prompt and is not published).
