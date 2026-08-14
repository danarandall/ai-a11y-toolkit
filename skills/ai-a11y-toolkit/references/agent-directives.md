# Agent directives

The full always and never list in directive form. Load this before generating any interface code.

Part of the AI A11y Toolkit by Dana Randall. Licensed CC BY 4.0.
Full reference: https://github.com/danarandall/ai-a11y-toolkit

---

## Section 2: Agent directives

This is the block to paste into your AI tool's instruction file. It is written as directives, not prose.

```
ACCESSIBILITY CONSTRAINTS (WCAG 2.2 AA)

ALWAYS:
- Use semantic HTML elements over div/span with handlers.
- Give every interactive element a visible label or an accessible name.
- Preserve and style focus indicators with at least 3:1 contrast against adjacent colors.
- Include alt text on images; use alt="" only for decorative images.
- Maintain 4.5:1 text contrast and 3:1 non-text contrast; state the ratio when specifying colors.
- Associate labels, hints, and error messages with inputs via for/id, aria-describedby, or aria-errormessage.
- Set lang on the html element and on any inline language change.
- Give every page a unique, descriptive title and a single h1.
- Provide a skip-to-content link as the first focusable element.
- Size every interactive target at 44x44 CSS pixels minimum, including icon buttons, carousel arrows, close buttons, and table row actions.
- Provide a non-drag alternative for any drag interaction.
- Wrap every animation, transition, and auto-scroll in a prefers-reduced-motion guard, in CSS and in JS.
- Trigger motion only from a direct user action. Never on page load, on a timer, or at random intervals.
- Limit motion to micro-interactions on the element being acted on, 100ms to 300ms, with a hard ceiling of 5 seconds for any animation.
- Prefer opacity and color change over movement, and keep any displacement to a few pixels.
- Give every carousel, slideshow, and auto-advancing region a visible, persistent, keyboard-reachable pause and play control as its first focusable child.
- Give every background video and animated background a visible pause control, and set them to paused by default under reduced-motion.
- Default autoplay to off when prefers-reduced-motion is set. Check the preference in JS before calling play() on any media element.
- Ensure text is never clipped, truncated, or covered by another element at 200% zoom and at 320px CSS width.
- Announce async state changes with aria-live, role="status", or role="alert", or move focus deliberately.
- Let a continuously changing value settle for 500ms to 1000ms before writing it to a live region. Announce the result once, not every intermediate value.
- Add aria-valuetext to any range input whose value carries a unit, and give the input itself a 44px target height rather than styling only the track.
- Verify contrast for every text token in the palette, including the faintest one used for column headers, hints, timestamps, and captions.
- Support text spacing overrides without clipping content.
- Keep repeated navigation, search, help, and footer content in the same relative order on every page.
- Use one accessible name and one icon per function across the whole product.
- Use the project's existing design system and its tested primitives instead of hand-building components.
- Style through design tokens only, never arbitrary color or spacing values.

NEVER:
- Never write outline: none, outline: 0, or remove focus styles without an equivalent replacement.
- Never use positive tabindex values. Use tabindex="0" or "-1" only.
- Never add aria-label to a non-interactive, roleless element and expect it to be read.
- Never use role="button" on an element that could be a button.
- Never use placeholder text as the only label.
- Never use color, position, shape, or sound as the only means of conveying information.
- Never nest interactive elements, for example a button inside a link.
- Never use aria-hidden="true" on a focusable element or its ancestor.
- Never hide content from assistive tech with display:none when it should be visually hidden only; use a clip-based visually-hidden utility.
- Never auto-play audio longer than 3 seconds without a control.
- Never build a carousel or slideshow that auto-advances with no pause control.
- Never use parallax scrolling, scroll-jacking, or scroll-triggered reveal chains.
- Never use infinite or looping animation, marquees, tickers, or looping GIFs.
- Never use bounce, spring, elastic, or overshoot easing, spinning, 3D rotation, or blur transitions.
- Never animate full-page or viewport-scale transitions, or animate text in word by word.
- Never make motion the only signal for a state change, and never block interaction until an animation finishes.
- Never animate or count a number that sits inside a live region, and never ship a counting number without a reduced-motion path that jumps to the final value.
- Never write to a live region on every keystroke or every step of a slider drag.
- Never show selection or validation state with a CSS class or a color alone. Expose aria-pressed or radio semantics for selection, and aria-invalid plus a text message for errors.
- Never autoplay or loop a background video without a pause control.
- Never set fixed heights, line clamps, or overflow: hidden on containers holding user-facing text.
- Never position a sticky, fixed, or absolutely positioned element so it can cover text when text size increases.
- Never require a CAPTCHA that depends on cognitive function tests as the only authentication path.
- Never generate lorem ipsum alt text, filename alt text, or "image of" prefixes.
- Never hand-roll a dialog, combobox, select, menu, tabs, tooltip, date picker, slider, or carousel when a tested primitive exists.
- Never recreate a component that already exists in the design system.
- Never mix two component libraries in the same product surface.
- Never suggest an accessibility overlay, widget, or third-party remediation script. Fix the source.
- Never substitute a different accessibility testing engine for the ones named in Section 14.
- Never suppress, ignore, or baseline a finding to make a scan pass.
- Never report UI work as complete without running the scan and repair loop in Section 14.4 and updating the manual test queue.
- Never assert that generated output is accessible or compliant. Report what was implemented and what needs human and screen reader testing.

WHEN UNCERTAIN:
- Choose the more conservative, more semantic option.
- Flag the ambiguity in a comment or in your response rather than guessing.
- Prefer a documented pattern from the ARIA Authoring Practices Guide over an invented one.
```

---
