# Study 5: Figma Make treatment arm, measured results

**Build:** https://tutu-invert-07297733.figma.site
**Measured:** 2026-08-14
**Arm:** treatment. Same prompt as the Figma Design run, with the published
`ai-a11y-toolkit` custom skill invoked.
**Score: 18 of 20.**

Scored against `study-5-rubric-preregistered.md`, written before this build existed.

## Method

IBM Equal Access `accessibility-checker` 4.0.29 driving Playwright Chromium at
1280x900, Node 20.20.1, against the running published site rather than an export,
so React hydration and client behavior are included. Reflow measured at 320x800 and
at 640 wide, which is 1280 at 200 percent zoom.

Every engine finding was hand verified in the live DOM. Study 1 is the reason that
step exists. Contrast was resolved from painted pixels, not from computed style,
because this build uses `oklab()` color and percentage alpha tokens that a naive
style read gets wrong. Focus was tested by pressing Tab, not by calling `focus()`,
because the build styles `:focus-visible`, which programmatic focus does not match.
Both of those distinctions changed the result. Details below.

## Scores

| # | Check | Result | Evidence |
| --- | --- | --- | --- |
| 1 | Native landmarks | Pass | `header` 1, `nav` 2 both with `aria-label` (Primary navigation, Footer navigation), `main` 1, `footer` present |
| 2 | One h1 | Pass | Exactly one, 72px, "Bread that takes as long as it takes." The wordmark is a link, not a heading |
| 3 | Heading levels unskipped | Pass | 14 headings, h1 to h2 to h3, zero skips. The 18px h3s under "How we bake" prove level is not driven by size |
| 4 | Display figures not headings | Pass | No text over 28px exists outside the heading set. No stat figures to mismark |
| 5 | Every image has an alt decision | Pass | 2 `img`, both with `alt`. 1 `svg`, the mobile menu glyph, not exposed. Zero CSS background images carrying content |
| 6 | Alt text informative | Pass | "A round sourdough loaf resting on woven jute, scored with a wheat-stalk pattern across its deeply blistered golden-brown crust" and "A baker stretching a smooth round of white dough across a floured wooden worktable, hands dusted with flour". Neither restates a nearby heading |
| 7 | Nav links are real links | Pass | All 14 navigational controls are `a[href]`. Zero `div onClick` |
| 8 | Skip link | Pass | First tab stop. `1x1` clipped at rest, `171x36` fixed at 12,12 on focus, `href="#main-content"`, target exists |
| 9 | Focus visible everywhere | Pass | All 15 tab stops match `:focus-visible` and paint a 2px outline. Verified by pixel diff: focusing the email input changes 2,560 pixels, the submit button 2,592 |
| 10 | Focus not obscured | Pass | Header is `position: sticky` `z-index: 40`. The skip link is `z-index: 50` and paints above it. Tabbing all 15 stops produced zero obscured non-header elements |
| 11 | Target size 24px floor | Pass | 8 targets are 18px tall. 2.5.8 spacing exception applies: nearest neighboring target center is 83.5px away at minimum, well over the 24px undisturbed-circle requirement |
| 12 | **Target size 44px standard** | **Fail** | 10 of 15 desktop targets are under 44px. The five header and four footer nav links are 18px tall. Mobile is clean: the disclosed menu gives 48px links |
| 13 | **Text contrast** | **Fail** | 52 of 53 text pairings pass. The "COUNTRY SOURDOUGH / TODAY" badge is 10px at weight 400, `bg-primary/85` composited over the loaf photograph. Painted background ranges rgb(157,63,22) to rgb(191,91,52), giving 5.75:1 at best and **3.81:1 at worst** against 4.5:1 required |
| 14 | Non-text contrast | Pass | Input fill cream on rust section 4.65:1. Submit button fill 4.65:1. Focus ring rgb(28,19,8) on cream 15.84:1, cream ring on rust 4.65:1. All clear 3:1 |
| 15 | Form field labelled | Pass | `<label for="email-input">`, not placeholder-only. Placeholder present as an example in addition |
| 16 | Error identified in text | Pass | Invalid input yields "Please enter a valid email address, for example you@example.com." with `aria-describedby="email-error"` and `aria-invalid="true"`. Names the fix, not just the fault |
| 17 | Submit result announced | Pass | Valid submit replaces the form and announces "You're on the list. First email lands this Sunday." in `role="status" aria-live="polite"` |
| 18 | Autocomplete on email | Pass | `autocomplete="email"` `required` |
| 19 | Reduced motion honored | Pass | One `@media (prefers-reduced-motion: reduce)` block on `*, ::before, ::after` setting `transition-duration: 0.01ms`, `animation-duration: 0.01ms`, `animation-iteration-count: 1`, `scroll-behavior: auto`, all `!important`. Covers all 17 animated elements |
| 20 | Reflow at 320px and 200% | Pass | `scrollWidth` equals `clientWidth` at both 320 and 640. Zero elements extending past the viewport. Visual check of the 320x7049 render shows no clipping or overlap |

