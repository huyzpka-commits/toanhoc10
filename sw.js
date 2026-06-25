const CACHE = 'toan10-hub-v1';
const URLS = [
  './', './index.html', './style.css',
  './manifest.webmanifest',
  './icons/icon-192.svg', './icons/icon-512.svg',
  './daiso/', './daiso/index.html',
  './hinhhoc/', './hinhhoc/index.html',
  './thongke/', './thongke/index.html',
  'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css',
  'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js',
  'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js',
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(URLS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (!e.request.url.startsWith(self.location.origin) && !e.request.url.includes('cdn.jsdelivr.net')) return;
  e.respondWith(
    fetch(e.request).then(r => {
      const c = r.clone();
      caches.open(CACHE).then(cache => cache.put(e.request, c));
      return r;
    }).catch(() => caches.match(e.request))
  );
});
