# Zach Bentsen - Portfolio (Astro + React + TS)

Static portfolio with a switchable theme system and a blog served on the subdomain `blog.zachcbenny.com` (also available at `/blog/`).

## Quick start

1. Install deps: `pnpm install`
2. Dev server: `pnpm dev`
3. Build: `pnpm build` (output in `dist/`)

## Structure

- `src/pages/` — routes. Blog lives under `src/pages/blog/`.
- `src/layouts/` — `BaseLayout.astro` and `BlogPostLayout.astro`.
- `src/components/` — React components (`Hero`, `ProjectCard`, `ThemeToggle`).
- `src/data/` — `projects.json` and `blogs.json` manifest.
- `src/styles/themes.css` — central theme definitions and base styles.
- `public/` — static assets (favicon, `themes.css` for raw HTML posts).

## Theming

- Default theme set in `src/config/site.ts` (`DEFAULT_THEME`).
- Toggle via query param `?theme=<name>` or the UI toggle (`ThemeToggle`).
- Available themes: `boring`, `neobrutal`, `hyper` (keyboard shortcuts 1–3).
- To extend: add CSS variables + rules in `src/styles/themes.css` and update the theme list in `src/components/ThemeToggle.tsx`.

## Blog

- Add posts in `src/pages/blog/` as `.md` (preferred) or `.html`.
- List posts in `src/data/blogs.json` (title, date, path, summary).
- Markdown posts use `BlogPostLayout.astro` automatically via frontmatter.
- Plain HTML posts can include `<link rel="stylesheet" href="/themes.css">` to pick up site variables/styles.

## Canonical + Subdomain

- Blog index and Markdown post layout set canonical to `https://blog.zachcbenny.com/...`.
- Both `/blog/*` and `blog.zachcbenny.com/*` are supported.

### CloudFront Function (viewer-request)

Attach this function to the default behavior for the `blog.zachcbenny.com` alias to map requests to `/blog/...` in the single build:

```js
function handler(event) {
  var req = event.request;
  var host = req.headers.host.value.toLowerCase();
  if (host === 'blog.zachcbenny.com') {
    var uri = req.uri;
    if (!uri.startsWith('/blog')) {
      req.uri = '/blog' + (uri === '/' ? '' : uri);
    }
  }
  return req;
}
```

This lets a single S3/CloudFront deployment serve both the apex and the blog subdomain without duplicating files.

## AWS deployment (S3 + CloudFront)

1. Create a private S3 bucket (no public ACLs). Set `index.html` and `error.html` as needed.
2. Create a CloudFront distribution with Origin Access Control (OAC) to the bucket. Add aliases: `zachcbenny.com`, `blog.zachcbenny.com`.
3. Attach the CloudFront Function above at Viewer Request to the default behavior.
4. Add ACM cert in us-east-1 for both hostnames and attach to CF.
5. Point Route53/your DNS to the distribution (A/AAAA alias for apex and blog subdomain).
6. Use the GitHub Action (`.github/workflows/deploy.yml`) and set secrets: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `S3_BUCKET`, `CLOUDFRONT_DIST_ID`.

## Content updates

- Main project: update `src/data/projects.json` (`main`).
- Other projects: update `others` array (or automate later with GitHub API).
- Blog manifest: update `src/data/blogs.json` when adding posts.
