(() => {
  "use strict";

  if (!document.body.classList.contains("mh-page--messages")) return;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const CHEVRON =
    '<svg viewBox="0 0 10 6" width="10" height="6" aria-hidden="true"><path d="M4.75 5.84L.13 1.28a.5.5 0 010-.5L.72.16a.5.5 0 01.53 0L5 3.84 8.75.16a.5.5 0 01.53 0l.63.62a.5.5 0 010 .5L5.31 5.84a.5.5 0 01-.56 0z" fill="currentColor"/></svg>';

  let list = [];
  let expandedId = "m2";

  function requireAuth() {
    try {
      if (localStorage.getItem("mh-logged-in-v1") !== "1") {
        window.location.replace("login.html");
        return false;
      }
    } catch (_) {
      /* continue */
    }
    return true;
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
    const api = dataApi();
    list = api ? api.load() : [];
  }

  function persist() {
    const api = dataApi();
    if (api) api.save(list);
  }

  function unreadCount() {
    const api = dataApi();
    return api ? api.unreadCount(list) : list.filter((m) => m.unread).length;
  }

  function syncTitle() {
    const title = $("[data-mh-msg-title]");
    if (!title) return;
    const n = unreadCount();
    title.textContent = n > 0 ? `Messages (${n})` : "Messages";
  }

  function cardHtml(msg) {
    const expanded = msg.id === expandedId;
    return (
      `<article class="mh-msg-card${msg.unread ? " is-unread" : ""}${expanded ? " is-expanded" : ""}" data-msg-id="${msg.id}" role="listitem">` +
      `<input type="checkbox" class="mh-msg-card__check" data-mh-msg-check aria-label="Select message" />` +
      `<div class="mh-msg-card__meta">` +
      `<span>${escapeHtml(msg.datetime || msg.date)}</span>` +
      `<span class="mh-msg-card__dot" aria-label="Unread"></span>` +
      `</div>` +
      `<p class="mh-msg-card__title">${escapeHtml(msg.title)}</p>` +
      `<p class="mh-msg-card__body"${expanded ? "" : " hidden"}>${escapeHtml(msg.body)}</p>` +
      `<button type="button" class="mh-msg-card__toggle" data-mh-msg-toggle aria-expanded="${expanded ? "true" : "false"}" aria-label="Expand message">${CHEVRON}</button>` +
      `</article>`
    );
  }

  function render() {
    const root = $("[data-mh-msg-list]");
    if (!root) return;
    if (!list.length) {
      root.innerHTML = `<p class="mh-msg-empty">No messages</p>`;
    } else {
      root.innerHTML = list.map(cardHtml).join("");
    }
    syncTitle();
    const selectAll = $("[data-mh-msg-select-all]");
    if (selectAll) selectAll.checked = false;
  }

  function selectedIds() {
    return $$("[data-mh-msg-check]:checked").map((cb) =>
      cb.closest(".mh-msg-card")?.getAttribute("data-msg-id")
    ).filter(Boolean);
  }

  function bind() {
    const selectAll = $("[data-mh-msg-select-all]");
    selectAll?.addEventListener("change", () => {
      $$("[data-mh-msg-check]").forEach((cb) => {
        cb.checked = !!selectAll.checked;
      });
    });

    document.addEventListener("change", (e) => {
      const check = e.target.closest("[data-mh-msg-check]");
      if (!check || !selectAll) return;
      const all = $$("[data-mh-msg-check]");
      selectAll.checked = all.length > 0 && all.every((c) => c.checked);
    });

    document.addEventListener("click", (e) => {
      const toggle = e.target.closest("[data-mh-msg-toggle]");
      if (toggle) {
        const card = toggle.closest(".mh-msg-card");
        if (!card) return;
        const id = card.getAttribute("data-msg-id");
        const willExpand = !card.classList.contains("is-expanded");
        $$(".mh-msg-card.is-expanded").forEach((c) => {
          c.classList.remove("is-expanded");
          const body = $(".mh-msg-card__body", c);
          const btn = $(".mh-msg-card__toggle", c);
          if (body) body.hidden = true;
          if (btn) btn.setAttribute("aria-expanded", "false");
        });
        if (willExpand) {
          expandedId = id;
          card.classList.add("is-expanded");
          const body = $(".mh-msg-card__body", card);
          if (body) body.hidden = false;
          toggle.setAttribute("aria-expanded", "true");
        } else {
          expandedId = null;
        }
        return;
      }

      if (e.target.closest("[data-mh-msg-delete]")) {
        const ids = selectedIds();
        if (!ids.length) return;
        list = list.filter((m) => !ids.includes(m.id));
        persist();
        render();
        return;
      }

      if (e.target.closest("[data-mh-msg-mark-read]")) {
        const ids = selectedIds();
        if (!ids.length) return;
        list.forEach((m) => {
          if (ids.includes(m.id)) m.unread = false;
        });
        persist();
        render();
      }
    });
  }

  if (!requireAuth()) return;
  reload();
  render();
  bind();
})();
