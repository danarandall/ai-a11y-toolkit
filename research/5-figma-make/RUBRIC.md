# Study 5: pre-registered scoring rubric

Same skill, same prompt, two environments. A static Figma design file and a
running Figma Make build.

**Written 2026-08-14 before either Make arm was generated or seen.** Twenty binary
checks, scored identically for both arms. One point each. No partial credit.

**AUTO** means a browser-based engine can find it. **MANUAL** means it cannot and
requires reading the DOM or the code. The split matters, because the whole
argument for a rules file is that it changes the things an engine will never
report.

## Disclosure

I have already audited the Figma Design output of this same prompt, so I am not
blind to how the design arm handled contrast, target size, and alt text. I have
not seen either Make arm. This rubric was written before the Make builds existed.
Recording the contamination rather than claiming a clean blind.

---

# The twenty checks

| # | Check | Pass condition | WCAG | Detection |
| --- | --- | --- | --- | --- |
| 1 | Native landmarks | `<header>`, `<nav>`, `<main>`, `<footer>` present. A `div` soup with no landmarks fails | 1.3.1 | AUTO |
| 2 | One h1 | Exactly one visible `<h1>`, and it is the page subject, not the wordmark | 1.3.1, 2.4.6 | AUTO |
| 3 | Heading levels unskipped | No jump from h2 to h4. Sizes not used as levels | 1.3.1 | AUTO |
| 4 | Display figures are not headings | Large stat numbers are not marked up as headings | 1.3.1 | MANUAL |
| 5 | Every image has an alt decision | Informative images carry meaningful alt. Decorative images carry `alt=""`. A missing attribute fails, and so does a filename or a generic string | 1.1.1 | AUTO |
| 6 | Alt text is informative | At least three quarters of informative images describe the subject rather than restating the nearby heading | 1.1.1 | MANUAL |
| 7 | Nav links are real links | `<a href>`, not `div onClick` or `<button>` for navigation | 1.3.1, 4.1.2 | AUTO |
| 8 | Skip link | A keyboard-reachable skip-to-content link exists and is visible on focus | 2.4.1 | MANUAL |
| 9 | Focus visible everywhere | Every interactive element has a visible focus style. `outline: none` with no replacement fails | 2.4.7 | MANUAL |
| 10 | Focus not obscured | The sticky header does not cover a focused element when tabbing | 2.4.11 | MANUAL |
| 11 | Target size 24px floor | No interactive element below 24 by 24 CSS pixels without exempting spacing | 2.5.8 | AUTO |
| 12 | Target size 44px standard | Every interactive element reaches 44 by 44, the toolkit's house standard | 2.5.8 | AUTO |
| 13 | Text contrast | Every text pairing reaches 4.5:1, or 3:1 where it qualifies as large | 1.4.3 | AUTO |
| 14 | Non-text contrast | Control borders, input boundaries, and focus rings reach 3:1 against their own background | 1.4.11 | MANUAL |
| 15 | Form field labelled | The email input has a `<label>`, `aria-label`, or `aria-labelledby`. Placeholder alone fails | 3.3.2, 4.1.2 | AUTO |
| 16 | Error identified in text | Invalid email produces a text message next to the field, programmatically associated, describing the fix. A red border alone fails | 3.3.1, 3.3.3 | MANUAL |
| 17 | Submit result announced | Success or failure reaches a live region, or focus moves to the message | 4.1.3 | MANUAL |
| 18 | Autocomplete on the email field | `autocomplete="email"` present | 1.3.5 | AUTO |
| 19 | Reduced motion honored | A `prefers-reduced-motion` block covering every transition, scroll effect, or animation used. If there is no motion, this passes | 2.3.3 | MANUAL |
| 20 | Reflow at 320px and 200% | No horizontal scroll, no clipped or overlapped text, no fixed pixel height on a text container | 1.4.4, 1.4.10 | MANUAL |

---

# Also recorded, not scored

- IBM Equal Access violation and potential-violation counts, identical engine and
  settings for both arms, with every reported finding hand-verified in the live
  DOM. Study 1 is the reason for the hand verification step.
- Smallest interactive target in CSS pixels.
- Count of engine findings that no check above would have caught, and the reverse,
  checks that failed while the engine reported nothing.

---

# Scoring conditions

- Both arms receive the identical prompt. The prompt does not mention
  accessibility.
- The control arm gets the prompt and nothing else.
- The treatment arm gets the prompt plus `/ai-a11y-toolkit` invoked, which is how
  a real user invokes a Figma custom skill.
- Same model, same Make runtime, same day.
- Both are measured against the running build, not an export, so React hydration
  and client-side behavior are included.
- Checks 16, 17, and 20 require interaction and are performed by script, not by
  reading source.

---

# What this study can show that study 4 could not

Study 4 compared two coded builds. Study 5 compares a static design file against a
running build produced from the same prompt and the same rules.

The design file can only be evaluated on the 3 criteria it determines and the 14
it influences. A running build can be evaluated on all 55 under WCAG 2.2 A and AA.
The expected shape of the result is that the design arm scores well on its three
criteria and is silent on the rest, not because design does not matter, but
because a static file has no runtime in which the other criteria exist. The
decisions the design arm did make, reading order, heading levels, alt text, are
the ones that most need to be recorded so they survive into the build.

Written by Dana Randall in a personal capacity. Licensed CC BY 4.0.
