# Homepage Canon（中间壳 — 给新项目用）

自包含配方：把本仓库 `index.html` **除 Header / Footer / Home social 外** 的桌面三栏设计，一摸一样搬到新项目或新页。

**源页：** `index.html`（`body[data-page="home"]`）  
**色锁：** `assets/images/references/sports-home-reference-modified-color.png`  
**主样式：** `css/styles.css`  
**主逻辑：** `js/script.js`（+ 下表依赖脚本）

---

## 1. Purpose

- 新项目要复刻 1xBet 首页 **sportsbook 中间壳**（左导航 + 主内容 + 右栏）。
- 颜色 / 表壳 / 密度必须跟下方 tokens 与 class，**禁止**另起第二套 Figma 色或表主题。
- 本仓库完整设计系统见 `docs/DESIGN_SYSTEM.md`；本文件刻意自包含，可单独拷贝。

---

## 2. Out of scope（不要搬）

| 排除 | 选择器 / 内容 |
|------|----------------|
| Header | `.site-header` |
| Footer | `.site-footer` |
| Live Transactions | `.home-social` → `.home-ltx` |
| RECENT BIG WINS | `.home-social` → `.home-big-wins` |
| RECENT PAYOUT | `.home-social` → `.home-payout` |
| Your Unique Referral Hub | `.home-social` → `.home-referral` |
| Home social 样式表 | `css/home-social.css`（新项目 **不要** 链） |

新项目若需要自己的页头/页脚，自行实现；**不要**从本 canon 复制上述四块社交模块。

---

## 3. DOM anatomy（保留部分）

按桌面渲染顺序：

```
.page-shell                          ← 可保留；header/footer 子节点删掉或换你们自己的
  .sportsbook-layout
    aside#left-sidebar.left-sidebar
      #sidebar-collapse
      .sidebar-quick                 ← Favorite / Recommended / #top-games
      .sidebar-line                  ← LIVE|Sports tabs + sports lists
    main#main-content.main-content
      #promo-slider.promo-slider
      .home-popular-sports           ← 桌面隐藏；≤900 显示
      #games.game-strip
      #live-events.live-events-block
        .home-quicknav
        .top-events-banner
        .te-stack (.te-toolbar / .te-filters)
        #live-table.odds-table-wrap  ← JS 填表
      #line-events.events-section
        .section-toolbar
        #line-filters.sport-filters
        #line-table.odds-table-wrap
      .accumulators[data-sb-accumulators]
    aside#right-sidebar.right-sidebar
      .right-compact-rail            ← 折叠态
      #right-collapse
      .reg-panel
      .bet-slip-panel
      .generator-panel
      #app-panel.app-panel
```

**不要**包含：`.home-social` 及其子块。

---

## 4. Copy recipe（新项目落地步骤）

1. 从 `index.html` 拷贝 `.sportsbook-layout`（含左 / 主 / 右），**删除** `.site-header`、`.site-footer`、`.home-social`。
2. 拷贝资源目录（至少）：
   - `css/styles.css`
   - `assets/icons/`（`nav-*` `sport-*` `te-*` `rb-*` `collapse/*` 等）
   - `assets/images/`（promo / TOP-EVENTS / game cards 用到的图）
   - `js/script.js` + 依赖脚本（见 §5）
3. HTML `<head>` 只链：

```html
<link rel="stylesheet" href="css/styles.css" />
<!-- 若要 ≤900 Popular Sports 抽屉，再加：
<link rel="stylesheet" href="mobile/css/mobile-sports-filter.css" />
-->
```

**不要**链 `css/home-social.css`。

4. `body` 建议：`data-page="home"`（或新页自己的 `data-page`，并改 `script.js` 数据源）。  
   首页默认双折：左右栏加 `.collapsed`，layout 加 `.left-collapsed.right-collapsed`（与 live 紧凑轨一致）。
5. 页底脚本顺序参考源页（去掉仅 header/footer 用的可选项）：

```html
<script src="js/favourites-store.js"></script>
<script src="js/accumulators.js"></script>
<script src="js/bet-save-load.js"></script>
<script src="js/bet-slip-generator.js"></script>
<script src="js/script.js"></script>
<script src="js/auth-modals.js"></script>
<!-- 可选 ≤900：
<script src="mobile/js/mobile-sports-filter.js"></script>
-->
```

`desktop-menu.js` 主要服务全站菜单 / header，新项目无同源 header 时可省略。

---

## 5. Module catalog

### 5.1 Main column（上 → 下）

