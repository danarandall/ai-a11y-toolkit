# Study 4: what a design system can and cannot make accessible

A question that comes up often enough to be worth answering with measurement
rather than opinion: if a team builds on a design system that was made with
accessibility in mind, how much accessibility work is already done for them?

The honest answer has a number attached to it, and the number is smaller than
most people expect.

This study uses the Prime design system by Thalion as its subject. Prime is a
reasonable choice because it is widely used, it is well made, and its current
release makes a specific public claim about color. Nothing here is an attack on
it. Several findings are in its favor, and where the measurements flatter it
they are reported at the same length as the ones that do not.

Everything measured here was read directly from licensed copies of the source
files using the Figma API, on 6 August 2026. No source artwork or components are
redistributed. What is published is measured values, the code that measured
them, and two builds written for this study.

---

## The argument in one table

Of the 55 WCAG 2.2 Level A and AA success criteria, here is what a design kit
can reach.

| | Determines | Influences | Cannot affect |
| --- | --- | --- | --- |
| A Figma design kit | 3 | 14 | 38 |
| A coded component library | 4 | 32 | 19 |

At Level A, a Figma design kit determines **zero** of the 31 criteria and cannot
affect 28 of them.

The three it determines are 1.4.3 text contrast, 1.4.11 non-text contrast, and
2.5.8 target size. That is the whole set. A design kit can hand you a palette
and a set of sizes. It cannot hand you an accessible name, a focus order, an
exposed state, an error association, or a status announcement, because those
things do not exist until someone writes code.

The full classification, criterion by criterion with the reasoning for each, is
in [CEILING.md](CEILING.md).

---

## What Prime actually ships

### The free 4.0 community file

Measured in [BASELINE.md](BASELINE.md). 112 fill styles resolved.

None of the eleven base tokens reaches 4.5:1 on white. Six of eleven fail even
the 3:1 non-text threshold. The primary button's resting state puts white text
on a token measuring 4.38:1.

The fair reading matters here. **The free 4.0 file makes no accessibility claim
of any kind.** Its published description covers components, styles and Figma
technique. It does not mention accessibility, contrast, or WCAG anywhere, and it
has not been updated in four years. Measuring it against a claim it never made
would be dishonest. It is included because it is the version most people have.

### The paid releases

Measured in [VERSIONS.md](VERSIONS.md), across 5.0, 5.1, 5.2 and 6.0.

Three findings.

**The palette has not changed since 5.0.** All 200 published fill styles are
identical across 5.0, 5.1, 5.2 and 6.0. Not similar, identical.

**The 4.0 to 5.0 rebuild was real and it fixed something.** Eleven families
became twenty. The base step tightened from a 2.55 spread to 0.54. Every base
step now clears 3:1, where six of eleven failed before. The non-text contrast
problem in 4.0 is genuinely gone.

**The ramp is tuned to WCAG 2.x thresholds.** Every base step sits just above
3:1, median 3.17:1. Six families land on exactly 4.50:1 at their next step.
Repeatedly hitting 4.50 exactly is what optimizing against the WCAG 2.x contrast
formula looks like. This palette is contrast engineered, and carefully.

What has not moved in four releases is that no base step reaches 4.5:1. In 6.0
the primary button's resting state measures 4.48:1, which misses by two
hundredths, while the danger button built the same way lands on exactly 4.50:1
and passes. The hover and focus states move to a lighter step and measure
3.16:1, so contrast drops on interaction rather than rising. Across the Buttons
page, 24 of 64 non-disabled label pairings fall below their threshold.

---

## The build study

Theory is cheap, so the second half of this is a build.

Two agents received the same product brief, the same measured Prime 6.0
specification, and the same model. Neither was told it was being compared to
anything. Neither brief mentioned accessibility. The only difference was that
one of them also received the toolkit in this repository.

The rubric and the attribution rules were written before either build started
and are published unedited in [RUBRIC.md](RUBRIC.md).

| | Control | Treatment |
| --- | --- | --- |
| Rubric items passed | 13 of 29 | 26 of 29 |
| Engine violations, default state | 22 | 11 |
| Engine violations, after hand verification | 22 | 0 |

Full scoring, item by item, is in [RESULTS.md](RESULTS.md).

### The attribution

The control build failed 16 rubric items. This is the part the study exists to
produce.

| Origin | Count |
| --- | --- |
| Inherited from the design system | 1 |
| Introduced by the builder | 14 |
| Neither | 1 |

