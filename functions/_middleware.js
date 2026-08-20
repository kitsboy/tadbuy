/**
 * Tadbuy CF Pages middleware — serve prerendered static HTML to search & AI
 * crawlers so they see real content without executing JS. Humans keep the SPA.
 */
const CRAWLER_RE =
  /(googlebot|bingbot|yandex|baiduspider|duckduckbot|slurp|gptbot|claude|anthropic|perplexity|chatgpt|applebot|semrushbot|ahrefsbot|mj12bot|bytespider|ccbot|facebookexternalhit|twitterbot|linkedinbot)/i

export async function onRequest({ request, env, next }) {
  const url = new URL(request.url)
  const ua = request.headers.get('user-agent') || ''

  if (request.method === 'GET' && (url.pathname === '/' || url.pathname === '') && CRAWLER_RE.test(ua)) {
    const html = await env.ASSETS.fetch(`${url.origin}/prerender/landing.html`)
    if (html.ok) {
      return new Response(html.body, {
        headers: { 'content-type': 'text/html; charset=utf-8', 'x-robots-tag': 'index, follow', 'cache-control': 'public, max-age=3600' }
      })
    }
  }
  return next()
}
