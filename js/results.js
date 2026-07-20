/* results.js — Results page (More > Results) */
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

  function setTab(key) {
    $$("[data-rs-tab]").forEach(function (tab) {
      var on = tab.getAttribute("data-rs-tab") === key;
      tab.classList.toggle("is-active", on);
      tab.setAttribute("aria-selected", on ? "true" : "false");
    });
    $$("[data-rs-panel]").forEach(function (panel) {
      panel.hidden = panel.getAttribute("data-rs-panel") !== key;
    });
  }

  function filterSports(query) {
    var q = (query || "").trim().toLowerCase();
    $$(".rs-sport-item").forEach(function (item) {
      var name = (item.getAttribute("data-sport-name") || item.textContent || "").toLowerCase();
      item.hidden = q !== "" && name.indexOf(q) === -1;
    });
  }

  function filterMatches(query) {
    var q = (query || "").trim().toLowerCase();
    $$(".rs-league").forEach(function (league) {
      var leagueName = (league.getAttribute("data-league") || "").toLowerCase();
      var matches = $$(".rs-match", league);
      var anyVisible = false;

      matches.forEach(function (match) {
        var hay = (
          (match.getAttribute("data-search") || "") +
          " " +
          leagueName
        ).toLowerCase();
        var show = !q || hay.indexOf(q) !== -1;
        match.hidden = !show;
        if (show) anyVisible = true;
      });

      league.hidden = q !== "" && !anyVisible && leagueName.indexOf(q) === -1;
      if (!league.hidden && q && anyVisible) {
        league.classList.remove("is-collapsed");
      }
    });
  }

  function applyOptionClass(name, enabled) {
    document.body.classList.toggle(name, enabled);
  }

  function initSidebarToggle() {
    var sidebar = $("#left-sidebar");
    var openBtn = $("#mobile-sports-btn");
    var closeBtn = $("#left-drawer-close");
    var backdrop = $("#drawer-backdrop");

    function open() {
      if (!sidebar) return;
      sidebar.classList.add("is-open");
      if (backdrop) backdrop.hidden = false;
      if (openBtn) openBtn.setAttribute("aria-expanded", "true");
    }

    function close() {
      if (!sidebar) return;
      sidebar.classList.remove("is-open");
      if (backdrop) backdrop.hidden = true;
      if (openBtn) openBtn.setAttribute("aria-expanded", "false");
    }

    if (openBtn) openBtn.addEventListener("click", open);
    if (closeBtn) closeBtn.addEventListener("click", close);
    if (backdrop) backdrop.addEventListener("click", close);
  }

  function initHeaderBasics() {
    var menuBtn = $("#mobile-menu-btn");
    var menuTab = $("#mobile-menu-tab");
    var headerBottom = $("#header-bottom");

    function toggleMenu() {
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

    $$("[data-rs-tab]").forEach(function (tab) {
      tab.addEventListener("click", function () {
        setTab(tab.getAttribute("data-rs-tab"));
      });
    });

    var sportSearch = $("#rs-sport-search");
    if (sportSearch) {
      sportSearch.addEventListener("input", function () {
        filterSports(sportSearch.value);
      });
    }

    var matchSearch = $("#rs-match-search");
    if (matchSearch) {
      matchSearch.addEventListener("input", function () {
        filterMatches(matchSearch.value);
      });
    }

    var emptyEl = $("#rs-sport-empty");

    $$(".rs-sport-item").forEach(function (btn) {
      btn.addEventListener("click", function () {
        $$(".rs-sport-item").forEach(function (b) {
          b.classList.toggle("is-active", b === btn);
        });
        var sport = btn.getAttribute("data-sport") || "football";
        var found = false;
        $$(".rs-sport-block").forEach(function (block) {
          var on = block.getAttribute("data-sport") === sport;
          block.hidden = !on;
          if (on) found = true;
        });
        if (emptyEl) emptyEl.hidden = found;
        toast((btn.getAttribute("data-sport-name") || "Sport") + " selected");
      });
    });

    $$(".rs-sport-head").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var block = btn.closest(".rs-sport-block");
        if (block) block.classList.toggle("is-collapsed");
      });
    });

    $$(".rs-league-head").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var league = btn.closest(".rs-league");
        if (league) league.classList.toggle("is-collapsed");
      });
    });

    var logos = $("#rs-opt-logos");
    var detail = $("#rs-opt-detail");
    var sportsOnly = $("#rs-opt-sports-only");
    var videoOnly = $("#rs-opt-video");
    var markedOnly = $("#rs-opt-marked");

    applyOptionClass("rs-show-logos", !!(logos && logos.checked));
    applyOptionClass("rs-show-detail", !!(detail && detail.checked));

    if (logos) {
      logos.addEventListener("change", function () {
        applyOptionClass("rs-show-logos", logos.checked);
      });
    }
    if (detail) {
      detail.addEventListener("change", function () {
        applyOptionClass("rs-show-detail", detail.checked);
      });
    }
    if (sportsOnly) {
      sportsOnly.addEventListener("change", function () {
        toast(sportsOnly.checked ? "Showing sports headers only (demo)" : "Showing all results");
      });
    }
    if (videoOnly) {
      videoOnly.addEventListener("change", function () {
        toast(videoOnly.checked ? "Only with video (demo filter)" : "Video filter off");
      });
    }
    if (markedOnly) {
      markedOnly.addEventListener("change", function () {
        toast(markedOnly.checked ? "Marked only (demo filter)" : "Marked filter off");
      });
    }

    var refresh = $("#rs-refresh");
    if (refresh) {
      refresh.addEventListener("click", function () {
        toast("Results refreshed (demo)");
      });
    }

    var collapseAll = $("#rs-collapse-all");
    if (collapseAll) {
      collapseAll.addEventListener("click", function () {
        var leagues = $$(".rs-league");
        var anyOpen = leagues.some(function (l) {
          return !l.classList.contains("is-collapsed");
        });
        leagues.forEach(function (l) {
          l.classList.toggle("is-collapsed", anyOpen);
        });
        toast(anyOpen ? "All leagues collapsed" : "All leagues expanded");
      });
    }

    var dateBtn = $("#rs-date-btn");
    if (dateBtn) {
      dateBtn.addEventListener("click", function () {
        toast("Date picker (demo)");
      });
    }

    setTab("sports");
  });
})();
