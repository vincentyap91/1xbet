/* =========================================================
   WC2026 page interactions
   Static demo only: tabs, markets, odds, bet slip, header chrome.
   ========================================================= */

(function () {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const state = {
    betSlip: [],
  };

  const demoPool = [
    { id: "gen-wc-main-w1", league: "World Cup 2026", match: "Spain vs Belgium", market: "1X2", selection: "Spain", odds: 1.682 },
    { id: "gen-wc-qual-spain", league: "World Cup 2026", match: "Spain vs Belgium", market: "Team to Qualify", selection: "Spain", odds: 1.884 },
    { id: "gen-winner-france", league: "World Cup 2026", match: "Tournament Winner", market: "Who Will Win", selection: "France", odds: 6.0 },
  ];

  function formatOdd(value) {
    return Number(value).toFixed(value >= 10 ? 2 : 3).replace(/\.?0+$/, "");
  }

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

  function parseOdd(el) {
    const raw = el.getAttribute("data-odd");
    if (!raw) return null;
    try {
      return JSON.parse(raw.replace(/&quot;/g, '"'));
    } catch (_) {
      return null;
    }
  }

  function productOdds(items) {
    if (!items.length) return 1;
    return items.reduce((acc, item) => acc * Number(item.odds || 1), 1);
  }

  function syncMobileBetCount() {
    const badge = $("#mobile-bet-count");
    if (!badge) return;
    badge.hidden = state.betSlip.length === 0;
    badge.textContent = String(state.betSlip.length);
  }

  function syncOddButtons() {
    $$("[data-odd]").forEach((btn) => {
      const data = parseOdd(btn);
      if (!data) return;
      const selected = state.betSlip.some((item) => item.id === data.id);
      btn.classList.toggle("selected", selected);
      btn.setAttribute("aria-pressed", selected ? "true" : "false");
    });
  }

  function updateTotals() {
    const total = productOdds(state.betSlip);
    const stake = Number($("#stake-input")?.value) || 0;
    const totalEl = $("#total-odds");
    const returnEl = $("#potential-return");
    if (totalEl) totalEl.textContent = formatOdd(total);
    if (returnEl) returnEl.textContent = (stake * total).toFixed(2);
  }

  function renderBetSlip() {
    const empty = $("#bet-empty");
    const list = $("#bet-list");
    const footer = $("#bet-footer");
    const regCta = $("#bet-reg-cta");
    if (!empty || !list || !footer) return;

    syncMobileBetCount();

    if (!state.betSlip.length) {
      empty.hidden = false;
      list.hidden = true;
      footer.hidden = true;
      if (regCta) regCta.hidden = false;
      list.innerHTML = "";
      syncOddButtons();
      return;
    }

    empty.hidden = true;
    list.hidden = false;
    footer.hidden = false;
    if (regCta) regCta.hidden = true;
    list.innerHTML = state.betSlip
      .map(
        (bet) => `
        <article class="bet-item" data-bet-id="${bet.id}">
          <button type="button" class="bet-remove" data-remove="${bet.id}" aria-label="Remove">x</button>
          <div class="bet-item-league">${bet.league}</div>
          <div class="bet-item-match">${bet.match}</div>
          <div class="bet-item-market">${bet.market}</div>
          <div class="bet-item-sel">
            <span>${bet.selection}</span>
            <span class="odds">${formatOdd(bet.odds)}</span>
          </div>
        </article>`
      )
      .join("");

    updateTotals();
    syncOddButtons();
  }

  function toggleOdd(data) {
    const index = state.betSlip.findIndex((bet) => bet.id === data.id);
    if (index >= 0) {
      state.betSlip.splice(index, 1);
      showToast("Selection removed");
    } else {
      state.betSlip.push(data);
      showToast("Selection added to bet slip");
    }
    renderBetSlip();
  }

  function initHeaderDropdowns() {
    document.addEventListener("click", (event) => {
      const trigger = event.target.closest(".nav-item.has-dropdown > .nav-link");
      if (trigger) {
        event.preventDefault();
        const item = trigger.closest(".nav-item");
        const isOpen = item.classList.contains("open");
        $$(".nav-item.open").forEach((openItem) => {
          openItem.classList.remove("open");
          openItem.querySelector(".nav-link")?.setAttribute("aria-expanded", "false");
        });
        if (!isOpen) {
          item.classList.add("open");
          trigger.setAttribute("aria-expanded", "true");
        }
        return;
      }

      if (!event.target.closest(".nav-item.has-dropdown")) {
        $$(".nav-item.open").forEach((openItem) => {
          openItem.classList.remove("open");
          openItem.querySelector(".nav-link")?.setAttribute("aria-expanded", "false");
        });
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      $$(".nav-item.open").forEach((openItem) => {
        openItem.classList.remove("open");
        openItem.querySelector(".nav-link")?.setAttribute("aria-expanded", "false");
      });
      closeAllMobileDrawers();
    });
  }

  function initHeaderClock() {
    const clock = $("#header-clock");
    if (!clock) return;
    const tick = () => {
      const now = new Date();
      clock.textContent = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    };
    tick();
    setInterval(tick, 30000);
  }

  function initTabs() {
    document.addEventListener("click", (event) => {
      const tab = event.target.closest(".wc-tab[data-tab-target]");
      if (!tab) return;
      const tabs = tab.closest(".wc-tabs");
      const panelRoot = tabs?.parentElement;
      const target = tab.getAttribute("data-tab-target");
      if (!tabs || !panelRoot || !target) return;

      $$(".wc-tab", tabs).forEach((item) => {
        item.classList.remove("active");
        item.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");

      $$("[data-tab-panel]", panelRoot).forEach((panel) => {
        panel.hidden = panel.id !== target;
      });
    });
  }

  function initMarkets() {
    $$(".wc-market-head").forEach((head) => {
      head.addEventListener("click", () => {
        const market = head.closest(".wc-market");
        const body = $(".wc-market-body", market);
        const open = !market.classList.contains("open");
        market.classList.toggle("open", open);
        head.setAttribute("aria-expanded", open ? "true" : "false");
        if (body) body.hidden = !open;
      });
    });

    $$(".wc-mkt-collapse").forEach((btn) => {
      btn.addEventListener("click", () => {
        $$(".wc-market").forEach((market) => {
          market.classList.remove("open");
          const head = $(".wc-market-head", market);
          const body = $(".wc-market-body", market);
          if (head) head.setAttribute("aria-expanded", "false");
          if (body) body.hidden = true;
        });
      });
    });
  }

  function initOdds() {
    document.addEventListener("click", (event) => {
      const odd = event.target.closest("[data-odd]");
      if (!odd) return;
      event.preventDefault();
      const data = parseOdd(odd);
      if (data) toggleOdd(data);
    });
  }

  function initBetSlip() {
    $$(".bet-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        $$(".bet-tab").forEach((item) => {
          item.classList.remove("active");
          item.setAttribute("aria-selected", "false");
        });
        tab.classList.add("active");
        tab.setAttribute("aria-selected", "true");
        const which = tab.getAttribute("data-bet-tab");
        const slip = $("#bet-slip-body");
        const myBets = $("#my-bets-body");
        if (slip) slip.hidden = which !== "slip";
        if (myBets) myBets.hidden = which !== "mybets";
      });
    });

    $("#bet-list")?.addEventListener("click", (event) => {
      const remove = event.target.closest("[data-remove]");
      if (!remove) return;
      state.betSlip = state.betSlip.filter((bet) => bet.id !== remove.getAttribute("data-remove"));
      renderBetSlip();
      showToast("Selection removed");
    });

    $("#clear-bets")?.addEventListener("click", () => {
      state.betSlip = [];
      renderBetSlip();
      showToast("Bet slip cleared");
    });

    $("#place-bet")?.addEventListener("click", () => {
      showToast("Demo only - bet not placed");
    });

    $("#stake-input")?.addEventListener("input", updateTotals);

    $("#generate-slip")?.addEventListener("click", () => {
      demoPool.forEach((item) => {
        if (!state.betSlip.some((bet) => bet.id === item.id)) state.betSlip.push(item);
      });
      renderBetSlip();
      showToast("Generated selections added");
    });

    $(".bet-save-link")?.addEventListener("click", () => {
      showToast("Demo only - save/load unavailable");
    });
  }

  function initRegistration() {
    $$(".reg-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        $$(".reg-tab").forEach((item) => {
          item.classList.remove("active");
          item.setAttribute("aria-selected", "false");
        });
        tab.classList.add("active");
        tab.setAttribute("aria-selected", "true");
        const panel = tab.getAttribute("data-reg");
        $$(".reg-fields").forEach((fields) => {
          fields.hidden = fields.getAttribute("data-panel") !== panel;
        });
      });
    });

    $("#reg-form")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const demo = $("#reg-demo");
      if (demo) demo.hidden = false;
      showToast("Demo only - no account created");
    });
  }

  function initSidebars() {
    $("#sidebar-collapse")?.addEventListener("click", () => {
      if (isMobileViewport()) {
        closeAllMobileDrawers();
        return;
      }
      $("#left-sidebar")?.classList.toggle("collapsed");
    });

    $("#right-collapse")?.addEventListener("click", () => {
      if (isMobileViewport()) {
        closeAllMobileDrawers();
        return;
      }
      $("#right-sidebar")?.classList.toggle("collapsed");
    });

    $$(".wc-filter").forEach((filter) => {
      filter.addEventListener("click", () => {
        $$(".wc-filter").forEach((item) => item.classList.remove("active"));
        filter.classList.add("active");
        showToast(`Filter: ${filter.textContent.trim()}`);
      });
    });
  }

  function initRightBlock() {
    $("#app-close")?.addEventListener("click", () => {
      const panel = $("#app-panel");
      if (panel) panel.hidden = true;
    });

    $$(".app-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        $$(".app-tab").forEach((item) => item.classList.remove("active"));
        tab.classList.add("active");
        const platform = tab.getAttribute("data-app");
        const icon = $("#app-download .app-dl-icon");
        if (icon) {
          icon.src = platform === "ios" ? "assets/icons/rb-apple.svg" : "assets/icons/rb-android.svg";
        }
        showToast(platform === "ios" ? "iOS app" : "Android app");
      });
    });
  }

  function isMobileViewport() {
    return window.matchMedia("(max-width: 900px)").matches;
  }

  function setDrawerBackdrop(visible) {
    const backdrop = $("#drawer-backdrop");
    if (!backdrop) return;
    backdrop.hidden = !visible;
    backdrop.classList.toggle("is-visible", visible);
    document.body.classList.toggle("drawer-open", visible);
  }

  function closeAllMobileDrawers() {
    $("#left-sidebar")?.classList.remove("open");
    $("#right-sidebar")?.classList.remove("is-open");
    $("#header-bottom")?.classList.remove("is-open");
    $("#mobile-menu-btn")?.setAttribute("aria-expanded", "false");
    $("#mobile-menu-tab")?.setAttribute("aria-expanded", "false");
    $("#mobile-sports-btn")?.setAttribute("aria-expanded", "false");
    $("#mobile-betslip-btn")?.setAttribute("aria-expanded", "false");
    setDrawerBackdrop(false);
  }

  function openLeftDrawer() {
    if (!isMobileViewport()) return;
    closeAllMobileDrawers();
    $("#left-sidebar")?.classList.add("open");
    $("#mobile-sports-btn")?.setAttribute("aria-expanded", "true");
    setDrawerBackdrop(true);
  }

  function openRightDrawer() {
    if (!isMobileViewport()) return;
    closeAllMobileDrawers();
    $("#right-sidebar")?.classList.add("is-open");
    $("#mobile-betslip-btn")?.setAttribute("aria-expanded", "true");
    setDrawerBackdrop(true);
  }

  function toggleMobileNav() {
    if (!isMobileViewport()) return;
    const nav = $("#header-bottom");
    const shouldOpen = !nav?.classList.contains("is-open");
    closeAllMobileDrawers();
    if (shouldOpen && nav) {
      nav.classList.add("is-open");
      $("#mobile-menu-btn")?.setAttribute("aria-expanded", "true");
      $("#mobile-menu-tab")?.setAttribute("aria-expanded", "true");
      setDrawerBackdrop(true);
    }
  }

  function initMobileChrome() {
    $("#mobile-menu-btn")?.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleMobileNav();
    });
    $("#mobile-menu-tab")?.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleMobileNav();
    });
    $("#mobile-sports-btn")?.addEventListener("click", (event) => {
      event.stopPropagation();
      if ($("#left-sidebar")?.classList.contains("open")) closeAllMobileDrawers();
      else openLeftDrawer();
    });
    $("#mobile-betslip-btn")?.addEventListener("click", (event) => {
      event.stopPropagation();
      if ($("#right-sidebar")?.classList.contains("is-open")) closeAllMobileDrawers();
      else openRightDrawer();
    });
    $("#drawer-backdrop")?.addEventListener("click", closeAllMobileDrawers);
    $("#right-drawer-close")?.addEventListener("click", closeAllMobileDrawers);
    $("#left-drawer-close")?.addEventListener("click", closeAllMobileDrawers);

    window.addEventListener("resize", () => {
      if (!isMobileViewport()) closeAllMobileDrawers();
    });

    $$('a[href="#reg-form"]').forEach((link) => {
      link.addEventListener("click", () => {
        if (isMobileViewport()) openRightDrawer();
      });
    });
  }

  function initDemoLinks() {
    $$(".btn-login, .icon-btn, .footer-mobile-btn, .footer-app-link").forEach((item) => {
      item.addEventListener("click", (event) => {
        if (item.tagName === "A" && item.getAttribute("href") && item.getAttribute("href") !== "#") return;
        event.preventDefault();
        showToast("Demo only");
      });
    });
  }

  function init() {
    renderBetSlip();
    initHeaderDropdowns();
    initHeaderClock();
    initTabs();
    initMarkets();
    initOdds();
    initBetSlip();
    initRegistration();
    initSidebars();
    initRightBlock();
    initMobileChrome();
    initDemoLinks();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
