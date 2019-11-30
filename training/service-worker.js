/**
 * Service Worker
 */

const _version = 'v5';
const cacheName = 'v2';
const cacheList = [
  '/',
  '/manifest.json',
  '/scripts/app.js',
  '/styles/index.css',
  '/images/1.jpg',
  '/images/2.jpg',
  '/images/3.jpg',
  '/images/4.jpg',
  '/images/5.jpg'
]

const log = msg => {
  console.log(`[ServiceWorker ${_version}] ${msg}`);
}

self.addEventListener('install', event => {
  self.skipWaiting();
  log('INSTALL');
  caches.open(cacheName).then(cache => {
    log('Caching app shell');
    return cache.addAll(cacheList);
  })
});
self.addEventListener('activate', event => {
  log('Activate');
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (key != cacheName) {
          log('Removing old cache ' + key);
          return caches.delete(key);
        }
      }));
    })
  );
});
self.addEventListener('fetch', event => {
  log('Fetch', + event.request.url);
  // if (event.request.url.indexOf('.jpg') != -1) {
  //   event.respondWith(fetch('/images/2.jpg'))
  // }
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  )
});
