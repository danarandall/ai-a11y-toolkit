# 5. Figma Make: does a custom skill change what Figma Make builds?

The first four studies test the toolkit as a file in a code project, read by a
coding agent. This one tests it as a **Figma custom skill**, in a design tool, read
by a design agent generating a running website.

The environment matters. Studies 2, 3 and 4 gave the agent a filesystem, a build
step, and no interface. Figma Make gives it a canvas-first workflow, its own
component conventions, and a publish button. Nothing about the earlier results
guarantees the guidance survives that change.

**Control:** https://grace-number-99311548.figma.site, the prompt alone
**Treatment:** https://tutu-invert-07297733.figma.site, the same prompt with the
`ai-a11y-toolkit` skill invoked

Both arms generated and published 2026-08-14, measured the same day against the
same runtime.

There is a second pair. The same prompt, run twice in the **Figma Design** agent
rather than Make, producing two static design files. Those are measured separately
in [DESIGN-FILE-AUDIT.md](DESIGN-FILE-AUDIT.md), because a design file and a
running page cannot be scored on the same rubric. A design file determines only 3
of the 55 WCAG 2.2 A and AA criteria, so that comparison is 1 of 3 against 3 of 3
and is not comparable in weight to the sixteen check result below.

Design control: page `Sourdough Control`, node `10:2`
Design treatment: page `Sourdough Test`, node `0:1`
Both in https://www.figma.com/design/K2UUFuil7G3IqbUP0ZP01F/AI-A11y-Toolkit

---

## Headline

| | Control | Treatment |
| --- | --- | --- |
| Rubric score, 16 comparable checks | **8 of 16** | **14 of 16** |
| Rubric score, all 20 checks | 8 of 16 scoreable | **18 of 20** |
| Engine violations, raw | **62** | **4** |
| Engine violations, after hand verification | ~18 genuine | 2 genuine |
| Elements carrying a violation | 58 | 4 |
| Anchors on the page | **0** | 14 |
| Landmarks | no `header`, no `main` | `header`, `main`, `footer`, 2 labelled `nav` |
| Skip link | absent | present, visible on focus |
| `prefers-reduced-motion` | absent, against 26 animated elements | present, universal, covers all 17 |

---

## Method

IBM Equal Access `accessibility-checker` 4.0.29 driving Playwright Chromium at
1280x900, Node 20.20.1, run against the **published builds** rather than exports,
because a Make project is not a repository you can read. Reflow measured at 320x800
and at 640 wide, which is 1280 at 200 percent zoom.

Scored against [RUBRIC.md](RUBRIC.md), written before either Make arm was
generated. The rubric records its own contamination: the Figma Design treatment
had already been audited, so the pre-registration is honest about that design file
but blind to both Make builds. The Figma Design control was generated and measured
after the rubric, and is scored only on the three criteria a static file
determines, which were fixed by WCAG rather than by me.

Every engine finding in both arms was hand verified in the live DOM. Two
verification choices changed results, and both are documented below, because
getting them wrong would have produced a cleaner-looking study with wrong numbers
in it.

Harness in [`harness/`](harness/), raw engine and DOM output in [`data/`](data/).

---

## Scores, check by check

