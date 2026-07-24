# Mobile Project Inventory

**Scope:** `mobile/` only (static 1xBet mobile site)  
**Generated:** 2026-07-24  
**Method:** File glob + grep of HTML/JS/CSS + cross-check against `docs/Mobile_Design.md`  
**Constraint:** Documentation only — no mobile source files were modified for this report.

---

## 1. Project Summary

Static multi-page mobile sportsbook demo under `mobile/`. Shared shell behavior lives mainly in `mobile/js/mobile-home.js` (session chrome, menu sheet, language panel, tab flyouts, quick bet slip, toast, `data-mh-*` navigation). Page-specific scripts handle deposit/withdraw wizards, casino, search, history filters, etc.

Design reference: `docs/Mobile_Design.md` (canonical). A `mobile/Mobile_Design.md` path appeared in some indexers but was **not readable** at inventory time — treat `docs/Mobile_Design.md` as source of truth.

### Statistics

| Metric | Count | Notes |
|--------|------:|-------|
| Root HTML pages | **36** | `mobile/*.html` |
| HTML partials | **2** | `mobile/partials/*` — **not wired** into pages (orphans) |
| Dynamic / JS-only pages | **5** | No inbound `href` from other mobile HTML; reached via `data-mh-*` / JS |
| Query-string “routes” | **6+** | See Route Inventory |
| Unique overlay **types** | **~16** | Menu, lang, QBS, flyouts, sheets, drawer, modals, dropdowns, toast |
| Menu sheet instances | **~25** pages | Duplicated markup (not loaded from partials) |
| Bottom sheets (types) | **5** | Menu, QBS, dep-type, wd-type, pm-type |
| Drawers (types) | **1** | Statistics competitions drawer |
| Tab flyouts (types) | **2** | Sports + Casino (plus shared backdrop) |
| Dropdowns (types) | **2** | Casino providers sort; payment method type picker (sheet) |
| Reusable UI components (catalogued) | **~48** | By CSS prefix / shell module |
| Icon files under `mobile/assets/icons` | **165** | **150** unique basenames |
| Forms (`<form>`) | **~15** | Approx. across all HTML |
| Buttons (`<button>`) | **~1110** | Approx.; inflated by duplicated menu sheets |
| Inputs (`<input>`) | **~86** | Approx. |
| Mobile JS files | **20** | `mobile/js/*.js` |
| Mobile CSS files | **21** | `mobile/css/*.css` |
| Unique `data-mh-*` hooks | **~110** | See Route / Navigation sections |

### Auth / session model

- Demo session: `localStorage` key `mh-logged-in-v1` (`"1"`).
- Preview: `?loggedIn=1` / `?loggedIn=0` on pages that load `mobile-home.js`.
- Guests: header Log in / Registration → `login.html` / `register.html` (desktop `auth-modals.js` is linked but **intercepted** on `mh-page` bodies).
- Logged-in: Deposit + account chip; sports tabbar Log in → Deposit.

---

## 2. Page Inventory

### 2.1 Root pages (`mobile/*.html`)

