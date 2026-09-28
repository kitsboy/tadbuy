/**
 * Minimal Chrome DevTools Protocol helpers, shared by the browser-based checks
 * (check-boot-fallback, check-live-routes). Dependency-free: node 22+ has
 * global fetch and WebSocket, so nothing here needs installing.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  ].filter(Boolean);
  const found = candidates.find((c) => fs.existsSync(c));
  if (found) return found;
  const which = spawnSync('which', ['google-chrome', 'chromium'], { encoding: 'utf8' });
  return which.status === 0 ? which.stdout.split('\n')[0].trim() : null;
}

/** Launch headless Chrome on an ephemeral debug port. Returns { port, close }. */
export async function launchChrome(extraArgs = []) {
  const binary = findChrome();
  if (!binary) throw new Error('no Chrome found — set CHROME_PATH');

  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'tadbuy-cdp-'));
  const chrome = spawn(binary, [
    '--headless=new',
    '--remote-debugging-port=0',
    '--remote-allow-origins=*',
    `--user-data-dir=${profile}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    ...extraArgs,
    'about:blank',
  ], { stdio: 'ignore' });

  const close = () => {
    try { chrome.kill('SIGKILL'); } catch { /* already gone */ }
    try { fs.rmSync(profile, { recursive: true, force: true }); } catch { /* best effort */ }
  };
  process.on('exit', close);

  const portFile = path.join(profile, 'DevToolsActivePort');
  for (let i = 0; i < 100; i++) {
    if (fs.existsSync(portFile)) {
      return { port: fs.readFileSync(portFile, 'utf8').split('\n')[0].trim(), close };
    }
    await sleep(100);
  }
  close();
  throw new Error('Chrome did not expose a debugging port');
}

/** Open a tab and talk to it. Returns { send, evaluate, on, close }. */
export async function openTab(port, url) {
  const res = await fetch(`http://127.0.0.1:${port}/json/new?` + encodeURIComponent(url), { method: 'PUT' });
  const target = await res.json();
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  let id = 0;
  const pending = new Map();
  const listeners = [];

  ws.addEventListener('message', (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result || {}); pending.delete(m.id); return; }
    for (const [method, handler] of listeners) {
      if (m.method === method) handler(m.params);
    }
  });
  await new Promise((r) => ws.addEventListener('open', r));

  const send = (method, params = {}) => {
    const msgId = ++id;
    ws.send(JSON.stringify({ id: msgId, method, params }));
    return new Promise((r) => pending.set(msgId, r));
  };
  await send('Runtime.enable');
  await send('Page.enable');

  return {
    send,
    on: (method, handler) => listeners.push([method, handler]),
    evaluate: async (expression, { awaitPromise = false } = {}) => {
      const out = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise });
      if (out.exceptionDetails) {
        throw new Error(out.exceptionDetails.exception?.description || out.exceptionDetails.text);
      }
      return out.result?.value;
    },
    close: async () => {
      await send('Target.closeTarget', { targetId: target.id }).catch(() => {});
      ws.close();
    },
  };
}
