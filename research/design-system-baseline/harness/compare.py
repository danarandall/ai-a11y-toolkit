import json, collections, statistics

def lin(v):
    v/=255.0
    return v/12.92 if v<=0.04045 else ((v+0.055)/1.055)**2.4
def lum(h):
    return 0.2126*lin(int(h[1:3],16))+0.7152*lin(int(h[3:5],16))+0.0722*lin(int(h[5:7],16))
def cr(a,b):
    la,lb=lum(a),lum(b); hi,lo=max(la,lb),min(la,lb)
    return round((hi+0.05)/(lo+0.05),2)
W="#FFFFFF"

V=["5.0","5.1","5.2","6.0"]
data={v:json.load(open(f"colors-{v}.json")) for v in V}
data["4.0"]={c["name"]:c["hex"] for c in json.load(open("prime-colors.json")) if c["hex"]}

print("=== Are the 5.x and 6.0 palettes identical? ===")
base=data["5.0"]
for v in V[1:]:
    d=data[v]
    diff={k for k in set(base)|set(d) if base.get(k)!=d.get(k)}
    print(f"  5.0 vs {v}: {len(diff)} differing tokens" + (f"  e.g. {sorted(diff)[:4]}" if diff else ""))

print("\n=== Does 'Blue Spark' (read from Thalion's 5.0 Preview) appear here? ===")
for v in V:
    fams={k.split("/")[0] for k in data[v]}
    print(f"  {v}: Blue Spark present = {'Blue Spark' in fams}   families = {len(fams)}")
print("  5.0 families:", sorted({k.split('/')[0] for k in data['5.0']}))

print("\n=== '500' step as text on white, per version ===")
for v in ["4.0"]+V:
    d=data[v]
    keys=[k for k in d if k.split("/")[-1].startswith("500")]
    rs=[cr(d[k],W) for k in keys]
    if not rs: print(f"  {v}: no 500 steps"); continue
    p45=sum(1 for r in rs if r>=4.5); p3=sum(1 for r in rs if r>=3)
    print(f"  {v}: n={len(rs):>2}  range {min(rs)}:1 to {max(rs)}:1  spread {round(max(rs)-min(rs),2)}"
          f"   >=3:1 {p3}/{len(rs)}   >=4.5:1 {p45}/{len(rs)}")

print("\n=== 6.0 per family: 500 step, and lightest step reaching 4.5:1 ===")
d=data["6.0"]
fams=collections.defaultdict(dict)
for k,h in d.items():
    fam,_,step=k.rpartition("/")
    fams[fam][step]=h
def stepnum(s):
    try: return int("".join(ch for ch in s if ch.isdigit()) or 0)
    except: return 0
rows=[]
for fam in sorted(fams):
    steps=sorted(fams[fam], key=stepnum)
    five=next((s for s in steps if s.startswith("500")), None)
    if not five: continue
    r5=cr(fams[fam][five],W)
    ok=[(s,cr(fams[fam][s],W)) for s in steps if cr(fams[fam][s],W)>=4.5]
    first=ok[0] if ok else None
    rows.append((fam,fams[fam][five],r5,first))
    print(f"  {fam:<22}500={fams[fam][five]}  {r5:>5}:1  "
          f"{'first >=4.5 at '+first[0]+' ('+str(first[1])+':1)' if first else 'no step reaches 4.5:1'}")
rs=[r[2] for r in rows]
print(f"\n  6.0 summary: {len(rows)} families, 500 step range {min(rs)}:1 to {max(rs)}:1, "
      f"spread {round(max(rs)-min(rs),2)}, median {round(statistics.median(rs),2)}")
print(f"  families whose 500 step passes 4.5:1 as normal text: {sum(1 for r in rs if r>=4.5)}/{len(rs)}")
print(f"  families whose 500 step passes 3:1 for non-text:     {sum(1 for r in rs if r>=3)}/{len(rs)}")
