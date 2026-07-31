/* Desktop ≤900 full menu — mirrors mobile mh-cs-menu; links target desktop pages */
(function () {
  "use strict";

  var ICO = "mobile/assets/icons/";
  var ICO_PROF = ICO + "profile/";
  var ICO_MENU = ICO + "menu/";

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function $$(sel, root) {
    return Array.from((root || document).querySelectorAll(sel));
  }

  function isMobileViewport() {
    return window.matchMedia("(max-width: 900px)").matches;
  }

  function isMobileSite() {
    return /\/mobile(?:\/|$)/i.test(window.location.pathname || "");
  }

  function isLoggedIn() {
    if (window.AuthModals && typeof window.AuthModals.isLoggedIn === "function") {
      return !!window.AuthModals.isLoggedIn();
    }
    return document.body.classList.contains("is-logged-in");
  }

  function item(href, icon, label, extra) {
    return (
      "<li>" +
      '<a href="' +
      href +
      '">' +
      '<span class="ds-menu__ico"><img src="' +
      icon +
      '" alt="" /></span>' +
      '<span class="ds-menu__label">' +
      label +
      "</span>" +
      (extra || "") +
      "</a></li>"
    );
  }

  function btnItem(attrs, icon, label, extra) {
    return (
      "<li>" +
      "<button type=\"button\" " +
      attrs +
      ">" +
      '<span class="ds-menu__ico"><img src="' +
      icon +
      '" alt="" /></span>' +
      '<span class="ds-menu__label">' +
      label +
      "</span>" +
      (extra || "") +
      "</button></li>"
    );
  }

  function buildMarkup() {
    var badge = '<span class="ds-menu__badge">TOP</span>';
    var chev = '<img class="ds-menu__chev" src="' + ICO + 'icon-chevron-down.svg" alt="" />';
    var alert =
      '<span class="ds-menu__alert" aria-label="Attention required"><img src="' +
      ICO_PROF +
      'pf-alert.svg" alt="" width="14" height="14" /></span>';

    return (
      '<div class="ds-menu-sheet" id="ds-menu-sheet" hidden>' +
      '<div class="ds-menu-sheet__backdrop" data-ds-menu-close></div>' +
      '<div class="ds-menu" role="dialog" aria-modal="true" aria-label="Menu">' +
      '<div class="ds-menu__top">' +
      '<button type="button" class="ds-menu__clock" data-ds-menu-clock aria-label="Time">' +
      "<span data-ds-clock>00:00</span>" +
      '<img src="' +
      ICO +
      'icon-chevron-down.svg" alt="" width="10" height="10" />' +
      "</button>" +
      '<button type="button" class="ds-menu__lang" data-ds-menu-lang aria-label="Select language">' +
      '<img class="ds-menu__lang-flag" src="assets/icons/flag-my.svg" alt="" width="16" height="12" data-ds-lang-flag />' +
      "<span data-ds-lang-code>EN</span>" +
      '<img src="' +
      ICO +
      'icon-chevron-down.svg" alt="" width="10" height="10" />' +
      "</button>" +
      '<span class="ds-menu__spacer"></span>' +
      '<button type="button" class="ds-menu__settings" data-ds-menu-settings aria-label="Settings">' +
      '<img src="' +
      ICO +
      'icon-settings.svg" alt="" width="18" height="18" />' +
      "</button>" +
      '<button type="button" class="ds-menu__close" data-ds-menu-close aria-label="Close">' +
      '<img src="' +
      ICO +
      'icon-close.svg" alt="" width="14" height="14" />' +
      "</button>" +
      "</div>" +
      '<div class="ds-menu__wallet" data-ds-menu-wallet>' +
      '<div class="ds-menu__wallet-select">' +
      '<button type="button" class="ds-menu__balance" data-ds-wallet-toggle aria-expanded="false" aria-haspopup="listbox" aria-label="Select account">' +
      '<img src="' +
      ICO_MENU +
      'wallet.svg" alt="" width="16" height="16" />' +
      "<span data-ds-wallet-label>0 MYR</span>" +
      '<img src="' +
      ICO +
      'icon-chevron-down.svg" alt="" width="10" height="10" />' +
      "</button>" +
      '<ul class="ds-menu__wallet-menu" data-ds-wallet-menu role="listbox" hidden>' +
      "<li><button type=\"button\" class=\"ds-menu__wallet-option is-active\" role=\"option\" aria-selected=\"true\" data-ds-wallet-option data-label=\"0 MYR\">" +
      '<span class="ds-menu__wallet-option-name">Main account (MYR)</span>' +
      '<span class="ds-menu__wallet-option-value">0</span></button></li>' +
      "<li><button type=\"button\" class=\"ds-menu__wallet-option\" role=\"option\" aria-selected=\"false\" data-ds-wallet-option data-label=\"0 GW\">" +
      '<span class="ds-menu__wallet-option-name">Game wallet</span>' +
      '<span class="ds-menu__wallet-option-value">0</span></button></li>' +
      "<li><button type=\"button\" class=\"ds-menu__wallet-option\" role=\"option\" aria-selected=\"false\" data-ds-wallet-option data-label=\"0\">" +
      '<span class="ds-menu__wallet-option-name">Unsettled bets</span>' +
      '<span class="ds-menu__wallet-option-value">0</span></button></li>' +
      "</ul></div>" +
      '<a href="deposit.html" class="ds-menu__deposit">Deposit</a>' +
      "</div>" +
      '<label class="ds-menu__search">' +
      '<img src="' +
      ICO +
      'sp-search.svg" alt="" width="16" height="16" />' +
      '<input type="search" placeholder="Search menu" autocomplete="off" data-ds-menu-search />' +
      "</label>" +
      '<ul class="ds-menu__list" data-ds-menu-list>' +
      item("index.html", ICO + "icon-home.svg", "Main page") +
      item("national-team.html", ICO + "tab-menu.svg", "Sports") +
      item("multi-live.html", ICO + "tab-live.svg", "Live") +
      item("national-team.html", ICO + "t20.svg", "T20 Blast", badge) +
      item("esports.html", ICO_MENU + "gamepad.svg", "Esports") +
      item("favourites.html", ICO + "star.svg", "Favorites") +
      item("results.html", ICO + "icon-clock.svg", "Results") +
      item("results.html", ICO + "ei-stats.svg", "Statistics") +
      item("big-tournaments.html", ICO + "bobt.svg", "Bet on Big Tournaments") +
      "</ul>" +
      '<h2 class="ds-menu__section-title">Casino</h2>' +
      '<ul class="ds-menu__list" data-ds-menu-list>' +
      item("casino.html", ICO + "casino.svg", "Casino", chev) +
      item("live-casino.html", "mobile/assets/casino/categories/live-casino.svg", "Live Casino") +
      "</ul>" +
      '<h2 class="ds-menu__section-title">Games</h2>' +
      '<ul class="ds-menu__list" data-ds-menu-list>' +
      item("world-flight-26.html", ICO + "icon-dice.svg", "1xGames") +
      "</ul>" +
      '<h2 class="ds-menu__section-title">Promo</h2>' +
      '<ul class="ds-menu__list" data-ds-menu-list>' +
      item("promo.html", ICO_PROF + "pf-promotions.svg", "All promotions") +
      "</ul>" +
      '<div class="ds-menu__account" data-ds-menu-account>' +
      '<h2 class="ds-menu__section-title">My Account</h2>' +
      '<ul class="ds-menu__list" data-ds-menu-list>' +
      item("bet-history.html", ICO_PROF + "pf-bet-history.svg", "Bet history") +
      item("deposit.html", ICO_PROF + "pf-deposit.svg", "Make a deposit") +
      item("withdraw.html", ICO_PROF + "pf-withdraw.svg", "Withdraw funds") +
      item("transaction-history.html", ICO_PROF + "pf-transfer.svg", "Transaction history") +
      item("personal-profile.html", ICO_PROF + "pf-user.svg", "Personal profile", alert) +
      item("security.html", ICO_PROF + "pf-lock.svg", "Security", alert) +
      "</ul></div>" +
      '<h2 class="ds-menu__section-title">Extra</h2>' +
      '<ul class="ds-menu__list" data-ds-menu-list>' +
      item("referral-invite.html", ICO_PROF + "pf-referral.svg", "Referral") +
      item("membership-invite.html", ICO_PROF + "pf-membership.svg", "Membership") +
      item("rebate-invite.html", ICO_PROF + "pf-rebate.svg", "Rebate") +
      item("daily-checkin.html", ICO_PROF + "pf-checkin.svg", "Daily check in") +
      item("promo.html", ICO_PROF + "pf-promotions.svg", "Promotions") +
      item("live-chat.html", ICO_PROF + "pf-chat.svg", "Live chat") +
      '<li class="ds-menu__acc-item" data-ds-menu-acc-item>' +
      '<button type="button" class="ds-menu__acc-btn" data-ds-menu-acc aria-expanded="false">' +
      '<span class="ds-menu__ico"><img src="' +
      ICO_MENU +
      'info.svg" alt="" /></span>' +
      '<span class="ds-menu__label">Information</span>' +
      chev +
      "</button>" +
      '<ul class="ds-menu__sub" hidden>' +
      '<li><a href="information-center.html">About us</a></li>' +
      '<li><a href="information-center.html">Terms and Conditions</a></li>' +
      '<li><a href="deposit.html">Payment methods</a></li>' +
      "</ul></li>" +
      item("partnership.html", "assets/icons/partnership/icon-shield.svg", "Partnership") +
      item("#", ICO_MENU + "phone.svg", "Mobile application") +
      item("#", ICO_MENU + "other-apps.svg", "Other apps") +
      '<li class="ds-menu__logout-row" data-ds-menu-logout>' +
      '<button type="button" data-auth-open="logout">' +
      '<span class="ds-menu__ico"><img src="' +
      ICO_PROF +
      'pf-logout.svg" alt="" /></span>' +
      '<span class="ds-menu__label">Log out</span>' +
      "</button></li>" +
      "</ul>" +
      '<div class="ds-menu__lang-panel" id="ds-lang-panel" hidden role="dialog" aria-modal="true" aria-labelledby="ds-lang-title">' +
      '<div class="ds-menu__lang-subbar">' +
      '<button type="button" class="ds-menu__lang-back" data-ds-close-lang aria-label="Back to menu">' +
      '<img src="' +
      ICO +
      'sp-back.svg" alt="" width="10" height="16" />' +
      "</button>" +
      '<h2 class="ds-menu__lang-title" id="ds-lang-title">Select language</h2>' +
      "</div>" +
      '<label class="ds-menu__lang-search">' +
      '<img src="' +
      ICO +
      'sp-search.svg" alt="" width="16" height="16" />' +
      '<input type="search" placeholder="Search" autocomplete="off" data-ds-lang-search />' +
      "</label>" +
      '<ul class="ds-menu__lang-list" role="listbox" aria-label="Languages" data-ds-lang-list></ul>' +
      "</div>" +
      "</div></div>"
    );
  }

  var LANG_KEY = "header-lang";
  var FLAG_BASE = "assets/images/account/flags/";
  var languages = [
    { code: "en", label: "English", flag: FLAG_BASE + "lang-en.svg" },
    { code: "ms", label: "Bahasa Melayu", flag: FLAG_BASE + "lang-ms.svg" },
    { code: "cn", label: "汉语", flag: FLAG_BASE + "lang-cn.svg" },
  ];

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
  }

  function getSavedLangCode() {
    try {
      return sessionStorage.getItem(LANG_KEY) || "en";
    } catch (e) {
      return "en";
    }
  }

  function applyLangToMenu(sheet, item) {
    if (!sheet || !item) return;
    var flag = $("[data-ds-lang-flag]", sheet);
    var code = $("[data-ds-lang-code]", sheet);
    if (flag) flag.src = item.flag;
    if (code) code.textContent = String(item.code).toUpperCase();
    $$("[data-ds-lang-option]", sheet).forEach(function (row) {
      var on = row.getAttribute("data-lang") === item.code;
      row.classList.toggle("is-selected", on);
      row.setAttribute("aria-selected", on ? "true" : "false");
    });
    /* Keep header lang in sync for desktop wide view */
    var headerFlag = $("#header-lang-flag");
    var headerLabel = $("#header-lang-label");
    var headerBtn = $("#header-lang-btn");
    if (headerFlag) headerFlag.src = item.flag;
    if (headerLabel) headerLabel.textContent = item.label;
    if (headerBtn) headerBtn.setAttribute("data-lang", item.code);
    $$(".header-lang-option").forEach(function (opt) {
      var on = opt.getAttribute("data-lang") === item.code;
      opt.classList.toggle("is-active", on);
      opt.setAttribute("aria-selected", on ? "true" : "false");
    });
    try {
      sessionStorage.setItem(LANG_KEY, item.code);
    } catch (e) { /* ignore */ }
  }

  function renderLangList(sheet) {
    var list = $("[data-ds-lang-list]", sheet);
    if (!list) return;
    var saved = getSavedLangCode();
    list.innerHTML = languages
      .map(function (item) {
        var on = item.code === saved;
        return (
          "<li>" +
          '<button type="button" class="ds-menu__lang-row' +
          (on ? " is-selected" : "") +
          '" role="option" data-ds-lang-option data-lang="' +
          esc(item.code) +
          '" data-flag="' +
          esc(item.flag) +
          '" data-label="' +
          esc(item.label) +
          '" aria-selected="' +
          (on ? "true" : "false") +
          '">' +
          '<span class="ds-menu__lang-flag-wrap"><img src="' +
          esc(item.flag) +
          '" alt="" /></span>' +
          '<span class="ds-menu__lang-code">' +
          esc(String(item.code).toUpperCase()) +
          "</span>" +
          '<span class="ds-menu__lang-name">' +
          esc(item.label) +
          "</span>" +
          "</button></li>"
        );
      })
      .join("");
    var current = languages.find(function (l) {
      return l.code === saved;
    }) || languages[0];
    applyLangToMenu(sheet, current);
  }

  function openLangPanel(sheet) {
    var panel = $("#ds-lang-panel", sheet);
    if (!panel) return;
    panel.hidden = false;
    panel.classList.add("is-open");
    sheet.querySelector(".ds-menu") &&
      sheet.querySelector(".ds-menu").classList.add("is-lang-open");
    var search = $("[data-ds-lang-search]", panel);
    if (search) {
      search.value = "";
      filterLangList(sheet, "");
      search.focus();
    }
  }

  function closeLangPanel(sheet) {
    var panel = $("#ds-lang-panel", sheet);
    if (!panel) return;
    panel.classList.remove("is-open");
    panel.hidden = true;
    sheet.querySelector(".ds-menu") &&
      sheet.querySelector(".ds-menu").classList.remove("is-lang-open");
  }

  function filterLangList(sheet, query) {
    var q = String(query || "")
      .trim()
      .toLowerCase();
    $$("[data-ds-lang-option]", sheet).forEach(function (row) {
      var label = (row.getAttribute("data-label") || "") + " " + (row.getAttribute("data-lang") || "");
      row.closest("li").hidden = q ? label.toLowerCase().indexOf(q) === -1 : false;
    });
  }

  function loadLanguages(sheet) {
    renderLangList(sheet);
    fetch(FLAG_BASE + "languages.json")
      .then(function (r) {
        return r.ok ? r.json() : Promise.reject();
      })
      .then(function (list) {
        if (Array.isArray(list) && list.length) {
          languages = list.map(function (row) {
            return {
              code: row.code,
              label: row.label || row.name || row.code,
              flag: FLAG_BASE + (row.file || "lang-" + row.code + ".svg"),
            };
          });
          renderLangList(sheet);
        }
      })
      .catch(function () { /* keep fallback */ });
  }

  function tickClock(sheet) {
    var el = $("[data-ds-clock]", sheet);
    if (!el) return;
    var now = new Date();
    el.textContent =
      String(now.getHours()).padStart(2, "0") +
      ":" +
      String(now.getMinutes()).padStart(2, "0");
  }

  function syncAuthVisibility(sheet) {
    if (!sheet) return;
    var loggedIn = isLoggedIn();
    sheet.classList.toggle("is-logged-in", loggedIn);
  }

  function filterMenu(sheet, query) {
    var q = String(query || "")
      .trim()
      .toLowerCase();
    $$("[data-ds-menu-list] > li", sheet).forEach(function (li) {
      if (li.classList.contains("ds-menu__logout-row")) {
        li.hidden = false;
        return;
      }
      var label = li.querySelector(".ds-menu__label");
      var text = (label && label.textContent) || li.textContent || "";
      li.hidden = q ? text.toLowerCase().indexOf(q) === -1 : false;
    });
    $$(".ds-menu__section-title", sheet).forEach(function (title) {
      var next = title.nextElementSibling;
      if (!next || !next.matches("[data-ds-menu-list], .ds-menu__account")) {
        title.hidden = !!q;
        return;
      }
      var list = next.matches(".ds-menu__account")
        ? next.querySelector("[data-ds-menu-list]")
        : next;
      var visible = list
        ? Array.from(list.children).some(function (li) {
            return li.tagName === "LI" && !li.hidden;
          })
        : false;
      title.hidden = q ? !visible : false;
      if (next.matches(".ds-menu__account")) next.hidden = q ? !visible : false;
    });
  }

  function ensure() {
    var sheet = $("#ds-menu-sheet");
    if (sheet) return sheet;

    document.body.insertAdjacentHTML("beforeend", buildMarkup());
    sheet = $("#ds-menu-sheet");
    if (!sheet) return null;

    tickClock(sheet);
    setInterval(function () {
      tickClock(sheet);
    }, 30000);

    sheet.addEventListener("click", function (e) {
      if (e.target.closest("[data-ds-close-lang]")) {
        closeLangPanel(sheet);
        return;
      }

      if (e.target.closest("[data-ds-menu-close]")) {
        closeLangPanel(sheet);
        close();
        return;
      }

      if (e.target.closest("[data-ds-menu-lang]")) {
        openLangPanel(sheet);
        return;
      }

      var langOpt = e.target.closest("[data-ds-lang-option]");
      if (langOpt) {
        var langItem = languages.find(function (l) {
          return l.code === langOpt.getAttribute("data-lang");
        });
        if (langItem) {
          applyLangToMenu(sheet, langItem);
          closeLangPanel(sheet);
          if (typeof window.showToast === "function") {
            window.showToast("Language set to " + langItem.label + " (demo)");
          }
        }
        return;
      }

      if (e.target.closest("[data-ds-menu-settings]")) {
        if (typeof window.showToast === "function") window.showToast("Settings");
        return;
      }

      var walletToggle = e.target.closest("[data-ds-wallet-toggle]");
      if (walletToggle) {
        var wrap = walletToggle.closest(".ds-menu__wallet-select");
        var menu = $("[data-ds-wallet-menu]", wrap);
        var open = menu && menu.hidden;
        if (menu) menu.hidden = !open;
        wrap && wrap.classList.toggle("is-open", open);
        walletToggle.setAttribute("aria-expanded", open ? "true" : "false");
        return;
      }

      var walletOpt = e.target.closest("[data-ds-wallet-option]");
      if (walletOpt) {
        var select = walletOpt.closest(".ds-menu__wallet-select");
        $$("[data-ds-wallet-option]", select).forEach(function (opt) {
          opt.classList.toggle("is-active", opt === walletOpt);
          opt.setAttribute("aria-selected", opt === walletOpt ? "true" : "false");
        });
        var label = $("[data-ds-wallet-label]", select);
        if (label) label.textContent = walletOpt.getAttribute("data-label") || "0 MYR";
        var wMenu = $("[data-ds-wallet-menu]", select);
        if (wMenu) wMenu.hidden = true;
        select && select.classList.remove("is-open");
        return;
      }

      var accBtn = e.target.closest("[data-ds-menu-acc]");
      if (accBtn) {
        var itemEl = accBtn.closest("[data-ds-menu-acc-item]");
        var sub = itemEl && itemEl.querySelector(".ds-menu__sub");
        var expanded = accBtn.getAttribute("aria-expanded") === "true";
        accBtn.setAttribute("aria-expanded", expanded ? "false" : "true");
        itemEl && itemEl.classList.toggle("is-open", !expanded);
        if (sub) sub.hidden = expanded;
        return;
      }

      var hashLink = e.target.closest('a[href="#"]');
      if (hashLink && sheet.contains(hashLink)) {
        e.preventDefault();
        if (typeof window.showToast === "function") {
          window.showToast((hashLink.querySelector(".ds-menu__label") || hashLink).textContent.trim());
        }
      }
    });

    var search = $("[data-ds-menu-search]", sheet);
    if (search) {
      search.addEventListener("input", function () {
        filterMenu(sheet, search.value);
      });
    }

    var langSearch = $("[data-ds-lang-search]", sheet);
    if (langSearch) {
      langSearch.addEventListener("input", function () {
        filterLangList(sheet, langSearch.value);
      });
    }

    loadLanguages(sheet);
    syncAuthVisibility(sheet);
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      var panel = $("#ds-lang-panel", sheet);
      if (panel && !panel.hidden) {
        closeLangPanel(sheet);
        e.stopPropagation();
        return;
      }
      if (isOpen()) close();
    });
    try {
      var mo = new MutationObserver(function () {
        syncAuthVisibility(sheet);
      });
      mo.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    } catch (e) { /* ignore */ }
    return sheet;
  }

  function isOpen() {
    var sheet = $("#ds-menu-sheet");
    return !!(sheet && !sheet.hidden && sheet.classList.contains("is-open"));
  }

  function dismissOtherDrawers() {
    var left = $("#left-sidebar");
    var right = $("#right-sidebar");
    var nav = $("#header-bottom");
    var backdrop = $("#drawer-backdrop");
    if (left) left.classList.remove("open");
    if (right) right.classList.remove("is-open");
    if (nav) nav.classList.remove("is-open");
    if (backdrop) {
      backdrop.hidden = true;
      backdrop.classList.remove("is-visible");
    }
    document.body.classList.remove("drawer-open");
    $("#mobile-sports-btn")?.setAttribute("aria-expanded", "false");
    $("#mobile-betslip-btn")?.setAttribute("aria-expanded", "false");
  }

  function open() {
    if (!isMobileViewport()) return;
    if (isMobileSite()) return;
    var sheet = ensure();
    if (!sheet) return;
    dismissOtherDrawers();
    syncAuthVisibility(sheet);
    tickClock(sheet);
    sheet.hidden = false;
    requestAnimationFrame(function () {
      sheet.classList.add("is-open");
    });
    document.body.classList.add("ds-menu-open");
    $("#mobile-menu-btn")?.setAttribute("aria-expanded", "true");
    $("#mobile-menu-tab")?.setAttribute("aria-expanded", "true");
    var search = $("[data-ds-menu-search]", sheet);
    if (search) {
      search.value = "";
      filterMenu(sheet, "");
    }
  }

  function close() {
    var sheet = $("#ds-menu-sheet");
    if (!sheet) return;
    closeLangPanel(sheet);
    sheet.classList.remove("is-open");
    sheet.hidden = true;
    document.body.classList.remove("ds-menu-open");
    $("#mobile-menu-btn")?.setAttribute("aria-expanded", "false");
    $("#mobile-menu-tab")?.setAttribute("aria-expanded", "false");
    var select = $(".ds-menu__wallet-select.is-open", sheet);
    if (select) {
      select.classList.remove("is-open");
      var menu = $("[data-ds-wallet-menu]", select);
      if (menu) menu.hidden = true;
    }
  }

  function toggle() {
    if (isOpen()) close();
    else open();
  }

  window.DesktopFullMenu = {
    ensure: ensure,
    open: open,
    close: close,
    toggle: toggle,
    isOpen: isOpen,
    syncAuth: function () {
      syncAuthVisibility($("#ds-menu-sheet"));
    },
  };

  function wireGlobalChrome() {
    if (wireGlobalChrome.done || isMobileSite()) return;
    wireGlobalChrome.done = true;

    document.addEventListener(
      "click",
      function (e) {
        if (!isMobileViewport()) return;

        var menuTrigger = e.target.closest("#mobile-menu-btn, #mobile-menu-tab");
        if (menuTrigger) {
          e.preventDefault();
          e.stopImmediatePropagation();
          toggle();
          return;
        }

        if (
          e.target.closest(
            "#mobile-sports-btn, #mobile-betslip-btn, #drawer-backdrop, #left-drawer-close, #right-drawer-close"
          )
        ) {
          close();
        }
      },
      true
    );

    window.addEventListener("resize", function () {
      if (!isMobileViewport()) close();
    });
  }

  function boot() {
    if (isMobileSite()) return;
    if (!$("#mobile-menu-btn") && !$("#mobile-menu-tab")) return;
    ensure();
    wireGlobalChrome();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
