# Common AI-generated failure patterns

The defects that show up repeatedly in generated code, and the fix for each.

Part of the AI A11y Toolkit by Dana Randall. Licensed CC BY 4.0.
Full reference: https://github.com/danarandall/ai-a11y-toolkit

---

## Section 17: Common AI-generated failure patterns

What to look for specifically when reviewing AI output. These recur across tools.

| Pattern | Why it happens | Fix |
| --- | --- | --- |
| `<div onClick>` instead of `<button>` | Training data is full of it | Use the native element |
| `outline: none` in a reset | Copied from legacy CSS resets | Replace with `:focus-visible` styles |
| Placeholder used as the label | Looks cleaner in a screenshot | Add a persistent visible label |
| Identical link or button names repeated | Component reuse without context | Unique accessible names per instance |
| Markup injected with `dangerouslySetInnerHTML` or `innerHTML` | Icon sets, CMS content, and SVG sprites arrive as strings | Normalize at the injection point; lint cannot see runtime strings |
| `maximum-scale=1` or `user-scalable=no` in the viewport tag | Copied from mobile app scaffolding | Delete both; never block zoom |
| Animation utilities with no `prefers-reduced-motion` handling | The preference is invisible in a screenshot | One global reduce block, shipped with the first animation |
| `aria-label` placed on a `<div>` or `<span>` | Reads as helpful, is silently discarded | Use a real element, or a role that permits a name |
| Border and input tokens below 3:1 | Reviewers look at text, not boundaries | Audit tokens as data against 1.4.11 |
| Same function named differently across screens | Each file generated in isolation | One accessible name per function, product-wide |
| aria-label that differs from the visible text | Models over-describe | Match the visible label (2.5.3) |
| Navigation or help relocated per template | No cross-page context in the prompt | Same relative order on every page (3.2.3, 3.2.6) |
| `aria-label` layered onto correct semantics | ARIA treated as a fix-all | Remove the redundant ARIA |
| Invented ARIA patterns for menus and comboboxes | Half-remembered specs | Use an APG pattern or a tested primitive |
| Low-contrast gray text on white | Aesthetic defaults in training data | Verify every ratio |
| A second, dimmer text token used only for column headers and hints | Invented for de-emphasis, too rare to get reviewed | Audit the faintest text token first (1.4.3) |
| Live region rewritten on every keystroke or slider step | The model learned that a live region is the fix, not how to govern one | Settle the value, then announce once (4.1.3) |
| Counting or animated numbers with no reduced-motion path | Reads as polish, invisible in a screenshot | Jump to the final value under reduce (2.3.3) |
| `<input type="range">` announcing a bare number | Correct element chosen, unit never added | Add `aria-valuetext` with the unit (4.1.2) |
| A styled range input only a few pixels tall | The track is styled, the input box is forgotten | Measure the input, not the thumb (2.5.8) |
| Selected state shown with a CSS class only | Visual selection is obvious to the person looking at it | Expose `aria-pressed` or use radio semantics (4.1.2) |
| Validation shown by turning the field red | The brief said make it red, and it did | Add a text message and `aria-invalid` (3.3.1) |
| Red-only error states | Visual convention in training data | Text message plus icon, adjacent to the field |
| Green and red for good and bad | Universal convention, unusable for red-green CVD | Add text or distinct shapes |
| Filename, SKU, or color code as alt text | CMS data passed straight through | Human-readable descriptions only |
| Chart series distinguished only by a color legend | Charting library defaults | Direct labels, second encoding, data table |
| Suppressing a scanner finding instead of fixing it | Optimizing for a green build | Blocked by the loop in 14.4 |
| Declaring output "WCAG compliant" after an automated pass | Overconfidence about tooling | Report what was scanned and what was not |
| Hand-rolled components because no design system was declared | Missing project configuration | Fill in Section 0 and use the gate |
| Tailwind utility classes on a bare `div` acting as a control | Tailwind treated as a component library | Declare a primitives layer, see 0.3 |
| Dense screens with several competing primary actions | Trained on marketing pages | One primary action per view |
| "Click here" and "Learn more" link text | Extremely common in training data | Describe the destination or outcome |
| CAPTCHA or puzzle as the only authentication path | Default signup boilerplate | An alternative that requires no cognitive test |
| Asking for the same information twice in a flow | Screen-by-screen generation without state | Carry data forward or auto-populate |
| Missing focus management in modals and drawers | Visual-only reasoning | Trap, Escape, restore focus |
| Silent async updates | No model of the non-visual experience | Add a live region |
| Alt text that describes rather than functions | Models caption, they do not consider purpose | Rewrite by purpose |
| Icon-only controls with no name | Icon fonts and SVGs look self-explanatory | Add accessible names |
| Animation with no reduced-motion guard | Motion demos well | Wrap in the media query |
| 16px or smaller tap targets | Desktop-first defaults | 44px minimum |
| Parallax and scroll-triggered reveals | Portfolio and landing-page training data is full of them | Remove; use static depth and layout instead |
| Ambient, autoplaying, or looping animation | Motion demos well in a screenshot-driven world | Trigger from user action only, no loops |
| Bounce and spring easing on everything | Framer Motion defaults | Standard easing, 150ms to 300ms |
| Inventing a one-off component instead of using the system | Models generate from scratch by default | Point the tool at the design system explicitly |
| Hand-rolled combobox, dialog, or date picker | Looks plausible, fails on focus and ARIA | Use React Aria, Radix, Ariakit, or the system component |
| Arbitrary hex and one-off color utilities | Token systems are invisible in a prompt | Constrain to tokens in the instruction file |
| Auto-advancing carousel with no pause control | Autoplay reads as polished in demos | Persistent pause control as the first focusable child |
| Claims of "fully accessible" output | Confident tone by default | Require an explicit gap list |

