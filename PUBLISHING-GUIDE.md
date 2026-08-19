# CHECKPOINT — PUBLISHING GUIDE

## What you have
This folder is a complete static website. It can be hosted on:
- GitHub Pages
- Netlify
- Cloudflare Pages
- most normal web hosts

The easiest first launch is GitHub Pages.

## A. Put it online with GitHub Pages

1. Create/sign in to a GitHub account.
2. Create a new repository, for example:
   checkpoint-gaming
3. Upload all files and folders from this site package to that repository.
   IMPORTANT: upload the CONTENTS of this folder, not an extra folder around them.
4. Ensure the default branch is called `main`.
5. In the repository go to:
   Settings → Pages
6. Under Build and deployment, choose:
   Source → GitHub Actions
7. The included `.github/workflows/pages.yml` workflow will deploy the site.
8. Once the deployment completes, GitHub will show the live Pages URL.

A normal project URL looks broadly like:
https://YOUR-GITHUB-NAME.github.io/checkpoint-gaming/

## B. Give it a proper address

Buy a domain from a registrar. Examples of the type of name to consider:
- checkpointgaming.com
- checkpointgear.com
- checkpointtech.ie
- checkpointgaming.ie

Do NOT buy a name until you check trademarks and availability.

After you own the domain:
1. GitHub repository → Settings → Pages.
2. Enter your custom domain.
3. GitHub will tell you which DNS records to add at your domain registrar.
4. Add those DNS records at the registrar.
5. Wait for DNS verification.
6. Turn on Enforce HTTPS when available.

Use GitHub's current documentation for the exact DNS records because they can change.

## C. How to add an article

Open:
`/admin/index.html`

It gives you:
- content type
- title/category
- summary
- score/read time
- quick answer
- main article
- affiliate product/link
- live preview
- saved drafts in your browser
- JSON export

The current admin intentionally does not contain a password/token for GitHub.
Never put a GitHub access token directly into a public website.

For a finished article:
1. Export its JSON.
2. Store it in the appropriate content folder in the repo.
3. Add the entry to `content.js` for the homepage card.
4. Push/commit the change.
5. GitHub Pages automatically republishes.

The next development step is a secure CMS/backend that lets the admin page publish directly.

## D. Affiliate links

Never hide the fact a link is an affiliate link.
The site already has disclosure language and uses `rel="sponsored nofollow"` on the example affiliate button.

Keep a simple affiliate-link spreadsheet with:
- retailer
- programme
- tracking ID
- article
- product
- destination URL
- date last checked

## E. Before real launch

Replace all example content.
Add:
- About page
- Contact page
- Privacy policy
- Cookie setup if required by the services you use
- Full affiliate disclosure
- Analytics
- Search Console
- real favicon/logo
- real article/product images you are permitted to use

Also replace `YOUR-DOMAIN-HERE` in sitemap.xml once your domain is known.
