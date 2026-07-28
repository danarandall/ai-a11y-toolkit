const { chromium } = require('playwright');
const aChecker = require('accessibility-checker');
const fs = require('fs');

const ARMS = [
  ['control', 'http://127.0.0.1:8099/control/index.html'],
  ['treatment', 'http://127.0.0.1:8099/treatment/index.html'],
];

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const summary = [];

  for (const [label, url] of ARMS) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    const consoleErrors = [];
    page.on('pageerror', e => consoleErrors.push(String(e).slice(0, 200)));
    page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 200)); });

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(2500);
    for (let i = 0; i < 2; i++) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(1200);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000);

    // Scan validity gate, the rule the toolkit now requires.
    const chars = await page.evaluate(() => document.body.innerText.trim().length);
    if (chars < 200) {
      console.log(`\n!!! ${label}: only ${chars} chars rendered. Scan is not valid.`);
      console.log('    errors:', consoleErrors.slice(0, 5));
      summary.push({ label, chars, invalid: true, consoleErrors });
      await ctx.close();
      continue;
    }

    // Structural measurements taken from the live DOM.
    const dom = await page.evaluate(() => {
      const q = s => Array.from(document.querySelectorAll(s));
      const svgs = q('svg');
      const named = el => {
        while (el) {
          if (el.getAttribute && (el.getAttribute('aria-label') || el.getAttribute('aria-labelledby'))) return true;
          el = el.parentElement;
        }
        return false;
      };
      const interactive = q('button, a[href], input, select, textarea, [role="button"], [tabindex]:not([tabindex="-1"])');
      const sizes = interactive.map(el => {
        const r = el.getBoundingClientRect();
        return { tag: el.tagName.toLowerCase(), w: Math.round(r.width), h: Math.round(r.height) };
      }).filter(s => s.w > 0 && s.h > 0);
      const smallest = sizes.length ? sizes.reduce((a, b) => (Math.min(a.w, a.h) <= Math.min(b.w, b.h) ? a : b)) : null;
      return {
        svgTotal: svgs.length,
        svgAriaHidden: svgs.filter(s => s.getAttribute('aria-hidden') === 'true').length,
        svgFocusableFalse: svgs.filter(s => s.getAttribute('focusable') === 'false').length,
        svgExposedUnnamed: svgs.filter(s => s.getAttribute('aria-hidden') !== 'true' && !named(s)).length,
        mains: q('main, [role="main"]').length,
        h1s: q('h1').map(h => h.textContent.trim().slice(0, 60)),
        headings: q('h1,h2,h3,h4,h5,h6').map(h => h.tagName + ':' + h.textContent.trim().slice(0, 40)),
        liveRegions: q('[aria-live], [role="status"], [role="alert"]').length,
        divsWithAriaLabel: q('div[aria-label], span[aria-label]').length,
        divOnClickish: q('div[onclick], span[onclick]').length,
        inputs: q('input').map(i => ({
          type: i.type,
          hasLabel: !!(i.getAttribute('aria-label') || i.getAttribute('aria-labelledby') ||
                       (i.id && document.querySelector(`label[for="${i.id}"]`)) || i.closest('label')),
          placeholderOnly: !!i.placeholder && !(i.getAttribute('aria-label') || i.getAttribute('aria-labelledby') ||
                       (i.id && document.querySelector(`label[for="${i.id}"]`)) || i.closest('label')),
        })),
        ariaPressed: q('[aria-pressed]').length,
        ariaChecked: q('[aria-checked]').length,
        buttons: q('button').length,
        buttonNames: Array.from(new Set(q('button').map(b =>
          (b.getAttribute('aria-label') || b.textContent.trim()).slice(0, 40)))),
        interactiveCount: sizes.length,
        under24: sizes.filter(s => s.w < 24 || s.h < 24).length,
        smallest,
      };
    });

    const res = await aChecker.getCompliance(page, 'prev-' + label);
    const counts = {};
    const byRule = {};
    for (const r of res.report.results) {
      if (r.level === 'pass') continue;
      counts[r.level] = (counts[r.level] || 0) + 1;
      const k = r.level + ' | ' + r.ruleId;
      byRule[k] = (byRule[k] || 0) + 1;
    }

    summary.push({ label, chars, consoleErrors, dom, counts, byRule });
    console.log(`\n===== ${label}  (${chars} chars rendered) =====`);
    console.log('IBM:', JSON.stringify(counts));
    Object.entries(byRule).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log('  x' + v + '  ' + k));
    console.log('DOM:', JSON.stringify(dom, null, 1));
    if (consoleErrors.length) console.log('CONSOLE ERRORS:', consoleErrors.slice(0, 5));
    await ctx.close();
  }

  fs.writeFileSync('/home/user/workspace/preventive-test/scan-results.json', JSON.stringify(summary, null, 2));
  await browser.close();
  await aChecker.close();
})();
