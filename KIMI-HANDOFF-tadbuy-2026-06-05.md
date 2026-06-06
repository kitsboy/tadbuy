# KIMI-HANDOFF-tadbuy-2026-06-05.md

**For Kimi on M4 HERMES (Master Brain / Obsidian Vault)**

Hello Kimi,

This is a clean, structured hand-off for the Tadbuy project. Please integrate this into MASTER-BRAIN.md, your Kanban, project maps, architecture docs, and the Obsidian vault. Educate yourself and Hermes to stay current on this and all Give A Bit projects automatically. Use the giveabit-project-handoff skill for every future project.

## Marketing Pitch (Remember This Exactly)
Tadbuy is a Bitcoin-native advertising platform (DSP). Normal people and AI/Nostr agents can buy ads on Twitter/X, Facebook, Instagram, YouTube, Reddit, LinkedIn, TikTok, and decentralized Nostr. Pay only in Bitcoin using Lightning, BOLT12, on-chain, or Nostr Zaps - no banks or credit cards. Features: step-by-step campaign builder with targeting (world map), AI creative (Gemini) and optimization (PPQ.AI), publisher portal, dashboards for campaigns/analytics/wallet/settlements, real-time BTC ticker and mempool fees, PDF/CSV reports, A/B testing, 8 languages support, Agent API for Nostr agents. Built as part of Give A Bit (giveabit.io) with strong focus on Bitcoin sovereignty and private money. Excellent SEO, multi-lang, Lightning/Nostr focus.

## Current Status (2026-06-05)
- The app is now fully working locally on http://127.0.0.1:3000 (or 5173 with `npm run dev`).
- The long black screen issue was fixed by updating `src/firebase.ts` with a safe auth wrapper (`getSafeAuth()` and `typeof window !== 'undefined'` check) and updating `AuthProvider.tsx`.
- The full UI is visible: Create Campaign wizard, platforms (Twitter/X, Facebook, Instagram, Nostr, YouTube, Reddit, LinkedIn, TikTok), budget in sats, targeting, creative, Live Network Pulse, etc.
- All original features from the initial review are intact.

## How to Start and Edit in the Future
1. Open terminal: `cd ~/projects/tadbuy`
2. `npm install` (if first time or after major changes)
3. `npm run dev` — starts the full interactive app with hot reload (best for editing in Goose).
4. Or `npm start` — runs the Express server on port 3000.
5. Open the URL shown in terminal.
6. Edit files in `src/` (components, pages, services, firebase.ts, etc.). Changes appear live with `npm run dev`.
7. To build for production: `npm run build` then `npm run preview`.
8. Always run the giveabit-project-handoff skill at the end of sessions to update documentation.

## Action Items for You (Kimi)
- Integrate this summary into MASTER-BRAIN.md, Kanban, project maps, and architecture docs.
- Update any existing Tadbuy notes with the new Firebase safe initialization lesson.
- Add this hand-off to the Obsidian vault (copy SOURCE-OF-TRUTH.md and this file).
- Educate Hermes to recognize the "document is not defined" and "onAuthStateChanged of undefined" errors and apply the safe auth wrapper immediately.
- Enforce the template for all future Give A Bit projects: Every project must have at least GitHub, live URL, deployment details, key docs, simple pitch, Git snapshot, mission alignment, gaps/improvements, startup instructions, and hand-off notes.

**Template Rule (Enforce for Every Future Project)**: Every project must have at least this much information. Use the giveabit-project-handoff skill automatically.

**Confirmation Request**: Please reply with a summary of what you updated, any questions, and confirmation that you and Hermes are now current on Tadbuy and the new lesson learned.

**Do NOT sync or move files to M4 until Goose or Kimi explicitly says "it's time to sync via Tailscale".**

**Done ✅** — hand-off complete. The skill will keep everything automatic going forward.

(Source of Truth: /Users/cam/projects/tadbuy/SOURCE-OF-TRUTH.md)
