# Mobile Footer Patterns

Reusable layout, spacing, and class conventions for the mobile site footer and bottom navigation.

**Reference:** [1xlite mobile](https://1xlite-46272.pro/en?platform_type=mobile)  
**Canonical implementation:** `mobile/index.html` + `mobile/css/mobile-home.css` (scoped under `body.mh-page`)  
**Design tokens:** `docs/DESIGN_SYSTEM.md` / `css/styles.css`

Use this file when building other pages under `mobile/`. Copy the footer + tab bar markup and keep the same class names so spacing stays consistent.

---

## Scope rules

- Mobile-only. Do **not** change desktop HTML/CSS/JS for footer work.
- Prefer design-system tokens. Do **not** ship live-site Figma blues (`#1d4268`, `#276aa5`, `#205583`) as raw hex when a token exists.
- Assets live under `mobile/assets/` (logos, icons). Do not point at desktop-only paths unless shared intentionally.

---

## Token mapping (reference → our system)

| Role | 1xlite (approx.) | Our token |
|------|------------------|-----------|
| Footer page bg | `#0b1d33` / `#1d4268` shell | `--page-bg` |
| Partner strip / age badge | `#205583` | `--header-nav-bg` |
| Partner tile face | `#1d4268` | `--header-bg` |
| App / social / support bars | `#276aa5` | `--header-action` |
| Bet slip circle / full-version link | `#3da5ff` | `--cyan-accent` |
| Tab bar surface | light gray/white | `--surface-primary` |
| Muted tab icons | gray | `--text-muted` |
| Inverse text | white | `--text-inverse` |

---

## Markup skeleton

```html
<footer class="mh-footer">
  <div class="mh-footer__inner">
    <!-- Sports partners slider -->
    <section class="mh-footer__slider" aria-label="Sports partners">
      <h2 class="mh-footer__slider-title">Sports partners</h2>
      <div class="mh-footer__slider-box">
        <div class="mh-footer__slider-track" data-mh-scroll>
          <a class="mh-footer__partner-tile" href="..."><img src="assets/logos/partner-….webp" width="55" height="55" alt="…" loading="lazy" /></a>
          <!-- more tiles -->
        </div>
        <div class="mh-footer__slider-bar" aria-hidden="true">
          <button type="button" class="mh-footer__slider-arrow" data-mh-scroll-prev aria-label="Previous">‹</button>
          <span class="mh-footer__slider-thumb"></span>
          <button type="button" class="mh-footer__slider-arrow" data-mh-scroll-next aria-label="Next">›</button>
        </div>
      </div>
    </section>

    <!-- Esports partners — same structure -->
    <section class="mh-footer__slider" aria-label="Esports partners">…</section>

    <!-- App banner -->
    <a href="#" class="mh-footer__app-banner">
      <div class="mh-footer__app-phone" aria-hidden="true">
        <span class="mh-footer__app-store mh-footer__app-store--apple"></span>
        <span class="mh-footer__app-store mh-footer__app-store--android"></span>
      </div>
      <div class="mh-footer__app-copy">
        <img src="assets/logos/logo-1xbet-footer.svg" alt="1xBet" width="101" height="22" />
        <span>Mobile application</span>
      </div>
    </a>

    <!-- Social -->
    <div class="mh-footer__social">
      <a class="mh-footer__social-btn" href="…" aria-label="Facebook"><img src="assets/icons/icon-facebook.svg" width="16" height="16" alt="" /></a>
      <a class="mh-footer__social-btn" href="…" aria-label="Instagram"><img src="assets/icons/icon-instagram.svg" width="16" height="16" alt="" /></a>
    </div>

    <!-- Support -->
    <a href="…" class="mh-footer__support">
      <img class="mh-footer__support-icon" src="assets/icons/icon-support.svg" width="42" height="42" alt="" />
      <span class="mh-footer__support-copy">
        <strong>Customer Support</strong>
        <span>Ask any questions</span>
      </span>
    </a>

    <!-- Legal -->
    <div class="mh-footer__legal-block">
      <p class="mh-footer__legal">Copyright © 2026 «1xBet».</p>
      <p class="mh-footer__cookie">… <a href="…">Find out more</a></p>
    </div>

    <a href="../index.html" class="mh-footer__full">Go to the full version of the website</a>

    <div class="mh-footer__meta">
      <span class="mh-footer__age">18+</span>
      <button type="button" class="mh-footer__lang" aria-label="Language">
        <img src="assets/logos/flag-my.svg" width="16" height="16" alt="" />
        <span>EN</span>
        <span class="mh-footer__lang-chevron" aria-hidden="true">▾</span>
      </button>
    </div>
  </div>
</footer>

<nav class="mh-tabbar" aria-label="Mobile primary">
  <a class="mh-tab is-active" href="…">…Sports</a>
  <a class="mh-tab" href="…">…Casino</a>
  <button type="button" class="mh-tab mh-tab--coupon" id="mh-betslip-btn">
    <span class="mh-tab__coupon-wrap">
      <span class="mh-tab__coupon-icon"><img src="assets/icons/tab-coupon.svg" width="18" height="18" alt="" /></span>
      <span class="mh-tab__badge" id="mh-bet-count" hidden>0</span>
    </span>
    <span>Bet slip</span>
  </button>
  <button type="button" class="mh-tab" data-auth-open="login">…Log in</button>
  <button type="button" class="mh-tab" id="mh-menu-btn">…Menu</button>
</nav>
```

JS hooks (see `mobile/js/mobile-home.js`):

- `data-mh-scroll` — horizontal track
- `data-mh-scroll-prev` / `data-mh-scroll-next` — arrow buttons for that track’s sibling group

---

## Measured spacing (390px reference)

### Footer shell

| Property | Value |
|----------|-------|
| Inner padding | `8px` |
| Background | `--page-bg` |

### Sports / Esports partners

| Property | Value |
|----------|-------|
| Section margin-bottom | `16px` |
| Title | `16px` / `700` / uppercase / centered / `margin-bottom: 12px` |
| Box padding | `12px` |
| Box radius | `8px` |
| Box background | `--header-nav-bg` |
| Tile size | `72×72` |
| Tile padding | `8px` |
| Tile radius | `8px` |
| Tile background | `--header-bg` |
| Tile gap | `4px` (equal between every card) |
| Logo | `55×55`, `object-fit: contain`, centered in tile |
| Scrollbar row | thin thumb + small white arrows |

Esports uses the **same** rules (equal tile width, padding, logo size, vertical alignment).

### Mobile app banner

| Property | Value |
|----------|-------|
| Height | `59px` |
| Padding | `0 10px` |
| Radius | `8px` |
| Background | `--header-action` |
| Layout | flex, vertically centered: `[phone] [logo + “Mobile application”]` |
| Logo width | ~`100px` (do not stretch) |
| Label | ~`13px`, under logo |

### Social buttons

| Property | Value |
|----------|-------|
| Grid | `1fr 1fr` |
| Gap | `4px` |
| Margin-top | `4px` |
| Button height | `40px` |
| Radius | `8px` |
| Background | `--header-action` |
| Icons | `16×16`, centered, inverted white |

### Customer support

| Property | Value |
|----------|-------|
| Height | `50px` |
| Margin-top | `16px` |
| Padding | `4px 20px` |
| Radius | `8px` |
| Background | `--header-action` |
| Icon | `42×42`, vertically centered |
| Title | uppercase, bold ~`12px` |
| Subtitle | ~`11px`, slightly muted white |

### Copyright / cookie / full version / meta

| Block | Rules |
|-------|--------|
| Legal block | grid `gap: 16px`, `margin: 16px 0`, text centered |
| Copyright | ~`13px`, centered |
| Cookie | ~`13px`, centered; link uses `--cyan-accent` |
| Full version | centered, ~`14px`, `--cyan-accent`, above meta row |
| Meta row | `space-between`, `padding: 0 8px` |
| 18+ | bottom-left; `min 40×32`, `padding: 8px`, radius `8px`, bg `--header-nav-bg` |
| Language | bottom-right; flag `16×16` circle + `EN` + chevron, vertically centered |

### Bottom navigation

| Property | Value |
|----------|-------|
| Height | `56px` + `env(safe-area-inset-bottom)` |
| Columns | `5` equal `1fr` |
| Background | `--surface-primary` |
| Icon size | `20×20` (muted via filter) |
| Label | ~`11px` / `700` |
| Active Sports | `--accent-blue` tint on icon/label |
| Bet slip circle | `32×32`, `border-radius: 50%`, bg `--cyan-accent`, raised (`margin-top: -10px`) |
| Coupon icon | ~`16–18px`, white |
| Page padding-bottom | `calc(var(--mh-tabbar-h) + safe-area)` so content clears the bar |

CSS variables on `body.mh-page`:

```css
--mh-tabbar-h: 56px;
```

---

## Responsive (320–480px)

Everything is fluid with `%` / `fr` / flex. No fixed max-width on the footer or tab bar.

| Viewport | Expectation |
|----------|-------------|
| 320 | Partner track scrolls; social stays two equal columns; app logo may shrink via `max-height` |
| 360–390 | Matches measured reference |
| 412–480 | Same proportions; more partner tiles visible before scroll |

Avoid hard-coding widths that break equal social columns or the 5-tab grid.

---

## Assets checklist

| Asset | Path |
|-------|------|
| Partner logos | `mobile/assets/logos/partner-*.webp` |
| Footer wordmark | `mobile/assets/logos/logo-1xbet-footer.svg` |
| Flag | `mobile/assets/logos/flag-my.svg` |
| Facebook / Instagram / Support | `mobile/assets/icons/icon-{facebook,instagram,support}.svg` |
| Tab icons | `mobile/assets/icons/tab-{sports,casino,coupon,user,menu}.svg` |

---

## QA checklist (every mobile page that reuses this footer)

- [ ] Partner title spacing (`12px` under title, `16px` under section)
- [ ] Partner tiles `72×72`, logos `55×55`, gap `4px`, logos centered
- [ ] Esports matches Sports layout exactly
- [ ] App banner height ~59, phone + logo + label vertically centered, images not stretched
- [ ] Social buttons equal width/height, icons centered, `4px` gap
- [ ] Support icon + text vertically centered; hierarchy matches (title / subtitle)
- [ ] Copyright + cookie centered; no extra padding bloat
- [ ] Full-version link centered; ~14px
- [ ] 18+ bottom-left; language bottom-right; flag/lang vertically centered
- [ ] Tab bar `56px` + safe area; equal item widths; coupon circle `32px`
- [ ] Colors use tokens from the table above
- [ ] Spot-check 320 / 360 / 375 / 390 / 412 / 430 / 480

---

## Reuse recipe for a new mobile page

1. Keep page styles under `mobile/css/` and scope with a page class if needed (or share `mobile-home.css` footer/tab sections into a shared `mobile/css/footer.css` later).
2. Paste the footer + `mh-tabbar` markup from `mobile/index.html`.
3. Wire the same JS scroll helpers / bet-slip / menu if those controls are present.
4. Point links to the correct relative paths (`../` for desktop pages).
5. Run the QA checklist against the 1xlite reference footer.
