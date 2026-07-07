<div align="center">
  <img src="/public/favicon.png" alt="Tadbuy" width="80" height="80" />
  <h1>Tadbuy</h1>
  <p><strong>The world's first Bitcoin-native advertising platform.</strong></p>
  <p><code>v5.0.0-PLATINUM</code> · 350 enhancements · BETA</p>
  <p>Buy ads across 8 platforms. Pay in sats via Lightning, BOLT12, on-chain, or Nostr Zaps.</p>
  <p>
    <a href="https://tadbuy.giveabit.io">Live Site</a> ·
    <a href="https://giveabit.io">Give A Bit</a> ·
    <a href="/docs">Documentation</a>
  </p>
</div>

---

## What is Tadbuy?

Tadbuy is a sovereign Demand-Side Platform (DSP) built for the Bitcoin era. Advertisers launch cross-platform campaigns on Twitter/X, Facebook, Instagram, YouTube, Reddit, LinkedIn, TikTok, and Nostr — paying only in Bitcoin with no banks or credit cards.

**Key features:**
- Step-by-step campaign builder with geospatial targeting
- AI creative optimization (Gemini) and PPQ.AI bidding
- Lightning Network, BOLT12, on-chain, and Nostr Zap payments
- Publisher portal, analytics dashboard, wallet, and settlements
- 8 languages, Agent API for Nostr bots, real-time BTC ticker

## Platform Split (M3 vs M4)

| Machine | Role | Location |
|---------|------|----------|
| **M3** | Code & docs (Grok) | `~/projects/tadbuy/` |
| **M4** | Server ops (Kimi/HERMES) | Fedimint, API proxy, Umbrel |

**Rule:** Do **not** clone this repo on M4 for development. M4 pulls only to run `server.ts` via PM2. All code edits happen on M3.

| Doc | M3 (GitHub) | M4 (Obsidian) |
|-----|-------------|---------------|
| M4 setup checklist | [docs/KIMI-M4-SETUP-CHECKLIST.md](./docs/KIMI-M4-SETUP-CHECKLIST.md) | `MASTER-BRAIN/.../Tadbuy/M4-SETUP-CHECKLIST.md` |

## Quick Start (M3 only)

**Prerequisites:** Node.js 20+

```bash
git clone https://github.com/kitsboy/tadbuy.git
cd tadbuy
npm install
cp .env.example .env.local   # add GEMINI_API_KEY and VITE_FIREBASE_* vars
npm run dev                  # http://127.0.0.1:3000
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server with hot reload (Express + Vite) |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | TypeScript type check |
| `npm start` | Production server on port 3000 |

## Deployment

Deployed automatically to **Cloudflare Pages** on push to `main`.

| Setting | Value |
|---------|-------|
| Build command | `npm run build` |
| Output directory | `dist` |
| Node version | 20 |
| Live URL | https://tadbuy.giveabit.io |

## Project Structure

```
src/
  pages/          # Route pages (BuyAds, Dashboard, Marketplace, etc.)
  components/     # Shared UI, buyads wizard steps, widgets
  services/       # Lightning + Gemini API clients
  locales/        # i18n translations (8 languages)
  lib/            # Utils, Sentry, i18n config
public/           # Static assets, PWA manifest, service worker
docs/             # SEO, mission, handoff docs
```

## Documentation

- [SOURCE-OF-TRUTH.md](./SOURCE-OF-TRUTH.md) — canonical project reference
- [EXEC-SUMMARY.md](./EXEC-SUMMARY.md) — investor one-pager
- [docs/KIMI-M4-SETUP-CHECKLIST.md](./docs/KIMI-M4-SETUP-CHECKLIST.md) — Kimi M4 server setup (5 phases)
- [docs/SETUP-GUIDE.md](./docs/SETUP-GUIDE.md) — M3 + M4 + Fedi + Umbrel
- [docs/BETA.md](./docs/BETA.md) — what works now vs staged
- [docs/.ai_docs/](./docs/.ai_docs/) — agent automation (context_map, sop, manifest)
- [CONTRIBUTING.md](./CONTRIBUTING.md) — how to contribute

## License

See [LICENSE](./LICENSE).

---

*Safe Harbour · Part of the [Give A Bit](https://giveabit.io) family.*