---


## Section 12: For design tools and AI prompting

### If you are adopting a design system

A design system is a file. Design is a practice. The two get talked about as one thing, and the gap between them is where most accessibility defects live.

Classified against all 55 WCAG 2.2 Level A and AA criteria, a Figma design kit determines 3 and influences 14. At Level A it determines none of 31. The three it settles anywhere are text contrast, non-text contrast, and target size. Palette and sizes. Accessible names, exposed state, focus order and management, error association, heading structure, bypass mechanisms, and status messages do not exist until somebody builds. A coded component library reaches further, determining 4 and influencing 32, and it still cannot decide how you assemble it. The criterion by criterion classification is in [research/4-design-system-ceiling](research/4-design-system-ceiling/README.md).

What to do with that:

- Measure the palette you inherited instead of trusting the claim attached to it. In one current, well made, paid system measured for that study, every base color step cleared 3:1 and not one reached 4.5:1, across four releases and four years. (1.4.3)
- Check interaction states, not just resting states. Contrast should hold or rise on hover, focus, and active. The same system's primary button shipped white text at 4.48:1 at rest and dropped to 3.16:1 on hover and focus, so contrast fell exactly when the user was engaging with it. Measure all four states. (1.4.3, 1.4.11)
- Treat the kit as a floor for the three things it settles and assume nothing about the other 52.
- Do not let adoption replace design review. The defects a design system cannot reach are precisely the ones that are cheapest to catch before code exists, and they are decisions somebody has to make rather than accidents that appear at implementation time.

### Figma and design files

- Use auto layout so reflow behavior is expressible rather than pixel-pinned.
- Name layers meaningfully. Layer names become the first draft of everyone's mental model, and of code generation output.
- Use text styles and color variables with contrast documented on the token, so accessible pairings are picked by default.
- Order layers to match intended reading order. Design tool layer order and generated DOM order are correlated.
- Annotate with a handoff plugin or a dedicated annotation layer covering headings, landmarks, tab order, alt text, and focus states. In an AI workflow this annotation is not a note to a developer, it is the input the tool builds from, so it is worth more than it used to be. Section 9.3 has a format for it.
- Include the keyboard flow in prototypes, not just click paths.
- Record the measured contrast ratio on the token itself rather than the intent behind it. A token named for accessibility is not evidence, and values drift between releases while names do not.

### Prompting AI tools for UI

Weak prompt: "Build a pricing page with three tiers."

Strong prompt: "Build a pricing page with three tiers. Requirements: semantic HTML with a single h1 and h2 per tier, WCAG 2.2 AA contrast on all text and borders with the ratio noted in a comment, focus-visible styles on every interactive element, the recommended tier distinguished by more than color, feature comparison as a real table with scope attributes, and CTA buttons at 44px minimum height with unique accessible names such as 'Choose Starter plan' rather than three identical 'Choose' buttons."

Prompt patterns that work:

- Name the standard and level explicitly. "WCAG 2.2 AA."
- Ask for the reasoning. "List each accessibility decision you made and the criterion it satisfies."
- Ask for the gaps. "List what still needs manual or screen reader verification."
- Constrain the primitives. "Use semantic HTML only. No div with click handlers. No positive tabindex."
- Require the states. "Include focus, error, empty, loading, and disabled states."
- Ask for a self-audit pass. "Now review your output against this file and fix violations."
- Paste the component annotation from Section 9.3 alongside the design. A model given explicit accessible names, states, focus behavior, and target sizes will use them. A model given only a layout will infer them from pixels, which is how you get twelve unnamed icons.

### AI-generated visuals and layouts

- Generated mockups routinely produce low-contrast gray-on-gray, tiny targets, and text baked into images. Check contrast and target size on anything you take from a generated comp.
- Never ship an AI-generated image containing meaningful text as an image. Extract the text into real markup. (1.4.5)
- Generated icon sets often lack a consistent 3:1 contrast against the surfaces they sit on. Verify per surface, not just once. (1.4.11)
- Generated illustrations of people flatten disability representation. If your imagery depicts users, decide deliberately who appears in it.

---