One. The design system contributed a single failing item, and it contributed the
same failing item to the treatment build, because a color token fails the same
way regardless of who applies it.

The other fourteen were accessible names, exposed state, sort state, tab
structure, modal focus behavior, input labels, error association, focus
indicators, headings, a bypass mechanism, slider naming, and autocomplete. Not
one of those is a thing a Figma file can supply.

### The example worth remembering

Both builds sort the table correctly and both show the direction visually. The
control's column buttons are named "Order", "Date" and "Total", and those names
never change. The treatment's read "Order number, not sorted. Activate to change
sort", and after activation, "Order number, sorted ascending. Activate to change
sort."

Same design system. Same feature. Same visual result. One of them tells a screen
reader user what the table just did. No color palette could have decided that
either way.

---

## Where this study contradicts itself, and the toolkit

**Text contrast failed in both arms**, and every failing pairing in both builds
is a Prime token pair rather than a builder invention. The treatment caught two
of three and moved to a darker step. It missed the skip link, which is only
visible on focus. The guidance reduced inherited contrast defects, it did not
eliminate them.

**Reflow failed in both arms.** Both builds scroll horizontally at 320 CSS
pixels wide.

**Text spacing is worse in the treatment arm.** Applying the text spacing
overrides clips content in 13 elements in the treatment build and zero in the
control build. That is a regression caused by the denser layout the guidance
encouraged, and it is not fixed.

**Half the raw scanner output was noise.** The engine reported 11 violations
against the treatment build. All 11 were checked against Chrome's real
accessibility tree and all 11 were false positives, ten of them names that the
tree resolves correctly and one a skip link sitting exactly where a skip link
belongs. A team reading scanner totals alone would have reached the wrong
conclusion about which build was better.

**The pre-registration was wrong in two places.** Target size was predicted to
fail as inherited and passed in both arms, because neither builder reproduced
Prime's sub-24 pixel pagination dots and both wrapped their checkboxes in labels.
Focus visibility was predicted contested and was clearly introduced. Recording
predictions before the builds is what makes it possible to say they were wrong.

---

## What this does not show

- One build per arm. No statistical claim is made. A single trial shows that a
  difference of this size can happen, not how often.
- One model built both arms. This describes that model's behavior with and
  without the guidance, not every model's.
- No screen reader was used. Findings describe the accessibility tree, not what
  any particular assistive technology announces.
- 29 rubric items is not WCAG. 26 of 29 is not conformance.
- The author of this study wrote the toolkit used in the treatment arm. The
  mitigation is pre-registration, publication of both builds and all measurement
  code, and reporting every item where the treatment failed or regressed.

---

## Reproducing it

```
design-system-baseline/
  CEILING.md               all 55 A and AA criteria classified, with reasoning
  BASELINE.md              Prime 4.0 free, measured
  VERSIONS.md              4.0, 5.0, 5.1, 5.2 and 6.0 compared
  BRIEF.md                 the product brief both agents received
  DESIGN-SYSTEM-6.0.md     the measured spec both agents received
  RUBRIC.md                scoring and attribution rules, written first
  RESULTS.md               item by item scoring
  control/index.html       built from the brief and the spec alone
  treatment/index.html     built from the brief, the spec, and the toolkit
  data/                    every measured value, as JSON
  harness/                 extraction, contrast, and measurement code
```

```bash
npm i playwright accessibility-checker
node harness/scan.js        # engine scan, both arms
node harness/attribute.js   # contrast failures mapped back to Prime tokens
node harness/rubric.js      # structural measurements
node harness/measure2.js    # reflow, text spacing, modal, slider
python3 harness/compare.py  # palette comparison across versions
```

The two builds and their `NOTES.md` files are published exactly as the agents
produced them, including their punctuation, which does not follow the style
rules used elsewhere in this repository. They are evidence rather than guidance,
so they have not been edited after the run.

The Figma extraction scripts need a Figma API token and licensed copies of the
files. The measured output they produce is in `data/`, so every conclusion above
can be rechecked without buying anything.

---

## Credit

Prime is by Thalion, [primedesignsystem.com](https://primedesignsystem.com/).
The free 4.0 community file is licensed CC BY 4.0. The paid releases were
purchased for this study. This work reproduces measured values and findings
only, and no source artwork or components.

Written by Dana Randall. Licensed CC BY 4.0, consistent with the rest of this
repository.
