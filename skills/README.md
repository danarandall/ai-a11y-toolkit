# Agent skills

The AI A11y Toolkit packaged as an agent skill, for tools that support the
skill format: Claude Code, Cursor, Codex, the Figma MCP server, and others.

A skill differs from the plain markdown files in the root of this repository in
one way that matters. The agent loads `SKILL.md` and pulls in a reference file
only when the work calls for it, so the rules for the task at hand arrive
without the other 25,000 words competing for attention.

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

## Installing it

Copy the `ai-a11y-toolkit` directory into the skills folder your tool reads.
If you are not sure where that is, ask your agent to install it. Agents know
where skills live in their own environment.

You can also point your agent at this repository and ask it to install the
skill from `skills/ai-a11y-toolkit`.

## Keeping the two in sync

The reference files are extracted verbatim from `ACCESSIBILITY.md` by
`tools/build-skill.py`. Edit `ACCESSIBILITY.md`, then rerun the script. Do not
hand-edit the reference files, because the next build overwrites them.
`SKILL.md` is authored by hand and the script leaves it alone.

Written by Dana Randall. Licensed CC BY 4.0.
