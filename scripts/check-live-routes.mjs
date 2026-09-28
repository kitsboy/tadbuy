#!/usr/bin/env node
/**
 * Check a deployed build's routes actually render, by repeating each load.
 *
 * Why repeats: a single load per route is not enough here. On 2026-09-28 the
 * deployed site intermittently stalled on React's Suspense fallback with every
 * request completed and no console error. One-shot probes reported a *different*
 * "broken" route list on every run, which made one flaky boot look like ~19
 * broken routes. So this reports a hang *rate* per route and only fails when a
 * route never renders.
 *
 * Each tab is brought to the front before it is judged, so a route is measured
 * as a user meets it. Note this does NOT remove the stall: on 2026-09-28 a
 * foregrounded, fresh-profile cold load still stalled 4/12 times on production.
 * It only removes the concurrent-tab confound that made the rate look higher.
 *
 * Routes come from src/App.tsx, so the list cannot drift from the app.
 * Not part of CI: it needs a local Chrome and a reachable deployment.
 *
 *   node scripts/check-live-routes.mjs [--base URL] [--repeats N] [--timeout MS]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { launchChrome, openTab, sleep } from './lib/cdp.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const args = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = args.indexOf(name);
  return i === -1 ? fallback : args[i + 1];
};
const BASE = (arg('--base', 'https://tadbuy.giveabit.io')).replace(/\/$/, '');
const REPEATS = Number(arg('--repeats', 3));
const TIMEOUT = Number(arg('--timeout', 15000));
const SETTLE = Number(arg('--settle', 500));

/** Cloudflare injects its analytics beacon; our CSP blocks it on purpose. */
const EXPECTED_BLOCKED = 'static.cloudflareinsights.com';

const app = fs.readFileSync(path.join(ROOT, 'src', 'App.tsx'), 'utf8');
const routes = [...new Set([...app.matchAll(/<Route\s+path="([^"]+)"/g)].map((m) => m[1]))]
  .filter((route) => !route.includes(':') && route !== '*')
  .sort();

if (routes.length === 0) {
  console.error('check-live-routes: no static routes found in src/App.tsx');
  process.exit(1);
}

console.log(`checking ${routes.length} routes x ${REPEATS} loads on ${BASE}`);

const { port, close } = await launchChrome();
const results = [];

for (const route of routes) {
  const url = BASE + route;
  let stuck = 0;
  const problems = [];
  const seen = new Set();
  const booted = [];

  for (let i = 0; i < REPEATS; i++) {
    const tab = await openTab(port, 'about:blank');
    // Judge the tab the way a user sees it: in the foreground. The settle wait
    // lets bringToFront's own visibilitychange (and the app's handler for it)
    // land before the load starts, so the measurement is about the load.
    await tab.send('Page.bringToFront');
    await sleep(SETTLE);
    const failed = [];
    const unfinished = new Map();

    tab.on('Network.requestWillBeSent', (p) => unfinished.set(p.requestId, p.request.url));
    tab.on('Network.responseReceived', (p) => unfinished.delete(p.requestId));
    tab.on('Network.loadingFinished', (p) => unfinished.delete(p.requestId));
    tab.on('Network.loadingFailed', (p) => {
      const url = unfinished.get(p.requestId) || '';
      unfinished.delete(p.requestId);
      if (url && !url.includes(EXPECTED_BLOCKED)) failed.push(p.errorText || 'load failed');
    });
    tab.on('Runtime.exceptionThrown', (p) => {
      failed.push('uncaught: ' + String(p.exceptionDetails.exception?.description || p.exceptionDetails.text).slice(0, 120));
    });
    tab.on('Runtime.consoleAPICalled', (p) => {
      if (p.type === 'error') failed.push('console: ' + p.args.map((a) => a.value ?? a.description).join(' ').slice(0, 120));
    });
    await tab.send('Network.enable');

    const t0 = Date.now();
    await tab.send('Page.navigate', { url });
    const deadline = t0 + TIMEOUT;
    let main = null;
    while (Date.now() < deadline) {
      await sleep(500);
      const text = await tab.evaluate(
        `(document.querySelector('main')?.innerText || '').replace(/\\s+/g, ' ').trim().slice(0, 60)`
      );
      main = text;
      if (text && !text.startsWith('Loading page')) break;
    }

    const hung = !main || main.startsWith('Loading page');
    if (hung) stuck++;
    else booted.push(Date.now() - t0);
    for (const f of failed) seen.add(f);
    await tab.close();
  }

  results.push({ route, stuck, booted, problems: [...seen] });
  const sorted = [...booted].sort((a, b) => a - b);
  const median = sorted.length ? sorted[Math.floor(sorted.length / 2)] + 'ms' : '-';
  const rate = `${Math.round((stuck / REPEATS) * 100)}%`.padStart(4);
  const flag = stuck === REPEATS ? 'NEVER' : stuck > 0 ? 'flaky' : 'ok   ';
  console.log(`${flag} ${rate} stuck  ${median.padStart(7)}  ${route}${seen.size ? '  [' + [...seen].join(' | ') + ']' : ''}`);
}

close();

const never = results.filter((r) => r.stuck === REPEATS);
const flaky = results.filter((r) => r.stuck > 0 && r.stuck < REPEATS);
const totalLoads = routes.length * REPEATS;
const totalStuck = results.reduce((n, r) => n + r.stuck, 0);
const allBooted = results.flatMap((r) => r.booted ?? []);

console.log(
  `\n${totalLoads} loads: ${totalStuck} stuck (${Math.round((totalStuck / totalLoads) * 100)}%), ` +
  `${never.length} route(s) never rendered, ${flaky.length} intermittent`
);
if (allBooted.length) {
  const b = [...allBooted].sort((x, y) => x - y);
  console.log(`  rendered in: min ${b[0]}ms, median ${b[Math.floor(b.length / 2)]}ms, max ${b[b.length - 1]}ms`);
}

if (never.length > 0) {
  console.error(`check-live-routes: ${never.length} route(s) never rendered: ${never.map((r) => r.route).join(', ')}`);
  process.exit(1);
}
if (flaky.length > 0) {
  console.warn(`⚠ intermittent stalls (known Suspense issue, see docs/KIMI-HANDOFF.md): ${flaky.map((r) => r.route).join(', ')}`);
}
console.log('✓ every route rendered at least once');
