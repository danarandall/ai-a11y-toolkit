# Level Icons: accessibility audit

**Subject:** Level Icons, production deployment
**Deployment:** internal tool, live URL withheld
**Repository:** `danarandall/level-icon-generator` (private)
**Audit date:** 27 July 2026
**Auditor:** Dana Randall
**Standard:** WCAG 2.2, Level AA
**Method:** Three automated engines plus hand verification of every reported finding in the live DOM

This audit doubles as a field test of the [AI A11y Toolkit](https://danarandall.com/ai-a11y-toolkit). Level Icons was built without the toolkit installed, which makes it a fair sample of what an AI-assisted build produces by default. Every finding below is cross-referenced to the toolkit rule that would have prevented it.

---

## 1. Scope and conditions

| Item | Value |
|---|---|
| Routes audited | `#/` (home), `#/widget`, `#/admin/gallery`, `#/nope` (not found) |
| Library state | A handle with a populated library, 63 icons, home rendering 19,150 characters |
| Browser | Chromium headless 151.0.7922.34, viewport 1280 x 900 |
| Engine 1 | Pa11y 9.1.1, HTML_CodeSniffer runner, WCAG2AA standard |
| Engine 2 | IBM Equal Access Accessibility Checker |
| Engine 3 | Level Access Access Engine via `@userway/a11y-playwright` 0.0.23 |

Routing is hash based, so every route must be addressed as `/#/path`. Reaching any route also requires a handle in `localStorage` under the key `level-icons-handle`, otherwise the app renders only a welcome gate. Both details matter because a scanner pointed at the plain URL will silently audit the gate instead of the application and report a clean result. That happened on the first run of this audit and the result was discarded.

---

## 2. The headline: three engines, one page, three different answers

All three engines scanned the identical fully rendered home page.

| Engine | Result on home |
|---|---|
| Pa11y, HTML_CodeSniffer, WCAG2AA | **0 violations** |
| IBM Equal Access | **403 violations**, 715 items needing review |
| Level Access Access Engine | **321 instances**, 320 graded Serious |

The zero is not a difference of opinion. It is a coverage gap. The WCAG2AA ruleset shipped with this version of HTML_CodeSniffer contains 98 rule files, and none of them checks whether an SVG has an accessible name. The only file in the entire set that mentions SVG at all is a AAA contrast rule. The engine was not passing the page. It was not looking at the class of element where almost every problem lives.

Meanwhile the two engines that did look agreed to within one instance. IBM counted 320 SVG elements with no accessible name. Level Access counted 320 elements with no name calculation mechanism. Independent hand counting in the DOM found 321. Three separate measurements converging is about as strong as automated evidence gets.

**The lesson for any team:** a green build from one engine proves that one ruleset found nothing. It does not describe your page.

---

## 3. Findings

Ordered by severity. Every count was confirmed by querying the live DOM directly, not taken from an engine report alone.

### 3.1 Decorative SVG icons are exposed to assistive technology without names

**Severity:** High, by volume
**WCAG:** 1.1.1 Non-text Content (Level A)
**Confirmed count:** 321 of 581 SVG elements on the home page
**Files:** `client/src/pages/home.tsx` lines 138, 187, 331, 356; `client/src/pages/widget.tsx` line 312; `client/src/pages/admin-gallery.tsx` lines 401, 515, 519

Icon markup is injected with `dangerouslySetInnerHTML`. Of 581 SVG elements rendered, 259 carry `aria-hidden="true"`, none carry a `<title>`, and none set `focusable="false"`. That leaves 321 unnamed graphics sitting in the accessibility tree.

There is a mitigating detail worth stating honestly, because it changes the priority. 580 of the 581 SVGs sit inside an ancestor that already has an accessible name, usually a button labelled something like `Download Colorful light SVG`. A screen reader user who lands on that button hears a useful name. The unnamed SVG does not block them.

What it does is pollute. Every unnamed graphic adds a node to the tree, so browsing the library element by element, or by graphic, produces hundreds of anonymous entries. It also means the icons themselves carry no description anywhere, which matters for a product whose entire purpose is icons.

**Fix.** At each injection site, mark the SVG decorative and let the labelled ancestor carry the meaning:

```tsx
// Before
<div role="img" aria-label={`${topic}, ${label} color preview`}
     dangerouslySetInnerHTML={{ __html: svg }} />

// After: strip any inherited attributes and hide the graphic itself
const decorative = svg.replace(
  /<svg\b/,
  '<svg aria-hidden="true" focusable="false"'
);

<div role="img" aria-label={`${topic} icon, ${label} colorway`}
     dangerouslySetInnerHTML={{ __html: decorative }} />
```

`focusable="false"` matters independently: without it, legacy engines place SVG elements in the tab order.

**Toolkit rule:** Section 3 requires that every non-text element either carries a name or is explicitly hidden, and that injected markup is normalised at the injection point rather than trusted from the source.

---

### 3.2 Pinch zoom is disabled

**Severity:** High
**WCAG:** 1.4.4 Resize Text (Level AA)
**File:** `client/index.html` line 5
**Reported by:** Level Access on all four routes

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
```

`maximum-scale=1` prevents pinch zoom on mobile. This is a single-character class of fix and one of the most common defaults in AI-generated scaffolding. It affects every user with low vision on every page of the app.

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

**Toolkit rule:** Section 7 states plainly that `maximum-scale`, `minimum-scale`, and `user-scalable=no` must never appear in a viewport meta tag.

---

### 3.3 `aria-label` applied to plain `<div>` elements, where it does nothing

**Severity:** Medium
**WCAG:** 1.3.1 Info and Relationships (Level A), 4.1.2 Name, Role, Value (Level A)
**Confirmed count:** 64 on the home page
**File:** `client/src/pages/home.tsx` line 400

```tsx
<div aria-label="Tags" className="flex flex-wrap gap-1">
```

A `<div>` has an implicit role of `generic`, and ARIA does not permit a name on a generic element. Browsers discard the label, so the grouping intent is lost entirely. Both IBM and Level Access flag this as invalid ARIA rather than as a missing label, which is the correct reading: it is not that the label is wrong, it is that it is being ignored.

**Fix.** Give the element a role that can hold a name, or better, use real semantics:

```tsx
<ul aria-label={`Tags for ${topic}`} className="flex flex-wrap gap-1 list-none">
  {tags.map(t => <li key={t}>{t}</li>)}
</ul>
```

Note the second improvement: `"Tags"` repeated 64 times is not useful even when it works. Names should distinguish, not merely describe.

**Toolkit rule:** Section 5 requires that ARIA attributes be valid for the element's role, and Section 4 requires accessible names to be unique within a repeated set.

---

### 3.4 Sixty-four article regions share one identical label

**Severity:** Medium
**WCAG:** 1.3.1 Info and Relationships (Level A), 2.4.6 Headings and Labels (Level AA)
**Confirmed count:** 64 article elements, 1 unique label between them

Every icon card is an `article`, and all 64 carry the same name. To anyone navigating by region or article, the library is 64 identically named containers. Label each with the icon it holds.

---

### 3.5 The widget and not-found routes have no `main` landmark and no skip mechanism

**Severity:** Medium
**WCAG:** 2.4.1 Bypass Blocks (Level A), 1.3.1 Info and Relationships (Level A)
**Files:** `client/src/pages/widget.tsx`, `client/src/pages/not-found.tsx`
**Reported by:** IBM (`skip_main_exists`, `aria_content_in_landmark`) and Level Access (`bypass-landmark`, `landmark-one-main`) on both routes

Home does this correctly, with one `main` and a working skip link. The other routes do not, so their content sits outside any landmark. `widget.tsx` additionally has no `h1`, starting its heading structure at `h3` (line 192).

The widget is the route embedded in other products via iframe, which makes this the highest-leverage of the two. An embedded region with no landmark and no heading is very hard to locate from a host page.

---

### 3.6 Interface borders fail non-text contrast

**Severity:** Medium
**WCAG:** 1.4.11 Non-text Contrast (Level AA), requires 3:1
**File:** `client/src/index.css`

Computed directly from the design tokens:

| Token | Against | Light | Dark |
|---|---|---|---|
| `--border` | page background | **1.23:1** | **1.35:1** |
| `--input` | page background | **1.46:1** | **1.69:1** |
| `--card-border` | card background | **1.93:1** | **1.32:1** |

All six fail the 3:1 threshold, in both themes.

`--input` is the consequential one. It draws the boundary of every text field and select in the app (`components/ui/input.tsx` line 12, `components/ui/select.tsx` line 22), and that border is the only thing indicating where the control is. When a boundary is the sole means of identifying a control, 1.4.11 applies and 3:1 is required. At 1.46:1 the field edge is close to invisible against the page.

`--card-border` is more defensible. Cards sit on a different background from the page, so the border is reinforcing an edge that is already visible. That one is arguably decorative and exempt. I would still raise it, because at 1.32:1 in dark mode it is doing no visual work at all.

**Fix.** Darken `--input` and `--border` until they clear 3:1 against their own background. In light mode that means moving `--input` from `268 20% 82%` to roughly `268 20% 62%`.

**Toolkit rule:** Section 7 requires 3:1 for control boundaries and states specifically that text-only contrast checkers will not catch this. That is exactly how these six values survived.

---

### 3.7 No reduced-motion support anywhere in the codebase

**Severity:** Medium
**WCAG:** 2.3.3 Animation from Interactions (Level AAA), and a toolkit requirement regardless of level

Occurrences of `prefers-reduced-motion` or Tailwind's `motion-reduce:` variant across `client/src` and `tailwind.config.ts`: **zero**.

Occurrences of animation utility classes: **49**, including `animate-in` (21), `animate-out` (20), `animate-spin` (4), `animate-pulse`, `animate-accordion-down`, `animate-accordion-up`, and `animate-caret-blink`. `index.css` adds transitions at lines 245, 322, 331, and 347.

A user with vestibular sensitivity who has set the operating system preference gets no relief. This is one global rule:

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

**Toolkit rule:** Section 9 requires that motion respect the system preference and that the check ship with the first animation, not after.

---

### 3.8 Admin gallery search input has no accessible name

**Severity:** Medium, graded Critical by Level Access
**WCAG:** 3.3.2 Labels or Instructions (Level A), 4.1.2 Name, Role, Value (Level A)
**Reported by:** Level Access (`label`, Critical; `label-title-only`, Moderate) and IBM (`input_label_visible`)

The control relies on placeholder text or a `title` attribute. Placeholders vanish on input and are not reliably announced. Add a visible `<label>`, or a visually hidden one paired with a visible heading.

---

### 3.9 Touch targets below the enhanced threshold

**Severity:** Low, advisory
**WCAG:** 2.5.8 Target Size Minimum (Level AA, 24 x 24) **passes**. 2.5.5 Target Size Enhanced (Level AAA, 44 x 44) does not.

Of 580 visible interactive targets on home, 260 measure under 44 x 44 CSS pixels. Only one measures under 24 x 24, and that is the skip link at its collapsed resting size, which is a measurement artifact rather than a real target.

**So this is not an AA failure.** I am recording it because the smallest real controls, the 36 x 36 theme toggle and the 163 x 32 download buttons, sit in a dense grid of 63 icons where mis-taps are likely. Raising the download buttons to 44 pixels tall would be cheap and would measurably reduce error rates on touch.

---

## 4. What is already right

Worth recording, because a findings list read alone gives a distorted picture.

- **The focus indicator is genuinely good.** `index.css` line 239 sets `outline: none` but replaces it with three concentric rings: 2px white, 2px primary, 2px white. That is visible against both light and dark backgrounds and against arbitrary icon artwork. Removing an outline is usually a red flag, but here it was removed and properly compensated.
- **The colorway swatches are correctly built.** Each is a real `<button type="button">` with `aria-label={`Select ${label} color`}` and `aria-pressed` reflecting state, wrapped in a `role="group"` with its own label. This is textbook toggle-button markup.
- **Home has one `main`, one `h1`, and a working skip link.**
- **Text contrast is strong throughout**, in both themes:

| Pair | Ratio | Required |
|---|---|---|
| Body text on page background | 16.02:1 | 4.5:1 |
| Body text on card | 17.83:1 | 4.5:1 |
| Muted text on page background | 5.16:1 | 4.5:1 |
| White on primary button | 6.92:1 | 4.5:1 |
| White on destructive button | 6.06:1 | 4.5:1 |
| Dark theme body text | 19.56:1 | 4.5:1 |

- **A false alarm I chased down and dismissed.** `admin-gallery.tsx` contains three `<h1>` elements, at lines 216, 263, and 287. Reading the control flow, they sit in mutually exclusive early returns, so exactly one renders. Not a violation, and not reported.

---

## 5. Two non-accessibility bugs found along the way

Both are worth fixing on their own merits.

**The health endpoint reports success during a total database outage.** `server/routes.ts` line 339:

```js
supabase: Boolean(process.env.SUPABASE_URL && (process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY)),
```

It checks only that environment variables exist. It never contacts the database. Line 340 reports `libraryCount` from `Object.keys(ICON_LIBRARY).length`, a static in-memory object, not a row count. During this audit the endpoint returned `{"ok":true,"supabase":true,"libraryCount":32}` while every database call was failing with `TypeError: fetch failed`. Uptime monitoring pointed at this endpoint would never fire.

**Handles are case sensitive, so users can silently lose their library.** `server/storage.ts` line 99 filters with an exact match:

```js
.eq("handle", handle)
```

A handle stored as `Alex` returns its full library. The same handle typed `alex` returns zero, with no error and no hint. Anyone who types their handle with different capitalization is shown an empty library and a "No icons match" message, and will reasonably conclude their work is gone. Normalise on write and on read.

---

## 6. What the toolkit would have caught

This is the part that matters for the toolkit's own claims. Of nine accessibility findings, **seven** map to a rule already written in `ACCESSIBILITY.md`, and six of those would have been caught before a human ever reviewed the page.

| Finding | Toolkit rule | Caught by |
|---|---|---|
| Unnamed SVG icons | Section 3, non-text elements | Rule text plus the required engine in CI |
| `maximum-scale=1` | Section 7, viewport | Rule text, and the Level Access engine in CI |
| `aria-label` on a `div` | Section 5, valid ARIA | `jsx-a11y` lint, which the toolkit requires as a build failure |
| Duplicate region labels | Section 4, unique names | Both required engines |
| Missing `main` and skip link | Section 6, landmarks | Both required engines |
| Border contrast below 3:1 | Section 7, non-text contrast | Rule text only. No engine caught this. |
| No reduced-motion support | Section 9, motion | Rule text only. No engine caught this. |

Two things stand out.

**First, the linting requirement alone would have prevented finding 3.3.** The repository has no ESLint config and zero references to `jsx-a11y`. That single install would have failed the build on 64 invalid ARIA attributes.

**Second, and more interesting: the two findings no engine caught are both from rule text, not tooling.** Border contrast and reduced motion were found by reading the toolkit's requirements and checking the code against them by hand. This is the clearest evidence in the whole audit for the toolkit's central argument, that automation is a floor rather than a pass. Three engines, one of them a commercial product, and none of them mentioned that the app has no reduced-motion handling at all despite 49 animation utilities in use.

---

## 7. Recommended order of work

1. **`maximum-scale=1`.** One line, affects every user on every route, ships in minutes.
2. **`prefers-reduced-motion` block.** One CSS rule, closes an entire category.
3. **Install `jsx-a11y` and fix the 64 `div` labels.** Prevents recurrence rather than just clearing the backlog.
4. **`aria-hidden="true" focusable="false"` at the eight SVG injection sites.** Clears 321 findings.
5. **Raise `--input` and `--border` above 3:1.** Token change, no component edits.
6. **Add `main` and a skip link to widget and not-found, and an `h1` to widget.**
7. **Label the 64 article cards individually and the admin search input.**
8. **Add the toolkit to the repository** as `ACCESSIBILITY.md` plus platform pointer files, and wire one engine into CI as a build gate with a second on a schedule.

Items 1 through 4 are roughly an hour of work and remove the large majority of the reported volume.

---

## 8. Limitations

Stated plainly, because an audit that hides its gaps is not worth much.

- **The widget and admin gallery were only shallowly scanned.** They rendered 18 and 111 characters respectively, because both gate on state I could not reach: the widget expects to be embedded with parameters, and the admin gallery requires an `ADMIN_TOKENS` value. Their low counts reflect how little rendered, not how accessible they are. Both need a re-scan with real credentials.
- **This is automated testing plus code review only.** No screen reader walkthrough, no keyboard-only task completion, no testing with users. Automated tooling is generally held to catch around a third of issues, and nothing here changes that.
- **No mobile or touch device testing**, despite the viewport finding being a mobile issue.
- **Single viewport, single browser.** 1280 x 900 in headless Chromium. Reflow at 320 CSS pixels and at 200 percent zoom was not verified.

The next meaningful step is not another engine. It is thirty minutes with a screen reader and the keyboard.

---

## Sources

- WCAG 2.2 success criteria: [W3C Web Content Accessibility Guidelines 2.2](https://www.w3.org/TR/WCAG22/)
- Non-text contrast guidance: [Understanding SC 1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
- Target size guidance: [Understanding SC 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- Level Access testing SDKs: [Testing SDKs overview](https://client.levelaccess.com/hc/en-us/articles/21805172871063-Level-Access-testing-SDKs-overview)
- IBM Equal Access Accessibility Checker: [github.com/IBMa/equal-access](https://github.com/IBMa/equal-access)
- Pa11y: [pa11y.org](https://pa11y.org/)
- The toolkit under test: [AI A11y Toolkit](https://danarandall.com/ai-a11y-toolkit)

---

*Audit performed 27 July 2026 against the production deployment. Findings are reproducible with the scan scripts in `a11y-run/`.*
