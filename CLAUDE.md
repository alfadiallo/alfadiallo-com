# CLAUDE.md — www.alfadiallo.com

Personal site for Alfa O. Diallo, MD, MPH, FACEP. Static HTML, no build step, no
dependencies. Deployed on Vercel with `cleanUrls` (every page is served without
`.html`). README.md covers structure and one-time setup; this file is the
operating contract for making changes.

## Page inventory

| URL | File | Listed? |
|---|---|---|
| `/` | `index.html` | Public — the only page in `sitemap.xml` |
| `/projects` | `projects.html` | Unlisted index of the venture pages |
| `/my-shift-report` | `my-shift-report.html` | Unlisted |
| `/virtualsim` | `virtualsim.html` | Unlisted |
| `/elevate` | `elevate.html` | Unlisted |
| `/ed-operations-data-models` | `ed-operations-data-models.html` | Unlisted |
| `/smile-again` | `smile-again.html` | Unlisted |
| `/epi-quotient` | `epi-quotient.html` | Unlisted |
| `/missioncontrol` | `missioncontrol.html` | Unlisted |
| `/links` | `links.html` | Unlisted (`noindex, follow`) — link-in-bio page; edit the `<ul class="l-list">` to change links |
| `/progress` | `progress.html` | Unlisted, generated — see README |
| `/teleprompter` | `teleprompter.html` | Unlisted (`noindex, nofollow`) **and behind a PIN** — a personal tool, not a content page; see below |

**Unlisted means noindex, not private.** Unlisted pages carry
`<meta name="robots" content="noindex">` (or `noindex, nofollow`), are excluded
from `sitemap.xml`, and are never linked from `index.html`. Anyone with the URL
can open them — nothing confidential goes on them. When adding a page, keep all
three properties true; never "helpfully" add an unlisted page to the sitemap.

## Venture pages: the overview convention

Every venture page follows the same shape (added July 2026, all six pages filled):

- **Lede** in `.v-head` — one sentence, plain English.
- **Prose** in `.v-prose` under three headings: the problem (or "Why it exists"),
  what it does / what it is, and **Where it stands** — which always ends with an
  access link styled as `<a class="social">` with the external-link SVG icon.
- **Facts panel** `.v-facts` — Role / Founded / Focus / Status, plus a link row
  (Platform / Site / Website / Example) pointing to the live product.
- Wrapper is `class="v-grid"` (the `--solo` variant is only for pages with an
  empty prose column; none remain).

