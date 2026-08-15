# Start here

**How to make your AI build more accessible things.** Part of the AI A11y Toolkit by Dana Randall.

Release 2026.08. Latest version of every file: https://danarandall.com/ai-a11y-toolkit
Something not working in your tool? Tell me: https://danarandall.com/ai-a11y-toolkit#feedback

You do not need to be a developer to use this. If you are building with Lovable, Base44, Bolt, v0, Figma Make, Figma Design, Replit, Cursor, Claude Code, ChatGPT, or anything similar, this file tells you where to put the rules so your AI actually follows them.

The reason this is a set of files and not a list of prompts: you cannot prompt for a requirement you do not know exists. These rules sit inside your tool and apply themselves, so the thing you generate starts from a baseline without you having to know what to ask for.

Verified against platform documentation in July 2026, with the two Figma sections rechecked in August 2026. These products change fast, so if a menu has moved, the linked documentation is the source of truth.

---

## The short version

1. Pick the right file for your platform. `ACCESSIBILITY-CORE.md` if you are pasting into a text box. `ACCESSIBILITY.md` if you can put a file in your project.
2. Put it in the place your platform reads **every time**, not in a chat message.
3. Send the activation prompt in Part 4 as your first message.

That is it. The rest of this file is detail for when something does not work.

---

## Part 1: Why a chat message is not enough

The single most common mistake is pasting the rules into the chat and assuming they stuck. In most tools, a chat attachment or a pasted message is **one-off context.** It influences the next few replies, then falls out of the conversation as the build grows. Twenty prompts later your AI has forgotten every rule and is happily generating `div` elements with click handlers.

Every platform below has a separate, durable place for standing instructions. That is where these rules belong. It is usually called Knowledge, Instructions, Rules, Memory, or Guidelines.

Two categories, and it changes what you do:

| | Where the rules live | Which file |
| --- | --- | --- |
| **Chat-based builders**, no file system you manage | A text box in settings, usually with a character limit | `ACCESSIBILITY-CORE.md`, about 7,000 characters |
| **Code tools**, you have a repo or file tree | A markdown file committed alongside your code | `ACCESSIBILITY.md`, the full version |

If you can do both, do both. Put the core rules in the always-on text box and the full file in the repo.

---

## Part 2: Chat-based builders

### Lovable

Project settings, then Knowledge. Or click the plus button at the bottom left of the chat, then Settings, then Knowledge. You will see **Project Knowledge** and **Workspace Knowledge**.

Paste `ACCESSIBILITY-CORE.md` into **Project Knowledge**. If you want it on every project you build, put it in **Workspace Knowledge** instead, which only workspace owners and admins can edit.

