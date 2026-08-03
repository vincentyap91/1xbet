/**
 * Shared desktop→mobile bet slip (homepage bottom-sheet UX).
 * Injects partials/mobile-bet-slip.html when #right-sidebar is missing.
 */
(function () {
  "use strict";

  const SCRIPT_EL =
    document.currentScript ||
    document.querySelector('script[src*="shared-bet-slip.js"]');

  let injectPromise = null;
  let chromeWired = false;

  function rootBase() {
    if (SCRIPT_EL && SCRIPT_EL.src) {
      try {
        return new URL("../", SCRIPT_EL.src).href;
      } catch (_) { /* fall through */ }
    }
    try {
      return new URL(".", window.location.href).href;
    } catch (_) {
      return "";
    }
  }

  function isMobileSite() {
    return /\/mobile(\/|$)/i.test(window.location.pathname || "");
  }

  function isMobileViewport() {
    return window.matchMedia("(max-width: 900px)").matches;
  }

  function ensureDrawerBackdrop() {
    let backdrop = document.getElementById("drawer-backdrop");
    if (backdrop) return backdrop;
    backdrop = document.createElement("div");
    backdrop.className = "drawer-backdrop";
    backdrop.id = "drawer-backdrop";
    backdrop.hidden = true;
    document.body.appendChild(backdrop);
    return backdrop;
  }

  function setBackdrop(visible) {
    const backdrop = ensureDrawerBackdrop();
    backdrop.hidden = !visible;
    backdrop.classList.toggle("is-visible", visible);
    document.body.classList.toggle("drawer-open", visible);
  }

  function closeSlip() {
    document.getElementById("right-sidebar")?.classList.remove("is-open");
    document.getElementById("mobile-betslip-btn")?.setAttribute("aria-expanded", "false");
    setBackdrop(false);
    if (typeof window.syncMobileBetCount === "function") window.syncMobileBetCount();
  }

  function openSlip(right) {
    if (!isMobileViewport()) return;
    const el = right || document.getElementById("right-sidebar");
    if (!el) return;
    el.classList.remove("collapsed");
    document.querySelector(".sportsbook-layout")?.classList.remove("right-collapsed");
    el.classList.add("is-open");
    document.getElementById("mobile-betslip-btn")?.setAttribute("aria-expanded", "true");
    setBackdrop(true);
    if (typeof window.syncMobileBetCount === "function") window.syncMobileBetCount();
  }

  function wireBetTabs(root) {
    if (!root || root.dataset.sharedTabsWired === "1") return;
    root.dataset.sharedTabsWired = "1";
    const tabs = root.querySelectorAll("[data-bet-tab]");
    const slipBody = root.querySelector("#bet-slip-body");
    const myBody = root.querySelector("#my-bets-body");
    if (!tabs.length || !slipBody) return;

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const which = tab.getAttribute("data-bet-tab");
        tabs.forEach((t) => {
          const on = t === tab;
          t.classList.toggle("active", on);
          t.setAttribute("aria-selected", on ? "true" : "false");
        });
        slipBody.hidden = which !== "slip";
        if (myBody) myBody.hidden = which !== "mybets";
      });
    });
  }

  function wireChrome() {
    if (chromeWired) return;
    chromeWired = true;

    document.addEventListener("click", (e) => {
      const closeBtn = e.target.closest("#right-drawer-close");
      if (closeBtn) {
        e.preventDefault();
        closeSlip();
        return;
      }
      if (e.target.closest("#drawer-backdrop")) {
        closeSlip();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (document.getElementById("right-sidebar")?.classList.contains("is-open")) {
        closeSlip();
      }
    });
  }

  function ensureRightSidebar() {
    if (isMobileSite()) return Promise.resolve(null);

    const existing = document.getElementById("right-sidebar");
    if (existing) {
      wireChrome();
      wireBetTabs(existing);
      return Promise.resolve(existing);
    }

    if (injectPromise) return injectPromise;

    ensureDrawerBackdrop();
    const url = `${rootBase()}partials/mobile-bet-slip.html`;

    injectPromise = fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`shared bet slip HTTP ${res.status}`);
        return res.text();
      })
      .then((html) => {
        if (document.getElementById("right-sidebar")) {
          return document.getElementById("right-sidebar");
        }
        const wrap = document.createElement("div");
        wrap.innerHTML = html.trim();
        const aside = wrap.querySelector("#right-sidebar") || wrap.firstElementChild;
        if (!aside) throw new Error("shared bet slip root missing");
        document.body.appendChild(aside);
        wireChrome();
        wireBetTabs(aside);
        return aside;
      })
      .catch((err) => {
        console.warn("[SharedBetSlip] Failed to load shared bet slip:", err);
        injectPromise = null;
        return null;
      });

    return injectPromise;
  }

  function toggle() {
    if (!isMobileViewport() || isMobileSite()) return Promise.resolve(null);
    return ensureRightSidebar().then((right) => {
      if (!right) return null;
      if (right.classList.contains("is-open")) {
        closeSlip();
      } else {
        openSlip(right);
      }
      return right;
    });
  }

  window.SharedBetSlip = {
    ensure: ensureRightSidebar,
    open: () => ensureRightSidebar().then((r) => {
      openSlip(r);
      return r;
    }),
    close: closeSlip,
    toggle,
  };

  /* Prefetch on sports tabbar pages so first tap is instant */
  function prefetchIfNeeded() {
    if (isMobileSite()) return;
    if (document.getElementById("right-sidebar")) {
      wireChrome();
      return;
    }
    if (!document.querySelector(".mobile-tabbar")) return;
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        if (document.querySelector('.mobile-tabbar[data-sports-tabbar="1"], .mobile-tabbar')) {
          ensureRightSidebar();
        }
      });
    } else {
      ensureRightSidebar();
    }
  }

  prefetchIfNeeded();
})();
