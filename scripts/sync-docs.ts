/**
 * Auto-syncs executive, financial, marketing, and README snippets from PROJECT_STATE.
 * Runs on every `npm run build` via prebuild hook.
 */
import fs from 'fs';
import path from 'path';
import { PROJECT_STATE } from '../src/data/projectState.ts';

const ROOT = path.resolve(import.meta.dirname, '..');
const today = new Date().toISOString().split('T')[0];

function writeDoc(filename: string, content: string) {
  const filepath = path.join(ROOT, 'docs', filename);
  fs.writeFileSync(filepath, content, 'utf-8');
  console.log(`  ✓ docs/${filename}`);
}

async function fetchLiveMetrics() {
  try {
    const res = await fetch('http://127.0.0.1:3000/api/metrics', { signal: AbortSignal.timeout(2000) });
    if (res.ok) return await res.json();
  } catch { /* dev server not running — use static state */ }
  return null;
}

async function main() {
  console.log('📄 Syncing auto-evolving docs...');

  const live = await fetchLiveMetrics();

  // Traction is live-only: no static fallbacks. If /api/metrics is unreachable
  // (as at the CF Pages origin) every row reads "—" rather than an estimate.
  const num = (v: number | undefined | null) =>
    typeof v === 'number' ? `${v.toLocaleString()}+` : '—';

  writeDoc('EXECUTIVE.md', `# Tadbuy — Executive Summary

**Auto-generated:** ${today} · **Version:** ${PROJECT_STATE.version}

## Mission
${PROJECT_STATE.executive.mission}

## Vision
${PROJECT_STATE.executive.vision}

## Traction (live metrics only)
_Source: /api/metrics. Rows read "—" when the endpoint is unreachable — no estimated or hardcoded counters are published._

| Metric | Value |
|--------|-------|
| Campaigns | ${num(live?.totalCampaigns)} |
| Live campaigns | ${num(live?.liveCampaigns)} |
| Impressions | ${num(live?.impressions)} |
| Clicks | ${num(live?.clicks)} |

## Distribution model
${PROJECT_STATE.marketing.pitch}

Phase 1: Nostr publishing plus vendor-assisted websites, newsletters, and podcasts. Later phases add Reddit, Meta, Google/YouTube, Spotify, Pinterest, LinkedIn, TikTok, and DOOH only when provider access and reporting are real.

## Honest product boundary
Tadbuy is being built to coordinate campaign plans, approved vendor inventory, delivery evidence, and future settlement. This preview has no approved vendors, live inventory, payment, or settlement. It does not claim automatic third-party publishing, live reach, or payouts.

## Differentiators
${PROJECT_STATE.executive.differentiators.map(d => `- ${d}`).join('\n')}

## Payment-rail status
No campaign payment rail is connected. Bitcoin and Lightning support are roadmap work only; a synced Umbrel node alone does not provide invoice verification, campaign accounting, or settlement. Fedimint is also an unapproved roadmap option. See [BETA readiness](./BETA.md) and [FEDIMINT](./FEDIMINT.md).

---
*Safe Harbour · Part of the [Give A Bit](https://giveabit.io) family.*
`);

  const f = PROJECT_STATE.financials;
  writeDoc('FINANCIALS.md', `# Tadbuy — Financial Overview

**Auto-generated:** ${today} · **FY:** ${f.fiscalYear}

## Revenue Model
${f.revenueModel}

No advertiser fee, publisher commission, or settlement schedule has been approved. Future commercial terms require product approval, durable marketplace records, an authoritative payment source, and a reconciled ledger.

## Distribution roadmap
See [docs/DISTRIBUTION-ROADMAP.md](./DISTRIBUTION-ROADMAP.md) for the phased channel plan.

## Forecast and unit economics
No validated forecast, ad-spend projection, user-growth target, or unit economics are published. No substantiated source or approved assumptions are available for these figures; they must not be presented as actuals or a forecast.

## Funding
- **Stage:** ${f.funding.stage}
- **Runway:** ${f.funding.runway}
- **Strategic Ask:** ${f.funding.ask}

---
*Auto-synced from projectState.ts on every build.*
`);

  writeDoc('MARKETING.md', `# Tadbuy — Marketing

**Auto-generated:** ${today}

**Tagline:** ${PROJECT_STATE.marketing.tagline}

**Pitch:** ${PROJECT_STATE.marketing.pitch}

## Phase 1 Channels
- **Nostr** — NIP-07 signed publication with relay acknowledgements
- **Websites & blogs** — vendor-assisted placement
- **Newsletters** — vendor-assisted sponsorship
- **Podcasts** — vendor-assisted audio placement

## Later Channels
Reddit · Meta (Facebook + Instagram) · Google/YouTube · Spotify · Pinterest · LinkedIn · TikTok · digital out-of-home

**CTA:** ${PROJECT_STATE.marketing.cta}

## Target Audiences
${PROJECT_STATE.marketing.audiences.map(a => `- ${a}`).join('\n')}

## Payment Rails (Marketing Points)
No per-rail status is implied by listing a protocol here. No Tadbuy campaign rail settles in this build; a synced node or third-party receive address alone is not sufficient. \`/beta\` owns the readiness gates.
${PROJECT_STATE.paymentMethods.map(p => `- ${p.name}`).join('\n')}

## Live URL
${PROJECT_STATE.liveUrl}

---
*Part of the [Give A Bit](https://giveabit.io) family.*
`);

  writeDoc('FEDIMINT.md', `# Fedimint Integration — Tadbuy

**Auto-generated:** ${today}

## Overview
${PROJECT_STATE.fedimint.description}

## Future design questions (not a payment flow)
${PROJECT_STATE.fedimint.benefits.map(b => `- ${b}`).join('\n')}

## Configuration
\`\`\`bash
# .env.local
# No invite or gateway is configured; do not paste federation or node secrets into the public app.
\`\`\`

## Future design gates (not an available user flow)
1. Product owner approves whether Tadbuy should accept campaign funds.
2. Select and review a federation, guardians/quorum, governance, recovery, limits, and support plan.
3. Define payment-status authority, replay protection, ledger/reconciliation, refunds, and failure handling.
4. Complete security and operational review; use test-only fixtures before any real funds.
5. Obtain explicit release approval. No step is enabled by this documentation.

## Resources
- [Fedimint.org](${PROJECT_STATE.fedimint.docsUrl})
- [Fedimint SDK](${PROJECT_STATE.fedimint.sdkUrl})
- [Bitcoin Design Guide — Ecash](https://bitcoin.design/guide/how-it-works/ecash/fedimint/)

## API
No Fedimint API endpoint is deployed or approved for Tadbuy. The legacy status/balance/pay path names are not a deployed integration.

---
*Tadbuy ${PROJECT_STATE.version}*
`);

  const batches = Object.entries(PROJECT_STATE.featureBatches)
    .map(([k, v]) => `| ${k} | ${v.label} | ${v.completed}/${v.total} |`)
    .join('\n');

  writeDoc('BETA.md', `# Tadbuy — BETA Status

**Auto-generated:** ${today} · **Version:** ${PROJECT_STATE.version}

## Phase: BETA

No campaign payments, publisher marketplace activation, or settlement are enabled. The operator must verify node and Lightning health separately; no node connection or sync telemetry is read by this static app.

| Component | Status |
|-----------|--------|
| UI (Cloudflare Pages) | ✅ Live |
| Campaign Builder | ✅ Live |
| Global Reach (/geo) | ✅ Live — 100 enhancements, 25 markets |
| Metrics / Analytics UI | ✅ Live |
| SPA routing | ✅ Fixed (React Router v7 sync) |
| Backend API and durable marketplace | ⛔ Not deployed; no live orders or account records |
| Campaign payment and publisher settlement | ⛔ Disabled; no verified rail or ledger |
| Fedimint | ⏳ Unapproved roadmap option; no Tadbuy integration |
| Umbrel Bitcoin / Lightning | ⏳ Operator verification required; not connected to Tadbuy |
| Real campaign payments and settlement | ⛔ Disabled; no Tadbuy rail or ledger |

## Distribution status
- **Preview now:** local planning and optional user-signed Nostr note (not a paid placement)
- **Future vendor-assisted channels:** websites/blogs, newsletters, podcasts only after approved vendors and pilot rules
- **Later:** Reddit, Meta, Google/YouTube, Spotify, Pinterest
- **Specialist:** LinkedIn and TikTok
- **Future:** digital out-of-home screen marketplace

## Consumer Workflow
1. Plan a local campaign preview → 2. Review sample distribution concepts → 3. Prepare local creative → 4. Inspect the future proof path. Payment, activation, publisher coordination, and campaign measurement are not available in this build.

## Key Pages
| Page | URL |
|------|-----|
| Buy Ads | ${PROJECT_STATE.liveUrl}/ |
| Global Reach | ${PROJECT_STATE.liveUrl}/geo |
| Marketplace | ${PROJECT_STATE.liveUrl}/marketplace |
| BETA Status | ${PROJECT_STATE.liveUrl}/beta |

## Enhancement Batches (summary)
| Batch | Label | Status |
|-------|-------|--------|
${batches}

See https://tadbuy.giveabit.io/beta for live status.

## Preparation references
See [BACKEND-SCOPE.md](./BACKEND-SCOPE.md), [FEDIMINT.md](./FEDIMINT.md), and [Wallet readiness](https://tadbuy.giveabit.io/wallet). No server or node is connected by these docs.

---
*Part of the [Give A Bit](https://giveabit.io) family.*
`);

  writeDoc('ECOSYSTEM.md', `# Give A Bit Ecosystem

**Auto-generated:** ${today}

## Fedimint
No shared federation or gateway is verified as operational or approved for Tadbuy. See [FEDIMINT.md](./FEDIMINT.md) for the roadmap gates.

## Ecosystem projects
| Project | URL |
|---------|-----|
| Tadbuy | https://tadbuy.giveabit.io |
| Give A Bit | https://giveabit.io |
| Satohash | https://satohash.giveabit.io |
| MotoPass | https://motopass.giveabit.io |
| OpenStrata | https://openstrata.giveabit.io |

## Ownership and infrastructure
- Application code changes stay in this repository.
- Node operation and any future API deployment require the designated operator and product/security approval.
- Do not infer that any machine, federation, Lightning daemon, or API is connected from this static document.

---
*See SETUP-GUIDE.md for connection instructions.*
`);

  writeDoc('GEO.md', `# Tadbuy — Global Reach (/geo)

**Auto-generated:** ${today} · **Version:** ${PROJECT_STATE.version}

## Overview
Interactive **example-data planning UI** at [${PROJECT_STATE.liveUrl}/geo](${PROJECT_STATE.liveUrl}/geo). Country and market figures are static illustrations, not live Tadbuy audience, spend, or performance data.

## Features (interface work — batch 24)
- 25-country illustrative dataset with example spend, CPM, trends, BTC adoption
- Interactive world map with country selection
- Region filters, search, sort, min-CTR slider
- Watchlist, compare up to 3 markets, export CSV
- Tabs: Overview · Insights · Learn
- Buy Ads handoff via \`?geo=CODE\`

## Data and operational boundary
The map, filters, comparisons, recommendations, and exports operate on the bundled sample dataset. No geo-targeting API or provider-side audience activation is connected.

Full manifest: [GEO-PAGE-100.md](./GEO-PAGE-100.md)

---
*Part of the [Give A Bit](https://giveabit.io) family.*
`);

  const sha = process.env.GIT_SHA?.slice(0, 7) ?? 'sync';
  const latestPath = path.join(ROOT, 'LATEST-UPDATE.md');
  fs.writeFileSync(latestPath, `# tadbuy — Last Updated ${today} by Grok

Brief: ${PROJECT_STATE.version} — docs sync from projectState
Commit: ${sha}
Docs synced: ${today}
`, 'utf-8');

  console.log('✅ Docs sync complete.');
}

main().catch((e) => {
  console.error('Docs sync failed:', e);
  process.exit(1);
});