## Engine findings, adjudicated

Raw counts: 4 violations, 4 potential violations, 5 recommendations, 1,132 passes.

| Finding | Verdict |
| --- | --- |
| `text_contrast_sufficient` reported 1.34:1 on the photo badge | **Correct call, wrong number.** A real 1.4.3 failure, but the engine's ratio is off by a factor of roughly three. It never composited the 85 percent alpha over the photograph. True range 3.81 to 5.75 |
| `table_headers_exists` on the hours table | **Genuine.** 4 rows, a `sr-only` caption, and zero `th`. The day column should be `th scope="row"` |
| `aria_attribute_valid`, `aria-label` on a `<p>` | **Genuine.** The label spells out "Open Tuesday through Saturday, seven AM until sold out" over visible "Open Tue - Sat, 7 am until sold out". Good intent, invalid placement, silently dropped |
| `aria_content_in_landmark` on the skip link | **False positive in practice.** The skip link sits outside landmarks by design, which is the standard pattern |
| `element_tabbable_visible` on the skip link | **Resolved.** It does become visible on focus. Measured |
| `text_block_heading` on "Wild Ferment", twice | **Resolved.** Both are the wordmark, one in the home link and one in the footer. Correctly not headings |

So 4 engine violations resolve to 2 genuine issues plus 1 correct-but-miscalculated
contrast call. Neither of the 2 genuine issues appears anywhere in the 20 checks,
and 1 of the 2 rubric failures (the 44px house standard) is invisible to the engine
because 2.5.8 permits 24px with spacing and this build satisfies that.

## What the two failures have in common

Both failures are decisions a design system cannot make.

The 44px target standard is a spacing and padding decision made per component
instance. Nothing in a token file or a component library forces a text link in a
navigation bar to carry 13px of vertical padding.

The badge contrast failure is small light text on a photograph through a
semi-transparent fill. The color token is fine: solid `--primary` under
`--primary-foreground` measures 4.65:1 and passes. The failure is created by the
composite, and the composite depends on a photograph nobody has picked yet at
design-system time. This is the same class of finding as the 3 of 55 ceiling result:
the system determines the pair, the build determines whether the pair survives
contact with real content.

Distinguishing carefully: this is not an argument that design decisions do not
matter here. The alt text, the heading structure, the reading order, and the skip
link all originate as design decisions and all passed. It is an argument that a
static file cannot be the enforcement point for either of these two.

## Control arm still required

This is one arm. Without the same prompt run in Figma Make with no skill invoked,
18 of 20 is a number with nothing to compare it to. Study 4's control scored 13 of
29 against its treatment's 26 of 29, and that gap is the whole finding.

Recorded but not scored:

- Smallest interactive target: 18px tall, in the desktop navigation.
- Zero JavaScript page errors on load.
- `lang="en"` set. Page title "Research Test -- Figma Make", which is the Make
  project name rather than a page title, and would need changing before real use.
- The mobile disclosure is well built and was not asked for: `aria-expanded`
  toggles correctly and the revealed links are 48px tall.
- Copy contains em and en dashes, which is house style for this project, not a
  conformance matter.

Written by Dana Randall in a personal capacity. Licensed CC BY 4.0.
