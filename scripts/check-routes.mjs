#!/usr/bin/env node
/** Verify that every lazy route module referenced by App.tsx exists. */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const appPath = path.join(root, 'src', 'App.tsx');
const app = fs.readFileSync(appPath, 'utf8');
const imports = [...app.matchAll(/lazy\(\(\) => import\(['"](\.\/[^'"]+)['"]\)\)/g)]
  .map((match) => match[1]);
const missing = imports.filter((specifier) => {
  const relative = specifier.replace(/^\.\//, '');
  return !['.ts', '.tsx'].some((extension) => fs.existsSync(path.join(root, 'src', relative + extension)));
});

if (missing.length > 0) {
  console.error('check-routes: missing lazy route modules:');
  missing.forEach((item) => console.error(`  - ${item}`));
  process.exit(1);
}

const routeCount = (app.match(/<Route\s+path=/g) ?? []).length;
console.log(`✓ routes verified — ${imports.length} lazy modules, ${routeCount} route declarations`);
