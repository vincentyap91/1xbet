(() => {
  const STORAGE_KEY = "sb-favourites-v1";

  const DEMO_LIVE = {
    id: "cs2-blast-heroic-mongolz",
    sport: "esports",
    sportIcon: "assets/icons/ft-gamepad.svg",
    time: "Event in progress / 2 map",
    league: "CS 2. BLAST Bounty Summer. Qualifier",
    home: "Heroic",
    homeLogo: "assets/images/mobile-home/teams/team-13.webp",
    away: "TheMongolz",
    awayLogo: "assets/images/mobile-home/teams/team-14.webp",
    homeScore: 1,
    awayScore: 0,
    note: "Round of 32",
    scope: "live",
    hasStream: true,
    odds: [],
  };

  const DEMO_SPORTS = {
    id: "ucl-ararat-shamrock",
    sport: "football",
    sportIcon: "assets/icons/sport-football.svg",
    time: "22/07 00:00",
    league: "UEFA Champions League",
    home: "Ararat - Armenia",
    homeLogo: "assets/images/partners/partner-caf.webp",
    away: "Shamrock Rovers",
    awayLogo: "assets/images/partners/partner-seriea.webp",
    homeScore: null,
    awayScore: null,
    note: "2nd Qualification Round. Champions path. 1st Leg",
    scope: "sports",
    hasStream: false,
    odds: [
      { lab: "W1", val: "3.555" },
      { lab: "DRAW", val: "3.62" },
      { lab: "W2", val: "1.96" },
    ],
  };

  const DEFAULT_SEED = [DEMO_LIVE, DEMO_SPORTS];

  function readAll() {
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
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {
      /* ignore */
    }
  }

  function ensureDemo() {
    const list = readAll();
    let changed = false;
    if (!list.some((item) => item.id === DEMO_LIVE.id)) {
      list.unshift(DEMO_LIVE);
      changed = true;
    }
    if (changed) writeAll(list);
    return list;
  }

  function getById(id) {
    return readAll().find((item) => item.id === id) || null;
  }

  function isFavourite(id) {
    return Boolean(getById(id));
  }

  function upsert(event) {
    if (!event || !event.id || String(event.id).startsWith("league-")) return;
    const list = readAll().filter((item) => item.id !== event.id);
    list.unshift(event);
    writeAll(list);
  }

  function remove(id) {
    if (!id || String(id).startsWith("league-")) return;
    writeAll(readAll().filter((item) => item.id !== id));
  }

  function toggle(event) {
    if (!event || !event.id || String(event.id).startsWith("league-")) return false;
    if (isFavourite(event.id)) {
      remove(event.id);
      return false;
    }
    upsert(event);
    return true;
  }

  function ids() {
    return readAll().map((item) => item.id);
  }

  window.SbFavourites = {
    STORAGE_KEY,
    DEMO_LIVE,
    DEMO_SPORTS,
    DEFAULT_SEED,
    readAll,
    writeAll,
    ensureDemo,
    getById,
    isFavourite,
    upsert,
    remove,
    toggle,
    ids,
  };
})();
