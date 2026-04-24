const CACHE = "biblioteca-v1";

const urlsToCache = [
  "/MiList4D3L3ctu4s/",
  "/MiList4D3L3ctu4s/index.html",
  "/MiList4D3L3ctu4s/assets/js/app.js",
  "/MiList4D3L3ctu4s/assets/css/styles.css"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
