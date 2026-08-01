# alfadiallo.com

Personal site for Alfa O. Diallo, MD, MPH, FACEP. Static HTML, no build step, no dependencies. Edit a file, redeploy.

## Structure

| File | Purpose |
|------|---------|
| `index.html` | Public landing page. Hero only: name, tagline, contact links. |
| `styles.css` | Shared styles for every page. Change the accent color here once. |
| `my-shift-report.html` etc. | Venture pages. Unlisted (see below). |
| `progress.html` | Weekly EM Informatics & Operations updates for directors. Unlisted. The entries between the `WEEKLY:START/END` markers are generated — edit the drafts in `~/Projects/_Operations/Portfolio Dashboard/weekly/` and run `node scripts/weekly.mjs --publish` there instead. |
| `missioncontrol.html` | ED Mission Control mock. Unlisted. A copy — the source lives in the Mission Control project; see CLAUDE.md. |
| `full-site.html` | The complete multi-section site, kept for later. **Not deployed.** |
| `hero-1800.jpg`, `hero-1100.jpg` | Responsive hero image |
| `og-image.jpg` | 1200x630 social share card |
| `robots.txt`, `sitemap.xml` | Only the homepage is listed |
| `vercel.json` | Clean URLs + cache headers |
| `.vercelignore` | Keeps `full-site.html` and the original photo out of the deploy |

### Venture pages

Six pages, one per venture. With `cleanUrls` on, each is served without the `.html`:

| Page | URL |
|------|-----|
| My Shift Report | `/my-shift-report` |
| VirtualSIM | `/virtualsim` |
| Elevate | `/elevate` |
| ED Operations Data Models | `/ed-operations-data-models` |
| Smile Again | `/smile-again` |
| EPI-Quotient | `/epi-quotient` |

**These are unlisted, not private.** Nothing on the landing page links to them and each carries `<meta name="robots" content="noindex, nofollow">`, so they stay out of search results. Anyone with the URL can still open one. Don't put anything confidential on them.

## Venture page content

All six pages carry a full overview (July 2026): the problem, what it does in
plain non-technical language, where it stands, and an access link to the live
product. The structure, voice rules, and live-link table are documented in
CLAUDE.md — follow them when adding a page or updating a status.

## Preview locally

```bash
python3 -m http.server 8000
# visit http://localhost:8000
```

## Deploy

```bash
npx vercel --prod
```

Or connect the GitHub repo in the Vercel dashboard (**Settings -> Git**) so every `git push` deploys automatically.

## Restoring the full site

`full-site.html` holds the complete version (about, focus areas, ventures grid, writing, education, contact). To publish it:

1. Remove `full-site.html` from `.vercelignore`.
2. Replace `index.html` with it, or link to it.

Note it still has its CSS inline, so it does not depend on `styles.css`.

## Custom domain

DNS for alfadiallo.com is hosted on Vercel, and the zone also carries the Google
Workspace mail records (MX, SPF, DKIM, DMARC). If DNS ever moves to another
host, re-create those mail records there first or email breaks. Confirm current
values in the Vercel dashboard.

## Re-optimizing the hero image (macOS)

```bash
sips -Z 1800 --setProperty formatOptions 80 source.jpg --out hero-1800.jpg
sips -Z 1100 --setProperty formatOptions 78 source.jpg --out hero-1100.jpg
```
