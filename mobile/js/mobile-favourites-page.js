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
    return `<span class="mh-fv-card__score">${escapeHtml(score)}</span>`;
  }

  function cardHtml(event) {
    const stream = event.hasStream
      ? `<button type="button" class="mh-fv-card__stream" data-mh-toast="Live stream coming soon" aria-label="Watch stream">
          <img src="assets/icons/nav-stream.svg" alt="" width="14" height="14" />
        </button>`
      : "";

    const homeScore = event.homeScore != null ? event.homeScore : "";
    const awayScore = event.awayScore != null ? event.awayScore : "";
    const showScores = event.scope === "live" || (homeScore !== "" && homeScore != null) || (awayScore !== "" && awayScore != null);

    return `<article class="mh-fv-card" data-mh-event
      data-event-id="${escapeHtml(event.id)}"
      data-event-sport="${escapeHtml(event.sport || "football")}"
      data-event-sport-icon="${escapeHtml(event.sportIcon || "assets/icons/sport-football.svg")}"
      data-event-time="${escapeHtml(event.time || "")}"
      data-event-league="${escapeHtml(event.league || "")}"
      data-event-home="${escapeHtml(event.home || "")}"
      data-event-home-logo="${escapeHtml(event.homeLogo || "")}"
      data-event-away="${escapeHtml(event.away || "")}"
      data-event-away-logo="${escapeHtml(event.awayLogo || "")}"
      data-event-home-score="${escapeHtml(homeScore)}"
      data-event-away-score="${escapeHtml(awayScore)}"
      data-event-note="${escapeHtml(event.note || "")}"
      data-event-scope="${escapeHtml(event.scope || "sports")}"
      data-event-stream="${event.hasStream ? "1" : "0"}"
      data-event-temp="${escapeHtml(event.weather?.temp || "+27°C")}"
      data-event-wind="${escapeHtml(event.weather?.wind || "3.6")}"
      data-event-pressure="${escapeHtml(event.weather?.pressure || "758")}"
      data-event-humidity="${escapeHtml(event.weather?.humidity || "55")}"
    >
      <div class="mh-fv-card__top">
        <div class="mh-fv-card__meta">
          <img class="mh-fv-card__sport" src="${escapeHtml(event.sportIcon || "assets/icons/sport-esports.svg")}" alt="" width="16" height="16" />
          <span class="mh-fv-card__status">${escapeHtml(event.time || "")}</span>
        </div>
        <div class="mh-fv-card__actions">
          ${stream}
          <button type="button" class="mh-fv-card__more" data-mh-event-info aria-label="Event info">
            <img src="assets/icons/icon-more.svg" alt="" width="14" height="14" />
          </button>
        </div>
      </div>
      <a href="#" class="mh-fv-card__league">${escapeHtml(event.league || "")}</a>
      <div class="mh-fv-card__teams">
        <div class="mh-fv-card__row">
          <span class="mh-fv-card__team" data-event-team>
            <img src="${escapeHtml(event.homeLogo || "")}" alt="" width="20" height="20" />
            ${escapeHtml(event.home || "")}
          </span>
          ${showScores ? scoreHtml(homeScore === "" ? "—" : homeScore) : ""}
        </div>
        <div class="mh-fv-card__row">
          <span class="mh-fv-card__team" data-event-team>
            <img src="${escapeHtml(event.awayLogo || "")}" alt="" width="20" height="20" />
            ${escapeHtml(event.away || "")}
          </span>
          ${showScores ? scoreHtml(awayScore === "" ? "—" : awayScore) : ""}
        </div>
      </div>
      ${event.note ? `<p class="mh-fv-card__note">${escapeHtml(event.note)}</p>` : ""}
    </article>`;
  }

  function initFavouritesPage() {
    if (!document.body.classList.contains("mh-page--favourites")) return;
    const api = window.MhFavourites;
    if (!api) return;

    api.ensureDemo?.();

    const listEl = document.getElementById("mh-fv-list");
    const emptyEl = document.getElementById("mh-fv-empty");
    let tab = "live";

    const back = document.getElementById("mh-fv-back");
    back?.addEventListener("click", (e) => {
      if (history.length <= 1) {
        e.preventDefault();
        window.location.href = "index.html";
      }
    });

    document.querySelectorAll("[data-mh-fv-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        tab = btn.getAttribute("data-mh-fv-tab") || "sports";
        document.querySelectorAll("[data-mh-fv-tab]").forEach((t) => {
          const on = t === btn;
          t.classList.toggle("is-active", on);
          t.setAttribute("aria-selected", on ? "true" : "false");
        });
        render();
      });
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
    document.addEventListener("DOMContentLoaded", initFavouritesPage);
  } else {
    initFavouritesPage();
  }
})();
