const CACHE_NAME = "quantumverse-cache-v1";
const PRECACHE_URLS = [
  "/",
  "/index.html",
];

// Install Event - Precache foundational shells
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Quantum SW] Pre-caching core laboratory systems...");
      return cache.addAll(PRECACHE_URLS);
    })
  );
});

// Activate Event - Clean up older caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log("[Quantum SW] Purging deprecated core cache:", name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Resilient loading with Network-First / Stale-While-Revalidate
self.addEventListener("fetch", (event) => {
  // Only handle GET requests
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Skip browser extensions or developer servers not on our origin (except standard CDNs)
  if (url.origin !== self.location.origin && !url.hostname.includes("fonts.googleapis.com") && !url.hostname.includes("fonts.gstatic.com")) {
    return;
  }

  // Handle caching strategies
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        // If we have a cached response, we can return it and fetch a fresh copy in background (Stale-While-Revalidate)
        // Or if it's an audio file/font, return cache immediately (Cache-First)
        const isAudio = url.pathname.endsWith(".mp3") || url.pathname.endsWith(".wav");
        const isFont = url.hostname.includes("fonts.gstatic.com") || url.hostname.includes("fonts.googleapis.com");

        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            // Cache valid responses
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch((err) => {
            console.warn("[Quantum SW] Network offline. Serving from cache shield:", url.pathname);
            if (cachedResponse) {
              return cachedResponse;
            }
            // If both fail and it's a page request, return index.html fallback
            if (event.request.mode === "navigate") {
              return cache.match("/");
            }
            throw err;
          });

        if (isAudio || isFont) {
          // Cache-First for static assets to maximize loading speed
          return cachedResponse || fetchPromise;
        }

        // Stale-While-Revalidate for JS/CSS and main shell documents to keep them highly fresh
        return cachedResponse ? (
          // Return the cached copy immediately, but let the fetch complete in background to update cache
          (fetchPromise.catch(() => {}), cachedResponse)
        ) : fetchPromise;
      });
    })
  );
});

// Communication with client
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "PING_SW") {
    event.ports[0].postMessage({
      type: "PONG_SW",
      status: "coherent",
      cacheSize: CACHE_NAME
    });
  }
});
