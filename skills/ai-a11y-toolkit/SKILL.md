---
name: ai-a11y-toolkit
description: "WCAG 2.2 Level AA rules for designing and building digital experiences. Load this before generating, editing, or reviewing any user interface: screens and components in Figma, HTML and CSS, React or other component frameworks, Figma Make apps, and generated copy or alt text. Also load it when asked about contrast ratios, focus behavior, keyboard operation, alt text, heading structure, target size, reduced motion, form errors, live regions, reflow at 200 percent zoom, or whether a design system makes a product accessible."
disable-model-invocation: false
---

# AI A11y Toolkit

WCAG 2.2 Level AA rules for humans and AI agents building digital experiences.

Written by Dana Randall. Licensed CC BY 4.0, free to use commercially, adapt, and redistribute, with attribution. Current release and feedback: https://danarandall.com/ai-a11y-toolkit

## How to use this skill

Apply the non-negotiables below to everything you produce. They are short because they are always on.

Then load the reference for the work in front of you. Do not load all of them.

| Working on | Load |
| --- | --- |
| Screens, components, or a design file in Figma | `references/design.md` |
| Choosing or checking colors | `references/color.md` |
| Animation, video, carousels, target size, zoom, reflow | `references/motion-media-targets.md` |
| Images, icons, charts, illustrations | `references/alt-text.md` |
| Copy, labels, error text, generated content | `references/content-and-language.md` |
| HTML and CSS | `references/html-css.md` |
| React or another component framework | `references/react.md` |
| Testing, scanning, deciding whether it is done | `references/testing.md` |
| Looking up a specific success criterion | `references/wcag-reference.md` |
| Debugging a defect you just produced | `references/failure-patterns.md` |
| Starting a project and setting its context | `references/project-configuration.md` |

Before generating any interface code, load `references/agent-directives.md`. It is the full always and never list in directive form, and it is longer and more specific than the summary below.

## The non-negotiables

These thirteen rules prevent most real-world accessibility failures. They apply to every role, every framework, every deliverable.

1. **Semantics before ARIA.** Use the native HTML element that already has the right role and behavior. `<button>`, `<a href>`, `<input>`, `<select>`, `<nav>`, `<table>`. Only reach for ARIA when no native element exists. The first rule of ARIA is not to use ARIA.
2. **Everything works with a keyboard alone.** Every interactive element is reachable by Tab, operable by Enter or Space, and escapable. No keyboard traps. (2.1.1, 2.1.2)
3. **Focus is always visible.** Never remove focus indicators. Never write `outline: none` without a replacement of equal or better visibility. Focus must not be hidden behind sticky headers, footers, or overlays. (2.4.7, 2.4.11)
4. **Every control has an accessible name.** Icon-only buttons, form fields, links, and inputs all need programmatic names. A visible `<label>` is preferred. If the control has visible text, the accessible name must include that text. (4.1.2, 3.3.2, 2.5.3)
5. **Every non-decorative image has meaningful, informative alt text.** Decorative images get `alt=""`. Never leave `alt` off entirely. Never use a filename, an internal SKU, or a color code. (1.1.1)
6. **Text contrast is at least 4.5:1.** Large text, meaning 24px regular or 18.66px bold and above, may go to 3:1. UI components, icons, borders, focus rings, and chart elements need 3:1. (1.4.3, 1.4.11)
7. **Color is never the only signal.** Errors, states, required fields, availability, chart series, and links inside text blocks all need a second cue: text, icon, underline, shape, or pattern. (1.4.1)
8. **Heading structure is logical and unskipped.** One `<h1>` per page, descending order, no levels used for visual size. (1.3.1, 2.4.6)
9. **Text reflows at 200% zoom and 320px CSS width with nothing cut off, truncated, or covered.** No fixed pixel heights on text containers, no sticky element covering content at large text sizes. (1.4.4, 1.4.10, 1.4.12)
10. **Motion is user-controlled by default.** Honor `prefers-reduced-motion` automatically. Anything that auto-plays, auto-advances, moves, or scrolls for more than five seconds needs a persistent pause, stop, or hide control. Nothing flashes more than three times per second. (2.2.2, 2.3.1)
11. **Errors are identified in text, next to the field, and describe the fix.** Not just a red border. Associate the message programmatically with the input. (3.3.1, 3.3.3)
12. **Interactive targets are at least 44x44 CSS pixels.** 24x24 is the WCAG AA floor and only passes with adequate spacing. 44x44 is the house standard because it is what actually works for tremor, low vision, switch access, and one-handed mobile use. (2.5.8)
13. **Dynamic changes are announced.** Validation, filter results, cart totals, toasts, and loading states need a live region or focus management. Silent updates do not exist for screen reader users. (4.1.3)

## Working in Figma

A design file settles fewer criteria than most people expect. Measured against WCAG 2.2 A and AA, a Figma design kit determines 3 of 55 criteria, influences 14, and cannot affect the remaining 38. At Level A specifically it determines none of the 31.

The three it settles are text contrast, non-text contrast, and target size. Those are exactly the three worth getting right in the file, because they are cheap to fix in design and expensive to fix later.

This is a statement about a static file, not about design as a practice. Reading order, focus order, heading levels, error copy, alternative text, and state design are all decided during design work and then implemented in code. Deciding them early is what prevents rework. Annotate them in the file so they survive handoff. `references/design.md` covers how.

Never state or imply that using a design system makes a product accessible. It settles a small number of criteria and leaves the rest open.

## Verification

Report what you implemented and what still needs human and screen reader testing. `references/testing.md` has the loop.

Never assert that generated output is accessible or compliant. Never suppress, ignore, or baseline a finding to make a scan pass. Automated checks find a minority of real barriers, so a clean scan is a starting point rather than a result.

## When a request conflicts with these rules

Say so, name the criterion, and offer the closest option that satisfies it. Choose the more conservative, more semantic option when uncertain. Flag the ambiguity rather than guessing.
