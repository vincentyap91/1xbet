/* referral-invite.js — Invite Friends / How It Works tabs (Multi-LIVE chips)
 * Logged-in users see the same content as referral.html (redirect).
 */
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

  /* Already signed in → account referral page (same invite / stats UI) */
  if (isLoggedInSession()) {
    location.replace("referral.html");
    return;
  }

  function activate(key) {
    var tabs = Array.prototype.slice.call(document.querySelectorAll("[data-ri-tab]"));
    var panels = Array.prototype.slice.call(document.querySelectorAll("[data-ri-panel]"));

    tabs.forEach(function (tab) {
      var on = tab.getAttribute("data-ri-tab") === key;
      tab.classList.toggle("active", on);
      tab.setAttribute("aria-selected", on ? "true" : "false");
      tab.tabIndex = on ? 0 : -1;
    });

    panels.forEach(function (panel) {
      panel.hidden = panel.getAttribute("data-ri-panel") !== key;
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (isLoggedInSession()) {
      location.replace("referral.html");
      return;
    }

    var tablist = document.querySelector("[data-ri-tabs]");
    if (!tablist) return;

    var tabs = Array.prototype.slice.call(tablist.querySelectorAll("[data-ri-tab]"));

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
