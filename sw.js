// Service worker: cache app shell saja. Tidak pernah menyentuh /admin, /api, atau Supabase.
const C = 'gh-shell-v1', SHELL = ['/', '/offline.html', '/manifest.json', '/icon-192.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin || u.pathname.startsWith('/api') || u.pathname.startsWith('/admin')) return;
  if (e.request.mode === 'navigate') { e.respondWith(fetch(e.request).catch(() => caches.match('/offline.html'))); return; }
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});

