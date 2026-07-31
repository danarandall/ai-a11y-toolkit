# ACCESSIBILITY.md

**Accessibility rules for humans and AI agents building digital experiences.**

Target standard: WCAG 2.2, Level AA
Author: Dana Randall
Version: 1.14
Toolkit release: 2026.07
Last updated: 2026-07-31

Latest version of this file: https://danarandall.com/ai-a11y-toolkit
Using this, or found something that does not work? https://danarandall.com/ai-a11y-toolkit#feedback

Part of the AI A11y Toolkit. Licensed CC BY 4.0: free to use commercially, adapt, and redistribute, with attribution. https://creativecommons.org/licenses/by/4.0/

---

## New to this? Read START-HERE.md first

If you are not a developer, or you are using an AI builder such as Lovable, Base44, Bolt, v0, Figma Make, Replit, Cursor, or Claude Code, open **`START-HERE.md`** instead of this file. It tells you exactly where to install these rules in your specific tool, gives you copy-paste prompts, and explains why pasting rules into a chat message does not work.

There are three files in this set.

| File | Use it for |
| --- | --- |
| `START-HERE.md` | Installation instructions per platform, plus prompts to use while you build. |
| `ACCESSIBILITY-CORE.md` | A condensed version, about 7,000 characters, for platform text fields that cap length. |
| `ACCESSIBILITY.md` | This file. The full reference. Commit it to a repo, or read it as a human. |

All three files are at https://danarandall.com/ai-a11y-toolkit. If you were sent a copy, check there for the current release, because the platform instructions in `START-HERE.md` go stale as these tools ship changes.

---

## What this file is for

Accessibility knowledge has always lived with specialists, and it reached everyone else through review. Someone built a thing, an expert found the problems, fixes came later. That worked when building took weeks.

It does not survive a workflow where a working interface exists ninety seconds after you describe it. There is no gap in the schedule for a review cycle, and increasingly the person generating the interface is not an engineer. They are a designer, a product manager, a content strategist, a founder. They are directing a model and shipping what comes back.

This file is for that person. It moves the baseline to the front of the process, so accessibility is a property of what gets generated rather than a correction applied to it afterward.

That is also why it is a file and not a list of prompts. You cannot prompt for a requirement you do not know exists, and accessibility failures are almost entirely unknown unknowns. A prompt library asks you to identify the gap before it can help you close it. A file your tool has already read does not wait to be asked.

What that buys you is a defensible floor, reached by default, by someone who is not an accessibility specialist. It is not an audit, and it is not a replacement for expert review or for testing with disabled people, which is where accessibility is actually established rather than approximated. Section 18 is specific about the limits. Treat this as the work you do before that conversation, so the conversation can be about substance instead of contrast ratios.

---

## How to use this file

This file does two jobs at once.

1. **It is an agent instruction set.** Drop it into a repo or project so AI coding and design tools read it before they generate anything. Rename or copy it to whatever your tool expects: `AGENTS.md`, `CLAUDE.md`, a `.cursor/rules/*.mdc` file, `.github/copilot-instructions.md`, `replit.md`, a Custom GPT instruction block, or a project knowledge field. `START-HERE.md` has the exact path for each platform.
2. **It is a human reference.** Every rule includes the reason behind it and the success criterion it maps to, so designers, engineers, content people, and stakeholders can use the same source of truth.

Start with Section 0 and fill in the project configuration. It takes ten minutes and it prevents the most expensive category of AI-generated mistake. Then read Sections 1 through 8 no matter who you are. Then read the section that matches your job. The WCAG 2.2 AA reference table at the end is the full compliance map.

### Contents

**Everyone**
0. Project configuration, fill this in first
1. The non-negotiables
2. Agent directives
3. Motion, media, target size, and text zoom
4. Design systems
5. Interface consistency
6. Alt text and image descriptions
7. Color and color vision
8. Cognitive load, clear language, and non-apparent disabilities

**By job function**
9. For designers
10. For web developers, HTML and CSS
11. For React and component framework engineers
12. For design tools and AI prompting
13. For AI-generated content

**Reference**
14. The build loop, automated checks and the manual test queue
15. Verification
16. WCAG 2.2 Level A and AA reference
17. Common AI-generated failure patterns
18. Scope and honesty

**If you are an AI agent reading this file:** treat Sections 1 through 8 as hard constraints, not suggestions. Do not generate code, components, layouts, copy, or images that violate them. When a request conflicts with a rule here, say so and offer the accessible alternative instead of silently producing inaccessible output. Never claim output is "accessible" or "WCAG compliant" based on your own generation. State what you did and what still needs human and assistive-technology verification.

---

## Section 0: Project configuration

**Fill this in before anyone, human or AI, generates a single component.** Sections 4 and 5 tell you to use a design system consistently. This is where you say which one. An agent that does not know your system will invent one, and it will invent it badly.

Copy this block into the top of your project instruction file and complete it. Leave a field blank only if it genuinely does not apply, and write `none` rather than deleting the line, so the gate below can tell the difference between "not applicable" and "not answered".

```yaml
# PROJECT ACCESSIBILITY CONFIG
# Required by ACCESSIBILITY.md. Agents: read this before generating UI.

design_system:
  name:                  # "Radix Primitives + Acme tokens", "Carbon v11", "Acme DS 4.2"
  type:                  # in-house | open-source | hybrid | none-yet
  docs_url:              # where the component documentation lives
  component_source:      # npm package name, monorepo path, or git URL
  tokens_source:         # path or URL to the token file, e.g. ./design/tokens.json
  figma_library_url:     # published library, so design and code agree
  styling_layer:         # Tailwind v4 | CSS Modules | vanilla-extract | plain CSS
  primitives_layer:      # accessible headless component library, if separate from styling
  icon_set:
  conformance_evidence:  # VPAT, ACR, or accessibility statement URL, or "none"
  known_gaps:            # components you already know are not accessible yet

project:
  target_standard: WCAG 2.2 Level AA
  platforms:             # web | iOS | Android | email | native desktop
  locales:               # affects text expansion, RTL, and reading level
  browser_support:
  supported_assistive_tech:   # the pairings you actually test, see Section 15
  motion_policy: reduced-by-default   # see Section 3
  minimum_target_size: 44   # CSS pixels, see 3.5

automation:
  scan_command: npm run a11y     # see Section 14
  blocking_levels: violation, potentialviolation   # see 14.5
  manual_queue: ./docs/accessibility/MANUAL-TESTING.md
  scan_viewports: 320, 1280      # scanning only at desktop hides reflow failures

review:
  accessibility_owner:   # a named person, not a team
  audit_date:
  escalation_path:       # where a user reports a barrier
```

### 0.1 Agent gate, paste this with the config

```
GATE: DESIGN SYSTEM MUST BE DECLARED

Before generating, scaffolding, refactoring, or styling any user interface:

1. Read the PROJECT ACCESSIBILITY CONFIG block.
2. If design_system.name is blank, or type is "none-yet", or component_source is blank:
   STOP. Do not generate components. Do not pick a library on the author's behalf.
   Do not scaffold "temporary" markup that will be replaced later.
3. Ask the author, verbatim:

   "Before I build UI, I need to know which design system to use. Please pick one:
    (a) You have an in-house design system. Give me the docs URL, the package name or
        repo path, and the token file. If it is not published, paste or attach the token
        file and the component list.
    (b) You want to use an open source system. Name it, or ask me to recommend one from
        Section 4.3 of ACCESSIBILITY.md and I will summarize the tradeoffs.
    (c) You have a Figma library. Share the published library URL, or attach the token
        export, and tell me whether the code side already exists.
    (d) There is no system yet. I will use tested accessible primitives from Section 4.3
        and define tokens as we go, and I will record the choice in this file.
    Also tell me the styling layer, since it is a separate decision from the components."

4. Record the answer back into the config block in this file, then proceed.
5. If the author says to just start building, use option (d) and say plainly which
   primitives and tokens you introduced, so the decision is visible rather than buried.

Never silently choose a component library. Never mix two of them. Never hand-roll a
dialog, combobox, menu, tabs, tooltip, date picker, or carousel because the system was
not declared.
```

### 0.2 Author's picker

For the human filling this in. Tick one per column. The two columns are independent choices, which is the part teams most often get wrong.

**Component layer, this is the accessibility decision**

- [ ] In-house design system, already built and documented
- [ ] In-house design system, exists in Figma only, no code yet
- [ ] Open source accessible primitives, see Section 4.3
- [ ] Open source full component library, see Section 4.3
- [ ] Nothing yet, pick one from Section 4.3 and record it here

**Styling layer, this is a preference decision**

- [ ] Tailwind
- [ ] CSS Modules or plain CSS with custom properties
- [ ] A CSS-in-JS or compiled solution such as vanilla-extract
- [ ] Whatever the design system ships

### 0.3 Tailwind is not a design system

Worth stating flatly, because it is the single most common cause of an inaccessible AI-generated interface.

Tailwind is a styling layer. It ships utility classes. It ships **no components, no roles, no focus management, no keyboard behavior, and no accessibility semantics whatsoever.** "We use Tailwind" answers the styling question and leaves the component question completely open. When an agent hears "Tailwind" and nothing else, it hand-rolls a `div` with an `onClick` and calls it a button.

So declare both layers. Tailwind plus a tested primitives library is a good stack. Tailwind alone is not a stack, it is a paint job.

The same applies to any CSS framework, any component kit sold on visual appeal, and any AI-generated component gallery. If it does not document keyboard interaction, focus management, and screen reader behavior per component, it is a styling layer regardless of what it calls itself.

### 0.4 What "attach" means here

A markdown file cannot render an upload button. What it can do is name the destination, so an attachment has somewhere to go and an agent knows what to ask for. Give your team and your tools a fixed location for each of these:

| Artifact | Conventional location | Why the agent needs it |
| --- | --- | --- |
| Design tokens | `./design/tokens.json` | Prevents arbitrary hex and spacing values |
| Component inventory | `./design/components.md` | Prevents rebuilding something that exists |
| Figma library link | In the config block above | Keeps design and code naming aligned |
| Accessibility statement, VPAT, or ACR | `./docs/accessibility/` | Tells you which gaps are already known |
| Manual test queue | `./docs/accessibility/MANUAL-TESTING.md` | Generated by the agent, see 14.6 |
| Scan reports | `./reports/accessibility/` | Evidence, and a diff between builds |
| This file | Repo root, as `ACCESSIBILITY.md` | The rules themselves |
| Tool-specific copy | `AGENTS.md`, `CLAUDE.md`, `.cursor/rules/`, `.github/copilot-instructions.md` | Whatever your assistant actually reads |

If your assistant supports connecting to a live source, for example a Figma integration or a documentation server, connect it and record that in `docs_url` rather than pasting a stale token dump. If it does not, export the tokens and commit them. A committed export that is three weeks old still beats an agent guessing.

---

## Section 1: The non-negotiables

These twelve rules prevent most real-world accessibility failures. They apply to every role, every framework, every deliverable.

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
12. **Interactive targets are at least 44x44 CSS pixels.** 24x24 is the WCAG AA floor and only passes with adequate spacing. 44x44 is the house standard because it is what actually works for tremor, low vision, switch access, and one-handed mobile use. (2.5.8)
13. **Dynamic changes are announced.** Anything that updates without a page load, meaning validation, filter results, cart totals, toasts, loading states, needs a live region or focus management. Silent updates do not exist for screen reader users. (4.1.3)

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

## Section 3: Motion, media, target size, and text zoom

These requirements are the ones AI tools and design systems fail most often, and the ones users feel most immediately, sometimes physically. They are stated here as explicit contracts so nobody has to infer them from a criterion number.

### 3.1 Motion and animation principles