| Module | Selector | Key children | CSS | JS | Notes |
|--------|----------|--------------|-----|-----|-------|
| Promo | `#promo-slider.promo-slider` | `.promo-track` `.promo-slide` `.promo-copy` `.btn-promo` `.promo-nav` `#promo-dots` | `styles.css` | `initPromoSlider()` | CTA = `--action-green`；≤900 文案左对齐 |
| Popular Sports | `.home-popular-sports` | `.home-rail-head` `.home-sports-rail` `.home-sport-card` | `styles.css`（桌面 `display:none`）；抽屉 `mobile-sports-filter.css` | 静态 + filter JS | 图：`assets/games/sports/*` |
| Game strip | `#games.game-strip` | `.game-strip__head` `#game-track` `.game-card` `.carousel-btn` | `styles.css` | `initCarousel()` | 横滑卡片 |
| LIVE block | `#live-events.live-events-block` | `.home-quicknav` `.top-events-banner` `.te-stack` `#live-table` | `styles.css` | `renderLiveFilterBar` / `renderFilters` / `renderTables` | 表壳见 §7 |
| LINE block | `#line-events.events-section` | `.section-toolbar` `#line-filters` `#line-table` | `styles.css` | `renderFilters` / `renderTables` | 与 LIVE 同表语言 |
| Accumulators | `.accumulators[data-sb-accumulators]` | `.acc-block` `.acc-header` `#acc-list-1\|2` `.btn-acc` | `styles.css` | `renderAccumulators()` + `accumulators.js` | 双卡；header 深绿渐变 |

### 5.2 Left sidebar

| Module | Selector | Assets prefix | JS |
|--------|----------|---------------|-----|
| Collapse | `#sidebar-collapse.sidebar-collapse` | `nav-collapse.svg` | 切换 `.collapsed` + layout `.left-collapsed` |
| Favorite | `[data-sb-panel="favorites"]` | `nav-star` `nav-chevron-down` | 内联面板 `sidebarMatchCardHtml` |
| Recommended | `[data-sb-panel="recommended"]` | `nav-thumbs` | 同上 |
| Top Games | `#top-games.top-games` | `nav-medal` `nav-page-*` `nav-football-sm` | `renderTopGame()` |
| LIVE \| Sports | `.sidebar-tabs` `[data-line]` | `nav-live` | 切换列表数据 |
| Filter bar | `.sidebar-filter-bar` | `nav-stream` `nav-globe` | — |
| Sports lists | `#sports-list-top` `#sports-list-az` → `.sport-item` | `sport-*.svg`；折叠 `collapse/common-*` `collapse/sports-*` | `renderSportsList()` |

左栏视觉：深色 chrome（`--sidebar-bg` / `--section-blue`），**不是**白底列表。

### 5.3 Right sidebar

| Module | Selector | Assets | Notes |
|--------|----------|--------|-------|
| Compact rail | `.right-compact-rail` `#right-expand` `.rc-reg` `#rc-bet` `.rc-widget` | `collapse/chevron-double-left` `widget-*` | 折叠时显示；Reg=`--action-green`，Bet slip=`--section-blue` |
| Collapse btn | `#right-collapse.right-collapse` | `rb-collapse-chevron` | 展开态 |
| Registration | `.reg-panel` `#reg-form` `.btn-reg` | `rb-bolt` `rb-phone` `rb-flag-my` | Submit=`--action-green`；登录后 `body.is-logged-in` 隐藏 |
| Bet slip | `.bet-slip-panel` `#bet-slip-body` `#bet-list` `#my-bets-body` | `rb-share` `rb-settings` | `renderBetSlip()`；票单浅表 + 深文 |
| Generator | `.generator-panel` `#generate-slip` | `rb-generator-art.png` | `bet-slip-generator.js` |
| App QR | `#app-panel.app-panel` | `rb-android` `rb-apple` `rb-phone-qr.png` | — |

≤900：右栏变成底 sheet（`.right-sidebar.is-open`）；见源 CSS `@media (max-width: 900px)`。

---

## 6. Layout & tokens（必须一致）

摘自 `css/styles.css` `:root` / `.sportsbook-layout`：

| Token / rule | Value | Use |
|--------------|-------|-----|
| `--sidebar-left-w` / `--sidebar-right-w` | `250px` | 三栏宽 |
| `--sidebar-collapsed-w` | `32px` | 折叠轨 |
| `--gap` | `8px` | layout + main 间距 |
| `--header-h` | `96px` desktop（有 header 时 sticky 偏移仍可用） | sticky `top: calc(var(--header-h) + 8px)` |
| Grid | `250 \| minmax(0,1fr) \| 250`；≥1181 中栏 `minmax(720px,1fr)` | `.sportsbook-layout` |
| Sticky rails | left/right `position: sticky`；`max-height: calc(100vh - var(--header-h) - 16px)`；`overflow-y: auto` | 各栏内滚动 |
| `--scrollbar-size` | `4px` | 全站细滚动条 |
| `--scrollbar-thumb` | `rgba(158, 184, 212, 0.55)` | thumb |
| `--page-bg` | `#0b1d33` | 页底 |
| `--page-bg-secondary` | `#0e243d` | layout 沟槽 |
| `--sidebar-bg` | `#162b45` | 侧栏 |
| `--section-blue` | `#1a4f8a` | 行 / section |
| `--brand-blue` | `#2b78d6` | **仅 Log In** |
| `--header-action` / `--accent-blue` | `#2f69b1` | tabs / filters / chips |
| `--cyan-accent` | `#3eb4f0` | 选中赔率 / focus |
| `--action-green` | `#88af2a` | Register / Generate / HOT / 激活下划线 |
| `--surface-primary` | `#fff` | 表 / 票单浅表 |
| `--odds-bg` | `#e8eef5` | 赔率钮 |
| `--league-header` | `#d8e3ee` | 联赛头 |
| `--text-primary` | `#1a3048` | 浅表正文 |
| `--radius-md` | `8px` | 面板圆角 |
| `--font` | SF Pro / system stack | UI 字 |

