/* statistics.js — Statistics page (More > Statistics) */
(function () {
  "use strict";

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function $$(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function toast(msg) {
    if (typeof window.showToast === "function") {
      window.showToast(msg);
      return;
    }
    var el = $("#toast");
    if (!el) return;
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(el._t);
    el._t = setTimeout(function () {
      el.hidden = true;
    }, 2200);
  }

  var dates = [
    { label: "02.08 SU", crumb: "02.08.2026" },
    { label: "03.08 MO", crumb: "03.08.2026" },
    { label: "04.08 TU", crumb: "04.08.2026" },
    { label: "05.08 WE", crumb: "05.08.2026" },
    { label: "06.08 TH", crumb: "06.08.2026" },
  ];
  var dateIdx = 2;
  var activeSport = "football";

  function sportName() {
    var chip = $(".st-sport-chip.is-active");
    return chip ? (chip.textContent || "Football").trim() : "Football";
  }

  function updateChrome() {
    var title = $("#st-title-label");
    if (title) {
      title.textContent = "STATISTICS - TOP MATCHES";
    }
    var sub = $("#st-title-sub");
    if (sub) {
      sub.textContent = sportName() + " · " + dates[dateIdx].crumb;
    }
    var mobileTitle = $("#st-mobile-title");
    if (mobileTitle) {
      mobileTitle.textContent = "Statistics";
    }
    var dateLabel = $("#st-date-label");
    if (dateLabel) dateLabel.textContent = dates[dateIdx].label;
  }

  function setSport(sport) {
    activeSport = sport || "football";
    $$(".st-sport-chip").forEach(function (chip) {
      chip.classList.toggle("is-active", chip.getAttribute("data-st-sport") === activeSport);
    });
    $$(".st-league").forEach(function (league) {
      var s = league.getAttribute("data-sport") || "football";
      league.hidden = s !== activeSport;
    });
    var empty = $("#st-sport-empty");
    var any = $$(".st-league").some(function (l) {
      return !l.hidden;
    });
    if (empty) empty.hidden = any;
    updateChrome();
  }

  function filterMatches(query) {
    var q = (query || "").trim().toLowerCase();
    $$(".st-league").forEach(function (league) {
      if ((league.getAttribute("data-sport") || "football") !== activeSport) {
        league.hidden = true;
        return;
      }
      var leagueName = (league.getAttribute("data-league") || "").toLowerCase();
      var matches = $$(".st-match", league);
      var anyVisible = false;
      matches.forEach(function (match) {
        var hay = ((match.getAttribute("data-search") || "") + " " + leagueName).toLowerCase();
        var show = !q || hay.indexOf(q) !== -1;
        match.hidden = !show;
        if (show) anyVisible = true;
      });
      league.hidden = q !== "" && !anyVisible && leagueName.indexOf(q) === -1;
    });
  }

  function filterTournaments(query) {
    var q = (query || "").trim().toLowerCase();
    $$("[data-st-tourney]").forEach(function (row) {
      var hay = (row.getAttribute("data-st-tourney") || row.textContent || "").toLowerCase();
      row.hidden = q !== "" && hay.indexOf(q) === -1;
    });
  }

  function setPage(n) {
    $$("[data-st-page]").forEach(function (b) {
      b.classList.toggle("is-active", b.getAttribute("data-st-page") === String(n));
    });
  }

  function initSidebarToggle() {
    var sidebar = $("#left-sidebar");
    var openBtns = ["#mobile-sports-btn"]
      .map(function (sel) { return $(sel); })
      .filter(Boolean);
    var closeBtn = $("#left-drawer-close");
    var backdrop = $("#drawer-backdrop");

    function setExpanded(on) {
      openBtns.forEach(function (btn) {
        btn.setAttribute("aria-expanded", on ? "true" : "false");
      });
    }

    function open() {
      if (!sidebar) return;
      sidebar.classList.add("is-open");
      if (backdrop) backdrop.hidden = false;
      setExpanded(true);
    }

    function close() {
      if (!sidebar) return;
      sidebar.classList.remove("is-open");
      if (backdrop) backdrop.hidden = true;
      setExpanded(false);
    }

    openBtns.forEach(function (btn) {
      btn.addEventListener("click", open);
    });
    if (closeBtn) closeBtn.addEventListener("click", close);
    if (backdrop) backdrop.addEventListener("click", close);
  }

  function initHeaderBasics() {
    var menuBtn = $("#mobile-menu-btn");
    var menuTab = $("#mobile-menu-tab");
    var headerBottom = $("#header-bottom");

    function toggleMenu() {
      if (window.DesktopFullMenu) {
        window.DesktopFullMenu.toggle();
        return;
      }
      if (!headerBottom) return;
      var open = headerBottom.classList.toggle("is-open");
      if (menuBtn) menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      if (menuTab) menuTab.setAttribute("aria-expanded", open ? "true" : "false");
    }

    if (menuBtn) menuBtn.addEventListener("click", toggleMenu);
    if (menuTab) menuTab.addEventListener("click", toggleMenu);

    document.addEventListener("click", function (e) {
      var trigger = e.target.closest(".nav-item.has-dropdown > .nav-link");
      if (trigger) {
        e.preventDefault();
        var item = trigger.closest(".nav-item");
        var open = item.classList.contains("open");
        $$(".nav-item.open").forEach(function (n) {
          n.classList.remove("open");
          var btn = n.querySelector(".nav-link");
          if (btn) btn.setAttribute("aria-expanded", "false");
        });
        if (!open) {
          item.classList.add("open");
          trigger.setAttribute("aria-expanded", "true");
        }
        return;
      }
      if (!e.target.closest(".nav-item.has-dropdown")) {
        $$(".nav-item.open").forEach(function (n) {
          n.classList.remove("open");
          var btn = n.querySelector(".nav-link");
          if (btn) btn.setAttribute("aria-expanded", "false");
        });
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initHeaderBasics();
    initSidebarToggle();

    $$(".st-sport-chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        setSport(chip.getAttribute("data-st-sport"));
        filterMatches(($("#st-match-search") || {}).value || "");
        toast(sportName());
      });
    });

    var rail = $("#st-sports");
    var prevSport = $("[data-st-sports-prev]");
    var nextSport = $("[data-st-sports-next]");
    if (rail && prevSport) {
      prevSport.addEventListener("click", function () {
        rail.scrollBy({ left: -180, behavior: "smooth" });
      });
    }
    if (rail && nextSport) {
      nextSport.addEventListener("click", function () {
        rail.scrollBy({ left: 180, behavior: "smooth" });
      });
    }

    var tourneySearch = $("#st-tourney-search");
    if (tourneySearch) {
      tourneySearch.addEventListener("input", function () {
        filterTournaments(tourneySearch.value);
      });
    }

    var matchSearch = $("#st-match-search");
    if (matchSearch) {
      matchSearch.addEventListener("input", function () {
        filterMatches(matchSearch.value);
      });
    }

    $$("[data-st-tourney] > .st-side-item").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var row = btn.closest("[data-st-tourney]");
        if (!row) return;
        var wasOpen = row.classList.contains("is-open");
        $$("[data-st-tourney].is-open").forEach(function (r) {
          r.classList.remove("is-open");
        });
        if (!wasOpen) row.classList.add("is-open");
        toast((row.getAttribute("data-st-tourney") || "Tournament").trim());
      });
    });

    $$(".st-side-item[data-st-pick]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        $$(".st-side-item[data-st-pick]").forEach(function (b) {
          b.classList.remove("is-active");
        });
        btn.classList.add("is-active");
        toast(btn.getAttribute("data-st-pick") || (btn.textContent || "").trim());
      });
    });

    $$(".st-tourney-subs .st-side-item").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        toast((btn.textContent || "League").trim());
      });
    });

    var datePrev = $("#st-date-prev");
    var dateNext = $("#st-date-next");
    var dateLabel = $("#st-date-label");
    if (datePrev) {
      datePrev.addEventListener("click", function () {
        dateIdx = (dateIdx - 1 + dates.length) % dates.length;
        updateChrome();
        toast(dates[dateIdx].crumb);
      });
    }
    if (dateNext) {
      dateNext.addEventListener("click", function () {
        dateIdx = (dateIdx + 1) % dates.length;
        updateChrome();
        toast(dates[dateIdx].crumb);
      });
    }
    if (dateLabel) {
      dateLabel.addEventListener("click", function () {
        toast("Pick date: " + dates[dateIdx].crumb);
      });
    }

    $$("[data-st-page]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setPage(btn.getAttribute("data-st-page"));
        toast("Page " + btn.getAttribute("data-st-page"));
      });
    });

    var pagePrev = $("[data-st-page-prev]");
    var pageNext = $("[data-st-page-next]");
    if (pagePrev) {
      pagePrev.addEventListener("click", function () {
        var cur = $("[data-st-page].is-active");
        var n = cur ? parseInt(cur.getAttribute("data-st-page"), 10) : 1;
        setPage(Math.max(1, n - 1));
      });
    }
    if (pageNext) {
      pageNext.addEventListener("click", function () {
        var cur = $("[data-st-page].is-active");
        var n = cur ? parseInt(cur.getAttribute("data-st-page"), 10) : 1;
        setPage(Math.min(5, n + 1));
      });
    }

    document.addEventListener("click", function (e) {
      var info = e.target.closest(".st-match__info");
      if (info) {
        toast("Match info");
      }
    });

    setSport("football");
    updateChrome();
  });
})();
