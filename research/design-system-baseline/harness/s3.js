const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();
for(const arm of ['control','treatment']){
const p=await b.newPage({viewport:{width:1280,height:900}});
await p.goto('file://'+path.resolve(__dirname,arm,'index.html'));await p.waitForTimeout(800);
const get=async()=>await p.evaluate(()=>[...document.querySelectorAll('th button')].map(e=>
 (e.getAttribute('aria-label')||e.innerText||'').replace(/\s+/g,' ').trim().slice(0,60)));
console.log(`\n${arm} before:`,JSON.stringify(await get()));
await p.locator('th button').first().click({timeout:3000}).catch(()=>{});await p.waitForTimeout(400);
console.log(`${arm} after :`,JSON.stringify(await get()));
await p.close();}
await b.close();process.exit(0);})();
