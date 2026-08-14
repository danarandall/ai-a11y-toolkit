# Project configuration

Declare the project context once so the rules resolve to specific answers.

Part of the AI A11y Toolkit by Dana Randall. Licensed CC BY 4.0.
Full reference: https://github.com/danarandall/ai-a11y-toolkit

---

## Section 0: Project configuration

**Fill this in before anyone, human or AI, generates a single component.** Sections 4 and 5 tell you to use a design system consistently. This is where you say which one. An agent that does not know your system will invent one, and it will invent it badly.

Copy this block into the top of your project instruction file and complete it. Leave a field blank only if it genuinely does not apply, and write `none` rather than deleting the line, so the gate below can tell the difference between "not applicable" and "not answered".

```yaml
# PROJECT ACCESSIBILITY CONFIG
# Required by ACCESSIBILITY.md. Agents: read this before generating UI.

design_system:
  name:                  # "Radix Primitives + Acme tokens", "Carbon v11", "Acme DS 4.2"
  type:                  # in-house | open-source | hybrid | none-yet
  docs_url:              # where the component documentation lives
  component_source:      # npm package name, monorepo path, or git URL
  tokens_source:         # path or URL to the token file, e.g. ./design/tokens.json
  figma_library_url:     # published library, so design and code agree
  styling_layer:         # Tailwind v4 | CSS Modules | vanilla-extract | plain CSS
  primitives_layer:      # accessible headless component library, if separate from styling
  icon_set:
  conformance_evidence:  # VPAT, ACR, or accessibility statement URL, or "none"
  known_gaps:            # components you already know are not accessible yet

project:
  target_standard: WCAG 2.2 Level AA
  platforms:             # web | iOS | Android | email | native desktop
  locales:               # affects text expansion, RTL, and reading level
  browser_support:
  supported_assistive_tech:   # the pairings you actually test, see Section 15
  motion_policy: reduced-by-default   # see Section 3
  minimum_target_size: 44   # CSS pixels, see 3.5

automation:
  scan_command: npm run a11y     # see Section 14
  blocking_levels: violation, potentialviolation   # see 14.5
  manual_queue: ./docs/accessibility/MANUAL-TESTING.md
  scan_viewports: 320, 1280      # scanning only at desktop hides reflow failures

review:
  accessibility_owner:   # a named person, not a team
  audit_date:
  escalation_path:       # where a user reports a barrier
```

### 0.1 Agent gate, paste this with the config

```
GATE: DESIGN SYSTEM MUST BE DECLARED

Before generating, scaffolding, refactoring, or styling any user interface:

1. Read the PROJECT ACCESSIBILITY CONFIG block.
2. If design_system.name is blank, or type is "none-yet", or component_source is blank:
   STOP. Do not generate components. Do not pick a library on the author's behalf.
   Do not scaffold "temporary" markup that will be replaced later.
3. Ask the author, verbatim:

   "Before I build UI, I need to know which design system to use. Please pick one:
    (a) You have an in-house design system. Give me the docs URL, the package name or
        repo path, and the token file. If it is not published, paste or attach the token
        file and the component list.
    (b) You want to use an open source system. Name it, or ask me to recommend one from
        Section 4.3 of ACCESSIBILITY.md and I will summarize the tradeoffs.
    (c) You have a Figma library. Share the published library URL, or attach the token
        export, and tell me whether the code side already exists.
    (d) There is no system yet. I will use tested accessible primitives from Section 4.3
        and define tokens as we go, and I will record the choice in this file.
    Also tell me the styling layer, since it is a separate decision from the components."

4. Record the answer back into the config block in this file, then proceed.
5. If the author says to just start building, use option (d) and say plainly which
   primitives and tokens you introduced, so the decision is visible rather than buried.

Never silently choose a component library. Never mix two of them. Never hand-roll a
dialog, combobox, menu, tabs, tooltip, date picker, or carousel because the system was
not declared.
```

### 0.2 Author's picker

For the human filling this in. Tick one per column. The two columns are independent choices, which is the part teams most often get wrong.

**Component layer, this is the accessibility decision**

- [ ] In-house design system, already built and documented
- [ ] In-house design system, exists in Figma only, no code yet
- [ ] Open source accessible primitives, see Section 4.3
- [ ] Open source full component library, see Section 4.3
- [ ] Nothing yet, pick one from Section 4.3 and record it here

**Styling layer, this is a preference decision**

- [ ] Tailwind
- [ ] CSS Modules or plain CSS with custom properties
- [ ] A CSS-in-JS or compiled solution such as vanilla-extract
- [ ] Whatever the design system ships

### 0.3 Tailwind is not a design system

Worth stating flatly, because it is the single most common cause of an inaccessible AI-generated interface.

Tailwind is a styling layer. It ships utility classes. It ships **no components, no roles, no focus management, no keyboard behavior, and no accessibility semantics whatsoever.** "We use Tailwind" answers the styling question and leaves the component question completely open. When an agent hears "Tailwind" and nothing else, it hand-rolls a `div` with an `onClick` and calls it a button.

So declare both layers. Tailwind plus a tested primitives library is a good stack. Tailwind alone is not a stack, it is a paint job.

The same applies to any CSS framework, any component kit sold on visual appeal, and any AI-generated component gallery. If it does not document keyboard interaction, focus management, and screen reader behavior per component, it is a styling layer regardless of what it calls itself.

### 0.4 What "attach" means here

A markdown file cannot render an upload button. What it can do is name the destination, so an attachment has somewhere to go and an agent knows what to ask for. Give your team and your tools a fixed location for each of these:

| Artifact | Conventional location | Why the agent needs it |
| --- | --- | --- |
| Design tokens | `./design/tokens.json` | Prevents arbitrary hex and spacing values |
| Component inventory | `./design/components.md` | Prevents rebuilding something that exists |
| Figma library link | In the config block above | Keeps design and code naming aligned |
| Accessibility statement, VPAT, or ACR | `./docs/accessibility/` | Tells you which gaps are already known |
| Manual test queue | `./docs/accessibility/MANUAL-TESTING.md` | Generated by the agent, see 14.6 |
| Scan reports | `./reports/accessibility/` | Evidence, and a diff between builds |
| This file | Repo root, as `ACCESSIBILITY.md` | The rules themselves |
| Tool-specific copy | `AGENTS.md`, `CLAUDE.md`, `.cursor/rules/`, `.github/copilot-instructions.md` | Whatever your assistant actually reads |

If your assistant supports connecting to a live source, for example a Figma integration or a documentation server, connect it and record that in `docs_url` rather than pasting a stale token dump. If it does not, export the tokens and commit them. A committed export that is three weeks old still beats an agent guessing.

---
