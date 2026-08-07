# Ceiling analysis: what a design system can and cannot determine

This section asks a single question of each WCAG 2.2 Level A and Level AA success criterion: if a team adopts a design system exactly as shipped and builds a product with it, how much of conformance with that criterion is settled by the design system, and how much can only be settled by the build. Two artifact types are scored separately, because they are routinely conflated. A design kit is a design file that ships color values, a type scale, spacing, component geometry, visual states, and layout patterns, and nothing in it executes. A coded component library ships running code and can carry semantics, roles, keyboard handling, focus management, and live region wiring into every product that installs it.

All 55 Level A and Level AA criteria in the WCAG 2.2 Recommendation are listed, 31 at Level A and 24 at Level AA. The Parsing criterion carried by earlier versions is obsolete and removed in WCAG 2.2, so it is not included.

| SC | Level | Title | Design kit | Coded library | Rationale |
| --- | --- | --- | --- | --- | --- |
| 1.1.1 | A | Non-text Content | Cannot affect | Influences | The pass condition is whether a text alternative serves an equivalent purpose, which is content the artifact cannot know. A coded library can require an alternative text property on image and icon components and mark decorative icons as hidden, but the wording remains the build's. |
| 1.2.1 | A | Audio-only and Video-only (Prerecorded) | Cannot affect | Cannot affect | Neither artifact type ships a media player or the alternative for time based media, so a perfect artifact and a worthless one give the same result. This applies to all of 1.2.x unless the artifact ships a player, in which case the player's controls become relevant to 1.4.2 rather than to this criterion. |
| 1.2.2 | A | Captions (Prerecorded) | Cannot affect | Cannot affect | Captions are authored assets attached to specific media, with no representation in either artifact type absent a shipped media player. |
| 1.2.3 | A | Audio Description or Media Alternative (Prerecorded) | Cannot affect | Cannot affect | Audio description and media alternatives are authored content for particular media, outside both artifact types absent a shipped media player. |
| 1.2.4 | AA | Captions (Live) | Cannot affect | Cannot affect | Live captioning is an operational and content workflow, not a property of a design file or a component package, absent a shipped media player. |
| 1.2.5 | AA | Audio Description (Prerecorded) | Cannot affect | Cannot affect | Audio description is an authored track for specific video content, outside both artifact types absent a shipped media player. |
| 1.3.1 | A | Info and Relationships | Cannot affect | Influences | The criterion measures whether structure and relationships are programmatically determinable, which nothing in a design file can express. A coded library can carry roles, grouping, table semantics, and label associations inside its components, but page level structure, heading levels, and landmark composition are produced by the build. |
| 1.3.2 | A | Meaningful Sequence | Cannot affect | Influences | Reading sequence is determined by source order and any positioning applied in the build, not by visual arrangement in a design file. A library can control order inside a component while the order of components on a page stays with the build. |
| 1.3.3 | A | Sensory Characteristics | Cannot affect | Cannot affect | The criterion governs the wording of instructions, which is product copy in both cases. The counterargument is that a design system can discourage shape and location references in its guidance, but guidance is not the artifact and does not change the outcome by itself. |
| 1.3.4 | AA | Orientation | Influences | Influences | Responsive layout rules and component behavior across viewport shapes make support for both orientations easier or harder. Locking orientation happens in build code or in application configuration, so neither artifact type settles the result. |
| 1.3.5 | AA | Identify Input Purpose | Cannot affect | Influences | Programmatic identification of input purpose depends on autocomplete style attributes that a design file cannot contain. A coded library can expose and default those attributes on its field components, but mapping each field to the correct purpose is the build's job. |
| 1.4.1 | A | Use of Color | Influences | Influences | Component state encoding, for example whether an error state or a selected state carries a shape, icon, underline, or text cue in addition to color, is visible in the artifact and travels with it. It is only influence because pages also convey information through color in charts, status text, and other product content the artifact never sees. |
| 1.4.2 | A | Audio Control | Cannot affect | Cannot affect | The criterion is about audio that plays automatically, which is media behavior neither artifact type ships absent a media player. |
| 1.4.3 | AA | Contrast (Minimum) | Determines | Determines | The measured quantity is the contrast ratio of shipped text colors against shipped background colors at shipped type sizes and weights, all of which are properties of the artifact. A faithful implementation inherits the outcome, and the residual risk is that a build introduces color pairings or type sizes the artifact never defined. |
| 1.4.4 | AA | Resize Text | Influences | Influences | Relative type sizing, flexible container heights, and text that is allowed to wrap make 200 percent resizing survivable, and fixed geometry makes it fail. Whether text actually resizes without loss is a property of the built page and its stylesheet. |
| 1.4.5 | AA | Images of Text | Influences | Influences | Shipping a live type scale and text styles rather than rasterized text reduces the incentive to use images of text. The decision to render a particular string as an image is made in the build or in content production. |
| 1.4.10 | AA | Reflow | Influences | Influences | Breakpoints, minimum widths, wrapping rules, and responsive patterns are the substantive design inputs to reflow at 320 CSS pixels. Reflow is still evaluated on assembled pages, where build level layout, fixed widths, and embedded content can reintroduce two dimensional scrolling. |
| 1.4.11 | AA | Non-text Contrast | Determines | Determines | The criterion measures contrast of the visual information needed to identify components and their states, and of essential parts of graphics, which is exactly what the artifact specifies for borders, icons, focus indicators, and state treatments. The limit is graphics and controls the build creates outside the artifact. |
| 1.4.12 | AA | Text Spacing | Influences | Influences | Fixed component heights, tightly fitted label areas, and clipping behavior designed into the artifact predispose loss of content when a user overrides text spacing. The pass condition is measured by applying user spacing overrides to the built page, so the build governs. |
| 1.4.13 | AA | Content on Hover or Focus | Influences | Influences | The artifact can specify tooltip and popover geometry, an explicit dismiss affordance, and hover safe positioning. The dismissible, hoverable, and persistent conditions are behavioral, and any hover or focus content the build creates itself is out of reach. |
| 2.1.1 | A | Keyboard | Cannot affect | Influences | Keyboard operability is behavior that a design file cannot contain. A coded library can ship keyboard handlers for its own interactive components, while product specific interactions, custom widgets, and canvas style surfaces remain the build's responsibility. |
| 2.1.2 | A | No Keyboard Trap | Cannot affect | Influences | Whether focus can leave a component is a runtime property. A library can ship correct focus containment and release in dialogs and menus, but any trap introduced by build code or by an embedded third party surface still fails the page. |
| 2.1.4 | A | Character Key Shortcuts | Cannot affect | Influences | Single character shortcuts are implemented in code, so a design file cannot cause or cure a failure. A coded library can avoid unmodified character shortcuts and can expose a way to turn off or remap the ones it does define, while application level shortcuts stay with the build. |
| 2.2.1 | A | Timing Adjustable | Cannot affect | Cannot affect | Time limits are set by application logic and session configuration. The counterargument is that a session timeout dialog can be shipped as a component, but the limit, the warning timing, and the extension mechanism are all build side. |
| 2.2.2 | A | Pause, Stop, Hide | Cannot affect | Influences | Whether content moves, blinks, or auto updates, and for how long, is behavior. The counterargument for a design file is that a carousel or ticker pattern can include a visible pause affordance, but the affordance only functions if the build implements it, which is why the coded case rates higher. |
| 2.3.1 | A | Three Flashes or Below Threshold | Cannot affect | Cannot affect | Flashing arises from media, animation, or generated effects in the product. Motion specifications in either artifact type are not normally near the flash thresholds and do not determine what the product plays. |
| 2.4.1 | A | Bypass Blocks | Cannot affect | Influences | A bypass mechanism is a functioning skip link or a landmark and heading structure in the built page. The counterargument for a design file is that header templates can show a skip link, but a drawn skip link does nothing, whereas a coded library can ship a working one plus landmark regions. |
| 2.4.2 | A | Page Titled | Cannot affect | Cannot affect | Page titles are content written per page and are not shipped by either artifact type. |
| 2.4.3 | A | Focus Order | Cannot affect | Influences | Focus order is a function of source order and any tabindex or focus management in the build. A library can guarantee sensible order inside a component, while the order of components across a page is assembled by the build. |
| 2.4.4 | A | Link Purpose (In Context) | Cannot affect | Cannot affect | Link purpose depends on link text and surrounding context, which is content in both cases. |
| 2.4.5 | AA | Multiple Ways | Cannot affect | Cannot affect | Whether more than one way exists to locate a page is an information architecture decision about a set of pages. Shipping navigation, search, and sitemap patterns does not establish that a product provides two of them. |
| 2.4.6 | AA | Headings and Labels | Cannot affect | Cannot affect | The criterion measures whether heading and label wording describes topic or purpose, which is content. |
| 2.4.7 | AA | Focus Visible | Influences | Determines | A design file can specify a focus indicator, but whether a visible indicator appears in a real browser is decided by code, so the design case is influence only. A coded library ships the focus styles that render, and if it suppresses or omits them a faithful product fails, with the residual gap being controls the build writes itself and stylesheet overrides. |
| 2.4.11 | AA | Focus Not Obscured (Minimum) | Influences | Influences | Sticky headers, sticky footers, and layered overlay geometry are the usual cause of an obscured focused component, and that geometry is specified in the artifact. Whether a focused element ends up entirely hidden depends on assembled page composition and scroll behavior, which neither artifact type controls. |
| 2.5.1 | A | Pointer Gestures | Cannot affect | Influences | Multipoint and path based gesture handling is code. A coded library can provide single pointer alternatives on components such as sliders and carousels, while gestures the build adds remain the build's. |
| 2.5.2 | A | Pointer Cancellation | Cannot affect | Influences | Whether a function executes on the down event and whether it can be aborted or undone are runtime behaviors. A library can implement activation on the up event for its own controls, and build authored pointer handlers are outside it. |
| 2.5.3 | A | Label in Name | Cannot affect | Influences | The criterion compares the accessible name to the visible label text, and the visible text is content. A coded library can derive the name from the rendered label by default, which prevents the common mismatch, but a build that passes an overriding name can still fail. |
| 2.5.4 | A | Motion Actuation | Cannot affect | Cannot affect | Device motion and user motion actuation is implemented in application code and device APIs, with no representation in either artifact type. |
| 2.5.7 | AA | Dragging Movements | Influences | Influences | Whether a dragging interaction offers a single pointer alternative is partly a visible affordance question, for example move controls beside a draggable list item, and that affordance is designed in the artifact. The alternative must actually work, and build authored drag interactions are not covered, so neither artifact type settles it. |
| 2.5.8 | AA | Target Size (Minimum) | Determines | Determines | The criterion measures target geometry and the spacing between undersized targets, both of which are specified as component sizes, hit areas, and density rules in the artifact. A faithful implementation inherits the result, and the residual risk is build composed dense layouts and controls not drawn from the artifact. |
| 3.1.1 | A | Language of Page | Cannot affect | Cannot affect | The default page language is declared in markup produced by the build. |
| 3.1.2 | AA | Language of Parts | Cannot affect | Cannot affect | Marking the language of passages depends on the content itself and on markup the build produces. |
| 3.2.1 | A | On Focus | Cannot affect | Influences | A change of context on focus is behavior. A library can ensure its own components do not navigate or open on focus alone, while build authored focus handlers remain outside it. |
| 3.2.2 | A | On Input | Cannot affect | Influences | Automatic context change on setting change is behavior and, where allowed, depends on advance notice in content. A library can avoid submitting or navigating on change in its own controls, and the build controls the rest. |
| 3.2.3 | AA | Consistent Navigation | Influences | Influences | Repeated navigation patterns and page templates make consistent relative order the path of least resistance in both artifact types. Consistency is evaluated across a set of built pages, so the build can still deviate. |
| 3.2.4 | AA | Consistent Identification | Influences | Influences | Shipping one canonical component, icon, and label for a given function reduces inconsistent identification of the same functionality. Whether the same function is identified consistently across a product is decided by how the build applies those components. |
| 3.2.6 | A | Consistent Help | Influences | Influences | Help mechanisms usually live in header and footer patterns, so template placement in either artifact type makes consistent relative order easier. Whether a help mechanism exists, is repeated, and holds its position across a set of pages is a build and content decision. |
| 3.3.1 | A | Error Identification | Cannot affect | Influences | The criterion requires that the error be described to the user in text, which is content, and that detection happen at all, which is logic. A coded library can associate error text with the field and expose it programmatically, without supplying the message. |
| 3.3.2 | A | Labels or Instructions | Influences | Influences | Whether a persistent visible label accompanies each input, and whether instructions have a defined place, is a visible pattern decision in both artifact types, and placeholder only patterns are a common designed cause of failure. The wording of labels and instructions is content, so neither artifact type settles conformance. |
| 3.3.3 | AA | Error Suggestion | Cannot affect | Cannot affect | Providing a correction suggestion requires validation logic and knowledge of the valid values. A slot for suggestion text does not produce the suggestion, so the outcome is unchanged by either artifact type. |
| 3.3.4 | AA | Error Prevention (Legal, Financial, Data) | Cannot affect | Cannot affect | Reversibility, checking, and confirmation are properties of a transaction flow and its server side handling, not of a design file or a component package. |
| 3.3.7 | A | Redundant Entry | Cannot affect | Cannot affect | Auto populating or offering previously entered information depends on application state across steps of a process, which neither artifact type holds. |
| 3.3.8 | AA | Accessible Authentication (Minimum) | Cannot affect | Influences | Whether an authentication step requires a cognitive function test is a product and security decision. A coded library still matters because field components can block or permit paste and password manager support, which is one of the recognized mechanisms, so it can cause or avoid a failure it does not control. |
| 4.1.2 | A | Name, Role, Value | Cannot affect | Influences | Roles, states, and programmatic value updates are exactly what a coded library can carry into every product that installs it, and a design file can carry none of them. It stops short of determines because the accessible name is content the build supplies and because custom widgets built outside the library are common. |
| 4.1.3 | AA | Status Messages | Cannot affect | Influences | Status messages must be exposed through roles or properties without moving focus, which requires code. A library can ship correct live region wiring for toasts, validation summaries, and loading states, while product specific status announcements are added by the build. |

