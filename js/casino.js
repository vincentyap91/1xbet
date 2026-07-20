/* =========================================================
   casino.js — Casino / Slots lobby + My Casino pages
   Figma 23:22206 / 23:26044
   ========================================================= */

(function () {
  "use strict";

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

  /* ── Clock ─────────────────────────────────────────────── */
  function tickClock() {
    const el = $("#header-clock");
    if (!el) return;
    const d = new Date();
    el.textContent = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
  }

  /* ── Toast ──────────────────────────────────────────────── */
  function toast(msg) {
    const el = $("#toast");
    if (!el) return;
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => { el.hidden = true; }, 2200);
  }

  /* ── Nav dropdowns ──────────────────────────────────────── */
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

  /* ── Mobile drawer ──────────────────────────────────────── */
  function bindMobile() {
    const backdrop = $("#drawer-backdrop");
    const bottom = $("#header-bottom");
    const menuBtn = $("#mobile-menu-btn");
    const menuTab = $("#mobile-menu-tab");

    function closeAll() {
      document.body.classList.remove("drawer-open");
      if (backdrop) backdrop.hidden = true;
      if (bottom) bottom.classList.remove("is-open");
      menuBtn?.setAttribute("aria-expanded", "false");
      menuTab?.setAttribute("aria-expanded", "false");
    }
    function openMenu() {
      document.body.classList.add("drawer-open");
      if (backdrop) backdrop.hidden = false;
      if (bottom) bottom.classList.add("is-open");
      menuBtn?.setAttribute("aria-expanded", "true");
      menuTab?.setAttribute("aria-expanded", "true");
    }
    menuBtn?.addEventListener("click", () => {
      bottom?.classList.contains("is-open") ? closeAll() : openMenu();
    });
    menuTab?.addEventListener("click", () => {
      bottom?.classList.contains("is-open") ? closeAll() : openMenu();
    });
    backdrop?.addEventListener("click", closeAll);
  }

  /* ── Hero carousel ──────────────────────────────────────── */
  function bindHeroCarousel() {
    const track = $(".casino-hero-track");
    if (!track) return;
    const slides = $$(".casino-hero-slide", track);
    const dots = $$(".casino-hero-dot");
    const total = slides.length;
    let cur = 0;
    let timer;

    function goTo(n) {
      cur = ((n % total) + total) % total;
      track.style.transform = `translateX(-${cur * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle("active", i === cur));
    }

    function start() { timer = setInterval(() => goTo(cur + 1), 4500); }
    function restart() { clearInterval(timer); start(); }

    $(".casino-hero-arrow.next")?.addEventListener("click", () => { goTo(cur + 1); restart(); });
    $(".casino-hero-arrow.prev")?.addEventListener("click", () => { goTo(cur - 1); restart(); });
    dots.forEach((d, i) => d.addEventListener("click", () => { goTo(i); restart(); }));

    goTo(0);
    start();
  }

  /* ── Filter chips ───────────────────────────────────────── */
  function bindFilters() {
    $$(".casino-filter-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        $$(".casino-filter-chip").forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
      });
    });
  }

  /* ── Game tile interactions ─────────────────────────────── */
  function bindGameTiles() {
    $$(".game-tile").forEach((tile) => {
      const fav = tile.querySelector(".game-tile-fav");
      const playBtn = tile.querySelector(".btn-game-play");
      const demoBtn = tile.querySelector(".btn-game-demo");
      const name = tile.dataset.game || tile.querySelector(".game-tile-name")?.textContent || "game";

      playBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        toast(`Demo only — ${name}`);
      });
      demoBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        toast(`Free play demo — ${name}`);
      });
      fav?.addEventListener("click", (e) => {
        e.stopPropagation();
        const isFav = fav.classList.toggle("is-fav");
        toast(isFav ? `Added to favourites` : `Removed from favourites`);
      });
    });

    $$(".top-game-card, .activity-game-card, .month-tourn-card").forEach((card) => {
      card.addEventListener("click", () => {
        const name = card.dataset.game || card.querySelector("[class*='name']")?.textContent || "game";
        toast(`Demo only — ${name}`);
      });
    });
  }

  /* ── Tournament "How to take part" ─────────────────────── */
  function bindTournaments() {
    $$(".btn-take-part").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        toast("Tournament registration — demo only");
      });
    });
    $$(".btn-find-out").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        toast("Promotion details — demo only");
      });
    });
  }

  /* ── Deposit bonus popup ────────────────────────────────── */
  function bindPopup() {
    const backdrop = $("#casino-popup-backdrop");
    if (!backdrop) return;

    const DISMISSED_KEY = "casinoPopupDismissed";

    function closePopup() {
      backdrop.classList.add("hidden");
      sessionStorage.setItem(DISMISSED_KEY, "1");
    }

    function openPopup() {
      backdrop.classList.remove("hidden");
    }

    // Close on X button
    $("#casino-popup-close")?.addEventListener("click", closePopup);

    // Close on backdrop click (outside modal)
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) closePopup();
    });

    // Close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closePopup();
    });

    // Get Bonus button → toast
    $("#casino-popup-bonus-btn")?.addEventListener("click", (e) => {
      e.preventDefault();
      closePopup();
      toast("Bonus registration — demo only");
    });

    // Show on load unless previously dismissed
    if (!sessionStorage.getItem(DISMISSED_KEY)) {
      setTimeout(openPopup, 600);
    }
  }

  /* ── Promo banners ──────────────────────────────────────── */
  function bindPromos() {
    $$(".promo-banner .btn-find-out").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        toast("Promotion details — demo only");
      });
    });
  }

  /* ── Casino search ──────────────────────────────────────── */
  function bindSearch() {
    const form = $(".casino-search-form");
    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = $(".casino-search")?.value.trim();
      if (q) toast(`Searching for "${q}" — demo only`);
    });
  }

  /* ── My Casino logged-in dashboard ─────────────────────── */
  function bindMyCasino() {
    if (!$(".mycasino-dash") && !$(".mycasino-recommended")) return;

    // Demo deep-link: casino-favourites.html?auth=1
    try {
      if (new URLSearchParams(window.location.search).get("auth") === "1") {
        sessionStorage.setItem("1xbet_logged_in", "1");
        document.body.classList.add("is-logged-in");
      }
    } catch (e) { /* ignore */ }

    $$("[data-mc-promo-code]").forEach((btn) => {
      btn.addEventListener("click", () => toast("Enter promo code — demo only"));
    });

    $$(".mycasino-loyalty-info").forEach((btn) => {
      btn.addEventListener("click", () => toast("Loyalty levels — demo only"));
    });

    $$("[data-mc-copy-id]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const idEl = btn.closest(".mycasino-loyalty-id")?.querySelector("[data-mc-user-id]");
        const id = (idEl?.textContent || "").trim();
        if (!id) return;
        try {
          if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(id);
          } else {
            const ta = document.createElement("textarea");
            ta.value = id;
            ta.setAttribute("readonly", "");
            ta.style.position = "fixed";
            ta.style.opacity = "0";
            document.body.appendChild(ta);
            ta.select();
            document.execCommand("copy");
            ta.remove();
          }
          toast("ID copied");
        } catch (e) {
          toast("Could not copy ID");
        }
      });
    });

    $$(".mycasino-app-store").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        toast("App download — demo only");
      });
    });

    $$("[data-mc-rec-fav]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const on = btn.classList.toggle("is-active");
        btn.setAttribute("aria-pressed", on ? "true" : "false");
        toast(on ? "Added to favourites" : "Removed from favourites");
      });
    });

    const track = $("[data-mc-rec-track]");
    const prev = $("[data-mc-rec-prev]");
    const next = $("[data-mc-rec-next]");
    if (track && prev && next) {
      const step = () => Math.max(track.clientWidth * 0.9, 200);
      prev.addEventListener("click", () => {
        track.scrollBy({ left: -step(), behavior: "smooth" });
      });
      next.addEventListener("click", () => {
        track.scrollBy({ left: step(), behavior: "smooth" });
      });
    }
  }

  /* ── Init ───────────────────────────────────────────────── */
  tickClock();
  setInterval(tickClock, 30000);
  bindNav();
  bindMobile();
  bindHeroCarousel();
  bindFilters();
  bindGameTiles();
  bindTournaments();
  bindPopup();
  bindPromos();
  bindSearch();
  bindMyCasino();
})();
