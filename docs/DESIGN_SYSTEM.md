# Sportsbook Design System

Reference for designing **new pages** in this project. Preserve desktop visual identity; adapt responsively. Do not invent a new look.

**Stack:** static HTML + `css/styles.css` + `js/script.js` (no React/build).  
**Color lock:** `assets/images/references/sports-home-reference-modified-color.png`  
**Structure/icons:** live site + Figma (remap Figma hex → tokens below).  
**Tables / odds / data:** homepage canon in **§2.1** — reuse those classes and tokens on every new sportsbook table.

---

## 1. Dual source of truth

| Concern | Source |
|--------|--------|
| Structure, modules, labels, density, icons | Live site / Figma |
| Colors, CTAs, surfaces, chrome | Modified-color PNG + CSS tokens |
| Interactions / demo behaviour | Existing `js/script.js` patterns |

**Never** ship Figma chrome hex as the palette (`#1d4268`, `#205583`, `#276aa5`, `#7eac2f`, etc.). Keep layout/icons; remap fills/borders/text to tokens.

---

## 2. Color tokens (`:root` in `css/styles.css`)

### Dark chrome (page shell, header, sidebars, footer)

| Token | Hex | Use |
|-------|-----|-----|
| `--page-bg` | `#0b1d33` | Page background |
| `--page-bg-secondary` | `#0e243d` | Layout gutter / sportsbook bg |
| `--header-bg` / `--header-bar-bg` | `#0f2744` | Header, footer shell |
| `--header-bg-strong` | `#0b1d33` | Strong navy |
| `--header-nav-bg` | `#143a5c` | Nav bar strip |
| `--sidebar-bg` | `#162b45` | Left/right sidebars |
| `--sidebar-bg-hover` | `#1e3a5c` | Sidebar hover |
| `--sidebar-row` / `--section-blue` | `#1a4f8a` | Rows, section chrome |
| `--section-blue-dark` | `#143f6e` | Section gradients / footer cards |
| `--border-dark` | `#1a3a5c` | Dark borders |

### Actions & accents

| Token | Hex | Use |
|-------|-----|-----|
| `--brand-blue` | `#2b78d6` | **Log In** only (primary auth blue) |
| `--brand-blue-hover` | `#3b88e6` | Login hover |
| `--header-action` | `#2f69b1` | Header icon buttons, settings/lang chips, Mobile Version |
| `--header-action-hover` | `#3b88e6` | Header action hover |
| `--accent-blue` | `#2f69b1` | Tabs, filters, +more, active chrome accents |
| `--accent-blue-hover` | `#55c2f5` | Accent hover |
| `--accent-blue-soft` | `#7ed0f5` | Soft borders on light chips |
| `--cyan-accent` | `#3eb4f0` | Focus rings, selected odds |
| `--cyan-soft` | `#9adcf8` | Soft links / hover text on dark |
| `--action-green` | `#88af2a` | **Registration / Generate / Take part / HOT / active tab underline** |
| `--action-green-hover` | `#9bc433` | Green CTA hover |
| `--action-green-active` | `#6f9220` | Green pressed |
| `--danger` | `#e95555` | LIVE indicators |
| `--warning` | `#f1b630` | Favourites / warnings |
| `--success` | `#88af2a` | Same family as action green |

### Light content surfaces (odds, tables, dropdowns on light)

| Token | Hex | Use |
|-------|-----|-----|
| `--surface-primary` | `#ffffff` | Cards, tables, menus |
| `--surface-secondary` | `#f4f7fb` | Secondary panels |
| `--surface-tertiary` | `#e8eef5` | Tertiary fills |
| `--row-alternate` | `#eef3f8` | Zebra rows |
| `--league-header` | `#d8e3ee` | League headers |
| `--odds-bg` | `#e8eef5` | Odd buttons |
| `--odds-hover` | `#d4e6f8` | Odd hover |
| `--odds-selected` | `#3eb4f0` | Selected odd |
| `--border-light` | `#c9d7e4` | Light borders |
| `--text-primary` | `#1a3048` | Body on light |
| `--text-secondary` | `#5a738a` | Secondary on light |
| `--text-muted` | `#8a9db0` | Muted / sidebar muted |
| `--text-inverse` | `#ffffff` | Text on dark |