| # | File | Title / purpose | Body / `data-page` | Primary CSS | Primary JS | Shell |
|---|------|-----------------|--------------------|-------------|------------|-------|
| 1 | `index.html` | Mobile home | `mobile-home` | `mobile-home.css` | `mobile-home.js`, `mobile-favourites.js` | Header, footer, sports tabbar, menu, lang, flyouts, QBS, toast |
| 2 | `sports.html` | Sports line | `sports` | `mobile-sports.css`, `mobile-sports-filter.css` | `mobile-home.js`, `mobile-favourites.js`, `mobile-sports-filter.js` | Full shell + **Sports filter** overlay |
| 3 | `national-team-line.html` | National team (sports) | `national-team-line` | `mobile-national-team.css` (+ home) | `mobile-home.js` | Full shell + QBS |
| 4 | `national-team-live.html` | National team (live) | `national-team-live` | same | `mobile-home.js` | Full shell + QBS; **empty championships** state |
| 5 | `search.html` | Events search | `search` | `mobile-search.css` | `mobile-search.js` | Full shell + QBS |
| 6 | `event-info.html` | Event detail | `event-info` | `mobile-event-info.css` | `mobile-event-info.js`, `mobile-favourites.js` | Tabbar + menu + flyouts; **no QBS** in markup; event action menu |
| 7 | `favourites.html` | Favorites | `favourites` | `mobile-favourites.css` | `mobile-favourites.js`, `mobile-favourites-page.js` | Full shell + QBS; Live/Sports tabs; empty state |
| 8 | `results.html` | Results | `results` | `mobile-results.css` | `mobile-results.js` | Tabbar + menu + flyouts; **no QBS** |
| 9 | `statistics.html` | Statistics | `statistics` | `mobile-statistics.css` | `mobile-statistics.js` | Tabbar + menu + flyouts + **left drawer** |
| 10 | `casino.html` | Casino / slots | `casino` | `mobile-casino.css` | `mobile-casino.js` | Casino tabbar + menu + lang; no sports flyouts/QBS |
| 11 | `live-casino.html` | Live casino | `live-casino` | `mobile-casino.css` | `mobile-casino.js` | Casino tabbar + menu |
| 12 | `casino-categories.html` | Categories | `casino` (+ modifiers) | `mobile-casino.css` | `mobile-casino.js` | Casino tabbar + menu |
| 13 | `casino-providers.html` | Providers | `casino` | `mobile-casino.css` | `mobile-casino.js` | Casino tabbar + menu + **sort dropdown** |
| 14 | `my-casino.html` | My Casino | `casino` | `mobile-casino.css` | `mobile-casino.js` | Casino tabbar + menu; spin reel |
| 15 | `casino-promo.html` | Casino promo | `casino` | `mobile-casino.css` | `mobile-casino.js` | Casino tabbar + menu; promo/tourney tabs |
| 16 | `esports-cashback-boom.html` | Promo detail example | `mobile-promo-detail` | `mobile-promo-detail.css` | `mobile-home.js` | Sports shell + QBS + flyouts |
| 17 | `login.html` | Log in | `login` | `mobile-auth.css` | `mobile-auth.js` | Menu + lang + footer; auth method tabs |
| 18 | `register.html` | Registration | `register` | `mobile-auth.css` | `mobile-auth.js` | Menu + lang + footer; auth method tabs |
| 19 | `profile.html` | Account hub | `profile` + `is-logged-in` | `mobile-profile.css` | `mobile-profile.js` | Sports tabbar + menu + QBS; Profile/Promo/Settings panels |
| 20 | `personal-profile.html` | Personal profile | `personal-profile` | `mobile-personal-profile.css` | `mobile-personal-profile.js` | Header only (no tabbar/menu) |
| 21 | `deposit.html` | Deposit wizard | `deposit` | `mobile-deposit.css` | `mobile-deposit.js` | Header + subbar; **type sheet**; no tabbar |
| 22 | `withdraw.html` | Withdrawal wizard | `withdraw` | `mobile-withdraw.css` (+ deposit shared) | `mobile-withdraw.js` | Same pattern as deposit |
| 23 | `bet-history.html` | Bet record | `bet-history` | `mobile-history-record.css` | `mobile-history-record.js` | Header + filters; empty default |
| 24 | `transaction-history.html` | Transaction record | `transaction-history` | same | same | same |
| 25 | `promotion-record.html` | Promotion record | `promotion-record` | same | same | same |
| 26 | `security.html` | Account security hub | `security` | `mobile-security.css` | `mobile-security.js` | Header + subbar |
| 27 | `change-language.html` | Change language | `change-language` | `mobile-security.css` | `mobile-security.js` | Header + subbar |
| 28 | `change-password.html` | Change password | `change-password` | `mobile-security.css` | `mobile-security.js` | Header + form |
| 29 | `information-center.html` | Info center | `information-center` | `mobile-security.css` | `mobile-security.js` | Empty state |
| 30 | `referral.html` | Referral | `referral` | `mobile-extra.css` | `mobile-extra.js` | Extra shell; empty claim panels |
| 31 | `membership.html` | Membership | `membership` | `mobile-extra.css` | `mobile-extra.js` (+ may use `../js/membership.js` per docs) | Extra shell |
| 32 | `rebate.html` | Rebate | `rebate` | `mobile-extra.css` | `mobile-extra.js` | Tabs + empty states; `?tab=` |
| 33 | `daily-checkin.html` | Daily check-in | `daily-checkin` | `mobile-extra.css` | `mobile-extra.js` | Claim **modal** |
| 34 | `live-chat.html` | Live chat | `live-chat` | `mobile-extra.css` | `mobile-extra.js` | Header + chat UI (demo) |
| 35 | `payment-methods.html` | Payment methods | `payment-methods` | `mobile-payment-methods.css` | `mobile-payment-methods.js` | Full shell + **pm type sheet** + QBS |
| 36 | `terms.html` | Terms / rules | `terms` | `mobile-terms.css` | `mobile-terms.js` | Full shell + QBS; accordion + search empty |

### 2.2 Partials (not standalone routes)

| File | Purpose | Status |
|------|---------|--------|
| `partials/menu-sheet.html` | Extract of sports-style menu sheet | **Orphan** — no `include` / fetch references found |
| `partials/casino-menu-sheet.html` | Extract of casino menu sheet | **Orphan** — same |

### 2.3 Pages only reachable via JS / `data-mh-*` (no inbound HTML `href`)

| Page | How opened |
|------|------------|
| `bet-history.html` | `data-mh-bets` → `mobile-home.js` |
| `transaction-history.html` | `data-mh-tx-history` |
| `promotion-record.html` | `data-mh-promo-record` |
| `personal-profile.html` | `data-mh-personal-profile` |
| `event-info.html` | `mobile-favourites.js` (`event-info.html?id=…` + `sessionStorage`) |

