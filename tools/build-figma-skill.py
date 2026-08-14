#!/usr/bin/env python3
"""Build the single-file Figma skill, in two sizes.

Figma custom skills must be one Markdown file and do not support references/
directories. Figma also does not document a size limit, and large uploads can
fail to save, so this builds a standard file and a smaller core file.

Section bodies are copied verbatim from ACCESSIBILITY.md so neither build can
drift from the source. Only the framing between sections is authored here.
"""

import re
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
SRC = REPO / "ACCESSIBILITY.md"
OUTDIR = REPO / "skills" / "figma"
RAW = "https://github.com/danarandall/ai-a11y-toolkit/blob/main/"

lines = SRC.read_text().split("\n")
heads = [(i, l) for i, l in enumerate(lines) if l.startswith("## ")]


def section(frag, title):
    """Return one section of the source, retitled, with sub-headings demoted."""
    for idx, (i, l) in enumerate(heads):
        if frag in l:
            end = heads[idx + 1][0] if idx + 1 < len(heads) else len(lines)
            body = [f"## {title}"] + lines[i + 1 : end]
            out = ["#" + ln if ln.startswith("###") else ln for ln in body]
            text = "\n".join(out).rstrip()
            while text.rstrip().endswith("---"):
                text = text.rstrip()[:-3].rstrip()
            return text + "\n\n"
    raise SystemExit(f"section not found: {frag}")


DESC = (
    "WCAG 2.2 Level AA accessibility rules for designing and building digital "
    "experiences. Use this skill whenever you create, edit, or review a screen, "
    "component, or layout, and whenever you generate code, copy, or alt text. "
    "Use it for questions about contrast, color, focus, keyboard operation, "
    "headings, reading order, target size, motion, form errors, zoom, alt text, "
    "or whether a design system makes a product accessible."
)

HEAD = """# AI A11y Toolkit

WCAG 2.2 Level AA rules for humans and AI agents building digital experiences.

Written by Dana Randall. Licensed CC BY 4.0, free to use commercially, adapt,
and redistribute, with attribution.

The full reference, all eighteen sections and all 55 Level A and AA criteria:
https://github.com/danarandall/ai-a11y-toolkit
Current release and feedback: https://danarandall.com/ai-a11y-toolkit

Apply the non-negotiables to everything you produce. Follow the directives when
you generate code. Report what still needs human and screen reader testing.

"""

FIGMA = """## Working in a design file

A design file settles fewer criteria than most people expect. Three things are
worth getting exactly right in the file, because they are cheap to fix in design
and expensive to fix later: text contrast, non-text contrast, and target size.
Measured across WCAG 2.2 A and AA, those three are what a design kit determines
on its own. It influences fourteen more and cannot affect the remaining
thirty-eight. At Level A it determines none of the thirty-one.

That scope describes a static file, not design as a practice. Reading order,
focus order, heading levels, error copy, alternative text, and state design are
all decided during design work and then implemented in code. Deciding them early
is what prevents rework, and annotating them in the file is what carries them
into the build.

Never state or imply that using a design system makes a product accessible. It
settles a small number of criteria and leaves the rest open. When someone asks
whether a component from a kit is accessible, answer for the criteria the kit can
actually determine and name the ones still open.

"""

MORE = """## What is not in this file

This build carries the rules that apply on every task. Each area below is a
section of the full reference at
https://github.com/danarandall/ai-a11y-toolkit

| Area | Where |
| --- | --- |
| Motion, video, carousels, target size, zoom, reflow, text spacing | Section 3 |
| Interface consistency and repeated components | Section 5 |
| Alt text decision tree, charts, icons, decorative art | Section 6 |
| Contrast and color independence in detail | Section 7 |
| Cognitive load, clear language, non-apparent disabilities | Section 8 |
| HTML, CSS, React, and component frameworks | Sections 10 and 11 |
| The build loop, scanning, and the manual test queue | Section 14 |
| Every Level A and AA success criterion | Section 16 |

"""

FOOT = """## Attribution

Written by Dana Randall in a personal capacity. Licensed CC BY 4.0.
https://creativecommons.org/licenses/by/4.0/

If you adapt or redistribute this, credit Dana Randall and link
https://danarandall.com/ai-a11y-toolkit

The perceive, understand, operate sequence and the framing of design scope as a
human plus technology system come from the Accessible Design Framework by Karen
Hawkins, Principal of Accessible Design at Level Access.

Found something that does not work? https://danarandall.com/ai-a11y-toolkit#feedback
"""

# Section numbers mean nothing in a standalone file. Point at the heading when
# the content is inlined, and at the full reference when it is not.
INLINED = {
    "2": "the agent directives",
    "12": "the design tools and AI prompting section",
    "15": "the verification section",
    "17": "the failure patterns section",
}


def assemble(parts):
    text = "".join(parts)
    text = text.replace("references/", "")
    text = re.sub(r"\]\((?!http|#)([^)]+)\)", lambda m: "](" + RAW + m.group(1) + ")", text)
    text = text.replace("Section 508", "SEC508GUARD")
    for num, name in INLINED.items():
        text = re.sub(rf"Section {num}(?![\d.])", name, text)
    text = re.sub(r"Section (\d+(?:\.\d+)?)", r"Section \1 of the full reference", text)
    text = text.replace("SEC508GUARD", "Section 508")
    # A replaced cross reference can land at the start of a sentence.
    names = "|".join(re.escape(v) for v in INLINED.values())
    text = re.sub(
        rf"([.!?]\s+|^|\n)({names})",
        lambda m: m.group(1) + m.group(2)[0].upper() + m.group(2)[1:],
        text,
    )
    front = f'---\nname: ai-a11y-toolkit\ndescription: "{DESC}"\n---\n\n'
    return front + HEAD + text + FOOT


BUILDS = {
    "ai-a11y-toolkit.md": [
        section("Section 1:", "The non-negotiables"),
        FIGMA,
        section("Section 4:", "Design systems"),
        section("Section 9:", "For designers"),
        section("Section 12:", "Design tools and AI prompting"),
        section("Section 2:", "Agent directives"),
        section("Section 17:", "Common AI-generated failure patterns"),
        section("Section 15:", "Verification"),
        MORE,
    ],
    "ai-a11y-toolkit-core.md": [
        section("Section 1:", "The non-negotiables"),
        FIGMA,
        section("Section 2:", "Agent directives"),
    ],
}

OUTDIR.mkdir(parents=True, exist_ok=True)
for name, parts in BUILDS.items():
    text = assemble(parts)
    (OUTDIR / name).write_text(text)
    print(f"{name:<28} {len(text):>7} chars  {len(text.split()):>6} words")
