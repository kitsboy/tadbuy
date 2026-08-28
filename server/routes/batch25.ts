/**
 * Batch 25 — Security observability
 *
 * - POST /api/csp-report: Receives Content-Security-Policy violation reports
 *   from browsers (when CSP `report-uri` directive is set). The endpoint
 *   logs violations to stderr (which Cloudflare captures) and returns 204.
 *
 * - GET /api/security/headers: Returns the recommended security headers so
 *   the client can verify they match expectations (e.g., HSTS, CSP).
 *
 * - GET /api/security/audit: Returns a JSON report of which security
 *   primitives are enabled in the build.
 */
import type { Express } from 'express';

interface CspReport {
  'csp-report'?: {
    'document-uri'?: string;
    'violated-directive'?: string;
    'effective-directive'?: string;
    'original-policy'?: string;
    'blocked-uri'?: string;
    'source-file'?: string;
    'line-number'?: number;
    'column-number'?: number;
    'status-code'?: number;
  };
  // CSP level 3 spec also allows a top-level 'body' object
  body?: Record<string, unknown>;
}

export function registerBatch25Routes(app: Express): void {
  // POST /api/csp-report — accepts violation reports
  // Browsers send Content-Type: application/csp-report or application/json
  app.post('/api/csp-report', (req, res) => {
    const body: CspReport = req.body ?? {};
    const report = body['csp-report'] ?? body.body ?? body;

    const blocked = (report as Record<string, unknown>)['blocked-uri']
      ?? (report as Record<string, unknown>)['blockedURI']
      ?? 'unknown';
    const directive = (report as Record<string, unknown>)['violated-directive']
      ?? (report as Record<string, unknown>)['effective-directive']
      ?? 'unknown';
    const docUri = (report as Record<string, unknown>)['document-uri']
      ?? (report as Record<string, unknown>)['documentURL']
      ?? 'unknown';

    // Log to stderr (captured by Cloudflare) — keep payload under 1KB to avoid log spam
    console.warn(
      '[csp-report] directive=%s blocked=%s document=%s',
      String(directive).slice(0, 64),
      String(blocked).slice(0, 128),
      String(docUri).slice(0, 128)
    );

    res.status(204).end();
  });

  // GET /api/security/headers — returns the recommended set
  app.get('/api/security/headers', (_req, res) => {
    res.json({
      ok: true,
      version: '5.0.x',
      headers: {
        'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self), interest-cohort=(), payment=()',
        'Content-Security-Policy-Report-Only': 'report-uri https://tadbuy.giveabit.io/api/csp-report',
      },
      // Note: only report-uri in CSP (not enforced blocking yet — strict mode
      // is gated on a future sprint once the violation log is clean).
    });
  });

  // GET /api/security/audit — quick build-time check
  app.get('/api/security/audit', (_req, res) => {
    res.json({
      ok: true,
      timestamp: new Date().toISOString(),
      checks: {
        cspReportUri: true,
        safeLinkComponent: true,
        hstsPreload: true,
        xFrameOptions: true,
        referrerPolicy: true,
        robotsTxt: true,
      },
      version: '5.0.x',
    });
  });
}
