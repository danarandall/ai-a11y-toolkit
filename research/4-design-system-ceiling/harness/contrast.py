import json
from pathlib import Path
STUDY = Path(__file__).resolve().parent.parent

cols = json.load(open(STUDY / "data" / "prime-colors.json"))
C = {c["name"]: c["hex"] for c in cols if c["hex"]}

def lin(v):
    v = v / 255.0
    return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4

def lum(h):
    r, g, b = int(h[1:3], 16), int(h[3:5], 16), int(h[5:7], 16)
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)

def ratio(a, b):
    la, lb = lum(a), lum(b)
    hi, lo = max(la, lb), min(la, lb)
    return round((hi + 0.05) / (lo + 0.05), 2)

WHITE = "#FFFFFF"

# The base/500 step is what a designer reaches for by default.
bases = [n for n in C if "500" in n]
print("=== Base 500 tokens as TEXT on white (needs 4.5:1 normal, 3:1 large) ===")
for n in sorted(bases):
    r = ratio(C[n], WHITE)
    print(f"  {n:<34} {C[n]}  {r:>6}:1  {'PASS' if r>=4.5 else ('large-only' if r>=3 else 'FAIL')}")

print("\n=== Base 500 as a SOLID FILL with white text on it (button pattern) ===")
for n in sorted(bases):
    r = ratio(C[n], WHITE)
    print(f"  white on {n:<26} {r:>6}:1  {'PASS' if r>=4.5 else ('large-only' if r>=3 else 'FAIL')}")

print("\n=== Base 500 as a NON-TEXT boundary on white (needs 3:1, SC 1.4.11) ===")
for n in sorted(bases):
    r = ratio(C[n], WHITE)
    print(f"  {n:<34} {r:>6}:1  {'PASS' if r>=3 else 'FAIL'}")

print("\n=== Neutral ramp as body text on white ===")
for n in sorted(n for n in C if n.startswith("00 Neutral")):
    r = ratio(C[n], WHITE)
    print(f"  {n:<34} {C[n]}  {r:>6}:1  {'PASS' if r>=4.5 else ('large-only' if r>=3 else 'FAIL')}")

# darkest useful pairing per family
print("\n=== Lightest step in each family that passes 4.5:1 as text on white ===")
fams = {}
for n in C:
    fam = n.split("/")[0]
    fams.setdefault(fam, []).append(n)
for fam in sorted(fams):
    ok = [(n, ratio(C[n], WHITE)) for n in fams[fam] if ratio(C[n], WHITE) >= 4.5]
    if not ok:
        print(f"  {fam:<24} none of its steps reach 4.5:1 on white")
    else:
        best = min(ok, key=lambda t: t[1])
        print(f"  {fam:<24} {best[0]:<34} {best[1]}:1")

json.dump({"white_ratio": {n: ratio(C[n], WHITE) for n in C}},
          open(STUDY / "data" / "contrast-white.json", "w"), indent=1)
