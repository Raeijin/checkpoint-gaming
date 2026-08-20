# Batch 10.1 — Placeholder product box fix

Fixed:
- Removed the public "Example product / Why this is recommended" placeholder text.
- Legacy single-product recommendation box is hidden by default.
- The box is only shown when an article has a real product name and valid destination URL.
- Recommendation-card articles force-hide the legacy box.
- Added a global [hidden] display rule so CSS component display rules cannot accidentally reveal hidden sections.
- Cache-busted article.js and styles.css.

Validation:
- All JavaScript syntax checks passed.
- sitemap.xml and site.webmanifest parse correctly.
- Public article template contains no dummy product copy.
