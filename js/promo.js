/* =========================================================
   promo.js — Promotions page
   Figma 23:31819
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

  /* ── Promo filter + search ────────────────────────────────── */
  function bindFilters() {
    const chips = $$(".promo-filter-chip");
    const cards = $$(".promo-card");
    const searchInput = $(".promo-search input");
    let activeFilter = "all";
    let query = "";

    function apply() {
      cards.forEach((card) => {
        const cats = (card.dataset.category || "").split(/\s+/).filter(Boolean);
        const title = (card.querySelector(".promo-card-title")?.textContent || "").toLowerCase();
        const desc = (card.querySelector(".promo-card-desc")?.textContent || "").toLowerCase();
        const matchFilter = activeFilter === "all" || cats.includes(activeFilter);
        const matchSearch = !query || title.includes(query) || desc.includes(query);
        card.classList.toggle("promo-hidden", !(matchFilter && matchSearch));
      });
    }

    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        chips.forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        activeFilter = chip.dataset.filter || "all";
        apply();
      });
    });

    if (searchInput) {
      searchInput.addEventListener("input", () => {
        query = searchInput.value.trim().toLowerCase();
        apply();
      });
    }
  }

  /* ── Single Promo hero slider ─────────────────────────────── */
  function bindHeroSlider() {
    const slides = $$("[data-promo-slide]");
    if (!slides.length) return;

    const indexEl = $("#promo-hero-index");
    const totalEl = $("#promo-hero-total");
    const prevBtn = $("#promo-hero-prev");
    const nextBtn = $("#promo-hero-next");
    let index = Math.max(0, slides.findIndex((slide) => slide.classList.contains("is-active")));

    if (totalEl) totalEl.textContent = `/${slides.length}`;

    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        slide.classList.toggle("is-active", i === index);
      });
      if (indexEl) indexEl.textContent = String(index + 1);
    }

    prevBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      show(index - 1);
    });

    nextBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      show(index + 1);
    });

    show(index);
  }

  /* ── Promo learn more / hero CTAs ─────────────────────────── */
  function bindLearnMore() {
    $$(".promo-card").forEach((card) => {
      const href = card.getAttribute("href") || "";
      if (!href || href === "#") {
        card.addEventListener("click", (e) => {
          e.preventDefault();
          const title = card.querySelector(".promo-card-title")?.textContent || "this promotion";
          toast(`Opening: ${title}… (demo)`);
        });
      }
    });

    $$(".promo-hero-card").forEach((card) => {
      const href = card.getAttribute("href") || "";
      if (!href || href === "#") {
        card.addEventListener("click", (e) => {
          e.preventDefault();
          toast("Opening promotion… (demo mode)");
        });
      }
    });
  }

  /* ── Init ─────────────────────────────────────────────────── */
  function init() {
    tickClock();
    setInterval(tickClock, 30000);
    bindNav();
    bindMobile();
    bindFilters();
    bindHeroSlider();
    bindLearnMore();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
