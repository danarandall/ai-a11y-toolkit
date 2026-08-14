# For designers

What design decides, and where the handoff to code begins.

Part of the AI A11y Toolkit by Dana Randall. Licensed CC BY 4.0.
Full reference: https://github.com/danarandall/ai-a11y-toolkit

---

## Section 9: For designers

You are the earliest point of control in this process. By the time a model is generating markup, most of the decisions that determine whether the result is accessible have already been made or left unmade by you. Karen Hawkins' research finds that around 96 percent of WCAG criteria can be addressed before development begins ([Level Access](https://www.levelaccess.com/blog/play-your-part-role-based-advice-for-agile-accessibility/)). When generation takes ninety seconds, that number tells you something specific about where a designer's leverage sits: almost all of it is upstream of the first line of code.

This section is organized around a different question than the rest of this file. Everywhere else, the question is what the code must do. Here, the question is what you must decide and write down before the code exists.

### 9.1 Your design scope is a system, not a screen

The most useful reframe I know for this comes from Karen Hawkins, Principal of Accessible Design at Level Access, in her [Accessible Design Framework](https://www.levelaccess.com/blog/introducing-the-accessible-design-framework/). Her argument is that the scope of design is not the human alone. It is a system made of a human plus the technologies that let them do what they came to do. Designers, she observes, are good at considering the human and much weaker at considering the technology.

That gap explains almost every accessibility failure an AI tool produces.

A generation model has exactly one technology in its head: a screen operated by a mouse. It has no representation of a keyboard as a primary input, no representation of a screen reader as an output, no representation of a finger as an imprecise pointer, no representation of a magnifier showing eight percent of the viewport at once. It is not being careless. It is completing the pattern it was trained on, and that pattern assumes your hardware.

When this toolkit was tested by building the same brief twice, once unguided and once with these files installed, every failure in the unguided build was a technology the model never considered. Contrast failures are the screen. Missing focus indicators are the keyboard. Unnamed graphics and absent landmarks are the screen reader. Targets under 24 pixels are the finger. See `research/2-icon-browser/README.md`.

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
- [ ] Live region politeness decided for each status message, and a settle delay specified for any value the user drags or types
- [ ] Every text color in the palette contrast-checked, including the faintest tier
- [ ] Units specified for any slider readout, so the announcement is not a bare number
- [ ] Reflow verified at 320 CSS pixels and 200% zoom
- [ ] Text spacing overrides survive: 1.5 line height, 2x paragraph, 0.12em letter, 0.16em word (1.4.12)
- [ ] Grayscale check passed, no meaning carried by color alone

If you hand a generation tool a design that satisfies this list, most of what the rest of this file enforces has already been decided by a person. That is the point.

---

**Credit.** The perceive, understand, operate sequence and the framing of design scope as a human plus technology system come from the Accessible Design Framework by Karen Hawkins, Principal of Accessible Design at Level Access. Her [Accessible Design Principles and Heuristics](https://www.levelaccess.com/resources/accessible-design-principles-and-heuristics/) guide, which organizes more than 170 heuristics into eight principles, and her article [Introducing the Accessible Design Framework](https://www.levelaccess.com/blog/introducing-the-accessible-design-framework/) are the best designer-facing accessibility resources I know of. Go read them in full. They are published by Level Access and remain its copyright.

The section above is written for a narrower purpose than hers, which is instructing a generation tool rather than teaching a designer. The wording, the technology sweep, and the annotation format are mine, as is any error in the translation.

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
