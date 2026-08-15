---
name: ai-a11y-toolkit-review
description: "Measured accessibility review of an existing Figma selection against WCAG 2.2 Level AA. Use this skill whenever someone asks to review, audit, critique, check, evaluate, or QA a frame, screen, component, or flow, and whenever they ask about contrast, tap or target size, color use, focus, reading order, alt text, or readiness for handoff on work that already exists. Computes contrast ratios and target sizes from the node tree rather than by eye, then returns findings ranked from blocking to polish, each with the measured value and a verified fix. Reports only and changes nothing unless asked."
---

# AI A11y Toolkit: Review

A read-only accessibility review of what is selected in a Figma file, measured
against WCAG 2.2 Level A and AA.

This is the review half of the AI A11y Toolkit. The main skill,
`ai-a11y-toolkit`, carries the rules for producing new work. This one measures
work that already exists. Same rule set, opposite direction.

Written by Dana Randall. Licensed CC BY 4.0, free to use commercially, adapt,
and redistribute, with attribution.

The full rule set: https://github.com/danarandall/ai-a11y-toolkit
Current release and feedback: https://danarandall.com/ai-a11y-toolkit

## What a design file can and cannot answer

Do not review a design file as though it can answer every criterion. It cannot.
Sort every observation into one of three buckets and say which bucket it is in.

**Determined by the file. Score these.** Three criteria, and only three, are
settled by the static file itself:

- 1.4.3 Contrast (Minimum)
- 1.4.11 Non-text Contrast
- 2.5.8 Target Size (Minimum)

These are the only criteria that receive a pass or fail in this review. They are
also the cheapest accessibility defects to fix in design and the most expensive
to fix after a build.

**Influenced by the file. Record these, do not score them.** Fourteen criteria
are shaped by design decisions but settled in code: 1.3.4 orientation, 1.4.1 use
of color, 1.4.4 resize text, 1.4.5 images of text, 1.4.10 reflow, 1.4.12 text
spacing, 1.4.13 content on hover or focus, 2.4.7 focus visible, 2.4.11 focus not
obscured, 2.5.7 dragging movements, 3.2.3 consistent navigation, 3.2.4
consistent identification, 3.2.6 consistent help, 3.3.2 labels or instructions.
Report the state of these as observations with no pass or fail attached.

**Cannot be affected by the file. Report as missing decisions.** Thirty-eight
criteria cannot be settled by a static file at all, including reading order,
heading levels, alternative text, error identification, and name, role, value.
The file cannot make them pass. It can carry the decision so the build does not
have to guess. When a decision is absent, report it as not recorded, not as a
failure.

At Level A, a static design file determines none of the thirty-one criteria.

State this scope in the report. A review that implies a clean design file means
an accessible product is a false report.

## Working alongside the main skill

Figma invokes one skill per prompt. If more than one is mentioned, only the
first is used. So this skill never assumes the main toolkit is loaded and never
defers to it mid-review. Everything needed to complete a review is in this file.

The two are used in sequence across turns, not together in one turn:

- `/ai-a11y-toolkit` when generating, designing, or building something new.
- `/ai-a11y-toolkit-review` when measuring something that already exists.

After delivering a review, if the person asks for the problems to be fixed or
for new work to be produced, say plainly that generation is the other skill's
job and name it, rather than generating from this file. Fixing is a separate
request and a separate invocation.

## Resolving scope

1. Review exactly what is selected. If nothing is selected, ask what to review
   rather than reviewing the whole page.
2. Walk into every component instance and nested frame. Defects hide in
   instances.
3. Exclude from the counts: layers with zero opacity, hidden layers, layers
   behind a mask that are not visible, documentation and annotation layers, and
   purely decorative shapes carrying no information.
4. Count each unique color pairing once, and report how many layers use it. A
   single bad token used forty times is one finding with forty instances, not
   forty findings.
5. State the scope at the top of the report: what was reviewed, how many layers,
   how many text layers, and what was excluded.

## Measuring, not eyeballing

Compute every number. Never estimate a ratio or a size by looking at it.

**Text contrast, 1.4.3.** Resolve the color actually painted, including layer
opacity, fill opacity, and any fill sitting behind a transparent one. Compute
the ratio against the resolved background behind that specific text. The bar is
4.5:1 for normal text and 3:1 for large text, where large means 24px and above
at normal weight, or 18.66px and above at bold. Report the size and weight next
to the ratio so the bar applied is visible. Text over a photograph or a gradient
has no single background: sample the lightest and the darkest region it covers
and report both, and treat the worst case as the result.

