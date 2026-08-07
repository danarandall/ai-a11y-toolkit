const { chromium } = require('playwright'); const path=require('path');
(async()=>{const b=await chromium.launch();
for(const arm of ['control','treatment']){
  const p=await b.newPage({viewport:{width:1280,height:900}});
  await p.goto('file://'+path.resolve(__dirname,arm,'index.html')); await p.waitForTimeout(1000);
  const first=()=>p.evaluate(()=>document.querySelector('tbody tr')?.innerText.replace(/\s+/g,' ').slice(0,40));
  const st=()=>p.evaluate(()=>{const t=[...document.querySelectorAll('th')].find(x=>/order/i.test(x.textContent));
    const btn=t?.querySelector('button');
    return {ariaSort:t?.getAttribute('aria-sort'),btnLabel:btn?.getAttribute('aria-label'),
      btnPressed:btn?.getAttribute('aria-pressed'),live:[...document.querySelectorAll('[aria-live],[role=status]')].map(x=>x.textContent.trim().slice(0,50)).filter(Boolean)};});
  const before=await first();
  const btn=p.locator('th button').first();
  await btn.click({timeout:4000}).catch(e=>console.log(' click1 fail'));
  await p.waitForTimeout(400); const a1=await first(), s1=await st();
  await btn.click({timeout:4000}).catch(()=>{}); await p.waitForTimeout(400);
  const a2=await first(), s2=await st();
  console.log(`\n== ${arm.toUpperCase()}`);
  console.log(' row1 before :',before);
  console.log(' row1 click1 :',a1,' changed:',a1!==before);
  console.log(' state click1:',JSON.stringify(s1));
  console.log(' row1 click2 :',a2,' changed:',a2!==a1);
  console.log(' state click2:',JSON.stringify(s2));
  await p.close();}
await b.close();process.exit(0);})();
