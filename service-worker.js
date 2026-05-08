const CACHE = "app-final-v5";

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then(cache => {
      return cache.addAll([
        "/MiList4D3L3ctu4s/",
        "/MiList4D3L3ctu4s/index.html",
        "/MiList4D3L3ctu4s/assets/js/app.js",
        "/MiList4D3L3ctu4s/assets/css/styles.css"
      ]);
    })
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(res => {
      return res || fetch(event.request).catch(() => {
        return caches.match("/MiList4D3L3ctu4s/index.html");
      });
    })
  );
});