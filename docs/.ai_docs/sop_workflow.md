# tadbuy — Standard Operating Procedure

## Build
```bash
cd ~/projects/tadbuy && npm run build
```

## Dev Server
```bash
cd ~/projects/tadbuy && npm run dev
```

## Pre-Deploy Checks
```bash
cd ~/projects/tadbuy && git status && npm run build
```
## Deploy (Manual — wrangler from M4)
### Step 1: Sync dist from M3 to M4
```bash
rsync -avz --delete ~/projects/tadbuy/dist/ m4:~/tmp-tadbuy-dist/
```

### Step 2: On M4, deploy
```bash
wrangler pages deploy ~/tmp-tadbuy-dist/ --project-name tadbuy
```

## Post-Deploy Verify
```bash
curl -s ## Stack\n| Layer | Technology |\n|-------|-----------|\n| Frontend | React |\n| Styling | Tailwind CSS |\n| Backend | Firebase/Firestore |\n\n## Ports\n| Service | Port |\n|---------|------|\n| Dev server | 5173 |\n\n## Key Architecture\n- Bitcoin-native ad DSP\n- Lightning micropayments\n- Nostr Zaps integration\n- Multi-platform ad buying\n- Privacy-first\n\n## Hosting\nCloudflare Pages manual deploy — tadbuy.giveabit.io | grep -q 'tadbuy'
```
