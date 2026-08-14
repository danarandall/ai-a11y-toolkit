# Motion, media, target size, and text zoom

Reduced motion, autoplay, captions, pointer target size, reflow, and text spacing.

Part of the AI A11y Toolkit by Dana Randall. Licensed CC BY 4.0.
Full reference: https://github.com/danarandall/ai-a11y-toolkit

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

**Animated and counting numbers**

Counting a number up to its new value is one of the most common flourishes in AI-generated interfaces, and it fails in two directions at once.

It is motion, so it needs a `prefers-reduced-motion` path that sets the final value immediately rather than animating to it. And it is a changing value, so if the animated node also sits inside a live region, every intermediate frame is announced.

- Under reduced motion, jump straight to the final number. Do not shorten the count, remove it.
- Never animate a number inside a live region. Announce once, after the count settles. See Section 11.
- Use `font-variant-numeric: tabular-nums` so the layout does not shift while digits change width.
- Do not animate a value the user is actively driving. If they are dragging a slider, the number should track the drag exactly, with no easing behind it.

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
