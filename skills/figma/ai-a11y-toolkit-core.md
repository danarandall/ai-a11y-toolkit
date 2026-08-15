---
name: ai-a11y-toolkit
description: "WCAG 2.2 Level AA accessibility rules for designing and building digital experiences. Use this skill whenever you create, edit, or generate a screen, component, or layout, and whenever you generate code, copy, or alt text. Use it for questions about contrast, color, focus, keyboard operation, headings, reading order, target size, motion, form errors, zoom, alt text, or whether a design system makes a product accessible. To measure and report on work that already exists, use ai-a11y-toolkit-review instead."
---

# AI A11y Toolkit

WCAG 2.2 Level AA rules for humans and AI agents building digital experiences.

Written by Dana Randall. Licensed CC BY 4.0, free to use commercially, adapt,
and redistribute, with attribution.

The full reference, all eighteen sections and all 55 Level A and AA criteria:
https://github.com/danarandall/ai-a11y-toolkit
Current release and feedback: https://danarandall.com/ai-a11y-toolkit

Apply the non-negotiables to everything you produce. Follow the directives when
you generate code. Report what still needs human and screen reader testing.

## The non-negotiables

These thirteen rules prevent most real-world accessibility failures. They apply to every role, every framework, every deliverable.

1. **Semantics before ARIA.** Use the native HTML element that already has the right role and behavior. `<button>`, `<a href>`, `<input>`, `<select>`, `<nav>`, `<table>`. Only reach for ARIA when no native element exists. The first rule of ARIA is not to use ARIA.
2. **Everything works with a keyboard alone.** Every interactive element is reachable by Tab, operable by Enter or Space, and escapable. No keyboard traps. Test by unplugging the mouse. (2.1.1, 2.1.2)
3. **Focus is always visible.** Never remove focus indicators. Never write `outline: none` without a replacement of equal or better visibility. Focus must not be hidden behind sticky headers, footers, or overlays. (2.4.7, 2.4.11)
4. **Every control has an accessible name.** Icon-only buttons, form fields, links, and inputs all need programmatic names. A visible `<label>` is preferred. If the control has visible text, the accessible name must include that text. (4.1.2, 3.3.2, 2.5.3)
5. **Every non-decorative image has meaningful, informative alt text.** Decorative images get `alt=""`. Never leave `alt` off entirely. Never use a filename, an internal SKU, or a color code. "RD-100" tells a customer nothing; "bright red pebbled leather" tells them what they are choosing. (1.1.1)
6. **Text contrast is at least 4.5:1.** Large text, meaning 24px regular or 18.66px bold and above, may go to 3:1. UI components, icons, borders, focus rings, and chart elements need 3:1. (1.4.3, 1.4.11)
7. **Color is never the only signal.** Errors, states, required fields, availability, chart series, and links inside text blocks all need a second cue: text, icon, underline, shape, or pattern. Roughly 13 million Americans have a color vision deficiency, and a red-only error state is invisible to many of them. (1.4.1)
8. **Heading structure is logical and unskipped.** One `<h1>` per page, descending order, no levels used for visual size. Headings are the primary navigation tool for screen reader users. (1.3.1, 2.4.6)
9. **Text reflows at 200% zoom and 320px CSS width with nothing cut off, truncated, or covered.** No horizontal scrolling for vertical content, no clipped or overlapping text, no fixed pixel heights on text containers, no sticky element covering content at large text sizes. (1.4.4, 1.4.10, 1.4.12)
10. **Motion is user-controlled by default.** Honor `prefers-reduced-motion` automatically, without the user configuring anything in your product. Anything that auto-plays, auto-advances, moves, or scrolls for more than five seconds needs a persistent pause, stop, or hide control. This includes carousels, background video, animated backgrounds, marquees, tickers, and looping GIFs. Nothing flashes more than three times per second. (2.2.2, 2.3.1)
11. **Errors are identified in text, next to the field, and describe the fix.** Not just a red border. Not just a summary at the top. Associate the message programmatically with the input. (3.3.1, 3.3.3)
12. **Interactive targets are at least 44x44 CSS pixels.** 24x24 is the WCAG AA floor and only passes with adequate spacing (2.5.8). 44x44 is Level AAA (2.5.5) and is the house standard here because it is what actually works for tremor, low vision, switch access, and one-handed mobile use. Falling short of 44 is a miss against this house standard, not a Level AA failure.
13. **Dynamic changes are announced.** Anything that updates without a page load, meaning validation, filter results, cart totals, toasts, loading states, needs a live region or focus management. Silent updates do not exist for screen reader users. (4.1.3)

## Working in a design file

A design file settles fewer criteria than most people expect. Three things are
worth getting exactly right in the file, because they are cheap to fix in design
and expensive to fix later: text contrast, non-text contrast, and target size.
Measured across WCAG 2.2 A and AA, those three are what a design kit determines
on its own. It influences fourteen more and cannot affect the remaining
thirty-eight. At Level A it determines none of the thirty-one.

That scope describes a static file, not design as a practice. Reading order,
focus order, heading levels, error copy, alternative text, and state design are
all decided during design work and then implemented in code. Deciding them early
is what prevents rework, and annotating them in the file is what carries them
into the build.

Never state or imply that using a design system makes a product accessible. It
settles a small number of criteria and leaves the rest open. When someone asks
whether a component from a kit is accessible, answer for the criteria the kit can
actually determine and name the ones still open.

## Agent directives

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
- Never substitute a different accessibility testing engine for the ones named in Section 14 of the full reference.
- Never suppress, ignore, or baseline a finding to make a scan pass.
- Never report UI work as complete without running the scan and repair loop in Section 14.4 of the full reference and updating the manual test queue.
- Never assert that generated output is accessible or compliant. Report what was implemented and what needs human and screen reader testing.

WHEN UNCERTAIN:
- Choose the more conservative, more semantic option.
- Flag the ambiguity in a comment or in your response rather than guessing.
- Prefer a documented pattern from the ARIA Authoring Practices Guide over an invented one.
```

## Attribution

Written by Dana Randall in a personal capacity. Licensed CC BY 4.0.
https://creativecommons.org/licenses/by/4.0/

If you adapt or redistribute this, credit Dana Randall and link
https://danarandall.com/ai-a11y-toolkit

The perceive, understand, operate sequence and the framing of design scope as a
human plus technology system come from the Accessible Design Framework by Karen
Hawkins, Principal of Accessible Design at Level Access.

Found something that does not work? https://danarandall.com/ai-a11y-toolkit#feedback
