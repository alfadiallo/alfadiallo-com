/* ==========================================================================
   PIN gate for /teleprompter.

   Vercel runs this before it serves the page (Routing Middleware), so the
   check happens on the server: a visitor without the PIN never receives
   teleprompter.html at all.

   Nothing secret lives in this file. The PIN and the key used to sign the
   "this device is unlocked" cookie are Vercel environment variables:

     TELEPROMPTER_PIN      the PIN people type
     TELEPROMPTER_SECRET   a long random string; never typed by anyone

   To change the PIN: `vercel env rm TELEPROMPTER_PIN production`, add the new
   one with `vercel env add TELEPROMPTER_PIN production --sensitive`, then
   redeploy. Every device is asked for the new PIN, because the cookie is
   derived from it.

   If either variable is missing the page stays locked (it fails closed).
   ========================================================================== */

export const config = {
  runtime: 'nodejs',
  // Two patterns on purpose. The first is the page itself. The second catches
  // any percent-encoded path, because /%74eleprompter is served as the same
  // file; those are decoded and checked below, and everything else passes.
  matcher: ['/(teleprompter.*)', '/(.*%.*)'],
};

const COOKIE = 'tp_auth';
const ONE_YEAR = 60 * 60 * 24 * 365;
const WRONG_PIN_DELAY_MS = 1200;
const encoder = new TextEncoder();

/* Tells Vercel to carry on and serve the static file. This is what the
   next() helper in @vercel/functions returns; written out by hand so the site
   keeps having no dependencies. */
function carryOn() {
  return new Response(null, { headers: { 'x-middleware-next': '1' } });
}

function isTeleprompter(pathname) {
  let path = pathname;
  for (let i = 0; i < 3; i++) {
    try {
      const decoded = decodeURIComponent(path);
      if (decoded === path) break;
      path = decoded;
    } catch (e) { break; }
  }
  return path.toLowerCase().includes('teleprompter');
}

