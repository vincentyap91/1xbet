---
inclusion: always
---

# Screenshot → design doc auto-routing

**No special prompt required.** If the user pastes/attaches a UI screenshot (or asks to build/match a screen from an image), you must:

1. **Infer mobile vs desktop from the screenshot itself** (before editing).
2. **Immediately read** the matching doc under `docs/`.
3. Then implement — theme, shell, tokens, and patterns must follow that doc.

Do not wait for the user to say `mobile:` / `desktop:` or to @-mention the design docs.

## Classify from the screenshot

**Mobile** — e.g. bottom sticky tab bar; compact header (Log in / Registration or Deposit + profile); narrow phone frame; PAYMENTS-style subbar; casino/sports bottom nav cues.

**Desktop** — e.g. left/right sidebars; wide sportsbook chrome; dense desktop header/nav; full-width desktop layout.

**Ambiguous only** → ask once: mobile or desktop? Do not invent a hybrid.

Optional overrides (if present): `mobile:` / `@Mobile_Design.md` → mobile; `desktop:` / `@DESIGN_SYSTEM.md` → desktop.

## Auto-read (mandatory)

| Inferred platform | Read first | Implement in |
|-------------------|------------|--------------|
| Mobile | [`docs/Mobile_Design.md`](docs/Mobile_Design.md) | `mobile/` (`mh-*` / page CSS) |
| Desktop | [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) | root pages + [`css/styles.css`](css/styles.css) tokens |

Mobile still uses shared tokens from `docs/DESIGN_SYSTEM.md` / `css/styles.css` when needed — do not invent a new palette.

## Hard constraints

- Do not mix platforms unless the user asks.
- Prefer design-system tokens; do not ship live Figma blues as raw hex when a token exists.
- Match screenshot structure; restyle with project tokens.
- When adding a new page/pattern, update the matching design doc under `docs/`.
