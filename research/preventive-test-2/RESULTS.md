# Preventive test 2: results

**Question.** Does installing the AI A11y Toolkit in a project change what an AI coding agent builds, when nobody in the loop mentions accessibility?

**Design.** Two builds of the same product from the same brief, same model, same runtime. The control gets the brief and nothing else. The treatment gets the brief plus `ACCESSIBILITY.md` in the project root and an `AGENTS.md` pointing at it, which is how a real user installs the toolkit. Both were scored against a rubric written and committed before either build existed.

**Toolkit version under test:** 1.14, published 2026-07-31.
**Date run:** 2026-07-31.
**Result: control 10 of 16. Treatment 15 of 16.**

---

## 1. What was built

A baker's percentage calculator for a home sourdough bakery. The user sets a number of loaves, a loaf weight, and a hydration percentage, and the tool returns flour, water, starter, and salt in grams. The underlying arithmetic follows the standard baker's percentage method, where flour is always 100% and every other ingredient is expressed relative to it ([Simply Bread](https://www.simply-bread.co/post/bakers-percentages-ratios)).

The brief is at [`BRIEF.md`](./BRIEF.md). It is 90 lines and mentions accessibility zero times. It contains no instance of the words accessibility, WCAG, ARIA, or screen reader. Both arms received a byte-identical copy, verified with `cmp`.

The brief does contain nine ordinary product instructions that each create a specific accessibility risk. They are written the way a founder actually writes a brief, not as traps:

- "use the placeholder text inside each field to say what it is"
- "Hydration is a slider"
- "a small round minus button and a small round plus button... Keep those buttons small and neat"
- "The results recalculate instantly. No submit button"
- "show the hydration number in red... put a small warning triangle next to it"
- "turn that field red so they can see which one needs fixing"
- "animate them so they count up smoothly"
- "The selected preset should look clearly different"
- "Use a light gray for the secondary gram text"

The rubric at [`RUBRIC.md`](./RUBRIC.md) maps each instruction to the criterion it endangers.

## 2. Score

Sixteen binary checks. No partial credit. Eight are machine detectable, eight are not.

| # | Check | WCAG | Detection | Control | Treatment |
| --- | --- | --- | --- | --- | --- |
| 1 | Inputs have real labels | 3.3.2 | AUTO | Pass | Pass |
| 2 | Slider named, value exposed | 1.3.1, 4.1.2 | AUTO | Pass | Pass |
| 3 | Stepper buttons named | 4.1.2 | AUTO | Pass | Pass |
| 4 | Stepper targets at least 24x24 | 2.5.8 | MANUAL | Pass | Pass |
| 5 | Live results announced | 4.1.3 | MANUAL | **Fail** | Pass |
| 6 | Breakdown is a real table | 1.3.1 | AUTO | Pass | Pass |
| 7 | Hydration warning not color alone | 1.4.1 | MANUAL | **Fail** | Pass |
| 8 | Warning icon handled | 1.1.1 | AUTO | Pass | Pass |
| 9 | Errors identified in text | 3.3.1 | MANUAL | **Fail** | Pass |
| 10 | Reduced motion honored | 2.3.3 | MANUAL | **Fail** | Pass |
| 11 | Segmented control state exposed | 4.1.2 | AUTO | **Fail** | Pass |
| 12 | Disclosure state exposed | 4.1.2 | AUTO | Pass | Pass |
| 13 | Icon-only buttons named | 4.1.2 | AUTO | Pass | Pass |
| 14 | Toast announced | 4.1.3 | MANUAL | Pass | Pass |
| 15 | Focus visible | 2.4.7 | MANUAL | Pass | Pass |
| 16 | Secondary text contrast | 1.4.3 | MANUAL | **Fail** | **Fail** |
| | **Total** | | | **10 / 16** | **15 / 16** |

Split by detection method:

| | Control | Treatment |
| --- | --- | --- |
| Machine detectable (8 checks) | 7 | 8 |
| Not machine detectable (8 checks) | 3 | 7 |

The gap is almost entirely in the half a scanner cannot see. That is the finding.

## 3. What the control got right

This matters more than the failures, and it is the largest change from the first test.

The control named everything. Ten of ten buttons had accessible names, including both icon-only buttons, which it labeled "Reset to defaults" and "Print recipe card" without being asked. Five of five inputs had real labels, and zero relied on a placeholder alone, in direct contradiction of the brief's instruction to "use the placeholder text inside each field to say what it is." All five SVGs were `aria-hidden="true"`. The ingredient breakdown was a real `<table>` with three `<th>` elements, all carrying `scope`. The disclosure toggle exposed `aria-expanded`. Focus was visible on all fifteen interactive elements.

The model refused the brief's worst instruction on its own and produced correct semantics for the things that are now well represented in training data.

**The baseline has moved.** In the first preventive test the differentiating value of the toolkit was largely "remember alt text and labels." That value has eroded, because the models got better at exactly the things automated tooling has been flagging publicly for a decade. What did not improve is everything a scanner never flagged, because there was never a corpus of corrections to learn from.

## 4. What the control got wrong

**No announcement of the results (4.1.3).** The control shipped exactly one live region, and it wraps the save toast. The numbers that are the entire point of the product update silently. A screen reader user can change the hydration slider and receive no indication that anything happened.

**The hydration warning is color and icon only (1.4.1).** At 92% hydration the control renders "92%" in red with a warning triangle, and the triangle is correctly `aria-hidden`. There is no text anywhere saying what is wrong. The warning is invisible to anyone not perceiving the red.

**Errors are identified but not described (3.3.1).** Entering 999 loaves sets `aria-invalid` on the field and turns it red. No message appears. The calculator then reports 420,140.2 g of flour and a total dough weight of 899,100.0 g, with no indication that the input was rejected.

**No reduced-motion path at all (2.3.3).** Zero `prefers-reduced-motion` blocks in 656 lines of CSS and zero in the component. The count-up animation on every number and the sliding toast run unconditionally.

**Selection state is a CSS class (4.1.2).** The loaf weight presets show the active choice visually. `aria-pressed` appears zero times. Programmatically, all three buttons are identical.

**Contrast (1.4.3).** 23 of 33 measured text pairs failed in light theme, minimum 2.17:1. Ten failed in dark, minimum 3.2:1. The specific values: `rgb(185,173,156)` on `rgb(255,253,250)` at 2.17:1 for field labels and table headers at 11 to 12px, and `rgb(138,122,104)` on `rgb(255,253,250)` at 4.08:1 for the intro copy and every gram value in the results.

## 5. What the treatment changed

| Measure | Control | Treatment |
| --- | --- | --- |
| IBM Equal Access violations | 22 | **3** |
| Potential violations | 19 | 18 |
| Failing text pairs, light theme | 23 of 33 (min 2.17:1) | **3 of 33** (min 3.16:1) |
| Failing text pairs, dark theme | 10 of 33 (min 3.2:1) | **0 of 33** (min 4.73:1) |
| Headings | 1 | 3 |
| `main` landmarks | 0 | 1 |
| Live regions | 1 (toast only) | 2 |
| `aria-pressed` | 0 | 4 |
| Table headers | 3 `th`, no caption | 7 `th`, caption present |
| Interactive elements under 24x24 | 2 | **0** |
| Smallest target | `input[Hydration]` 554x6 | `button` 44x44 |
| `prefers-reduced-motion` blocks | 0 | 3 |
| Console errors | 0 | 0 |
| Lines of code | 1,212 | 1,410 |

All 22 of the control's hard violations were `text_contrast_sufficient`. The treatment reduced that to 3.

The 6px tall hydration slider is worth isolating. Both arms chose the correct element, a native `<input type="range">`. The control styled the track and left the input itself six pixels tall, which fails 2.5.8 while looking completely normal on screen, because the thumb is drawn larger than its own input. The treatment gave the input a real height.

On the interaction traps, at 92% hydration the treatment renders "Above 85% is a wet, sticky dough that most home bakers find hard to handle." On an out-of-range entry it fires a `role="alert"` reading "Enter a whole number of loaves between 1 and 12."

**Cost.** 1,410 lines against 1,212, a 16% increase, and both arms produced identical correct arithmetic at the default settings: 913.7 g flour, 685.3 g water, 182.7 g starter, 18.3 g salt, 1,800.0 g total. The accessible build was not slower to produce and did not trade away correctness.

## 6. Where the treatment still failed, and what it taught us

The treatment lost one point, and it produced two additional problems that no check caught. These are the useful part of the run, because a test that only confirms the thing works teaches nothing.

**Check 16, secondary text contrast.** The treatment defined two dimmed text tokens. `--color-text-muted: #6f6355` passes comfortably and is used everywhere. `--color-text-faint: #9c8f7d` is used in exactly one place, the breakdown table's column headers at 12px, where it measures 3.16:1 against white and fails. The build even defined a separate dark-theme override for that token, so the author was thinking about theme, and still never checked the light value. The rarest token was the failing one.

**A live region with no announcement discipline.** The treatment put the results in a `role="status" aria-live="polite"` region, which is what the toolkit asked for, and the region holds a full sentence rebuilt on every input event. Dragging the hydration slider from 50 to 100 therefore queues up to fifty sentences. This passes check 5, passes every automated engine, and is worse for the user than the control's silence. The toolkit caused this, by telling the model to add a live region without telling it how to govern one.

**A slider that announces a bare number.** Neither arm set `aria-valuetext`. The hydration control announces "75" with no unit. The toolkit mentioned sliders four times at version 1.14, every time to say do not hand-roll one or to check its target size, and never mentioned `aria-valuetext` at all.

These three findings, plus the control's unguarded count-up animation, were written into toolkit **version 1.15**:

- Section 3 gained guidance on animated and counting numbers, covering both the reduced-motion path and the interaction with live regions.
- Section 7 gained a sixth step in the token audit: count your text tokens and audit the dimmest one hardest.
- Section 10 gained a subsection on range inputs, covering `aria-valuetext` and the difference between styling the track and sizing the input.
- Section 11 gained guidance on live regions bound to a continuously changing value, with a settle-delay pattern.
- Section 17 gained seven new rows.

## 7. Limitations

- **One build per arm.** Generative models are non-deterministic. This is a single sample in each condition, not a distribution. The first preventive test pointed the same direction, which is weak replication, not proof.
- **One model, one domain, one day.** A calculator with numeric output exercises different criteria than a marketing page or a dashboard.
- **The rubric was written by the toolkit's author.** It was committed before either build was generated, and every check is tied to an instruction already present in the brief, but it is not independent.
- **Sixteen checks is not conformance.** A build scoring 16 of 16 here is not WCAG 2.2 AA conformant. These are the criteria this brief put at risk.
- **Manual checks were verified by reading code and driving the DOM, not by screen reader testing.** No assistive technology was used. The announcement findings describe what the accessibility tree contains, not what a specific screen reader says.
- **One inconclusive measurement.** An attempt to count live region mutations during a slider drag returned zero for both arms, which means the observer did not capture them. The announcement-churn finding in Section 6 rests on reading the source, not on that measurement, and the measurement is not cited as evidence.
- **The control failed once on a sandbox timeout** before producing any files, and was rerun. The rerun used the identical prompt and inputs.

## 8. Reproducing this

```
research/preventive-test-2/
  BRIEF.md                 the brief, identical for both arms
  RUBRIC.md                the rubric, committed before either build
  control/src/             control output, unmodified
  treatment/src/           treatment output, unmodified
  harness/build.mjs        esbuild bundling, identical for both
  harness/scan.js          DOM and engine scan
  harness/audit.js         interaction and focus pass
  harness/contrast2.js     contrast measurement, verifies theme before sampling
  scan-results.json        raw scan output
  audit-results.json       raw interaction output
  contrast-results.json    raw contrast output
```

Engine: IBM Equal Access Accessibility Checker (`accessibility-checker` on npm). Browser: Playwright Chromium. Node v20.20.1.

Note on `audit-results.json`: its dark theme contrast section is superseded by `contrast-results.json`. The first pass clicked the theme toggle without verifying the resulting state and measured one arm in the wrong theme. `contrast2.js` reads the rendered background before sampling. The numbers quoted in this document come from `contrast-results.json`.

---

Part of the [AI A11y Toolkit](https://danarandall.com/ai-a11y-toolkit) by Dana Randall. Licensed CC BY 4.0.