## Counts

### Design kit

| Scope | Determines | Influences | Cannot affect | Total |
| --- | --- | --- | --- | --- |
| All 55 criteria | 3 | 14 | 38 | 55 |
| Level A only (31) | 0 | 3 | 28 | 31 |
| Level AA only (24) | 3 | 11 | 10 | 24 |

### Coded component library

| Scope | Determines | Influences | Cannot affect | Total |
| --- | --- | --- | --- | --- |
| All 55 criteria | 4 | 32 | 19 | 55 |
| Level A only (31) | 0 | 19 | 12 | 31 |
| Level AA only (24) | 4 | 13 | 7 | 24 |

## Where the two diverge

In 20 of the 55 criteria a coded component library scores higher than a design kit. This gap is the practically important finding, because it is the portion of conformance that a design file cannot deliver at any level of design quality, and that only shipped code can carry into a product.

| SC | Level | Title | Design kit | Coded library |
| --- | --- | --- | --- | --- |
| 1.1.1 | A | Non-text Content | Cannot affect | Influences |
| 1.3.1 | A | Info and Relationships | Cannot affect | Influences |
| 1.3.2 | A | Meaningful Sequence | Cannot affect | Influences |
| 1.3.5 | AA | Identify Input Purpose | Cannot affect | Influences |
| 2.1.1 | A | Keyboard | Cannot affect | Influences |
| 2.1.2 | A | No Keyboard Trap | Cannot affect | Influences |
| 2.1.4 | A | Character Key Shortcuts | Cannot affect | Influences |
| 2.2.2 | A | Pause, Stop, Hide | Cannot affect | Influences |
| 2.4.1 | A | Bypass Blocks | Cannot affect | Influences |
| 2.4.3 | A | Focus Order | Cannot affect | Influences |
| 2.4.7 | AA | Focus Visible | Influences | Determines |
| 2.5.1 | A | Pointer Gestures | Cannot affect | Influences |
| 2.5.2 | A | Pointer Cancellation | Cannot affect | Influences |
| 2.5.3 | A | Label in Name | Cannot affect | Influences |
| 3.2.1 | A | On Focus | Cannot affect | Influences |
| 3.2.2 | A | On Input | Cannot affect | Influences |
| 3.3.1 | A | Error Identification | Cannot affect | Influences |
| 3.3.8 | AA | Accessible Authentication (Minimum) | Cannot affect | Influences |
| 4.1.2 | A | Name, Role, Value | Cannot affect | Influences |
| 4.1.3 | AA | Status Messages | Cannot affect | Influences |

