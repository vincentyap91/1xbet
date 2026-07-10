/* =========================================================
   fast-bet.js — Fast Bet page chrome (Figma 23:17045)
   ========================================================= */

(function () {
  "use strict";

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function $$(sel, root) {
    return Array.from((root || document).querySelectorAll(sel));
  }

  function tickClock() {
    const el = $("#header-clock");
    if (!el) return;
    const d = new Date();
    el.textContent = d.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  function toast(msg) {
    const el = $("#toast");
    if (!el) return;
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => {
      el.hidden = true;
    }, 2200);
  }

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
      if (bottom?.classList.contains("is-open")) closeAll();
      else openMenu();
    });
    menuTab?.addEventListener("click", () => {
      if (bottom?.classList.contains("is-open")) closeAll();
      else openMenu();
    });
    backdrop?.addEventListener("click", closeAll);
  }

  function bindCards() {
    $$(".fb-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        e.preventDefault();
        const name = card.querySelector(".fb-card-label")?.textContent || "game";
        toast(`Demo only — ${name}`);
      });
    });
  }

  tickClock();
  setInterval(tickClock, 30000);
  bindNav();
  bindMobile();
  bindCards();
})();
