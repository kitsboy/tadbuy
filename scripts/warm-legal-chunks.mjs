#!/usr/bin/env node
/**
 * Warm the legal/trust route chunks so a cold direct load resolves them fast.
 *
 * Root cause this fixes (verified live 2026-09-13):
 *   The legal route chunks (Terms/Privacy/Cookies, 8-13KB each) are React.lazy()
 *   and NOT modulepreloaded. On a cold direct load the browser downloads the
 *   main bundle + all vendor chunks (firebase, charts, pdf, qr, ui) and then the
 *   main thread spends 2-6s executing them before React even mounts and fires the
 *   lazy import() for the legal chunk. That chunk request lands ~3s AFTER
 *   DOMContentLoaded, and its own fetch+compile pushes first paint of the policy
 *   to ~4-7s (intermittently past the verifier window). The chunk download itself
 *   is fast — it is requested late, and it is cold.
 *
 * Fix: inject <link rel="modulepreload"> for the legal/trust chunk files into
 * dist/index.html after build. The browser then fetches AND compiles those tiny
 * chunks in parallel with the heavy main bundle, so by the time React mounts and
 * fires the lazy import() the module is already in the module map — the route
 * resolves immediately instead of waiting on a post-boot cold fetch.
 *
 * Run after `vite build` (see package.json "build": ... && node scripts/warm-legal-chunks.mjs).
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const dist = join(process.cwd(), 'dist');
const assets = join(dist, 'assets');
const indexPath = join(dist, 'index.html');

// Chunks that ship the legal/trust routes and their shared page-meta dep.
// These are the pages the family actually gets audited on — warm them always.
const WARM_PATTERNS = [/^Terms-/, /^Privacy-/, /^Cookies-/, /^usePageMeta-/, /^TrustCenter-/, /^ThankYou-/];

if (!existsSync(assets) || !existsSync(indexPath)) {
  console.error('warm-legal-chunks: dist/assets or dist/index.html missing — run vite build first');
  process.exit(1);
}

const files = readdirSync(assets).filter((f) => f.endsWith('.js'));
const warm = files.filter((f) => WARM_PATTERNS.some((re) => re.test(f)));

if (warm.length === 0) {
  console.error('warm-legal-chunks: no legal/trust chunks found in dist/assets');
  process.exit(1);
}

let html = readFileSync(indexPath, 'utf8');

const links = warm
  .map((f) => `<link rel="modulepreload" crossorigin href="/assets/${f}">`)
  .join('\n    ');

// Insert just before the entry module script (which is the last <script type="module">).
const entryIdx = html.lastIndexOf('<script type="module"');
if (entryIdx === -1) {
  console.error('warm-legal-chunks: could not find entry <script type="module"> in index.html');
  process.exit(1);
}

// Only insert the links if at least one of them isn't already present.
const alreadyWarmed = warm.every((f) =>
  html.includes(`href="/assets/${f}"`)
);
if (alreadyWarmed) {
  console.log(`warm-legal-chunks: already warmed (${warm.length} chunks) — nothing to do`);
  process.exit(0);
}

html = html.slice(0, entryIdx) + links + '\n    ' + html.slice(entryIdx);
writeFileSync(indexPath, html);

console.log(`warm-legal-chunks: preloaded ${warm.length} chunks into index.html:`);
for (const f of warm) console.log(`  /assets/${f}`);
