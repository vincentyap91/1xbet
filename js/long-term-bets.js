/* =========================================================
   long-term-bets.js — Long-term bets page interactions
   Demo only: sport filters, odds → bet slip, header chrome.
   ========================================================= */

(function () {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const state = {
    betSlip: [],
    sport: "football",
  };

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

    if (!state.betSlip.length) {
      if (empty) empty.hidden = false;
      if (list) {
        list.hidden = true;
        list.innerHTML = "";
      }
      if (footer) footer.hidden = true;
      if (regCta) regCta.hidden = false;
      updateTotals();
      syncOddButtons();
      syncMobileBetCount();
      return;
    }

    if (empty) empty.hidden = true;
    if (list) {
      list.hidden = false;
      list.innerHTML = state.betSlip
        .map(
          (item) => `
        <div class="bet-item" data-id="${item.id}">
          <button type="button" class="bet-remove" aria-label="Remove">×</button>
          <div class="bet-item-league">${item.league}</div>
          <div class="bet-item-match">${item.match}</div>
          <div class="bet-item-market">${item.market}</div>
          <div class="bet-item-sel">
            <span>${item.selection}</span>
            <span class="odds">${formatOdd(item.odds)}</span>
          </div>
        </div>`
        )
        .join("");
    }
    if (footer) footer.hidden = false;
    if (regCta) regCta.hidden = true;
    updateTotals();
    syncOddButtons();
    syncMobileBetCount();
  }

  function toggleOdd(data) {
    if (!data?.id) return;
    const idx = state.betSlip.findIndex((item) => item.id === data.id);
    if (idx >= 0) state.betSlip.splice(idx, 1);
    else state.betSlip.push(data);
    renderBetSlip();
  }

  function setSport(sport) {
    state.sport = sport;
    $$(".lt-sport-item").forEach((el) => {
      el.classList.toggle("active", el.dataset.sport === sport);
    });
    $$(".lt-chip[data-filter]").forEach((el) => {
      const on = el.dataset.filter === sport;
      el.classList.toggle("active", on);
      el.setAttribute("aria-selected", on ? "true" : "false");
    });
    $$(".lt-block").forEach((block) => {
      const match = block.dataset.sport === sport;
      block.hidden = !match;
    });
    let empty = $("#lt-empty");
    const hasVisible = $$(".lt-block").some((b) => !b.hidden);
    if (!empty) {
      empty = document.createElement("p");
      empty.id = "lt-empty";
      empty.className = "lt-empty";
      empty.textContent = "No long-term markets in this sport (demo sample).";
      $("#lt-feed")?.appendChild(empty);
    }
    empty.hidden = hasVisible;
  }

  function bindOdds() {
    document.addEventListener("click", (e) => {
      const odd = e.target.closest("[data-odd]");
      if (odd && !odd.classList.contains("is-empty")) {
        const data = parseOdd(odd);
        if (data) toggleOdd(data);
        return;
      }

      const remove = e.target.closest(".bet-remove");
      if (remove) {
        const id = remove.closest(".bet-item")?.dataset?.id;
        state.betSlip = state.betSlip.filter((item) => item.id !== id);
        renderBetSlip();
        return;
      }

      const sportBtn = e.target.closest(".lt-sport-item[data-sport]");
      if (sportBtn) {
        setSport(sportBtn.dataset.sport);
        return;
      }

      const chip = e.target.closest(".lt-chip[data-filter]");
      if (chip) {
        setSport(chip.dataset.filter);
        return;
      }

      const fav = e.target.closest(".lt-icon-btn.fav");
      if (fav) {
        fav.classList.toggle("active");
        showToast(fav.classList.contains("active") ? "Added to favorites" : "Removed from favorites");
        return;
      }

      const more = e.target.closest(".lt-more");
      if (more) {
        showToast("More markets — demo only");
      }
    });
  }

  function bindBetSlipChrome() {
    $("#clear-bets")?.addEventListener("click", () => {
      state.betSlip = [];
      renderBetSlip();
      showToast("Bet slip cleared");
    });

    $("#place-bet")?.addEventListener("click", () => {
      if (!state.betSlip.length) return;
      showToast("Demo only — bet not placed");
    });

    $("#stake-input")?.addEventListener("input", updateTotals);

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

    $("#lt-time-filter")?.addEventListener("click", () => {
      showToast("Time filter — demo only");
    });
  }

  function bindSharedChrome() {
    // Prefer homepage script helpers when present; otherwise light local fallbacks
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
  }

  document.addEventListener("DOMContentLoaded", () => {
    bindOdds();
    bindBetSlipChrome();
    bindSharedChrome();
    setSport("football");
    renderBetSlip();
  });
})();
