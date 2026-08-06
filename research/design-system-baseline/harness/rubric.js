const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  for (const arm of ['control', 'treatment']) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto('file://' + path.resolve(__dirname, arm, 'index.html'));
    await page.waitForTimeout(1200);
    const r = await page.evaluate(() => {
      const q = s => [...document.querySelectorAll(s)];
      const vis = el => { const c = getComputedStyle(el), b = el.getBoundingClientRect();
        return c.display !== 'none' && c.visibility !== 'hidden' && b.width > 0 && b.height > 0; };
      const small = q('button,a,input[type=checkbox],input[type=radio],[role=button],[role=checkbox],select')
        .filter(vis).map(el => { const b = el.getBoundingClientRect();
          return { t: (el.textContent || el.getAttribute('aria-label') || el.type || '').trim().slice(0, 22),
                   w: Math.round(b.width), h: Math.round(b.height) }; })
        .filter(x => x.w < 24 || x.h < 24);
      const hs = q('h1,h2,h3,h4,h5,h6').filter(vis).map(h => +h.tagName[1]);
      let skips = 0; for (let i = 1; i < hs.length; i++) if (hs[i] - hs[i - 1] > 1) skips++;
      return {
        lang: document.documentElement.lang || null,
        title: document.title || null,
        h1: q('h1').length,
        headingSkips: skips,
        headingSeq: hs.join(','),
        landmarks: { main: q('main,[role=main]').length, nav: q('nav,[role=navigation]').length,
                     banner: q('header,[role=banner]').length, complementary: q('aside,[role=complementary]').length },
        skipLink: q('a[href^="#"]').filter(a => /skip/i.test(a.textContent)).length,
        tableHeaders: q('table th').length,
        thScope: q('table th[scope]').length,
        ariaSort: q('[aria-sort]').length,
        tablist: q('[role=tablist]').length, tabs: q('[role=tab]').length,
        tabSelected: q('[role=tab][aria-selected]').length,
        tabpanel: q('[role=tabpanel]').length,
        dialogs: q('[role=dialog],dialog').length,
        modalAttr: q('[role=dialog][aria-modal="true"],dialog').length,
        liveRegions: q('[aria-live],[role=status],[role=alert]').length,
        inputs: q('input,select,textarea').filter(vis).length,
        inputsLabeled: q('input,select,textarea').filter(vis).filter(el =>
          el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') ||
          (el.id && document.querySelector(`label[for="${CSS.escape(el.id)}"]`)) || el.closest('label')).length,
        required: q('[required],[aria-required=true]').length,
        invalidAttr: q('[aria-invalid]').length,
        describedby: q('[aria-describedby]').length,
        expanded: q('[aria-expanded]').length,
        svgTotal: q('svg').length,
        svgHidden: q('svg[aria-hidden=true]').length,
        svgNamed: q('svg[aria-label],svg[role=img]').length,
        autocomplete: q('input[autocomplete]').length,
        smallTargets: small,
      };
    });
    // focus visibility
    const focus = await page.evaluate(() => {
      const els = [...document.querySelectorAll('button,a[href],input,select,textarea')]
        .filter(e => e.offsetParent !== null).slice(0, 12);
      let ok = 0;
      for (const e of els) { e.focus();
        const c = getComputedStyle(e);
        if ((c.outlineStyle !== 'none' && parseFloat(c.outlineWidth) >= 1) ||
            c.boxShadow !== 'none') ok++; }
      return { tested: els.length, withIndicator: ok };
    });
    console.log(`\n========== ${arm.toUpperCase()} ==========`);
    console.log(JSON.stringify({ ...r, focus }, null, 1).replace(/\n\s*/g, ' ').slice(0, 2000));
    console.log(`\n small targets (${r.smallTargets.length}): ` +
      r.smallTargets.slice(0, 10).map(t => `${t.w}x${t.h} "${t.t}"`).join(', '));
    await page.close();
  }
  await browser.close(); process.exit(0);
})();
