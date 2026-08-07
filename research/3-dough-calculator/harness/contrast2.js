// Corrected contrast pass. The first attempt assumed a click always moved the
// build into dark. It does not: one arm already honored prefers-color-scheme,
// so the click flipped it back to light and the two arms were measured in
// different states. This version verifies the rendered state before measuring.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const STUDY = path.resolve(__dirname, '..');

const ARMS = [
  ['control', 'http://127.0.0.1:8098/control/index.html'],
  ['treatment', 'http://127.0.0.1:8098/treatment/index.html'],
];

const MEASURE = `(()=>{
function _lin(c){c/=255;return c<=0.04045?c/12.92:Math.pow((c+0.055)/1.055,2.4);}
function _rel(r){return 0.2126*_lin(r[0])+0.7152*_lin(r[1])+0.0722*_lin(r[2]);}
function _parse(s){const m=(s||'').match(/rgba?\\(([^)]+)\\)/);if(!m)return null;
  const p=m[1].split(',').map(x=>parseFloat(x.trim()));
  return {rgb:[p[0],p[1],p[2]],a:p.length>3?p[3]:1};}
function _ratio(a,b){const L1=_rel(a),L2=_rel(b),hi=Math.max(L1,L2),lo=Math.min(L1,L2);
  return (hi+0.05)/(lo+0.05);}
function _bg(el){let n=el;
  while(n&&n!==document.documentElement){const c=_parse(getComputedStyle(n).backgroundColor);
    if(c&&c.a>0.95)return c.rgb;n=n.parentElement;}
  return [255,255,255];}
const out=[];
for(const el of Array.from(document.querySelectorAll('body *'))){
  if(!Array.from(el.childNodes).some(n=>n.nodeType===3&&n.textContent.trim()))continue;
  const r=el.getBoundingClientRect(); if(!r.width||!r.height)continue;
  const cs=getComputedStyle(el);
  if(cs.visibility==='hidden'||cs.display==='none'||parseFloat(cs.opacity)<0.1)continue;
  if(el.closest('[aria-hidden="true"]'))continue;
  const fg=_parse(cs.color); if(!fg)continue;
  const bg=_bg(el);
  const px=parseFloat(cs.fontSize), wt=parseInt(cs.fontWeight)||400;
  const large=(px>=24)||(px>=18.66&&wt>=700);
  const ratio=_ratio(fg.rgb,bg), need=large?3:4.5;
  out.push({text:el.textContent.trim().slice(0,38),tag:el.tagName.toLowerCase(),
    fg:'rgb('+fg.rgb.join(',')+')',bg:'rgb('+bg.join(',')+')',
    px:Math.round(px*10)/10,weight:wt,large,ratio:Math.round(ratio*100)/100,need,pass:ratio>=need});
}
return out;})()`;

// Is the tool currently painting dark? Judged from the app wrapper, not <body>,
// because both builds leave body transparent.
const ISDARK = `(()=>{
  const w=document.querySelector('#root>*'); if(!w) return null;
  const m=(getComputedStyle(w).backgroundColor||'').match(/rgba?\\(([^)]+)\\)/);
  if(!m) return null;
  const p=m[1].split(',').map(x=>parseFloat(x.trim()));
  return (0.2126*p[0]+0.7152*p[1]+0.0722*p[2])/255 < 0.5;
})()`;

const CLICK = `(()=>{const bs=Array.from(document.querySelectorAll('button'));
  const t=bs.find(x=>/theme|dark|light|mode/i.test((x.getAttribute('aria-label')||x.textContent||'')));
  if(t){t.click();return true;}return false;})()`;

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const all = {};

  for (const [label, url] of ARMS) {
    all[label] = {};
    for (const want of ['light', 'dark']) {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: want });
      const page = await ctx.newPage();
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await page.waitForTimeout(1800);

      let isDark = await page.evaluate(ISDARK);
      let clicks = 0;
      while (isDark !== (want === 'dark') && clicks < 2) {
        await page.evaluate(CLICK);
        await page.waitForTimeout(800);
        isDark = await page.evaluate(ISDARK);
        clicks++;
      }
      const reached = isDark === (want === 'dark');

      const c = await page.evaluate(MEASURE);
      const fails = c.filter(x => !x.pass);
      all[label][want] = {
        requested: want, reachedRequestedState: reached, isDark, clicksNeeded: clicks,
        wrapperBg: await page.evaluate(`(()=>{const w=document.querySelector('#root>*');return w?getComputedStyle(w).backgroundColor:null})()`),
        total: c.length, failCount: fails.length,
        minRatio: c.length ? Math.min(...c.map(x => x.ratio)) : null,
        failures: fails,
      };
      console.log(`\n--- ${label} / ${want}  (state reached: ${reached}, clicks: ${clicks}, wrapper ${all[label][want].wrapperBg}) ---`);
      console.log(`${fails.length} failing of ${c.length} text elements, lowest ratio ${all[label][want].minRatio}:1`);
      fails.forEach(x => console.log(`   ${x.ratio}:1 (needs ${x.need})  ${x.fg} on ${x.bg}  ${x.px}px  "${x.text}"`));
      await ctx.close();
    }
  }

  fs.writeFileSync(path.join(STUDY,'data','contrast-results.json'), JSON.stringify(all, null, 2));
  console.log('\n===== summary =====');
  for (const a of Object.keys(all)) {
    console.log(`${a}: light ${all[a].light.failCount}/${all[a].light.total} failing, dark ${all[a].dark.failCount}/${all[a].dark.total} failing`);
  }
  await browser.close();
})();
