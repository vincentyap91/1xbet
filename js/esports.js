/* =========================================================
   esports.js — Esports sportsbook page
   Figma 39:2
   ========================================================= */

(function () {
  "use strict";

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

  /* ── Clock ──────────────────────────────────────────────── */
  function tickClock() {
    const el = $("#header-clock");
    if (!el) return;
    const d = new Date();
    el.textContent = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
  }

  /* ── Toast ───────────────────────────────────────────────── */
  function toast(msg) {
    const el = $("#toast");
    if (!el) return;
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => { el.hidden = true; }, 2200);
  }

  /* ── Nav dropdowns ───────────────────────────────────────── */
  function bindNav() {
    $$(".nav-item.has-dropdown > .nav-link").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const item = btn.closest(".nav-item");
        const open = item.classList.contains("open");
        $$(".nav-item.open").forEach((n) => n.classList.remove("open"));
        $$(".nav-link[aria-expanded='true']").forEach((b) => b.setAttribute("aria-expanded", "false"));
        if (!open) {
          item.classList.add("open");
          btn.setAttribute("aria-expanded", "true");
        }
      });
    });
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".nav-item.has-dropdown")) {
        $$(".nav-item.open").forEach((n) => n.classList.remove("open"));
        $$(".nav-link[aria-expanded='true']").forEach((b) => b.setAttribute("aria-expanded", "false"));
      }
    });
  }

  /* ── Mobile drawer (menu only; bet slip via auth-modals sports tabbar) ─ */
  function bindMobile() {
    const backdrop = $("#drawer-backdrop");
    const bottom = $("#header-bottom");
    const menuBtn = $("#mobile-menu-btn");
    const menuTab = $("#mobile-menu-tab");

    function closeMenu() {
      if (window.DesktopFullMenu) window.DesktopFullMenu.close();
      bottom && bottom.classList.remove("is-open");
      menuBtn && menuBtn.setAttribute("aria-expanded", "false");
      menuTab && menuTab.setAttribute("aria-expanded", "false");
      document.body.classList.remove("ds-menu-open");
    }

    function closeAllDrawers() {
      closeMenu();
      const rail = $("#right-sidebar");
      rail && rail.classList.remove("is-open");
      $("#mobile-betslip-btn")?.setAttribute("aria-expanded", "false");
      if (backdrop) {
        backdrop.hidden = true;
        backdrop.classList.remove("is-visible");
      }
      document.body.classList.remove("drawer-open");
    }

    [menuBtn, menuTab].forEach((btn) => {
      if (!btn) return;
      btn.addEventListener("click", () => {
        if (window.DesktopFullMenu) {
          window.DesktopFullMenu.toggle();
          return;
        }
        const open = bottom && bottom.classList.contains("is-open");
        closeAllDrawers();
        if (!open) {
          bottom && bottom.classList.add("is-open");
          if (backdrop) {
            backdrop.hidden = false;
            backdrop.classList.add("is-visible");
          }
          document.body.classList.add("drawer-open");
          btn.setAttribute("aria-expanded", "true");
        }
      });
    });

    backdrop && backdrop.addEventListener("click", closeAllDrawers);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAllDrawers(); });
    $("#right-drawer-close")?.addEventListener("click", closeAllDrawers);
  }

  /* ── Sub-nav tabs ─────────────────────────────────────────── */
  function bindSubnavTabs() {
    $$(".es-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        $$(".es-tab.active").forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
      });
    });
  }

  /* ── Discipline sidebar ───────────────────────────────────── */
  function bindDisciplines() {
    $$(".es-discipline-item").forEach((item) => {
      const main = item.querySelector(".es-disc-main");
      const activate = (e) => {
        if (e) e.preventDefault();
        $$(".es-discipline-item.active").forEach((i) => i.classList.remove("active"));
        item.classList.add("active");
        const name = item.querySelector(".es-disc-name")?.childNodes[0]?.textContent?.trim()
          || item.querySelector(".es-disc-name")?.textContent?.trim()
          || "discipline";
        toast(`Showing matches for ${name}`);
      };
      if (main) main.addEventListener("click", activate);
      else item.addEventListener("click", activate);
    });

    $$(".es-disc-chevron").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
    });
  }

  /* Odds → shared ticket slip via js/script.js ([data-odd] + initBetSlip) */

  function bindFavs() {
    $$(".es-fav").forEach((btn) => {
      btn.addEventListener("click", () => {
        btn.classList.toggle("active");
        toast(btn.classList.contains("active") ? "Added to favorites" : "Removed from favorites");
      });
    });
  }

  /* ── Section tabs ─────────────────────────────────────────── */
  function bindSectionTabs() {
    $$(".te-tabs .section-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        const tabs = tab.closest(".te-tabs");
        if (!tabs) return;
        $$(".section-tab", tabs).forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
      });
    });
  }

  /* ── Game filter chips (Live / Sports tables) ─────────────── */
  function bindGameFilters() {
    $$(".es-game-filters").forEach((bar) => {
      const section = bar.closest(".es-match-section");
      if (!section) return;
      $$(".es-game-chip", bar).forEach((chip) => {
        chip.addEventListener("click", () => {
          $$(".es-game-chip", bar).forEach((c) => c.classList.remove("active"));
          chip.classList.add("active");
          const filter = chip.getAttribute("data-filter") || "all";
          $$(".es-league", section).forEach((league) => {
            const disc = league.getAttribute("data-disc") || "";
            league.classList.toggle("is-hidden", filter !== "all" && disc !== filter);
          });
        });
      });
    });
  }

  function bindModeTabs() {
    $$(".es-mode-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        $$(".es-mode-tab").forEach((t) => {
          t.classList.remove("is-active");
          t.setAttribute("aria-selected", "false");
        });
        tab.classList.add("is-active");
        tab.setAttribute("aria-selected", "true");
        const mode = tab.getAttribute("data-mode") || "";
        if (mode === "live") {
          $("#es-matches")?.scrollIntoView({ behavior: "smooth", block: "start" });
        } else if (mode === "sports" || mode === "line") {
          $("#es-sports")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
  }

  /* ── Discipline card / tile clicks ───────────────────────── */
  function bindDiscCards() {
    $$(".es-disc-tile").forEach((tile) => {
      tile.addEventListener("click", (e) => {
        e.preventDefault();
        const name = tile.querySelector(".es-disc-tile-name")?.textContent || "discipline";
        toast(`Browsing ${name} matches`);
      });
    });

    $$(".es-comp-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        e.preventDefault();
        const name = card.querySelector(".es-comp-card-game")?.textContent || "competition";
        toast(`Opening ${name} — select a market to bet`);
      });
    });
  }

  /* ── Hero carousel ───────────────────────────────────────── */
  function bindHero() {
    const slides = $$(".es-hero-slide");
    const dots = $$(".es-hero-dot");
    if (!slides.length) return;
    let idx = 0;

    function go(n) {
      idx = (n + slides.length) % slides.length;
      slides.forEach((s, i) => s.classList.toggle("is-active", i === idx));
      dots.forEach((d, i) => d.classList.toggle("is-active", i === idx));
    }

    dots.forEach((dot) => {
      dot.addEventListener("click", () => go(Number(dot.dataset.slide) || 0));
    });
    setInterval(() => go(idx + 1), 6000);
  }

  /* ── Live match timer ─────────────────────────────────────── */
  function tickLiveTimers() {
    $$(".live-time").forEach((el) => {
      const match = el.textContent.match(/(\d+):(\d+)/);
      if (!match) return;
      let [, m, s] = match.map(Number);
      s++;
      if (s >= 60) { s = 0; m++; }
      el.textContent = `LIVE ${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    });
  }

  /* ── Left + right collapse (match homepage sportsbook rails) ─ */
  function isMobileViewport() {
    return window.matchMedia("(max-width: 900px)").matches;
  }

  function bindSidebarCollapse() {
    const layout = $(".sportsbook-layout");
    const left = $(".left-sidebar");
    const right = $(".right-sidebar");
    if (!layout || !left || !right) return;

    function setRightCollapsed(collapsed) {
      right.classList.toggle("collapsed", collapsed);
      layout.classList.toggle("right-collapsed", collapsed);
      const btn = $("#right-collapse");
      if (btn) {
        btn.setAttribute("aria-expanded", collapsed ? "false" : "true");
        btn.setAttribute("aria-label", collapsed ? "Expand block" : "Collapse block");
      }
    }

    function setLeftCollapsed(collapsed) {
      left.classList.toggle("collapsed", collapsed);
      layout.classList.toggle("left-collapsed", collapsed);
      const btn = $("#sidebar-collapse");
      if (btn) {
        btn.setAttribute("aria-expanded", collapsed ? "false" : "true");
        btn.setAttribute("aria-label", collapsed ? "Expand block" : "Collapse block");
      }
    }

    layout.classList.toggle("left-collapsed", left.classList.contains("collapsed"));
    layout.classList.toggle("right-collapsed", right.classList.contains("collapsed"));

    $("#sidebar-collapse")?.addEventListener("click", () => {
      if (isMobileViewport()) return;
      setLeftCollapsed(!left.classList.contains("collapsed"));
    });

    $("#right-collapse")?.addEventListener("click", () => {
      if (isMobileViewport()) return;
      setRightCollapsed(!right.classList.contains("collapsed"));
    });

    $("#right-expand")?.addEventListener("click", () => {
      if (isMobileViewport()) return;
      setRightCollapsed(false);
    });

    $("#rc-bet")?.addEventListener("click", () => {
      if (isMobileViewport()) return;
      setRightCollapsed(false);
    });

    $("#rc-save")?.addEventListener("click", () => {
      if (isMobileViewport()) return;
      setRightCollapsed(false);
      document.querySelector(".bet-save-link")?.focus();
    });

    $("#rc-app")?.addEventListener("click", () => {
      if (isMobileViewport()) return;
      setRightCollapsed(false);
      const appPanel = $("#es-app-panel");
      if (appPanel) {
        appPanel.hidden = false;
        appPanel.scrollIntoView({ block: "nearest" });
      }
    });
  }

  /* ── Right rail panels (app / subscribe; bet slip via script.js) ─ */
  function bindRightRail() {
    const appPanel = $("#es-app-panel");
    $("#es-app-close")?.addEventListener("click", () => {
      if (appPanel) appPanel.hidden = true;
    });

    $$("#es-app-panel .app-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        $$("#es-app-panel .app-tab").forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        const os = tab.getAttribute("data-app") || "android";
        const icon = $("#es-app-download [data-app-icon]");
        if (icon) {
          icon.src = os === "ios" ? "assets/icons/rb-apple.svg" : "assets/icons/rb-android.svg";
        }
        toast(os === "ios" ? "iOS app QR ready" : "Android app QR ready");
      });
    });
  }

  /* ── Init ─────────────────────────────────────────────────── */
  function init() {
    tickClock();
    setInterval(tickClock, 30000);
    bindNav();
    bindMobile();
    bindSidebarCollapse();
    bindRightRail();
    bindSubnavTabs();
    bindDisciplines();
    bindModeTabs();
    bindFavs();
    bindGameFilters();
    bindSectionTabs();
    bindDiscCards();
    bindHero();
    setInterval(tickLiveTimers, 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