**Non-text contrast, 1.4.11.** The bar is 3:1. It applies to the visual
boundary of an interactive component and to graphics needed to understand
content. It does not apply to decorative borders, dividers, or inactive
controls. Read `individualStrokeWeights` before deciding, because a single
`strokeWeight` value cannot tell a component boundary apart from a divider.

**Target size, 2.5.8.** The Level AA bar is 24 by 24 CSS pixels. Measure both
width and height and report them as width by height, because most real failures
are a wide element that is too short. A target under 24 by 24 still passes if it
meets an exception: sufficient spacing, an equivalent control elsewhere on the
screen, an inline link inside a sentence, user agent control, or an essential
presentation. The spacing exception is the one that decides most navigation:
a 24px diameter circle centered on the target must not overlap the circle of any
other target. Compute it from center to center and compare against 24. A row of
short links can pass on spacing alone no matter how short they are, and adding
links to the row does not change that unless the gaps actually close, so measure
the gaps rather than inferring crowding from the count.

List every interactive target you measured, including the ones that pass. A
target size verdict is only as good as the inventory behind it, and the elements
most likely to be missed are the ones most likely to fail: navigation laid out as
bare text in an auto layout row, inline links, icon-only controls, and anything
whose parent frame is named `Frame`. If the verdict is a pass, the pass has to
cover the shortest target in the file, not the tallest. Name that element.

Report 44 by 44 only where an element falls short of it, and rank that as polish
rather than a failure. That is SC 2.5.5 Target Size (Enhanced) at Level AAA, and
it is a good default for primary controls and for touch, but it is not the AA
bar. Where every control already reaches 44, that is a recorded signal and not a
finding. Never label a number from one conformance level with the name of
another.

**Never read a value off an exported image.** Measure against the node tree.

**A text layer's name defaults to its own content.** A layer named the same as
the words inside it has not been named. It is not a description and it is not
alternative text.

## What to record when nothing is recorded

For each of these, report the current state plainly. These are the decisions
that design owns and code implements, and an unrecorded decision becomes a
guess during the build.

- **Alternative text.** For each image, is there a description anywhere, in an
  annotation or a layer description? A role name such as `hero-image` is not a
  description. State how many images carry one.
- **Heading levels.** Is a level recorded, or is hierarchy implied only by type
  size? Type size is not a heading level.
- **Reading and focus order.** Does layer order match the intended reading
  order? Flag any multi-column section that could be read down one column and
  then the other rather than across.
- **Interactive states.** Are hover, focus, active, disabled, and error states
  drawn or defined as variants, or does only the resting state exist?
- **Focus indicator.** Is one drawn at all, and does it reach 3:1 against both
  the component and the surface behind it?
- **Meaning carried by color alone.** Is any status, selection, error, link, or
  category distinguished only by color, with no text, icon, underline, or shape?
- **Names and structure.** How many layers carry a real name against a default
  such as `Frame` or `Rectangle`? Report the count without moralizing. Messy
  files are common and usually a symptom of the schedule. Note only that naming
  a layer forces the decision about what the thing is, and that decision is the
  one the build needs.
- **System usage.** How many components, instances, and shared styles or
  variables are in use? Values bound to a semantic variable can be fixed once.
  Raw hex values have to be fixed one layer at a time.

## The finding format

Every finding uses the same four parts, in this order. No finding is complete
without all four.

1. **What.** One sentence naming the element and the problem.
2. **Evidence.** The measured value, the criterion number, and the level. Never
   a finding without a number attached.
3. **Why it matters.** One sentence on who this affects and how, in plain
   language. Not a restatement of the rule.
4. **Fix.** A specific change, with the value to use. "Increase the contrast" is
   not a fix. The replacement value has to come from a measurement rather than
   an estimate, and there are only two ways to get one.

   The preferred fix reuses a color already in the file that you have measured
   against that exact background and found to clear the bar. "The kicker is
   #c45b3e on #ffffff at 4.27:1, below the 4.5:1 required for normal text at
   Level AA. The body color #5c4a42 is already used on this surface and measures
   8.36:1" is a fix. It carries two measured numbers and adds nothing to the
   palette.

   When no existing color will do, name the direction and the target and stop
   there. "Darken this accent until it reaches 4.5:1 on #ffffff, and read the
   ratio from the contrast readout in the Figma color picker before applying it"
   is a fix. It is less satisfying and it is honest.

   Never invent a hex value and state the ratio it will reach.

## Ranking

Rank every finding into one of four bands and order the report by band. Do not
present findings in the order you found them.

- **Blocking.** Fails a criterion the file determines, and affects a primary
  path such as navigation, a form, or a call to action.
- **Serious.** Fails a criterion the file determines, on secondary content.
- **Decision missing.** A decision that design owns is unrecorded, so the build
  will guess. Alternative text, heading levels, reading order, states.
