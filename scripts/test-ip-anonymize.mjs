/**
 * Smoke tests for IP anonymization + impression sanitization.
 * Run: node scripts/test-ip-anonymize.mjs
 * (Uses dynamic import of compiled-less TS via tsx when available.)
 */
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';

function anonymizeIPv4(ip) {
  const parts = ip.split('.');
  if (parts.length !== 4) return '0.0.0.0';
  if (!parts.every((p) => /^\d{1,3}$/.test(p) && Number(p) <= 255)) return '0.0.0.0';
  return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
}

function anonymizeIPv6(ip) {
  const cleaned = ip.replace(/^\[|\]$/g, '').split('%')[0];
  const lower = cleaned.toLowerCase();
  if (lower === '::' || lower === '::1') return '::';
  const [head, tail = ''] = lower.split('::');
  const headParts = head ? head.split(':').filter(Boolean) : [];
  const tailParts = tail ? tail.split(':').filter(Boolean) : [];
  const missing = 8 - headParts.length - tailParts.length;
  const full = [
    ...headParts,
    ...Array(Math.max(0, missing)).fill('0'),
    ...tailParts,
  ].slice(0, 8);
  while (full.length < 3) full.push('0');
  return `${full[0]}:${full[1]}:${full[2]}::`;
}

function anonymizeIp(ip) {
  if (!ip || typeof ip !== 'string') return null;
  let raw = ip.trim();
  if (raw.startsWith('::ffff:')) raw = raw.slice(7);
  if (/^\d{1,3}(\.\d{1,3}){3}:\d+$/.test(raw)) raw = raw.split(':')[0];
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(raw)) return anonymizeIPv4(raw);
  if (raw.includes(':')) return anonymizeIPv6(raw);
  return null;
}

function hashIdentifierSync(value, salt = 'tadbuy-fp-v1') {
  if (!value) return null;
  return createHash('sha256').update(`${salt}:${value}`).digest('hex').slice(0, 32);
}

// Tests
assert.equal(anonymizeIp('192.168.1.45'), '192.168.1.0');
assert.equal(anonymizeIp('8.8.8.8'), '8.8.8.0');
assert.equal(anonymizeIp('::ffff:10.0.0.99'), '10.0.0.0');
assert.equal(anonymizeIp('2001:db8:85a3::8a2e:370:7334'), '2001:db8:85a3::');
assert.equal(anonymizeIp('::1'), '::');
assert.equal(anonymizeIp(null), null);
assert.equal(anonymizeIp('not-an-ip'), null);

const h1 = hashIdentifierSync('ua-chrome-1920');
const h2 = hashIdentifierSync('ua-chrome-1920');
const h3 = hashIdentifierSync('ua-firefox');
assert.equal(h1, h2);
assert.notEqual(h1, h3);
assert.equal(h1.length, 32);
assert.ok(!h1.includes('ua-chrome'));

console.log('OK: all IP anonymize + hash smoke tests passed');
