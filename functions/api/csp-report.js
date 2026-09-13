/**
 * POST /api/csp-report — receive Content-Security-Policy violation reports.
 *
 * Our served CSP (public/_headers) ends in
 *   report-uri https://tadbuy.giveabit.io/api/csp-report
 * and the site is a static Cloudflare Pages export, so without this function
 * every violation the browser tries to report came back 405 (and the browser
 * logged that 405 as its own console error). This function accepts the POST and
 * records the violation so the failures are visible here instead of only in a
 * visitor's console.
 *
 * Browsers send `application/csp-report` (legacy report-uri) or
 * `application/reports+json` (Reporting API); both are handled.
 *
 * Reports are logged — no PII beyond the document URL the browser was on, and
 * nothing is persisted client-side.
 */

const MAX_BODY_CHARS = 4000;

export async function onRequest(context) {
  const { request } = context;

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: { allow: 'POST, OPTIONS', 'cache-control': 'no-store' },
    });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: {
        'content-type': 'application/json',
        allow: 'POST, OPTIONS',
        'cache-control': 'no-store',
      },
    });
  }

  let raw = '';
  try {
    raw = await request.text();
  } catch {
    return new Response(null, { status: 204 });
  }

  // Legacy report-uri wraps the report in { "csp-report": {...} };
  // the modern Reporting API sends a JSON array of { type, body }.
  try {
    const parsed = JSON.parse(raw.slice(0, MAX_BODY_CHARS));
    const entries = Array.isArray(parsed) ? parsed : [parsed];
    for (const entry of entries) {
      const report = entry?.['csp-report'] ?? entry?.body ?? entry;
      if (!report || typeof report !== 'object') continue;
      console.log(
        '[csp-report] directive=%s blocked=%s document=%s',
        report['violated-directive'] || report.effectiveDirective || 'n/a',
        report['blocked-uri'] || (report.blockedURL ?? 'n/a'),
        report['document-uri'] || (report.documentURL ?? 'n/a'),
      );
    }
  } catch {
    // Malformed report — still answer 204 so the browser stops retrying/crying.
  }

  // 204: the browser needs no body, and a 2xx is what keeps the console clean.
  return new Response(null, { status: 204 });
}
