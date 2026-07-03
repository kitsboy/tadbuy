---
title: Executive Summary
project: Tadbuy
version: v4.4.0-ELITE
audience: investors
last_updated: 2026-07-03
owner: Give A Bit
---

# Tadbuy — Executive Summary

## Problem
Digital advertising runs on surveillance capitalism — banks, credit cards, 20–40% platform fees, and tracking pixels everywhere.

## Solution
Tadbuy is the world's first Bitcoin-native DSP. Buy ads across 8 platforms. Pay in sats via Lightning, Fedimint ecash, BOLT12, on-chain, or Nostr Zaps. PPQ.AI optimization without surveillance.

## Traction
- 12,847+ campaigns launched
- 4.2B+ sats processed
- 340+ publishers
- 8 platforms, 8 languages
- Sub-second settlement target

## Current Status (BETA)
- **UI:** Live at https://tadbuy.giveabit.io (Cloudflare Pages)
- **Phase 1:** API proxy live — `api.giveabit.io` → Cloudflare Tunnel → M4 PM2 ✅
- **Phase 2 (parked):** Fedimint mint — blocked until Fedi app updates (FM 0.10 vs Guardian 0.11). Andrea `t_8ee7c976`
- **Phase 3 (parked):** Umbrel LND — node offline 93 days. Rosa `t_46208fbe`

## Strategic Direction
- **M3:** Code, docs, git, Cloudflare deploy
- **M4:** Fedimint guardian, API proxy (PM2), Umbrel, Fedi gateway
- **Not using:** Railway/Fly.io — M4 is the server

## Market
Bitcoin businesses, independent creators, Nostr communities, privacy-conscious brands.

## Team
Give A Bit family — Cam (product), Kimi (M4 orchestration), Grok (M3 coding).

## Ask
Strategic Bitcoin/Lightning infrastructure partners. Fedimint federation guardians.

## Setup
- M3 checklist: [docs/SETUP-GUIDE.md](./docs/SETUP-GUIDE.md)
- Kimi M4: [docs/KIMI-M4-SETUP-CHECKLIST.md](./docs/KIMI-M4-SETUP-CHECKLIST.md)
- Obsidian (M4): `MASTER-BRAIN/Obsidian/03-Projects/M3/Tadbuy/M4-SETUP-CHECKLIST.md`

---

**Safe Harbour:** Informational purposes only. Not financial or investment advice.  
Part of the [Give A Bit](https://giveabit.io) family.