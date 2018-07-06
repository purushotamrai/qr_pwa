/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

// Names of the two caches used in this version of the service worker.
// Change to v2, etc. when you update any of the local resources, which will
// in turn trigger the install event again.
const PRECACHE = 'precache-v1';
const RUNTIME = 'runtime';

// A list of local resources we always want to be cached.
const PRECACHE_URLS = [
  'index.html',
  './', // Alias for index.html
  "./assets/fonts/roboto/Roboto-Bold.woff",
  "./assets/fonts/roboto/Roboto-Bold.woff2",
  "./assets/fonts/roboto/Roboto-Light.woff",
  "./assets/fonts/roboto/Roboto-Light.woff2",
  "./assets/fonts/roboto/Roboto-Medium.woff",
  "./assets/fonts/roboto/Roboto-Medium.woff2",
  "./assets/fonts/roboto/Roboto-Regular.woff",
  "./assets/fonts/roboto/Roboto-Regular.woff2",
  "./assets/fonts/roboto/Roboto-Thin.woff",
  "./assets/fonts/roboto/Roboto-Thin.woff2",
  "./assets/images/icons/icon-128x128.png",
  "./assets/images/icons/icon-144x144.png",
  "./assets/images/icons/icon-152x152.png",
  "./assets/images/icons/icon-192x192.png",
  "./assets/images/icons/icon-256x256.png",
  "./index.html",
  "./manifest.json",
  "./assets/js/app.js",
  "./assets/js/jquery-3.3.1.js",
  "./assets/js/materialize.js",
  "./service-worker.js",
  "./assets/css/materialize.css",
  "./assets/css/style.css",
  "./library/qrcode/qrcode.min.js",
  "./library/qrcode/jquery.min.js"
];

// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', event => {
  event.waitUntil(
  caches.open(PRECACHE)
    .then(cache => cache.addAll(PRECACHE_URLS))
  .then(self.skipWaiting())
);
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
  const currentCaches = [PRECACHE, RUNTIME];
event.waitUntil(
  caches.keys().then(cacheNames => {
    return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
}).then(cachesToDelete => {
  return Promise.all(cachesToDelete.map(cacheToDelete => {
      return caches.delete(cacheToDelete);
}));
}).then(() => self.clients.claim())
);
});

// The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.
self.addEventListener('fetch', event => {
  // Skip cross-origin requests, like those for Google Analytics.
  if (event.request.url.startsWith(self.location.origin)) {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return caches.open(RUNTIME).then(cache => {
        return fetch(event.request).then(response => {
          // Put a copy of the response in the runtime cache.
          return cache.put(event.request, response.clone()).then(() => {
            return response;
});
});
});
})
);
}
});
