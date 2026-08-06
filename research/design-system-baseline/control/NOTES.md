# Build notes — Orders admin

Summary of decisions made where the brief or design system left room for
interpretation, and any point where the implementation departs from the
literal design system spec.

## Departures from the design system

1. **Font loading.** The spec calls for Inter with a `system-ui, sans-serif`
   fallback. Per the technical constraints (no external network requests,
   no external fonts), Inter is **not** loaded from Google Fonts or any CDN.
   The stack `Inter, system-ui, sans-serif` is declared as requested, but in
   a browser without Inter installed locally it will silently fall back to
   `system-ui`. This is a deliberate, spec-compliant trade-off (no network
   font fetch) rather than a visual departure — if Inter is installed
   locally, it renders correctly.

2. **Icons are inline SVG, not from the kit.** The design system doesn't ship
   an icon set in the measured values, so all icons (search, chevrons, sort
   arrows, nav glyphs, close, check, kebab menu) are minimal hand-drawn
   inline SVGs using the neutral Obsidian palette. Sizes were chosen to sit
   comfortably inside the 40–48px control heights specified for inputs and
   buttons.

3. **Toast/notification placement.** Alerts in the spec are documented as an
   80px-tall, 16px-radius inline banner component (used for in-page
   messaging). For transient success/error notifications ("show a transient
   success message" / "trigger an error message") a toast pattern was used
   instead, stacked bottom-right, since the brief explicitly asks for
   messages that "appear and disappear" — a transient, non-blocking pattern.
   The toast visual language (radius, color roles, spacing) reuses the
   Alert component's role-based background tints (Green Bell Pepper 100 for
   success, Electric Crimson 100 for error) rather than inventing new colors.

4. **Bulk action bar color.** The bar itself is not specified by the design
   system as a discrete component. It uses Blue Spark/1000 as a solid dark
   background with white text/secondary buttons, consistent with the kit's
   role mapping (brand = Blue Spark) while remaining readable against the
   Obsidian-neutral table above it.

5. **Settings panel presentation.** The brief says the settings panel is
   "reachable from the account menu" but doesn't specify modal vs. slide-over
   vs. full page. A right-side slide-over panel was used, echoing the
   Modal's 12px corner radius and 48px footer button height, since it holds
   a non-trivial form and multiple controls that would be cramped in a
   centered modal.

6. **Badge color for "Refunded" and "Archived".** The design system's role
   mapping only defines Success/Warning/Danger/Brand roles explicitly
   (mapped to Green Bell Pepper / Golden Stone / Electric Crimson / Blue
   Spark). Paid → Green Bell Pepper (success), Pending → Golden Stone
   (warning), Failed → Electric Crimson (danger) map directly. Refunded and
   Archived have no natural success/warning/danger meaning, so they use the
   neutral families (Blue Sari/200 background + Blue Sari/800 text for
   Refunded, Obsidian/200 + Obsidian/800 for Archived) at the "tinted
   background at step 100 or 200" guidance given for badges.

7. **Sidebar and header geometry.** Widths (220px sidebar, 64px header),
   the 80px page gutter is approximated as 32px main-content padding at
   1280px width to keep the table and filter bar comfortably on-screen at
   the specified 1280×900 viewport; the kit's stated 80px desktop gutter
   assumes a wider canvas. Vertical rhythm still uses the 4/8/12/16/24/32
   spacing scale throughout.

8. **Search field, account button, and filter control heights.** Set to
   40px/48px, matching the kit's Small/Medium button and default field
   heights, since the brief doesn't specify a size for these elements.

9. **Tooltips implemented as CSS hover/focus bubbles**, dark (Obsidian/1000)
   background with white text, 12px radius, per the Tooltips spec. Applied
   to: the per-row actions control (required), the account menu button, the
   "Simulate error" button, the table's Actions header, and the "Email
   notifications" switch — five in total, exceeding the "at least two other
   controls" minimum.

10. **Row-level archive vs. bulk archive.** The per-row action menu's
    "Archive" item archives immediately without a confirm dialog (only the
    bulk action path opens the confirm dialog), since the brief specifies
    the confirm dialog only for "archiving from the bulk actions bar."

## Functional notes

- All 4 tabs (All / Unfulfilled / Refunded / Archived), the 3-state column
  sort (ascending → descending → unsorted) on Order/Date/Total, filter
  apply/clear/remove-one-at-a-time, select-all with indeterminate state,
  the bulk bar, the confirm dialog (cancel and confirm), toasts (success on
  confirmed archive, and a manual "Simulate error" trigger plus an error
  trigger in the account menu), and the settings panel (3 switches, a
  quantity stepper, a slider, and a validated form) are implemented and were
  verified with a scripted headless-Chromium test exercising every
  interaction end to end (28/28 automated checks passing) at a 1280×900
  viewport.
- Seeded 16 order rows (exceeds the 12-row minimum) across all five status
  values so every tab and badge color has representative data.
- Pagination (page size 5/10/25, prev/next, page indicator, total result
  count) operates over the currently filtered/sorted/tabbed row set.
- No external network requests, fonts, frameworks, or build steps are used;
  `index.html` is fully self-contained with inline CSS and JavaScript.
