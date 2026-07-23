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

  function goBack() {
    if (history.length > 1) {
      history.back();
      return;
    }
    window.location.href = "index.html";
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
        note: "Australia. Hard. Round of 16",
        league: "Event",
        home: "",
        away: "",
        time: "",
        sportIcon: "assets/icons/sport-football.svg",
        homeLogo: "assets/logos/partner-barcelona.webp",
        awayLogo: "assets/logos/partner-serie-a.webp",
        scope: "live",
        odds: [],
        weather: { temp: "+22°C", wind: "1.7", pressure: "764", humidity: "45" },
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

  function syncWeather(event) {
    const w = event?.weather || {};
    const map = {
      "[data-mh-ei-temp]": w.temp || "+22°C",
      "[data-mh-ei-wind]": w.wind || "1.7",
      "[data-mh-ei-pressure]": w.pressure || "764",
      "[data-mh-ei-humidity]": w.humidity || "45",
    };
    Object.entries(map).forEach(([sel, val]) => {
      const el = document.querySelector(sel);
      if (el) el.textContent = val;
    });
  }

  function init() {
    if (!document.body.classList.contains("mh-page--event-info")) return;
    const api = window.MhFavourites;
    const event = resolveEvent();
    if (!event) return;

    const note = document.getElementById("mh-ei-note");
    if (note) note.textContent = event.note || "Event details";

    syncFavUi(event);
    syncWeather(event);

    const back = document.getElementById("mh-ei-back");
    back?.addEventListener("click", (e) => {
      e.preventDefault();
      goBack();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") goBack();
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
