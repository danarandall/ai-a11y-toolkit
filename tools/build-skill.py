#!/usr/bin/env python3
"""Build the ai-a11y-toolkit agent skill by extracting sections verbatim
from ACCESSIBILITY.md. Verbatim extraction means the reference files inherit
the style compliance of the source and cannot drift from it."""

from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
SRC = REPO / "ACCESSIBILITY.md"
OUT = REPO / "skills" / "ai-a11y-toolkit"

lines = SRC.read_text().split("\n")

# Locate every "## " heading, 0-indexed
heads = [(i, l) for i, l in enumerate(lines) if l.startswith("## ")]


def section(title_fragment):
    """Return the verbatim lines of the section whose heading contains the fragment."""
    for idx, (i, l) in enumerate(heads):
        if title_fragment in l:
            end = heads[idx + 1][0] if idx + 1 < len(heads) else len(lines)
            return "\n".join(lines[i:end]).rstrip() + "\n"
    raise SystemExit(f"section not found: {title_fragment}")


# Grouped reference files. Order inside each list is the reading order.
GROUPS = {
    "design.md": {
        "title": "For designers",
        "intro": "What design decides, and where the handoff to code begins.",
        "sections": ["Section 9:", "Section 5:", "Section 4:"],
    },
    "color.md": {
        "title": "Color and color vision",
        "intro": "Contrast ratios, color independence, and how to test a palette.",
        "sections": ["Section 7:"],
    },
    "motion-media-targets.md": {
        "title": "Motion, media, target size, and text zoom",
        "intro": "Reduced motion, autoplay, captions, pointer target size, reflow, and text spacing.",
        "sections": ["Section 3:"],
    },
    "alt-text.md": {
        "title": "Alt text and image descriptions",
        "intro": "Decision tree for every image, plus patterns for charts, icons, and decorative art.",
        "sections": ["Section 6:"],
    },
    "content-and-language.md": {
        "title": "Content, language, and cognitive load",
        "intro": "Clear language, non-apparent disabilities, and rules for AI-generated copy.",
        "sections": ["Section 8:", "Section 13:"],
    },
    "html-css.md": {
        "title": "HTML and CSS",
        "intro": "Semantic structure, focus, forms, and the CSS that breaks assistive technology.",
        "sections": ["Section 10:"],
    },
    "react.md": {
        "title": "React and component frameworks",
        "intro": "Component level rules, state announcements, focus management, and routing.",
        "sections": ["Section 11:"],
    },
    "testing.md": {
        "title": "Testing and verification",
        "intro": "The build loop, what automation catches, and the manual queue it cannot.",
        "sections": ["Section 14:", "Section 15:"],
    },
    "wcag-reference.md": {
        "title": "WCAG 2.2 Level A and AA reference",
        "intro": "Every criterion at Level A and AA, with the section of this skill that covers it.",
        "sections": ["Section 16:"],
    },
    "failure-patterns.md": {
        "title": "Common AI-generated failure patterns",
        "intro": "The defects that show up repeatedly in generated code, and the fix for each.",
        "sections": ["Section 17:", "Section 12:"],
    },
    "project-configuration.md": {
        "title": "Project configuration",
        "intro": "Declare the project context once so the rules resolve to specific answers.",
        "sections": ["Section 0:"],
    },
}

HEADER = """# {title}

{intro}

Part of the AI A11y Toolkit by Dana Randall. Licensed CC BY 4.0.
Full reference: https://github.com/danarandall/ai-a11y-toolkit

---

"""

refs = OUT / "references"
refs.mkdir(parents=True, exist_ok=True)

written = []
for name, spec in GROUPS.items():
    body = "\n\n".join(section(s) for s in spec["sections"])
    text = HEADER.format(title=spec["title"], intro=spec["intro"]) + body
    (refs / name).write_text(text)
    written.append((name, len(text.split()), len(text)))

# Attribution travels with the package.
(OUT / "references" / "attribution.md").write_text(
    HEADER.format(
        title="Attribution and reuse",
        intro="License terms, how to credit this work, and how to report a problem with it.",
    )
    + section("Attribution and reuse")
)
written.append(("attribution.md", 0, 0))

for n, w, c in written:
    print(f"{n:34} {w:6} words  {c:7} chars")
