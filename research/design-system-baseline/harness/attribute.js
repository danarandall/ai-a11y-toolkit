const { chromium } = require('playwright');
const path = require('path'); const fs = require('fs');
const PRIME = JSON.parse(fs.readFileSync('/home/user/workspace/prime-study/colors-6.0.json'));
const TOK = {}; for (const [k, v] of Object.entries(PRIME)) TOK[v.toUpperCase()] = k;

(async () => {
  const browser = await chromium.launch();
  for (const arm of ['control', 'treatment']) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto('file://' + path.resolve(__dirname, arm, 'index.html'));
    await page.waitForTimeout(1200);
    const bad = await page.evaluate(() => {
      function lin(v){v/=255;return v<=0.04045?v/12.92:Math.pow((v+0.055)/1.055,2.4);}
      function L(c){return 0.2126*lin(c[0])+0.7152*lin(c[1])+0.0722*lin(c[2]);}
      function rgb(s){const m=s.match(/[\d.]+/g);return m?m.slice(0,3).map(Number):null;}
      function hex(c){return '#'+c.map(x=>Math.round(x).toString(16).padStart(2,'0').toUpperCase()).join('');}
      function bgOf(el){let e=el;while(e){const b=rgb(getComputedStyle(e).backgroundColor);
        const a=parseFloat(getComputedStyle(e).backgroundColor.match(/[\d.]+/g)?.[3]??'1');
        if(b&&a>0.9)return b;e=e.parentElement;}return [255,255,255];}
      const out=[];
      for(const el of document.querySelectorAll('*')){
        const t=[...el.childNodes].filter(n=>n.nodeType===3&&n.textContent.trim()).map(n=>n.textContent.trim()).join(' ');
        if(!t)continue;
        const cs=getComputedStyle(el);
        if(cs.visibility==='hidden'||cs.display==='none'||parseFloat(cs.opacity)<0.1)continue;
        const r=el.getBoundingClientRect(); if(r.width<1||r.height<1)continue;
        const fg=rgb(cs.color); if(!fg)continue; const bg=bgOf(el);
        const l1=L(fg),l2=L(bg); const cr=(Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05);
        const size=parseFloat(cs.fontSize); const wt=parseInt(cs.fontWeight)||400;
        const large=size>=24||(size>=18.66&&wt>=700);
        const need=large?3:4.5;
        if(cr<need-0.005) out.push({txt:t.slice(0,28),fg:hex(fg),bg:hex(bg),cr:Math.round(cr*100)/100,size,wt,need,
          dis:el.closest('[disabled],[aria-disabled="true"],:disabled')?1:0});
      }
      return out;
    });
    console.log(`\n===== ${arm.toUpperCase()}: ${bad.length} text nodes below threshold (default state) =====`);
    const seen=new Set(); let inherited=0, introduced=0;
    for (const b of bad) {
      const k=b.fg+b.bg+b.size; if(seen.has(k))continue; seen.add(k);
      const fgT=TOK[b.fg]||null, bgT=TOK[b.bg]||null;
      const prime = !!(fgT&&bgT);
      if(b.dis) continue;
      if(prime) inherited++; else introduced++;
      console.log(`  ${String(b.cr).padStart(5)}:1 need ${b.need}  ${String(b.size)+'px/'+b.wt}  "${b.txt}"`);
      console.log(`        fg ${b.fg} ${fgT?'= '+fgT:'NOT a Prime token'} | bg ${b.bg} ${bgT?'= '+bgT:'NOT a Prime token'}  -> ${prime?'INHERITED from Prime':'INTRODUCED by builder'}`);
    }
    console.log(`  unique pairings: inherited ${inherited}, introduced ${introduced}`);
    await page.close();
  }
  await browser.close(); process.exit(0);
})();
