# Search-led sim-racing update — 12 October 2026

## Evidence and scope

Reviewed the original `checkpointloadout.com-Performance-on-Search-2026-10-06.zip`,
including Queries, Pages, Chart, Devices, Countries and Filters CSVs. The filter
is Web / Last 3 months; actual daily rows span 18 August–3 October 2026.
Chart totals: 24 clicks / 2,496 impressions (0.96% CTR). Query rows omit some
searches, so their sums are not site totals. This is a small dataset, not a revenue
forecast. Legacy query URLs coexist with static URLs in this historical export;
do not change canonicals or migration behavior based on that alone.

| Decision | Direct query evidence | Change |
| --- | --- | --- |
| R5 vs G923 | `moza r5 vs logitech g923`: 108 impressions, 0 clicks, position 6.05; eight R5/G923 variants total 248 impressions and 0 clicks | Buying-decision title/snippet, explicit gear-drive answer, platform/SKU and complete-cost checks |
| R5 vs R5 Pro | `moza r5 vs r5 pro`: 190 / 0 / 8.39; reverse query: 122 / 2 / 23.6; `r5 vs r5 pro`: 44 / 2 / 7.05 | Separate new-buyer value from existing-owner upgrade value; distinguish Lite2 from SRP2; consider dispatch time |
| R5 vs T598 | Six queries containing both R5 and T598: 143 impressions, 1 click, weighted position 7.45 | Retain title structure; improve snippet/answer, exact licensed version and peak vs constant torque distinction |
| New: SR-P Lite vs SRP2 | `moza srp lite vs srp2`: 1 impression, position 28; `moza r5 pedal upgrade`: 1, position 22 | Exact original-pedal keep/kit/replace decision, connection checklist, mounting and accessory-name traps |
| New: CRP2 vs P1000 | `crp2 vs p1000`: 1 impression, position 16 | Cross-brand PC buying decision, equal basket comparison, variants, mounting and optional modules |

The five SRP2/CRP2 queries total 49 impressions / 6 clicks (12.24% CTR). Its static
page has 109 impressions / 7 clicks. This supports testing two adjacent buying
questions, but the new topics each have only one direct impression: treat them as
small experiments, not demonstrated volume opportunities. The earlier chat's
approximate G923 total differs from the reproducible eight-query total above.

All 48 existing slugs were inventoried. Exactly two new articles are added:

- `/articles/moza-srp-lite-vs-srp2/` owns the original R5 pedal replacement comparison.
  `best-upgrades-for-moza-r5-r5-pro` remains the broad upgrade-order overview;
  `load-cell-pedals-first-upgrade` remains the general brake-upgrade explanation.
- `/articles/moza-crp2-vs-simagic-p1000/` owns the cross-brand pedal shortlist.
  `moza-srp2-vs-crp2` retains the within-MOZA tier comparison.

The original R5 wheel comparisons remain distinct from the existing R5 Pro
comparisons. Internal links explain that distinction and give the new pages
incoming links from the established pedal/upgrade cluster. No old slug is removed.

## Fact checks and editorial limits

All five target articles use manufacturer sources, linked on-page. No new fixed
prices, discount claims, stock guarantees, lap-time claims or hands-on endorsements
are added. Research checked on 12 October 2026:

