---
version: alpha
name: awesome-jev-design-system
description: |
  Awesome Jev is a list that judges itself, and the design says so. A warm paper
  canvas with ink type, one cool "verdict" blue used only where a probability is
  shown, and a monospace face for every number, label and repository name. The
  signature element is the verdict bar: a hairline track filled to Jev's
  probability with a tick where the policy gate sits, so every entry shows both
  the judgment and the rule it was judged by. No traffic-light colours, no
  shadows, no illustration — status is typographic, hierarchy is hairlines and
  whitespace, and the data does the decorating.

colors:
  ink: "#17181a"
  body: "#3d4148"
  mute: "#6b7079"
  faint: "#9aa0a8"
  canvas: "#f9f8f5"
  surface-card: "#ffffff"
  surface-soft: "#f1efe9"
  hairline: "#e6e3dc"
  hairline-strong: "#c9c5bb"
  verdict: "#2450c8"
  verdict-soft: "#e8eefb"
  verdict-track: "#e3e0d8"
  review: "#8a6d1f"
  review-soft: "#f5efdc"
  selection-bg: "#e8eefb"
  ring-focus: "rgba(36,80,200,0.45)"
  dark-canvas: "#0e0f12"
  dark-surface-card: "#15171b"
  dark-surface-soft: "#1b1e23"
  dark-ink: "#e7e6e1"
  dark-body: "#b8bcc4"
  dark-mute: "#8a919b"
  dark-hairline: "#262a31"
  dark-hairline-strong: "#3a3f48"
  dark-verdict: "#86a8f7"
  dark-verdict-soft: "#1a2540"
  dark-verdict-track: "#262a31"

typography:
  display-lg:
    fontFamily: Geist, Inter, system-ui, sans-serif
    fontSize: 32px
    fontWeight: 600
    lineHeight: 40px
    letterSpacing: -0.64px
  display-md:
    fontFamily: Geist, Inter, system-ui, sans-serif
    fontSize: 24px
    fontWeight: 600
    lineHeight: 32px
    letterSpacing: -0.36px
  title:
    fontFamily: Geist, Inter, system-ui, sans-serif
    fontSize: 18px
    fontWeight: 600
    lineHeight: 26px
    letterSpacing: -0.18px
  body-md:
    fontFamily: Geist, Inter, system-ui, sans-serif
    fontSize: 15px
    fontWeight: 400
    lineHeight: 24px
  body-sm:
    fontFamily: Geist, Inter, system-ui, sans-serif
    fontSize: 13px
    fontWeight: 400
    lineHeight: 20px
  caption:
    fontFamily: Geist Mono, ui-monospace, SFMono-Regular, Menlo, monospace
    fontSize: 11px
    fontWeight: 500
    lineHeight: 16px
    letterSpacing: 0.88px
  mono-md:
    fontFamily: Geist Mono, ui-monospace, SFMono-Regular, Menlo, monospace
    fontSize: 13px
    fontWeight: 400
    lineHeight: 20px
  number:
    fontFamily: Geist Mono, ui-monospace, SFMono-Regular, Menlo, monospace
    fontSize: 13px
    fontWeight: 500
    lineHeight: 16px
  number-lg:
    fontFamily: Geist Mono, ui-monospace, SFMono-Regular, Menlo, monospace
    fontSize: 22px
    fontWeight: 500
    lineHeight: 28px
    letterSpacing: -0.22px

rounded:
  none: 0px
  sm: 4px
  md: 8px
  lg: 12px
  full: 9999px

spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  xxl: 64px
  container: 1152px
  gutter: 16px
  gutter-desktop: 24px

