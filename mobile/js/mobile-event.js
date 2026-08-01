/* Mobile Event page — screenshot parity */
(function () {
  "use strict";

  var PENDING_KEY = "mh-event-pending";

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
      homeLogo: "../assets/images/mobile-home/teams/team-01.webp",
      awayLogo: "../assets/images/mobile-home/teams/team-02.webp",
      live: true,
      scoreH: 4,
      scoreA: 1,
      homeScore: 4,
      awayScore: 1,
      clock: "50:08",
      period: "2nd half",
      cornersH: 3,
      cornersA: 1,
      yellowH: 0,
      yellowA: 0,
      redH: 0,
      redA: 0,
      subH: 0,
      subA: 0,
      htScores: "3:1 1:0",
      tabs: ["Regular time", "2nd half", "Corners", "Quick events", "Results"],
    };
  }

  function resolveEvent() {
    var params = new URLSearchParams(window.location.search);
    var id = params.get("id") || "";
    var pending = readPending();
    var base = demoEvent((pending && pending.id) || id || "lazio-avellino");
    if (pending && (!id || pending.id === id || !pending.id)) {
      Object.keys(pending).forEach(function (k) {
        var v = pending[k];
        if (v === undefined || v === null || v === "") return;
        base[k] = v;
      });
    } else if (window.MhFavourites && typeof window.MhFavourites.getById === "function" && id) {
      var fav = window.MhFavourites.getById(id);
      if (fav) {
        Object.keys(fav).forEach(function (k) {
          var v = fav[k];
          if (v === undefined || v === null || v === "") return;
          base[k] = v;
        });
      }
    }
    if (base.scoreH == null && base.homeScore != null) base.scoreH = base.homeScore;
    if (base.scoreA == null && base.awayScore != null) base.scoreA = base.awayScore;
    if (!base.clock && base.time) base.clock = base.time;
    if (!base.tabs || !base.tabs.length) {
      base.tabs = ["Regular time", "2nd half", "Corners", "Quick events", "Results"];
    }
    return base;
  }

  function marketsFor(ev) {
    var match = (ev.home || "") + " - " + (ev.away || "");
    function row(lab, odd, market, selection) {
      return { lab: lab, odd: odd, market: market, selection: selection || lab, match: match };
    }
    return [
      {
        title: "1X2",
        open: true,
        cols: 3,
        rows: [
          row("W1", "1.005", "1X2", "W1"),
          row("X", "34", "1X2", "X"),
          row("W2", "51", "1X2", "W2"),
        ],
      },
      {
        title: "Both Teams To Score",
        open: true,
        cols: 2,
        rows: [
          row("Each Team To Score 2 Or More - Yes", "2.112", "BTTS", "ETS2 Yes"),
          row("Each Team To Score 2 Or More - No", "1.69", "BTTS", "ETS2 No"),
          row("Each Team To Score 3 Or More - Yes", "6.68", "BTTS", "ETS3 Yes"),
          row("Each Team To Score 3 Or More - No", "1.095", "BTTS", "ETS3 No"),
        ],
      },
      {
        title: "Total",
        open: true,
        cols: 2,
        rows: [
          row("Over 4.5", "1.72", "Total"),
          row("Under 4.5", "2.05", "Total"),
          row("Over 5.5", "2.35", "Total"),
          row("Under 5.5", "1.55", "Total"),
        ],
      },
      {
        title: "Handicap",
        open: false,
        cols: 2,
        rows: [
          row("1 (-2.5)", "1.85", "Handicap"),
          row("2 (+2.5)", "1.9", "Handicap"),
        ],
      },
    ];
  }

  function miniItem(kind, value) {
    return (
      '<span class="mh-ev-mini__item"><span class="mh-ev-ico mh-ev-ico--' +
      kind +
      '" aria-hidden="true"></span>' +
      esc(value) +
      "</span>"
    );
  }

  function renderBoard(ev) {
    var board = $("#mh-ev-board");
    if (!board) return;
    var scoreH = ev.scoreH != null ? ev.scoreH : "—";
    var scoreA = ev.scoreA != null ? ev.scoreA : "—";
    var status =
      (ev.period || "Live") + (ev.clock ? ", " + ev.clock : ev.time ? ", " + ev.time : "");
    board.innerHTML =
      '<div class="mh-ev-tools" role="toolbar" aria-label="Event views">' +
      '<button type="button" class="mh-ev-tools__btn" data-mh-toast="Favourites" aria-label="Favourite">' +
      '<img src="assets/icons/ei-star.svg" alt="" /></button>' +
      '<button type="button" class="mh-ev-tools__btn is-active" aria-label="Scoreboard" aria-current="true">' +
      '<img src="../assets/icons/te-trophy.svg" alt="" /></button>' +
      '<button type="button" class="mh-ev-tools__btn" data-mh-toast="Pitch view" aria-label="Pitch">' +
      '<img src="assets/icons/te-football.svg" alt="" /></button>' +
      '<button type="button" class="mh-ev-tools__btn" data-mh-toast="Live stream" aria-label="Stream">' +
      '<img src="../assets/icons/lnt/icon-stream.svg" alt="" /></button>' +
      '<button type="button" class="mh-ev-tools__btn" data-mh-toast="Statistics" aria-label="Stats">' +
      '<img src="assets/icons/ei-stats.svg" alt="" /></button>' +
      '<button type="button" class="mh-ev-tools__btn mh-ev-tools__more" data-mh-toast="More" aria-label="More">' +
      '<img src="assets/icons/icon-more.svg" alt="" /></button>' +
      "</div>" +
      '<p class="mh-ev-board__status">' +
      esc(status) +
      "</p>" +
      '<div class="mh-ev-board__scoreline">' +
      '<div class="mh-ev-board__team">' +
      esc(ev.home) +
      "</div>" +
      '<p class="mh-ev-board__score"><span class="mh-ev-board__score-h">' +
      esc(scoreH) +
      '</span><span class="mh-ev-board__score-sep">:</span><span class="mh-ev-board__score-a">' +
      esc(scoreA) +
      "</span></p>" +
      '<div class="mh-ev-board__team mh-ev-board__team--away">' +
      esc(ev.away) +
      "</div></div>" +
      '<div class="mh-ev-board__strip">' +
      '<div class="mh-ev-mini mh-ev-mini--home">' +
      miniItem("corner", ev.cornersH != null ? ev.cornersH : 0) +
      miniItem("ycard", ev.yellowH != null ? ev.yellowH : 0) +
      miniItem("rcard", ev.redH != null ? ev.redH : 0) +
      miniItem("sub", ev.subH != null ? ev.subH : 0) +
      "</div>" +
      '<span class="mh-ev-board__ht">' +
      esc(ev.htScores || "") +
      "</span>" +
      '<div class="mh-ev-mini mh-ev-mini--away">' +
      miniItem("sub", ev.subA != null ? ev.subA : 0) +
      miniItem("rcard", ev.redA != null ? ev.redA : 0) +
      miniItem("ycard", ev.yellowA != null ? ev.yellowA : 0) +
      miniItem("corner", ev.cornersA != null ? ev.cornersA : 0) +
      "</div></div>" +
      '<button type="button" class="mh-ev-board__league" data-mh-toast="Tournament filter">' +
      "<span>" +
      esc(ev.league || "") +
      '</span><img src="assets/icons/icon-chevron-down.svg" alt="" /></button>';
  }

  function renderFilters(ev) {
    var host = $("#mh-ev-filters");
    if (!host) return;
    var list = ev.tabs || [];
    host.innerHTML = list
      .map(function (t, i) {
        return (
          '<button type="button" class="mh-ev-pill' +
          (i === 0 ? " is-active" : "") +
          '" data-mh-ev-pill>' +
          esc(t) +
          "</button>"
        );
      })
      .join("");
  }

  function renderMarkets(ev) {
    var host = $("#mh-ev-markets");
    if (!host) return;
    host.innerHTML = marketsFor(ev)
      .map(function (m) {
        var cols = m.cols || 2;
        return (
          '<section class="mh-ev-market' +
          (m.open ? " is-open" : "") +
          '" data-mh-market-block>' +
          '<button type="button" class="mh-ev-market__head" aria-expanded="' +
          (m.open ? "true" : "false") +
          '">' +
          '<img class="mh-ev-market__pin" src="../assets/icons/lnt/icon-pin.svg" alt="" />' +
          '<span class="mh-ev-market__title">' +
          esc(m.title) +
          "</span></button>" +
          '<div class="mh-ev-market__body mh-ev-market__body--cols-' +
          cols +
          '"' +
          (m.open ? "" : " hidden") +
          ">" +
          m.rows
            .map(function (r) {
              return (
                '<button type="button" class="mh-ev-odd mh-odds__btn" data-odd="' +
                esc(r.odd) +
                '" data-mh-market="' +
                esc(r.market) +
                '" data-mh-selection="' +
                esc(r.selection) +
                '" data-mh-match="' +
                esc(r.match) +
                '">' +
                '<span class="mh-odds__lab">' +
                esc(r.lab) +
                '</span><span class="mh-odds__val">' +
                esc(r.odd) +
                "</span></button>"
              );
            })
            .join("") +
          "</div></section>"
        );
      })
      .join("");
  }

  function render(ev) {
    renderBoard(ev);
    renderFilters(ev);
    renderMarkets(ev);
    document.title = (ev.home || "Event") + " vs " + (ev.away || "") + " - 1xBet Mobile";
  }

  function bind() {
    document.addEventListener("click", function (e) {
      var head = e.target.closest(".mh-ev-market__head");
      if (head) {
        var market = head.closest(".mh-ev-market");
        var body = market && market.querySelector(".mh-ev-market__body");
        var open = market.classList.toggle("is-open");
        head.setAttribute("aria-expanded", open ? "true" : "false");
        if (body) body.hidden = !open;
        return;
      }

      var pill = e.target.closest("[data-mh-ev-pill]");
      if (pill) {
        $$("[data-mh-ev-pill]").forEach(function (t) {
          t.classList.toggle("is-active", t === pill);
        });
        return;
      }

      var tool = e.target.closest(".mh-ev-tools__btn");
      if (tool && !tool.classList.contains("mh-ev-tools__more")) {
        $$(".mh-ev-tools__btn").forEach(function (b) {
          b.classList.toggle("is-active", b === tool);
          if (b === tool) b.setAttribute("aria-current", "true");
          else b.removeAttribute("aria-current");
        });
      }

      var mode = e.target.closest("[data-mh-ev-mode]");
      if (mode) {
        $$("[data-mh-ev-mode]").forEach(function (b) {
          b.classList.toggle("is-active", b === mode);
        });
      }

      var collapse = e.target.closest("[data-mh-ev-collapse]");
      if (collapse) {
        $$(".mh-ev-market").forEach(function (m) {
          m.classList.remove("is-open");
          var h = m.querySelector(".mh-ev-market__head");
          var b = m.querySelector(".mh-ev-market__body");
          if (h) h.setAttribute("aria-expanded", "false");
          if (b) b.hidden = true;
        });
      }
    });

    document.addEventListener("input", function (e) {
      var input = e.target.closest("[data-mh-ev-search]");
      if (!input) return;
      var q = (input.value || "").trim().toLowerCase();
      $$("[data-mh-market-block]").forEach(function (m) {
        var title = (m.querySelector(".mh-ev-market__title") || {}).textContent || "";
        m.hidden = q ? !title.toLowerCase().includes(q) : false;
      });
    });

    $("#mh-ev-back")?.addEventListener("click", function (e) {
      e.preventDefault();
      if (window.history.length > 1) window.history.back();
      else window.location.href = "index.html";
    });
  }

  function init() {
    if (!document.body.classList.contains("mh-page--event")) return;
    render(resolveEvent());
    bind();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
