const { chromium } = require('playwright');
const aChecker = require('accessibility-checker');
const fs = require('fs');
const path = require('path');
const STUDY = path.resolve(__dirname, '..');

const ARMS = [
  ['control', 'http://127.0.0.1:8098/control/index.html'],
  ['treatment', 'http://127.0.0.1:8098/treatment/index.html'],
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
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(800);

    // Scan validity gate, the rule the toolkit requires.
    const chars = await page.evaluate(() => document.body.innerText.trim().length);
    if (chars < 200) {
      console.log(`\n!!! ${label}: only ${chars} chars rendered. Scan is not valid.`);
      console.log('    errors:', consoleErrors.slice(0, 5));
      summary.push({ label, chars, invalid: true, consoleErrors });
      await ctx.close();
      continue;
    }

    const dom = await page.evaluate(() => {
      const q = s => Array.from(document.querySelectorAll(s));
      const nameOf = el => {
        const al = el.getAttribute('aria-label');
        if (al) return al.trim();
        const lb = el.getAttribute('aria-labelledby');
        if (lb) {
          const t = lb.split(/\s+/).map(id => {
            const n = document.getElementById(id);
            return n ? n.textContent.trim() : '';
          }).join(' ').trim();
          if (t) return t;
        }
        if (el.id) {
          const l = document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
          if (l) return l.textContent.trim();
        }
        const wrap = el.closest('label');
        if (wrap) return wrap.textContent.trim();
        const t = (el.textContent || '').trim();
        if (t) return t;
        const ttl = el.getAttribute('title');
        if (ttl) return ttl.trim();
        return '';
      };

      const inputs = q('input, select, textarea').map(i => ({
        type: i.type || i.tagName.toLowerCase(),
        name: nameOf(i).slice(0, 50),
        hasName: !!nameOf(i),
        placeholder: i.placeholder || '',
        placeholderOnly: !!i.placeholder && !nameOf(i),
        ariaInvalid: i.getAttribute('aria-invalid'),
        ariaDescribedby: i.getAttribute('aria-describedby'),
        ariaValuetext: i.getAttribute('aria-valuetext'),
      }));

      const buttons = q('button, [role="button"]').map(b => ({
        name: nameOf(b).slice(0, 50),
        hasName: !!nameOf(b),
        ariaPressed: b.getAttribute('aria-pressed'),
        ariaExpanded: b.getAttribute('aria-expanded'),
      }));

      const tables = q('table').map(t => ({
        th: t.querySelectorAll('th').length,
        thWithScope: t.querySelectorAll('th[scope]').length,
        rows: t.querySelectorAll('tr').length,
        hasCaption: !!t.querySelector('caption'),
      }));

      const svgs = q('svg');
      const named = el => {
        let n = el;
        while (n) {
          if (n.getAttribute && (n.getAttribute('aria-label') || n.getAttribute('aria-labelledby'))) return true;
          n = n.parentElement;
        }
        return false;
      };

      const interactive = q('button, a[href], input, select, textarea, [role="button"], [tabindex]:not([tabindex="-1"])');
      const sizes = interactive.map(el => {
        const r = el.getBoundingClientRect();
        return { tag: el.tagName.toLowerCase(), name: nameOf(el).slice(0, 24), w: Math.round(r.width), h: Math.round(r.height) };
      }).filter(s => s.w > 0 && s.h > 0);
      const smallest = sizes.length ? sizes.reduce((a, b) => (Math.min(a.w, a.h) <= Math.min(b.w, b.h) ? a : b)) : null;

      return {
        h1s: q('h1').map(h => h.textContent.trim().slice(0, 60)),
        headings: q('h1,h2,h3,h4,h5,h6').map(h => h.tagName + ':' + h.textContent.trim().slice(0, 40)),
        mains: q('main, [role="main"]').length,
        liveRegions: q('[aria-live], [role="status"], [role="alert"]').length,
        liveRegionDetail: q('[aria-live], [role="status"], [role="alert"]').map(e => ({
          tag: e.tagName.toLowerCase(),
          role: e.getAttribute('role'),
          live: e.getAttribute('aria-live'),
          atomic: e.getAttribute('aria-atomic'),
        })),
        inputs,
        inputsTotal: inputs.length,
        inputsUnnamed: inputs.filter(i => !i.hasName).length,
        inputsPlaceholderOnly: inputs.filter(i => i.placeholderOnly).length,
        ranges: inputs.filter(i => i.type === 'range'),
        buttons,
        buttonsTotal: buttons.length,
        buttonsUnnamed: buttons.filter(b => !b.hasName).length,
        ariaPressed: q('[aria-pressed]').length,
        ariaExpanded: q('[aria-expanded]').length,
        ariaInvalid: q('[aria-invalid]').length,
        radiogroups: q('[role="radiogroup"], fieldset').length,
        detailsEl: q('details').length,
        tables,
        tablesTotal: tables.length,
        divsWithAriaLabel: q('div[aria-label], span[aria-label]').length,
        divOnClickish: q('div[onclick], span[onclick]').length,
        svgTotal: svgs.length,
        svgAriaHidden: svgs.filter(s => s.getAttribute('aria-hidden') === 'true').length,
        svgExposedUnnamed: svgs.filter(s => s.getAttribute('aria-hidden') !== 'true' && !named(s)).length,
        interactiveCount: sizes.length,
        under24: sizes.filter(s => s.w < 24 || s.h < 24).length,
        under24List: sizes.filter(s => s.w < 24 || s.h < 24).map(s => `${s.tag}[${s.name}] ${s.w}x${s.h}`),
        smallest,
      };
    });

    const res = await aChecker.getCompliance(page, 'p2-' + label);
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

  fs.writeFileSync(path.join(STUDY,'data','scan-results.json'), JSON.stringify(summary, null, 2));
  await browser.close();
  await aChecker.close();
})();
