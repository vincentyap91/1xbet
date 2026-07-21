(() => {
  function initSportsFilter() {
    const modal = document.getElementById("mh-sf");
    if (!modal) return;

    const openBtns = document.querySelectorAll("[data-mh-sf-open]");
    const closeBtns = modal.querySelectorAll("[data-mh-sf-close]");
    const input = document.getElementById("mh-sf-input");
    const rows = Array.from(modal.querySelectorAll(".mh-sf__row"));
    const popular = modal.querySelector(".mh-sf__popular");

    function open() {
      modal.hidden = false;
      requestAnimationFrame(() => modal.classList.add("is-open"));
      document.body.classList.add("mh-sf-open");
      openBtns.forEach((b) => b.setAttribute("aria-expanded", "true"));
      window.setTimeout(() => input?.focus(), 220);
    }

    function close() {
      modal.classList.remove("is-open");
      document.body.classList.remove("mh-sf-open");
      openBtns.forEach((b) => b.setAttribute("aria-expanded", "false"));
      window.setTimeout(() => {
        if (!modal.classList.contains("is-open")) modal.hidden = true;
      }, 220);
    }

    function filterList(q) {
      const needle = q.trim().toLowerCase();
      let any = false;
      rows.forEach((row) => {
        const label = (row.getAttribute("data-mh-sf-label") || row.textContent || "").toLowerCase();
        const show = !needle || label.includes(needle);
        row.hidden = !show;
        if (show) any = true;
      });
      if (popular) popular.hidden = Boolean(needle);
      modal.querySelectorAll("[data-mh-sf-block]").forEach((block) => {
        const visibleRows = block.querySelectorAll(".mh-sf__row:not([hidden])");
        block.hidden = needle ? visibleRows.length === 0 : false;
      });
      return any;
    }

    openBtns.forEach((btn) => btn.addEventListener("click", open));
    closeBtns.forEach((btn) => btn.addEventListener("click", close));

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("is-open")) close();
    });

    input?.addEventListener("input", () => filterList(input.value));

    modal.addEventListener("click", (e) => {
      const pick = e.target.closest("[data-mh-sf-pick]");
      if (!pick) return;
      const key = pick.getAttribute("data-mh-sf-pick");
      const label = pick.getAttribute("data-mh-sf-label") || key;
      const chip = document.querySelector(`[data-mh-sp-chip="${key}"]`);
      if (chip) {
        chip.click();
      } else if (typeof window.showToast === "function") {
        /* fall through */
      }
      const toast = document.getElementById("mh-toast");
      if (toast) {
        toast.textContent = `${label} selected`;
        toast.hidden = false;
        window.clearTimeout(toast._t);
        toast._t = window.setTimeout(() => {
          toast.hidden = true;
        }, 1400);
      }
      close();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSportsFilter);
  } else {
    initSportsFilter();
  }
})();
