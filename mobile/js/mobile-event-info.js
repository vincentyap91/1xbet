(() => {
  function toast(msg) {
    const el = document.getElementById("mh-toast");
    if (!el) return;
    el.textContent = msg;
    el.hidden = false;
    window.clearTimeout(toast._t);
    toast._t = window.setTimeout(() => {
      el.hidden = true;
    }, 1800);
  }

  function resolveEvent() {
    const api = window.MhFavourites;
    if (!api) return null;

    const pending = api.peekPending();
    if (pending?.id) return pending;

    const id = new URLSearchParams(window.location.search).get("id");
    if (id) {
      const saved = api.getById(id);
      if (saved) return saved;
      return {
        id,
        note: "2nd Qualification Round. Champions path. 1st Leg",
        weather: { temp: "+27°C", wind: "3.6", pressure: "758", humidity: "55" },
        league: "UEFA Champions League",
        home: "Iberia 1999",
        away: "Slovan Bratislava",
        time: "22/07 00:00",
        sportIcon: "assets/icons/sport-football.svg",
        homeLogo: "assets/logos/partner-barcelona.webp",
        awayLogo: "assets/logos/partner-serie-a.webp",
        scope: "sports",
        odds: [
          { lab: "W1", val: "3.555" },
          { lab: "DRAW", val: "3.62" },
          { lab: "W2", val: "1.96" },
          { lab: "1X", val: "1.8" },
          { lab: "12", val: "1.26" },
        ],
      };
    }

    return api.DEFAULT_SEED[0];
  }

  function syncFavUi(event) {
    const api = window.MhFavourites;
    const btn = document.getElementById("mh-ei-fav");
    const label = btn?.querySelector("[data-mh-ei-fav-label]");
    if (!api || !btn || !label || !event) return;
    const on = api.isFavourite(event.id);
    btn.classList.toggle("is-fav", on);
    label.textContent = on ? "Remove from favorites" : "Add to favorites";
  }

  function init() {
    if (!document.body.classList.contains("mh-page--event-info")) return;
    const api = window.MhFavourites;
    const event = resolveEvent();
    if (!event) return;

    const note = document.getElementById("mh-ei-note");
    if (note) note.textContent = event.note || "Event details";
    const w = event.weather || {};
    const set = (id, val) => {
      const el = document.getElementById(id);
      if (el && val != null) el.textContent = val;
    };
    set("mh-ei-temp", w.temp);
    set("mh-ei-wind", w.wind);
    set("mh-ei-pressure", w.pressure);
    set("mh-ei-humidity", w.humidity);

    syncFavUi(event);

    const back = document.getElementById("mh-ei-back");
    back?.addEventListener("click", (e) => {
      if (history.length <= 1) {
        e.preventDefault();
        window.location.href = "sports.html";
      }
    });

    document.getElementById("mh-ei-fav")?.addEventListener("click", () => {
      if (!api) return;
      const added = api.toggle(event);
      syncFavUi(event);
      toast(added ? "Added to favorites" : "Removed from favorites");
    });

    // Keep pending around for refresh while on this page
    api.stashPending(event);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
