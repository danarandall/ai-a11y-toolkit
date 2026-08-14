// Second verification pass: composited colors, 2.5.8 spacing exception, real focus obscuring.
const { chromium } = require('playwright');
const URL = 'https://tutu-invert-07297733.figma.site';

function lum([r, g, b]) { const f = v => { v /= 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); }
function ratio(a, b) { const x = lum(a), y = lum(b);
  return +((Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)).toFixed(2); }
function over(fg, a, bg) { return fg.map((c, i) => Math.round(c * a + bg[i] * (1 - a))); }

(async () => {
  const b = await chromium.launch();
  const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  // Resolve the badge's real background by sampling the rendered pixels around the text.
  const badge = await page.evaluate(() => {
    const el = [...document.querySelectorAll('[aria-hidden="true"]')]
      .find(e => /Country Sourdough/.test(e.textContent));
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    // Resolve --primary to rgb by painting it.
    const probe = document.createElement('div');
    probe.style.cssText = 'position:fixed;left:-9999px;background:var(--primary)';
    document.body.appendChild(probe);
    const primary = getComputedStyle(probe).backgroundColor;
    probe.style.background = 'var(--primary-foreground)';
    const pfg = getComputedStyle(probe).backgroundColor;
    probe.remove();
    return { box: [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)],
             color: cs.color, ownBg: cs.backgroundColor, primary, pfg };
  });
  console.log('badge:', JSON.stringify(badge));

  // Screenshot just the badge so we can read actual painted pixels.
  if (badge) {
    await page.screenshot({ path: '/home/user/workspace/badge.png',
      clip: { x: badge.box[0], y: badge.box[1], width: badge.box[2], height: badge.box[3] } });
  }

  // 2.5.8 spacing exception: build the target geometry for undersized targets.
  const targets = await page.evaluate(() => {
    const vis = el => { const c = getComputedStyle(el), r = el.getBoundingClientRect();
      return c.display !== 'none' && c.visibility !== 'hidden' && r.width > 1 && r.height > 1; };
    return [...document.querySelectorAll('a[href],button,input,select,textarea,[role=button]')]
      .filter(vis).map(el => { const r = el.getBoundingClientRect();
        return { name: (el.getAttribute('aria-label') || el.textContent || el.type || '').trim().slice(0, 30),
                 x: +r.x.toFixed(1), y: +(r.y + window.scrollY).toFixed(1),
                 w: +r.width.toFixed(1), h: +r.height.toFixed(1),
                 inNav: !!el.closest('nav'), inHeader: !!el.closest('header'),
                 inline: !!(el.parentElement && /^(P|LI|SPAN)$/.test(el.parentElement.tagName) &&
                            el.parentElement.textContent.trim().length > el.textContent.trim().length + 8) }; });
  });

  console.log('\n--- 2.5.8 undersized targets and the spacing exception ---');
  const under = targets.filter(t => t.w < 24 || t.h < 24);
  for (const t of under) {
    // 24px diameter circle centered on the target must not intersect another target's circle.
    const cx = t.x + t.w / 2, cy = t.y + t.h / 2;
    let clash = null, minD = Infinity;
    for (const o of targets) {
      if (o === t) continue;
      const ox = o.x + o.w / 2, oy = o.y + o.h / 2;
      const d = Math.hypot(cx - ox, cy - oy);
      if (d < minD) { minD = d; clash = o.name; }
    }
    const spacingOk = minD >= 24;
    console.log(`  ${t.w.toFixed(0)}x${t.h.toFixed(0)}  "${t.name}"  nearest center ${minD.toFixed(1)}px `
      + `(${clash})  spacing exception ${spacingOk ? 'MET' : 'NOT met'}  inline=${t.inline}`);
  }

  // Real 2.4.11: does the sticky header cover a focused element that is NOT inside it?
  await page.evaluate(() => window.scrollTo(0, 0));
  let obscured = [];
  for (let i = 0; i < 60; i++) {
    await page.keyboard.press('Tab');
    const r = await page.evaluate(() => {
      const el = document.activeElement; if (!el || el === document.body) return null;
      if (el.closest('header')) return { skip: true };
      const b = el.getBoundingClientRect();
      const h = document.querySelector('header'); const hb = h.getBoundingClientRect();
      const cs = getComputedStyle(h);
      const covering = cs.position === 'sticky' || cs.position === 'fixed';
      return { name: (el.getAttribute('aria-label') || el.textContent || el.type || '').trim().slice(0, 30),
               top: Math.round(b.top), headerBottom: Math.round(hb.bottom),
               covered: covering && b.top < hb.bottom && b.bottom > hb.top };
    });
    if (r && !r.skip && r.covered) obscured.push(r);
  }
  console.log('\n--- 2.4.11 focus not obscured, non-header elements only ---');
  console.log('  obscured:', obscured.length ? JSON.stringify(obscured) : 'none');

  // Input boundary against its section.
  const inp = await page.evaluate(() => {
    const i = document.querySelector('input[type=email]');
    const rgb = s => { const m = s.match(/\d+(\.\d+)?/g); return m ? m.slice(0, 3).map(Number) : null; };
    return { fill: rgb(getComputedStyle(i).backgroundColor),
             section: rgb(getComputedStyle(i.closest('section')).backgroundColor),
             borderColor: getComputedStyle(i).borderTopColor };
  });
  console.log('\n--- 1.4.11 input boundary ---');
  console.log(`  fill rgb(${inp.fill}) on section rgb(${inp.section}) = ${ratio(inp.fill, inp.section)}:1`);

  // Focus ring contrast on the two grounds it appears against.
  const ring = await page.evaluate(() => {
    const a = document.querySelector('a[href="#breads"]'); a.focus();
    const cs = getComputedStyle(a);
    const probe = document.createElement('div');
    probe.style.cssText = 'position:fixed;left:-9999px;background:' + cs.outlineColor;
    document.body.appendChild(probe);
    const resolved = getComputedStyle(probe).backgroundColor; probe.remove();
    const rgb = s => { const m = s.match(/\d+(\.\d+)?/g); return m ? m.slice(0, 3).map(Number) : null; };
    return { outlineColor: cs.outlineColor, resolved: rgb(resolved),
             width: cs.outlineWidth, offset: cs.outlineOffset,
             behind: rgb(getComputedStyle(document.querySelector('header')).backgroundColor) };
  });
  console.log('\n--- 2.4.11 / 1.4.11 focus ring ---');
  console.log('  ', JSON.stringify(ring));
  if (ring.resolved && ring.behind) console.log(`   ring vs header bg = ${ratio(ring.resolved, ring.behind)}:1`);

  await b.close();
})();
