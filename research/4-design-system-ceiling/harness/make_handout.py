import json, collections

C = json.load(open("colors-6.0.json"))
T = json.load(open("type-6.0.json"))
G = json.load(open("geom-6.0.json"))

FAMS = ["Blue Spark", "Obsidian", "Grey", "Green Bell Pepper",
        "Golden Stone", "Electric Crimson", "Blue Sari"]
STEPS = ["100","200","300","400","500","600","700","800","900","1000"]

out = []
w = out.append

w("# Design system specification")
w("")
w("Prime 6.0. All values measured directly from the source file. Use these")
w("values. Where something is not specified here, make a choice consistent with")
w("what is.")
w("")
w("## Type")
w("")
w("Font family: Inter, across every published text style. Fall back to")
w("`system-ui, sans-serif` if Inter is unavailable.")
w("")
w("| Style | Size | Line height | Weight | Letter spacing |")
w("| --- | --- | --- | --- | --- |")
order = ["Display Large","Display Small","Heading 1","Heading 2","Heading 3",
         "Heading 4","Heading 5","Body Large","Body Medium","Body Small",
         "Action Large","Action Medium","Action Small","Caption","Overline"]
seen = set()
for base in order:
    for variant in ["Regular","Semibold","Bold"]:
        k = f"{base}/{variant}"
        if k in T and k not in seen:
            v = T[k]; seen.add(k)
            ls = v["letterSpacing"]
            w(f"| {k} | {v['size']:g}px | {v['lineHeight']:g}px | {v['weight']} | {ls:g}px |")

w("")
w("## Color")
w("")
w("Ramps run 100 (lightest) to 1000 (darkest).")
w("")
for fam in FAMS:
    vals = [(s, C.get(f"{fam}/{s}")) for s in STEPS]
    if not any(v for _, v in vals):
        continue
    w(f"**{fam}**")
    w("")
    w("| " + " | ".join(STEPS) + " |")
    w("| " + " | ".join(["---"] * len(STEPS)) + " |")
    w("| " + " | ".join(f"`{v}`" if v else "" for _, v in vals) + " |")
    w("")
w(f"White `{C.get('White/100','#FFFFFF')}`, Black `{C.get('Black/100','#000000')}`.")
w("")
w("Role mapping used by the kit's own components:")
w("")
w("- Brand and primary actions: Blue Spark")
w("- Neutral surfaces, borders and text: Obsidian, with Grey and Blue Sari as alternates")
w("- Success: Green Bell Pepper")
w("- Warning: Golden Stone")
w("- Danger and destructive: Electric Crimson")
w("")

w("## Buttons")
w("")
w("Four sizes. Label uses the Action style at the matching size, weight 600.")
w("")
w("| Size | Height | Corner radius | Horizontal padding | Label size |")
w("| --- | --- | --- | --- | --- |")
w("| XSmall | 32px | 12px | 12px | 12px |")
w("| Small | 40px | 12px | 12px | 12px |")
w("| Medium | 48px | 12px | 12px | 16px |")
w("| Large | 56px | 12px | 16px | 18px |")
w("")
w("State fills, measured from the Buttons page:")
w("")
w("| Variant | Default | Hover | Pressed | Focus |")
w("| --- | --- | --- | --- | --- |")
w(f"| Primary | Blue Spark/600 `{C['Blue Spark/600']}` | Blue Spark/500 `{C['Blue Spark/500']}` | Blue Spark/800 `{C['Blue Spark/800']}` | Blue Spark/500 `{C['Blue Spark/500']}` |")
w(f"| Secondary | Obsidian/100 `{C['Obsidian/100']}` | Obsidian/200 `{C['Obsidian/200']}` | Obsidian/300 `{C['Obsidian/300']}` | Blue Spark/100 `{C['Blue Spark/100']}` |")
w(f"| Danger | Electric Crimson/600 `{C['Electric Crimson/600']}` | Electric Crimson/500 `{C['Electric Crimson/500']}` | Electric Crimson/800 `{C['Electric Crimson/800']}` | Electric Crimson/500 `{C['Electric Crimson/500']}` |")
w("")
w(f"Primary and Danger labels are White/100 `{C.get('White/100','#FFFFFF')}`.")
w(f"Secondary labels are Obsidian/1000 `{C['Obsidian/1000']}`.")
w("")

def block(title, page, notes):
    rows = G.get(page) or []
    hs = [h for h in collections.Counter(r["h"] for r in rows if r["h"]).most_common(6)]
    rr = [x for x, _ in collections.Counter(r["r"] for r in rows if r["r"] is not None).most_common(4)]
    w(f"## {title}")
    w("")
    w(f"Heights present in the kit: {', '.join(str(h)+'px' for h,_ in hs)}.")
    if rr:
        w(f"Corner radii: {', '.join(str(int(x))+'px' for x in rr)}.")
    for n in notes:
        w(n)
    w("")

block("Inputs and dropdowns", "inputs", [
    "Default field height is 48px. Padding 12px on all sides. 1px border.",
    f"Resting border Obsidian/300 `{C['Obsidian/300']}`, field fill White/100.",
    "The kit provides a label above the field, an optional hint below it, and an",
    "error presentation that swaps the border and hint color to Electric Crimson.",
])
block("Tables", "tables", [
    "Row height 48px at the default size, header row 40px.",
    f"Row divider 1px Obsidian/200 `{C['Obsidian/200']}`.",
    "Cell padding 12px horizontal.",
])
block("Tabs", "tabs", [
    "Tab heights 40px, 48px and 56px depending on size. A small variant is 23px.",
    f"The selected tab is marked with a 2px Blue Spark/600 `{C['Blue Spark/600']}` underline.",
])
block("Badges", "badges", [
    "Pill shaped, radius 1000px. Heights 20px, 23px, 29px and 32px by size.",
    "Padding 4px vertical, 12px horizontal.",
    "Type maps to the color roles above, so Success uses Green Bell Pepper,",
    "Danger uses Electric Crimson, and so on. The default badge is a tinted",
    "background at step 100 or 200 with label text from the same family.",
])
block("Alerts", "alerts", [
    "Height 80px at the default size, radius 16px, padding 16px vertical and",
    "32px left. Background is the role family at step 100.",
    f"Info alerts use Black/100 `{C['Black/100']}` background in the kit.",
])
block("Modals", "modals", [
    "Radius 12px. Footer action buttons are 48px tall.",
    "The kit shows a scrim behind the dialog.",
])
block("Tooltips", "tooltips", [
    "Radius 12px. Dark surface with light text.",
])
block("Pagination", "pagination", [
    "The kit ships several pagination styles, including numbered controls and",
    "compact dot indicators.",
])
block("Sliders", "sliders", [
    "Track with a circular handle. Handle sits on a 48px tall control area.",
])
block("Toggles", "toggles", [
    "Switch track is 40x24px with a circular knob. Checkbox and radio controls",
    "are 24x24px.",
])

w("## Spacing and radius")
w("")
w("Spacing steps used throughout the kit: 4, 8, 12, 16, 24, 32, 40, 80.")
w("Corner radii used: 8, 12, 16, and 1000 for pill shapes.")
w("Page gutter in the kit's own layouts is 80px at desktop width.")
w("")
w("## Attribution")
w("")
w("Prime 6.0 by Thalion, https://primedesignsystem.com. These are measured")
w("values recorded for a build exercise. No source artwork or components are")
w("reproduced.")

open("DESIGN-SYSTEM-6.0.md", "w").write("\n".join(out) + "\n")
print("written", len("\n".join(out)), "chars")
