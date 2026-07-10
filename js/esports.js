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

  /* ── Mobile drawer ───────────────────────────────────────── */
  function bindMobile() {
    const backdrop = $("#drawer-backdrop");
    const bottom = $("#header-bottom");
    const menuBtn = $("#mobile-menu-btn");
    const menuTab = $("#mobile-menu-tab");

    function closeAll() {
      bottom && bottom.classList.remove("is-open");
      backdrop && (backdrop.hidden = true);
      document.body.classList.remove("drawer-open");
      menuBtn && menuBtn.setAttribute("aria-expanded", "false");
      menuTab && menuTab.setAttribute("aria-expanded", "false");
    }

    [menuBtn, menuTab].forEach((btn) => {
      if (!btn) return;
      btn.addEventListener("click", () => {
        const open = bottom && bottom.classList.contains("is-open");
        closeAll();
        if (!open) {
          bottom && bottom.classList.add("is-open");
          backdrop && (backdrop.hidden = false);
          document.body.classList.add("drawer-open");
          btn.setAttribute("aria-expanded", "true");
        }
      });
    });

    backdrop && backdrop.addEventListener("click", closeAll);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAll(); });
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

  function bindModeTabs() {
    $$(".es-mode-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        $$(".es-mode-tab").forEach((t) => {
          t.classList.remove("is-active");
          t.setAttribute("aria-selected", "false");
        });
        tab.classList.add("is-active");
        tab.setAttribute("aria-selected", "true");
      });
    });
  }

  /* ── Odds buttons ─────────────────────────────────────────── */
  function bindOdds() {
    $$(".odd-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const row = btn.closest(".event-row");
        const allInRow = row ? $$(".odd-btn", row) : [];
        const wasSelected = btn.classList.contains("selected");

        allInRow.forEach((b) => b.classList.remove("selected"));
        if (!wasSelected) {
          btn.classList.add("selected");
          const market = btn.dataset.market || "selection";
          const val = btn.dataset.val || "";
          const teams = row ? $$(".team-name", row).map((t) => t.textContent) : [];
          const label = teams.length >= 2 ? `${teams[0]} vs ${teams[1]}` : "match";
          toast(`Added to bet slip: ${label} — ${market} @ ${val}`);
          updateBetSlipCount(1);
        } else {
          updateBetSlipCount(-1);
        }
      });
    });
  }

  let betCount = 0;
  function updateBetSlipCount(delta) {
    betCount = Math.max(0, betCount + delta);
    const counter = $(".bet-tab-count");
    if (counter) counter.textContent = betCount;
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

  /* ── Init ─────────────────────────────────────────────────── */
  function init() {
    tickClock();
    setInterval(tickClock, 30000);
    bindNav();
    bindMobile();
    bindSubnavTabs();
    bindDisciplines();
    bindModeTabs();
    bindOdds();
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
