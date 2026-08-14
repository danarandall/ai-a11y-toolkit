# Attribution and reuse

License terms, how to credit this work, and how to report a problem with it.

Part of the AI A11y Toolkit by Dana Randall. Licensed CC BY 4.0.
Full reference: https://github.com/danarandall/ai-a11y-toolkit

---

## Attribution and reuse

Created by **Dana Randall**, creative director and designer working at the intersection of accessibility, brand, and AI-native design.

Use it, fork it, adapt it for your team, put it in your repos, hand it to your AI tools, and use it commercially. If you improve it, tell me what you changed.

### License

Licensed under [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/) (CC BY 4.0).

You are free to share and adapt this material for any purpose, including commercially. The one condition is attribution: credit Dana Randall, link to the license, and indicate if you made changes.

A line like this is enough:

```
Adapted from the AI A11y Toolkit by Dana Randall, licensed CC BY 4.0.
https://github.com/danarandall/ai-a11y-toolkit
```

If you paste these rules into an internal tool or a client project, keep that line in the file. That is both the license condition and, practically, how other people find their way back to the current version.

Full license text: https://github.com/danarandall/ai-a11y-toolkit/blob/main/LICENSE

### Sourcing

Everything here is written in original language. This file cites publicly available sources and links to them, because reading the original is always better than reading my summary of it. It does not reproduce anyone's text.

Where a rule comes from WCAG, the success criterion is named so you can go read it. Where guidance comes from a practitioner's published work, they are credited by name with a link. Facts and requirements are not anyone's property. The words used to explain them are, and those words here are mine.

Tools and resources are recommended on merit, weighted toward open source and toward things you can use without an account. Where a commercial platform is mentioned, it is mentioned because it does something the open source options do not, and it is always marked optional.

### Primary sources

