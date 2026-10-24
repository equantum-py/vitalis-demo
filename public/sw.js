/* Vitalis: instalación PWA. No se almacenan respuestas de páginas ni datos de pacientes. */
const CACHE = "vitalis-assets-v1";
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(["/pwa-icon.svg"])));
  self.skipWaiting();
});
self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith("vitalis-assets-") && key !== CACHE).map((key) => caches.delete(key)))));
  self.clients.claim();
});
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || event.request.mode === "navigate" || new URL(event.request.url).origin !== self.location.origin) return;
  if (!/\.(?:png|jpg|jpeg|webp|svg|ico)$/.test(new URL(event.request.url).pathname)) return;
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
    if (response.ok && response.type === "basic") {
      const copy = response.clone();
      event.waitUntil(caches.open(CACHE).then((cache) => cache.put(event.request, copy)));
    }
    return response;
  })));
});
