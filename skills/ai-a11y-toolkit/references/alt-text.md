# Alt text and image descriptions

Decision tree for every image, plus patterns for charts, icons, and decorative art.

Part of the AI A11y Toolkit by Dana Randall. Licensed CC BY 4.0.
Full reference: https://github.com/danarandall/ai-a11y-toolkit

---

## Section 6: Alt text and image descriptions

Alt text is the most frequently written accessibility feature and the most frequently written badly. It is also the one AI tools produce most confidently and least reliably, because a model describes what an image looks like while alt text needs to convey what the image is doing.

The governing question is never "what is in this picture?" It is **"what would a sighted user learn from this image here, and how do I deliver that same information in text?"**

### 6.1 Decide the image type first

Every image falls into one of five buckets. Pick the bucket before writing a word.

| Type | Definition | Treatment |
| --- | --- | --- |
| **Decorative** | Adds no information. Textures, dividers, ambient photography, an icon next to text that already says the same thing. | `alt=""`. Empty, not missing. Or use a CSS background. |
| **Informative** | Conveys information not available in surrounding text. | Concise text conveying that information. |
| **Functional** | Inside a link or button. The image is a control. | Describe the destination or action, not the picture. |
| **Complex** | Charts, diagrams, maps, infographics. Too much information for a short string. | Short alt naming what it is, plus a full description nearby or linked. |
| **Text in image** | Contains meaningful words. | Reproduce the text exactly. Better: do not do this at all. |

The same image can be different types on different pages. Context decides, not content.

### 6.2 How to write it

- **Lead with what matters.** Front-load the meaningful detail. Screen reader users often skim by jumping between elements.
- **Be specific, then stop.** Aim for roughly 125 characters. If the meaning needs more, the extra belongs in a caption, a `<figcaption>`, or body copy.
- **Skip "image of," "photo of," and "graphic of."** The screen reader already announces the role.
- **No trailing period needed,** but be consistent about it.
- **Do not duplicate adjacent text.** If the caption or heading already says it, the image is decorative in that context.
- **Match the page's voice and terminology.** Alt text is content, not metadata. Use the same words the product uses (see 5.2).
- **Write it as a sentence fragment, not a keyword list.** Keyword stuffing for search hurts real users and no longer helps ranking.
- **One image, one purpose.** If you cannot state the purpose in a sentence, you may be using one image to do several jobs.

### 6.3 Never do this

These are the failures that show up in real audits, over and over.

| Anti-pattern | Example | Why it fails |
| --- | --- | --- |
| Filename | `alt="IMG_4471.jpg"`, `alt="hero-final-v3-compressed.png"` | Meaningless, and often announced character by character |
| Internal color code or swatch ID | `alt="RD-100"`, `alt="#B3242A"`, `alt="PANTONE 186C"` | Internal codes carry no meaning for a customer. Describe the color in human language instead |
| SKU, product ID, or CMS asset ID | `alt="SKU-88213"`, `alt="asset_00291"` | Internal reference data, not user information |
| Dimensions or technical metadata | `alt="1200x628"`, `alt="banner"`, `alt="jpg"` | Describes the file, not the content |
| Placeholder text left in | `alt="alt text here"`, `alt="lorem ipsum"`, `alt="TODO"` | Shipped debt, and embarrassing |
| Missing attribute entirely | `<img src="x.jpg">` | Screen readers may fall back to announcing the file path |
| `alt=" "` with a space | `alt=" "` | Not treated the same as empty. Use `alt=""` |
| Generic filler | `alt="image"`, `alt="picture"`, `alt="photo"`, `alt="icon"`, `alt="logo"` | Announces that something exists and nothing more |
| Redundant prefix | `alt="Image of a blue handbag"` | The role is already announced |
| Describing a decorative image | `alt="abstract gradient swoosh"` | Pure noise in the reading experience |
| Keyword stuffing | `alt="handbag purse bag leather blue designer sale"` | Unreadable, and reads as spam |
| Same alt on every image in a gallery | `alt="product photo"` five times | Users cannot tell the images apart |
| Alt text on a functional image describing the picture | A magnifying glass icon in a search button with `alt="magnifying glass"` | Describes the glyph, not the action. Use "Search" |
| Text baked into the image and not in the alt | A sale banner reading "40% off" with `alt="spring banner"` | The actual message is lost entirely |

### 6.4 Color swatches and product variants

This is the case that breaks most often, and it is worth calling out on its own.

