# Changelog

## 2026.08

### Updated 14 August 2026, no change to file version

A fifth study and the documentation corrections it forced. No rules changed in `ACCESSIBILITY.md`. Method, measurements, and both pairs of arms in [research/5-figma-make](research/5-figma-make/README.md).

- **New study 5, the toolkit in a design tool rather than a code editor.** Four arms: a paired Figma Make build, control and treatment, and a paired Figma Design file, control and treatment. Make scored 8 of 16 without against 14 of 16 with. The design files scored 1 of 3 without against 3 of 3 with, on the three criteria a static file determines. This is the first study to test the design tool half of the toolkit's stated scope, which the first four did not reach.
- **The Figma skill is published on the Figma Community** as [AI A11y Toolkit: WCAG 2.2 AA](https://www.figma.com/community/skill/76094/ai-a11y-toolkit-wcag-22-aa), invoked as `/ai-a11y-toolkit`. Study 5 used the published skill rather than a local file, so it tests what a reader would actually install.
- **Corrected the install guidance in `README.md` and `skills/README.md`.** Three claims were wrong. Figma has no route that loads the folder build, because it does not support the `references/` subfolder that build depends on. Figma custom skills and Figma skills for MCP are two different things that share a word, and the MCP kind installs into your coding agent rather than into Figma. Figma Make was listed among chat based builders that read a file from the project, which it does not. Adds the Community link, the upload steps, the slash command, that a skill stays available across all your files, and the seat and edit access requirements.
- **Separated the two Figma surfaces, which had been collapsed into one instruction.** A Figma Design file has no guidelines folder, so a custom skill is the only route into it. Figma Make has both, and its `guidelines` folder in Code view accepts uploaded markdown with no stated size limit, so it takes the full 167 KB `ACCESSIBILITY.md` rather than the condensed 55 KB skill. `START-HERE.md` had documented the Make guidelines route correctly since release, but `README.md` and `skills/README.md` named only the skill, which understated what a Make user can install. `START-HERE.md` now has a Figma Design section, which it had been missing, and its file table lists both skill builds.
- **Removed an unsupported claim from `START-HERE.md`.** It said Figma Make always reads `Guidelines.md` first. Figma documents no read order between files in that folder, and its actual guidance is to state in your own guidelines how Make should use multiple files. Both Figma sections were rechecked against the live documentation in August 2026.
- **Stated a limit of study 5 that had gone unrecorded.** The Make treatment used the custom skill, so the 14 of 16 result measures the condensed build. The guidelines route carrying the full reference is untested, and is plausibly stronger, so that score is not a ceiling for the toolkit in Make.
- **Three findings that cut against the toolkit,** recorded at the same length as the results that favor it. Navigation links failed the 44px target size standard in every arm of study 5, in both design files and both builds, which makes it a confirmed gap in the guidance rather than a one-off. The unguided control wrote five specific, correct alt texts with no prompting, continuing the trend first seen in study 3, so image naming should stop being described as differentiating value. And two genuine defects in the treatment build appear in neither the rubric nor the toolkit: a table with a `caption` and no `th`, and an `aria-label` on a `p` element, which is silently discarded. Both are queued for the next release.
- **Two method corrections, both of which had produced wrong numbers before they were caught.** A programmatic `.focus()` does not match `:focus-visible`, so it reports no focus ring where a real key press shows one. Computed style contrast is unreliable on these builds, because the engine cannot composite alpha over photography, which made roughly 6 of the control's 20 reported contrast violations false. In design files, `strokeWeight` alone cannot distinguish a component boundary from a decorative divider, and reading `individualStrokeWeights` removed four boundary failures that had been wrongly scored against the control.
- **Corrected one claim in the earlier design file audit.** It credited the treatment with a descriptive image layer name, "Baker hand-shaping our signature Country Sourdough." That is a visible caption, a text layer whose name defaults to its own content, and is not attached to an image. Neither design arm recorded alt text.

### Updated 7 August 2026, file version 1.16

Changes driven by a fourth study, which asks a question that comes before the first three: if a team already builds on a well made design system, how much of the work is already done for them? Method, measurements and both builds in [research/4-design-system-ceiling](research/4-design-system-ceiling/README.md).

- **Section 12 rebuilt around adopting a design system.** It was the thinnest section in the file and the one most exposed to a belief that turns out to be measurably wrong. Adds the classification of all 55 WCAG 2.2 Level A and AA criteria by what a design artifact can reach, which is 3 determined and 14 influenced, and none of the 31 at Level A. Adds the practical consequences: measure the palette you inherited rather than trusting the claim attached to it, check hover, focus and active rather than only the resting state, and treat the kit as a floor for three things and evidence of nothing else.
- **New guidance in Section 12 on tokens.** Record the measured ratio on the token rather than the intent behind it. Names persist across releases while values move underneath them.
- The distinction between a design system, which is a file, and design, which is a practice, is now stated explicitly. The ceiling result describes the reach of an artifact. It is not an argument that accessibility work in design matters less, and the study's own build results point the other way.
- American spellings completed. The 1.15 note claimed this was applied across the repository; four files still carried British forms and now do not. The study 1 record in `research/2-icon-browser` is left as published, since it is a pre-registered document.

## 2026.07

### Updated 31 July 2026, file version 1.15

Changes made after a second controlled A/B build test, this one against a consumer-facing calculator with live numeric output, a slider, form validation, and a data table. Full method and results in [research/3-dough-calculator](research/3-dough-calculator/README.md). Every addition below comes from a defect that test surfaced, including two the toolkit itself caused.

- **New in Section 11, live regions on a continuously changing value.** Version 1.14 told models to announce dynamic changes through a live region. It did not say how to govern one. The test build did exactly as instructed and produced a region that rewrites a full sentence on every slider step, which queues up to fifty announcements during one drag and is worse for the user than silence. Adds a settle-delay pattern, `aria-atomic` guidance, and the list of surfaces this applies to. This failure passes every automated engine, because the markup is correct.
- **New in Section 10, range inputs and sliders.** `aria-valuetext` was absent from the file entirely, so a hydration slider announced "75" with no unit in both arms of the test. Also covers the difference between styling a range's track and sizing the input itself: the control build shipped a slider whose input box was six pixels tall, which fails 2.5.8 while looking correct on screen.
- **New in Section 7.8, a sixth step in the token audit.** The previous guidance was framed around border and input tokens under 1.4.11. Palettes usually carry more than one dimmed text token, and the fainter of the two, used for column headers, hints, and captions, is the one nobody measures. In the test it was the single check the accessible build still failed, at 3.16:1.
- **New in Section 3, animated and counting numbers.** Counting a number up is one of the most common flourishes in AI-generated interfaces and fails in two directions at once: it is motion with no reduced-motion path, and it is a changing value inside a live region.
- **Seven new rows** in the Section 17 table of common AI-generated failure patterns.
- Matching directives added to the Section 2 agent block, the Section 9 designer checklist, and `ACCESSIBILITY-CORE.md`.
- American spellings applied consistently across the repository.

### Updated 31 July 2026, file version 1.14

- **Section 9 rebuilt** around the Accessible Design Framework, with thanks to Karen Hawkins, whose heuristics guide informed the structure. Adds the argument that design annotation changes role rather than disappearing as AI takes over more of the build.

### Updated 27 July 2026, file version 1.12

Changes made after field-testing the toolkit against a production application that was built entirely with AI tooling. Every addition below comes from a defect the trial actually surfaced.

- **New in Section 14.3, proving a scan ran.** A scanner reports on whatever was in the DOM when it looked, so gates, hash routing, async data, and lazy rendering can all produce a clean result from a page that was never examined. Adds assertions, a minimum rendered-character check, and guidance on why a zero result is a question rather than an answer.
- **New in Section 11, injected markup.** `dangerouslySetInnerHTML`, `v-html`, `{@html}`, and `innerHTML` are invisible to `eslint-plugin-jsx-a11y` because linting reads source, not runtime strings. Adds a normalize-at-the-boundary pattern. One injection site in the trial produced 321 unnamed graphics on a single page.
- **New in Section 7.8, auditing color tokens as data.** Contrast review done by looking at screens misses failing borders and inputs. Adds a procedure that separates the 4.5:1 text criterion from the 3:1 non-text criterion in 1.4.11, and checks every theme. Three engines reported none of the six failing tokens found in the trial.
- **Five new rows** in the Section 17 table of common AI-generated failure patterns.
- Matching condensed guidance added to `ACCESSIBILITY-CORE.md`.

### First public release

- `ACCESSIBILITY.md`, the full WCAG 2.2 Level AA reference in 18 sections
- `ACCESSIBILITY-CORE.md`, condensed for fields with character limits
- `START-HERE.md`, install and prompting guide for 15 AI platforms

Platform instructions verified against each tool's published documentation in July 2026. If a step no longer matches what you see, please open an issue.
