/**
 * Tadbuy — Cloudflare Pages SPA fallback with REAL 404 for unknown routes,
 * plus prerendered static HTML for search/AI crawlers (no JS execution).
 */
const SKIP_PREFIXES = ['/assets/', '/api/', '/.well-known/']

const CRAWLER_RE =
  /(googlebot|bingbot|yandex|baiduspider|duckduckbot|slurp|gptbot|claude|anthropic|perplexity|chatgpt|applebot|semrushbot|ahrefsbot|mj12bot|bytespider|ccbot|facebookexternalhit|twitterbot|linkedinbot)/i

// Known client routes (BrowserRouter). Keep in sync with src/App + sitemap.
const KNOWN_ROUTES = [
  /^\/$/,
  /^\/marketplace\/?$/,
  /^\/publisher\/?$/,
  /^\/hubhash\/?$/,
  /^\/metrics\/?$/,
  /^\/geo\/?$/,
  /^\/docs\/?$/,
  /^\/api-docs\/?$/,
  /^\/ppq\/?$/,
  /^\/bolt12\/?$/,
  /^\/beta\/?$/,
  /^\/health\/?$/,
  /^\/changelog\/?$/,
  /^\/platforms\/?$/,
  /^\/platforms\/[^/]+\/?$/,
  /^\/analytics\/?$/,
  /^\/buy\/?$/,
  /^\/campaigns\/?$/,
  /^\/case-studies\/?$/,
  /^\/compare\/?$/,
  /^\/cookies\/?$/,
  /^\/dashboard\/?$/,
  /^\/debug-lightning\/?$/,
  /^\/embed\/[^/]+\/[^/]+\/?$/,
  /^\/enterprise\/?$/,
  /^\/integrations\/?$/,
  /^\/intelligence\/?$/,
  /^\/pitch\/?$/,
  /^\/privacy\/?$/,
  /^\/profile\/?$/,
  /^\/settings\/?$/,
  /^\/settlements\/?$/,
  /^\/start\/?$/,
  /^\/terms\/?$/,
  /^\/wallet\/?$/,
  /^\/home\/?$/,
  /^\/advertise\/?$/,
  /^\/buy-ads\/?$/,
  /^\/thank-you\/?$/, /^\/thanks\/?$/, /^\/thankyou\/?$/, /^\/success\/?$/,
]

function isKnownRoute(pathname) {
  return KNOWN_ROUTES.some((re) => re.test(pathname))
}

function isPageRequest(pathname) {
  if (SKIP_PREFIXES.some((p) => pathname.startsWith(p))) return false
  if (/\.[a-zA-Z0-9]+$/.test(pathname)) return false
  return true
}

const NOT_FOUND_HTML = `<!doctype html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>404 — Page not found · Tadbuy</title>
<style>html,body{margin:0;height:100%;background:#120d0d;color:#f2e9e9;font-family:system-ui,-apple-system,"Segoe UI",sans-serif}
.wrap{min-height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.5rem;text-align:center;padding:2rem}
.code{font-size:5rem;font-weight:800;color:#e25555;line-height:1}h1{font-size:1.4rem;margin:0}
p{color:#b69c9c;margin:0}a{color:#e25555}</style></head><body>
<div class="wrap"><div class="code">404</div><h1>Page not found</h1>
<p>That address doesn't exist on Tadbuy.</p>
<p><a href="/">← Back to Tadbuy</a></p></div></body></html>`

export async function onRequest(context) {
  const { request, env, next } = context
  const url = new URL(request.url)
  const ua = request.headers.get('user-agent') || ''

  // Serve prerendered landing to crawlers on the root
  if (request.method === 'GET' && (url.pathname === '/' || url.pathname === '') && CRAWLER_RE.test(ua)) {
    const html = await env.ASSETS.fetch(`${url.origin}/prerender/landing.html`)
    if (html.ok) {
      return new Response(html.body, {
        headers: { 'content-type': 'text/html; charset=utf-8', 'x-robots-tag': 'index, follow', 'cache-control': 'public, max-age=3600' }
      })
    }
  }

  if (request.method !== 'GET') return next()
  const { pathname } = new URL(request.url)

  // Static files / assets / APIs pass through untouched.
  if (!isPageRequest(pathname)) return next()

  // Unknown client route → real 404, never the SPA shell.
  if (!isKnownRoute(pathname)) {
    return new Response(NOT_FOUND_HTML, {
      status: 404,
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'x-robots-tag': 'noindex',
        'cache-control': 'public, max-age=300'
      }
    })
  }

  // Known route → let _redirects serve the SPA shell (index.html).
  return next()
}
