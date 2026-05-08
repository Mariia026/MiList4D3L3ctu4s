const CACHE = "mi-biblioteca-v4";

self.addEventListener("install", event => {
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
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(res => {
      return res || fetch(event.request);
    })
  );
});