Both fields cap at **10,000 characters**, and both are included with every prompt you send ([Lovable Knowledge documentation](https://docs.lovable.dev/features/knowledge)). The core file fits with room to spare. Do not try to paste the full `ACCESSIBILITY.md`, it will not fit.

### Base44

Settings icon at the bottom of the chat, then the **AI Controls** panel, then **Custom Instructions**. Paste the core file there. It applies to every AI interaction in the app ([Base44 documentation](https://docs.base44.com/Building-your-app/AI-chat-modes)).

While you are in that panel, note **Freeze Files**. Once you have components that are working and tested, freeze them so the AI stops rewriting them and reintroducing problems you already fixed.

### Bolt

Gear icon at the top center, then **All project settings**, then **Knowledge**. You get a project-specific field and a global system prompt field. Paste the core file into the project field, or the global one if you want it on everything you build. The project must be open and Bolt must not be mid-build for the save to work ([Bolt project settings documentation](https://support.bolt.new/settings/project-settings)).

Bolt also has account-level and team-level Knowledge if you are working with other people.

One warning. Older guides tell you to create a `.bolt/prompt` file. That is legacy advice from the previous agent version and the current documentation points to the Knowledge fields instead. Use the UI.

### v0 by Vercel

Open your project, then **Knowledge**. There are two different things there and the difference matters.

**Instructions** are sent with every single message. Put the core rules there.

**Sources** are only pulled in when v0 decides they are relevant. That is the wrong place for rules you want applied unconditionally ([Vercel community discussion](https://community.vercel.com/t/custom-instructions-in-v0/16782)).

There is also an account-level custom instructions field in Settings if you want it across all your projects, and a separate saved-prompt feature called Instructions that you trigger manually with the plus button in the prompt bar ([v0 documentation](https://v0.app/docs/instructions)). Do not rely on the manual one for this.

### Figma Make

This one is nicer than most. Open the file explorer, go to **Code view**, find the **guidelines** folder, and there is a file called `Guidelines.md` that was created empty when you started the project.

You can **upload a markdown file directly into that folder**, so you can drop in the real `ACCESSIBILITY.md` rather than pasting a summary. Drag it in, or use **Upload**. You can upload more than one file, and Figma's own guidance is that several short guideline files beat one enormous one, so splitting by topic is fine and supported ([Figma guidelines documentation](https://help.figma.com/hc/en-us/articles/33665861260823-Add-guidelines-to-Figma-Make), [Figma design system guidelines](https://developers.figma.com/docs/code/write-design-system-guidelines/)).

Figma does not document a read order between the files in that folder. If you upload more than one, say inside `Guidelines.md` which files you added and when Make should apply each, because Figma's guidance is to state that yourself rather than assume a priority.

This is the one route that gets the complete 167 KB reference into a Figma surface. The custom skill below is a condensed 55 KB build, so if you are working in Make and you want everything, use the guidelines folder.

### Figma Design

There is no guidelines folder in a Figma Design file. The only route is a **custom skill**, which works in both Figma Design and Figma Make.

It has to be a single `.md` file. Figma does not support the `references/`, `scripts/`, or `assets/` subfolders that agent skills normally allow, so the folder build in this repository will not load here ([Figma custom skills documentation](https://help.figma.com/hc/en-us/articles/40283639496599-Custom-skills-for-the-Figma-agent-and-Figma-Make)).

Use `skills/figma/ai-a11y-toolkit.md`. Click in the prompt box, select **Skills**, then **Add skill**, then drag the file in or click **Upload a file**. Review the name and content and click **Add**. The name becomes the slash command, so invoke it with `/ai-a11y-toolkit`.

Once added it stays available across all your files, so this is a one time setup rather than something you redo per project.

It is also published on the [Figma Community](https://www.figma.com/community/skill/76094/ai-a11y-toolkit-wcag-22-aa) if you would rather copy it from there. Community skills are not one click installs, so either way you are adding it by hand.

There is a second skill for the opposite direction. `skills/figma/ai-a11y-toolkit-review.md`, published as [AI A11y Toolkit: Review](https://www.figma.com/community/skill/76247), measures a file you already have instead of producing new work. It runs as `/ai-a11y-toolkit-review`, reports rather than edits, and scores only the three criteria a static design file actually determines. Add both. Figma invokes one skill per prompt, so the one you name is the one that runs, and a skill cannot hand off to the other mid-answer.

Custom skills need a paid plan. A **Full seat** covers Figma Design and Figma Make files, and View, Dev, or Collab seats can only use it in Drafts. You also need edit access to the file.

If your coding agent reaches Figma through the Figma MCP server, that is a different mechanism with a confusingly similar name. The skill lives in your agent, not in Figma, so use the folder build there instead.

### Replit

Replit reads a file called `replit.md` from your project root. It has to be in the root, not a subfolder. If you started with Replit Agent, one already exists and you can add to it. If not, create it ([Replit documentation](https://docs.replit.com/replitai/replit-dot-md)).

You can paste the full `ACCESSIBILITY.md` content into it, though Replit warns that extremely large files may not be fully processed, so if the build starts ignoring rules, switch to the core version.

### ChatGPT

Three options, in order of how well they work for this.

**A Project** is best. Create one, use **Add files** to upload `ACCESSIBILITY.md`, then the three-dot menu, **Project settings**, **Add project instructions**, and paste the core rules there. Project instructions override your global custom instructions inside that project. File limits depend on your plan, from 5 files on free up to 40 on Pro and Business tiers ([Projects in ChatGPT](https://help.openai.com/en/articles/10169521-projects-in-chatgpt)).

**A Custom GPT** works well if you want to hand this to other people, for example workshop attendees. Upload `ACCESSIBILITY.md` as a Knowledge file, up to 20 files allowed, and put the core rules in the Instructions field ([Creating a GPT](https://help.openai.com/en/articles/8554397-creating-a-gpt)).

**Global custom instructions**, under Settings then Personalization, apply everywhere but are capped at a few thousand characters, so only a heavily trimmed excerpt fits. Treat this as a backstop, not the real answer, and check the current limit since it changed recently ([ChatGPT custom instructions](https://help.openai.com/en/articles/8096356-chatgpt-custom-instructions)).

### Claude.ai

Create a **Project**. Upload `ACCESSIBILITY.md` to the project knowledge base, and put a short version in the **Project instructions** field, which is separate. Both apply to every chat inside that project ([Claude.ai Projects](https://support.claude.com/en/articles/9517075-how-can-i-organize-my-chats-into-projects)).

---

## Part 3: Code tools

If you have a repo, commit `ACCESSIBILITY.md` at the root. Then point your tool at it. Committing it means the rules travel with the project, survive a new machine, and apply to your teammates too.

### Claude Code

Claude Code reads `CLAUDE.md`, not `ACCESSIBILITY.md`. It supports importing other files with an `@path` reference, which is the clean solution because you keep one canonical rules file.

Create `CLAUDE.md` at your project root containing:

```markdown
# Project instructions

@ACCESSIBILITY.md

Accessibility rules above are hard constraints. Before generating any UI, complete the
project configuration in Section 0 and run the build loop in Section 14.
```

Imports resolve up to four levels deep. Anthropic recommends keeping each individual `CLAUDE.md` under about 200 lines, which is another reason to import rather than paste. You can also split rules into topic files under `.claude/rules/`, and scope them to file patterns with a `paths` field in frontmatter. Run `/context` to confirm the file actually loaded ([Claude Code memory documentation](https://docs.claude.com/en/docs/claude-code/memory)).

### Cursor

Cursor reads `.mdc` files from a `.cursor/rules` folder. A plain `.md` file dropped in that folder is **ignored**, because it has no frontmatter. So create `.cursor/rules/accessibility.mdc`:

```
---
description: WCAG 2.2 AA accessibility rules for all UI work
alwaysApply: true
---

[paste ACCESSIBILITY-CORE.md content here, or the full file]
```

`alwaysApply: true` puts it in every chat. You can also create it through the UI under Customize, then Rules, then Add Rule, and pick "Always Apply" from the dropdown. Cursor also reads a root `AGENTS.md`, which it describes as a simpler tool-agnostic alternative. The old single-file `.cursorrules` still works but is officially on the way out ([Cursor rules documentation](https://cursor.com/docs/context/rules)).

### GitHub Copilot

Create `.github/copilot-instructions.md`. Paste the rules in, or reference the full file from it. That covers the whole repository.

For rules that should only apply to certain folders, create `.github/instructions/accessibility.instructions.md`. The filename must end in `.instructions.md` and the file must start with frontmatter containing an `applyTo` glob:

```
---
applyTo: "src/components/**,src/app/**"
---
```

Path-specific instructions currently apply to the Copilot coding agent and code review rather than general chat, so keep the repo-wide file as your main mechanism. To confirm it is being used, expand the References list on a Copilot response and look for the instructions file ([GitHub Copilot custom instructions](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions)).

### Windsurf

Create `.devin/rules/accessibility.md` in your workspace. That is the current preferred location, and `.windsurf/rules/` still works as a fallback. Add a `trigger: always_on` frontmatter field so it applies to everything.

Workspace rule files cap at **12,000 characters each**, so the core file fits and the full file does not. If you want it across every project, the global file is `~/.codeium/windsurf/memories/global_rules.md`, capped at **6,000 characters**. Access both through the Customizations icon in Cascade or the Windsurf Settings Rules panel ([Windsurf rules and memories documentation](https://docs.windsurf.com/windsurf/cascade/memories)).

### OpenAI Codex

Codex reads `AGENTS.md` and merges them from the repo root down to your working directory, with closer files winning. Put the rules in a root `AGENTS.md`, or reference the separate file from it. Default size cap is 32 KiB, adjustable with `project_doc_max_bytes` ([Codex AGENTS.md guide](https://developers.openai.com/codex/guides/agents-md.md)).

### Gemini CLI and Antigravity

Gemini CLI reads `GEMINI.md`, and supports `@file.md` imports so you can point at `@ACCESSIBILITY.md`. You can switch it to read `AGENTS.md` instead with `.gemini/settings.json` containing `{ "context": { "fileName": "AGENTS.md" } }`. Use `/memory show` to see what actually loaded ([Gemini CLI documentation](https://geminicli.com/docs/cli/gemini-md/)).

Antigravity reads either `GEMINI.md` or `AGENTS.md` at the workspace root and parses it on startup ([Antigravity best practices](https://antigravity.google/docs/cli/best-practices)).

### If your tool is not listed

Try a root `AGENTS.md`. It is an open convention now stewarded by the Agentic AI Foundation under the Linux Foundation, and the official site lists support across a couple of dozen tools including Codex, Cursor, Copilot's coding agent, Windsurf, Jules, Zed, Warp, Aider, JetBrains Junie, and VS Code ([agents.md](https://agents.md/)). If that does not work, search your tool's documentation for "custom instructions", "rules", "knowledge", or "system prompt".

---

## Part 4: Your first prompt

Once the file is in place, send this before you ask for anything else. It confirms the rules loaded and forces the design system question up front.

```
Before we build anything, confirm you have the accessibility rules for this project.

1. Quote me the rule about focus indicators, word for word, from the rules file.
2. Tell me which design system, component library, and token source this project uses.
   If that is not declared anywhere, ask me instead of choosing for me.
3. Confirm you will run an automated accessibility check after generating UI, fix what it
   finds at the source, and write anything a scanner cannot judge into
   docs/accessibility/MANUAL-TESTING.md.

Do not generate any code yet.
```

If it cannot quote the rule, the file did not load. Go back to Part 2 or Part 3 and check you used the durable field, not the chat.

If it names a design system you never mentioned, or it says "Tailwind" and stops there, it is guessing. Tailwind is styling only and contains no accessible components. Answer the question properly before letting it build.

---

## Part 5: Prompts for during the build

Keep these handy. Copy, paste, adjust.

**Starting a new component**

```
Build [component]. Before you write code:
- Name the primitive from our design system you are using, or tell me none exists.
- List the keyboard interactions this component must support.
- List the ARIA roles, states, and properties you will use and why.
Then build it, then run the accessibility check, then add the manual test entries.
```

**Reviewing something already built**

```
Audit the current UI against the accessibility rules file. For each finding give me:
the rule or criterion, the file and line, the user impact in one sentence, and the fix.
Order by user impact, not by how easy the fix is. Do not fix anything yet.
```

**When it hands you something suspicious**

```
Show me the rendered HTML for [component]. For every interactive element, tell me its
element type, its accessible name, its role, and how it is reached by keyboard.
```

**Before you ship**

```
Generate docs/accessibility/MANUAL-TESTING.md covering everything we built in this session.
Follow the template in Section 14.7 of the accessibility rules. For every item, state what
to test, how to test it, and the expected result. Do not mark anything as passed.
```

**When it argues with you**

```
That is a visual preference. The rule is a constraint. Give me a version that satisfies
the rule, then tell me what you would need to change about the visual design to get closer
to what I originally asked for.
```

---

## Part 6: When it ignores the rules anyway

It will happen. The rules are long, the context window is finite, and these models drift over a long session. Fixes in order of effectiveness.

1. **Check the file actually loaded.** Ask it to quote a specific rule. Most "it ignored the rules" situations are really "the rules were never there".
2. **Use the durable field, not the chat.** Worth checking twice, because it is the most common cause.
3. **Start a fresh session for big new work.** Long sessions degrade. A new session rereads the rules file cleanly.
4. **Shorten what you gave it.** If you pasted the full file into a field meant for a summary, it may be truncated silently. Switch to `ACCESSIBILITY-CORE.md`.
5. **Re-anchor mid-session.** Paste the ten most relevant rules again with "these still apply".
6. **Ask why.** "You used a div with a click handler. The rules prohibit that. What happened?" Models often correct themselves and the correction sticks better than a rule restated.
7. **Freeze what works.** On platforms with that feature, lock finished components so they stop being rewritten.

---

## Part 7: What this does not do

Being direct, because the alternative is a false sense of security.

- **It does not make your product accessible.** It removes a large class of predictable defects. That is meaningful and it is not the same thing.
- **Automated checks find roughly a third of accessibility problems.** The rest need a human. That is why the manual test file exists.
- **An AI cannot tell you whether your alt text is accurate**, whether your headings describe your content, whether your focus order makes sense, or whether your error message is understandable. Those are judgment calls.
- **Nothing here replaces testing with disabled people**, paid for their time, on their own devices and their own settings.
- **Do not let your AI tell you the output is compliant.** It does not know. Neither does the scanner. Conformance is a claim you make about a product, with evidence, after testing.

Used well, this gets you to a build where the remaining problems are the interesting ones instead of the embarrassing ones.

---

## Part 8: If you are running a workshop

A suggested sequence, tuned for a room where people have different tools.

1. Have everyone install the file **before** they build anything. Fifteen minutes, and it is the whole point of the session.
2. Everyone runs the Part 4 activation prompt and reads their answer aloud. The design system question exposes a lot immediately.
3. Everyone builds the same small thing. A modal, a product card, and a filter control cover most of the failure modes in one exercise.
4. Everyone runs the automated check and reports their count. Comparing counts across platforms is more instructive than any slide.
5. Turn off the mouse for the last ten minutes. Keyboard only. This is the moment people actually change their minds.
6. Finish on the manual test file. The takeaway is not that AI can make things accessible. It is that AI can tell you honestly what still needs a person.

---

## Files in this set

| File | Use it for |
| --- | --- |
| `START-HERE.md` | This file. Installation and prompts. |
| `ACCESSIBILITY-CORE.md` | About 7,000 characters. For platform text fields with limits. |
| `ACCESSIBILITY.md` | The full reference, 18 sections. Commit it to a repo, or read it as a human. |
| `skills/ai-a11y-toolkit/` | For coding agents that support agent skills. A routing file plus one reference file per task. |
| `skills/figma/ai-a11y-toolkit.md` | A single file, 55 KB. The custom skill build for Figma Design and Figma Make. |

Every file, and the current release, is at https://danarandall.com/ai-a11y-toolkit

### Two asks

**Tell me what you are building with.** There is a short optional form on that page. Twenty seconds, no email needed. Knowing which tools people actually use is how I decide which of these fifteen platform sections to keep maintaining.

**Tell me when it breaks.** These products change their settings menus, rename their rules files, and shift character limits without notice. If a step here no longer matches what you see on screen, that is a bug in this file and I want to know: https://danarandall.com/ai-a11y-toolkit#feedback

### License

Licensed under [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/) (CC BY 4.0). Share it, adapt it, teach with it, use it commercially. The condition is attribution.

If you are adapting these files for a team or a client, keep a line like this in them:

```
Adapted from the AI A11y Toolkit by Dana Randall, licensed CC BY 4.0.
https://github.com/danarandall/ai-a11y-toolkit
```

Release 2026.08. Author: Dana Randall. Target standard: WCAG 2.2 Level AA.
