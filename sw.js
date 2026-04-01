const CACHE = "agroapp-v1.24";
const SCOPE_URL = new URL(self.registration.scope);
const ASSETS = [
  new URL("./", SCOPE_URL).toString(),
  new URL("./index.html", SCOPE_URL).toString(),
  new URL("./psm_data.js", SCOPE_URL).toString(),
  new URL("./manifest.json", SCOPE_URL).toString(),
  new URL("./icon-192.png", SCOPE_URL).toString(),
  new URL("./icon-512.png", SCOPE_URL).toString(),
  new URL("./sw.js", SCOPE_URL).toString(),
  "https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  e.respondWith((async () => {
    const cached = await caches.match(e.request);
    if (cached) return cached;

    try {
      const response = await fetch(e.request);
      if (e.request.method === "GET" && response.ok && e.request.url.startsWith(self.location.origin)) {
        const cache = await caches.open(CACHE);
        cache.put(e.request, response.clone());
      }
      return response;
    } catch {
      if (e.request.mode === "navigate") {
        return caches.match(new URL("./index.html", SCOPE_URL).toString());
      }
      throw new Error("Network request failed");
    }
  })());
});
