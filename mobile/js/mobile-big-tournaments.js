/**
 * Mobile Bet on Big Tournaments — accordion + market select (demo)
 */
(function () {
  "use strict";

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function $$(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function formatOdd(value) {
    var n = Number(value);
    if (!Number.isFinite(n) || n <= 0) return "—";
    var s = n.toFixed(n >= 10 ? 2 : 3).replace(/\.?0+$/, "");
    return s || String(n);
  }

  function applyMarket(league) {
    var select = $(".mh-bt-market__select", league);
    if (!select) return;
    var key = select.value || "place13";
    $$(".mh-bt-row", league).forEach(function (row) {
      var yesBtn = $('.mh-bt-odd[data-side="yes"]', row);
      var noBtn = $('.mh-bt-odd[data-side="no"]', row);
      var yesVal = row.getAttribute("data-" + key + "-yes");
      var noVal = row.getAttribute("data-" + key + "-no");

      function fill(btn, raw) {
        if (!btn) return;
        var valEl = $(".mh-bt-odd__val", btn);
        btn.removeAttribute("data-mh-odd-id");
        btn.classList.remove("is-selected", "selected");
        if (raw == null || raw === "" || raw === "-") {
          btn.classList.add("is-empty");
          btn.disabled = true;
          btn.removeAttribute("data-odd");
          if (valEl) valEl.textContent = "—";
          return;
        }
        btn.classList.remove("is-empty");
        btn.disabled = false;
        btn.setAttribute("data-odd", String(raw));
        if (valEl) valEl.textContent = formatOdd(raw);
      }

      fill(yesBtn, yesVal);
      fill(noBtn, noVal);
    });
  }

  function initSportToggle() {
    $$(".mh-bt-sport__head").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var sport = btn.closest(".mh-bt-sport");
        if (!sport) return;
        var open = sport.classList.contains("is-collapsed");
        sport.classList.toggle("is-collapsed", !open);
        btn.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });
  }

  function initLeagueAccordions() {
    $$(".mh-bt-league__head").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var league = btn.closest(".mh-bt-league");
        if (!league) return;
        var open = league.classList.contains("is-collapsed");
        league.classList.toggle("is-collapsed", !open);
        btn.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });
  }

  function initMarkets() {
    $$(".mh-bt-league").forEach(function (league) {
      applyMarket(league);
      var select = $(".mh-bt-market__select", league);
      if (!select) return;
      select.addEventListener("change", function () {
        applyMarket(league);
      });
    });
  }

  function init() {
    if (!document.body.classList.contains("mh-page--big-tournaments")) return;
    initSportToggle();
    initLeagueAccordions();
    initMarkets();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
