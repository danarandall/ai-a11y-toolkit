#!/usr/bin/env python3
"""Cut evidence crops from a full page export, provably excluding photography.

The design files place photographs the Figma agent supplied, and the node trees
record those only as opaque imageRef hashes with no source or attribution. The
full page exports are therefore not redistributable, because there is no way to
establish what license the imagery carries.

Every finding in DESIGN-FILE-AUDIT.md is about type color, type size, or control
height, so the evidence does not need the photography. This script cuts the
regions that carry the measured claims and refuses to write any crop whose
rectangle overlaps a node with an IMAGE fill. The check is geometric rather than
visual, so it does not depend on anyone eyeballing the result.

Usage:
    python3 crop-evidence.py control
    python3 crop-evidence.py treatment
"""

import json
import os
import sys

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
STUDY = os.path.dirname(HERE)

ARMS = {
    "control": {
        "tree": "data/design-control-tree.json",
        "export": "exports/design-control-leavened-landing-page.jpg",
        "prefix": "control",
        # Regions named by the top-level section whose bounding box defines them.
        "regions": [
            ("navigation", "nav-bar", "nav links at 17px and the 41px Reserve Boule button, 2.5.8"),
            ("philosophy", "philosophy", "Hour 0 through Hour 36 at 11px bold, measured 3.59:1"),
            ("sourdough-club", "membership-band", "THE LEAVENED MEMBERSHIP at 14px bold on dark, measured 3.61:1"),
        ],
    },
    "treatment": {
        "tree": "data/design-treatment-tree.json",
        "export": "exports/design-treatment-levain-and-crust-landing.jpg",
        "prefix": "treatment",
        "regions": [
            ("navigation", "nav-bar", "nav links at 17px and the 48px Order Online button, 2.5.8"),
            ("newsletter-signup", "newsletter-band", "The Bread Chronicle at 13px bold on dark, the single 2.71:1 failure"),
        ],
    },
}


def load(path):
    with open(path) as fh:
        return json.load(fh)["file"]["document"]


def walk(node, out=None):
    """Flatten the tree to a list of nodes."""
    if out is None:
        out = []
    out.append(node)
    for child in node.get("children") or []:
        walk(child, out)
    return out


def box(node):
    b = node.get("absoluteBoundingBox")
    if not b:
        return None
    return (b["x"], b["y"], b["x"] + b["width"], b["y"] + b["height"])


def has_image_fill(node):
    for fill in node.get("fills") or []:
        if fill.get("type") == "IMAGE":
            return True
    return False


def overlaps(a, b):
    return not (a[2] <= b[0] or b[2] <= a[0] or a[3] <= b[1] or b[3] <= a[1])


def find(frame, section_name):
    """Top-level section of the page frame, matched on its exact name.

    Matching only top-level sections keeps a crop from silently resolving to some
    small descendant that happens to share a word, which would produce a correct
    looking image of the wrong region.
    """
    for n in frame.get("children") or []:
        if (n.get("name") or "") == section_name:
            return n
    return None


def main():
    if len(sys.argv) < 2 or sys.argv[1] not in ARMS:
        print("usage: crop-evidence.py [control|treatment]")
        return 1

    arm = ARMS[sys.argv[1]]
    doc = load(os.path.join(STUDY, arm["tree"]))
    nodes = walk(doc)

    frame = doc["children"][0]
    fx0, fy0, fx1, fy1 = box(frame)
    design_width = fx1 - fx0

    export_path = os.path.join(STUDY, arm["export"])
    if not os.path.exists(export_path):
        print("missing export: %s" % export_path)
        return 1

    img = Image.open(export_path)
    scale = img.width / design_width
    print("%s: export %dx%d, design width %.0f, scale %.4f"
          % (sys.argv[1], img.width, img.height, design_width, scale))

    photos = [(n.get("name"), box(n)) for n in nodes
              if has_image_fill(n) and box(n)]
    print("  %d image fills to avoid" % len(photos))

    outdir = os.path.join(STUDY, "exports")
    written = 0

    for name_fragment, label, why in arm["regions"]:
        node = find(frame, name_fragment)
        if node is None:
            print("  SKIP %s: no top-level section named %r" % (label, name_fragment))
            continue
        rect = box(node)
        if rect is None:
            print("  SKIP %s: node has no bounding box" % label)
            continue

        clashes = [pn for pn, pb in photos if overlaps(rect, pb)]
        if clashes:
            print("  REFUSED %s: overlaps %d image fill(s): %s"
                  % (label, len(clashes), ", ".join(sorted(set(clashes)))))
            continue

        pixels = (
            int(round((rect[0] - fx0) * scale)),
            int(round((rect[1] - fy0) * scale)),
            int(round((rect[2] - fx0) * scale)),
            int(round((rect[3] - fy0) * scale)),
        )
        crop = img.crop(pixels)
        out = os.path.join(outdir, "%s-%s.png" % (arm["prefix"], label))
        crop.save(out)
        written += 1
        print("  wrote %s  %dx%d  (%s)"
              % (os.path.basename(out), crop.width, crop.height, why))

    print("  %d crop(s) written" % written)
    return 0


if __name__ == "__main__":
    sys.exit(main())