**Voice: written for a non-technical reader.** No stack names, no jargon,
no acronyms without translation. Institution and program names stay off the
public pages ("a large hospital system", "an emergency medicine residency
program"). Numbers only when they're defensible from project docs.

Live product links (the access points, current as of Aug 2026):

| Page | Links to |
|---|---|
| My Shift Report | https://showcase.myshiftreport.com |
| Elevate | https://www.lev8.ai |
| EPI Quotient | https://www.epiquotient.com |
| VirtualSim | https://www.virtualsim.ai |
| Smile Again | https://www.smileagainmovement.org |
| ED Operations Data Models | https://app.flow.gl/flow/kkurcc (interactive LBCC model) |

Source material for this copy lives in `~/Projects/<project folder>` (CLAUDE.md /
PRD / guidance docs per project). When a project's status changes, update its
page's "Where it stands" section — don't let the pages rot.

## /missioncontrol is a copy, not a source

`missioncontrol.html` is the ED Mission Control mock, whose source of truth is
`~/Projects/EM Informatics and Analytics/Operations/Mission Control/mock/index.html`.
To update: edit the mock in its own project, then copy it here and re-add the
site-specific `<meta name="robots" content="noindex">` (and any meta/title
adjustments). Never edit `missioncontrol.html` directly — changes will be lost on
the next sync.

## /teleprompter is a self-contained app

`teleprompter.html` is a single file with its own inline CSS and JS — it does
not load `styles.css` and has no theme toggle (its own "Invert colors" setting
replaces it). Things to keep true when changing it:

- **Scripts come from a Google Sheet** (row 1 `Title | Script`, one script per
  row) that is shared "Anyone with the link". The sheet link and the last
  loaded copy of the scripts live in the device's `localStorage` (`tp.*` keys),
  never in the page source — so nothing about the scripts is published here.
- It reads the sheet with a plain browser `fetch` of Google's CSV export
  (`/export?format=csv`, falling back to `/gviz/tq?tqx=out:csv`). No API key,
  no server. Both were confirmed to allow cross-origin reads in Nov 2026.
- **Or from the Web & Social Tracker, read and write** (added Nov 16). The
  "Scripts link" field also takes an Apps Script web-app link (`…/exec`),
  plus an "Edit token" (`tp.token`). That web app is
  `prompter-bridge.gs`, kept in the vault next to the Tracker's docs
  (`~/Projects/_Operations/_knowledge-base/20 Content/Playbook/Web & Social Tracker/`),
  not in this repo. It returns scripts as `{id, version, title, chunks:[{row,
  chunk, name, text}]}` and saves one chunk at a time with a `text/plain`
  POST (no CORS preflight). Tracker scripts render chunk by chunk (`p[data-c]`),
  so the pencil edits the chunk at the reading line. A save names the
  row, ID, version, chunk and old text; the Sheet refuses it if any changed.
  The Sheet's text is then shown, with "Save mine over it" / "Use the Sheet's
  text". After a save a joined phone sends `refresh`; the host reloads and keeps
  its place (`anchorAt` / `restoreAnchor`). The host also re-reads the Tracker
  every 30 s while paused and on screen. **Text never changes while rolling:**
  an update that arrives mid-read is held (`pendingApply`) until the next pause.
  The token is never in the page or the repo, and never sent over the link; the
  Tracker link is (`u` in the list message), so a phone only types the token.
- **Installable app ("Prompter").** `prompter.webmanifest`,
  `prompter-icon-{180,192,512}.png` and `prompter-sw.js` are named `prompter-*`
  on purpose: the PIN middleware only guards `teleprompter*`, so they load
  without the cookie (they hold nothing private). `start_url` is
  `/teleprompter?view=remote`; on a device with nothing set up, that opens
  Settings at "Join with a code". The service worker's scope is `/teleprompter`
  only. It fetches the page from the network first, so the PIN gate still
  decides, and keeps only a real 200 copy (never the PIN screen) for opening
  offline. It never stores Sheet, Apps Script or PeerJS responses. Bump
  `VERSION` in it to drop the old copy. `vercel.json` sends the worker and
  manifest with `max-age=0` and `X-Robots-Tag: noindex`.
- **Phone remote ("pad").** A phone held upright that has joined another device
  (`remote()`, width < 600, portrait) gets `html.pad`. The script shows on top,
  with a big control pad below: time, back / play / forward, speed, text
  size. A guest that was joined rejoins its last code on every open
  (`tp.link.guest`); Disconnect clears that.
- Two layers: `#stage` (script, reading line, timer, countdown) is what
  Mirror/Flip transform; `.chrome` (the controls) is never mirrored.
- Speed is words per minute, converted through each script's own
  pixels-per-word, so the time-left estimate is exact and text size doesn't
  change the pace.
- **Two-device link (phone remote).** One device turns on "Share this screen"
  (the host) and shows a 6-digit code; the other joins with it (the guest).
  The host owns the scripts, position and clock and broadcasts them; a guest
  mirrors that and sends its button presses back as commands. Position is sent
  as a fraction of the script, never pixels, because each screen wraps the text
  differently. Text size, mirror and colors stay per-device.
- The link is the site's **only outside dependency**: PeerJS 1.5.4, fetched
  from jsDelivr (pinned with an integrity hash) the first time linking is
  used, plus PeerJS's free public pairing service to introduce the devices.
  After that they talk directly (WebRTC). If the version changes, the hash
  (`PEER_SRI`) must change with it or linking silently stops working.

## /teleprompter is behind a PIN (`middleware.js`)

`middleware.js` is the site's only server-side code. Vercel runs it before it
serves `/teleprompter` (Routing Middleware, Node.js runtime) and answers with a
PIN screen unless the device already carries the unlock cookie. It is the one
exception to "unlisted means noindex, not private". Things to keep true:

- **The PIN is never written in this repo** (which is public on GitHub), in
  this file, or in a commit message. It lives in Vercel as two Production
  secrets: `TELEPROMPTER_PIN` (what people type) and `TELEPROMPTER_SECRET` (a
  random key that signs the cookie). If either is missing the page stays
  locked rather than open.
- **Changing the PIN:** `vercel env rm TELEPROMPTER_PIN production`, then
  `vercel env add TELEPROMPTER_PIN --environment production --sensitive`, then
  redeploy. Every device is asked again, because the cookie is derived from
  the PIN.
- The unlock cookie (`tp_auth`) lasts a year, per device and per browser. An
  iPad "Add to Home Screen" copy keeps its own cookies, so it asks once too.
  It also keeps its own `localStorage`, so the scripts link and token are
  entered once more inside the app. After unlocking, the PIN screen returns to
  the same address, query included (so `?view=remote` survives).
- The unlock cookie is `Secure`: iOS Safari (and the iOS Simulator) won't
  keep it on plain-http `vercel dev`, so the home-screen / unlock flow on iOS
  can only be checked on the live site. Chromium keeps it on localhost.
- The PIN screen sends the PIN in a request header (`x-tp-pin`), not the form
  body: `vercel dev` drops request bodies before middleware sees them. The
  form-body path is kept only for browsers with JavaScript off.
- The matcher has two patterns on purpose: the page, and any percent-encoded
  path (Vercel serves `/%74eleprompter` as the same file). After changing the
  matcher, re-check that an encoded URL still gets the PIN screen.
- **What the PIN does not do:** it does not hide the page's code (public repo),
  it does not protect the Google Sheet (still readable by anyone with its
  link), and it does not stop someone guessing the 6-digit code of a screen
  that is currently being shared. A wrong PIN costs about a second, but there
  is no lockout, so a short PIN keeps out passers-by, not a determined guesser.
- **Testing it locally** needs Vercel's dev server, not `python3 -m
  http.server` (which serves the page with no gate): the `vercel-dev` entry in
  `.claude/launch.json` starts it on port 3210 with a throwaway test PIN.
  `.claude/` is in `.vercelignore` so that file is not published.

## Deploying

```bash
git add <only-the-files-you-changed>
git commit && git push origin main
vercel --prod --yes
```

- Stage files explicitly — the working tree often carries unrelated drafts
  (e.g., README edits) that aren't ready to be committed.
- **`vercel --prod` deploys the working directory, not git.** Uncommitted and
  untracked files ship too (that's why the untracked, generated `progress.html`
  is live). Before deploying, check `git status` and make sure everything in
  the tree is safe to publish; `.vercelignore` is the only thing that holds a
  file back.
- After deploy, verify with `curl -s https://www.alfadiallo.com/<page>` (check a
  string you just added, not just the 200).
