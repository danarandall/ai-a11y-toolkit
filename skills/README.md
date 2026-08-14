# Agent skills

The AI A11y Toolkit packaged as an agent skill, for tools that support the
skill format: Claude Code, Cursor, Codex, the Figma MCP server, and others.

A skill differs from the plain markdown files in the root of this repository in
one way that matters. The agent loads `SKILL.md` and pulls in a reference file
only when the work calls for it, so the rules for the task at hand arrive
without the other 25,000 words competing for attention.

There are two builds, because tools differ on what they accept.

| Build | For | Shape |
| --- | --- | --- |
| `ai-a11y-toolkit/` | Claude Code, Cursor, Codex, the Figma MCP server | A routing `SKILL.md` plus thirteen reference files |
| `figma/ai-a11y-toolkit.md` | Custom skills for the Figma agent and Figma Make | One self-contained file, 28 KB |
| `figma/ai-a11y-toolkit-core.md` | The same, when the 28 KB file will not save | One file, 12 KB |

Figma custom skills must be a single Markdown file and do not support
`references/`, `scripts/`, or `assets/` directories, so the Figma builds inline
the sections that carry the most weight and link here for the rest. Figma does
not document a size limit and a large file can fail to save, which is why there
is a smaller core build carrying the non-negotiables and the agent directives.

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
  ai-a11y-toolkit.md              non-negotiables, design file scope, prompting,
                                  agent directives, failure patterns, verification
  ai-a11y-toolkit-core.md         non-negotiables, design file scope, agent directives
```

## Installing it

Copy the `ai-a11y-toolkit` directory into the skills folder your tool reads.
If you are not sure where that is, ask your agent to install it. Agents know
where skills live in their own environment.

You can also point your agent at this repository and ask it to install the
skill from `skills/ai-a11y-toolkit`.

For the Figma agent or Figma Make, upload `figma/ai-a11y-toolkit.md` from the
chat sidebar: click the prompt box, select Skills, select Add skill, then upload
the file. If it will not save, try `figma/ai-a11y-toolkit-core.md`.

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
