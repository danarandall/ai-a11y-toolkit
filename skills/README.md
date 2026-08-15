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
| `figma/ai-a11y-toolkit-review.md` | Reviewing an existing Figma selection rather than producing new work | One file, 13 KB |

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

That is about skills specifically. Figma Make separately has a `guidelines` folder
in Code view that accepts uploaded markdown, so a file from this repository does
reach Make by that route. See the Figma Make section of
[`START-HERE.md`](../START-HERE.md).

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
  ai-a11y-toolkit-review.md       read-only review of an existing selection: what a file
                                  determines, influences, and cannot affect; how to measure
                                  each; the finding format; severity bands; report shape
```

## The two Figma skills

The toolkit and the review are separate skills because Figma invokes one skill
per prompt. [Figma documents](https://help.figma.com/hc/en-us/articles/40283639496599-Custom-skills-for-the-Figma-agent-and-Figma-Make)
that if more than one skill is mentioned in a single prompt, only the first is
used. So neither file can depend on the other being loaded, and the review build
repeats what it needs rather than pointing at the main file.

Install both. Use them in sequence.

| You are | Invoke |
| --- | --- |
| Designing, generating, or building something new | `/ai-a11y-toolkit` |
| Measuring something that already exists | `/ai-a11y-toolkit-review` |

Their triggers are written not to overlap. The main skill's description covers
creating, editing, and generating. The review's covers reviewing, auditing, and
checking. Figma documents no conflict resolution when two skills claim the same
trigger, so the separation is deliberate and both descriptions should be kept
disjoint if either is edited.

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

In a Figma Design file a custom skill is the only route, because there is no
guidelines folder there. In Figma Make you have both, and the guidelines folder
takes the full 167 KB `ACCESSIBILITY.md` rather than this condensed build, so
prefer it when you want the complete reference.

## Keeping the builds in sync

Both builds are generated from `ACCESSIBILITY.md`, so neither can drift from
the source. Edit `ACCESSIBILITY.md`, then rerun both scripts:

```
python3 tools/build-skill.py
python3 tools/build-figma-skill.py
```

Do not hand-edit `figma/ai-a11y-toolkit.md`, `figma/ai-a11y-toolkit-core.md`,
or anything under `ai-a11y-toolkit/references/`, because the next build
overwrites them. To change what the Figma skill says about itself, including
its `description`, edit `tools/build-figma-skill.py` and rebuild.

Two files in those directories are authored by hand and no build touches them:
`ai-a11y-toolkit/SKILL.md` and `figma/ai-a11y-toolkit-review.md`. The review
build is hand-authored because it is a procedure rather than a set of rules, so
it has no corresponding section in `ACCESSIBILITY.md` to generate from.

Written by Dana Randall. Licensed CC BY 4.0.
