(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const header = $("#mh-header");
  const toast = $("#mh-toast");
  const menuSheet = $("#mh-menu-sheet");
  const betCount = $("#mh-bet-count");
  let toastTimer = 0;
  let selectedOdds = 0;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toast.hidden = true;
    }, 1800);
  }

  function initHeaderScroll() {
    if (!header) return;
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 4);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function initQuickNav() {
    const tabs = $$("[data-mh-tab]");
    const livePanel = $('[data-mh-panel="live"]');
    const sportsPanel = $('[data-mh-panel="sports"]');

    // Both LIVE + SPORTS stay visible (1xlite mobile web); tabs scroll + highlight
    if (livePanel) livePanel.hidden = false;
    if (sportsPanel) sportsPanel.hidden = false;

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const key = tab.getAttribute("data-mh-tab");

        if (key === "fav") {
          showToast("Favourites — sign in to sync");
          return;
        }
        if (key === "search") {
          showToast("Search coming soon");
          return;
        }

        tabs.forEach((t) => {
          const isToggleTab = t.getAttribute("data-mh-tab") === "live" || t.getAttribute("data-mh-tab") === "sports";
          if (!isToggleTab) return;
          const on = t.getAttribute("data-mh-tab") === key;
          t.classList.toggle("is-active", on);
          t.setAttribute("aria-pressed", on ? "true" : "false");
        });

        const target = key === "sports" ? sportsPanel : livePanel;
        if (target) {
          const top = target.getBoundingClientRect().top + window.scrollY - 64;
          window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
        }
      });
    });
  }

  function initOdds() {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".mh-odds__btn");
      if (!btn) return;
      btn.classList.toggle("is-selected");
      selectedOdds = $$(".mh-odds__btn.is-selected").length;
      if (betCount) {
        betCount.hidden = selectedOdds === 0;
        betCount.textContent = String(selectedOdds);
      }
      const odd = btn.getAttribute("data-odd");
      if (btn.classList.contains("is-selected") && odd) {
        showToast(`Added ${odd} to bet slip`);
      }
    });
  }

  function initBetSlip() {
    $("#mh-betslip-btn")?.addEventListener("click", () => {
      if (selectedOdds === 0) {
        showToast("Select odds to build a bet slip");
        return;
      }
      showToast(`${selectedOdds} selection${selectedOdds > 1 ? "s" : ""} in bet slip`);
    });
  }

  function setMenuOpen(open) {
    if (!menuSheet) return;
    menuSheet.hidden = !open;
    document.body.classList.toggle("mh-sheet-open", open);
    $("#mh-menu-btn")?.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function initMenu() {
    $("#mh-menu-btn")?.addEventListener("click", () => setMenuOpen(true));
    $$("[data-mh-close-menu]").forEach((el) => {
      el.addEventListener("click", () => setMenuOpen(false));
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    });
  }

  function initAccordions() {
    $$("[data-mh-acc]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const panel = btn.nextElementSibling;
        const open = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", open ? "false" : "true");
        if (panel) panel.hidden = open;
      });
    });
  }

  function initHScrollHints() {
    $$("[data-mh-scroll]").forEach((el) => {
      el.addEventListener(
        "wheel",
        (e) => {
          if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && el.scrollWidth > el.clientWidth) {
            el.scrollLeft += e.deltaY;
          }
        },
        { passive: true }
      );
    });

    $$("[data-mh-scroll-prev], [data-mh-scroll-next]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const section = btn.closest(".mh-footer__slider");
        const track = section?.querySelector("[data-mh-scroll]");
        if (!track) return;
        const dir = btn.hasAttribute("data-mh-scroll-next") ? 1 : -1;
        track.scrollBy({ left: dir * 120, behavior: "smooth" });
      });
    });
  }

  function init() {
    initHeaderScroll();
    initQuickNav();
    initOdds();
    initBetSlip();
    initMenu();
    initAccordions();
    initHScrollHints();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
