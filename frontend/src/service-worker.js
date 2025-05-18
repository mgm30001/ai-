/* eslint-disable no-restricted-globals */

// u8fd9u4e2au670du52a1u5de5u4f5cu8005u53efu4ee5u901au8fc7Workboxu6216u81eau5b9au4e49u8bbeu7f6eu8fdbu884cu6269u5c55
// u6709u5173u8be6u7ec6u4fe1u606fuff0cu8bf7u53c2u9605 https://developers.google.com/web/tools/workbox

import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst, NetworkFirst } from 'workbox-strategies';

clientsClaim();

// u9884u7f13u5b58u6240u6709u8d44u6e90uff0cu5305u62ecu5e94u7528u7a0bu5e8fu7684shell
// u4ee5u53cau5df2u9664u53bbu67e5u8be2u5b57u7b26u4e32u7684u521du59cbu7f51u5740
// u5b83u4ececworkbox-webpack-pluginu751fu6210u6587u4ef6u6e05u5355
precacheAndRoute(self.__WB_MANIFEST);

// u8bbfu95eeu6307u5411/u7684u7f51u5740u8defu5f84u65f6u8bbeu7f6eu53d1u5e03u8ba2u9605u7684u5904u7406u7a0bu5e8f
const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
registerRoute(
  // u8fd4u56deu5e94u8be5u4e0du4e0eu6ca1u6709u6269u5c55u540du7684URLu5339u914d
  // u6240u4ee5u4f1au88abulrlu7684u4e00u90e8u5206u5f53u505au6587u4ef6u6269u5c55u540du5904u7406
  ({ request, url }) => {
    if (request.mode !== 'navigate') {
      return false;
    }

    if (url.pathname.startsWith('/_')) {
      return false;
    }

    if (url.pathname.match(fileExtensionRegexp)) {
      return false;
    }

    return true;
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html')
);

// u6307u5b9au7f13u5b58u7b56u7565u7684u9759u6001u8d44u6e90
// u56feu50cfu7f13u5b58
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 u5929
      }),
    ],
  })
);

// JavaScriptu548cCSSu4f7fu7528StaleWhileRevalidateu7b56u7565
registerRoute(
  ({ request }) =>
    request.destination === 'script' ||
    request.destination === 'style',
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
  })
);

// APIu8bf7u6c42u4f7fu7528NetworkFirstu7b56u7565
registerRoute(
  ({ url }) => url.origin === self.location.origin && url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'apis',
    networkTimeoutSeconds: 10,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60, // 5 u5206u949f
      }),
    ],
  })
);

// u5728u670du52a1u5de5u4f5cu7a0bu5e8fu4e2du8bbeu7f6eu5176u4ed6u8defu7531
// u5f53u6ca1u6709u533au56feu65f6u5febu901fu4eceu7f13u5b58u52a0u8f7d
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(workbox.precaching.getCacheKeyForURL('/index.html'));
      })
    );
  }
});

// u5f53u65b0u670du52a1u5de5u4f5cu8005u5b89u88c5u65f6u5c06u6fc0u6d3bu5b83u5e76u8ba9u5b83u63a7u5236
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});