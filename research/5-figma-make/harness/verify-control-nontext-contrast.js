const { chromium } = require('playwright');
function lum(c){const f=v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4)};
 return 0.2126*f(c[0])+0.7152*f(c[1])+0.0722*f(c[2])}
function R(a,b){const x=lum(a),y=lum(b);return +((Math.max(x,y)+0.05)/(Math.min(x,y)+0.05)).toFixed(2)}
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:900}});
await p.goto('https://grace-number-99311548.figma.site',{waitUntil:'networkidle'});await p.waitForTimeout(3500);
// find every visible button with no accessible name
const un=await p.evaluate(()=>[...document.querySelectorAll('button,a,[role=button],input')]
  .filter(el=>{const c=getComputedStyle(el),r=el.getBoundingClientRect();
    return c.display!=='none'&&c.visibility!=='hidden'&&r.width>1&&
      !((el.getAttribute('aria-label')||el.getAttribute('title')||el.textContent||'').trim());})
  .map(el=>{const r=el.getBoundingClientRect();
    return {tag:el.tagName,type:el.type,w:Math.round(r.width),h:Math.round(r.height),
      y:Math.round(r.y+window.scrollY),svg:(el.querySelector('svg')?.getAttribute('class')||'').slice(0,34),
      cls:el.className.toString().slice(0,50)};}));
console.log('--- visible unnamed controls ---'); console.log(JSON.stringify(un,null,1));

// boundary contrast: sample 4px outside vs inside each CTA
async function boundary(pred,label){
  const box=await p.evaluate(pr=>{const el=[...document.querySelectorAll('button')]
    .find(x=>new RegExp(pr).test((x.textContent||'').trim()));
    if(!el)return null; el.scrollIntoView({block:'center'}); return true;},pred);
  if(!box){console.log('  missing',label);return;}
  await p.waitForTimeout(600);
  const geo=await p.evaluate(pr=>{const el=[...document.querySelectorAll('button')]
    .find(x=>new RegExp(pr).test((x.textContent||'').trim()));
    const r=el.getBoundingClientRect();const cs=getComputedStyle(el);
    return {x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height),
      bw:cs.borderTopWidth,bc:cs.borderTopColor,bg:cs.backgroundColor};},pred);
  await p.screenshot({path:`/home/user/workspace/bd-${label}.png`,
    clip:{x:Math.max(0,geo.x-8),y:Math.max(0,geo.y-8),width:geo.w+16,height:geo.h+16}});
  console.log(`  ${label}: box ${geo.w}x${geo.h} border ${geo.bw} ${geo.bc} bg ${geo.bg}`);
}
await boundary('^Order Ahead','ghost');
await boundary('^See the Loaves','rust1');
await boundary('^Order for Pickup','rust2');
await b.close();})();
