# AI A11y Toolkit

**Your AI writes beautiful code that locks people out.**

Three markdown files that make AI design and coding tools build more accessible interfaces by default, mapped to WCAG 2.2 Level AA.

Free. No signup. Drop a file into your project and every prompt after that inherits the rules.

Release `2026.08`

---

## Why this exists

AI builders generate whatever pattern is most common in their training data. Across the web, the most common pattern is inaccessible: `div` elements used as buttons, inputs with no labels, focus outlines removed for looking untidy, color contrast chosen for a mood board rather than for readability.

So the output looks finished and locks people out. It ships faster than anyone can review it, which is the part that should worry you.

Pasting accessibility rules into chat does not fix it, because chat context decays. Ten prompts later the model has moved on. These rules need to live somewhere the tool reads on every request, which is what this toolkit is for.

## What is in it

| File | Size | Use it when |
| --- | --- | --- |
| [`START-HERE.md`](START-HERE.md) | 19 KB | You want the install steps. Covers 15 AI platforms, exact filenames, exact settings fields, and what to do when the tool ignores the rules. |
| [`ACCESSIBILITY-CORE.md`](ACCESSIBILITY-CORE.md) | 9 KB | You are pasting into a field with a character limit. Sized to fit Lovable Project Knowledge at 10,000 characters and Windsurf workspace rules at 12,000. |
| [`ACCESSIBILITY.md`](ACCESSIBILITY.md) | 167 KB | You can commit a file to a repo or upload to project knowledge. The full reference, 18 sections, all 55 Level A and AA success criteria in build terms. |
| [`skills/ai-a11y-toolkit`](skills/) | 190 KB | Your coding agent supports agent skills. Same content, split so the agent loads the routing file always and pulls in one reference file per task. Works in Claude Code, Cursor, and Codex. |
| [`skills/figma/ai-a11y-toolkit.md`](skills/figma/ai-a11y-toolkit.md) | 55 KB | You are working in Figma. One self-contained file for custom skills in the Figma agent and Figma Make, published on the [Figma Community](https://www.figma.com/community/skill/76094/ai-a11y-toolkit-wcag-22-aa). |

## Quick start

**If you are working in Figma**, in either the Figma agent or Figma Make, install it as a custom skill. It is published on the Figma Community as [AI A11y Toolkit](https://www.figma.com/community/skill/76094/ai-a11y-toolkit-wcag-22-aa), and once added it stays available across all your files. Invoke it with `/ai-a11y-toolkit` when you are designing a screen, choosing colors, reviewing a component, or building in Make. See [`skills/README.md`](skills/README.md) for the install steps and the seat requirements.

**If you are using a chat-based builder** such as Lovable, Base44, Bolt, v0, or Replit, paste `ACCESSIBILITY-CORE.md` into the project knowledge or custom instructions field. Do not paste it into the chat.

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

**If your coding agent supports agent skills**, copy [`skills/ai-a11y-toolkit`](skills/) into the skills folder your tool reads, or point your agent at this repository and ask it to install the skill from that path. This is the better option when it is available, because the agent loads the rules for the task in front of it rather than the whole reference.

That folder build is for the agent you are working in. If your agent is also connected to Figma through the Figma MCP server, the skill still lives in your agent rather than in Figma, so use the folder build there and the [Figma custom skill](skills/figma/ai-a11y-toolkit.md) when you are working inside Figma itself.

A plain `.md` file in `.cursor/rules/` is ignored. It has to be `.mdc` with frontmatter. That kind of detail is why `START-HERE.md` exists.

**Then confirm it loaded.** Ask your tool: "What are your accessibility requirements for this project? List the target size minimum and the contrast ratio." If it cannot answer, the file is not being read, and `START-HERE.md` has a section on fixing that.

## What it covers

- All 55 WCAG 2.2 Level A and AA success criteria, written as build instructions rather than as standards language
- Split by job function, so designers, web developers, framework engineers, and people prompting for AI-generated content each have their own section
- Motion, media controls, target size, and text reflow, including `prefers-reduced-motion` and the 24 by 24 floor with a 44 by 44 house standard
- Alt text that describes the image instead of repeating a filename or a hex code
- Color and color vision deficiency, and why a "color blindness mode" toggle is the wrong answer
- Open source design systems that are already tested, so your AI copies from something good
- An automated check loop the agent runs as it builds, then fixes what it finds
- A manual test queue the agent generates for the things a scanner cannot judge

## What it will not do

Worth saying plainly.

Automated accessibility checking detects roughly a third of defects. No file, and no AI, can tell you whether your alt text is accurate, whether your focus order makes sense to a person, or whether your error message actually helps someone recover. That needs a human with a keyboard and a screen reader, and ideally a disabled tester who is paid for their time.

This toolkit will not make you compliant. It will stop your AI from generating the obvious failures by default, and it will tell you honestly what is left to check. That is a large improvement over the default, and it is not the same as done.

## Does it actually work

I test the toolkit rather than assert it, and I publish the results including the parts that do not flatter it. Five studies live in [`research/`](research/), with the briefs, the rubrics written before the builds, both sets of generated source, the harnesses, and the raw engine output.

| Study | Without | With |
| --- | --- | --- |
| [2. Icon browser](research/2-icon-browser/README.md) | 6 of 16 | 15 of 16 |
| [3. Dough calculator](research/3-dough-calculator/README.md) | 10 of 16 | 15 of 16 |
| [4. Design system ceiling](research/4-design-system-ceiling/README.md) | 13 of 29 | 26 of 29 |
| [5. Figma Make](research/5-figma-make/README.md) | 8 of 16 | 14 of 16 |

**[A field audit](research/1-field-audit/README.md)** of a production application built with AI tooling and without this file installed. Nine findings, seven of which map to rules already in the toolkit. The other two were found by reading the rules by hand, because no engine reported them. Three engines scanning the same page at the same moment returned 0, 403, and 321 findings. The zero was a ruleset coverage gap, not a pass, and Section 14.3 exists because of it.

**[A controlled test](research/2-icon-browser/README.md)** of the preventive claim. Two AI agents, one identical brief that never mentioned accessibility, same model, same constraints. The only difference was this file in the project root. The control scored 6 of 16 on a rubric written before either build existed. The treatment scored 15 of 16. Engine violations fell from 39 to 15, and five of the nine checks the control failed are ones no scanner can detect.

One rubric check failed in **both** arms, silently, and the treatment's own summary claimed it had got that check right. That result is reported in full alongside the rest, because a toolkit that only publishes its wins is not evidence of anything.

**[A test of the Figma custom skill](research/5-figma-make/README.md)**, because a design tool is not a code editor and nothing about the earlier results guarantees the guidance survives the move. The control shipped a landing page with **zero links on it**, every navigational control a `button`, no landmarks, and no reduced-motion handling. The treatment scored 14 of 16 against the control's 8. Both arms failed the same two checks, and both failures are ones a design system cannot reach.

Two results there are worth more than the score. The control wrote five good alt texts unprompted, so the baseline has moved and the toolkit should stop claiming that ground. And the scanner misread contrast in **both** arms by up to a factor of three, because it cannot composite a partial-alpha color over a photograph.

## Contributing

Two things I genuinely want.

**Tell me when it breaks.** These platforms rename their rules files, move their settings menus, and change character limits without notice. If a step in `START-HERE.md` no longer matches what you see on screen, [open an issue](../../issues). That is a bug in this file.

**Tell me what you are building with.** Knowing which tools people actually use decides which of these 15 platform sections stay maintained. An issue or a note is plenty.

Pull requests welcome, particularly for platform instructions I have wrong and for tools I have not covered yet.

Both of those have an issue template, so you are not staring at a blank box. If you do not have a GitHub account and do not want one, there is a short form on [the toolkit page](https://www.danarandall.com/ai-a11y-toolkit#feedback) instead. Nothing on it is required except the last box.

## License

[CC BY 4.0](LICENSE). Use it commercially, adapt it, teach with it, fork it. Keep the attribution.

If you use this in a workshop or roll it out to a team, I would like to hear about it, though you are not obliged to tell me.

## Author

Dana Randall. Creative director, 25 years across branding, product design, and digital innovation, currently at Level Access working on accessible and inclusive design.

Design for the margins is not charity work. It is early access to the future.

[danarandall.com](https://danarandall.com) | [About](https://danarandall.com/about-dana-randall) | [DESIGNA11Y articles](https://www.design-a11y.com/articles)

The views and content here are my own.
