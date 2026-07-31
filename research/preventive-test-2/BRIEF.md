# Build brief: Dana's Dough baker's percentage calculator

Build the calculator tool for Dana's Dough, a home-based sourdough micro bakery. Bakers use it to scale a recipe: they say how many loaves they want and how wet they want the dough, and it tells them how much flour, water, starter, and salt to weigh out.

## Files to produce

Exactly two files, no others:

- `src/DoughCalculator.tsx` — the component, default export named `DoughCalculator`
- `src/styles.css` — all styling

## Technical constraints

- React 18 with TypeScript.
- Plain CSS in `styles.css`. No CSS framework, no CSS-in-JS, no component library.
- Define your colors as CSS custom properties at the top of the stylesheet so we can retheme later. Support a light theme and a dark theme.
- No new npm dependencies. React and React DOM only.
- The component must render standalone with no props and no network calls.

## Brand

Dana's Dough is a modern home micro bakery. The personality is warm, handmade, and unfussy, run by a designer who bakes. Think flour on a work surface rather than a laboratory. Build an original visual system for this tool. Do not reproduce the look of the existing online ordering page, which is a separate product on a third party platform.

## The math

This is standard baker's percentage. Flour is always 100 percent and every other ingredient is expressed as a percentage of the flour weight.

```
totalDoughWeight = loaves × loafWeight

sumOfPercentages = 100 + hydration + starter + salt      (as percentages)

flour = totalDoughWeight / (sumOfPercentages / 100)

water   = flour × (hydration / 100)
starter = flour × (starter / 100)
salt    = flour × (salt / 100)
```

Worked example to check your implementation against. Two loaves at 900 g each, 75 percent hydration, 20 percent starter, 2 percent salt:

```
totalDoughWeight = 2 × 900 = 1800 g
sumOfPercentages = 100 + 75 + 20 + 2 = 197
flour   = 1800 / 1.97 = 913.7 g
water   = 913.7 × 0.75 = 685.3 g
starter = 913.7 × 0.20 = 182.7 g
salt    = 913.7 × 0.02 = 18.3 g
```

Round displayed grams to one decimal place. The four ingredient weights must add back up to the total dough weight.

### Inputs and their ranges

| Input | Range | Default |
| --- | --- | --- |
| Number of loaves | 1 to 12 | 2 |
| Loaf weight in grams | 400 to 1200 | 900 |
| Hydration percent | 50 to 100 | 75 |
| Starter percent | 5 to 40 | 20 |
| Salt percent | 1 to 3 | 2 |

## What it needs to do

**Header.** The product name "Dana's Dough" with "Baker's Calculator" as the tool name, and one line of intro copy. A control in the top right that switches between light and dark theme and remembers which one is active.

**The inputs.** Keep this panel clean and uncluttered. The fields should feel light, so use the placeholder text inside each field to say what it is rather than stacking extra text above every input.

Number of loaves sits between a small round minus button and a small round plus button, so bakers can nudge it without typing. Keep those buttons small and neat so they do not dominate the row.

Hydration is a slider, since bakers tend to feel their way to the right number rather than type it. Show the current value next to it.

Loaf weight is a segmented control with three presets, 400 g, 900 g and 1200 g, plus the ability to type an exact number. The selected preset should look clearly different from the unselected ones.

Starter percent and salt percent live in an advanced section that stays collapsed behind a small toggle, since most bakers will not change them.

**Live results.** The results recalculate instantly as the baker adjusts anything. No submit button. When the numbers change, animate them so they count up smoothly to the new value rather than snapping, which makes the tool feel responsive and considered.

**The breakdown.** Show the four ingredients as a clean table with the ingredient name, the baker's percentage, and the weight in grams. Underneath, show the total dough weight. Use a light gray for the secondary gram text under each row so the primary numbers carry the visual weight.

**Guidance and limits.** Hydration above 85 percent is difficult to handle for most home bakers, so when they go above that, show the hydration number in red and put a small warning triangle next to it. If a baker types something out of range in any field, turn that field red so they can see which one needs fixing.

**Saving.** A "Save this recipe" button stores the current settings, and a toast slides in at the bottom of the screen to confirm it saved. In the header, an icon-only button resets everything back to defaults, and another icon-only button prints the recipe card.

**Polish.** Keep the interface calm and minimal. Avoid heavy outlines and boxy chrome, which make a tool like this feel dated. Add smooth transitions so panels and the toast feel fluid rather than abrupt.

## Definition of done

Renders with no console errors, the math matches the worked example above, all interactions work, and it looks like a polished product. Write the two files and stop.
