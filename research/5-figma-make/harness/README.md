# Harness

Every script here was used to produce a number that appears in
[../README.md](../README.md) or [../DESIGN-FILE-AUDIT.md](../DESIGN-FILE-AUDIT.md).

## Live builds

Node 20.20.1, Playwright Chromium, viewport 1280x900. The Make arms were measured
against their published URLs rather than exports, because a Make project is not a
repository you can read.

```bash
npm i playwright accessibility-checker
npx playwright install chromium

node score-rubric.js https://grace-number-99311548.figma.site   # control
node score-rubric.js https://tutu-invert-07297733.figma.site    # treatment
node keyboard-walk-both-arms.js
node verify-treatment-findings.js
node verify-treatment-composited.js
node verify-control-painted-contrast.js
node verify-control-nontext-contrast.js
```

| Script | What it produces |
| --- | --- |
| `score-rubric.js` | IBM Equal Access run plus the DOM queries behind the 20 rubric checks |
| `keyboard-walk-both-arms.js` | Tab stop sequence, element types, and computed focus ring per stop |
| `verify-treatment-findings.js` | Hand verification of the ambiguous engine findings on the treatment |
| `verify-treatment-composited.js` | Composited colors, 2.5.8 spacing exception, real focus obscuring |
| `verify-control-painted-contrast.js` | Painted pixel contrast on the control, including the scroll state swap |
| `verify-control-nontext-contrast.js` | Control component boundary contrast against photographic grounds |

Two things in these scripts exist because doing it the obvious way gave wrong
answers.

**Focus rings are read after a real `Tab` press, not a programmatic `.focus()`.**
`.focus()` does not match `:focus-visible`, so it reports no ring where a user
sees one.

**Contrast is read from painted pixels with the text set to `color: transparent`,
not from computed styles.** Neither the engine nor a computed style read can
composite alpha over photography, and both were wrong by up to 3x on these
builds.

## Design files

The two design arms are audited from their node trees, which are committed in
[`../data`](../data) so the scripts run without a Figma token.

```bash
python3 figma-audit-contrast-targets.py ../data/design-control-tree.json
python3 figma-audit-contrast-targets.py ../data/design-treatment-tree.json
python3 figma-audit-structure.py ../data/design-control-tree.json
python3 figma-audit-structure.py ../data/design-treatment-tree.json
```

| Script | What it produces |
| --- | --- |
| `figma-audit-contrast-targets.py` | 1.4.3, 1.4.11, and 2.5.8, the three criteria a static file determines |
| `figma-audit-structure.py` | Layer naming, annotation signals, font size inventory, auto layout coverage |
| `fetch-design-tree.sh` | Refetches a tree from the Figma API, if you want to rerun against the live file |
| `crop-evidence.py` | Cuts the evidence crops in [`../exports`](../exports/README.md), refusing any crop that overlaps a photograph |

`figma-audit-contrast-targets.py` distinguishes a component boundary from a
decorative rule by reading `individualStrokeWeights` rather than `strokeWeight`.
A stroke on one side is a rule above or below content and 1.4.11 does not apply to
it. Skipping this check scored four text links in the control as faint-bordered
buttons and produced four boundary failures that were not there.

Written by Dana Randall in a personal capacity. Licensed CC BY 4.0.
