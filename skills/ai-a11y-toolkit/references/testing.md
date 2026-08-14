# Testing and verification

The build loop, what automation catches, and the manual queue it cannot.

Part of the AI A11y Toolkit by Dana Randall. Licensed CC BY 4.0.
Full reference: https://github.com/danarandall/ai-a11y-toolkit

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

# Optional, if your organization uses the Level Access platform
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
