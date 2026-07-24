(() => {
  function escapeHtml(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function scoreHtml(score) {
    if (score === null || score === undefined || score === "") return "";
    return `<span class="fv-card__score">${escapeHtml(score)}</span>`;
  }

  function cardHtml(event) {
    const stream = event.hasStream
      ? `<button type="button" class="fv-card__stream" data-toast="Live stream coming soon" aria-label="Watch stream">
          <img src="assets/icons/nav-stream.svg" alt="" width="14" height="14" />
        </button>`
      : "";

    const homeScore = event.homeScore != null ? event.homeScore : "";
    const awayScore = event.awayScore != null ? event.awayScore : "";
    const showScores = event.scope === "live" || homeScore !== "" || awayScore !== "";

    return `<article class="fv-card" data-fav-event
      data-event-id="${escapeHtml(event.id)}"
      data-event-scope="${escapeHtml(event.scope || "sports")}"
    >
      <div class="fv-card__top">
        <div class="fv-card__meta">
          <img class="fv-card__sport" src="${escapeHtml(event.sportIcon || "assets/icons/sport-esports.svg")}" alt="" width="16" height="16" />
          <span class="fv-card__status">${escapeHtml(event.time || "")}</span>
        </div>
        <div class="fv-card__actions">
          ${stream}
          <button type="button" class="fv-card__more" data-toast="Event options" aria-label="More options">
            <img src="assets/icons/icon-more.svg" alt="" width="14" height="14" onerror="this.style.display='none';this.parentElement.textContent='⋯'" />
          </button>
        </div>
      </div>
      <a href="#" class="fv-card__league">${escapeHtml(event.league || "")}</a>
      <div class="fv-card__teams">
        <div class="fv-card__row">
          <span class="fv-card__team">
            <img src="${escapeHtml(event.homeLogo || "assets/images/partners/partner-barcelona.webp")}" alt="" width="20" height="20" />
            ${escapeHtml(event.home || "")}
          </span>
          ${showScores ? scoreHtml(homeScore === "" ? "—" : homeScore) : ""}
        </div>
        <div class="fv-card__row">
          <span class="fv-card__team">
            <img src="${escapeHtml(event.awayLogo || "assets/images/partners/partner-psg.webp")}" alt="" width="20" height="20" />
            ${escapeHtml(event.away || "")}
          </span>
          ${showScores ? scoreHtml(awayScore === "" ? "—" : awayScore) : ""}
        </div>
      </div>
      ${event.note ? `<p class="fv-card__note">${escapeHtml(event.note)}</p>` : ""}
    </article>`;
  }

  function init() {
    if (document.body.getAttribute("data-page") !== "favourites") return;
    const api = window.SbFavourites;
    if (!api) return;

    api.ensureDemo();

    const listEl = document.getElementById("fv-list");
    const emptyEl = document.getElementById("fv-empty");
    let tab = "live";

    document.querySelectorAll("[data-fv-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        tab = btn.getAttribute("data-fv-tab") || "live";
        document.querySelectorAll("[data-fv-tab]").forEach((t) => {
          const on = t === btn;
          t.classList.toggle("is-active", on);
          t.setAttribute("aria-selected", on ? "true" : "false");
        });
        render();
      });
    });

    document.querySelectorAll("[data-fv-acc]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const panel = document.getElementById(btn.getAttribute("aria-controls") || "");
        const open = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", open ? "false" : "true");
        if (panel) panel.hidden = open;
      });
    });

    document.addEventListener("click", (e) => {
      const toastBtn = e.target.closest("[data-toast]");
      if (!toastBtn) return;
      e.preventDefault();
      const msg = toastBtn.getAttribute("data-toast");
      const el = document.getElementById("fv-toast");
      if (!el || !msg) return;
      el.textContent = msg;
      el.hidden = false;
      window.clearTimeout(el._t);
      el._t = window.setTimeout(() => {
        el.hidden = true;
      }, 1800);
    });

    function render() {
      const all = api.readAll();
      const filtered = all.filter((item) => {
        if (tab === "live") return item.scope === "live";
        return item.scope !== "live";
      });

      if (!filtered.length) {
        if (listEl) {
          listEl.hidden = true;
          listEl.innerHTML = "";
        }
        if (emptyEl) emptyEl.hidden = false;
        return;
      }

      if (emptyEl) emptyEl.hidden = true;
      if (listEl) {
        listEl.hidden = false;
        listEl.innerHTML = filtered.map(cardHtml).join("");
      }
    }

    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
