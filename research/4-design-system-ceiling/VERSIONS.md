# Prime color system across versions

All values read directly from the Figma API on 6 August 2026, from licensed
copies owned by the author. Every figure below is exact, not sampled from a
screenshot and not estimated.

| Version | File | Access |
| --- | --- | --- |
| 4.0 free community | Prime 4.0 FREE Version of Design System Kit | Owner |
| 5.0 | Prime 5.0 System | Owner |
| 5.1 | Prime 5.1 System | Owner |
| 5.2 | Prime 5.2 System | Owner |
| 6.0 | Prime 6.0 System | Owner |

## Finding 1: the palette has not changed since 5.0

Comparing all 200 published fill styles token by token:

| Comparison | Differing tokens |
| --- | --- |
| 5.0 against 5.1 | 0 of 200 |
| 5.0 against 5.2 | 0 of 200 |
| 5.0 against 6.0 | 0 of 200 |

The color palette in Prime 6.0 is identical to the one in Prime 5.0. Not
similar, identical, across every one of the 200 published fill styles.

The current product page and sales page both carry the line "More than WCAG,
colors made with APCA" ([Prime product page](https://primedesignsystem.com/),
[Prime sales page](https://thalion.gumroad.com/l/prime-for-figma)). Whatever
color work that line describes, it was already complete in 5.0 and nothing about
the palette changed in the three releases since.

## Finding 2: the rebuild between 4.0 and 5.0 was substantial and deliberate

| | 4.0 | 5.0 through 6.0 |
| --- | --- | --- |
| Families | 11 | 20 |
| Steps | 50 to 900 | 100 to 1000 |
| Naming | Semantic, so Primary, Success, Warning, Error | Named hues, so Blue Spark, Lucky Orange, Obsidian |
| Families with a 500 step | 11 | 18 |
| 500 step range on white | 1.83:1 to 4.38:1 | 3.09:1 to 3.63:1 |
| Spread across families | 2.55 | 0.54 |
| 500 steps clearing 3:1 | 5 of 11 | 18 of 18 |
| 500 steps clearing 4.5:1 | 0 of 11 | 0 of 18 |

Two things follow from this.

The 3:1 problem is fixed. In 4.0, six of eleven base colors failed the non-text
threshold, so a status dot or control boundary drawn in a base token failed SC
1.4.11. Warning base measured 1.90:1. From 5.0 onward, every base step clears
3:1. That failure mode is gone.

The 4.5:1 gap is not fixed, and has not moved in four releases. No base step in
any version reaches 4.5:1.

## Finding 3: the ramp is tuned to WCAG 2.x thresholds

The 500 step sits just above 3:1 in every family, with a median of 3.17:1 across
eighteen families. Further down the ramp, six families land on exactly 4.50:1 at
their 600 step.

Landing repeatedly and exactly on 4.50 is what optimizing against the WCAG 2.x
contrast ratio formula looks like. A palette tuned only by a perceptual model
would not keep hitting that specific number. The evidence in the file is that
the ramp was built against the same thresholds this study measures against, and
built carefully.

This matters for how the product's color claim should be read. The palette is
contrast engineered. It is engineered to put the 500 step at the 3:1 line and
the 600 step at the 4.5:1 line.

## Finding 4: the primary button in 6.0

Measured from the Buttons page of Prime 6.0, all four sizes, label text at
weight 600.

| State | Label on fill | Ratio | Result |
| --- | --- | --- | --- |
| Default | White on Blue Spark/600 | 4.48:1 | fails 4.5:1 by 0.02 |
| Hover | White on Blue Spark/500 | 3.16:1 | fails |
| Focus | White on Blue Spark/500 | 3.16:1 | fails |
| Pressed | White on Blue Spark/800 | 9.36:1 | passes |
| Disabled | not counted | | exempt under 1.4.3 |

Two observations.

The resting state improved from 4.38:1 in 4.0 to 4.48:1 in 6.0, and now misses
the threshold by two hundredths. The Danger button, built the same way from
Electric Crimson/600, lands on exactly 4.50:1 and passes. The primary brand hue
is the one that falls short, by the smallest margin the scale can express.

The interaction direction reversed. In 4.0, hover moved to a darker step and
measured 6.78:1, comfortably passing. In 6.0, hover and focus move to a lighter
step and measure 3.16:1. A user hovering or keyboard focusing the primary button
in 6.0 sees lower text contrast than at rest, not higher. Contrast requirements
apply to these states, and only the disabled state is exempt.

Across the whole Buttons page, 24 of 64 non-disabled label pairings fall below
their applicable threshold.

The secondary button is well clear throughout, from 10.77:1 to 15.74:1.

## Reading this fairly

The free 4.0 file makes no accessibility claim of any kind. Its published
description covers components, styles and Figma technique, and does not mention
accessibility, contrast or WCAG. It has not been updated in four years.

The color work from 5.0 onward is real, deliberate, and an improvement on 4.0 by
every measure applied here. Saying otherwise would misrepresent the file.

The accessibility claim on the current product is about color. It is not a claim
about names, roles, keyboard operability, focus order or status messages, and
the ceiling analysis in this study shows why no design kit could make one.
