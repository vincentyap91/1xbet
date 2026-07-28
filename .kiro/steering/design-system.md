---
inclusion: always
---

# Design system (new pages)

Full reference: [`DESIGN_SYSTEM.md`](../../docs/DESIGN_SYSTEM.md)

Color lock detail: [`modified-color-palette.mdc`](./modified-color-palette.mdc)

## Dual source of truth

- **Structure / labels / icons** → live site + Figma
- **Colors** → `assets/images/references/sports-home-reference-modified-color.png` + CSS tokens in `css/styles.css`
- Remap Figma hex; never ship Figma chrome colors as the palette

## Token roles (must follow)

- `--action-green` `#88af2a` → Register / Generate / Take part / HOT / active tab underline
- `--brand-blue` `#2b78d6` → Log In only
- `--header-action` / `--accent-blue` → header chips, tabs, filters, +more
- Dark navy chrome for nav/sidebars/footer; **light** surfaces for odds/tables/bet slip body
- **Tables / odds / data:** reuse homepage canon in `docs/DESIGN_SYSTEM.md` §2.1 (`.odds-table-wrap`, `.league-header`, `.event-row`, `.odd-btn` + same tokens) — do not invent a second table palette
- Sports pages (`national-team`, `big-tournaments`, `long-term-bets`): same dark left-nav + §2.1 table map
- Live Multi-LIVE (`multi-live`): no left nav; section-blue toolbar/chips + light empty board — see `docs/DESIGN_SYSTEM.md` § Multi-LIVE
- Live National Team (`live-national-team`): same as national-team LIVE table shell; Live nav active
- TOP-EVENTS (`wc2026`, `msi`): light content theme via `css/top-events-theme.css`
- Font: `var(--font)` (Arial stack). Radius: mostly `--radius-md` (8px). Gap: `--gap` (8px)

## Layout

- Shell: header → `sportsbook-layout` (left | main | right) → footer
- Desktop is default; do not redesign desktop for mobile
- Breakpoints: 1400 / 1200 / 1024 / **900** (drawers + tab bar) / 600
- Mobile: hamburger nav, bottom Sports/Live/Bet slip/Menu, card-style event rows

## New page rules

1. Reuse existing modules/classes before inventing new UI
2. Reuse `assets/icons/` prefixes: `icon-` `nav-` `sport-` `te-` `rb-` `ft-`
3. Keep compact sportsbook density; demo interactions via existing `js/script.js` patterns
4. Read `docs/DESIGN_SYSTEM.md` before designing any new page
