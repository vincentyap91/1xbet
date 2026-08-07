/* Event page — desktop match details + markets (screenshot parity) */
(function () {
  "use strict";

  var PENDING_KEY = "ds-event-pending";
  /* Live 1xBet Statistics iframe — original statisticpopup path/behavior */
  var STATS_IFRAME_ORIGIN = "https://1xlite-493593.pro";
  var STATS_IFRAME_PATH =
    "/en/statisticpopup/game/football/742250812/main?ln=en&hn=1&mh=720";
  var STATS_IFRAME_SRC = STATS_IFRAME_PATH;
  var STATS_HEIGHT_MSG = "iframeProxy.BodyHeightChanged";
  var STATS_MIN_HEIGHT = 720;

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function $$(sel, root) {
    return Array.from((root || document).querySelectorAll(sel));
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
  }

  function statsPanel() {
    return $("#ev-stats");
  }

  function statsIframe() {
    return $("#ev-stats-iframe");
  }

  function ensureStatsIframe() {
    var iframe = statsIframe();
    if (!iframe) return null;
    if (!iframe.getAttribute("src")) {
      iframe.setAttribute("data-original-src", STATS_IFRAME_ORIGIN + STATS_IFRAME_PATH);
      iframe.setAttribute("src", STATS_IFRAME_SRC);
    }
    return iframe;
  }

  function setStatsHeight(px) {
    var iframe = statsIframe();
    if (!iframe) return;
    var h = Math.max(STATS_MIN_HEIGHT, Math.round(Number(px) || 0));
    iframe.style.height = h + "px";
  }

  function setEventView(view) {
    var isStats = view === "stats";
    document.body.classList.toggle("is-ev-stats", isStats);
    var panel = statsPanel();
    if (panel) panel.hidden = !isStats;
    if (isStats) ensureStatsIframe();

    $$(".ev-mboard__tool[data-ev-view]").forEach(function (btn) {
      var on = btn.getAttribute("data-ev-view") === view;
      btn.classList.toggle("is-active", on);
      if (on) btn.setAttribute("aria-current", "true");
      else btn.removeAttribute("aria-current");
    });
  }

  function readPending() {
    try {
      var raw = sessionStorage.getItem(PENDING_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function demoEvent(id) {
    return {
      id: id || "lazio-avellino",
      home: "Lazio",
      away: "Avellino 1912",
      league: "Club Friendlies. Top",
      sport: "football",
      sportIcon: "assets/icons/te-football.svg",
      homeLogo: "assets/images/mobile-home/teams/team-01.webp",
      awayLogo: "assets/images/mobile-home/teams/team-02.webp",
      live: true,
      scoreH: 4,
      scoreA: 1,
      clock: "50:08",
      period: "2nd half",
      venue: "Centro sportivo Lazio (Formello)",
      weather: { temp: "+32°C", wind: "2", pressure: "759", humidity: "39" },
      cornersH: 3,
      cornersA: 1,
      yellowH: 0,
      yellowA: 0,
      redH: 0,
      redA: 0,
      subH: 0,
      subA: 0,
      htScores: "3:1 1:0",
      periods: [
        { label: "1ST HALF", home: 3, away: 1, live: false },
        { label: "2ND HALF", home: 1, away: 0, live: true },
      ],
      stats: [
        { label: "Attacks", home: 42, away: 18, homePct: 70, awayPct: 30 },
        { label: "Dangerous attacks", home: 24, away: 8, homePct: 75, awayPct: 25 },
        { label: "Ball possession %", home: 58, away: 42, homePct: 58, awayPct: 42 },
        { label: "Shots on target", home: 7, away: 2, homePct: 78, awayPct: 22 },
        { label: "Shots off target", home: 5, away: 3, homePct: 62, awayPct: 38 },
        { label: "Yellow cards", home: 0, away: 0, homePct: 0, awayPct: 0 },
      ],
      tabs: ["Regular time", "2nd half", "Corners", "Quick events", "Results"],
    };
  }

  function buildMarkets(ev) {
    var match = ev.home + " - " + ev.away;
    var league = ev.league;
    function odd(suffix, market, selection, odds, label, opts) {
      var o = opts || {};
      return {
        id: ev.id + "-" + suffix,
        eventId: ev.id,
        market: market,
        selection: selection,
        odds: odds,
        label: label || selection,
        match: match,
        league: league,
        locked: !!o.locked,
        hot: !!o.hot,
        move: o.move || null,
      };
    }
    return [
      {
        title: "1X2",
        key: "1x2",
        popular: true,
        goals: true,
        cols: 3,
        rows: [
          odd("w1", "1X2", "W1", 1.29, "W1"),
          odd("x", "1X2", "X", 5.32, "X"),
          odd("w2", "1X2", "W2", 9.4, "W2"),
        ],
      },
      {
        title: "Double Chance",
        key: "dc",
        popular: true,
        goals: true,
        cols: 3,
        rows: [
          odd("1x", "Double Chance", "1X", 1.08, "1X"),
          odd("12", "Double Chance", "12", 1.12, "12"),
          odd("2x", "Double Chance", "2X", 3.4, "2X"),
        ],
      },
      {
        title: "Both Teams To Score",
        key: "btts",
        popular: true,
        goals: true,
        cols: 2,
        rows: [
          odd("btts-y", "Both Teams To Score", "Yes", 2.15, "Yes"),
          odd("btts-n", "Both Teams To Score", "No", 1.65, "No"),
        ],
      },
      {
        title: "1X2 + Each Team To Score",
        key: "1x2-ets",
        popular: true,
        goals: true,
        cols: 3,
        rows: [
          odd("ets1y", "1X2 + ETS", "W1 & Yes", 4.2, "W1 & Yes"),
          odd("etsxy", "1X2 + ETS", "X & Yes", 5.5, "X & Yes"),
          odd("ets2y", "1X2 + ETS", "W2 & Yes", 6.8, "W2 & Yes"),
          odd("ets1n", "1X2 + ETS", "W1 & No", 2.1, "W1 & No"),
          odd("etsxn", "1X2 + ETS", "X & No", 8.5, "X & No"),
          odd("ets2n", "1X2 + ETS", "W2 & No", 12.0, "W2 & No"),
        ],
      },
      {
        title: "Double Chance + Both Teams To Score",
        key: "dc-btts",
        popular: true,
        goals: true,
        cols: 3,
        rows: [
          odd("dcby1", "DC + BTTS", "1X & Yes", 2.45, "1X & Yes"),
          odd("dcby2", "DC + BTTS", "12 & Yes", 2.55, "12 & Yes"),
          odd("dcby3", "DC + BTTS", "2X & Yes", 3.1, "2X & Yes"),
          odd("dcbn1", "DC + BTTS", "1X & No", 1.85, "1X & No"),
          odd("dcbn2", "DC + BTTS", "12 & No", 1.95, "12 & No"),
          odd("dcbn3", "DC + BTTS", "2X & No", 4.2, "2X & No"),
        ],
      },
      {
        title: "Total",
        key: "total",
        popular: true,
        cols: 2,
        rows: [
          odd("to25", "Total", "Over 2.5", 1.29, "Over 2.5"),
          odd("tu25", "Total", "Under 2.5", 3.4, "Under 2.5"),
          odd("to35", "Total", "Over 3.5", 1.72, "Over 3.5"),
          odd("tu35", "Total", "Under 3.5", 2.05, "Under 3.5"),
          odd("to45", "Total", "Over 4.5", 2.55, "Over 4.5"),
          odd("tu45", "Total", "Under 4.5", 1.48, "Under 4.5"),
          odd("to5", "Total", "Over 5", 2.17, "Over 5", { hot: true }),
          odd("tu5", "Total", "Under 5", 1.64, "Under 5", { hot: true }),
          odd("to55", "Total", "Over 5.5", 4.2, "Over 5.5"),
          odd("tu55", "Total", "Under 5.5", 1.2, "Under 5.5"),
        ],
      },
      {
        title: "Asian Total",
        key: "asian-total",
        popular: true,
        cols: 2,
        rows: [
          odd("ato275", "Asian Total", "Over 2.75", 1.45, "Over 2.75"),
          odd("atu275", "Asian Total", "Under 2.75", 2.65, "Under 2.75"),
          odd("ato325", "Asian Total", "Over 3.25", 1.85, "Over 3.25"),
          odd("atu325", "Asian Total", "Under 3.25", 1.95, "Under 3.25"),
          odd("ato375", "Asian Total", "Over 3.75", 2.25, "Over 3.75"),
          odd("atu375", "Asian Total", "Under 3.75", 1.62, "Under 3.75"),
        ],
      },
      {
        title: "Handicap",
        key: "handicap",
        popular: true,
        cols: 2,
        rows: [
          odd("h1m15", "Handicap", "1 (-1.5)", 1.72, "1 (-1.5)"),
          odd("h2p15", "Handicap", "2 (+1.5)", 2.05, "2 (+1.5)"),
          odd("h1m25", "Handicap", "1 (-2.5)", 2.35, "1 (-2.5)"),
          odd("h2p25", "Handicap", "2 (+2.5)", 1.55, "2 (+2.5)"),
          odd("h1m35", "Handicap", "1 (-3.5)", 8.83, "1 (-3.5)", { move: "up" }),
          odd("h2p35", "Handicap", "2 (+3.5)", 1.048, "2 (+3.5)", { move: "down" }),
        ],
      },
      {
        title: "Asian Handicap",
        key: "asian-hcap",
        popular: true,
        cols: 2,
        rows: [
          odd("ah1", "Asian Handicap", "1 (-0.5)", 1.36, "1 (-0.5)"),
          odd("ah2", "Asian Handicap", "2 (+0.5)", 3.05, "2 (+0.5)"),
          odd("ah1b", "Asian Handicap", "1 (-1.5)", 1.95, "1 (-1.5)"),
          odd("ah2b", "Asian Handicap", "2 (+1.5)", 1.85, "2 (+1.5)"),
        ],
      },
      {
        title: "Total 1",
        key: "total1",
        popular: true,
        intervals: true,
        cols: 2,
        rows: [
          odd("t1o", "Total 1", "Over 1.5", 1.55, "Over 1.5"),
          odd("t1u", "Total 1", "Under 1.5", 2.35, "Under 1.5"),
          odd("t1o2", "Total 1", "Over 2.5", 2.8, "Over 2.5"),
          odd("t1u2", "Total 1", "Under 2.5", 1.4, "Under 2.5"),
        ],
      },
      {
        title: "Asian Team Total 1",
        key: "att1",
        popular: true,
        intervals: true,
        cols: 2,
        rows: [
          odd("att1o", "Asian Team Total 1", "Over 1.25", 1.72, "Over 1.25"),
          odd("att1u", "Asian Team Total 1", "Under 1.25", 2.05, "Under 1.25"),
        ],
      },
      {
        title: "Correct Score",
        key: "correct",
        goals: true,
        cols: 2,
        rows: [
          odd("cs10", "Correct Score", "1:0", 6.8, "1:0"),
          odd("cs20", "Correct Score", "2:0", 8.5, "2:0"),
          odd("cs21", "Correct Score", "2:1", 7.2, "2:1"),
          odd("cs11", "Correct Score", "1:1", 9.5, "1:1"),
        ],
      },
    ];
  }

  function normalizePending(raw) {
    if (!raw || typeof raw !== "object") return null;
    var out = Object.assign({}, raw);
    if (out.scoreH == null && out.homeScore != null) out.scoreH = out.homeScore;
    if (out.scoreA == null && out.awayScore != null) out.scoreA = out.awayScore;
    if (!out.clock && out.time) out.clock = out.time;
    if (out.live == null && out.scope === "live") out.live = true;
    return out;
  }

  function mergePending(base, pending) {
    if (!pending) return base;
    Object.keys(pending).forEach(function (k) {
      var v = pending[k];
      if (v === undefined || v === null || v === "") return;
      base[k] = v;
    });
    return base;
  }

  function resolveEvent() {
    var params = new URLSearchParams(window.location.search);
    var id = params.get("id") || "";
    var pending = normalizePending(readPending());
    var base = demoEvent((pending && pending.id) || id || "lazio-avellino");
    if (pending && id && (pending.id === id || !pending.id)) {
      return mergePending(base, pending);
    }
    return base;
  }

  function oddCellHtml(row) {
    var payload = JSON.stringify({
      id: row.id,
      eventId: row.eventId,
      league: row.league,
      match: row.match,
      market: row.market,
      selection: row.selection,
      odds: row.odds,
    }).replace(/"/g, "&quot;");
    var cls = "ev-odd";
    if (row.locked) cls += " is-locked";
    if (row.hot) cls += " is-hot";
    var moveHtml = "";
    if (row.move === "up") {
      cls += " is-up";
      moveHtml = '<span class="ev-odd__move ev-odd__move--up" aria-hidden="true"></span>';
    } else if (row.move === "down") {
      cls += " is-down";
      moveHtml = '<span class="ev-odd__move ev-odd__move--down" aria-hidden="true"></span>';
    }
    var tag = row.locked ? "span" : "button";
    var typeAttr = row.locked ? "" : ' type="button"';
    var oddAttr = row.locked ? "" : ' data-odd="' + payload + '"';
    return (
      "<" +
      tag +
      ' class="' +
      cls +
      '"' +
      typeAttr +
      oddAttr +
      (row.locked ? ' aria-disabled="true"' : "") +
      ">" +
      moveHtml +
      '<span class="ev-odd__lab">' +
      (row.locked
        ? '<img class="ev-odd-lock" src="assets/icons/lnt/icon-lock.svg" alt="" width="11" height="12" />'
        : "") +
      esc(row.label) +
      '</span><span class="ev-odd__val">' +
      esc(String(row.odds)) +
      "</span></" +
      tag +
      ">"
    );
  }

  function statHtml(s) {
    return (
      '<div class="ev-stat">' +
      '<span class="ev-stat__val ev-stat__val--home">' +
      esc(s.home) +
      "</span>" +
      '<div class="ev-stat__mid">' +
      '<span class="ev-stat__label">' +
      esc(s.label) +
      "</span>" +
      '<div class="ev-stat__bars" aria-hidden="true">' +
      '<div class="ev-stat__bar ev-stat__bar--home"><span style="width:' +
      esc(s.homePct) +
      '%"></span></div>' +
      '<div class="ev-stat__bar ev-stat__bar--away"><span style="width:' +
      esc(s.awayPct) +
      '%"></span></div>' +
      "</div></div>" +
      '<span class="ev-stat__val ev-stat__val--away">' +
      esc(s.away) +
      "</span></div>"
    );
  }

  function periodBoxHtml(ev) {
    var periods = ev.periods || [];
    if (!periods.length) return "";
    var p = periods[0];
    var homeLogo = ev.homeLogo || "";
    var awayLogo = ev.awayLogo || "";
    return (
      '<div class="ev-period-box">' +
      '<div class="ev-period-box__label">' +
      esc(p.label) +
      "</div>" +
      '<div class="ev-period-box__rows">' +
      '<div class="ev-period-box__row">' +
      '<img src="' +
      esc(homeLogo) +
      '" alt="" />' +
      '<span class="ev-period-box__score ev-period-box__score--home">' +
      esc(p.home) +
      "</span></div>" +
      '<div class="ev-period-box__row">' +
      '<img src="' +
      esc(awayLogo) +
      '" alt="" />' +
      '<span class="ev-period-box__score ev-period-box__score--away">' +
      esc(p.away) +
      "</span></div></div></div>"
    );
  }

  function cornerHtml(side, value) {
    if (value == null) {
      return '<span class="ev-corners ev-corners--empty" aria-hidden="true"></span>';
    }
    return (
      '<div class="ev-corners ev-corners--' +
      side +
      '" title="Corners">' +
      '<span class="ev-corners__flag" aria-hidden="true"></span>' +
      "<span>" +
      esc(value) +
      "</span></div>"
    );
  }

  function weatherHtml(ev) {
    var w = ev.weather || {};
    if (!w.temp && !ev.venue) return "";
    return (
      '<div class="ev-board__meta-right">' +
      (w.temp
        ? '<span class="ev-weather"><img src="mobile/assets/icons/ei-cloud.svg" alt="" /><span>' +
          esc(w.temp) +
          "</span></span>"
        : "") +
      (w.wind != null
        ? '<span class="ev-weather"><img src="mobile/assets/icons/ei-wind.svg" alt="" /><span>' +
          esc(w.wind) +
          "</span></span>"
        : "") +
      (w.pressure != null
        ? '<span class="ev-weather"><img src="mobile/assets/icons/ei-pressure.svg" alt="" /><span>' +
          esc(w.pressure) +
          "</span></span>"
        : "") +
      (w.humidity != null
        ? '<span class="ev-weather"><img src="mobile/assets/icons/ei-drop.svg" alt="" /><span>' +
          esc(w.humidity) +
          "</span></span>"
        : "") +
      (ev.venue
        ? '<button type="button" class="ev-venue-btn" data-toast="Venue details coming soon">' +
          '<img class="ev-venue-btn__ico" src="mobile/assets/icons/ei-zone.svg" alt="" />' +
          "<span>" +
          esc(ev.venue) +
          '</span><img src="assets/icons/te-chevron-down.svg" alt="" /></button>'
        : "") +
      "</div>"
    );
  }

  function miniStat(kind, value) {
    return (
      '<span class="ev-mboard__mini-item"><span class="ev-mboard__ico ev-mboard__ico--' +
      kind +
      '" aria-hidden="true"></span>' +
      esc(value) +
      "</span>"
    );
  }

  function mobileBoardHtml(ev, scoreH, scoreA) {
    var status =
      (ev.period || "Live") + (ev.clock ? ", " + ev.clock : "");
    return (
      '<div class="ev-mboard">' +
      '<div class="ev-mboard__tools" role="toolbar" aria-label="Event views">' +
      '<button type="button" class="ev-mboard__tool" data-toast="Favourites" aria-label="Favourite">' +
      '<img src="mobile/assets/icons/ei-star.svg" alt="" /></button>' +
      '<button type="button" class="ev-mboard__tool is-active" data-ev-view="scoreboard" aria-current="true" aria-label="Scoreboard">' +
      '<img src="assets/icons/te-trophy.svg" alt="" /></button>' +
      '<button type="button" class="ev-mboard__tool" data-toast="Pitch view" aria-label="Pitch">' +
      '<img src="assets/icons/te-football.svg" alt="" /></button>' +
      '<button type="button" class="ev-mboard__tool" data-toast="Live stream" aria-label="Stream">' +
      '<img src="assets/icons/lnt/icon-stream.svg" alt="" /></button>' +
      '<button type="button" class="ev-mboard__tool" data-ev-view="stats" aria-label="Statistics">' +
      '<img src="mobile/assets/icons/ei-stats.svg" alt="" /></button>' +
      '<button type="button" class="ev-mboard__tool ev-mboard__tool--more" data-event-info="' +
      esc(ev.id) +
      '" aria-label="Event info" aria-haspopup="dialog">' +
      '<img src="assets/icons/icon-more.svg" alt="" /></button>' +
      "</div>" +
      '<p class="ev-mboard__status">' +
      esc(status) +
      "</p>" +
      '<div class="ev-mboard__scoreline">' +
      '<div class="ev-mboard__team">' +
      esc(ev.home) +
      "</div>" +
      '<p class="ev-mboard__score"><span class="ev-mboard__score-h">' +
      esc(scoreH) +
      '</span><span class="ev-mboard__score-sep">:</span><span class="ev-mboard__score-a">' +
      esc(scoreA) +
      "</span></p>" +
      '<div class="ev-mboard__team ev-mboard__team--away">' +
      esc(ev.away) +
      "</div></div>" +
      '<div class="ev-mboard__strip">' +
      '<div class="ev-mboard__mini">' +
      miniStat("corner", ev.cornersH != null ? ev.cornersH : 0) +
      miniStat("ycard", ev.yellowH != null ? ev.yellowH : 0) +
      miniStat("rcard", ev.redH != null ? ev.redH : 0) +
      miniStat("sub", ev.subH != null ? ev.subH : 0) +
      "</div>" +
      '<span class="ev-mboard__ht">' +
      esc(ev.htScores || "") +
      "</span>" +
      '<div class="ev-mboard__mini ev-mboard__mini--away">' +
      miniStat("sub", ev.subA != null ? ev.subA : 0) +
      miniStat("rcard", ev.redA != null ? ev.redA : 0) +
      miniStat("ycard", ev.yellowA != null ? ev.yellowA : 0) +
      miniStat("corner", ev.cornersA != null ? ev.cornersA : 0) +
      "</div></div>" +
      '<button type="button" class="ev-mboard__league" data-toast="Tournament filter">' +
      "<span>" +
      esc(ev.league || "") +
      '</span><img src="assets/icons/te-chevron-down.svg" alt="" /></button></div>'
    );
  }

  function renderBoard(ev) {
    var board = $("#ev-board");
    if (!board) return;
    var scoreH = ev.scoreH != null ? ev.scoreH : "—";
    var scoreA = ev.scoreA != null ? ev.scoreA : "—";
    var homeLogo = ev.homeLogo || "assets/images/mobile-home/teams/team-01.webp";
    var awayLogo = ev.awayLogo || "assets/images/mobile-home/teams/team-02.webp";
    var stats = ev.stats || demoEvent().stats;
    var periodLabel = ev.period || "Live";
    var cornersH = ev.cornersH != null ? ev.cornersH : ev.corners;
    var cornersA = ev.cornersA != null ? ev.cornersA : null;

    board.innerHTML =
      '<div class="ev-board__grid">' +
      '<div class="ev-board__panel" data-ev-panel-mode="standings">' +
      '<div class="ev-board__panel-head">' +
      '<div class="ev-board__panel-tabs">' +
      '<button type="button" class="ev-board__panel-tab is-active" data-ev-panel="standings">Standings</button>' +
      '<button type="button" class="ev-board__panel-tab" data-ev-panel="visual">Visual stats</button>' +
      "</div>" +
      '<div class="ev-board__panel-logos">' +
      '<img src="' +
      esc(homeLogo) +
      '" alt="" />' +
      '<img src="' +
      esc(awayLogo) +
      '" alt="" /></div></div>' +
      '<div class="ev-board__stats" data-ev-stats>' +
      stats.map(statHtml).join("") +
      "</div></div>" +
      '<div class="ev-board__match">' +
      '<div class="ev-board__match-top">' +
      weatherHtml(ev) +
      "</div>" +
      '<div class="ev-board__status">' +
      "<span>" +
      esc(periodLabel) +
      '</span><img src="assets/icons/icon-clock.svg" alt="" />' +
      (ev.clock ? "<span>" + esc(ev.clock) + "</span>" : "") +
      "</div>" +
      '<div class="ev-board__scoreline">' +
      '<div class="ev-board__team">' +
      '<span class="ev-board__name">' +
      esc(ev.home) +
      '</span><img class="ev-board__crest" src="' +
      esc(homeLogo) +
      '" alt="" /></div>' +
      '<p class="ev-board__score"><span class="ev-board__score-h">' +
      esc(scoreH) +
      '</span><span class="ev-board__score-sep">:</span><span class="ev-board__score-a">' +
      esc(scoreA) +
      "</span></p>" +
      '<div class="ev-board__team ev-board__team--away">' +
      '<img class="ev-board__crest" src="' +
      esc(awayLogo) +
      '" alt="" /><span class="ev-board__name">' +
      esc(ev.away) +
      "</span></div></div>" +
      '<button type="button" class="ev-goals-btn" data-toast="Goals coming soon">' +
      'Goals <img src="assets/icons/te-chevron-down.svg" alt="" /></button>' +
      '<div class="ev-board__mid">' +
      cornerHtml("home", cornersH) +
      periodBoxHtml(ev) +
      cornerHtml("away", cornersA) +
      "</div>" +
      '<nav class="ev-board__nav" aria-label="Match panels">' +
      '<button type="button" class="ev-board__nav-btn" data-toast="Lineups coming soon">' +
      '<img src="assets/icons/lnt/icon-jersey.svg" alt="" />' +
      "<span>Lineups</span>" +
      '<img class="ev-board__nav-chevron" src="assets/icons/te-chevron-down.svg" alt="" /></button>' +
      '<button type="button" class="ev-board__nav-btn is-active" data-toast="Timeline coming soon">Timeline</button>' +
      "</nav></div></div>" +
      mobileBoardHtml(ev, scoreH, scoreA);
  }

  function resolveCrumbSportIcon(ev) {
    var sport = String((ev && ev.sport) || "")
      .toLowerCase()
      .replace(/[\s_-]+/g, "");
    var teBySport = {
      football: "assets/icons/te-football.svg",
      soccer: "assets/icons/te-football.svg",
      basketball: "assets/icons/te-basketball.svg",
      tennis: "assets/icons/te-tennis.svg",
      hockey: "assets/icons/te-hockey.svg",
      icehockey: "assets/icons/te-hockey.svg",
      volleyball: "assets/icons/te-volleyball.svg",
      tabletennis: "assets/icons/te-tabletennis.svg",
      badminton: "assets/icons/te-badminton.svg",
      athletics: "assets/icons/te-athletics.svg",
      americanfootball: "assets/icons/te-americanfootball.svg",
      esports: "assets/icons/te-esports.svg",
    };
    if (teBySport[sport]) return teBySport[sport];

    var icon = String((ev && ev.sportIcon) || "");
    /* Only rewrite root sport-* icons → te-* (never lnt/sport-* etc.) */
    if (/assets\/icons\/sport-[^/]+\.svg$/i.test(icon)) {
      return icon.replace("/icons/sport-", "/icons/te-");
    }
    if (/assets\/icons\/te-[^/]+\.svg$/i.test(icon)) return icon;
    return "assets/icons/te-football.svg";
  }

  function renderTopbar(ev) {
    var sportIcon = resolveCrumbSportIcon(ev);
    var host = $("#ev-topbar");
    if (!host) return;
    host.innerHTML =
      '<nav class="ml-crumbs" aria-label="Breadcrumb">' +
      '<a href="index.html" class="ml-crumb" aria-label="Home">' +
      '<img src="assets/icons/te-home.svg" alt="" width="16" height="16" /></a>' +
      '<img src="assets/icons/te-chevron.svg" alt="" class="ml-crumb-sep" width="6" height="10" />' +
      '<span class="ml-crumb" aria-label="' +
      esc(ev.sport || "Sport") +
      '"><img src="' +
      esc(sportIcon) +
      '" alt="" width="16" height="16" /></span>' +
      '<img src="assets/icons/te-chevron.svg" alt="" class="ml-crumb-sep" width="6" height="10" />' +
      '<span class="ml-crumb" aria-label="Tournament">' +
      '<img src="assets/icons/te-trophy.svg" alt="" width="16" height="16" /></span>' +
      "</nav>" +
      '<div class="ml-toolbar-main">' +
      '<div class="ev-view-tabs" role="tablist" aria-label="Event views">' +
      '<a class="ev-view-tab" href="index.html#live-events">Matches</a>' +
      '<span class="ev-view-tab is-active" aria-current="page">Event</span>' +
      "</div>" +
      '<div class="ev-toolbar-tools">' +
      '<button type="button" class="ev-toolbar-tools__btn" data-toast="Pitch view coming soon" aria-label="Pitch">' +
      '<img src="assets/icons/te-football.svg" alt="" /></button>' +
      '<button type="button" class="ev-toolbar-tools__btn" data-event-info="' +
      esc((window.__dsCurrentEvent && window.__dsCurrentEvent.id) || "") +
      '" aria-label="Event info" aria-haspopup="dialog">' +
      '<img src="assets/icons/icon-more.svg" alt="" /></button>' +
      '<button type="button" class="ev-toolbar-tools__btn" data-toast="Live stream coming soon" aria-label="Stream">' +
      '<img src="assets/icons/lnt/icon-stream.svg" alt="" /></button>' +
      '<button type="button" class="ev-toolbar-tools__btn" data-toast="Statistics coming soon" aria-label="Statistics">' +
      '<img src="mobile/assets/icons/ei-stats.svg" alt="" /></button>' +
      "</div>" +
      '<label class="ml-search">' +
      '<input type="search" placeholder="Search by match" aria-label="Search by match" />' +
      '<button type="button" aria-label="Search"><img src="assets/icons/te-search.svg" alt="" /></button>' +
      "</label></div>";
  }

  function renderToolbar(markets) {
    var bar = $("#ev-toolbar");
    if (!bar) return;
    function countBy(pred) {
      return markets.reduce(function (n, m) {
        return pred(m) ? n + m.rows.length : n;
      }, 0);
    }
    var counts = {
      all: countBy(function () {
        return true;
      }),
      total: countBy(function (m) {
        return m.key === "total" || m.key === "asian-total" || m.key === "total1" || m.key === "att1";
      }),
      handicap: countBy(function (m) {
        return m.key === "handicap" || m.key === "asian-hcap";
      }),
      popular: countBy(function (m) {
        return m.popular;
      }),
      goals: countBy(function (m) {
        return m.goals;
      }),
      intervals: countBy(function (m) {
        return m.intervals;
      }),
    };
    bar.innerHTML =
      '<button type="button" class="ev-period" data-toast="Period filter coming soon">' +
      'Regular time <img src="assets/icons/te-chevron-down.svg" alt="" /></button>' +
      '<button type="button" class="ml-chip active" data-ev-filter="all" role="tab" aria-selected="true">All markets <span>(' +
      counts.all +
      ")</span></button>" +
      '<button type="button" class="ml-chip" data-ev-filter="total" role="tab" aria-selected="false">Total <span>(' +
      counts.total +
      ")</span></button>" +
      '<button type="button" class="ml-chip" data-ev-filter="handicap" role="tab" aria-selected="false">Handicap <span>(' +
      counts.handicap +
      ")</span></button>" +
      '<button type="button" class="ml-chip" data-ev-filter="popular" role="tab" aria-selected="false">Popular <span>(' +
      counts.popular +
      ")</span></button>" +
      '<button type="button" class="ml-chip" data-ev-filter="goals" role="tab" aria-selected="false">Goals <span>(' +
      counts.goals +
      ")</span></button>" +
      '<button type="button" class="ml-chip" data-ev-filter="intervals" role="tab" aria-selected="false">Intervals <span>(' +
      counts.intervals +
      ")</span></button>" +
      '<div class="ev-filters-actions">' +
      '<button type="button" class="ev-toolbar-tools__btn" data-toast="List of markets" aria-label="List of markets">' +
      '<img src="assets/icons/te-menu.svg" alt="" /></button>' +
      '<button type="button" class="ev-toolbar-tools__btn" data-toast="Market info" aria-label="Info">' +
      '<img src="mobile/assets/icons/ei-info.svg" alt="" /></button>' +
      '<button type="button" class="ev-toolbar-tools__btn" data-toast="Notifications" aria-label="Notifications">' +
      '<img src="mobile/assets/icons/ei-bell.svg" alt="" /></button>' +
      '<button type="button" class="ev-toolbar-tools__btn" data-toast="Market settings" aria-label="Settings">' +
      '<img src="assets/icons/rb-settings.svg" alt="" /></button>' +
      '<label class="ml-search">' +
      '<input type="search" placeholder="Search by market" data-ev-market-search aria-label="Search by market" />' +
      '<button type="button" aria-label="Search"><img src="assets/icons/te-search.svg" alt="" /></button>' +
      "</label>" +
      '<button type="button" class="ev-toolbar-tools__btn" data-ev-collapse-all aria-label="Collapse all">' +
      '<img src="assets/icons/rb-collapse.svg" alt="" /></button>' +
      "</div>";
  }

  function renderMarkets(ev, markets) {
    var host = $("#ev-markets");
    if (!host) return;
    host.innerHTML = markets
      .map(function (m, idx) {
        var open = idx < 8;
        var cols = m.cols || 2;
        return (
          '<article class="ev-market' +
          (open ? " is-open" : "") +
          '" data-ev-market="' +
          esc(m.key) +
          '"' +
          (m.popular ? ' data-ev-popular="1"' : "") +
          (m.goals ? ' data-ev-goals="1"' : "") +
          (m.intervals ? ' data-ev-intervals="1"' : "") +
          ">" +
          '<button type="button" class="ev-market__head" aria-expanded="' +
          (open ? "true" : "false") +
          '">' +
          '<img class="ev-market__pin" src="assets/icons/lnt/icon-pin.svg" alt="" />' +
          '<span class="ev-market__head-title">' +
          esc(m.title) +
          "</span>" +
          "</button>" +
          '<div class="ev-market__body ev-market__body--cols-' +
          cols +
          '"' +
          (open ? "" : " hidden") +
          ">" +
          m.rows
            .map(function (r) {
              return oddCellHtml(r);
            })
            .join("") +
          "</div></article>"
        );
      })
      .join("");
  }

  function renderTabs(ev) {
    var tabs = $("#ev-tabs");
    if (!tabs) return;
    var list = ev.tabs || ["Regular time"];
    tabs.innerHTML = list
      .map(function (t, i) {
        return (
          '<button type="button" class="ev-tab ev-pill' +
          (i === 0 ? " is-active" : "") +
          '" data-ev-tab="' +
          esc(t) +
          '">' +
          esc(t) +
          "</button>"
        );
      })
      .join("");
  }

  function render(ev) {
    window.__dsCurrentEvent = ev;
    var markets = buildMarkets(ev);
    renderTopbar(ev);
    renderBoard(ev);
    renderTabs(ev);
    renderToolbar(markets);
    renderMarkets(ev, markets);
    if (typeof window.syncOddButtons === "function") window.syncOddButtons();
  }

  function bind() {
    document.addEventListener("click", function (e) {
      var boardNav = e.target.closest(".ev-board__nav-btn");
      if (boardNav) {
        $$(".ev-board__nav-btn").forEach(function (b) {
          b.classList.toggle("is-active", b === boardNav);
        });
      }

      var mTool = e.target.closest(".ev-mboard__tool");
      if (mTool && !mTool.classList.contains("ev-mboard__tool--more")) {
        var view = mTool.getAttribute("data-ev-view");
        if (view === "stats" || view === "scoreboard") {
          setEventView(view);
          return;
        }
        setEventView("scoreboard");
        $$(".ev-mboard__tool").forEach(function (b) {
          b.classList.toggle("is-active", b === mTool);
        });
      }

      var modeBtn = e.target.closest("[data-ev-mode]");
      if (modeBtn) {
        $$("[data-ev-mode]").forEach(function (b) {
          b.classList.toggle("is-active", b === modeBtn);
        });
      }

      var toastBtn = e.target.closest("[data-toast]");
      if (toastBtn && !toastBtn.closest(".ev-market__head")) {
        var msg = toastBtn.getAttribute("data-toast");
        if (msg && typeof window.showToast === "function") {
          e.preventDefault();
          window.showToast(msg);
          return;
        }
      }

      var panelTab = e.target.closest("[data-ev-panel]");
      if (panelTab) {
        var mode = panelTab.getAttribute("data-ev-panel");
        $$("[data-ev-panel]").forEach(function (t) {
          t.classList.toggle("is-active", t === panelTab);
        });
        var panel = panelTab.closest(".ev-board__panel");
        if (panel) panel.setAttribute("data-ev-panel-mode", mode || "standings");
        return;
      }

      var head = e.target.closest(".ev-market__head");
      if (head) {
        var market = head.closest(".ev-market");
        var body = market && market.querySelector(".ev-market__body");
        var open = market.classList.toggle("is-open");
        head.setAttribute("aria-expanded", open ? "true" : "false");
        if (body) body.hidden = !open;
        return;
      }

      var collapse = e.target.closest("[data-ev-collapse-all]");
      if (collapse) {
        $$(".ev-market").forEach(function (m) {
          m.classList.remove("is-open");
          var h = m.querySelector(".ev-market__head");
          var b = m.querySelector(".ev-market__body");
          if (h) h.setAttribute("aria-expanded", "false");
          if (b) b.hidden = true;
        });
        return;
      }

      var tab = e.target.closest("[data-ev-tab]");
      if (tab) {
        $$("[data-ev-tab]").forEach(function (t) {
          t.classList.toggle("is-active", t === tab);
        });
        return;
      }

      var filter = e.target.closest("[data-ev-filter]");
      if (filter) {
        var key = filter.getAttribute("data-ev-filter");
        $$("[data-ev-filter]").forEach(function (c) {
          var on = c === filter;
          c.classList.toggle("active", on);
          c.classList.toggle("is-active", on);
          c.setAttribute("aria-selected", on ? "true" : "false");
        });
        $$("[data-ev-market]").forEach(function (m) {
          var show =
            key === "all" ||
            m.getAttribute("data-ev-market") === key ||
            (key === "popular" && m.getAttribute("data-ev-popular") === "1") ||
            (key === "goals" && m.getAttribute("data-ev-goals") === "1") ||
            (key === "intervals" && m.getAttribute("data-ev-intervals") === "1") ||
            (key === "total" &&
              /^(total|asian-total|total1|att1)$/.test(m.getAttribute("data-ev-market") || "")) ||
            (key === "handicap" &&
              /^(handicap|asian-hcap)$/.test(m.getAttribute("data-ev-market") || ""));
          m.hidden = !show;
        });
      }
    });

    document.addEventListener("input", function (e) {
      var input = e.target.closest("[data-ev-market-search]");
      if (!input) return;
      var q = (input.value || "").trim().toLowerCase();
      $$("[data-ev-market]").forEach(function (m) {
        if (!q) {
          m.hidden = false;
          return;
        }
        var title = (m.querySelector(".ev-market__head-title") || {}).textContent || "";
        m.hidden = !title.toLowerCase().includes(q);
      });
    });

    window.addEventListener("message", function (e) {
      var data = e && e.data;
      if (!data || data.type !== STATS_HEIGHT_MSG) return;
      if (typeof data.height === "number" && data.height > 0) {
        setStatsHeight(data.height);
      }
    });
  }

  function init() {
    if (!document.body.classList.contains("ds-event-page")) return;
    var ev = resolveEvent();
    document.title = ev.home + " vs " + ev.away + " — Event — 1xBet";
    render(ev);
    bind();
    if (new URLSearchParams(window.location.search).get("view") === "stats") {
      setEventView("stats");
    }
  }

  window.DsEventPage = {
    stash: function (data) {
      try {
        sessionStorage.setItem(PENDING_KEY, JSON.stringify(data));
      } catch (e) {
        /* ignore */
      }
    },
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
