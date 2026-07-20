/**
 * Mobile app bootstrap — shell inject, auth demo, bet slip, overlays.
 * Scoped to /mobile/ only.
 */
(function () {
  "use strict";

  const STORAGE = {
    auth: "m_logged_in",
    balance: "m_balance",
    slip: "m_bet_slip",
  };

  const ICONS = {
    sports:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 2c1.5 0 2.9.4 4.1 1.1L6.1 15.1A8 8 0 0 1 12 4zm0 16a8 8 0 0 1-4.1-1.1L17.9 8.9A8 8 0 0 1 12 20z"/></svg>',
    casino:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm12.5 0a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7z"/></svg>',
    slip:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h10a2 2 0 0 1 2 2v15l-3-2-2 2-2-2-2 2-2-2-3 2V5a2 2 0 0 1 2-2zm2 5v2h6V8H9zm0 4v2h6v-2H9z"/></svg>',
    profile:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5z"/></svg>',
    menu:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16v2H4V7zm0 4h16v2H4v-2zm0 4h16v2H4v-2z"/></svg>',
  };

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function $all(sel, root) {
    return Array.from((root || document).querySelectorAll(sel));
  }

  function getAuth() {
    return sessionStorage.getItem(STORAGE.auth) === "1";
  }

  function setAuth(on) {
    if (on) {
      sessionStorage.setItem(STORAGE.auth, "1");
      if (!sessionStorage.getItem(STORAGE.balance)) {
        sessionStorage.setItem(STORAGE.balance, "128.50");
      }
    } else {
      sessionStorage.removeItem(STORAGE.auth);
    }
    applyAuth();
  }

  function getBalance() {
    return sessionStorage.getItem(STORAGE.balance) || "0.00";
  }

  function getSlip() {
    try {
      return JSON.parse(sessionStorage.getItem(STORAGE.slip) || "[]");
    } catch {
      return [];
    }
  }

  function saveSlip(items) {
    sessionStorage.setItem(STORAGE.slip, JSON.stringify(items));
    updateSlipBadge();
  }

  function applyAuth() {
    document.body.classList.toggle("is-logged-in", getAuth());
    $all("[data-m-balance]").forEach(function (el) {
      el.textContent = "MYR " + getBalance();
    });
  }

  function updateSlipBadge() {
    const n = getSlip().length;
    $all("[data-m-slip-count]").forEach(function (el) {
      el.textContent = n > 0 ? String(n) : "";
    });
  }

  function lockScroll(on) {
    document.body.classList.toggle("m-lock", on);
  }

  function openOverlay(id) {
    const overlay = $("#m-overlay");
    const sheet = id ? document.getElementById(id) : null;
    if (overlay) overlay.classList.add("is-open");
    if (sheet) sheet.classList.add("is-open");
    lockScroll(true);
  }

  function closeOverlays() {
    $all(".m-overlay.is-open, .m-sheet.is-open, .m-drawer.is-open").forEach(function (el) {
      el.classList.remove("is-open");
    });
    lockScroll(false);
  }

  function toast(msg) {
    let host = $(".m-toast-host");
    if (!host) {
      host = document.createElement("div");
      host.className = "m-toast-host";
      document.body.appendChild(host);
    }
    const el = document.createElement("div");
    el.className = "m-toast";
    el.textContent = msg;
    host.appendChild(el);
    setTimeout(function () {
      el.remove();
    }, 2600);
  }

  function injectShell() {
    const app = $(".m-app");
    if (!app) return;

    const page = document.body.getAttribute("data-m-page") || "home";
    const logoSrc = "/assets/icons/logo-1xbet.svg";
    const flagSrc = "/assets/icons/flag-my.svg";

    if (!$(".m-header", app)) {
      const header = document.createElement("header");
      header.className = "m-header";
      header.innerHTML =
        '<a class="m-header__brand" href="/mobile/index.html" aria-label="Home">' +
        '<img class="m-header__logo" src="' +
        logoSrc +
        '" alt="1xBet" width="96" height="22" />' +
        '<img class="m-header__flag" src="' +
        flagSrc +
        '" alt="" width="18" height="18" />' +
        "</a>" +
        '<div class="m-header__actions">' +
        '<div class="m-header__guest">' +
        '<button type="button" class="m-btn m-btn--login" data-m-login>Log in</button>' +
        '<button type="button" class="m-btn m-btn--register" data-m-register>Registration</button>' +
        "</div>" +
        '<div class="m-header__user">' +
        '<a class="m-header__balance" href="/mobile/wallet.html" data-m-balance>MYR 0.00</a>' +
        '<a class="m-btn m-btn--deposit" href="/mobile/deposit.html">Deposit</a>' +
        "</div>" +
        "</div>";
      app.prepend(header);
    }

    if (!$(".m-tabbar", app)) {
      const tabbar = document.createElement("nav");
      tabbar.className = "m-tabbar";
      tabbar.setAttribute("aria-label", "Primary");

      function tab(href, key, label, icon, current) {
        const active = current ? ' aria-current="page" class="m-tabbar__item is-active"' : ' class="m-tabbar__item"';
        return (
          '<a href="' +
          href +
          '"' +
          active +
          ' data-m-nav="' +
          key +
          '"><span class="m-tabbar__icon">' +
          icon +
          '</span><span>' +
          label +
          "</span></a>"
        );
      }

      tabbar.innerHTML =
        tab("/mobile/index.html", "sports", "Sports", ICONS.sports, page === "sports" || page === "home") +
        tab("/mobile/casino.html", "casino", "Casino", ICONS.casino, page === "casino" || page === "slots" || page === "live-casino") +
        '<div class="m-tabbar__fab-wrap">' +
        '<a class="m-tabbar__fab" href="/mobile/bet-slip.html" aria-label="Bet slip">' +
        ICONS.slip +
        '<span class="m-tabbar__badge" data-m-slip-count></span>' +
        "</a></div>" +
        tab(
          "/mobile/profile.html",
          "profile",
          getAuth() ? "Profile" : "Log in",
          ICONS.profile,
          page === "profile" || page === "wallet" || page === "settings"
        ) +
        '<button type="button" class="m-tabbar__item" data-m-menu aria-label="Menu">' +
        '<span class="m-tabbar__icon">' +
        ICONS.menu +
        "</span><span>Menu</span></button>";

      app.appendChild(tabbar);
    }

    if (!$("#m-overlay")) {
      const overlay = document.createElement("div");
      overlay.id = "m-overlay";
      overlay.className = "m-overlay";
      overlay.addEventListener("click", closeOverlays);
      document.body.appendChild(overlay);
    }

    if (!$("#m-menu-sheet")) {
      const sheet = document.createElement("div");
      sheet.id = "m-menu-sheet";
      sheet.className = "m-sheet";
      sheet.setAttribute("role", "dialog");
      sheet.setAttribute("aria-label", "Menu");
      sheet.innerHTML =
        '<div class="m-sheet__handle"></div>' +
        '<div class="m-sheet__title">Menu</div>' +
        '<div class="m-sheet__body">' +
        '<div class="m-menu-grid">' +
        menuLink("/mobile/index.html", "Home", "H") +
        menuLink("/mobile/sports.html", "Sports", "S") +
        menuLink("/mobile/casino.html", "Casino", "C") +
        menuLink("/mobile/live-casino.html", "Live Casino", "L") +
        menuLink("/mobile/slots.html", "Slots", "X") +
        menuLink("/mobile/promotions.html", "Promos", "P") +
        menuLink("/mobile/search.html", "Search", "?") +
        menuLink("/mobile/wallet.html", "Wallet", "W") +
        menuLink("/mobile/deposit.html", "Deposit", "+") +
        menuLink("/mobile/withdraw.html", "Withdraw", "−") +
        menuLink("/mobile/bet-slip.html", "Bet slip", "B") +
        menuLink("/mobile/settings.html", "Settings", "Se") +
        menuLink("/index.html", "Full site", "FW") +
        "</div></div>";
      document.body.appendChild(sheet);
    }

    if (!$("#m-auth-sheet")) {
      const auth = document.createElement("div");
      auth.id = "m-auth-sheet";
      auth.className = "m-sheet";
      auth.setAttribute("role", "dialog");
      auth.setAttribute("aria-label", "Log in");
      auth.innerHTML =
        '<div class="m-sheet__handle"></div>' +
        '<div class="m-sheet__title">Log in</div>' +
        '<div class="m-sheet__body">' +
        '<div class="m-field"><label class="m-field__label" for="m-auth-user">Email or phone</label>' +
        '<input class="m-input" id="m-auth-user" type="text" autocomplete="username" /></div>' +
        '<div class="m-field"><label class="m-field__label" for="m-auth-pass">Password</label>' +
        '<input class="m-input" id="m-auth-pass" type="password" autocomplete="current-password" /></div>' +
        '<button type="button" class="m-btn m-btn--primary m-btn--block m-btn--lg" data-m-auth-submit>Log in</button>' +
        '<p style="margin-top:12px;font-size:12px;color:var(--text-muted);text-align:center">Demo auth — stored in this browser session only.</p>' +
        "</div>";
      document.body.appendChild(auth);
    }
  }

  function menuLink(href, label, icon) {
    return (
      '<a class="m-menu-link" href="' +
      href +
      '"><span class="m-menu-link__icon">' +
      icon +
      "</span>" +
      label +
      "</a>"
    );
  }

  function bindUI() {
    document.addEventListener("click", function (e) {
      const t = e.target.closest("[data-m-menu]");
      if (t) {
        e.preventDefault();
        openOverlay("m-menu-sheet");
        return;
      }

      if (e.target.closest("[data-m-login], [data-m-register]")) {
        e.preventDefault();
        openOverlay("m-auth-sheet");
        return;
      }

      if (e.target.closest("[data-m-auth-submit]")) {
        e.preventDefault();
        setAuth(true);
        closeOverlays();
        toast("Logged in");
        // Refresh tab label
        const profileTab = $('[data-m-nav="profile"] span:last-child');
        if (profileTab) profileTab.textContent = "Profile";
        return;
      }

      if (e.target.closest("[data-m-logout]")) {
        e.preventDefault();
        setAuth(false);
        toast("Logged out");
        return;
      }

      const odd = e.target.closest(".m-odd[data-odd]");
      if (odd) {
        e.preventDefault();
        const event = odd.getAttribute("data-event") || "Selection";
        const pick = odd.getAttribute("data-pick") || "Pick";
        const price = odd.getAttribute("data-odd") || "1.00";
        const items = getSlip();
        const id = event + "|" + pick;
        if (items.some(function (i) {
          return i.id === id;
        })) {
          toast("Already in bet slip");
          return;
        }
        items.push({ id: id, event: event, pick: pick, odd: price });
        saveSlip(items);
        odd.classList.add("is-selected");
        toast("Added to bet slip");
        return;
      }

      const chip = e.target.closest(".m-chip[data-amount]");
      if (chip) {
        $all(".m-chip.is-active").forEach(function (c) {
          c.classList.remove("is-active");
        });
        chip.classList.add("is-active");
        const input = $("[data-m-amount]");
        if (input) input.value = chip.getAttribute("data-amount");
        return;
      }

      const sw = e.target.closest(".m-switch");
      if (sw) {
        sw.classList.toggle("is-on");
        sw.setAttribute("aria-checked", sw.classList.contains("is-on") ? "true" : "false");
        return;
      }

      const tab = e.target.closest("[data-m-tabs] .m-tab, [data-m-tabs] .m-quicknav__btn[data-panel]");
      if (tab) {
        const group = tab.closest("[data-m-tabs]");
        $all(".m-tab, .m-quicknav__btn[data-panel]", group).forEach(function (el) {
          el.classList.remove("is-active");
        });
        tab.classList.add("is-active");
        const panelId = tab.getAttribute("data-panel");
        if (panelId) {
          const root = group.closest(".m-main") || group.parentElement || document;
          $all("[data-m-panel]", root).forEach(function (p) {
            p.hidden = p.getAttribute("data-m-panel") !== panelId;
          });
        }
        return;
      }

      if (e.target.closest("[data-m-deposit]")) {
        e.preventDefault();
        if (!getAuth()) {
          openOverlay("m-auth-sheet");
          return;
        }
        toast("Deposit request submitted (demo)");
        return;
      }

      if (e.target.closest("[data-m-withdraw]")) {
        e.preventDefault();
        if (!getAuth()) {
          openOverlay("m-auth-sheet");
          return;
        }
        toast("Withdrawal request submitted (demo)");
        return;
      }

      if (e.target.closest("[data-m-clear-slip]")) {
        e.preventDefault();
        saveSlip([]);
        $all(".m-slip-list").forEach(function (list) {
          list.innerHTML = "";
        });
        renderSlipPage();
        toast("Bet slip cleared");
        return;
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeOverlays();
    });
  }

  function renderSlipPage() {
    const list = $(".m-slip-list");
    if (!list) return;
    const items = getSlip();
    const empty = $(".m-slip-empty");
    if (!items.length) {
      list.innerHTML = "";
      if (empty) empty.hidden = false;
      return;
    }
    if (empty) empty.hidden = true;
    list.innerHTML = items
      .map(function (i) {
        return (
          '<article class="m-slip-item">' +
          '<div class="m-slip-item__head"><span>Sports</span><button type="button" data-m-remove-slip="' +
          encodeURIComponent(i.id) +
          '" aria-label="Remove">×</button></div>' +
          '<div class="m-slip-item__event">' +
          escapeHtml(i.event) +
          "</div>" +
          '<div class="m-slip-item__pick">' +
          escapeHtml(i.pick) +
          '</div><div class="m-slip-item__odd">' +
          escapeHtml(i.odd) +
          "</div></article>"
        );
      })
      .join("");
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  document.addEventListener("click", function (e) {
    const btn = e.target.closest("[data-m-remove-slip]");
    if (!btn) return;
    const id = decodeURIComponent(btn.getAttribute("data-m-remove-slip"));
    saveSlip(
      getSlip().filter(function (i) {
        return i.id !== id;
      })
    );
    renderSlipPage();
  });

  function initSearch() {
    const input = $("[data-m-search]");
    const results = $("[data-m-search-results]");
    if (!input || !results) return;
    const catalog = [
      { title: "Football", meta: "Sport", href: "sports.html" },
      { title: "Basketball", meta: "Sport", href: "sports.html" },
      { title: "Crazy Time", meta: "Live Casino", href: "live-casino.html" },
      { title: "Slots", meta: "Casino", href: "slots.html" },
      { title: "First Deposit Bonus", meta: "Promotion", href: "promotion-detail.html" },
      { title: "Wallet", meta: "Account", href: "wallet.html" },
    ];
    function run() {
      const q = input.value.trim().toLowerCase();
      const hits = !q
        ? catalog
        : catalog.filter(function (c) {
            return c.title.toLowerCase().indexOf(q) !== -1 || c.meta.toLowerCase().indexOf(q) !== -1;
          });
      if (!hits.length) {
        results.innerHTML =
          '<div class="m-empty"><div class="m-empty__title">No results</div><p>Try another keyword.</p></div>';
        return;
      }
      results.innerHTML = hits
        .map(function (c) {
          return (
            '<a class="m-search-result" href="' +
            c.href +
            '"><div><div>' +
            escapeHtml(c.title) +
            '</div><div class="m-search-result__meta">' +
            escapeHtml(c.meta) +
            '</div></div><span class="m-list__chev">&rsaquo;</span></a>'
          );
        })
        .join("");
    }
    input.addEventListener("input", run);
    run();
  }

  document.addEventListener("DOMContentLoaded", function () {
    injectShell();
    applyAuth();
    updateSlipBadge();
    bindUI();
    renderSlipPage();
    initSearch();
  });

  window.MobileApp = {
    toast: toast,
    setAuth: setAuth,
    getSlip: getSlip,
    saveSlip: saveSlip,
    openOverlay: openOverlay,
    closeOverlays: closeOverlays,
  };
})();
