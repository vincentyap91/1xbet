/**
 * Mobile Results — tabs, accordion, sport filter, search
 */
(function () {
  "use strict";

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function $$(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function initTabs() {
    var tabs = $$("[data-mh-rs-tab]");
    var panels = $$("[data-mh-rs-panel]");
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var id = tab.getAttribute("data-mh-rs-tab");
        tabs.forEach(function (t) {
          var on = t === tab;
          t.classList.toggle("is-active", on);
          t.setAttribute("aria-selected", on ? "true" : "false");
        });
        panels.forEach(function (p) {
          var show = p.getAttribute("data-mh-rs-panel") === id;
          p.hidden = !show;
        });
      });
    });
  }

  function initAccordions() {
    $$(".mh-rs-block__head").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var block = btn.closest(".mh-rs-block");
        if (!block) return;
        var open = block.classList.contains("is-collapsed");
        block.classList.toggle("is-collapsed", !open);
        btn.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });

    $$(".mh-rs-league__head").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var league = btn.closest(".mh-rs-league");
        if (!league) return;
        var open = league.classList.contains("is-collapsed");
        league.classList.toggle("is-collapsed", !open);
        btn.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });
  }

  function initSportFilter() {
    var chips = $$("[data-mh-rs-sport]");
    var blocks = $$(".mh-rs-block[data-sport]");
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        var sport = chip.getAttribute("data-mh-rs-sport");
        chips.forEach(function (c) {
          c.classList.toggle("is-active", c === chip);
        });
        blocks.forEach(function (b) {
          if (sport === "all") {
            b.hidden = false;
            return;
          }
          b.hidden = b.getAttribute("data-sport") !== sport;
        });
        var empty = $("#mh-rs-empty");
        if (empty) {
          var visible = blocks.some(function (b) {
            return !b.hidden;
          });
          empty.hidden = visible;
        }
      });
    });
  }

  function initHours() {
    var btn = $("#mh-rs-hours");
    if (!btn) return;
    btn.addEventListener("click", function () {
      btn.classList.toggle("is-active");
      btn.setAttribute("aria-pressed", btn.classList.contains("is-active") ? "true" : "false");
    });
  }

  function initSearch() {
    var toggle = $("#mh-rs-search-toggle");
    var box = $("#mh-rs-search");
    var input = $("#mh-rs-search-input");
    if (!toggle || !box || !input) return;

    toggle.addEventListener("click", function () {
      var open = !box.classList.contains("is-open");
      box.classList.toggle("is-open", open);
      if (open) input.focus();
    });

    input.addEventListener("input", function () {
      var q = (input.value || "").trim().toLowerCase();
      $$(".mh-rs-match").forEach(function (m) {
        var hay = (m.getAttribute("data-search") || m.textContent || "").toLowerCase();
        m.hidden = q !== "" && hay.indexOf(q) === -1;
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initTabs();
    initAccordions();
    initSportFilter();
    initHours();
    initSearch();
  });
})();
