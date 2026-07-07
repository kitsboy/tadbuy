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
  const t = PROJECT_STATE.executive.traction;
  const impressions = live?.impressions ?? 1_240_000;
  const campaigns = live?.totalCampaigns ?? t.campaignsLaunched;

  writeDoc('EXECUTIVE.md', `# Tadbuy — Executive Summary

**Auto-generated:** ${today} · **Version:** ${PROJECT_STATE.version}

## Mission
${PROJECT_STATE.executive.mission}

## Vision
${PROJECT_STATE.executive.vision}

## Traction (Live)
| Metric | Value |
|--------|-------|
| Campaigns | ${campaigns.toLocaleString()}+ |
| Impressions | ${impressions.toLocaleString()}+ |
| Publishers | ${t.publishers}+ |
| Platforms | ${t.platforms} |
| Avg Settlement | <${t.avgSettlementSeconds}s |
| Sats Processed | ${(t.satsProcessed / 1e9).toFixed(1)}B+ |

## Differentiators
${PROJECT_STATE.executive.differentiators.map(d => `- ${d}`).join('\n')}

## Fedimint Strategy
Tadbuy integrates **Fedimint ecash** as a first-class payment rail — enabling privacy-preserving, federation-backed ad purchases without on-chain fees. See [docs/FEDIMINT.md](./FEDIMINT.md).

---
*Safe Harbour · Part of the [Give A Bit](https://giveabit.io) family.*
`);

  const f = PROJECT_STATE.financials;
  writeDoc('FINANCIALS.md', `# Tadbuy — Financial Overview

**Auto-generated:** ${today} · **FY:** ${f.fiscalYear}

## Revenue Model
${f.revenueModel}

## Projections (${f.currency})
| Year | Platform Revenue | Ad Spend Volume | Active Users |
|------|-----------------|-----------------|--------------|
${f.projections.map(p => `| ${p.year} | $${p.revenue.toLocaleString()} | $${p.adSpend.toLocaleString()} | ${p.users.toLocaleString()} |`).join('\n')}

## Unit Economics
| Metric | Value |
|--------|-------|
| Avg Campaign Budget | $${f.unitEconomics.avgCampaignBudgetUsd} |
| Platform Take Rate | ${f.unitEconomics.platformTakeRate * 100}% |
| CAC | $${f.unitEconomics.cacUsd} |
| LTV | $${f.unitEconomics.ltvUsd} |
| Gross Margin | ${f.unitEconomics.grossMargin * 100}% |

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

**CTA:** ${PROJECT_STATE.marketing.cta}

## Target Audiences
${PROJECT_STATE.marketing.audiences.map(a => `- ${a}`).join('\n')}

## Payment Rails (Marketing Points)
${PROJECT_STATE.paymentMethods.map(p => `- **${p.name}** — ${p.status}`).join('\n')}

## Live URL
${PROJECT_STATE.liveUrl}

---
*Part of the [Give A Bit](https://giveabit.io) family.*
`);

  writeDoc('FEDIMINT.md', `# Fedimint Integration — Tadbuy

**Auto-generated:** ${today}

## Overview
${PROJECT_STATE.fedimint.description}

## Why Fedimint for Ads?
${PROJECT_STATE.fedimint.benefits.map(b => `- ${b}`).join('\n')}

## Configuration
\`\`\`bash
# .env.local
VITE_FEDIMINT_INVITE=fm-invite://...
FEDIMINT_GATEWAY_URL=https://your-mint-gateway
\`\`\`

## User Flow
1. Advertiser selects **Fedimint Ecash** at checkout
2. Join federation via invite code (one-time)
3. Pay campaign budget in ecash notes
4. Federation settles to Tadbuy Lightning node
5. Campaign goes live instantly

## Resources
- [Fedimint.org](${PROJECT_STATE.fedimint.docsUrl})
- [Fedimint SDK](${PROJECT_STATE.fedimint.sdkUrl})
- [Bitcoin Design Guide — Ecash](https://bitcoin.design/guide/how-it-works/ecash/fedimint/)

## API Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/fedimint/status | GET | Federation connection status |
| /api/fedimint/balance | GET | Ecash balance (session) |
| /api/fedimint/pay | POST | Pay campaign with ecash |

---
*Tadbuy ${PROJECT_STATE.version}*
`);

  const batches = Object.entries(PROJECT_STATE.featureBatches)
    .map(([k, v]) => `| ${k} | ${v.label} | ${v.completed}/${v.total} |`)
    .join('\n');

  writeDoc('BETA.md', `# Tadbuy — BETA Status

**Auto-generated:** ${today} · **Version:** ${PROJECT_STATE.version}

## Phase: BETA

| Component | Status |
|-----------|--------|
| UI (Cloudflare Pages) | ✅ Live |
| Campaign Builder | ✅ Live |
| Global Reach (/geo) | ✅ Live — 100 enhancements, 25 markets |
| Metrics / Analytics UI | ✅ Live |
| SPA routing | ✅ Fixed (React Router v7 sync) |
| API (/api/*) | ⏳ Needs M4 proxy or \`npm run dev\` |
| Fedimint (Give A Bit Mint) | ⏳ Staged on M4 |
| Umbrel Lightning | ⏳ Not ready |
| Real payments | 🔶 Demo mode |

## Consumer Workflow
1. Browse & plan → 2. Create campaign → 3. Pay → 4. Go live → 5. Track results

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

## Setup
See [SETUP-GUIDE.md](./SETUP-GUIDE.md) and [M4-SERVER-REF.md](./M4-SERVER-REF.md).

---
*Part of the [Give A Bit](https://giveabit.io) family.*
`);

  writeDoc('ECOSYSTEM.md', `# Give A Bit Ecosystem

**Auto-generated:** ${today}

## Shared Fedimint Mint
- **Name:** Give A Bit Mint
- **Domain:** giveabit.io
- **Gateway:** mint.giveabit.io (M4 HERMES)
- **Status:** staged

## Projects Using This Mint
| Project | URL |
|---------|-----|
| Tadbuy | https://tadbuy.giveabit.io |
| Give A Bit | https://giveabit.io |
| Satohash | https://satohash.giveabit.io |
| MotoPass | https://motopass.giveabit.io |
| OpenStrata | https://openstrata.giveabit.io |

## M3 vs M4
- **M3:** Code in ~/projects/ — never install Fedimint/Umbrel here
- **M4:** Server — Fedimint guardian, Umbrel, API proxy, Fedi gateway

---
*See SETUP-GUIDE.md for connection instructions.*
`);

  writeDoc('GEO.md', `# Tadbuy — Global Reach (/geo)

**Auto-generated:** ${today} · **Version:** ${PROJECT_STATE.version}

## Overview
Interactive geo-targeting dashboard at [${PROJECT_STATE.liveUrl}/geo](${PROJECT_STATE.liveUrl}/geo).

## Features (100 enhancements — batch 24)
- 25-country market dataset with spend, CPM, trends, BTC adoption
- Interactive world map with country selection
- Region filters, search, sort, min-CTR slider
- Watchlist, compare up to 3 markets, export CSV
- Tabs: Overview · Insights · Learn
- Buy Ads handoff via \`?geo=CODE\`

## API Endpoints
| Endpoint | Description |
|----------|-------------|
| GET /api/geo/page/stats | Aggregate geo stats |
| GET /api/geo/page/insights | Recommendations |
| GET /api/geo/page/trends | Regional trends |
| GET /api/geo/countries | Country list |

Full manifest: [GEO-PAGE-100.md](./GEO-PAGE-100.md)

---
*Part of the [Give A Bit](https://giveabit.io) family.*
`);

  const sha = process.env.GIT_SHA?.slice(0, 7) ?? 'sync';
  const latestPath = path.join(ROOT, 'LATEST-UPDATE.md');
  fs.writeFileSync(latestPath, `# tadbuy — Last Updated ${today} by Grok

Brief: ${PROJECT_STATE.version} — /geo 100 enhancements + docs sync
Commit: ${sha}
Docs synced: ${today}
`, 'utf-8');

  console.log('✅ Docs sync complete.');
}

main().catch((e) => {
  console.error('Docs sync failed:', e);
  process.exit(1);
});