const checker = require('accessibility-checker');
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const STUDY = path.resolve(__dirname, '..');

const PRIME = JSON.parse(fs.readFileSync(path.join(STUDY,'data','colors-6.0.json')));
const TOK = {}; for (const [k, v] of Object.entries(PRIME)) TOK[v.toUpperCase()] = k;

function lin(v) { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }
function lum(r, g, b) { return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b); }
function toHex(s) {
  const m = s.match(/(\d+\.?\d*)/g); if (!m) return null;
  return '#' + m.slice(0, 3).map(x => (+x | 0).toString(16).padStart(2, '0').toUpperCase()).join('');
}

(async () => {
  const browser = await chromium.launch();
  for (const arm of ['control', 'treatment']) {
    console.log(`\n############ ${arm.toUpperCase()} ############`);
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto('file://' + path.resolve(__dirname, arm, 'index.html'));
    await page.waitForTimeout(1200);

    // ---- contrast detail with token attribution
    const r = await checker.getCompliance(page, `${arm}-v`);
    const vio = r.report.results.filter(x => x.level === 'violation');
    const cvio = vio.filter(x => x.ruleId === 'text_contrast_sufficient');
    console.log(`\n-- contrast violations: ${cvio.length}`);
    for (const v of cvio.slice(0, 12)) {
      const mm = v.message.match(/([\d.]+):1/);
      const cols = v.message.match(/#[0-9a-fA-F]{6}/g) || [];
      const named = cols.map(c => TOK[c.toUpperCase()] ? `${c} = ${TOK[c.toUpperCase()]}` : `${c} = not a Prime token`);
      console.log(`   ratio ${mm ? mm[1] : '?'}  ${named.join('  on  ')}`);
      console.log(`      ${v.path.dom.split('/').slice(-2).join('/')}`);
    }

    // ---- verify accessible names of everything flagged label_content_exists
    const lvio = vio.filter(x => x.ruleId === 'label_content_exists' || x.ruleId === 'input_label_exists' || x.ruleId === 'svg_graphics_labelled');
    console.log(`\n-- name-related violations: ${lvio.length}  (${[...new Set(lvio.map(v => v.ruleId))].join(', ')})`);
    const names = await page.evaluate(async () => {
      const res = [];
      for (const el of document.querySelectorAll('input,button,a,[role="checkbox"],[role="button"],svg')) {
        res.push({ tag: el.tagName.toLowerCase(), type: el.type || '', id: el.id || '',
                   aria: el.getAttribute('aria-label') || '', labelledby: el.getAttribute('aria-labelledby') || '',
                   txt: (el.textContent || '').trim().slice(0, 30) });
      }
      return res;
    });
    // use CDP accessibility tree for ground truth
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Accessibility.enable');
    const tree = await cdp.send('Accessibility.getFullAXTree');
    const unnamed = tree.nodes.filter(n =>
      ['checkbox', 'button', 'link', 'textbox', 'combobox', 'slider', 'switch'].includes(n.role?.value) &&
      !n.ignored && (!n.name?.value || !n.name.value.trim()));
    console.log(`   interactive nodes in the real a11y tree with NO accessible name: ${unnamed.length}`);
    for (const n of unnamed.slice(0, 8)) console.log(`      ${n.role.value}  ${JSON.stringify(n.name?.value || '')}`);

    // ---- state scans
    const states = [
      ['dialog', async p => { const cb = p.locator('thead input[type=checkbox], thead [role=checkbox]').first();
          await cb.click({ timeout: 3000 }).catch(() => {});
          await p.getByText(/archive/i).first().click({ timeout: 3000 }).catch(() => {}); }],
      ['settings', async p => { await p.reload(); await p.waitForTimeout(600);
          await p.locator('button').filter({ hasText: /account|settings|menu/i }).first().click({ timeout: 3000 }).catch(() => {});
          await p.waitForTimeout(400);
          await p.getByText(/settings/i).last().click({ timeout: 3000 }).catch(() => {}); }],
    ];
    for (const [label, fn] of states) {
      await fn(page).catch(() => {});
      await page.waitForTimeout(900);
      const sr = await checker.getCompliance(page, `${arm}-${label}`);
      const c = sr.report.summary.counts;
      const rules = {};
      sr.report.results.filter(x => x.level === 'violation').forEach(x => rules[x.ruleId] = (rules[x.ruleId] || 0) + 1);
      console.log(`\n-- state "${label}": violations ${c.violation}  ${JSON.stringify(rules)}`);
    }
    await page.close();
  }
  await browser.close();
  process.exit(0);
})();
