# Agent skills

The AI A11y Toolkit packaged as an agent skill, for tools that support the
skill format: Claude Code, Cursor, Codex, and others.

A skill differs from the plain markdown files in the root of this repository in
one way that matters. The agent loads `SKILL.md` and pulls in a reference file
only when the work calls for it, so the rules for the task at hand arrive
without the other 25,000 words competing for attention.

There are two builds, because tools differ on what they accept.

| Build | For | Shape |
| --- | --- | --- |
| `ai-a11y-toolkit/` | Claude Code, Cursor, Codex | A routing `SKILL.md` plus thirteen reference files |
| `figma/ai-a11y-toolkit.md` | Custom skills for the Figma agent and Figma Make | One self-contained file, 55 KB |
| `figma/ai-a11y-toolkit-core.md` | The same, when the 55 KB file will not save | One file, 12 KB |

Figma custom skills must be a single Markdown file and do not support
`references/`, `scripts/`, or `assets/` directories, so the Figma builds inline
the sections that carry the most weight and link here for the rest. Figma does
not document a size limit and a large file can fail to save, which is why there
is a smaller core build carrying the non-negotiables and the agent directives.

A note on the folder build and Figma, because it is easy to assume otherwise.
Figma does not read this repository and does not load the folder build. Two
separate things share the word skill. A [Figma custom skill](https://help.figma.com/hc/en-us/articles/40283639496599-Custom-skills-for-the-Figma-agent-and-Figma-Make)
is a single file you add inside Figma, and it is what the `figma/` build is for.
A [Figma skill for MCP](https://help.figma.com/hc/en-us/articles/39166810751895-Figma-skills-for-MCP)
installs into your coding agent, not into Figma, and lets that agent read your
Figma files. If you are working in Figma itself, use the `figma/` build.

## What is here

```
ai-a11y-toolkit/
  SKILL.md                        always loaded: the thirteen non-negotiables and the routing table
  references/
    agent-directives.md           the full always and never list, in directive form
    project-configuration.md      declare the project context once
    design.md                     designers, interface consistency, design systems
    color.md                      contrast and color independence
    motion-media-targets.md       motion, video, target size, zoom, reflow
    alt-text.md                   images, icons, charts, decorative art
    content-and-language.md       clear language and generated copy
    html-css.md                   semantic structure, focus, forms
    react.md                      components, state, focus management, routing
    testing.md                    the build loop and the manual queue
    wcag-reference.md             every Level A and AA criterion
    failure-patterns.md           defects that recur in generated code
    attribution.md                license and how to credit this work
```

```
figma/
  ai-a11y-toolkit.md              non-negotiables, design file scope, design systems,
                                  designers, prompting, agent directives, failure
                                  patterns, verification
  ai-a11y-toolkit-core.md         non-negotiables, design file scope, agent directives
```

## Installing it

Copy the `ai-a11y-toolkit` directory into the skills folder your tool reads.
If you are not sure where that is, ask your agent to install it. Agents know
where skills live in their own environment.

You can also point your agent at this repository and ask it to install the
skill from `skills/ai-a11y-toolkit`.

### Figma

The skill is published on the Figma Community, which is the shortest route:
[AI A11y Toolkit: WCAG 2.2 AA](https://www.figma.com/community/skill/76094/ai-a11y-toolkit-wcag-22-aa).
Community skills are not a one click install. Open the listing, copy the
instructions, and add them in Figma using the steps below.

To install from this repository instead, use `figma/ai-a11y-toolkit.md`. In a
chat in Figma, click the prompt box, select Skills, select Add skill, then drag
in the file or use Upload a file, review it, and click Add. If it will not save,
try `figma/ai-a11y-toolkit-core.md`.

The skill name becomes the slash command, so it runs as `/ai-a11y-toolkit`. Once
added it stays available across all your files rather than only the one you added
it from.

Figma requires a paid plan. A Full seat can chat with the agent in Figma Design
and Figma Make files. A View, Dev, or Collab seat can only do so in Drafts. You
also need edit access to the file you are working in.

## Keeping the builds in sync

Both builds are generated from `ACCESSIBILITY.md`, so neither can drift from
the source. Edit `ACCESSIBILITY.md`, then rerun both scripts:

```
python3 tools/build-skill.py
python3 tools/build-figma-skill.py
```

Do not hand-edit anything under `ai-a11y-toolkit/references/` or
`figma/`, because the next build overwrites it. `SKILL.md` is authored by hand
and `tools/build-skill.py` leaves it alone.

Written by Dana Randall. Licensed CC BY 4.0.