*(Deposit/withdraw/security/extras also heavily use JS hooks, but most also have some `href` somewhere.)*

---

## 3. Route Inventory

Static file paths are the routes. Additional query/hash variants:

| Route | Kind | Target / effect |
|-------|------|-----------------|
| `index.html` | Page | Home |
| `index.html?loggedIn=1\|0` | Query | Force demo session on/off |
| `sports.html` | Page | Sports line |
| `national-team-line.html` | Page | NT sports |
| `national-team-live.html` | Page | NT live |
| `search.html` | Page | Search |
| `search.html?q=` | Query | Prefill search (`mobile-search.js`) |
| `event-info.html` | Page | Event info |
| `event-info.html?id=` | Query | Event id (`mobile-event-info.js`); payload also via `sessionStorage` `mh-event-pending` |
| `favourites.html` | Page | Favorites |
| `results.html` | Page | Results |
| `statistics.html` | Page | Statistics |
| `casino.html` | Page | Casino |
| `live-casino.html` | Page | Live casino |
| `casino-categories.html` | Page | Categories |
| `casino-providers.html` | Page | Providers |
| `my-casino.html` | Page | My Casino |
| `casino-promo.html` | Page | Promo |
| `esports-cashback-boom.html` | Page | Promo detail |
| `login.html` / `register.html` | Page | Auth |
| `profile.html` | Page | Profile hub |
| `personal-profile.html` | Page | Personal profile |
| `deposit.html` | Page | Deposit wizard steps (in-page) |
| `withdraw.html` | Page | Withdraw wizard steps (in-page) |
| `bet-history.html` | Page | Bet history |
| `transaction-history.html` | Page | Tx history |
| `promotion-record.html` | Page | Promo history |
| `security.html` | Page | Security hub |
| `change-language.html` | Page | Language |
| `change-password.html` | Page | Password |
| `information-center.html` | Page | Info center |
| `referral.html` | Page | Referral |
| `membership.html` | Page | Membership |
| `rebate.html` | Page | Rebate |
| `rebate.html?tab=unclaim\|…` | Query | Initial rebate tab (`mobile-extra.js`) |
| `daily-checkin.html` | Page | Check-in |
| `live-chat.html` | Page | Live chat |
| `payment-methods.html` | Page | Payment methods |
| `payment-methods.html?mode=withdrawal` | Query | Withdrawal mode |
| `payment-methods.html#withdrawal` | Hash | Same as withdrawal mode |
| `terms.html` | Page | Terms |

### Outbound links (desktop / external — not inventoried as mobile pages)

| Target | Typical use |
|--------|-------------|
| `../index.html` | “Full version” / desktop home |
| `../casino.html` | Full casino |
| `../esports.html` | Esports (menu) |
| `../big-tournaments.html` | Big tournaments |
| `../world-flight-26.html` | Promo / 1xGames rail |
| `../promo.html` | Promotions |
| `../partnership.html` | Partner tiles (many) |
| `../terms.html` | Cookie / legal (desktop) |
| `../wc2026.html`, `../long-term-bets.html` | Sparse menu/footer links |
| `https://www.facebook.com/1xMalay`, Instagram | Social |
| `#` + `data-mh-toast` | Demo stubs (About us, apps, games, etc.) |

### Key `location.href` / `replace` targets (JS)

`login.html`, `register.html`, `index.html`, `deposit.html`, `withdraw.html`, `profile.html`, `bet-history.html`, `transaction-history.html`, `promotion-record.html`, `personal-profile.html`, `security.html`, `referral.html`, `membership.html`, `rebate.html`, `daily-checkin.html`, `live-chat.html`, `favourites.html`, `search.html`, `sports.html`, `event-info.html`.

Auth-gated pages redirect guests → `login.html` via `location.replace` (deposit, withdraw, profile, history, personal-profile, security, extra).

---

## 4. Modal Inventory

Unique overlay **types**. Parent pages list where markup exists (menu/lang/toast are widely duplicated).

