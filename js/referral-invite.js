/* referral-invite.js — Multi-LIVE Referral (standalone; not account Extra shell) */
(function () {
  "use strict";

  var AUTH_KEY = "1xbet_logged_in";

  /* Deep-link for Figma / demos: ?auth=1 (must run before DOMContentLoaded) */
  try {
    if (new URLSearchParams(window.location.search).get("auth") === "1") {
      sessionStorage.setItem(AUTH_KEY, "1");
    }
  } catch (e) { /* ignore */ }

  function isLoggedInSession() {
    try {
      return sessionStorage.getItem(AUTH_KEY) === "1";
    } catch (e) {
      return false;
    }
  }

  function activate(key) {
    var loggedIn = isLoggedInSession();
    var tabs = Array.prototype.slice.call(document.querySelectorAll("[data-ri-tab]"));
    var panels = Array.prototype.slice.call(document.querySelectorAll("[data-ri-panel]"));

    tabs.forEach(function (tab) {
      var on = tab.getAttribute("data-ri-tab") === key;
      tab.classList.toggle("active", on);
      tab.setAttribute("aria-selected", on ? "true" : "false");
      tab.tabIndex = on ? 0 : -1;
    });

    panels.forEach(function (panel) {
      var matchKey = panel.getAttribute("data-ri-panel") === key;
      var isGuest = panel.classList.contains("ri-guest-only");
      var isLogged = panel.classList.contains("ri-logged-only");
      if (!matchKey) {
        panel.hidden = true;
        return;
      }
      if (isGuest) {
        panel.hidden = loggedIn;
      } else if (isLogged) {
        panel.hidden = !loggedIn;
      } else {
        panel.hidden = false;
      }
    });
  }

  function applyAuthPanels() {
    var loggedIn = isLoggedInSession();
    document.body.classList.toggle("is-logged-in", loggedIn);

    document.querySelectorAll(".ri-guest-only").forEach(function (el) {
      if (!el.getAttribute("data-ri-panel") && !el.getAttribute("data-rbi-panel")) {
        el.hidden = loggedIn;
      }
    });
    document.querySelectorAll(".ri-logged-only").forEach(function (el) {
      if (!el.getAttribute("data-ri-panel") && !el.getAttribute("data-rbi-panel")) {
        el.hidden = !loggedIn;
      }
    });

    var accountBoard = document.getElementById("ri-panel-account");
    if (accountBoard) {
      accountBoard.hidden = !loggedIn;
    }

    var filters = document.querySelector("[data-ri-tabs]");
    if (filters) {
      filters.hidden = loggedIn;
    }

    if (loggedIn) {
      document.querySelectorAll("[data-ri-panel]").forEach(function (panel) {
        panel.hidden = true;
      });
      return;
    }

    var activeTab = document.querySelector("[data-ri-tab].active, [data-rbi-tab].active");
    if (activeTab) {
      activate(activeTab.getAttribute("data-ri-tab") || activeTab.getAttribute("data-rbi-tab"));
    }
  }

  function copyText(text) {
    if (!text) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(function () {});
    }
    if (typeof window.showToast === "function") {
      window.showToast("Copied successfully");
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    applyAuthPanels();

    document.addEventListener("click", function (e) {
      var copyBtn = e.target.closest("[data-ri-copy-target]");
      if (!copyBtn) return;
      var id = copyBtn.getAttribute("data-ri-copy-target");
      var el = id ? document.getElementById(id) : null;
      if (el) copyText(el.textContent.trim());
    });

    var tablist = document.querySelector("[data-ri-tabs]");
    if (!tablist) return;

    var tabs = Array.prototype.slice.call(tablist.querySelectorAll("[data-ri-tab]"));
    var hash = (location.hash || "").replace(/^#/, "");
    if (hash === "rewards") activate("how");

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        activate(tab.getAttribute("data-ri-tab"));
      });

      tab.addEventListener("keydown", function (e) {
        var i = tabs.indexOf(tab);
        var next = -1;
        if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
        if (e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
        if (next < 0) return;
        e.preventDefault();
        tabs[next].focus();
        activate(tabs[next].getAttribute("data-ri-tab"));
      });
    });
  });
})();