**Never use an internal color code as the alt text or accessible name of a color swatch.** As [Level Access notes in its product display guidance](https://www.levelaccess.com/blog/elevating-e-commerce-accessibility-product-display-basics/), a code like "RD-100" is not meaningful to the user, while something like "bright red pebbled" actually describes what the customer is selecting.

Rules for swatches and variant pickers:

- Describe the color in **user-meaningful language**, using the same name shown to sighted users. If the visible label says "Sky blue," the accessible name says "Sky blue," not "SB-04" and not "#7EC8E3" (see 2.5.3 and 5.2).
- Include **texture or finish** when it distinguishes the option: "bright red pebbled," "sky blue satin," "black matte." Sighted users get that from the swatch image. Non-sighted users only get it if you write it.
- **Do not rely on the swatch color alone** to communicate the choice. Color is never the only signal (1.4.1). Pair the swatch with a visible text label, or expose the name on selection.
- **Announce the selected state programmatically**, with `aria-checked`, `aria-pressed`, or `aria-selected` depending on the pattern. Selection shown only by a border or checkmark overlay is invisible to assistive technology.
- **Announce out-of-stock and unavailable combinations in text**, not by graying out or striking through the swatch alone.
- **Update dependent content on selection.** When a variant changes the price, image, or availability, announce it through a live region (4.1.3).
- **Size swatches at 44x44** including their hit area (3.5). Small round swatches in a tight row are a classic target-size and spacing failure.
- **Use a radio group, not a set of buttons.** Variant selection is single-select from a named group. `<fieldset>` with a `<legend>` of "Color" plus radio inputs gives you group naming, arrow-key navigation, and state for free.
- **Plan focus order deliberately.** Level Access points out that focus order on a product detail page does not have to follow visual left-to-right or top-to-bottom order, and that contextual groupings or multi-column layouts may suggest a better flow ([Level Access](https://www.levelaccess.com/blog/elevating-e-commerce-accessibility-product-display-basics/)). Decide what receives focus, what the indicator looks like, and in what order.

```html
<fieldset>
  <legend>Color</legend>

  <input type="radio" id="color-red" name="color" value="bright-red" />
  <label for="color-red">
    <img src="/swatch-red.jpg" alt="" />
    <!-- Swatch image is decorative. The label text carries the meaning. -->
    <span>Bright red pebbled</span>
  </label>

  <input type="radio" id="color-sky" name="color" value="sky-blue" />
  <label for="color-sky">
    <img src="/swatch-sky.jpg" alt="" />
    <span>Sky blue satin</span>
  </label>
</fieldset>

<!-- If the design has no visible text label, the name must live on the control -->
<button type="button" role="radio" aria-checked="false" aria-label="Bright red pebbled">
  <span class="swatch" style="background: var(--color-bright-red)" aria-hidden="true"></span>
</button>
```

### 6.5 Product and commerce imagery

Product alt text is doing sales work, not compliance work.

- **Give enough detail that a screen reader user does not have to open every product page to understand the options.** Level Access suggests moving past a bare "blue handbag" to something like "sky blue satchel with perforated leather," which conveys the shade and the texture ([Level Access](https://www.levelaccess.com/blog/elevating-e-commerce-accessibility-product-display-basics/)).
- **Differentiate every image in a gallery.** "Front view," "back view showing zip pocket," "worn over the shoulder for scale," "close-up of the perforated leather." Never repeat one string.
- **Model and scale images should say what they add.** If the point is fit or size, the alt text says so.
- **Zoom and lightbox controls need accessible names and keyboard access**, and the enlarged image needs its own alt text.
- **User-generated and review photos** need a described purpose too. "Customer photo: sky blue satchel in daylight" beats "review image."
- **Do not put price, discount, or urgency messaging only inside an image.** That is text in an image, and it is the message most likely to be missed.
- **Announce prices unambiguously.** A struck-through original price next to a sale price is visually obvious and frequently garbled by a screen reader. Deliver the complete information in one concise phrase, such as "$7.99, reduced from $9.99, saving $2" ([Level Access, Cart confidence](https://www.levelaccess.com/blog/elevating-e-commerce-accessibility-cart-confidence/)).
- **Sale and discount text must pass contrast.** Red sale copy on white is the single most common contrast failure in retail, and it fails exactly the low-vision customers most likely to be price sensitive ([Level Access](https://www.levelaccess.com/blog/elevating-e-commerce-accessibility-cart-confidence/)).
- **Cart line items need identifying detail in text.** Size, color, and quantity must be readable per item so a customer can confirm the cart without opening each product. Accessibility barriers in a checkout flow are barriers to buying ([Level Access](https://www.levelaccess.com/blog/elevating-e-commerce-accessibility-cart-confidence/)).

### 6.6 By image category

| Category | Guidance |
| --- | --- |
| **Logos** | Company name only. `alt="Level Access"`. If it is a link home, `alt="Level Access, home"`. Not "logo". |
| **Icons with adjacent text** | `alt=""`. The text already says it. Two announcements of the same thing is worse than one. |
| **Icon-only controls** | Name the action, not the glyph. "Search", "Delete item", "Open menu". |
| **Charts and graphs** | Short alt names the chart type and the takeaway. The data goes in an adjacent table or list. "Bar chart: mobile conversion fell from 4.1% to 2.8% after the redesign." |
| **Infographics** | Short alt plus a full text version of the content, on the page or linked. Do not attempt to compress it into alt. |
| **Diagrams and flows** | Describe structure and relationships in a linked long description, not appearance. |
| **Maps** | Alt describes purpose. Provide the address, directions, or data in text. A map image is almost never sufficient on its own. |
| **Screenshots in documentation** | Describe what the reader is meant to notice, and put any UI text they need into the surrounding prose. |
| **Avatars and profile photos** | Usually the person's name, or `alt=""` when the name is adjacent. |
| **Captchas** | Provide an alternative that does not require solving a visual puzzle (3.3.8). |
| **Animated GIFs and memes** | Describe the content and any text. Also reconsider using them at all (3.1). |
| **Emoji and icon fonts in text** | Screen readers read emoji names literally and at length. Use sparingly, never as the sole carrier of meaning. |
| **Background images in CSS** | Invisible to assistive technology. If it carries meaning, it is not a background image. |
| **Images inside SVG** | Use `<title>` inside the SVG plus `role="img"`, or `aria-label` on the SVG element. `aria-hidden="true"` for decorative SVG. |

### 6.7 Text in images

The best alt text strategy is to have fewer images that need it.

- **Do not embed meaningful text into images.** Screen readers cannot read it, it does not scale with text zoom, it cannot be translated or searched, and it creates downstream work for whoever writes the alt text ([Level Access, template design](https://www.levelaccess.com/blog/elevating-e-commerce-accessibility-template-design-tips-and-tricks/)). This is also a WCAG requirement (1.4.5).
- Overlay real text on an image with CSS instead of baking it in. Then it reflows, zooms, translates, and needs no alt text.
- If text in an image is unavoidable, such as a logo or a supplied campaign asset, reproduce every word of it in the alt text.
- This applies to AI-generated imagery too. Generated graphics frequently contain text, sometimes misspelled. Extract it into markup rather than shipping it as pixels.

### 6.8 When AI writes the alt text

Models are useful first drafts and unreliable final answers. They describe appearance, not purpose, and they hallucinate details that are not in the image.

Requirements:

- **A human reviews every string before it ships.** Non-negotiable for product, commerce, medical, legal, and editorial content.
- **Give the model the context.** Without knowing where the image sits and why, a model cannot make the decorative-versus-informative call, which is the most consequential decision in alt text.
- **Never let a model invent facts.** Colors, brand names, quantities, prices, model names, and text content must be verified against the actual product data, not the model's reading of the pixels.
- **Never accept a color code or a filename** back from a model. If your CMS feeds it "RD-100," it will happily use it.
- **Bulk generation across a catalog needs sampling QA** at minimum, and a plan for the long tail.

Prompt template:

```
Write alt text for this image.

Context:
- Where it appears: [page type and position]
- Its purpose here: [what a sighted user should learn from it]
- Surrounding text: [nearby heading or caption, so you can avoid duplicating it]
- Known facts: [verified product name, color name, material, any text in the image]

Constraints:
- Under 125 characters.
- No "image of", "photo of", or "graphic of".
- Convey function and meaning, not just appearance.
- Use only the verified facts above. Do not infer or invent details.
- Never output a filename, SKU, hex value, or internal color code.
- Reproduce any text visible in the image, exactly.
- If the image is decorative in this context, respond only with: alt="" (decorative)

Then list anything you were unsure about.
```

### 6.9 Agent directives for alt text

```
ALT TEXT CONSTRAINTS

- Every img element has an alt attribute. No exceptions.
- Decorative images get alt="". Never omit the attribute, never use alt=" ".
- Never output a filename, file extension, dimension, SKU, CMS asset id, hex value,
  Pantone number, or internal color code as alt text.
- Never output "image", "photo", "picture", "icon", "logo", "banner", "graphic",
  placeholder text, or lorem ipsum as alt text.
- Never begin alt text with "image of", "photo of", or "graphic of".
- For color swatches, use the human-readable color name shown to users, plus finish or
  texture when it distinguishes the option. Never a code.
- For images inside links or buttons, describe the destination or action, not the image.
- For icons that sit next to text saying the same thing, use alt="".
- For charts, state the chart type and the takeaway, and add the data as a table.
- Reproduce any meaningful text that appears inside an image.
- Do not embed meaningful text in generated images; put it in markup instead.
- Give each image in a gallery or list a distinct description.
- If you lack the context to write accurate alt text, write a clearly marked TODO with
  the specific question you need answered. Do not guess.
```

### 6.10 Alt text QA

- [ ] Every `<img>` has an `alt` attribute
- [ ] No filenames, extensions, dimensions, SKUs, hex values, or color codes anywhere in alt text
- [ ] No "image of", "photo of", generic filler, or placeholder text
- [ ] Decorative images use `alt=""` and are not described
- [ ] Functional images describe the action or destination
- [ ] Color swatches use human-readable color names matching the visible labels
- [ ] Swatch and variant selection state is exposed programmatically
- [ ] Every image in a gallery has a distinct description
- [ ] Complex images have a full text alternative nearby or linked
- [ ] All meaningful text inside images is reproduced in the alt text, and ideally moved into markup
- [ ] Prices, discounts, and urgency messaging exist as text, not only in images
- [ ] Alt text terminology matches the product glossary
- [ ] Every AI-generated string has been reviewed by a human
- [ ] Spot-checked by listening with a screen reader, not only by reading the markup

---
