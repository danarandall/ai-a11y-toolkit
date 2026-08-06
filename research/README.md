# Research

Evidence behind the claims in [ACCESSIBILITY.md](../ACCESSIBILITY.md).

The toolkit tells you what to do. This folder is where I try to show that following it changes the outcome, and where I record the places it did not. The first three studies were run in July 2026, against versions 1.11, 1.12, and 1.14 of the file. The fourth was run in August 2026 against version 1.15.

Every number below is reproducible from the artifacts in this folder. Where a result is unflattering to the toolkit, it is reported at the same length as the results that flatter it.

---

## 1. Field audit: does the toolkit find real defects?

**[level-icons-audit.md](level-icons-audit.md)**

An accessibility audit of a production application that was built with AI tooling and without the toolkit installed. WCAG 2.2 Level AA, three automated engines, with every reported finding hand-verified in the live DOM.

Nine findings. Seven of them map directly to rules that were already in the toolkit. The remaining two, sub-3:1 border tokens and a total absence of reduced-motion handling, were found by reading the rules and checking by hand. No engine reported either one.

The result that changed the toolkit most was a disagreement between the engines on the same page at the same moment:

| Engine | Findings on the home route |
| --- | --- |
| Pa11y with HTML CodeSniffer, WCAG2AA | 0 |
| IBM Equal Access | 403 violations, 715 potential |
| Level Access Access Engine | 321 instances |

The zero was not a pass. That ruleset contains no rule for unnamed graphics, so it will report zero for that defect on every page, forever, and it looks identical to a clean result. Section 14.3 of the toolkit exists because of this.

The live URL and the working account handle are withheld, because the application's only access control is a handle string and publishing both would amount to publishing a credential. Everything technical is intact.

---

## 2. Controlled test: does the toolkit change what an AI builds?

**[preventive-test/RESULTS.md](preventive-test/RESULTS.md)**

The audit above tests the toolkit as a checklist applied to finished code. That is not the claim the toolkit makes. The claim is preventive: install it, and the AI builds accessibly in the first place.

Two AI coding agents, one identical product brief, same model, same runtime, same output contract. Neither brief mentioned accessibility. The only difference was `ACCESSIBILITY.md` in the treatment project root with an `AGENTS.md` naming it as binding. The rubric was written before either build was generated.

| | Control | Treatment |
| --- | --- | --- |
| Rubric score | 6 of 16 | 15 of 16 |
| Engine violations | 39 | 15 |
| Unnamed SVGs exposed | 12 of 12 | 0 of 27 |
| Targets under 24 by 24 px | 12 | 0 |
| Non-text pairs failing 3:1 | 6 of 6 | 6 of 10 |
| Lines of code | 830 | 1,118 |

Five of the nine checks the control failed are ones **no automated engine can detect**. That is the part worth arguing about, because it is the part a linter would not have given you.

One check failed in both arms. The treatment defined a border token at 1.4:1 against the surface it sits on, and used it as the boundary of a text input, while its own summary claimed the palette had been contrast-checked. It had genuinely verified the focus ring at 7:1 and missed the border beside it. An AI reporting that it followed your accessibility rules is not evidence that it did.

### Reproducing it

```
preventive-test/
  BRIEF.md              the brief both agents received, reproduced verbatim
  RUBRIC.md             sixteen checks, written before either build existed
  control/src/          built from the brief alone
  treatment/src/        built from the brief plus the toolkit
  harness/build.mjs     bundles both arms with an identical HTML shell
  harness/scan.js       renders, measures the DOM, runs the engine
  contrast.py           computes the non-text contrast ratios
  scan-results.json     raw engine and DOM output for both arms
```

`BRIEF.md` is published exactly as it was given to both agents, including its punctuation, which does not follow the style rules used elsewhere in this repository. It is evidence rather than guidance, so it has not been edited after the run.

The same applies to `preventive-test-2/BRIEF.md`.

```bash
npm i react@18 react-dom@18 esbuild
node harness/build.mjs
python3 -m http.server 8099 --directory dist
node harness/scan.js        # needs playwright and accessibility-checker
python3 contrast.py
```

---

## 3. Replication: does the result hold in a different domain?

**[preventive-test-2/RESULTS.md](preventive-test-2/RESULTS.md)**

The same design as study 2, run against version 1.14 in a different domain with a different trap set: a consumer-facing baker's percentage calculator with live numeric output, form validation, a slider, and a data table. Those exercise criteria the first test never reached, specifically 3.3.1, 1.4.3, 2.5.8, and table semantics under 1.3.1.

