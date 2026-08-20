# Batch 11.3 — Monitor card hard fix

The live screenshot showed the actual problem: the monitor image element was only occupying roughly half of the card-art area.

This patch:
- Bypasses the generic card-image renderer for the two affected monitor articles.
- Gives those two cards a dedicated full-width image element.
- Forces the image and its container to 100% width with high-specificity rules.
- Uses a 190px desktop / 180px mobile image area.
- Keeps the category pill over the image.
- Cache-busts styles.css, content.js, app.js and article.js to version 20260820-6.
- Leaves GameSir, Keychron and all other cards unchanged.
- Retains all 37 articles and earlier fixes.

Validated:
- All JavaScript syntax checks passed.
- 37 unique article slugs retained.
- sitemap and manifest valid.
