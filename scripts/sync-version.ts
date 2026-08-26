/**
 * Syncs package.json version → projectState.ts (and docs on build).
 * Footer reads live version via src/version.ts → package.json.
 */
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(import.meta.dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf-8')) as { version: string };
const display = `v${pkg.version}`;

const statePath = path.join(ROOT, 'src/data/projectState.ts');
let state = fs.readFileSync(statePath, 'utf-8');
state = state.replace(/version: 'v[^']+'/, `version: '${display}'`);
fs.writeFileSync(statePath, state, 'utf-8');

const swPath = path.join(ROOT, 'public/sw.js');
if (fs.existsSync(swPath)) {
  let sw = fs.readFileSync(swPath, 'utf-8');
  sw = sw.replace(/const CACHE_NAME = 'tadbuy-v[^']+';/, `const CACHE_NAME = 'tadbuy-${display}';`);
  fs.writeFileSync(swPath, sw, 'utf-8');
}

console.log(`✓ Version synced: ${display}`);