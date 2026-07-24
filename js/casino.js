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

  /* ── Demo RTP for slots tiles ───────────────────────────── */
  const RTP_DEMO = {
    "3 Fortune Mummies": { pct: "85.04", trend: "down" },
    "Sugar Rush Super Scatter": { pct: "94.07", trend: "up" },
    "Royalty of Olympus E...": { pct: "96.50", trend: "up" },
    "777 Juicy Wins": { pct: "91.22", trend: "up" },
    "Bang Bang": { pct: "88.15", trend: "down" },
    "Serengeti Sunrise": { pct: "95.10", trend: "up" },
    "Volcano Millions": { pct: "87.60", trend: "down" },
    "Wild Hot 40": { pct: "93.48", trend: "up" },
    "Joy Ride: Turbo Rails": { pct: "90.05", trend: "down" },
    "Juicy Fruits Sunshine": { pct: "96.12", trend: "up" },
    "Avion": { pct: "89.40", trend: "down" },
    "JetX": { pct: "97.00", trend: "up" },
    "Boxing King": { pct: "86.75", trend: "down" },
    "Captain Sharky": { pct: "94.88", trend: "up" },
    "Clover Coin Combo": { pct: "92.33", trend: "up" },
    "Coin Craze: Supercharged": { pct: "88.90", trend: "down" },
    "Casino Bar": { pct: "91.55", trend: "up" },
    "Aero": { pct: "85.70", trend: "down" },
    "Cricket Legacy BB": { pct: "93.01", trend: "up" },
    "243 Crystal Fruits": { pct: "96.80", trend: "up" },
    "Barbarossa": { pct: "87.25", trend: "down" },
    "Elves Kingdom": { pct: "94.40", trend: "up" },
    "Tales of Camelot": { pct: "90.60", trend: "down" },
    "Golden Mine": { pct: "95.75", trend: "up" }
  };

  function hashStr(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function resolveRtp(name, el) {
    const fromData = el?.dataset?.rtp;
    const trendData = el?.dataset?.rtpTrend;
    if (fromData) {
      return {
        pct: String(fromData).replace(/%/g, ""),
        trend: trendData === "up" || trendData === "down" ? trendData : (parseFloat(fromData) >= 92 ? "up" : "down")
      };
    }
    if (RTP_DEMO[name]) return RTP_DEMO[name];
    const h = hashStr(name || "game");
    const pct = (85 + (h % 1200) / 100).toFixed(2);
    const trend = parseFloat(pct) >= 92 ? "up" : (parseFloat(pct) < 90 ? "down" : (h % 2 ? "up" : "down"));
    return { pct, trend };
  }

  function injectGameTileRtp() {
    $$(".game-tile:not(.lc-tile)").forEach((tile) => {
      if (tile.querySelector(".game-tile-rtp")) return;
      const footer = tile.querySelector(".game-tile-footer");
      const nameEl = tile.querySelector(".game-tile-name");
      if (!footer || !nameEl) return;

      const name = tile.dataset.game || nameEl.textContent.trim() || "game";
      const { pct, trend } = resolveRtp(name, tile);

      let info = footer.querySelector(".game-tile-info");
      if (!info) {
        info = document.createElement("div");
        info.className = "game-tile-info";
        nameEl.replaceWith(info);
        info.appendChild(nameEl);
      }

      const rtp = document.createElement("span");
      rtp.className = "game-tile-rtp";
      rtp.setAttribute("title", "Return to Player");
      rtp.innerHTML =
        `RTP: ${pct}%` +
        `<span class="game-tile-rtp__trend game-tile-rtp__trend--${trend}" aria-hidden="true"></span>`;
      info.appendChild(rtp);
    });
  }

  /* ── Game tile interactions ─────────────────────────────── */
  function bindGameTiles() {
    injectGameTileRtp();

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

  /* ── Account strip (wallet / membership / promo) ───────── */
  function bindAccountStrip() {
    const root = $(".cs-account");
    if (!root) return;

    root.querySelector("[data-cs-wallet-refresh]")?.addEventListener("click", () => {
      toast("Wallet refreshed (demo)");
    });

    root.querySelector("[data-cs-end-promo]")?.addEventListener("click", () => {
      toast("Promo ended (demo)");
    });
  }

  /* ── Init ───────────────────────────────────────────────── */
  tickClock();
  setInterval(tickClock, 30000);
  bindNav();
  bindMobile();
  bindHeroCarousel();
  bindAccountStrip();
  bindFilters();
  bindGameTiles();
  bindTournaments();
  bindPopup();
  bindPromos();
  bindSearch();
  bindMyCasino();
})();
