# Batch 13 — New Games + Sim Setup/FFB + FAQ Hub

New game guides:
- Star Wars Zero Company Beginner Guide (launch-day, spoiler-light)
- Marvel Tōkon: Fighting Souls Beginner Guide

New sim setup / FAQ guides:
- Assetto Corsa EVO Wheel Setup Guide 2026
- Assetto Corsa EVO MOZA R5 & R5 Pro Settings
- Assetto Corsa EVO T598 Settings
- iRacing Wheel & FFB Setup Guide 2026
- Le Mans Ultimate Wheel & FFB Setup Guide 2026
- Sim Racing Wheel Troubleshooting FAQ

Visuals:
- Primary article-card imagery uses official/promotional remote artwork or car screenshots where available: EA Star Wars key art, PlayStation Marvel artwork, Assetto Corsa EVO Audi imagery, Le Mans Ultimate Hypercar imagery and a BMW racing image for iRacing.
- Every remote-image article has a local 16:9 fallback card image so a changed publisher URL does not create a blank/white card.
- Existing Batch 11.3 monitor-card hard fix is preserved.

FAQ system:
- Added a real expandable FAQ section to the article template.
- FAQ link is removed from the table of contents automatically on articles without FAQs.
- FAQPage structured data is emitted only for articles that actually provide FAQ content.
- Questions focus on genuine setup/troubleshooting intent rather than filler.

Current-source notes:
- Assetto Corsa EVO content updated for Early Access 0.9 (26 Aug 2026).
- KUNOS wheel setup references: lock matches wheel app, high wheel-side FFB, Dynamic Damping 40% reference, Damper Gain 20% reference.
- R5/R5 Pro page explicitly avoids copying KUNOS's generic 8 Nm MOZA example literally: R5 = 5.5 Nm, R5 Pro = 6 Nm.
- iRacing guide follows official calibration: DD Wheel Force = manufacturer torque, Linear Mode on, load-cell Brake Force Factor = 0, Auto/F-meter for clipping.
- Le Mans Ultimate guide uses current V1.4 support advice, including trying Steam Input disabled for affected FFB setups.

Validation target:
- 48 total articles (40 retained + 8 new)
- all four JavaScript files pass node --check
- all new URLs in sitemap
- Amazon links retain aidan0701-20
- previous placeholder and monitor-card fixes preserved
