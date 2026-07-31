// Second pass. Measures the things a static scan cannot see:
// rendered contrast in both themes, focus visibility, and the DOM state
// after the interactions the brief asks for.
const { chromium } = require('playwright');
const fs = require('fs');

const ARMS = [
  ['control', 'http://127.0.0.1:8098/control/index.html'],
  ['treatment', 'http://127.0.0.1:8098/treatment/index.html'],
];

const LUM = `
function _lin(c){c/=255;return c<=0.04045?c/12.92:Math.pow((c+0.055)/1.055,2.4);}
function _rel(rgb){return 0.2126*_lin(rgb[0])+0.7152*_lin(rgb[1])+0.0722*_lin(rgb[2]);}
function _parse(s){const m=(s||'').match(/rgba?\\(([^)]+)\\)/);if(!m)return null;
  const p=m[1].split(',').map(x=>parseFloat(x.trim()));
  return {rgb:[p[0],p[1],p[2]],a:p.length>3?p[3]:1};}
function _ratio(a,b){const L1=_rel(a),L2=_rel(b);const hi=Math.max(L1,L2),lo=Math.min(L1,L2);
  return (hi+0.05)/(lo+0.05);}
function _bgOf(el){
  let n=el;
  while(n && n!==document.documentElement){
    const c=_parse(getComputedStyle(n).backgroundColor);
    if(c && c.a>0.95) return c.rgb;
    n=n.parentElement;
  }
  const b=_parse(getComputedStyle(document.body).backgroundColor);
  return (b&&b.a>0.95)?b.rgb:[255,255,255];
}
`;

async function contrastPass(page) {
  return await page.evaluate(`(()=>{${LUM}
    const out=[];
    const els=Array.from(document.querySelectorAll('body *'));
    for(const el of els){
      const direct=Array.from(el.childNodes).some(n=>n.nodeType===3 && n.textContent.trim().length>0);
      if(!direct) continue;
      const r=el.getBoundingClientRect();
      if(r.width===0||r.height===0) continue;
      const cs=getComputedStyle(el);
      if(cs.visibility==='hidden'||cs.display==='none'||parseFloat(cs.opacity)<0.1) continue;
      const fg=_parse(cs.color); if(!fg) continue;
      const bg=_bgOf(el);
      const px=parseFloat(cs.fontSize);
      const wt=parseInt(cs.fontWeight)||400;
      const large=(px>=24)||(px>=18.66&&wt>=700);
      const ratio=_ratio(fg.rgb,bg);
      const need=large?3:4.5;
      out.push({
        text:el.textContent.trim().slice(0,40),
        tag:el.tagName.toLowerCase(),
        cls:(el.className&&el.className.toString?el.className.toString():'').slice(0,40),
        fg:'rgb('+fg.rgb.join(',')+')', bg:'rgb('+bg.join(',')+')',
        px:Math.round(px*10)/10, weight:wt, large,
        ratio:Math.round(ratio*100)/100, need, pass:ratio>=need
      });
    }
    return out;
  })()`);
}

async function focusPass(page) {
  return await page.evaluate(`(async()=>{
    const els=Array.from(document.querySelectorAll('button, a[href], input, select, textarea, [role="button"], [tabindex]:not([tabindex="-1"])'))
      .filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;});
    const out=[];
    for(const el of els.slice(0,40)){
      const before=getComputedStyle(el);
      const b={outline:before.outlineStyle+' '+before.outlineWidth+' '+before.outlineColor,
               shadow:before.boxShadow, border:before.borderColor, bg:before.backgroundColor};
      el.focus();
      await new Promise(r=>setTimeout(r,30));
      const after=getComputedStyle(el);
      const a={outline:after.outlineStyle+' '+after.outlineWidth+' '+after.outlineColor,
               shadow:after.boxShadow, border:after.borderColor, bg:after.backgroundColor};
      const changed=(b.outline!==a.outline)||(b.shadow!==a.shadow)||(b.border!==a.border)||(b.bg!==a.bg);
      const hasOutline=after.outlineStyle!=='none'&&parseFloat(after.outlineWidth)>0;
      out.push({
        tag:el.tagName.toLowerCase(),
        name:(el.getAttribute('aria-label')||el.textContent||'').trim().slice(0,24),
        focused:document.activeElement===el,
        changed, hasOutline,
        outlineAfter:a.outline, shadowAfter:a.shadow.slice(0,60)
      });
      el.blur();
    }
    return out;
  })()`);
}

