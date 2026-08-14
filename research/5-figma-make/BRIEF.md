# Brief: sourdough bakery landing page

All four arms of this study received the same prompt, reproduced here in full:

> design a landing page for a sourdough bakery

That is the entire brief. Seven words, typed into the prompt box.

## Why it is this short

The earlier studies used long structured briefs that named the files to produce,
the framework, the component contract, and the brand. That is a fair test of a
coding agent, which is given a specification and asked to implement it.

It is not how anyone uses a design tool. People open Figma and describe what they
want in a sentence. A brief that enumerated required sections, target sizes, or a
color palette would have been testing the brief rather than the toolkit, because
half of what the toolkit does is supply the decisions the person did not think to
ask for.

So this study deliberately gives the tool almost nothing and measures what it
fills in.

## What the prompt does not say

The prompt does not mention accessibility, WCAG, contrast, target size, alt text,
landmarks, keyboard use, or motion. It does not mention users, disability, or
compliance. Nothing in it should cause a tool to consider any of it.

It also names no sections, no page structure, and no content. Every difference in
what the four arms chose to build is the tool's decision, not an instruction.

## The four arms

The only variable is whether the toolkit was installed before the prompt was sent.
Two arms had it and two did not.

| Arm | Surface | Toolkit installed |
| --- | --- | --- |
| Make control | Figma Make | No |
| Make treatment | Figma Make | Yes, as the published custom skill |
| Design control | Figma Design, page `10:2` | No |
| Design treatment | Figma Design, page `0:1` | Yes, as the published custom skill |

Both treatments used the skill as published on the
[Figma Community](https://www.figma.com/community/skill/76094/ai-a11y-toolkit-wcag-22-aa),
not a local file, so they test what a reader would actually install. The treatments
invoked it with `/ai-a11y-toolkit`. The controls invoked nothing.

Both design arms are pages in one file,
[AI A11y Toolkit](https://www.figma.com/design/K2UUFuil7G3IqbUP0ZP01F/AI-A11y-Toolkit),
so neither arm can be explained by a difference in file settings or libraries.

## What this brief costs the study

A seven word prompt is realistic, and it is also the source of this study's
largest confound. Because no sections were specified, the arms built different
pages, and four rubric checks are unscoreable on the Make control for that reason.
A longer prompt would have removed the confound and made the test less like real
use. This study chose realism, and pays for it in four unscoreable checks.

That tradeoff is stated again in the study
[README](README.md), and a future run should consider a middle path: name the
required sections, still say nothing about accessibility.

Written by Dana Randall in a personal capacity. Licensed CC BY 4.0.
