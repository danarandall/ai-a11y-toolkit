const { chromium } = require('playwright');
function lum(c){const f=v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4)};
 return 0.2126*f(c[0])+0.7152*f(c[1])+0.0722*f(c[2])}
function R(a,b){const x=lum(a),y=lum(b);return +((Math.max(x,y)+0.05)/(Math.min(x,y)+0.05)).toFixed(2)}
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:900}});
await p.goto('https://grace-number-99311548.figma.site',{waitUntil:'networkidle'});await p.waitForTimeout(3500);

// check 4: big non-heading text
const big=await p.evaluate(()=>[...document.querySelectorAll('body *')].filter(el=>{
  const c=getComputedStyle(el),r=el.getBoundingClientRect();
  return c.display!=='none'&&r.width>0&&parseFloat(c.fontSize)>=28&&
    [...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim());})
  .map(el=>({tag:el.tagName,size:parseFloat(getComputedStyle(el).fontSize),
    text:el.textContent.trim().replace(/\s+/g,' ').slice(0,42)})));
console.log('--- text >=28px ---'); big.forEach(x=>console.log(`  ${x.tag} ${x.size}px "${x.text}"`));

// check 10: any sticky/fixed overlay
const sticky=await p.evaluate(()=>[...document.querySelectorAll('body *')].filter(el=>{
  const c=getComputedStyle(el);return (c.position==='fixed'||c.position==='sticky')&&
    el.getBoundingClientRect().height>0;}).map(el=>({tag:el.tagName,pos:getComputedStyle(el).position,
    z:getComputedStyle(el).zIndex,h:Math.round(el.getBoundingClientRect().height),
    cls:el.className.toString().slice(0,40)})));
console.log('--- sticky/fixed ---',JSON.stringify(sticky));

// check 11: spacing exception for undersized targets
const t=await p.evaluate(()=>[...document.querySelectorAll('button,a[href],input,[role=button]')]
  .filter(el=>{const c=getComputedStyle(el),r=el.getBoundingClientRect();
    return c.display!=='none'&&c.visibility!=='hidden'&&r.width>1;})
  .map(el=>{const r=el.getBoundingClientRect();
    return {n:(el.getAttribute('aria-label')||el.textContent||el.type||'').trim().slice(0,24),
      x:r.x,y:r.y+window.scrollY,w:r.width,h:r.height};}));
console.log('--- 2.5.8 spacing ---');
for(const a of t.filter(x=>x.w<24||x.h<24)){
  let min=Infinity,who='';
  for(const o of t){if(o===a)continue;
    const d=Math.hypot((a.x+a.w/2)-(o.x+o.w/2),(a.y+a.h/2)-(o.y+o.h/2));
    if(d<min){min=d;who=o.n;}}
  console.log(`  ${a.w.toFixed(0)}x${a.h.toFixed(0)} "${a.n}" nearest ${min.toFixed(1)}px (${who}) exception ${min>=24?'MET':'NOT MET'}`);
}

// check 14: control boundaries painted
const items=[['Order Ahead',null],['See the Loaves',null],['Order for Pickup',null],['submit',null]];
for(const [name] of items){
  const box=await p.evaluate(nm=>{const el=[...document.querySelectorAll('button')]
    .find(x=>((x.getAttribute('aria-label')||x.textContent||x.type||'').trim()).startsWith(nm));
    if(!el)return null; el.scrollIntoView({block:'center'}); const r=el.getBoundingClientRect();
    const cs=getComputedStyle(el);
    return {box:[Math.max(0,r.x-6),Math.max(0,r.y-6),r.width+12,r.height+12].map(Math.round),
      bw:cs.borderTopWidth,bc:cs.borderTopColor,bg:cs.backgroundColor,color:cs.color,
      fs:cs.fontSize,fw:cs.fontWeight};},name);
  if(!box){console.log('  missing',name);continue;}
  await p.waitForTimeout(500);
  const box2=await p.evaluate(nm=>{const el=[...document.querySelectorAll('button')]
    .find(x=>((x.getAttribute('aria-label')||x.textContent||x.type||'').trim()).startsWith(nm));
    const r=el.getBoundingClientRect();
    return [Math.max(0,r.x-6),Math.max(0,r.y-6),r.width+12,r.height+12].map(Math.round);},name);
  await p.screenshot({path:`/home/user/workspace/ctl-btn-${name.replace(/\W+/g,'_')}.png`,
    clip:{x:box2[0],y:box2[1],width:box2[2],height:box2[3]}});
  console.log(`  ${name}: border ${box.bw} ${box.bc} | bg ${box.bg} | color ${box.color} ${box.fs}/${box.fw}`);
}
// what is the 26x26 submit button?
const sub=await p.evaluate(()=>{const el=[...document.querySelectorAll('button')]
  .find(x=>x.type==='submit'&&!(x.getAttribute('aria-label')||x.textContent.trim()));
  return el?{html:el.outerHTML.slice(0,300),parent:el.parentElement.outerHTML.slice(0,260)}:null;});
console.log('--- unnamed submit button ---'); console.log(JSON.stringify(sub,null,1));
await b.close();})();
