(() => {
  "use strict";

  if (!document.body.classList.contains("mh-page--history-record")) return;

  const page = document.body.dataset.page || "";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function toast(msg) {
    const el = $("#mh-toast");
    if (!el) return;
    el.hidden = false;
    el.textContent = msg;
    window.clearTimeout(toast._t);
    toast._t = window.setTimeout(() => {
      el.hidden = true;
    }, 2200);
  }

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function formatDate(d) {
    return `${pad2(d.getDate())}-${pad2(d.getMonth() + 1)}-${d.getFullYear()}`;
  }

  function startOfDay(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  function periodRange(key) {
    const now = new Date();
    const today = startOfDay(now);
    let start = today;
    let end = today;

    switch (key) {
      case "today":
        start = today;
        break;
      case "yesterday":
        start = new Date(today);
        start.setDate(start.getDate() - 1);
        end = start;
        break;
      case "last-week": {
        const day = today.getDay();
        const mondayThisWeek = new Date(today);
        mondayThisWeek.setDate(today.getDate() - ((day + 6) % 7));
        end = new Date(mondayThisWeek);
        end.setDate(end.getDate() - 1);
        start = new Date(end);
        start.setDate(start.getDate() - 6);
        break;
      }
      case "this-week": {
        const dow = today.getDay();
        start = new Date(today);
        start.setDate(today.getDate() - ((dow + 6) % 7));
        break;
      }
      case "this-month":
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case "last-month":
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      default:
        start = today;
    }

    return { start: formatDate(start), end: formatDate(end) };
  }

  function parseDateInput(value) {
    const parts = String(value || "").trim().split("-");
    if (parts.length !== 3) return null;
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    if (!day || month < 0 || !year) return null;
    return new Date(year, month, day);
  }

  function emptyHtml() {
    return `<div class="mh-hr-empty" id="mh-hr-empty" role="status">
      <p class="mh-hr-empty__title">No Data Found</p>
    </div>`;
  }

  function renderEmpty() {
    const body = $("#mh-hr-body");
    if (body) body.innerHTML = emptyHtml();
  }

  function setPeriod(key) {
    const range = periodRange(key);
    const startInput = $("#mh-hr-start");
    const endInput = $("#mh-hr-end");
    if (startInput) startInput.value = range.start;
    if (endInput) endInput.value = range.end;
    $$("[data-mh-hr-period]").forEach((btn) => {
      btn.classList.toggle("is-active", btn.getAttribute("data-mh-hr-period") === key);
    });
  }

  function initAuth() {
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

  function init() {
    if (!initAuth()) return;

    const form = $("#mh-hr-form");
    const typeSelect = $("#mh-hr-type");
    const statusSelect = $("#mh-hr-status");
    const titleEl = $(".mh-hr-subbar__title");
    const labelText = titleEl ? titleEl.textContent.trim() : "Record";

    setPeriod("this-week");
    renderEmpty();

    $$("[data-mh-hr-period]").forEach((btn) => {
      btn.addEventListener("click", () => {
        setPeriod(btn.getAttribute("data-mh-hr-period"));
      });
    });

    typeSelect?.addEventListener("change", () => {
      const value = typeSelect.value;
      if (value && value.indexOf(".html") !== -1) {
        /* Nested desktop record pages not ported — stay on TX with toast */
        toast(`${typeSelect.options[typeSelect.selectedIndex].text} (demo)`);
        typeSelect.value = typeSelect.querySelector("option")?.value || "deposits";
        renderEmpty();
        return;
      }
      renderEmpty();
    });

    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const start = parseDateInput($("#mh-hr-start")?.value);
      const end = parseDateInput($("#mh-hr-end")?.value);
      if (!start || !end) {
        toast("Enter valid start and end dates (DD-MM-YYYY)");
        renderEmpty();
        return;
      }
      if (start > end) {
        toast("Start date must be before end date");
        renderEmpty();
        return;
      }

      renderEmpty();
      const typeLabel = typeSelect?.options[typeSelect.selectedIndex]?.text || labelText;
      const statusLabel =
        statusSelect && statusSelect.value !== "all"
          ? statusSelect.options[statusSelect.selectedIndex].text
          : "";
      toast(
        `No ${typeLabel.toLowerCase()}${
          statusLabel ? ` (${statusLabel.toLowerCase()})` : ""
        } found for selected period (demo)`
      );
    });

    /* Page marker for debugging / future row demos */
    document.body.dataset.mhHistoryReady = page || "1";
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
