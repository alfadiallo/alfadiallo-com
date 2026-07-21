# alfadiallo.com

Personal site for Alfa O. Diallo, MD, MPH, FACEP. Static HTML, no build step, no dependencies. Edit a file, redeploy.

## Structure

| File | Purpose |
|------|---------|
| `index.html` | Public landing page. Hero only: name, tagline, contact links. |
| `styles.css` | Shared styles for every page. Change the accent color here once. |
| `my-shift-report.html` etc. | Venture pages. Unlisted (see below). |
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

## Adding detail to a venture page

Each page ships with the name, role, dates, a one-line description, and a facts panel. To expand one:

1. Open the file and find the `ADD DETAIL HERE` comment.
2. Write prose in `<p>` tags, or use `<h2>` plus the `<ul><li>` pattern (see `ed-operations-data-models.html` for a working example).
3. Change the wrapper class from `class="v-grid v-grid--solo"` to `class="v-grid"`. That moves the facts panel into a right-hand column beside your text.

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

The domain currently points at HostGator. To move it to Vercel, change these records at your DNS host:

| Record | Host | Value |
|--------|------|-------|
| CNAME | `www` | `cname.vercel-dns.com` |
| A | `@` | `76.76.21.21` |

Confirm the exact values in the Vercel dashboard, since they can change.

## Re-optimizing the hero image (macOS)

```bash
sips -Z 1800 --setProperty formatOptions 80 source.jpg --out hero-1800.jpg
sips -Z 1100 --setProperty formatOptions 78 source.jpg --out hero-1100.jpg
```
