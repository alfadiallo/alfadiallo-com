/* Service worker for /teleprompter, so the home-screen app opens without a
   connection. Registered by teleprompter.html with scope /teleprompter: it never
   sees any other page of the site.

   - The page is fetched from the network first, every time, so the PIN gate
     (middleware.js) still decides who gets it. Only a real 200 copy of the page
     is kept; the PIN screen (401) is never stored.
   - Without a connection, the last copy is served instead.
   - Nothing else is stored: not the Google Sheet, not the Apps Script replies,
     not PeerJS. The last scripts live in the page's own localStorage.

   Change VERSION to throw the old copy away. */

var VERSION = 'prompter-v1';
var PAGE = '/teleprompter';

function keep(res) {
  return res && res.status === 200 && res.type === 'basic' && !res.redirected;
}

self.addEventListener('install', function (event) {
  event.waitUntil(
    // Same-origin fetches carry the unlock cookie; if the device isn't
    // unlocked yet this simply stores nothing.
    fetch(PAGE, { cache: 'no-store', credentials: 'same-origin' }).then(function (res) {
      if (keep(res)) return caches.open(VERSION).then(function (c) { return c.put(PAGE, res); });
    }).catch(function () {}).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (names) {
      return Promise.all(names.filter(function (n) { return n.indexOf('prompter-') === 0 && n !== VERSION; })
        .map(function (n) { return caches.delete(n); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (event) {
  var req = event.request;
  if (req.method !== 'GET' || req.mode !== 'navigate') return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  var path = url.pathname.replace(/\.html$/, '');
  if (path !== PAGE) return;

  event.respondWith(
    fetch(req).then(function (res) {
      if (keep(res)) {
        var copy = res.clone();
        caches.open(VERSION).then(function (c) { return c.put(PAGE, copy); });
      }
      return res;
    }, function () {
      return caches.open(VERSION).then(function (c) { return c.match(PAGE); }).then(function (hit) {
        return hit || new Response(
          '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
          '<title>Prompter</title><body style="margin:0;display:grid;place-items:center;height:100vh;background:#000;color:#ecebe6;font:17px system-ui">' +
          '<p style="max-width:280px;text-align:center;line-height:1.45">No connection, and no saved copy of the teleprompter yet. Open it once while online.</p>',
          { status: 503, headers: { 'content-type': 'text/html; charset=utf-8' } }
        );
      });
    })
  );
});
