const CACHE = "buuba-shell-v1";
const ARCHIVOS_SHELL = ["./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", (evento) => {
  evento.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ARCHIVOS_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches.keys().then((claves) =>
      Promise.all(claves.filter((clave) => clave !== CACHE).map((clave) => caches.delete(clave)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (evento) => {
  const url = new URL(evento.request.url);
  if (url.origin !== self.location.origin) return; // nunca cachear datos de Supabase

  evento.respondWith(
    caches.match(evento.request).then((respuestaCache) => respuestaCache || fetch(evento.request))
  );
});
