# Build brief: Icon Browser

Build a component for our internal icon tool. Designers use it to find a brand icon, preview it, and copy it into Figma or code.

## Files to produce

Exactly two files, no others:

- `src/IconBrowser.tsx` — the component, default export named `IconBrowser`
- `src/styles.css` — all styling

## Technical constraints

- React 18 with TypeScript.
- Plain CSS in `styles.css`. No CSS framework, no CSS-in-JS, no component library.
- Define your colours as CSS custom properties at the top of the stylesheet so we can retheme later. Support a light theme and a dark theme.
- No new npm dependencies. React and React DOM only.
- The component must render standalone with no props and no network calls. Use the mock data below.

## Mock data

Paste this into the component file as-is and use it as your data source. The `svg` field is a raw SVG string, which is how our real API returns icons.

```ts
type Icon = {
  id: string;
  name: string;
  category: 'Navigation' | 'Media' | 'Status';
  status: 'stable' | 'beta' | 'deprecated';
  svg: string;
};

const ICONS: Icon[] = [
  { id: 'i1', name: 'Arrow right', category: 'Navigation', status: 'stable',
    svg: '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" fill="none"/></svg>' },
  { id: 'i2', name: 'Chevron down', category: 'Navigation', status: 'stable',
    svg: '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" fill="none"/></svg>' },
  { id: 'i3', name: 'Play', category: 'Media', status: 'stable',
    svg: '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>' },
  { id: 'i4', name: 'Pause', category: 'Media', status: 'beta',
    svg: '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M7 4h4v16H7zM13 4h4v16h-4z" fill="currentColor"/></svg>' },
  { id: 'i5', name: 'Volume', category: 'Media', status: 'deprecated',
    svg: '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/></svg>' },
  { id: 'i6', name: 'Check circle', category: 'Status', status: 'stable',
    svg: '<svg viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" fill="none"/><path d="M8 12l3 3 5-6" stroke="currentColor" stroke-width="2" fill="none"/></svg>' },
  { id: 'i7', name: 'Warning', category: 'Status', status: 'stable',
    svg: '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M12 3l9 17H3z" stroke="currentColor" stroke-width="2" fill="none"/><path d="M12 9v5M12 17h.01" stroke="currentColor" stroke-width="2"/></svg>' },
  { id: 'i8', name: 'Info', category: 'Status', status: 'beta',
    svg: '<svg viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" fill="none"/><path d="M12 11v5M12 8h.01" stroke="currentColor" stroke-width="2"/></svg>' },
  { id: 'i9', name: 'Home', category: 'Navigation', status: 'stable',
    svg: '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M4 11l8-7 8 7v9H4z" stroke="currentColor" stroke-width="2" fill="none"/></svg>' },
  { id: 'i10', name: 'Search', category: 'Navigation', status: 'stable',
    svg: '<svg viewBox="0 0 24 24" width="24" height="24"><circle cx="11" cy="11" r="6" stroke="currentColor" stroke-width="2" fill="none"/><path d="M16 16l4 4" stroke="currentColor" stroke-width="2"/></svg>' },
  { id: 'i11', name: 'Record', category: 'Media', status: 'stable',
    svg: '<svg viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="12" r="7" fill="currentColor"/></svg>' },
  { id: 'i12', name: 'Error', category: 'Status', status: 'deprecated',
    svg: '<svg viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" fill="none"/><path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" stroke-width="2"/></svg>' },
];
```

## What it needs to do

**Header.** Product title "Icon Browser" and a short line of intro copy. A control in the top right that switches between light and dark theme and remembers which one is active.

**Search.** A text box that filters the grid by icon name as you type. It should look clean and uncluttered, so keep the chrome minimal. Show a count of how many icons are showing.

**Category filter.** A row of three toggles for Navigation, Media, and Status. More than one can be active at a time. An active toggle should look clearly different from an inactive one.

**Grid.** A responsive grid of icon cards, roughly six across on desktop. Each card shows the rendered icon, the icon name underneath, and a small status indicator. Use colour to show status: green for stable, amber for beta, red for deprecated. Cards should have a thin border and a subtle lift on hover. Keep the cards compact so plenty fit on screen.

Render the icon by injecting the raw `svg` string from the data. Do not rewrite the icons as JSX.

**Card actions.** Clicking a card opens a detail view. Each card also has a small copy button in its corner that copies the SVG string and shows brief confirmation that it worked.

**Detail view.** A centred overlay panel over a dimmed backdrop showing a large icon preview, the name, category, status, and the raw SVG in a code block, with a copy button and a close control. Clicking the backdrop closes it.

**Empty state.** When search matches nothing, show a friendly message.

**Polish.** Add smooth transitions so the grid and the overlay feel responsive rather than abrupt.

## Definition of done

Renders with no console errors, all interactions work, and it looks like a polished internal tool. Write the two files and stop.
