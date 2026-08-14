// Study 5 harness. Scores a live URL against the pre-registered 20-item rubric.
const checker = require('accessibility-checker');
const { chromium } = require('playwright');
const fs = require('fs');

const URL = process.argv[2];
const LABEL = process.argv[3] || 'arm';

function lum([r, g, b]) {
  const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function ratio(a, b) { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const pageErrors = [];
  page.on('pageerror', e => pageErrors.push(String(e)));
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(3500);

  // ---------- DOM facts ----------
  const dom = await page.evaluate(() => {
    const lum = ([r, g, b]) => { const f = v => { v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
    const ratio = (a, b) => { const x = lum(a), y = lum(b);
      return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
    const q = s => [...document.querySelectorAll(s)];
    const vis = el => {
      const c = getComputedStyle(el), b = el.getBoundingClientRect();
      return c.display !== 'none' && c.visibility !== 'hidden' && +c.opacity > 0.05 && b.width > 0 && b.height > 0;
    };
    const name = el => (el.getAttribute('aria-label') || el.getAttribute('title') ||
      (el.getAttribute('aria-labelledby') ? (document.getElementById(el.getAttribute('aria-labelledby')) || {}).textContent : '') ||
      el.textContent || '').trim().replace(/\s+/g, ' ');

    const rgb = s => { const m = (s || '').match(/rgba?\(([^)]+)\)/); if (!m) return null;
      const p = m[1].split(',').map(Number); return p.length > 3 && p[3] < 0.95 ? null : p.slice(0, 3); };
    const bgOf = el => { let n = el; while (n && n !== document.documentElement) {
        const c = rgb(getComputedStyle(n).backgroundColor); if (c) return c; n = n.parentElement; }
      return rgb(getComputedStyle(document.body).backgroundColor) || [255, 255, 255]; };

    // Landmarks and headings
    const landmarks = { header: q('header,[role=banner]').filter(vis).length,
      nav: q('nav,[role=navigation]').filter(vis).length,
      main: q('main,[role=main]').filter(vis).length,
      footer: q('footer,[role=contentinfo]').filter(vis).length };
    const heads = q('h1,h2,h3,h4,h5,h6').filter(vis)
      .map(h => ({ lvl: +h.tagName[1], text: h.textContent.trim().slice(0, 60),
                   size: parseFloat(getComputedStyle(h).fontSize) }));
    let skips = 0;
    for (let i = 1; i < heads.length; i++) if (heads[i].lvl - heads[i - 1].lvl > 1) skips++;

    // Images
    const imgs = q('img').filter(vis).map(i => ({
      alt: i.getAttribute('alt'), hasAttr: i.hasAttribute('alt'),
      src: (i.currentSrc || i.src || '').split('/').pop().slice(0, 40),
      role: i.getAttribute('role'), w: Math.round(i.getBoundingClientRect().width) }));
    const svgs = q('svg').filter(vis).map(s => ({
      hidden: s.getAttribute('aria-hidden') === 'true', label: s.getAttribute('aria-label'),
      hasTitle: !!s.querySelector('title'), focusable: s.getAttribute('focusable') }));
    const bgImgEls = q('*').filter(el => vis(el) && getComputedStyle(el).backgroundImage.includes('url('))
      .map(el => ({ tag: el.tagName, cls: (el.className || '').toString().slice(0, 40),
                    role: el.getAttribute('role'), label: el.getAttribute('aria-label'),
                    w: Math.round(el.getBoundingClientRect().width),
                    h: Math.round(el.getBoundingClientRect().height) }))
      .filter(x => x.w > 60 && x.h > 60);

    // Interactive
    const SEL = 'a[href],button,input,select,textarea,[role=button],[role=link],[tabindex]:not([tabindex="-1"])';
    const inter = q(SEL).filter(vis).map(el => {
      const b = el.getBoundingClientRect();
      return { tag: el.tagName, type: el.type || null, name: name(el).slice(0, 34),
               w: Math.round(b.width), h: Math.round(b.height),
               href: el.getAttribute('href'), hasName: name(el).length > 0 };
    });
    const fakeBtn = q('div,span,li').filter(el => vis(el) &&
      (el.onclick || el.getAttribute('onclick') || el.getAttribute('role') === 'button') &&
      !el.closest('a,button')).map(el => ({ tag: el.tagName, cls: (el.className || '').toString().slice(0, 30) }));

    // Text contrast
    const textNodes = q('body *').filter(el => vis(el) &&
      [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 1));
    const tc = [];
    for (const el of textNodes) {
      const cs = getComputedStyle(el);
      const fg = rgb(cs.color); if (!fg) continue;
      const bg = bgOf(el);
      const size = parseFloat(cs.fontSize), wt = parseInt(cs.fontWeight) || 400;
      const large = size >= 24 || (size >= 18.66 && wt >= 700);
      tc.push({ r: +ratio(fg, bg).toFixed(2), need: large ? 3 : 4.5, size, wt,
                fg: fg.join(','), bg: bg.join(','),
                text: el.textContent.trim().replace(/\s+/g, ' ').slice(0, 40) });
    }

    // Non-text contrast on controls
    const nt = q('button,input,select,textarea,[role=button]').filter(vis).map(el => {
      const cs = getComputedStyle(el);
      const bw = parseFloat(cs.borderTopWidth) || 0;
      const bc = rgb(cs.borderTopColor), bgc = rgb(cs.backgroundColor);
      const behind = bgOf(el.parentElement || document.body);
      return { name: name(el).slice(0, 26), borderWidth: bw,
               borderRatio: bc && bw > 0 ? +ratio(bc, behind).toFixed(2) : null,
               fillRatio: bgc ? +ratio(bgc, behind).toFixed(2) : null };
    });

    // Forms
    const fields = q('input,select,textarea').filter(vis).map(el => {
      const id = el.id;
      const lab = id ? document.querySelector(`label[for="${id}"]`) : null;
      return { type: el.type, id: id || null, hasLabelEl: !!lab,
               wrapLabel: !!el.closest('label'),
               aria: el.getAttribute('aria-label') || el.getAttribute('aria-labelledby'),
               placeholder: el.getAttribute('placeholder'),
               autocomplete: el.getAttribute('autocomplete'),
               describedby: el.getAttribute('aria-describedby'),
               required: el.hasAttribute('required') || el.getAttribute('aria-required') };
    });

    // Skip link: first focusable anchor targeting a fragment
    const first = q('a[href^="#"]')[0];
    const skip = first ? { text: first.textContent.trim().slice(0, 40), href: first.getAttribute('href') } : null;

    // Live regions
    const live = q('[aria-live],[role=status],[role=alert],output').map(el => ({
      tag: el.tagName, live: el.getAttribute('aria-live'), role: el.getAttribute('role') }));

    // Motion
    const anim = q('body *').filter(el => { const c = getComputedStyle(el);
      return vis(el) && ((c.transitionDuration && c.transitionDuration !== '0s') ||
        (c.animationName && c.animationName !== 'none')); }).length;

    return { landmarks, heads, skips, imgs, svgs, bgImgEls, inter, fakeBtn, tc, nt,
             fields, skip, live, anim, title: document.title, lang: document.documentElement.lang };
  });

  // ---------- reduced motion in stylesheets ----------
  const prm = await page.evaluate(() => {
    let n = 0;
    for (const ss of document.styleSheets) {
      try { for (const r of ss.cssRules) if (r.conditionText && /prefers-reduced-motion/.test(r.conditionText)) n++; }
      catch (e) { /* cross origin */ }
    }
    return n;
  });

  // ---------- focus visibility ----------
  const focus = await page.evaluate(() => {
    const q = s => [...document.querySelectorAll(s)];
    const vis = el => { const c = getComputedStyle(el), b = el.getBoundingClientRect();
      return c.display !== 'none' && c.visibility !== 'hidden' && b.width > 0; };
    const els = q('a[href],button,input,select,textarea,[role=button]').filter(vis).slice(0, 40);
    const out = [];
    for (const el of els) {
      const before = getComputedStyle(el);
      const snap = o => [o.outlineStyle, o.outlineWidth, o.outlineColor, o.boxShadow, o.borderColor, o.backgroundColor].join('|');
      const b4 = snap(before);
      el.focus();
      const after = getComputedStyle(el);
      out.push({ name: (el.getAttribute('aria-label') || el.textContent || el.type || '').trim().slice(0, 26),
                 changed: snap(after) !== b4,
                 outline: after.outlineStyle + ' ' + after.outlineWidth + ' ' + after.outlineColor,
                 shadow: after.boxShadow.slice(0, 50) });
    }
    return out;
  });

  // ---------- reflow at 320px and 200% ----------
  await page.setViewportSize({ width: 320, height: 800 });
  await page.waitForTimeout(1200);
  const reflow320 = await page.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth, clientW: document.documentElement.clientWidth,
    overflowing: [...document.querySelectorAll('body *')].filter(el => {
      const b = el.getBoundingClientRect();
      return b.width > 0 && b.right > document.documentElement.clientWidth + 2;
    }).slice(0, 12).map(el => ({ tag: el.tagName, cls: (el.className || '').toString().slice(0, 34),
                                 right: Math.round(el.getBoundingClientRect().right),
                                 text: (el.textContent || '').trim().slice(0, 30) })),
  }));
  await page.setViewportSize({ width: 640, height: 900 });  // 1280 at 200%
  await page.waitForTimeout(1000);
  const reflow200 = await page.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth, clientW: document.documentElement.clientWidth,
  }));

  // ---------- form interaction ----------
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.waitForTimeout(800);
  const formTest = await page.evaluate(async () => {
    const inp = document.querySelector('input[type=email], input[type=text]');
    if (!inp) return { ran: false };
    const form = inp.closest('form');
    const btn = (form || document).querySelector('button, input[type=submit], [role=button]');
    const before = document.body.innerText;
    inp.focus();
    inp.value = 'not-an-email';
    inp.dispatchEvent(new Event('input', { bubbles: true }));
    inp.dispatchEvent(new Event('change', { bubbles: true }));
    inp.dispatchEvent(new Event('blur', { bubbles: true }));
    if (btn) btn.click();
    await new Promise(r => setTimeout(r, 1600));
    const after = document.body.innerText;
    const added = after.split('\n').filter(l => !before.includes(l) && l.trim()).slice(0, 8);
    return { ran: true, added,
      describedby: inp.getAttribute('aria-describedby'),
      invalid: inp.getAttribute('aria-invalid'),
      nativeValidation: typeof inp.checkValidity === 'function' ? !inp.checkValidity() : null,
      liveAfter: [...document.querySelectorAll('[aria-live],[role=status],[role=alert]')].map(e => ({
        role: e.getAttribute('role'), live: e.getAttribute('aria-live'),
        text: e.textContent.trim().slice(0, 60) })) };
  });

  // ---------- engine ----------
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(3000);
  const rep = await checker.getCompliance(page, `${LABEL}-study5`);
  const counts = rep.report.summary.counts;
  const violations = rep.report.results.filter(x => x.level === 'violation')
    .map(x => ({ rule: x.ruleId, msg: x.message.slice(0, 130), path: x.path.dom.slice(0, 100) }));
  const potential = rep.report.results.filter(x => x.level === 'potentialviolation')
    .map(x => ({ rule: x.ruleId, msg: x.message.slice(0, 110) }));

  const out = { url: URL, label: LABEL, dom, prm, focus, reflow320, reflow200,
                formTest, pageErrors, engine: { counts, violations, potential } };
  fs.writeFileSync(`/home/user/workspace/a11y-run/study5-${LABEL}.json`, JSON.stringify(out, null, 1));
  await browser.close();
  await checker.close();
  console.log(`saved study5-${LABEL}.json`);
  console.log('engine', JSON.stringify(counts));
})();