### Color role rules

1. **Lime green** (`--action-green`) = conversion CTAs only (Register, Generate, promo Take part, HOT badge, Matches underline).
2. **Brand blue** (`--brand-blue`) = Log In.
3. **Header/action blue** = square icon buttons, meta chips, mobile version button.
4. **Accent blue** = navigation/tabs/filters/active highlights — not Login.
5. Left nav sports lists stay **dark navy + light text**, not white Figma lists.
6. Odds tables / bet-slip bodies stay **light surfaces + dark text**.

### Page theme families

| Family | Pages | Chrome | Content |
|--------|-------|--------|---------|
| **Sportsbook (dark shell)** | `index.html`, `national-team.html`, `live-national-team.html`, `marble-live.html`, `big-tournaments.html`, `long-term-bets.html`, `multi-live.html`, `fast-bet.html`, `world-flight-26.html` | Dark navy header / left nav / footer; active rows `--accent-blue` | Light odds tables / empty boards / promo heroes (`--surface-primary`, `--surface-secondary`, `--league-header`, `--odds-bg`) |
| **TOP-EVENTS (light content)** | `wc2026.html`, `msi.html` | Shared dark site header/footer; page gutter + tournament chrome via `css/top-events-theme.css` | White cards, light subnav, light side panels |

**Sports / Big Tournaments** must match the homepage table/data map in **§2.1** below (same tokens + same class patterns). Do **not** use light Figma list backgrounds (`--surface-tertiary`) for Sports left-nav lists.

### 2.1 Odds tables & data surfaces (homepage canon — reuse this)

**Source of truth:** LIVE / LINE blocks on `index.html` + shared rules in `css/styles.css` (`.live-events-block`, `.odds-table-wrap`, `.league-header`, `.event-row`, `.odd-btn`).  
**Rule for new pages:** if the UI is a sportsbook table, outright grid, event list, or odds chips — **reuse these classes and tokens**. Do not invent a parallel light/dark table palette. Page-specific CSS may wrap markup, but fills/borders/text must map 1:1 to this section.

#### Canonical stack (prefer these classes)

```
.live-events-block (or equivalent section)
  .te-toolbar / .section-toolbar     ← dark section chrome
  .odds-table-wrap                   ← light table shell
    .league-block
      .league-header                 ← column / league bar
      .league-body
        .event-row                   ← data row
          .odd-btn                   ← odds chip
```

Outright / custom tables (e.g. Big Tournaments) may use semantic `<table>` markup, but **must paint the same layers** with the same tokens (see map below). Prefer mirroring `.bt-*` → homepage tokens already documented in `css/big-tournaments.css`.

#### Layer color map

