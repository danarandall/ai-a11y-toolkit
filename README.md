# AI A11y Toolkit

**Your AI writes beautiful code that locks people out.**

Three markdown files that make AI design and coding tools build accessible interfaces by default, mapped to WCAG 2.2 Level AA.

Free. No signup. Drop a file into your project and every prompt after that inherits the rules.

Release `2026.07`

---

## Why this exists

AI builders generate whatever pattern is most common in their training data. Across the web, the most common pattern is inaccessible: `div` elements used as buttons, inputs with no labels, focus outlines removed for looking untidy, colour contrast chosen for a mood board rather than for readability.

So the output looks finished and locks people out. It ships faster than anyone can review it, which is the part that should worry you.

Pasting accessibility rules into chat does not fix it, because chat context decays. Ten prompts later the model has moved on. These rules need to live somewhere the tool reads on every request, which is what this toolkit is for.

## What is in it

| File | Size | Use it when |
| --- | --- | --- |
| [`START-HERE.md`](START-HERE.md) | 19 KB | You want the install steps. Covers 15 AI platforms, exact filenames, exact settings fields, and what to do when the tool ignores the rules. |
| [`ACCESSIBILITY-CORE.md`](ACCESSIBILITY-CORE.md) | 7 KB | You are pasting into a field with a character limit. Sized to fit Lovable Project Knowledge at 10,000 characters and Windsurf workspace rules at 12,000. |
| [`ACCESSIBILITY.md`](ACCESSIBILITY.md) | 158 KB | You can commit a file to a repo or upload to project knowledge. The full reference, 18 sections, all 55 Level A and AA success criteria in build terms. |

## Quick start

**If you are using a chat-based builder** such as Lovable, Base44, Bolt, v0, Replit, or Figma Make, paste `ACCESSIBILITY-CORE.md` into the project knowledge or custom instructions field. Do not paste it into the chat.

**If you are using a code editor or agent** such as Claude Code, Cursor, Copilot, Windsurf, or Codex, commit `ACCESSIBILITY.md` to your repo and reference it from that tool's instruction file:

| Tool | File it reads |
| --- | --- |
| Claude Code | `CLAUDE.md` |
| Codex | `AGENTS.md` |
| Cursor | `.cursor/rules/accessibility.mdc` with `alwaysApply: true` |
| GitHub Copilot | `.github/copilot-instructions.md` |
| Windsurf | `.windsurf/rules/accessibility.md` |
| Replit | `replit.md` |
| Gemini CLI | `GEMINI.md` |

A plain `.md` file in `.cursor/rules/` is ignored. It has to be `.mdc` with frontmatter. That kind of detail is why `START-HERE.md` exists.

**Then confirm it loaded.** Ask your tool: "What are your accessibility requirements for this project? List the target size minimum and the contrast ratio." If it cannot answer, the file is not being read, and `START-HERE.md` has a section on fixing that.

## What it covers

- All 55 WCAG 2.2 Level A and AA success criteria, written as build instructions rather than as standards language
- Split by job function, so designers, web developers, framework engineers, and people prompting for AI-generated content each have their own section
- Motion, media controls, target size, and text reflow, including `prefers-reduced-motion` and the 24 by 24 floor with a 44 by 44 house standard
- Alt text that describes the image instead of repeating a filename or a hex code
- Colour and colour vision deficiency, and why a "colour blindness mode" toggle is the wrong answer
- Open source design systems that are already tested, so your AI copies from something good
- An automated check loop the agent runs as it builds, then fixes what it finds
- A manual test queue the agent generates for the things a scanner cannot judge

## What it will not do

Worth saying plainly.

Automated accessibility checking detects roughly a third of defects. No file, and no AI, can tell you whether your alt text is accurate, whether your focus order makes sense to a person, or whether your error message actually helps someone recover. That needs a human with a keyboard and a screen reader, and ideally a disabled tester who is paid for their time.

This toolkit will not make you compliant. It will stop your AI from generating the obvious failures by default, and it will tell you honestly what is left to check. That is a large improvement over the default, and it is not the same as done.

## Contributing

Two things I genuinely want.

**Tell me when it breaks.** These platforms rename their rules files, move their settings menus, and change character limits without notice. If a step in `START-HERE.md` no longer matches what you see on screen, [open an issue](../../issues). That is a bug in this file.

**Tell me what you are building with.** Knowing which tools people actually use decides which of these 15 platform sections stay maintained. An issue or a note is plenty.

Pull requests welcome, particularly for platform instructions I have wrong and for tools I have not covered yet.

Both of those have an issue template, so you are not staring at a blank box. If you do not have a GitHub account and do not want one, there is a short form on [the toolkit page](https://www.danarandall.com/ai-a11y-toolkit#feedback) instead. Nothing on it is required except the last box.

## Licence

[CC BY 4.0](LICENSE). Use it commercially, adapt it, teach with it, fork it. Keep the attribution.

If you use this in a workshop or roll it out to a team, I would like to hear about it, though you are not obliged to tell me.

## Author

Dana Randall. Creative director, 25 years across branding, product design, and digital innovation, currently at Level Access working on accessible and inclusive design.

Design for the margins is not charity work. It is early access to the future.

[danarandall.com](https://danarandall.com) | [About](https://danarandall.com/about-dana-randall) | [DESIGNA11Y articles](https://www.design-a11y.com/articles)

The views and content here are my own.