| # | Check | Control | Treatment |
| --- | --- | --- | --- |
| 1 | Native landmarks | **Fail.** 0 `header`, 0 `main`, 1 unlabelled `nav`. 33 engine violations trace to this single omission | Pass. All four, with both `nav` elements labelled |
| 2 | One h1 | Pass. 86px, the page subject | Pass. 72px, the page subject |
| 3 | Heading levels unskipped | Pass. 13 headings, 0 skips | Pass. 14 headings, 0 skips |
| 4 | Display figures are not headings | Pass. The 56px process numbers are `span` | Pass. No display figures exist |
| 5 | Every image has an alt decision | **Fail.** All 5 `img` carry good alt, but 8 `svg` have no accessible name and none are marked decorative | Pass. 2 `img` with alt, 1 `svg` not exposed, 0 content-bearing CSS backgrounds |
| 6 | Alt text is informative | Pass. All five describe the subject | Pass. Both describe the subject |
| 7 | Nav links are real links | **Fail.** Zero `a[href]` on the entire page. All 17 navigational controls are `button` | Pass. 14 `a[href]`, 0 `div onClick` |
| 8 | Skip link | **Fail.** None, and no fragment anchors exist to skip to | Pass. First tab stop, 1x1 clipped at rest, 171x36 fixed on focus |
| 9 | Focus visible everywhere | Pass, but only by browser default. All 16 stops get `outline: auto 1px` at offset 0, the UA ring nobody chose | Pass by design. All 14 stops get `solid 2px` at offset 2px |
| 10 | Focus not obscured | Pass. Nav is `fixed z-50`, but no non-nav element was caught beneath it across 30 tab presses | Pass. Header `sticky z-40`, skip link `z-50` paints above it |
| 11 | Target size, 24px floor | Pass. 8 targets are 16 to 21px tall and the 2.5.8 spacing exception applies, nearest neighbor 110px | Pass. 8 targets 18px tall, nearest neighbor 83.5px |
| 12 | **Target size, 44px house standard** | **Fail.** 13 of 16 under 44px. Nav items 16px tall | **Fail.** 10 of 15 under 44px. Nav items 18px tall. The mobile menu is clean at 48px |
| 13 | **Text contrast** | **Fail.** "Est. 2016, Hoboken NJ" gold on the hero photo at 10px/400, 3.32:1 average and 1.92:1 in its worst region. Prices rust on cream 3.46:1 at 14px/600. Both CTA labels 3.81:1 at 12px/500 | **Fail.** 52 of 53 pairings pass. The one failure is a 10px badge over a photograph, 3.81:1 in the light crust and 5.75:1 in the dark |
| 14 | Non-text contrast | **Fail.** The "Order Ahead" ghost button's only boundary is a 1px cream border at 50 percent alpha over a photo. Painted edge measures **1.07:1** | Pass. Input fill 4.65:1, button fill 4.65:1, focus ring 15.84:1 on cream and 4.65:1 on rust |
| 15 | Form field labelled | Not scoreable, no form was built | Pass. `label for="email-input"` |
| 16 | Error identified in text | Not scoreable | Pass. `aria-describedby`, `aria-invalid`, and a message naming the fix |
| 17 | Submit result announced | Not scoreable | Pass. `role="status" aria-live="polite"` |
| 18 | Autocomplete on email | Not scoreable | Pass. `autocomplete="email" required` |
| 19 | Reduced motion honored | **Fail.** Zero `prefers-reduced-motion` blocks against 26 animated elements, including an `animate-bounce` scroll cue that never stops | Pass. One universal block zeroing transition, animation, iteration count and scroll behavior |
| 20 | Reflow at 320px and 200% | Pass. `scrollWidth` equals `clientWidth` at both | Pass. Same |

---

## The confound, stated first

**Four checks could not be scored on the control, because the control did not build
a newsletter form.**

Same prompt, and the prompt asked for a bakery landing page without naming its
sections. Make is not deterministic, so the two arms produced different page
inventories. The treatment built a form and passed all four form checks. The
control has no artifact to score against them.

That is a confound, not a result. The honest comparison is **8 of 16 against 14 of
16** on the checks both pages can answer. The treatment's 18 of 20 is a description
of the treatment, not a margin over the control, and it is not presented as one.

---

## What the skill changed

Four things the control did not do at all, and that no engine would have made it
do.

**It used anchors for navigation.** The control shipped a landing page with **zero
links on it**. Every nav item, every card action, every footer item is a `button`.
Nothing looks wrong. In-page navigation, link lists, open-in-new-tab, the browser's
own link affordances, and the entire concept of a destination are gone.

**It wrote a skip link.** With no fragment anchors anywhere in the control, there
was nothing to skip to even if a user asked for it.

**It honored reduced motion.** The control animates 26 elements with no opt-out,
including a chevron that bounces continuously.

**It built landmarks.** One missing `<main>` produced 33 of the control's 62 engine
findings.

And one result that cuts the other way, reported at the same length. **The
control's alt text was good.** Five images, five specific descriptions, unprompted.
Study 3 found the same drift and this confirms it in a new environment. The
baseline has moved, and the toolkit should stop treating image naming as
differentiating value.

---

## Where the engine was wrong, in both arms

This is more useful than the score.

**The engine cannot composite alpha over a photograph, and it made the same error
in both arms.**

