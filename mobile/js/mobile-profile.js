(() => {
  "use strict";

  function initTabs() {
    const tabs = Array.from(document.querySelectorAll("[data-pf-tab]"));
    const panels = Array.from(document.querySelectorAll("[data-pf-panel]"));
    if (!tabs.length) return;

    const activate = (id) => {
      tabs.forEach((tab) => {
        const on = tab.getAttribute("data-pf-tab") === id;
        tab.classList.toggle("is-active", on);
        tab.setAttribute("aria-selected", on ? "true" : "false");
      });
      panels.forEach((panel) => {
        panel.hidden = panel.getAttribute("data-pf-panel") !== id;
      });
    };

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => activate(tab.getAttribute("data-pf-tab")));
    });
  }

  function initCopy() {
    const btn = document.querySelector("[data-pf-copy]");
    const acct = document.querySelector("[data-pf-account]");
    if (!btn || !acct) return;

    btn.addEventListener("click", async () => {
      const value = acct.textContent.replace(/Account No\.\s*/i, "").trim();
      try {
        await navigator.clipboard.writeText(value);
      } catch (_) {
        /* ignore */
      }
      const toast = document.getElementById("mh-toast");
      if (toast) {
        toast.hidden = false;
        toast.textContent = "Account number copied";
        window.setTimeout(() => {
          toast.hidden = true;
        }, 1600);
      }
    });
  }

  function initProfileBalanceDisplay() {
    let mainBal = parseFloat(sessionStorage.getItem("1xbet_main_bal")) || 100.00;
    let gameBal = parseFloat(sessionStorage.getItem("1xbet_game_bal")) || 0.00;

    const totalEl = document.querySelector("[data-pf-total-balance]");
    const mainEl = document.querySelector("[data-pf-main-balance]");
    const gameEl = document.querySelector("[data-pf-game-balance]");
    const refreshBtn = document.querySelector("[data-pf-refresh-balance]");

    function renderBalances() {
      const total = mainBal + gameBal;
      if (totalEl) totalEl.textContent = `${total.toFixed(2)} MYR`;
      if (mainEl) mainEl.textContent = `${mainBal.toFixed(2)} MYR`;
      if (gameEl) gameEl.textContent = `${gameBal.toFixed(2)} MYR`;

      sessionStorage.setItem("1xbet_main_bal", mainBal.toString());
      sessionStorage.setItem("1xbet_game_bal", gameBal.toString());
    }

    if (refreshBtn) {
      refreshBtn.addEventListener("click", () => {
        refreshBtn.classList.add("is-spinning");
        window.setTimeout(() => {
          mainBal = parseFloat(sessionStorage.getItem("1xbet_main_bal")) || 100.00;
          gameBal = parseFloat(sessionStorage.getItem("1xbet_game_bal")) || 0.00;
          renderBalances();
          refreshBtn.classList.remove("is-spinning");
          showToast("Balances updated");
        }, 400);
      });
    }

    function showToast(msg) {
      const toast = document.getElementById("mh-toast");
      if (toast) {
        toast.hidden = false;
        toast.textContent = msg;
        window.setTimeout(() => {
          toast.hidden = true;
        }, 1600);
      }
    }

    renderBalances();
  }

  function init() {
    if (!document.body.classList.contains("mh-page--profile")) return;

    try {
      if (localStorage.getItem("mh-logged-in-v1") !== "1") {
        window.location.replace("login.html");
        return;
      }
    } catch (_) {
      /* continue for file:// quirks */
    }

    initTabs();
    initCopy();
    initProfileBalanceDisplay();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
