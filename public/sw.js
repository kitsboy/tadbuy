const CACHE_NAME = 'tadbuy-v5.0.19';
const PRECACHE = ['/', '/favicon.png', '/favicon.svg', '/manifest.json', '/og-image.svg'];

function expectedContentType(pathname) {
  if (pathname.endsWith('.js')) return 'javascript';
  if (pathname.endsWith('.css')) return 'css';
  if (pathname.endsWith('.woff2')) return 'font';
  if (pathname.endsWith('.svg')) return 'svg';
  if (pathname.endsWith('.png') || pathname.endsWith('.ico')) return 'image';
  return null;
}

function isCacheableAsset(response, pathname) {
  if (!response || !response.ok) return false;
  const expected = expectedContentType(pathname);
  if (!expected) return false;
  const contentType = (response.headers.get('content-type') || '').toLowerCase();
  // Never cache SPA fallback HTML served for missing /assets/* (breaks the whole app).
  if (contentType.includes('text/html')) return false;
  return contentType.includes(expected);
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname.startsWith('/assets/') || url.pathname.match(/\.(woff2|png|svg|ico)$/)) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) {
          const cachedType = (cached.headers.get('content-type') || '').toLowerCase();
          if (!cachedType.includes('text/html')) return cached;
        }
        return fetch(event.request).then((response) => {
          if (isCacheableAsset(response, url.pathname)) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/'))
    );
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request).then((cached) => cached || caches.match('/'))
    )
  );
});