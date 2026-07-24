/**
 * Desktop Messages dropdown — injects under .header-msg-btn (logged-in header).
 * Depends on js/messages-data.js (loaded first by ensureMessagesFromAuth).
 */
(function (global) {
  "use strict";

  var CSS_ID = "messages-css";
  var CHEVRON_SVG =
    '<svg viewBox="0 0 10 6" width="10" height="6" aria-hidden="true"><path d="M4.75 5.84L.13 1.28a.5.5 0 010-.5L.72.16a.5.5 0 01.53 0L5 3.84 8.75.16a.5.5 0 01.53 0l.63.62a.5.5 0 010 .5L5.31 5.84a.5.5 0 01-.56 0z" fill="currentColor"/></svg>';
  var TRASH_SVG =
    '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M2.5 4.25h11M6 4.25V3.1c0-.4.32-.72.72-.72h2.56c.4 0 .72.32.72.72v1.15M3.75 4.25l.55 8.1c.05.7.63 1.25 1.34 1.25h4.72c.71 0 1.29-.55 1.34-1.25l.55-8.1M6.5 6.75v4.5M9.5 6.75v4.5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  var list = [];
  var expandedId = "m2";
  var docBound = false;
  var assetBase = "";

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function $$(sel, root) {
    return Array.from((root || document).querySelectorAll(sel));
  }

  function detectAssetBase() {
    var scripts = document.getElementsByTagName("script");
    for (var i = scripts.length - 1; i >= 0; i--) {
      var src = scripts[i].getAttribute("src") || "";
      if (/messages\.js(\?|$)/.test(src)) {
        return src.replace(/js\/messages\.js.*$/, "");
      }
    }
    return "";
  }

  function ensureCss() {
    if (document.getElementById(CSS_ID)) return;
    var link = document.createElement("link");
    link.id = CSS_ID;
    link.rel = "stylesheet";
    link.href = (assetBase || "") + "css/messages.css";
    document.head.appendChild(link);
  }

  function getData() {
    return global.MessagesData || null;
  }

  function reload() {
    var data = getData();
    list = data ? data.load() : [];
  }

  function persist() {
    var data = getData();
    if (data) data.save(list);
  }

  function unread() {
    var data = getData();
    return data ? data.unreadCount(list) : list.filter(function (m) { return m.unread; }).length;
  }

  function syncBadges() {
    var n = unread();
    $$(".header-msg-btn .icon-badge").forEach(function (badge) {
      if (n <= 0) {
        badge.hidden = true;
        badge.textContent = "0";
      } else {
        badge.hidden = false;
        badge.textContent = String(n);
      }
    });
    $$("[data-acc-sub-messages]").forEach(function (card) {
      var badge = $(".acc-subnav-badge", card);
      if (n <= 0) {
        if (badge) badge.remove();
        return;
      }
      if (!badge) {
        badge = document.createElement("span");
        badge.className = "acc-subnav-badge";
        card.insertBefore(badge, card.firstChild);
      }
      badge.setAttribute("aria-label", n + " unread");
      badge.textContent = String(n);
    });
  }

  function closeAll(except) {
    $$(".header-msg-wrap.is-open").forEach(function (wrap) {
      if (except && wrap === except) return;
      wrap.classList.remove("is-open");
      document.body.classList.remove("msg-panel-open");
      var btn = $(".header-msg-btn", wrap);
      var panel = $(".msg-dropdown", wrap);
      if (btn) btn.setAttribute("aria-expanded", "false");
      if (panel) panel.hidden = true;
    });
  }

  function cardHtml(msg) {
    var expanded = msg.id === expandedId;
    var bodyHidden = expanded ? "" : " hidden";
    return (
      '<article class="msg-card' +
      (msg.unread ? " is-unread" : "") +
      (expanded ? " is-expanded" : "") +
      '" data-msg-id="' +
      msg.id +
      '">' +
      '<input type="checkbox" class="msg-card__check" data-msg-check aria-label="Select message" />' +
      '<div class="msg-card__main">' +
      '<p class="msg-card__title">' +
      escapeHtml(msg.title) +
      "</p>" +
      '<div class="msg-card__meta">' +
      "<span>" +
      escapeHtml(msg.date) +
      "</span>" +
      '<span class="msg-card__dot" aria-label="Unread"></span>' +
      "</div>" +
      '<p class="msg-card__body"' +
      bodyHidden +
      ">" +
      escapeHtml(msg.body) +
      "</p>" +
      "</div>" +
      '<button type="button" class="msg-card__toggle" data-msg-toggle aria-expanded="' +
      (expanded ? "true" : "false") +
      '" aria-label="Expand message">' +
      CHEVRON_SVG +
      "</button>" +
      "</article>"
    );
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderPanel(panel) {
    var listEl = $(".msg-dropdown__list", panel);
    if (!listEl) return;
    if (!list.length) {
      listEl.innerHTML = '<p class="msg-dropdown__empty">No messages</p>';
      return;
    }
    listEl.innerHTML = list.map(cardHtml).join("");
  }

  function dropdownHtml(id) {
    return (
      '<div class="msg-dropdown" id="' +
      id +
      '" role="dialog" aria-label="Messages" hidden>' +
      '<span class="msg-dropdown__arrow" aria-hidden="true"></span>' +
      '<div class="msg-dropdown__head">' +
      '<h2 class="msg-dropdown__title">Messages</h2>' +
      '<button type="button" class="msg-dropdown__select-all" data-msg-select-all>Select all</button>' +
      "</div>" +
      '<div class="msg-dropdown__list" data-msg-list></div>' +
      '<div class="msg-dropdown__foot">' +
      '<button type="button" class="msg-dropdown__delete" data-msg-delete aria-label="Delete selected">' +
      TRASH_SVG +
      "</button>" +
      '<button type="button" class="msg-dropdown__read" data-msg-mark-read>Mark as read</button>' +
      "</div>" +
      "</div>"
    );
  }

  function selectedIds(panel) {
    return $$(".msg-card__check:checked", panel).map(function (cb) {
      return cb.closest(".msg-card").getAttribute("data-msg-id");
    });
  }

  function bindPanel(wrap) {
    var panel = $(".msg-dropdown", wrap);
    if (!panel || panel.dataset.msgBound === "1") return;
    panel.dataset.msgBound = "1";

    panel.addEventListener("click", function (e) {
      e.stopPropagation();

      var selectAll = e.target.closest("[data-msg-select-all]");
      if (selectAll) {
        var checks = $$(".msg-card__check", panel);
        var allOn = checks.length && checks.every(function (c) { return c.checked; });
        checks.forEach(function (c) {
          c.checked = !allOn;
        });
        selectAll.textContent = allOn ? "Select all" : "Deselect all";
        return;
      }

      var toggle = e.target.closest("[data-msg-toggle]");
      if (toggle) {
        var card = toggle.closest(".msg-card");
        if (!card) return;
        var id = card.getAttribute("data-msg-id");
        var willExpand = !card.classList.contains("is-expanded");
        $$(".msg-card.is-expanded", panel).forEach(function (c) {
          c.classList.remove("is-expanded");
          var body = $(".msg-card__body", c);
          var btn = $(".msg-card__toggle", c);
          if (body) body.hidden = true;
          if (btn) btn.setAttribute("aria-expanded", "false");
        });
        if (willExpand) {
          expandedId = id;
          card.classList.add("is-expanded");
          var b = $(".msg-card__body", card);
          if (b) b.hidden = false;
          toggle.setAttribute("aria-expanded", "true");
        } else {
          expandedId = null;
        }
        return;
      }

      if (e.target.closest("[data-msg-delete]")) {
        var delIds = selectedIds(panel);
        if (!delIds.length) return;
        list = list.filter(function (m) {
          return delIds.indexOf(m.id) === -1;
        });
        persist();
        renderPanel(panel);
        syncBadges();
        var sa = $("[data-msg-select-all]", panel);
        if (sa) sa.textContent = "Select all";
        return;
      }

      if (e.target.closest("[data-msg-mark-read]")) {
        var readIds = selectedIds(panel);
        if (!readIds.length) return;
        list.forEach(function (m) {
          if (readIds.indexOf(m.id) !== -1) m.unread = false;
        });
        persist();
        renderPanel(panel);
        syncBadges();
        return;
      }
    });
  }

  function enhanceBtn(btn) {
    if (!btn || btn.dataset.msgReady === "1") return;

    var wrap = btn.closest(".header-msg-wrap");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.className = "header-msg-wrap";
      btn.parentNode.insertBefore(wrap, btn);
      wrap.appendChild(btn);
    }

    var panelId = "msg-dropdown-" + Math.random().toString(36).slice(2, 9);
    var panel = $(".msg-dropdown", wrap);
    if (!panel) {
      wrap.insertAdjacentHTML("beforeend", dropdownHtml(panelId));
      panel = $(".msg-dropdown", wrap);
    }

    btn.setAttribute("aria-haspopup", "dialog");
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-controls", panel.id || panelId);
    btn.dataset.msgReady = "1";

    bindPanel(wrap);

    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var willOpen = !wrap.classList.contains("is-open");
      if (willOpen) openWrap(wrap);
      else closeAll();
    });
  }

  function ensureReady() {
    if (!document.querySelector(".header-msg-btn")) return null;
    init();
    return $(".header-msg-wrap") || document.querySelector(".header-msg-btn");
  }

  function openWrap(wrap) {
    if (!wrap) return;
    var btn = $(".header-msg-btn", wrap);
    var panel = $(".msg-dropdown", wrap);
    if (!panel) return;
    closeAll(wrap);
    reload();
    renderPanel(panel);
    wrap.classList.add("is-open");
    document.body.classList.add("msg-panel-open");
    if (btn) btn.setAttribute("aria-expanded", "true");
    panel.hidden = false;
  }

  function open() {
    ensureReady();
    var wrap = $(".header-msg-wrap");
    if (!wrap) {
      var btn = $(".header-msg-btn");
      if (btn) {
        enhanceBtn(btn);
        wrap = btn.closest(".header-msg-wrap");
      }
    }
    if (!wrap) return;
    openWrap(wrap);
  }

  function close() {
    closeAll();
  }

  function toggle() {
    var wrap = $(".header-msg-wrap");
    if (wrap && wrap.classList.contains("is-open")) close();
    else open();
  }

  function bindDocument() {
    if (docBound) return;
    docBound = true;
    document.addEventListener("click", function (e) {
      if (e.target.closest(".msg-dropdown")) return;
      if (e.target.closest(".header-msg-btn")) return;
      if (e.target.closest("[data-acc-sub-messages]")) return;
      closeAll();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeAll();
    });
  }

  function init() {
    assetBase = detectAssetBase();
    ensureCss();
    reload();
    $$(".header-msg-btn").forEach(enhanceBtn);
    syncBadges();
    bindDocument();
  }

  function destroy() {
    closeAll();
  }

  global.MessagesUI = {
    init: init,
    destroy: destroy,
    syncBadges: syncBadges,
    open: open,
    close: close,
    toggle: toggle,
    reload: function () {
      reload();
      syncBadges();
      $$(".header-msg-wrap.is-open .msg-dropdown").forEach(renderPanel);
    },
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      if (document.body.classList.contains("is-logged-in") || document.querySelector(".header-msg-btn")) {
        init();
      }
    });
  } else if (document.body.classList.contains("is-logged-in") || document.querySelector(".header-msg-btn")) {
    init();
  }
})(typeof window !== "undefined" ? window : this);