async function interactionPass(page) {
  const findBtn = async (re) => await page.evaluate(`(()=>{
    const bs=Array.from(document.querySelectorAll('button,[role="button"],summary'));
    const f=bs.find(b=>new RegExp(${JSON.stringify(re)},'i').test((b.getAttribute('aria-label')||b.textContent||'')));
    if(!f) return null;
    f.setAttribute('data-probe','1'); return true;
  })()`);

  const snap = async () => await page.evaluate(`(()=>{
    const q=s=>Array.from(document.querySelectorAll(s));
    return {
      live:q('[aria-live],[role="status"],[role="alert"]').map(e=>({
        role:e.getAttribute('role'),live:e.getAttribute('aria-live'),
        text:e.textContent.trim().slice(0,80)})),
      invalid:q('[aria-invalid="true"]').length,
      expandedTrue:q('[aria-expanded="true"]').length,
      expandedFalse:q('[aria-expanded="false"]').length,
      bodyText:document.body.innerText.replace(/\\s+/g,' ').slice(0,1500)
    };
  })()`);

  const result = { steps: {} };
  result.steps.initial = await snap();

  // 1. Push hydration above 85 via the range input.
  await page.evaluate(`(()=>{
    const r=document.querySelector('input[type="range"]');
    if(!r) return false;
    const setter=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;
    setter.call(r,'92');
    r.dispatchEvent(new Event('input',{bubbles:true}));
    r.dispatchEvent(new Event('change',{bubbles:true}));
    return true;
  })()`);
  await page.waitForTimeout(900);
  result.steps.hydration92 = await snap();

  // 2. Put an out of range value into a number field.
  await page.evaluate(`(()=>{
    const n=Array.from(document.querySelectorAll('input[type="number"],input[type="text"]'))
      .filter(i=>i.type!=='range')[0];
    if(!n) return false;
    const setter=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;
    setter.call(n,'999');
    n.dispatchEvent(new Event('input',{bubbles:true}));
    n.dispatchEvent(new Event('change',{bubbles:true}));
    n.dispatchEvent(new Event('blur',{bubbles:true}));
    return true;
  })()`);
  await page.waitForTimeout(900);
  result.steps.outOfRange = await snap();

  // 3. Expand the advanced section.
  if (await findBtn('advanced|more option|settings|show more')) {
    await page.click('[data-probe="1"]').catch(() => {});
    await page.waitForTimeout(700);
    result.steps.advancedOpen = await snap();
    await page.evaluate(`document.querySelectorAll('[data-probe]').forEach(e=>e.removeAttribute('data-probe'))`);
  } else {
    result.steps.advancedOpen = { note: 'no advanced toggle found by name' };
  }

  // 4. Save, which should raise a toast.
  if (await findBtn('save')) {
    await page.click('[data-probe="1"]').catch(() => {});
    await page.waitForTimeout(700);
    result.steps.afterSave = await snap();
    await page.evaluate(`document.querySelectorAll('[data-probe]').forEach(e=>e.removeAttribute('data-probe'))`);
  } else {
    result.steps.afterSave = { note: 'no save button found by name' };
  }

  return result;
}

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const all = {};

  for (const [label, url] of ARMS) {
    all[label] = {};

    for (const scheme of ['light', 'dark']) {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: scheme });
      const page = await ctx.newPage();
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await page.waitForTimeout(2000);

      // If the build ships its own theme control, drive it to reach the dark state
      // rather than relying on the media query alone.
      if (scheme === 'dark') {
        await page.evaluate(`(()=>{
          const bs=Array.from(document.querySelectorAll('button,[role="button"],input[type="checkbox"]'));
          const t=bs.find(b=>/theme|dark|light|mode/i.test((b.getAttribute('aria-label')||b.textContent||'')));
          if(t){t.click();return true;} return false;
        })()`);
        await page.waitForTimeout(900);
        const bg = await page.evaluate(`getComputedStyle(document.body).backgroundColor`);
        all[label].darkBodyBg = bg;
      }

      const c = await contrastPass(page);
      all[label]['contrast_' + scheme] = {
        total: c.length,
        failures: c.filter(x => !x.pass),
        failCount: c.filter(x => !x.pass).length,
        min: c.length ? Math.min(...c.map(x => x.ratio)) : null,
      };

      if (scheme === 'light') {
        all[label].focus = await focusPass(page);
        all[label].interactions = await interactionPass(page);
      }

      await ctx.close();
    }

    const f = all[label].focus || [];
    all[label].focusSummary = {
      tested: f.length,
      noVisibleChange: f.filter(x => !x.changed).length,
      noVisibleChangeList: f.filter(x => !x.changed).map(x => x.tag + '[' + x.name + ']'),
    };

    console.log(`\n===== ${label} =====`);
    console.log('contrast light: ' + all[label].contrast_light.failCount + ' failing of ' + all[label].contrast_light.total);
    all[label].contrast_light.failures.slice(0, 12).forEach(x =>
      console.log(`   ${x.ratio}:1 need ${x.need}  ${x.fg} on ${x.bg}  ${x.px}px  "${x.text}"`));
    console.log('contrast dark:  ' + all[label].contrast_dark.failCount + ' failing of ' + all[label].contrast_dark.total + '  bodyBg=' + all[label].darkBodyBg);
    all[label].contrast_dark.failures.slice(0, 12).forEach(x =>
      console.log(`   ${x.ratio}:1 need ${x.need}  ${x.fg} on ${x.bg}  ${x.px}px  "${x.text}"`));
    console.log('focus: ' + all[label].focusSummary.noVisibleChange + ' of ' + all[label].focusSummary.tested + ' with no visible change');
    if (all[label].focusSummary.noVisibleChange) console.log('   ' + all[label].focusSummary.noVisibleChangeList.join(', '));
    console.log('interactions:', JSON.stringify(all[label].interactions, null, 1).slice(0, 4000));
  }

  fs.writeFileSync('/home/user/workspace/preventive-test-2/audit-results.json', JSON.stringify(all, null, 2));
  await browser.close();
})();
