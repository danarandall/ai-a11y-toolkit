# HTML and CSS

Semantic structure, focus, forms, and the CSS that breaks assistive technology.

Part of the AI A11y Toolkit by Dana Randall. Licensed CC BY 4.0.
Full reference: https://github.com/danarandall/ai-a11y-toolkit

---

## Section 10: For web developers, HTML and CSS

### Document structure

```html
<!doctype html>
<html lang="en">
  <head>
    <title>Checkout: Payment | Store Name</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body>
    <a class="skip-link" href="#main">Skip to main content</a>
    <header>
      <nav aria-label="Primary">...</nav>
    </header>
    <main id="main">
      <h1>Payment</h1>
    </main>
    <footer>...</footer>
  </body>
</html>
```

- `lang` on `<html>`, always. Add `lang` to inline passages in another language. (3.1.1, 3.1.2)
- Unique, front-loaded `<title>` per page or view. In a single-page app, update it on route change. (2.4.2)
- One `<main>`, one `<h1>`. Label repeated landmarks with `aria-label` so `<nav>` regions are distinguishable. (1.3.1)
- Skip link as the first focusable element. It may be visually hidden until focused, but never `display: none`. (2.4.1)
- Do not disable zoom. No `maximum-scale=1` or `user-scalable=no`. (1.4.4)

### Focus and keyboard

```css
/* Never remove focus. Replace it deliberately. */
:focus-visible {
  outline: 2px solid var(--focus-color);
  outline-offset: 2px;
}
/* If you must suppress the default, provide an alternative in the same rule. */
```

- Never a positive `tabindex`. DOM order defines tab order. (2.4.3)
- Modals: move focus into the dialog on open, trap focus inside while open, close on Escape, return focus to the trigger on close. Use `<dialog>` or `role="dialog"` with `aria-modal="true"` and a label.
- Do not change context on focus. A dropdown must not navigate or submit just because it received focus. (3.2.1, 3.2.2)
- Single-character keyboard shortcuts must be remappable or disableable, or only active on focus. (2.1.4)
- Ensure the focused element is not obscured by sticky UI. Use `scroll-margin-top` matching the sticky header height. (2.4.11)

### The visually hidden utility

Use this, not `display: none`, when content should be available to screen readers only.

```css
.visually-hidden:not(:focus):not(:active) {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
```

### Responsive and motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- Use relative units for text and containers so 200% zoom and browser font-size settings work. (1.4.4)
- Reflow at 320px CSS width, equivalent to 1280px at 400% zoom. Only data tables, maps, and code blocks may scroll in two dimensions. (1.4.10)
- Avoid `!important` on `line-height`, `letter-spacing`, `word-spacing`, and text container heights so user stylesheets can override. (1.4.12)

### Range inputs and sliders

A native `<input type="range">` is almost always the right choice, and it is the one thing in this document that is easy to get wrong precisely because you picked the correct element. The native control gives you keyboard support and a role for free. It does not give you a unit.

A range bound to a percentage announces "75". Not 75 percent, not 75 percent hydration. Just the number. Add `aria-valuetext` whenever the raw number is not the full meaning.

```html
<label for="hydration">Hydration</label>
<input
  id="hydration"
  type="range"
  min="50"
  max="100"
  step="1"
  value="75"
  aria-valuetext="75 percent"
>
<output for="hydration">75%</output>
```

- Set `aria-valuetext` for any range whose value carries a unit, a currency, a date, a duration, or a named step. Update it whenever the value changes.
- Do not set `aria-valuenow`, `aria-valuemin`, or `aria-valuemax` on a native range. The browser derives them from `value`, `min`, and `max`, and duplicating them is a common source of drift.
- A visible readout next to the slider is not a substitute. It is a separate node, and nothing associates it with the input unless you use `<output for>` or `aria-describedby`.
- **Target size applies to the input, not the thumb.** A styled range often collapses to the height of its track. Measure the element's box: a 6px tall input fails 2.5.8 even though the thumb looks large enough. Give the input a real height, usually 44px, and paint the thin track with a pseudo-element or a gradient inside it.
- Ranges must be operable with arrow keys, Home, and End. If you intercept keyboard events for a custom thumb, you have hand-rolled a slider, and Section 4 applies.
- Never make a range the only way to enter a value. Pair it with a number input for anyone who needs precision or cannot make fine pointer movements.

### Forms in markup

```html
<div class="field">
  <label for="email">Email address</label>
  <input
    id="email"
    name="email"
    type="email"
    autocomplete="email"
    aria-describedby="email-hint email-error"
    aria-invalid="true"
  />
  <p id="email-hint">We use this for order updates only.</p>
  <p id="email-error" role="alert">
    Enter an email address in the format name@example.com.
  </p>
</div>
```

- Explicit `for`/`id` pairing. Never rely on proximity. (1.3.1, 3.3.2)
- `autocomplete` on identity, contact, and payment fields. This is a requirement, not a convenience. (1.3.5)
- Group related controls in `<fieldset>` with `<legend>`. Radio groups and checkbox sets always. (1.3.1)
- `aria-invalid="true"` plus a text message linked through `aria-describedby` or `aria-errormessage`. (3.3.1)
- Use real `<button type="submit">`. Do not intercept form submission in a way that breaks Enter.
- Do not disable the submit button as your only error handling. Screen reader users may never learn why.

### Tables

- `<caption>` for the table's purpose, `<th>` with `scope="col"` or `scope="row"`. Use `<thead>` and `<tbody>`. (1.3.1)
- Never use tables for layout. Never use `<div>` grids for tabular data.

### Media

- Captions for all prerecorded video with audio. Captions for live audio content. (1.2.2, 1.2.4)
- Transcripts for audio-only content. Audio description for video where visuals carry information not in the audio track. (1.2.1, 1.2.3, 1.2.5)
- Native controls or fully keyboard-accessible custom controls. Any audio playing over three seconds needs pause and independent volume. (1.4.2)

---