- [MOZA R5](https://uk.mozaracing.com/products/r5-racing-bundle) and
  [R5 Pro](https://uk.mozaracing.com/products/r5-pro-bundle): original versus Pro
  bundle identity, motors, encoders and pedal names. Pro marketing says both
  constant and peak 6 Nm in different sections; the comparison uses its spec-table
  peak label and does not claim a measured sustained-force advantage.
- [Logitech G923](https://www.logitechg.com/en-gb/shop/p/g923-trueforce-sim-racing-wheel)
  and [support specifications](https://support.logi.com/hc/en-150/articles/17207101115799-Specification-G923-TRUEFORCE-Sim-Racing-Wheel-for-Xbox-One-and-PC):
  gear drive, platform selection, including the currently listed PC-only option.
- [T598 PlayStation](https://www.thrustmaster.com/products/t598/) and
  [T598 Xbox](https://www.thrustmaster.com/en-ie/products/t598-x/): separate console
  products, constant torque versus overshoot, standard bundle contents.
- [SRP2](https://uk.mozaracing.com/products/srp2-pedals),
  [original Lite kit](https://uk.mozaracing.com/products/srp-lite-kit) and
  [compatibility table](https://support.mozaracing.com/en/support/solutions/articles/70000645179-sr-p-sr-p-lite-pedals-compatibility):
  distinguish resistance changes from replacement sensor hardware; PC USB route.
- [CRP2](https://uk.mozaracing.com/products/crp2-pedals) and
  [P1000 technical/variant table](https://simagic.com/pages/details-p1000), plus the
  [P1000 manual](https://image.simagic.com/profile/upload/2024/07/18/SIMAGIC_P1000_UM.pdf):
  sensing, PC connection, pedal counts and optional modules. No recommendation is
  based on one sensor capacity being numerically larger. Conflicting CRP2 marketing
  counts for brake combinations are deliberately not repeated.

## Affiliate and regional audit

All existing recommendation and legacy affiliate destinations are preserved
byte-for-byte. The two new MOZA recommendations reuse already-published tracked
product links. P1000 has a clearly labelled official non-affiliate store link;
no SIMAGIC affiliate relationship or ID is invented.

| Destination used by the five target pages | Check / action |
| --- | --- |
| MOZA UK R5 with existing `ref=AIDANKING` | Product page available; product-specific dispatch estimate present. Preserve tracking. |
| MOZA UK R5 Pro with existing tracking | Product page available; longer dispatch estimate than R5 observed. Avoid immediate-stock wording. |
| MOZA UK SRP2 / CRP2 with existing tracking | Correct pedal-set pages; separate clutch options. No static stock promise. |
| G923 Amazon UK search with existing tag | Preserve search URL; change button to “Search Amazon UK”, explicitly verify platform, seller and condition. Search results are not an inventory check. |
| `https://amzn.to/45TrGOx` | GET resolved to Amazon UK ASIN B0F24MQ7BP, Xbox/PC T598 wheel-and-pedal listing; existing tag retained. |
| `https://amzn.to/4zHHdyC` | GET resolved to Amazon UK ASIN B0DB1S4XLS, PS5/PC T598 wheel-and-pedal listing; existing tag retained. |
| SIMAGIC P1000 official store | Product listing available. User must confirm destination shipping/tax and chosen configuration. No affiliate attribution claimed. |

Amazon HEAD requests returned 405 and the web reader could not open the short
links; normal GET requests resolved successfully and product titles matched.
Stock, seller, destination eligibility and attribution cannot be certified from a
page response. No purchase or affiliate-account access was performed.

US: 615 impressions / 7 clicks; UK: 400 / 4. Existing commercial destinations are
UK-heavy. Keep buttons honest about destination and add regional delivery/tax/
returns context; do not silently rewrite links to an untracked US store or assume
the current Amazon tag is enrolled for every marketplace. Owner verification of
Amazon marketplace enrollment/OneLink and MOZA regional attribution remains needed.

The shared renderer now recognizes Amazon short links as affiliate links rather
than incorrectly labelling them “Official product page”. Disclosure appears before
the article recommendations and beside each commercial button. No new analytics,
cookies, affiliate programs or retailer IDs are introduced.

## Technical scope and validation

- Build system, dependencies, design/CSS, old static URLs and canonical construction
  are unchanged. Both new pages use the existing generator and sitemap pipeline.
  Refresh content/renderer script cache keys so returning homepage and legacy-URL
  visitors can receive the new content.
- Remove the inaccurate fixed Article `dateModified` from all pages. Emit only an
  explicit editorial date recorded on changed/new entries; leave unknown historical
  dates absent. Do not reinterpret `lastChecked` as a publication timestamp.
- Shared template/renderer fixes necessarily regenerate all 50 article files.
  Only five existing content entries change: the three wheel comparisons plus
  incoming links on the pedal comparison and upgrade overview.
- Regression assertions cover schema dates, short-link disclosure/labels, search
  labels and all existing static-content/link checks. Browser sample expands to
  all five target pages plus the existing four types, at 390/768/1440 pixels, with
  JavaScript disabled and intercepted retailer clicks (including short links and
  SIMAGIC). External images use existing local fallback behavior in these checks.
- The no-JavaScript browser context uses reduced motion to avoid smooth-scroll
  interference with native FAQ hit testing; the separate motion check remains.

Validation passed locally: `npm run build`, `npm test`, `npm run test:browser`
and `git diff --check`. Static tests cover 50 pages and 89 recommendation/affiliate
buttons. All prior commercial URLs are preserved; only the two named slugs are
new. Browser checks cover nine articles, three widths, layout parity, no document
overflow, navigation/search, native FAQ, reduced motion and intercepted retailer
navigation. Desktop/mobile screenshots were inspected. Third-party images were
blocked for deterministic tests, so production image delivery remains unverified.

## Post-merge checklist (merge is not part of this task)

1. Wait for Pages deployment; open both new URLs and the three updated comparisons
   on a phone. Check canonical, sitemap inclusion and exact retailer destinations.
2. Inspect the two new URLs in Search Console and request indexing if appropriate.
3. In the affiliate dashboards, verify the existing Amazon tag's UK eligibility,
   marketplace linking and MOZA regional attribution. Add other regional tracked
   links only after approval and a real tracking URL are available.
4. Record this deployment date. After 28 days, compare query/page impressions,
   clicks and CTR with the preceding 28 days, separating old query URLs. Compare
   rankings as well as CTR; this is not a controlled title test.
5. Check affiliate clicks, ordered items and commission using the programs' own
   reports. Add privacy-appropriate outbound-click measurement only as a separate
   deliberate change if needed. Review delivered prices/availability before
   replacing search links with verified tracked product links.