- [Web Content Accessibility Guidelines (WCAG) 2.2, W3C Recommendation](https://www.w3.org/TR/WCAG22/)
- [What's New in WCAG 2.2, W3C WAI](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)
- [How to Meet WCAG, Quick Reference, W3C WAI](https://www.w3.org/WAI/WCAG22/quickref/)
- [ARIA Authoring Practices Guide, W3C](https://www.w3.org/WAI/ARIA/apg/)
- [Understanding WCAG 2.2, W3C](https://www.w3.org/WAI/WCAG22/Understanding/)
- [Using ARIA, W3C](https://www.w3.org/TR/using-aria/)
- [Understanding SC 3.2.3 Consistent Navigation, W3C](https://www.w3.org/WAI/WCAG22/Understanding/consistent-navigation.html)
- [Understanding SC 3.2.4 Consistent Identification, W3C](https://www.w3.org/WAI/WCAG22/Understanding/consistent-identification.html)
- [Understanding SC 3.2.6 Consistent Help, W3C](https://www.w3.org/WAI/WCAG22/Understanding/consistent-help.html)
- [USWDS Accessibility and conformance report](https://designsystem.digital.gov/documentation/accessibility/)
- [GOV.UK Design System Accessibility](https://design-system.service.gov.uk/accessibility/)

### Further reading

- [Accessible Design Principles and Heuristics](https://www.levelaccess.com/resources/accessible-design-principles-and-heuristics/), Karen Hawkins. Over 170 design heuristics organized into eight principles. The best designer-facing accessibility reference in print, and the structural basis for Section 9.
- [Introducing the Accessible Design Framework](https://www.levelaccess.com/blog/introducing-the-accessible-design-framework/), Karen Hawkins. The perceive, understand, operate model, and the argument that the scope of design is a system rather than a person.
- [Accessible Design Principles and Heuristics: The Story Behind the Guide](https://www.levelaccess.com/blog/accessible-design-principles-and-heuristics-the-story-behind-the-guide/), Karen Hawkins. How the principles were derived.

### DESIGNA11Y

Written by the author of this file.

- [DESIGNA11Y articles index](https://www.design-a11y.com/articles)
- [Inclusivity Unveiled: Contrasting Accessible and Inclusive Design Principles](https://www.design-a11y.com/articles/inclusivity-unveiled-contrasting-accessible-and-inclusive-design-principles)
- [Designing for Invisible Disabilities: Making the Unseen, Seen](https://www.design-a11y.com/articles/designing-for-invisible-disabilities-making-the-unseen-seen)
- [Top 3 Don'ts: When Your Coworker Has Vestibular Dysfunction](https://www.design-a11y.com/articles/top-3-donts-when-your-coworker-has-vestibular-dysfunction)
- [5 Reasons Neurodiverse Brains Are Excellent for Creative Roles](https://www.design-a11y.com/articles/5-reasons-neurodiverse-brains-are-excellent-for-creative-roles)
- [From Good to Great: Elevating Your Design Workflow with Inclusivity](https://www.design-a11y.com/articles/from-good-to-great-elevating-your-design-workflow-with-inclusivity)
- [From Decoding Success to Fostering Neurodiverse Inclusion](https://www.design-a11y.com/articles/from-decoding-success-to-fostering-neurodiverse-inclusion)
- [I Asked AI to Design an Accessible Color Palette](https://www.design-a11y.com/articles/i-asked-ai-to-design-an-accessible-color-palette)
- [How Accessible Are These 2023 UI Design Trends?](https://www.design-a11y.com/articles/how-accessible-are-these-2023-ui-design-trends)
- [Is the Apple Vision Pro Vestibular Friendly?](https://www.design-a11y.com/articles/is-the-apple-vision-pro-vestibular-friendly)
- [Vestibular VR: 5 Features to Include in Your Metaverse](https://www.design-a11y.com/articles/vestibular-vr-metaverse-accessible)

### Testing tools

- [IBM Equal Access Accessibility Checker](https://github.com/IBMa/equal-access), open source, browser extensions and Node package
- [Pa11y](https://pa11y.org/), open source command line scanning
- [ANDI](https://www.ssa.gov/accessibility/andi/help/install.html), free manual inspection bookmarklet from the U.S. Social Security Administration
- [Level Access developer tools](https://www.levelaccess.com/developer-tools/), browser extensions, testing SDKs, and CI integrations. Level Access ships several surfaces and it is worth knowing which can be automated, because only one of them can:

| Tool | What it is | Scriptable |
|---|---|---|
| [Testing SDKs](https://client.levelaccess.com/hc/en-us/articles/21805172871063-Level-Access-testing-SDKs-overview), for example `@userway/a11y-playwright` on npm | Access Engine driven from Playwright, Cypress, Puppeteer, or WebdriverIO. Installs from the public registry, runs locally, and writes a JSON report with no account and no token. This is the one to reach for. | Yes |
| [Level Access browser extension](https://chromewebstore.google.com/detail/level-access-extension/kgbmnemfaellbfabmkmmilchbhiigpdi) | Manual panel for scanning a page in the browser. | No |
| [Accessibility Checker browser extension](https://client.levelaccess.com/hc/en-us/articles/14801734404247-Install-the-Accessibility-Checker-browser-extension) | Manual checker for Chrome and Firefox. Supports multi-page scan sessions that report into the Level Access platform. No API key needed for basic setup. | No |
| [Accessible Color Picker](https://chromewebstore.google.com/detail/accessible-color-picker/bgfhbflmeekopanooidljpnmnljdihld) | Design-time contrast tool. Eyedropper sampling from a live page, editable hex, and suggested conformant alternatives when a pair fails. Text contrast only, so it will not catch 1.4.11 non-text failures. | No |

  Use the SDK for the build gate and the extensions for the manual passes that automation cannot do. Everything in the table above can be installed and used without a paid license, though pushing results into the Level Access platform needs an account. Level Access also ships a Figma plugin, a Desktop Crawler App, a mobile testing SDK, an accessibility API, and webhooks, but those are licensed features rather than free tools, so they are outside the scope of this file.

### Level Access resources

- [Color Blindness Accessibility: What Designers Need to Know](https://www.levelaccess.com/blog/color-blindness-accessibility-what-designers-need-to-know/)
- [Supporting Users with Vestibular Disabilities Online](https://www.levelaccess.com/blog/how-to-support-users-with-vestibular-disabilities/)
- [Elevating E-Commerce Accessibility: Template Design Tips and Tricks](https://www.levelaccess.com/blog/elevating-e-commerce-accessibility-template-design-tips-and-tricks/)
- [Elevating E-Commerce Accessibility: Product Display Basics](https://www.levelaccess.com/blog/elevating-e-commerce-accessibility-product-display-basics/)
- [Elevating E-Commerce Accessibility: Cart Confidence](https://www.levelaccess.com/blog/elevating-e-commerce-accessibility-cart-confidence/)

---