- **Polish.** Falls short of a recommendation above the AA bar, including the 44
  by 44 enhanced target size, or a craft improvement worth making.

Within a band, order by how many layers are affected.

Every band describes something that falls short. An element that meets the bar
named in its own evidence is not a finding in any band, including Polish. It
belongs in the recorded signals table, or nowhere. A report that lists a passing
element under a heading announcing it failed will be read by the headline and
acted on by someone who never reaches the evidence line.

## Report shape

Open with the scope, then a one-line result for each of the three determined
criteria, then the ranked findings, then the recorded observations, then what
this review cannot tell anyone.

```
Scope: [what was reviewed], [N] layers, [N] text layers. Excluded: [what].

1.4.3 Text contrast       [PASS or FAIL], [N] of [N] pairings pass
1.4.11 Non-text contrast  [PASS or FAIL], [N] of [N] pairings pass
2.5.8 Target size AA      [PASS or FAIL], [N] of [N] targets pass or meet an exception

BLOCKING
[findings]

SERIOUS
[findings]

DECISION MISSING
[findings]

POLISH
[findings]

RECORDED
Alternative text: [state]
Heading levels: [state]
Reading order: [state]
States: [state]
Color independence: [state]
System usage: [N] components, [N] instances, [N] shared styles or variables

NOT ANSWERED BY THIS REVIEW
This is a static file. Keyboard operation, screen reader output, focus behavior,
error handling, status messages, and reflow are settled in code and need testing
in a running build. Thirty-eight of the fifty-five Level A and AA criteria
cannot be assessed here at all.
```

If everything passes, say so in the same format. Do not invent findings to fill
the report, and do not soften a clean result.

## Writing findings back to the canvas

Default to reporting only. Change nothing in the file unless the person asks for
annotations.

When asked, write findings into the file's native Accessibility annotation
category rather than drawing shapes on the canvas. Use one consolidated
annotation per affected element, not one per finding, so a single element with
three problems gets one pin. Include the measured value in the annotation text.
Re-running the review should update existing annotations and clear the ones that
now pass, rather than stacking duplicates.

Never move, resize, recolor, or restructure a layer as part of a review.

## Accuracy rules

These exist because each one has produced a wrong result in a real audit.

- Name the conformance level beside every number, every time. The most
  dangerous review is one where the measurements are correct and the bar is
  wrong, because it is internally consistent enough to look verified and it
  tends to run toward the flattering answer.
- Always report width by height, and label the axis. A row reading `48 to 73 x
  17` fails on the 17, and a reader who does not know the order will read it as
  a pass.
- Report the findings that cut against the design at the same length as the
  ones that flatter it.
- Read back every finding against its own evidence before writing it down. If
  the evidence line shows the element meeting the bar the heading says it
  misses, delete the finding. Do not soften the heading and keep it. This is the
  single most common way a review contradicts itself, because the heading gets
  written from the pattern being looked for and the evidence gets written from
  the measurement, and nothing forces the two to agree.
- Count a band only from what remains after that pass. Empty bands are a good
  result. Write "None" under the band and move on.
- Every ratio in the report must come from two colors that are both already in
  the file. Reading a ratio off the node tree and predicting one for a color you
  just made up are different activities, and only the first is measurement. In a
  run of this review against a real file, every ratio read from the file was
  correct to the hundredth and every ratio predicted for an invented color was
  wrong, including one that was reported as passing at 4.64:1 while actually
  measuring 4.27:1 against a 4.5:1 bar. That fix would have been applied, the
  failure would have survived, and the number beside it would have said
  otherwise.
- If a value cannot be measured, say it cannot be measured. Do not estimate.
- Use words for pass and fail, never symbols. No check marks, crosses, arrows,
  or emoji. A symbol carries no measurement and does not survive being pasted
  into a ticket.
- Never claim the design is accessible, compliant, or conformant. Report what
  passes, what fails, and what still needs testing in a build with a keyboard
  and a screen reader.

## Attribution

Written by Dana Randall in a personal capacity. Licensed CC BY 4.0.
https://creativecommons.org/licenses/by/4.0/

If you adapt or redistribute this, credit Dana Randall and link
https://danarandall.com/ai-a11y-toolkit

The three-bucket scope, the fifty-five criteria classification, and the
measurement rules come from four published studies with pre-registered rubrics
and raw output:
https://github.com/danarandall/ai-a11y-toolkit/tree/main/research

The perceive, understand, operate sequence and the framing of design scope as a
human plus technology system come from the Accessible Design Framework by Karen
Hawkins, Principal of Accessible Design at Level Access.

Found something that does not work? https://danarandall.com/ai-a11y-toolkit#feedback