| Name | Type | Trigger | File location (canonical) | Parent page(s) | Reusable |
|------|------|---------|---------------------------|----------------|----------|
| **Main menu sheet** | Full-screen bottom/side sheet (`#mh-menu-sheet`, `role="dialog"`) | `#mh-menu-btn` / Menu tab | Markup inlined per page; logic `js/mobile-home.js` | ~25 pages (home, sports, casino*, auth, profile, search, favs, NT, results, stats, terms, promo detail, payment-methods, event-info, …) | **Yes** (pattern); markup not shared via partial |
| **Select language panel** | Nested dialog (`.mh-cs-lang` `#mh-lang-panel`) | `data-mh-open-lang` inside menu | Same pages as menu | Nested in menu sheet | **Yes** |
| **Menu “About company” accordion** | Expand/collapse list | `data-mh-menu-acc` | Inside menu sheet | Menu parents | **Yes** |
| **Quick bet slip (QBS)** | Bottom sheet (`#mh-qbs`) + JS backdrop `#mh-qbs-backdrop` | Odds click / `#mh-betslip-btn` | `index.html` et al.; `mobile-home.js` | Home, sports, NT, search, favs, profile, payment-methods, terms, promo detail | **Yes** |
| **Sports tab flyout** | Slide-up menu (`#mh-flyout-sports`) | `data-mh-flyout-open="sports"` | Pages with `.mh-tabbar` | Home, sports, NT, search, favs, profile, results, stats, event-info, terms, payment-methods, promo detail | **Yes** |
| **Casino tab flyout** | Slide-up menu (`#mh-flyout-casino`) | `data-mh-flyout-open="casino"` | Same | Same | **Yes** |
| **Tab flyout backdrop** | Dimmer (`#mh-tab-flyout-backdrop`) | Opens with flyout | Same | Same | **Yes** |
| **Deposit payment-type sheet** | Bottom sheet (`#mh-dep-type-sheet`) | `data-mh-dep-types` | `deposit.html` + `mobile-deposit.js` | `deposit.html` | Shared CSS pattern w/ withdraw |
| **Withdraw payment-type sheet** | Bottom sheet (`#mh-wd-type-sheet`, classes `mh-dep-type-sheet`) | `data-mh-wd-types` | `withdraw.html` + `mobile-withdraw.js` | `withdraw.html` | Shared pattern |
| **Payment methods type sheet** | Bottom sheet (`#mh-pm-type-sheet`) | Method select button | `payment-methods.html` + `mobile-payment-methods.js` | `payment-methods.html` | Page-local |
| **Sports filter overlay** | Full-screen dialog (`#mh-sf`, `role="dialog"`) | `data-mh-sf-open` (More sports chip) | `sports.html` + `mobile-sports-filter.js` / CSS | `sports.html` | Page-local |
| **Statistics competitions drawer** | Left drawer (`#mh-st-drawer`) | `data-mh-st-drawer-open` | `statistics.html` + `mobile-statistics.js` | `statistics.html` | Page-local |
| **Event info action menu** | Inline context menu (`.mh-ei-menu`, `role="menu"`) | Always in event header / more | `event-info.html` | `event-info.html` | Page-local |
| **Casino providers sort menu** | Dropdown listbox (`#mh-cs-sort-menu`) | `#mh-cs-sort-btn` | `casino-providers.html` + `mobile-casino.js` | `casino-providers.html` | Page-local |
| **Daily check-in claim modal** | Center modal (`.mh-ex-modal` / `#dci-claim-backdrop`) | `data-dci-claim` | `daily-checkin.html` + `mobile-extra.js` | `daily-checkin.html` | Extra family |
| **Toast / snackbar** | Status toast (`#mh-toast`) | `data-mh-toast`, API `showToast` | Nearly all pages | Global pattern | **Yes** |
| **Check-in history** | Toast only (no sheet) | `data-mh-checkin-history` | `mobile-extra.js` | `daily-checkin.html` | N/A (demo toast) |

### Not found (as dedicated UI)

- Native date/time picker / calendar widget (history uses text `DD-MM-YYYY` + period chips)
- Image viewer / lightbox
- Desktop auth modal UI on mobile pages (navigates to pages instead)
- Tooltip / snackbar variants beyond `#mh-toast`
- Confirmation dialogs beyond deposit/withdraw success steps and check-in claim modal

### Overlay instance counts (approx.)

| Pattern | Approx. pages containing markup |
|---------|----------------------------------|
| `#mh-menu-sheet` + `#mh-lang-panel` | ~25 |
| `#mh-toast` | ~36 (all root pages surveyed) |
| `#mh-qbs` | ~11 |
| `mh-tab-flyout` | ~13 |
| Type sheets (dep/wd/pm) | 3 pages |
| `mh-sf` / `mh-st-drawer` / `mh-ex-modal` / `mh-cs-sort` / `mh-ei-menu` | 1 each |

---

## 5. Component Inventory

Reusable / repeated UI modules tied to CSS prefixes.

