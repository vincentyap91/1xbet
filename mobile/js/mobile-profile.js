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
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
