# Design rules

- Colours, fonts, radius, shadow and spacing come from the design tokens in `web/src/app/globals.css`, `web/src/styles/design-tokens.css`.
  Never write a raw colour, an off-scale size or a new font into a screen.
- Reuse the shared components before writing a new one; never copy one.
- Every data block has empty, loading and error states.
- A justified exception carries a `design-check: allow <reason>` comment.
