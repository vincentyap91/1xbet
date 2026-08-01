/* Bet Slip Generator — desktop modal + ≤900 sheet */
(function () {
  "use strict";

  var CURRENCY = "MYR";
  var overlay = null;

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function $$(sel, root) {
    return Array.from((root || document).querySelectorAll(sel));
  }

  function isMobileViewport() {
    return window.matchMedia("(max-width: 900px)").matches;
  }

  function clampNum(n, min, max) {
    var v = Number(n);
    if (!Number.isFinite(v)) v = min;
    return Math.max(min, Math.min(max, Math.round(v)));
  }

  function slipCountFromType(type) {
    if (type === "double") return 2;
    if (type === "treble") return 3;
    if (type === "fold4") return 4;
    if (type === "fold5") return 5;
    return 1;
  }

  function ensureEmptyCta() {
    var empty = $("#bet-empty");
    if (!empty) return;
    if (!empty.querySelector(".bet-empty-gen")) {
      var wrap = document.createElement("div");
      wrap.className = "bet-empty-gen";
      wrap.innerHTML =
        '<p class="bet-empty-gen__alt">Your bet slip is empty. Add an event to place a bet, or ' +
        '<button type="button" class="bet-empty-gen__link" data-bsg-open>generate a bet slip</button>.</p>';
      empty.appendChild(wrap);
    } else {
      var btn = empty.querySelector(".bet-empty-gen__btn");
      if (btn) btn.remove();
      var copy = empty.querySelector(".bet-empty-gen__text");
      if (copy) copy.remove();
    }
    var text = empty.querySelector(".bet-empty-text");
    if (text && !text.getAttribute("data-bsg-desktop-copy")) {
      text.setAttribute("data-bsg-desktop-copy", text.innerHTML);
    }
  }

  function buildModal() {
    if (overlay) return overlay;
    overlay = document.createElement("div");
    overlay.className = "bsg-backdrop";
    overlay.id = "bsg-overlay";
    overlay.hidden = true;
    overlay.innerHTML =
      '<div class="bsg-modal" role="dialog" aria-modal="true" aria-labelledby="bsg-title">' +
      '<header class="bsg-head">' +
      '<button type="button" class="bsg-back" data-bsg-close aria-label="Back"></button>' +
      '<h2 class="bsg-title" id="bsg-title">Bet slip generator</h2>' +
      '<button type="button" class="bsg-close" data-bsg-close aria-label="Close">&times;</button>' +
      "</header>" +
      '<div class="bsg-body">' +
      '<form class="bsg-form" id="bsg-form" novalidate>' +
      '<section class="bsg-card is-open" data-bsg-acc>' +
      '<button type="button" class="bsg-card__head" data-bsg-acc-toggle aria-expanded="true"><span>Bet</span></button>' +
      '<div class="bsg-card__body">' +
      '<label class="bsg-field"><span class="bsg-label">Stake amount (' +
      CURRENCY +
      ")</span>" +
      '<div class="bsg-stepper">' +
      '<button type="button" class="bsg-step" data-bsg-step="stake" data-dir="-1" aria-label="Decrease">−</button>' +
      '<input type="number" id="bsg-stake" name="stake" min="1" step="1" value="50" />' +
      '<button type="button" class="bsg-step" data-bsg-step="stake" data-dir="1" aria-label="Increase">+</button>' +
      "</div></label>" +
      '<label class="bsg-field"><span class="bsg-label bsg-label--desktop">Target winnings, ' +
      CURRENCY +
      "</span>" +
      '<span class="bsg-label bsg-label--mobile">Desired winnings</span>' +
      '<div class="bsg-stepper">' +
      '<button type="button" class="bsg-step" data-bsg-step="target" data-dir="-1" aria-label="Decrease">−</button>' +
      '<input type="number" id="bsg-target" name="target" min="1" step="1" value="100" />' +
      '<button type="button" class="bsg-step" data-bsg-step="target" data-dir="1" aria-label="Increase">+</button>' +
      "</div></label>" +
      "</div></section>" +
      '<section class="bsg-card is-open" data-bsg-acc>' +
      '<button type="button" class="bsg-card__head" data-bsg-acc-toggle aria-expanded="true"><span>Select time until event starts</span></button>' +
      '<div class="bsg-card__body">' +
      '<label class="bsg-field bsg-field--select">' +
      '<select id="bsg-time" name="time" class="bsg-select" aria-label="Select time until event starts">' +
      '<option value="live" selected>Live</option>' +
      '<option value="1h">1 hour</option>' +
      '<option value="2h">2 hours</option>' +
      '<option value="4h">4 hours</option>' +
      '<option value="6h">6 hours</option>' +
      '<option value="12h">12 hours</option>' +
      '<option value="24h">24 hours</option>' +
      '<option value="7d">7 days</option>' +
      "</select></label>" +
      '<div class="bsg-radios" role="radiogroup" aria-label="Select time until event starts">' +
      radio("time", "live", "Live", true) +
      radio("time", "1h", "1 hour") +
      radio("time", "2h", "2 hours") +
      radio("time", "4h", "4 hours") +
      radio("time", "6h", "6 hours") +
      radio("time", "12h", "12 hours") +
      radio("time", "24h", "24 hours") +
      radio("time", "7d", "7 days") +
      "</div></div></section>" +
      '<section class="bsg-card is-open" data-bsg-acc>' +
      '<button type="button" class="bsg-card__head" data-bsg-acc-toggle aria-expanded="true"><span>Type of bet slip</span></button>' +
      '<div class="bsg-card__body">' +
      '<label class="bsg-field bsg-field--select">' +
      '<select id="bsg-type" name="type" class="bsg-select" aria-label="Type of bet slip">' +
      '<option value="single" selected>Single bet</option>' +
      '<option value="double">Double</option>' +
      '<option value="treble">Treble</option>' +
      '<option value="fold4">4-fold accumulator</option>' +
      '<option value="fold5">5-fold accumulator</option>' +
      "</select></label>" +
      '<div class="bsg-radios" role="radiogroup" aria-label="Type of bet slip">' +
      radio("type", "single", "Single bet", true) +
      radio("type", "double", "Double") +
      radio("type", "treble", "Treble") +
      radio("type", "fold4", "4-fold accumulator") +
      radio("type", "fold5", "5-fold accumulator") +
      "</div></div></section>" +
      '<section class="bsg-card is-open" data-bsg-acc>' +
      '<button type="button" class="bsg-card__head" data-bsg-acc-toggle aria-expanded="true"><span>Sport</span></button>' +
      '<div class="bsg-card__body">' +
      '<label class="bsg-field bsg-field--select">' +
      '<select id="bsg-sport" name="sport" class="bsg-select" aria-label="Sport">' +
      '<option value="football" selected>Football</option>' +
      '<option value="basketball">Basketball</option>' +
      '<option value="tennis">Tennis</option>' +
      '<option value="hockey">Ice Hockey</option>' +
      '<option value="volleyball">Volleyball</option>' +
      "</select></label>" +
      '<input type="text" class="bsg-input bsg-sport-input" id="bsg-sport-input" placeholder="Sport" value="Football" autocomplete="off" />' +
      "</div></section>" +
      '<section class="bsg-card is-open" data-bsg-acc>' +
      '<button type="button" class="bsg-card__head" data-bsg-acc-toggle aria-expanded="true"><span>Type of outcome</span></button>' +
      '<div class="bsg-card__body">' +
      '<label class="bsg-check"><input type="checkbox" name="outcome" value="match" checked /> Bets on match/period outcome</label>' +
      '<label class="bsg-check"><input type="checkbox" name="outcome" value="totals" checked /> Totals</label>' +
      '<label class="bsg-check"><input type="checkbox" name="outcome" value="team-totals" /> Team/player totals</label>' +
      '<label class="bsg-check"><input type="checkbox" name="outcome" value="handicaps" checked /> Handicaps</label>' +
      "</div></section>" +
      '<div class="bsg-form-actions">' +
      '<button type="button" class="bsg-btn bsg-btn--cancel" data-bsg-close>Cancel</button>' +
      '<button type="submit" class="bsg-btn bsg-btn--create" id="bsg-create">Create</button>' +
      "</div>" +
      "</form>" +
      '<aside class="bsg-result" aria-live="polite">' +
      '<div class="bsg-result__empty" id="bsg-result-empty">' +
      '<div class="bsg-result__art" aria-hidden="true">' +
      '<img src="assets/images/rb-generator-art.png" alt="" width="120" height="120" />' +
      "</div>" +
      "<strong>No bet slips</strong>" +
      "<p>Use the form on the left to generate new bet slips</p>" +
      "</div>" +
      '<div class="bsg-result__list" id="bsg-result-list" hidden></div>' +
      "</aside>" +
      "</div></div>";
    document.body.appendChild(overlay);
    bindOverlay();
    return overlay;
  }

  function radio(name, value, label, checked) {
    return (
      '<label class="bsg-radio">' +
      '<input type="radio" name="bsg-' +
      name +
      '" value="' +
      value +
      '"' +
      (checked ? " checked" : "") +
      " /> " +
      label +
      "</label>"
    );
  }

  function readForm() {
    var stake = clampNum($("#bsg-stake", overlay)?.value, 1, 100000);
    var target = clampNum($("#bsg-target", overlay)?.value, 1, 1000000);
    var time =
      (isMobileViewport()
        ? $('input[name="bsg-time"]:checked', overlay)?.value
        : $("#bsg-time", overlay)?.value) || "live";
    var type =
      (isMobileViewport()
        ? $('input[name="bsg-type"]:checked', overlay)?.value
        : $("#bsg-type", overlay)?.value) || "single";
    var sportSel = $("#bsg-sport", overlay)?.value || "football";
    var sportInput = ($("#bsg-sport-input", overlay)?.value || "").trim();
    var outcomes = $$('input[name="outcome"]:checked', overlay).map(function (el) {
      return el.value;
    });
    return {
      stake: stake,
      target: target,
      time: time,
      type: type,
      count: slipCountFromType(type),
      sport: sportSel,
      sportLabel: sportInput || sportSel,
      outcomes: outcomes,
      currency: CURRENCY,
    };
  }

  function syncRadiosFromSelect(selectId, radioName) {
    var sel = $(selectId, overlay);
    if (!sel) return;
    var val = sel.value;
    $$('input[name="' + radioName + '"]', overlay).forEach(function (r) {
      r.checked = r.value === val;
    });
  }

  function syncSelectFromRadio(radioName, selectId) {
    var checked = $('input[name="' + radioName + '"]:checked', overlay);
    var sel = $(selectId, overlay);
    if (checked && sel) sel.value = checked.value;
  }

  function bindOverlay() {
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close();
      var closeBtn = e.target.closest("[data-bsg-close]");
      if (closeBtn) {
        e.preventDefault();
        close();
        return;
      }
      var step = e.target.closest("[data-bsg-step]");
      if (step) {
        e.preventDefault();
        var key = step.getAttribute("data-bsg-step");
        var dir = Number(step.getAttribute("data-dir")) || 0;
        var input = key === "target" ? $("#bsg-target", overlay) : $("#bsg-stake", overlay);
        if (!input) return;
        var stepAmt = key === "target" ? 10 : 5;
        input.value = String(clampNum(Number(input.value) + dir * stepAmt, 1, 1000000));
        return;
      }
      var tog = e.target.closest("[data-bsg-acc-toggle]");
      if (tog) {
        e.preventDefault();
        var card = tog.closest("[data-bsg-acc]");
        if (!card) return;
        var open = card.classList.toggle("is-open");
        tog.setAttribute("aria-expanded", open ? "true" : "false");
      }
    });

    $("#bsg-form", overlay)?.addEventListener("submit", function (e) {
      e.preventDefault();
      submitCreate();
    });

    $("#bsg-time", overlay)?.addEventListener("change", function () {
      syncRadiosFromSelect("#bsg-time", "bsg-time");
    });
    $("#bsg-type", overlay)?.addEventListener("change", function () {
      syncRadiosFromSelect("#bsg-type", "bsg-type");
    });
    overlay.addEventListener("change", function (e) {
      if (e.target.matches('input[name="bsg-time"]')) syncSelectFromRadio("bsg-time", "#bsg-time");
      if (e.target.matches('input[name="bsg-type"]')) syncSelectFromRadio("bsg-type", "#bsg-type");
    });
    $("#bsg-sport", overlay)?.addEventListener("change", function () {
      var input = $("#bsg-sport-input", overlay);
      var sel = $("#bsg-sport", overlay);
      if (input && sel) input.value = sel.options[sel.selectedIndex].text;
    });
  }

  function demoPicks(count) {
    var pool = [
      { id: "bsg-demo-1", league: "Italy. Serie A", match: "Lazio vs Avellino 1912", market: "1X2", selection: "W1", odds: 1.29 },
      { id: "bsg-demo-2", league: "England. Premier League", match: "Arsenal vs Chelsea", market: "Total", selection: "Over 2.5", odds: 1.85 },
      { id: "bsg-demo-3", league: "Spain. La Liga", match: "Barcelona vs Sevilla", market: "Double Chance", selection: "1X", odds: 1.22 },
      { id: "bsg-demo-4", league: "Germany. Bundesliga", match: "Bayern vs Dortmund", market: "Handicap", selection: "1 (-1.5)", odds: 1.95 },
      { id: "bsg-demo-5", league: "France. Ligue 1", match: "PSG vs Lyon", market: "Both Teams To Score", selection: "Yes", odds: 1.72 },
    ];
    return pool.slice(0, Math.max(1, Math.min(count, pool.length))).map(function (p, i) {
      return Object.assign({}, p, { id: p.id + "-" + Date.now() + "-" + i });
    });
  }

  function submitCreate() {
    var opts = readForm();
    var picks = demoPicks(opts.count);
    var detail = { opts: opts, picks: picks, handled: false };
    window.dispatchEvent(new CustomEvent("ds:bsg-create", { detail: detail }));
    if (!detail.handled && typeof window.DsBetSlipGeneratorOnCreate === "function") {
      try {
        window.DsBetSlipGeneratorOnCreate(detail);
      } catch (err) {
        /* ignore */
      }
    }
    if (!detail.handled) {
      showResultPreview(picks);
      if (typeof window.showToast === "function") {
        window.showToast("Bet slip generated — add selections from the right");
      }
    } else {
      close();
      if (typeof window.showToast === "function") {
        window.showToast("Generated selections added");
      }
    }
  }

  function showResultPreview(picks) {
    var empty = $("#bsg-result-empty", overlay);
    var list = $("#bsg-result-list", overlay);
    if (!list) return;
    if (empty) empty.hidden = true;
    list.hidden = false;
    list.innerHTML =
      '<ul class="bsg-preview">' +
      picks
        .map(function (p) {
          return (
            "<li><span>" +
            escapeHtml(p.match) +
            " · " +
            escapeHtml(p.selection) +
            '</span><strong>' +
            escapeHtml(String(p.odds)) +
            "</strong></li>"
          );
        })
        .join("") +
      "</ul>" +
      '<button type="button" class="bsg-btn bsg-btn--create bsg-btn--add" id="bsg-add-slip">Add to bet slip</button>';
    $("#bsg-add-slip", list)?.addEventListener("click", function () {
      var detail = { opts: readForm(), picks: picks, handled: false };
      window.dispatchEvent(new CustomEvent("ds:bsg-create", { detail: detail }));
      if (!detail.handled && typeof window.DsBetSlipGeneratorOnCreate === "function") {
        window.DsBetSlipGeneratorOnCreate(detail);
      }
      close();
      if (typeof window.showToast === "function") window.showToast("Generated selections added");
    });
  }

  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
  }

  function open() {
    buildModal();
    ensureEmptyCta();
    overlay.hidden = false;
    document.body.classList.add("bsg-open");
    overlay.classList.toggle("is-mobile", isMobileViewport());
    var empty = $("#bsg-result-empty", overlay);
    var list = $("#bsg-result-list", overlay);
    if (empty) empty.hidden = false;
    if (list) {
      list.hidden = true;
      list.innerHTML = "";
    }
    overlay.querySelector(".bsg-close, .bsg-back")?.focus();
  }

  function close() {
    if (!overlay) return;
    overlay.hidden = true;
    document.body.classList.remove("bsg-open");
  }

  function isOpen() {
    return !!(overlay && !overlay.hidden);
  }

  function onDocClick(e) {
    var btn = e.target.closest("#generate-slip, .btn-generate, [data-bsg-open]");
    if (!btn) return;
    if (btn.closest("#bsg-overlay")) return;
    e.preventDefault();
    e.stopPropagation();
    open();
  }

  function init() {
    ensureEmptyCta();
    document.addEventListener("click", onDocClick, true);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isOpen()) {
        e.preventDefault();
        close();
      }
    });
    window.addEventListener("resize", function () {
      if (overlay && !overlay.hidden) overlay.classList.toggle("is-mobile", isMobileViewport());
    });
  }

  window.DsBetSlipGenerator = {
    open: open,
    close: close,
    ensureEmptyCta: ensureEmptyCta,
    isOpen: isOpen,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
