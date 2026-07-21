# alfadiallo.com

Personal landing page for Alfa O. Diallo, MD, MPH, FACEP.

A single self-contained static site: `index.html` with inline CSS/JS, no build step and no dependencies. Just edit the file and redeploy.

## Files

| File | Purpose |
|------|---------|
| `index.html` | The entire site |
| `hero-1800.jpg`, `hero-1100.jpg` | Responsive hero image (optimized from `_IMG_8880.jpeg`) |
| `og-image.jpg` | 1200x630 social share card |
| `robots.txt`, `sitemap.xml` | SEO basics |
| `vercel.json` | Clean URLs + cache headers (Vercel only) |

## Preview locally

No tooling required. Either open `index.html` in a browser, or serve it:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy

### Option A: Push to GitHub, host on Vercel (recommended)

1. Create an empty repo on GitHub (no README/license, since this folder already has them). Then:

   ```bash
   git remote add origin https://github.com/<your-username>/alfadiallo-com.git
   git branch -M main
   git push -u origin main
   ```

   Or with the GitHub CLI, from this folder:

   ```bash
   gh repo create alfadiallo-com --public --source=. --remote=origin --push
   ```

2. Go to [vercel.com/new](https://vercel.com/new), import the repo. Framework preset: **Other**. No build command, no output directory. Deploy.

3. Every `git push` to `main` now redeploys automatically.

### Option B: GitHub Pages

1. Push to GitHub (step 1 above).
2. Repo **Settings -> Pages -> Build and deployment -> Source: Deploy from a branch**, branch `main`, folder `/ (root)`. Save.
3. Add your custom domain under the same Pages settings (this creates a `CNAME` file in the repo).

### Option C: Vercel with no GitHub (drag-and-drop or CLI)

- Drag this folder onto [vercel.com/new](https://vercel.com/new), **or**
- ```bash
  npx vercel        # preview deploy
  npx vercel --prod # production deploy
  ```

## Custom domain: www.alfadiallo.com

At your domain registrar (where alfadiallo.com is registered), add the DNS records the host tells you to. Typical values:

**Vercel**
- Add `www.alfadiallo.com` in the Vercel project's Domains tab. Vercel will ask you to set:
  - `www` -> `CNAME` -> `cname.vercel-dns.com`
- To make the bare domain redirect to www, add `alfadiallo.com` too and Vercel provides an `A` record (currently `76.76.21.21`) or an ALIAS/ANAME.
- HTTPS is provisioned automatically.

**GitHub Pages**
- `www` -> `CNAME` -> `<your-username>.github.io`
- For the apex domain, GitHub's `A` records:
  - `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- Enable **Enforce HTTPS** in Pages settings once DNS resolves.

> Always copy the exact records from your host's dashboard, since IPs and target hostnames can change. The values above are current defaults for reference.

## Updating content

Everything lives in `index.html`. To re-optimize the hero image after replacing the source photo (macOS):

```bash
sips -Z 1800 --setProperty formatOptions 80 source.jpg --out hero-1800.jpg
sips -Z 1100 --setProperty formatOptions 78 source.jpg --out hero-1100.jpg
```
