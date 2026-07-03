# tadbuy — SOP Workflow for Agents

## Session Start
1. Read `GROK-SESSION-PROTOCOL.md`
2. Read `docs/.ai_docs/context_map.md`
3. Check `docs/BETA.md` for what's live vs staged

## Development (M3 only)
```bash
cd ~/projects/tadbuy
npm run dev   # Full UI + API at :3000
npm run lint
npm run build # Auto-syncs docs via prebuild
```

## Never on M3
- Fedimint guardian install
- Umbrel node operations
- Long-running production daemons

## Commit & Deploy
```bash
git add -A && git commit -m "feat: ..." && git push origin main
# Cloudflare auto-deploys static SPA
```

## End of Session
1. Append `docs/KIMI-HANDOFF.md`
2. Update `LATEST-UPDATE.md`
3. Echo to `~/projects/PROJECT-UPDATE-LOG.md`

## Consumer Payment SOP (when M4 ready)
1. User selects Fedimint at checkout
2. Join Give A Bit Mint via fm-invite
3. Pay ecash → server `/api/fedimint/pay`
4. Campaign saved to Firestore → status live

## Kimi M4 Setup (server work)
Follow `docs/KIMI-M4-SETUP-CHECKLIST.md` in order:
1. API proxy (Phase 1)
2. Fedimint mint (Phase 2)
3. Umbrel LND (Phase 3, when ready)

## Agent Automation SOP
- Fetch `GET /api/agent/manifest` for capabilities
- Use `apiFetch()` from `src/lib/apiBase.ts` (handles M4 proxy fallback)
- Read `src/data/ecosystemConfig.ts` for cross-project mint config
- Run `npm run sync-docs` to refresh all markdown docs