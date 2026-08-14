const { chromium } = require('playwright');
(async()=>{
for (const [label,URL] of [['control','https://grace-number-99311548.figma.site'],['treatment','https://tutu-invert-07297733.figma.site']]){
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:900}});
await p.goto(URL,{waitUntil:'networkidle'});await p.waitForTimeout(3500);
await p.evaluate(()=>{window.scrollTo(0,0);});
await p.mouse.click(2,2);
const seen=new Set();const out=[];
for(let i=0;i<45;i++){
  await p.keyboard.press('Tab'); await p.waitForTimeout(110);
  const r=await p.evaluate(()=>{const el=document.activeElement;
    if(!el||el===document.body||el===document.documentElement)return {end:true};
    const c=getComputedStyle(el),bx=el.getBoundingClientRect();
    if(!el.dataset.__k)el.dataset.__k=Math.random().toString(36).slice(2,8);
    return {k:el.dataset.__k,tag:el.tagName,
      name:(el.getAttribute('aria-label')||el.textContent||el.type||'').trim().replace(/\s+/g,' ').slice(0,26),
      fv:el.matches(':focus-visible'),outline:c.outlineStyle+' '+c.outlineWidth,
      off:c.outlineOffset,shadow:c.boxShadow.slice(0,26),
      w:Math.round(bx.width),h:Math.round(bx.height)};});
  if(r.end||seen.has(r.k))break;
  seen.add(r.k);out.push(r);
}
console.log(`\n===== ${label}: ${out.length} tab stops =====`);
for(const w of out)console.log(`  ${w.tag.padEnd(7)} ${String(w.w).padStart(4)}x${String(w.h).padStart(3)} fv=${w.fv?'Y':'n'} outline="${w.outline}" off=${w.off} shadow="${w.shadow}" "${w.name}"`);
await b.close();}
})();
