# GIVEABIT DEPLOY PLAYBOOK
## Quick Reference
| Site | Source | Port | Deploy |
|------|--------|------|--------|
| **Satohash** | `/home/umbrel/satohash/` | 3005 | `cd /home/umbrel/satohash && git pull && npm run build && sudo systemctl restart satohash` |
| **TadBuy** | `/home/umbrel/umbrel/app-data/openclaw/data/.openclaw/workspace/sites/tadbuy/` | 3002 | `cd /home/umbrel/umbrel/app-data/openclaw/data/.openclaw/workspace/sites/tadbuy && npm run build && sudo systemctl restart tadbuy` |
| **Stranded** | `/home/umbrel/giveabit-dashboard/sites/tools-giveabit-io/stranded/` | 3003 | `cd /home/umbrel/giveabit-dashboard/sites/tools-giveabit-io/stranded/ && git pull && npm run build && sudo systemctl restart stranded` |
## Service Commands
`sudo systemctl status satohash tadbuy stranded` — Check all
`sudo systemctl restart tadbuy` — Restart one
`sudo journalctl -u tadbuy -f` — Live logs
## Known Issues
- Satohash: Hard refresh on `/developers` = 404 (SPA limitation)
- TadBuy: Build takes ~6 minutes
- Stranded: No git repo, edit directly
