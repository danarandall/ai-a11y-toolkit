import json, collections, os

def hexof(c):
    return "#%02X%02X%02X" % (round(c["r"]*255), round(c["g"]*255), round(c["b"]*255))

def load(p):
    return json.load(open(p))["file"]

# ---------- typography ----------
f = load("raw6/typography.json")
smap = f.get("styles") or {}
tstyles = {}
def wt(n):
    st = n.get("styles") or {}
    sid = st.get("text")
    if sid and sid in smap and n.get("type") == "TEXT":
        s = n.get("style") or {}
        tstyles.setdefault(smap[sid]["name"], {
            "family": s.get("fontFamily"), "size": s.get("fontSize"),
            "weight": s.get("fontWeight"),
            "lineHeight": round(s.get("lineHeightPx"), 1) if s.get("lineHeightPx") else None,
            "letterSpacing": round(s.get("letterSpacing"), 2) if s.get("letterSpacing") is not None else None,
        })
    for c in n.get("children") or []: wt(c)
wt(f["document"])

print("=== TYPOGRAPHY: published text styles ===")
fams = collections.Counter(v["family"] for v in tstyles.values())
print("font families in use:", dict(fams))
for k in sorted(tstyles, key=lambda x: (-(tstyles[x]["size"] or 0), x))[:40]:
    v = tstyles[k]
    print(f"  {k:<34} {v['family']} {v['size']}/{v['lineHeight']} w{v['weight']} ls{v['letterSpacing']}")
json.dump(tstyles, open("type-6.0.json", "w"), indent=1)

# ---------- component geometry ----------
def geom(path):
    f = load(path)
    rows = []
    def w(n, cset=None):
        t = n.get("type")
        if t == "COMPONENT_SET": cset = n.get("name")
        if t in ("COMPONENT",):
            bb = n.get("absoluteBoundingBox") or {}
            fills = [x for x in (n.get("fills") or []) if x.get("type") == "SOLID" and x.get("visible", True)]
            strokes = [x for x in (n.get("strokes") or []) if x.get("type") == "SOLID" and x.get("visible", True)]
            rows.append({
                "set": cset, "name": n.get("name"),
                "w": round(bb.get("width")) if bb.get("width") else None,
                "h": round(bb.get("height")) if bb.get("height") else None,
                "r": n.get("cornerRadius"),
                "pl": n.get("paddingLeft"), "pr": n.get("paddingRight"),
                "pt": n.get("paddingTop"), "pb": n.get("paddingBottom"),
                "gap": n.get("itemSpacing"),
                "fill": hexof(fills[0]["color"]) if fills else None,
                "stroke": hexof(strokes[0]["color"]) if strokes else None,
                "sw": n.get("strokeWeight"),
            })
        for c in n.get("children") or []: w(c, cset)
    w(f["document"])
    return rows

TOK = {v: k for k, v in json.load(open("colors-6.0.json")).items()}
def nm(h): return TOK.get(h, h) if h else None

print("\n=== COMPONENT GEOMETRY (6.0) ===")
spec = {}
for page in ["inputs", "tables", "tabs", "toggles", "badges", "alerts",
             "modals", "tooltips", "pagination", "sliders"]:
    rows = geom(f"raw6/{page}.json")
    spec[page] = rows
    hs = collections.Counter(r["h"] for r in rows if r["h"])
    rs = collections.Counter(r["r"] for r in rows if r["r"] is not None)
    small = [r for r in rows if r["h"] and r["h"] < 24]
    print(f"\n{page}: {len(rows)} components")
    print(f"  heights: {[h for h,_ in hs.most_common(7)]}")
    print(f"  radii:   {[x for x,_ in rs.most_common(5)]}")
    print(f"  under 24px tall: {len(small)}" + (f"  {[(r['name'][:34], r['w'], r['h']) for r in small[:4]]}" if small else ""))
    ex = [r for r in rows if r["h"] and r["pl"] is not None][:2]
    for r in ex:
        print(f"  eg {r['name'][:40]:<42} {r['w']}x{r['h']} r{r['r']} pad {r['pt']}/{r['pr']}/{r['pb']}/{r['pl']} gap {r['gap']} fill {nm(r['fill'])} stroke {nm(r['stroke'])} {r['sw']}")

json.dump(spec, open("geom-6.0.json", "w"), indent=1)
print("\nsaved type-6.0.json and geom-6.0.json")
