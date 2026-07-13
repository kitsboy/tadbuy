import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(ROOT, 'dist');
const indexPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error('verify-dist: dist/index.html missing — run npm run build first');
  process.exit(1);
}

const html = fs.readFileSync(indexPath, 'utf8');
const refs = [...new Set([...html.matchAll(/\/assets\/([a-zA-Z0-9_.-]+-cb2\.(?:js|css))/g)].map((m) => m[1]))];
const missing = refs.filter((ref) => !fs.existsSync(path.join(distDir, 'assets', ref)));

if (missing.length > 0) {
  console.error('verify-dist: index.html references missing assets:');
  for (const ref of missing) console.error(`  - ${ref}`);
  process.exit(1);
}

const jsFiles = fs.readdirSync(path.join(distDir, 'assets')).filter((f) => f.endsWith('.js'));
if (jsFiles.length < 10) {
  console.error(`verify-dist: expected many JS chunks, found only ${jsFiles.length}`);
  process.exit(1);
}

console.log(`✓ dist verified — ${refs.length} referenced assets, ${jsFiles.length} JS chunks`);