The pattern is consistent. The divergent criteria are almost entirely about semantics, keyboard operation, focus behavior, programmatic naming, and change notification. Those are the requirements that assistive technology depends on most directly, and they have no representation in a design file. The criteria where the two artifact types score the same are, at the high end, the visual and geometric ones that a design file genuinely settles, and at the low end the content, media, process, and timing ones that neither artifact type reaches.

## Limits of this analysis

This is a ceiling, not a measurement. It describes the best case for an artifact type, assuming an ideal design system of that type and a build that adopts it faithfully. It says nothing about whether any particular design system, including any studied elsewhere in this work, actually achieves its ceiling. A criterion marked determines is a statement about where conformance can be settled, not evidence that it has been settled.

Classification involves judgment. Several rows sit close to a boundary, and reasonable practitioners could move individual criteria one category in either direction. Where a call was genuinely arguable, the lower category was chosen and the counterargument was stated in the rationale, so the totals should be read as a conservative floor on capability rather than a precise value. The counts would shift if a different but still defensible tie breaking rule were used.

The scope of each artifact type is also idealized. A design kit is treated as a design file with no code, and a coded library is treated as shipping components only, without page templates, application scaffolding, content, or a media player. Real offerings blur these lines, and a design system that ships both a design file and code inherits the higher of the two columns for the components it covers, not for a whole product.

A criterion classified as cannot affect is not thereby unimportant. Captions, page titles, error messages, authentication design, and time limits are among the requirements that most directly decide whether a person can complete a task, and every one of them falls outside both artifact types. The classification describes where responsibility sits, not how much a requirement matters to users.

Finally, conformance is evaluated on pages and on complete processes, not on components. Even a full set of determines and influences results leaves the conformance claim itself with the team that builds and ships the product.
