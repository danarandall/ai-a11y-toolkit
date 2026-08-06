# Scoring rubric and attribution rules

Pre-registered. Written before either build was run. This file is not given to
either builder.

## Arms

**Control.** The brief, plus the design system, plus nothing else. The builder
is not told accessibility is being measured.

**Treatment.** The brief, plus the same design system, plus the AI A11y Toolkit.
The builder is likewise not told it is being compared to anything.

Both arms are built by separate agents with no visibility into each other, no
access to this rubric, and no access to the study documents. Neither builder
sees the other's output.

## Why attribution is the point

A defect in a build has one of two origins, and the whole value of this study
depends on separating them honestly.

**Inherited.** The design system supplied the value or the pattern, the builder
used it as shipped, and the result fails. Example: the builder applies the
primary button component and its resting state misses the contrast threshold.
This counts toward the design system's baseline.

**Introduced.** The design system had nothing to say about this, and the builder
either did it or failed to do it. Example: a control has no accessible name. No
design kit can supply that. This does not count toward the design system's
baseline.

**Contested.** The design system arguably influenced it but did not determine
it. Recorded separately and never counted in the design system's total.

The attribution decision is made by inspecting the design system source for the
relevant token or component and stating what it actually specifies. Every
attribution in the results must cite the measured value it rests on. An
attribution that cannot cite a measured value is recorded as contested.

## Checklist

Each item is scored pass, fail, or not applicable, on each arm. Each item names
the criterion it maps to and its expected attribution before the builds are run.
Recording the expected attribution now is what keeps the analysis honest, and
where the observed attribution differs from the expected one, the difference is
reported.

| # | Item | SC | Expected attribution |
| --- | --- | --- | --- |
| 1 | Every control has a programmatically determinable accessible name | 4.1.2 | Introduced |
| 2 | Every control exposes a correct role | 4.1.2 | Introduced |
| 3 | State is exposed, so pressed, expanded, selected, checked, current | 4.1.2 | Introduced |
| 4 | Table uses real table semantics with header cells associated to data cells | 1.3.1 | Introduced |
| 5 | Sortable columns expose sort state programmatically | 1.3.1, 4.1.2 | Introduced |
| 6 | Tabs expose the tab pattern and the selected tab | 4.1.2 | Introduced |
| 7 | Modal receives focus, traps focus, and restores focus on close | 2.1.2, 2.4.3 | Introduced |
| 8 | Modal is exposed as a dialog with an accessible name | 4.1.2 | Introduced |
| 9 | Transient messages are announced without moving focus | 4.1.3 | Introduced |
| 10 | Selection count changes are announced | 4.1.3 | Introduced |
| 11 | Every input has a persistent programmatic label | 3.3.2 | Introduced |
| 12 | Validation errors are identified in text and associated to the field | 3.3.1 | Introduced |
| 13 | Validation errors suggest a correction where the fix is knowable | 3.3.3 | Introduced |
| 14 | All functionality is operable by keyboard alone | 2.1.1 | Introduced |
| 15 | Focus order follows a meaningful sequence | 2.4.3 | Introduced |
| 16 | A visible focus indicator is present on every focusable control | 2.4.7 | Contested |
| 17 | Focused control is not obscured by sticky headers or bars | 2.4.11 | Introduced |
| 18 | Status is not communicated by color alone | 1.4.1 | Contested |
| 19 | Text contrast meets 4.5:1, or 3:1 where the text qualifies as large | 1.4.3 | Inherited |
| 20 | Non-text contrast meets 3:1 for control boundaries and status indicators | 1.4.11 | Inherited |
| 21 | Interactive targets meet 24 by 24 CSS pixels or an exemption applies | 2.5.8 | Inherited |
| 22 | Page has a title | 2.4.2 | Introduced |
| 23 | Page language is declared | 3.1.1 | Introduced |
| 24 | Headings describe their sections and the heading order is coherent | 1.3.1, 2.4.6 | Introduced |
| 25 | A mechanism exists to bypass the repeated header and sidebar | 2.4.1 | Introduced |
| 26 | Content reflows at 320 CSS pixels wide without loss of function | 1.4.10 | Contested |
| 27 | Content survives the text spacing overrides | 1.4.12 | Contested |
| 28 | Tooltip content is dismissible, hoverable, and persistent | 1.4.13 | Introduced |
| 29 | Slider is operable by keyboard and exposes its value | 2.1.1, 4.1.2 | Introduced |
| 30 | Any drag interaction has a single pointer alternative | 2.5.7 | Introduced |
| 31 | Visible label text is contained in the accessible name | 2.5.3 | Introduced |
| 32 | Autocomplete is set on fields that collect the user's own information | 1.3.5 | Introduced |

Items 19, 20 and 21 are the only ones expected to be inherited. That expectation
is itself a finding to be tested, not an assumption to be protected. If a
contrast or target size failure turns out to come from a builder choice rather
than a supplied value, it is recorded as introduced and the expectation is
reported as wrong.

## Scoring

Score is the count of items passed out of items applicable. Both arms are scored
by the same procedure, in the same session, by the same measurement code.

Not applicable is used only where the build legitimately has no instance of the
thing. A missing feature that the brief required is a build failure and is
recorded as such, not scored as not applicable, because otherwise omitting a
feature would improve a score.

## Measurement

- Automated scan of both builds with the same engine and version, recorded.
- Programmatic contrast measurement of every rendered text node against its
  computed background, and of control boundaries against their surroundings.
- Programmatic measurement of the rendered size of every interactive element.
- Keyboard walk of both builds, recording reachability, operability and focus
  visibility for every control.
- Accessible name and role extracted from the accessibility tree, not inferred
  from markup.
- Manual assessment for the items automation cannot decide, applied to both arms
  using the same written procedure.

Automated results and manual results are reported separately, never blended into
one number, because the ratio between them is itself part of the finding.

## Declared in advance

- The treatment arm is expected to score higher. A study that only confirms this
  is weak evidence. The informative results are which specific items move, and
  which fail in both arms regardless of guidance.
- Items that fail in both arms are the most interesting outcome, because they
  indicate something neither the design system nor written guidance fixed.
- The author of this study created the toolkit used in the treatment arm. This
  is a conflict of interest. It is mitigated by pre-registering this rubric,
  publishing both builds in full, publishing the measurement code, and reporting
  every item where the treatment arm failed.
- Single trial per arm. This is a demonstration, not a controlled experiment
  with statistical power, and no significance is claimed.
