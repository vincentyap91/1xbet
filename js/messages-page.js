/**
 * Full-page Messages inbox (desktop site — mirrors search.html shell).
 * Depends on js/messages-data.js; optional MessagesUI for header badges.
 */
(function () {
  "use strict";

  if (!document.body || document.body.getAttribute("data-page") !== "messages") return;

  var CHEVRON =
    '<svg viewBox="0 0 10 6" width="10" height="6" aria-hidden="true"><path d="M4.75 5.84L.13 1.28a.5.5 0 010-.5L.72.16a.5.5 0 01.53 0L5 3.84 8.75.16a.5.5 0 01.53 0l.63.62a.5.5 0 010 .5L5.31 5.84a.5.5 0 01-.56 0z" fill="currentColor"/></svg>';

  var list = [];
  var expandedId = "m2";

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function $$(sel, root) {
    return Array.from((root || document).querySelectorAll(sel));
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function dataApi() {
    return window.MessagesData || null;
  }

  function reload() {
    var api = dataApi();
    list = api ? api.load() : [];
  }

  function persist() {
    var api = dataApi();
    if (api) api.save(list);
  }

  function unreadCount() {
    var api = dataApi();
    return api ? api.unreadCount(list) : list.filter(function (m) { return m.unread; }).length;
  }

  function syncTitles() {
    var n = unreadCount();
    var label = n > 0 ? "Messages (" + n + ")" : "Messages";
    $$("[data-msg-page-title]").forEach(function (el) {
      el.textContent = label;
    });
    if (window.MessagesUI && typeof window.MessagesUI.syncBadges === "function") {
      window.MessagesUI.syncBadges();
    }
  }

  function cardHtml(msg) {
    var expanded = msg.id === expandedId;
    return (
      '<article class="msg-page-card' +
      (msg.unread ? " is-unread" : "") +
      (expanded ? " is-expanded" : "") +
      '" data-msg-id="' +
      msg.id +
      '" role="listitem">' +
      '<input type="checkbox" class="msg-page-card__check" data-msg-page-check aria-label="Select message" />' +
      '<div class="msg-page-card__meta">' +
      "<span>" +
      escapeHtml(msg.datetime || msg.date) +
      "</span>" +
      '<span class="msg-page-card__dot" aria-label="Unread"></span>' +
      "</div>" +
      '<p class="msg-page-card__title">' +
      escapeHtml(msg.title) +
      "</p>" +
      '<p class="msg-page-card__body"' +
      (expanded ? "" : " hidden") +
      ">" +
      escapeHtml(msg.body) +
      "</p>" +
      '<button type="button" class="msg-page-card__toggle" data-msg-page-toggle aria-expanded="' +
      (expanded ? "true" : "false") +
      '" aria-label="Expand message">' +
      CHEVRON +
      "</button>" +
      "</article>"
    );
  }

  function render() {
    var root = $("[data-msg-page-list]");
    if (!root) return;
    if (!list.length) {
      root.innerHTML = '<p class="msg-page-empty">No messages</p>';
    } else {
      root.innerHTML = list.map(cardHtml).join("");
    }
    syncTitles();
    var selectAll = $("[data-msg-page-select-all]");
    if (selectAll) selectAll.checked = false;
  }

  function selectedIds() {
    return $$("[data-msg-page-check]:checked")
      .map(function (cb) {
        var card = cb.closest(".msg-page-card");
        return card ? card.getAttribute("data-msg-id") : null;
      })
      .filter(Boolean);
  }

  function bind() {
    var selectAll = $("[data-msg-page-select-all]");
    if (selectAll) {
      selectAll.addEventListener("change", function () {
        $$("[data-msg-page-check]").forEach(function (cb) {
          cb.checked = !!selectAll.checked;
        });
      });
    }

    document.addEventListener("change", function (e) {
      var check = e.target.closest("[data-msg-page-check]");
      if (!check || !selectAll) return;
      var all = $$("[data-msg-page-check]");
      selectAll.checked = all.length > 0 && all.every(function (c) { return c.checked; });
    });

    document.addEventListener("click", function (e) {
      var toggle = e.target.closest("[data-msg-page-toggle]");
      if (toggle) {
        var card = toggle.closest(".msg-page-card");
        if (!card) return;
        var id = card.getAttribute("data-msg-id");
        var willExpand = !card.classList.contains("is-expanded");
        $$(".msg-page-card.is-expanded").forEach(function (c) {
          c.classList.remove("is-expanded");
          var body = $(".msg-page-card__body", c);
          var btn = $(".msg-page-card__toggle", c);
          if (body) body.hidden = true;
          if (btn) btn.setAttribute("aria-expanded", "false");
        });
        if (willExpand) {
          expandedId = id;
          card.classList.add("is-expanded");
          var b = $(".msg-page-card__body", card);
          if (b) b.hidden = false;
          toggle.setAttribute("aria-expanded", "true");
        } else {
          expandedId = null;
        }
        return;
      }

      if (e.target.closest("[data-msg-page-delete]")) {
        var delIds = selectedIds();
        if (!delIds.length) return;
        list = list.filter(function (m) {
          return delIds.indexOf(m.id) === -1;
        });
        persist();
        render();
        return;
      }

      if (e.target.closest("[data-msg-page-mark-read]")) {
        var readIds = selectedIds();
        if (!readIds.length) return;
        list.forEach(function (m) {
          if (readIds.indexOf(m.id) !== -1) m.unread = false;
        });
        persist();
        render();
      }
    });
  }

  function init() {
    reload();
    render();
    bind();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
