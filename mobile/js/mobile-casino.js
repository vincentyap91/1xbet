(() => {
  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function toast(msg) {
    const el = document.getElementById("mh-toast");
    if (!el) return;
    el.hidden = false;
    el.textContent = msg;
    window.clearTimeout(toast._t);
    toast._t = window.setTimeout(() => {
      el.hidden = true;
    }, 1800);
  }

  function bindCarouselDots(track, dotsRoot) {
    if (!track || !dotsRoot) return;
    const dots = Array.from(dotsRoot.querySelectorAll(".mh-cs-hero__dot"));
    if (!dots.length) return;

    const update = () => {
      const slideW = track.querySelector(".mh-cs-hero__slide, .mh-cs-promo-slide")?.clientWidth || track.clientWidth;
      const i = Math.round(track.scrollLeft / Math.max(slideW, 1));
      dots.forEach((d, idx) => d.classList.toggle("is-active", idx === i));
    };

    track.addEventListener("scroll", update, { passive: true });
    update();
  }

  function initHeroDots() {
    document.querySelectorAll(".mh-cs-hero").forEach((hero) => {
      bindCarouselDots(hero.querySelector(".mh-cs-hero__track"), hero.querySelector(".mh-cs-hero__dots"));
    });
    document.querySelectorAll(".mh-cs-promo-rail").forEach((rail) => {
      bindCarouselDots(rail.querySelector(".mh-cs-promo-rail__track"), rail.querySelector(".mh-cs-hero__dots"));
    });
  }

  function bindPageDots(track, dotsRoot) {
    if (!track || !dotsRoot) return;
    const dots = Array.from(dotsRoot.querySelectorAll(".mh-cs-hero__dot"));
    if (!dots.length) return;

    const update = () => {
      const pageW = track.querySelector(".mh-cs-page")?.clientWidth || track.clientWidth;
      const i = Math.round(track.scrollLeft / Math.max(pageW, 1));
      dots.forEach((d, idx) => d.classList.toggle("is-active", idx === i));
    };

    track.addEventListener("scroll", update, { passive: true });
    update();
  }

  function initSectionPages() {
    document.querySelectorAll(".mh-cs-section--lc").forEach((section) => {
      bindPageDots(section.querySelector("[data-cs-pages]"), section.querySelector("[data-cs-page-dots]"));
    });
  }

  function initCountdown() {
    const roots = Array.from(document.querySelectorAll(".mh-cs-timer"));
    if (!roots.length) return;
    const end = Date.now() + (2 * 24 * 60 * 60 + 14 * 60 * 60 + 36 * 60 + 8) * 1000;

    const tick = () => {
      let left = Math.max(0, end - Date.now());
      const d = Math.floor(left / 86400000);
      left -= d * 86400000;
      const h = Math.floor(left / 3600000);
      left -= h * 3600000;
      const m = Math.floor(left / 60000);
      left -= m * 60000;
      const s = Math.floor(left / 1000);
      roots.forEach((root) => {
        const set = (sel, val) => {
          const el = root.querySelector(sel);
          if (el) el.textContent = pad(val);
        };
        set("[data-cs-d]", d);
        set("[data-cs-h]", h);
        set("[data-cs-m]", m);
        set("[data-cs-s]", s);
      });
    };

    tick();
    window.setInterval(tick, 1000);
  }

  function initPromoTabs() {
    const tabs = Array.from(document.querySelectorAll("[data-cs-ptab]"));
    const panels = Array.from(document.querySelectorAll("[data-cs-ppanel]"));
    if (!tabs.length || !panels.length) return;

    const activate = (id) => {
      tabs.forEach((tab) => {
        const on = tab.getAttribute("data-cs-ptab") === id;
        tab.classList.toggle("is-active", on);
        tab.setAttribute("aria-selected", on ? "true" : "false");
      });
      panels.forEach((panel) => {
        const on = panel.getAttribute("data-cs-ppanel") === id;
        panel.hidden = !on;
      });
    };

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => activate(tab.getAttribute("data-cs-ptab")));
    });
  }

  function initSpinReel() {
    const root = document.getElementById("mh-mc-spin-reel");
    const btn = document.getElementById("mh-mc-spin-btn");
    if (!root || !btn) return;
    const items = Array.from(root.querySelectorAll(".mh-mc-spin__item"));
    if (items.length < 2) return;

    let index = Math.max(
      0,
      items.findIndex((el) => el.classList.contains("is-active"))
    );

    const setActive = (i) => {
      index = ((i % items.length) + items.length) % items.length;
      items.forEach((el, idx) => el.classList.toggle("is-active", idx === index));
    };

    btn.addEventListener("click", () => {
      const steps = 3 + Math.floor(Math.random() * 4);
      setActive(index + steps);
    });

    items.forEach((el, idx) => {
      el.addEventListener("click", () => setActive(idx));
    });
  }

  function initProviderSort() {
    const root = document.querySelector("[data-cs-sort]");
    const btn = document.getElementById("mh-cs-sort-btn");
    const menu = document.getElementById("mh-cs-sort-menu");
    const grid = document.getElementById("mh-cs-prov-grid");
    const valueEl = root?.querySelector("[data-cs-sort-value]");
    if (!root || !btn || !menu) return;

    const options = Array.from(menu.querySelectorAll("[data-cs-sort-opt]"));

    const setOpen = (open) => {
      const closeMs = (() => {
        try {
          return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 1 : 200;
        } catch (_) {
          return 200;
        }
      })();

      if (open) {
        clearTimeout(setOpen._t);
        menu.hidden = false;
        root.classList.remove("is-open");
        void menu.offsetWidth;
        root.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
        return;
      }

      root.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
      clearTimeout(setOpen._t);
      setOpen._t = window.setTimeout(() => {
        menu.hidden = true;
      }, closeMs);
    };

    const sortGrid = (mode) => {
      if (!grid) return;
      const items = Array.from(grid.querySelectorAll(".mh-cs-prov"));
      if (!items.length) return;
      if (!grid.dataset.csOrig) {
        grid.dataset.csOrig = "1";
        items.forEach((el, i) => {
          el.dataset.csIdx = String(i);
        });
      }
      const sorted = items.slice().sort((a, b) => {
        if (mode === "popularity") {
          return Number(a.dataset.csIdx) - Number(b.dataset.csIdx);
        }
        const an = (a.getAttribute("title") || a.getAttribute("data-mh-toast") || "").toLowerCase();
        const bn = (b.getAttribute("title") || b.getAttribute("data-mh-toast") || "").toLowerCase();
        if (mode === "za") return bn.localeCompare(an);
        return an.localeCompare(bn);
      });
      sorted.forEach((el) => grid.appendChild(el));
    };

    const select = (opt) => {
      const mode = opt.getAttribute("data-cs-sort-opt");
      const label = opt.getAttribute("data-cs-sort-label") || opt.textContent.trim();
      options.forEach((el) => {
        const on = el === opt;
        el.classList.toggle("is-selected", on);
        el.setAttribute("aria-selected", on ? "true" : "false");
      });
      if (valueEl) valueEl.textContent = label;
      sortGrid(mode);
      setOpen(false);
    };

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      setOpen(menu.hidden);
    });

    options.forEach((opt) => {
      opt.addEventListener("click", (e) => {
        e.stopPropagation();
        select(opt);
      });
    });

    document.addEventListener("click", (e) => {
      if (!root.contains(e.target)) setOpen(false);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setOpen(false);
    });
  }

  function initPromoForms() {
    document.querySelectorAll("#mh-cs-promo-form, [data-cs-promo-form]").forEach((form) => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = form.querySelector("input");
        const val = (input?.value || "").trim();
        if (!val) {
          toast("Enter a promo code");
          input?.focus();
          return;
        }
        toast("Promo code applied (demo)");
        if (input) input.value = "";
      });
    });
  }

  function initTournamentFilters() {
    document.querySelectorAll(".mh-cs-tfilters").forEach((group) => {
      const panel = group.closest(".mh-cs-pblock, .mh-cs-ppanel") || document;
      const filters = Array.from(group.querySelectorAll("[data-cs-tfilter]"));
      const cards = Array.from(panel.querySelectorAll("[data-cs-tstatus]"));
      if (!filters.length || !cards.length) return;

      const apply = (key) => {
        filters.forEach((btn) => {
          const on = btn.getAttribute("data-cs-tfilter") === key;
          btn.classList.toggle("is-active", on);
          btn.setAttribute("aria-selected", on ? "true" : "false");
        });
        cards.forEach((card) => {
          const status = card.getAttribute("data-cs-tstatus");
          card.hidden = key !== "all" && status !== key;
        });
      };

      filters.forEach((btn) => {
        btn.addEventListener("click", () => apply(btn.getAttribute("data-cs-tfilter")));
      });
    });
  }

  /* Demo RTP for slots-style game cards (not live-casino overlays) */
  const RTP_DEMO = {
    "Sugar Rush": { pct: "94.07", trend: "up" },
    "Gates of Olympus": { pct: "96.50", trend: "up" },
    "Sweet Bonanza": { pct: "96.48", trend: "up" },
    "Royalty of Olympus": { pct: "95.10", trend: "up" },
    "Plinko X": { pct: "88.15", trend: "down" },
    "Golden Dragon": { pct: "91.22", trend: "up" },
    "Chicken Road": { pct: "87.60", trend: "down" },
    "Wild Hot 40": { pct: "93.48", trend: "up" },
    "777 Juicy Wins": { pct: "91.55", trend: "up" },
    "Bang Bang": { pct: "85.04", trend: "down" },
    "Juicy Fruits": { pct: "96.12", trend: "up" },
    "Coin Craze": { pct: "88.90", trend: "down" },
    "Aviator": { pct: "97.00", trend: "up" },
    "JetX": { pct: "97.00", trend: "up" },
    "Avion": { pct: "89.40", trend: "down" },
    "Wild Mining": { pct: "92.33", trend: "up" },
    "Elven Hold and Win": { pct: "94.40", trend: "up" },
    "Tiger Jackpots": { pct: "90.60", trend: "down" },
    "Coin Craze PowerUp": { pct: "93.01", trend: "up" },
    "3 Fortune Mummies": { pct: "85.04", trend: "down" },
    "Volcano Millions": { pct: "87.60", trend: "down" },
    "Serengeti Sunrise": { pct: "95.10", trend: "up" },
    "Joy Ride": { pct: "90.05", trend: "down" },
    "Boxing King": { pct: "86.75", trend: "down" },
    "Captain Sharky": { pct: "94.88", trend: "up" }
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
    const fromData = el?.getAttribute("data-rtp");
    const trendData = el?.getAttribute("data-rtp-trend");
    if (fromData) {
      return {
        pct: String(fromData).replace(/%/g, ""),
        trend: trendData === "up" || trendData === "down" ? trendData : (parseFloat(fromData) >= 92 ? "up" : "down")
      };
    }
    if (RTP_DEMO[name]) return RTP_DEMO[name];
    const key = Object.keys(RTP_DEMO).find((k) => name.startsWith(k));
    if (key) return RTP_DEMO[key];
    const h = hashStr(name || "game");
    const pct = (85 + (h % 1200) / 100).toFixed(2);
    const n = parseFloat(pct);
    const trend = n >= 92 ? "up" : (n < 90 ? "down" : (h % 2 ? "up" : "down"));
    return { pct, trend };
  }

  function injectGameRtp() {
    if (document.body.classList.contains("mh-page--live-casino")) return;

    document.querySelectorAll(".mh-cs-game").forEach((card) => {
      if (card.classList.contains("mh-cs-game--overlay")) return;
      if (card.querySelector(".mh-cs-game__rtp")) return;

      const section = card.closest(".mh-cs-section");
      const sid = section?.getAttribute("aria-labelledby") || "";
      if (sid === "mh-cs-exclusive" || sid === "mh-cs-drops") return;

      const meta = card.querySelector(".mh-cs-game__meta");
      const nameEl = card.querySelector(".mh-cs-game__name");
      if (!meta || !nameEl) return;

      const name = (card.getAttribute("data-mh-toast") || nameEl.textContent || "game").trim();
      const { pct, trend } = resolveRtp(name, card);

      const rtp = document.createElement("span");
      rtp.className = "mh-cs-game__rtp";
      rtp.setAttribute("title", "Return to Player");
      rtp.innerHTML =
        `RTP: ${pct}%` +
        `<span class="mh-cs-game__rtp-trend mh-cs-game__rtp-trend--${trend}" aria-hidden="true"></span>`;
      meta.appendChild(rtp);
    });
  }

  function initAccountStrip() {
    const root = document.querySelector(".mh-cs-account");
    if (!root) return;

    root.querySelector("[data-cs-wallet-refresh]")?.addEventListener("click", () => {
      toast("Wallet refreshed (demo)");
    });

    root.querySelector("[data-cs-end-promo]")?.addEventListener("click", () => {
      toast("Promo ended (demo)");
    });
  }

  function init() {
    if (!document.body.classList.contains("mh-page--casino")) return;
    initHeroDots();
    initSectionPages();
    initCountdown();
    initPromoTabs();
    initPromoForms();
    initTournamentFilters();
    initSpinReel();
    initProviderSort();
    injectGameRtp();
    initAccountStrip();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
