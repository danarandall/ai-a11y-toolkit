#!/usr/bin/env python3
"""Audit the three criteria a design file determines, plus what it decided beyond them.

Usage:  python3 figma-audit-contrast-targets.py ../data/design-treatment-tree.json
        python3 figma-audit-contrast-targets.py ../data/design-control-tree.json

Input is the JSON from the Figma REST API wrapped as {"file": {"document": <node>}}.
See fetch-design-tree.sh for how each tree in ../data was produced.
"""
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
DEFAULT = os.path.join(HERE, "..", "data", "design-treatment-tree.json")
path = sys.argv[1] if len(sys.argv) > 1 else DEFAULT

res = json.load(open(path))
doc = res["file"]["document"]
print(f"tree: {os.path.basename(path)}")
nodes = []


def walk(n, depth, parent):
    nodes.append((depth, n, parent))
    for c in n.get("children") or []:
        walk(c, depth + 1, n)


walk(doc, 0, None)


def lum(rgb):
    def ch(v):
        return v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
    r, g, b = (ch(x) for x in rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def ratio(a, b):
    hi, lo = max(lum(a), lum(b)), min(lum(a), lum(b))
    return (hi + 0.05) / (lo + 0.05)


def solid(n):
    """First visible opaque solid fill as an (r,g,b) 0-1 tuple, else None."""
    for f in n.get("fills") or []:
        if f.get("type") == "SOLID" and f.get("visible", True) and f.get("opacity", 1) >= 0.95:
            c = f["color"]
            if c.get("a", 1) >= 0.95:
                return (c["r"], c["g"], c["b"])
    return None


def hexs(c):
    return "#%02x%02x%02x" % tuple(round(x * 255) for x in c)


# Nearest ancestor background behind a node.
bg_of = {}
for d, n, p in nodes:
    c = solid(n)
    bg_of[n["id"]] = c if c and n["type"] in ("FRAME", "RECTANGLE") else None

parent = {n["id"]: (p["id"] if p else None) for _, n, p in nodes}
byid = {n["id"]: n for _, n, _ in nodes}


def behind(nid):
    q = parent.get(nid)
    while q:
        if bg_of.get(q):
            return bg_of[q]
        q = parent.get(q)
    return (0.9803921580314636, 0.9647058844566345, 0.9333333373069763)


# ---------------------------------------------------------------- 1.4.3 text contrast
print("=" * 78)
print("1.4.3 TEXT CONTRAST")
print("=" * 78)
seen = {}
fails = []
for d, n, p in nodes:
    if n["type"] != "TEXT":
        continue
    fg = solid(n)
    if not fg:
        continue
    st = n.get("style") or {}
    size = st.get("fontSize", 0)
    weight = st.get("fontWeight", 400)
    large = size >= 24 or (size >= 18.66 and weight >= 700)
    need = 3.0 if large else 4.5
    bg = behind(n["id"])
    r = ratio(fg, bg)
    key = (hexs(fg), hexs(bg), round(size), weight)
    rec = (r, need, n["name"], (n.get("characters") or "")[:44])
    seen.setdefault(key, []).append(rec)
    if r < need:
        fails.append((key, rec))

print(f"{len(seen)} distinct text pairings across "
      f"{sum(len(v) for v in seen.values())} text layers\n")
for key, recs in sorted(seen.items(), key=lambda kv: kv[1][0][0]):
    fg, bg, size, weight = key
    r, need, _, sample = recs[0][0], recs[0][1], None, recs[0][3]
    mark = "PASS" if r >= need else "FAIL"
    print(f"  {mark}  {r:6.2f}:1  need {need}  {fg} on {bg}  "
          f"{size}px/{weight}  x{len(recs)}  \"{sample}\"")
print(f"\n  text failures: {len(fails)}")

# ---------------------------------------------------------------- 1.4.11 non-text
print("\n" + "=" * 78)
print("1.4.11 NON-TEXT CONTRAST  (strokes and shape fills)")
print("=" * 78)
# A stroke is only a component boundary if it is drawn on more than one side.
# individualStrokeWeights like {top: 1, right: 0, bottom: 0, left: 0} is a rule
# above or below content, not a box around a control, and 1.4.11 does not apply
# to it. Reading strokeWeight alone invents boundary failures: it scored four
# text links in the control as faint-bordered buttons. Always check the sides.
def stroke_sides(n):
    isw = n.get("individualStrokeWeights")
    if not isw:
        return 4 if n.get("strokeWeight", 0) else 0
    return sum(1 for k in ("top", "right", "bottom", "left") if isw.get(k, 0) > 0)


nt = {}
rules = []
for d, n, p in nodes:
    bg = behind(n["id"])
    for s in n.get("strokes") or []:
        if s.get("type") == "SOLID" and s.get("visible", True):
            c = s["color"]
            if c.get("a", 1) < 0.95:
                continue
            col = (c["r"], c["g"], c["b"])
            w = n.get("strokeWeight", 1)
            if stroke_sides(n) < 2:
                rules.append((ratio(col, bg), hexs(col), hexs(bg), n["name"]))
                continue
            nt.setdefault(("stroke", hexs(col), hexs(bg), w), []).append(n["name"])
    if n["type"] in ("RECTANGLE", "LINE", "VECTOR"):
        f = solid(n)
        if f:
            nt.setdefault(("fill", hexs(f), hexs(bg), None), []).append(n["name"])


def unhex(h):
    return tuple(int(h[i:i + 2], 16) / 255 for i in (1, 3, 5))


for key, names in sorted(nt.items(), key=lambda kv: ratio(unhex(kv[0][1]), unhex(kv[0][2]))):
    kind, fg, bg, w = key
    r = ratio(unhex(fg), unhex(bg))
    print(f"  {'PASS' if r >= 3 else 'CHECK'}  {r:5.2f}:1  {kind:<6} {fg} on {bg}"
          f"{'  w'+str(w) if w else ''}  x{len(names)}  {names[0][:38]}")

if rules:
    print(f"\n  {len(rules)} single-sided strokes excluded as rules, not boundaries:")
    for r, fg, bg, nm in sorted(rules)[:10]:
        print(f"    n/a   {r:5.2f}:1  {fg} on {bg}  {nm[:38]}")

# ---------------------------------------------------------------- 2.5.8 target size
print("\n" + "=" * 78)
print("2.5.8 TARGET SIZE  (house standard 44x44, WCAG AA floor 24x24)")
print("=" * 78)
HINT = ("button", "btn", "cta", "link", "nav", "input", "field", "chip", "tab",
        "close", "menu", "toggle", "icon-button", "submit", "arrow", "social")
targets = []
for d, n, p in nodes:
    nm = n["name"].lower()
    if not any(h in nm for h in HINT):
        continue
    bb = n.get("absoluteBoundingBox") or {}
    w, h = bb.get("width", 0), bb.get("height", 0)
    if w and h:
        targets.append((w, h, n["name"], n["type"]))
seen_t = set()
for w, h, nm, t in sorted(targets, key=lambda x: min(x[0], x[1])):
    if (round(w), round(h), nm) in seen_t:
        continue
    seen_t.add((round(w), round(h), nm))
    if h >= 44 and w >= 44:
        mark = "PASS 44"
    elif h >= 24 and w >= 24:
        mark = "AA only"
    else:
        mark = "FAIL"
    print(f"  {mark:<8} {w:6.0f} x {h:5.0f}   {t:<10} {nm[:46]}")
print(f"\n  {len(seen_t)} distinct interactive-looking layers")
