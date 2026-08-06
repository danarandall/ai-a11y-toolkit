import json, collections

def lin(v):
    v/=255.0
    return v/12.92 if v<=0.04045 else ((v+0.055)/1.055)**2.4
def lum(h):
    return 0.2126*lin(int(h[1:3],16))+0.7152*lin(int(h[3:5],16))+0.0722*lin(int(h[5:7],16))
def cr(a,b):
    la,lb=lum(a),lum(b); hi,lo=max(la,lb),min(la,lb)
    return round((hi+0.05)/(lo+0.05),2)
def hexof(c):
    return "#%02X%02X%02X"%(round(c["r"]*255),round(c["g"]*255),round(c["b"]*255))

TOK={v:k for k,v in json.load(open("colors-6.0.json")).items()}
def name(h): return TOK.get(h, h)

f=json.load(open("raw/buttons-6.0.json"))["file"]
rows=[]
def solid(n):
    x=[y for y in (n.get("fills") or []) if y.get("type")=="SOLID" and y.get("visible",True)
       and y.get("opacity",1)>0.99]
    return hexof(x[0]["color"]) if x else None

def walk(n, bg=None, comp=None, cset=None):
    t=n.get("type")
    if t=="COMPONENT_SET": cset=n.get("name")
    if t=="COMPONENT": comp=n.get("name")
    c=solid(n)
    if c and t in ("COMPONENT","INSTANCE","FRAME","RECTANGLE"): bg=c
    if t=="TEXT" and c:
        s=n.get("style") or {}
        rows.append((cset,comp,n.get("characters","")[:14],s.get("fontSize"),s.get("fontWeight"),c,bg))
    for ch in n.get("children") or []: walk(ch,bg,comp,cset)
walk(f["document"])
print("text runs:",len(rows))

agg=collections.OrderedDict()
for cset,comp,txt,size,wt,fg,bg in rows:
    if not bg or fg==bg: continue
    agg.setdefault((cset,comp,size,wt,fg,bg), 0)
    agg[(cset,comp,size,wt,fg,bg)]+=1

# focus on primary-ish default states
print(f"\n{'set':<26}{'variant':<34}{'px':>5}{'wt':>4}{'ratio':>8} verdict")
print("-"*100)
fails=0; tot=0
shown=0
for (cset,comp,size,wt,fg,bg),n in agg.items():
    v=(comp or "").lower()
    if "disabled" not in v and ("default" in v or "hover" in v or "focus" in v or "press" in v):
        r=cr(fg,bg)
        large=(size or 0)>=24 or ((size or 0)>=18.66 and (wt or 400)>=700)
        need=3.0 if large else 4.5
        tot+=1
        if r<need: fails+=1
        if shown<34:
            print(f"{str(cset)[:25]:<26}{str(comp)[:33]:<34}{size or '?':>5}{wt or '?':>4}{r:>7}:1 {'pass' if r>=need else 'FAIL'}"
                  f"  {name(fg)} on {name(bg)}")
            shown+=1
print(f"\nnon-disabled label pairings: {tot}, failing: {fails}")
