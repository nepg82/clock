const CACHE_NAME = 'clock-pwa-v1.0.1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './font/dseg14classic_italic.ttf',
  './app-icons/app-icon-192.png',
  './app-icons/app-icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // addAll would fail entirely if any single asset is missing
      // (e.g. before you've dropped your font/icons in), so cache
      // what we can individually instead.
      return Promise.all(
        ASSETS.map((url) =>
          cache.add(url).catch(() => {})
        )
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request).then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        }).catch(() => cached)
      );
    })
  );
});
