# Pre-registered scoring rubric

Written and committed before either build was generated. Sixteen binary checks, scored identically for both arms. Each is worth one point. Partial credit is not given.

Every check is tied to the WCAG 2.2 criterion it maps to, and to the specific instruction in `BRIEF.md` that creates the risk. **AUTO** means a browser-based scanning engine can find the failure. **MANUAL** means it cannot, and a human has to read the code or drive the DOM.

| # | Check | Pass condition | Brief instruction that creates the risk | WCAG | Detection |
| --- | --- | --- | --- | --- | --- |
| 1 | Inputs have real labels | Every input has a `<label>`, `aria-label`, or `aria-labelledby`. Placeholder alone fails | "use the placeholder text inside each field to say what it is" | 3.3.2 | AUTO |
| 2 | Slider named and readable | The hydration `range` has an accessible name, and its current value is available to assistive tech, not only painted next to it | "Hydration is a slider" | 1.3.1, 4.1.2 | AUTO |
| 3 | Stepper buttons named | The minus and plus buttons have accessible names that say what they change, not bare glyphs | "a small round minus button and a small round plus button" | 4.1.2 | AUTO |
| 4 | Stepper targets big enough | Minus and plus each measure at least 24 by 24 CSS pixels, or have adequate spacing exemption | "Keep those buttons small and neat" | 2.5.8 | MANUAL |
| 5 | Live results announced | Recalculated totals sit in a live region, or are otherwise announced without moving focus | "The results recalculate instantly. No submit button" | 4.1.3 | MANUAL |
| 6 | Breakdown is a real table | Uses `<table>` with `<th>` and a resolvable header association, or an equivalent grid role with headers. A stack of `div`s fails | "Show the four ingredients as a clean table" | 1.3.1 | AUTO |
| 7 | Hydration warning not color alone | The above-85 warning is carried by text, not only by red type and a glyph | "show the hydration number in red" | 1.4.1 | MANUAL |
| 8 | Warning icon handled | The warning triangle is `aria-hidden="true"` with adjacent text, or carries its own text alternative | "put a small warning triangle next to it" | 1.1.1 | AUTO |
| 9 | Errors identified in text | Out-of-range fields set `aria-invalid` and expose a text message describing the problem | "turn that field red so they can see which one needs fixing" | 3.3.1 | MANUAL |
| 10 | Reduced motion honored | A `prefers-reduced-motion` block disables the count-up animation and the toast slide | "animate them so they count up smoothly", "smooth transitions" | 2.3.3 | MANUAL |
| 11 | Segmented control state exposed | Loaf weight presets expose `aria-pressed`, or use radio semantics. Class-only selection fails | "The selected preset should look clearly different" | 4.1.2 | AUTO |
| 12 | Disclosure state exposed | The advanced section toggle exposes `aria-expanded`, or uses `<details>` | "stays collapsed behind a small toggle" | 4.1.2 | AUTO |
| 13 | Icon-only buttons named | Reset and print each have an accessible name | "an icon-only button resets everything", "another icon-only button prints" | 4.1.2 | AUTO |
| 14 | Toast announced | The save confirmation is in a live region so it is not silent | "a toast slides in at the bottom to confirm it saved" | 4.1.3 | MANUAL |
| 15 | Focus visible | A visible focus style exists. `outline: none` with no replacement fails | "Avoid heavy outlines and boxy chrome" | 2.4.7 | MANUAL |
| 16 | Secondary text contrast | The light gray secondary text reaches 4.5:1 against its own background, in both themes | "Use a light gray for the secondary gram text" | 1.4.3 | MANUAL |

Eight checks are machine detectable. Eight are not.

## Also recorded, not scored

- IBM Equal Access violation count and potential-violation count, same engine and settings for both arms.
- Smallest interactive target in CSS pixels, and the count of interactive elements under 24 by 24.
- Computed contrast ratios for every foreground and background token pair in both themes.
- Lines of code, as a rough proxy for whether the accessible version costs meaningfully more effort.
- **Math correctness**, checked against the worked example in the brief. Recorded separately so that a build is not rewarded or punished on accessibility for getting the arithmetic wrong.

## Scoring conditions

- Both arms receive the identical `BRIEF.md`. Neither brief mentions accessibility, and no check in this rubric is hinted at in the brief.
- The control receives the brief and nothing else.
- The treatment receives the brief plus the toolkit installed the way a real user installs it: `ACCESSIBILITY.md` in the project root with an `AGENTS.md` pointing at it.
- Same model, same runtime, same output paths, same file names.
- Neither arm is told it is being scored, and neither is shown this rubric.
- Both are bundled and rendered by the identical harness, then scanned with the same engine.

## Relationship to the first test

This is an independent replication of `research/preventive-test`, run in a different domain with a different trap set and a different build target. The first test was an internal developer tool with an icon grid. This one is a consumer-facing calculator with live numeric output, form validation, and a data table, which exercises criteria the first test did not reach, specifically 3.3.1, 1.4.3, 2.5.8, and 1.3.1 table semantics.

The toolkit version under test is **1.14**, the release published on 2026-07-31.
