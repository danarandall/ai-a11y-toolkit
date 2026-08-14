#!/usr/bin/env python3
"""Record what the design file decided beyond the three criteria it determines.

Usage:  python3 figma-audit-structure.py ../data/design-treatment-tree.json
        python3 figma-audit-structure.py ../data/design-control-tree.json
"""
import json, re, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
DEFAULT = os.path.join(HERE, "..", "data", "design-treatment-tree.json")
path = sys.argv[1] if len(sys.argv) > 1 else DEFAULT
res = json.load(open(path))
print(f"tree: {os.path.basename(path)}")
nodes = []


def walk(n, d, p):
    nodes.append((d, n, p))
    for c in n.get("children") or []:
        walk(c, d + 1, n)


walk(res["file"]["document"], 0, None)
byid = {n["id"]: n for _, n, _ in nodes}

print("=== nav subtree ===")
for d, n, p in nodes:
    if p and p["name"] == "nav-links" or n["name"] == "nav-links":
        bb = n.get("absoluteBoundingBox") or {}
        print(f"  {n['type']:<8} {n['name'][:34]:<36} {bb.get('width',0):.0f}x{bb.get('height',0):.0f}"
              f"  \"{(n.get('characters') or '')[:26]}\"")

print("\n=== layer names, whole page ===")
from collections import Counter
for nm, c in Counter(n["name"] for _, n, _ in nodes).most_common(50):
    print(f"  x{c:<3} {nm}")

print("\n=== annotation signals in text or names ===")
PAT = re.compile(r"alt|aria|h1|h2|h3|heading|focus|role|label|order|screen reader|"
                 r"describ|decorative|announce|live region|skip", re.I)
hits = set()
for d, n, p in nodes:
    for src, val in (("name", n["name"]), ("text", n.get("characters") or "")):
        if PAT.search(val):
            hits.add((src, n["type"], val[:90]))
for h in sorted(hits):
    print(f"  {h[0]:<5} {h[1]:<10} {h[2]}")

print("\n=== images / rectangles that would need alt text ===")
for d, n, p in nodes:
    if n["type"] == "RECTANGLE":
        bb = n.get("absoluteBoundingBox") or {}
        has_img = any(f.get("type") == "IMAGE" for f in n.get("fills") or [])
        print(f"  {n['name'][:30]:<32} {bb.get('width',0):.0f}x{bb.get('height',0):.0f}"
              f"  image_fill={has_img}  parent={p['name'][:24] if p else None}")

print("\n=== dash and typography check on page copy ===")
allt = "\n".join(n.get("characters") or "" for _, n, _ in nodes)
print(f"  em dashes {allt.count(chr(8212))}   en dashes {allt.count(chr(8211))}")
for _, n, _ in nodes:
    t = n.get("characters") or ""
    if chr(8212) in t or chr(8211) in t:
        print(f"    {n['name'][:24]:<26} \"{t[:60]}\"")

print("\n=== heading-size text in document order ===")
for d, n, p in nodes:
    if n["type"] == "TEXT":
        st = n.get("style") or {}
        s = st.get("fontSize", 0)
        if s >= 20:
            bb = n.get("absoluteBoundingBox") or {}
            print(f"  {s:>4.0f}px/{st.get('fontWeight',0)}  y={bb.get('y',0):>8.0f}  "
                  f"{(n.get('characters') or '')[:56]!r}")