| Layer | Classes (homepage) | Background | Text / accents | Border / shadow |
|-------|--------------------|------------|----------------|-----------------|
| **Section title bar** | `.te-toolbar-main`, `.te-crumbs`, `.section-toolbar`, `.acc-header` | `linear-gradient(180deg, var(--section-blue) → var(--section-blue-dark))` | `--text-inverse` / `#fff`; muted tabs `rgba(255,255,255,.65)` | — |
| **Active tab underline** | `.te-toolbar .section-tab.active::after` | `--action-green` (2px) | — | — |
| **LIVE dot** | `.live-dot` | `--danger` | — | pulse glow |
| **Table wrap** | `.live-events-block .odds-table-wrap`, `.acc-card` | `--surface-primary` | — | `1px solid var(--border-dark)`; `box-shadow: 0 2px 10px rgba(0,0,0,.18)`; bottom radius `--radius-md` |
| **League / column header** | `.league-header` | `--league-header` | Title `--text-primary`; col labels `.col-label` → `--text-secondary` | Separators via grid gap; league block bottom `--border-light` |
| **League icon chip** | `.league-icon` | `--section-blue` | `#fff` | radius `--radius-xs` |
| **Header icon buttons** | `.icon-tiny` | transparent; hover `rgba(18,103,214,.12)` | `--text-secondary`; hover `--brand-blue`; fav active `--warning` | — |
| **Data row (odd)** | `.event-row` | `--surface-primary` | Teams `--text-primary` (600) | Top `1px solid #e4edf4` |
| **Data row (even)** | `.event-row:nth-child(even)` | `--row-alternate` | same | same |
| **Time / meta** | `.event-time`, `.total-val`, `.handicap-val` | — | `--text-secondary`; LIVE time `--danger` + bold | tabular-nums |
| **Score** | `.team-line .score` | — | `--text-secondary`; LIVE score `--danger` | — |
| **Stats cell** | `.stats-cell` | — | `--text-muted` | — |
| **+more markets** | `.more-link` | `--accent-blue`; hover `--accent-blue-hover` | `#fff` | pill radius |
| **Odds chip default** | `.odd-btn` | `--odds-bg` | `--text-primary` | `1px solid rgba(201,215,228,.8)`; inset highlight |
| **Odds chip hover** | `.odd-btn:hover` | `--odds-hover` | `--text-primary` | — |
| **Odds chip selected** | `.odd-btn.selected` | `--odds-selected` | `#fff` | border `#1a8fc4`; white corner dot |
| **Odds disabled** | `.odd-btn:disabled` | (same) | opacity `0.4` | — |

**Do not** paint LIVE/LINE league headers with dark navy — those stay light (`--league-header`). Outright market-group headers (1-3RD PLACE → Winner) use **`--section-blue`** + white text (never `--header-bg` / page navy — it crashes into the shell); title bar uses `--accent-blue`; see Outright / Yes–No below.

#### Sport filter chips (above / beside tables)

| State | Class | Background | Text / border |
|-------|-------|------------|---------------|
| Default | `.filter-chip` | `--surface-primary` | text `--text-secondary`; border `--accent-blue-soft` |
| Hover | `.filter-chip:hover` | `rgba(62,180,240,.08)` | text/border `--accent-blue` |
| Active | `.filter-chip.active` | `--accent-blue` | text `#fff`; border `--accent-blue` |

Chip strip background (standalone): `--surface-secondary` + bottom `--border-light`. Compact toolbar chips sit on the dark section bar (transparent strip).

#### Left-nav data lists (not light tables)

| State | Class | Background | Text |
|-------|-------|------------|------|
| Row | `.sport-item` | `--sidebar-bg` | `rgba(255,255,255,.9)` |
| Hover | `.sport-item-main:hover` | `--sidebar-bg-hover` | inverse |
| Active | `.sport-item.active …` | `--accent-blue` | inverse; count muted white |
| Count | `.sport-item .count` | — | `--sidebar-muted` |
| Section head | `.top-games-head`, `.sidebar-row` | `--section-blue` | `--text-inverse` |

Same map for Sports pages: `.bt-tour-item` / `.bt-side-*` must follow these tokens (already aligned in `css/big-tournaments.css`).

#### Right-rail data panels (bet slip / reg / generator)

