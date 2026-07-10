/* =========================================================
   live-casino.js — Live Casino lobby
   Figma 23:28813
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

  /* ── Casino hero carousel ─────────────────────────────────── */
  function bindHero() {
    const track = $(".casino-hero-track");
    const slides = track ? $$(".casino-hero-slide", track) : [];
    const dots = $$(".casino-hero-dot");
    const prevBtn = $(".casino-hero-arrow.prev");
    const nextBtn = $(".casino-hero-arrow.next");
    if (!slides.length) return;

    let cur = 0;
    let autoTimer;

    function go(idx) {
      slides[cur].classList.remove("active");
      dots[cur] && dots[cur].classList.remove("active");
      cur = (idx + slides.length) % slides.length;
      slides[cur].classList.add("active");
      dots[cur] && dots[cur].classList.add("active");
      if (track) {
        track.style.transform = `translateX(-${cur * 100}%)`;
      }
    }

    function startAuto() {
      autoTimer = setInterval(() => go(cur + 1), 5000);
    }
    function resetAuto() {
      clearInterval(autoTimer);
      startAuto();
    }

    slides[0].classList.add("active");
    dots[0] && dots[0].classList.add("active");
    if (track) track.style.transition = "transform .45s ease";

    prevBtn && prevBtn.addEventListener("click", () => { go(cur - 1); resetAuto(); });
    nextBtn && nextBtn.addEventListener("click", () => { go(cur + 1); resetAuto(); });
    dots.forEach((d, i) => d.addEventListener("click", () => { go(i); resetAuto(); }));
    startAuto();
  }

  /* ── Filter chips ─────────────────────────────────────────── */
  function bindFilters() {
    $$(".lc-chip").forEach((btn) => {
      btn.addEventListener("click", () => {
        $$(".lc-chip.active").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
      });
    });
  }

  /* ── Game tiles ───────────────────────────────────────────── */
  function bindGames() {
    $$(".btn-game-play").forEach((btn) => {
      btn.addEventListener("click", () => {
        const tile = btn.closest(".game-tile");
        const name = tile ? tile.dataset.game || "this game" : "this game";
        toast(`Opening ${name}… (demo mode)`);
      });
    });

    $$(".game-tile-fav").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        btn.classList.toggle("active");
        toast(btn.classList.contains("active") ? "Added to Favourites" : "Removed from Favourites");
      });
    });

    const loadMoreBtn = $(".lc-load-more");
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", () => {
        toast("Loading more games…");
      });
    }
  }

  /* ── Tournament countdowns ────────────────────────────────── */
  function bindCountdowns() {
    $$(".tourn-card").forEach((card) => {
      const vals = $$(".tourn-time-val", card);
      if (!vals.length) return;
      setInterval(() => {
        let [d, h, m] = vals.map((v) => parseInt(v.textContent, 10));
        m--;
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; d--; }
        if (d < 0) { d = 0; h = 0; m = 0; }
        vals[0].textContent = String(d).padStart(2, "0");
        vals[1].textContent = String(h).padStart(2, "0");
        vals[2].textContent = String(m).padStart(2, "0");
      }, 60000);
    });
  }

  /* ── Rail toggle ──────────────────────────────────────────── */
  function bindRailToggle() {
    const toggleBtn = $(".casino-rail-toggle");
    const rail = $(".casino-rail");
    if (!toggleBtn || !rail) return;
    toggleBtn.addEventListener("click", () => {
      rail.classList.toggle("expanded");
    });
  }

  /* ── Init ─────────────────────────────────────────────────── */
  function init() {
    tickClock();
    setInterval(tickClock, 30000);
    bindNav();
    bindMobile();
    bindHero();
    bindFilters();
    bindGames();
    bindCountdowns();
    bindRailToggle();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
