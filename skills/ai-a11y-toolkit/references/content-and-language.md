# Content, language, and cognitive load

Clear language, non-apparent disabilities, and rules for AI-generated copy.

Part of the AI A11y Toolkit by Dana Randall. Licensed CC BY 4.0.
Full reference: https://github.com/danarandall/ai-a11y-toolkit

---

## Section 8: Cognitive load, clear language, and non-apparent disabilities

Most of this file addresses barriers you can measure. This section addresses the ones you cannot see, in users you will never identify, using criteria that are thinner in WCAG than the need warrants. It is also where the largest population sits.

### 8.1 Accessible is not the same as inclusive

Worth being precise about, because the two words get used interchangeably and they are not the same thing ([DESIGNA11Y](https://www.design-a11y.com/articles/inclusivity-unveiled-contrasting-accessible-and-inclusive-design-principles)).

| | Accessible design | Inclusive design |
| --- | --- | --- |
| **Aim** | Remove barriers for people with disabilities | Work for the full spectrum of human diversity |
| **Driver** | Compliance with regulations and standards | Empathy, flexibility, and usability |
| **Scope** | Disability | Disability plus age, culture, background, language, context, and ability |
| **Test** | Does it pass? | Does it work, and for whom does it work well? |

Accessible design is a critical step toward equal participation, and it is the floor this file specifies. It can also fall short of the wider range of user experience, and a product that clears every checkpoint can still be an unpleasant thing to use. Inclusive design is rooted in **diversity, flexibility, and usability**, and it goes beyond compliance to cultivate understanding of the people on the other side of the screen.

Practically, for a team: use WCAG to know when you are done being non-compliant. Use inclusive design to know when you are done.

### 8.2 Non-apparent disabilities

Invisible or non-apparent disabilities include chronic pain, cognitive impairments, mental health conditions, and sensory sensitivities. Fibromyalgia, anxiety disorders, and ADHD sit in this group, along with migraine, vestibular dysfunction, autism, dyslexia, PTSD, long COVID, and the effects of medication and fatigue. They affect a person's ability to navigate their environment, interact with technology, and participate ([DESIGNA11Y](https://www.design-a11y.com/articles/designing-for-invisible-disabilities-making-the-unseen-seen)).

Three consequences for how you build:

1. **You cannot detect these users, so you cannot serve them conditionally.** There is no toggle, no user setting, no accessibility mode to hide the accommodation behind. The default experience has to work.
2. **People with non-apparent disabilities routinely meet skepticism, disbelief, and exclusion.** Design that demands people disclose or justify a need in order to use it will simply lose them.
3. **These conditions fluctuate.** The same person may have no difficulty on Monday and be unable to process a dense screen on Thursday. Design for their worst day, not their average one.

### 8.3 Reduce cognitive load

The three things that matter most, in order: **clear language, simple navigation, intuitive layouts** ([DESIGNA11Y](https://www.design-a11y.com/articles/designing-for-invisible-disabilities-making-the-unseen-seen)).

- **One primary action per screen or section.** If everything is emphasized, nothing is.
- **Chunk content.** Short paragraphs, meaningful headings every few screens of text, lists instead of dense prose. Headings are also how screen reader users navigate (2.4.6, 2.4.10).
- **Put the important thing first.** Front-load sentences, headings, link text, and page copy with the outcome, not the preamble.
- **Keep layouts predictable across pages.** Navigation and repeated components stay in the same place and keep the same labels. See Section 5.
- **Show progress and position** in multi-step flows. Step 2 of 4, with the ability to go back without losing work.
- **Never rely on memory across steps.** If information was already provided, do not ask for it again, or auto-populate it (3.3.7 Redundant Entry, AA).
- **Never require a cognitive test to log in.** No puzzles, no transcription, no memory games as the only path. Allow paste into every field, support password managers, and support copy from another device (3.3.8 Accessible Authentication, AA).
- **Do not impose time limits.** If a limit is unavoidable, let users turn it off, adjust it, or extend it by a simple action, and warn before session loss (2.2.1, 2.2.6).
- **Make errors recoverable, not punitive.** Say what is wrong, where, and how to fix it, in plain words next to the field. Never clear the form. Confirm before anything irreversible (3.3.1, 3.3.3, 3.3.4).
- **Explain before you ask.** Say why you need a piece of information and what happens next.
- **Keep help in a consistent place** across the product (3.2.6 Consistent Help, A).

### 8.4 Language

WCAG's reading level requirement sits at Level AAA (3.1.5), which means plain language is not strictly required for AA conformance. Write it anyway. It is the single highest-leverage accessibility change available, and it costs nothing.

- Aim for a lower secondary reading level for general audiences. Short sentences, common words, active voice.
- One idea per sentence. One topic per paragraph.
- Expand an abbreviation or acronym on first use (3.1.4 is AAA, do it anyway).
- Define unavoidable jargon inline rather than in a glossary elsewhere.
- Avoid idiom, metaphor, sarcasm, and humor that depends on inference. These are genuine barriers for many autistic users, for people with aphasia, and for anyone reading in a second language.
- Use literal, descriptive link text. "Download the 2026 pricing sheet", not "click here" or "learn more" (2.4.4).
- Sentence case for headings and buttons. ALL CAPS is slower to read and is sometimes spelled out letter by letter by screen readers.
- Left-align body copy in left-to-right languages. Justified text creates uneven word spacing that is hard to track.
- Keep measures between roughly 45 and 75 characters per line.
- Label buttons with the action they perform: "Save draft", not "Submit" or "OK".
- Set the page language, and mark inline language changes so the correct pronunciation is used (3.1.1, 3.1.2).

### 8.5 Sensory load

Sensory sensitivity means the interface can be painful, not merely annoying.

- **Motion, autoplay, and animation:** see Section 3. Everything there is a cognitive and vestibular protection as much as a visual one.
- **Sound never starts on its own.** Nothing above three seconds without a control, and no background music behind spoken content (1.4.2).
- **No sudden or abrupt audio,** and no sound as the only signal for anything.
- **No large areas of highly saturated color,** and no bold repeating patterns, especially on pages that require scrolling. Both are vestibular triggers.
- **Nothing flashes more than three times per second.** No exceptions (2.3.1).
- **Give the eye somewhere to rest.** Whitespace and clear grouping are accessibility features. Dense, uniformly weighted screens are exhausting to parse.
- **Do not stack notifications, modals, tooltips, or interruptions.** One thing at a time, dismissible, and never on a timer the user cannot control.
- **Respect `prefers-reduced-motion`, `prefers-reduced-transparency`, and `prefers-contrast`.** Reading the user's stated preferences is cheaper than guessing at their needs.
- **Offer a genuinely quiet default.** Ambient video, animated illustration, and looping backgrounds should be opt-in, not opt-out.

### 8.6 Involve the people affected

The recommendation in the source material is direct: involve individuals with these disabilities in the design process, through user testing and feedback collection ([DESIGNA11Y](https://www.design-a11y.com/articles/designing-for-invisible-disabilities-making-the-unseen-seen)).

- Recruit participants with cognitive, sensory, and non-apparent disabilities specifically, and pay them.
- Let people use their own devices and their own settings. Assistive technology configuration is personal, and a clean lab machine tells you little.
- Ask about difficulty, not preference. "Where did you get stuck" gets better data than "do you like it".
- Design the research session itself accessibly: agenda in advance, no surprise tasks, breaks, no fixed time pressure, and an easy way to stop.
- Do not treat one participant as a representative of a condition, and do not require anyone to disclose a diagnosis in order to give you feedback.

One more thing worth saying to a team. Neurodivergent thinking is an asset in creative and design work, not an accommodation cost, and plenty of people doing this work are building for their own needs ([DESIGNA11Y](https://www.design-a11y.com/articles/5-reasons-neurodiverse-brains-are-excellent-for-creative-roles)). Accessible process and accessible product tend to arrive together.

### 8.7 Agent directives for cognitive accessibility

```
COGNITIVE AND CONTENT CONSTRAINTS

- Write UI copy at a plain reading level. Short sentences, common words, active voice.
- Label controls with the action performed. Never "click here", "learn more", "OK".
- Expand abbreviations on first use. Avoid idiom, metaphor, and sarcasm in UI copy.
- One primary action per view. Do not emphasize multiple competing actions.
- Use headings to structure content, in correct order, with no skipped levels.
- Never ask for information the user already provided in the same process.
- Never require a puzzle, transcription, or memory task to authenticate. Allow paste and
  password managers in every credential field.
- Never impose a time limit without a way to extend, adjust, or turn it off, and warn
  before data is lost.
- Error messages state what is wrong, where it is, and how to fix it, in text, adjacent to
  the field. Never clear user input on error.
- Never stack modals, toasts, or interruptions, and never auto-dismiss on a timer.
- Respect prefers-reduced-motion, prefers-reduced-transparency, and prefers-contrast.
- Never gate an accommodation behind a user setting, mode, or disclosure.
```

---


## Section 13: For AI-generated content

### Alt text

Rules for writing it, and for asking a model to write it:

- Purpose first. What is this image doing on this page? A product photo, a chart, a decorative texture, and a diagram each need a different answer.
- Skip "image of" and "photo of". Screen readers already announce the role.
- Keep it to roughly 125 characters where you can. Longer content belongs in a caption, a `<figcaption>`, or adjacent body text.
- Decorative images get `alt=""`, not a description. A described decorative image is noise.
- Functional images, meaning an image inside a link or button, get alt text describing the destination or action, not the picture.
- Charts and data visualizations: the alt text states the takeaway, and the underlying data appears as a table or list nearby.
- Text in an image must be reproduced in the alt text.
- Never accept model-generated alt text unreviewed. Models describe what they see, not what the image is for, and they hallucinate details.

Prompt template:

```
Write alt text for this image. Context: it appears [where] and its purpose is [why].
Constraints: under 125 characters, no "image of", state the function not just the
appearance, reproduce any text visible in the image. If the image is decorative in
this context, respond with: alt="" (decorative).
```

### Captions, transcripts, and audio

- AI captions are a first draft. Human review is required for names, jargon, acronyms, numbers, and speaker attribution. Auto-captions do not meet 1.2.2.
- Captions need punctuation, speaker labels, and non-speech audio that carries meaning, such as [laughter] or [door closes].
- Transcripts should be structured with headings and speaker names, not delivered as an undifferentiated wall of text.
- Synthetic voice content still needs a transcript.

### Written content

- Plain language: short sentences, active voice, common words, one idea per paragraph. Expand acronyms on first use.
- Front-load. Put the conclusion first, then the detail.
- Use real headings, real lists, and real tables in markup. Do not simulate structure with bold text, dashes, or spacing.
- Link text must stand alone out of context. (2.4.4)
- Do not use emoji, ASCII art, or decorative characters to carry meaning. Screen readers read them literally and often at length.
- Do not use directional or sensory instructions as the only wayfinding. (1.3.3)
- Set the language of any passage that changes language. (3.1.2)

### Chatbots and generative interfaces

- Streaming responses must be announced without spamming. Announce on completion with a polite live region, not per token.
- The message history needs a keyboard-navigable structure and clear author attribution per message.
- Generated interactive elements inside a response must meet the same standards as the rest of your product. Generated markup is your markup.
- Stop, regenerate, and copy controls need accessible names and keyboard access.
- Never present a generated interface state with no textual equivalent.

---
