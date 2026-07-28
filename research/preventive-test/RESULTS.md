# Does the AI A11y Toolkit actually change what an AI builds?

A controlled test, 27 July 2026

Author: Dana Randall
Toolkit under test: [AI A11y Toolkit](https://github.com/danarandall/ai-a11y-toolkit) v1.12

---

## Why this test exists

The toolkit had already been field-tested one way: pointed at a finished production application as an audit checklist. That trial found real defects and is written up separately.

But auditing is not the claim the toolkit makes. The claim is preventive. Install the file in your project, and the AI builds accessibly in the first place. That had never been measured.

This test measures it.

---

## Method

Two AI coding agents received an identical product brief and identical technical constraints. Neither brief mentioned accessibility, WCAG, screen readers, or keyboards at any point.

| | Control | Treatment |
| --- | --- | --- |
| Brief | `BRIEF.md` | the same `BRIEF.md`, byte for byte |
| Project root also contained | nothing | `ACCESSIBILITY.md` plus an `AGENTS.md` naming it as binding |
| Instruction to the agent | identical wording for both: read any instruction files in the project root and follow them, then implement the brief | identical |
| Output contract | `src/IconBrowser.tsx` and `src/styles.css`, React 18, TypeScript, plain CSS, no new dependencies | identical |
| Model and runtime | identical | identical |

The brief asked for an icon browser: search, category filters, a grid of icon cards, a light and dark theme switch, per-card copy to clipboard, and a detail overlay. It contained several ordinary product requests that quietly invite accessibility defects, none of them flagged as such:

- icons supplied as **raw SVG strings**, with an explicit instruction to inject them rather than rewrite them as JSX
- a search box that should look **"clean and uncluttered, so keep the chrome minimal"**
- status shown by **colour**: green for stable, amber for beta, red for deprecated
- cards kept **"compact"** so more fit on screen
- **"a subtle lift on hover"** and **"smooth transitions"**
- a **centred overlay panel over a dimmed backdrop**
- a **thin border** on cards

These are the requests a real person writes. Every one of them is a trap, and none of them announces itself.

Both outputs were then bundled by the same harness, served from the same static server, and scanned with the same engine at the same viewport. The HTML shell was byte-identical and deliberately empty, supplying no landmarks and no headings, so every structural element in the results came from the component under test.

Scoring used a sixteen-point rubric written **before either build was generated**. Each check is binary, with no partial credit, and each is marked according to whether an automated engine can detect it.

---

## Headline result

| | Control | Treatment |
| --- | --- | --- |
| **Rubric score** | **6 of 16** | **15 of 16** |
| IBM Equal Access violations | **39** | **15** |
| IBM potential violations | 42 | 31 |
| Unnamed SVGs exposed to assistive technology | **12 of 12** | **0 of 27** |
| Interactive targets under 24 by 24 CSS pixels | **12** | **0** |
| Smallest interactive target | **39 by 17 px** | 32 by 32 px |
| Live regions | 0 | 1 |
| Unique accessible button names | 5, for 16 buttons | 29, for 29 buttons |
| Non-text colour pairs failing 3:1 | **6 of 6** | **6 of 10** |
| Console errors | 0 | 0 |
| Lines of code | 830 | 1,118 |

The accessible version cost about 35 percent more code. It did not cost a second attempt, a correction, or a follow-up prompt.

---

## The full rubric

**AUTO** means a browser-based engine can find it. **MANUAL** means no engine can, and it has to be read out of the code or the DOM.

| # | Check | WCAG | Detect | Control | Treatment |
| --- | --- | --- | --- | --- | --- |
| 1 | Injected SVG neutralised or named | 1.1.1 | AUTO | fail | pass |
| 2 | Injected SVG not focusable | 2.1.1 | MANUAL | fail | pass |
| 3 | Icon card has an accessible name | 4.1.2 | AUTO | pass | pass |
| 4 | Copy buttons distinguishable from each other | 2.4.6 | AUTO | fail | pass |
| 5 | Search input programmatically labelled | 3.3.2 | AUTO | pass | pass |
| 6 | Copy result announced | 4.1.3 | MANUAL | fail | pass |
| 7 | Dialog has a role and a name | 4.1.2 | AUTO | pass | pass |
| 8 | Focus moves into the dialog on open | 2.4.3 | MANUAL | pass | pass |
| 9 | Focus trapped while open, restored on close | 2.4.3 | MANUAL | fail | pass |
| 10 | Escape closes the dialog | 2.1.2 | MANUAL | pass | pass |
| 11 | Toggle state exposed | 4.1.2 | AUTO | fail | pass |
| 12 | Reduced motion honoured | 2.3.3 | MANUAL | fail | pass |
| 13 | Visible focus indicator | 2.4.7 | MANUAL | fail | pass |
| 14 | Status not conveyed by colour alone | 1.4.1 | MANUAL | pass | pass |
| 15 | Non-text contrast reaches 3:1 | 1.4.11 | MANUAL | **fail** | **fail** |
| 16 | Native semantics, no ARIA on bare elements | 1.3.1, 4.1.2 | AUTO | fail | pass |
| | **Total** | | | **6 / 16** | **15 / 16** |

---

## What the control got wrong, specifically

**All twelve injected SVGs landed in the accessibility tree unnamed.** The brief said to inject the raw string, and the control did exactly that. `eslint-plugin-jsx-a11y` would not have caught this, because linting reads source and these are runtime strings. This is the same defect class that produced 321 unnamed graphics in the earlier production audit, reproduced here from a single sentence in a product brief.

**Cards were built as `<div role="button" tabIndex={0}>` with a real `<button>` nested inside.** Nested interactive controls. The engine flagged this twelve times as an invalid descendant.

**All twelve copy buttons had the identical accessible name "Copy".** Listing buttons on this page gives you "Copy" twelve times with nothing to tell them apart.

**The theme control announced itself as "Toggle theme" while displaying the visible text "Dark mode".** The accessible name does not contain the visible label, which is a 2.5.3 failure, and speech users cannot activate it by saying what they see. It also never exposed which theme was active.

**The copy buttons sat at 39 by 17 CSS pixels** and were rendered at `opacity: 0` until the card was hovered, while remaining in the tab order the whole time. Twelve invisible, focusable, undersized controls.

**`outline: none` was applied inside the `:focus-visible` rule for cards**, with the focus indicator replaced by a border colour change alone.

**Not a single `prefers-reduced-motion` block**, despite the brief asking for hover lifts and smooth transitions on the grid and the overlay.

**Twelve text contrast failures**, in the status pills.

The control did get real things right. The search input was properly labelled despite the brief pushing for minimal chrome. The dialog carried `role="dialog"`, `aria-modal`, and an `aria-label`. Escape closed it. Status was given a text label rather than colour alone. A modern model is not starting from zero. It is starting from roughly a third.

---

## The one thing the treatment also got wrong

**Both versions failed non-text contrast on their borders.**

The treatment defined `--color-border` as `#d6dae0`, which is **1.4:1** against the white card it sits on and **1.31:1** against the page. In dark mode, `#3a3f47` on `#1e2126` is **1.52:1**. Its `--color-border-strong` reaches only **2.16:1** light and **2.4:1** dark. WCAG 2.2 SC 1.4.11 requires 3:1, and that border is the boundary of the search input, which is a real control.

Six of its ten non-text pairs fail. The control failed all six of its own.

This matters more than the passing scores, for three reasons.

**It reproduces the production finding exactly.** The earlier audit found six border and input tokens between 1.2:1 and 1.9:1. An entirely separate build, with the rule sitting in the project root, landed in the same range.

**No engine caught it in either arm.** IBM reported zero contrast violations against the treatment. The failure is invisible to automation because engines evaluate rendered text pixels, not the semantic question of whether a boundary is the only thing identifying a control.

**The model believed it had done this correctly.** Its own summary claimed "contrast-checked light/dark palettes". It had genuinely checked the focus ring, which lands at 7.02:1 and 7.8:1, comfortably passing. It checked the thing the rule emphasises and missed the thing next to it. The same summary claimed 44 by 44 pixel targets; the measured smallest was 32 by 32. That still passes SC 2.5.8, which requires 24, but it is not what was claimed.

**An AI's report that it followed your accessibility rules is not evidence that it did.** Measure the output.

Both versions also placed all content outside any landmark, with no `<main>` and no skip link. That is the treatment's remaining 15 engine violations, and it is a straightforward gap.

---

## What this says about the toolkit

**The preventive claim holds.** Same brief, same model, same traps. Six of sixteen without the file, fifteen of sixteen with it. Engine violations fell by 62 percent. Every trap the brief laid deliberately, injected SVG, minimal chrome, colour-coded status, compact cards, hover motion, an overlay, a thin border, was walked into by the control and avoided by the treatment, with one exception.

**The manual rules are doing real work.** Of the nine checks the control failed, **five are MANUAL**: focusable SVG, copy announcement, focus trapping and restoration, reduced motion, and focus visibility. No scanner would have reported any of them. If the toolkit were only restating what a linter already enforces, those five would not have moved. They moved.

**The toolkit reduces defects. It does not eliminate them.** One rubric check failed in both arms, and it failed silently in both. The honest framing is that this is a floor-raiser, not a guarantee, which is what the file itself says in Section 18.

**The conflict directive fires.** The treatment agent hit a genuine contradiction between Section 0, which requires asking about a design system before generating UI, and a brief that fixed the deliverables at two files with no component library. It stopped, named the conflict, and proceeded with a documented decision rather than quietly ignoring one instruction. That behaviour was specified in the file and it happened without prompting.

---

## Limits of this test, stated plainly

- **One brief, one component, one run per arm.** No repetition, so run-to-run variance is unmeasured. A single pair of builds cannot separate the toolkit's effect from ordinary sampling noise with any statistical confidence. The size of the gap is suggestive, not conclusive.
- **The builders were agents in a sandbox, not a developer in Cursor or Claude Code.** The installation was faithful, a root instruction file pointing at `ACCESSIBILITY.md`, but a real IDE session is interactive and iterative in ways this was not.
- **One model family.** A different model may start from a higher or lower baseline.
- **React and plain CSS only.** Nothing here tests the toolkit's guidance for plain HTML, Squarespace, Figma, or AI-generated content, which are three quarters of its stated scope.
- **The rubric is mine.** It was written before the builds and applied identically to both, but I designed both the rules and the test of the rules.
- **Sixteen checks is not WCAG.** Passing fifteen of them is not conformance and this document should not be read as a conformance claim.

---

## Reproducing it

Everything needed to repeat or dispute this is in the workspace: `BRIEF.md`, `RUBRIC.md`, both source pairs under `control/src` and `treatment/src`, the bundling harness, the scan script, and the raw engine output in `scan-results.json`.

The single most useful thing another person could do is run it again with a different model, a different brief, and their own rubric. If the gap does not reproduce, I want to know.

---

Licensed CC BY 4.0, consistent with the toolkit.