async function tokenFor(pin, secret) {
  const key = await crypto.subtle.importKey(
    'raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode('tp-auth-v1:' + pin));
  return Array.from(new Uint8Array(sig), function (b) { return b.toString(16).padStart(2, '0'); }).join('');
}

/* Compares without stopping at the first difference, so timing says nothing. */
function sameText(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function readCookie(request, name) {
  const header = request.headers.get('cookie') || '';
  const parts = header.split(';');
  for (let i = 0; i < parts.length; i++) {
    const eq = parts[i].indexOf('=');
    if (eq > -1 && parts[i].slice(0, eq).trim() === name) return parts[i].slice(eq + 1).trim();
  }
  return '';
}

function wait(ms) { return new Promise(function (resolve) { setTimeout(resolve, ms); }); }

function page(status, opts) {
  const message = opts.message || '';
  const form = opts.locked ? '' : `
    <form method="post" action="/teleprompter" autocomplete="off">
      <label for="pin">Enter the PIN</label>
      <input id="pin" name="pin" type="password" inputmode="numeric" pattern="[0-9]*"
             maxlength="64" autocomplete="off" autofocus required
             aria-describedby="msg">
      <button type="submit" id="go">Unlock</button>
    </form>`;
  /* The PIN travels in a request header, which every layer in front of this
     code passes through untouched. Without JavaScript the form still posts
     normally and the body is read instead. */
  const script = opts.locked ? '' : `
<script>
(function () {
  var form = document.querySelector('form'), pin = document.getElementById('pin');
  var msg = document.getElementById('msg'), go = document.getElementById('go');
  if (!form || !window.fetch) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!pin.value || go.disabled) return;
    go.disabled = true; msg.textContent = '';
    fetch('/teleprompter', {
      method: 'POST', credentials: 'same-origin', cache: 'no-store',
      headers: { 'x-tp-pin': encodeURIComponent(pin.value) }
    }).then(function (res) {
      // Back to the same address, so the home-screen app keeps its ?view=remote.
      if (res.ok) { location.replace(location.pathname + location.search); return; }
      go.disabled = false; pin.value = ''; pin.focus();
      msg.textContent = res.status === 401
        ? 'That PIN did not match. Try again.'
        : 'Something went wrong. Try again in a moment.';
    }, function () {
      go.disabled = false;
      msg.textContent = 'No connection. Try again in a moment.';
    });
  });
})();
</script>`;
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Teleprompter &middot; Locked</title>
<meta name="robots" content="noindex, nofollow">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Prompter">
<meta name="theme-color" content="#000000">
<style>
*, *::before, *::after { box-sizing: border-box; }
html, body { height: 100%; }
body {
  margin: 0; padding: 24px 16px;
  display: grid; place-items: center;
  background: #000; color: #ecebe6;
  font-family: "Space Grotesk", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%;
}
main {
  width: 100%; max-width: 340px;
  padding: 28px 24px;
  background: #15181d; border: 1px solid rgba(255,255,255,.14); border-radius: 18px;
}
h1 { margin: 0 0 4px; font-size: 22px; font-weight: 700; letter-spacing: -.01em; }
p { margin: 0 0 22px; color: #a3a5ac; font-size: 15px; line-height: 1.45; }
label { display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; }
input {
  display: block; width: 100%; height: 56px; padding: 0 14px;
  background: #23272f; color: #fff;
  border: 1px solid rgba(255,255,255,.14); border-radius: 12px;
  font: inherit; font-size: 26px; letter-spacing: .35em; text-align: center;
}
input:focus-visible, button:focus-visible { outline: 2px solid #74eac0; outline-offset: 2px; }
button {
  display: block; width: 100%; height: 52px; margin-top: 14px;
  background: #74eac0; color: #0b0d10;
  border: 0; border-radius: 12px;
  font: inherit; font-size: 17px; font-weight: 700; cursor: pointer;
}
#msg { min-height: 20px; margin: 14px 0 0; color: #ffb4a2; font-size: 14px; text-align: center; }
form + #msg:empty { display: none; }
</style>
</head>
<body>
<main>
  <h1>Teleprompter</h1>
  <p>${opts.locked ? 'This page is locked.' : 'This page is private. You only need to do this once on each device.'}</p>${form}
  <p id="msg" role="alert">${message}</p>
</main>${script}
</body>
</html>`;
  return new Response(html, {
    status: status,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
      'x-robots-tag': 'noindex, nofollow',
    },
  });
}

export default async function middleware(request) {
  const url = new URL(request.url);
  if (!isTeleprompter(url.pathname)) return carryOn();

  const pin = (process.env.TELEPROMPTER_PIN || '').trim();
  const secret = (process.env.TELEPROMPTER_SECRET || '').trim();
  if (!pin || !secret) {
    return page(503, { locked: true, message: 'The PIN for this page has not been set up yet.' });
  }

  const expected = await tokenFor(pin, secret);

  if (request.method === 'POST') {
    // The PIN page sends the PIN in a header (see the script in page()); a
    // plain form post, with JavaScript off, sends it in the body instead.
    const viaHeader = request.headers.has('x-tp-pin');
    let typed = '';
    if (viaHeader) {
      try { typed = decodeURIComponent(request.headers.get('x-tp-pin') || ''); } catch (e) { typed = ''; }
    } else {
      try {
        const body = await request.formData();
        typed = String(body.get('pin') || '');
      } catch (e) { /* not a form post: treated as a wrong PIN below */ }
    }
    typed = typed.trim().slice(0, 64);

    if (typed && sameText(await tokenFor(typed, secret), expected)) {
      const headers = {
        'cache-control': 'no-store',
        'set-cookie': COOKIE + '=' + expected + '; Path=/; Max-Age=' + ONE_YEAR + '; HttpOnly; Secure; SameSite=Lax',
      };
      if (viaHeader) return new Response(null, { status: 204, headers: headers });
      headers.location = '/teleprompter';
      return new Response(null, { status: 303, headers: headers });
    }
    await wait(WRONG_PIN_DELAY_MS);   // slows down guessing a little
    if (viaHeader) return new Response(null, { status: 401, headers: { 'cache-control': 'no-store' } });
    return page(401, { message: 'That PIN did not match. Try again.' });
  }

  if (sameText(readCookie(request, COOKIE), expected)) return carryOn();
  return page(401, {});
}
