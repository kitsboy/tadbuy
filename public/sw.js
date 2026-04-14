self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
});

self.addEventListener('fetch', (event) => {
  // Simple pass-through
  event.respondWith(fetch(event.request));
});
