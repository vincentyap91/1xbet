/* rebate-invite.js — Multi-LIVE Rebate (standalone; not account Extra shell) */
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
    var tabs = Array.prototype.slice.call(document.querySelectorAll("[data-rbi-tab]"));
    var panels = Array.prototype.slice.call(document.querySelectorAll("[data-rbi-panel]"));

    tabs.forEach(function (tab) {
      var on = tab.getAttribute("data-rbi-tab") === key;
      tab.classList.toggle("active", on);
      tab.setAttribute("aria-selected", on ? "true" : "false");
      tab.tabIndex = on ? 0 : -1;
    });

    panels.forEach(function (panel) {
      var matchKey = panel.getAttribute("data-rbi-panel") === key;
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

    var accountBoard = document.getElementById("rbi-panel-account");
    if (accountBoard) {
      accountBoard.hidden = !loggedIn;
    }

    var filters = document.querySelector("[data-rbi-tabs]");
    if (filters) {
      filters.hidden = loggedIn;
    }

    if (loggedIn) {
      document.querySelectorAll("[data-rbi-panel]").forEach(function (panel) {
        panel.hidden = true;
      });
      return;
    }

    activate("unclaim");
  }

  document.addEventListener("DOMContentLoaded", function () {
    applyAuthPanels();

    var tablist = document.querySelector("[data-rbi-tabs]");
    if (!tablist) return;

    var tabs = Array.prototype.slice.call(tablist.querySelectorAll("[data-rbi-tab]"));

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        activate(tab.getAttribute("data-rbi-tab"));
      });

      tab.addEventListener("keydown", function (e) {
        var i = tabs.indexOf(tab);
        var next = -1;
        if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
        if (e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
        if (next < 0) return;
        e.preventDefault();
        tabs[next].focus();
        activate(tabs[next].getAttribute("data-rbi-tab"));
      });
    });
  });
})();