| Layer | Classes | Colors |
|-------|---------|--------|
| Panel shell | `.reg-panel`, `.bet-slip-panel`, `.generator-panel`, `.app-panel` | bg `--surface-tertiary`; text `--text-primary`; radius `8px` |
| Bet tabs bar | `.bet-slip-tabs`, `.bet-tab` | bg `--header-nav-bg`; muted `--sidebar-muted`; active bg `--section-blue` + `#fff` |
| Bet / my-bets body | `.bet-slip-body`, `.my-bets-body` | `--surface-tertiary` |
| Empty / bet card | `.bet-empty`, `.bet-item` | `#fff`; border `--border-light`; text primary/secondary/muted |
| Selection odds value | `.bet-item-sel .odds`, `.acc-odd` | `--brand-blue` (numeric emphasis on light) |
| Toolbar title / save | `.bet-toolbar-title`, `.bet-save-link` | `--section-blue` |
| Icon chips | `.bet-icon-btn` | `--odds-bg`; hover `--border-light` |
| Reg tabs | `.reg-tab` | default `--odds-bg`; active `--section-blue` + `#fff` |
| Inputs | `.reg-input`, `.reg-select`, stake inputs | `#fff` + `--text-primary`; placeholder `--text-muted` |
| Primary CTA | `.btn-reg`, `.btn-slip-reg` | `--action-green` / hover `--action-green-hover` |
| Bonus bar | `.reg-bonus-bar` | `--section-blue`; hover `--brand-blue` |

#### Accumulators (data cards)

| Layer | Colors |
|-------|--------|
| Card | `--surface-primary` + `--border-dark` + same soft shadow as odds wrap |
| Header | section-blue gradient; bonus line `--cyan-soft` |
| List rows | border `--border-light`; match `--text-primary`; sel `--text-secondary`; odd `--brand-blue` |
| Footer | `--surface-secondary`; strong total `--text-primary` |

#### Outright / Yes–No tables (Sports pages)

Three-tier header matching Big Tournaments screenshot:

| Layer | Class | Token / style |
|-------|-------|----------------|
| Title bar | `.bt-titlebar` | `--accent-blue` solid; `--text-inverse` |
| Wrap | `.bt-table-wrap` | `--surface-primary` + `--border-light` + soft shadow (separates from page navy) |
| Market + Team header | `.bt-thead-labels` / `.bt-th-market` / `.bt-th-team` | **`--section-blue`** + `--text-inverse` — do **not** use `--header-bg` / page navy (crashes into shell) |
| yes/no sub-row | `.bt-thead-yn` / `.bt-th-yn` | `--league-header` + `--text-secondary` lowercase |
| Body rows / Team cells | `.bt-team-row` / `.bt-td-team` | light `--surface-primary` / `--row-alternate` + `--text-primary` (Team column stays light) |
| Odds / empty | `.bt-odd` / `.bt-dash` | `--odds-bg` chips; selected `--odds-selected` |

**Note:** Match-odds LIVE/LINE tables keep light `.league-header` + zebra `.event-row`. Outright market headers use **`--section-blue`** (not `--header-bg`); title uses brighter `--accent-blue`.

#### Long-term bets feed (`long-term-bets.html`)

Figma `20:169`. Left nav lists sports with counts; main feed is collapsible league blocks (not the Yes/No outright grid).

| Layer | Class | Token / style |
|-------|-------|----------------|
| Side title | `.lt-side-title` | `--section-blue` + inverse text |
| Sport rows | `.lt-sport-item` | `--sidebar-bg`; active `--accent-blue` |
| Toolbar | `.lt-toolbar` | section-blue gradient (same as `.te-toolbar`) |
| Sport chips | `.lt-filters` / `.lt-chip` | section-blue → section-blue-dark gradient (not `--header-bg`); active underline `--action-green` |
| League bar | `.lt-league-bar` | **`--section-blue`** + inverse (not `--header-bg` — crashes into page navy) |
| Date strip | `.lt-date` | `--surface-secondary` + `--text-secondary` |
| Event row | `.lt-event` | `--surface-primary`; hover `--surface-secondary` |
| Odds | `.lt-odd` / `.odd-btn` | `--odds-bg` / `--odds-hover` / `--odds-selected` |
| +more | `.lt-more` | `--accent-blue` |
| Block shell | `.lt-block` | no light border; soft shadow only |

Icons: reuse `sport-*` / `te-*` / `nav-*`; league badges from Figma as `lt-*.png` under `assets/icons/`.

