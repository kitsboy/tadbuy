#!/usr/bin/env node
/**
 * Tadbuy SEO prerender — writes a static landing page into dist/ for crawlers.
 * Googlebot/AI bots see real content in raw HTML (the SPA shell is JS-only).
 * Served via _redirects: /prerender/landing.html is a real file; crawler
 * detection happens in a tiny CF Pages function (functions/_middleware.js).
 */
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const dist = join(process.cwd(), 'dist')
const outDir = join(dist, 'prerender')
const SITE = 'https://tadbuy.giveabit.io'

const html = `<!doctype html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Tadbuy — Bitcoin-Native Ad Buying Platform</title>
<meta name="description" content="Buy and sell ads with Bitcoin and Lightning. Self-serve DSP for bitcoin-native advertisers — pay in sats, target the Bitcoin economy.">
<link rel="canonical" href="${SITE}/">
<link rel="alternate" hreflang="en" href="${SITE}/">
<link rel="alternate" hreflang="x-default" href="${SITE}/">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"WebSite","name":"Tadbuy","url":"${SITE}","description":"Bitcoin-native ad buying platform. Pay in sats via Lightning, Nostr Zaps, or on-chain.","publisher":{"@type":"Organization","name":"Give A Bit","url":"https://giveabit.io"}}
</script></head><body>
<h1>Tadbuy — Bitcoin-Native Ad Buying</h1>
<p>Buy and sell advertising with Bitcoin and Lightning. Self-serve platform for bitcoin-native advertisers: pay in sats, target the Bitcoin economy, no legacy ad-tech middlemen.</p>
<h2>Why Tadbuy</h2>
<ul>
<li><strong>Pay in sats</strong> — Lightning, BOLT12, on-chain, or Nostr Zaps</li>
<li><strong>Bitcoin-native</strong> — built for the Bitcoin economy, not the surveillance ad industry</li>
<li><strong>8+ platforms</strong> — reach bitcoin audiences across the ecosystem</li>
<li><strong>Geo targeting</strong> — reach specific regions and markets</li>
</ul>
<p><a href="${SITE}/marketplace">Browse marketplace</a> · <a href="${SITE}/publisher">Publisher tools</a> · Part of the <a href="https://giveabit.io">Give A Bit</a> family</p>
</body></html>`

mkdirSync(outDir, { recursive: true })
writeFileSync(join(outDir, 'landing.html'), html)
console.log('prerender/landing.html written')