components:
  verdict-bar:
    track: "{colors.verdict-track}"
    fill: "{colors.verdict}"
    gateTick: "{colors.ink}"
    height: 3px
    rounded: "{rounded.full}"
    label: "{typography.number}"
  score-scale:
    segments: 3
    track: "{colors.verdict-track}"
    fill: "{colors.ink}"
    height: 3px
    gap: 3px
    label: "{typography.number}"
  entry-row:
    background: "{colors.canvas}"
    backgroundHover: "{colors.surface-card}"
    border: "0 0 1px 0 {colors.hairline}"
    padding: "14px 0"
    title: "{typography.title}"
    repo: "{typography.mono-md}"
    description: "{typography.body-sm}"
  entry-card:
    background: "{colors.surface-card}"
    border: "1px solid {colors.hairline}"
    borderHover: "1px solid {colors.hairline-strong}"
    rounded: "{rounded.md}"
    padding: "16px"
  chip:
    background: "{colors.surface-soft}"
    color: "{colors.body}"
    activeBackground: "{colors.verdict-soft}"
    activeColor: "{colors.verdict}"
    activeBorder: "1px solid {colors.verdict}"
    outlineBorder: "1px solid {colors.hairline}"
    uncertainBorder: "1px dashed {colors.hairline-strong}"
    uncertainSuffix: "?"
    rounded: "{rounded.full}"
    padding: "3px 10px"
    label: "{typography.body-sm}"
  stat:
    value: "{typography.number-lg}"
    label: "{typography.caption}"
    labelColor: "{colors.mute}"
  section-label:
    type: "{typography.caption}"
    color: "{colors.mute}"
    transform: uppercase
    borderTop: "1px solid {colors.hairline}"
    paddingTop: "24px"
  ledger-row:
    border: "0 0 1px 0 {colors.hairline}"
    padding: "6px 0"
    key: "{typography.body-sm}"
    keyColor: "{colors.mute}"
    value: "{typography.number}"
  input:
    background: "{colors.surface-card}"
    border: "1px solid {colors.hairline}"
    borderFocus: "1px solid {colors.verdict}"
    ring: "0 0 0 3px {colors.ring-focus}"
    rounded: "{rounded.md}"
    height: 36px
    padding: "0 12px"
    type: "{typography.body-md}"
  nav:
    background: "{colors.canvas}"
    border: "0 0 1px 0 {colors.hairline}"
    height: 52px
    brand: "{typography.title}"
    link: "{typography.body-sm}"
    linkColor: "{colors.mute}"
    linkActiveColor: "{colors.ink}"
  footer:
    border: "1px 0 0 0 {colors.hairline}"
    type: "{typography.body-sm}"
    color: "{colors.mute}"
    padding: "32px 0"
---

## Overview

Awesome Jev is a curated list with one thing no other awesome list has: every entry carries a machine judgment — a probability that the repository is genuinely about Jev, a category with a confidence, and three 0–3 quality scores — plus the policy that turned those numbers into a verdict. The design exists to make that legible at a glance and honest on inspection.

Three decisions carry the system:

1. **Paper, ink, one verdict colour.** The canvas is warm off-white (`{colors.canvas}`), text is near-black ink, and the only chromatic colour is `{colors.verdict}`, a cool blue reserved for probability fills, active filters and links. Nothing else is coloured. There are no green/amber/red status lights: a listed entry is set in ink, a review entry in `{colors.mute}` with a dashed hairline, an excluded entry in `{colors.faint}`. Status is something you read, not a light you obey.

2. **Numbers are monospace, always.** Every probability, score, star count, date and repository slug is set in Geist Mono with tabular figures. Labels above numbers are `{typography.caption}`: 11px mono, uppercase, wide tracking. This is the one inheritance from the TypeSafe world — machine output looks like machine output — without borrowing its salmon-and-terminal brand.

3. **The verdict bar is the signature.** A 3px hairline track filled to Jev's probability, with a 1px ink tick at the policy gate (`listed_min`, currently 0.5). Every bar on the site shows both the judgment and the rule. When the policy changes, every bar moves its tick; nothing is hand-drawn.

Everything else is restraint. No shadows, no gradients, no illustration on product pages (the pipeline diagram lives on one page and in the social card). Hierarchy comes from hairlines (`{colors.hairline}`), whitespace, and the jump from mono captions to a tight-tracked Geist headline.

