# Batch 13.2 — Article-type UX audit

Site-wide pass across all 48 articles.

## Decision tiles
The two quick-decision tiles are now contextual instead of always pretending the reader is shopping:

- Reviews / comparisons / buying guides: **BUY IF / SKIP IF**
- Sim-racing setup guides: **START WITH / AVOID**
- Sim-racing troubleshooting FAQ: **CHECK FIRST / AVOID**
- All game guides, including the older Elden Ring / BG3 / Cyberpunk / Helldivers pages: **DO THIS / AVOID THIS**

The useful bullets were retained where they work as a quick checklist. The section still disappears completely on any article without useful checklist content.

## TOC wording
- Buyer pages: Who it suits
- Setup guides: Setup checklist
- FAQ: Troubleshooting checklist
- Game guides: Key habits

## Specs / facts wording
- Buyer pages: Key specs & facts
- Setup guides: Settings & checks at a glance
- FAQ: Quick troubleshooting checks
- Game guides: Key facts

## Recommendation section
The two product-specific Assetto Corsa EVO setting guides no longer call their linked wheelbases “Recommended picks”. They now show **HARDWARE COVERED / Wheelbases used in this guide**.

## Image / metadata cleanup
- Related-article cards now prefer dedicated `cardImage`, so the real Elden Ring, Baldur's Gate 3, Cyberpunk 2077 and Helldivers 2 artwork also appears when those guides are shown as related articles.
- Social preview images prefer `cardImage` when available.
- Article hero alt text now says “visual” rather than incorrectly calling game/racing artwork a product image.

## Validation
- 48 unique article slugs retained.
- 17 reviews + 25 guides + 6 game guides retained.
- 5 setup guides classified as setup UX.
- 1 troubleshooting FAQ classified as FAQ UX.
- 6 game guides classified via actual gameGuides collection, not fragile category-name matching.
- Remaining 36 commercial/recommendation articles retain buyer UX.
- JavaScript syntax checks passed.
- sitemap.xml and site.webmanifest parse successfully.
- Amazon affiliate tag checks passed.
- Batch 10.1 placeholder fix preserved.
- Batch 11.3 monitor hard fix preserved.
- Batch 13.1 real game card artwork preserved.
