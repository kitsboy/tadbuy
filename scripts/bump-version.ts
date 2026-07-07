/**
 * Bumps patch version in package.json and syncs projectState.
 * Invoked automatically by .githooks/pre-push before each push.
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ROOT = path.resolve(import.meta.dirname, '..');
const pkgPath = path.join(ROOT, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8')) as { version: string };

const parts = pkg.version.split('.').map(Number);
if (parts.length !== 3 || parts.some(isNaN)) {
  console.error('Invalid semver in package.json:', pkg.version);
  process.exit(1);
}

parts[2] += 1;
const next = parts.join('.');
pkg.version = next;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf-8');

execSync('npm run sync-version', { cwd: ROOT, stdio: 'inherit' });
console.log(`📦 Bumped version → v${next}`);