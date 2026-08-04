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
    $$(".rs-sport-acc").forEach(function (acc) {
      var sportName = (acc.getAttribute("data-sport-name") || "").toLowerCase();
      var leagueHit = $$(".rs-league-item", acc).some(function (item) {
        return (item.getAttribute("data-league") || item.textContent || "").toLowerCase().indexOf(q) !== -1;
      });
      var show = !q || sportName.indexOf(q) !== -1 || leagueHit;
      acc.hidden = !show;
      if (show && q && leagueHit && sportName.indexOf(q) === -1) {
        acc.classList.add("is-open");
        var head = acc.querySelector(".rs-sport-item");
        if (head) head.setAttribute("aria-expanded", "true");
      }
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

    var isMobile = function () {
      return window.matchMedia("(max-width: 900px)").matches;
    };

    /* Desktop: expand football with results by default */
    if (!isMobile()) {
      var football = document.querySelector('.rs-sport-block[data-sport="football"]');
      if (football) {
        football.classList.remove("is-collapsed");
        var head = football.querySelector(".rs-sport-head");
        if (head) head.setAttribute("aria-expanded", "true");
      }
    }

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

    function runMatchSearch(value) {
      filterMatches(value);
    }

    var matchSearch = $("#rs-match-search");
    if (matchSearch) {
      matchSearch.addEventListener("input", function () {
        runMatchSearch(matchSearch.value);
      });
    }

    var mobileSearch = $("#rs-mobile-search");
    if (mobileSearch) {
      mobileSearch.addEventListener("input", function () {
        runMatchSearch(mobileSearch.value);
      });
    }

    var emptyEl = $("#rs-sport-empty");
    var activeSportFilter = isMobile() ? "all" : "football";

    function selectSport(sport, opts) {
      var name = (opts && opts.name) || sport;
      activeSportFilter = sport;
      var chips = $$("[data-rs-chip]");
      chips.forEach(function (c) {
        c.classList.toggle("is-active", c.getAttribute("data-rs-chip") === sport);
      });

      $$(".rs-sport-item").forEach(function (b) {
        var itemSport = b.getAttribute("data-sport");
        b.classList.toggle("is-active", sport === "all" ? itemSport === "football" : itemSport === sport);
      });

      var found = false;
      $$(".rs-sport-block").forEach(function (block) {
        var blockSport = block.getAttribute("data-sport");
        var on = sport === "all" || blockSport === sport;
        block.hidden = !on;
        if (!on) return;
        found = true;

        /* Single sport: expand that category; All: keep collapsed list view */
        if (sport === "all") {
          block.classList.add("is-collapsed");
          var allHead = block.querySelector(".rs-sport-head");
          if (allHead) allHead.setAttribute("aria-expanded", "false");
        } else {
          block.classList.remove("is-collapsed");
          var head = block.querySelector(".rs-sport-head");
          if (head) head.setAttribute("aria-expanded", "true");
        }
      });

      if (emptyEl) emptyEl.hidden = found;

      /* Desktop: keep football expanded when it is the selected sport with data */
      if (!isMobile() && sport === "football") {
        var fb = document.querySelector('.rs-sport-block[data-sport="football"]');
        if (fb) {
          fb.classList.remove("is-collapsed");
          var fbHead = fb.querySelector(".rs-sport-head");
          if (fbHead) fbHead.setAttribute("aria-expanded", "true");
        }
      }

      if (opts && opts.toast) toast(name + " selected");
    }

    $$("[data-rs-chip]").forEach(function (chip) {
      chip.addEventListener("click", function () {
        var sport = chip.getAttribute("data-rs-chip") || "all";
        selectSport(sport, {
          name: chip.querySelector("span") ? chip.querySelector("span").textContent : sport,
          toast: false,
        });
      });
    });

    $$(".rs-sport-item").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var sport = btn.getAttribute("data-sport") || "football";
        var acc = btn.closest(".rs-sport-acc");

        if (!isMobile() && acc) {
          var opening = !acc.classList.contains("is-open");
          $$(".rs-sport-acc.is-open").forEach(function (other) {
            if (other === acc) return;
            other.classList.remove("is-open");
            var otherBtn = other.querySelector(".rs-sport-item");
            if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
          });
          acc.classList.toggle("is-open", opening);
          btn.setAttribute("aria-expanded", opening ? "true" : "false");
        }

        selectSport(sport, {
          name: btn.getAttribute("data-sport-name") || "Sport",
          toast: true,
        });
        if (isMobile()) {
          var sidebar = $("#left-sidebar");
          var backdrop = $("#drawer-backdrop");
          if (sidebar) sidebar.classList.remove("is-open");
          if (backdrop) backdrop.hidden = true;
        }
      });
    });

    $$(".rs-league-item").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var league = btn.getAttribute("data-league") || "League";
        var acc = btn.closest(".rs-sport-acc");
        var sport = acc ? acc.getAttribute("data-sport") : null;
        if (sport) {
          selectSport(sport, {
            name: acc.getAttribute("data-sport-name") || sport,
            toast: false,
          });
        }
        toast(league + " (demo)");
      });
    });

    /* Mobile default: All categories visible */
    if (isMobile()) {
      selectSport("all");
    } else {
      selectSport("football");
    }

    $$(".rs-sport-head").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var block = btn.closest(".rs-sport-block");
        if (!block) return;
        var open = block.classList.contains("is-collapsed");
        block.classList.toggle("is-collapsed", !open);
        btn.setAttribute("aria-expanded", open ? "true" : "false");
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

    function bindDate(btn) {
      if (!btn) return;
      btn.addEventListener("click", function () {
        toast("Date picker (demo)");
      });
    }
    bindDate($("#rs-date-btn"));
    bindDate($("#rs-date-btn-mobile"));

    var hours = $("#rs-hours-btn");
    if (hours) {
      hours.addEventListener("click", function () {
        hours.classList.toggle("is-active");
        hours.setAttribute("aria-pressed", hours.classList.contains("is-active") ? "true" : "false");
      });
    }

    var settings = $("#rs-settings-btn");
    var mobileFilter = $("#rs-mobile-filter");
    var filtersSheet = $("#rs-filters-sheet");
    var filtersClose = $("#rs-filters-close");
    var sportsSheet = $("#rs-sports-sheet");
    var sportsClose = $("#rs-sports-close");

    function syncMobileFiltersFromDesktop() {
      $$("[data-rs-opt]").forEach(function (input) {
        var desk = $("#" + input.getAttribute("data-rs-opt"));
        if (desk) input.checked = desk.checked;
      });
    }

    function openSheet(sheet, opener) {
      if (!sheet || !isMobile()) return;
      sheet.hidden = false;
      requestAnimationFrame(function () {
        sheet.classList.add("is-open");
      });
      document.body.classList.add("rs-filters-open");
      if (opener) opener.setAttribute("aria-expanded", "true");
    }

    function closeSheet(sheet, opener) {
      if (!sheet) return;
      sheet.classList.remove("is-open");
      if (opener) opener.setAttribute("aria-expanded", "false");
      var anyOpen =
        (filtersSheet && filtersSheet.classList.contains("is-open")) ||
        (sportsSheet && sportsSheet.classList.contains("is-open"));
      if (!anyOpen) document.body.classList.remove("rs-filters-open");
      window.setTimeout(function () {
        if (!sheet.classList.contains("is-open")) sheet.hidden = true;
      }, 240);
    }

    function openFiltersSheet() {
      syncMobileFiltersFromDesktop();
      openSheet(filtersSheet, settings);
    }

    function closeFiltersSheet() {
      closeSheet(filtersSheet, settings);
    }

    function syncSportsChecks(sport) {
      $$("[data-rs-scat]").forEach(function (input) {
        var key = input.getAttribute("data-rs-scat");
        if (sport === "all") {
          input.checked = key === "all";
        } else if (Array.isArray(sport)) {
          input.checked = sport.indexOf(key) !== -1;
        } else {
          input.checked = key === sport;
        }
      });
    }

    function openSportsSheet() {
      syncSportsChecks(activeSportFilter);
      openSheet(sportsSheet, mobileFilter);
    }

    function closeSportsSheet() {
      closeSheet(sportsSheet, mobileFilter);
    }

    function applySportsCategoryFilter() {
      var allInput = $('[data-rs-scat="all"]');
      var picked = $$("[data-rs-scat]")
        .filter(function (input) {
          return input.getAttribute("data-rs-scat") !== "all" && input.checked;
        })
        .map(function (input) {
          return input.getAttribute("data-rs-scat");
        });

      if ((allInput && allInput.checked) || picked.length === 0) {
        if (allInput) allInput.checked = true;
        $$("[data-rs-scat]").forEach(function (input) {
          if (input.getAttribute("data-rs-scat") !== "all") input.checked = false;
        });
        activeSportFilter = "all";
        selectSport("all");
        return;
      }

      if (allInput) allInput.checked = false;

      if (picked.length === 1) {
        activeSportFilter = picked[0];
        selectSport(picked[0], { name: picked[0] });
        return;
      }

      activeSportFilter = picked;
      $$("[data-rs-chip]").forEach(function (c) {
        c.classList.toggle("is-active", c.getAttribute("data-rs-chip") === "all");
      });
      var found = false;
      $$(".rs-sport-block").forEach(function (block) {
        var on = picked.indexOf(block.getAttribute("data-sport")) !== -1;
        block.hidden = !on;
        if (!on) return;
        found = true;
        block.classList.add("is-collapsed");
        var head = block.querySelector(".rs-sport-head");
        if (head) head.setAttribute("aria-expanded", "false");
      });
      if (emptyEl) emptyEl.hidden = found;
    }

    $$("[data-rs-opt]").forEach(function (input) {
      input.addEventListener("change", function () {
        var deskId = input.getAttribute("data-rs-opt");
        var desk = deskId ? $("#" + deskId) : null;
        if (desk) {
          desk.checked = input.checked;
          desk.dispatchEvent(new Event("change", { bubbles: true }));
        }
      });
    });

    $$("[data-rs-scat]").forEach(function (input) {
      input.addEventListener("change", function () {
        var key = input.getAttribute("data-rs-scat");
        if (key === "all" && input.checked) {
          $$("[data-rs-scat]").forEach(function (other) {
            if (other !== input) other.checked = false;
          });
        } else if (key !== "all" && input.checked) {
          var allBox = $('[data-rs-scat="all"]');
          if (allBox) allBox.checked = false;
        } else if (key !== "all" && !input.checked) {
          var any = $$("[data-rs-scat]").some(function (other) {
            return other.getAttribute("data-rs-scat") !== "all" && other.checked;
          });
          if (!any) {
            var allOnly = $('[data-rs-scat="all"]');
            if (allOnly) allOnly.checked = true;
          }
        }
        applySportsCategoryFilter();
      });
    });

    if (settings) {
      settings.setAttribute("aria-haspopup", "dialog");
      settings.setAttribute("aria-controls", "rs-filters-sheet");
      settings.setAttribute("aria-expanded", "false");
      settings.addEventListener("click", openFiltersSheet);
    }

    if (mobileFilter) {
      mobileFilter.setAttribute("aria-haspopup", "dialog");
      mobileFilter.setAttribute("aria-controls", "rs-sports-sheet");
      mobileFilter.setAttribute("aria-expanded", "false");
      mobileFilter.addEventListener("click", openSportsSheet);
    }

    if (filtersClose) {
      filtersClose.addEventListener("click", closeFiltersSheet);
    }

    if (sportsClose) {
      sportsClose.addEventListener("click", closeSportsSheet);
    }

    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      if (sportsSheet && sportsSheet.classList.contains("is-open")) {
        closeSportsSheet();
        return;
      }
      if (filtersSheet && filtersSheet.classList.contains("is-open")) {
        closeFiltersSheet();
      }
    });

    setTab("sports");
  });
})();