## Colors

### Brand & Accent
- `{colors.verdict}` `#2450c8` — the only chromatic colour. Roles: verdict-bar fill, active chip, links, focus ring (as `{colors.ring-focus}`), selection. Three roles is the budget; a fourth use should be ink instead.
- `{colors.verdict-soft}` `#e8eefb` — active chip background and `::selection`. Never a section background.

### Surface
- `{colors.canvas}` `#f9f8f5` — page background. Warm enough to read as paper against a white card, cool enough not to look yellow.
- `{colors.surface-card}` `#ffffff` — cards, inputs, hover state of a row. White is the *raised* colour here; it appears only on objects.
- `{colors.surface-soft}` `#f1efe9` — neutral chips, the stat strip, code wells.
- `{colors.hairline}` `#e6e3dc` / `{colors.hairline-strong}` `#c9c5bb` — every divider and border. Strong is the hover/active border only.

### Text
- `{colors.ink}` headings, entry names, numbers that matter.
- `{colors.body}` running text.
- `{colors.mute}` labels, captions, secondary metadata, nav links at rest.
- `{colors.faint}` excluded entries and disabled controls.

### Semantic
- `{colors.review}` `#8a6d1f` with `{colors.review-soft}` — used **once**: the "held because …" reason on review entries. It is a reading aid, not a status colour; do not extend it to chips or badges.
- There is no error red and no success green. "Excluded" is `{colors.faint}` text and a normal hairline. "Listed" is the default appearance of an entry.

### Dark
Dark mode swaps the palette with the same roles (`{colors.dark-canvas}` … `{colors.dark-verdict-soft}`). Ink goes warm-white (`{colors.dark-ink}` `#e7e6e1`), never pure white; verdict lightens to `{colors.dark-verdict}` `#86a8f7` so the bar fill keeps contrast on the dark track. Dark follows `prefers-color-scheme`; there is no toggle.

## Typography

### Font Family
- **Geist** (sans) for headings, body and UI. Self-hosted through `next/font` so the static export makes no external request. Falls back to Inter, then system-ui.
- **Geist Mono** for every number, date, slug, caption and code. Same fallback logic to `ui-monospace`.
- Two families, two jobs. Sans never sets a number; mono never sets a sentence.

### Hierarchy
- `{typography.display-lg}` 32/40, -0.64px — page title, one per page.
- `{typography.display-md}` 24/32 — detail-page repository name.
- `{typography.title}` 18/26 — entry name in rows and cards, section headings in prose pages.
- `{typography.body-md}` 15/24 — running text, input text.
- `{typography.body-sm}` 13/20 — entry descriptions, nav links, chip labels, ledger keys.
- `{typography.caption}` 11/16 mono uppercase +0.88px — labels above numbers, section labels ("REPOSITORY", "JUDGMENT"), stat labels.
- `{typography.number}` 13/16 mono 500 — every inline figure. `{typography.number-lg}` 22/28 — the stat strip.
- `{typography.mono-md}` 13/20 mono 400 — `owner/repo` slugs, reason strings, code.

### Principles
- Negative tracking only on display sizes; body and mono sit at 0 (caption at +0.88px).
- Weight is 400 or 600, plus 500 for mono numbers. No 700.
- Tabular figures (`font-variant-numeric: tabular-nums`) on every mono number so columns of probabilities align.
- Truncate descriptions at two lines in rows and three in cards; never let a description push the verdict bar out of the first fold of an entry.

### Note on Font Substitutes
If Geist cannot be loaded, Inter at the same sizes is acceptable with tracking reduced by a third; the system stack (`-apple-system, Segoe UI`) is acceptable for UI but loses the tight display look. For mono, `SF Mono`/`Menlo` are close; `Courier` is not.

## Layout

### Spacing System
4px unit. `{spacing.sm}` 8 inside components, `{spacing.md}` 16 between related elements, `{spacing.lg}` 24 between groups, `{spacing.xl}` 40 between page sections, `{spacing.xxl}` 64 above the footer.

