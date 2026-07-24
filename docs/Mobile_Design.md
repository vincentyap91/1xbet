# Mobile Design Patterns

Reusable layout, spacing, and class conventions for the mobile site (`mobile/`).

**Doc location:** `docs/Mobile_Design.md` (pair with desktop `docs/DESIGN_SYSTEM.md`)

**Reference:** [1xlite mobile](https://1xlite-46272.pro/en?platform_type=mobile)  
**Canonical home:** `mobile/index.html` + `mobile/css/mobile-home.css` (scoped under `body.mh-page`)  
**Sports (Line):** `mobile/sports.html` + `mobile/css/mobile-sports.css` — [1xlite line](https://1xlite-46272.pro/en/line?platform_type=mobile)  
**Search / Events:** `mobile/search.html` + `mobile/css/mobile-search.css` + `mobile/js/mobile-search.js`  
**Event info:** `mobile/event-info.html` + `mobile/css/mobile-event-info.css`  
**Favorites:** `mobile/favourites.html` + `mobile/css/mobile-favourites.css` + `mobile/js/mobile-favourites.js`  
**Results:** `mobile/results.html` + `mobile/css/mobile-results.css` + `mobile/js/mobile-results.js`  
**Statistics:** `mobile/statistics.html` + `mobile/css/mobile-statistics.css` + `mobile/js/mobile-statistics.js` (left competitions drawer)  
**Casino / Slots:** `mobile/casino.html` + `mobile/css/mobile-casino.css` — [1xlite slots](https://1xlite-46272.pro/en/slots?platform_type=mobile) (`.mh-cs-tabbar`: Categories · Providers · MyCasino · Promo · Menu)  
**Live Casino:** `mobile/live-casino.html` + same `mobile-casino.css` / `mobile-casino.js` — [1xlite live casino](https://1xlite-46272.pro/en/casino?platform_type=mobile)  
**Auth:** `mobile/login.html` + `mobile/register.html` + `mobile/css/mobile-auth.css` — [login](https://1xlite-46272.pro/en/user/login?platform_type=mobile) · [registration](https://1xlite-46272.pro/en/registration?type=email&bonus=CASINO)  
**Profile (logged-in):** `mobile/profile.html` + `mobile/css/mobile-profile.css` + `mobile/js/mobile-profile.js` — Figma [`235:18`](https://www.figma.com/design/EdLwHua7n5o3CGSLKW4SFa/1XBET?node-id=235-18)  
**Deposit (logged-in):** `mobile/deposit.html` + `mobile/css/mobile-deposit.css` + `mobile/js/mobile-deposit.js` — methods → amount → confirm → success  
**Withdrawal (logged-in):** `mobile/withdraw.html` + `mobile/css/mobile-withdraw.css` + `mobile/js/mobile-withdraw.js` — methods → amount → confirm → success  
**Bet history (My bets):** `mobile/bet-history.html` — desktop Bet Record filters (shared history shell)  
**Transaction history:** `mobile/transaction-history.html` — desktop Transaction Record filters  
**Promotion record:** `mobile/promotion-record.html` — desktop Promotion Record filters  
**History record (shared):** `mobile/css/mobile-history-record.css` + `mobile/js/mobile-history-record.js`  
**Personal profile:** `mobile/personal-profile.html` + `mobile/css/mobile-personal-profile.css` + `mobile/js/mobile-personal-profile.js` — desktop medal / personal info, mobile shell  
**Security:** `mobile/security.html` (+ `change-language` / `change-password` / `information-center`) + `css/mobile-security.css` + `js/mobile-security.js`  
**Extra (logged-in):** `mobile/referral.html` · `membership.html` · `rebate.html` · `daily-checkin.html` · `live-chat.html` + `css/mobile-extra.css` + `js/mobile-extra.js` (membership reuses `../js/membership.js`)  
**Promo detail example:** `mobile/esports-cashback-boom.html` + `mobile/css/mobile-promo-detail.css`  
**Design tokens:** `docs/DESIGN_SYSTEM.md` / `css/styles.css`

Use this file when building other pages under `mobile/`. Keep the same class names so spacing stays consistent.

---

## Scope rules

- Mobile-only. Do **not** change desktop HTML/CSS/JS for footer / tab-bar work unless shared intentionally.
- Prefer design-system tokens. Do **not** ship live-site Figma blues (`#1d4268`, `#276aa5`, `#205583`) as raw hex when a token exists.
- Assets live under `mobile/assets/` (logos, icons, banners). Do not point at desktop-only paths unless shared intentionally.
- **Full-width layout:** page content, rails, and chrome use `width: 100%` / `max-width: none`. Do **not** center a fixed column (e.g. `max-width: 720px`) on tablet/desktop. Side inset only via `--mh-gutter` inside full-bleed sections when needed for text/chips.

---

## Shell layout (full width)

| Layer | Rule |
|-------|------|
| `html` / `body.mh-page` | `width: 100%`; `max-width: none` |
| `.mh-main` | Full bleed; no centered max-width |
| `.mh-header` / `.mh-tabbar` / `.mh-nt-mode` / `.mh-nt-subbar` | Edge to edge |
| Section rails | Horizontal scroll; track spans full viewport; chip/card padding uses `--mh-gutter` |
| Sport / empty / Generate blocks (National Team) | Full bleed (`border-radius: 0`; no side margin card) |
| Promo hero / rules body | Full bleed (`max-width: none`) |

Wide viewports (≥768px) still stay full width — only typography/padding may scale, not content column width.
---

## Token mapping (reference → our system)

| Role | 1xlite (approx.) | Our token |
|------|------------------|-----------|
| Footer / promo page bg | `#0b1d33` shell | `--page-bg` |
| Partner strip / age badge / sub-bar | `#205583` | `--header-nav-bg` |
| Partner tile / promo cards / rules block | `#1d4268` | `--header-bg` |
| App / social / support bars | `#276aa5` | `--header-action` |
| Bet slip circle / full-version / More links | `#3da5ff` | `--cyan-accent` / `--cyan-soft` |
| Take part / Registration / BEST badge | lime | `--action-green` |
| NEW badge | yellow | `--warning` |
| Log In | blue | `--brand-blue` |
| Tab bar surface | light gray/white | `--surface-primary` |
| Muted tab icons | gray | `--text-muted` |
| Inverse text | white | `--text-inverse` |

---

## Shared JS hooks (`mobile/js/mobile-home.js`)

| Hook | Purpose |
|------|---------|
| `data-mh-scroll` | Horizontal overflow track; wheel maps vertical → horizontal |
| `data-mh-drag-scroll` | Pointer drag (desktop + touch); hides native scrollbar; prevents click after drag |
| `data-mh-flyout-open` / `data-mh-flyout-close` | Sports / Casino slide-up menus |
| `data-mh-acc` | Accordion heads (optional; promo detail rules use a single open section) |
| `.mh-odds__btn` / `.mh-nt-odd` | Toggle selection → Quick bet slip (`#mh-qbs`) |
| `#mh-betslip-btn` | Re-open Quick bet slip (or toast if empty) |
| `#mh-menu-btn` | Opens full-screen `#mh-menu-sheet` (`.mh-cs-menu`) on all sticky tabbars |
| `[data-mh-open-lang]` / `[data-mh-close-lang]` | Opens/closes Select Language overlay (`.mh-cs-lang`) inside the menu; persists `localStorage mh-lang-v1` |
| `localStorage mh-logged-in-v1` | Demo session; `body.is-logged-in` swaps header + sports tabbar |
| `[data-mh-deposit]` / `[data-mh-deposit-tab]` | Opens `deposit.html` (logged-in) or `login.html` (guest) |
| `[data-mh-withdraw]` | Opens `withdraw.html` (logged-in) or `login.html` (guest) |
| `[data-mh-bets]` | Opens `bet-history.html` (logged-in) or `login.html` (guest) |
| `[data-mh-tx-history]` | Opens `transaction-history.html` (logged-in) or `login.html` (guest) |
| `[data-mh-promo-record]` | Opens `promotion-record.html` (logged-in) or `login.html` (guest) |
| `[data-mh-personal-profile]` | Opens `personal-profile.html` (logged-in) or `login.html` (guest) |
| `[data-mh-security]` | Opens `security.html` (logged-in) or `login.html` (guest) |
| `[data-mh-referral]` | Opens `referral.html` (logged-in) or `login.html` (guest) |
| `[data-mh-membership]` | Opens `membership.html` (logged-in) or `login.html` (guest) |
| `[data-mh-rebate]` | Opens `rebate.html` (logged-in) or `login.html` (guest) |
| `[data-mh-checkin]` | Opens `daily-checkin.html` (logged-in) or `login.html` (guest) |
| `[data-mh-live-chat]` | Opens `live-chat.html` (logged-in) or `login.html` (guest) |
| `[data-mh-account]` | Opens `profile.html` (logged-in) |
| `[data-mh-logout]` | Clears session + reload (or home from profile) |

Apply **`data-mh-scroll` + `data-mh-drag-scroll`** together on any rail that should behave like footer partner logos (hidden scrollbar, click-drag) — including the Quick bet slip multi-bet rail.

---

## Logged-in chrome (after auth)

**Session:** `localStorage` key `mh-logged-in-v1` (`"1"`). Set on login/register/social submit in `mobile-auth.js`, then redirect to `index.html`. Preview: `index.html?loggedIn=1` (clear with `?loggedIn=0`).

**Header** (replaces Log in + Registration):

- Green **Deposit** (`.mh-btn-deposit` → `--action-green`)
- Blue account chip (`.mh-header__account` → `--header-action`) with white person icon matching Profile tab glyph (`mh-account.svg` = same silhouette as `profile/pf-tab-user.svg`, white fill) + red notification dot (`.mh-header__account-badge` → `--danger`)

**Sports tab bar** (`.mh-tabbar` only — casino keeps `.mh-cs-tabbar`):

| Guest | Logged in |
|-------|-----------|
| Sports · Casino · Bet slip · **Log in** · Menu | Sports · Casino · Bet slip · **Deposit** · Menu |

Deposit tab uses `assets/icons/tab-deposit.svg`. Log out via Menu → **Log out**, profile page, or Quick bet slip actions when open.

Applied automatically by `mobile-home.js` → `initSessionChrome()` on every `mh-page` that loads that script.

---

## Profile (`mobile/profile.html`)

Logged-in account hub. Opened from header account chip (`data-mh-account`). Guests are redirected to `login.html`.

**Figma:** [1XBET `235:18`](https://www.figma.com/design/EdLwHua7n5o3CGSLKW4SFa/1XBET?node-id=235-18) — structure/icons from Figma; **colors** remapped to tokens (not Figma `#205583` / `#276aa5` / `#7eac2f`).

**Menu groups** mirror desktop `ACCOUNT_NAV_GROUPS` in `js/account.js` (mobile shell + light cards stay as screenshot).

| Block | Notes |
|-------|--------|
| `.mh-pf-card` | 32px avatar + Account No. + copy, balance, messages (**green** count badge), close → home, **My bets** (`data-mh-bets` → bet history) / Deposit (32px tall) |
| `.mh-pf-tabs` | Horizontal icon+label: Profile · Promo · Settings; active 4px `--action-green` underline |
| `.mh-pf-group` / `.mh-pf-list` | **My wallet and bets** → Deposit / Withdraw funds (Payment queries commented out / hidden) · **Profile** → Personal profile / Security (`data-mh-security`) · **History record** → Transaction history / Bet history / Promotion record · **Extra** → Referral / Membership / Rebate / Daily check in / Promotions / Live chat · Log out |
| History hooks | `data-mh-tx-history` → `transaction-history.html` · `data-mh-bets` → `bet-history.html` · `data-mh-promo-record` → `promotion-record.html` |
| Extra links | `referral.html` · `membership.html` · `rebate.html` · `daily-checkin.html` · `live-chat.html` (hooks `data-mh-referral` / `membership` / `rebate` / `checkin` / `live-chat`); Promotions → `casino-promo.html` |
| Icons | `mobile/assets/icons/profile/pf-*.svg` |
| List icon color | **`#8a9db0`** (`--mh-pf-list-icon`) — same as **Security** (`pf-lock.svg`). Applies to wallet/profile/history/extra rows (incl. Bet history, Promotion record, Referral, Membership, Rebate, Daily check in, Promotions, Live chat). Do **not** use `--section-blue` `#1a4f8a` or `--header-action` `#2f69b1` on list icons. Tabs stay `--header-action`. |
| CSS / JS | `css/mobile-profile.css` · `js/mobile-profile.js` |
| Bottom nav | Sports `.mh-tabbar` logged-in (Deposit slot) |

Colors: page `#e9eef2`; cards `--surface-primary`; My bets `--header-action`; Deposit / msg badge `--action-green`; list text `--section-blue`; list icons `#8a9db0`; titles `--text-muted`.

---

## Deposit (`mobile/deposit.html`)

Logged-in account replenishment. Opened from header **Deposit**, sports tab **Deposit**, profile Deposit / Make a deposit, and Quick bet slip Deposit. Guests are redirected to `login.html`.

**No bottom nav** — screenshot has header + subbar only (hide `.mh-tabbar` / sheets).

**Flow:** methods (2-col cards) → amount (+ presets / QR when needed) → confirm → success (demo ~1.2s).

| Block | Notes |
|-------|--------|
| `.mh-dep-subbar` | Sticky referral-style back (32×32, `border-radius: 6px`) + **DEPOSIT** title (updates per step) |
| `.mh-dep-mode` | Deposit / **Withdrawal**; active underline `--action-green` |
| `.mh-dep-account` | `ACCOUNT 1737116847` + copy (`pf-copy.svg`) |
| `.mh-dep-filters` | Blue **Types of payment systems** chip (opens `.mh-dep-type-sheet`) + green region checkbox |
| `.mh-dep-promo` | Agent / Family promo box + Telegram link |
| `.mh-dep-section__title` | Full-bleed bar (e.g. **RECOMMENDED**) via `--league-header` |
| `.mh-dep-card` | White logo area + blue footer (`--header-action`); red `+10%` badges |
| Logos | `mobile/assets/payments/` (desktop copies + `fpx` / `paynow` / `online-banking` / `tron` SVGs) |
| CSS / JS | `css/mobile-deposit.css` · `js/mobile-deposit.js` |
| Bottom nav | **Hidden** on this page |

Colors: page `#e9eef2`; tab underline / checkbox / CTAs `--action-green`; card footers / chips / links `--header-action`; badges `--danger`.

**Types sheet** (`.mh-dep-type-sheet`, shared deposit/withdraw):

| Concern | Detail |
|---------|--------|
| Options | Recommended · All Method · Payment Cards · E-wallet · Internet Banking · Bank Transfer · Cryptocurrency |
| States | `closed` → `opening` → `open` → `closing` → `closed` (same as Bet Slip) |
| Open | Chip → 320ms · `cubic-bezier(0.22,1,0.36,1)` · panel `translate3d` + opacity; backdrop `0→0.45` |
| Close | Backdrop / ✕ Cancel / ESC / select → 260ms slide down + fade; `[hidden]` after close |
| Scroll lock | `body.mh-sheet-scroll-lock` |
| Guard | Ignore while `opening` / `closing` |
| A11y | Focus to close control; restore on close |
| Filter | Selection sets `typeFilter` and re-renders method sections |

Hard rule: never set `[hidden]` until the slide-down finishes.

---

## Withdrawal (`mobile/withdraw.html`)

Logged-in fund withdrawal. Opened from Deposit/Withdrawal tabs, profile **Withdraw funds** (`data-mh-withdraw`). Guests → `login.html`.

**No bottom nav** (same as deposit). Shared chrome/cards in `mobile-deposit.css`; withdraw extras in `mobile-withdraw.css`.

**Flow:** methods → amount (+ destination fields) → confirm → success (demo ~1.2s).

| Block | Notes |
|-------|--------|
| `.mh-dep-mode` | Deposit → `deposit.html` / Withdrawal active; green underline |
| Account row | **WITHDRAWING FROM ACCOUNT** + copy |
| `.mh-wd-toolbar` | Blue Types chip (`.mh-dep-type-sheet`) + green **Withdrawal requests** (toggles `#mh-wd-requests` panel; refresh countdown ~15s) |
| `.mh-wd-confirm` | Confirm via **App** |
| Cards | Recommended (blue footers); Payment cards use `.mh-dep-card--muted` grey footers |
| Logos | `mobile/assets/payments/` (TnG, DuitNow, FPX, online-banking, Visa/MC SVGs, etc.) |
| CSS / JS | `css/mobile-withdraw.css` · `js/mobile-withdraw.js` (+ shared `mobile-deposit.css`) |

---

## History record pages (desktop design)

Shared mobile shell for **Transaction Record**, **Bet Record**, and **Promotion Record** — mirrors desktop `tx-record-*` / `js/history-record.js` (not the older casino card list).

**Files:** `css/mobile-history-record.css` · `js/mobile-history-record.js`  
**Body:** `mh-page--history-record` (+ page flag `mh-page--tx-history` / `--bet-history` / `--promo-record`)  
**No bottom tabbar.** Guests → `login.html`. Back → `profile.html`.

| Block | Desktop source | Mobile |
|-------|----------------|--------|
| `.mh-hr-subbar` | Content title | Referral-style back + uppercase title |
| `.mh-hr-panel--filters` | `.pq-panel.tx-record-panel` | Type + Status selects, Start/End (`DD-MM-YYYY`), period chips, green **Submit** |
| Period chips | `.tx-record-period-btn` | Today · Yesterday · Last Week · **This Week** (default) · This Month · Last Month; active = `--accent-blue` |
| Submit | `.tx-record-submit` | Full-width `--action-green` |
| `.mh-hr-panel--results` | Results table | Stacked labeled cells (desktop ≤900 pattern); empty **No Data Found** |
| Behavior | `history-record.js` | Period fills dates; Submit validates range → empty + toast (demo) |

### Transaction history (`mobile/transaction-history.html`)

Opened from profile **Transaction history** (`data-mh-tx-history`). Title **Transaction record**.

| Filter | Options (desktop) |
|--------|-------------------|
| Type | Deposit · Withdrawal · Commission Record · Rebate Record · Daily Check In Record |
| Status | All · Completed · Pending · Rejected · Cancelled |
| Columns | Date · Amount · Status · Description |

Nested Type options (Commission / Rebate / Check In) toast demo (pages not ported).

### Bet history (`mobile/bet-history.html`)

Opened from profile **My bets** / **Bet history** (`data-mh-bets`). Title **Bet record**.

| Filter | Options (desktop) |
|--------|-------------------|
| Type | Sports · Casino · Live |
| Status | All · Open · Won · Lost · Void · Cancelled |
| Columns | Date · Stake · Status · Event |

### Promotion record (`mobile/promotion-record.html`)

Opened from profile **Promotion record** (`data-mh-promo-record`). Title **Promotion record**.

| Filter | Options (desktop) |
|--------|-------------------|
| Type | All · Welcome Bonus · Reload Bonus · Cashback · Free Bet |
| Status | All · Active · Completed · Expired · Cancelled |
| Columns | Date · Bonus · Status · Promotion |

Colors: page `#e9eef2`; panels `--surface-primary`; period active `--accent-blue`; Submit `--action-green`; empty title `--section-blue`.

---

## Personal profile (`mobile/personal-profile.html`)

Opened from profile **Personal profile** (`data-mh-personal-profile`). Guests → `login.html`. **No bottom tabbar.**

Reuses desktop account content (summary + Platinum medal + tier / promo progress + personal info fields) from `personal-profile.html` / `css/account.css`, adapted to the mobile subbar shell.

| Block | Notes |
|-------|--------|
| `.mh-pp-subbar` | Back → `profile.html` + **Personal profile** title |
| `.mh-pp-progress` | Fill-in profile bar (demo 34%) |
| `.mh-pp-summary` | Avatar + Verified + username/email + **Platinum** medal (`mobile/assets/account/platinum-medal.png`) |
| `.mh-pp-tier` | Target Diamond + 75% bar |
| `.mh-pp-promo` | Current promo + End promo + rollover 50% |
| `.mh-pp-info` / `.mh-pp-form` | Username (readonly), full name, phone, DOB + bonus hint, **Save changes** |
| CSS / JS | `css/mobile-personal-profile.css` · `js/mobile-personal-profile.js` (+ `mobile-home.js` for chrome) |
| Bottom nav | **Hidden** |

Colors: page `#e9eef2`; cards `--surface-primary`; progress / Save / End promo accents via `--action-green` / `--header-action`; text `--text-primary` / `--section-blue`.

---

## Security (`mobile/security.html`)

Opened from profile **Security** (`data-mh-security`). Guests → `login.html`. **No bottom tabbar.**

Desktop `security.html` hub adapted to the mobile inner-page shell (same subbar pattern as history / personal profile).

| Block | Notes |
|-------|--------|
| `.mh-sec-subbar` | Referral-style back → `profile.html` + **SECURITY** |
| Intro | Account Security + subtitle (desktop copy) |
| `.mh-sec-progress` | “Not protected in full” + 50% bar (`--section-blue`) |
| `.mh-sec-card` | Change Language · Change Password · Information Center (chevron cards) |
| Icons | `mobile/assets/account/icon-lang-en.svg`, `icon-lock.svg`, `icon-settings.svg` |
| CSS / JS | `css/mobile-security.css` · `js/mobile-security.js` |

### Inner pages (from desktop)

| Page | File | Back | Content |
|------|------|------|---------|
| Change Language | `mobile/change-language.html` | `security.html` | Language chips + flags (`assets/account/flags/`); select → toast (demo) |
| Change Password | `mobile/change-password.html` | `security.html` | Current / new / confirm + eye toggles + requirements list; Save validates (demo) |
| Information Center | `mobile/information-center.html` | `security.html` | Empty state “Oops! There is no data yet!” |

Body class: `mh-page--security-flow` on all four pages.

---

## Extra account pages (desktop content, mobile shell)

Opened from profile **Extra** group. Guests → `login.html`. **No bottom tabbar** (same as personal profile / security).

Shared: `css/mobile-extra.css` · `js/mobile-extra.js` · body `mh-page--extra` (+ page flag). Subbar `.mh-ex-subbar` → back to `profile.html`.

| Page | File | Body flags | Desktop source | Notes |
|------|------|------------|----------------|-------|
| Referral | `referral.html` | `--referral` | `referral-invite.html` logged-in dashboard | Tabs Referral Info / My Rewards; copy link, share, claim, commission accordion (demo) |
| Membership | `membership.html` | `--membership` | `membership-invite.html` + `js/membership.js` | VIP tiers rail + Benefits / Requirements; reuses desktop `TIER_DATA` |
| Rebate | `rebate.html` | `--rebate` | `rebate-invite.html` logged-in | Tabs Unclaim / History / Benefit; empty states + rate table |
| Daily check in | `daily-checkin.html` | `--daily-checkin` | `daily-checkin.html` | Loyalty points + 7-day grid + claim modal + T&Cs |
| Live chat | `live-chat.html` | `--live-chat` | `live-chat.html` | Message log + composer (demo send); footer Support links here |

Colors: page `#e9eef2`; cards `--surface-primary`; tab underline / Claim CTAs `--action-green`; accents `--header-action` / `--section-blue`.

---

## Markup skeleton — footer + tab bar

```html
<footer class="mh-footer">
  <div class="mh-footer__inner">
    <section class="mh-footer__slider" aria-label="Sports partners">
      <h2 class="mh-footer__slider-title">Sports partners</h2>
      <div class="mh-footer__slider-box">
        <div class="mh-footer__slider-track" data-mh-scroll data-mh-drag-scroll>
          <a class="mh-footer__partner-tile" href="...">
            <img src="assets/logos/partner-….webp" width="55" height="55" alt="…" loading="lazy" />
          </a>
          <!-- more tiles -->
        </div>
      </div>
    </section>

    <section class="mh-footer__slider" aria-label="Esports partners">…same structure…</section>

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

    <div class="mh-footer__social">
      <a class="mh-footer__social-btn" aria-label="Facebook">…</a>
      <a class="mh-footer__social-btn" aria-label="Instagram">…</a>
    </div>

    <a href="…" class="mh-footer__support">
      <img class="mh-footer__support-icon" src="assets/icons/icon-support.svg" width="42" height="42" alt="" />
      <span class="mh-footer__support-copy">
        <strong>Customer Support</strong>
        <span>Ask any questions</span>
      </span>
    </a>

    <div class="mh-footer__legal-block">
      <p class="mh-footer__legal">Copyright © …</p>
      <p class="mh-footer__cookie">…cookies… <a href="…">Find out more</a></p>
    </div>

    <a href="../index.html" class="mh-footer__full">Go to the full version of the website</a>

    <div class="mh-footer__meta">
      <span class="mh-footer__age">18+</span>
      <button type="button" class="mh-footer__lang" aria-label="Language">
        <img src="assets/logos/flag-my.svg" width="16" height="16" alt="" />
        <span>EN</span>
        <span class="mh-footer__lang-chevron">▾</span>
      </button>
    </div>
  </div>
</footer>

<nav class="mh-tabbar" aria-label="Mobile primary">
  <div class="mh-tab-slot" data-mh-flyout-slot="sports">…</div>
  <div class="mh-tab-slot" data-mh-flyout-slot="casino">…</div>
  <button type="button" class="mh-tab mh-tab--coupon" id="mh-betslip-btn">…</button>
  <button type="button" class="mh-tab" data-auth-open="login">…Log in</button>
  <!-- logged-in: same slot becomes Deposit via JS (data-mh-deposit-tab) -->
  <button type="button" class="mh-tab" id="mh-menu-btn">…Menu</button>
</nav>
```

**Source of truth:** `mobile/css/mobile-home.css` (`.mh-footer` … `.mh-footer__lang-chevron`). Paste this block into every mobile page; do not invent a second footer.

---

## Footer (current — `mobile-home.css`)

Full-width dark chrome. Stack order inside `.mh-footer__inner`:

1. Sports partners slider  
2. Esports partners slider  
3. App banner  
4. Social (Facebook | Instagram)  
5. Customer Support  
6. Legal + cookie  
7. “Go to the full version…”  
8. Meta (18+ | language)

### Shell

| Class | Property | Value |
|-------|----------|-------|
| `.mh-footer` | `margin-top` | `16px` |
| | `padding` | `0` |
| | `background` | `--page-bg` |
| | `color` | `--text-inverse` |
| `.mh-footer__inner` | `width` / `max-width` | `100%` |
| | `padding` | `8px` |
| | `box-sizing` | `border-box` |

### Partner sliders (Sports + Esports — identical rules)

| Class | Property | Value |
|-------|----------|-------|
| `.mh-footer__slider` | `margin` | `0 0 16px` |
| | `background` | transparent |
| `.mh-footer__slider-title` | typography | `16px` / `700` / uppercase / centered |
| | `margin` | `0 0 12px` |
| | `letter-spacing` | `0.02em` |
| | `color` | `--text-inverse` |
| `.mh-footer__slider-box` | `padding` | `12px` |
| | `border-radius` | `8px` |
| | `background` | `--header-nav-bg` |
| `.mh-footer__slider-track` | layout | `display: flex`; `align-items: center`; `gap: 4px` |
| | scroll | `overflow-x: auto`; `-webkit-overflow-scrolling: touch` |
| | scrollbar | **hidden** (`scrollbar-width: none` + `::-webkit-scrollbar { display: none }`) |
| | drag | `cursor: grab`; `.is-dragging` → `grabbing`; hooks `data-mh-scroll` + `data-mh-drag-scroll` |
| | select | `user-select: none` |
| `.mh-footer__partner-tile` | size | `72×72` (`flex: 0 0 72px`) |
| | grow | `flex-grow: 1` (tiles expand to fill leftover track width when few logos) |
| | `padding` | `8px` |
| | `border-radius` | `8px` |
| | `background` | `--header-bg` |
| | drag | `-webkit-user-drag: none` |
| `.mh-footer__partner-tile img` | size | `55×55`; `object-fit: contain` |
| | interaction | `pointer-events: none`; `-webkit-user-drag: none` |

No custom scrollbar UI (no arrows / thumb bar). Horizontal movement = native overflow + pointer drag from `mobile-home.js`.

### App banner

| Class | Property | Value |
|-------|----------|-------|
| `.mh-footer__app-banner` | layout | flex, centered, `gap: 12px` |
| | size | `width: 100%`; `height` / `min-height: 59px` |
| | chrome | `border-radius: 8px`; `background: --header-action` |
| | padding | `0 10px` |
| `.mh-footer__app-phone` | size | `52×59` decorative phone (CSS `::before` / `::after`) |
| `.mh-footer__app-store--apple` / `--android` | | small store badges on phone |
| `.mh-footer__app-copy img` | | wordmark ~`100px` wide / max-height `22px` |
| `.mh-footer__app-copy span` | | `13px` / `400` — “Mobile application” |

### Social

| Class | Property | Value |
|-------|----------|-------|
| `.mh-footer__social` | layout | `grid`; `grid-template-columns: 1fr 1fr`; `gap: 4px` |
| | `margin-top` | `4px` |
| `.mh-footer__social-btn` | size | `height` / `min-height: 40px` |
| | chrome | `border-radius: 8px`; `background: --header-action` |
| | icon | `16×16`, white via `filter: brightness(0) invert(1)` |

### Customer Support

| Class | Property | Value |
|-------|----------|-------|
| `.mh-footer__support` | layout | flex, centered, `gap: 12px` |
| | size | `width: 100%`; `height` / `min-height: 50px` |
| | `margin` | `16px 0 0` |
| | `padding` | `4px 20px` |
| | chrome | `border-radius: 8px`; `background: --header-action` |
| `.mh-footer__support-icon` | | `42×42` |
| `.mh-footer__support-copy strong` | | `12px` / `700` / uppercase |
| `.mh-footer__support-copy span` | | `11px`; `rgba(255,255,255,0.85)` |

### Legal / full version / meta

| Class | Property | Value |
|-------|----------|-------|
| `.mh-footer__legal-block` | | `display: grid`; `gap: 16px`; `margin: 16px 0`; text centered |
| `.mh-footer__legal` / `__cookie` | | `13px`; muted inverse `rgba(255,255,255,0.85)` |
| `.mh-footer__cookie a` | | `--cyan-accent`, underlined |
| `.mh-footer__full` | | centered link; `14px`; `--cyan-accent`; `margin: 0 auto 12px` |
| `.mh-footer__meta` | | flex; `space-between`; `padding: 0 8px 4px` |
| `.mh-footer__age` | | `18+` badge; min `40×32`; `padding: 8px`; `border-radius: 8px`; bg `--header-nav-bg` |
| `.mh-footer__lang` | | flag `16×16` circle + `EN` + ▾; `14px` / `700`; transparent bg |

### Token map (footer surfaces)

| Surface | Token |
|---------|--------|
| Footer page shell | `--page-bg` |
| Partner box / 18+ badge | `--header-nav-bg` |
| Partner tile | `--header-bg` |
| App / social / support bars | `--header-action` |
| Full-version + cookie link | `--cyan-accent` |
| Body text on dark | `--text-inverse` / muted white |

### Header (guest auth)

Live ref ([statistic](https://1xlite-46272.pro/en/statistic/23.07.2026), ~390×844): **rem root `html { font-size: 19px }`**. Captions = `.ui-caption--size-xs` (`font-size: 0.75rem`; `line-height: 0.875rem`; weight **400**). Auth = `.ui-button--size-s` (`min-height: 2rem`; padding `0.25rem 0.5rem`; radius live `--border-radius: 8px`).

| Property | Value |
|----------|-------|
| Rem root | `html:has(body.mh-page) { font-size: 19px }` |
| Height | `--mh-header-h: 2.94737rem` (56px @ 19) + safe-area |
| Logo | `height: 0.85rem` |
| Log in / Registration / Deposit | `0.75rem` / `400` / `line-height: 0.875rem`; `height: 2rem`; `padding: 0.25rem 0.5rem`; `border-radius: 8px` |
| Account chip | `2rem × 2rem`, radius `8px` |

### Bottom navigation

Live: same `.ui-caption--size-xs` on tab labels (`0.75rem` / `0.875rem` lh / **400**; Bet slip **700**). Icons ≈ `0.84211rem × 1rem` (16×19). Bar height `2.94737rem` (56px).

| Property | Value |
|----------|-------|
| Height | `--mh-tabbar-h: 2.94737rem` + safe-area |
| Columns | `5` equal `1fr` on ≤480px; ≥481px tabs equal and **centered** as a group |
| Background | `--surface-primary` |
| Icon | `0.84211rem × 1rem` |
| Label | `0.75rem` / `400` / `line-height: 0.875rem` (Bet slip / `.mh-tab--coupon`: `700`) |
| Bet slip circle | `32×32`, bg `--cyan-accent`, raised |
| Sports / Casino | `.mh-tab-flyout` slide-up with sub-links + ✕ |

```css
html:has(body.mh-page) { font-size: 19px; }
--mh-header-h: 2.94737rem;
--mh-tabbar-h: 2.94737rem;
```

---

## Promo detail page (`esports-cashback-boom` pattern)

**Live ref:** [Esports Cashback Boom (mobile)](https://1xlite-46272.pro/en/bonus/rules/esports-cashback-boom?platform_type=mobile)

### Structure

1. `.mh-header` — same as home (logo, flag, Log in, Registration)
2. `.mh-pd-subbar` — back + **TERMS OF THE BONUS**
3. `.mh-pd-crumbs` — Home › Promo › current title
4. `.mh-pd-hero` — **full width** banner + overlay title / sub / **TAKE PART**
5. `.mh-pd-body` — **one continuous section** (how to / levels / terms + TAKE PART). Do **not** split into accordion cards on this layout.
6. `.mh-bonus-rail` — Other available bonuses (drag rail)
7. Footer + tab bar (copy from home)

### Hero banners

| Viewport | Asset | Size |
|----------|-------|------|
| Mobile default | `mobile/assets/banners/esports-cashback-mobile.jpg` | 945×370 |
| Desktop `≥768px` | `mobile/assets/banners/esports-cashback-desktop.jpg` | 1380×248 |

Use `<picture>` + overlay `.mh-pd-hero__copy` on the left (dark gradient). CTA uses `--action-green`.

CDN sources (downloaded into repo):

- Desktop: `https://v3.traincdn.com/genfiles/bonus-cms/…/Bet_on_Esport_1380x248_3_3.jpg`
- Mobile: `https://v3.traincdn.com/genfiles/bonus-cms/…/Bet_on_Esport_945x370_3_2.jpg`

### Rules block (`.mh-pd-body`)

| Property | Value |
|----------|-------|
| Width | full (`max-width: none`) |
| Background | `--header-bg` |
| Padding | `16px 12px` (desktop `24px 16px`) |
| Headings | white, bold; not accordion |
| Lists | numbered / bullets inline |
| Bottom CTA | `.mh-pd-cta` Take part |

---

## Other available bonuses rail

**Classes:** `.mh-bonus-rail` › `.mh-bonus-rail__track[data-mh-scroll][data-mh-drag-scroll]` › `.mh-bonus-card`

Same drag behaviour as footer partner logos (hidden scrollbar, pointer drag, suppress click after drag).

### Markup

```html
<section class="mh-bonus-rail" aria-label="Other available bonuses">
  <div class="mh-bonus-rail__head">
    <h2 class="mh-bonus-rail__title">Other available bonuses</h2>
    <a href="../promo.html" class="mh-bonus-rail__more">More &gt;&gt;</a>
  </div>
  <div class="mh-bonus-rail__track" data-mh-scroll data-mh-drag-scroll>
    <a href="…" class="mh-bonus-card">
      <div class="mh-bonus-card__media">
        <img src="assets/banners/related/….png" alt="" width="160" height="100" loading="lazy" />
        <span class="mh-bonus-card__badges">
          <span class="mh-bonus-card__badge">NEW</span>
          <span class="mh-bonus-card__badge mh-bonus-card__badge--best">BEST</span>
        </span>
      </div>
      <h3 class="mh-bonus-card__title">Title</h3>
      <div class="mh-bonus-card__meta">
        <span class="mh-bonus-card__meta-item mh-bonus-card__meta-item--muted">
          <img src="assets/icons/icon-clock.svg" width="12" height="12" alt="" /> Finished
        </span>
        <!-- optional: icon-gift Unlimited · icon-person 94 MYR -->
      </div>
    </a>
  </div>
</section>
```

### Measured card rules

| Property | Value |
|----------|-------|
| Card width | `148px` (desktop `168px`) |
| Gap | `8px` |
| Radius | `8px` |
| Card bg | `--header-bg` |
| Media | `aspect-ratio: 16 / 10`, `object-fit: cover` |
| NEW badge | `--warning` bg, `--text-primary` text |
| BEST badge | `--action-green` bg, inverse text |
| Title | ~`11px` / `700`, 2-line clamp |
| Meta | clock / gift / person icons `12×12`; muted = Finished; accent = Unlimited / amount |
| Track | `overflow-x: auto`; **scrollbar hidden**; `cursor: grab` |

### Images

Store under `mobile/assets/banners/related/`. Prefer promo card art from live / `assets/images/promo/cards/` copied into that folder.

Meta icons: `mobile/assets/icons/icon-{clock,gift,person}.svg`

---

## Responsive (320–480px)

Everything fluid with `%` / `fr` / flex. No fixed max-width on main content, footer, or tab bar.

| Viewport | Expectation |
|----------|-------------|
| 320 | Partner + bonus rails scroll/drag; social stays two columns |
| 360–390 | Matches measured reference |
| 412–480 | More partner / bonus cards visible before scroll |
| ≥768 | Still **full width** — do not introduce a centered content column |

≥481px: tab items stay equal width and center as a group (`max-width: 80px` each).

---

## Assets checklist

| Asset | Path |
|-------|------|
| Partner logos | `mobile/assets/logos/partner-*.webp` |
| Footer wordmark | `mobile/assets/logos/logo-1xbet-footer.svg` |
| Flag | `mobile/assets/logos/flag-my.svg` |
| Facebook / Instagram / Support | `mobile/assets/icons/icon-{facebook,instagram,support}.svg` |
| Tab icons | `mobile/assets/icons/tab-*.svg` |
| Promo hero banners | `mobile/assets/banners/esports-cashback-{mobile,desktop}.jpg` |
| Related bonus thumbs | `mobile/assets/banners/related/*` |
| Bonus meta icons | `mobile/assets/icons/icon-{clock,gift,person,home,back}.svg` |

---

## Quick bet slip (slide-up)

Fixed panel above the tab bar (and above `.mh-nt-mode` on National Team). Opens when the user selects any `.mh-odds__btn` / `.mh-nt-odd`; count grows as selections are added.

**CSS:** `mobile/css/mobile-home.css` (`.mh-qbs`, `.mh-qbs-backdrop`, `body.mh-sheet-scroll-lock`)  
**JS:** `mobile/js/mobile-home.js` (`setQbsOpen` state machine)  
**Markup:** paste `#mh-qbs` before `#mh-toast` on every mobile page (see `mobile/index.html`). Backdrop `#mh-qbs-backdrop` is created in JS if missing.

### Behaviour

| Action | Result |
|--------|--------|
| Tab **Bet slip** | Slides panel **up**; empty or filled. Tap again to slide **down** |
| Click odd | Toggle selection; slide **up** with content; badge `#mh-bet-count` updates |
| 0 selections | Empty state copy + generate link (no count in title) |
| 1 selection | Full-width row: event + market + odd + ✕ (no Overall row); title `(1)` |
| 2+ selections | Horizontal **draggable** cards + **Overall odds**; title `(N)` |
| Collapse ▾▾ / backdrop / ESC | Slides panel **down**; selections kept in `sessionStorage` |
| Clear last bet | Closes sheet with slide-down |

### Bottom-sheet animation (mobile ≤900px)

State flow: **`closed` → `opening` → `open` → `closing` → `closed`**

| Concern | Detail |
|---------|--------|
| Open | 320ms · `cubic-bezier(0.22, 1, 0.36, 1)` · `translate3d(0,100%→0)` + opacity `0→1` |
| Close | 260ms · ease-out · slide down + fade; `[hidden]` only after timeout |
| Backdrop | `#mh-qbs-backdrop` opacity `0→0.45` open / reverse close; click closes |
| Scroll lock | `body.mh-sheet-scroll-lock` while open |
| Guard | Ignore open/close while `opening` / `closing` (no double fire) |
| A11y | ESC closes; focus moves into sheet; restored on close |
| Desktop ≥901px | Transitions disabled (instant), layout unchanged |
| GPU | `transform` + `opacity` only; `will-change: transform, opacity` |

Shell: `border-radius: 10px 10px 0 0`. Never `display:none` mid-animation.

### Structure

```html
<aside class="mh-qbs" id="mh-qbs" hidden>
  <div class="mh-qbs__head">…collapse · Quick bet slip (N) · Go to bet slip · settings…</div>
  <div class="mh-qbs__body">
    <div class="mh-qbs__empty" data-mh-qbs-empty>
      <p>Your bet slip is empty. … <a>generate a bet slip</a>.</p>
    </div>
    <div class="mh-qbs__filled" data-mh-qbs-filled hidden>
      <div class="mh-qbs__rail" data-mh-qbs-rail data-mh-scroll data-mh-drag-scroll></div>
      <div class="mh-qbs__overall" data-mh-qbs-overall hidden>Overall odds · <strong data-mh-qbs-overall-val></strong></div>
    </div>
  </div>
  <div class="mh-qbs__actions">
    <button class="mh-qbs__btn mh-qbs__btn--login" data-auth-open="login">Log in</button>
    <button class="mh-qbs__btn mh-qbs__btn--reg" data-auth-open="register">Registration</button>
  </div>
</aside>
```

### Layout / tokens

| Piece | Rule |
|-------|------|
| Position | `fixed`; `bottom: var(--mh-qbs-bottom)`; `z-index: 115`; full width |
| `--mh-qbs-bottom` | Tab bar height (+ `--mh-mode-h` on National Team) + safe area |
| Open | `.is-open` + slide (`translateY`); closed uses `[hidden]` off-screen |
| Head | `#f3f6f9` bar; title `--text-primary`; link `--accent-blue` |
| Cards | `--odds-bg`; event bold; market muted; odd `--accent-blue` |
| LOG IN | `--brand-blue` |
| REGISTRATION | `--action-green` |
| Badge on tab | `--action-green` (existing `.mh-tab__badge`) |

### Icons

`icon-chevron-double-down.svg`, `icon-settings.svg`, `icon-close.svg`

---

## QA checklist

### Profile hub
- [ ] Menu groups match desktop sidebar: Wallet · Profile · History record · Extra · Log out
- [ ] History record → `transaction-history.html` / `bet-history.html` / `promotion-record.html`
- [ ] My bets card CTA → bet history; Deposit → `deposit.html`
- [ ] Personal profile alert + `personal-profile.html`; bottom tabbar visible
- [ ] List icons (Bet history, Promotion record, Referral, Membership, Rebate, Daily check in, Promotions, Live chat) use Security slate `#8a9db0` (not bright blue)

### Footer / tab bar (every mobile page)

- [ ] Partner title spacing (`12px` under title, `16px` under section)
- [ ] Partner tiles `72×72`, logos `55×55`, gap `4px`
- [ ] Partner / bonus rails: scrollbar hidden; drag works in browser
- [ ] App banner ~59px; social equal columns; support hierarchy
- [ ] Tab bar `56px` + safe area; equal widths on phone; centered group on wide
- [ ] Colors use tokens from the table above
- [ ] Spot-check 320 / 360 / 375 / 390 / 412 / 430 / 480

### Promo detail

- [ ] Full-width hero + picture sources (mobile / desktop)
- [ ] Breadcrumbs Home › Promo › title
- [ ] Rules in **one** `.mh-pd-body` section (not separate accordion cards)
- [ ] TAKE PART uses `--action-green`
- [ ] Bonus rail cards: badges / meta / drag like footer logos
- [ ] Footer + tab bar pasted from home and wired to `mobile-home.js`

### National Team (Live / Line)

- [ ] Sub-bar: back + title + search / star / filter
- [ ] Live empty: “No championships” — **full width** (no side card / no 720px cap)
- [ ] Line: sport chips (drag) + sport blocks + odds; Generate CTA — **full bleed**
- [ ] Mode bar Live | Sports above tab bar (`--action-green` underline)
- [ ] Wide viewport: content still `max-width: none` (not centered column)
- [ ] Flyout: National Team → `national-team-line.html`, Live → `national-team-live.html`

### Quick bet slip

- [ ] Bet slip tab slides panel **up** (320ms + backdrop) and **down** (260ms) on collapse / second tap / ESC / backdrop
- [ ] Empty copy matches screenshot + “generate a bet slip” link
- [ ] Clicking an odd slides panel up; count / green badge update
- [ ] Body scroll locked while open; no double-open/close mid-animation
- [ ] Clearing last bet closes with slide-down
- [ ] 1 bet = full-width row; 2+ = horizontal drag rail + Overall odds
- [ ] Title shows `(N)` only when N &gt; 0
- [ ] LOG IN = `--brand-blue`; REGISTRATION = `--action-green`
- [ ] National Team: panel sits above Live/Sports mode bar

### Sports (Line)

- [ ] Sub-bar: back + Sports + search / star / filter
- [ ] Sport pills rail (drag) + more menu
- [ ] Top Sports cards (horizontal) with W1/DRAW/W2/HANDICAP
- [ ] Accumulators / Long-term bets rows
- [ ] Tournament tiles rail
- [ ] Football → league accordion → match rows; odds → Quick bet slip
- [ ] Colors use tokens (not live chrome hex)
- [ ] Flyout / MORE SPORTS → `sports.html`
- [ ] Sports chips **list** button → `#mh-sf` filter modal (search / Popular / TOP / A–Z / Long term)

### Search / Events

- [ ] Sub-bar: back + **Events**
- [ ] Field placeholder “Search championships”; Exact match toggle
- [ ] Empty: “Search events” + tournament/team/player hint
- [ ] Typing shows ALL / LIVE / LINE / CYBER + sample matches; odds → QBS
- [ ] Entry: Sports / NT search icons + home quicknav → `search.html`

### Event info / Favorites

- [ ] Match **⋯** (`data-mh-event-info`) → `event-info.html`
- [ ] Event info: Notifications / Favorites / 1xZone / Statistics + meta note + weather row
- [ ] Add to favorites persists in `localStorage` and appears on Favorites
- [ ] Favorites: Games accordion, Live | Sports tabs, match cards with ⋯
- [ ] Sub-bar stars / home fav quicknav → `favourites.html`

### Casino / Slots

- [ ] Dark shell (`--page-bg`); sub-bar **CASINO** + search
- [ ] Hero carousel + 2-col game grids (NEW / HOT badges)
- [ ] Promo block with countdown
- [ ] **Distinct** bottom sticky: Categories · Providers · MyCasino · Promo · Menu (`.mh-cs-tabbar`; live `cs-*.svg` icons)
- [ ] Categories → `casino-categories.html`; Providers → `casino-providers.html`; My Casino → `my-casino.html`; Promo → `casino-promo.html`; Menu → full-screen `.mh-cs-menu` on **all** sticky tabbars (sports + casino); wallet when logged-in; My Account + Extra match `profile.html`
- [ ] Menu Extra → Information accordion → Terms and Conditions → `terms.html` (General Rules: search + 33 accordions + download)
- [ ] Menu Extra → Information accordion → Payment methods → `payment-methods.html` (Deposit/Withdrawal tabs · country + method filters · All methods 2-col cards with min/max/fee foot · Deposit CTAs)
- [ ] Casino Promo (`casino-promo.html`): live assets in `assets/casino/promo/live/`; guest auth card vs logged-in codes+subscribe; tabs Promo / Promo codes (logged-in only) / Promotions / Tournaments; hero 412×204 dots below · promo rail title overlay + Find out more · tourney All/Live/Finished
- [ ] Casino tab flyout → `casino.html` · Live Casino → `live-casino.html`
- [ ] Live Casino (`live-casino.html`): sub-bar **LIVE CASINO** · hero dots below · 1XLIVE / POPULAR paged 2×2 overlay tiles + PROMO badge · filter FAB · same `.mh-cs-tabbar`
- [ ] Assets under `mobile/assets/casino/` (+ existing `mobile/assets/games/`); Live Casino thumbs in `mobile/assets/casino/live-casino/`

### Deposit
- [ ] Logged-in: header / tab / profile Deposit → `deposit.html`; guest → `login.html`
- [ ] **No bottom tabbar** on deposit page
- [ ] Account row + Types chip + region checkbox + promo banner
- [ ] Types sheet: `closed→opening→open→closing` · 320ms up / 260ms down · backdrop · scroll lock · ESC
- [ ] Recommended 2-col cards (logos + blue footers + `+10%` badges)
- [ ] Deposit / Withdrawal tabs with green active underline
- [ ] Flow: method → amount → confirm → success

### Withdrawal
- [ ] Profile Withdraw funds / Deposit↔Withdrawal tabs → `withdraw.html`
- [ ] **No bottom tabbar**; WITHDRAWAL subbar + Withdrawal tab active (green)
- [ ] Account row + Types + Withdrawal requests + Confirm via App
- [ ] Types sheet same state-machine slide as Bet Slip / deposit
- [ ] Recommended / Payment cards (muted footers) / E-wallets grids
- [ ] Flow: method → amount + destination → confirm → success

### Bet history
- [ ] Profile My bets / Bet history → `bet-history.html`; guest → `login.html`
- [ ] Desktop filters: Type Sports/Casino/Live · Status · dates · period chips · Submit
- [ ] **No bottom tabbar**; default This Week; Submit → No Data Found + toast

### Transaction history
- [ ] Profile Transaction history → `transaction-history.html`; guest → `login.html`
- [ ] Desktop filters: Deposit/Withdrawal (+ nested types toast) · Status · periods · Submit
- [ ] Results empty **No Data Found**; shared `mobile-history-record` CSS/JS

### Promotion record
- [ ] Profile Promotion record → `promotion-record.html`; guest → `login.html`
- [ ] Desktop Type/Status (Welcome/Reload/Cashback/Free Bet) · periods · Submit
- [ ] Shared history shell; empty + toast on submit (demo)

### Personal profile
- [ ] Profile **Personal profile** → `personal-profile.html`; guest → `login.html`
- [ ] **No bottom tabbar**; back returns to `profile.html`
- [ ] Summary shows Verified + Platinum medal (desktop asset)
- [ ] Tier / promo progress + personal info form; Save / End promo toast (demo)

### Security
- [ ] Profile Security → `security.html`; guest → `login.html`; **No bottom tabbar**
- [ ] Hub: 50% progress + Change Language / Password / Information Center cards
- [ ] Change Language: flag list select + toast; back → security
- [ ] Change Password: requirements + Save validation (demo); back → security
- [ ] Information Center: empty state; back → security

### Extra (Referral / Membership / Rebate / Check-in / Live chat)
- [ ] Profile Extra rows → mobile pages (not desktop `../…`); guest → `login.html`
- [ ] **No bottom tabbar**; back → `profile.html`
- [ ] Referral: Info / Rewards tabs; copy link toast; claim / downlines demo
- [ ] Membership: tier chips swap tables via `membership.js`; Benefits / Requirements
- [ ] Rebate: Unclaim / History / Benefit; empty states; horizontal rate table
- [ ] Daily check in: Claim Fri → modal + day claimed; history toast (demo)
- [ ] Live chat: Send appends user bubble; footer Support → `live-chat.html`

---

## National Team pages

**Live ref:** [betsonyour/live](https://1xlite-46272.pro/en/betsonyour/live?platform_type=mobile) · [betsonyour/line](https://1xlite-46272.pro/en/betsonyour/line?platform_type=mobile)

| Page | File | Body class |
|------|------|------------|
| Live | `mobile/national-team-live.html` | `.mh-page--national-team-live` |
| Line (Sports) | `mobile/national-team-line.html` | `.mh-page--national-team-line` |
| CSS | `mobile/css/mobile-national-team.css` | `.mh-page--national-team` |

### Full-width content

All National Team content is **full bleed** (matches home / promo):

| Block | Width |
|-------|--------|
| `.mh-main` / `.mh-nt-subbar` / `.mh-nt-mode` | `100%`, no max-width |
| `.mh-nt-empty` | Full bleed white panel (no side card margin / no `720px` cap) |
| `.mh-nt-chips` | Full-width rail; horizontal padding `--mh-gutter` |
| `.mh-nt-wrap` / `.mh-nt-block` / `.mh-nt-gen` | Full bleed; `border-radius: 0`; no centered column at ≥768px |

Do **not** reintroduce `@media (min-width: 768px) { max-width: 720px; margin: 0 auto; }` on wrap/empty.

### Structure

1. `.mh-header`
2. `.mh-nt-subbar` — back, title **Bet on Your National Team**, search / star / filter
3. **Live:** `.mh-nt-empty` (“No championships” / “Information will be displayed here soon”)
4. **Line:** `.mh-nt-chips` (drag) → `.mh-nt-block` sport accordions → `.mh-nt-event` + `.mh-nt-odd` → `.mh-nt-gen` Generate CTA
5. `.mh-nt-mode` — Live | Sports tabs + MY flag (fixed above tab bar)
6. Footer + tab bar (shared)

### Key classes

| Class | Role |
|-------|------|
| `.mh-nt-empty` | Full-width empty panel on `#eef2f6` page bg |
| `.mh-nt-chips` / `.mh-nt-chip` | Full-width horizontal sport filter; `data-mh-drag-scroll` |
| `.mh-nt-block` / `[data-mh-acc]` | Full-bleed collapsible sport section |
| `.mh-nt-odd` | Odds chip (`--odds-bg` / selected `--odds-selected`) |
| `.mh-nt-mode__tab.is-active::after` | Green underline `--action-green` |

### Icons

`search.svg`, `star.svg`, `icon-filter.svg`, `icon-back.svg`, `sport-*.svg`, `flag-my.svg`, `icon-chevron-down.svg`, `icon-chevron-right.svg`

---

## Sports (Line) page

**Live ref:** [line mobile](https://1xlite-46272.pro/en/line?platform_type=mobile)

| Page | File | Body class |
|------|------|------------|
| Sports / Line | `mobile/sports.html` | `.mh-page--sports` |
| CSS | `mobile/css/mobile-sports.css` | |

**Layout follows live screenshot structure; colors use design-system tokens (not live Figma/chrome hex).**

### Structure (top → bottom)

1. `.mh-header` — logo, MY flag, Log in, Registration  
2. `.mh-sp-subbar` — back, title **Sports**, search / star / filter  
3. `.mh-sp-chips` — horizontal sport pills (Football, Cricket, Esports, …) + **list** button opens Sports filter modal (`#mh-sf`)  
4. **Top Sports** — fire icon + `.mh-sp-rail` of `.mh-sp-card` (league, teams+logos, W1/DRAW/W2/HANDICAP)  
5. `.mh-sp-links` — Accumulators of the day / Long-term bets  
6. Tournament tiles — `.mh-sp-tourney` horizontal rail (dark chrome `--header-bg`): circular `.mh-sp-tourney__badge` (league logo / flag), white `.mh-sp-tourney__sport` top-right, truncated `.mh-sp-tourney__name`. Assets in `mobile/assets/tourneys/` + `mobile/assets/flags/` (live SPA champ CDN is not statically downloadable)  
7. `.mh-sp-list` — sport accordion (Football) → league accordion (trophy + name) → `.mh-sp-match` rows  
8. `#mh-sf` Sports filter modal (Popular + TOP + A–Z + Long term) — [live modal](https://1xlite-46272.pro/en/line?modal-id=dashboard-filter-sport-modal&betting-type=line)  
9. Footer + tab bar + `#mh-qbs`

### Full-width

All sections `width: 100%` / `max-width: none`. Side inset only via `--mh-gutter` on rails/padding.

### Assets

| Role | Path |
|------|------|
| Sport pills | `mobile/assets/icons/sport-*.svg` |
| Fire / trophy / more | `icon-fire.svg`, `icon-trophy.svg`, `icon-more.svg` |
| Sub-bar (back / search / star / filter) | `sp-back.svg`, `sp-search.svg`, `sp-star.svg`, `sp-filter.svg` (1xlite chrome shapes; live SPA has no static icon URLs) |
| Team thumbs | `mobile/assets/images/teams/team-*.webp`, `assets/logos/psg.webp` |
| Flags (optional) | `mobile/assets/flags/flag-*.svg` |

Live line is a SPA (icons load via JS); CDN icon URLs were stubbed — local SVG/webp used instead. Prefer copying from live when binary assets are available.

### Key classes

| Class | Role |
|-------|------|
| `.mh-sp-subbar` | Sticky page chrome (same pattern as National Team) |
| `.mh-sp-chip` | Category pill; `data-mh-sp-chip` |
| `.mh-sp-card` | Top Sports carousel card |
| `.mh-sp-link` | Accumulators / Long-term rows |
| `.mh-sp-tourney` | Compact tournament tile (badge + sport + name) |
| `.mh-sp-tourney__badge` | Circular league / flag badge |
| `.mh-sp-tourney__sport` | Sport glyph, top-right |
| `.mh-sp-sport` / `.mh-sp-league` | Nested `[data-mh-acc]` accordions |
| `.mh-sp-match` + `.mh-odds__btn` | Event row → Quick bet slip |

### Navigation

Sports tab flyout **Sports** → `sports.html`. Home **MORE SPORTS** → `sports.html`.

---

## Search / Events (`mobile/search.html`)

| Page | File | Body class |
|------|------|------------|
| Search | `mobile/search.html` | `.mh-page--search` |
| CSS | `mobile/css/mobile-search.css` | |
| JS | `mobile/js/mobile-search.js` | |

Empty state matches design screenshot; typing shows sample results (ALL / LIVE / LINE / CYBER).

### Structure

1. `.mh-header`  
2. `.mh-se-subbar` — back + title **Events**  
3. `.mh-se-panel` — search field (`Search championships`), **Exact match** switch, empty or results  
4. Empty: **Search events** + hint  
5. Results: tabs + grouped matches (sport → league → teams + odds)  
6. Footer + tab bar + `#mh-qbs`

### Entry points

Sports / National Team sub-bar search → `search.html`. Home quicknav search → `search.html`.

### Key classes

| Class | Role |
|-------|------|
| `.mh-se-field` | Search input row |
| `.mh-se-switch` | Exact match toggle (`role="switch"`) |
| `.mh-se-empty` | Centered empty copy |
| `.mh-se-tab` | ALL / LIVE / LINE / CYBER |
| `.mh-se-match` | Result row + `.mh-odds__btn` |

---

## Event info (`mobile/event-info.html`)

Opened from match **⋯** via `data-mh-event-info` + `data-mh-event` attributes (handled by `mobile-favourites.js`). Used on home LIVE/SPORTS cards, Sports line, and Favorites. Live modal parity: [event about](https://1xlite-46272.pro/en?modal-id=dashboard-event-about&game-id=738469896&betting-type=live).

1. `.mh-ei-subbar` — back + **Event info** (Escape also goes back)  
2. White menu card — Notifications (filled `ei-bell.svg`), Add/Remove favorites (olive `ei-star.svg`), **1xZone** (`ei-zone.svg`), **Statistics** (`ei-stats.svg` → `statistics.html`)  
3. Meta panel (`.mh-ei-meta`, `--surface-tertiary`) — circular info icon (`ei-info.svg`) + stage note (e.g. Round Robin / Australia. Hard. Round of 16)  
4. Weather card (`.mh-ei-weather`) — cloud/temp · wind · pressure · humidity (`ei-cloud` / `ei-wind` / `ei-pressure` / `ei-drop`); values from event `weather` via `mobile-favourites.js`  
5. Favorites toggle writes `localStorage` key `mh-favourites-v1`; rows toast or navigate like live

Icons: `ei-bell.svg`, `ei-star.svg`, `ei-zone.svg`, `ei-stats.svg`, `ei-info.svg`, `ei-cloud.svg`, `ei-wind.svg`, `ei-pressure.svg`, `ei-drop.svg` under `mobile/assets/icons/`

Home match cards use `.mh-match-card` + `icon-more.svg` for **⋯**; live cards also show a 1xZone action beside the menu.

---

## Favorites (`mobile/favourites.html`)

1. `.mh-fv-subbar` — back + **Favorites**  
2. `.mh-fv-panel` — **Games** accordion  
3. Live | Sports tabs + clock  
4. `.mh-ev-card` list from stored favourites (seed includes Ararat vs Shamrock)  
5. Card **⋯** → Event info  

Entry: Sports / NT star buttons, home fav quicknav.

---

## Casino / Slots (`mobile/casino.html`)

**Live ref:** [slots mobile](https://1xlite-46272.pro/en/slots?platform_type=mobile)

Dark lobby: hero carousel → section grids (Stars / HOT / Popular / Quick play / New / Exclusive / Drops & Wins / Bonus buy / Loved) → shared `.mh-footer` (Sports / Esports partners, app banner, social, support, legal).

**Distinct tab bar** `.mh-cs-tabbar` (not sports `mh-tabbar`): **Categories · Providers · MyCasino · Promo · Menu**. Live SVG icons in `mobile/assets/icons/cs-{categories,providers,mycasino,promo,menu}.svg`. MyCasino uses `.mh-cs-tab__bubble` (cyan circle + heart). Floating filter FAB `.mh-cs-fab`.

| Tab | Page |
|-----|------|
| Categories | `mobile/casino-categories.html` — 2-col lobby tiles + promo banners |
| Providers | `mobile/casino-providers.html` — Sort dropdown (By popularity / A-Z / Z-A) + 3-col mono logos |
| MyCasino | `mobile/my-casino.html` — guest My Casino ([authorization](https://1xlite-46272.pro/en/my-casino/authorization)) |
| Promo | `mobile/casino-promo.html` — see **Casino Promo** below |
| Menu | Full-screen `.mh-cs-menu` — see **Casino Menu** below |

Assets: hero + mid-page promo from live capture in `mobile/assets/casino/banners/live/` (`hero-1…5.webp`, `tourney-*.webp`); category icons `assets/casino/categories/`; provider logos `assets/casino/providers/`; My Casino art `assets/casino/my-casino/`; game thumbs in `mobile/assets/casino/games/` + `mobile/assets/games/*`.

**My Casino** (`mobile/my-casino.html`): Top games rail → Bonus Casino banner → tournaments → spin reel + green Spin CTA → Please log in card → shared footer.

---

## Live Casino (`mobile/live-casino.html`)

**Live ref:** [casino mobile](https://1xlite-46272.pro/en/casino?platform_type=mobile) (URL path `/en/casino`; UI title **LIVE CASINO**)

Reuses Casino / Slots shell: `mh-page--casino mh-page--live-casino`, same header auth, `.mh-cs-subbar` (back · **LIVE CASINO** · search), `.mh-cs-tabbar`, filter FAB `.mh-cs-fab`, shared footer + menu sheet. Styles in `mobile/css/mobile-casino.css`; dots / paging in `mobile/js/mobile-casino.js`.

| Block | Pattern |
|-------|---------|
| Hero | `.mh-cs-hero--lc` carousel + `.mh-cs-hero__dots--below` |
| Sections | **1XLIVE** · **POPULAR** (title + `MORE >>`) |
| Game pages | `.mh-cs-pages` horizontal pages of 2×2 `.mh-cs-grid--overlay` tiles; `.mh-cs-pages__dots` |
| Tiles | Title caption overlay (`.mh-cs-game__caption`); green **PROMO** badge bottom-right (`.mh-cs-badge--promo`) |
| Tab bar | Categories · Providers · MyCasino (cyan bubble) · Promo · Menu — same as slots lobby |
| Entry points | Casino flyout **Live Casino**, home 1XLIVE / LIVE CASINO rails, `casino-categories` Live Casino tile, menu Casino → Live Casino |

Assets: heroes + game thumbs from live capture in `mobile/assets/casino/live-casino/heroes/` and `.../games/`.

---

## Menu modal (`#mh-menu-sheet` · `.mh-cs-menu`)

Opened from **any** mobile sticky tabbar **Menu** (`#mh-menu-btn`) — sports `.mh-tabbar` (Sports · Casino · Bet slip · Deposit · Menu) and casino `.mh-cs-tabbar`. Shared markup on home, sports, NT, search, favourites, event-info, profile, auth, promo detail, and all casino pages. Canonical: `mobile/partials/menu-sheet.html`. Styles in `mobile/css/mobile-home.css`. Open/close via `mobile-home.js` (`data-mh-close-menu`, Escape).

Full-viewport light modal (white / grey), not the old sports bottom sheet.

| Block | Content |
|-------|---------|
| Top | Time (`[data-mh-menu-clock]`) · language control (flag + code + chevron → **Select Language**) · Settings · Close |
| Wallet (logged-in) | Balance `0 MYR` + green **Deposit** (`data-mh-deposit`) |
| Search | “Search menu” |
| Nav | Main page · Sports · Live · T20 Blast (TOP) · Esports · Favorites · Results · Statistics · Bet on Big Tournaments |
| Casino | Stand for Victory · Casino (chevron) · Live Casino |
| Games | 1xGames |
| My Account | Logged-in only — Bet history, Messages, Make a deposit, Withdraw, Transaction history, Personal profile, Security, Your accounts (**Payment queries** commented out / hidden; no Other) |
| Extra | Profile Extra (Referral · Membership · Rebate · Daily check in · Promotions · Live chat) · **Information** (accordion) · Mobile application · Other apps · **Log out** (logged-in) — no Other / Customer Support |

**Select Language** (`.mh-cs-lang` / `#mh-lang-panel`): overlay inside the menu modal. Open from top language control (`[data-mh-open-lang]`). Subbar back (`[data-mh-close-lang]`) returns to menu; title **SELECT LANGUAGE**; search filters the list; rows are flag circle · code · divider · native name; selected row uses pale `--odds-bg`. Language list + circular flag SVGs load from `mobile/assets/flags/languages.json` + `lang-*.svg` (sourced from [1xlite](https://1xlite-46272.pro/en)). Choosing a language updates the menu header code + flag, persists `localStorage mh-lang-v1`, toasts, and closes the language panel. Escape closes language first, then the menu.

**Removed from menu:** Promo section / **Promotions and offers** (promos stay under Extra → Promotions → `casino-promo.html`).

**Information accordion** (`[data-mh-menu-acc]`): About us · **Terms and Conditions** → `terms.html` · Affiliate Program · Become an agent · Privacy Policy · Cookie Policy · Contacts · **Payment methods** → `payment-methods.html`.

**Icons:** Campaign rows use `assets/icons/t20.svg`, `bobt.svg`, `sfv.svg`, `casino.svg`. Other row circles use mobile icons + desktop mirrors under `mobile/assets/icons/menu/` (`wallet`, `gamepad`, `phone`, `other-apps`, `info`). My Account / Extra / Log out use `assets/icons/profile/pf-*.svg`. Language flags: `assets/flags/` + `assets/account/flags/`.

**Guest:** hide `.mh-cs-menu__wallet`, `.mh-cs-menu__account`, `.mh-cs-menu__logout-row`.

---

## Results (`mobile/results.html`)

Entry: Menu → **Results**. Light sportsbook board under shared header + `.mh-rs-subbar` (back · **RESULTS** · filter chip).

| Block | Notes |
|-------|--------|
| `.mh-rs-sports` | Horizontal icon ribbon (All · Football · Ice Hockey · …); `data-mh-scroll` + `data-mh-drag-scroll`; active = green tint |
| `.mh-rs-tabs` / `.mh-rs-tab` | Sports (active green underline) · LIVE · 1xZone |
| `.mh-rs-filters` | Date chip + **24 HOURS** · search toggle · settings |
| `.mh-rs-block` | Sport accordion (icon · name · chevron); expand shows `.mh-rs-league` + `.mh-rs-match` cards |
| Match card | Datetime · teams/avatars (+ WIN) · score · venue meta |
| Shell | Shared footer + sports `.mh-tabbar` + `#mh-menu-sheet` |

CSS/JS: `css/mobile-results.css` · `js/mobile-results.js`. Subbar selectors registered in `mobile-home.css`.

---

## Bet on Big Tournaments (`mobile/big-tournaments.html`)

Entry: Menu → **Bet on Big Tournaments**. Screenshot accordion layout; desktop `big-tournaments.html` outright data + country/league flags from `../assets/icons/bt-*`.

| Block | Notes |
|-------|--------|
| `.mh-bt-subbar` | Back + **BET ON BIG TOURNAMENTS** (no action chips) |
| `.mh-bt-hero` | WC promo banner (`../assets/images/promo/one-hit-world-cup-2026-banner.jpg`) |
| `.mh-bt-sport` | Football section header (sport icon · title · home) |
| `.mh-bt-league` | Accordion bars; WC open by default; other leagues collapsed |
| `.mh-bt-market__select` | Market dropdown (1-3RD PLACE / semis / final / places / Winner) |
| `.mh-bt-row` / `.mh-bt-odd` | Team + country/league flag + YES/NO odds → Quick bet slip |
| Flags | Reuse desktop `bt-flag-*.png`, `bt-league-*.png`, `bt-wc-winner.png` |
| Shell | Full `.mh-footer` + sports `.mh-tabbar` + `#mh-menu-sheet` + `#mh-qbs` |

CSS/JS: `css/mobile-big-tournaments.css` · `js/mobile-big-tournaments.js`. Subbar `.mh-bt-` registered in `mobile-home.css`.

---

## Statistics (`mobile/statistics.html`)

Entry: Menu → **Statistics**. Live ref: [1xlite statistic](https://1xlite-46272.pro/en/statistic/23.07.2026).

One responsive page: **phone** (per-league horizontal match scroll + left drawer) and **wider shell ≥900px** (persistent left nav).

| Block | Notes |
|-------|--------|
| `.mh-st-sports-label` | **SPORTS** bar |
| `.mh-st-sports-rail` | Prev/next arrows + dark carousel; active sport green underline |
| `.mh-st-titlebar` | Light bar: list btn (phone) · **STATISTICS - TOP MATCHES** · search |
| `.mh-st-breadcrumb` | Wide only: `STATISTICS / FOOTBALL - TOP MATCHES - date` |
| `.mh-st-toolbar` | Date prev/label/next · pages 1–5 with arrows |
| `.mh-st-board-scroll` | Vertical scroll viewport (`max-height` + `overflow-y: auto`; `overflow-x: hidden`). Vertical scrollbar thin on phone; thicker grey thumb `#5a6a7a` / track `#c5ced6` on ≥900px |
| `.mh-st-league__head` | Full-width league bar (not in H-scroller). Sticky (`top: 0`) inside `.mh-st-board-scroll` while matches scroll vertically |
| `.mh-st-league__scroll` | Phone: wraps match rows; `overflow-x: auto` + thin H-scrollbar (track `#e4edf4`, thumb `#7a8a9a`, ~4px). Match rows `min-width: 640px`. ≥900px: `min-width: 0` so grid fills; H-scroll only if needed |
| `.mh-st-match__score` | Blue box (`--section-blue`) + white tabular score |
| `.mh-st-side` | Wide: sticky left nav (Top Competitions · Rankings · Choose Tournament); `gap: 12px` from content on `#e8eef4` |
| `.mh-st-drawer` | Phone left slide-out (same nav); edge chevron close; blur backdrop; ~300ms |
| Shell | Shared footer + sports `.mh-tabbar` + `#mh-menu-sheet` |

CSS/JS: `css/mobile-statistics.css` · `js/mobile-statistics.js`. Subbar prefix `.mh-st-` registered in `mobile-home.css`.

---

## Terms and Conditions (`mobile/terms.html`)

**Live ref:** [general rules](https://1xlite-46272.pro/en/information/rules/general?platform_type=mobile)

Entry: Menu → Extra → Information → **Terms and Conditions**.

1. `.mh-tc-subbar` — back · **GENERAL RULES** · download chip (`icon-download.svg` → desktop `../terms.html`)
2. Search — “Search terms and conditions” (`#mh-tc-search`)
3. Accordion list `.mh-tc-list` — 33 sections (1. GENERAL TERMS AND DEFINITIONS … 33. RESPONSIBLE GAMING); chevron expands body
4. Shared footer + sports `.mh-tabbar` + full Menu modal

CSS/JS: `css/mobile-terms.css` · `js/mobile-terms.js` (accordion + search filter).

---

## Payment methods (`mobile/payment-methods.html`)

Entry: Menu → Extra → Information → **Payment methods**.

Catalog picker (guest-accessible; header/tabbar switch to logged-in chrome when `is-logged-in`) — not the multi-step deposit/withdraw flows (`deposit.html` / `withdraw.html`).

1. `.mh-pm-subbar` — back · **PAYMENTS**
2. Mode tabs `.mh-pm-mode` — **Deposit** / **Withdrawal** (in-page; green active underline; `?mode=withdrawal`)
3. Intro card `.mh-pm-intro` — title + copy · **Select country** (MY) · **Deposit method** filter (opens `.mh-pm-sheet`)
4. **All methods** — 2-col `.mh-pm-grid`
5. Cards `.mh-pm-card` — logo · name · light-blue foot (Minimum / Maximum / fee+time)
   - Deposit mode: green **Deposit** CTA → `deposit.html` (`data-mh-deposit`)
   - Withdrawal mode: info foot only (no CTA)
6. Shared footer + sports `.mh-tabbar` + full Menu modal

Logos: `mobile/assets/payments/` (shared with deposit/withdraw).

CSS/JS: `css/mobile-payment-methods.css` · `js/mobile-payment-methods.js` (mode switch · type sheet · grid render).

---

## Casino Promo (`mobile/casino-promo.html`)

**Live ref:** [casino bonus / promo](https://1xlite-46272.pro/en/bonus/casino?platform_type=mobile)

Dark casino shell + `.mh-cs-tabbar` (Promo active). Sub-bar: back → `casino.html` + title **Promo**. Sticky section tabs `.mh-cs-ptabs` / `.mh-cs-ptab` (`data-cs-ptab`).

| Tab | Panel | Content |
|-----|-------|---------|
| Promo | `data-cs-ppanel="promo"` | Hero carousel → guest auth **or** logged-in codes+subscribe → Promotions rail → Tournaments |
| Promo codes | `data-cs-ppanel="codes"` | Code entry + subscribe (tab hidden for guests) |
| Promotions | `data-cs-ppanel="promotions"` | Full promotions rail |
| Tournaments | `data-cs-ppanel="tournaments"` | Status chips + cards |

### Guest vs logged-in

| State | Behaviour |
|-------|-----------|
| Guest (default) | `.mh-cs-promo-guest` auth card; `.mh-cs-ptab--codes` hidden |
| Logged-in (`body.is-logged-in`, `?loggedIn=1` or `mh-logged-in-v1`) | Hide guest card; show `.mh-cs-promo-logged` (codes + subscribe); show Promo codes tab |

Guest auth card (live `casino-promo-auth`): centered `gift-icon.webp` (user+check art from CDN) · “Log in and take advantage…” · bullet list · **Log in** (blue) / **Registration** (green).

Logged-in: **Available promo codes** — gift + green `+` · “Enter a promo code for a gift” · white input · green ✓ submit (`#mh-cs-promo-form` / `[data-cs-promo-form]` → toast). **Subscribe** card — flame art via `--mh-cs-sub-art` + social (X / Telegram / Instagram / Facebook).

### Structure (Promo overview)

1. Hero `.mh-cs-hero--promo` — 412×204 slides, dots **below** banner  
2. Guest auth **or** codes + subscribe  
3. Promotions — horizontal `.mh-cs-promo-rail` (945×370 media + title overlay + green **Find out more**)  
4. Tournaments — chips All / Live / **Finished** (`data-cs-tfilter`); cards with thumb, badge, prize, CTA / “The tournament is over”

JS: `mobile-casino.js` — `initPromoTabs`, `initPromoForms`, `initTournamentFilters`, hero/rail dots.

### Live assets (`mobile/assets/casino/promo/live/`)

CDN mirror list: `source-urls.json` (from [1xlite promo](https://1xlite-46272.pro/en/bonus/casino?platform_type=mobile)).

| Kind | Files |
|------|--------|
| Hero 412×204 | `hero-born-to-win.webp`, `hero-welcome.webp`, `hero-vip-cashback.webp`, `hero-weekend-booster.webp`, `hero-deal-of-day.webp`, `hero-big-play-day.webp`, `hero-jackys-bet.webp`, `hero-loyalty.webp`, `hero-wild-spin.webp` (+ extras: `hero-born-to-win-alt.webp`, `hero-subscribe-fs.webp`) |
| Promotions 945×370 | `promo-welcome.webp`, `promo-loyalty.webp`, `promo-vip-cashback.webp`, `promo-weekend.webp`, `promo-big-game.webp`, `promo-wild-spin.webp`, `promo-born-to-win.webp` |
| Tournaments 144 | `tourney-stand.webp`, `tourney-summer.webp`, `tourney-hotspin.webp` |
| UI art | `gift-icon.webp` / `.png` (auth icon), `subscribe-art.jpg` (flame) |
| Code gift UI | `assets/icons/icon-gift.svg` + CSS `+` (not CDN gift box) |

---

## Auth (`mobile/login.html` · `mobile/register.html`)

**Live refs:** [login](https://1xlite-46272.pro/en/user/login?platform_type=mobile) · [registration](https://1xlite-46272.pro/en/registration?type=email&bonus=CASINO)

Shell: header → `.mh-auth-subbar` → light `.mh-auth-panel` → shared `.mh-footer` → sports `.mh-tabbar` (Log in active).

Successful submit (or social) sets `mh-logged-in-v1` and redirects to `index.html` with logged-in header + Deposit tab (see **Logged-in chrome**).

| Page | Method tabs | Forms |
|------|-------------|-------|
| Login | By email · By phone · By code · Social networks | Email/ID + password; phone + password; phone + Send via SMS; Telegram/Google |
| Register | By e-mail · By phone · One-click · Social networks and messengers | Email 3-step flow (below); phone + SMS + promo; country/currency/promo; social + country/currency |

**Register by e-mail (multi-step):**
1. Email + Gmail tip → Back (disabled) / Next  
2. Select country (flag + picker overlay) → Back / Next  
3. Currency picker · password · confirm · promo · bonus selector → Register / Back + terms line  
Overlays: `#mh-auth-country`, `#mh-auth-currency` (searchable lists), `#mh-auth-bonuses` (Casino + 1xGames / Sport Single / Bonus for sports / Reject · Cancel/Save).  
On Register: set `mh-logged-in-v1`, swap header to Deposit + account, show **Your account details** + countdown → `deposit.html`, plus dismissible **100% bonus** promo (`GET BONUS` → `deposit.html`).

Icons: `assets/icons/auth-*.svg` (from live) + `auth-key.svg`. `data-auth-open="login|register"` on mobile pages navigates here via `mobile-home.js`.

**Login CTA / Remember me:** `.mh-auth-submit` uses `--action-green` (48px hit target); `.mh-auth-check` uses `--brand-blue` square + white tick (`auth-check.svg`) and `--header-action` label; password eye uses `auth-eye.svg` / `auth-eye-off.svg` (`currentColor`).

---

## Inner-page subbar (canonical)

Shared in `mobile/css/mobile-home.css` (match screenshot 2 · `referral.html` / `.mh-ex-subbar`):

| Piece | Rule |
|-------|------|
| Bar | Sticky under header; one horizontal row; `min-height: 44px`; `padding: 6px 10px`; bg `--header-nav-bg`; gap `8px`; `overflow: hidden` |
| Back | `32×32`; `border-radius: 6px`; bg `rgba(255,255,255,0.14)`; icon `sp-back.svg` `10×16` white |
| Title | Flex grow; left-aligned; `15px` / `700` / `letter-spacing: 0.06em` / uppercase; **ellipsis** if long (`min-width: 0`) |
| Actions | Optional right chips (`__actions` / `__btn` / `.mh-cs-subbar__search`): search · favourite · filter — **same locked 32×32 chip** as back (`min/max` 32, icon `16×16`, gap `8px`) |

**Sub-bar Filter chip** opens markets Filters overlay (`#mh-mf` · `css/mobile-markets-filter.css` · `js/mobile-markets-filter.js`): Markets checkboxes + period radios + Cancel/Save. Search → `search.html` (Events). Favourite → `favourites.html`.

Registered subbar prefixes include: `.mh-ex-` · `.mh-pp-` · `.mh-sec-` · `.mh-hr-` · `.mh-dep-` · `.mh-auth-` · `.mh-sp-` · `.mh-se-` · `.mh-ei-` · `.mh-fv-` · `.mh-nt-` · `.mh-cs-` · `.mh-pd-` · `.mh-tc-` · `.mh-pm-` · `.mh-rs-` (Results) · `.mh-st-` (Statistics) · `.mh-bt-` (Big Tournaments).

Do not redefine shell/back/title in page CSS. Long titles (e.g. National Team) must truncate — never wrap or push icons off-screen.

---

## Reuse recipe for a new mobile page

1. Keep page styles under `mobile/css/` scoped with a page class (e.g. `.mh-page--promo-detail`).
2. Keep content **full width** (`width: 100%`; `max-width: none`) — no centered `720px` column.
3. Paste footer + `mh-tabbar` (+ flyouts) from `mobile/index.html`.
4. Use the shared subbar pattern (back + uppercase title) from **Inner-page subbar** above — register new `__back` / `__title` selectors in `mobile-home.css` if needed.
5. Paste `#mh-qbs` Quick bet slip before `#mh-toast` if the page has odds.
6. For Sports line, copy `sports.html` + `mobile-sports.css`; flags under `mobile/assets/flags/`.
7. For Search / Events, copy `search.html` + `mobile-search.css` + `mobile-search.js`.
8. For Event info / Favorites, copy those pages + `mobile-favourites.js`; mark matches with `data-mh-event` + `data-mh-event-info`.
9. For horizontal rails, use `data-mh-scroll` + `data-mh-drag-scroll`.
10. For promo terms pages, copy `esports-cashback-boom.html` structure (sub-bar, crumbs, hero, single body, bonus rail).
11. For National Team, copy `national-team-live.html` / `national-team-line.html` + `mobile-national-team.css`.
12. Point links with correct relative paths (`../` for desktop pages).
13. Run the QA checklist against the 1xlite reference.