| Component | Prefix / classes | Where used | Notes |
|-----------|------------------|------------|-------|
| App header | `.mh-header` | Almost all pages | Guest vs logged-in actions |
| Deposit CTA / account chip | `.mh-btn-deposit`, `.mh-header__account` | Logged-in chrome | `data-mh-deposit`, `data-mh-account` |
| Sports bottom tabbar | `.mh-tabbar`, `.mh-tab` | Sports family pages | Guest Log in → Deposit when logged in |
| Casino bottom tabbar | `.mh-cs-tabbar`, `.mh-cs-tab` | Casino family | Categories / Providers / MyCasino / Promo / Menu |
| Sports / Casino flyouts | `.mh-tab-flyout` | Tabbar pages | See modals |
| Main menu | `.mh-sheet`, `.mh-cs-menu` | Many | Wallet, account grid, extras, logout |
| Language picker | `.mh-cs-lang`, `.mh-lang-chip` | Inside menu | Persists `mh-lang-v1` |
| Footer block | `.mh-footer` | Content pages | Partners, apps, social, support, full-site link |
| Quick bet slip | `.mh-qbs` | Betting pages | Empty / filled / overall odds |
| Odds buttons | `.mh-odds__btn`, `.mh-nt-odd` | Home, sports, NT | Adds to QBS |
| Match / event cards | `.mh-match-card`, `.mh-ev-card`, `.mh-sp-card` | Home / sports | `data-mh-event` |
| Promo cards / rails | `.mh-promo-card`, `.mh-rail-card`, `.mh-bonus-*` | Home, casino | |
| Provider icons rail | `.mh-provider` | Home | |
| Quick nav chips | `.mh-quicknav` | Home | |
| Section blocks | `.mh-section`, `.mh-sec-*` (home sections) | Home | Distinct from security `.mh-sec-*` |
| Sports chips / leagues | `.mh-sp-chip`, `.mh-sp-section`, `.mh-sp-league` | Sports | |
| Sports filter UI | `.mh-sf` | Sports | Full-screen |
| National team chrome | `.mh-nt-*` | NT pages | Mode toggle, chips, empty |
| Search UI | `.mh-se-*` | Search | Tabs ALL/LIVE/LINE/CYBER |
| Favourites UI | `.mh-fv-*` | Favourites | Empty + tabs |
| Results UI | `.mh-rs-*` | Results | Tabs + sport accordion |
| Statistics UI | `.mh-st-*` | Statistics | Drawer, pagination, tourney |
| Event info | `.mh-ei-*` | Event info | Weather, menu, markets |
| Casino game tiles / sections | `.mh-cs-*`, `.mh-mc-*` | Casino family | Hero, timer, spin, tourneys |
| Casino promo blocks | `.mh-cs-pblock`, `.mh-cs-code-card`, `.mh-cs-tourney` | Promo | |
| Promo detail | `.mh-pd-*` | Esports cashback | Hero, crumbs, accordion |
| Auth forms | `.mh-auth-*` | Login / register | Method tabs, social, eye toggle |
| Profile hub | `.mh-pf-*` | Profile | Card, tabs, list groups |
| Personal profile | `.mh-pp-*` | Personal profile | Medals, promo end |
| Deposit / withdraw | `.mh-dep-*`, `.mh-wd-*` | Deposit / withdraw | Cards, steps, success |
| History record | `.mh-hr-*` | Bet/tx/promo history | Filters, period chips, empty |
| Security flow | `.mh-sec-*` | Security family | Progress, cards |
| Change password fields | `.mh-cpw-*` | Change password | Eye toggle, reqs |
| Extra (loyalty) | `.mh-ex-*` | Referral, membership, rebate, check-in, chat | Cards, empty, modal |
| Payment methods | `.mh-pm-*` | Payment methods | Mode tabs, cards, sheet |
| Terms / rules | `.mh-tc-*` | Terms | Accordion + search empty |
| Toast | `.mh-toast` | Global | |
| Subbars | `.mh-*-subbar` | Many secondary pages | Back + title |
| Chips / badges | various `__badge`, HOT, NEW | Casino / profile | |
| Accordion | `data-mh-acc`, results/terms open classes | Multiple | |
| Horizontal scroll rails | `data-mh-scroll` + `data-mh-drag-scroll` | Many | |

---

## 6. Navigation Flow

### 6.1 From Home (`index.html`)

```
Home
├── Header brand → Home
├── Log in → login.html | Registration → register.html
├── [Logged in] Deposit → deposit.html | Account → profile.html
├── Quick nav / rails → sports, casino, live-casino, favourites, search, promo detail, outbound desktop
├── Odds → Quick bet slip (overlay)
├── Tabbar
│   ├── Sports flyout → national-team-line | national-team-live | sports
│   ├── Casino flyout → casino | live-casino | casino (slots)
│   ├── Bet slip → QBS
│   ├── Log in → login  |  [Logged in] Deposit → deposit
│   └── Menu → menu sheet
│       ├── Deposit / Withdraw / Bets / Tx history / Personal / Security (auth-gated)
│       ├── Referral / Membership / Rebate / Check-in / Live chat
│       ├── Casino promo, sports links, outbound ../esports|big-tournaments|…
│       ├── Language panel
│       └── Log out
└── Footer → live-chat, terms (desktop), partnership, full site
```

### 6.2 Sports / Live / Event

```
sports.html ↔ search.html ↔ favourites.html
sports More chip → Sports filter overlay (in-page)
Event card more / fav → event-info.html?id=…
event-info → statistics.html (menu item); favourites toggle; toast stubs
national-team-line / national-team-live ↔ via flyout / menu
results.html / statistics.html ← menu sheet Sports group
```

