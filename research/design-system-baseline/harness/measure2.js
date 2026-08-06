const { chromium } = require('playwright');
const path = require('path');

async function arm(b, name) {
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const url = 'file://' + path.resolve(__dirname, name, 'index.html');
  await p.goto(url); await p.waitForTimeout(900);
  const R = { arm: name };

  // 26 reflow at 320
  await p.setViewportSize({ width: 320, height: 900 });
  await p.waitForTimeout(600);
  R.reflow = await p.evaluate(() => ({
    hScroll: document.documentElement.scrollWidth > window.innerWidth + 2,
    overflow: document.documentElement.scrollWidth,
  }));
  await p.setViewportSize({ width: 1280, height: 900 }); await p.waitForTimeout(400);

  // 27 text spacing
  await p.addStyleTag({ content: `*{line-height:1.5 !important;letter-spacing:.12em !important;word-spacing:.16em !important}p{margin-bottom:2em !important}` });
  await p.waitForTimeout(600);
  R.textSpacing = await p.evaluate(() => {
    let clipped = 0;
    for (const el of document.querySelectorAll('button,a,td,th,label,h1,h2,h3,p,span')) {
      if (el.scrollWidth > el.clientWidth + 2 && getComputedStyle(el).overflow !== 'visible') clipped++;
    }
    return { clipped, hScroll: document.documentElement.scrollWidth > window.innerWidth + 2 };
  });
  await p.reload(); await p.waitForTimeout(900);

  // 29 slider
  R.slider = await p.evaluate(() => {
    const s = document.querySelector('input[type=range],[role=slider]');
    if (!s) return null;
    return { tag: s.tagName.toLowerCase(), role: s.getAttribute('role'),
      name: s.getAttribute('aria-label') || (s.id && document.querySelector(`label[for="${s.id}"]`)?.textContent.trim()) || null,
      now: s.getAttribute('aria-valuenow') ?? s.value, text: s.getAttribute('aria-valuetext') };
  });
  if (R.slider) { const s = p.locator('input[type=range],[role=slider]').first();
    const v0 = await s.evaluate(e => e.value ?? e.getAttribute('aria-valuenow'));
    await s.focus(); await p.keyboard.press('ArrowRight'); await p.waitForTimeout(250);
    const v1 = await s.evaluate(e => e.value ?? e.getAttribute('aria-valuenow'));
    R.slider.keyboardWorks = v0 !== v1; }

  // 31 label in name
  R.labelInName = await p.evaluate(() => {
    let bad = [];
    for (const el of document.querySelectorAll('button,a[href],[role=button]')) {
      const vis = (el.innerText || '').trim(); const al = el.getAttribute('aria-label');
      if (vis && al && !al.toLowerCase().includes(vis.toLowerCase().split('\n')[0].trim())) bad.push({ vis: vis.slice(0, 18), al: al.slice(0, 28) });
    }
    return { mismatches: bad.length, sample: bad.slice(0, 3) };
  });

  // 18 status conveyed by more than color
  R.statusBadge = await p.evaluate(() => {
    const cells = [...document.querySelectorAll('td')].filter(td => /paid|pending|refunded|failed|archived/i.test(td.textContent));
    return { count: cells.length, hasText: cells.length > 0 && cells.every(c => c.textContent.trim().length > 2) };
  });

  // 7/8 modal
  await p.locator('tbody input[type=checkbox]').first().check({ timeout: 3000 }).catch(() => {});
  await p.waitForTimeout(300);
  await p.getByRole('button', { name: /archive/i }).first().click({ timeout: 3000 }).catch(() => {});
  await p.waitForTimeout(700);
  R.modal = await p.evaluate(() => {
    const d = document.querySelector('[role=dialog][open],dialog[open],[role=dialog]:not([hidden])');
    if (!d || d.offsetParent === null && d.tagName !== 'DIALOG') return { open: false };
    const nm = d.getAttribute('aria-label') || (d.getAttribute('aria-labelledby') &&
      document.getElementById(d.getAttribute('aria-labelledby'))?.textContent.trim());
    return { open: true, name: nm || null, modal: d.getAttribute('aria-modal'),
      focusInside: d.contains(document.activeElement), active: document.activeElement?.tagName };
  });
  if (R.modal.open) {
    const seq = [];
    for (let i = 0; i < 14; i++) { await p.keyboard.press('Tab');
      seq.push(await p.evaluate(() => { const d = document.querySelector('[role=dialog],dialog[open]');
        return d ? d.contains(document.activeElement) : null; })); }
    R.modal.focusTrapped = seq.every(x => x === true);
    await p.keyboard.press('Escape'); await p.waitForTimeout(500);
    R.modal.escapeCloses = await p.evaluate(() => { const d = document.querySelector('[role=dialog],dialog[open]');
      return !d || d.offsetParent === null || !d.open === true; });
  }
  await p.close(); return R;
}
(async () => { const b = await chromium.launch();
  for (const n of ['control', 'treatment']) console.log('\n' + JSON.stringify(await arm(b, n), null, 1).replace(/\n\s*/g, ' '));
  await b.close(); process.exit(0); })();