#### Multi-LIVE empty board (`multi-live.html`)

Figma `21:2`. No left sidebar — layout `.sportsbook-layout.ml-layout` is `1fr | 260px`.

| Layer | Class | Token / style |
|-------|-------|----------------|
| Toolbar / crumbs | `.ml-toolbar` | section-blue → section-blue-dark gradient |
| Sport chips | `.ml-filters` / `.ml-chip` | same section-blue gradient; active underline `--action-green` |
| Empty board | `.ml-board` | `--surface-secondary`; title `--text-primary`; copy `--text-secondary` |
| Right rail | shared | same as homepage (reg / bet slip / generator) |

Icons: reuse `te-*` / `sport-*` from Figma exports already in `assets/icons/`.

#### Reuse checklist (new table or data block)

1. [ ] Link `css/styles.css` (tokens + shared `.odd-btn` / `.odds-table-wrap` if possible)
2. [ ] Dark chrome on toolbar / title bar; LIVE/LINE league headers stay light; outright market labels use dark `--section-blue` (see §2.1 Outright)  
3. [ ] Table body is light: white / `--row-alternate`  
4. [ ] Odds use `.odd-btn` (or identical token states) — never green chips for odds
5. [ ] LIVE / danger only for live time, live score, LIVE dot
6. [ ] Numeric odds emphasis on light cards (bet slip / acc) uses `--brand-blue`, not `--action-green`
7. [ ] Left lists stay dark navy; do not copy Figma white sport lists
8. [ ] No new hex for table chrome — remap Figma → tokens above

---

## 3. Typography

- **Font:** `var(--font)` → `Arial, Inter, system-ui, sans-serif`
- **Base size:** `12px` body; UI often `11–14px`
- **Weights:** `400` regular, `600–700` UI emphasis, `800–900` titles / CTAs
- **Case:** Section titles and many CTAs are **uppercase** with tight letter-spacing
- **On dark:** white / `rgba(255,255,255,.65–.85)` / `--cyan-soft` for hover
- **On light:** `--text-primary` / `--text-secondary`

Do not introduce display/serif fonts or a second type system on new pages.

---

## 4. Spacing & radius

| Token | Value |
|-------|-------|
| `--gap` | `8px` (layout default) |
| `--radius-xs` | `2px` |
| `--radius-sm` | `4px` |
| `--radius` | `6px` |
| `--radius-md` | `8px` (most cards/panels) |
| `--radius-lg` | `10px` |
| `--radius-xl` | `12px` |
| `--header-h` | `96px` desktop; `56px` mobile |

Prefer `8px` rhythm. Panels use `--radius-md`. Avoid large “marketing” radii unless matching an existing component.

---

## 5. Layout shell

```
.page-shell
  .site-header (sticky)
  .sportsbook-layout
    .left-sidebar
    .main-content
    .right-sidebar
  .site-footer
```

### Desktop grid

- `sportsbook-layout`: `250px | 1fr | 260px`, gap `--gap`, padding `--gap`
- Sticky header; sidebars sticky/scroll within viewport height
- Desktop design is the **default** — do not redesign it for mobile

### Breakpoints (adapt only)

| Max width | Behaviour |
|-----------|-----------|
| `1400px` | Fluid shell, compact/scrollable nav |
| `1200px` | Right rail stacks under main (3-col grid) |
| `1024px` | Tighter header; hide secondary header icons |
| `900px` | Single column; drawers + bottom tab bar |
| `600px` | Denser promo/header/footer |

### Mobile chrome (≤900px)

- Hamburger → primary nav drawer (`#header-bottom.is-open`)
- Bottom tab bar: Sports / Live / Bet slip / Menu
- Left sports = left drawer; bet slip/reg = bottom sheet
- Backdrop `#drawer-backdrop`; body `.drawer-open` locks scroll
- Event rows → card layout with 1X2 only (`.event-odds-mobile`); hide `.desktop-odds`