### Grid & Container
- Container `{spacing.container}` 1152px, side gutter 16px (24px ≥ 640px).
- Index page: single column. A category rail (200px) appears on the left at ≥ 1024px; below that, categories collapse to a horizontally scrolling chip row.
- Entry rows are full-width hairline-separated rows; the optional card grid (`{components.entry-card}`) is 1 / 2 / 3 columns at 0 / 640 / 1024px.
- Detail page: 720px measure for prose, two-column ledger at ≥ 640px.

### Whitespace Philosophy
Generous between sections, tight inside data. A row is 14px of padding around a 26px title line; a section break is 40px with a hairline and a mono caption. The page should feel like a well-set ledger, not a dashboard.

### Responsive Strategy
Mobile first. Nothing hides on mobile; things stack. The stat strip wraps to two rows; the filter row scrolls horizontally; the verdict bar stays full width. Touch targets are 36px tall minimum (inputs, chips get 32px + 4px hit padding).

## Elevation & Depth
None. Depth is expressed as colour blocking: canvas → card (white) → soft (chip). Hover raises a row by switching its background to `{colors.surface-card}` and its bottom hairline to `{colors.hairline-strong}`. No box-shadow anywhere; no blur; no glass.

### Decorative Depth
A dot grid (`radial-gradient(hairline 1px, transparent 1px)` on 22px) is permitted on exactly two surfaces: the social card and the "How it works" pipeline figure background. Not on product pages.

## Shapes

### Border Radius Scale
- `{rounded.sm}` 4px — verdict bar ends, code wells.
- `{rounded.md}` 8px — cards, inputs, the stat strip.
- `{rounded.full}` — chips only.
- Rows and ledgers are square: they are lines, not objects.

### Photography Geometry
No photography. The single figure (pipeline diagram) sits in a `{rounded.md}` well on `{colors.surface-soft}`.

## Components

### Navigation
`{components.nav}` — 52px, canvas background, bottom hairline. Brand in `{typography.title}` ink; links in `{typography.body-sm}` `{colors.mute}`, active link ink with no underline. The review count renders as a mono number in parentheses. Sticky is off: the page is short enough that a sticky bar only steals space.

### Stat strip
`{components.stat}` — five figures (judged · listed · review · excluded · generated) on `{colors.surface-soft}`, `{rounded.md}`, 16px padding. Value `{typography.number-lg}` ink, label `{typography.caption}` mute. Wraps to two rows below 640px.

### Filter row
Status as a segmented control (four chips joined, one active with `{colors.verdict-soft}` fill and `{colors.verdict}` text). Category chips in a scrolling row; on desktop they move to the left rail as a plain list with counts in mono. Search input `{components.input}` with a mono placeholder.

### Entry row (default)
`{components.entry-row}` — one repository per hairline row:
- Line 1: name in `{typography.title}` ink, `owner/` prefix in `{typography.mono-md}` mute, star count right-aligned in `{typography.number}`.
- Line 2: description in `{typography.body-sm}` body, two-line clamp.
- Line 3: **verdict strip** — three inline `{components.verdict-bar}`/`{components.score-scale}` cells (genuine · category confidence · substance) each with its mono figure, then chips for category and language. Category chip is the only chip with a hairline border; language is text-only.
- **Uncertain category** — when Jev's category confidence falls below the policy's `category_uncertain_below`, the category chip takes `{components.chip}` `uncertainBorder` and a trailing `?` in `{colors.mute}`. Dashed already means unsettled here (review rows use the same hairline), so it needs no colour of its own. It is a label, not a status: the entry is listed on `genuine` and `substance` like any other, and the confidence figure is on the entry page.
- Review rows: bottom hairline dashed, name in `{colors.mute}`, reason in `{typography.mono-md}` `{colors.review}` on its own line.
- Excluded rows: name and description in `{colors.faint}`, no verdict strip, reason only.

