// Service worker — pass-through with error handling
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Only intercept same-origin GET requests; let everything else pass natively
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    fetch(event.request).catch(() => {
      // On network failure, return a minimal offline response
      return new Response('', { status: 503, statusText: 'Offline' });
    })
  );
});
