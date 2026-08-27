/**
 * HTML sanitizer — a small, dependency-free escape helper for
 * untrusted text rendered into React (e.g., user-supplied names, copy fields).
 *
 * React already escapes children by default, but this helps in cases
 * where a string is interpolated into href/src attributes or innerHTML.
 */

const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;',
};

export function escapeHtml(str: string | number | null | undefined): string {
  if (str === null || str === undefined) return '';
  return String(str).replace(/[&<>"'`=/]/g, (c) => HTML_ENTITIES[c] ?? c);
}

export function escapeAttr(str: string | number | null | undefined): string {
  if (str === null || str === undefined) return '';
  return String(str).replace(/[&<>"'`]/g, (c) => HTML_ENTITIES[c] ?? c);
}

export function escapeJs(str: string | number | null | undefined): string {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/</g, '\\u003C');
}

const URL_UNSAFE = /[^\w\-._~:/?#\[\]@!$&'()*+,;=%]/g;

/**
 * Encode a path segment for safe inclusion in a URL. Strips characters
 * that could be used to break out of the URL path.
 */
export function safePathSegment(input: string, maxLen = 200): string {
  if (!input) return '';
  return input
    .normalize('NFKC')
    .replace(URL_UNSAFE, '')
    .slice(0, maxLen)
    .replace(/^\.+/, ''); // prevent hidden / parent paths
}

/**
 * Truncate a user-supplied string for safe display in titles / OG tags.
 */
export function safeTruncate(str: string, max = 200, suffix = '…'): string {
  if (!str) return '';
  const s = escapeHtml(str);
  if (s.length <= max) return s;
  return s.slice(0, Math.max(0, max - suffix.length)) + suffix;
}
