/* Shared Accumulator Of The Day / Live Accumulator — homepage + event details */
(function (global) {
  "use strict";

  var HOME_DATA = {
    1: [
      {
        id: "a1",
        match: "Utah Jazz vs Washington Wizards",
        selection: "Wizards",
        odds: 1.72,
        league: "NBA Summer League",
        market: "Winner",
        when: "02/08 03:00 am",
      },
      {
        id: "a2",
        match: "Indiana Fever vs Phoenix Mercury",
        selection: "Fever",
        odds: 1.85,
        league: "WNBA",
        market: "Winner",
        when: "02/08 05:30 am",
      },
      {
        id: "a3",
        match: "Spain vs Belgium",
        selection: "Spain",
        odds: 2.15,
        league: "World Cup 2026",
        market: "1X2",
        flags: ["ES", "BE"],
        sportIcon: "assets/icons/lnt/acc-football.svg",
        when: "02/08 07:00 am",
      },
    ],
    2: [
      {
        id: "a6",
        match: "Arizona Diamondbacks vs Padres",
        selection: "Padres",
        odds: 1.75,
        league: "MLB",
        market: "Winner",
        when: "Live",
      },
      {
        id: "a7",
        match: "Las Vegas Aces vs Portland Fire",
        selection: "Aces",
        odds: 1.55,
        league: "WNBA",
        market: "Winner",
        when: "Live",
      },
      {
        id: "a8",
        match: "Washington Freedom vs LAKR",
        selection: "LAKR",
        odds: 1.22,
        league: "USA Major League",
        market: "Winner",
        when: "Live",
      },
    ],
  };

  var TITLES = {
    1: "Accumulator Of The Day",
    2: "Live Accumulator Of The Day",
  };

  var BONUS = {
    1: "Bonus from 1xBet · 1.1",
    2: "Bonus from 1xBet · 1.08",
  };

  function formatOdd(n) {
    var v = Number(n);
    if (!Number.isFinite(v)) return String(n);
    return String(Math.round(v * 1000) / 1000);
  }

  function productOdds(items) {
    return (items || []).reduce(function (p, a) {
      return p * (Number(a.odds) || 1);
    }, 1);
  }

  function getData(which) {
    if (which && typeof which === "object") return which;
    return HOME_DATA;
  }

  function sectionMarkup() {
    return (
      '<section class="accumulators" aria-label="Accumulators of the day" data-sb-accumulators>' +
      '<article class="acc-block" data-acc="1x2">' +
      '<header class="acc-header">' +
      '<h3 class="acc-title">' +
      TITLES[1] +
      "</h3>" +
      '<span class="acc-bonus">' +
      BONUS[1] +
      "</span></header>" +
      '<div class="acc-table">' +
      '<ul class="acc-list" id="acc-list-1"></ul>' +
      '<div class="acc-footer">' +
      '<div class="acc-odds"><span>Overall odds</span><strong id="acc-odds-1">—</strong></div>' +
      '<button type="button" class="btn-acc" data-acc-add="1">ADD TO BET SLIP</button>' +
      "</div></div></article>" +
      '<article class="acc-block" data-acc="live">' +
      '<header class="acc-header">' +
      '<h3 class="acc-title">' +
      TITLES[2] +
      "</h3>" +
      '<span class="acc-bonus">' +
      BONUS[2] +
      "</span></header>" +
      '<div class="acc-table">' +
      '<ul class="acc-list" id="acc-list-2"></ul>' +
      '<div class="acc-footer">' +
      '<div class="acc-odds"><span>Overall odds</span><strong id="acc-odds-2">—</strong></div>' +
      '<button type="button" class="btn-acc" data-acc-add="2">ADD TO BET SLIP</button>' +
      "</div></div></article></section>"
    );
  }

  function ensureMounted(host) {
    var root = host || document.getElementById("main-content");
    if (!root) return null;
    var existing = root.querySelector("[data-sb-accumulators], .accumulators");
    if (existing) return existing;
    root.insertAdjacentHTML("beforeend", sectionMarkup());
    return root.querySelector("[data-sb-accumulators]");
  }

  function render(options) {
    var opts = options || {};
    var data = getData(opts.data);
    var flagMap = opts.flagIconMap || {};
    if (opts.mount) ensureMounted(opts.mount === true ? null : opts.mount);

    [1, 2].forEach(function (n) {
      var list = document.getElementById("acc-list-" + n);
      if (!list) return;
      var items = data[n] || [];
      list.innerHTML = items
        .map(function (a) {
          var icons = "";
          if (a.flags && a.flags.length) {
            icons = a.flags
              .map(function (code) {
                var src = flagMap[code];
                return src
                  ? '<img class="acc-flag-img" src="' + src + '" alt="" width="16" height="16" />'
                  : '<span class="acc-flag" aria-hidden="true"></span>';
              })
              .join("");
          } else if (a.avatars && a.avatars.length) {
            icons = a.avatars
              .map(function (src) {
                return '<img class="acc-avatar" src="' + src + '" alt="" width="16" height="16" />';
              })
              .join("");
          } else {
            icons = '<span class="acc-flag" aria-hidden="true"></span>';
          }
          var sport = a.sportIcon
            ? '<img class="acc-sport-icon" src="' + a.sportIcon + '" alt="" width="12" height="12" />'
            : "";
          var when = a.when ? '<span class="acc-when">' + a.when + "</span>" : "";
          return (
            '<li class="acc-item">' +
            '<span class="acc-icons">' +
            icons +
            "</span>" +
            '<span class="acc-body">' +
            when +
            '<span class="acc-match">' +
            a.match +
            "</span>" +
            '<span class="acc-league">' +
            sport +
            (a.league || "") +
            "</span></span>" +
            '<span class="acc-sel">' +
            a.selection +
            "</span>" +
            '<span class="acc-odd">' +
            formatOdd(a.odds) +
            "</span></li>"
          );
        })
        .join("");
      var oddsEl = document.getElementById("acc-odds-" + n);
      if (oddsEl) oddsEl.textContent = formatOdd(productOdds(items));
    });
  }

  global.SbAccumulators = {
    HOME_DATA: HOME_DATA,
    TITLES: TITLES,
    BONUS: BONUS,
    formatOdd: formatOdd,
    productOdds: productOdds,
    sectionMarkup: sectionMarkup,
    ensureMounted: ensureMounted,
    render: render,
    getData: getData,
  };
})(window);
