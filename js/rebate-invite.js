/* rebate-invite.js — Unclaim / Rebate Benefit tabs (same pattern as referral-invite.js) */
(function () {
  "use strict";

  var AUTH_KEY = "1xbet_logged_in";

  function isLoggedInSession() {
    try {
      return sessionStorage.getItem(AUTH_KEY) === "1";
    } catch (e) {
      return false;
    }
  }

  if (isLoggedInSession()) {
    location.replace("rebate.html");
    return;
  }

  function activate(key) {
    var tabs = Array.prototype.slice.call(document.querySelectorAll("[data-rbi-tab]"));
    var panels = Array.prototype.slice.call(document.querySelectorAll("[data-rbi-panel]"));

    tabs.forEach(function (tab) {
      var on = tab.getAttribute("data-rbi-tab") === key;
      tab.classList.toggle("active", on);
      tab.setAttribute("aria-selected", on ? "true" : "false");
      tab.tabIndex = on ? 0 : -1;
    });

    panels.forEach(function (panel) {
      panel.hidden = panel.getAttribute("data-rbi-panel") !== key;
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (isLoggedInSession()) {
      location.replace("rebate.html");
      return;
    }

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
