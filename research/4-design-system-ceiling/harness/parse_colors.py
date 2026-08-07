import json, collections
from pathlib import Path
STUDY = Path(__file__).resolve().parent.parent

d = json.load(open(STUDY / "data" / "raw" / "colors.json"))
file = d["file"] if "file" in d else d
nodes = file.get("nodes") or {}
# get_file with ids returns {"file": {... "nodes": {id: {"document":...}}}}
print("top keys:", list(d.keys()))
print("file keys:", list(file.keys())[:15])

styles_map = file.get("styles") or {}
print("style entries:", len(styles_map))

root = None
if nodes:
    k = list(nodes)[0]
    root = nodes[k]["document"] if "document" in nodes[k] else nodes[k]
elif "document" in file:
    root = file["document"]
print("root:", root.get("name") if root else None, root.get("type") if root else None)

def hexof(c):
    return "#%02X%02X%02X" % (round(c["r"]*255), round(c["g"]*255), round(c["b"]*255))

# style id -> observed fill color
style_fill = {}
counts = collections.Counter()

def walk(n, depth=0):
    counts[n.get("type")] += 1
    st = n.get("styles") or {}
    fills = n.get("fills") or []
    solid = [f for f in fills if f.get("type") == "SOLID" and f.get("visible", True)]
    if "fill" in st and solid:
        style_fill.setdefault(st["fill"], (hexof(solid[0]["color"]), round(solid[0].get("opacity", 1), 3)))
    if "fills" in st and solid:
        style_fill.setdefault(st["fills"], (hexof(solid[0]["color"]), round(solid[0].get("opacity", 1), 3)))
    for c in n.get("children") or []:
        walk(c, depth+1)

if root:
    walk(root)

print("node types:", dict(counts.most_common(8)))
print("styles resolved to a color:", len(style_fill))

rows = []
for sid, meta in styles_map.items():
    if meta.get("styleType") != "FILL":
        continue
    hexv, op = style_fill.get(sid, (None, None))
    rows.append((meta.get("name"), hexv, op))

rows.sort(key=lambda r: (r[0] or ""))
print(f"\nFILL styles: {len(rows)}  resolved: {sum(1 for r in rows if r[1])}\n")
for n, h, o in rows:
    print(f"  {n:<44} {h or '(unresolved)':<9} {'' if o in (1,None) else 'opacity '+str(o)}")

json.dump([{"name": n, "hex": h, "opacity": o} for n, h, o in rows],
          open(STUDY / "data" / "prime-colors.json", "w"), indent=1)
