# Research

Evidence behind the claims in [ACCESSIBILITY.md](../ACCESSIBILITY.md).

The toolkit tells you what to do. This folder is where I try to show that following it changes the outcome, and where I record the places it did not. The first three studies were run in July 2026, against versions 1.11, 1.12, and 1.14 of the file. The fourth and fifth were run in August 2026, against versions 1.15 and 1.16.

Every number below is reproducible from the artifacts in this folder. Where a result is unflattering to the toolkit, it is reported at the same length as the results that flatter it.

| Study | Question | Result |
| --- | --- | --- |
| [1. Field audit](1-field-audit/README.md) | Does the toolkit find real defects in production code? | 9 findings, 7 already covered by the rules |
| [2. Icon browser](2-icon-browser/README.md) | Does it change what an AI builds? | 6 of 16 without, 15 of 16 with |
| [3. Dough calculator](3-dough-calculator/README.md) | Does it hold in a different domain? | 10 of 16 without, 15 of 16 with |
| [4. Design system ceiling](4-design-system-ceiling/README.md) | How much can a design system do for you? | 13 of 29 without, 26 of 29 with. A design kit settles 3 of 55 criteria |
| [5. Figma Make and Figma Design](5-figma-make/README.md) | Does it work in a design tool, not a code editor? | Build: 8 of 16 without, 14 of 16 with. Design file: 1 of 3 without, 3 of 3 with |

---

## 1. Field audit: does the toolkit find real defects?

**[1-field-audit/README.md](1-field-audit/README.md)**

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

**[2-icon-browser/README.md](2-icon-browser/README.md)**

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

Every study folder follows the same shape.

```
<study>/
  README.md             the study itself, method and findings
  BRIEF.md              the brief both agents received, reproduced verbatim
  RUBRIC.md             the checks, written before either build existed
  control/              built from the brief alone
  treatment/            built from the brief plus the toolkit
  harness/              build, scan and measurement scripts
  data/                 raw engine, DOM and contrast output
```

Study 1 is an audit rather than a two-arm build, so it is a README alone. Every
harness script resolves paths relative to its own study folder, so a fresh clone
runs without editing anything.

`BRIEF.md` is published exactly as it was given to both agents, including its punctuation, which does not follow the style rules used elsewhere in this repository. It is evidence rather than guidance, so it has not been edited after the run.

The same applies to `3-dough-calculator/BRIEF.md`, and to everything the agents themselves produced in every study: the build source in each `control/` and `treatment/` directory, and the `NOTES.md` files in study 4. Those carry the models' own punctuation and spelling, including em dashes and British forms that appear nowhere in the authored files. Normalizing them would mean editing the evidence.

One more record is left as published rather than corrected. `2-icon-browser/README.md` and `2-icon-browser/RUBRIC.md` use British spellings throughout. The rubric was pre-registered before study 2 was run, so rewriting it afterward would quietly change a document whose whole value is that it was fixed in advance. The results file is left to match it.

```bash
npm i react@18 react-dom@18 esbuild
node harness/build.mjs
python3 -m http.server 8099 --directory dist
node harness/scan.js        # needs playwright and accessibility-checker
python3 contrast.py
```

---

## 3. Replication: does the result hold in a different domain?

**[3-dough-calculator/README.md](3-dough-calculator/README.md)**

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

**[4-design-system-ceiling/README.md](4-design-system-ceiling/README.md)**

The first three studies ask what changes when an AI has the toolkit. This one asks a question that comes before it: if a team already builds on a well made design system, how much of the work is done for them?

The question hides two things inside one phrase. A design system is a file, static until somebody builds with it. Design is a practice, and it decides heading hierarchy, error text, focus order and how a state is signaled. This study measures the ceiling of the file. It is not a claim about the practice, and the build results point the other way, because most of what went wrong in the unguided build was decided, or left undecided, before any code existed.

First, a classification of all 55 WCAG 2.2 Level A and AA criteria by what a design artifact can actually reach.

| | Determines | Influences | Cannot affect |
| --- | --- | --- | --- |
| A Figma design kit | 3 | 14 | 38 |
| A coded component library | 4 | 32 | 19 |

At Level A, a Figma design kit determines **zero** of 31 criteria. The three it determines anywhere are 1.4.3, 1.4.11 and 2.5.8. Palette and sizes. It influences fourteen more, so an artifact touches 17 of the 55 and settles 3.

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

