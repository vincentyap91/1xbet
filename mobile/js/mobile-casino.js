(() => {
  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function initHeroDots() {
    const track = document.getElementById("mh-cs-hero-track");
    const dots = Array.from(document.querySelectorAll(".mh-cs-hero__dot"));
    if (!track || !dots.length) return;

    const update = () => {
      const i = Math.round(track.scrollLeft / Math.max(track.clientWidth, 1));
      dots.forEach((d, idx) => d.classList.toggle("is-active", idx === i));
    };

    track.addEventListener("scroll", update, { passive: true });
    update();
  }

  function initCountdown() {
    const root = document.getElementById("mh-cs-timer");
    if (!root) return;
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
      const set = (sel, val) => {
        const el = root.querySelector(sel);
        if (el) el.textContent = pad(val);
      };
      set("[data-cs-d]", d);
      set("[data-cs-h]", h);
      set("[data-cs-m]", m);
      set("[data-cs-s]", s);
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
      root.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      menu.hidden = !open;
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

  function init() {
    if (!document.body.classList.contains("mh-page--casino")) return;
    initHeroDots();
    initCountdown();
    initPromoTabs();
    initSpinReel();
    initProviderSort();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