This is not a niche audience. One large epidemiological study estimates that **as many as 35% of American adults aged 40 and older, roughly 69 million people, have experienced some form of vestibular dysfunction** ([DESIGNA11Y](https://www.design-a11y.com/articles/top-3-donts-when-your-coworker-has-vestibular-dysfunction)). Motion sensitivity is also invisible. Nobody will file a ticket saying your hero animation made them nauseated. They will just leave.

Motion is a functional tool, not decoration. It exists to explain a change, show a relationship, or confirm an action. If a piece of motion is not doing one of those three jobs, remove it.

Beyond preference, motion is a medical accessibility issue. Vestibular disorders, migraine, concussion history, epilepsy, and motion sensitivity are common, and large-scale or unexpected movement can cause nausea, dizziness, disorientation, and headache that persist long after the user leaves the page. Motion sensitivity is invisible, underreported, and far more prevalent than most teams assume.

**The five rules**

1. **User-triggered, never ambient.** Motion begins as a direct response to a user action: a click, tap, keypress, hover, drag, or explicit navigation. Nothing animates on its own, on a timer, on a random interval, or simply because a page loaded. If the user did not cause it, it should not move.
2. **Micro-interactions only.** Motion is scoped to small, local feedback on the element being acted upon. Not full-page transitions, not viewport-scale movement, not choreographed sequences.
3. **Under five seconds, always.** Five seconds is the hard ceiling for any single animation, and it is far more than most motion needs. Micro-interactions should land between 100ms and 300ms.
4. **Nothing loops, nothing flashes.** No infinite animation, no repeating cycles, no strobing, no rapid color or luminance inversion. Nothing flashes more than three times per second, at any size (2.3.1).
5. **Never parallax.** See below.

**Duration guidance**

| Motion type | Duration | Notes |
| --- | --- | --- |
| Hover, focus, active feedback | 100ms to 150ms | Should feel instant |
| State change, toggle, checkbox, small reveal | 150ms to 250ms | The default range for most work |
| Disclosure, dropdown, popover, local expansion | 200ms to 300ms | Longer reads as sluggish |
| Modal or drawer entrance | 250ms to 400ms | Keep the travel distance short |
| Anything at all | Hard ceiling 5 seconds | Above 5 seconds requires a pause, stop, or hide control (2.2.2) |

Larger and farther movement needs slightly more time, but if your animation needs more than 400ms to make sense, the problem is the concept, not the timing.

**Why parallax is discouraged**

Do not use parallax scrolling. It is the single most reliable way to make a website physically unpleasant for people with vestibular conditions.

Parallax breaks the relationship between the user's input and what they see. Layers move at different speeds, which the visual system reads as self-motion while the inner ear reports sitting still. That sensory conflict is the mechanism behind motion sickness, and on a large scrolling surface it can produce dizziness, nausea, and disorientation within seconds. It also usually depends on scroll hijacking, which breaks keyboard scrolling, screen reader reading order, and browser find-in-page.

If a stakeholder asks for depth and richness, deliver it without movement: layered composition, real shadows and elevation, generous scale contrast, strong typography, high-quality imagery, subtle static gradients, or a single small local reveal on interaction. If parallax is truly non-negotiable, it must be off by default under `prefers-reduced-motion`, extremely small in displacement, and never applied to text.

**Discouraged or prohibited outright**

| Pattern | Why |
| --- | --- |
| Parallax scrolling | Sensory conflict, vestibular trigger, breaks scroll and reading order |
| Scroll-jacking or scroll-hijacking | Removes user control of scroll speed and position, breaks keyboard and find-in-page |
| Scroll-triggered reveal chains | Content that appears as you scroll is unpredictable, is often missed, and fails when scripts do not run |
| Auto-scrolling marquees and tickers | Looping, unpausable, unreadable at any comfortable reading pace |
| Animated or video backgrounds behind text | Large-area motion plus unstable contrast |
| Infinite loading loops and pulsing skeletons | Continuous motion with no end state; keep loaders modest and minimal |
| Looping animated GIFs | Cannot be paused, stopped, or hidden |
| Full-page or viewport-scale transitions | Large moving area is the strongest vestibular trigger |
| Spinning, 3D rotation, flips, z-axis and depth movement | Directly provokes motion sickness |
| Zoom, scale, or dolly effects across large areas | Reads as the world moving toward the viewer |
| Bounce, elastic, spring, and overshoot easing | Extra unnecessary movement after the state has already changed |
| Blur transitions and motion blur | Simulates the visual experience of vertigo |
| Autoplaying hero animations and ambient background motion | Not user-triggered, cannot be anticipated |
| Cursor-following, magnetic, or custom cursor effects | Movement the user did not request, breaks pointer expectations |
| Text animating in word by word or letter by letter | Interferes with reading and with screen reader output |
| Motion inside or adjacent to a block of body copy | Steals attention while the user is reading |

**Additional requirements**

- **Prefer opacity, color, and instant state change over movement.** Fading in is gentler than sliding in. Both communicate arrival.
- **Keep displacement small.** Move things a few pixels to tens of pixels, not across the viewport. The larger the moving area and the longer the distance, the higher the risk.
- **Move one thing at a time.** Budget roughly one primary motion per view. Simultaneous or staggered animation across many elements compounds the effect.
- **Motion is never the only signal.** A state change must also be conveyed statically, in text, icon, or persistent visual state. If the animation is the message, the message is lost to anyone with reduced motion enabled or scripts disabled (1.4.1, 1.3.3).
- **Motion is interruptible and never blocking.** The user can click, type, or navigate during an animation. Never gate interaction behind an animation completing, and never make someone wait through a transition.
- **No motion during input.** Do not animate around a field the user is typing in, and do not animate layout while a form is being completed. Shifting layout during input causes real errors.
- **No motion under the pointer or focus.** Elements must not move away from the cursor or the focused element. Motion must not change what is under the pointer mid-gesture.
- **Respect the system preference automatically**, per 3.4. Under reduced motion, everything above collapses to instant state changes with no travel.
- **Essential motion is exempt but still constrained.** Progress indicators, video content, and animation that is genuinely the point of the experience may continue, and still need a pause control if they run beyond five seconds (2.2.2).

```css
/* Motion tokens. Short, purposeful, no bounce. */
:root {
  --motion-instant: 100ms;
  --motion-fast: 150ms;
  --motion-base: 200ms;
  --motion-slow: 300ms;
  --ease-standard: cubic-bezier(0.2, 0, 0.38, 0.9);
  --ease-entrance: cubic-bezier(0, 0, 0.38, 0.9);
  --ease-exit: cubic-bezier(0.2, 0, 1, 0.9);
  /* No spring, elastic, bounce, or overshoot easing. */
}

/* Opt in to motion. Prefer opacity over travel. Keep distance small. */
@media (prefers-reduced-motion: no-preference) {
  .popover {
    transition:
      opacity var(--motion-base) var(--ease-entrance),
      transform var(--motion-base) var(--ease-entrance);
  }
  .popover[data-state="closed"] {
    opacity: 0;
    transform: translateY(4px); /* small displacement, not 40px */
  }
}
```

---

### 3.2 Carousels, slideshows, and auto-advancing content

**Requirement: every carousel, slideshow, image rotator, testimonial cycler, logo strip, ticker, and auto-advancing region has a visible, persistent play and pause control.**

Non-negotiable behavior:

- The pause control is the **first focusable element** in the component, before the slides and before previous and next controls. A user who needs to stop the motion should not have to tab through moving content to reach the stop button.
- It is **visible without hover and without focus**. A pause button that only appears on hover does not exist for keyboard and touch users.
- It is a real `<button>` with a state-accurate accessible name that updates: "Pause slideshow" when playing, "Play slideshow" when paused.
- Pausing is **sticky for the session**. Do not resume automatically on slide change, mouse leave, scroll, or timeout. If the user stopped it, it stays stopped.
- Auto-advance **pauses on hover and on focus within** the component, in addition to the explicit control.
- Auto-advance **does not start at all** when `prefers-reduced-motion: reduce` is set. Render the first slide statically with manual controls.
- Slide interval of at least five seconds if you auto-advance at all. Faster than that is unusable for anyone reading at a normal pace.
- Every slide is reachable and readable without auto-advance. Provide previous and next controls plus slide indicators, all at 44x44 minimum.
- Off-screen slides are hidden from assistive technology and from the tab order, using `hidden` or `display: none`, not `opacity: 0` or `visibility: hidden` with focusable children inside.
- Slide changes are announced through a polite live region, for example "Slide 3 of 5", never `role="alert"`.
- Do not put critical content or the primary call to action only in a carousel. Rotating content is missed by most users.

**Honest recommendation:** the most accessible carousel is usually not a carousel. Before building one, consider a static hero, a grid, or a manually controlled tab set. Auto-rotating content fails users with low vision, cognitive disabilities, ADHD, vestibular disorders, and anyone who reads slowly. If a stakeholder wants a carousel, the pause button is the minimum price of admission.

```html
<section class="carousel" aria-roledescription="carousel" aria-label="Featured work">
  <!-- Pause control comes first in the DOM -->
  <button type="button" class="carousel__toggle" data-carousel-toggle aria-label="Pause slideshow">
    <span aria-hidden="true">⏸</span>
  </button>

  <div class="carousel__slides" aria-live="polite" aria-atomic="false">
    <div class="carousel__slide" role="group" aria-roledescription="slide" aria-label="1 of 3">...</div>
    <div class="carousel__slide" role="group" aria-roledescription="slide" aria-label="2 of 3" hidden>...</div>
    <div class="carousel__slide" role="group" aria-roledescription="slide" aria-label="3 of 3" hidden>...</div>
  </div>

  <button type="button" aria-label="Previous slide">...</button>
  <button type="button" aria-label="Next slide">...</button>
</section>
```

```js
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

class Carousel {
  constructor(root) {
    this.root = root;
    this.toggle = root.querySelector("[data-carousel-toggle]");
    // Reduced motion means never auto-play. Not slower. Not shorter. Off.
    this.userPaused = reduceMotion.matches;
    this.toggle.addEventListener("click", () => this.userPaused ? this.play() : this.pause(true));
    // Pause on hover and on focus, without overriding an explicit user pause.
    root.addEventListener("mouseenter", () => this.suspend());
    root.addEventListener("focusin", () => this.suspend());
    root.addEventListener("mouseleave", () => this.resume());
    root.addEventListener("focusout", () => this.resume());
    reduceMotion.addEventListener("change", e => e.matches && this.pause(true));
    if (!this.userPaused) this.play();
    this.syncLabel();
  }
  play() { this.userPaused = false; this.timer = setInterval(() => this.next(), 6000); this.syncLabel(); }
  pause(byUser) { if (byUser) this.userPaused = true; clearInterval(this.timer); this.syncLabel(); }
  suspend() { clearInterval(this.timer); }
  resume() { if (!this.userPaused && !reduceMotion.matches) this.play(); }
  syncLabel() {
    this.toggle.setAttribute("aria-label", this.userPaused ? "Play slideshow" : "Pause slideshow");
  }
}
```

### 3.3 Background video and animated backgrounds

**Requirement: every background video, animated background, animated gradient, particle field, parallax layer, and looping GIF has a visible pause control, and does not play at all under reduced motion.**

- The pause control is visible, persistent, keyboard reachable, and at least 44x44. Placing it in a corner of the video is fine. Hiding it until hover is not.
- Background video is muted, has no audio track dependency, and carries **no information**. If it communicates something, it is content, not decoration, and it needs captions and audio description.
- Add `playsinline` and never rely on autoplay succeeding. Browsers block it. Your layout must be legible on the poster frame alone.
- Text over video needs a solid or scrim overlay that guarantees 4.5:1 against **the brightest frame**, not the average frame. Video is not a background you can contrast-check once.
- Under `prefers-reduced-motion`, serve the poster image instead of the video. Do not autoplay and then pause, which still flashes motion.
- Animated GIFs cannot be paused. Do not use them for anything longer than five seconds. Convert to video with controls.
- Parallax and scroll-linked animation should not be used at all. See 3.1. If they exist in legacy code, gate them behind reduced motion and plan their removal.

```html
<div class="hero">
  <video
    data-bg-video
    poster="/hero-poster.jpg"
    muted
    loop
    playsinline
    preload="none"
    aria-hidden="true"
    tabindex="-1"
  >
    <source src="/hero.webm" type="video/webm" />
  </video>
  <button type="button" data-bg-toggle class="hero__toggle">Pause background video</button>
</div>
```

```js
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const video = document.querySelector("[data-bg-video]");
const toggle = document.querySelector("[data-bg-toggle]");

// Check the preference BEFORE ever calling play(). Never autoplay then correct.
function applyMotionPreference() {
  if (reduceMotion.matches) {
    video.pause();
    video.removeAttribute("autoplay");
    toggle.textContent = "Play background video";
  } else {
    video.play().catch(() => {});
    toggle.textContent = "Pause background video";
  }
}
applyMotionPreference();
reduceMotion.addEventListener("change", applyMotionPreference);

toggle.addEventListener("click", () => {
  const paused = video.paused;
  paused ? video.play() : video.pause();
  toggle.textContent = paused ? "Pause background video" : "Play background video";
});
```

### 3.4 Inheriting the reduced-motion preference automatically

**Requirement: the product detects and inherits the operating system reduced-motion setting with no configuration by the user. Reduced motion is not an in-product toggle you make people find. It is a preference they already set, and you honor it on first paint.**

Where the preference lives at the OS level: macOS Accessibility Display Reduce motion, iOS Accessibility Motion Reduce Motion, Windows Settings Accessibility Visual effects Animation effects, Android Accessibility Remove animations.

Implementation requirements:

- A global CSS guard that neutralizes animation and transition by default, so any new animation added later inherits the behavior without the author remembering. Opt in to motion, do not opt out.
- A JS check with `window.matchMedia` before any programmatic animation, `play()` call, auto-advance timer, smooth scroll, or animation library initialization.
- A `change` listener so a user who flips the setting mid-session is respected immediately, without a reload.
- Configure animation libraries at the root. Framer Motion `MotionConfig reducedMotion="user"`, GSAP `gsap.matchMedia()`, Lottie `autoplay: false` under reduced motion.
- Reduced motion does not mean no feedback. Replace movement with instant state changes, opacity, or color. Do not remove the affordance, remove the travel.
- Keep essential motion. Loading indicators and progress meters may continue. Decorative motion, parallax, auto-scroll, and slide transitions should not.
- Offering an additional in-product toggle is welcome, but it is a supplement. It never replaces reading the system preference.

```css
/* Global guard. Motion is opt-in per component, not opt-out. */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  .parallax,
  .marquee,
  .autoscroll {
    transform: none !important;
    animation: none !important;
  }
}

/* Preferred authoring pattern: gate motion behind the safe query. */
@media (prefers-reduced-motion: no-preference) {
  .card {
    transition: transform 200ms ease;
  }
}

/* Do not force smooth scrolling on users who did not ask for it. */
@media (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
  }
}
```

```jsx
// React: one hook, used by every animated component.
function useReducedMotion() {
  const [reduced, setReduced] = React.useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = e => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

// Framer Motion: set it once at the app root and every child inherits.
<MotionConfig reducedMotion="user">
  <App />
</MotionConfig>
```

### 3.5 Target size of 44x44 CSS pixels

**Requirement: every interactive target is at least 44x44 CSS pixels.** WCAG 2.2 sets the AA floor at 24x24 with spacing exceptions (2.5.8), and 44x44 is the AAA-adjacent enhanced target (2.5.5). We use 44 as the house standard because 24 is a legal minimum, not a usable one.

- 44x44 applies to the **hit area**, not the visual glyph. A 20px icon inside a 44px padded button passes. Use padding or a pseudo-element to expand the hit area rather than scaling the icon up.
- Applies to: icon buttons, close and dismiss buttons, carousel arrows and dot indicators, checkbox and radio inputs including their labels, table row actions, pagination links, tab stops, sliders and their handles, menu items, chips, toggles, and inline links that function as buttons.
- Exceptions where the smaller floor is acceptable: links inside a sentence of body text, targets whose size is legally or functionally required, and cases where an equivalent control at full size exists elsewhere on the page.
- Minimum 8px of spacing between adjacent targets. Two 44px buttons flush against each other still produce mis-taps.
- Do not shrink targets on desktop. Pointer precision varies with tremor, arthritis, and trackpad quality, not with screen size.
- Verify the computed hit area in the browser, not the design file. Padding collapse, line-height, and `overflow: hidden` all shrink real targets.

```css
/* Baseline for every interactive element. */
button,
[role="button"],
a.button,
input[type="checkbox"],
input[type="radio"],
summary {
  min-inline-size: 44px;
  min-block-size: 44px;
}

/* Expanding a small visual glyph without changing its appearance. */
.icon-button {
  position: relative;
  inline-size: 24px;
  block-size: 24px;
}
.icon-button::after {
  content: "";
  position: absolute;
  inset: -10px; /* 24 + 20 = 44 */
}

/* Spacing between adjacent targets. */
.button-group {
  display: flex;
  gap: 8px;
}
```

### 3.6 Text reflow at 200% zoom with no clipping or overlap

**Requirement: all text remains fully visible, readable, and unobstructed when text size is increased to 200%, and when the page is zoomed to 400% at 1280px, equivalent to a 320px CSS viewport.** Nothing may be cut off, truncated, scrolled out of reach, or covered by another element.

Two distinct cases, both required:

1. **Text-only zoom**, meaning the browser or OS increases font size without scaling the layout. This is what 1.4.4 Resize Text requires, and it is the one that breaks fixed-height containers.
2. **Page zoom and reflow**, where the viewport narrows and content must reflow to a single column with no two-dimensional scrolling (1.4.10).

Also required: text must survive user-applied spacing overrides of line height 1.5, letter spacing 0.12em, word spacing 0.16em, and paragraph spacing 2em (1.4.12).

Rules that prevent the failure:

- **Size text in relative units.** `rem` for font size, unitless multipliers for `line-height`. Never `px` on body text.
- **Never set a fixed height on a container that holds text.** Use `min-height` so the container grows. Fixed `height` plus more text equals clipped text.
- **Avoid `overflow: hidden` on text containers.** It hides the failure instead of preventing it, and the text becomes unreachable rather than merely ugly.
- **Avoid line clamping for meaningful content.** `-webkit-line-clamp` and `text-overflow: ellipsis` cut content off permanently at large text sizes. If truncation is a product requirement, the full text must be available somewhere reachable.
- **Watch sticky and fixed positioning.** A sticky header sized in `px` will cover more of the page as text grows, and can hide headings, focus indicators, and form errors. Size sticky elements in `rem` and cap their height with `max-block-size` plus internal scrolling, or unstick them at large text sizes.
- **Watch absolute positioning and negative margins.** Overlapping badges, floating labels, and tooltip anchors positioned in `px` will collide with text as it grows.
- **Let containers grow.** Use flexbox and grid with `min-content` and `auto` tracks rather than fixed column widths. Avoid `white-space: nowrap` on anything that can wrap.
- **Buttons and inputs must grow with their labels.** Fixed-width buttons clip translated and enlarged text. Use padding plus `min-inline-size`.
- **Do not scale down to compensate.** Responding to large text with a smaller font size or a viewport meta hack defeats the purpose.

```css
/* Grows instead of clipping. */
.card {
  min-block-size: 12rem; /* not height */
  padding: 1rem;
  /* no overflow: hidden */
}

/* Sticky header that cannot swallow the page at large text sizes. */
.site-header {
  position: sticky;
  inset-block-start: 0;
  max-block-size: 20vh;
  overflow-y: auto;
}
@media (max-height: 30rem) {
  .site-header {
    position: static; /* unstick when vertical space runs out */
  }
}

/* Buttons that grow with their label. */
.button {
  min-inline-size: 44px;
  min-block-size: 44px;
  padding-inline: 1rem;
  white-space: normal; /* allow wrapping */
}
```

How to test it, in order:

1. Set browser page zoom to 200%, then 400% at a 1280px window width. Nothing clipped, no horizontal scrollbar for vertical content.
2. Use Firefox to test **text-only zoom**: View, Zoom, Zoom Text Only. This isolates 1.4.4 and catches fixed-height failures that page zoom hides.
3. Set the browser default font size to 24px or larger and reload. Layouts sized in `px` will ignore this entirely, which is itself the bug.
4. Apply the 1.4.12 text spacing overrides and confirm no clipping or overlap. Paste this into the DevTools console so you do not need a third party tool:

```js
var s = document.createElement('style');
s.textContent = '* { line-height: 1.5 !important; letter-spacing: 0.12em !important;' +
  ' word-spacing: 0.16em !important; } p { margin-bottom: 2em !important; }';
document.head.appendChild(s);
```

5. Check every sticky, fixed, and absolutely positioned element at each of the above.
6. Check error messages, tooltips, dropdowns, and modals, not just static page copy. Overlays are where overlap failures concentrate.

---

## Section 4: Design systems

The single highest-leverage accessibility decision is not a rule in this file. It is whether you build on a well-tested design system and then use it consistently.

Accessibility defects in a one-off component affect one screen. Accessibility defects in a shared component affect every screen, which sounds worse but is actually the opportunity: fix the component once and every instance inherits the fix. A design system converts accessibility from a per-screen tax into a one-time investment that compounds.

This matters more in AI-assisted work, not less. AI tools default to generating novel, one-off components from scratch, and a from-scratch combobox, dialog, or date picker is where the hardest accessibility bugs live. A design system is the direct antidote: it constrains generation to primitives that already work.

### 4.1 Do not hand-build the hard components

Some patterns have accessibility requirements complex enough that hand-rolling them is malpractice. Use a tested implementation for:

Dialog and modal, combobox and autocomplete, listbox and custom select, menu and menubar, tabs, disclosure and accordion, tooltip, date picker, slider, tree view, toolbar, carousel, data grid, and toast or notification region.

Each of these has a documented pattern in the [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/patterns/) with a full keyboard interaction model, roles, states, and focus behavior. The APG describes what correct looks like. It is a specification, not a component library, so pair it with an implementation rather than treating its code samples as production-ready.

### 4.2 How to evaluate an open source system

Popularity is not evidence of accessibility. Use this rubric before adopting.

| Criterion | What to look for | Red flag |
| --- | --- | --- |
| Published conformance | An accessibility conformance report, VPAT, or per-component statement | Marketing copy saying "accessible" with nothing behind it |
| Assistive tech testing | Documented testing with named screen readers and browser pairings | No mention of NVDA, JAWS, VoiceOver, or TalkBack anywhere |
| APG alignment | Explicit references to APG patterns per component | Invented interaction models |
| Documented keyboard model | A key bindings table on each component page | Keyboard behavior left undocumented |
| Focus management | Built-in focus trap, restore, and roving tabindex | You have to wire focus yourself |
| ARIA passthrough | Spreads props, forwards refs, allows `aria-*` overrides | Sealed components you must fork to fix |
| Accessible-name API | Name is a required or strongly encouraged prop on icon-only variants | Icon buttons with no name affordance |
| Contrast-safe theming | Tokens with documented ratios, theming that cannot silently break contrast | Free-form color props with no guardrails |
| Maintenance health | Accessibility issues triaged and closed, recent releases | Open a11y issues sitting for years |
| Governance and license | Clear ownership, permissive license, versioning discipline | Abandoned or single-maintainer with no successor |

Ask for the conformance report specifically. A system that has done the work usually publishes it. [USWDS, for example, publishes an accessibility conformance report using VPAT 2.5 covering 44 assessed components](https://designsystem.digital.gov/documentation/accessibility/).

### 4.3 Open source systems worth building on

Grouped by what you actually need. None of these makes your product accessible on its own, but all of them start you far ahead of a blank file.

**Headless behavior primitives.** You own all visual design, the library owns keyboard, focus, and ARIA. This is usually the right choice when you have a brand to express.

| System | Notes |
| --- | --- |
| [React Aria and React Aria Components](https://react-spectrum.adobe.com/react-aria/) | Adobe's accessibility-first primitives, the strictest ARIA pattern implementations available, broad component coverage, strong internationalization and touch and screen reader handling. Pick this when conformance is contractual. |
| [Radix Primitives](https://www.radix-ui.com/primitives) | The pragmatic default for React, roughly 28 primitives, excellent docs and DX, the foundation under shadcn/ui. Very good accessibility, slightly less exhaustive than React Aria. |
| [Ariakit](https://ariakit.org/) | APG-focused React primitives with a broad component set and detailed accessibility notes. |
| [Base UI](https://base-ui.com/) | Headless React primitives from the MUI, Radix, and Floating UI maintainers. |
| [Ark UI and Zag.js](https://ark-ui.com/) | State-machine-driven primitives that work across React, Vue, Svelte, and Solid. Useful for multi-framework organizations. |
| [Headless UI](https://headlessui.com/) | Tailwind Labs primitives for React and Vue. Small component set, clean implementation, fine for simpler needs. |

**Complete systems with published accessibility documentation.** Choose these when you want tokens, visual design, patterns, and guidance rather than only behavior.

| System | Notes |
| --- | --- |
| [U.S. Web Design System](https://designsystem.digital.gov/documentation/accessibility/) | Built on Section 508 and WCAG requirements, publishes a VPAT-based conformance report, targets WCAG 2.1 AA and works toward 2.2 criteria. Framework-agnostic HTML and CSS. |
| [GOV.UK Design System](https://design-system.service.gov.uk/accessibility/) | The strongest example of components validated through real user research and assistive technology testing, with published research behind pattern decisions. Read it even if you never use the code. |
| [IBM Carbon](https://carbondesignsystem.com/guidelines/accessibility/overview/) | Mature enterprise system with per-component accessibility documentation and a dedicated accessibility toolkit. |
| [Microsoft Fluent 2](https://fluent2.microsoft.design/) | Broad platform coverage across web, Windows, iOS, and Android with accessibility guidance per component. |
| [Adobe Spectrum](https://spectrum.adobe.com/) and [React Spectrum](https://react-spectrum.adobe.com/) | Spectrum is the design language, React Spectrum the implementation on top of React Aria. |
| [Shopify Polaris](https://polaris.shopify.com/) | Strong content and accessibility guidance alongside components. |
| [GitHub Primer](https://primer.style/) | Documented accessibility per component with a public checklist and review process. |
| [Salesforce Lightning](https://www.lightningdesignsystem.com/) and [Atlassian Design System](https://atlassian.design/) | Large enterprise systems with accessibility guidance and pattern libraries. |

**Framework-agnostic web components.** Useful when multiple stacks must share one system.

[Spectrum Web Components](https://opensource.adobe.com/spectrum-web-components/), [Carbon Web Components](https://web-components.carbondesignsystem.com/), and [Shoelace and Web Awesome](https://shoelace.style/) all ship accessible custom elements. Verify how each handles shadow DOM, label association, and form participation, since those are the common failure points in web component accessibility.

**A note on shadcn/ui.** It copies Radix-based component source into your repository rather than installing a dependency. You get full control, and you also own every accessibility bug from the moment you paste it in. You will not receive upstream accessibility fixes automatically. If you use it, treat the copied components as your own code, subject to your own review and testing, and track upstream changes deliberately.

**A note on Material UI and similar.** Widely used is not the same as well tested. Material UI has real accessibility work behind it and also real long-standing gaps, particularly in custom select, autocomplete, and date components under screen readers. If you adopt a large opinionated system, verify the specific components you rely on with your own assistive technology testing rather than trusting the brand.

### 4.4 Using the system consistently

Adoption without consistency gives you the cost of a design system and none of the benefit. Consistency is itself a WCAG requirement, through Consistent Navigation (3.2.3), Consistent Identification (3.2.4), and Consistent Help (3.2.6).

- **One system per surface.** Do not mix two component libraries in one product. Mixed systems produce conflicting focus behavior, duplicate and contradictory ARIA, competing focus styles, and two different keyboard models for the same interaction. That inconsistency is the accessibility defect.
- **Import, do not recreate.** If the system has a component, use it. A locally rebuilt button, modal, or dropdown is an accessibility regression with a deadline attached.
- **No arbitrary style values.** Style through tokens only. Arbitrary hex values and one-off Tailwind color utilities are how contrast compliance silently degrades. If a needed token does not exist, that is a system request, not a local override.
- **Never override focus styles per instance.** Focus indication belongs to the system. Local overrides are how `outline: none` gets reintroduced.
- **Same component, same name, same behavior everywhere.** A control that means "delete" must look, read, and behave identically across the product. Identical function requires identical labeling (3.2.4).
- **Keep navigation, search, and help in the same relative place** on every page and view (3.2.3, 3.2.6).
- **Pin versions and upgrade on a schedule.** Accessibility fixes arrive in minor releases. A system three years stale is a system that stopped protecting you. Read release notes for a11y fixes specifically.
- **Fix upstream, not locally.** When you find a defect, patch the shared component and let every consumer inherit it. Local workarounds fragment behavior and hide the real bug.
- **Have a contribution path.** If designers and engineers cannot get a new component into the system in reasonable time, they will build one-offs. The governance process is an accessibility control.
- **Document every deviation as debt,** with an owner and a date. Undocumented deviations become permanent.
- **Mirror the system in your design tool.** The Figma library and the code library must share component names, variants, states, and tokens. Divergence between design source and code source is where accessibility intent gets lost in handoff.
- **Include accessibility in the definition of done** for every component, using the checklist below. A component is not shipped until it passes.

### 4.5 Component definition of done

No component enters the system until all of these are true.

- [ ] Built on a native element or a documented APG pattern
- [ ] Full keyboard operation, with the key bindings documented on the component page
- [ ] Visible focus indicator at 3:1 contrast against adjacent colors, not removable per instance
- [ ] Accessible name required by the API for icon-only and ambiguous variants
- [ ] All states exposed programmatically: expanded, selected, checked, current, pressed, disabled, invalid
- [ ] Focus management specified for open, close, select, submit, and error
- [ ] Hit area at least 44x44 CSS pixels
- [ ] Text contrast 4.5:1 and non-text contrast 3:1 verified in every theme, including dark mode
- [ ] Reflows and remains uncovered at 200% text zoom and 320px CSS width
- [ ] Motion gated behind `prefers-reduced-motion`
- [ ] Any auto-advancing or auto-playing behavior has a persistent pause control
- [ ] `aria-*` props and refs pass through to the underlying element
- [ ] Tested with at least two screen reader and browser pairings, results recorded
- [ ] Automated accessibility check passes in component tests
- [ ] Accessibility notes, including known limitations, published in the component documentation

### 4.6 Telling AI tools to respect the system

Add this to your project instruction file alongside Section 2. It is the difference between an assistant that extends your system and one that quietly replaces it.

```
DESIGN SYSTEM CONSTRAINTS

- Use the project's existing design system for all UI. Import components from it.
- Never hand-build a dialog, combobox, select, menu, tabs, tooltip, date picker,
  slider, or carousel. Use the system's component or its underlying primitive.
- Never recreate a component that already exists in the system, even if a local
  version would be simpler.
- Style only with the system's design tokens. No arbitrary hex values, no one-off
  color or spacing utilities, no inline styles that bypass tokens.
- Never override focus styles, focus behavior, or keyboard handling at the call site.
- Pass accessible names explicitly for every icon-only control.
- If the system lacks a needed component, say so and propose either a composition of
  existing primitives or a specification for a new system component. Do not silently
  invent one.
- If asked to build outside the system, flag the accessibility and consistency cost
  before proceeding.
- When you do add a component, satisfy the component definition of done in Section 4.5
  and list which items still need human verification.
```

---

## Section 5: Interface consistency

Predictability is an accessibility feature. Users who navigate sequentially, magnify a small portion of the screen, rely on spatial memory, or carry a higher cognitive load all depend on the interface behaving the same way twice. Inconsistency forces them to relearn your product on every screen.

Consistency is not a nice-to-have. Three WCAG 2.2 criteria require it: Consistent Navigation (3.2.3, AA), Consistent Identification (3.2.4, AA), and Consistent Help (3.2.6, A). All three are scoped to a "set of web pages," defined by W3C as a collection of pages sharing a common purpose and created by the same author, group, or organization. Different language versions count as different sets.

### 5.1 Consistent navigation (3.2.3, Level AA)

**Requirement:** navigational mechanisms repeated on multiple pages within a set occur in the same relative order each time they are repeated, unless a change is initiated by the user ([W3C, Understanding SC 3.2.3](https://www.w3.org/WAI/WCAG22/Understanding/consistent-navigation.html)).

"Same relative order" means the same position relative to other items. Items stay in the same relative order even if other items are inserted or removed, so expanding submenus and inserted secondary navigation do not fail this criterion.

Who this serves, per W3C: people with low vision using screen magnification, who rely on visual cues and page boundaries to relocate repeated content; people who are blind and navigate sequentially, who benefit from navigation appearing in a consistent source order; and people with cognitive limitations and intellectual disabilities, who benefit from being able to predict where things are.

Rules:

- Header, primary navigation, search, utility navigation, and footer appear in the same relative order on every page. Do not reorder navigation regions by section or template.
- The skip link is the first focusable element on every page, in the same place every time. If navigation sits at the end of the page instead, a "skip to navigation" link goes at the beginning of every page.
- Primary navigation items stay in the same order everywhere. Do not resort them by relevance, recency, personalization, or engagement without the user asking for it.
- Do not relocate search, account, cart, or language controls between templates.
- Source order matches visual order, and both stay consistent. Repositioning with CSS grid or flexbox order can satisfy the eye while breaking the sequential experience.
- Landmark regions are consistent and consistently labeled. If your primary nav is `<nav aria-label="Primary">` on one page, it is `<nav aria-label="Primary">` on all of them.
- Breadcrumbs, page-level tabs, and in-page navigation occupy the same slot across templates.
- Keep the pattern consistent within each responsive variant. Layout may differ between breakpoints, but every page at a given breakpoint should behave the same way.
- In a single-page app, keep the navigation shell persistent across route changes rather than rebuilding it per view.

The documented failure is presenting navigation links in a different relative order on different pages (W3C failure F66).

### 5.2 Consistent identification (3.2.4, Level AA)

**Requirement:** components with the same functionality within a set of pages are identified consistently ([W3C, Understanding SC 3.2.4](https://www.w3.org/WAI/WCAG22/Understanding/consistent-identification.html)).

This extends to text alternatives. Non-text items with the same function need consistent text alternatives. And if two components on one page share a function with a component on another page, all three must be consistent.

Rules:

- Same function, same accessible name. A control that submits a search is "Search" everywhere, not "Search" on one page and "Find" on another. That mismatch is W3C's own example of a failure.
- Same function, same icon. Do not use a trash icon for delete in one place and an X for delete in another.
- Consistent does not mean identical. A pattern with a varying object is consistent: "Print receipt" and "Print invoice" using the same printer icon passes, because the labeling pattern holds and the functions genuinely differ. "Page 2", "Page 3", "Page 4" likewise passes.
- Different function, different name. If a check mark means "approved" in one context and "included" in another, the text alternatives should differ. Consistency is about matching function, not matching pixels.
- Visible text and accessible name must not diverge. Two buttons that look identical but carry different `aria-label` values are announced inconsistently to assistive technology, which W3C calls out specifically. This also implicates Label in Name (2.5.3).
- Maintain a terminology list. One word per concept, chosen once. Not "delete" here, "remove" there, "discard" somewhere else for the same action.
- Maintain an icon meaning registry. Every icon in the system has one documented meaning and one default accessible name.
- The criterion covers consistency across the set of pages, but be consistent within a single page too. That is best practice and prevents most of the cross-page failures anyway.

The documented failure is using two different labels for the same function on different pages within a set (W3C failure F31).

### 5.3 Consistent help (3.2.6, Level A)

**Requirement:** if a page contains any of these help mechanisms and they are repeated across multiple pages within a set, they occur in the same order relative to other page content, unless a change is initiated by the user ([W3C, Understanding SC 3.2.6](https://www.w3.org/WAI/WCAG22/Understanding/consistent-help.html)).

The four covered mechanisms:

| Mechanism | Examples |
| --- | --- |
| Human contact details | Phone number, email address, hours of operation |
| Human contact mechanism | Messaging system, chat client, contact form, social media channel |
| Self-help option | Up-to-date FAQ, "How do I" page, support page |
| Fully automated contact mechanism | Chatbot |

What this criterion does and does not require:

- It does **not** require you to provide help. It requires that help you do provide sits in a consistent place. Absence of help on some pages in a set is not a violation.
- Help may live on the page directly or as a link to a contact or support page. Either satisfies it, as long as the position is consistent.
- "Same order relative to other page content" is about serialized order. Content that precedes help on other pages should precede it here; content that follows it should follow it here.
- A help mechanism placed in a visually different location but the same serial order does not fail, though W3C notes that is unhelpful to users. Consistent both visually and programmatically is the most usable outcome.
- The user-initiated change exception covers actions like changing zoom, orientation, or viewport size, so help may sit differently at different breakpoints. Merely navigating between pages does not qualify, and neither does logging in or out unless that presents a genuinely distinct set of pages.
- Different sets of pages within a large site may use different help locations, but consistency across related sets is still better.

Practical rules:

- Pick one slot for help and keep it. A persistent header link or a fixed footer position both work. What fails users is a chat widget on one page, a footer link on another, and a phone number buried in a hamburger menu on a third.
- Your chatbot counts as a help mechanism. So does your contact form. Place them consistently and give them consistent accessible names, which pulls in 3.2.4 as well.
- If human help has limited hours, publish the hours. W3C notes this is not required but is clearly better.
- Chat widgets and help launchers must be keyboard reachable, at least 44x44, dismissible, and must not cover content or focus indicators.

### 5.4 Consistency beyond the WCAG minimum

These are not success criteria. They are what makes an interface actually learnable.

- **One interaction model per pattern.** If dropdowns close on Escape in one place, they close on Escape everywhere. Never ship two different date pickers.
- **Consistent primary action placement.** The confirm and cancel buttons in dialogs sit in the same order every time, and the primary action is visually identified the same way.
- **Consistent link and button semantics.** Links navigate, buttons act. Do not swap them for visual reasons. Users build expectations from the announced role.
- **Consistent error presentation.** Same position, same wording pattern, same icon, same announcement behavior for every form in the product.
- **Consistent keyboard conventions.** Escape closes, Enter submits, arrow keys move within a composite widget, Tab moves between widgets. Same everywhere.
- **Consistent focus behavior.** Where focus lands after opening, closing, submitting, and deleting follows one documented convention.
- **Consistent page title format.** For example "Page name, Section, Site name" on every view, updated on route change in single-page apps (2.4.2).
- **Consistent heading conventions.** The same content type gets the same heading level in the same place across templates.
- **Consistent microcopy.** One voice, one term per concept, one date format, one number and currency format.
- **Consistent state treatment.** Loading, empty, error, and success states look and read the same way across the product.
- **Consistent destructive-action handling.** Confirmation, undo, and wording follow one pattern (3.3.4).
- **No surprise context changes.** Focus alone never triggers navigation or submission, and changing a form value never navigates unless the user was warned (3.2.1, 3.2.2).
- **Consistency across themes and breakpoints.** Dark mode, high contrast mode, and every breakpoint keep the same structure, semantics, order, and labels.
- **Consistency between design source and code.** Same component names, variants, and tokens in Figma and in the repository. Divergence there is where consistency dies first.

### 5.5 Consistency audit

Run this across at least five representative templates, including a form, a listing, a detail view, an error state, and an authenticated view.

- [ ] Header, nav, search, utility controls, and footer appear in the same relative order on every template
- [ ] Skip link is the first focusable element on every page
- [ ] Landmarks are present, consistently used, and consistently labeled
- [ ] Primary navigation item order is identical everywhere
- [ ] Help mechanism occupies the same relative position everywhere it appears
- [ ] Every repeated function has one accessible name, verified with an accessibility tree inspection, not by eye
- [ ] Every icon has one documented meaning and one default accessible name
- [ ] Visible label text matches the accessible name on every control (2.5.3)
- [ ] Page title format is consistent, and updates on navigation in single-page apps
- [ ] Error, loading, and empty states are presented consistently
- [ ] Keyboard conventions, including Escape and Enter behavior, are identical across components
- [ ] Focus destination after open, close, submit, and delete follows one documented convention
- [ ] Terminology matches the product glossary, with no synonyms for the same action
- [ ] Behavior holds at every breakpoint and in every theme
- [ ] Design library and code library share names, variants, and tokens

### 5.6 Agent directives for consistency

```
CONSISTENCY CONSTRAINTS

- Keep repeated navigation, search, utility controls, help, and footer in the same
  relative source order on every page and view. Do not reorder them per template.
- Place the skip link as the first focusable element on every page.
- Use one accessible name per function across the entire product. Before naming a
  control, check whether that function is already named elsewhere and reuse that name.
- Keep the visible label and the accessible name the same. Never add an aria-label
  that differs from visible text.
- Use one icon per meaning and one meaning per icon.
- Keep help mechanisms, including chat widgets and contact links, in the same relative
  position on every page where they appear.
- Reuse the existing interaction model for any pattern the product already has. Do not
  introduce a second dropdown, dialog, date picker, or error pattern.
- Keep landmark labels, page title format, heading conventions, and terminology
  consistent with the rest of the codebase.
- If asked to change the position, label, or behavior of a repeated component on a
  single page, flag that it will break consistency across the set and ask whether the
  change should apply everywhere.
```

---

## Section 6: Alt text and image descriptions

Alt text is the most frequently written accessibility feature and the most frequently written badly. It is also the one AI tools produce most confidently and least reliably, because a model describes what an image looks like while alt text needs to convey what the image is doing.

The governing question is never "what is in this picture?" It is **"what would a sighted user learn from this image here, and how do I deliver that same information in text?"**

### 6.1 Decide the image type first

Every image falls into one of five buckets. Pick the bucket before writing a word.

| Type | Definition | Treatment |
| --- | --- | --- |
| **Decorative** | Adds no information. Textures, dividers, ambient photography, an icon next to text that already says the same thing. | `alt=""`. Empty, not missing. Or use a CSS background. |
| **Informative** | Conveys information not available in surrounding text. | Concise text conveying that information. |
| **Functional** | Inside a link or button. The image is a control. | Describe the destination or action, not the picture. |
| **Complex** | Charts, diagrams, maps, infographics. Too much information for a short string. | Short alt naming what it is, plus a full description nearby or linked. |
| **Text in image** | Contains meaningful words. | Reproduce the text exactly. Better: do not do this at all. |

The same image can be different types on different pages. Context decides, not content.

### 6.2 How to write it

- **Lead with what matters.** Front-load the meaningful detail. Screen reader users often skim by jumping between elements.
- **Be specific, then stop.** Aim for roughly 125 characters. If the meaning needs more, the extra belongs in a caption, a `<figcaption>`, or body copy.
- **Skip "image of," "photo of," and "graphic of."** The screen reader already announces the role.
- **No trailing period needed,** but be consistent about it.
- **Do not duplicate adjacent text.** If the caption or heading already says it, the image is decorative in that context.
- **Match the page's voice and terminology.** Alt text is content, not metadata. Use the same words the product uses (see 5.2).
- **Write it as a sentence fragment, not a keyword list.** Keyword stuffing for search hurts real users and no longer helps ranking.
- **One image, one purpose.** If you cannot state the purpose in a sentence, you may be using one image to do several jobs.

### 6.3 Never do this

These are the failures that show up in real audits, over and over.

| Anti-pattern | Example | Why it fails |
| --- | --- | --- |
| Filename | `alt="IMG_4471.jpg"`, `alt="hero-final-v3-compressed.png"` | Meaningless, and often announced character by character |
| Internal color code or swatch ID | `alt="RD-100"`, `alt="#B3242A"`, `alt="PANTONE 186C"` | Internal codes carry no meaning for a customer. Describe the color in human language instead |
| SKU, product ID, or CMS asset ID | `alt="SKU-88213"`, `alt="asset_00291"` | Internal reference data, not user information |
| Dimensions or technical metadata | `alt="1200x628"`, `alt="banner"`, `alt="jpg"` | Describes the file, not the content |
| Placeholder text left in | `alt="alt text here"`, `alt="lorem ipsum"`, `alt="TODO"` | Shipped debt, and embarrassing |
| Missing attribute entirely | `<img src="x.jpg">` | Screen readers may fall back to announcing the file path |
| `alt=" "` with a space | `alt=" "` | Not treated the same as empty. Use `alt=""` |
| Generic filler | `alt="image"`, `alt="picture"`, `alt="photo"`, `alt="icon"`, `alt="logo"` | Announces that something exists and nothing more |
| Redundant prefix | `alt="Image of a blue handbag"` | The role is already announced |
| Describing a decorative image | `alt="abstract gradient swoosh"` | Pure noise in the reading experience |
| Keyword stuffing | `alt="handbag purse bag leather blue designer sale"` | Unreadable, and reads as spam |
| Same alt on every image in a gallery | `alt="product photo"` five times | Users cannot tell the images apart |
| Alt text on a functional image describing the picture | A magnifying glass icon in a search button with `alt="magnifying glass"` | Describes the glyph, not the action. Use "Search" |
| Text baked into the image and not in the alt | A sale banner reading "40% off" with `alt="spring banner"` | The actual message is lost entirely |

### 6.4 Color swatches and product variants

This is the case that breaks most often, and it is worth calling out on its own.

**Never use an internal color code as the alt text or accessible name of a color swatch.** As [Level Access notes in its product display guidance](https://www.levelaccess.com/blog/elevating-e-commerce-accessibility-product-display-basics/), a code like "RD-100" is not meaningful to the user, while something like "bright red pebbled" actually describes what the customer is selecting.

Rules for swatches and variant pickers:

- Describe the color in **user-meaningful language**, using the same name shown to sighted users. If the visible label says "Sky blue," the accessible name says "Sky blue," not "SB-04" and not "#7EC8E3" (see 2.5.3 and 5.2).
- Include **texture or finish** when it distinguishes the option: "bright red pebbled," "sky blue satin," "black matte." Sighted users get that from the swatch image. Non-sighted users only get it if you write it.
- **Do not rely on the swatch color alone** to communicate the choice. Color is never the only signal (1.4.1). Pair the swatch with a visible text label, or expose the name on selection.
- **Announce the selected state programmatically**, with `aria-checked`, `aria-pressed`, or `aria-selected` depending on the pattern. Selection shown only by a border or checkmark overlay is invisible to assistive technology.
- **Announce out-of-stock and unavailable combinations in text**, not by graying out or striking through the swatch alone.
- **Update dependent content on selection.** When a variant changes the price, image, or availability, announce it through a live region (4.1.3).
- **Size swatches at 44x44** including their hit area (3.5). Small round swatches in a tight row are a classic target-size and spacing failure.
- **Use a radio group, not a set of buttons.** Variant selection is single-select from a named group. `<fieldset>` with a `<legend>` of "Color" plus radio inputs gives you group naming, arrow-key navigation, and state for free.
- **Plan focus order deliberately.** Level Access points out that focus order on a product detail page does not have to follow visual left-to-right or top-to-bottom order, and that contextual groupings or multi-column layouts may suggest a better flow ([Level Access](https://www.levelaccess.com/blog/elevating-e-commerce-accessibility-product-display-basics/)). Decide what receives focus, what the indicator looks like, and in what order.

```html
<fieldset>
  <legend>Color</legend>

  <input type="radio" id="color-red" name="color" value="bright-red" />
  <label for="color-red">
    <img src="/swatch-red.jpg" alt="" />
    <!-- Swatch image is decorative. The label text carries the meaning. -->
    <span>Bright red pebbled</span>
  </label>

  <input type="radio" id="color-sky" name="color" value="sky-blue" />
  <label for="color-sky">
    <img src="/swatch-sky.jpg" alt="" />
    <span>Sky blue satin</span>
  </label>
</fieldset>

<!-- If the design has no visible text label, the name must live on the control -->
<button type="button" role="radio" aria-checked="false" aria-label="Bright red pebbled">
  <span class="swatch" style="background: var(--color-bright-red)" aria-hidden="true"></span>
</button>
```

### 6.5 Product and commerce imagery

Product alt text is doing sales work, not compliance work.

- **Give enough detail that a screen reader user does not have to open every product page to understand the options.** Level Access suggests moving past a bare "blue handbag" to something like "sky blue satchel with perforated leather," which conveys the shade and the texture ([Level Access](https://www.levelaccess.com/blog/elevating-e-commerce-accessibility-product-display-basics/)).
- **Differentiate every image in a gallery.** "Front view," "back view showing zip pocket," "worn over the shoulder for scale," "close-up of the perforated leather." Never repeat one string.
- **Model and scale images should say what they add.** If the point is fit or size, the alt text says so.
- **Zoom and lightbox controls need accessible names and keyboard access**, and the enlarged image needs its own alt text.
- **User-generated and review photos** need a described purpose too. "Customer photo: sky blue satchel in daylight" beats "review image."
- **Do not put price, discount, or urgency messaging only inside an image.** That is text in an image, and it is the message most likely to be missed.
- **Announce prices unambiguously.** A struck-through original price next to a sale price is visually obvious and frequently garbled by a screen reader. Deliver the complete information in one concise phrase, such as "$7.99, reduced from $9.99, saving $2" ([Level Access, Cart confidence](https://www.levelaccess.com/blog/elevating-e-commerce-accessibility-cart-confidence/)).
- **Sale and discount text must pass contrast.** Red sale copy on white is the single most common contrast failure in retail, and it fails exactly the low-vision customers most likely to be price sensitive ([Level Access](https://www.levelaccess.com/blog/elevating-e-commerce-accessibility-cart-confidence/)).
- **Cart line items need identifying detail in text.** Size, color, and quantity must be readable per item so a customer can confirm the cart without opening each product. Accessibility barriers in a checkout flow are barriers to buying ([Level Access](https://www.levelaccess.com/blog/elevating-e-commerce-accessibility-cart-confidence/)).

### 6.6 By image category

| Category | Guidance |
| --- | --- |
| **Logos** | Company name only. `alt="Level Access"`. If it is a link home, `alt="Level Access, home"`. Not "logo". |
| **Icons with adjacent text** | `alt=""`. The text already says it. Two announcements of the same thing is worse than one. |
| **Icon-only controls** | Name the action, not the glyph. "Search", "Delete item", "Open menu". |
| **Charts and graphs** | Short alt names the chart type and the takeaway. The data goes in an adjacent table or list. "Bar chart: mobile conversion fell from 4.1% to 2.8% after the redesign." |
| **Infographics** | Short alt plus a full text version of the content, on the page or linked. Do not attempt to compress it into alt. |
| **Diagrams and flows** | Describe structure and relationships in a linked long description, not appearance. |
| **Maps** | Alt describes purpose. Provide the address, directions, or data in text. A map image is almost never sufficient on its own. |
| **Screenshots in documentation** | Describe what the reader is meant to notice, and put any UI text they need into the surrounding prose. |
| **Avatars and profile photos** | Usually the person's name, or `alt=""` when the name is adjacent. |
| **Captchas** | Provide an alternative that does not require solving a visual puzzle (3.3.8). |
| **Animated GIFs and memes** | Describe the content and any text. Also reconsider using them at all (3.1). |
| **Emoji and icon fonts in text** | Screen readers read emoji names literally and at length. Use sparingly, never as the sole carrier of meaning. |
| **Background images in CSS** | Invisible to assistive technology. If it carries meaning, it is not a background image. |
| **Images inside SVG** | Use `<title>` inside the SVG plus `role="img"`, or `aria-label` on the SVG element. `aria-hidden="true"` for decorative SVG. |

### 6.7 Text in images

The best alt text strategy is to have fewer images that need it.

- **Do not embed meaningful text into images.** Screen readers cannot read it, it does not scale with text zoom, it cannot be translated or searched, and it creates downstream work for whoever writes the alt text ([Level Access, template design](https://www.levelaccess.com/blog/elevating-e-commerce-accessibility-template-design-tips-and-tricks/)). This is also a WCAG requirement (1.4.5).
- Overlay real text on an image with CSS instead of baking it in. Then it reflows, zooms, translates, and needs no alt text.
- If text in an image is unavoidable, such as a logo or a supplied campaign asset, reproduce every word of it in the alt text.
- This applies to AI-generated imagery too. Generated graphics frequently contain text, sometimes misspelled. Extract it into markup rather than shipping it as pixels.

### 6.8 When AI writes the alt text

Models are useful first drafts and unreliable final answers. They describe appearance, not purpose, and they hallucinate details that are not in the image.

Requirements:

- **A human reviews every string before it ships.** Non-negotiable for product, commerce, medical, legal, and editorial content.
- **Give the model the context.** Without knowing where the image sits and why, a model cannot make the decorative-versus-informative call, which is the most consequential decision in alt text.
- **Never let a model invent facts.** Colors, brand names, quantities, prices, model names, and text content must be verified against the actual product data, not the model's reading of the pixels.
- **Never accept a color code or a filename** back from a model. If your CMS feeds it "RD-100," it will happily use it.
- **Bulk generation across a catalog needs sampling QA** at minimum, and a plan for the long tail.

Prompt template:

```
Write alt text for this image.

Context:
- Where it appears: [page type and position]
- Its purpose here: [what a sighted user should learn from it]
- Surrounding text: [nearby heading or caption, so you can avoid duplicating it]
- Known facts: [verified product name, color name, material, any text in the image]

Constraints:
- Under 125 characters.
- No "image of", "photo of", or "graphic of".
- Convey function and meaning, not just appearance.
- Use only the verified facts above. Do not infer or invent details.
- Never output a filename, SKU, hex value, or internal color code.
- Reproduce any text visible in the image, exactly.
- If the image is decorative in this context, respond only with: alt="" (decorative)

Then list anything you were unsure about.
```

### 6.9 Agent directives for alt text

```
ALT TEXT CONSTRAINTS

- Every img element has an alt attribute. No exceptions.
- Decorative images get alt="". Never omit the attribute, never use alt=" ".
- Never output a filename, file extension, dimension, SKU, CMS asset id, hex value,
  Pantone number, or internal color code as alt text.
- Never output "image", "photo", "picture", "icon", "logo", "banner", "graphic",
  placeholder text, or lorem ipsum as alt text.
- Never begin alt text with "image of", "photo of", or "graphic of".
- For color swatches, use the human-readable color name shown to users, plus finish or
  texture when it distinguishes the option. Never a code.
- For images inside links or buttons, describe the destination or action, not the image.
- For icons that sit next to text saying the same thing, use alt="".
- For charts, state the chart type and the takeaway, and add the data as a table.
- Reproduce any meaningful text that appears inside an image.
- Do not embed meaningful text in generated images; put it in markup instead.
- Give each image in a gallery or list a distinct description.
- If you lack the context to write accurate alt text, write a clearly marked TODO with
  the specific question you need answered. Do not guess.
```

### 6.10 Alt text QA

- [ ] Every `<img>` has an `alt` attribute
- [ ] No filenames, extensions, dimensions, SKUs, hex values, or color codes anywhere in alt text
- [ ] No "image of", "photo of", generic filler, or placeholder text
- [ ] Decorative images use `alt=""` and are not described
- [ ] Functional images describe the action or destination
- [ ] Color swatches use human-readable color names matching the visible labels
- [ ] Swatch and variant selection state is exposed programmatically
- [ ] Every image in a gallery has a distinct description
- [ ] Complex images have a full text alternative nearby or linked
- [ ] All meaningful text inside images is reproduced in the alt text, and ideally moved into markup
- [ ] Prices, discounts, and urgency messaging exist as text, not only in images
- [ ] Alt text terminology matches the product glossary
- [ ] Every AI-generated string has been reviewed by a human
- [ ] Spot-checked by listening with a screen reader, not only by reading the markup

---

## Section 7: Color and color vision

Color is the most emotionally powerful tool in a designer's kit and the one most likely to lock people out. It is also, as accessibility work goes, unusually binary. Brand color is a judgment call. Contrast is pass or fail.

### 7.1 Who this affects

Color vision deficiency, or CVD, is the reduced or absent ability to distinguish certain colors. Roughly **13 million Americans** experience it, and it is far more common in men than women ([Level Access](https://www.levelaccess.com/blog/color-blindness-accessibility-what-designers-need-to-know/)).

| Type | What happens |
| --- | --- |
| **Red-green** | The most widespread form. Red and green are hard to tell apart. |
| **Deuteranopia** | Green appears more red. The most common red-green form. |
| **Protanopia** | Red appears more green. |
| **Blue-yellow** | Blue and yellow are hard to distinguish. |
| **Tritanopia** | The most common blue-yellow form. Also affects blue versus green, purple versus red, and yellow versus pink. |
| **Monochromacy** | Complete color blindness. Only black, white, and gray. Extremely rare, and often accompanied by light sensitivity. |

Two things follow from that table. First, "just make it red" is not a signal for a large population. Second, the affected pairs are exactly the pairs product teams reach for by default: red and green for bad and good, blue and yellow for two data series.

### 7.2 Color is never the only signal (1.4.1, Level A)

Add a second, non-color cue: text, an icon, a shape, a pattern, a line style, position, or a change in weight. Any alternate signal is acceptable, so long as one exists.

Where color-only failures concentrate:

| Pattern | The failure | The fix |
| --- | --- | --- |
| **Form errors** | A red border or red highlight with no text | Text message adjacent to the field, plus an icon, plus `aria-invalid` (3.3.1) |
| **Required fields** | Red label or red asterisk alone | The word "required" in text, or a legend explaining the asterisk |
| **Validation success** | Green border alone | Text confirmation |
| **Status and presence indicators** | Green dot for online, red for offline | Add a text label or distinct shapes. A filled circle versus a hollow circle versus a square |
| **Buttons by color** | Green for submit, red for cancel or stop | Label every button with its action in text |
| **Links inside body text** | Color-only link differentiation | Underline them. See 7.4 |
| **Charts and graphs** | Series distinguished only by a color legend | Direct labels, patterns, line styles, and markers. See 7.5 |
| **Maps and infographics** | Color-coded regions with a color key | Provide a text or table version of the same information |
| **Availability and stock** | Grayed-out or red swatch for sold out | The words "out of stock" in text (see 6.4) |
| **Calendars and schedules** | Color blocks for event type or availability | Text labels or icons per entry |
| **Diffs, tracked changes, and code** | Red and green only | Plus and minus markers, strikethrough, and labels |
| **Data tables** | Row highlighting to mean something | A status column in text |
| **Progress and severity** | Red, amber, green scales | Add text severity, numbers, or icon shapes |
| **Toggle and selected state** | Color fill alone | A checkmark, a border change, plus a programmatic state (see 6.4) |
| **Password strength** | Colored bar only | Text: "Weak", "Strong" |
| **Heatmaps** | Color intensity alone | Numeric values on hover and in an accompanying table |

A real account of the cost, from a Level Access salesperson with deuteranopia: a work form reported an error, the only indicator was a red highlight he could not see, and he spent hours retyping sections before asking a friend to find it ([Level Access](https://www.levelaccess.com/blog/color-blindness-accessibility-what-designers-need-to-know/)). The recurring theme in these accounts is not inability. It is wasted time.

### 7.3 Contrast requirements

| What | Minimum | Criterion |
| --- | --- | --- |
| Body text and images of text | 4.5:1 | 1.4.3 AA |
| Large text, 24px regular or 18.66px bold and above | 3:1 | 1.4.3 AA |
| Icons and graphics needed to understand content | 3:1 | 1.4.11 AA |
| UI component boundaries, input borders, control states | 3:1 | 1.4.11 AA |
| Focus indicators, against adjacent colors | 3:1 | 1.4.11 AA |
| Chart elements that carry meaning | 3:1 | 1.4.11 AA |
| Enhanced text, if you are going beyond AA | 7:1, or 4.5:1 for large | 1.4.6 AAA |

- Measure against the **actual** background, including gradients, imagery, overlays, and translucency. Test the brightest and busiest area, not an average.
- Check every theme. Dark mode is a separate pass. Contrast that passes on white frequently fails on dark surfaces, and pure white text on pure black causes halation for many readers, so prefer a very dark gray and slightly off-white.
- Low contrast is the failure most easily detected by automated scanners, which makes it the most common basis for legal complaints. It is also the cheapest to fix before launch.

### 7.4 Combinations to handle carefully

Not banned, but they need a non-color cue and verified contrast whenever the distinction between them carries meaning.

- Red and green, the classic failure pair
- Blue and yellow
- Blue and green, purple and red, yellow and pink, all difficult in tritanopia
- Blue and dark red text together on white at small sizes, which Level Access cites as near-impossible to distinguish for some readers ([Level Access](https://www.levelaccess.com/blog/color-blindness-accessibility-what-designers-need-to-know/))
- Any two colors of similar luminance, regardless of hue. If they read as the same gray, they are the same color to a monochromatic viewer

Design for **luminance separation, not hue separation.** If two values differ meaningfully in lightness, they survive nearly every form of CVD, plus grayscale printing, sunlight, and cheap screens.

### 7.5 Links, charts, and maps

**Links inside blocks of text**

- Underline them. It is the only reliably available non-color cue in running text.
- If you remove the underline, the link color must have at least 3:1 contrast against the surrounding body text **and** 4.5:1 against the background, **and** a non-color cue must appear on hover and focus. Underlining is simpler and better.
- Links must be distinguishable from non-clickable text without relying on color, which Level Access flags as a specific barrier when hyperlink contrast is insufficient ([Level Access](https://www.levelaccess.com/blog/color-blindness-accessibility-what-designers-need-to-know/)).
- Visited, hover, and focus states each need their own perceivable difference.

**Charts and data visualization**

- **Label series directly** on or beside the data, rather than sending users to a color legend.
- Add a second encoding: line style, marker shape, fill pattern, texture, or thickness.
- Limit the number of series. Six color-coded lines is unreadable for everyone.
- Provide the underlying data as a table or list adjacent to the chart. This satisfies the color requirement, the alt text requirement (6.6), and usually improves the page for everyone.
- Verify at 3:1 between adjacent series and between series and background.

**Maps and infographics**

Color-coded maps and infographics are frequently impossible to interpret independently without a text alternative. Level Access describes a color-coded territory map where the only workable path was requesting a text version ([Level Access](https://www.levelaccess.com/blog/color-blindness-accessibility-what-designers-need-to-know/)). Ship the text or table version alongside the graphic, not on request.

### 7.6 Do not build a color blindness mode

Some sites offer a toggle that switches colored elements into patterns. Do not do this. These toggles **do not provide a universal experience and drive up operational costs**, and the correct approach is to apply inclusive design principles from the start rather than building a separate mode for a subset of users ([Level Access](https://www.levelaccess.com/blog/color-blindness-accessibility-what-designers-need-to-know/)).

The same reasoning applies to accessibility overlay widgets generally. A parallel experience is not an accessible experience. Fix the default.

### 7.7 Testing color

1. **Flip the design to grayscale.** Stripping color out immediately reveals every element that depended on hue to make sense. This is the fastest and highest-yield check available, and it takes seconds.
2. **Run a contrast checker** on every text and UI pair, in every theme. Level Access publishes a free [color contrast checker](https://www.levelaccess.com/color-contrast-checker-new/) that needs no install, and an [Accessible Color Picker extension](https://chromewebstore.google.com/detail/accessible-color-picker/bgfhbflmeekopanooidljpnmnljdihld) for Chrome that samples colors off a live page with an eyedropper and suggests the nearest conformant alternatives when a pair fails. Note the limit on tools of this kind: they report text contrast against 1.4.3 and 1.4.6 thresholds. They do not tell you whether a control border, focus ring, icon, or chart segment clears the 3:1 required by 1.4.11, so you still have to check non-text pairs deliberately. This is a common way border and input-outline failures survive a review that felt thorough.
3. **Use a CVD simulator** to view the interface under deuteranopia, protanopia, and tritanopia.
4. **Test in forced-colors and Windows High Contrast mode.** Your palette is discarded there, and anything that relied on a background color or a border image disappears.
5. **Test in dark mode** as a separate pass.
6. **Test on a bad screen, at an angle, in daylight.** Subtle gray-on-gray fails in the real world long before it fails a checker.
7. **Print in black and white.** Same principle as grayscale, and it catches chart problems fast.

Automated scanners detect color contrast failures immediately, which cuts both ways: easy for you to catch, and easy for a complainant to find.

### 7.8 Building a palette that holds up

- **Define legal pairings, not just colors.** Every foreground token documents which background tokens it may sit on, with the ratio recorded. If a pairing is not documented, it is not approved.
- **Use semantic tokens,** for example `color-text-error` and `color-border-focus`, not `red-500`. Semantic naming lets you fix contrast globally without hunting hex values.
- **Never let a brand color become a UI signal on its own.** If a color needs to mean something, pair it permanently with an icon or a label in the component.
- **Build the palette with luminance steps** so any two non-adjacent steps clear 3:1 and most clear 4.5:1.
- **Test brand colors early.** Many brand palettes cannot pass AA as text colors. Better to discover that during identity work than during an audit. Reserve those colors for large display type, illustration, and accents, and define compliant alternates for text and UI.
- **Do not use color to establish hierarchy alone.** Size, weight, spacing, and position carry hierarchy for everyone.


#### Audit the tokens, not only the components

Contrast review is usually done by looking at screens. That finds text problems and misses structural ones, because a failing border is far less visible to a reviewer than failing body copy, and the same token can be correct in one theme and wrong in the other.

Audit the palette itself, as data, separately from any screen it appears on.

1. **Export every token to a table**: name, value, and the background tokens it is allowed to sit on.
2. **Compute the ratio for every documented pair,** in every theme, in code rather than by eye. A dozen lines of script will do it and can then run in CI.
3. **Split the pass criteria by kind.** Text pairs are judged at 4.5:1, or 3:1 for large text. Control boundaries, focus rings, icons, chart segments, and state indicators are judged at 3:1 under 1.4.11. Mixing these two lists is the most common way a border failure survives review.
4. **Check border and input tokens specifically.** If a border is the only thing showing where a control is, it needs 3:1. A card border on a card that already has its own background color is decorative and exempt. Be honest about which is which rather than failing everything.
5. **Re-run on every theme.** A token that clears 3:1 in light mode routinely fails in dark, because dark palettes compress the range at the low end.

This is worth doing precisely because no automated engine will do it for you. Engines evaluate rendered pixels on the routes you point them at, so a token used only in a state you did not scan is never measured. In one real audit, six border and input tokens all sat between 1.2:1 and 1.9:1 against their own backgrounds, in both themes, and three separate engines reported none of them.

### 7.9 Agent directives for color

```
COLOR CONSTRAINTS

- Verify 4.5:1 for body text, 3:1 for large text, and 3:1 for icons, borders, focus
  indicators, and meaningful graphics. State the ratio you calculated in a comment.
- Never use color as the only means of conveying information, state, or distinction.
  Always pair it with text, an icon, a shape, a pattern, or a line style.
- Errors get a text message adjacent to the field, not only a red border.
- Required fields say "required" in text.
- Status indicators get a text label or a distinct shape, not only a colored dot.
- Underline links that appear inside blocks of body text.
- Label chart series directly and add a non-color encoding, plus a data table.
- Provide a text or table alternative for any color-coded map or infographic.
- Use the design system's semantic color tokens. Never introduce arbitrary hex values.
- Check contrast in every theme, including dark mode, and in forced-colors mode.
- Never propose a "color blind mode", accessibility toggle, or overlay widget. Fix the
  default experience instead.
- Prefer differences in lightness over differences in hue when encoding meaning.
```

---

## Section 8: Cognitive load, clear language, and non-apparent disabilities

Most of this file addresses barriers you can measure. This section addresses the ones you cannot see, in users you will never identify, using criteria that are thinner in WCAG than the need warrants. It is also where the largest population sits.

### 8.1 Accessible is not the same as inclusive

Worth being precise about, because the two words get used interchangeably and they are not the same thing ([DESIGNA11Y](https://www.design-a11y.com/articles/inclusivity-unveiled-contrasting-accessible-and-inclusive-design-principles)).

| | Accessible design | Inclusive design |
| --- | --- | --- |
| **Aim** | Remove barriers for people with disabilities | Work for the full spectrum of human diversity |
| **Driver** | Compliance with regulations and standards | Empathy, flexibility, and usability |
| **Scope** | Disability | Disability plus age, culture, background, language, context, and ability |
| **Test** | Does it pass? | Does it work, and for whom does it work well? |

Accessible design is a critical step toward equal participation, and it is the floor this file specifies. It can also fall short of the wider range of user experience, and a product that clears every checkpoint can still be an unpleasant thing to use. Inclusive design is rooted in **diversity, flexibility, and usability**, and it goes beyond compliance to cultivate understanding of the people on the other side of the screen.

Practically, for a team: use WCAG to know when you are done being non-compliant. Use inclusive design to know when you are done.

### 8.2 Non-apparent disabilities

Invisible or non-apparent disabilities include chronic pain, cognitive impairments, mental health conditions, and sensory sensitivities. Fibromyalgia, anxiety disorders, and ADHD sit in this group, along with migraine, vestibular dysfunction, autism, dyslexia, PTSD, long COVID, and the effects of medication and fatigue. They affect a person's ability to navigate their environment, interact with technology, and participate ([DESIGNA11Y](https://www.design-a11y.com/articles/designing-for-invisible-disabilities-making-the-unseen-seen)).

Three consequences for how you build:

1. **You cannot detect these users, so you cannot serve them conditionally.** There is no toggle, no user setting, no accessibility mode to hide the accommodation behind. The default experience has to work.
2. **People with non-apparent disabilities routinely meet skepticism, disbelief, and exclusion.** Design that demands people disclose or justify a need in order to use it will simply lose them.
3. **These conditions fluctuate.** The same person may have no difficulty on Monday and be unable to process a dense screen on Thursday. Design for their worst day, not their average one.

### 8.3 Reduce cognitive load

The three things that matter most, in order: **clear language, simple navigation, intuitive layouts** ([DESIGNA11Y](https://www.design-a11y.com/articles/designing-for-invisible-disabilities-making-the-unseen-seen)).

- **One primary action per screen or section.** If everything is emphasized, nothing is.
- **Chunk content.** Short paragraphs, meaningful headings every few screens of text, lists instead of dense prose. Headings are also how screen reader users navigate (2.4.6, 2.4.10).
- **Put the important thing first.** Front-load sentences, headings, link text, and page copy with the outcome, not the preamble.
- **Keep layouts predictable across pages.** Navigation and repeated components stay in the same place and keep the same labels. See Section 5.
- **Show progress and position** in multi-step flows. Step 2 of 4, with the ability to go back without losing work.
- **Never rely on memory across steps.** If information was already provided, do not ask for it again, or auto-populate it (3.3.7 Redundant Entry, AA).
- **Never require a cognitive test to log in.** No puzzles, no transcription, no memory games as the only path. Allow paste into every field, support password managers, and support copy from another device (3.3.8 Accessible Authentication, AA).
- **Do not impose time limits.** If a limit is unavoidable, let users turn it off, adjust it, or extend it by a simple action, and warn before session loss (2.2.1, 2.2.6).
- **Make errors recoverable, not punitive.** Say what is wrong, where, and how to fix it, in plain words next to the field. Never clear the form. Confirm before anything irreversible (3.3.1, 3.3.3, 3.3.4).
- **Explain before you ask.** Say why you need a piece of information and what happens next.
- **Keep help in a consistent place** across the product (3.2.6 Consistent Help, A).

### 8.4 Language

WCAG's reading level requirement sits at Level AAA (3.1.5), which means plain language is not strictly required for AA conformance. Write it anyway. It is the single highest-leverage accessibility change available, and it costs nothing.

- Aim for a lower secondary reading level for general audiences. Short sentences, common words, active voice.
- One idea per sentence. One topic per paragraph.
- Expand an abbreviation or acronym on first use (3.1.4 is AAA, do it anyway).
- Define unavoidable jargon inline rather than in a glossary elsewhere.
- Avoid idiom, metaphor, sarcasm, and humor that depends on inference. These are genuine barriers for many autistic users, for people with aphasia, and for anyone reading in a second language.
- Use literal, descriptive link text. "Download the 2026 pricing sheet", not "click here" or "learn more" (2.4.4).
- Sentence case for headings and buttons. ALL CAPS is slower to read and is sometimes spelled out letter by letter by screen readers.
- Left-align body copy in left-to-right languages. Justified text creates uneven word spacing that is hard to track.
- Keep measures between roughly 45 and 75 characters per line.
- Label buttons with the action they perform: "Save draft", not "Submit" or "OK".
- Set the page language, and mark inline language changes so the correct pronunciation is used (3.1.1, 3.1.2).

### 8.5 Sensory load

Sensory sensitivity means the interface can be painful, not merely annoying.

- **Motion, autoplay, and animation:** see Section 3. Everything there is a cognitive and vestibular protection as much as a visual one.
- **Sound never starts on its own.** Nothing above three seconds without a control, and no background music behind spoken content (1.4.2).
- **No sudden or abrupt audio,** and no sound as the only signal for anything.
- **No large areas of highly saturated color,** and no bold repeating patterns, especially on pages that require scrolling. Both are vestibular triggers.
- **Nothing flashes more than three times per second.** No exceptions (2.3.1).
- **Give the eye somewhere to rest.** Whitespace and clear grouping are accessibility features. Dense, uniformly weighted screens are exhausting to parse.
- **Do not stack notifications, modals, tooltips, or interruptions.** One thing at a time, dismissible, and never on a timer the user cannot control.
- **Respect `prefers-reduced-motion`, `prefers-reduced-transparency`, and `prefers-contrast`.** Reading the user's stated preferences is cheaper than guessing at their needs.
- **Offer a genuinely quiet default.** Ambient video, animated illustration, and looping backgrounds should be opt-in, not opt-out.

### 8.6 Involve the people affected

The recommendation in the source material is direct: involve individuals with these disabilities in the design process, through user testing and feedback collection ([DESIGNA11Y](https://www.design-a11y.com/articles/designing-for-invisible-disabilities-making-the-unseen-seen)).

- Recruit participants with cognitive, sensory, and non-apparent disabilities specifically, and pay them.
- Let people use their own devices and their own settings. Assistive technology configuration is personal, and a clean lab machine tells you little.
- Ask about difficulty, not preference. "Where did you get stuck" gets better data than "do you like it".
- Design the research session itself accessibly: agenda in advance, no surprise tasks, breaks, no fixed time pressure, and an easy way to stop.
- Do not treat one participant as a representative of a condition, and do not require anyone to disclose a diagnosis in order to give you feedback.

One more thing worth saying to a team. Neurodivergent thinking is an asset in creative and design work, not an accommodation cost, and plenty of people doing this work are building for their own needs ([DESIGNA11Y](https://www.design-a11y.com/articles/5-reasons-neurodiverse-brains-are-excellent-for-creative-roles)). Accessible process and accessible product tend to arrive together.

### 8.7 Agent directives for cognitive accessibility

```
COGNITIVE AND CONTENT CONSTRAINTS

- Write UI copy at a plain reading level. Short sentences, common words, active voice.
- Label controls with the action performed. Never "click here", "learn more", "OK".
- Expand abbreviations on first use. Avoid idiom, metaphor, and sarcasm in UI copy.
- One primary action per view. Do not emphasize multiple competing actions.
- Use headings to structure content, in correct order, with no skipped levels.
- Never ask for information the user already provided in the same process.
- Never require a puzzle, transcription, or memory task to authenticate. Allow paste and
  password managers in every credential field.
- Never impose a time limit without a way to extend, adjust, or turn it off, and warn
  before data is lost.
- Error messages state what is wrong, where it is, and how to fix it, in text, adjacent to
  the field. Never clear user input on error.
- Never stack modals, toasts, or interruptions, and never auto-dismiss on a timer.
- Respect prefers-reduced-motion, prefers-reduced-transparency, and prefers-contrast.
- Never gate an accommodation behind a user setting, mode, or disclosure.
```

---

## Section 9: For designers

You are the earliest point of control in this process. By the time a model is generating markup, most of the decisions that determine whether the result is accessible have already been made or left unmade by you. Karen Hawkins' research finds that around 96 percent of WCAG criteria can be addressed before development begins ([Level Access](https://www.levelaccess.com/blog/play-your-part-role-based-advice-for-agile-accessibility/)). When generation takes ninety seconds, that number tells you something specific about where a designer's leverage sits: almost all of it is upstream of the first line of code.

This section is organized around a different question than the rest of this file. Everywhere else, the question is what the code must do. Here, the question is what you must decide and write down before the code exists.

### 9.1 Your design scope is a system, not a screen

The most useful reframe I know for this comes from Karen Hawkins, Principal of Accessible Design at Level Access, in her [Accessible Design Framework](https://www.levelaccess.com/blog/introducing-the-accessible-design-framework/). Her argument is that the scope of design is not the human alone. It is a system made of a human plus the technologies that let them do what they came to do. Designers, she observes, are good at considering the human and much weaker at considering the technology.

That gap explains almost every accessibility failure an AI tool produces.

A generation model has exactly one technology in its head: a screen operated by a mouse. It has no representation of a keyboard as a primary input, no representation of a screen reader as an output, no representation of a finger as an imprecise pointer, no representation of a magnifier showing eight percent of the viewport at once. It is not being careless. It is completing the pattern it was trained on, and that pattern assumes your hardware.

When this toolkit was tested by building the same brief twice, once unguided and once with these files installed, every failure in the unguided build was a technology the model never considered. Contrast failures are the screen. Missing focus indicators are the keyboard. Unnamed graphics and absent landmarks are the screen reader. Targets under 24 pixels are the finger. See `research/preventive-test/RESULTS.md`.

So the discipline is simple to state. For every component you design, walk the technologies. Not the criteria, the technologies. The criteria fall out on their own.

| Technology | The question to ask | What it usually surfaces |
|---|---|---|
| Screen, full sight | Does this read at a glance? | Hierarchy, contrast, density |
| Screen, low vision or magnified | Does this survive 200% zoom and a 320 pixel viewport? | Reflow, truncation, lost context (1.4.4, 1.4.10) |
| Screen, color vision deficiency | Does this still work in grayscale? | Color as the only cue (1.4.1) |
| Keyboard | Can I reach it, see where I am, and get back out? | Focus order, focus visibility, traps (2.1.1, 2.1.2, 2.4.7) |
| Screen reader | What does this announce, and in what order? | Names, roles, states, landmarks, live regions (1.1.1, 4.1.2, 4.1.3) |
| Touch and imprecise pointing | Can I hit it without hitting its neighbor? | Target size and spacing (2.5.8) |
| Voice control | Can I say the label I can see? | Visible label matching accessible name (2.5.3) |
| Switch or other slow input | How many actions does this cost, and is there a time limit? | Timing, redundant steps (2.2.1, 3.3.7) |
| Reduced motion preference | Is the calm version a real design or an afterthought? | Motion policy (2.3.3) |

Run this sweep once per component and you will find more than any scan will.

### 9.2 The three phases

Hawkins' framework moves each component through three phases of the exchange between a person and their technology: **perceive, understand, operate**. It is a better sequence for design work than the WCAG principle order, because it follows what actually happens to a user in the first two seconds.

Use it as a thinking order, not a checklist.

**Perceive.** Can the person detect that this thing exists, in whatever way they take in information? This covers contrast in every state, not just the resting one. It covers text alternatives. It covers whether the thing is announced at all. A control that is visually beautiful and programmatically silent has failed at perceive for a whole category of user.

**Understand.** Now that they have detected it, do they know what it is, what it does, and what state it is in? This is where labels, names, roles, grouping, instructions, and error copy live. It is also where most AI-generated interfaces quietly fail, because a model will produce a control that looks self-explanatory to a sighted mouse user and communicates nothing to anyone else. An icon-only button is the canonical case: perfectly perceivable, completely opaque.

**Operate.** Can they act on it with the input they have, and recover when it goes wrong? Reachability, target size, focus management, timing, undo, and error recovery.

The reason this ordering earns its place in a file about AI generation is that models fail at these three phases in a predictable ratio. They are decent at perceive, weak at understand, and worst at operate. Understand and operate are also the two phases automated tooling covers least well, which is why they are where expert review and testing with disabled users earn their keep. Spend your own review time accordingly.

### 9.3 Write the annotation, because the annotation is now the prompt

This is the most important change to how designers work, and it is the part I got wrong for a long time.

Accessible design practice has always asked designers to annotate their concepts: mark the heading levels, the landmarks, the tab order, the accessible names, the focus behavior, the error messages, the live region politeness. In Hawkins' heuristics guide the recurring verb is "documented," appearing in roughly one heuristic in ten. The deliverable was never just the pixels. It was the pixels plus the intent.

In a traditional workflow that annotation is a note to a developer, and it gets lost at handoff often enough that most designers stopped writing it.

**In an AI workflow there is no handoff. The annotation is the input.**

A generation tool reads what you give it. If you give it a layout, it infers everything else from pixels, and pixel inference is exactly how you get twelve unnamed icons and a div that behaves like a button. If you give it a layout plus intent, the intent survives into the code. The annotation you stopped writing because developers ignored it is now the single highest-leverage artifact you produce.

So write it. Here is a format that works, structured by the three phases. Fill it in per component and paste it with your design.

```
COMPONENT: transaction row action menu

PERCEIVE
  Visible label:        "Actions"
  Icon:                 three-dot, decorative, hidden from AT
  Contrast:             icon 4.8:1 resting, 6.2:1 hover, both on #FFFFFF
  Focus indicator:      2px solid #0B4BD6, 2px offset, 7.02:1 on white
  Not conveyed by color alone: yes, label text present

UNDERSTAND
  Accessible name:      "Actions for {merchant}, {date}, {amount}"
  Role:                 button, opens menu
  State to expose:      aria-expanded true/false
  Group:                menu items grouped, labeled "Transaction actions"
  Instructions needed:  none
  Error copy:           n/a

OPERATE
  Keyboard:             Enter or Space opens, Escape closes and returns focus
                        to the trigger, arrow keys move within the menu
  Focus on open:        first menu item
  Focus on close:       back to the trigger, always
  Target size:          44x44 including padding, 24 minimum (2.5.8)
  Always present:       yes, not revealed on hover (2.1.1)
  Motion:               none, or 120ms fade honoring prefers-reduced-motion
  Timing:               no time limit
```

Notes on making this work in practice.

**Write it before the visual is finished, not after.** Half of these fields will change your design. Discovering that you need a visible label will change the layout. Discovering that focus has to return somewhere will change the interaction.

**Name the states explicitly.** Design every state a component can hold: default, hover, focus, active, disabled, loading, selected, expanded, error, empty. A model will invent the states you do not specify, and it will invent them without contrast checks. Note that focus and hover are different states with different users, and a hover style is not a focus indicator.

**Say what is decorative.** An unmarked icon is an ambiguity, and models resolve ambiguity by guessing. Mark decorative graphics as decorative and they will be hidden correctly.

**Put contrast values in, not just color names.** Write the ratio. "Muted gray" is not a specification and a model will pick something that fails.

**Annotate the empty, loading, and error states too.** These are generated least carefully and reviewed least often.

### 9.4 Decide these before you generate anything

A short list of decisions that are cheap now and expensive later.

- **Focus indicator.** One indicator, defined once, in the design system. Specify color, thickness, offset, and its contrast against every background it will sit on (2.4.11, 1.4.11). If this is not in your tokens, every generated component will invent its own or remove it.
- **Contrast tokens.** Audit the palette itself, not the components. A token pair that fails will fail everywhere it is used, and component-level scanning will report it as many separate defects instead of one root cause. See Section 7.
- **Target size floor.** 24 by 24 CSS pixels is the requirement (2.5.8). 44 by 44 is the number to design to. Set it as a rule for the whole system rather than per component.
- **Motion policy.** Decide what moves, what triggers it, and what the reduced motion experience is. Treat the reduced version as a real design rather than a fallback (2.3.3).
- **Heading structure per template.** One h1, properly nested, headings marking real sections.
- **Landmark map per template.** Where main, nav, header, footer, and search go. All content inside a landmark.
- **Error and status copy.** Written by you, in plain language, saying what happened and what to do next (3.3.1, 3.3.3). Also decide which messages are polite and which are assertive, because a model will not.
- **Form label position and required marking.** Labels visible, positioned consistently, and requirement indicated in text rather than color or an unlabeled asterisk (3.3.2).
- **Two cues for anything that matters.** Any information carried by color needs a second, non-color cue: text, shape, position, or an icon with a name (1.4.1).

### 9.5 Smaller things that are easy to specify and easy to lose

Not all of these are WCAG requirements. They are the details that separate a technically conformant interface from a usable one, and models get them wrong by default.

- Put form labels above or to the left of their input, consistently, and put radio and checkbox labels to the right of the control. Consistent placement is what lets people with magnification find them.
- Keep controls and their labels physically close. Proximity is what communicates the relationship before any code does.
- Avoid placeholder text as a label substitute. It disappears on input, usually fails contrast, and is not reliably announced.
- Keep tables simple. Merged cells break the header association that screen reader users depend on.
- Use SVG rather than raster images for anything that functions as a control, so it survives zoom and high contrast mode.
- Differentiate table headers from data cells visually, not only structurally.
- Give sortable columns a visible indication of which column is sorted and in which direction.
- Make sticky headers, toolbars, and non-modal dialogs movable or dismissible, and make sure a focused element is never left underneath one (2.4.11).
- Give every page a title that describes its purpose, and update it when the state changes to searched, filtered, sorted, or error.
- Design a way to bypass repeated blocks. A skip link is the cheapest version and almost no generated build includes one (2.4.1).
- Design the visible focus state for every interactive element, including ones the design system inherited rather than authored.

### 9.6 Design deliverables checklist

Before anything goes to a generation tool:

- [ ] Every component annotated across perceive, understand, and operate
- [ ] Every state designed, including focus, disabled, loading, empty, and error
- [ ] Focus indicator defined in the system with contrast values
- [ ] Contrast verified at the token level, in every state, in every theme
- [ ] Heading structure and landmark map specified per template
- [ ] Tab order stated where it differs from visual order
- [ ] Accessible names written for every control, including icon-only ones
- [ ] Decorative graphics marked as decorative
- [ ] Target sizes specified, 24 minimum and 44 preferred
- [ ] Motion policy stated, including the reduced motion experience
- [ ] Error, empty, and loading copy written in plain language
- [ ] Live region politeness decided for each status message
- [ ] Reflow verified at 320 CSS pixels and 200% zoom
- [ ] Text spacing overrides survive: 1.5 line height, 2x paragraph, 0.12em letter, 0.16em word (1.4.12)
- [ ] Grayscale check passed, no meaning carried by color alone

If you hand a generation tool a design that satisfies this list, most of what the rest of this file enforces has already been decided by a person. That is the point.

---

**Credit.** The perceive, understand, operate sequence and the framing of design scope as a human plus technology system come from the Accessible Design Framework by Karen Hawkins, Principal of Accessible Design at Level Access. Her [Accessible Design Principles and Heuristics](https://www.levelaccess.com/resources/accessible-design-principles-and-heuristics/) guide, which organizes more than 170 heuristics into eight principles, and her article [Introducing the Accessible Design Framework](https://www.levelaccess.com/blog/introducing-the-accessible-design-framework/) are the best designer-facing accessibility resources I know of. Go read them in full. They are published by Level Access and remain its copyright.

The section above is written for a narrower purpose than hers, which is instructing a generation tool rather than teaching a designer. The wording, the technology sweep, and the annotation format are mine, as is any error in the translation.

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

## Section 11: For React and component framework engineers

### Component contract

Every interactive component you build must document and support:

| Requirement | Implementation |
| --- | --- |
| Accessible name | `aria-label`, `aria-labelledby`, or visible text; pass through as a required prop for icon-only variants |
| Keyboard model | Documented key bindings following the ARIA Authoring Practices Guide pattern |
| Focus behavior | Where focus goes on open, close, select, and error |
| State exposure | `aria-expanded`, `aria-selected`, `aria-checked`, `aria-current`, `aria-pressed`, `aria-disabled` |
| Prop passthrough | Spread remaining props and forward refs so consumers can add ARIA without forking |
| Reduced motion | Animation gated on `prefers-reduced-motion` |

### Rules

- Prefer a headless, tested primitive library over a hand-rolled dialog, combobox, menu, or tabs implementation. Radix UI, React Aria, and Headless UI have solved the focus and ARIA edge cases. Reinventing them is where bugs live.
- Generate ids with `useId()`. Never hardcode ids in a reusable component.
- `onClick` on a `<div>` is a bug. If it must stay, it needs `role`, `tabIndex={0}`, and both keydown handlers. Use a `<button>` instead.
- Route changes in a single-page app must update the document title and move focus to the new view's heading or main container. Announce with a polite live region if focus movement is disruptive. (2.4.2, 4.1.3)
- Never conditionally render away a focused element without deciding where focus goes next. Orphaned focus lands on `<body>` and disorients screen reader users.
- Async states need announcement, not just spinners.

```jsx
// Status announcement pattern
<div role="status" aria-live="polite" className="visually-hidden">
  {isLoading ? "Loading results" : `${results.length} results found`}
</div>

// Error announcement: role="alert" interrupts, use sparingly
<div role="alert">{error}</div>
```

- The live region container must exist in the DOM before its content changes. Injecting the region and its text at the same time is often not announced.
- Do not use `aria-live` on large or frequently updating regions. Announce a concise summary instead.
- Escape hatch: expose `aria-*` props on every component. Consumers know their context better than the library does.

### Markup you inject bypasses every safeguard above

Anything rendered through `dangerouslySetInnerHTML` in React, `v-html` in Vue, `{@html}` in Svelte, or a raw `innerHTML` assignment is invisible to JSX linting. `eslint-plugin-jsx-a11y` reads your source tree. It cannot see a string that becomes DOM at runtime. Component tests that query by role will not catch it either, because the injected nodes usually have no role worth querying.

This is one of the highest-yield patterns to check in AI-generated code, because AI tools reach for HTML injection constantly: icon sets, rich text from a CMS, markdown output, chart libraries, and SVG sprites all arrive as strings.

In a real audit of one AI-built application, a single injection site produced 321 unnamed graphics on one page. The lint config would not have flagged it even if the project had one.

**The rule: normalise at the injection point. Never trust the string.**

```tsx
// Wrong. Whatever the source contains is now in your accessibility tree.
<div dangerouslySetInnerHTML={{ __html: icon }} />

// Right. Decide the semantics yourself, at the boundary.
function decorativeSvg(markup: string) {
  return markup
    .replace(/<svg\b/, '<svg aria-hidden="true" focusable="false"')
    .replace(/\s(on\w+)="[^"]*"/g, '');
}

<span role="img" aria-label={`${topic} icon`}>
  <span dangerouslySetInnerHTML={{ __html: decorativeSvg(icon) }} />
</span>
```

Checklist for any injected string:

- **Decide whether it is decorative or meaningful,** then enforce that decision. Decorative means `aria-hidden="true"` on the injected root. Meaningful means a name on a wrapper you control.
- **Add `focusable="false"` to injected SVG.** Without it, some engines place the element in the tab order.
- **Strip inline event handlers and `tabindex`** rather than assuming the source is well behaved.
- **Never let injected content supply your headings.** A CMS blob starting at `h4` will break document structure silently. Shift levels on the way in.
- **Scan the rendered page, not the source.** This is the class of defect that only a browser-based engine will find, which is one more argument for the loop in Section 14.

### Testing in the pipeline

```bash
# Component and end to end checks
# accessibility-checker works with Playwright, Puppeteer, and Selenium
npm i -D accessibility-checker @testing-library/react

# Command line scanning of a URL list or sitemap
npm i -D pa11y pa11y-ci

# Optional third engine, if your organisation uses the Level Access platform
npm i -D @userway/a11y-playwright

# Linting
npm i -D eslint-plugin-jsx-a11y
```

- `accessibility-checker` is the Node package of the open source [IBM Equal Access toolkit](https://github.com/IBMa/equal-access), which also ships Chrome, Firefox, and Edge extensions running the same rules. Developers see identical results in the browser and in CI, which removes most arguments about whether a finding is real.
- [Pa11y](https://pa11y.org/) runs from the command line across a URL list or a sitemap. Keep it on its default HTML_CodeSniffer runner and set `standard` to `WCAG2AA`. Its ruleset trails the newest criteria, so treat it as breadth coverage and let Equal Access carry depth.
- [Level Access](https://www.levelaccess.com/developer-tools/) publishes `@userway/a11y-playwright`, which runs the Access Engine ruleset inside a Playwright script. Local scanning writes a JSON report and needs no account. A platform token is only required if you want to push results up with `@userway/cicd-cli`. It grades findings Critical, Serious, Moderate, Minor, and it is the only one of the three engines here that reports suppressed zoom and target size out of the box.
- Add `jsx-a11y` to the lint config and treat its errors as build failures.
- Query by role and accessible name in Testing Library, not by test id. If you cannot query it by role and name, assistive tech probably cannot find it either.
- Run the checker in end-to-end tests on every key route and every modal open state, not only on initial page load.
- Gate the build on one engine, record a baseline, and stay on it. Swapping engines to make a build go green is not a fix.
- Run a second engine on a schedule rather than on every commit. Engines disagree far more than most teams expect. In a measured comparison against one deployed production application, on a single page rendering roughly 19,000 characters of real content, Pa11y on its HTML_CodeSniffer runner reported **zero** violations. On that identical page IBM Equal Access reported **403** violations plus 715 items needing review, and the Level Access Access Engine reported **321** instances, 320 of them graded Serious. The two engines that flagged the page agreed almost exactly on the dominant problem: IBM counted 320 SVG elements with no accessible name, Level Access counted 320 elements with no name mechanism. Independent engines converging on the same number is strong evidence the finding is real.
- Understand why an engine returns zero before you trust it. In the comparison above, the zero was not a disagreement about severity, it was a coverage gap. The WCAG2AA ruleset shipped with that version of HTML_CodeSniffer contains 98 rule files, and not one of them checks whether an SVG has an accessible name. The only rule file in the whole set that even mentions SVG is a AAA contrast rule. The engine was not passing the page, it was not looking at that class of element. Before you cite a clean result, confirm the ruleset actually contains a rule for the thing you care about.
- A single engine returning a clean result is not evidence that a page is accessible.
- Automated tooling catches roughly a third of issues. It is a floor, never a pass.

---

## Section 12: For design tools and AI prompting

### Figma and design files

- Use auto layout so reflow behavior is expressible rather than pixel-pinned.
- Name layers meaningfully. Layer names become the first draft of everyone's mental model, and of code generation output.
- Use text styles and color variables with contrast documented on the token, so accessible pairings are picked by default.
- Order layers to match intended reading order. Design tool layer order and generated DOM order are correlated.
- Annotate with a handoff plugin or a dedicated annotation layer covering headings, landmarks, tab order, alt text, and focus states. In an AI workflow this annotation is not a note to a developer, it is the input the tool builds from, so it is worth more than it used to be. Section 9.3 has a format for it.
- Include the keyboard flow in prototypes, not just click paths.

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

## Section 13: For AI-generated content

### Alt text

Rules for writing it, and for asking a model to write it:

- Purpose first. What is this image doing on this page? A product photo, a chart, a decorative texture, and a diagram each need a different answer.
- Skip "image of" and "photo of". Screen readers already announce the role.
- Keep it to roughly 125 characters where you can. Longer content belongs in a caption, a `<figcaption>`, or adjacent body text.
- Decorative images get `alt=""`, not a description. A described decorative image is noise.
- Functional images, meaning an image inside a link or button, get alt text describing the destination or action, not the picture.
- Charts and data visualizations: the alt text states the takeaway, and the underlying data appears as a table or list nearby.
- Text in an image must be reproduced in the alt text.
- Never accept model-generated alt text unreviewed. Models describe what they see, not what the image is for, and they hallucinate details.

Prompt template:

```
Write alt text for this image. Context: it appears [where] and its purpose is [why].
Constraints: under 125 characters, no "image of", state the function not just the
appearance, reproduce any text visible in the image. If the image is decorative in
this context, respond with: alt="" (decorative).
```

### Captions, transcripts, and audio

- AI captions are a first draft. Human review is required for names, jargon, acronyms, numbers, and speaker attribution. Auto-captions do not meet 1.2.2.
- Captions need punctuation, speaker labels, and non-speech audio that carries meaning, such as [laughter] or [door closes].
- Transcripts should be structured with headings and speaker names, not delivered as an undifferentiated wall of text.
- Synthetic voice content still needs a transcript.

### Written content

- Plain language: short sentences, active voice, common words, one idea per paragraph. Expand acronyms on first use.
- Front-load. Put the conclusion first, then the detail.
- Use real headings, real lists, and real tables in markup. Do not simulate structure with bold text, dashes, or spacing.
- Link text must stand alone out of context. (2.4.4)
- Do not use emoji, ASCII art, or decorative characters to carry meaning. Screen readers read them literally and often at length.
- Do not use directional or sensory instructions as the only wayfinding. (1.3.3)
- Set the language of any passage that changes language. (3.1.2)

### Chatbots and generative interfaces

- Streaming responses must be announced without spamming. Announce on completion with a polite live region, not per token.
- The message history needs a keyboard-navigable structure and clear author attribution per message.
- Generated interactive elements inside a response must meet the same standards as the rest of your product. Generated markup is your markup.
- Stop, regenerate, and copy controls need accessible names and keyboard access.
- Never present a generated interface state with no textual equivalent.

---

## Section 14: The build loop, automated checks and the manual test queue

This section turns the rest of this file into something an agent runs rather than something it reads. Two outputs: violations fixed during the build, and a written queue of the things a machine cannot judge.

### 14.1 What automated checking actually does

Automated engines reliably detect roughly a third of accessibility defects. They are excellent at missing attributes, contrast math, invalid ARIA, unlabeled controls, and structural errors. They cannot tell you whether alt text is meaningful, whether a heading describes its section, whether focus order makes sense, whether an error message is understandable, or whether a component is usable with a screen reader.

So the loop below has two halves, and the second half is not optional. A build that passes the scanner is not accessible. It is un-embarrassing.

### 14.2 Setup

```bash
npm i -D accessibility-checker   # open source IBM Equal Access engine
npm i -D pa11y pa11y-ci          # breadth scanning across a URL list or sitemap
npm i -D eslint-plugin-jsx-a11y  # catches a class of errors before the page renders

# Optional, if your organisation uses the Level Access platform
npm i -D @userway/a11y-playwright
```

`.achecker.yml` in the project root. Note `reportLevels` includes `manual`, which is how the engine hands you the items that need a human. That list becomes the manual test queue in 14.6.

```yaml
ruleArchive: latest
policies:
  - IBM_Accessibility
failLevels:
  - violation
  - potentialviolation
reportLevels:
  - violation
  - potentialviolation
  - recommendation
  - potentialrecommendation
  - manual
outputFormat:
  - json
  - html
outputFolder: reports/accessibility
baselineFolder: test/baselines
outputFilenameTimestamp: false
```

`IBM_Accessibility` is the superset policy and the one to use. A `WCAG_2_1` policy is also published if you need to report against that specific scope. Confirm the current policy list in the [toolkit documentation](https://github.com/IBMa/equal-access) rather than assuming.

`.pa11yci` in the project root, for scanning many routes quickly. `standard` and `runners` are passed through to Pa11y.

```json
{
  "defaults": {
    "standard": "WCAG2AA",
    "runners": ["htmlcs"],
    "includeWarnings": true,
    "timeout": 30000,
    "viewport": { "width": 320, "height": 640 },
    "reporters": ["cli", ["json", { "fileName": "./reports/accessibility/pa11y.json" }]]
  },
  "urls": ["http://localhost:3000/", "http://localhost:3000/checkout"]
}
```

The 320px viewport is deliberate. Scanning only at desktop width hides the reflow and target size failures from 3.5 and 3.6.

```json
{
  "scripts": {
    "a11y": "node scripts/a11y-scan.mjs",
    "a11y:routes": "pa11y-ci",
    "a11y:sitemap": "pa11y-ci --sitemap http://localhost:3000/sitemap.xml"
  }
}
```

### 14.3 The scan script

`scripts/a11y-scan.mjs`. Scans real rendered routes and interactive states, not static HTML, because most failures only exist after a menu opens.

```js
import { chromium } from 'playwright';
import aChecker from 'accessibility-checker';

const BASE = process.env.BASE_URL || 'http://localhost:3000';
const ROUTES = ['/', '/products', '/checkout'];

// States that only exist after interaction. Scan these too.
const STATES = [
  { route: '/', label: 'nav-open', open: async (page) => {
      await page.getByRole('button', { name: /menu/i }).click();
      await page.getByRole('navigation').waitFor();
    } },
];

let failed = false;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 360, height: 800 } });

try {
  for (const route of ROUTES) {
    await page.goto(BASE + route, { waitUntil: 'networkidle' });
    const { report } = await aChecker.getCompliance(page, 'route' + route);
    if (aChecker.assertCompliance(report) !== 0) {
      failed = true;
      console.log(aChecker.stringifyResults(report));
    }
  }

  for (const state of STATES) {
    await page.goto(BASE + state.route, { waitUntil: 'networkidle' });
    await state.open(page);
    const { report } = await aChecker.getCompliance(page, 'state/' + state.label);
    if (aChecker.assertCompliance(report) !== 0) {
      failed = true;
      console.log(aChecker.stringifyResults(report));
    }
  }
} finally {
  await browser.close();
  await aChecker.close();
}

process.exit(failed ? 1 : 0);
```

`assertCompliance` returns `0` for a pass, `1` when results differ from a recorded baseline, and `2` when something matched a level in `failLevels`.


#### Prove the scan actually ran before you believe the number

A scanner reports on whatever was in the DOM when it looked. If it looked at a login wall, a consent banner, a loading skeleton, or an empty state, it will report very few problems and exit successfully. **A clean result from a scan you did not validate is worse than no scan, because it creates confidence you have not earned.**

This is not a rare edge case. It is the normal condition of modern applications:

- **Client-side routing.** Frameworks using hash routing serve every route from one URL. Pointing a scanner at `https://example.com/settings` may load the home route, or nothing.
- **Gates.** Auth walls, onboarding steps, cookie banners, and profile pickers all render instead of your application.
- **Asynchronous data.** A list that renders after a fetch is not present at `domcontentloaded`, and often not at `networkidle` either.
- **Lazy rendering.** Content below the fold, or inside a virtualised list, may never render in a headless viewport unless you scroll.

Add these four assertions to every scan, and fail the run if any of them fails:

```js
// 1. Get past the gate deterministically, before any navigation.
await context.addInitScript(() => {
  localStorage.setItem('app-session', 'test-user');
});

await page.goto(url, { waitUntil: 'domcontentloaded' });

// 2. Wait for a real element that only exists on the page you meant to scan.
await page.waitForSelector('main [data-testid="content-loaded"]', { timeout: 30000 });

// 3. Force lazy content to render.
for (let i = 0; i < 3; i++) {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(2000);
}
await page.evaluate(() => window.scrollTo(0, 0));

// 4. Record how much actually rendered, and refuse to trust a thin page.
const chars = await page.evaluate(() => document.body.innerText.trim().length);
if (chars < 500) {
  throw new Error(`Scan aborted: only ${chars} characters rendered at ${url}. ` +
                  `The scanner is probably looking at a gate or an empty state.`);
}
console.log(`${url}: ${chars} characters scanned`);
```

Then apply two rules of interpretation:

- **Log the rendered character count next to every result, permanently.** It is the single most useful number for spotting an invalid run later, and it makes a sudden drop obvious in CI history.
- **Treat zero as a question, not an answer.** When an engine reports no violations, confirm two things before you repeat it: that the page rendered, and that the ruleset contains a rule for the thing you care about. Rulesets differ enormously in coverage. An engine that has no rule for a defect will report zero for that defect forever, and it will look exactly like a pass.

### 14.4 The agent build loop, paste this into your instruction file

```
BUILD LOOP: SCAN AND REPAIR

After generating or modifying any UI, before reporting the work as done:

1. Run: npm run a11y
   If a dev server is needed, start it first. If the project has no scan script yet,
   create it from Section 14 of ACCESSIBILITY.md, then run it.
2. Read every reported item. Do not summarize the count and move on.
3. Triage by the severity policy in 14.5.
4. Fix BLOCKING items at the source:
   - Fix the component, the markup, or the token. Never patch the symptom.
   - If the component came from the design system, fix the consuming code first. Only
     report an upstream bug if the primitive itself is at fault.
   - Prefer removing a hand-rolled control and replacing it with a tested primitive over
     adding ARIA to make the hand-rolled version pass.
5. Re-run the scan. Repeat up to 3 times.
6. If an item still fails after 3 attempts, STOP fixing it. Write it into
   docs/accessibility/MANUAL-TESTING.md under "Unresolved", with the rule ID, the file
   and line, what you tried, and why it did not work. Then tell the author in plain words.
7. Write or update docs/accessibility/MANUAL-TESTING.md per 14.6.
8. Report using this exact shape:

   Automated scan: <n> routes and <n> states scanned
   Fixed: <rule id, what changed, which file>
   Unresolved: <rule id, why, what a human needs to decide>
   Needs manual testing: <count> items queued in docs/accessibility/MANUAL-TESTING.md
   Not verified by this scan: screen reader behavior, focus order sense, alt text
   accuracy, copy clarity, and anything in Section 15.

NEVER do any of the following:
- Never add a rule to an ignore list, a suppression comment, or the baseline file to make
  a scan pass. Baselines record known debt that a human accepted. They are not a fix, and
  an agent does not get to accept debt on the author's behalf.
- Never widen failLevels, drop a policy, remove a route, or lower the viewport count to
  reduce the finding count.
- Never delete or disable the scan script or the CI step.
- Never add aria-hidden, role="presentation", or tabindex="-1" to hide an element from a
  scanner. That hides it from users too.
- Never say "accessible", "compliant", or "WCAG AA" about your own output. Say what you
  scanned, what you fixed, and what remains unverified.
```

### 14.5 Severity policy

Decide this once and write it into the config block in Section 0, so the agent is not guessing what "critical" means.

| Engine level | Meaning | Policy |
| --- | --- | --- |
| `violation` | A definite failure | **Blocking.** Fix before the work is reported as done. |
| `potentialviolation` | Probably a failure, needs a look | **Blocking.** Fix, or justify in writing in the manual queue. |
| `recommendation` | Improvement, not a conformance failure | Fix if cheap. Otherwise log it. |
| `potentialrecommendation` | Possible improvement | Log it. |
| `manual` | The engine cannot judge this. A human must | **Route to `MANUAL-TESTING.md`.** Never mark as passed. |

Regardless of level, these are always blocking, because they are the failures users feel immediately: missing or removed focus indicator, keyboard trap, unlabeled interactive control, contrast below the ratios in 7.3, target smaller than the minimum in 3.5, autoplaying motion with no pause control, and animation that ignores `prefers-reduced-motion`.

### 14.6 The manual test queue

The file the agent writes, and the reason this loop is honest. Path: `docs/accessibility/MANUAL-TESTING.md`. It is generated and updated, never hand-maintained, and it is derived from three sources: every `manual` level item the engine reports, every component the agent touched matched against the checklist below, and everything the agent could not resolve.

```
MANUAL TEST QUEUE: GENERATION RULES

Write or update docs/accessibility/MANUAL-TESTING.md whenever you add or change UI.

Include an entry for each of the following, using the template in 14.7:

1. Every item the engine reported at "manual" level.
2. Every component you created or modified, checked against this map:

   Any custom control        -> keyboard operation, focus visibility, accessible name
   Dialog, drawer, sheet     -> focus trap, focus return on close, Escape, background inert
   Menu, combobox, listbox   -> arrow keys, Home and End, type-ahead, Escape, selection
                                announcement
   Tabs                      -> arrow keys, focus versus activation, panel association
   Carousel, slideshow       -> pause control reachable and labeled, no focus loss on
                                advance, announcement of slide change
   Form                      -> label association, error announcement, error recovery,
                                required indication, submit with keyboard only
   Table, data grid          -> header association, caption, navigation announcement
   Chart, map, infographic   -> text alternative accuracy, non-color encoding
   Any image                 -> whether the alt text is meaningful in this context
   Any heading change        -> whether the heading describes the section
   Any new page or route     -> reading order, landmark structure, page title, focus on
                                navigation
   Any motion or transition  -> behavior with prefers-reduced-motion enabled
   Any live or async region  -> whether the update is announced, and not too often
   Any color or token change -> grayscale review, forced-colors mode, dark mode

3. Everything you could not fix, under an "Unresolved" heading.

Rules:
- Say what to test, how to test it, and what the correct result is. A tester should not
  need to read the code.
- Never write "test for accessibility". Write the specific interaction and the expected
  announcement or behavior.
- Never mark an item as passed. You cannot run these. Leave the result blank.
- Keep resolved entries in the file with the date and the tester's name. This becomes the
  audit trail.
```

### 14.7 Entry template

```markdown
### [Component or route name]

**File:** `src/components/Example.tsx`
**Added or changed:** 2026-07-27
**Why manual:** Screen reader announcement cannot be verified automatically
**Related criteria:** 4.1.2, 2.4.3

| # | Test | How | Expected result | Result |
| --- | --- | --- | --- | --- |
| 1 | Keyboard operation | Tab to the control, then Enter and Space | Activates, and focus stays on the control | |
| 2 | Focus visibility | Tab to it in light and dark theme | Visible indicator, at least 3:1 against adjacent colors | |
| 3 | Accessible name | Inspect with a screen reader | Announced as "Filter results, button" | |
| 4 | Escape behavior | Open, then press Escape | Closes, focus returns to the trigger | |
| 5 | Reduced motion | Enable the OS setting, then reload | Opens with no transition | |

**Assistive tech pairings to cover:** VoiceOver with Safari, NVDA with Firefox, TalkBack
with Chrome. Record which pairing found which issue.

**Notes:**
```

### 14.8 Where the loop runs

Three places, ordered by how early they catch things.

**Pre-commit**, cheapest and fastest.

```bash
# .husky/pre-commit
npx eslint --ext .tsx,.jsx --rulesdir node_modules/eslint-plugin-jsx-a11y src
```

**Pull request**, the real gate.

```yaml
# .github/workflows/accessibility.yml
name: Accessibility
on: [pull_request]
jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run build
      - run: npm run start &
      - run: npx wait-on http://localhost:3000
      - run: npm run a11y
      - run: npm run a11y:routes
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: accessibility-reports
          path: reports/accessibility/
```

Fail the job on a non-zero exit. A warning nobody reads is not a gate.

**Before release**, the human pass. Work the queue in `MANUAL-TESTING.md`, then Section 15.

### 14.9 Honest limits of this loop

- The engine's rule coverage is not the same as WCAG's criterion list. Passing every rule is not conformance.
- Scanning a route does not scan its states. That is why 14.3 scans opened menus and modals explicitly, and it is still incomplete.
- Nothing here evaluates whether the thing you built makes sense. That requires the people in 8.6 and step 15 of Section 15.
- An agent that fixes its own violations is still the party that created them. The loop reduces defects. It does not make generated UI trustworthy.

---

## Section 15: Verification

Automated tooling finds a minority of issues. This sequence catches most of the rest.

### Fast pass, every build

1. Run an automated checker and fix every violation. The [IBM Equal Access](https://github.com/IBMa/equal-access) extension for Chrome, Firefox, or Edge gives you an in-browser pass in seconds, and [Pa11y](https://pa11y.org/) covers a URL list from the command line.
2. Tab through the entire page. Confirm you can see focus at every stop and reach every control.
3. Zoom to 200% and to 400%. Confirm nothing is clipped or lost.
4. Check contrast on new colors.

### Full pass, before release

5. Test with a screen reader on the real flow. VoiceOver with Safari on macOS and iOS, NVDA with Firefox or Chrome on Windows, TalkBack with Chrome on Android. Do not test a screen reader with the wrong browser pairing.
6. Test at 320px CSS width.
7. Test with the 1.4.12 text spacing overrides applied. The snippet is in 3.6.
8. Test in Windows High Contrast and forced-colors mode.
9. Test with `prefers-reduced-motion` enabled at the OS level.
10. Test keyboard-only completion of every critical path, including error recovery.
11. Test with voice control, meaning Voice Control or Dragon, where visible labels must match accessible names. (2.5.3)

### Manual inspection tools

12. Inspect the accessible name, role, and state of individual elements by hand. The Firefox DevTools Accessibility Inspector and the Chrome DevTools accessibility tree both expose this without installing anything, and [ANDI](https://www.ssa.gov/accessibility/andi/help/install.html), a free bookmarklet from the U.S. Social Security Administration, walks structure, headings, links, tables, and contrast interactively. For contrast, the color picker in Chrome and Firefox DevTools reports the ratio live against the actual rendered background.

### Two cheap checks worth building into design review

13. **Grayscale review.** Flip the design or the live page to grayscale. Anything that stops making sense was relying on hue. Seconds to run, and it catches most color-only failures before code exists ([Level Access](https://www.levelaccess.com/blog/color-blindness-accessibility-what-designers-need-to-know/)).
14. **Spoken user interface.** During prototyping, have someone read the interface aloud, in the order a screen reader would encounter it. Decide how each element and component should be announced and in what order. This surfaces garbled price announcements, missing labels, and nonsensical reading order long before development ([Level Access, Cart confidence](https://www.levelaccess.com/blog/elevating-e-commerce-accessibility-cart-confidence/)).

### The pass that matters most

15. Test with people with disabilities, paid for their time, on real tasks, on their own assistive technology and settings. Nothing in this file substitutes for that. Automated tools and expert review find defects. Users find the ones that stop them.

---

## Section 16: WCAG 2.2 Level A and AA reference

All 55 Level A and AA success criteria, with primary ownership. Ownership is a starting point for accountability, not an excuse. Verified against the [W3C WCAG 2.2 Recommendation](https://www.w3.org/TR/WCAG22/).

**D** = Design, **E** = Engineering, **C** = Content, **P** = Product or process

### 1. Perceivable

| SC | Name | Level | Owner |
| --- | --- | --- | --- |
| 1.1.1 | Non-text Content | A | C, D |
| 1.2.1 | Audio-only and Video-only (Prerecorded) | A | C |
| 1.2.2 | Captions (Prerecorded) | A | C |
| 1.2.3 | Audio Description or Media Alternative (Prerecorded) | A | C |
| 1.2.4 | Captions (Live) | AA | C, P |
| 1.2.5 | Audio Description (Prerecorded) | AA | C |
| 1.3.1 | Info and Relationships | A | E, D |
| 1.3.2 | Meaningful Sequence | A | E, D |
| 1.3.3 | Sensory Characteristics | A | C, D |
| 1.3.4 | Orientation | AA | E, D |
| 1.3.5 | Identify Input Purpose | AA | E |
| 1.4.1 | Use of Color | A | D |
| 1.4.2 | Audio Control | A | E |
| 1.4.3 | Contrast (Minimum) | AA | D |
| 1.4.4 | Resize Text | AA | E, D |
| 1.4.5 | Images of Text | AA | D, C |
| 1.4.10 | Reflow | AA | E, D |
| 1.4.11 | Non-text Contrast | AA | D |
| 1.4.12 | Text Spacing | AA | E, D |
| 1.4.13 | Content on Hover or Focus | AA | E, D |

### 2. Operable

| SC | Name | Level | Owner |
| --- | --- | --- | --- |
| 2.1.1 | Keyboard | A | E |
| 2.1.2 | No Keyboard Trap | A | E |
| 2.1.4 | Character Key Shortcuts | A | E |
| 2.2.1 | Timing Adjustable | A | E, P |
| 2.2.2 | Pause, Stop, Hide | A | E, D |
| 2.3.1 | Three Flashes or Below Threshold | A | D, E |
| 2.4.1 | Bypass Blocks | A | E |
| 2.4.2 | Page Titled | A | E, C |
| 2.4.3 | Focus Order | A | E, D |
| 2.4.4 | Link Purpose (In Context) | A | C |
| 2.4.5 | Multiple Ways | AA | P, D |
| 2.4.6 | Headings and Labels | AA | C, D |
| 2.4.7 | Focus Visible | AA | D, E |
| 2.4.11 | Focus Not Obscured (Minimum) | AA | E, D |
| 2.5.1 | Pointer Gestures | A | E, D |
| 2.5.2 | Pointer Cancellation | A | E |
| 2.5.3 | Label in Name | A | C, E |
| 2.5.4 | Motion Actuation | A | E |
| 2.5.7 | Dragging Movements | AA | D, E |
| 2.5.8 | Target Size (Minimum) | AA | D |

### 3. Understandable

| SC | Name | Level | Owner |
| --- | --- | --- | --- |
| 3.1.1 | Language of Page | A | E |
| 3.1.2 | Language of Parts | AA | C, E |
| 3.2.1 | On Focus | A | E |
| 3.2.2 | On Input | A | E |
| 3.2.3 | Consistent Navigation | AA | D, P |
| 3.2.4 | Consistent Identification | AA | D, C |
| 3.2.6 | Consistent Help | A | D, P |
| 3.3.1 | Error Identification | A | E, C |
| 3.3.2 | Labels or Instructions | A | D, C |
| 3.3.3 | Error Suggestion | AA | C, E |
| 3.3.4 | Error Prevention (Legal, Financial, Data) | AA | P, E |
| 3.3.7 | Redundant Entry | A | P, E |
| 3.3.8 | Accessible Authentication (Minimum) | AA | E, P |

### 4. Robust

| SC | Name | Level | Owner |
| --- | --- | --- | --- |
| 4.1.2 | Name, Role, Value | A | E |
| 4.1.3 | Status Messages | AA | E |

Note: 4.1.1 Parsing is obsolete and was removed in WCAG 2.2. Do not cite it. The 2.2 additions over 2.1 are 2.4.11, 2.5.7, 2.5.8, 3.2.6, 3.3.7, and 3.3.8 at A or AA level ([W3C, What's New in WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)).

---

## Section 17: Common AI-generated failure patterns

What to look for specifically when reviewing AI output. These recur across tools.

| Pattern | Why it happens | Fix |
| --- | --- | --- |
| `<div onClick>` instead of `<button>` | Training data is full of it | Use the native element |
| `outline: none` in a reset | Copied from legacy CSS resets | Replace with `:focus-visible` styles |
| Placeholder used as the label | Looks cleaner in a screenshot | Add a persistent visible label |
| Identical link or button names repeated | Component reuse without context | Unique accessible names per instance |
| Markup injected with `dangerouslySetInnerHTML` or `innerHTML` | Icon sets, CMS content, and SVG sprites arrive as strings | Normalise at the injection point; lint cannot see runtime strings |
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

## Section 18: Scope and honesty

WCAG 2.2 AA is a floor, not a definition of accessible. Conformance and usability are different claims. A product can pass every criterion in Section 16 and still be difficult for a screen reader user, a person with a cognitive disability, or someone using switch access.

Things this file does not cover: native mobile platform APIs, PDF and document remediation, email accessibility, kiosk and hardware interfaces, XR and spatial interfaces, jurisdiction-specific legal requirements such as the European Accessibility Act, Section 508, or the ADA Title II web rule, and organizational program maturity.

If you are making a legal or procurement claim, that requires a formal audit and an accessibility conformance report. Do not substitute this file for one.

---

## Attribution and reuse

Created by **Dana Randall**, creative director and designer working at the intersection of accessibility, brand, and AI-native design.

Use it, fork it, adapt it for your team, put it in your repos, hand it to your AI tools, and use it commercially. If you improve it, tell me what you changed.

### License

Licensed under [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/) (CC BY 4.0).

You are free to share and adapt this material for any purpose, including commercially. The one condition is attribution: credit Dana Randall, link to the license, and indicate if you made changes.

A line like this is enough:

```
Adapted from the AI A11y Toolkit by Dana Randall, licensed CC BY 4.0.
https://github.com/danarandall/ai-a11y-toolkit
```

If you paste these rules into an internal tool or a client project, keep that line in the file. That is both the license condition and, practically, how other people find their way back to the current version.

Full license text: https://github.com/danarandall/ai-a11y-toolkit/blob/main/LICENSE

### Sourcing

Everything here is written in original language. This file cites publicly available sources and links to them, because reading the original is always better than reading my summary of it. It does not reproduce anyone's text.

Where a rule comes from WCAG, the success criterion is named so you can go read it. Where guidance comes from a practitioner's published work, they are credited by name with a link. Facts and requirements are not anyone's property. The words used to explain them are, and those words here are mine.

Tools and resources are recommended on merit, weighted toward open source and toward things you can use without an account. Where a commercial platform is mentioned, it is mentioned because it does something the open source options do not, and it is always marked optional.

### Primary sources

- [Web Content Accessibility Guidelines (WCAG) 2.2, W3C Recommendation](https://www.w3.org/TR/WCAG22/)
- [What's New in WCAG 2.2, W3C WAI](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)
- [How to Meet WCAG, Quick Reference, W3C WAI](https://www.w3.org/WAI/WCAG22/quickref/)
- [ARIA Authoring Practices Guide, W3C](https://www.w3.org/WAI/ARIA/apg/)
- [Understanding WCAG 2.2, W3C](https://www.w3.org/WAI/WCAG22/Understanding/)
- [Using ARIA, W3C](https://www.w3.org/TR/using-aria/)
- [Understanding SC 3.2.3 Consistent Navigation, W3C](https://www.w3.org/WAI/WCAG22/Understanding/consistent-navigation.html)
- [Understanding SC 3.2.4 Consistent Identification, W3C](https://www.w3.org/WAI/WCAG22/Understanding/consistent-identification.html)
- [Understanding SC 3.2.6 Consistent Help, W3C](https://www.w3.org/WAI/WCAG22/Understanding/consistent-help.html)
- [USWDS Accessibility and conformance report](https://designsystem.digital.gov/documentation/accessibility/)
- [GOV.UK Design System Accessibility](https://design-system.service.gov.uk/accessibility/)

### Further reading

- [Accessible Design Principles and Heuristics](https://www.levelaccess.com/resources/accessible-design-principles-and-heuristics/), Karen Hawkins. Over 170 design heuristics organized into eight principles. The best designer-facing accessibility reference in print, and the structural basis for Section 9.
- [Introducing the Accessible Design Framework](https://www.levelaccess.com/blog/introducing-the-accessible-design-framework/), Karen Hawkins. The perceive, understand, operate model, and the argument that the scope of design is a system rather than a person.
- [Accessible Design Principles and Heuristics: The Story Behind the Guide](https://www.levelaccess.com/blog/accessible-design-principles-and-heuristics-the-story-behind-the-guide/), Karen Hawkins. How the principles were derived.

### DESIGNA11Y

Written by the author of this file.

- [DESIGNA11Y articles index](https://www.design-a11y.com/articles)
- [Inclusivity Unveiled: Contrasting Accessible and Inclusive Design Principles](https://www.design-a11y.com/articles/inclusivity-unveiled-contrasting-accessible-and-inclusive-design-principles)
- [Designing for Invisible Disabilities: Making the Unseen, Seen](https://www.design-a11y.com/articles/designing-for-invisible-disabilities-making-the-unseen-seen)
- [Top 3 Don'ts: When Your Coworker Has Vestibular Dysfunction](https://www.design-a11y.com/articles/top-3-donts-when-your-coworker-has-vestibular-dysfunction)
- [5 Reasons Neurodiverse Brains Are Excellent for Creative Roles](https://www.design-a11y.com/articles/5-reasons-neurodiverse-brains-are-excellent-for-creative-roles)
- [From Good to Great: Elevating Your Design Workflow with Inclusivity](https://www.design-a11y.com/articles/from-good-to-great-elevating-your-design-workflow-with-inclusivity)
- [From Decoding Success to Fostering Neurodiverse Inclusion](https://www.design-a11y.com/articles/from-decoding-success-to-fostering-neurodiverse-inclusion)
- [I Asked AI to Design an Accessible Color Palette](https://www.design-a11y.com/articles/i-asked-ai-to-design-an-accessible-color-palette)
- [How Accessible Are These 2023 UI Design Trends?](https://www.design-a11y.com/articles/how-accessible-are-these-2023-ui-design-trends)
- [Is the Apple Vision Pro Vestibular Friendly?](https://www.design-a11y.com/articles/is-the-apple-vision-pro-vestibular-friendly)
- [Vestibular VR: 5 Features to Include in Your Metaverse](https://www.design-a11y.com/articles/vestibular-vr-metaverse-accessible)

### Testing tools

- [IBM Equal Access Accessibility Checker](https://github.com/IBMa/equal-access), open source, browser extensions and Node package
- [Pa11y](https://pa11y.org/), open source command line scanning
- [ANDI](https://www.ssa.gov/accessibility/andi/help/install.html), free manual inspection bookmarklet from the U.S. Social Security Administration
- [Level Access developer tools](https://www.levelaccess.com/developer-tools/), browser extensions, testing SDKs, and CI integrations. Level Access ships several surfaces and it is worth knowing which can be automated, because only one of them can:

| Tool | What it is | Scriptable |
|---|---|---|
| [Testing SDKs](https://client.levelaccess.com/hc/en-us/articles/21805172871063-Level-Access-testing-SDKs-overview), for example `@userway/a11y-playwright` on npm | Access Engine driven from Playwright, Cypress, Puppeteer, or WebdriverIO. Installs from the public registry, runs locally, and writes a JSON report with no account and no token. This is the one to reach for. | Yes |
| [Level Access browser extension](https://chromewebstore.google.com/detail/level-access-extension/kgbmnemfaellbfabmkmmilchbhiigpdi) | Manual panel for scanning a page in the browser. | No |
| [Accessibility Checker browser extension](https://client.levelaccess.com/hc/en-us/articles/14801734404247-Install-the-Accessibility-Checker-browser-extension) | Manual checker for Chrome and Firefox. Supports multi-page scan sessions that report into the Level Access platform. No API key needed for basic setup. | No |
| [Accessible Color Picker](https://chromewebstore.google.com/detail/accessible-color-picker/bgfhbflmeekopanooidljpnmnljdihld) | Design-time contrast tool. Eyedropper sampling from a live page, editable hex, and suggested conformant alternatives when a pair fails. Text contrast only, so it will not catch 1.4.11 non-text failures. | No |

  Use the SDK for the build gate and the extensions for the manual passes that automation cannot do. Everything in the table above can be installed and used without a paid licence, though pushing results into the Level Access platform needs an account. Level Access also ships a Figma plugin, a Desktop Crawler App, a mobile testing SDK, an accessibility API, and webhooks, but those are licensed features rather than free tools, so they are outside the scope of this file.

### Level Access resources

- [Color Blindness Accessibility: What Designers Need to Know](https://www.levelaccess.com/blog/color-blindness-accessibility-what-designers-need-to-know/)
- [Supporting Users with Vestibular Disabilities Online](https://www.levelaccess.com/blog/how-to-support-users-with-vestibular-disabilities/)
- [Elevating E-Commerce Accessibility: Template Design Tips and Tricks](https://www.levelaccess.com/blog/elevating-e-commerce-accessibility-template-design-tips-and-tricks/)
- [Elevating E-Commerce Accessibility: Product Display Basics](https://www.levelaccess.com/blog/elevating-e-commerce-accessibility-product-display-basics/)
- [Elevating E-Commerce Accessibility: Cart Confidence](https://www.levelaccess.com/blog/elevating-e-commerce-accessibility-cart-confidence/)

---

## Keeping this current

This file has a release number at the top. Check https://danarandall.com/ai-a11y-toolkit for the current one.

Accessibility guidance does not change quickly, but AI tools do. If a rule here is wrong, out of date, or does not work in the tool you are using, tell me: https://danarandall.com/ai-a11y-toolkit#feedback

That feedback is the only reason this stays accurate across fifteen platforms, so it is genuinely useful rather than a politeness.

Author: Dana Randall. Target standard: WCAG 2.2 Level AA. Licensed CC BY 4.0, so free to share and adapt with attribution.
