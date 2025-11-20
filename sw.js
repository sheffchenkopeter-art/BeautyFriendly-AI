
const CACHE_NAME = 'beauty-friendly-v2';

// Only cache the shell. Do NOT cache .tsx/.ts files explicitly here, 
// as they might not exist in the production build (Vite bundles them).
// Let runtime caching handle the actual assets.
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install SW
self.addEventListener('install', (event) => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()) // Force activation
  );
});

// Activate and clean old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Take control immediately
  );
});

// Fetch Strategy: Network First, falling back to Cache
// This is safer for updates and fixes the "white screen" if deployment changes
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests (like Google Fonts or CDN scripts) from strict caching logic if needed,
  // or handle them. Here we handle everything.
  
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        caches.open(CACHE_NAME)
          .then((cache) => {
            // Cache dynamic requests (runtime caching)
            // Only cache http/https requests (skip chrome-extension:// etc)
            if (event.request.url.startsWith('http')) {
                cache.put(event.request, responseToCache);
            }
          });

        return response;
      })
      .catch(() => {
        // If network fails, try cache
        return caches.match(event.request);
      })
  );
});