### 6.3 Casino

```
casino.html
├── Subbar → Home / Search
├── Tabbar → categories | providers | my-casino | promo | menu
└── Games → mostly data-mh-toast demos
live-casino.html — parallel casino shell
```

### 6.4 Wallet / Profile / Auth

```
profile.html
├── My bets → bet-history.html
├── Deposit → deposit.html ↔ withdraw.html (mode tabs)
├── Withdraw → withdraw.html
├── Personal profile → personal-profile.html
├── Security → security.html
│   ├── change-language.html
│   ├── change-password.html
│   └── information-center.html
├── Tx / Bet / Promo history pages
├── Extra → referral | membership | rebate | daily-checkin | casino-promo | live-chat
└── Profile tabs: Profile | Promo (empty) | Settings (empty demo)
```

### 6.5 Button / hook → page map (`mobile-home.js`)

| Hook | Destination (logged in) | Guest |
|------|-------------------------|-------|
| `data-mh-deposit` / `data-mh-deposit-tab` | `deposit.html` | `login.html` |
| `data-mh-withdraw` | `withdraw.html` | `login.html` |
| `data-mh-bets` | `bet-history.html` | `login.html` |
| `data-mh-tx-history` | `transaction-history.html` | `login.html` |
| `data-mh-promo-record` | `promotion-record.html` | `login.html` |
| `data-mh-personal-profile` | `personal-profile.html` | `login.html` |
| `data-mh-security` | `security.html` | `login.html` |
| `data-mh-referral` | `referral.html` | `login.html` |
| `data-mh-membership` | `membership.html` | `login.html` |
| `data-mh-rebate` | `rebate.html` | `login.html` |
| `data-mh-checkin` | `daily-checkin.html` | `login.html` |
| `data-mh-live-chat` | `live-chat.html` | `login.html` |
| `data-mh-account` | `profile.html` | (still navigates; profile JS may redirect) |
| `data-mh-logout` | clear session; reload or → `index.html` from profile | — |
| `data-auth-open="login\|register"` | `login.html` / `register.html` | — |
| `data-mh-toast` | Toast only | — |

### 6.6 Modal → page

| Overlay | Navigation |
|---------|------------|
| Sports flyout items | Direct `href` to NT / sports pages |
| Casino flyout items | Direct `href` to casino / live-casino |
| Menu sheet links | Mix of `href` + `data-mh-*` JS |
| QBS Deposit / Log in | Deposit page or auth pages |
| Deposit/Withdraw type sheet | Filter only (stays on page) |
| PM type sheet | Filter only |
| Claim modal | Closes in place |

---

## 7. Page State Matrix

Legend: **P** = Present (evidence in HTML/JS/CSS) · **N/A** = Not implemented for that page · **V** = needs verification / partial demo only.

| Page | Default | Loading | Empty | Error | Offline | Success | Disabled | Skeleton | No Data | Permission |
|------|---------|---------|-------|-------|---------|---------|----------|----------|---------|------------|
| index | P | N/A | QBS empty P | N/A | N/A | N/A | N/A | N/A | N/A | Guest vs logged-in P |
| sports | P | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Session chrome P |
| national-team-line | P | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | P |
| national-team-live | P | N/A | **P** `.mh-nt-empty` | N/A | N/A | N/A | N/A | N/A | P (same) | P |
| search | P idle | N/A | **P** `.mh-se-empty` | N/A | N/A | N/A | N/A | N/A | Filtered empty V | P |
| event-info | P | N/A | N/A | Missing event → fallback V | N/A | Fav toast V | N/A | N/A | N/A | P |
| favourites | P | N/A | **P** `#mh-fv-empty` | N/A | N/A | N/A | N/A | N/A | P | P |
| results | P | N/A | **P** `.mh-rs-empty` | N/A | N/A | N/A | N/A | N/A | P | P |
| statistics | P | N/A | N/A | N/A | N/A | N/A | N/A | N/A | V | P |
| casino* family | P | Timer UI V | N/A | N/A | N/A | Promo apply toast | Spin disabled V | N/A | N/A | P |
| esports-cashback-boom | P | N/A | QBS empty | N/A | N/A | N/A | N/A | N/A | N/A | P |
| login / register | P | N/A | N/A | Validation V | N/A | → index | Tab disabled N/A | N/A | N/A | N/A |
| profile | P | N/A | Promo/Settings empty P | Redirect guest | N/A | Copy toast | N/A | N/A | P | **Auth required** |
| personal-profile | P | N/A | N/A | Redirect guest | N/A | End promo toast | N/A | N/A | N/A | **Auth** |
| deposit | methods | Submit wait ~1.2s | **P** `.mh-dep-empty` | Validation toast | N/A | **P** success step | Continue disabled V | N/A | P | **Auth** |
| withdraw | methods | same | empty filter | Validation | N/A | **P** success | V | N/A | P | **Auth** |
| bet/tx/promo history | Filters | N/A | **P** `.mh-hr-empty` | Redirect guest | N/A | Show toast on show | N/A | N/A | **P** | **Auth** |
| security family | P | N/A | info-center empty P | Redirect | N/A | Password save toast | Eye / disabled | N/A | info empty | **Auth** |
| referral / rebate | P | N/A | **P** `.mh-ex-empty` | Redirect | N/A | N/A | N/A | N/A | P | **Auth** |
| membership | P | N/A | V | Redirect | N/A | N/A | N/A | N/A | V | **Auth** |
| daily-checkin | P | N/A | N/A | Redirect | N/A | **Claim modal** | Days locked/claimed | N/A | History toast only | **Auth** |
| live-chat | P | N/A | V | Redirect | N/A | N/A | N/A | N/A | V | **Auth** |
| payment-methods | P | N/A | **P** `#mh-pm-empty` | N/A | N/A | N/A | N/A | N/A | P | P |
| terms | P | N/A | **P** `#mh-tc-empty` | N/A | N/A | N/A | N/A | N/A | P | P |

