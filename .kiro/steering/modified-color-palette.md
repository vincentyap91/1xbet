---
inclusion: always
---

# Modified-color palette (locked)

**Color source of truth:** `assets/images/references/sports-home-reference-modified-color.png`

Structure/icons may come from the live site or Figma. **Colors must always match this PNG**, not Figma hex values and not live-site brand HSL.

## Dual source of truth

| Concern | Source |
|--------|--------|
| Structure, modules, labels, density | Live site / Figma layout |
| Colors, CTAs, surfaces, chrome | `assets/images/references/sports-home-reference-modified-color.png` |

## Required tokens (`css/styles.css` `:root`)

Use these CSS variables. Do not hardcode competing hex from Figma.

- Page / chrome navy: `--page-bg` `#0b1d33`, `--header-bg` `#0f2744`, `--sidebar-bg` `#162b45`
- Brand / Login blue: `--brand-blue` `#2b78d6` (header Log In only)
- Header actions / tabs accent: `--header-action` / `--accent-blue` `#2f69b1` (icon buttons, filters, +more)
- Bright sky accents: `--cyan-accent` `#3eb4f0`, `--accent-blue-soft` `#7ed0f5`, `--cyan-soft` `#9adcf8`
- Section / sidebar row blue: `--section-blue` `#1a4f8a`
- Registration / Generate / HOT / tab underline: `--action-green` `#88af2a`
- Light content surfaces: `--surface-primary` `#fff`, `--odds-bg` `#e8eef5`, `--league-header` `#d8e3ee`
- Text on light: `--text-primary` `#1a3048`; on dark: white / `--cyan-soft`

## Rules

1. When importing from Figma, keep icons/layout; **remap colors** to the tokens above.
2. Never reintroduce Figma chrome hex (`#1d4268`, `#205583`, `#276aa5`, `#7eac2f`) as the site palette.
3. Lime green = conversion CTAs only. `--brand-blue` = Log In. `--accent-blue` / `--header-action` = menu/tabs/filters; `--cyan-accent` for selected odds / focus.
4. Left nav sports lists stay **dark navy chrome** with light text (per reference), not Figma white lists.
5. Odds tables / bet slip bodies stay **light surfaces** with dark text.
