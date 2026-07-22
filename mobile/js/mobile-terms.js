/* mobile-terms.js — accordion + search filter for General Rules */
(function () {
  "use strict";

  function $$(sel, root) {
    return Array.from((root || document).querySelectorAll(sel));
  }

  function initAccordion() {
    $$("[data-tc-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = btn.closest("[data-tc-item]");
        if (!item) return;
        const body = item.querySelector("[data-tc-body]");
        const open = !item.classList.contains("is-open");
        item.classList.toggle("is-open", open);
        btn.setAttribute("aria-expanded", open ? "true" : "false");
        if (body) body.hidden = !open;
      });
    });
  }

  function initSearch() {
    const input = document.getElementById("mh-tc-search");
    const empty = document.getElementById("mh-tc-empty");
    if (!input) return;

    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      let visible = 0;
      $$("[data-tc-item]").forEach((item) => {
        const label = (item.getAttribute("data-tc-label") || "").toLowerCase();
        const show = !q || label.includes(q);
        item.hidden = !show;
        if (show) visible += 1;
      });
      if (empty) empty.hidden = visible > 0;
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initAccordion();
    initSearch();
  });
})();