**Global:** Offline / skeleton / permission-required OS dialogs — **N/A** across the static demo. “Permission” here means demo auth gate only.

---

## 8. Coverage Checklist

### Pages

- [ ] `index.html` — Home
- [ ] `sports.html` — Sports line
- [ ] `national-team-line.html`
- [ ] `national-team-live.html` (empty championships)
- [ ] `search.html` (+ `?q=`)
- [ ] `event-info.html` (+ `?id=`)
- [ ] `favourites.html` (empty + filled)
- [ ] `results.html` (Sports / LIVE / 1xZone)
- [ ] `statistics.html` (+ competitions drawer)
- [ ] `casino.html`
- [ ] `live-casino.html`
- [ ] `casino-categories.html`
- [ ] `casino-providers.html` (+ sort dropdown)
- [ ] `my-casino.html` (+ spin)
- [ ] `casino-promo.html` (Codes / Promos / Tournaments)
- [ ] `esports-cashback-boom.html`
- [ ] `login.html` (email / phone / code / social)
- [ ] `register.html` (email / phone / oneclick / social)
- [ ] `profile.html` (Profile / Promo / Settings tabs)
- [ ] `personal-profile.html`
- [ ] `deposit.html` (methods → amount → confirm → success)
- [ ] `withdraw.html` (same flow)
- [ ] `bet-history.html`
- [ ] `transaction-history.html`
- [ ] `promotion-record.html`
- [ ] `security.html`
- [ ] `change-language.html`
- [ ] `change-password.html`
- [ ] `information-center.html`
- [ ] `referral.html`
- [ ] `membership.html`
- [ ] `rebate.html` (`?tab=`)
- [ ] `daily-checkin.html` (+ claim modal)
- [ ] `live-chat.html`
- [ ] `payment-methods.html` (deposit / withdrawal mode)
- [ ] `terms.html`

### Modals / overlays

- [ ] Main menu sheet
- [ ] Language panel (inside menu)
- [ ] Menu About accordion
- [ ] Quick bet slip (empty / filled / multi)
- [ ] Sports tab flyout
- [ ] Casino tab flyout
- [ ] Deposit type sheet
- [ ] Withdraw type sheet
- [ ] Payment methods type sheet
- [ ] Sports filter fullscreen
- [ ] Statistics left drawer
- [ ] Event info action menu
- [ ] Casino providers sort dropdown
- [ ] Daily check-in claim modal
- [ ] Toast (`#mh-toast`)
- [ ] Check-in history (toast stub)

### Components

- [ ] Header (guest / logged-in)
- [ ] Sports tabbar (guest / logged-in Deposit)
- [ ] Casino tabbar
- [ ] Footer
- [ ] Menu sheet account grid
- [ ] QBS
- [ ] Odds / match cards
- [ ] Promo / game rails
- [ ] Deposit/withdraw method cards
- [ ] History filter form + period chips
- [ ] Profile card + list groups
- [ ] Auth method tabs + forms
- [ ] Extra loyalty cards / empty states
- [ ] Payment method cards
- [ ] Terms accordion
- [ ] Statistics tables / pagination
- [ ] Search results list
- [ ] Favourites list

---

## 9. Dead Code / Orphan Report

### High confidence