### Entry card (alternate)
`{components.entry-card}` — same content in a `{rounded.md}` white card with a hairline. Used when the user chooses the grid view; otherwise rows are the default because rows scan faster at 379 entries.

### Verdict bar (signature)
`{components.verdict-bar}` — 3px track `{colors.verdict-track}`, fill `{colors.verdict}` to the probability, a 1px × 7px ink tick at the gate value, mono figure to the right. Track width is the cell width; never below 64px. The tick is rendered from `policy.gate.listed_min`, never hard-coded. On the detail page the bar is 6px tall with the threshold value printed under the tick in `{typography.caption}`.

### Score scale
`{components.score-scale}` — three 3px segments with 3px gaps for the 0–3 scales (substance, docs, novelty). Filled proportionally in ink, figure to the right as `2.19 / 3`. Ink, not verdict blue: these are quality scores, not the gate.

### Section label
`{components.section-label}` — mono uppercase caption over a top hairline, 24px above. Replaces h2 on data pages ("REPOSITORY", "JUDGMENT", "QUALITY SCALES", "SOURCES").

### Ledger
`{components.ledger-row}` — key in `{typography.body-sm}` mute on the left, value in `{typography.number}` ink on the right, hairline between rows, two columns at ≥ 640px. Every fact on the detail page is a ledger row; no cards inside the ledger.

### Footer
`{components.footer}` — top hairline, `{typography.body-sm}` mute: generated date in mono, links to GitHub, the calibration report, and the corrections template.

## Do's and Don'ts

### Do
- Keep `{colors.verdict}` for probabilities, active state and links — three roles.
- Set every number, date and slug in Geist Mono with tabular figures.
- Show the gate tick on every verdict bar, computed from policy.
- Let rows be the default index view; cards are an option.
- Express status with type colour and hairline style, never with a coloured badge.
- Use `{colors.surface-card}` white only on objects (cards, inputs, hovered rows).
- Truncate descriptions; the verdict strip must stay visible.

### Don't
- Don't add green/red/amber status colours. "Review" gets `{colors.review}` text on its reason line only.
- Don't use TypeSafe's salmon or terminal-window chrome. This is an independent list; the nod is monospace numbers, not the brand.
- Don't shadow, blur, gradient or animate on product pages. The one figure and the social card are the only decorative surfaces.
- Don't set numbers in the sans face, and don't set sentences in mono.
- Don't hard-code a threshold anywhere in the UI; read it from `curated.policy`.
- Don't stack more than two chips before the verdict strip; language is text, not a chip.
- Don't let the review count or any status turn into a coloured dot.

## Responsive Behavior

### Breakpoints
640 (sm), 1024 (lg). Two breakpoints are enough for a list.

### Touch Targets
36px inputs and buttons; chips 32px visual with 36px hit area.

### Collapsing Strategy
Rail → chip row; two-column ledger → one; card grid 3 → 2 → 1; stat strip 5 → 3+2.

### Image Behavior
The pipeline figure scales to container width inside its well; the social card is fixed 1200×630 and never rendered in-page.

## Iteration Guide
1. Change tokens in `globals.css` first; components read tokens, never literals.
2. When the policy gate moves, verify the tick moved on rows, cards and the detail bar — that is the acceptance test for the signature.
3. Add a component variant as a new token block (`entry-row-review`, `chip-active`), not as prose.
4. If a new colour seems necessary, first try ink at a different weight or a hairline change.
5. Run the design review on three pages: index (rows), a listed detail, a review detail. Excluded pages inherit.

## Known Gaps
- Per-repository social cards are not part of this system yet; when added they should reuse `{components.verdict-bar}` at 6px on the `{colors.canvas}` paper.
- The category rail's counts depend on the current filter set; interaction states (rail item active/hover) are specified as chip states for now.
- Empty states (no search results, empty review queue) are not designed; use `{typography.body-md}` mute centred, no illustration.
- Print styles are out of scope.
