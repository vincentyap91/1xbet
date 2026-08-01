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
      '<button type="button" class="ds-menu__clock" data-ds-menu-clock aria-label="Time zone" aria-haspopup="dialog">' +
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
      '<img src="assets/icons/icon-settings.svg" alt="" width="18" height="18" />' +
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
      item("search.html", ICO + "sp-search.svg", "Search") +
      item("results.html", ICO + "icon-clock.svg", "Results") +
      item("results.html", ICO + "ei-stats.svg", "Statistics") +
      item("big-tournaments.html", ICO + "bobt.svg", "Bet on Big Tournaments") +
      "</ul>" +
      '<h2 class="ds-menu__section-title">Casino</h2>' +
      '<ul class="ds-menu__list" data-ds-menu-list>' +
      item("casino.html", ICO + "casino.svg", "Slots") +
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
      buildSettingsPanelHtml() +
      buildTimezonePanelHtml() +
      "</div></div>"
    );
  }

  var TZ_KEY = "ds-timezone";
  var TIMEZONES = [
    { id: "utc-12", offset: "-12:00", offsetMin: -720, label: "International Date Line West" },
    { id: "utc-11", offset: "-11:00", offsetMin: -660, label: "Coordinated Universal Time-11" },
    { id: "utc-10", offset: "-10:00", offsetMin: -600, label: "Hawaii" },
    { id: "utc-09", offset: "-09:00", offsetMin: -540, label: "Alaska" },
    { id: "utc-08-baja", offset: "-08:00", offsetMin: -480, label: "Baja California" },
    { id: "utc-08-pt", offset: "-08:00", offsetMin: -480, label: "Pacific Time (US & Canada)" },
    { id: "utc-07-az", offset: "-07:00", offsetMin: -420, label: "Arizona" },
    { id: "utc-07-mx", offset: "-07:00", offsetMin: -420, label: "Chihuahua, La Paz, Mazatlan" },
    { id: "utc-07-mt", offset: "-07:00", offsetMin: -420, label: "Mountain Time (US & Canada)" },
    { id: "utc-06-ca", offset: "-06:00", offsetMin: -360, label: "Central America" },
    { id: "utc-06-ct", offset: "-06:00", offsetMin: -360, label: "Central Time (US & Canada)" },
    { id: "utc-06-mx", offset: "-06:00", offsetMin: -360, label: "Guadalajara, Mexico City, Monterrey" },
    { id: "utc-06-sk", offset: "-06:00", offsetMin: -360, label: "Saskatchewan" },
    { id: "utc-05-sa", offset: "-05:00", offsetMin: -300, label: "Bogota, Lima, Quito" },
    { id: "utc-05-et", offset: "-05:00", offsetMin: -300, label: "Eastern Time (US & Canada)" },
    { id: "utc-05-in", offset: "-05:00", offsetMin: -300, label: "Indiana (East)" },
    { id: "utc-04", offset: "-04:00", offsetMin: -240, label: "Atlantic Time (Canada)" },
    { id: "utc-03", offset: "-03:00", offsetMin: -180, label: "Brasilia, Buenos Aires, Georgetown" },
    { id: "utc-02", offset: "-02:00", offsetMin: -120, label: "Coordinated Universal Time-02" },
    { id: "utc-01", offset: "-01:00", offsetMin: -60, label: "Azores, Cabo Verde Is." },
    { id: "utc+00", offset: "+00:00", offsetMin: 0, label: "Dublin, Edinburgh, Lisbon, London" },
    { id: "utc+01", offset: "+01:00", offsetMin: 60, label: "Amsterdam, Berlin, Rome, Paris" },
    { id: "utc+02", offset: "+02:00", offsetMin: 120, label: "Athens, Cairo, Helsinki, Istanbul" },
    { id: "utc+03", offset: "+03:00", offsetMin: 180, label: "Baghdad, Kuwait, Riyadh, Moscow" },
    { id: "utc+03-30", offset: "+03:30", offsetMin: 210, label: "Tehran" },
    { id: "utc+04", offset: "+04:00", offsetMin: 240, label: "Abu Dhabi, Muscat, Baku" },
    { id: "utc+04-30", offset: "+04:30", offsetMin: 270, label: "Kabul" },
    { id: "utc+05", offset: "+05:00", offsetMin: 300, label: "Islamabad, Karachi, Tashkent" },
    { id: "utc+05-30", offset: "+05:30", offsetMin: 330, label: "Chennai, Kolkata, Mumbai, New Delhi" },
    { id: "utc+06", offset: "+06:00", offsetMin: 360, label: "Almaty, Dhaka, Astana" },
    { id: "utc+07", offset: "+07:00", offsetMin: 420, label: "Bangkok, Hanoi, Jakarta" },
    { id: "utc+08", offset: "+08:00", offsetMin: 480, label: "China, Hong Kong, Kuala Lumpur, Singapore, Taipei" },
    { id: "utc+09", offset: "+09:00", offsetMin: 540, label: "Osaka, Sapporo, Tokyo, Seoul" },
    { id: "utc+09-30", offset: "+09:30", offsetMin: 570, label: "Adelaide, Darwin" },
    { id: "utc+10", offset: "+10:00", offsetMin: 600, label: "Canberra, Melbourne, Sydney, Brisbane" },
    { id: "utc+11", offset: "+11:00", offsetMin: 660, label: "Solomon Is., New Caledonia" },
    { id: "utc+12", offset: "+12:00", offsetMin: 720, label: "Auckland, Wellington, Fiji" },
  ];

  function getSavedTimezoneId() {
    try {
      return sessionStorage.getItem(TZ_KEY) || "utc+08";
    } catch (e) {
      return "utc+08";
    }
  }

  function getTimezoneById(id) {
    return (
      TIMEZONES.find(function (tz) {
        return tz.id === id;
      }) || TIMEZONES.find(function (tz) {
        return tz.id === "utc+08";
      }) ||
      TIMEZONES[0]
    );
  }

  function buildTimezonePanelHtml() {
    return (
      '<div class="ds-menu__tz-panel" id="ds-tz-panel" hidden role="dialog" aria-modal="true" aria-labelledby="ds-tz-title">' +
      '<div class="ds-tz__subbar">' +
      '<button type="button" class="ds-tz__back" data-ds-close-tz aria-label="Back to menu">' +
      '<img src="' +
      ICO +
      'sp-back.svg" alt="" width="10" height="16" />' +
      "</button>" +
      '<h2 class="ds-tz__title" id="ds-tz-title">Time zone</h2>' +
      "</div>" +
      '<label class="ds-tz__search">' +
      '<img src="' +
      ICO +
      'sp-search.svg" alt="" width="16" height="16" />' +
      '<input type="search" placeholder="Search" autocomplete="off" data-ds-tz-search />' +
      "</label>" +
      '<ul class="ds-tz__list" role="listbox" aria-label="Time zones" data-ds-tz-list></ul>' +
      "</div>"
    );
  }

  function renderTimezoneList(sheet) {
    var list = $("[data-ds-tz-list]", sheet);
    if (!list) return;
    var saved = getSavedTimezoneId();
    list.innerHTML = TIMEZONES.map(function (tz) {
      var on = tz.id === saved;
      return (
        "<li>" +
        '<button type="button" class="ds-tz__row' +
        (on ? " is-selected" : "") +
        '" role="option" aria-selected="' +
        (on ? "true" : "false") +
        '" data-ds-tz-option data-tz-id="' +
        esc(tz.id) +
        '" data-label="' +
        esc("(UTC" + tz.offset + ") " + tz.label) +
        '">' +
        '<span class="ds-tz__copy">' +
        '<span class="ds-tz__offset">(UTC' +
        esc(tz.offset) +
        ")</span>" +
        '<span class="ds-tz__places">' +
        esc(tz.label) +
        "</span></span>" +
        '<span class="ds-tz__radio" aria-hidden="true"></span>' +
        "</button></li>"
      );
    }).join("");
  }

  function filterTimezoneList(sheet, query) {
    var q = String(query || "")
      .trim()
      .toLowerCase();
    $$("[data-ds-tz-option]", sheet).forEach(function (row) {
      var label = row.getAttribute("data-label") || "";
      var li = row.closest("li");
      if (li) li.hidden = q ? label.toLowerCase().indexOf(q) === -1 : false;
    });
  }

  function openTimezonePanel(sheet) {
    var panel = $("#ds-tz-panel", sheet);
    if (!panel) return;
    closeLangPanel(sheet);
    closeSettingsPanel(sheet);
    renderTimezoneList(sheet);
    panel.hidden = false;
    panel.classList.add("is-open");
    sheet.querySelector(".ds-menu") &&
      sheet.querySelector(".ds-menu").classList.add("is-tz-open");
    var search = $("[data-ds-tz-search]", panel);
    if (search) {
      search.value = "";
      filterTimezoneList(sheet, "");
      search.focus();
    }
  }

  function closeTimezonePanel(sheet) {
    var panel = $("#ds-tz-panel", sheet);
    if (!panel) return;
    panel.classList.remove("is-open");
    panel.hidden = true;
    sheet.querySelector(".ds-menu") &&
      sheet.querySelector(".ds-menu").classList.remove("is-tz-open");
  }

  function selectTimezone(sheet, id) {
    var tz = getTimezoneById(id);
    try {
      sessionStorage.setItem(TZ_KEY, tz.id);
    } catch (e) { /* ignore */ }
    $$("[data-ds-tz-option]", sheet).forEach(function (row) {
      var on = row.getAttribute("data-tz-id") === tz.id;
      row.classList.toggle("is-selected", on);
      row.setAttribute("aria-selected", on ? "true" : "false");
    });
    tickClock(sheet);
  }

  var SETTINGS_KEY = "ds-website-settings";
  var SETTINGS_DEFAULT = {
    websiteType: "european",
    oddsFormat: "decimal",
    eventOdds: "none",
    timeFormat: "24",
    other: {
      liveAcc: true,
      accDay: true,
      disable1xZone: false,
      showGameId: false,
      groupByCountry: true,
    },
  };

  function buildSettingsPanelHtml() {
    function section(key, title, body) {
      return (
        '<section class="ds-settings__section is-open" data-ds-settings-section="' +
        key +
        '">' +
        '<button type="button" class="ds-settings__head" data-ds-settings-toggle aria-expanded="true">' +
        "<span>" +
        title +
        "</span>" +
        '<img class="ds-settings__chev" src="' +
        ICO +
        'icon-chevron-down.svg" alt="" width="12" height="12" />' +
        "</button>" +
        '<div class="ds-settings__body">' +
        body +
        "</div></section>"
      );
    }

    function radio(name, value, label, selected, info) {
      return (
        '<label class="ds-settings__option' +
        (selected ? " is-selected" : "") +
        '">' +
        '<input type="radio" name="' +
        name +
        '" value="' +
        value +
        '"' +
        (selected ? " checked" : "") +
        ' data-ds-settings-radio />' +
        '<span class="ds-settings__radio" aria-hidden="true"></span>' +
        '<span class="ds-settings__option-label">' +
        label +
        "</span>" +
        (info
          ? '<button type="button" class="ds-settings__info" data-ds-settings-info aria-label="About ' +
            label.replace(/"/g, "") +
            '"><img src="' +
            ICO +
            'ei-info.svg" alt="" width="16" height="16" /></button>'
          : "") +
        "</label>"
      );
    }

    function check(key, label, checked) {
      return (
        '<label class="ds-settings__option">' +
        '<input type="checkbox" data-ds-settings-check="' +
        key +
        '"' +
        (checked ? " checked" : "") +
        " />" +
        '<span class="ds-settings__check" aria-hidden="true"></span>' +
        '<span class="ds-settings__option-label">' +
        label +
        "</span></label>"
      );
    }

    return (
      '<div class="ds-menu__settings-panel" id="ds-settings-panel" hidden role="dialog" aria-modal="true" aria-labelledby="ds-settings-title">' +
      '<div class="ds-settings__subbar">' +
      '<button type="button" class="ds-settings__back" data-ds-close-settings aria-label="Back to menu">' +
      '<img src="' +
      ICO +
      'sp-back.svg" alt="" width="10" height="16" />' +
      "</button>" +
      '<h2 class="ds-settings__title" id="ds-settings-title">Website settings</h2>' +
      "</div>" +
      '<div class="ds-settings__scroll" data-ds-settings-form>' +
      section(
        "websiteType",
        "Website type",
        radio("ds-website-type", "european", "European view", true, false) +
          radio("ds-website-type", "asian", "Asian view", false, false)
      ) +
      section(
        "oddsFormat",
        "Odds format",
        radio("ds-odds-format", "american", "American +120", false, true) +
          radio("ds-odds-format", "uk", "UK +6/5", false, true) +
          radio("ds-odds-format", "decimal", "Decimal 2.2", true, true) +
          radio("ds-odds-format", "hongkong", "Hong Kong 1.2*", false, false) +
          radio("ds-odds-format", "indonesian", "Indonesian 1.2*", false, false) +
          radio("ds-odds-format", "malaysian", "Malaysian -0.834", false, false)
      ) +
      section(
        "eventOdds",
        "Event odds display",
        radio("ds-event-odds", "none", "Do not collapse", true, false) +
          radio("ds-event-odds", "more4", "Collapse more than 4", false, false) +
          radio("ds-event-odds", "all", "Collapse all by default", false, false)
      ) +
      section(
        "timeFormat",
        "Time format",
        radio("ds-time-format", "24", "24 hour", true, false) +
          radio("ds-time-format", "12", "12 hour", false, false)
      ) +
      section(
        "other",
        "Other",
        check("liveAcc", "LIVE accumulator of the day", true) +
          check("accDay", "Accumulator Of The Day", true) +
          check("disable1xZone", "Disable 1xZone", false) +
          check("showGameId", "Show game ID", false) +
          check("groupByCountry", "Group by country", true)
      ) +
      "</div>" +
      '<div class="ds-settings__footer">' +
      '<button type="button" class="ds-settings__cancel" data-ds-settings-cancel>Cancel</button>' +
      '<button type="button" class="ds-settings__apply" data-ds-settings-apply>Apply</button>' +
      "</div></div>"
    );
  }

  function readSettings() {
    try {
      var raw = sessionStorage.getItem(SETTINGS_KEY);
      if (!raw) return JSON.parse(JSON.stringify(SETTINGS_DEFAULT));
      var parsed = JSON.parse(raw);
      return {
        websiteType: parsed.websiteType || SETTINGS_DEFAULT.websiteType,
        oddsFormat: parsed.oddsFormat || SETTINGS_DEFAULT.oddsFormat,
        eventOdds: parsed.eventOdds || SETTINGS_DEFAULT.eventOdds,
        timeFormat: parsed.timeFormat || SETTINGS_DEFAULT.timeFormat,
        other: Object.assign({}, SETTINGS_DEFAULT.other, parsed.other || {}),
      };
    } catch (e) {
      return JSON.parse(JSON.stringify(SETTINGS_DEFAULT));
    }
  }

  function writeSettings(data) {
    try {
      sessionStorage.setItem(SETTINGS_KEY, JSON.stringify(data));
    } catch (e) { /* ignore */ }
  }

  function applySettingsToForm(panel, data) {
    if (!panel || !data) return;
    var map = {
      "ds-website-type": data.websiteType,
      "ds-odds-format": data.oddsFormat,
      "ds-event-odds": data.eventOdds,
      "ds-time-format": data.timeFormat,
    };
    Object.keys(map).forEach(function (name) {
      $$('input[type="radio"][name="' + name + '"]', panel).forEach(function (input) {
        var on = input.value === map[name];
        input.checked = on;
        var row = input.closest(".ds-settings__option");
        if (row) row.classList.toggle("is-selected", on);
      });
    });
    Object.keys(data.other || {}).forEach(function (key) {
      var input = $('[data-ds-settings-check="' + key + '"]', panel);
      if (input) input.checked = !!data.other[key];
    });
  }

  function collectSettingsFromForm(panel) {
    function radioVal(name, fallback) {
      var el = $('input[type="radio"][name="' + name + '"]:checked', panel);
      return el ? el.value : fallback;
    }
    var other = {};
    Object.keys(SETTINGS_DEFAULT.other).forEach(function (key) {
      var input = $('[data-ds-settings-check="' + key + '"]', panel);
      other[key] = !!(input && input.checked);
    });
    return {
      websiteType: radioVal("ds-website-type", SETTINGS_DEFAULT.websiteType),
      oddsFormat: radioVal("ds-odds-format", SETTINGS_DEFAULT.oddsFormat),
      eventOdds: radioVal("ds-event-odds", SETTINGS_DEFAULT.eventOdds),
      timeFormat: radioVal("ds-time-format", SETTINGS_DEFAULT.timeFormat),
      other: other,
    };
  }

  function openSettingsPanel(sheet) {
    var panel = $("#ds-settings-panel", sheet);
    if (!panel) return;
    closeLangPanel(sheet);
    closeTimezonePanel(sheet);
    applySettingsToForm(panel, readSettings());
    panel.hidden = false;
    panel.classList.add("is-open");
    sheet.querySelector(".ds-menu") &&
      sheet.querySelector(".ds-menu").classList.add("is-settings-open");
  }

  function closeSettingsPanel(sheet) {
    var panel = $("#ds-settings-panel", sheet);
    if (!panel) return;
    panel.classList.remove("is-open");
    panel.hidden = true;
    sheet.querySelector(".ds-menu") &&
      sheet.querySelector(".ds-menu").classList.remove("is-settings-open");
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
    closeTimezonePanel(sheet);
    closeSettingsPanel(sheet);
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
    var tz = getTimezoneById(getSavedTimezoneId());
    var now = new Date();
    var utc = now.getTime() + now.getTimezoneOffset() * 60000;
    var local = new Date(utc + tz.offsetMin * 60000);
    var settings = readSettings();
    var h = local.getHours();
    var m = String(local.getMinutes()).padStart(2, "0");
    if (settings.timeFormat === "12") {
      var ampm = h >= 12 ? "PM" : "AM";
      var h12 = h % 12 || 12;
      el.textContent = h12 + ":" + m + " " + ampm;
    } else {
      el.textContent = String(h).padStart(2, "0") + ":" + m;
    }
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
    if (sheet && !sheet.querySelector("#ds-settings-panel")) {
      sheet.remove();
      sheet = null;
    }
    if (sheet && !sheet.querySelector("#ds-tz-panel")) {
      sheet.remove();
      sheet = null;
    }
    if (sheet) {
      var settingsImg = sheet.querySelector(".ds-menu__settings img");
      if (settingsImg && settingsImg.getAttribute("src") !== "assets/icons/icon-settings.svg") {
        settingsImg.setAttribute("src", "assets/icons/icon-settings.svg");
      }
      return sheet;
    }

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

      if (e.target.closest("[data-ds-close-tz]")) {
        closeTimezonePanel(sheet);
        return;
      }

      if (e.target.closest("[data-ds-menu-clock]")) {
        openTimezonePanel(sheet);
        return;
      }

      var tzOpt = e.target.closest("[data-ds-tz-option]");
      if (tzOpt) {
        selectTimezone(sheet, tzOpt.getAttribute("data-tz-id"));
        closeTimezonePanel(sheet);
        if (typeof window.showToast === "function") {
          window.showToast("Time zone updated");
        }
        return;
      }

      if (e.target.closest("[data-ds-close-settings], [data-ds-settings-cancel]")) {
        closeSettingsPanel(sheet);
        return;
      }

      if (e.target.closest("[data-ds-settings-apply]")) {
        var settingsPanel = $("#ds-settings-panel", sheet);
        if (settingsPanel) {
          writeSettings(collectSettingsFromForm(settingsPanel));
          if (typeof window.showToast === "function") window.showToast("Settings applied");
        }
        closeSettingsPanel(sheet);
        return;
      }

      var settingsToggle = e.target.closest("[data-ds-settings-toggle]");
      if (settingsToggle) {
        var section = settingsToggle.closest("[data-ds-settings-section]");
        if (section) {
          var openSec = section.classList.toggle("is-open");
          settingsToggle.setAttribute("aria-expanded", openSec ? "true" : "false");
        }
        return;
      }

      var settingsInfo = e.target.closest("[data-ds-settings-info]");
      if (settingsInfo) {
        e.preventDefault();
        var infoOpt = settingsInfo.closest(".ds-settings__option");
        var infoLabel = infoOpt && infoOpt.querySelector(".ds-settings__option-label");
        if (typeof window.showToast === "function") {
          window.showToast((infoLabel && infoLabel.textContent.trim()) || "Odds format info");
        }
        return;
      }

      var settingsOpt = e.target.closest(".ds-settings__option");
      if (settingsOpt && !e.target.closest("[data-ds-settings-info]") && settingsOpt.querySelector("[data-ds-settings-radio]")) {
        var radioInOpt = settingsOpt.querySelector("[data-ds-settings-radio]");
        if (radioInOpt) {
          radioInOpt.checked = true;
          var radioGroup = radioInOpt.getAttribute("name");
          $$('input[type="radio"][name="' + radioGroup + '"]', sheet).forEach(function (input) {
            var row = input.closest(".ds-settings__option");
            if (row) row.classList.toggle("is-selected", input.checked);
          });
        }
        return;
      }

      if (e.target.closest("[data-ds-menu-close]")) {
        closeLangPanel(sheet);
        closeSettingsPanel(sheet);
        closeTimezonePanel(sheet);
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
        openSettingsPanel(sheet);
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

    var tzSearch = $("[data-ds-tz-search]", sheet);
    if (tzSearch) {
      tzSearch.addEventListener("input", function () {
        filterTimezoneList(sheet, tzSearch.value);
      });
    }

    loadLanguages(sheet);
    syncAuthVisibility(sheet);
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      var tzPanel = $("#ds-tz-panel", sheet);
      if (tzPanel && !tzPanel.hidden) {
        closeTimezonePanel(sheet);
        e.stopPropagation();
        return;
      }
      var settingsPanel = $("#ds-settings-panel", sheet);
      if (settingsPanel && !settingsPanel.hidden) {
        closeSettingsPanel(sheet);
        e.stopPropagation();
        return;
      }
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
    closeSettingsPanel(sheet);
    closeTimezonePanel(sheet);
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
