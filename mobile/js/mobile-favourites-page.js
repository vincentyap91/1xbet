(() => {
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function cardHtml(event) {
    const odds = (event.odds || [])
      .map(
        (o) =>
          `<button type="button" class="mh-odds__btn" data-odd="${escapeHtml(o.val)}"><span class="mh-odds__lab">${escapeHtml(o.lab)}</span><span class="mh-odds__val">${escapeHtml(o.val)}</span></button>`
      )
      .join("");

    return `<article class="mh-ev-card" data-mh-event
      data-event-id="${escapeHtml(event.id)}"
      data-event-sport="${escapeHtml(event.sport || "football")}"
      data-event-sport-icon="${escapeHtml(event.sportIcon || "assets/icons/sport-football.svg")}"
      data-event-time="${escapeHtml(event.time || "")}"
      data-event-league="${escapeHtml(event.league || "")}"
      data-event-home="${escapeHtml(event.home || "")}"
      data-event-home-logo="${escapeHtml(event.homeLogo || "")}"
      data-event-away="${escapeHtml(event.away || "")}"
      data-event-away-logo="${escapeHtml(event.awayLogo || "")}"
      data-event-note="${escapeHtml(event.note || "")}"
      data-event-scope="${escapeHtml(event.scope || "sports")}"
      data-event-temp="${escapeHtml(event.weather?.temp || "+27°C")}"
      data-event-wind="${escapeHtml(event.weather?.wind || "3.6")}"
      data-event-pressure="${escapeHtml(event.weather?.pressure || "758")}"
      data-event-humidity="${escapeHtml(event.weather?.humidity || "55")}"
    >
      <div class="mh-ev-card__top">
        <img class="mh-ev-card__sport" src="${escapeHtml(event.sportIcon || "assets/icons/sport-football.svg")}" alt="" width="14" height="14" />
        <span class="mh-ev-card__time">${escapeHtml(event.time || "")}</span>
        <button type="button" class="mh-ev-card__more" data-mh-event-info aria-label="Event info">
          <img src="assets/icons/icon-more.svg" alt="" width="14" height="14" />
        </button>
      </div>
      <a href="#" class="mh-ev-card__league">${escapeHtml(event.league || "")}</a>
      <p class="mh-ev-card__team"><img src="${escapeHtml(event.homeLogo || "")}" alt="" width="20" height="20" />${escapeHtml(event.home || "")}</p>
      <p class="mh-ev-card__team"><img src="${escapeHtml(event.awayLogo || "")}" alt="" width="20" height="20" />${escapeHtml(event.away || "")}</p>
      <p class="mh-ev-card__note">${escapeHtml(event.note || "")}</p>
      ${odds ? `<div class="mh-ev-card__odds mh-odds" data-mh-scroll data-mh-drag-scroll>${odds}</div>` : ""}
    </article>`;
  }

  function initFavouritesPage() {
    if (!document.body.classList.contains("mh-page--favourites")) return;
    const api = window.MhFavourites;
    if (!api) return;

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
