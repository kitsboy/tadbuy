#!/bin/bash
# Run this on: Umbrel terminal (umbrel@umbrel:~$)
# Purpose: Deploy tadbuy.giveabit.io to Cloudflare Pages
# Risk: safe

set -e

echo "🚀 Deploying tadbuy.giveabit.io..."
cd /data/.openclaw/workspace/tadbuy

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building..."
npm run build

echo "📤 Deploying to Cloudflare Pages..."
wrangler pages deploy ./dist --project-name=tadbuy

echo "✅ Deployed!"
