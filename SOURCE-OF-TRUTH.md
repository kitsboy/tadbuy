# SOURCE-OF-TRUTH.md — Tadbuy (Give A Bit Project)

**Last Updated**: 2026-06-05

## Project Overview (Marketing Pitch)
Tadbuy is a Bitcoin-native advertising platform (DSP). Normal people and AI/Nostr agents can buy ads on Twitter/X, Facebook, Instagram, YouTube, Reddit, LinkedIn, TikTok, and decentralized Nostr. Pay only in Bitcoin using Lightning, BOLT12, on-chain, or Nostr Zaps - no banks or credit cards. Features: step-by-step campaign builder with targeting (world map), AI creative (Gemini) and optimization (PPQ.AI), publisher portal, dashboards for campaigns/analytics/wallet/settlements, real-time BTC ticker and mempool fees, PDF/CSV reports, A/B testing, 8 languages support, Agent API for Nostr agents. Built as part of Give A Bit (giveabit.io) with strong focus on Bitcoin sovereignty and private money. Excellent SEO, multi-lang, Lightning/Nostr focus.

## GitHub (Single Source of Truth)
- Repo: https://github.com/kitsboy/tadbuy.git
- Branch: main (production)
- Current status: Clean after fresh pull and Firebase auth fix.
- Recent commits include the 20-point enterprise roadmap, Give A Bit branding, Lightning/AI integration.

## Deployment Details
- **Live URL**: https://tadbuy.giveabit.io/
- **Platform**: Cloudflare Pages
  - Build command: `npm run build`
  - Output directory: `dist`
  - Branch: main (auto-deploy)
  - Node version: 20
  - Compatibility date: May 7 2026
  - Fail open: enabled
- **Firebase**: Project ID `tadbuy-e3555`
  - Environment variables: VITE_FIREBASE_* (API key and app ID are secrets — do not commit)
- **Local run**:
  - `npm install`
  - `npm run dev` (starts on http://127.0.0.1:5173 or similar)
  - Or `npm start` (runs server.ts on http://127.0.0.1:3000)
  - For editing: Use `npm run dev` for hot reload while working in Goose.

## Key Files
- `src/` — Main React 19 + Vite + TypeScript code (App.tsx, components/buyads/, pages/, services/lightningService.ts, geminiService.ts, firebase.ts)
- `package.json` — Scripts: dev, build, preview, start (server.ts)
- `vite.config.ts` — Vite config with Tailwind, React plugin, aliases
- `server.ts` — Express server for local development
- `NOTES.md`, `TECHNICAL_DOCUMENTATION.md`, `PROJECT-CONTEXT.md`, `STATUS.md`

## Mission Alignment
Strong Give A Bit branding: Bitcoin sovereignty, Lightning/Nostr Zaps for privacy, giveabit.io links, Safe Harbour language. Deeper privacy (PYNYM, BIP-47, Silent Payments) can be expanded.

## Recent Changes & Lessons Learned
- Long black screen / "document is not defined" and "onAuthStateChanged of undefined" errors were caused by Firebase initializing too early.
- **Fix**: Updated `src/firebase.ts` with `typeof window !== 'undefined'` check and `getSafeAuth()` wrapper. Also updated `AuthProvider.tsx`.
- Future rule: When seeing these errors, immediately check Firebase initialization order and add safe browser checks.

## Gaps / Improvements
- Add tests.
- Make deeper privacy features (PYNYM, BIP-47, Silent Payments) more prominent.
- Sync all docs with live site.
- Add more robust error handling for missing env vars.

## How to Start and Edit in the Future (New Section)
1. Open terminal: `cd ~/projects/tadbuy`
2. `npm install` (if first time or after changes)
3. `npm run dev` — starts the full interactive app with hot reload (best for editing in Goose).
4. Or `npm start` — runs the server on port 3000.
5. Open the URL shown in terminal.
6. Edit files in `src/` (components, pages, services). Changes appear live with `npm run dev`.
7. To build for production: `npm run build` then `npm run preview`.
8. Always run the giveabit-project-handoff skill at the end of sessions to update documentation.

**This file is the single source of truth.** All future work must update this file first. Use the giveabit-project-handoff skill for every project.

**Template Rule for All Future Give A Bit Projects**: Every project must have at least this much information (GitHub, live URL, deployment details, key docs, simple pitch, Git snapshot, mission alignment, gaps, hand-off notes, startup instructions).

**Done ✅** (hand-off ready for Kimi on M4).
