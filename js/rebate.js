/* rebate.js — Our Rebate System tabs */
(function () {
  "use strict";

  function activate(key) {
    Array.prototype.forEach.call(document.querySelectorAll("[data-rb-tab]"), function (tab) {
      var on = tab.getAttribute("data-rb-tab") === key;
      tab.classList.toggle("is-active", on);
      tab.setAttribute("aria-selected", on ? "true" : "false");
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-rb-panel]"), function (panel) {
      panel.hidden = panel.getAttribute("data-rb-panel") !== key;
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!document.querySelector(".rb-content")) return;

    Array.prototype.forEach.call(document.querySelectorAll("[data-rb-tab]"), function (tab) {
      tab.addEventListener("click", function () {
        activate(tab.getAttribute("data-rb-tab"));
      });
    });

    activate("unclaim");
  });
})();
