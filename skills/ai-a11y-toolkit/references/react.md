# React and component frameworks

Component level rules, state announcements, focus management, and routing.

Part of the AI A11y Toolkit by Dana Randall. Licensed CC BY 4.0.
Full reference: https://github.com/danarandall/ai-a11y-toolkit

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

#### Live regions attached to a continuously changing value

A concise summary is not enough on its own. If the value behind that summary changes on every keystroke or every step of a slider, a polite region queues one announcement per change, and the user cannot reach the result through the backlog. Silence would have served them better, which means adding the live region made the experience worse.

This failure only appears once the region is correct, so it survives review by anyone who checked that a region exists. It also passes every automated engine, because the markup is right.

Let the value settle before you write to the region.

```jsx
// Announce the result, not every intermediate value.
function useSettledAnnouncement(value, delay = 600) {
  const [announced, setAnnounced] = useState('');
  useEffect(() => {
    const id = setTimeout(() => setAnnounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return announced;
}

const summary = useSettledAnnouncement(
  `${flour} g flour, ${water} g water. Total ${total} g.`
);

<div role="status" aria-live="polite" aria-atomic="true" className="visually-hidden">
  {summary}
</div>
```

- Use a settle delay of roughly 500ms to 1000ms for slider drags, numeric steppers, and search-as-you-type.
- Keep the visible value updating immediately. Only the announcement waits.
- Never put an animated or counting number inside a live region. Announce the final value once the count has finished.
- Set `aria-atomic="true"` when the summary is a sentence, so a partial rewrite is not read as a fragment.
- Applies to: calculators, filter and search result counts, cart and pricing totals, sliders bound to a readout, progress values, and character counters.

### Markup you inject bypasses every safeguard above

Anything rendered through `dangerouslySetInnerHTML` in React, `v-html` in Vue, `{@html}` in Svelte, or a raw `innerHTML` assignment is invisible to JSX linting. `eslint-plugin-jsx-a11y` reads your source tree. It cannot see a string that becomes DOM at runtime. Component tests that query by role will not catch it either, because the injected nodes usually have no role worth querying.

This is one of the highest-yield patterns to check in AI-generated code, because AI tools reach for HTML injection constantly: icon sets, rich text from a CMS, markdown output, chart libraries, and SVG sprites all arrive as strings.

In a real audit of one AI-built application, a single injection site produced 321 unnamed graphics on one page. The lint config would not have flagged it even if the project had one.

**The rule: normalize at the injection point. Never trust the string.**

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

# Optional third engine, if your organization uses the Level Access platform
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