- `full-site.html`, the original photo and the local `.claude/` tooling folder
  are excluded via `.vercelignore`.

## DNS — handle with care

DNS for alfadiallo.com is hosted on Vercel and also carries the Google Workspace
mail records (MX, SPF, DKIM, DMARC). If DNS ever moves, those records must be
re-created at the new host or mail breaks. Don't touch DNS as a side effect of
site work.

## Testing changes

Before deploying: preview locally (`python3 -m http.server 8000`), check the
changed page at desktop and 375px widths, confirm no page overflows
horizontally, and confirm every new external link opens the right destination
with `target="_blank" rel="noopener"`.

## Work log

(Dates from git history.)

**Jul 21 — Site launched and filled in one day.** Public site cut to a
hero-only homepage ("Carpe diem." copy, mint accent, dark default theme,
LinkedIn only); `full-site.html` (the complete multi-section version) kept in
the repo but excluded from deploys; only the homepage listed in `sitemap.xml`.
Same day: six venture pages plus the `/projects` tile index added as unlisted
pages, `/missioncontrol` added as a noindex copy of the ED Mission Control
mock, and all six venture pages filled with non-technical overviews
(problem → what it does → where it stands) with access links researched from
each project's own docs: My Shift Report → showcase.myshiftreport.com,
Elevate → lev8.ai, EPI Quotient → epiquotient.com, VirtualSim → virtualsim.ai,
Smile Again → smileagainmovement.org, ED Operations Data Models → interactive
LBCC model on flow.gl (the eight models P2P/R2D2/LBCC/C3/TTM/VeLO/Bamboo/MSR
each described in one plain-English line). Deployed and verified live.

