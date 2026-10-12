// Behdoon PWA Service Worker (v1.0.0)
const CACHE_NAME = 'behdoon-pwa-v1.0.0';
const OFFLINE_FALLBACK_URL = '/offline.html';

const PRECACHE_ASSETS = [
  '/',
  '/offline.html',
  '/site.webmanifest',
  '/favicon.svg',
  '/favicon.png',
  '/behdoon_logo.png',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-maskable-192.png',
  '/icon-maskable-512.png',
  '/apple-touch-icon.png'
];

// Install: pre-cache critical shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate: delete legacy caches and claim active clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Clearing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Strategy
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // 1. Only process GET requests from same origin
  if (req.method !== 'GET') return;

  // 2. Do not cache API endpoints (sensitive data, live orders, auth)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(req));
    return;
  }

  // 3. HTML Navigation requests (Pages): Network-First with Cache / Offline fallback
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const resClone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return networkRes;
        })
        .catch(async () => {
          const cachedRes = await caches.match(req);
          if (cachedRes) return cachedRes;
          const fallback = await caches.match(OFFLINE_FALLBACK_URL);
          return fallback || Response.error();
        })
    );
    return;
  }

  // 4. Static Assets (JS, CSS, Fonts, Images): Cache-First with Network fallback & cache update
  if (
    url.pathname.match(/\.(woff2?|ttf|eot|css|js|png|jpe?g|svg|webp|ico)$/i) ||
    url.pathname.startsWith('/assets/') ||
    url.pathname.startsWith('/illustrations/')
  ) {
    event.respondWith(
      caches.match(req).then((cachedRes) => {
        if (cachedRes) return cachedRes;

        return fetch(req)
          .then((networkRes) => {
            if (networkRes && networkRes.status === 200) {
              const resClone = networkRes.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
            }
            return networkRes;
          })
          .catch(() => {
            // Return empty or fallback image if needed
            return caches.match('/favicon.svg');
          });
      })
    );
    return;
  }

  // Default: Network with Cache fallback
  event.respondWith(
    fetch(req).catch(() => caches.match(req))
  );
});

// Message listener for manual update triggers
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
