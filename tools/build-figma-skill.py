#!/usr/bin/env python3
"""Build the single-file Figma skill.

Figma custom skills must be one Markdown file and do not support references/
directories, so this build inlines the sections that carry the most weight for
a Figma audience and links out to the repository for the rest.

Section bodies are copied verbatim from ACCESSIBILITY.md so this file cannot
drift from the source. Only the framing between them is authored here.
"""

import re
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
SRC = REPO / "ACCESSIBILITY.md"
OUT = REPO / "skills" / "figma" / "ai-a11y-toolkit.md"

lines = SRC.read_text().split("\n")
heads = [(i, l) for i, l in enumerate(lines) if l.startswith("## ")]


def section(frag, title):
    """Return one section of the source, retitled, with sub-headings demoted."""
    for idx, (i, l) in enumerate(heads):
        if frag in l:
            end = heads[idx + 1][0] if idx + 1 < len(heads) else len(lines)
            body = [f"## {title}"] + lines[i + 1 : end]
            out = []
            for ln in body:
                out.append("#" + ln if ln.startswith("###") else ln)
            text = "\n".join(out).rstrip()
            while text.rstrip().endswith("---"):
                text = text.rstrip()[:-3].rstrip()
            return text + "\n"
    raise SystemExit(f"section not found: {frag}")


FRONT = '''---
name: ai-a11y-toolkit
description: "WCAG 2.2 Level AA accessibility rules for designing and building digital experiences. Use this skill whenever you create, edit, or review a screen, component, layout, or interface, and whenever you generate code, copy, or alt text. Use it when the request involves contrast, color, focus, keyboard operation, headings, reading order, target size, motion or animation, form errors, live regions, zoom or reflow, alt text, or whether a design system makes a product accessible."
---

'''

HEAD = """# AI A11y Toolkit

WCAG 2.2 Level AA rules for humans and AI agents building digital experiences.

Written by Dana Randall. Licensed CC BY 4.0, free to use commercially, adapt,
and redistribute, with attribution.

Current release, the full reference, and feedback:
https://danarandall.com/ai-a11y-toolkit
Repository: https://github.com/danarandall/ai-a11y-toolkit

Apply the non-negotiables to everything you produce. Follow the directives when
you generate code. Report what still needs human and screen reader testing.

"""

FIGMA = """---

## Working in a design file

A design file settles fewer criteria than most people expect, and the next
section has the measured breakdown. What it means in practice is that three
things are worth getting exactly right in the file, because they are cheap to
fix in design and expensive to fix later: text contrast, non-text contrast, and
target size.

That scope describes a static file, not design as a practice. Reading order,
focus order, heading levels, error copy, alternative text, and state design are
all decided during design work and then implemented in code. Deciding them
early is what prevents rework, and annotating them in the file is what carries
them into the build.

Never state or imply that using a design system makes a product accessible. It
settles a small number of criteria and leaves the rest open. When someone asks
whether a component from a kit is accessible, answer for the criteria the kit
can actually determine and name the ones still open.

"""

MORE = """---

## What is not in this file

This skill carries the rules that apply on every task. The full reference has
the depth, and each area below is a section of it at
https://github.com/danarandall/ai-a11y-toolkit

| Area | Where |
| --- | --- |
| Motion, video, carousels, target size, zoom, reflow, text spacing | Section 3 |
| Interface consistency and repeated components | Section 5 |
| Alt text decision tree, charts, icons, decorative art | Section 6 |
| Cognitive load, clear language, non-apparent disabilities | Section 8 |
| HTML and CSS in detail | Section 10 |
| React and component frameworks | Section 11 |
| The build loop, scanning, and the manual test queue | Section 14 |
| Every Level A and AA success criterion | Section 16 |
| Project configuration to declare context once | Section 0 |

There is also a version of this content split into an agent skill with
reference files, for tools that support them, at
https://github.com/danarandall/ai-a11y-toolkit/tree/main/skills

"""

FOOT = """---

## Attribution

Written by Dana Randall in a personal capacity. Licensed CC BY 4.0.
https://creativecommons.org/licenses/by/4.0/

If you adapt or redistribute this, credit Dana Randall and link
https://danarandall.com/ai-a11y-toolkit

The perceive, understand, operate sequence and the framing of design scope as a
human plus technology system come from the Accessible Design Framework by
Karen Hawkins, Principal of Accessible Design at Level Access.

Found something that does not work? https://danarandall.com/ai-a11y-toolkit#feedback
"""

body_parts = [
    section("Section 1:", "The non-negotiables"),
    "\n",
    FIGMA,
    section("Section 4:", "Design systems"),
    "\n",
    section("Section 9:", "For designers"),
    "\n",
    section("Section 7:", "Color and color vision"),
    "\n",
    section("Section 12:", "Design tools and AI prompting"),
    "\n",
    section("Section 2:", "Agent directives"),
    "\n",
    section("Section 17:", "Common AI-generated failure patterns"),
    "\n",
    section("Section 15:", "Verification"),
    "\n",
]

OUT.parent.mkdir(parents=True, exist_ok=True)
text = "".join(body_parts)
# Cross references to sibling reference files do not exist in a single file build.
text = text.replace("references/", "")
# Section numbers mean nothing in a standalone file. Point at the heading when
# the content is inlined here, and at the full reference when it is not.
text = text.replace("Section 508", "SEC508GUARD")
for num, name in [
    ("2", "the agent directives"),
    ("4.5", "the design systems section"),
    ("4", "the design systems section"),
    ("7", "the color and color vision section"),
    ("9.3", "the designers section"),
    ("9", "the designers section"),
    ("12", "the design tools and AI prompting section"),
    ("15", "the verification section"),
    ("17", "the failure patterns section"),
]:
    text = text.replace(f"Section {num}", name)
text = re.sub(r"Section (\d+(?:\.\d+)?)", r"Section \1 of the full reference", text)
text = text.replace("SEC508GUARD", "Section 508")
RAW = "https://github.com/danarandall/ai-a11y-toolkit/blob/main/"
text = re.sub(r"\]\((?!http|#)([^)]+)\)", lambda m: "](" + RAW + m.group(1) + ")", text)
# A replaced cross reference can land at the start of a sentence.
text = re.sub(r"([.!?]\s+|^|\n)(the (?:agent directives|designers section|color and color vision section|design systems section|design tools|verification section|failure patterns section))",
              lambda m: m.group(1) + m.group(2)[0].upper() + m.group(2)[1:], text)
text = FRONT + HEAD + text + MORE + FOOT
OUT.write_text(text)

words = len(text.split())
print(f"{OUT.relative_to(REPO)}  {len(text)} chars  {words} words  {text.count(chr(10))} lines")