---

## 6. Component patterns

### Buttons

| Class | Role |
|-------|------|
| `.btn-login` | Auth — `--header-action` / brand family |
| `.btn-register` / `.btn-promo` / green CTAs | Conversion — `--action-green` |
| `.icon-btn-square` | 32×32 header tools — `--header-action` |
| `.footer-mobile-btn` | Full-width — `--header-action` |
| `.odd-btn` | Light odds chip; `.selected` → `--odds-selected` |

### Section chrome

- Dark toolbars: gradient `--section-blue` → `--section-blue-dark`
- Active tab underline on LIVE: `--action-green` (2px)
- HOT badge: `--action-green`
- Light tables sit on `--surface-primary` with `--border-dark` / `--border-light`

### Odds tables & data (mandatory reuse)

Full token/class map: **§2.1**. Summary:

| Piece | Reuse |
|-------|--------|
| Wrap | `.odds-table-wrap` under `.live-events-block` (or same tokens) |
| League bar | `.league-header` → `--league-header` |
| Rows | `.event-row` + zebra `--row-alternate` |
| Odds | `.odd-btn` / `.selected` → `--odds-bg` / `--odds-selected` |
| +more | `.more-link` → `--accent-blue` |
| Filters | `.filter-chip` → accent-blue soft / active |

New pages with tables **must** follow §2.1 — do not fork a second table theme.

### Cards / panels

- Dark panels: `--section-blue-dark` or `--sidebar-bg`, radius `--radius-md`
- Light panels: white / `--surface-secondary` / `--surface-tertiary` (right rail)
- Prefer existing classes over new card systems

### Forms (registration)

- Dark panel, green primary submit
- Tabs with icon + label; selects with flag + chevron
- Demo-only: toast + “no account created” messaging

### Icons

Reuse Figma-exported assets under `assets/icons/` with prefixes:

| Prefix | Area |
|--------|------|
| `icon-*`, `logo-*`, `flag-*` | Header |
| `nav-*`, `sport-*` | Left sidebar |
| `te-*` | TOP-EVENTS / LIVE toolbar |
| `rb-*` | Right block |
| `ft-*` | Footer |

Prefer SVG from Figma over inventing new icons. Keep white/`currentColor` fills; don’t recolor to Figma blues.

---

## 7. Page modules (homepage map)

Use as a checklist when cloning patterns onto new pages:

1. **Header** — brand, actions, primary nav  
2. **Left nav** — Favorite / Recommended / Top Games / LIVE–SPORTS / A–Z  
3. **Promo slider** — full-bleed photo slides, green CTA  
4. **Game strip** — horizontal cards  
5. **TOP-EVENTS + LIVE toolbar** — banner, crumbs, tabs, search, stream toggle, sport chips + more menu  
6. **Odds tables** — league blocks, light rows (**§2.1 canon**)  
7. **LINE section** — same table language as LIVE  
8. **Accumulators** — dual cards (same wrap/header/odds emphasis as §2.1)  
9. **Right block** — registration, bet slip, generator, app  
10. **Footer** — link columns, partners strip, legal / support / social  

New pages should reuse these modules’ classes and tokens rather than inventing parallel UI. Any new odds/data table = copy §2.1.

**Sports pages** (`national-team.html`, `big-tournaments.html`, `long-term-bets.html`): reuse homepage shell + **§2.1** table/data map. Big Tournaments / Long-term keep page markup in `css/big-tournaments.css` / `css/long-term-bets.css` but colors must match homepage tables.

**Live National Team** (`live-national-team.html`, Figma `23:1500`): same shell + odds table + accumulators as `national-team.html` / homepage LIVE; Live nav active; crumbs Home → trophy → LIVE; Malaysia-focused live leagues via `js/script.js` (`data-page="live-national-team"`).

