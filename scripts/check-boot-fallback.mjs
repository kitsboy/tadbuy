#!/usr/bin/env node
/**
 * Verify the index.html boot guard against the real shipped file.
 *
 * The live site intermittently stalls on React's Suspense fallback
 * (<PageLoader /> in src/App.tsx) with every request completed and no console
 * error. Before this guard, that state was permanent and silent: the guard only
 * fired when #root had *zero* children. This harness drives the actual
 * index.html — not a copy — through four scenarios and asserts what the user
 * sees.
 *
 * The guard's 12000ms grace delay is fast-forwarded in the served copy only.
 * The shipped constant is asserted separately, so the fast-forward cannot pass
 * if the delay disappears. Not part of CI: it needs a local Chrome.
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { launchChrome, openTab, sleep } from './lib/cdp.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const HTML = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const APP = fs.readFileSync(path.join(ROOT, 'src', 'App.tsx'), 'utf8');

const SHIPPED_DELAY = 12000;
const TEST_DELAY = 1500; // fast-forwarded: see header note
const SHOW_AT = TEST_DELAY + 2200; // the guard's first interval tick lands at +1000
const SETTLE_AT = SHOW_AT + 2800;

const failures = [];
const check = (label, actual, expected) => {
  const ok = actual === expected;
  if (!ok) failures.push(`${label}: expected ${expected}, got ${actual}`);
  console.log(`  ${ok ? '✓' : '✗'} ${label} → ${actual}`);
};

// ── Static invariants the scenarios below depend on ──────────────────────────
console.log('static invariants:');
check('src/App.tsx marks the loader with data-page-loader', APP.includes('data-page-loader'), true);
check('index.html selects [data-page-loader]', HTML.includes('[data-page-loader]'), true);
check(`index.html keeps the ${SHIPPED_DELAY}ms grace delay`, HTML.includes(String(SHIPPED_DELAY)), true);

// ── Scenario stubs, injected before the guard script runs ────────────────────
const stub = (body) => `<div id="root"></div>\n    <script>${body}</script>`;
const LOADER = "root.innerHTML = '<div data-page-loader><p>Loading page…</p></div>';";
const RENDER = "root.innerHTML = '<main>real app content</main>';";

const scenarios = [
  {
    name: 'empty root (bundle never mounted)',
    body: '',
    at: { show: true, settle: true },
  },
  {
    name: 'stuck on page loader (the intermittent stall)',
    body: `var root = document.getElementById('root'); ${LOADER}`,
    at: { show: true, settle: true },
  },
  {
    name: 'stuck, then recovers late — notice must clear',
    body: `var root = document.getElementById('root'); ${LOADER}
      setTimeout(function () { ${RENDER} }, ${TEST_DELAY + 3000});`,
    at: { show: true, settle: false },
  },
  {
    name: 'lazy chunk 404 — hard failure must stay visible',
    body: `var root = document.getElementById('root'); ${RENDER}
      setTimeout(function () {
        var s = document.createElement('script');
        s.src = '/assets/does-not-exist-cb3.js';
        document.head.appendChild(s);
      }, 300);`,
    at: { show: true, settle: true },
  },
];

// ── Serve the real index.html with one scenario injected ─────────────────────
let serving = '';
const server = http.createServer((req, res) => {
  if (req.url === '/src/main.tsx') {
    // A 404 here would trip the guard's script-error path and mask the timer.
    res.writeHead(200, { 'content-type': 'text/javascript' });
    res.end('export {};');
    return;
  }
  if (req.url === '/' || req.url === '/index.html') {
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end(serving);
    return;
  }
  res.writeHead(404, { 'content-type': 'text/javascript' });
  res.end('');
});

await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

let chrome;
try {
  chrome = await launchChrome();
} catch (error) {
  console.error(`check-boot-fallback: ${error.message}`);
  process.exit(1);
}

const VISIBLE = `!!document.getElementById('boot-fallback') && !document.getElementById('boot-fallback').hidden`;

console.log('\nscenarios:');
for (const scenario of scenarios) {
  serving = HTML
    .replace('<div id="root"></div>', stub(scenario.body))
    .replace(String(SHIPPED_DELAY), String(TEST_DELAY));
  console.log(`\n${scenario.name}`);
  const tab = await openTab(chrome.port, base + '/');
  await sleep(SHOW_AT);
  check('notice shown after the grace delay', await tab.evaluate(VISIBLE), scenario.at.show);
  await sleep(SETTLE_AT - SHOW_AT);
  check('notice state once settled', await tab.evaluate(VISIBLE), scenario.at.settle);
  await tab.close();
}

chrome.close();
server.close();

if (failures.length > 0) {
  console.error(`\ncheck-boot-fallback: ${failures.length} failure(s)`);
  failures.forEach((f) => console.error(`  - ${f}`));
  process.exit(1);
}
console.log(`\n✓ boot fallback verified — ${scenarios.length} scenarios`);
