# Checkpoint Gaming & Tech — Publish Ready

This package is ready for the public `checkpoint-gaming` GitHub repository.

## Preview
- Open `index.html` for the public site.
- Open `admin/index.html` for the content manager.

## Upload to GitHub
Upload the CONTENTS of this folder to the root of the repository — `index.html`, `styles.css`, `admin/`, `.github/`, `content/`, etc. Do not upload an extra outer folder.

## Publish
GitHub → repository Settings → Pages → Source: GitHub Actions.
The included workflow publishes the site whenever `main` changes.

## Adding content
Use `admin/index.html` to draft, preview, save and export reviews, buying guides and game guides. The next upgrade can connect this editor to a secure CMS for direct publishing.

## Static article generation

Requires Node.js 22 or later. Run `npm ci`, `npm run build`, then `npm test`.
`content.js` is the published article source of truth. `article.html` is the shared
layout and `article.js` is the shared renderer for both generation and legacy URLs.
Do not edit `articles/*/index.html` or `sitemap.xml` by hand; commit regenerated files
after changing content or the article template/renderer.

Articles are published at `https://checkpointloadout.com/articles/<slug>/`.
The build renders all content into the initial HTML and removes the runtime content
scripts. Relative assets and image fallbacks are adjusted for nested directories.
Native FAQ disclosure controls and affiliate anchors work without JavaScript.
Legacy `article.html?slug=<slug>` links still render and set the new canonical with
JavaScript (GitHub Pages cannot vary source HTML by query string).

Pull requests check generated files. Deployment regenerates and validates the site,
then uploads only public files from `_site/`. The custom domain in `CNAME` remains
the production domain; update the canonical origin in `article.js` too if it changes.
Sitemap dates are omitted rather than inventing publication/update timestamps.

For browser checks: `npx playwright install chromium`, then `npm run test:browser`.
These compare legacy and static layouts at desktop/mobile widths, including
JavaScript-disabled static pages and intercepted affiliate navigation. Screenshots
are written to ignored `test-results/`.

## Security
Never put passwords, Amazon credentials, GitHub access tokens or private API keys in this public repository.


## Product images
Each content item can now have an `image` field.
Use local files such as:
`assets/images/my-product.jpg`

The current SVG artwork is original illustrative placeholder art, not manufacturer photography.
Replace it later with:
- your own product photos
- manufacturer press/media assets you have permission to use
- images supplied by an affiliate programme/API under its terms

Do not simply download random copyrighted product photos from retailer pages.


## Deployment asset version
Current cache-busting version: `20260819-3`
