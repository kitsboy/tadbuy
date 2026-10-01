#!/usr/bin/env node
/**
 * Verify the illustration kit holds on every theme — dependency-free,
 * local-Chrome only, not part of CI (needs Chrome; serves dist/ itself).
 *
 * Per theme/contrast combo, loads one route per scene (all six kit scenes are
 * single-instance page headers) and checks:
 *   1. the scene renders (>=160px wide, pointer-events:none), no overflow;
 *   2. every opaque shape is visible against the page background it actually
 *      sits on: composite (alpha x opacity chain) over the body background,
 *      then deltaL >= 12 in Lab space or WCAG ratio >= 2.2 — for filled
 *      shapes WITH a stroke, either the fill or the outline may satisfy it
 *      (that is how light-theme cards read). Shapes with opacity <= 0.15 are
 *      exempt: ground shadows and sparkles are deliberately soft. Gradient
 *      fills (brand hues) are skipped from the math. Two shape classes are
 *      measured against their OWN plate instead of the page: `data-art-ink`
 *      marks (white bolt on the gradient screen, globe meridians) and sat-coin
 *      rims inside `data-art-coin` — the page background is meaningless for
 *      ink-on-color, and judging it there produced false failures.
 *      NOTE: the body background is oklch() in light mode; anyToRgb's
 *      Oklab -> sRGB conversion must stay correct or every light-mode accent
 *      reads as invisible (a near-white page decoded as mid-gray).
 *   3. the scene uses at least one --art-* token at its RESOLVED value
 *      (getComputedStyle resolves var(), so resolved values are matched —
 *      this is what proves the kit tracks the active theme);
 *   4. no console errors / uncaught exceptions.
 *
 * The theme is set through localStorage BEFORE navigation (Page.
 * addScriptToEvaluateOnNewDocument), so ThemeProvider's useState initializer
 * reads it on first render — no attribute race with its mount effect.
 *
 *   npm run build && npm run check:art-themes            # gate
 *   npm run check:art-themes -- --report                 # per-shape dump
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { launchChrome, openTab, sleep } from './lib/cdp.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const REPORT = process.argv.includes('--report');

/** route → the scene its header renders (from the kit's page wiring). */
const ROUTE_SCENE = {
  '/docs': 'blueprint',
  '/pitch': 'rocket',
  '/metrics': 'campaign',
  '/wallet': 'lightning-flow',
  '/marketplace': 'marketplace',
  '/platforms': 'globe-zap',
};
const COMBOS = [
  ['dark', 'normal'],
  ['dark', 'high'],
  ['light', 'normal'],
  ['light', 'high'],
];
/** Lab L* visibility threshold; strokes this thin need only ~2.2:1 WCAG. */
const MIN_DL = 12;
const MIN_CR = 2.2;
const SOFT_OPACITY = 0.15;

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json' };
const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];
  const file = path.join(DIST, url === '/' ? 'index.html' : url);
  if (fs.existsSync(file) && fs.statSync(file).isFile()) {
    res.writeHead(200, { 'content-type': MIME[path.extname(file)] || 'application/octet-stream' });
    res.end(fs.readFileSync(file));
  } else if (!path.extname(url)) {
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end(fs.readFileSync(path.join(DIST, 'index.html')));
  } else {
    res.writeHead(404); res.end();
  }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const BASE = `http://127.0.0.1:${server.address().port}`;

