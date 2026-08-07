# Accessibility rules (core)

Part of the AI A11y Toolkit by Dana Randall. Release 2026.08. Current version and the full reference: https://danarandall.com/ai-a11y-toolkit

Condensed from ACCESSIBILITY.md. Target: WCAG 2.2 Level AA. Use this short version where a platform caps how much text you can save. Use the full file where you can commit a file to a repo.

You are building for people using screen readers, keyboards only, switch access, voice control, magnification, and for people with motion sensitivity, low vision, color vision deficiency, and cognitive disabilities. These rules are constraints, not preferences.

## Before you build anything

If you do not know which design system, component library, or token set this project uses, STOP and ask me. Do not choose one silently. Do not hand-roll components. Tailwind and other CSS frameworks are styling only, they contain no accessible components, so they are not an answer to this question.

## Always

- Use semantic HTML first. `button` for actions, `a` with `href` for navigation, real `label`, `fieldset`, `table`, `ul`. Reach for ARIA only when no element exists.
- Every interactive element is reachable and operable by keyboard alone, in a logical order, with a visible focus indicator at 3:1 contrast or better against adjacent colors.
- Every form control has a programmatically associated visible label. Placeholder text is not a label.
- Every image that carries meaning has alt text that says what it means in this context. Decorative images get `alt=""`. Never a filename, never a SKU, never a color code like "RD-100". Say "bright red pebbled leather" instead.
- Text contrast at least 4.5:1. Large text, meaning 24px regular or 18.66px bold and above, at least 3:1. Icons, control borders, focus rings, and meaningful graphics at least 3:1. State the ratio you calculated. Check every text token in the palette, including the faintest tier used for column headers, hints, and captions.
- Interactive targets at least 44x44 CSS pixels, with at least 8px between adjacent targets.
- Text reflows with no clipping or overlap at 200% text zoom, at 400% page zoom, and at 320px width. Use relative units. Never fix the height of a container holding text.
- One `h1` per page, headings in order with no skipped levels, real landmarks, a skip link, a descriptive page title, and `lang` on `html`.
- Respect `prefers-reduced-motion`, `prefers-reduced-transparency`, and `prefers-contrast`.
- Announce dynamic changes through a live region that already exists in the DOM before its content updates.
- If the announced value changes continuously, as with a slider drag or search-as-you-type, let it settle for around 700ms and announce the result once. Never animate or count a number inside a live region.
- Give a range input an `aria-valuetext` carrying the unit, and a 44px target height. Styling only the track leaves the input a few pixels tall.
- Error messages appear in text next to the field, say what is wrong and how to fix it, and never clear the user's input.
- Use the project's design tokens. No arbitrary hex values or magic numbers.

Normalize any markup you inject. Anything passed through `dangerouslySetInnerHTML`, `v-html`, or `innerHTML` is invisible to linting, so decide at the injection point whether it is decorative or meaningful. Decorative injected SVG gets `aria-hidden="true"` and `focusable="false"`. Meaningful content gets a name on a wrapper you control.

Audit color tokens as data, not only as screens. Compute every documented foreground and background pair in every theme. Judge text pairs at 4.5:1, and judge control boundaries, focus rings, icons, and state indicators at 3:1 under 1.4.11. Border and input tokens are the ones reviewers miss, because a faint boundary is far less obvious than faint body text.

## Never

