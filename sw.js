const CACHE_NAME = 'lmd-calc-v3';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',
  './icon_maskable.png',
  './knight_flowers_wind_loop.mp4',
  './guide.jpg',
  './reelsvideo.io_1781973559904.mp3',
  './reelsvideo.io_1781978267153.mp3',
  './reelsvideo.io_1781973704823.mp3',
  './reelsvideo.io_1781980214150.mp3'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    Promise.all([
      caches.keys().then((keys) => {
        return Promise.all(
          keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
        );
      }),
      self.clients.claim()
    ])
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then((res) => {
      return res || fetch(e.request);
    })
  );
});
