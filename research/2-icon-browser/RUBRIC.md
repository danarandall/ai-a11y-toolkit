# Pre-registered scoring rubric

Written before either build was generated. Sixteen binary checks, scored identically for both arms. Each is worth one point. Partial credit is not given.

Every check is tied to the WCAG 2.2 criterion it maps to, and marked with how it can be detected: **AUTO** means a browser-based engine can find it, **MANUAL** means it cannot and requires reading the code or the DOM.

| # | Check | Pass condition | WCAG | Detection |
| --- | --- | --- | --- | --- |
| 1 | Injected SVG neutralised | Every injected SVG root carries `aria-hidden="true"`, or the injection is wrapped in an element with an accessible name | 1.1.1 | AUTO |
| 2 | Injected SVG not focusable | `focusable="false"` present on injected SVG, or SVG removed from tab order | 2.1.1 | MANUAL |
| 3 | Icon card has a name | Each card is a button or link whose accessible name includes the icon name | 4.1.2 | AUTO |
| 4 | Copy button has a unique name | Copy buttons are distinguishable from one another, not twelve buttons all named "Copy" | 2.4.6 | AUTO |
| 5 | Search input labelled | A `<label>`, `aria-label`, or `aria-labelledby`. Placeholder alone fails | 3.3.2 | AUTO |
| 6 | Copy result announced | A live region, or focus moved to the confirmation | 4.1.3 | MANUAL |
| 7 | Dialog has a role and a name | `role="dialog"` with `aria-modal="true"` and `aria-labelledby` or `aria-label` | 4.1.2 | AUTO |
| 8 | Focus moves into the dialog | Focus is set on open | 2.4.3 | MANUAL |
| 9 | Focus is trapped and restored | Tab is contained while open, focus returns to the trigger on close | 2.4.3 | MANUAL |
| 10 | Escape closes the dialog | Keydown handler for Escape | 2.1.2 | MANUAL |
| 11 | Toggle state exposed | Category filters and theme control expose `aria-pressed`, `aria-checked`, or equivalent | 4.1.2 | AUTO |
| 12 | Reduced motion honoured | At least one `prefers-reduced-motion` block covering the transitions used | 2.3.3 | MANUAL |
| 13 | Focus visible | A visible focus style exists. `outline: none` with no replacement fails | 2.4.7 | MANUAL |
| 14 | Status not colour alone | Status is conveyed by text or shape, not only by a colour swatch | 1.4.1 | MANUAL |
| 15 | Non-text contrast | Border, input, and focus tokens reach 3:1 against their own background, in both themes | 1.4.11 | MANUAL |
| 16 | Native semantics | Clickable things are `<button>` or `<a>`, not `<div onClick>`. No `aria-label` on a bare `div` or `span` | 1.3.1, 4.1.2 | AUTO |

## Also recorded

- IBM Equal Access violation count and potential-violation count, same engine and settings for both arms.
- Total target-size measurement, smallest interactive target in CSS pixels, against 2.5.8 which requires 24 by 24.
- Lines of code, as a rough proxy for whether the accessible version costs meaningfully more effort.

## Scoring conditions

- Both arms receive the identical `BRIEF.md`. Neither brief mentions accessibility.
- The control receives the brief and nothing else.
- The treatment receives the brief plus the toolkit installed the way a real user installs it: `ACCESSIBILITY.md` in the project root with an `AGENTS.md` pointing at it.
- Same model, same runtime, same output paths.
- Both are bundled and rendered by the identical harness, then scanned with the same engine.
