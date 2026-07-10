/* =========================================================
   multi-live.js — Multi-LIVE page (empty board demo)
   ========================================================= */

(function () {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function showToast(message) {
    const toast = $("#toast");
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => {
      toast.hidden = true;
    }, 2200);
  }

  function bindChrome() {
    const clock = $("#header-clock");
    if (clock) {
      const tick = () => {
        const now = new Date();
        clock.textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
      };
      tick();
      setInterval(tick, 30000);
    }

    $$(".nav-item.has-dropdown > .nav-link").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const item = btn.closest(".nav-item");
        const open = item.classList.contains("open");
        $$(".nav-item.has-dropdown").forEach((n) => n.classList.remove("open"));
        $$(".nav-item.has-dropdown > .nav-link").forEach((b) => b.setAttribute("aria-expanded", "false"));
        if (!open) {
          item.classList.add("open");
          btn.setAttribute("aria-expanded", "true");
        }
      });
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".nav-item.has-dropdown")) {
        $$(".nav-item.has-dropdown").forEach((n) => n.classList.remove("open"));
        $$(".nav-item.has-dropdown > .nav-link").forEach((b) => b.setAttribute("aria-expanded", "false"));
      }
    });

    $("#mobile-menu-btn")?.addEventListener("click", () => {
      const bottom = $("#header-bottom");
      const open = bottom?.classList.toggle("is-open");
      $("#mobile-menu-btn")?.setAttribute("aria-expanded", open ? "true" : "false");
    });

    $$(".bet-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        $$(".bet-tab").forEach((t) => {
          t.classList.toggle("active", t === tab);
          t.setAttribute("aria-selected", t === tab ? "true" : "false");
        });
        const slip = tab.dataset.betTab === "slip";
        const slipBody = $("#bet-slip-body");
        const myBets = $("#my-bets-body");
        if (slipBody) slipBody.hidden = !slip;
        if (myBets) myBets.hidden = slip;
      });
    });
  }

  function bindFilters() {
    document.addEventListener("click", (e) => {
      const chip = e.target.closest(".ml-chip[data-sport]");
      if (chip) {
        $$(".ml-chip[data-sport]").forEach((el) => {
          const on = el === chip;
          el.classList.toggle("active", on);
          el.setAttribute("aria-selected", on ? "true" : "false");
        });
        showToast(`Add ${chip.dataset.sport} events — demo empty board`);
        return;
      }

      if (e.target.closest(".ml-chip-more")) {
        showToast("More sports — demo only");
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    bindChrome();
    bindFilters();
  });
})();
