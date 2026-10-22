# Frontend rules (english-front)

## Stack (do not deviate)
- Next.js 16 (App Router), React 19, TypeScript (strict)
- Styling: SCSS via CSS Modules (`*.module.scss`) only
- Animations: framer-motion only
- HTTP: axios only (one shared instance in `src/lib/api.ts`)
- Do NOT add new dependencies (no Tailwind, styled-components, MUI, etc.)
  without asking me first.

## Project structure
src/
app/                  # routes, layouts, loading/error files
components/
ui/                 # atoms: Button, Input, Card, Modal
features/           # domain blocks: LessonCard, SubmissionTable
layout/             # Header, Sidebar, Footer
styles/
_variables.scss     # design tokens (single source of truth)
_mixins.scss        # mixins (single source of truth)
globals.scss        # reset + base typography + .container
lib/  hooks/  types/

Each component lives in its own folder:
Button/
Button.tsx
Button.module.scss
index.ts

## Components
- Server Components by default. Add `'use client'` ONLY when state, effects,
  event handlers, browser APIs or framer-motion are needed. Push it as deep
  as possible.
- Function components, named exports, props typed via `interface XProps`.
- No `any`, no unused props/imports. One component per file; split at ~150 lines.
- Use `next/link`, `next/image`, `next/font`.

## Markup
- Semantic HTML: header, nav, main, section, article, aside, footer,
  `button` (never div onClick), ul/li for lists, table for tabular data.
- One `h1` per page, headings in logical order.
- Everything interactive must be keyboard-accessible.
  Global `:focus-visible` already exists in globals.scss: do not remove it
  with `outline: none` unless you add an equivalent visible style.
- Images need meaningful `alt` (`alt=""` if decorative).
- Icon-only buttons need `aria-label`. Inputs always have a `<label>`.
- Screen-reader-only text: use `@include visually-hidden`.

## SCSS: how to start every module file
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;
(Both lines are required: mixins does not forward variables.)

## SCSS: tokens (use ONLY these, never hardcode values)
- Colors: $color-primary(-dark/-light/-50/-100/-200), $color-secondary(-dark/-light),
  $color-danger(-dark/-light), $color-warning(-dark/-light),
  $color-success(-dark/-light), $color-gray-50…900, $color-white, $color-black
- Spacing: $spacing-xs(4) sm(8) md(16) lg(24) xl(32) 2xl(48) 3xl(64)
- Font size: $font-size-xs…5xl. Weight: $font-weight-light/normal/medium/semibold/bold.
  Line height: $line-height-tight/normal/relaxed.
  Families: $font-family-base/heading/mono
- Radius: $border-radius-none/sm/base/md/lg/xl/2xl/full
- Shadow: $shadow-sm/base/md/lg/xl
- Z-index: $z-index-dropdown/sticky/fixed/modal-backdrop/modal/popover/tooltip
- Transition: $transition-fast/base/slow
- Breakpoints: $breakpoint-sm 640, md 768, lg 1024, xl 1280, 2xl 1536
- If a needed token does not exist: add it to `_variables.scss` and tell me.
  Do NOT hardcode hex colors, px values, shadows or z-index in components.

## SCSS: mixins (reuse before writing custom CSS)
- Responsive: `@include respond-to(md) { }` (min-width, mobile-first),
  `respond-to-max(md)` only as a rare exception. Valid keys: sm, md, lg, xl, 2xl.
  Any other key silently outputs nothing: never invent keys.
- Layout: flex-center, flex-between, flex-column, flex-column-center,
  grid($columns, $gap), container($max-width, $padding)
- Positioning: absolute-center, absolute-full
- Text: text-truncate, line-clamp($lines)
- Resets: button-reset, input-reset
- UI: card($padding, $radius, $shadow), hover-lift, transition($property, $duration),
  scrollbar, visually-hidden
- Need a new repeated pattern (3+ uses)? Add a mixin to `_mixins.scss`.

## SCSS: rules
- Mobile-first: base styles for mobile, enhance with `respond-to(md/lg/xl)`.
- Class names camelCase in modules (`styles.cardTitle`); modifiers as
  separate classes (`cardActive`), combine with a small helper, no string hacks.
- Max nesting depth 3. No `!important`. No `#id` selectors. No element
  selectors inside modules except for nested content (`p`, `a`) when needed.
- Prefer `gap` over margins between siblings. Use flex/grid.
- Remember globals.scss gives `h1–h6` and `p` a default `margin-bottom`
  and `ul/ol` no list-style. Reset/override in the module when the layout needs it.
- Use the global `.container` class or `@include container`; don't re-create it.
- No inline `style={{}}` except truly dynamic values.
- No horizontal scroll at 320px.
- Check `$breakpoint-*` usage: don't use raw `@media` queries.

## Animations (framer-motion)
- Use `motion.*` with variants; durations 0.2–0.4s (match $transition-fast/base).
- Animate only `transform` and `opacity`.
- Respect `prefers-reduced-motion` via `useReducedMotion`.
- `AnimatePresence` for mount/unmount.

## Data and API
- All requests go through the shared axios instance, never inside components directly.
- Type every response in `src/types`.
- Every data view has loading, empty and error states.

## Naming
- Components PascalCase, hooks `useSomething`, lib/hooks files camelCase.
- SCSS partials start with `_`.
- UI text strings live in constants, not copy-pasted.

## Before you answer
1. Reuse existing components, tokens and mixins first.
2. Mentally check the result at 320px, 768px, 1280px.
3. Check the a11y rules above.
4. Output the full content of every file you create or change, with the path
   as a heading. No "...rest of code" placeholders.
5. If something is unclear, ask ONE short question instead of guessing.
