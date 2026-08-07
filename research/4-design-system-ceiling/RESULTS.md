# Build study results

Two builds of the same brief, using the same design system, by the same model,
differing only in whether the builder was given the AI A11y Toolkit. Scored
against the rubric pre-registered before either build started.

Measured 6 August 2026. Engine: IBM Equal Access, Playwright Chromium, Node
v20.20.1, viewport 1280 by 900. Both arms scanned and measured in the same
session by the same code.

## Score

| | Control | Treatment |
| --- | --- | --- |
| Rubric items passed | 13 of 29 | 26 of 29 |
| Automated violations, default state | 22 | 11 |
| Automated violations, after verification | 22 | 0 |
| JavaScript errors | 0 | 0 |

Three rubric items were not assessed and are excluded from both denominators:
focus obscured by sticky elements, non-text contrast, and tooltip dismiss and
hover behavior. Excluding them from both arms keeps the comparison fair.

## The automated numbers need a correction applied to both arms

The scanner reported 11 violations against the treatment arm. All 11 were
checked against Chrome's real accessibility tree rather than against markup.
Ten were `label_content_exists` on checkboxes whose names come from nested
visually hidden text, and the accessibility tree returns a correct name for
every one of them. The eleventh was a skip link placed outside a landmark, which
is where a skip link belongs. Zero interactive nodes in the treatment build lack
an accessible name.

The same verification applied to the control arm did not clear its findings. Two
interactive nodes, a combobox and a slider, have no accessible name in the
accessibility tree.

This is worth stating plainly because it cuts against the tool as much as for
it. Roughly half the raw scanner output in this study was noise, and a team
reading scanner totals alone would have drawn the wrong conclusion about which
build was better.

## What the toolkit changed

Fourteen rubric items passed in the treatment arm and failed in the control arm.

| Item | SC | Control | Treatment |
| --- | --- | --- | --- |
| Accessible name on every control | 4.1.2 | 2 controls unnamed | all named |
| State exposed on disclosure controls | 4.1.2 | 1 control with `aria-expanded` | 11 |
| Sort state exposed | 1.3.1, 4.1.2 | none | in the button name, and it updates |
| Tab pattern complete | 4.1.2 | no tab panel | tab panel present |
| Modal focus behavior | 2.1.2, 2.4.3 | focus never enters, no trap | focus enters, traps, returns |
| Selection count announced | 4.1.3 | not announced | live region reports the count |
| Every input labeled | 3.3.2 | 19 of 21 | 16 of 16 |
| Errors associated to fields | 3.3.1 | no association | 17 described by relationships |
| Errors suggest a correction | 3.3.3 | no | yes |
| Visible focus indicator | 2.4.7 | 11 of 12 | 12 of 12 |
| Headings coherent | 1.3.1, 2.4.6 | no headings at all, no h1 | h1 present, no skipped levels |
| Bypass mechanism | 2.4.1 | none | skip link |
| Slider name and value | 2.1.1, 4.1.2 | unnamed | labeled, with `aria-valuetext` |
| Autocomplete on personal fields | 1.3.5 | none | 3 fields |

The sort finding is the one worth dwelling on. The control build sorts
correctly and shows the direction visually. Its buttons are named "Order",
"Date", "Total", and those names never change. The treatment build names the
same button "Order number, not sorted. Activate to change sort." and after
activation "Order number, sorted ascending. Activate to change sort." Same
feature, same design system, same visual result, and only one of them tells a
screen reader user what the table is doing.

## What the toolkit did not fix

This is the part that matters for reading the study honestly.

**Text contrast fails in both arms.** Every failing pairing in both builds comes
from a Prime token pair, not from a builder invention.

| Pairing | Ratio | Control | Treatment |
| --- | --- | --- | --- |
| White/100 on Blue Spark/600 | 4.48:1 | primary button | skip link |
| Obsidian/600 on Obsidian/100 | 4.10:1 | tab label | fixed |
| Obsidian/600 on White/100 | 4.48:1 | body text | fixed |

The treatment builder caught the first two and moved to the 700 step, and
recorded the change. It missed the skip link, which is only visible on focus.
So the guidance reduced inherited contrast defects from three pairings to one,
and did not eliminate them.

**Reflow fails in both arms.** Both builds scroll horizontally at 320 CSS pixels
wide. Neither the design system nor the guidance prevented it.

**Text spacing is worse in the treatment arm.** Applying the text spacing
overrides clips content in 13 elements in the treatment build and zero in the
control build. The treatment build is denser, and its density does not survive
user spacing overrides. This is a real regression and the toolkit did not
prevent it.

## Attribution

This is the finding the study exists to produce.

The control build failed 16 rubric items.

| Origin | Count | Meaning |
| --- | --- | --- |
| Inherited from the design system | 1 | Prime supplied the color values and they fail |
| Introduced by the builder | 14 | names, roles, state, focus, headings, errors, bypass |
| Neither | 1 | reflow, a layout decision the kit does not govern |

One of sixteen. The design system contributed a single failing item to the
control build, and it contributed the same failing item to the treatment build,
because a color token fails the same way no matter who applies it.

Everything else that went wrong was a category of thing a Figma kit cannot
supply: whether a control has a name, whether state is exposed, whether focus
moves correctly, whether an error is associated with its field. Fourteen of
sixteen failures lived entirely outside the design system's reach.

## Where the pre-registration was wrong

The rubric predicted that items 19, 20 and 21 would be the inherited ones.

Item 21, target size, was predicted to fail as inherited. It passed in both
arms. Prime's own file contains sub-24 pixel elements, including pagination dots
at 8, 12 and 15 pixels tall and a small tab variant at 23 pixels, but neither
builder reproduced those at failing sizes. Both builds wrap their row checkboxes
in a label, which produces an effective target of 48 by 44 pixels in the control
build and 60 by 60 in the treatment build, even though the checkbox itself
renders at 20 by 20. A prediction that a design system defect will propagate is
not the same as it propagating.

Item 16, visible focus indicator, was predicted contested. It was clearly
introduced. Prime specifies focus state fills, both builders had them available,
and only one applied a visible indicator to every control.

Recording these before the builds is what makes it possible to say they were
wrong.

## Limits

One build per arm. No statistical claim is made or implied. A single trial shows
that a difference of this size can happen, not how often it happens.

The same model built both arms, which controls for model capability but means
the result describes this model's behavior with and without the guidance, not
every model's.

The author of this study wrote the toolkit used in the treatment arm. The
mitigation is that the rubric was pre-registered, the measurement code and both
builds are published in full, and every item where the treatment arm failed or
regressed is reported above, including the one where it is worse than the
control.