| | Control | Treatment |
| --- | --- | --- |
| Rubric score | 10 of 16 | 15 of 16 |
| Engine violations | 22 | 3 |
| Failing text pairs, light theme | 23 of 33 | 3 of 33 |
| Failing text pairs, dark theme | 10 of 33 | 0 of 33 |
| Targets under 24 by 24 px | 2 | 0 |
| `prefers-reduced-motion` blocks | 0 | 3 |
| Lines of code | 1,212 | 1,410 |

The direction replicated. The interesting part is that **the control scored four points higher than the control in study 2**, and every one of those points was on a machine-detectable check. It named all ten buttons including both icon-only ones, labeled all five inputs, hid all five decorative SVGs, and built a real table with scoped headers, none of which it was asked to do. Split by detection method, the control scored 7 of 8 on the automated checks and 3 of 8 on the ones no engine can see.

The baseline has moved. Models have absorbed the failures that automated tooling has flagged publicly for a decade. What has not improved is everything a scanner never flagged, because there was never a corpus of corrections to learn from. The toolkit's differentiating value has shifted accordingly, away from naming and toward contrast, state exposure, meaning not carried by color, and announcement discipline.

The treatment lost the same check both arms lost: a second, dimmer text token used in exactly one place, at 3.16:1. It also introduced two problems no check caught, one of which the toolkit caused, by instructing the model to add a live region without saying how to govern one. Version 1.15 exists because of that finding.

---

## 4. Ceiling: how much of this can a design system do for you?

**[design-system-baseline/README.md](design-system-baseline/README.md)**

The first three studies ask what changes when an AI has the toolkit. This one asks a question that comes before it: if a team already builds on a well made design system, how much of the work is done for them?

First, a classification of all 55 WCAG 2.2 Level A and AA criteria by what a design artifact can actually reach.

| | Determines | Influences | Cannot affect |
| --- | --- | --- | --- |
| A Figma design kit | 3 | 14 | 38 |
| A coded component library | 4 | 32 | 19 |

At Level A, a Figma design kit determines **zero** of 31 criteria. The three it determines anywhere are 1.4.3, 1.4.11 and 2.5.8. Palette and sizes. Nothing else.

Then a measurement of a real system to test the classification, using the Prime design system by Thalion, read directly from licensed source files through the Figma API across five releases. The palette turns out to be identical across 5.0, 5.1, 5.2 and 6.0, and carefully tuned: every base step sits just above 3:1, and six families land on exactly 4.50:1 one step down. It is contrast engineered. It also still puts white text on a 4.48:1 primary button in the current paid release, and drops to 3.16:1 on hover and focus.

Then the same two-arm build as studies 2 and 3, both arms given the measured Prime 6.0 specification.

| | Control | Treatment |
| --- | --- | --- |
| Rubric score | 13 of 29 | 26 of 29 |
| Engine violations | 22 | 11 |
| Engine violations, hand verified | 22 | 0 |

The control failed 16 items. **One** was inherited from the design system. Fourteen were names, state, focus, errors, headings and bypass, none of which a Figma file can supply.

Two results cut against the toolkit. Text contrast failed in **both** arms, and every failing pair in both is a Prime token pair, so the guidance reduced inherited contrast defects without eliminating them. And the text spacing overrides clip 13 elements in the treatment build against zero in the control, which is a regression the guidance caused and did not catch.

All 11 engine violations reported against the treatment arm were false positives when checked against the real accessibility tree. Roughly half the raw scanner output in this study was noise.

---

## What these studies do not show

- **One brief, one component, one run per arm.** Run-to-run variance is unmeasured. The gap is large but a single pair of builds cannot separate the toolkit's effect from sampling noise with statistical confidence. Study 3 replicates the direction in a second domain, which is weak replication, not proof.
- **No screen reader was used.** The announcement findings describe what the accessibility tree contains, not what any particular assistive technology says.
- **One model family, and agents in a sandbox rather than a developer working interactively in an editor.**
- **React and plain CSS only.** Nothing here tests the guidance for plain HTML, no-code platforms, design tools, or AI-generated content, which together are most of the toolkit's stated scope.
- **The rubric is mine.** Written before the builds and applied identically to both, but I designed the rules and the test of the rules.
- **Sixteen checks is not WCAG.** Fifteen of sixteen is not conformance, and neither document should be read as a conformance claim.

The most useful thing anyone could do with this folder is run it again with a different model, a different brief, and their own rubric. If the gap does not reproduce, please [open an issue](https://github.com/danarandall/ai-a11y-toolkit/issues) and say so.

---

Licensed CC BY 4.0, consistent with the rest of the repository.
