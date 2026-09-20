---
name: design-gate
description: Use when a request could alter layout, markup, component behavior, styling, typography, navigation, responsive behavior, or animation.
---

# Design gate

## Overview

Prevent content work from changing the frozen production design.

## When to Use

Use before touching a Vue template, component, SCSS, Tailwind class, layout
value, breakpoint, navigation rule, control, or animation.

## When NOT to Use

Do not use for content-only changes that stay in documented data surfaces.

## Core Process

1. Identify the exact file and visual surface.
2. Stop unless the user explicitly approved design work.
3. Record the approved scope.
4. Verify desktop and mobile behavior in a browser.
5. Run the relevant validation.

Do not shrink type, alter spacing, change markup, or change timing to make
supplied content fit.

For a visual size or collision request, assert the affected elements'
`getBoundingClientRect()` values in the browser. CSS dimensions alone are not
proof of the rendered result because containing blocks and responsive rules can
constrain them.

For transparent decorative artwork, record three geometries separately: the
element rectangle, the alpha-visible artwork rectangle, and the alpha-visible
intersection with the viewport. A global `overflow-x: hidden` can conceal real
clipping while the element still extends beyond the viewport. When a report
names the "site" rather than a route, inspect every production entry point that
owns the referenced artwork instead of stopping at the first matching symbol.

For isolated overlay copy, use a classed element instead of a bare semantic tag
when the site has global element styling. A global `footer` rule can introduce
panel paint, stacking, or padding that defeats component-scoped styles.

For desktop-only decorative labels adjacent to the fixed media widget, position
them relative to the widget and hide them at the desktop breakpoint. Measure
both label bounds and the widget before approving the layout.

## Common Rationalizations

- "The CSS width is larger, so the rendered element must be larger." A grid,
  flex item, transform, or containing block can still constrain it; measure
  the rendered bounds.
- "A local build proves the visual change." Builds do not expose overlaps,
  clipping, or viewport-bound failures; check the affected route in a browser.

## Red Flags

- "Small" spacing or typography changes without approval.
- Component edits made to solve a content request.
- A visual change verified only by a build.

## Verification

- [ ] Explicit approval predates the edit.
- [ ] Diff stays inside the approved surface.
- [ ] Desktop and mobile browser checks pass.
- [ ] No unrelated design file changed.

## References

- `../../reference/wolves-runtime.md`
- `../validation/SKILL.md`