**Marble-Live** (`marble-live.html`, Figma `23:10116`): Live sportsbook shell + §2.1 odds table; left nav lists marble sports; `data-page="marble-live"` drives `js/script.js` mock leagues; shared league icon `assets/icons/marble/league-football.png`.

**Fast Bet** (`fast-bet.html`, Figma `23:17045`): Live nav active; full-width hero card grid (no sidebars); assets in `assets/images/fast-bet/`; `css/fast-bet.css` + `js/fast-bet.js`.

**World Flight 26** (`world-flight-26.html`, Figma `23:17704`): 1xGames promo landing; hero background `assets/images/world-flight-26/hero.png`; `css/world-flight-26.css` + `js/world-flight-26.js`.

**TOP-EVENTS pages** (`wc2026.html`, `msi.html`): shared light theme in `css/top-events-theme.css` + page CSS (tournament chrome; still use `.odd-btn` tokens for odds chips where present).

---

## 8. Interaction conventions

- Demo toasts via `showToast()` — no real auth/payments
- Odds toggle into bet slip; sync `.selected` on buttons
- Dropdowns: click outside / Escape to close
- Mobile drawers: one open at a time; backdrop closes all
- Overflow sport chips → more menu (measure width, don’t horizontal-scroll the bar forever)
- Prefer progressive enhancement; keep markup semantic (`header`, `nav`, `main`, `aside`, `footer`)

---

## 9. New-page checklist

When designing a **new page**:

1. [ ] Start from existing shell (header + layout + footer) unless the page is intentionally standalone  
2. [ ] Use only CSS variables from `:root` — no new brand hex  
3. [ ] Remap any Figma colors to tokens  
4. [ ] Reuse icon prefixes / existing SVG assets  
5. [ ] Match density: compact sportsbook UI, not marketing landing bloat  
6. [ ] Desktop first; add adaptations under existing breakpoints  
7. [ ] Light content areas for data; dark chrome for navigation  
8. [ ] Green = CTA, brand blue = login, accent blue = nav/active  
9. [ ] **Tables / odds / data rows:** follow **§2.1** (reuse `.odds-table-wrap`, `.league-header`, `.event-row`, `.odd-btn` or identical tokens)  
10. [ ] Mobile: no forced `min-width` desktop tables; card/stack patterns  
11. [ ] Keep interactions demo-safe and consistent with `js/script.js`  

---

## 10. Anti-patterns

- Purple/indigo AI-default themes, cream+terracotta, broadsheet newspaper layouts  
- Flat single-color pages with no chrome hierarchy  
- Cards everywhere (especially in heroes)  
- Replacing token colors with screenshot/Figma hex  
- Dark navy column headers or green odds chips on sportsbook tables  
- A second table theme instead of §2.1  
- Hiding nav on mobile without a replacement drawer/tab bar  
- Horizontal-scrolling full odds grids as the only mobile solution  

---

## 11. File map

| Path | Role |
|------|------|
| `index.html` (+ other root HTML) | Page structure |
| `css/styles.css` | Tokens + shared UI |
| `css/top-events-theme.css` | WC2026 / MSI light theme |
| `css/wc2026.css` / `css/msi.css` / `css/big-tournaments.css` / `css/long-term-bets.css` / `css/multi-live.css` | Page-specific styles |
| `js/script.js` | Homepage / national-team / live-national-team demo interactions |
| `js/wc2026.js` / `js/msi.js` / `js/big-tournaments.js` / `js/long-term-bets.js` / `js/multi-live.js` | Page-specific scripts |
| `assets/icons/` | UI icons (prefixed) |
| `assets/images/` | Heroes, partners, art |
| `assets/fonts/` / `assets/videos/` | Reserved static asset folders |
| `assets/images/references/sports-home-reference-modified-color.png` | Color source of truth |
| `docs/DESIGN_SYSTEM.md` | Design system reference |
| `.cursor/rules/modified-color-palette.mdc` | Always-on color lock |
| `.cursor/rules/design-system.mdc` | Always-on design system pointer |
