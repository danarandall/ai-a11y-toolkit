const checker = require('accessibility-checker');
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ARMS = ['control', 'treatment'];

(async () => {
  const browser = await chromium.launch();
  const out = {};
  for (const arm of ARMS) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const file = 'file://' + path.resolve(__dirname, arm, 'index.html');
    const errs = [];
    page.on('pageerror', e => errs.push(String(e)));
    await page.goto(file, { waitUntil: 'load' });
    await page.waitForTimeout(1500);

    const r = await checker.getCompliance(page, `${arm}-initial`);
    const s = r.report.summary.counts;
    out[arm] = {
      violation: s.violation, potential: s.potentialviolation,
      recommendation: s.recommendation, pageErrors: errs,
      rules: {},
      details: r.report.results
        .filter(x => x.level === 'violation')
        .map(x => ({ rule: x.ruleId, msg: x.message.slice(0, 140), xpath: x.path.dom.slice(0, 110) })),
    };
    for (const d of out[arm].details) {
      out[arm].rules[d.rule] = (out[arm].rules[d.rule] || 0) + 1;
    }
    await page.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(__dirname, 'scan-results.json'), JSON.stringify(out, null, 1));
  for (const arm of ARMS) {
    const o = out[arm];
    console.log(`\n=== ${arm.toUpperCase()} ===`);
    console.log(`violations ${o.violation}  potential ${o.potential}  recommendation ${o.recommendation}  jsErrors ${o.pageErrors.length}`);
    for (const [k, v] of Object.entries(o.rules).sort((a, b) => b[1] - a[1])) {
      console.log(`  ${String(v).padStart(3)}  ${k}`);
    }
  }
  process.exit(0);
})();