**角色规则：** 绿 = 转化 CTA；品牌蓝 = Log In；accent = 导航/筛选；左栏深色 + 浅色赔率表。

**断点：** 1400 / 1200（右栏可堆叠）/ 1024 / **900**（单栏 + drawer + tabbar）/ 600。

---

## 7. Odds tables（必用 class）

LIVE / LINE / 任何赛事表必须复用同一套，禁止第二套色板：

```
.live-events-block (或等价 section)
  .te-toolbar / .section-toolbar     ← 深绿渐变 chrome
  .odds-table-wrap
    .league-block
      .league-header                 ← --league-header（浅，非海军）
      .league-body
        .event-row
          .odd-btn                   ← --odds-bg；.selected → --odds-selected
```

| Layer | Token 要点 |
|-------|------------|
| Toolbar | `section-blue → section-blue-dark` 渐变；激活 tab 底边 `--action-green` |
| Table wrap | `--surface-primary` + `--border-dark` |
| League header | `--league-header` + 深色字 |
| Row zebra | odd 白 / even `--row-alternate` |
| Odds | 默认 `--odds-bg`；选中 `--odds-selected` + 白字 |
| LIVE badge | `--danger` |

≤900：行变为 match card（`.event-card-*` + `.odd-btn--stack`），逻辑仍在 `script.js` `renderEventRow`。

Football / draw（`.league-block--dc`）：列 `1 X 2 | 1X 12 2X | O Total U`；**同一场只保留一个选项**进 bet slip。

---

## 8. Assets checklist

| Prefix | Area |
|--------|------|
| `nav-*` `sport-*` | 左栏展开 |
| `collapse/*` | 左右折叠 xxs 轨 |
| `te-*` | TOP-EVENTS / LIVE toolbar |
| `rb-*` | 右栏 reg / slip / app |
| `games/sports/*` | ≤900 Popular Sports 图 |
| `assets/images/te-*.webp` 等 | TOP-EVENTS / promo / games 图 |

SVG 保持 `currentColor` / 白填；**不要**把 Figma chrome hex（如 `#1d4268` `#205583` `#276aa5` `#7eac2f`）当站点色。

---

## 9. Optional-module matrix

| 页面意图 | Promo | Popular Sports | Games | LIVE | LINE | Accumulators | Left | Right |
|----------|-------|----------------|-------|------|------|--------------|------|-------|
| 完整首页壳（本 canon） | ✓ | ✓（≤900） | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 仅 Line（类 `sports.html`） | ✗ | 可选 | ✗ | 表壳可改作 Line | ✓ | 可选 | ✓ | ✓ |
| 仅 Live | ✗ | 可选 | ✗ | ✓ | ✗ | 可选 | ✓ | ✓ |

**Home social 一律 ✗（本 canon 默认不搬）。**

---

## 10. New-project checklist

1. [ ] 只拷 `.sportsbook-layout`（左+主+右），无 header / footer / `.home-social`
2. [ ] 链 `css/styles.css`；**不**链 `home-social.css`
3. [ ] `:root` tokens 与 §6 一致（含细滚动条）
4. [ ] 左栏深色 chrome；表 / 票单浅表
5. [ ] LIVE/LINE 用 `.odds-table-wrap` / `.league-header` / `.event-row` / `.odd-btn`
6. [ ] CTA 绿、Log In 品牌蓝、tabs/filters accent
7. [ ] sticky 左右栏 + 栏内滚动
8. [ ] 图标走 `nav-*` `sport-*` `te-*` `rb-*` `collapse/*`
9. [ ] 脚本：`script.js` + accumulators / bet-slip 依赖按需
10. [ ] ≤900 行为：对照源 CSS；需要 Popular Sports 抽屉再加 mobile CSS/JS

---

## 11. Source map（本仓库路径）

| 用途 | Path |
|------|------|
| 结构源 | `index.html` |
| 样式 | `css/styles.css` |
| 表 / 赔率逻辑 | `js/script.js` |
| 串关 | `js/accumulators.js` |
| 票单生成器 | `js/bet-slip-generator.js` |
| 收藏 | `js/favourites-store.js` |
| 存取赛事 | `js/bet-save-load.js` |
| 登录态 / 弹窗 | `js/auth-modals.js` |
| 色锁图 | `assets/images/references/sports-home-reference-modified-color.png` |
| 完整 DS（可选） | `docs/DESIGN_SYSTEM.md` §2.1 / §5 |

---

*本文件为可移植 canon：新项目复制本 MD + 按表拷贝代码/资源即可复刻中间壳；不要包含 Live Transactions、RECENT BIG WINS、RECENT PAYOUT、Your Unique Referral Hub。*
