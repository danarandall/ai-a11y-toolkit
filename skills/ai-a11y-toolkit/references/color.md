# Color and color vision

Contrast ratios, color independence, and how to test a palette.

Part of the AI A11y Toolkit by Dana Randall. Licensed CC BY 4.0.
Full reference: https://github.com/danarandall/ai-a11y-toolkit

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
6. **Count your text tokens, and audit the dimmest one hardest.** Palettes rarely stop at one muted text color. A second, fainter token gets invented for table column headers, field hints, timestamps, captions, and legal text, and it is usually the one nobody measures, because it is only used in a few places and it reads as decoration. It is not decoration. It is text, judged at 4.5:1, and it is frequently the smallest type in the product, which removes the large-text exemption. If your palette has a `muted` and a `faint`, or a `secondary` and a `tertiary`, assume the dimmer of the two is failing until you have the number.

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
