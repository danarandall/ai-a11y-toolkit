# Prime 4.0 measured baseline

Source: Prime 4.0 FREE Version of Design System Kit (Community), by Thalion.
Values read directly from the Figma file via the Figma API on 6 August 2026.
File version `2384617683022969376`.

This file is working evidence for defect attribution in the side by side study.
Every value below was measured, not estimated. No Thalion assets are reproduced
here, only measurements taken from them.

Contrast is sRGB relative luminance per WCAG 2.x. Large text is treated as
24px and above, or 18.66px and above at weight 700 or more.

## Color tokens

112 published fill styles, all resolved to concrete values.

### None of the eleven "500 (base)" steps reaches 4.5:1 on white

The step labelled "(base)" is the default a designer reaches for.

| Token | Hex | On white | As normal text | As a non-text boundary (3:1) |
| --- | --- | --- | --- | --- |
| 01 Primary/500 (base) | `#586AF5` | 4.38:1 | fails | passes |
| 04 Error/500 (Error) | `#F35625` | 3.40:1 | fails | passes |
| Secondary/Rose/500 | `#FF4671` | 3.30:1 | fails | passes |
| 00 Neutral/500 (base) | `#8593A3` | 3.13:1 | fails | passes |
| Secondary/Purple/500 | `#7D5EFA` | 4.33:1 | fails | passes |
| Secondary/Blue/500 | `#3697FF` | 2.99:1 | fails | fails |
| 02 Success/500 (base) | `#28CA9E` | 2.09:1 | fails | fails |
| Secondary/Aqua/500 | `#1DC8DF` | 2.02:1 | fails | fails |
| Secondary/Green/500 | `#24D07A` | 2.02:1 | fails | fails |
| 03 Warning/500 (Base) | `#FFAB00` | 1.90:1 | fails | fails |
| Secondary/Mint/500 | `#2DD6C0` | 1.83:1 | fails | fails |

Success, Warning, Aqua, Green, Mint and Blue at their base step fail even the
3:1 threshold for non-text contrast, so a status dot or chart segment drawn in
the base token does not meet SC 1.4.11 either.

### Lightest compliant step per family, as text on white

| Family | First step that reaches 4.5:1 | Ratio |
| --- | --- | --- |
| Neutral | 600 | 4.64:1 |
| Primary | 600 | 6.78:1 |
| Error | 600 | 5.04:1 |
| Success | 700 | 5.33:1 |
| Warning | 700 | 5.90:1 |

The practical rule for a team using this kit: text must come from step 600 or
darker, and Success and Warning need 700.

### Neutral ramp as body text on white

| Step | Hex | Ratio | Normal text |
| --- | --- | --- | --- |
| 400 | `#A8B5C2` | 2.09:1 | fails |
| 500 (base) | `#8593A3` | 3.13:1 | fails |
| 600 | `#6A7682` | 4.64:1 | passes |
| 700 | `#505862` | 7.21:1 | passes |

## Components as shipped

### Primary button

Measured from the Buttons page, all four sizes.

| State | Label on fill | Size | Ratio | Result |
| --- | --- | --- | --- | --- |
| Default | White on Primary/500 | 12, 16, 18px at weight 600 | 4.38:1 | fails 4.5:1 |
| Focus | White on Primary/500 | same | 4.38:1 | fails 4.5:1 |
| Hover | White on Primary/600 | same | 6.78:1 | passes |
| Pressed | White on Primary/700 | same | 10.37:1 | passes |
| Disabled | Primary/50 on Primary/200 | same | 1.49:1 | exempt under 1.4.3 |

The resting and focused states of the primary button miss AA by 0.12. The hover
and pressed states pass. Disabled controls are exempt from 1.4.3 and are not
counted as a defect.

Secondary and ghost button labels use Neutral/500 on white at 16px, 3.13:1,
which fails.

### Target sizes, SC 2.5.8 Target Size (Minimum), AA in WCAG 2.2

Threshold is 24 by 24 CSS pixels.

| Component | Measured | Result |
| --- | --- | --- |
| Buttons, smallest size | 106 x 32 | passes |
| Buttons, other sizes | 40, 48, 56 tall | passes |
| Inputs | 48 tall | passes |
| Toggles | 40 x 24 and 24 x 24 | passes at the limit |
| Tables, rows and controls | 48 tall | passes |
| Sliders | 48 tall | passes |
| Tabs, small light neutral | 98 x 23 | fails by 1px |
| Pagination, dot styles | 104 x 8, 156 x 12, 194 x 15 | fails |

Pagination dot indicators between 8 and 15px tall are the clearest target size
failure in the kit. The small tab variant misses by a single pixel.

Icon glyphs inside buttons measure 16 x 16 and tab icons 12 x 12, but those sit
inside a larger hit area and are not independent targets, so they are not
counted against 2.5.8.

## What a Figma file cannot tell us

Accessible names, roles, focus order, keyboard operability, live region
behavior, error association, and reflow all live in the build, not in the kit.
No design system can be the reason a product passes those criteria. They are
scored in the two builds instead.
