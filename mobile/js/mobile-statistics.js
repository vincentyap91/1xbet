/**
 * Mobile Statistics — sport rail, date/pages, left drawer
 * Live ref: https://1xlite-46272.pro/en/statistic/
 */
(function () {
  "use strict";

  var DRAWER_MS = 280;

  function motionMs(ms) {
    try {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return 1;
    } catch (_) {
      /* ignore */
    }
    return ms;
  }

  /** @type {"closed"|"opening"|"open"|"closing"} */
  var drawerPhase = "closed";

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function $$(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function lockScroll(on) {
    document.body.classList.toggle("mh-sheet-scroll-lock", !!on);
    document.body.classList.toggle("is-st-drawer-open", !!on);
  }

  function initSports() {
    $$("[data-mh-st-sport]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        $$("[data-mh-st-sport]").forEach(function (b) {
          b.classList.toggle("is-active", b === btn);
        });
        updateBreadcrumb();
      });
    });

    var rail = $("#mh-st-sports");
    var prev = $("[data-mh-st-sports-prev]");
    var next = $("[data-mh-st-sports-next]");
    if (rail && prev) {
      prev.addEventListener("click", function () {
        rail.scrollBy({ left: -160, behavior: "smooth" });
      });
    }
    if (rail && next) {
      next.addEventListener("click", function () {
        rail.scrollBy({ left: 160, behavior: "smooth" });
      });
    }
  }

  function initPages() {
    function setPage(n) {
      $$("[data-mh-st-page]").forEach(function (b) {
        b.classList.toggle("is-active", b.getAttribute("data-mh-st-page") === String(n));
      });
    }

    $$("[data-mh-st-page]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setPage(btn.getAttribute("data-mh-st-page"));
      });
    });

    var prev = $("[data-mh-st-page-prev]");
    var next = $("[data-mh-st-page-next]");
    if (prev) {
      prev.addEventListener("click", function () {
        var cur = $("[data-mh-st-page].is-active");
        var n = cur ? parseInt(cur.getAttribute("data-mh-st-page"), 10) : 1;
        setPage(Math.max(1, n - 1));
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        var cur = $("[data-mh-st-page].is-active");
        var n = cur ? parseInt(cur.getAttribute("data-mh-st-page"), 10) : 1;
        setPage(Math.min(5, n + 1));
      });
    }
  }

  var dates = [
    { label: "22.07 WE", crumb: "22.07.2026" },
    { label: "23.07 TH", crumb: "23.07.2026" },
    { label: "24.07 FR", crumb: "24.07.2026" },
    { label: "25.07 SA", crumb: "25.07.2026" },
    { label: "26.07 SU", crumb: "26.07.2026" },
  ];
  var dateIdx = 1;

  function updateBreadcrumb() {
    var crumb = $("#mh-st-breadcrumb");
    if (!crumb) return;
    var sport = $("[data-mh-st-sport].is-active");
    var sportName = sport ? (sport.textContent || "Football").trim() : "Football";
    crumb.textContent =
      "Statistics / " + sportName + " - Top Matches - " + dates[dateIdx].crumb;
  }

  function renderDate() {
    var label = $("#mh-st-date-label");
    if (label) label.textContent = dates[dateIdx].label;
    updateBreadcrumb();
  }

  function initDateNav() {
    var prev = $("#mh-st-date-prev");
    var next = $("#mh-st-date-next");
    if (prev) {
      prev.addEventListener("click", function () {
        dateIdx = (dateIdx - 1 + dates.length) % dates.length;
        renderDate();
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        dateIdx = (dateIdx + 1) % dates.length;
        renderDate();
      });
    }
    renderDate();
  }

  function initSearch() {
    var input = $("#mh-st-search");
    if (!input) return;
    input.addEventListener("input", function () {
      var q = (input.value || "").trim().toLowerCase();
      $$(".mh-st-match").forEach(function (m) {
        var hay = (m.getAttribute("data-search") || m.textContent || "").toLowerCase();
        m.hidden = q !== "" && hay.indexOf(q) === -1;
      });
      $$(".mh-st-league").forEach(function (league) {
        var any = $$(".mh-st-match", league).some(function (m) {
          return !m.hidden;
        });
        league.hidden = !any && q !== "";
      });
    });
  }

  function initDrawerSearch() {
    $$(".mh-st-tourney-search").forEach(function (input) {
      input.addEventListener("input", function () {
        var q = (input.value || "").trim().toLowerCase();
        var root = input.closest("[data-mh-st-nav]") || document;
        $$("[data-mh-st-tourney]", root).forEach(function (row) {
          var hay = (row.getAttribute("data-mh-st-tourney") || row.textContent || "").toLowerCase();
          row.hidden = q !== "" && hay.indexOf(q) === -1;
        });
      });
    });
  }

  function setDrawerTriggers(expanded) {
    $$("[data-mh-st-drawer-open]").forEach(function (el) {
      el.setAttribute("aria-expanded", expanded ? "true" : "false");
    });
    var drawer = $("#mh-st-drawer");
    if (drawer) drawer.setAttribute("aria-hidden", expanded ? "false" : "true");
  }

  function openDrawer() {
    var drawer = $("#mh-st-drawer");
    if (!drawer) return;
    if (drawerPhase === "open" || drawerPhase === "opening") return;
    if (drawerPhase === "closing") return;
    if (window.matchMedia("(min-width: 900px)").matches) return;

    drawer.hidden = false;
    drawerPhase = "opening";
    drawer.classList.remove("closed", "closing", "open");
    drawer.classList.add("opening");
    lockScroll(true);
    setDrawerTriggers(true);

    var closeBtn = $("[data-mh-st-drawer-close]", drawer);
    if (closeBtn) closeBtn.focus();

    window.setTimeout(function () {
      if (drawerPhase !== "opening") return;
      drawerPhase = "open";
      drawer.classList.remove("opening");
      drawer.classList.add("open");
    }, motionMs(DRAWER_MS));
  }

  function closeDrawer() {
    var drawer = $("#mh-st-drawer");
    if (!drawer) return;
    if (drawerPhase === "closed" || drawerPhase === "closing") return;

    drawerPhase = "closing";
    drawer.classList.remove("opening", "open");
    drawer.classList.add("closing");

    window.setTimeout(function () {
      if (drawerPhase !== "closing") return;
      drawerPhase = "closed";
      drawer.classList.remove("closing");
      drawer.classList.add("closed");
      drawer.hidden = true;
      lockScroll(false);
      setDrawerTriggers(false);
    }, motionMs(DRAWER_MS));
  }

  function initDrawer() {
    var drawer = $("#mh-st-drawer");
    if (!drawer) return;
    drawer.classList.add("closed");

    $$("[data-mh-st-drawer-open]").forEach(function (el) {
      el.addEventListener("click", openDrawer);
    });
    $$("[data-mh-st-drawer-close]").forEach(function (el) {
      el.addEventListener("click", closeDrawer);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && (drawerPhase === "open" || drawerPhase === "opening")) {
        closeDrawer();
      }
    });

    window.addEventListener("resize", function () {
      if (window.matchMedia("(min-width: 900px)").matches && drawerPhase !== "closed") {
        closeDrawer();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initSports();
    initPages();
    initDateNav();
    initSearch();
    initDrawerSearch();
    initDrawer();
  });
})();