| Arm | Engine reported | Measured from painted pixels |
| --- | --- | --- |
| Treatment | 1.34:1 on the photo badge | 3.81 to 5.75:1. Correct call, wrong by roughly 3x |
| Control | 1.10:1 on the navigation bar | 9.27:1 over the hero, 14.38:1 over the cream bar. False |
| Control | 1.21:1 on the h1 | 6.24:1 average. False |

Six of the control's 20 contrast violations are this error. My own first-pass
harness made the identical mistake before pixel verification, which is why the
finding is here and not buried.

The cause is worth naming, because it will recur on any modern build: these pages
use `oklab()` color and percentage-alpha utility tokens such as `bg-primary/85`.
Walking up the DOM for a computed background color returns the wrong ancestor's
value, and never composites the alpha. The fix is to read painted pixels, with the
text set to `color: transparent` so antialiasing does not contaminate the
background sample.

**Programmatic focus is not `:focus-visible`.** Calling `focus()` in script showed
**zero** focus ring on the treatment's email input. Pressing `Tab` paints one that
changes 2,560 pixels. An audit done the fast way would have filed a 2.4.7 failure
that does not exist.

**Adjudicated totals:**

| Arm | Raw | Genuine | False or resolved |
| --- | --- | --- | --- |
| Control | 62 | ~18. One missing `main` accounts for 33 reported elements. 8 unnamed SVGs, 1 unnamed control, roughly 8 real contrast pairings | ~6 contrast readings on the scroll-state nav and the hero h1 |
| Treatment | 4 | 2. The hours table has a `caption` and zero `th`. An `aria-label` is placed on a `<p>`, where it is silently discarded | 1 skip link reported outside a landmark, which is the standard pattern. 1 contrast call correct in direction, wrong in magnitude |

**Neither of the treatment's two genuine findings appears anywhere in the twenty
checks**, and neither is covered by the toolkit. Both are queued as content gaps
rather than counted as rubric passes: data tables need `th scope="row"` under
1.3.1, and `aria-label` is not valid on a `<p>` under 4.1.2.

---

## What neither arm got right

Both arms failed the same two checks, and both failures are decisions no static
artifact can make.

**The 44px target standard is per-instance padding.** Nothing in a token file
forces a navigation text link to carry vertical padding, and 2.5.8 permits 24px
with sufficient spacing, so a conformance-driven build stops short of the house
standard by default. Both arms landed at 16 to 18px nav items.

**Both contrast failures are small text over photographs through partial alpha.**
Solid, the treatment's own token pair measures 4.65:1 and passes. The failure is
created by the composite, and the composite depends on a photograph that does not
exist at design-system time.

That is the [ceiling finding](../4-design-system-ceiling/README.md) arriving from a
different direction. A Figma design kit determines 3 of 55 criteria: 1.4.3, 1.4.11
and 2.5.8. Two of the three are exactly what both arms failed here.

Distinguishing carefully, because the phrase invites the wrong conclusion. This is
not evidence that design decisions do not matter. Alt text, heading structure,
reading order, bypass and error text all originate as design decisions, and the
treatment passed every one of them. It is evidence that **a static file cannot be
the enforcement point** for the two criteria that depend on a photograph nobody has
chosen yet.

---

## Recorded, not scored

- Control page title: "Sourdough Bakery Land - no a11ying Page". Treatment:
  "Research Test -- Figma Make". Both are project names leaking through as page
  titles, in both arms.
- `lang="en"` set correctly on both.
- Zero JavaScript page errors on both.
- Smallest interactive target: control 16px tall, treatment 18px tall.
- The treatment's mobile disclosure menu was unprompted and correct. `aria-expanded`
  toggles and the revealed links are 48px.
- The control's bouncing chevron is a 26x26 `button type="submit"` with no
  accessible name, sitting outside any form.

---

## What this study does not show

The limits listed in the [research README](../README.md) all apply. Three more are
specific to this study.

- **The arms built different pages.** Four checks are unscoreable on the control for
  that reason. A prompt that enumerated required sections would have fixed it, and
  the next run of this design should.
- **One run per arm, in a nondeterministic tool.** Make's output varies between
  generations from identical input. A single pair cannot separate the skill's effect
  from that variance.
- **No source code.** A published Make site is measurable but not readable, so
  everything here is observed from the running DOM rather than from the code the
  agent wrote. `control/` and `treatment/` directories do not exist for this study.

Written by Dana Randall in a personal capacity. Licensed CC BY 4.0.