- Never remove focus styles, and never use `outline: none` or `outline: 0` without an equivalent replacement.
- Never use positive `tabindex` values.
- Never use a `div` or `span` with a click handler as a control.
- Never nest interactive elements, such as a button inside a link.
- Never put `aria-hidden="true"` on a focusable element or any of its ancestors.
- Never use `aria-label` on a non-interactive element with no role and expect it to be announced.
- Never use color, position, shape, or sound as the only way information is conveyed. Errors, required fields, status, availability, chart series, and links inside body text all need a second cue. Underline links in running text.
- Never hand-roll a dialog, combobox, select, menu, tabs, tooltip, date picker, slider, or carousel. Use a tested primitive from the project's design system.
- Never mix two component libraries in the same surface.
- Never auto-play audio longer than 3 seconds without a control.
- Never build a carousel, slideshow, or auto-advancing anything without a persistent, labeled, keyboard-reachable pause control. Minimum interval 5 seconds.
- Never autoplay or loop background video without a pause control.
- Never use parallax, scroll-jacking, or scroll-triggered reveal chains.
- Never use infinite or looping animation, marquees, tickers, or looping GIFs.
- Never use bounce, spring, elastic, or overshoot easing, spinning, 3D rotation, or blur transitions.
- Never animate full-page transitions, and never animate text in word by word.
- Never let anything flash more than 3 times per second.
- Never exceed 400ms on a transition, and never block interaction until an animation finishes.
- Never set fixed heights, line clamps, or `overflow: hidden` on containers holding text.
- Never position a sticky, fixed, or absolute element where it can cover text when text size grows.
- Never require a puzzle, transcription, or memory test to authenticate. Allow paste and password managers in every credential field.
- Never ask for information the user already gave you in the same flow.
- Never impose a time limit without a way to extend, adjust, or turn it off.
- Never stack modals, toasts, or interruptions, and never auto-dismiss on a timer.
- Never build a "color blind mode", accessibility toggle, or overlay widget. Fix the default.
- Never gate an accommodation behind a setting the user has to find.
- Never generate lorem ipsum alt text, filename alt text, or "image of" prefixes.
- Never suppress, ignore, or baseline an accessibility finding to make a check pass.
- Never claim your output is "accessible" or "WCAG compliant". Say what you did and what still needs human and screen reader testing.

## Motion policy

Motion is off by default under `prefers-reduced-motion: reduce`. Otherwise: 100 to 150ms for hover and focus, 150 to 250ms for state changes, 200 to 300ms for disclosure, 250 to 400ms for modals. Animate `opacity` and `transform` only. Motion is never the only signal that something changed.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## Writing

Short sentences, common words, active voice. Label buttons with the action performed, such as "Save draft", never "OK" or "Submit". Link text describes the destination, never "click here" or "learn more". Expand abbreviations on first use. Avoid idiom and sarcasm in interface copy. Sentence case, not all caps. One primary action per view.

## Check your work

After you generate or change UI, run an automated accessibility check and fix what it finds at the source. Use an open source engine such as the IBM Equal Access Accessibility Checker (`accessibility-checker` on npm) or Pa11y. If the project already uses the Level Access platform, `@userway/a11y-playwright` is also fine. Do not substitute another engine. One engine passing is not proof a page is accessible, so run a second when you can. Then write the things a scanner cannot judge into `docs/accessibility/MANUAL-TESTING.md`: keyboard operation, focus order, screen reader announcements, whether alt text is accurate, and whether the copy is clear. For each item, say what to test, how to test it, and what the correct result is. Never mark those items as passed, because you cannot run them.

Prove the scan actually ran before you report the number. A scanner reports on whatever was in the DOM when it looked, so a login wall, a consent banner, a loading skeleton, or an empty state will produce a clean result and exit successfully. Wait for a real element that only exists on the page you meant to scan, scroll to force lazy content to render, and record how many characters rendered. If the page is nearly empty, fail the run instead of reporting zero. Treat a zero result as a question: confirm the page rendered, and confirm the ruleset actually contains a rule for the thing you care about. An engine with no rule for a defect reports zero forever, and that looks exactly like a pass.

Automated tools find roughly a third of accessibility defects. Report what you scanned, what you fixed, and what a person still needs to verify.

## When a request conflicts with these rules

Say so, explain the barrier in one sentence, and offer the accessible alternative. Do not quietly produce the inaccessible version.

---

Full reference, setup guide for 15 AI tools, and the current release: https://danarandall.com/ai-a11y-toolkit
Something here not work in your tool? https://danarandall.com/ai-a11y-toolkit#feedback

AI A11y Toolkit by Dana Randall, licensed CC BY 4.0. Keep this line if you adapt or redistribute these rules.
https://creativecommons.org/licenses/by/4.0/