**Jul 22 — Medium link** added to the hero next to LinkedIn. `/progress` also
exists from this period (generated by the Portfolio Dashboard weekly workflow;
live but intentionally untracked in git).

**Aug 1 — Docs pass + landing revert.** CLAUDE.md created (page inventory,
unlisted rules, venture-page convention, missioncontrol sync rule, deploy
procedure, DNS warning); README refreshed (missioncontrol row, obsolete
ADD-DETAIL instructions replaced, DNS section corrected from HostGator to
Vercel). The understanding.healthcare landing page was briefly deployed at
`/landing` and reverted the same day — it belongs to the Mission Control
project (`…/Mission Control/landing/`), not to this site. Don't re-add it
here.

**Nov 15 — `/teleprompter` built and deployed.** Unlisted single-file
teleprompter for the iPad: scripts from a Google Sheet, words-per-minute speed,
text size/width/line spacing, mirror / flip / invert colors, elapsed + time-left
timer, reading line, start countdown, keyboard/remote keys, screen kept awake
while rolling. Tested locally at iPad (both orientations) and 375px widths and
against a live public Google Sheet; not yet tried on a physical iPad.

**Nov 15 (later) — phone remote for `/teleprompter`.** Added the two-device
link (see the teleprompter section above) so an iPhone can mirror and drive the
iPad, kept linked screens awake while paused, and tightened the layout for a
phone held sideways. Pairing, commands both ways, script-list push and
reconnect-after-reload were tested between two browser tabs over the real
pairing service; live scrolling in sync between two physical devices was not.

**Nov 15 (evening) — PIN on `/teleprompter`.** Added `middleware.js` (see the
PIN section above) with the PIN and signing key stored as Vercel Production
secrets, and took `.claude/` out of deploys. Tested through `vercel dev` with a
throwaway PIN: locked without the cookie (including the `.html` and
percent-encoded URLs), wrong PIN refused, right PIN unlocks and serves the
full page, other pages untouched. Deployed the same evening and checked live:
`/teleprompter` and its `.html`, query-string and percent-encoded variants all
get the PIN screen, a wrong PIN is refused, the other pages still load, and
`/.claude/*` is gone. Unlocking with the real PIN on the live site was left to
be tried on the iPad and iPhone.

**Nov 16 — `/teleprompter` becomes an iPhone app that edits the Tracker.**
Installable "Prompter" (manifest, icons from the alpha glyph with a reading-line
marker, a service worker for the offline copy; files named `prompter-*` so the
PIN gate leaves them alone). Added the phone control pad, auto-rejoin, and wake-up
on `pageshow` / `online`. Added the Web & Social Tracker as a live read/write
source through `prompter-bridge.gs` (in the vault, deployed by Alfa), with the
chunk editor, conflict refusal, reload that keeps its place, 30 s polling while
paused, and no swaps while rolling. The PIN screen now keeps the query string.
Tested through `vercel dev` with a local stand-in for the Apps Script (same
contract): gate status of every new file, unlock keeping `?view=remote`,
pairing two tabs at iPhone (402×874) and iPad (1180×820) sizes, phone-driven
seek and speed, a phone edit landing in the stand-in and on the "iPad" at
the same place, a conflicting save refused with nothing written, a mid-roll
update held until pause, and the page opening offline from the service worker.
The camera-overlay mode is designed, not built:
`~/Projects/_Operations/_knowledge-base/20 Content/Playbook/Teleprompter camera overlay.md`.
