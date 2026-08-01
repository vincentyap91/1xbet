(function () {
  "use strict";

  function initProviderSort() {
    const root = document.querySelector("[data-cs-sort]");
    const btn = document.getElementById("mh-cs-sort-btn");
    const menu = document.getElementById("mh-cs-sort-menu");
    const grid = document.getElementById("mh-cs-prov-grid");
    const valueEl = root && root.querySelector("[data-cs-sort-value]");
    if (!root || !btn || !menu) return;

    const options = Array.prototype.slice.call(menu.querySelectorAll("[data-cs-sort-opt]"));

    function closeMs() {
      try {
        return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 1 : 200;
      } catch (_) {
        return 200;
      }
    }

    function setOpen(open) {
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
      setOpen._t = window.setTimeout(function () {
        menu.hidden = true;
      }, closeMs());
    }

    function sortGrid(mode) {
      if (!grid) return;
      const items = Array.prototype.slice.call(grid.querySelectorAll(".mh-cs-prov"));
      if (!items.length) return;
      if (!grid.dataset.csOrig) {
        grid.dataset.csOrig = "1";
        items.forEach(function (el, i) {
          el.dataset.csIdx = String(i);
        });
      }
      const sorted = items.slice().sort(function (a, b) {
        if (mode === "popularity") {
          return Number(a.dataset.csIdx) - Number(b.dataset.csIdx);
        }
        const an = (a.getAttribute("title") || "").toLowerCase();
        const bn = (b.getAttribute("title") || "").toLowerCase();
        if (mode === "za") return bn.localeCompare(an);
        return an.localeCompare(bn);
      });
      sorted.forEach(function (el) {
        grid.appendChild(el);
      });
    }

    function select(opt) {
      const mode = opt.getAttribute("data-cs-sort-opt");
      const label = opt.getAttribute("data-cs-sort-label") || opt.textContent.trim();
      options.forEach(function (el) {
        const on = el === opt;
        el.classList.toggle("is-selected", on);
        el.setAttribute("aria-selected", on ? "true" : "false");
      });
      if (valueEl) valueEl.textContent = label;
      sortGrid(mode);
      setOpen(false);
    }

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      setOpen(menu.hidden);
    });

    options.forEach(function (opt) {
      opt.addEventListener("click", function (e) {
        e.stopPropagation();
        select(opt);
      });
    });

    document.addEventListener("click", function (e) {
      if (!root.contains(e.target)) setOpen(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
  }

  function initLobbySearch() {
    document.querySelectorAll("[data-cs-lobby-search]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const form = document.querySelector(".casino-search-form, .casino-search");
        if (form && form.focus) form.focus();
        else window.location.href = "casino.html";
      });
    });
  }

  function initMobileMenu() {
    const btn = document.getElementById("mobile-menu-btn");
    if (!btn) return;
    btn.addEventListener("click", function () {
      if (window.DesktopFullMenu) {
        if (window.DesktopFullMenu.isOpen()) window.DesktopFullMenu.close();
        else window.DesktopFullMenu.open();
      }
    });
  }

  function init() {
    initProviderSort();
    initLobbySearch();
    initMobileMenu();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
