# Premium visual refresh

Presentation refresh on `codex/high-tech-visual-refresh`.

## Changes

- Dark mineral surfaces with restrained mint, cyan and violet accents; refined typography, spacing, borders, shadows and focus outlines.
- Decorative layered command-centre hero using existing artwork and CSS hardware shapes. HUD is hidden from assistive technology and omitted on smaller screens.
- Finite ambient/status animation, one-time section entrances, pointer-device card lifts/image zoom, navigation underlines and button light sweeps. Reduced motion disables animations, transitions and smooth scrolling. Content is never initially hidden.
- Existing navigation links visible in a compact mobile row. Popular links remain manually scrollable, with no automatic ticker movement.
- Thin reading progress, current-section TOC highlight, improved callouts/spec tables/buying cards and reserved article image geometry. Desktop TOC is sticky; mobile uses a compact in-flow grid.

## Files

- `styles.css`: shared presentation and responsive rules.
- `index.html`: decorative hero and asset cache versions.
- `app.js`: optional IntersectionObserver section entrances.
- `article.html`: stylesheet version and ~1.7 KB inline reading enhancement; its inline form is preserved by the existing static generator.
- `articles/*/index.html`: 48 regenerated files containing only that template presentation change.
- `scripts/test-browser.cjs`: expanded homepage, tablet, TOC, motion and overflow regression checks.

`content.js`, `article.js`, `scripts/build-articles.cjs`, article paths, canonicals, affiliate destinations and sitemap remain unchanged. Static DOM comparison against main found identical article documents after excluding the presentation script, stylesheet version, comments and inter-element whitespace. No article copy, headings, metadata or JSON-LD changed.

## Validation

Passed `npm run build`, `npm test`, `npm run test:browser` and `git diff --check`.

- All 48 initial HTML documents, bodies, schemas, sources and FAQs; 86 recommendation/affiliate buttons.
- Homepage plus ASUS VY279HGR review, budget gaming monitor buying guide, MOZA R5 vs Fanatec CSL DD comparison and Elden Ring game guide at 390, 768 and 1440 px.
- Static/legacy geometry parity, no document horizontal overflow, native FAQ and readable article content with JavaScript disabled.
- Navigation/search, clear anchor offsets, active TOC, progress, non-overlapping ticker, reduced-motion changes and no browser JavaScript errors.
- Affiliate-button hit testing and intercepted destination navigation, without retailer visits.
- Desktop/mobile/tablet screenshots inspected; screenshots remain in ignored `test-results/`.

## Performance and limits

No new dependency, font, image, video or WebGL asset. Existing lazy loading and fallback images retained. Article enhancement is 1,727 bytes (738 bytes gzip); shared CSS is about 9.7 KB gzip total. Progress uses passive scrolling with at most one queued animation frame, and image geometry is reserved. Expensive card backdrop filters were removed; ambient and status motion stops after a few cycles.

Local Chromium, 4x CPU slowdown, local assets and blocked third-party images:

| Width | Homepage LCP | Comparison LCP | Initial CLS (both) |
| --- | --- | --- | --- |
| 390 | 380 ms | 280 ms | 0 |
| 768 | 324 ms | 268 ms | 0 |
| 1440 | 412 ms | 292 ms | 0 |

These are local smoke measurements, not field CWV or a production INP result. One long task occurred in the 390 px homepage sample. Production network latency and third-party image delivery remain unmeasured; browser tests intentionally use existing local fallbacks. The initial content remains available if enhancements fail or JavaScript is disabled. Shared styles also affect the existing informational pages.
