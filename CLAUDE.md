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
| `/progress` | `progress.html` | Unlisted, generated — see README |

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

## Deploying

```bash
git add <only-the-files-you-changed>
git commit && git push origin main
vercel --prod --yes
```

- Stage files explicitly — the working tree often carries unrelated drafts
  (e.g., README edits, generated `progress.html` runs) that aren't ready.
- After deploy, verify with `curl -s https://www.alfadiallo.com/<page>` (check a
  string you just added, not just the 200).
- `full-site.html` and the original photo are excluded via `.vercelignore`.

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

**Jul 21 — Site launched.** Static scaffold: hero-only homepage (name, tagline,
LinkedIn/Medium), shared `styles.css`, dark/light theme toggle, responsive hero
images, Vercel deploy with clean URLs. `full-site.html` (the complete
multi-section version) kept in the repo but excluded from deploys. Only the
homepage listed in `sitemap.xml`.

**Jul 21–22 — Unlisted page set.** Six venture pages plus `/projects` index
scaffolded from a shared template (lede, facts panel, CTA). `/progress` added
for weekly director updates (generated from the Portfolio Dashboard weekly
workflow). `/missioncontrol` added as a noindex copy of the ED Mission Control
mock.

**Jul 22 (later) — Venture overviews filled.** All six pages got full
non-technical overviews (problem → what it does → where it stands) with access
links to the live products, researched from each project's own docs:
My Shift Report → showcase.myshiftreport.com, Elevate → lev8.ai, EPI Quotient →
epiquotient.com, VirtualSim → virtualsim.ai, Smile Again →
smileagainmovement.org, ED Operations Data Models → interactive LBCC model on
flow.gl (the eight models P2P/R2D2/LBCC/C3/TTM/VeLO/Bamboo/MSR each described
in one plain-English line). Deployed and verified live.

**Jul 23 — Homepage refresh.** Current "Carpe diem." hero.

**Aug 1 — Docs + landing.** CLAUDE.md created (page inventory, unlisted rules,
venture-page convention, missioncontrol sync rule, deploy procedure, DNS
warning); README refreshed (missioncontrol row, obsolete ADD-DETAIL
instructions replaced, DNS section corrected from HostGator to Vercel).
The understanding.healthcare landing page was briefly deployed at `/landing`
and reverted the same day — it belongs to the Mission Control project
(`…/Mission Control/landing/`), not to this site. Don't re-add it here.
