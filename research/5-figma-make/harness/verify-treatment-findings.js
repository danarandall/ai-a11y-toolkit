// Hand verification of the ambiguous findings on the Make build.
const { chromium } = require('playwright');
const URL = 'https://tutu-invert-07297733.figma.site';

(async () => {
  const b = await chromium.launch();
  const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  // 1. The 1.34:1 text. What is it and is it real?
  const lowc = await page.evaluate(() => {
    const el = document.evaluate(
      '/html[1]/body[1]/div[1]/div[1]/div[1]/div[1]/div[1]/main[1]/section[1]/div[2]/div[1]',
      document, null, 9, null).singleNodeValue;
    if (!el) return null;
    const cs = getComputedStyle(el);
    const b = el.getBoundingClientRect();
    return { text: el.textContent.trim().slice(0, 70), color: cs.color, bg: cs.backgroundColor,
             size: cs.fontSize, weight: cs.fontWeight, opacity: cs.opacity,
             parentBg: getComputedStyle(el.parentElement).backgroundColor,
             parentBgImg: getComputedStyle(el.parentElement).backgroundImage.slice(0, 60),
             box: [Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)],
             cls: el.className.toString().slice(0, 80),
             html: el.outerHTML.slice(0, 220) };
  });
  console.log('--- 1.34:1 element ---'); console.log(JSON.stringify(lowc, null, 1));

  // 2. Skip link: does it become visible on focus?
  const skip = await page.evaluate(() => {
    const a = document.querySelector('a[href="#main-content"]');
    const snap = () => { const c = getComputedStyle(a), r = a.getBoundingClientRect();
      return { w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.x), y: Math.round(r.y),
               clip: c.clip, clipPath: c.clipPath, pos: c.position, ov: c.overflow,
               opacity: c.opacity, transform: c.transform }; };
    const before = snap(); a.focus(); const after = snap();
    return { before, after, target: !!document.getElementById('main-content') };
  });
  console.log('--- skip link ---'); console.log(JSON.stringify(skip, null, 1));

  // 3. Reduced motion coverage.
  const motion = await page.evaluate(() => {
    const out = { rules: [], animated: [] };
    for (const ss of document.styleSheets) {
      try { for (const r of ss.cssRules) {
        if (r.conditionText && /prefers-reduced-motion/.test(r.conditionText))
          out.rules.push({ cond: r.conditionText,
            inner: [...r.cssRules].map(x => x.cssText.slice(0, 200)) });
      } } catch (e) {}
    }
    out.animated = [...document.querySelectorAll('body *')].filter(el => {
      const c = getComputedStyle(el);
      return (c.transitionDuration !== '0s' && c.transitionDuration !== '') ||
             (c.animationName && c.animationName !== 'none'); })
      .slice(0, 20).map(el => ({ tag: el.tagName, cls: el.className.toString().slice(0, 40),
        trans: getComputedStyle(el).transitionDuration, anim: getComputedStyle(el).animationName }));
    return out;
  });
  console.log('--- reduced motion ---'); console.log(JSON.stringify(motion, null, 1));

  // 4. The one div flagged as a fake button.
  const fake = await page.evaluate(() => [...document.querySelectorAll('div,span,li')]
    .filter(el => { const c = getComputedStyle(el), r = el.getBoundingClientRect();
      return c.display !== 'none' && r.width > 0 &&
        (el.onclick || el.getAttribute('onclick') || el.getAttribute('role') === 'button') &&
        !el.closest('a,button'); })
    .map(el => ({ role: el.getAttribute('role'), tabindex: el.getAttribute('tabindex'),
      label: el.getAttribute('aria-label'), text: el.textContent.trim().slice(0, 40),
      html: el.outerHTML.slice(0, 160) })));
  console.log('--- fake buttons ---'); console.log(JSON.stringify(fake, null, 1));

  // 5. The <p> with an invalid aria-label, and the headerless table.
  const aria = await page.evaluate(() => {
    const p = document.querySelector('main p[aria-label]');
    const t = document.querySelector('address table, table');
    return { p: p ? { label: p.getAttribute('aria-label'), text: p.textContent.trim().slice(0, 60) } : null,
             table: t ? { html: t.outerHTML.slice(0, 400), ths: t.querySelectorAll('th').length,
                          caption: !!t.querySelector('caption'), rows: t.rows.length } : null };
  });
  console.log('--- aria-label on p, and the table ---'); console.log(JSON.stringify(aria, null, 1));

  // 6. Focus obscured by sticky header while tabbing.
  const obsc = await page.evaluate(() => {
    const h = document.querySelector('header');
    const cs = h ? getComputedStyle(h) : null;
    return { sticky: cs ? cs.position : null, height: h ? Math.round(h.getBoundingClientRect().height) : null };
  });
  let obscured = [];
  if (obsc.sticky === 'sticky' || obsc.sticky === 'fixed') {
    await page.evaluate(() => window.scrollTo(0, 1800));
    await page.waitForTimeout(600);
    for (let i = 0; i < 22; i++) {
      await page.keyboard.press('Tab');
      const r = await page.evaluate(() => {
        const el = document.activeElement; if (!el || el === document.body) return null;
        const b = el.getBoundingClientRect();
        const h = document.querySelector('header');
        const hb = h ? h.getBoundingClientRect() : null;
        return { name: (el.getAttribute('aria-label') || el.textContent || el.type || '').trim().slice(0, 28),
                 top: Math.round(b.top), headerBottom: hb ? Math.round(hb.bottom) : 0,
                 covered: hb ? b.top < hb.bottom && b.bottom > hb.top : false };
      });
      if (r && r.covered) obscured.push(r);
    }
  }
  console.log('--- sticky header ---', JSON.stringify(obsc), 'obscured:', JSON.stringify(obscured));

  // 7. Input boundary contrast.
  const inp = await page.evaluate(() => {
    const i = document.querySelector('input[type=email]');
    const cs = getComputedStyle(i);
    return { border: cs.border, borderColor: cs.borderTopColor, bg: cs.backgroundColor,
             parentBg: getComputedStyle(i.parentElement).backgroundColor,
             sectionBg: getComputedStyle(i.closest('section') || document.body).backgroundColor };
  });
  console.log('--- input ---', JSON.stringify(inp));

  await page.screenshot({ path: '/home/user/workspace/make-hero.png', clip: { x: 0, y: 0, width: 1280, height: 900 } });
  await b.close();
})();