## 5. Design tools: does it work outside a code editor?

**[5-figma-make/README.md](5-figma-make/README.md)**

Studies 2 through 4 all run coding agents in a sandbox. That is the narrowest part of the toolkit's stated scope, and it left the design tool guidance untested. This study runs the same paired design in Figma, using the skill as Figma actually loads it: a single file custom skill, invoked as `/ai-a11y-toolkit`, published on the [Figma Community](https://www.figma.com/community/skill/76094/ai-a11y-toolkit-wcag-22-aa).

Two arms in two surfaces. Figma Make produces a running build, so it can be scored on the full rubric. Figma Design produces a static file, so it can only be scored on what a static file reaches.

**Figma Make, both arms published and measured live:**

| | Control | Treatment |
| --- | --- | --- |
| Rubric score | 8 of 16 | 14 of 16 |
| Engine violations, raw | 62 | 4 |
| Engine violations, hand verified | about 18 | 2 |
| Landmarks | 0 `header`, 0 `main` | Complete |
| Real links, `a[href]` | **0 of 17 controls** | 13 of 14 tab stops |
| `prefers-reduced-motion` | 0, against 26 animated elements | Present |

The control's most instructive failure is that it built the entire navigation out of `button` elements and shipped zero links on the page. A single missing `main` produced 33 of its 62 engine findings on its own.

**Figma Design, same prompt, same file, scored only on the three criteria a design file determines:**

| Criterion | Control | Treatment |
| --- | --- | --- |
| 1.4.3 Text contrast | 19 of 47 pairings pass | 40 of 41 pairings pass |
| 1.4.11 Non-text contrast | Passes | Passes |
| 2.5.8 Target size, 44px | 0 of 6 buttons | 9 of 9 controls |

That is 1 of 3 against 3 of 3, and it is a deliberately narrow result rather than another 20 check number. It is also the ceiling classification from study 4 tested from the other side. The control failed the criterion a design file most directly controls, 1.4.3, twenty-eight times, and left every criterion a design file cannot reach in exactly the same unrecorded state as the treatment. Neither arm recorded alt text, heading levels, or reading order. A file cannot annotate itself, which is the argument for design review rather than against it.

Three findings cut against the toolkit.

The **nav links failed in both arms**, at 17px tall in the design file and in both builds. That is now a confirmed gap in the guidance rather than a one-off.

The control **wrote five good, specific alt texts unprompted**, which continues the trend from study 3. Image naming is no longer differentiating value and the toolkit should stop claiming it.

Two genuine treatment findings are in **neither the rubric nor the toolkit**: an hours table with a `caption` and no `th`, and an `aria-label` on a `p` element, which is silently discarded. Both are queued for the next release.

The study also produced two reusable method corrections, both of which had me reporting wrong numbers before I caught them. A programmatic `.focus()` does not match `:focus-visible`, so it shows no focus ring where a real `Tab` press shows one. And computed style contrast is wrong on these builds, because the engine cannot composite alpha over photography, which made about 6 of the control's 20 reported contrast violations false. In the design file, `strokeWeight` alone cannot distinguish a border from a divider, and reading `individualStrokeWeights` removed four boundary failures I had wrongly scored against the control.

---

## What these studies do not show

- **One brief, one component, one run per arm.** Run-to-run variance is unmeasured. The gap is large but a single pair of builds cannot separate the toolkit's effect from sampling noise with statistical confidence. Study 3 replicates the direction in a second domain, which is weak replication, not proof.
- **No screen reader was used.** The announcement findings describe what the accessibility tree contains, not what any particular assistive technology says.
- **One model family, and agents in a sandbox rather than a developer working interactively in an editor.**
- **React and plain CSS, plus one design tool.** Study 5 covers Figma Make and Figma Design. Nothing here tests the guidance for plain HTML, no-code platforms, or AI-generated content.
- **The rubric is mine.** Written before the builds and applied identically to both, but I designed the rules and the test of the rules.
- **Sixteen checks is not WCAG.** Fifteen of sixteen is not conformance, and neither document should be read as a conformance claim.

The most useful thing anyone could do with this folder is run it again with a different model, a different brief, and their own rubric. If the gap does not reproduce, please [open an issue](https://github.com/danarandall/ai-a11y-toolkit/issues) and say so.

---

Licensed CC BY 4.0, consistent with the rest of the repository.
