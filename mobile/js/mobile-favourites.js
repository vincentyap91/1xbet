(() => {
  const STORAGE_KEY = "mh-favourites-v2";
  const LEGACY_KEY = "mh-favourites-v1";

  const DEMO_LIVE = {
    id: "cs2-blast-heroic-mongolz",
    sport: "esports",
    sportIcon: "assets/icons/menu/gamepad.svg",
    time: "Event in progress / 2 map",
    league: "CS 2. BLAST Bounty Summer. Qualifier",
    home: "Heroic",
    homeLogo: "assets/images/teams/team-13.webp",
    away: "TheMongolz",
    awayLogo: "assets/images/teams/team-14.webp",
    homeScore: 1,
    awayScore: 0,
    note: "Round of 32",
    scope: "live",
    hasStream: true,
    odds: [],
    weather: { temp: "+22°C", wind: "1.7", pressure: "764", humidity: "45" },
  };

  const DEMO_SPORTS = {
    id: "ucl-ararat-shamrock",
    sport: "football",
    sportIcon: "assets/icons/sport-football.svg",
    time: "22/07 00:00",
    league: "UEFA Champions League",
    home: "Ararat - Armenia",
    homeLogo: "assets/logos/partner-caf.webp",
    away: "Shamrock Rovers",
    awayLogo: "assets/logos/partner-volleyball.webp",
    homeScore: null,
    awayScore: null,
    note: "2nd Qualification Round. Champions path. 1st Leg",
    scope: "sports",
    hasStream: false,
    odds: [
      { lab: "W1", val: "3.555" },
      { lab: "DRAW", val: "3.62" },
      { lab: "W2", val: "1.96" },
      { lab: "1X", val: "1.8" },
      { lab: "12", val: "1.26" },
    ],
    weather: { temp: "+27°C", wind: "3.6", pressure: "758", humidity: "55" },
  };

  const DEFAULT_SEED = [DEMO_LIVE, DEMO_SPORTS];

  function migrateLegacy() {
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
      const legacy = localStorage.getItem(LEGACY_KEY);
      if (!legacy) return;
      const parsed = JSON.parse(legacy);
      if (!Array.isArray(parsed)) return;
      const hasDemo = parsed.some((item) => item && item.id === DEMO_LIVE.id);
      const next = hasDemo ? parsed : [DEMO_LIVE, ...parsed];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }

  function readAll() {
    migrateLegacy();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SEED));
        return DEFAULT_SEED.slice();
      }
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : DEFAULT_SEED.slice();
    } catch {
      return DEFAULT_SEED.slice();
    }
  }

  function writeAll(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  function ensureDemo() {
    const list = readAll();
    if (!list.some((item) => item.id === DEMO_LIVE.id)) {
      list.unshift(DEMO_LIVE);
      writeAll(list);
    }
    return list;
  }

  function getById(id) {
    return readAll().find((item) => item.id === id) || null;
  }

  function isFavourite(id) {
    return Boolean(getById(id));
  }

  function upsert(event) {
    if (!event || !event.id) return;
    const list = readAll().filter((item) => item.id !== event.id);
    list.unshift(event);
    writeAll(list);
  }

  function remove(id) {
    writeAll(readAll().filter((item) => item.id !== id));
  }

  function toggle(event) {
    if (!event || !event.id) return false;
    if (isFavourite(event.id)) {
      remove(event.id);
      return false;
    }
    upsert(event);
    return true;
  }

  function parseCard(el) {
    const root = el.closest("[data-mh-event]") || el;
    const id = root.getAttribute("data-event-id");
    if (!id) return null;

    const teamEls = root.querySelectorAll("[data-event-team], .mh-sp-card__team, .mh-sp-match__team, .mh-ev-card__team, .mh-match-card__team, .mh-fv-card__team");
    const homeEl = teamEls[0];
    const awayEl = teamEls[1];
    const homeImg = homeEl?.querySelector("img");
    const awayImg = awayEl?.querySelector("img");
    const scoreEls = root.querySelectorAll(".mh-match-card__score, .mh-fv-card__score, .score");

    const odds = Array.from(root.querySelectorAll(".mh-odds__btn")).map((btn) => ({
      lab: (btn.querySelector(".mh-odds__lab")?.textContent || "").trim(),
      val: (btn.getAttribute("data-odd") || btn.querySelector(".mh-odds__val")?.textContent || "").trim(),
    }));

    const scope = root.getAttribute("data-event-scope") || "sports";
    const hasStreamAttr = root.getAttribute("data-event-stream");
    const hasStream =
      hasStreamAttr === "1" ||
      hasStreamAttr === "true" ||
      Boolean(root.querySelector("[aria-label='1xZone'], .mh-fv-card__stream, .mh-match-card__actions [aria-label='1xZone']"));

    const homeScoreRaw =
      root.getAttribute("data-event-home-score") ||
      (scoreEls[0] ? scoreEls[0].textContent.trim() : null);
    const awayScoreRaw =
      root.getAttribute("data-event-away-score") ||
      (scoreEls[1] ? scoreEls[1].textContent.trim() : null);

    return {
      id,
      sport: root.getAttribute("data-event-sport") || "football",
      sportIcon: root.getAttribute("data-event-sport-icon") || "assets/icons/sport-football.svg",
      time:
        root.getAttribute("data-event-time") ||
        root.querySelector(".mh-sp-card__time, .mh-sp-match__time, .mh-ev-card__time, .mh-match-card__clock, .mh-fv-card__status")?.textContent?.trim() ||
        "",
      league:
        root.getAttribute("data-event-league") ||
        root.querySelector(".mh-sp-card__league, .mh-ev-card__league, .mh-match-card__league, .mh-fv-card__league")?.textContent?.trim() ||
        "",
      home: root.getAttribute("data-event-home") || homeEl?.textContent?.trim() || "",
      homeLogo: root.getAttribute("data-event-home-logo") || homeImg?.getAttribute("src") || "assets/logos/partner-barcelona.webp",
      away: root.getAttribute("data-event-away") || awayEl?.textContent?.trim() || "",
      awayLogo: root.getAttribute("data-event-away-logo") || awayImg?.getAttribute("src") || "assets/logos/partner-psg.webp",
      homeScore: homeScoreRaw === null || homeScoreRaw === "" ? null : homeScoreRaw,
      awayScore: awayScoreRaw === null || awayScoreRaw === "" ? null : awayScoreRaw,
      note:
        root.getAttribute("data-event-note") ||
        root.querySelector(".mh-sp-card__note, .mh-ev-card__note, .mh-match-card__note, .mh-fv-card__note")?.textContent?.trim() ||
        "",
      scope,
      hasStream: scope === "live" ? hasStream || true : Boolean(hasStream),
      odds,
      weather: {
        temp: root.getAttribute("data-event-temp") || "+27°C",
        wind: root.getAttribute("data-event-wind") || "3.6",
        pressure: root.getAttribute("data-event-pressure") || "758",
        humidity: root.getAttribute("data-event-humidity") || "55",
      },
    };
  }

  function toQuery(event) {
    const params = new URLSearchParams();
    params.set("id", event.id);
    return `event-info.html?${params.toString()}`;
  }

  function stashPending(event) {
    try {
      sessionStorage.setItem("mh-event-pending", JSON.stringify(event));
    } catch {
      /* ignore */
    }
  }

  function peekPending() {
    try {
      const raw = sessionStorage.getItem("mh-event-pending");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function takePending() {
    const event = peekPending();
    try {
      sessionStorage.removeItem("mh-event-pending");
    } catch {
      /* ignore */
    }
    return event;
  }

  function openEventInfo(event) {
    if (!event) return;
    stashPending(event);
    window.location.href = toQuery(event);
  }

  function initEventInfoLinks() {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-mh-event-info]");
      if (!btn) return;
      e.preventDefault();
      const event = parseCard(btn);
      if (event) openEventInfo(event);
      else window.location.href = "event-info.html";
    });
  }

  window.MhFavourites = {
    STORAGE_KEY,
    DEFAULT_SEED,
    DEMO_LIVE,
    DEMO_SPORTS,
    readAll,
    writeAll,
    ensureDemo,
    getById,
    isFavourite,
    upsert,
    remove,
    toggle,
    parseCard,
    openEventInfo,
    takePending,
    peekPending,
    stashPending,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initEventInfoLinks);
  } else {
    initEventInfoLinks();
  }
})();
