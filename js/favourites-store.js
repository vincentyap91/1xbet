(() => {
  const STORAGE_KEY = "sb-favourites-v1";

  /* Seed IDs must exist in homepage liveLeagues so favorites show in main tables */
  const DEMO_LIVE = {
    id: "lv5",
    sport: "baseball",
    sportIcon: "assets/icons/sport-baseball.svg",
    time: "Live",
    league: "USA. MLB",
    home: "Arizona Diamondbacks",
    homeLogo: "assets/images/mobile-home/teams/team-01.webp",
    away: "San Diego Padres",
    awayLogo: "assets/images/mobile-home/teams/team-02.webp",
    homeScore: 0,
    awayScore: 1,
    note: "",
    scope: "live",
    hasStream: true,
    odds: [
      { lab: "W1", val: "2.10" },
      { lab: "W2", val: "1.75" },
    ],
  };

  const DEMO_SPORTS = {
    id: "lv2",
    sport: "basketball",
    sportIcon: "assets/icons/sport-basketball.svg",
    time: "Live",
    league: "WNBA",
    home: "Indiana Fever (Women)",
    homeLogo: "assets/images/mobile-home/teams/team-03.webp",
    away: "Phoenix Mercury (Women)",
    awayLogo: "assets/images/mobile-home/teams/team-04.webp",
    homeScore: 19,
    awayScore: 12,
    note: "",
    scope: "live",
    hasStream: false,
    odds: [
      { lab: "W1", val: "1.85" },
      { lab: "W2", val: "1.95" },
    ],
  };

  const DEMO_EXTRA = {
    id: "lv-mls1",
    sport: "football",
    sportIcon: "assets/icons/sport-football.svg",
    time: "22:48 / 1st half",
    league: "USA. MLS",
    home: "CF Montreal",
    homeLogo: "assets/images/mobile-home/teams/team-05.webp",
    away: "Toronto",
    awayLogo: "assets/images/mobile-home/teams/team-06.webp",
    homeScore: 0,
    awayScore: 0,
    note: "",
    scope: "live",
    hasStream: true,
    odds: [
      { lab: "W1", val: "2.375" },
      { lab: "X", val: "3.36" },
      { lab: "W2", val: "3.205" },
    ],
  };

  const DEFAULT_SEED = [DEMO_LIVE, DEMO_SPORTS, DEMO_EXTRA];
  const LEGACY_ORPHAN_IDS = ["cs2-blast-heroic-mongolz", "ucl-ararat-shamrock"];

  function readAll() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SEED));
        return DEFAULT_SEED.slice();
      }
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || !parsed.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SEED));
        return DEFAULT_SEED.slice();
      }
      /* Migrate old demo seeds that never appear in homepage LIVE tables */
      const onlyOrphans =
        parsed.length > 0 &&
        parsed.every(
          (item) => !item || !item.id || LEGACY_ORPHAN_IDS.indexOf(item.id) !== -1
        );
      if (onlyOrphans) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SEED));
        return DEFAULT_SEED.slice();
      }
      return parsed;
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
    DEFAULT_SEED.forEach((demo) => {
      if (!list.some((item) => item.id === demo.id)) {
        list.unshift(demo);
        changed = true;
      }
    });
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
    DEMO_EXTRA,
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