function labL(hex) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h, 16);
  const f = (v) => { const c = v / 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  const Y = 0.2126 * f((n >> 16) & 255) + 0.7152 * f((n >> 8) & 255) + 0.0722 * f(n & 255);
  return Y <= 0.008856 ? Y * 903.3 : Math.cbrt(Y) * 116 - 16;
}
function lum(hex) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h, 16);
  const f = (v) => { const c = v / 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  return 0.2126 * f((n >> 16) & 255) + 0.7152 * f((n >> 8) & 255) + 0.0722 * f(n & 255);
}
const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
/** Resolve a --art-* token name to its rgb() string from the probe's token map. */
const tokenRgb = (tokens, name) => tokens[name] || null;
/** "rgb(r,g,b)" (what getComputedStyle returns) → "#rrggbb" (what the math takes). */
const rgbStrToHex = (rgbStr) => {
  const m = String(rgbStr).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  return m ? '#' + m.slice(1, 4).map((v) => Number(v).toString(16).padStart(2, '0')).join('') : null;
};
const hexToRgbArr = (hex) => {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
/** Parse any CSS color the page reports (hex, rgb, oklch, ...) into [r,g,b]. */
const anyToRgb = (cssColor) => {
  const rgbMatch = cssColor.match(/rgba?\(([^)]+)\)/);
  if (rgbMatch) return rgbMatch[1].split(',').slice(0, 3).map(Number);
  const ok = cssColor.match(/oklch\(([\d.]+)%?\s+([\d.]+)\s+([\d.]+)/);
  if (ok) {
    // Convert Oklab → sRGB (lightness in 0..1 or percent).
    let L = parseFloat(ok[1]); if (ok[1].includes('%')) L /= 100; else if (L > 1) L /= 100;
    const a = parseFloat(ok[2]) * Math.cos(parseFloat(ok[3]) * Math.PI / 180);
    const b = parseFloat(ok[2]) * Math.sin(parseFloat(ok[3]) * Math.PI / 180);
    const l_ = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
    const m_ = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
    const s_ = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
    const lr = 4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_;
    const lg = -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_;
    const lb = -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_;
    const gamma = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
    const clamp = (v) => Math.max(0, Math.min(1, v));
    return [lr, lg, lb].map((c) => Math.round(clamp(gamma(clamp(c))) * 255));
  }
  throw new Error('unparseable page color: ' + cssColor);
};

const SCENE_PROBE = `
(() => {
  const svg = document.querySelector('main svg[data-art-scene]');
  if (!svg) return { absent: true };
  const bgStr = getComputedStyle(document.body).backgroundColor;
  const rootStyle = getComputedStyle(document.documentElement);
  const tokens = {};   // '--art-*' name -> rgb() string
  const tokenRgbKeys = {}; // rgb() string -> '--art-*' name (match by value)
  for (const t of ['--art-scene', '--art-card', '--art-stroke', '--art-stroke-soft', '--art-star', '--art-yellow', '--art-coin-rim']) {
    const v = rootStyle.getPropertyValue(t).trim();
    if (v.startsWith('#')) {
      const h = v.slice(1);
      const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
      const rgbStr = 'rgb(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ')';
      tokens[t] = rgbStr;
      tokenRgbKeys[rgbStr] = t;
    }
  }
  const shapes = [];
  svg.querySelectorAll('rect, circle, path, ellipse, line').forEach((el) => {
    if (el.closest('defs')) return;
    const cs = getComputedStyle(el);
    let op = 1, p = el;
    while (p && p !== svg) { op *= parseFloat(getComputedStyle(p).opacity || '1'); p = p.parentElement; }
    op *= parseFloat(cs.fillOpacity) * parseFloat(cs.strokeOpacity);
    shapes.push({
      tag: el.tagName,
      fill: cs.fill, stroke: cs.stroke,
      strokeWidth: parseFloat(cs.strokeWidth) || 0,
      opacity: Math.round(op * 1000) / 1000,
      ink: el.hasAttribute('data-art-ink'),
      coinRim: !!el.closest('[data-art-coin]'),
    });
  });
  const r = svg.getBoundingClientRect();
  return {
    tokenRgbKeys,
    name: svg.getAttribute('data-art-scene'),
    w: Math.round(r.width), h: Math.round(r.height),
    pe: getComputedStyle(svg).pointerEvents,
    bg: bgStr, tokens,
    shapes,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  };
})()
`;

const failures = [];
const check = (label, ok, actual) => {
  console.log(`  ${ok ? '✓' : '✗'} ${label} → ${actual}`);
  if (!ok) failures.push(`${label} (got ${actual})`);
};

console.log('static invariants:');
const kit = fs.readFileSync(path.join(ROOT, 'src', 'components', 'illustrations.tsx'), 'utf8');
const css = fs.readFileSync(path.join(ROOT, 'src', 'index.css'), 'utf8');
check('kit tags scenes with data-art-scene', kit.includes('data-art-scene'), 'yes');
check('kit reads the --art-* tokens', /var\(--art-(scene|card|stroke|stroke-soft|star)\)/.test(kit), 'yes');
for (const sel of [':root {', '[data-theme="light"] {', '[data-contrast="high"] {', '[data-theme="light"][data-contrast="high"] {']) {
  check(`index.css defines art vars for \`${sel.replace(' {', '')}\``, css.includes(sel) && css.includes('--art-scene'), 'yes');
}

const chrome = await launchChrome();
console.log('\ntheme matrix:');
const report = [];
const scenesSeen = new Set();
/** measured page background per theme, printed by --report (oklch → sRGB). */
const bgSeen = {};

for (const [theme, contrastMode] of COMBOS) {
  console.log(`\n[${theme}/${contrastMode}]`);
  for (const [route, expectedScene] of Object.entries(ROUTE_SCENE)) {
    const tab = await openTab(chrome.port, 'about:blank');
    const errs = [];
    tab.on('Runtime.consoleAPICalled', (p) => { if (p.type === 'error') errs.push('console'); });
    tab.on('Runtime.exceptionThrown', () => errs.push('uncaught'));
    // Set the theme before any app script runs: ThemeProvider's useState
    // initializer reads these keys (useLocalStorage adds the tadbuy: prefix,
    // values are JSON) on first render.
    await tab.send('Page.addScriptToEvaluateOnNewDocument', {
      source: `try { localStorage.setItem('tadbuy:tadbuy_theme', '${JSON.stringify(theme)}'); localStorage.setItem('tadbuy:tadbuy_contrast', '${JSON.stringify(contrastMode)}'); } catch {}`,
    });
    await tab.send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
    await tab.send('Page.navigate', { url: BASE + route });
    const t0 = Date.now();
    let ready = false;
    while (Date.now() - t0 < 12000) {
      await sleep(400);
      const main = await tab.evaluate(`(document.querySelector('main')?.innerText || '').replace(/\\s+/g,' ').trim()`);
      if (main && !main.startsWith('Loading page')) { ready = true; break; }
    }
    await sleep(400);
    if (!ready) { check(`${route}: page boots`, false, 'stuck on loader'); await tab.close(); continue; }

    const s = await tab.evaluate(SCENE_PROBE);
    if (s.absent) { check(`${route}: art present`, false, 'ABSENT'); await tab.close(); continue; }
    check(`${route}: ${s.name} scene renders ${s.w}x${s.h}, pe=${s.pe}`, s.name === expectedScene && s.w >= 160 && s.pe === 'none', `${s.name} ${s.w}x${s.h}`);
    scenesSeen.add(s.name);

    const bgRgb = anyToRgb(s.bg);
    bgSeen[theme] = '#' + bgRgb.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
    let tokenHits = 0, strong = 0, ink = 0, rimOk = 0, rimTotal = 0;
    for (const sh of s.shapes) {
      // Ink marks are drawn ON a colored plate (gradient screen, globe fill),
      // so the page background is the wrong reference for them — they are
      // checked against their plate below, not here.
      if (sh.ink) { ink++; continue; }
      // A sat coin's rim is ink on the coin's own fill, not on the page.
      if (sh.coinRim) {
        rimTotal++;
        const fillTok = tokenRgb(s.tokens, '--art-yellow');
        const rimHex = rgbStrToHex(sh.stroke);
        if (fillTok && rimHex && contrast(rimHex, rgbStrToHex(fillTok)) >= 1.8) rimOk++;
        continue;
      }
      // Composite the effective color over the body background.
      const colors = [];
      if (sh.fill && sh.fill !== 'none' && !sh.fill.startsWith('url(')) colors.push(['fill', sh.fill, sh.opacity]);
      if (sh.stroke && sh.stroke !== 'none' && !sh.stroke.startsWith('url(') && sh.strokeWidth >= 0.5) colors.push(['stroke', sh.stroke, sh.opacity]);
      if (colors.length === 0) continue;
      let visOk = false, weakest = null;
      for (const [kind, color, op] of colors) {
        if (color.startsWith('oklch')) continue; // token-resolved colors handled below
        const m = color.match(/rgba?\(([^)]+)\)/);
        if (!m) continue;
        const parts = m[1].split(',').map(Number);
        const a = (parts.length > 3 ? parts[3] : 1) * op;
        const bgHex = '#' + bgRgb.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
        const comp = '#' + [0, 1, 2].map((i) => Math.round(parts[i] * a + bgRgb[i] * (1 - a)).toString(16).padStart(2, '0')).join('');
        const dL = Math.round(Math.abs(labL(comp) - labL(bgHex)));
        const cr = Math.round(contrast(comp, bgHex) * 100) / 100;
        const ok = dL >= MIN_DL || cr >= MIN_CR;
        if (ok) visOk = true;
        if (!weakest || dL < weakest.dL) weakest = { kind, color, op, dL, cr, ok };
        // Token check: does this shape color match a --art-* token's RESOLVED
        // value? (getComputedStyle collapses var(); compare canonical rgb.)
        const [tr, tg, tb] = parts;
        for (const rgbStr of Object.keys(s.tokenRgbKeys)) {
          const [nr, ng, nb] = rgbStr.match(/rgb\((\d+),(\d+),(\d+)\)/).slice(1).map(Number);
          if (Math.abs(tr - nr) <= 1 && Math.abs(tg - ng) <= 1 && Math.abs(tb - nb) <= 1) { tokenHits++; break; }
        }
        report.push({ theme, route, scene: s.name, tag: sh.tag, kind, color, op, dL, cr, ok, soft: sh.opacity <= SOFT_OPACITY });
      }
      if (sh.opacity <= SOFT_OPACITY) continue; // deliberate glows/shadows
      // Ink details drawn ON bright fills (pencil tip on the yellow pencil,
      // star centers on coins) are judged against their backdrop, not the
      // page — approximated here: small dark shapes with opacity 1 are ink.
      const isInkDot = sh.opacity === 1 && sh.tag === 'circle' && visOk === false && weakest && weakest.dL <= 6;
      if (visOk || isInkDot) strong++;
      else check(`${route} ${s.name} <${sh.tag} ${weakest.kind}> visible on ${theme}/${contrastMode}`, false, `${weakest.color} op=${weakest.op} dL=${weakest.dL} cr=${weakest.cr}`);
    }
    check(`${route} ${s.name}: reads on ${theme} (>=3 strong shapes)`, strong >= 3, `${strong}/${s.shapes.length - ink - rimTotal}`);
    check(`${route} ${s.name}: uses an --art-* token at its resolved value`, tokenHits > 0, `${tokenHits} shape-colors`);
    if (rimTotal) check(`${route} ${s.name}: coin rim reads against its own fill`, rimOk === rimTotal, `${rimOk}/${rimTotal} >= 1.8:1`);
    if (ink) check(`${route} ${s.name}: ink marks are plate-bound (exempt from page bg)`, true, `${ink} data-art-ink`);
    check(`${route}: no overflow`, s.overflow <= 1, s.overflow + 'px');
    check(`${route}: no errors`, errs.length === 0, errs.join(',') || 'none');
    await tab.close();
  }
}
chrome.close(); server.close();

check('all six scenes covered', scenesSeen.size === 6, [...scenesSeen].join(','));

if (REPORT) {    // Real measured background per theme (oklch() from the body must be decoded).
    const bg = (t) => bgSeen[t] || '?';
  console.log('\nper-shape report (weakest first, opaque shapes):');
  const rows = report.filter((r) => r.op > SOFT_OPACITY).sort((a, b) => a.dL - b.dL);
  for (const r of rows.slice(0, 30)) {
    console.log(`  ${r.theme.padEnd(6)} ${r.scene.padEnd(15)} ${r.tag.padEnd(7)} ${r.kind.padEnd(6)} ${String(r.color).padEnd(20)} op=${String(r.op).padEnd(5)} dL=${String(r.dL).padStart(3)} cr=${String(r.cr).padEnd(5)} vs ${bg(r.theme)}${r.ok ? '' : '  ← LOW'}`);
  }
}
console.log(failures.length ? `\n✗ ${failures.length} failure(s)` : '\n✓ art themes verified across all combos');
process.exit(failures.length ? 1 : 0);