| Finding | Evidence |
|---------|----------|
| **`partials/menu-sheet.html` unused** | No `partials/` references in `mobile/**/*.{html,js}` |
| **`partials/casino-menu-sheet.html` unused** | Same; menu markup is copy-pasted into pages |
| **JS-only history/profile pages** | `bet-history`, `transaction-history`, `promotion-record`, `personal-profile` have **zero** inbound `href` from other mobile HTML (reachable only via hooks) |
| **`event-info.html` JS-only entry** | Opened via `mobile-favourites.js`, not static menu `href` |
| **Unused icons (sample)** | Filenames not referenced in mobile HTML/JS/CSS: `bh-filter.svg`, `bh-sort.svg`, `bh-stack.svg`, `bet-slip-coupon.svg`, `auth-user.svg`, `cs-casino.svg`, `cs-fav.svg`, `cs-home.svg`, `cs-sports.svg`, `icon-back.svg`, `icon-support.svg`, several root `pf-*.svg` duplicates of `profile/`, `tx-arrow-*.svg`, `te-football.svg`, `pr-gift.svg`, `menu/other.svg`, `menu/support.svg`, … (~25+ candidates; verify before deleting — may be planned UI) |
| **Desktop auth modals linked but bypassed** | Pages load `../js/auth-modals.js` + `../css/auth-modals.css`; `mobile-home.js` intercepts `data-auth-open` → page navigation |
| **Many `#` + toast “routes”** | About us, Privacy, Mobile app, game launches, full bet slip — demo stubs, not pages |

### Medium / needs verification

| Finding | Notes |
|---------|-------|
| Duplicate icon trees | Root `assets/icons/pf-*` vs `assets/icons/profile/pf-*` — some roots unused |
| `mobile/Mobile_Design.md` | Glob historically listed it; `Test-Path` false at inventory — confirm vs `docs/Mobile_Design.md` |
| Membership desktop script | Docs mention `../js/membership.js`; confirm current `membership.html` script tags |
| Results / statistics empty paths | Some empty copy is static demo text, not dynamic “no API” handling |
| Casino “MORE” / game tiles | Toast-only; no game detail pages |

### Missing nav (product gaps, not broken files)

- Full bet slip page (“Go to bet slip coming soon”)
- Messages / payment queries / your accounts (toast demos)
- Filters on sports subbar (“Filters coming soon”)
- Search filters (“Filters coming soon”)
- Settings tab on profile (placeholder empty)
- Dedicated check-in history screen

### Duplicates

- Menu sheet + language panel HTML duplicated across ~25 pages (partials exist but unused).
- Deposit/withdraw share visual system (`mh-dep-*`) with parallel JS.

---

## 10. Improvement Notes (Documentation Only)

1. **Wire or delete partials** — Either include `partials/*` via a build step / fetch, or remove them to avoid drift vs inlined copies.
2. **Add static `href` fallbacks** for JS-only pages (history, personal profile, event-info) so QA can deep-link without knowing hooks.
3. **Single overlay registry** — Document one source for menu/QBS/flyout so Figma capture doesn’t miss page-local variants (sports filter, stats drawer, claim modal).
4. **Auth asset cleanup** — Clarify whether `auth-modals.css/js` should remain linked on mobile; currently redundant with page routing.
5. **Icon audit** — Re-run unused-asset scan before a redesign; `bh-*` icons suggest a bet-history toolbar that was never built.
6. **State coverage** — No offline/skeleton/error boundaries; for redesign, decide which empty/success patterns (`mh-hr-empty`, `mh-dep-success`, `mh-ex-empty`) are canonical.
7. **Outbound desktop links** — Footer/menu still send users to `../` desktop pages; decide if mobile equivalents are needed for QA parity.
8. **Query routes** — Capture `?loggedIn=`, `?q=`, `?id=`, `?tab=`, `?mode=withdrawal` in Figma/QA matrices as first-class states.
9. **Keep `docs/Mobile_Design.md` synced** — It already lists most pages/hooks; this inventory adds partials orphans, unused icons, and explicit state matrix.

---

## Appendix A — Asset & script map (quick)

| Area | Path |
|------|------|
| Pages | `mobile/*.html` |
| Partials | `mobile/partials/*.html` |
| CSS | `mobile/css/mobile-*.css` |
| JS | `mobile/js/mobile-*.js` |
| Icons | `mobile/assets/icons/` (165 files) |
| Shared design doc | `docs/Mobile_Design.md` |
| Desktop CSS tokens (linked) | `../css/styles.css` |
| Desktop auth (linked, intercepted) | `../css/auth-modals.css`, `../js/auth-modals.js` |

## Appendix B — In-page multi-step / tab states (not separate HTML)

| Page | States |
|------|--------|
| deposit | methods · amount · confirm · success |
| withdraw | methods · amount · confirm · success |
| login | email · phone · code · social |
| register | email · phone · oneclick · social |
| profile | profile · promo · settings |
| favourites | live · sports |
| search | all · live · line · cyber |
| results | sports · live · zone |
| casino-promo | codes / promos / tourneys (ptabs) |
| rebate | unclaim / claim panels (`data-rb-tab`) |
| payment-methods | deposit · withdrawal |
| daily-checkin | locked · claimable · claimed days + claim modal |
| QBS | empty · filled · overall multi-bet |

---

*End of inventory. Absolute report path: `c:\Users\Vincent\OneDrive\Desktop\1xbet\mobile-project-inventory.md`.*
