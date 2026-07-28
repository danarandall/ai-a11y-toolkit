# Changelog

## 2026.07

### Updated 27 July 2026, file version 1.12

Changes made after field-testing the toolkit against a production application that was built entirely with AI tooling. Every addition below comes from a defect the trial actually surfaced.

- **New in Section 14.3, proving a scan ran.** A scanner reports on whatever was in the DOM when it looked, so gates, hash routing, async data, and lazy rendering can all produce a clean result from a page that was never examined. Adds assertions, a minimum rendered-character check, and guidance on why a zero result is a question rather than an answer.
- **New in Section 11, injected markup.** `dangerouslySetInnerHTML`, `v-html`, `{@html}`, and `innerHTML` are invisible to `eslint-plugin-jsx-a11y` because linting reads source, not runtime strings. Adds a normalise-at-the-boundary pattern. One injection site in the trial produced 321 unnamed graphics on a single page.
- **New in Section 7.8, auditing colour tokens as data.** Contrast review done by looking at screens misses failing borders and inputs. Adds a procedure that separates the 4.5:1 text criterion from the 3:1 non-text criterion in 1.4.11, and checks every theme. Three engines reported none of the six failing tokens found in the trial.
- **Five new rows** in the Section 17 table of common AI-generated failure patterns.
- Matching condensed guidance added to `ACCESSIBILITY-CORE.md`.

### First public release

- `ACCESSIBILITY.md`, the full WCAG 2.2 Level AA reference in 18 sections
- `ACCESSIBILITY-CORE.md`, condensed for fields with character limits
- `START-HERE.md`, install and prompting guide for 15 AI platforms

Platform instructions verified against each tool's published documentation in July 2026. If a step no longer matches what you see, please open an issue.
