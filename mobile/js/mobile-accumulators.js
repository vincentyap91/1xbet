/* Accumulators of the day — Sports / Live tab panels */
(function () {
  "use strict";

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function $$(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function setTab(key) {
    $$("[data-mh-acc-tab]").forEach(function (btn) {
      var on = btn.getAttribute("data-mh-acc-tab") === key;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-selected", on ? "true" : "false");
    });
    $$("[data-mh-acc-panel]").forEach(function (panel) {
      var on = panel.getAttribute("data-mh-acc-panel") === key;
      panel.hidden = !on;
    });
  }

  function initTabs() {
    var params = new URLSearchParams(window.location.search);
    var initial = params.get("tab") === "live" ? "live" : "sports";
    setTab(initial);

    $$("[data-mh-acc-tab]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setTab(btn.getAttribute("data-mh-acc-tab") || "sports");
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTabs);
  } else {
    initTabs();
  }
})();
