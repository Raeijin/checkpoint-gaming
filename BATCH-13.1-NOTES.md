# Batch 13.1 — Real game card artwork

Updated these existing Game Guide cards:
- Elden Ring
- Baldur's Gate 3
- Cyberpunk 2077
- Helldivers 2

Changes:
- Added a dedicated `cardImage` field to the four articles.
- Card images use publisher-supplied Steam store header/key art.
- No AI/generated replacement images used for these four cards.
- Existing local artwork remains as an automatic fallback if a remote image ever fails.
- Article body/guide content is unchanged.
- Article hero behavior is unchanged; this patch targets the cards.
- Card renderer now supports `cardImage` separately from `productImage` / article hero imagery.
- Cache version bumped to 20260827-3.

Steam app IDs:
- Elden Ring: 1245620
- Baldur's Gate 3: 1086940
- Cyberpunk 2077: 1091500
- Helldivers 2: 553850

Validation:
- All JavaScript syntax checks passed.
- 48 unique article slugs retained.
- sitemap.xml and site.webmanifest parse successfully.
- Batch 10.1 placeholder fix preserved.
- Batch 11.3 monitor-card hard fix preserved.
