#!/usr/bin/env node
/** Report production JavaScript/CSS asset sizes for CI review. */
import fs from 'node:fs';
import path from 'node:path';

const assetsDir = path.join(process.cwd(), 'dist', 'assets');
if (!fs.existsSync(assetsDir)) {
  console.error('check-bundle: dist/assets is missing — run npm run build first');
  process.exit(1);
}

const files = fs.readdirSync(assetsDir)
  .filter((file) => /\.(?:js|css)$/.test(file))
  .map((file) => ({
    file,
    bytes: fs.statSync(path.join(assetsDir, file)).size,
  }))
  .sort((a, b) => b.bytes - a.bytes);

const total = files.reduce((sum, file) => sum + file.bytes, 0);
const format = (bytes) => `${(bytes / 1024).toFixed(1)} KiB`;

console.log(`✓ bundle report — ${files.length} JS/CSS assets, ${format(total)} total`);
for (const file of files.slice(0, 10)) {
  console.log(`  ${format(file.bytes).padStart(12)}  ${file.file}`);
}
