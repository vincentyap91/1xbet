/* =========================================================
   Sportsbook homepage — mock data & interactions
   Structure: live site | Colors: modified-color reference
   ========================================================= */

(function () {
  "use strict";

  /* Load desktop full-menu companion (≤900 hamburger) when not already present */
  try {
    const cur = document.currentScript;
    const hasMenu =
      document.querySelector('script[data-ds-menu-src], script[src*="desktop-menu.js"]');
    if (cur && !hasMenu) {
      const s = document.createElement("script");
      s.src = cur.src.replace(/[^/]*$/, "desktop-menu.js");
      s.dataset.dsMenuSrc = "1";
      s.async = false;
      cur.parentNode.insertBefore(s, cur.nextSibling);
    }
  } catch (e) { /* ignore */ }

  /* ---------- Mock data (live snapshot) ---------- */

  const isMarbleLivePage = document.body?.dataset?.page === "marble-live";
  const isSportsPage = document.body?.dataset?.page === "sports";
  const isEsportsPage = document.body?.dataset?.page === "esports";
  const isHomePage = document.body?.dataset?.page === "home";
  const isLiveNationalTeamPage =
    document.body?.dataset?.page === "live-national-team";
  const isNationalTeamPage =
    document.body?.dataset?.page === "national-team" || isLiveNationalTeamPage;

  const MARBLE_SPORT_ICON_FALLBACK = "assets/icons/marble/sport-football.svg";

  /** Map marble sport id → Figma SVG icon (#1D4268; sidebar/chips invert to white). */
  function marbleSportIcon(sportId) {
    const slug = String(sportId || "").replace(/^marble-/, "");
    const fileSlug = slug === "fidget-spinners" ? "spinners" : slug;
    if (!fileSlug) return MARBLE_SPORT_ICON_FALLBACK;
    return `assets/icons/marble/sport-${fileSlug}.svg`;
  }

  /* Circular country flags from https://1xlite-46272.pro/en (ui-champ-icon SVGs) */
  const flagIconMap = {
    MY: "assets/icons/lnt/flag-my.svg",
    US: "assets/icons/lnt/flag-us.svg",
    NZ: "assets/icons/lnt/flag-nz.svg",
    JP: "assets/icons/lnt/flag-jp.svg",
    FR: "assets/icons/lnt/flag-fr.svg",
    PE: "assets/icons/lnt/flag-pe.svg",
    EC: "assets/icons/lnt/flag-ec.svg",
    CO: "assets/icons/lnt/flag-co.svg",
    MX: "assets/icons/lnt/flag-mx.svg",
    CA: "assets/icons/lnt/flag-ca.svg",
    ES: "assets/icons/lnt/flag-spain.svg",
    BE: "assets/icons/lnt/flag-belgium.svg",
    NO: "assets/icons/lnt/flag-norway.svg",
    GB: "assets/icons/lnt/flag-england.svg",
    AR: "assets/icons/lnt/flag-argentina.svg",
    CH: "assets/icons/lnt/flag-switzerland.svg",
    ID: "assets/icons/lnt/flag-id.svg",
    PL: "assets/icons/lnt/flag-poland.svg",
    BR: "mobile/assets/flags/flag-br.svg",
    AU: "assets/icons/lnt/flag-au.svg",
    WC: "assets/icons/lnt/crumb-trophy.svg",
    RU: "assets/icons/lnt/crumb-trophy.svg",
    UA: "assets/icons/lnt/crumb-trophy.svg",
  };

  const sportHeaderIconMap = {
    basketball: "assets/icons/lnt/sport-basketball.svg",
    football: "assets/icons/lnt/acc-football.svg",
  };

  /* Left nav sports (Figma 3:16279) */
  const homeTopSports = [
    { id: "basketball", name: "Basketball", count: 12, icon: "assets/icons/sport-basketball.svg" },
    { id: "football", name: "Football", count: 11, icon: "assets/icons/sport-football.svg" },
    { id: "volleyball", name: "Volleyball", count: 6, icon: "assets/icons/sport-volleyball.svg" },
    { id: "esports", name: "Esports", count: 7, icon: "assets/icons/sport-esports.svg" },
    { id: "tennis", name: "Tennis", count: 3, icon: "assets/icons/sport-tennis.svg" },
    { id: "hockey", name: "Ice Hockey", count: 2, icon: "assets/icons/sport-hockey.svg" },
    { id: "tabletennis", name: "Table Tennis", count: 20, icon: "assets/icons/sport-tabletennis.svg" },
  ];

  const homeAzSports = [
    { id: "americanfootball", name: "American Football", count: 1, icon: "assets/icons/sport-americanfootball.svg" },
    { id: "athletics", name: "Athletics", count: 6, icon: "assets/icons/sport-athletics.svg" },
    { id: "badminton", name: "Badminton", count: 4, icon: "assets/icons/sport-badminton.svg" },
    { id: "baseball", name: "Baseball", count: 12, icon: "assets/icons/sport-baseball.svg" },
    { id: "beachvolleyball", name: "Beach Volleyball", count: 2, icon: "assets/icons/sport-beachvolleyball.svg" },
    { id: "boatracing", name: "Boat Racing", count: 8, icon: "assets/icons/sport-boatracing.svg" },
    { id: "boxing", name: "Boxing", count: 1, icon: "assets/icons/sport-boxing.svg" },
    { id: "cricket", name: "Cricket", count: 14, icon: "assets/icons/sport-cricket.svg" },
    { id: "fifa", name: "FIFA", count: 70, icon: "assets/icons/sport-fifa.svg" },
    { id: "futsal", name: "Futsal", count: 1, icon: "assets/icons/sport-futsal.svg" },
    { id: "greyhound", name: "Greyhound Racing", count: 14, icon: "assets/icons/sport-greyhound.svg" },
    { id: "handball", name: "Handball", count: 1, icon: "assets/icons/sport-handball.svg" },
    { id: "horseracing", name: "Horse Racing", count: 5, icon: "assets/icons/sport-horseracing.svg" },
    { id: "lottery", name: "Lottery", count: 6, icon: "assets/icons/sport-lottery.svg" },
    { id: "mortalkombat", name: "Mortal Kombat", count: 25, icon: "assets/icons/sport-mortalkombat.svg" },
  ];

  /* LIVE table Esports dropdown (ref: 1xlite desktop cyber sports menu) */
  const ESPORTS_GLOBE = "assets/icons/nav-globe.svg";
  const esportsMenuItems = [
    {
      id: "esports-ice-hockey",
      name: "Esports Ice Hockey",
      count: 9,
      icon: "assets/icons/sport-hockey.svg",
      leagues: [
        { id: "nhl-3x3", name: "NHL 26. 3x3. Threes", count: 1 },
        { id: "nhl-ones", name: "NHL 26. Ones", count: 3 },
        { id: "nhl-penalties", name: "NHL 26. Penalty shootouts", count: 5 },
      ],
    },
    {
      id: "streetfighter",
      name: "StreetFighter",
      count: 1,
      icon: "assets/icons/sport-mortalkombat.svg",
      leagues: [{ id: "sf-main", name: "Street Fighter. Matches", count: 1 }],
    },
    {
      id: "dota",
      name: "Dota",
      count: 7,
      icon: "assets/icons/esports/icon-dota2.svg",
      leagues: [
        { id: "dota-pro", name: "Dota 2. Pro matches", count: 4 },
        { id: "dota-asia", name: "Dota 2. Asia", count: 3 },
      ],
    },
    {
      id: "call-of-duty",
      name: "Call Of Duty",
      count: 2,
      icon: "assets/icons/sport-esports.svg",
      leagues: [
        { id: "cod-mp", name: "Call of Duty. Multiplayer", count: 1 },
        { id: "cod-warzone", name: "Call of Duty. Warzone", count: 1 },
      ],
    },
    {
      id: "world-of-tanks",
      name: "World of tanks",
      count: 2,
      icon: "assets/icons/sport-esports.svg",
      leagues: [{ id: "wot-battles", name: "World of Tanks. Battles", count: 2 }],
    },
    {
      id: "pes",
      name: "PES",
      count: 2,
      icon: "assets/icons/sport-fifa.svg",
      leagues: [
        { id: "pes-clubs", name: "eFootball. Clubs", count: 1 },
        { id: "pes-nations", name: "eFootball. Nations", count: 1 },
      ],
    },
    {
      id: "tekken",
      name: "Tekken",
      count: 1,
      icon: "assets/icons/sport-mortalkombat.svg",
      leagues: [{ id: "tekken-main", name: "Tekken. Matches", count: 1 }],
    },
  ];

  let esportsFlyoutId = esportsMenuItems[0]?.id || null;

  const nationalTopSports = [
    { id: "basketball", name: "Basketball", count: 1, icon: "assets/icons/sport-basketball.svg" },
    { id: "football", name: "Football", count: 2, icon: "assets/icons/sport-football.svg" },
    { id: "badminton", name: "Badminton", count: 10, icon: "assets/icons/sport-badminton.svg" },
    { id: "tennis", name: "Tennis", count: 4, icon: "assets/icons/sport-tennis.svg" },
    { id: "volleyball", name: "Volleyball", count: 1, icon: "assets/icons/sport-volleyball.svg" },
  ];

  const nationalAzSports = [
    { id: "athletics", name: "Athletics", count: 2, icon: "assets/icons/sport-athletics.svg" },
    { id: "cricket", name: "Cricket", count: 1, icon: "assets/icons/sport-cricket.svg" },
    { id: "futsal", name: "Futsal", count: 1, icon: "assets/icons/sport-futsal.svg" },
    { id: "hockey", name: "Ice Hockey", count: 1, icon: "assets/icons/sport-hockey.svg" },
  ];

  const marbleTopSports = [
    { id: "marble-football", name: "Marble Football", count: 1, icon: marbleSportIcon("marble-football") },
    { id: "marble-golf", name: "Marble Golf", count: 2, icon: marbleSportIcon("marble-golf") },
    { id: "marble-shooting", name: "Marble Shooting", count: 2, icon: marbleSportIcon("marble-shooting") },
    { id: "marble-fidget-spinners", name: "Marble Fidget Spinners", count: 2, icon: marbleSportIcon("marble-fidget-spinners") },
    { id: "marble-billiards", name: "Marble Billiards", count: 2, icon: marbleSportIcon("marble-billiards") },
    { id: "marble-waves", name: "Marble Waves", count: 2, icon: marbleSportIcon("marble-waves") },
    { id: "marble-curling", name: "Marble Curling", count: 2, icon: marbleSportIcon("marble-curling") },
    { id: "marble-round-target", name: "Marble Round Target", count: 3, icon: marbleSportIcon("marble-round-target") },
    { id: "marble-slides", name: "Marble Slides", count: 3, icon: marbleSportIcon("marble-slides") },
    { id: "marble-collision", name: "Marble Collision", count: 2, icon: marbleSportIcon("marble-collision") },
    { id: "marble-lotto", name: "Marble LOTTO", count: 2, icon: marbleSportIcon("marble-lotto") },
    { id: "marble-mma", name: "Marble MMA", count: 3, icon: marbleSportIcon("marble-mma") },
    { id: "marble-race", name: "Marble Race", count: 2, icon: marbleSportIcon("marble-race") },
    { id: "marble-baseball", name: "Marble Baseball", count: 2, icon: marbleSportIcon("marble-baseball") },
    { id: "marble-block-breaker", name: "Marble Block Breaker", count: 2, icon: marbleSportIcon("marble-block-breaker") },
    { id: "marble-basketball", name: "Marble Basketball", count: 2, icon: marbleSportIcon("marble-basketball") },
    { id: "marble-volleyball", name: "Marble Volleyball", count: 3, icon: marbleSportIcon("marble-volleyball") },
  ];

  const marbleAzSports = [];

  const topSports = isMarbleLivePage
    ? marbleTopSports
    : isNationalTeamPage
      ? nationalTopSports
      : homeTopSports;
  const azSports = isMarbleLivePage
    ? marbleAzSports
    : isNationalTeamPage
      ? nationalAzSports
      : homeAzSports;

  const sportsCatalog = [...topSports, ...azSports];

  const sportIconMap = {
    stream: "assets/icons/sport-stream.svg",
    basketball: "assets/icons/sport-basketball.svg",
    football: "assets/icons/sport-football.svg",
    volleyball: "assets/icons/sport-volleyball.svg",
    esports: "assets/icons/sport-esports.svg",
    tennis: "assets/icons/sport-tennis.svg",
    hockey: "assets/icons/sport-hockey.svg",
    tabletennis: "assets/icons/sport-tabletennis.svg",
    baseball: "assets/icons/sport-baseball.svg",
    cricket: "assets/icons/sport-cricket.svg",
    cycling: "assets/icons/sport-cycling.svg",
    americanfootball: "assets/icons/sport-americanfootball.svg",
    all: "assets/icons/sport-football.svg",
  };

  const topGamesSlides = [
    {
      league: "Club Friendlies",
      status: "2nd half, 73 minutes",
      home: "Santos Laguna",
      away: "America de Cali",
      homeCrest: "assets/images/team-santos.webp",
      awayCrest: "assets/images/team-america.webp",
      score: [0, 0],
      odds: [3.63, 1.68, 5.04],
    },
    {
      league: "Premier League",
      status: "1st half, 28 minutes",
      home: "Arsenal",
      away: "Chelsea",
      homeCrest: "assets/images/team-santos.webp",
      awayCrest: "assets/images/team-america.webp",
      score: [1, 0],
      odds: [2.15, 3.4, 3.25],
    },
    {
      league: "NBA",
      status: "Q3, 4:12",
      home: "Lakers",
      away: "Celtics",
      homeCrest: "assets/images/team-santos.webp",
      awayCrest: "assets/images/team-america.webp",
      score: [88, 91],
      odds: [1.95, 0, 1.85],
    },
    {
      league: "La Liga",
      status: "2nd half, 61 minutes",
      home: "Barcelona",
      away: "Sevilla",
      homeCrest: "assets/images/team-santos.webp",
      awayCrest: "assets/images/team-america.webp",
      score: [2, 1],
      odds: [1.42, 4.5, 7.2],
    },
    {
      league: "Serie A",
      status: "Not started",
      home: "Inter",
      away: "Milan",
      homeCrest: "assets/images/team-santos.webp",
      awayCrest: "assets/images/team-america.webp",
      score: [0, 0],
      odds: [2.4, 3.1, 2.9],
    },
  ];

  /** LIVE bar chips — Top sports first, then A–Z candidates (overflow → more menu) */
  const teIconMap = {
    basketball: "assets/icons/te-basketball.svg",
    football: "assets/icons/te-football.svg",
    volleyball: "assets/icons/te-volleyball.svg",
    esports: "assets/icons/te-esports.svg",
    tennis: "assets/icons/te-tennis.svg",
    hockey: "assets/icons/te-hockey.svg",
    tabletennis: "assets/icons/te-tabletennis.svg",
    americanfootball: "assets/icons/te-americanfootball.svg",
    athletics: "assets/icons/te-athletics.svg",
    badminton: "assets/icons/te-badminton.svg",
  };

  const liveSportFilters = [
    ...topSports.map((s) => ({
      id: s.id,
      label: s.name,
      icon: teIconMap[s.id] || s.icon,
      count: s.count,
      group: "top",
    })),
    ...azSports.map((s) => ({
      id: s.id,
      label: s.name,
      icon: teIconMap[s.id] || s.icon,
      count: s.count,
      group: "az",
    })),
  ];

  const sportFilters = [
    { id: "stream", label: "With live streams", icon: sportIconMap.stream },
    { id: "basketball", label: "Basketball", icon: sportIconMap.basketball },
    { id: "football", label: "Football", icon: sportIconMap.football },
    { id: "volleyball", label: "Volleyball", icon: sportIconMap.volleyball },
    { id: "esports", label: "Esports", icon: sportIconMap.esports },
    { id: "tennis", label: "Tennis", icon: sportIconMap.tennis },
    { id: "hockey", label: "Ice Hockey", icon: sportIconMap.hockey },
    { id: "tabletennis", label: "Table Tennis", icon: sportIconMap.tabletennis },
    { id: "baseball", label: "Baseball", icon: sportIconMap.baseball },
    { id: "cricket", label: "Cricket", icon: sportIconMap.cricket },
    { id: "cycling", label: "Cycling", icon: sportIconMap.cycling },
  ];

  /** LIVE dashboard — from live site snapshot */
  const homeLiveLeagues = [
    {
      id: "id-piala",
      name: "Indonesia. Piala Presiden",
      sport: "football",
      icon: "ID",
      events: [
        {
          id: "lv-id1",
          time: "Live",
          live: true,
          clock: "04:17 / 1st half",
          meta: "04:17 / 1st half / Round of 4",
          stream: true,
          tracker: true,
          lineups: true,
          stats: true,
          social: true,
          home: "Persib Bandung",
          away: "Persija Jakarta",
          homeLogo: "assets/images/mobile-home/teams/team-01.webp",
          awayLogo: "assets/images/mobile-home/teams/team-02.webp",
          scoreH: 0,
          scoreA: 0,
          o1: 2.208,
          ox: 3.1,
          o2: 3.405,
          dc1x: 1.294,
          dc12: 1.325,
          dc2x: 1.59,
          total: 2,
          over: 1.735,
          under: 2.11,
          more: 588,
          subGames: [
            {
              id: "h1",
              name: "1st half",
              o1: 3.12,
              ox: 2.076,
              o2: 3.94,
              dc1x: 1.246,
              dc12: 1.73,
              dc2x: 1.28,
              total: 0.5,
              over: 1.55,
              under: 2.376,
              more: 170,
            },
            {
              id: "h2",
              name: "2nd half",
              o1: 2.55,
              ox: 2.35,
              o2: 3.42,
              dc1x: 1.22,
              dc12: 1.46,
              dc2x: 1.39,
              total: 1,
              over: 1.78,
              under: 1.98,
              more: 74,
            },
            {
              id: "corners",
              name: "Corners",
              o1: null,
              ox: null,
              o2: null,
              dc1x: null,
              dc12: null,
              dc2x: null,
              total: 8,
              over: 1.82,
              under: 1.92,
              more: 42,
            },
            {
              id: "h1-corners",
              name: "1st half Corners",
              o1: null,
              ox: null,
              o2: null,
              dc1x: null,
              dc12: null,
              dc2x: null,
              total: 3.5,
              over: 1.88,
              under: 1.86,
              more: 28,
            },
          ],
        },
      ],
    },
    {
      id: "usa-mls",
      name: "USA. MLS",
      sport: "football",
      icon: "US",
      events: [
        {
          id: "lv-mls1",
          time: "Live",
          live: true,
          clock: "22:48 / 1st half",
          meta: "22:48 / 1st half",
          stream: true,
          tracker: true,
          stats: true,
          home: "CF Montreal",
          away: "Toronto",
          homeLogo: "assets/images/mobile-home/teams/team-03.webp",
          awayLogo: "assets/images/mobile-home/teams/team-04.webp",
          scoreH: 0,
          scoreA: 0,
          o1: 2.375,
          ox: 3.36,
          o2: 3.205,
          dc1x: 1.375,
          dc12: 1.345,
          dc2x: 1.615,
          total: 2.5,
          over: 2.21,
          under: 1.73,
          more: 637,
          subGames: [
            {
              id: "h1",
              name: "1st half",
              o1: 2.9,
              ox: 2.2,
              o2: 3.5,
              dc1x: 1.28,
              dc12: 1.55,
              dc2x: 1.35,
              total: 1,
              over: 1.9,
              under: 1.85,
              more: 120,
            },
            {
              id: "h2",
              name: "2nd half",
              o1: 2.4,
              ox: 2.5,
              o2: 3.1,
              dc1x: 1.24,
              dc12: 1.35,
              dc2x: 1.4,
              total: 1.5,
              over: 1.88,
              under: 1.9,
              more: 86,
            },
          ],
        },
      ],
    },
    {
      id: "nba-summer",
      name: "NBA. Summer League",
      sport: "basketball",
      icon: "US",
      events: [
        { id: "lv1", time: "Live", live: true, home: "Utah Jazz", away: "Washington Wizards", scoreH: 45, scoreA: 56, o1: 2.15, ox: null, o2: 1.72, total: 168.5, over: 1.87, under: 1.92, hcap: "+6.5", h1: 1.90, h2: 1.88, more: 471 },
      ],
    },
    {
      id: "wnba",
      name: "WNBA",
      sport: "basketball",
      icon: "US",
      events: [
        { id: "lv2", time: "Live", live: true, home: "Indiana Fever (Women)", away: "Phoenix Mercury (Women)", scoreH: 19, scoreA: 12, o1: 1.85, ox: null, o2: 1.95, total: 158.5, over: 1.90, under: 1.89, hcap: "-3.5", h1: 1.88, h2: 1.90, more: 465 },
        { id: "lv3", time: "Live", live: true, home: "Las Vegas Aces (Women)", away: "Portland Fire (Women)", scoreH: 7, scoreA: 6, o1: 1.55, ox: null, o2: 2.45, total: 165.5, over: 1.88, under: 1.91, hcap: "-6.5", h1: 1.86, h2: 1.92, more: 467 },
      ],
    },
    {
      id: "usa-ml",
      name: "USA. Major League",
      sport: "cricket",
      icon: "US",
      events: [
        { id: "lv4", time: "Live", live: true, home: "Washington Freedom", away: "Los Angeles Knight Riders", scoreH: "0/0", scoreA: "192/8", o1: 4.20, ox: null, o2: 1.22, total: 185.5, over: 1.85, under: 1.94, hcap: "+35.5", h1: 1.90, h2: 1.88, more: 27 },
      ],
    },
    {
      id: "mlb",
      name: "USA. MLB",
      sport: "baseball",
      icon: "US",
      events: [
        { id: "lv5", time: "Live", live: true, home: "Arizona Diamondbacks", away: "San Diego Padres", scoreH: 0, scoreA: 1, o1: 2.10, ox: null, o2: 1.75, total: 8.5, over: 1.90, under: 1.89, hcap: "+1.5", h1: 1.72, h2: 2.10, more: 467 },
        { id: "lv6", time: "Live", live: true, home: "Colorado Rockies", away: "San Francisco Giants", scoreH: 1, scoreA: 0, o1: 2.20, ox: null, o2: 1.68, total: 9.5, over: 1.87, under: 1.92, hcap: "+1.5", h1: 1.80, h2: 2.00, more: 472 },
        { id: "lv7", time: "Live", live: true, home: "Los Angeles Angels", away: "Texas Rangers", scoreH: 5, scoreA: 6, o1: 2.45, ox: null, o2: 1.55, total: 8.5, over: 1.91, under: 1.88, hcap: "+1.5", h1: 1.85, h2: 1.93, more: 122 },
        { id: "lv8", time: "02:10", live: false, home: "Milwaukee Brewers", away: "St. Louis Cardinals", scoreH: null, scoreA: null, o1: 1.78, ox: null, o2: 2.05, total: 7.5, over: 1.86, under: 1.93, hcap: "-1.5", h1: 2.05, h2: 1.75, more: 6 },
      ],
    },
    {
      id: "nz-women",
      name: "New Zealand Championship. Women",
      sport: "football",
      icon: "NZ",
      events: [
        {
          id: "lv9",
          time: "Live",
          live: true,
          clock: "67'",
          meta: "67' / 2nd half",
          home: "West Coast Rangers (Women)",
          away: "Western Springs (Women)",
          scoreH: 1,
          scoreA: 0,
          o1: 1.65,
          ox: 3.80,
          o2: 4.50,
          dc1x: 1.16,
          dc12: 1.22,
          dc2x: 2.05,
          total: 2.5,
          over: 1.95,
          under: 1.84,
          more: 6,
        },
      ],
    },
    {
      id: "milb",
      name: "MiLB. AAA. Pacific League",
      sport: "baseball",
      icon: "US",
      events: [
        { id: "lv10", time: "Live", live: true, home: "Albuquerque Isotopes", away: "Sugar Land Space Cowboys", scoreH: 6, scoreA: 4, o1: 1.70, ox: null, o2: 2.15, total: 9.5, over: 1.88, under: 1.91, hcap: "-1.5", h1: 1.92, h2: 1.86, more: 97 },
      ],
    },
    {
      id: "atp-cincinnati",
      name: "ATP Cincinnati",
      sport: "tennis",
      icon: "US",
      events: [
        {
          id: "lv-atp1",
          status: "live",
          elapsedTime: "2nd set",
          hasLiveStream: true,
          home: "Sinner J.",
          away: "Alcaraz C.",
          score: { home: 1, away: 0 },
          o1: 1.72,
          ox: null,
          o2: 2.10,
          total: 22.5,
          over: 1.88,
          under: 1.90,
          hcap: "-2.5",
          h1: 1.86,
          h2: 1.92,
          more: 214,
        },
        {
          id: "lv-atp2",
          status: "upcoming",
          startTime: "18:00",
          hasLiveStream: false,
          home: "Medvedev D.",
          away: "Zverev A.",
          score: { home: null, away: null },
          o1: 1.95,
          ox: null,
          o2: 1.85,
          total: 23.5,
          over: 1.87,
          under: 1.91,
          hcap: "-1.5",
          h1: 1.90,
          h2: 1.88,
          more: 186,
        },
        {
          id: "lv-atp3",
          status: "upcoming",
          startTime: "20:30",
          hasLiveStream: false,
          home: "Tsitsipas S.",
          away: "Rublev A.",
          score: { home: null, away: null },
          o1: 2.05,
          ox: null,
          o2: 1.78,
          total: 22.5,
          over: 1.90,
          under: 1.88,
          hcap: "+1.5",
          h1: 1.89,
          h2: 1.89,
          more: 172,
        },
      ],
    },
    {
      id: "epl-upcoming",
      name: "England. Premier League",
      sport: "football",
      icon: "GB",
      events: [
        {
          id: "lv-epl1",
          status: "upcoming",
          startTime: "22:00",
          hasLiveStream: false,
          home: "Arsenal",
          away: "Chelsea",
          score: { home: null, away: null },
          homeLogo: "assets/images/mobile-home/teams/team-01.webp",
          awayLogo: "assets/images/mobile-home/teams/team-02.webp",
          o1: 2.15,
          ox: 3.40,
          o2: 3.25,
          dc1x: 1.32,
          dc12: 1.28,
          dc2x: 1.66,
          total: 2.5,
          over: 1.92,
          under: 1.87,
          more: 842,
        },
      ],
    },
  ];

  /** National team page — Malaysia-focused leagues (same table component) */
  const nationalLiveLeagues = [
    {
      id: "my-dleague",
      name: "Malaysia Championship. D-League U20. Women",
      sport: "basketball",
      icon: "MY",
      events: [
        {
          id: "nt-dl1",
          time: "10:37",
          live: true,
          clock: "Live",
          stream: true,
          home: "Selangor EST Jersey U20 (Women)",
          away: "NS Matrix U20 (Women)",
          homeLogo: "assets/icons/lnt/team-selangor.png",
          awayLogo: "assets/icons/lnt/team-ns-matrix.png",
          scoreH: 24,
          scoreA: 22,
          o1: null,
          ox: null,
          o2: null,
          total: 129.5,
          over: null,
          under: null,
          hcap: "0",
          h1: null,
          h2: null,
          more: 321,
        },
      ],
    },
    {
      id: "my-uni",
      name: "Malaysia. Universities Championship",
      sport: "football",
      icon: "MY",
      events: [
        { id: "nt1", time: "Live", live: true, home: "UM FC", away: "UiTM FC", scoreH: 1, scoreA: 1, o1: 2.35, ox: 3.10, o2: 2.85, total: 2.5, over: 1.92, under: 1.86, hcap: "0", h1: 1.88, h2: 1.90, more: 125 },
        { id: "nt2", time: "Live", live: true, home: "UKM FC", away: "UPM FC", scoreH: 0, scoreA: 2, o1: 3.40, ox: 3.25, o2: 2.05, total: 2.5, over: 1.88, under: 1.90, hcap: "+0.5", h1: 1.85, h2: 1.93, more: 98 },
      ],
    },
    {
      id: "japan-open",
      name: "Japan Open",
      sport: "tennis",
      icon: "JP",
      events: [
        { id: "nt3", time: "Live", live: true, home: "Nishikori K.", away: "Daniel T.", scoreH: 1, scoreA: 0, o1: 1.55, ox: null, o2: 2.40, total: 21.5, over: 1.90, under: 1.88, hcap: "-3.5", h1: 1.86, h2: 1.92, more: 84 },
        { id: "nt4", time: "14:30", live: false, home: "Watanuki Y.", away: "Mochizuki S.", scoreH: null, scoreA: null, o1: 1.95, ox: null, o2: 1.85, total: 22.5, over: 1.87, under: 1.91, hcap: "-1.5", h1: 1.90, h2: 1.88, more: 112 },
      ],
    },
    {
      id: "my-super-league",
      name: "Malaysia. Super League",
      sport: "football",
      icon: "MY",
      events: [
        { id: "nt5", time: "Live", live: true, home: "Johor Darul Ta'zim", away: "Selangor FC", scoreH: 2, scoreA: 0, o1: 1.45, ox: 4.20, o2: 6.50, total: 2.5, over: 1.84, under: 1.94, hcap: "-1.5", h1: 1.92, h2: 1.86, more: 210 },
        { id: "nt6", time: "20:00", live: false, home: "Malaysia", away: "Thailand", scoreH: null, scoreA: null, o1: 2.55, ox: 3.05, o2: 2.75, total: 2.5, over: 1.90, under: 1.88, hcap: "0", h1: 1.88, h2: 1.90, more: 340 },
      ],
    },
    {
      id: "my-badminton",
      name: "Malaysia. Badminton Open",
      sport: "badminton",
      icon: "MY",
      events: [
        { id: "nt7", time: "Live", live: true, home: "Lee Zii Jia", away: "Kento Momota", scoreH: 11, scoreA: 15, o1: 1.95, ox: null, o2: 1.85, total: 41.5, over: 1.89, under: 1.89, hcap: "+4.5", h1: 1.85, h2: 1.93, more: 56 },
        { id: "nt8", time: "Live", live: true, home: "Goh Jin Wei", away: "An Se Young", scoreH: 8, scoreA: 14, o1: 2.80, ox: null, o2: 1.42, total: 40.5, over: 1.88, under: 1.90, hcap: "+5.5", h1: 1.86, h2: 1.92, more: 48 },
      ],
    },
  ];

  /** Marble-Live — virtual marble sports leagues (Figma 23:10116) */
  const marbleLiveLeagues = [
    {
      id: "mb-football",
      name: "International league",
      sport: "marble-football",
      icon: "MB",
      events: [
        { id: "mb1", time: "Live", live: true, clock: "2nd half, 67'", home: "Marble Red", away: "Marble Blue", scoreH: 3, scoreA: 2, o1: 2.15, ox: 3.40, o2: 3.10, total: 4.5, over: 1.88, under: 1.90, hcap: "-0.5", h1: 1.92, h2: 1.86, more: 107 },
        { id: "mb2", time: "Live", live: true, clock: "1st half, 22'", home: "Marble Green", away: "Marble Gold", scoreH: 1, scoreA: 0, o1: 1.95, ox: 3.25, o2: 3.55, total: 2.5, over: 1.90, under: 1.88, hcap: "0", h1: 1.88, h2: 1.90, more: 84 },
      ],
    },
    {
      id: "mb-golf",
      name: "International golf league",
      sport: "marble-golf",
      icon: "MB",
      events: [
        { id: "mb3", time: "Live", live: true, clock: "Hole 12", home: "Marble Red", away: "Marble Blue", scoreH: 2, scoreA: 1, o1: 1.72, ox: null, o2: 2.10, total: 3.5, over: 1.87, under: 1.91, hcap: "-0.5", h1: 1.85, h2: 1.93, more: 56 },
      ],
    },
    {
      id: "mb-basketball",
      name: "International basketball league",
      sport: "marble-basketball",
      icon: "MB",
      events: [
        { id: "mb4", time: "Live", live: true, clock: "Q3, 4:18", home: "Marble Red", away: "Marble Blue", scoreH: 48, scoreA: 51, o1: 2.05, ox: null, o2: 1.78, total: 110.5, over: 1.89, under: 1.89, hcap: "+2.5", h1: 1.90, h2: 1.88, more: 92 },
        { id: "mb5", time: "Live", live: true, clock: "Q2, 8:02", home: "Marble Green", away: "Marble Silver", scoreH: 22, scoreA: 19, o1: 1.68, ox: null, o2: 2.20, total: 105.5, over: 1.91, under: 1.87, hcap: "-3.5", h1: 1.86, h2: 1.92, more: 78 },
      ],
    },
    {
      id: "mb-volleyball",
      name: "International volleyball league",
      sport: "marble-volleyball",
      icon: "MB",
      events: [
        { id: "mb6", time: "Live", live: true, clock: "Set 2", home: "Marble Red", away: "Marble Blue", scoreH: 1, scoreA: 0, o1: 1.85, ox: null, o2: 1.95, total: 45.5, over: 1.88, under: 1.90, hcap: "-1.5", h1: 1.90, h2: 1.88, more: 64 },
      ],
    },
    {
      id: "mb-mma",
      name: "International MMA league",
      sport: "marble-mma",
      icon: "MB",
      events: [
        { id: "mb7", time: "Live", live: true, clock: "Round 2", home: "Marble Red", away: "Marble Blue", scoreH: null, scoreA: null, o1: 1.55, ox: null, o2: 2.40, total: null, over: null, under: null, hcap: null, h1: null, h2: null, more: 41 },
        { id: "mb8", time: "Live", live: true, clock: "Round 1", home: "Marble Gold", away: "Marble Green", scoreH: null, scoreA: null, o1: 2.25, ox: null, o2: 1.62, total: null, over: null, under: null, hcap: null, h1: null, h2: null, more: 38 },
      ],
    },
    {
      id: "mb-baseball",
      name: "International baseball league",
      sport: "marble-baseball",
      icon: "MB",
      events: [
        { id: "mb9", time: "Live", live: true, clock: "5th inning", home: "Marble Red", away: "Marble Blue", scoreH: 4, scoreA: 3, o1: 1.90, ox: null, o2: 1.90, total: 8.5, over: 1.88, under: 1.90, hcap: "-1.5", h1: 1.95, h2: 1.84, more: 72 },
      ],
    },
  ];

  const liveLeagues = isMarbleLivePage
    ? marbleLiveLeagues
    : isNationalTeamPage
      ? nationalLiveLeagues
      : homeLiveLeagues;

  /** LINE dashboard — pre-match from live site */
  const lineLeagues = [
    {
      id: "ru-l1",
      name: "Russian Championship. League 1",
      sport: "football",
      icon: "RU",
      events: [
        {
          id: "ln-ru1",
          time: "03 Aug 22:00",
          live: false,
          home: "Ufa",
          away: "KAMAZ",
          scoreH: null,
          scoreA: null,
          o1: 2.45,
          ox: 3.10,
          o2: 2.90,
          dc1x: 1.38,
          dc12: 1.32,
          dc2x: 1.50,
          total: 2.5,
          over: 1.92,
          under: 1.87,
          more: 1084,
        },
      ],
    },
    {
      id: "ua-pl",
      name: "Ukraine. Premier League",
      sport: "football",
      icon: "UA",
      events: [
        {
          id: "ln-ua1",
          time: "03 Aug 23:30",
          live: false,
          home: "Bukovyna Chernivtsi",
          away: "LNZ",
          scoreH: null,
          scoreA: null,
          o1: 2.20,
          ox: 3.25,
          o2: 3.30,
          dc1x: 1.32,
          dc12: 1.34,
          dc2x: 1.64,
          total: 2.5,
          over: 1.90,
          under: 1.89,
          more: 944,
        },
        {
          id: "ln-ua2",
          time: "04 Aug 01:00",
          live: false,
          home: "Shakhtar Donetsk",
          away: "Kudrivka",
          scoreH: null,
          scoreA: null,
          o1: 1.28,
          ox: 5.40,
          o2: 9.50,
          dc1x: 1.05,
          dc12: 1.12,
          dc2x: 3.40,
          total: 2.5,
          over: 1.78,
          under: 2.02,
          more: 936,
        },
      ],
    },
    {
      id: "atp-mtl",
      name: "ATP. Montreal. Hard",
      sport: "tennis",
      icon: "CA",
      events: [
        { id: "ln-atp1", time: "03 Aug 22:00", live: false, home: "Alexis Galarneau", away: "Vit Kopriva", scoreH: null, scoreA: null, o1: 2.10, ox: null, o2: 1.72, total: 22.5, over: 1.88, under: 1.90, hcap: "+2.5", h1: 1.85, h2: 1.93, more: 187 },
        { id: "ln-atp2", time: "03 Aug 23:30", live: false, home: "James Duckworth", away: "Christopher O'Connell", scoreH: null, scoreA: null, o1: 2.05, ox: null, o2: 1.76, total: 22.5, over: 1.90, under: 1.88, hcap: "+1.5", h1: 1.90, h2: 1.88, more: 187 },
        { id: "ln-atp3", time: "04 Aug 01:00", live: false, home: "Matteo Berrettini", away: "Mariano Navone", scoreH: null, scoreA: null, o1: 1.55, ox: null, o2: 2.45, total: 22.5, over: 1.87, under: 1.91, hcap: "-2.5", h1: 1.88, h2: 1.90, more: 187 },
      ],
    },
    {
      id: "wnba-line",
      name: "WNBA",
      sport: "basketball",
      icon: "US",
      events: [
        { id: "ln-wnba1", time: "02:00", live: false, home: "Atlanta Dream", away: "Las Vegas Aces", scoreH: null, scoreA: null, o1: 4.12, ox: null, o2: 1.25, total: 165.5, over: 1.90, under: 1.88, hcap: "+8.5", h1: 1.90, h2: 1.88, more: 253 },
        { id: "ln-wnba2", time: "Tomorrow 07:00", live: false, home: "Connecticut Sun", away: "Indiana Fever", scoreH: null, scoreA: null, o1: 2.58, ox: null, o2: 1.52, total: 162.5, over: 1.91, under: 1.87, hcap: "+3.5", h1: 1.89, h2: 1.89, more: 240 },
      ],
    },
    {
      id: "wc2026",
      name: "World Cup 2026",
      sport: "football",
      icon: "WC",
      events: [
        {
          id: "ln1",
          time: "10 July",
          live: false,
          home: "Spain",
          away: "Belgium",
          homeLogo: "assets/icons/lnt/flag-spain.svg",
          awayLogo: "assets/icons/lnt/flag-belgium.svg",
          scoreH: null,
          scoreA: null,
          o1: 2.15,
          ox: 3.20,
          o2: 3.45,
          dc1x: 1.29,
          dc12: 1.32,
          dc2x: 1.66,
          total: 2.5,
          over: 1.95,
          under: 1.84,
          more: 1444,
        },
      ],
    },
    {
      id: "wimbledon",
      name: "Wimbledon. Grass",
      sport: "tennis",
      icon: "GB",
      events: [
        { id: "ln2", time: "10 July", live: false, home: "Arthur Fery", away: "Alexander Zverev", scoreH: null, scoreA: null, o1: 6.50, ox: null, o2: 1.12, total: 35.5, over: 1.90, under: 1.88, hcap: "+5.5", h1: 1.85, h2: 1.93, more: 242 },
      ],
    },
    {
      id: "nba-line",
      name: "NBA. Summer League",
      sport: "basketball",
      icon: "US",
      events: [
        { id: "ln3", time: "10 July", live: false, home: "Los Angeles Clippers", away: "Sacramento Kings", scoreH: null, scoreA: null, o1: 1.74, ox: null, o2: 2.10, total: 172.5, over: 1.91, under: 1.88, hcap: "-3.5", h1: 1.85, h2: 1.93, more: 304 },
      ],
    },
    {
      id: "tdf",
      name: "Tour de France. 2026",
      sport: "cycling",
      icon: "FR",
      events: [
        { id: "ln4", time: "10 July", live: false, home: "Stage 7 Winner", away: "Field", scoreH: null, scoreA: null, o1: 4.50, ox: null, o2: 1.18, total: null, over: null, under: null, hcap: null, h1: null, h2: null, more: 314 },
        { id: "ln5", time: "10 July", live: false, home: "Overall Winner", away: "Field", scoreH: null, scoreA: null, o1: 3.20, ox: null, o2: 1.35, total: null, over: null, under: null, hcap: null, h1: null, h2: null, more: 822 },
      ],
    },
    {
      id: "japan-npb",
      name: "Japan. NPB",
      sport: "baseball",
      icon: "JP",
      events: [
        { id: "ln6", time: "10 July", live: false, home: "Chiba Lotte Marines", away: "Orix Buffaloes", scoreH: null, scoreA: null, o1: 1.90, ox: null, o2: 1.90, total: 7.5, over: 1.88, under: 1.91, hcap: "-1.5", h1: 2.10, h2: 1.72, more: 99 },
        { id: "ln7", time: "10 July", live: false, home: "Chunichi Dragons", away: "Hiroshima Toyo Carp", scoreH: null, scoreA: null, o1: 2.15, ox: null, o2: 1.70, total: 7.5, over: 1.90, under: 1.89, hcap: "+1.5", h1: 1.75, h2: 2.05, more: 99 },
        { id: "ln8", time: "10 July", live: false, home: "Fukuoka SoftBank Hawks", away: "Tohoku Rakuten Golden Eagles", scoreH: null, scoreA: null, o1: 1.65, ox: null, o2: 2.25, total: 8.5, over: 1.87, under: 1.92, hcap: "-1.5", h1: 1.95, h2: 1.84, more: 99 },
        { id: "ln9", time: "10 July", live: false, home: "Hanshin Tigers", away: "Tokyo Yakult Swallows", scoreH: null, scoreA: null, o1: 1.80, ox: null, o2: 2.00, total: 7.5, over: 1.89, under: 1.90, hcap: "-1.5", h1: 2.00, h2: 1.80, more: 99 },
        { id: "ln10", time: "10 July", live: false, home: "Hokkaido Nippon Ham Fighters", away: "Saitama Seibu Lions", scoreH: null, scoreA: null, o1: 1.95, ox: null, o2: 1.85, total: 8.5, over: 1.91, under: 1.88, hcap: "+1.5", h1: 1.78, h2: 2.02, more: 99 },
      ],
    },
  ];

  /**
   * Desktop Sports competition navigation.
   * Card order mirrors the reference Line rail; each card targets one table league.
   * `group` stays as metadata (Country / League / Club) even though the rail renders flat.
   */
  const SPORTS_COMPETITIONS = [
    {
      id: "uefa-el",
      name: "UEFA Europa League",
      group: "League",
      icon: "assets/icons/sp-competition/trophy.svg",
      leagueId: "sp-uefa-el",
      sport: "football",
      country: "WC",
      teams: ["Roma", "Real Betis"],
    },
    {
      id: "north-american",
      name: "North American Championship",
      group: "League",
      icon: "assets/icons/sp-competition/globe.svg",
      leagueId: "sp-north-american",
      sport: "football",
      country: "WC",
      teams: ["Monterrey", "Los Angeles FC"],
    },
    {
      id: "wnba",
      name: "WNBA",
      group: "League",
      icon: "assets/icons/lnt/flag-us.svg",
      leagueId: "wnba-line",
      sport: "basketball",
    },
    {
      id: "uefa-conference",
      name: "UEFA Conference League",
      group: "League",
      icon: "mobile/assets/flags/flag-eu.svg",
      leagueId: "sp-uefa-conference",
      sport: "football",
      country: "WC",
      teams: ["Fiorentina", "AZ Alkmaar"],
    },
    {
      id: "usa-mlb",
      name: "USA. MLB",
      group: "Country",
      icon: "assets/icons/lnt/flag-us.svg",
      leagueId: "sp-usa-mlb",
      sport: "baseball",
      country: "US",
      teams: ["Seattle Mariners", "Detroit Tigers"],
    },
    {
      id: "colombia-categoria",
      name: "Colombia. Categoría Primera A",
      group: "Country",
      icon: "assets/icons/lnt/flag-co.svg",
      leagueId: "sp-colombia",
      sport: "football",
      country: "CO",
      teams: ["Atlético Nacional", "Millonarios"],
    },
    {
      id: "concacaf-central",
      name: "CONCACAF Central American Cup",
      group: "League",
      icon: "assets/icons/sp-competition/globe.svg",
      leagueId: "sp-concacaf",
      sport: "football",
      country: "WC",
      teams: ["Alajuelense", "Real Estelí"],
    },
    {
      id: "club-friendlies",
      name: "Club Friendlies",
      group: "Club",
      icon: "assets/icons/sp-competition/globe.svg",
      leagueId: "sp-club-friendlies",
      sport: "football",
      country: "WC",
      teams: ["Santos Laguna", "América de Cali"],
    },
    {
      id: "atp-montreal",
      name: "ATP. Montreal",
      group: "League",
      icon: "assets/icons/lnt/flag-ca.svg",
      leagueId: "atp-mtl",
      sport: "tennis",
    },
    {
      id: "wta-warsaw",
      name: "WTA. Warsaw",
      group: "League",
      icon: "assets/icons/lnt/flag-poland.svg",
      leagueId: "sp-wta-warsaw",
      sport: "tennis",
      country: "PL",
      teams: ["Iga Swiatek", "Magda Linette"],
    },
    {
      id: "wta-toronto",
      name: "WTA. Toronto",
      group: "League",
      icon: "assets/icons/lnt/flag-ca.svg",
      leagueId: "sp-wta-toronto",
      sport: "tennis",
      country: "CA",
      teams: ["Coco Gauff", "Jessica Pegula"],
    },
    {
      id: "brazil-copa",
      name: "Brazil. Copa do Brasil",
      group: "Country",
      icon: "mobile/assets/flags/flag-br.svg",
      leagueId: "sp-brazil-copa",
      sport: "football",
      country: "BR",
      teams: ["Flamengo", "Palmeiras"],
    },
    {
      id: "england-league-cup",
      name: "England. League Cup",
      group: "Country",
      icon: "assets/icons/lnt/flag-england.svg",
      leagueId: "sp-england-cup",
      sport: "football",
      country: "GB",
      teams: ["Newcastle United", "Aston Villa"],
    },
    {
      id: "japan-npb",
      name: "Japan. NPB",
      group: "Country",
      icon: "assets/icons/lnt/flag-jp.svg",
      leagueId: "japan-npb",
      sport: "baseball",
    },
    {
      id: "australian-football",
      name: "Australian Football",
      group: "Country",
      icon: "assets/icons/lnt/flag-au.svg",
      leagueId: "sp-australian-football",
      sport: "americanfootball",
      country: "AU",
      teams: ["Sydney Swans", "Brisbane Lions"],
    },
  ];

  function makeSportsCompetitionLeague(comp, index) {
    const sport = comp.sport || "football";
    const drawSport = sport === "football";
    return {
      id: comp.leagueId,
      name: comp.name,
      sport,
      icon: comp.country || "WC",
      events: [
        {
          id: `sp-comp-${index + 1}`,
          status: "upcoming",
          startTime: `${String(8 + (index % 12)).padStart(2, "0")}:${
            index % 2 ? "30" : "00"
          }`,
          live: false,
          home: comp.teams[0],
          away: comp.teams[1],
          scoreH: null,
          scoreA: null,
          o1: Number((1.62 + (index % 5) * 0.13).toFixed(2)),
          ox: drawSport ? Number((3.1 + (index % 3) * 0.15).toFixed(2)) : null,
          o2: Number((2.05 + (index % 4) * 0.18).toFixed(2)),
          dc1x: drawSport ? 1.28 : null,
          dc12: drawSport ? 1.32 : null,
          dc2x: drawSport ? 1.58 : null,
          total: drawSport ? 2.5 : sport === "basketball" ? 164.5 : 8.5,
          over: 1.9,
          under: 1.88,
          hcap: drawSport ? null : "-1.5",
          h1: drawSport ? null : 1.86,
          h2: drawSport ? null : 1.92,
          more: 120 + index * 17,
        },
      ],
    };
  }

  const existingLineLeagueIds = new Set(lineLeagues.map((league) => league.id));
  SPORTS_COMPETITIONS.forEach((comp, index) => {
    if (!existingLineLeagueIds.has(comp.leagueId) && comp.teams) {
      lineLeagues.push(makeSportsCompetitionLeague(comp, index));
      existingLineLeagueIds.add(comp.leagueId);
    }
  });

  const homeAccumulators =
    (window.SbAccumulators && window.SbAccumulators.HOME_DATA) || {
      1: [],
      2: [],
    };

  const liveNationalAccumulators = {
    1: [
      {
        id: "a1",
        match: "Spain vs Belgium",
        selection: "Spain",
        odds: 1.66,
        league: "World Cup 2026",
        market: "1X2",
        flags: ["ES", "BE"],
        sportIcon: "assets/icons/lnt/acc-football.svg",
        when: "11.07 07:00",
      },
      {
        id: "a2",
        match: "Norway vs England",
        selection: "England",
        odds: 1.615,
        league: "World Cup 2026",
        market: "1X2",
        flags: ["NO", "GB"],
        sportIcon: "assets/icons/lnt/acc-football.svg",
        when: "11.07 10:00",
      },
      {
        id: "a3",
        match: "Argentina vs Switzerland",
        selection: "Argentina",
        odds: 1.22,
        league: "World Cup 2026",
        market: "1X2",
        flags: ["AR", "CH"],
        sportIcon: "assets/icons/lnt/acc-football.svg",
        when: "11.07 03:00",
      },
    ],
    2: [
      {
        id: "a6",
        match: "Ingkar Dyussebay vs Aruzhan Sagandikova",
        selection: "Dyussebay",
        odds: 1.48,
        league: "World Tennis. Astana. Women",
        market: "Winner",
        avatars: ["assets/icons/lnt/avatar-dyussebay.png", "assets/icons/lnt/avatar-sagandikova.png"],
        sportIcon: "assets/icons/sport-tennis.svg",
        when: "2nd set",
      },
      {
        id: "a7",
        match: "Aleksandr Shprynov vs Artem Petrov",
        selection: "Petrov",
        odds: 1.72,
        league: "Russia. League Pro",
        market: "Winner",
        avatars: ["assets/icons/lnt/avatar-dyussebay.png", "assets/icons/lnt/avatar-sagandikova.png"],
        sportIcon: "assets/icons/sport-tabletennis.svg",
        when: "2nd set",
      },
      {
        id: "a8",
        match: "Stalnye Topory vs Svirepye Eji",
        selection: "Topory",
        odds: 1.55,
        league: "Tournament Magnitka Open",
        market: "Winner",
        avatars: ["assets/icons/lnt/team-selangor.png", "assets/icons/lnt/team-ns-matrix.png"],
        sportIcon: "assets/icons/sport-hockey.svg",
        when: "Live",
      },
    ],
  };

  const accumulators = isLiveNationalTeamPage ? liveNationalAccumulators : homeAccumulators;

  /* ---------- State ---------- */

  const PINNED_STORAGE_KEY = "1xbet_pinned_matches";

  function loadPinnedMatches() {
    try {
      const raw = localStorage.getItem(PINNED_STORAGE_KEY);
      if (!raw) return [];
      const data = JSON.parse(raw);
      const list = Array.isArray(data)
        ? data
        : data && Array.isArray(data.pinnedMatches)
          ? data.pinnedMatches
          : [];
      return [...new Set(list.filter((id) => typeof id === "string"))];
    } catch (_) {
      /* ignore corrupt storage */
    }
    return [];
  }

  function savePinnedMatches(ids) {
    try {
      localStorage.setItem(PINNED_STORAGE_KEY, JSON.stringify({ pinnedMatches: ids }));
    } catch (_) {
      /* quota / private mode */
    }
  }

  const SB_FAV_KEY = "sb-favourites-v1";

  function readStoredFavourites() {
    if (window.SbFavourites?.readAll) return window.SbFavourites.readAll();
    try {
      const raw = localStorage.getItem(SB_FAV_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function writeStoredFavourites(list) {
    if (window.SbFavourites?.writeAll) {
      window.SbFavourites.writeAll(list);
      return;
    }
    try {
      localStorage.setItem(SB_FAV_KEY, JSON.stringify(list));
    } catch {
      /* ignore */
    }
  }

  function loadFavouriteIdSet() {
    return new Set(readStoredFavourites().map((item) => item.id).filter(Boolean));
  }

  function findEventInLeagues(id) {
    const pools = [];
    if (typeof liveLeagues !== "undefined") pools.push(...liveLeagues);
    if (typeof lineLeagues !== "undefined") pools.push(...lineLeagues);
    for (const league of pools) {
      const event = (league.events || []).find((e) => e.id === id);
      if (event) return { league, event: normalizeMatchEvent(event) };
    }
    return null;
  }

  function eventToFavouriteRecord(league, event) {
    const e = normalizeMatchEvent(event);
    const sport = league.sport || "football";
    return {
      id: e.id,
      sport,
      sportIcon: sportIconMap[sport] || `assets/icons/sport-${sport}.svg`,
      time:
        e.status === "live"
          ? e.elapsedTime || e.clock || e.time || "Event in progress"
          : e.startTime || e.time || "",
      league: league.name || "",
      home: e.home || "",
      homeLogo: e.homeLogo || "assets/images/mobile-home/teams/team-01.webp",
      away: e.away || "",
      awayLogo: e.awayLogo || "assets/images/mobile-home/teams/team-02.webp",
      homeScore: e.score.home != null ? e.score.home : null,
      awayScore: e.score.away != null ? e.score.away : null,
      note: e.note || "",
      scope: e.status === "live" ? "live" : "sports",
      hasStream: Boolean(e.hasLiveStream),
      odds: [],
    };
  }

  function persistFavouriteToggle(id, adding) {
    if (!id || String(id).startsWith("league-")) return;
    if (window.SbFavourites) {
      if (adding) {
        const found = findEventInLeagues(id);
        if (found) window.SbFavourites.upsert(eventToFavouriteRecord(found.league, found.event));
        else window.SbFavourites.upsert({ id, scope: "sports", home: id, away: "", league: "Favourite", time: "", sportIcon: "assets/icons/sport-football.svg" });
      } else {
        window.SbFavourites.remove(id);
      }
      return;
    }
    const list = readStoredFavourites().filter((item) => item.id !== id);
    if (adding) {
      const found = findEventInLeagues(id);
      list.unshift(found ? eventToFavouriteRecord(found.league, found.event) : {
        id,
        scope: "sports",
        home: id,
        away: "",
        league: "Favourite",
        time: "",
        sportIcon: "assets/icons/sport-football.svg",
        hasStream: false,
      });
    }
    writeStoredFavourites(list);
  }

  const SPORTS_COMPETITION_STORAGE_KEY = "1xbet-sports-competition";

  function clearSportsCompetitionSelection() {
    try {
      sessionStorage.removeItem(SPORTS_COMPETITION_STORAGE_KEY);
    } catch (_) {
      /* storage unavailable */
    }
  }

  /* Wipe legacy persisted picks so Sports always opens on the full Line list */
  if (isSportsPage) clearSportsCompetitionSelection();

  const state = {
    betSlip: [],
    favorites: loadFavouriteIdSet(),
    pinnedMatches: loadPinnedMatches(),
    collapsedLeagues: new Set(),
    /** Desktop event rows with sub-games panel open (closed by default) */
    expandedEvents: new Set(),
    activeLiveFilter: null,
    /** Homepage mobile Sports drawer supports several selected sports; empty = All. */
    activeHomeSports: new Set(),
    activeLineFilter: null,
    /** Main LIVE section tab: matches | recommended | favorites | upcoming | p1 | p2 */
    liveView: "matches",
    /** National Team mode bar: "live" | "sports" — driven by page (links navigate) */
    ntMarketMode: isLiveNationalTeamPage ? "live" : "sports",
    streamOnly: false,
    sportsExpanded: false,
    searchQuery: "",
    liveSearch: "",
    lineSearch: "",
    lineType: isSportsPage ? "sports" : "live",
    /** Desktop Sports competition card selection — never defaulted; null = show all Line matches */
    sportsCompetition: null,
    promoIndex: 0,
    myBetsTab: "open",
    /** When true, My bets Open shows the full bet list (View All expanded) */
    myBetsViewAll: false,
    betHistoryCategory: "all",
    betHistoryStatus: "all",
    betHistoryRange: "7d",
    betHistoryCustomFrom: "",
    betHistoryCustomTo: "",
    slipSettings: {
      automax: false,
      balance: true,
      potentialWinnings: true,
      selectAccount: true,
    },
    baselineOdds: {
      odds: "",
      cancelOnScoreChange: false,
    },
    stakePrefs: {
      increment: 10,
      quick: [1, 100, 250],
    },
    betTypeMode: "single",
    oddsChangeMode: "increase",
    promoCode: "",
  };

  const SLIP_SETTINGS_KEY = "1xbet-bet-slip-settings";
  const SLIP_SETTINGS_DEFAULTS = {
    automax: false,
    balance: true,
    potentialWinnings: true,
    selectAccount: true,
  };

  const BASELINE_ODDS_KEY = "1xbet-baseline-odds";
  const BASELINE_ODDS_DEFAULTS = {
    odds: "",
    cancelOnScoreChange: false,
  };

  const STAKE_PREFS_KEY = "1xbet-stake-prefs";
  const STAKE_PREFS_DEFAULTS = {
    increment: 10,
    quick: [1, 100, 250],
  };

  const BET_TYPE_LABELS = {
    single: "Single bet",
    accumulator: "Accumulator",
    chain: "Chain bet",
    anti: "Anti-accumulator",
    lucky: "Lucky bet",
    singles: "Singles",
  };

  const BET_TYPE_MULTI_OPTIONS = [
    { id: "accumulator", label: "Accumulator" },
    { id: "chain", label: "Chain bet" },
    { id: "anti", label: "Anti-accumulator" },
    { id: "lucky", label: "Lucky bet" },
    { id: "singles", label: "Singles" },
  ];

  const ODDS_CHANGE_OPTIONS = [
    { id: "increase", label: "Accept if odds increase" },
    { id: "confirm", label: "Confirm" },
    { id: "any", label: "Accept any change" },
  ];

  const ODDS_CHANGE_KEY = "1xbet-odds-change-mode";
  const PROMO_CODE_KEY = "1xbet-promo-code";

  const PIN_ICON_SVG =
    '<svg class="pin-icon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z"/></svg>';

  let MOCK_RUNNING_BETS = [
    {
      id: "487030422",
      placedDate: "07/12/2026",
      placedTime: "21:54:55",
      sport: "Football",
      market: "Correct Score",
      pick: "2 : 1",
      match: "France -vs- Spain",
      eventName: "WORLD CUP 2026 (in Canada, Mexico & USA)",
      eventDate: "07/15",
      maxPayout: "100.80",
      odds: "8.4",
      oddsTag: "E",
      stake: "12.00",
      stakeAlt: "12.00",
      status: "Running",
      cashOut: false,
    },
  ];

  const OPEN_BETS_STORAGE_KEY = "1xbet-open-bets";
  const MYBETS_OPEN_PREVIEW = 1;

  function loadPersistedOpenBets() {
    try {
      const raw = localStorage.getItem(OPEN_BETS_STORAGE_KEY);
      if (!raw) return;
      const list = JSON.parse(raw);
      if (Array.isArray(list) && list.length) MOCK_RUNNING_BETS = list;
    } catch (_) {
      /* ignore */
    }
  }

  function persistOpenBets() {
    try {
      localStorage.setItem(OPEN_BETS_STORAGE_KEY, JSON.stringify(MOCK_RUNNING_BETS));
    } catch (_) {
      /* ignore */
    }
  }

  loadPersistedOpenBets();

  /* Last-session settled bets (empty → show View Bet History CTA) */
  const MOCK_SETTLED_BETS = [];

  const BH_RANGE_LABELS = {
    today: "Today",
    yesterday: "Yesterday",
    "7d": "Last 7 Days",
    "30d": "Last 30 Days",
    "90d": "Last 90 Days",
    custom: "Custom Date Range",
  };

  const BH_STATUS_LABELS = {
    all: "All",
    open: "Open",
    won: "Won",
    lost: "Lost",
    void: "Void",
    cancelled: "Cancelled",
  };

  /* Full bet history for the dedicated desktop panel (demo, relative to today) */
  function buildMockBetHistory() {
    const today = startOfDay(new Date());
    const fmtKey = (d) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    };
    const fmtLabel = (d) =>
      d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    const fmtPlaced = (d, time) =>
      d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }) + ", " + time;
    const daysAgo = (n) => {
      const d = new Date(today);
      d.setDate(d.getDate() - n);
      return d;
    };

    const d0 = daysAgo(0);
    const d1 = daysAgo(1);
    const d3 = daysAgo(3);
    const d12 = daysAgo(12);
    const d40 = daysAgo(40);
    const d70 = daysAgo(70);

    return [
      {
        id: "123456789",
        category: "sports",
        sport: "Tennis",
        icon: "assets/icons/sport-tennis.svg",
        league: "Wimbledon. Grass",
        match: "Arthur Fery vs Alexander Zverev",
        betType: "Single",
        odds: "1.85",
        stake: "50.00",
        winnings: "92.50",
        status: "Won",
        dateKey: fmtKey(d1),
        dateLabel: fmtLabel(d1),
        placedAt: fmtPlaced(d1, "14:32"),
      },
      {
        id: "123456790",
        category: "sports",
        sport: "Basketball",
        icon: "assets/icons/sport-basketball.svg",
        league: "NBA. USA",
        match: "Boston Celtics vs Dallas Mavericks",
        betType: "Single",
        odds: "1.72",
        stake: "40.00",
        winnings: "0.00",
        status: "Lost",
        dateKey: fmtKey(d1),
        dateLabel: fmtLabel(d1),
        placedAt: fmtPlaced(d1, "11:05"),
      },
      {
        id: "123456801",
        category: "sports",
        sport: "Football",
        icon: "assets/icons/sport-football.svg",
        league: "Premier League. England",
        match: "Arsenal vs Chelsea",
        betType: "Single",
        odds: "2.10",
        stake: "25.00",
        winnings: "52.50",
        status: "Open",
        dateKey: fmtKey(d3),
        dateLabel: fmtLabel(d3),
        placedAt: fmtPlaced(d3, "21:18"),
      },
      {
        id: "123456810",
        category: "casino",
        sport: "Casino",
        icon: "assets/icons/icon-dice.svg",
        league: "Live Casino",
        match: "Holi Bac 1",
        betType: "Real money",
        odds: "—",
        stake: "20.00",
        winnings: "38.00",
        status: "Won",
        dateKey: fmtKey(d0),
        dateLabel: fmtLabel(d0),
        placedAt: fmtPlaced(d0, "16:42"),
      },
      {
        id: "123456811",
        category: "esports",
        sport: "Esports",
        icon: "assets/icons/sport-esports.svg",
        league: "Counter-Strike 2. ESL Pro League",
        match: "Team Spirit vs NAVI",
        betType: "Single",
        odds: "1.82",
        stake: "35.00",
        winnings: "63.70",
        status: "Won",
        dateKey: fmtKey(d0),
        dateLabel: fmtLabel(d0),
        placedAt: fmtPlaced(d0, "13:24"),
      },
      {
        id: "123456812",
        category: "esports",
        sport: "Esports",
        icon: "assets/icons/sport-esports.svg",
        league: "Dota 2. The International",
        match: "Team Liquid vs Gaimin Gladiators",
        betType: "Single",
        odds: "2.05",
        stake: "20.00",
        winnings: "0.00",
        status: "Open",
        dateKey: fmtKey(d1),
        dateLabel: fmtLabel(d1),
        placedAt: fmtPlaced(d1, "20:15"),
      },
      {
        id: "123456815",
        category: "sports",
        sport: "Football",
        icon: "assets/icons/sport-football.svg",
        league: "Serie A. Italy",
        match: "Inter vs Milan",
        betType: "Single",
        odds: "1.90",
        stake: "18.00",
        winnings: "0.00",
        status: "Void",
        dateKey: fmtKey(d3),
        dateLabel: fmtLabel(d3),
        placedAt: fmtPlaced(d3, "18:40"),
      },
      {
        id: "123456820",
        category: "sports",
        sport: "Tennis",
        icon: "assets/icons/sport-tennis.svg",
        league: "ATP. Hard",
        match: "Djokovic vs Alcaraz",
        betType: "Single",
        odds: "1.95",
        stake: "30.00",
        winnings: "0.00",
        status: "Cancelled",
        dateKey: fmtKey(d12),
        dateLabel: fmtLabel(d12),
        placedAt: fmtPlaced(d12, "19:03"),
      },
      {
        id: "123456830",
        category: "casino",
        sport: "Casino",
        icon: "assets/icons/icon-dice.svg",
        league: "Slots",
        match: "Sweet Bonanza",
        betType: "Real money",
        odds: "—",
        stake: "15.00",
        winnings: "0.00",
        status: "Lost",
        dateKey: fmtKey(d40),
        dateLabel: fmtLabel(d40),
        placedAt: fmtPlaced(d40, "09:27"),
      },
      {
        id: "123456840",
        category: "sports",
        sport: "Football",
        icon: "assets/icons/sport-football.svg",
        league: "La Liga. Spain",
        match: "Real Madrid vs Barcelona",
        betType: "Single",
        odds: "2.40",
        stake: "60.00",
        winnings: "144.00",
        status: "Won",
        dateKey: fmtKey(d70),
        dateLabel: fmtLabel(d70),
        placedAt: fmtPlaced(d70, "22:10"),
      },
    ];
  }

  let MOCK_BET_HISTORY = [];

  /* ---------- Helpers ---------- */

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function $$(sel, root) {
    return Array.from((root || document).querySelectorAll(sel));
  }

  function showToast(msg) {
    const el = $("#toast");
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => {
      el.hidden = true;
    }, 2200);
  }

  window.showToast = showToast;

  function initHomeReferral() {
    const root = document.querySelector(".home-referral");
    if (!root) return;

    root.addEventListener("click", (e) => {
      const copyBtn = e.target.closest("[data-home-ref-copy]");
      if (!copyBtn) return;
      e.preventDefault();
      const input = root.querySelector("[data-home-ref-link]");
      const text = (input?.value || input?.textContent || "").trim();
      if (!text) return;
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(text).then(
          () => showToast("Referral link copied"),
          () => showToast("Referral link copied")
        );
      } else {
        showToast("Referral link copied");
      }
    });
  }

  /** Duplicate payout card group so CSS translateX(-50%) loops seamlessly left. */
  function initHomePayoutMarquee() {
    const viewport = document.querySelector("[data-home-payout-marquee]");
    if (!viewport) return;
    const track = viewport.querySelector(".home-payout__track");
    const group = track?.querySelector(".home-payout__group");
    if (!track || !group) return;
    if (track.querySelectorAll(".home-payout__group").length > 1) return;
    const clone = group.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    clone.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
    track.appendChild(clone);
  }

  function formatOdd(v) {
    if (v == null || Number.isNaN(v)) return "—";
    return Number(v).toFixed(2);
  }

  function productOdds(items) {
    const active = (items || []).filter(
      (b) => b && b.status !== "closed" && Number(b.odds) > 0
    );
    if (!active.length) return 0;
    return active.reduce((acc, b) => acc * Number(b.odds), 1);
  }

  /** Sports that offer Draw (X) + Double Chance columns (live-site football table). */
  function sportHasDoubleChance(sport) {
    return sport === "football" || sport === "hockey" || sport === "handball" || sport === "futsal";
  }

  function combineImpliedOdds(a, b) {
    if (a == null || b == null || Number(a) <= 1 || Number(b) <= 1) return null;
    const p = 1 / Number(a) + 1 / Number(b);
    if (p <= 0) return null;
    return Math.max(1.01, Math.round((1 / p) * 1000) / 1000);
  }

  function doubleChanceOdd(event, selection) {
    if (selection === "1X") {
      if (event.dc1x != null) return event.dc1x;
      return combineImpliedOdds(event.o1, event.ox);
    }
    if (selection === "12") {
      if (event.dc12 != null) return event.dc12;
      return combineImpliedOdds(event.o1, event.o2);
    }
    if (selection === "2X") {
      if (event.dc2x != null) return event.dc2x;
      return combineImpliedOdds(event.o2, event.ox);
    }
    return null;
  }

  function oddTitle(market, selection) {
    if (market === "1X2" && selection === "X") return "Draw";
    if (market === "1X2" && selection === "1") return "Team 1 to win";
    if (market === "1X2" && selection === "2") return "Team 2 to win";
    if (market === "Double Chance" && selection === "1X") return "Team 1 to win or draw";
    if (market === "Double Chance" && selection === "12") return "Team 1 to win or team 2 to win";
    if (market === "Double Chance" && selection === "2X") return "Team 2 to win or draw";
    if (market === "Total" && selection === "Over") return "Over";
    if (market === "Total" && selection === "Under") return "Under";
    return `${market}: ${selection}`;
  }

  function formatTicketMarket(b) {
    if (!b) return "";
    if (b.market === "Double Chance") return `Double Chance: ${b.selection}`;
    if (b.market === "1X2") return `1X2: ${b.selection}`;
    return `${b.market}: ${b.selection}`;
  }

  function betEventId(data) {
    if (!data) return "";
    if (data.eventId) return String(data.eventId);
    const id = String(data.id || "");
    const markets = ["Double Chance", "1X2", "Total", "Handicap"];
    for (let i = 0; i < markets.length; i++) {
      const token = "-" + markets[i] + "-";
      const idx = id.indexOf(token);
      if (idx > 0) return id.slice(0, idx);
    }
    const cut = id.lastIndexOf("-");
    return cut > 0 ? id.slice(0, cut) : id;
  }

  /* ---------- Table rendering ---------- */

  /**
   * @typedef {'live'|'upcoming'} MatchStatus
   * @typedef {{ home: number|string|null, away: number|string|null }} MatchScore
   * @typedef {Object} MatchEvent
   * @property {string} id
   * @property {MatchStatus} status
   * @property {boolean} hasLiveStream
   * @property {string|null} elapsedTime
   * @property {string|null} startTime
   * @property {MatchScore} score
   * @property {boolean} [live] Legacy mirror of status === 'live'
   * @property {boolean} [stream] Legacy mirror of hasLiveStream
   * @property {string} [clock]
   * @property {string} [time]
   * @property {number|string|null} [scoreH]
   * @property {number|string|null} [scoreA]
   */

  /** Normalize match fields; mirrors legacy live/stream/scoreH/scoreA for existing filters. */
  function normalizeMatchEvent(raw) {
    if (!raw || typeof raw !== "object") return raw;
    const status =
      raw.status === "live" || raw.status === "upcoming"
        ? raw.status
        : raw.live
          ? "live"
          : "upcoming";
    const isLive = status === "live";
    const hasLiveStream =
      raw.hasLiveStream != null ? !!raw.hasLiveStream : !!raw.stream;
    const score =
      raw.score && typeof raw.score === "object"
        ? {
            home: raw.score.home != null ? raw.score.home : null,
            away: raw.score.away != null ? raw.score.away : null,
          }
        : {
            home: raw.scoreH != null ? raw.scoreH : null,
            away: raw.scoreA != null ? raw.scoreA : null,
          };
    const elapsedTime = isLive
      ? raw.elapsedTime || raw.clock || raw.time || null
      : null;
    const startTime = !isLive ? raw.startTime || raw.time || null : null;

    raw.status = status;
    raw.live = isLive;
    raw.hasLiveStream = hasLiveStream;
    raw.stream = hasLiveStream;
    raw.score = score;
    raw.scoreH = score.home;
    raw.scoreA = score.away;
    raw.elapsedTime = elapsedTime;
    raw.startTime = startTime;
    if (isLive && elapsedTime) raw.clock = raw.clock || elapsedTime;
    if (!isLive && startTime) raw.time = startTime;
    return raw;
  }

  function isMatchLive(event) {
    return normalizeMatchEvent(event).status === "live";
  }

  function oddButton(event, market, selection, value, leagueName, stackLab, emptyMode) {
    const id = `${event.id}-${market}-${selection}`;
    const selected = state.betSlip.some((b) => b.id === id) ? " selected" : "";
    const title = oddTitle(market, selection);
    const stackClass = stackLab ? " odd-btn--stack" : "";
    if (value == null) {
      if (emptyMode === "dash") {
        const dashInner = stackLab
          ? `<span class="odd-btn-lab">${stackLab}</span><span class="odd-btn-val">-</span>`
          : "-";
        return `<span class="odd-btn odd-btn-dash${stackClass}" aria-hidden="true">${dashInner}</span>`;
      }
      const lockInner = stackLab
        ? `<span class="odd-btn-lab">${stackLab}</span><span class="odd-btn-val"><img src="assets/icons/lnt/icon-lock.svg" alt="" width="11" height="12" /></span>`
        : `<img src="assets/icons/lnt/icon-lock.svg" alt="" width="11" height="12" />`;
      return `<span class="odd-btn odd-btn-locked${stackClass}" aria-disabled="true" title="Suspended">${lockInner}</span>`;
    }
    const payload = JSON.stringify({
      id,
      eventId: event.id,
      league: leagueName,
      match: `${event.home} - ${event.away}`,
      market,
      selection,
      odds: value,
    }).replace(/"/g, "&quot;");
    const inner = stackLab
      ? `<span class="odd-btn-lab">${stackLab}</span><span class="odd-btn-val">${formatOdd(value)}</span>`
      : formatOdd(value);
    return `<button type="button" class="odd-btn${stackClass}${selected}" data-odd="${payload}" title="${title}" aria-label="${title}" aria-pressed="${selected ? "true" : "false"}">${inner}</button>`;
  }

  function renderEventOddsCells(event, leagueName, sport, opts) {
    const emptyMode = (opts && opts.emptyMode) || null;
    const skipMobile = !!(opts && opts.skipMobile);
    const dash = emptyMode;

    if (sportHasDoubleChance(sport)) {
      return `
        <div class="odd-cell desktop-odds">${oddButton(event, "1X2", "1", event.o1, leagueName, null, dash)}</div>
        <div class="odd-cell desktop-odds">${oddButton(event, "1X2", "X", event.ox, leagueName, null, dash)}</div>
        <div class="odd-cell desktop-odds">${oddButton(event, "1X2", "2", event.o2, leagueName, null, dash)}</div>
        <div class="odd-cell desktop-odds">${oddButton(event, "Double Chance", "1X", doubleChanceOdd(event, "1X"), leagueName, null, dash)}</div>
        <div class="odd-cell desktop-odds">${oddButton(event, "Double Chance", "12", doubleChanceOdd(event, "12"), leagueName, null, dash)}</div>
        <div class="odd-cell desktop-odds">${oddButton(event, "Double Chance", "2X", doubleChanceOdd(event, "2X"), leagueName, null, dash)}</div>
        <div class="desktop-odds">${oddButton(event, "Total", "Over", event.over, leagueName, null, dash)}</div>
        <div class="total-val desktop-odds">${event.total != null ? event.total : (dash === "dash" ? "-" : "—")}</div>
        <div class="desktop-odds">${oddButton(event, "Total", "Under", event.under, leagueName, null, dash)}</div>
        <div class="more-cell desktop-odds"><a href="#" class="more-link">+${event.more != null ? event.more : 0}</a></div>
        ${
          skipMobile
            ? ""
            : `<div class="event-odds-mobile event-odds-mobile--card">
          <div class="mobile-odds-row mobile-odds-row--markets" role="group" aria-label="Main markets">
            ${oddButton(event, "1X2", "1", event.o1, leagueName, "W1")}
            ${oddButton(event, "1X2", "X", event.ox, leagueName, "DRAW")}
            ${oddButton(event, "1X2", "2", event.o2, leagueName, "W2")}
            ${oddButton(event, "Double Chance", "1X", doubleChanceOdd(event, "1X"), leagueName, "1X")}
            ${oddButton(event, "Double Chance", "12", doubleChanceOdd(event, "12"), leagueName, "12")}
          </div>
          <a href="#" class="more-link">+${event.more}</a>
        </div>`
        }`;
    }

    return `
      <div class="odd-cell desktop-odds">${oddButton(event, "1X2", "1", event.o1, leagueName, null, dash)}</div>
      <div class="odd-cell desktop-odds">${oddButton(event, "1X2", "X", event.ox, leagueName, null, dash)}</div>
      <div class="odd-cell desktop-odds">${oddButton(event, "1X2", "2", event.o2, leagueName, null, dash)}</div>
      ${
        skipMobile
          ? ""
          : `<div class="event-odds-mobile event-odds-mobile--card">
        <div class="mobile-odds-row mobile-odds-row--markets mobile-odds-row--markets-3" role="group" aria-label="Main markets">
          ${oddButton(event, "1X2", "1", event.o1, leagueName, "W1")}
          ${oddButton(event, "1X2", "X", event.ox, leagueName, "DRAW")}
          ${oddButton(event, "1X2", "2", event.o2, leagueName, "W2")}
        </div>
        <a href="#" class="more-link">+${event.more}</a>
      </div>`
      }
      <div class="total-val desktop-odds">${event.total != null ? event.total : (dash === "dash" ? "-" : "—")}</div>
      <div class="desktop-odds">${oddButton(event, "Total", "Over", event.over, leagueName, null, dash)}</div>
      <div class="desktop-odds">${oddButton(event, "Total", "Under", event.under, leagueName, null, dash)}</div>
      <div class="handicap-val desktop-odds">${event.hcap != null ? event.hcap : (dash === "dash" ? "-" : "—")}</div>
      <div class="desktop-odds">${oddButton(event, "Handicap", "1", event.h1, leagueName, null, dash)}</div>
      <div class="desktop-odds">${oddButton(event, "Handicap", "2", event.h2, leagueName, null, dash)}</div>
      <div class="more-cell desktop-odds"><a href="#" class="more-link">+${event.more != null ? event.more : 0}</a></div>`;
  }

  function isEventPinned(eventId) {
    return state.pinnedMatches.includes(eventId);
  }

  function togglePinnedMatch(eventId) {
    const idx = state.pinnedMatches.indexOf(eventId);
    if (idx >= 0) state.pinnedMatches.splice(idx, 1);
    else state.pinnedMatches.push(eventId);
    savePinnedMatches(state.pinnedMatches);
    renderTables();
  }

  function pinButtonHtml(eventId, extraClass) {
    const pinned = isEventPinned(eventId);
    const tip = pinned ? "Unpin Match" : "Pin Match";
    const cls = `icon-tiny pin${pinned ? " active" : ""}${extraClass ? ` ${extraClass}` : ""}`;
    return `<button type="button" class="${cls}" data-pin="${eventId}" data-tooltip="${tip}" title="${tip}" aria-label="${tip}" aria-pressed="${pinned ? "true" : "false"}">${PIN_ICON_SVG}</button>`;
  }

  const EVENT_META_ICONS = {
    tracker: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="5" width="18" height="12" rx="1.5" stroke="currentColor" stroke-width="1.6"/><path d="M3 17h18M8 20h8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="11" r="2.2" stroke="currentColor" stroke-width="1.5"/><path d="M7 11h2.5M14.5 11H17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    stream: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="2" y="5" width="15" height="12" rx="1.5" stroke="currentColor" stroke-width="1.6"/><path d="M17 9l5-2.5v11L17 15V9z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
    stats: `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 20V10h3v10H4zm7 0V4h3v16h-3zm7 0v-7h3v7h-3z"/></svg>`,
    lineups: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 7h13M8 12h13M8 17h13" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><circle cx="4" cy="7" r="1.4" fill="currentColor"/><circle cx="4" cy="12" r="1.4" fill="currentColor"/><circle cx="4" cy="17" r="1.4" fill="currentColor"/></svg>`,
    social: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="9" cy="8" r="3" stroke="currentColor" stroke-width="1.6"/><circle cx="17" cy="9" r="2.4" stroke="currentColor" stroke-width="1.6"/><path d="M3.5 19c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5M14 14.2c1.7-.3 3.4.5 4.5 2.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  };

  function eventMetaText(event) {
    const e = normalizeMatchEvent(event);
    if (e.meta) return e.meta;
    if (e.status === "live") return e.elapsedTime || e.clock || e.time || "Live";
    return e.startTime || e.time || "";
  }

  function renderEventMetaActions(event) {
    const e = normalizeMatchEvent(event);
    const actions = [];
    if (e.tracker) {
      actions.push({ key: "tracker", label: "Live tracker", icon: EVENT_META_ICONS.tracker });
    }
    if (e.hasLiveStream) {
      actions.push({ key: "stream", label: "Live stream", icon: EVENT_META_ICONS.stream });
    }
    if (e.stats) {
      actions.push({ key: "stats", label: "Statistics", icon: EVENT_META_ICONS.stats });
    }
    if (e.lineups) {
      actions.push({ key: "lineups", label: "Lineups", icon: EVENT_META_ICONS.lineups });
    }
    if (e.social) {
      actions.push({ key: "social", label: "Popular", icon: EVENT_META_ICONS.social });
    }
    if (!actions.length) {
      actions.push({ key: "stats", label: "Statistics", icon: EVENT_META_ICONS.stats });
    }
    return actions
      .map(
        (a) =>
          `<button type="button" class="event-meta-btn" data-toast="${a.label}" title="${a.label}" aria-label="${a.label}">${a.icon}</button>`
      )
      .join("");
  }

  function renderSubGameRow(parentEvent, sub, leagueName, sport) {
    const subEvent = {
      id: `${parentEvent.id}::${sub.id || sub.name}`,
      home: parentEvent.home,
      away: parentEvent.away,
      o1: sub.o1,
      ox: sub.ox,
      o2: sub.o2,
      dc1x: sub.dc1x,
      dc12: sub.dc12,
      dc2x: sub.dc2x,
      total: sub.total,
      over: sub.over,
      under: sub.under,
      hcap: sub.hcap,
      h1: sub.h1,
      h2: sub.h2,
      more: sub.more,
    };
    return `
      <div class="event-row event-row--sub" data-parent-event="${parentEvent.id}">
        <div class="event-sub-label">${sub.name}</div>
        ${renderEventOddsCells(subEvent, leagueName, sport, { emptyMode: "dash", skipMobile: true })}
      </div>`;
  }

  function renderEventRow(event, leagueName, searchQuery, sport) {
    const e = normalizeMatchEvent(event);
    const isLive = e.status === "live";
    const fav = state.favorites.has(e.id) ? " active" : "";
    const pinned = isEventPinned(e.id);
    const timeClass = isLive ? "event-time live" : "event-time";
    const timeLabel = isLive
      ? e.elapsedTime || e.clock || e.time || "Live"
      : e.startTime || e.time || "";
    const liveBadge = isLive
      ? `<span class="live-badge" aria-label="Live">LIVE</span>`
      : "";
    const metaLabel = eventMetaText(e);
    const scoreH = isLive && e.score.home != null ? e.score.home : "";
    const scoreA = isLive && e.score.away != null ? e.score.away : "";
    const q = (searchQuery || "").toLowerCase();
    const hidden =
      q &&
      !`${e.home} ${e.away} ${leagueName}`.toLowerCase().includes(q)
        ? " hidden-event"
        : "";
    const homeLogo = e.homeLogo
      ? `<img class="team-logo" src="${e.homeLogo}" alt="" width="18" height="18" />`
      : "";
    const awayLogo = e.awayLogo
      ? `<img class="team-logo" src="${e.awayLogo}" alt="" width="18" height="18" />`
      : "";
    const streamIcon =
      isLive && e.hasLiveStream
        ? `<img class="event-stream-icon" src="assets/icons/lnt/icon-stream.svg" alt="" width="14" height="13" title="Live stream" />`
        : "";
    const sportSrc = sportHeaderIconMap[sport] || `assets/icons/sport-${sport}.svg`;
    const hasSubGames = Array.isArray(e.subGames) && e.subGames.length > 0;
    const expanded = hasSubGames && state.expandedEvents.has(e.id);
    const expandBtn = hasSubGames
      ? `<button type="button" class="event-expand-btn${expanded ? " is-open" : ""}" data-expand-event="${e.id}" aria-expanded="${expanded ? "true" : "false"}" aria-label="${expanded ? "Hide sub games" : "Show sub games"}" title="${expanded ? "Hide sub games" : "Show sub games"}"><img src="assets/icons/te-chevron-down.svg" alt="" width="10" height="6" /></button>`
      : "";

    const mainRow = `
      <div class="event-row${pinned ? " event-row--pinned" : ""}${hasSubGames ? " event-row--has-subs" : ""}${expanded ? " is-expanded" : ""}${isLive ? " event-row--live" : " event-row--upcoming"}${hidden}" data-event-id="${e.id}" data-match-status="${e.status}">
        <div class="event-card-top">
          <div class="event-card-status">
            <img class="event-sport-icon" src="${sportSrc}" alt="" width="16" height="16" />
            ${liveBadge}
            <div class="${timeClass}">${timeLabel}</div>
            ${streamIcon}
          </div>
          <div class="event-card-actions">
            ${pinButtonHtml(e.id)}
            <button type="button" class="icon-tiny fav${fav}" data-fav="${e.id}" aria-label="Favourite" aria-pressed="${fav ? "true" : "false"}">★</button>
            <button type="button" class="icon-tiny event-card-more" data-event-info="${e.id}" aria-label="Event info" aria-haspopup="dialog">⋯</button>
          </div>
        </div>
        <div class="event-card-league">${leagueName}</div>
        <div class="event-main">
          <div class="event-side-actions">
            ${pinButtonHtml(e.id, "pin--desktop")}
            <button type="button" class="icon-tiny fav fav--desktop${fav}" data-fav="${e.id}" aria-label="Favourite" aria-pressed="${fav ? "true" : "false"}">★</button>
          </div>
          <div class="event-teams">
            <div class="team-line">${homeLogo}<span>${e.home}</span><span class="score">${scoreH}</span></div>
            <div class="team-line">${awayLogo}<span>${e.away}</span><span class="score">${scoreA}</span></div>
            <div class="event-meta event-meta--desktop">
              ${liveBadge}
              <span class="event-meta-text${isLive ? " live" : ""}">${metaLabel}</span>
              <div class="event-meta-actions" aria-label="Match tools">
                ${renderEventMetaActions(e)}
              </div>
            </div>
          </div>
          ${expandBtn ? `<div class="event-expand-wrap">${expandBtn}</div>` : ""}
        </div>
        ${renderEventOddsCells(e, leagueName, sport)}
      </div>
    `;

    if (!hasSubGames) return mainRow;

    const subRows = expanded
      ? e.subGames.map((sub) => renderSubGameRow(e, sub, leagueName, sport)).join("")
      : "";

    return `
      <div class="event-block${expanded ? " is-expanded" : ""}${hidden}" data-event-block="${e.id}">
        ${mainRow}
        <div class="event-subgames" ${expanded ? "" : "hidden"}>
          ${subRows}
        </div>
      </div>
    `;
  }

  function leagueIconHtml(league) {
    if (isMarbleLivePage) {
      const src = marbleSportIcon(league.sport);
      return `<img class="league-sport-icon" src="${src}" alt="" width="16" height="16" />`;
    }
    const sportSrc = sportHeaderIconMap[league.sport] || `assets/icons/sport-${league.sport}.svg`;
    const flagSrc = flagIconMap[league.icon];
    const sport = `<img class="league-sport-icon" src="${sportSrc}" alt="" width="16" height="16" />`;
    const isTrophy = flagSrc && flagSrc.indexOf("crumb-trophy") !== -1;
    const flag = flagSrc
      ? `<img class="league-flag-icon${isTrophy ? " league-trophy-icon" : ""}" src="${flagSrc}" alt="" width="16" height="16" />`
      : `<span class="league-icon">${league.icon}</span>`;
    return `${sport}${flag}`;
  }

  function renderLeagueHeaders(sport) {
    if (sportHasDoubleChance(sport)) {
      return `
          <div class="col-label" title="Team 1 to win">1</div>
          <div class="col-label col-label--tip" title="Draw">X</div>
          <div class="col-label" title="Team 2 to win">2</div>
          <div class="col-label" title="Team 1 to win or draw">1X</div>
          <div class="col-label col-label--tip" title="Team 1 to win or team 2 to win">12</div>
          <div class="col-label" title="Team 2 to win or draw">2X</div>
          <div class="col-label" title="Over">O</div>
          <div class="col-label" title="Total">Total</div>
          <div class="col-label" title="Under">U</div>
          <div class="col-label">More</div>`;
    }
    return `
          <div class="col-label">1</div>
          <div class="col-label" title="Draw">X</div>
          <div class="col-label">2</div>
          <div class="col-label">Total</div>
          <div class="col-label">Over</div>
          <div class="col-label">Under</div>
          <div class="col-label">Hcap</div>
          <div class="col-label">1</div>
          <div class="col-label">2</div>
          <div class="col-label">More</div>`;
  }

  function leagueMatchesFilter(league, filterSport) {
    if (!filterSport || filterSport === "stream") return true;
    if (filterSport instanceof Set) {
      return filterSport.size === 0 || filterSport.has(league.sport);
    }
    if (Array.isArray(filterSport)) {
      return filterSport.length === 0 || filterSport.includes(league.sport);
    }
    return league.sport === filterSport;
  }

  /** Curated recommended IDs — live+stream first, then other live (not Top Games carousel). */
  function getRecommendedEventIds() {
    const streamed = [];
    const live = [];
    liveLeagues.forEach((league) => {
      (league.events || []).forEach((raw) => {
        const event = normalizeMatchEvent(raw);
        if (event.status !== "live") return;
        if (event.hasLiveStream) streamed.push(event.id);
        else live.push(event.id);
      });
    });
    return streamed.concat(live).slice(0, 8);
  }

  function eventMatchesLiveView(event) {
    const e = normalizeMatchEvent(event);
    const view = state.liveView || "matches";
    if (view === "matches") return true;
    if (view === "favorites") return state.favorites.has(e.id);
    if (view === "recommended") return getRecommendedEventIds().indexOf(e.id) !== -1;
    if (view === "upcoming") return e.status === "upcoming";
    const clock = `${e.elapsedTime || e.clock || ""} ${e.time || ""}`;
    if (view === "p1") return e.status === "live" && /1st|first|1\s*half|q1|1st period/i.test(clock);
    if (view === "p2") return e.status === "live" && /2nd|second|2\s*half|q2|q3|q4|2nd period/i.test(clock);
    return true;
  }

  function eventPassesLeagueFilters(event, statusFilter) {
    const e = normalizeMatchEvent(event);
    if (isNationalTeamPage) {
      const wantLive = state.ntMarketMode === "live";
      if (isMatchLive(e) !== wantLive) return false;
    }
    if (state.streamOnly && !e.hasLiveStream) return false;
    if (!isSportsPage && !eventMatchesLiveView(e)) return false;
    if (statusFilter === "live" && e.status !== "live") return false;
    if (statusFilter === "upcoming" && e.status !== "upcoming") return false;
    return true;
  }

  function setLiveView(view, opts) {
    const next = view || "matches";
    state.liveView = next;
    const liveTabs = document.querySelector('#live-events .section-tabs[aria-label="Live views"]');
    if (liveTabs) {
      $$(".section-tab", liveTabs).forEach((tab) => {
        const on = tab.getAttribute("data-tab") === next;
        tab.classList.toggle("active", on);
        tab.setAttribute("aria-selected", on ? "true" : "false");
      });
      /* Favorites is opened from sidebar — highlight Recommended/Matches only when those */
      if (next === "favorites") {
        $$(".section-tab", liveTabs).forEach((tab) => {
          tab.classList.remove("active");
          tab.setAttribute("aria-selected", "false");
        });
      }
    }
    renderTables();
    renderSidebarInlinePanels();
    if (opts && opts.scroll !== false) {
      const target = $("#live-events");
      if (target && typeof target.scrollIntoView === "function") {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }

  function renderLeague(league, filterSport, searchQuery, eventsOverride) {
    if (
      eventsOverride == null &&
      !leagueMatchesFilter(league, filterSport)
    ) {
      return "";
    }
    const events = eventsOverride || league.events;
    if (!events.length) return "";
    const collapsed = state.collapsedLeagues.has(league.id);
    const favLeague = state.favorites.has("league-" + league.id) ? " active" : "";
    const dcClass = sportHasDoubleChance(league.sport) ? " league-block--dc" : "";
    return `
      <section class="league-block${dcClass}" data-league="${league.id}" data-sport="${league.sport}">
        <header class="league-header">
          <div class="league-info">
            ${leagueIconHtml(league)}
            <span class="league-name">${league.name}</span>
            <div class="league-actions">
              <button type="button" class="icon-tiny fav${favLeague}" data-fav="league-${league.id}" aria-label="Favourite league">★</button>
              <button type="button" class="icon-tiny league-toggle" data-toggle-league="${league.id}" aria-expanded="${!collapsed}" aria-label="Collapse league">
                ${collapsed ? "▸" : "▾"}
              </button>
            </div>
          </div>
          ${renderLeagueHeaders(league.sport)}
        </header>
        <div class="league-body" ${collapsed ? "hidden" : ""}>
          ${events.map((e) => renderEventRow(e, league.name, searchQuery, league.sport)).join("")}
        </div>
      </section>
    `;
  }

  /** Pinned matches first (pin order), then remaining leagues in default API order.
   *  @param {object} [opts]
   *  @param {'live'|'upcoming'|null} [opts.statusFilter]
   *  @param {boolean} [opts.skipEmptyMessages]
   */
  function renderOrderedLeagues(leagues, filterSport, searchQuery, opts) {
    const statusFilter = (opts && opts.statusFilter) || null;
    const skipEmptyMessages = !!(opts && opts.skipEmptyMessages);
    const eventIndex = new Map();
    leagues.forEach((league) => {
      if (!leagueMatchesFilter(league, filterSport)) return;
      league.events.forEach((raw) => {
        const event = normalizeMatchEvent(raw);
        if (!eventPassesLeagueFilters(event, statusFilter)) return;
        eventIndex.set(event.id, { league, event });
      });
    });

    const pinnedIds = state.pinnedMatches.filter((id) => eventIndex.has(id));
    const pinnedSet = new Set(pinnedIds);
    const sections = [];

    pinnedIds.forEach((id) => {
      const { league, event } = eventIndex.get(id);
      const last = sections[sections.length - 1];
      if (last && last.league.id === league.id) last.events.push(event);
      else sections.push({ league, events: [event] });
    });

    leagues.forEach((league) => {
      if (!leagueMatchesFilter(league, filterSport)) return;
      const events = league.events
        .map((raw) => normalizeMatchEvent(raw))
        .filter((event) => {
          if (pinnedSet.has(event.id)) return false;
          return eventPassesLeagueFilters(event, statusFilter);
        });
      if (events.length) sections.push({ league, events });
    });

    if (!sections.length) {
      if (skipEmptyMessages) return "";
      if (state.liveView === "favorites" && !isSportsPage && !isNationalTeamPage) {
        return `<div class="nt-mode-empty" role="status">
        <p class="nt-mode-empty__title">No favorite matches</p>
        <p class="nt-mode-empty__text">Tap the star on a match to add it here</p>
      </div>`;
      }

      if (state.liveView === "recommended" && !isSportsPage && !isNationalTeamPage) {
        return `<div class="nt-mode-empty" role="status">
        <p class="nt-mode-empty__title">No recommended matches</p>
        <p class="nt-mode-empty__text">Recommended live events will appear here</p>
      </div>`;
      }

      if (isNationalTeamPage) {
        return `<div class="nt-mode-empty" role="status">
        <p class="nt-mode-empty__title">${state.ntMarketMode === "live" ? "No live matches" : "No championships"}</p>
        <p class="nt-mode-empty__text">Information will be displayed here soon</p>
      </div>`;
      }

      return "";
    }

    return sections
      .map(({ league, events }) => renderLeague(league, null, searchQuery, events))
      .join("");
  }

  function wrapMatchTableSection(status, title, innerHtml) {
    if (!innerHtml) return "";
    return `<div class="match-table-section match-table-section--${status}" data-match-status="${status}">
      <h3 class="match-table-section__title">${title}</h3>
      ${innerHtml}
    </div>`;
  }

  /** Homepage / shared LIVE chrome: Live block on top, Upcoming below (Matches tab). */
  function renderSplitLiveUpcoming(leagues, filterSport, searchQuery) {
    const view = state.liveView || "matches";

    if (view === "matches" || view === "favorites") {
      const liveHtml = renderOrderedLeagues(leagues, filterSport, searchQuery, {
        statusFilter: "live",
        skipEmptyMessages: true,
      });
      const upHtml = renderOrderedLeagues(leagues, filterSport, searchQuery, {
        statusFilter: "upcoming",
        skipEmptyMessages: true,
      });
      const html =
        wrapMatchTableSection("live", "Live", liveHtml) +
        wrapMatchTableSection("upcoming", "Upcoming", upHtml);
      if (html) return html;
      if (view === "favorites") {
        return `<div class="nt-mode-empty" role="status">
          <p class="nt-mode-empty__title">No favorite matches</p>
          <p class="nt-mode-empty__text">Tap the star on a match to add it here</p>
        </div>`;
      }
      return `<div class="nt-mode-empty" role="status">
          <p class="nt-mode-empty__title">No matches</p>
          <p class="nt-mode-empty__text">Try another sport or clear filters</p>
        </div>`;
    }

    if (view === "upcoming") {
      const upHtml = renderOrderedLeagues(leagues, filterSport, searchQuery, {
        statusFilter: "upcoming",
        skipEmptyMessages: true,
      });
      return (
        wrapMatchTableSection("upcoming", "Upcoming", upHtml) ||
        `<div class="nt-mode-empty" role="status">
          <p class="nt-mode-empty__title">No upcoming events</p>
          <p class="nt-mode-empty__text">Upcoming matches will appear here</p>
        </div>`
      );
    }

    const html = renderOrderedLeagues(leagues, filterSport, searchQuery, {
      skipEmptyMessages: false,
    });
    if (!html) return html;
    if (html.indexOf("nt-mode-empty") !== -1) return html;
    return wrapMatchTableSection("live", "Live", html);
  }

  function renderTables() {
    const liveEl = $("#live-table");
    const lineEl = $("#line-table");
    if (liveEl) {
      /* Sports page: Line (pre-match) data in the national-team table chrome */
      let leagues = isSportsPage ? lineLeagues : liveLeagues;
      if (isSportsPage && state.sportsCompetition) {
        const competition = SPORTS_COMPETITIONS.find(
          (item) => item.id === state.sportsCompetition
        );
        if (competition) {
          leagues = leagues.filter((league) => league.id === competition.leagueId);
        }
      }
      const homeSportsFilter =
        isHomePage && state.activeHomeSports.size
          ? state.activeHomeSports
          : state.activeLiveFilter;
      const splitLiveUpcoming = !isSportsPage && !isNationalTeamPage;
      liveEl.innerHTML = splitLiveUpcoming
        ? renderSplitLiveUpcoming(leagues, homeSportsFilter, state.liveSearch)
        : renderOrderedLeagues(leagues, homeSportsFilter, state.liveSearch);
    }
    if (lineEl) {
      lineEl.innerHTML = renderOrderedLeagues(
        lineLeagues,
        state.activeLineFilter,
        state.lineSearch
      );
    }
  }

  /* ---------- Sidebar ---------- */

  function sportRowHtml(s) {
    const sportHref = "#live-events";
    return `
      <li class="sport-item" data-sport-id="${s.id}">
        <a href="${sportHref}" class="sport-item-main">
          <img class="sport-icon-img" src="${s.icon}" alt="" width="16" height="16" />
          <span class="row-label">${s.name}&nbsp;</span>
          <span class="count">(${s.count})</span>
        </a>
        <button type="button" class="sport-item-chevron" aria-label="Expand ${s.name}">
          <img src="assets/icons/sport-list-chevron.svg" alt="" width="10" height="6" />
        </button>
      </li>`;
  }

  function renderSportsList() {
    const topList = $("#sports-list-top");
    const azList = $("#sports-list-az");
    const topLabel = document.querySelector(".sports-section-label:not(.az)");
    const azLabel = document.querySelector(".sports-section-label.az");
    if (topList) topList.innerHTML = topSports.map(sportRowHtml).join("");
    if (azList) {
      azList.innerHTML = azSports.map(sportRowHtml).join("");
      azList.hidden = azSports.length === 0;
    }
    if (topLabel) {
      if (isMarbleLivePage) {
        topLabel.hidden = false;
        topLabel.textContent = "Marble-Live";
      } else {
        topLabel.hidden = topSports.length === 0;
      }
    }
    if (azLabel) azLabel.hidden = azSports.length === 0;
  }

  function renderTopGame(index) {
    const slide = topGamesSlides[index];
    if (!slide) return;
    const card = $(".top-games-card");
    if (!card) return;
    const pageEl = $("#tg-page");
    if (pageEl) pageEl.textContent = String(index + 1);

    const league = card.querySelector(".tg-league span");
    const status = card.querySelector(".tg-status");
    const teams = card.querySelectorAll(".tg-team");
    const scores = card.querySelectorAll(".tg-score span");
    const odds = card.querySelectorAll(".tg-odd");

    if (league) league.textContent = slide.league;
    if (status) status.textContent = slide.status;
    if (teams[0]) {
      teams[0].querySelector("img").src = slide.homeCrest;
      teams[0].querySelector("span").textContent = slide.home;
    }
    if (teams[1]) {
      teams[1].querySelector("img").src = slide.awayCrest;
      teams[1].querySelector("span").textContent = slide.away;
    }
    if (scores[0]) scores[0].textContent = String(slide.score[0]);
    if (scores[1]) scores[1].textContent = String(slide.score[1]);

    const labels = ["W1", "X", "W2"];
    odds.forEach((btn, i) => {
      const val = slide.odds[i];
      btn.innerHTML = `${labels[i]} <span>${val ? formatOdd(val) : "—"}</span>`;
      btn.setAttribute(
        "data-odd",
        JSON.stringify({
          id: `tg-${index}-${labels[i].toLowerCase()}`,
          league: slide.league,
          match: `${slide.home} vs ${slide.away}`,
          market: "1X2",
          selection: labels[i],
          odds: val || 0,
        })
      );
      btn.disabled = !val;
      btn.classList.toggle("selected", false);
    });
  }

  function renderFilters(containerId, activeKey) {
    const el = $(containerId);
    if (!el) return;
    if (containerId === "#live-filter-list") {
      renderLiveFilterBar();
      return;
    }
    el.innerHTML = sportFilters
      .map((f) => {
        const active = state[activeKey] === f.id ? " active" : "";
        return `<button type="button" class="filter-chip${active}" data-filter="${f.id}" aria-pressed="${active ? "true" : "false"}">
          <img class="chip-icon" src="${f.icon}" alt="" width="16" height="16" />${f.label}
        </button>`;
      })
      .join("");
  }

  function renderLiveFilterBar() {
    const el = $("#live-filter-list");
    if (!el) return;
    el.innerHTML = liveSportFilters
      .map((f) => {
        const active =
          isHomePage && state.activeHomeSports.size
            ? state.activeHomeSports.has(f.id)
            : state.activeLiveFilter === f.id;
        const activeClass = active ? " active" : "";
        return `<button type="button" class="filter-chip${activeClass}" data-filter="${f.id}" data-group="${f.group}" aria-pressed="${active ? "true" : "false"}">
          <img class="chip-icon" src="${f.icon}" alt="" width="16" height="16" />${f.label}
        </button>`;
      })
      .join("");
    layoutLiveFilterOverflow();
    renderMoreMenu($("#te-more-search")?.value || "");
  }

  function layoutLiveFilterOverflow() {
    const list = $("#live-filter-list");
    if (!list) return;
    const chips = Array.from(list.querySelectorAll(".filter-chip"));
    chips.forEach((chip) => chip.classList.remove("is-overflow"));

    // National Team / Sports: keep all chips visible and scroll horizontally
    if (isNationalTeamPage || isSportsPage) return;
    // Homepage ≤900: scroll all LIVE sport chips instead of hiding behind More
    if (isHomePage && isMobileViewport()) return;

    const available = list.clientWidth;
    if (available <= 0) return;

    let used = 0;
    let overflowStarted = false;
    chips.forEach((chip) => {
      if (overflowStarted) {
        chip.classList.add("is-overflow");
        return;
      }
      const style = getComputedStyle(chip);
      const width =
        chip.offsetWidth +
        (parseFloat(style.marginLeft) || 0) +
        (parseFloat(style.marginRight) || 0);
      if (used + width > available) {
        overflowStarted = true;
        chip.classList.add("is-overflow");
      } else {
        used += width;
      }
    });
  }

  function moreMenuItemHtml(sport) {
    const active = state.activeLiveFilter === sport.id ? " active" : "";
    // Light dropdown: use dark sport-* icons (not white te-* chip icons)
    return `<button type="button" class="te-more-item${active}" data-filter="${sport.id}">
      <img src="${sport.icon}" alt="" width="16" height="16" />
      <span>${sport.name}</span>
      <span class="te-more-count">${sport.count}</span>
    </button>`;
  }

  function renderMoreMenu(query) {
    const scroll = $("#te-more-scroll");
    if (!scroll) return;
    const q = (query || "").trim().toLowerCase();
    const top = topSports.filter((s) => !q || s.name.toLowerCase().includes(q));
    const az = azSports.filter((s) => !q || s.name.toLowerCase().includes(q));

    if (!top.length && !az.length) {
      scroll.innerHTML = `<div class="te-more-empty">No sports found</div>`;
      return;
    }

    let html = "";
    if (top.length) {
      html += `<div class="te-more-section-label">Top</div>${top.map(moreMenuItemHtml).join("")}`;
    }
    if (az.length) {
      html += `<div class="te-more-section-label">Categories from A to Z</div>${az.map(moreMenuItemHtml).join("")}`;
    }
    scroll.innerHTML = html;
  }

  function setMoreMenuOpen(open) {
    const wrap = $(".te-more-wrap");
    const btn = $("#te-more-btn");
    const menu = $("#te-more-menu");
    if (!wrap || !btn || !menu) return;
    wrap.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    menu.hidden = !open;
    if (open) {
      setEsportsMenuOpen(false);
      renderMoreMenu($("#te-more-search")?.value || "");
      $("#te-more-search")?.focus();
    }
  }

  function esportsItemById(id) {
    return esportsMenuItems.find((item) => item.id === id) || null;
  }

  function renderEsportsFlyout(itemId, anchorEl) {
    const flyout = $("#te-esports-flyout");
    const menu = $("#te-esports-menu");
    if (!flyout || !menu) return;
    const item = esportsItemById(itemId);
    if (!item || !item.leagues?.length) {
      flyout.hidden = true;
      flyout.innerHTML = "";
      return;
    }
    esportsFlyoutId = item.id;
    flyout.innerHTML = item.leagues
      .map(
        (league) =>
          `<button type="button" class="te-esports-flyout-item" role="menuitem" data-esports-league="${league.id}" data-esports-parent="${item.id}">` +
          `<img src="${ESPORTS_GLOBE}" alt="" width="14" height="14" />` +
          `<span>${league.name}</span>` +
          `<span class="te-esports-count">${league.count}</span>` +
          `</button>`
      )
      .join("");
    flyout.hidden = false;

    /* Align flyout with hovered/selected row */
    const scroll = $("#te-esports-scroll");
    const row = anchorEl || scroll?.querySelector(`.te-esports-item[data-esports-id="${item.id}"]`);
    if (row && scroll) {
      const menuRect = menu.getBoundingClientRect();
      const rowRect = row.getBoundingClientRect();
      const top = Math.max(8, rowRect.top - menuRect.top);
      flyout.style.top = `${top}px`;
    } else {
      flyout.style.top = "44px";
    }

    $$(".te-esports-item").forEach((el) => {
      el.classList.toggle("is-active", el.getAttribute("data-esports-id") === item.id);
    });
  }

  function renderEsportsMenu(query) {
    const scroll = $("#te-esports-scroll");
    if (!scroll) return;
    const q = (query || "").trim().toLowerCase();
    const items = esportsMenuItems.filter((item) => {
      if (!q) return true;
      if (item.name.toLowerCase().includes(q)) return true;
      return (item.leagues || []).some((league) => league.name.toLowerCase().includes(q));
    });

    if (!items.length) {
      scroll.innerHTML = `<div class="te-esports-empty">No esports found</div>`;
      const flyout = $("#te-esports-flyout");
      if (flyout) {
        flyout.hidden = true;
        flyout.innerHTML = "";
      }
      return;
    }

    scroll.innerHTML = items
      .map((item) => {
        const active = item.id === esportsFlyoutId ? " is-active" : "";
        return (
          `<button type="button" class="te-esports-item${active}" role="menuitem" data-esports-id="${item.id}" aria-haspopup="menu">` +
          `<img src="${item.icon}" alt="" width="16" height="16" />` +
          `<span>${item.name}</span>` +
          `<span class="te-esports-count">${item.count}</span>` +
          `</button>`
        );
      })
      .join("");

    const activeId = items.some((i) => i.id === esportsFlyoutId) ? esportsFlyoutId : items[0].id;
    renderEsportsFlyout(activeId);
  }

  function setEsportsMenuOpen(open) {
    const wrap = $("#te-esports-wrap");
    const btn = $("#te-esports-btn");
    const menu = $("#te-esports-menu");
    if (!wrap || !btn || !menu) return;
    wrap.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    menu.hidden = !open;
    if (open) {
      setMoreMenuOpen(false);
      renderEsportsMenu($("#te-esports-search")?.value || "");
      $("#te-esports-search")?.focus();
    } else {
      const flyout = $("#te-esports-flyout");
      if (flyout) {
        flyout.hidden = true;
        flyout.innerHTML = "";
      }
    }
  }

  function syncHomePopularSports() {
    $$(".home-sport-card[data-home-sport]").forEach((card) => {
      const id = card.getAttribute("data-home-sport");
      const active = state.activeHomeSports.size
        ? state.activeHomeSports.has(id)
        : id === state.activeLiveFilter;
      card.classList.toggle("is-active", active);
      card.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function selectLiveSportFilter(id) {
    state.activeHomeSports.clear();
    state.activeLiveFilter = state.activeLiveFilter === id ? null : id;
    const liveStreamToggle = $("#live-stream-toggle");
    if (liveStreamToggle) liveStreamToggle.checked = false;
    renderLiveFilterBar();
    renderTables();
    syncHomePopularSports();
  }

  /** Horizontally center a LIVE sport chip in the scrollable filter strip. */
  function scrollLiveFilterChipIntoView(id) {
    if (!id) return;
    const list = $("#live-filter-list");
    if (!list) return;
    const chip = list.querySelector(
      `.filter-chip[data-filter="${CSS.escape(String(id))}"]`
    );
    if (!chip || chip.classList.contains("is-overflow")) return;

    const listRect = list.getBoundingClientRect();
    const chipRect = chip.getBoundingClientRect();
    const delta =
      chipRect.left -
      listRect.left -
      (listRect.width - chipRect.width) / 2;
    const maxLeft = Math.max(0, list.scrollWidth - list.clientWidth);
    const nextLeft = Math.min(maxLeft, Math.max(0, list.scrollLeft + delta));
    if (Math.abs(nextLeft - list.scrollLeft) < 2) return;
    list.scrollTo({ left: nextLeft, behavior: "smooth" });
  }

  function revealLiveTableSport(id) {
    $("#live-events")?.scrollIntoView({ behavior: "smooth", block: "start" });
    // Wait a frame so chips are laid out after re-render, then scroll strip.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => scrollLiveFilterChipIntoView(id));
    });
  }

  window.selectHomeSportFilter = (id) => {
    selectLiveSportFilter(id);
    revealLiveTableSport(state.activeLiveFilter || id);
  };

  window.getHomeSportFilters = () =>
    state.activeHomeSports.size
      ? Array.from(state.activeHomeSports)
      : state.activeLiveFilter
        ? [state.activeLiveFilter]
        : [];

  window.applyHomeSportFilters = (ids) => {
    const next = Array.from(
      new Set((Array.isArray(ids) ? ids : []).filter(Boolean))
    );
    state.activeHomeSports = new Set(next);
    state.activeLiveFilter = next.length === 1 ? next[0] : null;
    const liveStreamToggle = $("#live-stream-toggle");
    if (liveStreamToggle) liveStreamToggle.checked = false;
    renderLiveFilterBar();
    renderTables();
    syncHomePopularSports();
    revealLiveTableSport(next[0] || state.activeLiveFilter);
  };

  function renderAccumulators() {
    if (window.SbAccumulators && typeof window.SbAccumulators.render === "function") {
      window.SbAccumulators.render({
        data: accumulators,
        flagIconMap: typeof flagIconMap !== "undefined" ? flagIconMap : {},
      });
      return;
    }
    [1, 2].forEach((n) => {
      const list = $(`#acc-list-${n}`);
      if (!list) return;
      const items = accumulators[n];
      list.innerHTML = items
        .map((a) => {
          let icons = "";
          if (a.flags && a.flags.length) {
            icons = a.flags
              .map((code) => {
                const src = flagIconMap[code];
                return src
                  ? `<img class="acc-flag-img" src="${src}" alt="" width="16" height="16" />`
                  : `<span class="acc-flag" aria-hidden="true"></span>`;
              })
              .join("");
          } else if (a.avatars && a.avatars.length) {
            icons = a.avatars
              .map((src) => `<img class="acc-avatar" src="${src}" alt="" width="16" height="16" />`)
              .join("");
          } else {
            icons = `<span class="acc-flag" aria-hidden="true"></span>`;
          }
          const sport = a.sportIcon
            ? `<img class="acc-sport-icon" src="${a.sportIcon}" alt="" width="12" height="12" />`
            : "";
          const when = a.when ? `<span class="acc-when">${a.when}</span>` : "";
          return `
        <li class="acc-item">
          <span class="acc-icons">${icons}</span>
          <span class="acc-body">
            ${when}
            <span class="acc-match">${a.match}</span>
            <span class="acc-league">${sport}${a.league || ""}</span>
          </span>
          <span class="acc-sel">${a.selection}</span>
          <span class="acc-odd">${formatOdd(a.odds)}</span>
        </li>`;
        })
        .join("");
      const oddsEl = $(`#acc-odds-${n}`);
      if (oddsEl) oddsEl.textContent = formatOdd(productOdds(items));
    });
  }

  /* ---------- Bet slip ---------- */

  function syncOddButtons() {
    $$("[data-odd]").forEach((btn) => {
      try {
        const data = JSON.parse(btn.getAttribute("data-odd").replace(/&quot;/g, '"'));
        const on = state.betSlip.some((b) => b.id === data.id);
        btn.classList.toggle("selected", on);
        btn.setAttribute("aria-pressed", on ? "true" : "false");
      } catch (_) {
        /* ignore */
      }
    });
  }

  function syncMobileBetCount() {
    const badge = $("#mobile-bet-count");
    const n = state.betSlip.length;
    if (badge) {
      if (n > 0) {
        badge.hidden = false;
        badge.removeAttribute("hidden");
        badge.textContent = String(n);
      } else {
        badge.hidden = true;
        badge.setAttribute("hidden", "");
        badge.textContent = "";
      }
    }

    let fab = $("#mobile-betslip-fab");
    if (!fab) {
      fab = document.createElement("button");
      fab.type = "button";
      fab.id = "mobile-betslip-fab";
      fab.className = "mobile-betslip-fab";
      fab.setAttribute("aria-controls", "right-sidebar");
      fab.setAttribute("aria-expanded", "false");
      fab.innerHTML =
        '<span class="mobile-betslip-fab-label">Bet slip</span>' +
        '<span class="mobile-betslip-fab-count" id="mobile-betslip-fab-count">0</span>';
      document.body.appendChild(fab);
      fab.addEventListener("click", (e) => {
        e.stopPropagation();
        if ($("#right-sidebar")?.classList.contains("is-open")) closeAllMobileDrawers();
        else openRightDrawer();
      });
    }
    const fabCount = $("#mobile-betslip-fab-count");
    if (fabCount) fabCount.textContent = String(n);
    const sheetOpen = Boolean($("#right-sidebar")?.classList.contains("is-open"));
    const hasSportsTabbar = Boolean(document.querySelector(".mobile-tabbar--sports"));
    fab.hidden = n === 0 || !isMobileViewport() || sheetOpen || hasSportsTabbar;
    fab.setAttribute("aria-expanded", sheetOpen ? "true" : "false");
    fab.classList.toggle("is-open", sheetOpen);
  }

  function syncBetTabCount() {
    const tab = $('.bet-tab[data-bet-tab="slip"]');
    if (!tab) return;
    let badge = tab.querySelector(".bet-tab-count");
    if (!badge) {
      badge = document.createElement("span");
      badge.className = "bet-tab-count";
      tab.appendChild(badge);
    }
    const n = state.betSlip.length;
    badge.hidden = n === 0;
    badge.textContent = String(n);
  }

  function isBetSlipLoggedIn() {
    if (window.AuthModals && typeof window.AuthModals.isLoggedIn === "function") {
      return !!window.AuthModals.isLoggedIn();
    }
    return document.body.classList.contains("is-logged-in");
  }

  function loadSlipSettings() {
    try {
      const raw = localStorage.getItem(SLIP_SETTINGS_KEY);
      if (!raw) return { ...SLIP_SETTINGS_DEFAULTS };
      const parsed = JSON.parse(raw);
      return { ...SLIP_SETTINGS_DEFAULTS, ...parsed };
    } catch (e) {
      return { ...SLIP_SETTINGS_DEFAULTS };
    }
  }

  function saveSlipSettings(next) {
    state.slipSettings = { ...SLIP_SETTINGS_DEFAULTS, ...next };
    try {
      localStorage.setItem(SLIP_SETTINGS_KEY, JSON.stringify(state.slipSettings));
    } catch (e) { /* ignore */ }
  }

  function applyBetSlipSettings(opts) {
    const panel = $(".bet-slip-panel");
    if (!panel) return;
    const s = state.slipSettings;
    panel.classList.toggle("bss-hide-balance", !s.balance);
    panel.classList.toggle("bss-hide-winnings", !s.potentialWinnings);
    panel.classList.toggle("bss-hide-select-account", !s.selectAccount);
    panel.classList.toggle("bss-automax", !!s.automax);

    if (opts && opts.applyAutomaxStake && s.automax) {
      const stakeInput = $("#stake-input");
      if (stakeInput) {
        const bal = window.DsWallet ? Math.max(1, Math.floor(Number(window.DsWallet.get()) || 0)) : 50;
        stakeInput.value = String(bal > 0 ? bal : 50);
        updateTotals();
      }
    }
  }

  function ensureBetSlipSettingsModal() {
    let overlay = $("#bss-overlay");
    if (overlay) return overlay;

    overlay = document.createElement("div");
    overlay.className = "bss-backdrop";
    overlay.id = "bss-overlay";
    overlay.hidden = true;
    overlay.innerHTML =
      `<div class="bss-panel" role="dialog" aria-modal="true" aria-labelledby="bss-title">` +
        `<div class="bss-head">` +
          `<h2 class="bss-title" id="bss-title">Bet Slip Settings</h2>` +
          `<button type="button" class="bss-close" id="bss-close" aria-label="Close settings">&times;</button>` +
        `</div>` +
        `<div class="bss-body">` +
          `<div class="bss-list">` +
            `<label class="bss-option">` +
              `<input type="checkbox" class="bss-check" data-bss="automax" />` +
              `<span>Automax</span>` +
            `</label>` +
            `<label class="bss-option">` +
              `<input type="checkbox" class="bss-check" data-bss="balance" />` +
              `<span>Balance</span>` +
            `</label>` +
            `<label class="bss-option">` +
              `<input type="checkbox" class="bss-check" data-bss="potentialWinnings" />` +
              `<span>Potential winnings</span>` +
            `</label>` +
            `<label class="bss-option">` +
              `<input type="checkbox" class="bss-check" data-bss="selectAccount" />` +
              `<span>Select account</span>` +
            `</label>` +
          `</div>` +
          `<div class="bss-actions">` +
            `<button type="button" class="bss-save" id="bss-save">Save</button>` +
          `</div>` +
        `</div>` +
      `</div>`;

    const host = $(".bet-slip-panel") || document.body;
    host.appendChild(overlay);

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeBetSlipSettings();
    });
    $("#bss-close", overlay)?.addEventListener("click", closeBetSlipSettings);
    $("#bss-save", overlay)?.addEventListener("click", () => {
      const next = {
        automax: !!overlay.querySelector('[data-bss="automax"]')?.checked,
        balance: !!overlay.querySelector('[data-bss="balance"]')?.checked,
        potentialWinnings: !!overlay.querySelector('[data-bss="potentialWinnings"]')?.checked,
        selectAccount: !!overlay.querySelector('[data-bss="selectAccount"]')?.checked,
      };
      saveSlipSettings(next);
      applyBetSlipSettings({ applyAutomaxStake: true });
      closeBetSlipSettings();
      showToast("Bet slip settings saved");
    });

    return overlay;
  }

  function mountBetSlipSettingsHost(overlay) {
    if (!overlay) return;
    const panel = $(".bet-slip-panel");
    const mobile = isMobileViewport();
    const target = mobile ? document.body : panel || document.body;
    if (overlay.parentElement !== target) target.appendChild(overlay);
  }

  function syncBetSlipSettingsForm() {
    const overlay = $("#bss-overlay");
    if (!overlay) return;
    const s = state.slipSettings;
    const map = {
      automax: s.automax,
      balance: s.balance,
      potentialWinnings: s.potentialWinnings,
      selectAccount: s.selectAccount,
    };
    Object.keys(map).forEach((key) => {
      const input = overlay.querySelector(`[data-bss="${key}"]`);
      if (input) input.checked = !!map[key];
    });
  }

  function closeBetSlipSettings() {
    const overlay = $("#bss-overlay");
    if (!overlay) return;
    overlay.hidden = true;
    document.body.classList.remove("bss-open");
  }

  function openBetSlipSettings() {
    closeTicketPopovers();
    closeBetSlipShare();
    const overlay = ensureBetSlipSettingsModal();
    if (!overlay) return;
    mountBetSlipSettingsHost(overlay);
    syncBetSlipSettingsForm();
    overlay.hidden = false;
    if (isMobileViewport()) document.body.classList.add("bss-open");
    else document.body.classList.remove("bss-open");
    $("#bss-close", overlay)?.focus();
  }

  function isBetSlipSettingsTrigger(el) {
    if (!el) return false;
    /* Ticket row gears open Baseline / Stake popovers — not the main BSS panel */
    if (el.closest("[data-ticket-popover]")) return false;
    if (el.closest(".ticket-settings")) return false;
    const btn = el.closest(".bet-icon-btn");
    if (!btn) return false;
    const label = (btn.getAttribute("aria-label") || btn.getAttribute("title") || "").toLowerCase();
    return label === "settings";
  }

  /* ---------- Bet Slip Share (coupon + URL) ---------- */

  const COUPON_STORE_KEY = "1xbet-shared-coupons";
  const COUPON_ALPHABET = "0123456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  const COUPON_MAX_ENTRIES = 50;
  let activeShareSession = null;

  function loadCouponStore() {
    try {
      const raw = localStorage.getItem(COUPON_STORE_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (_) {
      return {};
    }
  }

  function saveCouponStore(store) {
    try {
      localStorage.setItem(COUPON_STORE_KEY, JSON.stringify(store));
    } catch (_) {
      /* ignore */
    }
  }

  function generateCouponCode() {
    const store = loadCouponStore();
    for (let attempt = 0; attempt < 40; attempt++) {
      let code = "";
      for (let i = 0; i < 5; i++) {
        code += COUPON_ALPHABET[Math.floor(Math.random() * COUPON_ALPHABET.length)];
      }
      if (!store[code]) return code;
    }
    return String(Date.now()).slice(-5).toUpperCase();
  }

  function serializeBetSlipForShare(items) {
    return (items || []).map((b) => ({
      id: b.id,
      eventId: betEventId(b),
      league: b.league || "",
      match: b.match || "",
      market: b.market || "",
      selection: b.selection || "",
      odds: Number(b.odds),
    }));
  }

  function saveSharedCoupon(code, items) {
    const store = loadCouponStore();
    store[code] = {
      v: 1,
      createdAt: Date.now(),
      items: serializeBetSlipForShare(items),
    };
    const keys = Object.keys(store);
    if (keys.length > COUPON_MAX_ENTRIES) {
      keys
        .map((k) => ({ k, t: store[k]?.createdAt || 0 }))
        .sort((a, b) => a.t - b.t)
        .slice(0, keys.length - COUPON_MAX_ENTRIES)
        .forEach((entry) => {
          delete store[entry.k];
        });
    }
    saveCouponStore(store);
    return store[code];
  }

  function loadSharedCoupon(code) {
    if (!code) return null;
    const key = String(code).trim().toUpperCase();
    const store = loadCouponStore();
    return store[key] || null;
  }

  function buildCouponShareUrl(code) {
    const url = new URL(window.location.href);
    url.search = "";
    url.hash = "";
    const key = String(code).toUpperCase();
    url.searchParams.set("coupon-code", key);
    const payload = loadSharedCoupon(key);
    if (payload && Array.isArray(payload.items) && payload.items.length) {
      try {
        const packed = btoa(unescape(encodeURIComponent(JSON.stringify(payload.items))))
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=+$/g, "");
        if (packed.length < 1800) url.searchParams.set("slip", packed);
      } catch (_) {
        /* ignore — coupon-code + local store still works */
      }
    }
    return url.toString();
  }

  function decodeSlipParam(raw) {
    if (!raw) return null;
    try {
      let b64 = String(raw).replace(/-/g, "+").replace(/_/g, "/");
      while (b64.length % 4) b64 += "=";
      const json = decodeURIComponent(escape(atob(b64)));
      const items = JSON.parse(json);
      return Array.isArray(items) ? items : null;
    } catch (_) {
      return null;
    }
  }

  function copyTextToClipboard(text) {
    const value = String(text || "");
    if (!value) return Promise.reject(new Error("empty"));
    if (navigator.clipboard?.writeText) {
      return navigator.clipboard.writeText(value);
    }
    return new Promise((resolve, reject) => {
      try {
        const ta = document.createElement("textarea");
        ta.value = value;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        if (ok) resolve();
        else reject(new Error("copy failed"));
      } catch (err) {
        reject(err);
      }
    });
  }

  function readSelectionOdds(event, market, selection) {
    if (!event) return null;
    const m = market || "";
    const s = selection || "";
    if (m === "1X2" || m === "Winner") {
      if (s === "1" || s === "W1") return event.o1;
      if (s === "X") return event.ox;
      if (s === "2" || s === "W2") return event.o2;
    }
    if (m === "Double Chance") {
      if (s === "1X") return event.dc1x;
      if (s === "12") return event.dc12;
      if (s === "2X") return event.dc2x;
    }
    if (m === "Total") {
      if (s === "Over") return event.over;
      if (s === "Under") return event.under;
    }
    if (m === "Handicap") {
      if (s === "1" || s === "W1") return event.h1;
      if (s === "2" || s === "W2") return event.h2;
    }
    return undefined;
  }

  function reconcileSharedBet(bet) {
    const hydrated = hydrateTicketData(bet);
    const sharedOdds = Number(bet.odds);
    const eventId = betEventId(hydrated);
    const found = findEventInLeagues(eventId);

    if (!found) {
      return {
        ...hydrated,
        status: "closed",
        statusMsg: "Event blocked",
        sharedOdds,
        previousOdds: sharedOdds,
        odds: sharedOdds,
      };
    }

    const e = found.event;
    if (e.closed || e.status === "finished") {
      return {
        ...hydrated,
        status: "closed",
        statusMsg: "Event blocked",
        sharedOdds,
        previousOdds: sharedOdds,
        odds: sharedOdds,
      };
    }

    const liveOdds = readSelectionOdds(e, bet.market, bet.selection);
    if (liveOdds == null) {
      return {
        ...hydrated,
        status: "closed",
        statusMsg: "Event blocked",
        sharedOdds,
        previousOdds: sharedOdds,
        odds: sharedOdds,
      };
    }

    const live = Number(liveOdds);
    if (Number.isFinite(sharedOdds) && Math.abs(sharedOdds - live) > 0.0005) {
      return {
        ...hydrated,
        status: "changed",
        statusMsg: "Odds updated",
        sharedOdds,
        previousOdds: sharedOdds,
        odds: live,
      };
    }

    return {
      ...hydrated,
      status: "ok",
      statusMsg: "",
      sharedOdds: Number.isFinite(sharedOdds) ? sharedOdds : live,
      odds: live,
    };
  }

  function applyImportedCoupon(payload, opts) {
    const options = opts || {};
    const items = Array.isArray(payload?.items) ? payload.items : [];
    if (!items.length) {
      if (!options.silent) showToast("Coupon has no selections");
      return false;
    }
    state.betSlip = items.map((item) => reconcileSharedBet(item));
    renderBetSlip();
    if (!options.silent) showToast("Bet Slip imported");
    return true;
  }

  function importCouponCode(code, opts) {
    const payload = loadSharedCoupon(code);
    if (!payload) {
      if (!(opts && opts.silent)) showToast("Coupon not found");
      return false;
    }
    return applyImportedCoupon(payload, opts);
  }

  function clearCouponCodeFromUrl() {
    try {
      const url = new URL(window.location.href);
      if (!url.searchParams.has("coupon-code") && !url.searchParams.has("slip")) return;
      url.searchParams.delete("coupon-code");
      url.searchParams.delete("slip");
      const next = url.pathname + (url.search || "") + (url.hash || "");
      window.history.replaceState({}, "", next);
    } catch (_) {
      /* ignore */
    }
  }

  function importCouponFromQuery() {
    let code = "";
    let slipRaw = "";
    try {
      const url = new URL(window.location.href);
      code = url.searchParams.get("coupon-code") || "";
      slipRaw = url.searchParams.get("slip") || "";
    } catch (_) {
      code = "";
      slipRaw = "";
    }
    code = String(code).trim().toUpperCase();
    const slipItems = decodeSlipParam(slipRaw);
    let ok = false;
    if (slipItems && slipItems.length) {
      if (code) saveSharedCoupon(code, slipItems);
      ok = applyImportedCoupon({ items: slipItems }, { silent: false });
    } else if (code) {
      ok = importCouponCode(code, { silent: false });
    }
    if (code || slipRaw) clearCouponCodeFromUrl();
    return ok;
  }

  function qrImageUrl(data) {
    return (
      "https://api.qrserver.com/v1/create-qr-code/?size=168x168&margin=8&data=" +
      encodeURIComponent(data)
    );
  }

  function syncShareModalContent(overlay) {
    if (!overlay || !activeShareSession) return;
    const { code, url } = activeShareSession;
    const codeEl = overlay.querySelector("[data-bsh-code]");
    const urlEl = overlay.querySelector("[data-bsh-url]");
    const qr = overlay.querySelector("[data-bsh-qr]");
    const qrWrap = overlay.querySelector("[data-bsh-qr-wrap]");
    const nativeBtn = overlay.querySelector("[data-bsh-native]");
    if (codeEl) codeEl.textContent = code;
    if (urlEl) urlEl.value = url;
    if (qr) {
      qr.src = qrImageUrl(url);
      qr.alt = "QR code for coupon " + code;
    }
    if (qrWrap) qrWrap.hidden = isMobileViewport();
    if (nativeBtn) {
      nativeBtn.hidden = !(typeof navigator.share === "function" && isMobileViewport());
    }
  }

  function ensureBetSlipShareModal() {
    let overlay = $("#bsh-overlay");
    if (overlay) return overlay;

    overlay = document.createElement("div");
    overlay.className = "bss-backdrop bsh-backdrop";
    overlay.id = "bsh-overlay";
    overlay.hidden = true;
    overlay.innerHTML =
      `<div class="bss-panel bsh-panel" role="dialog" aria-modal="true" aria-labelledby="bsh-title">` +
        `<div class="bss-head">` +
          `<h2 class="bss-title" id="bsh-title">Share Bet Slip</h2>` +
          `<button type="button" class="bss-close" id="bsh-close" aria-label="Close share">&times;</button>` +
        `</div>` +
        `<div class="bss-body bsh-body">` +
          `<div class="bsh-coupon">` +
            `<span class="bsh-coupon-label">Coupon</span>` +
            `<span class="bsh-coupon-code" data-bsh-code>—</span>` +
          `</div>` +
          `<label class="bsh-url-field">` +
            `<span class="visually-hidden">Share link</span>` +
            `<input type="text" class="bsh-url-input" data-bsh-url readonly spellcheck="false" />` +
          `</label>` +
          `<div class="bsh-actions">` +
            `<button type="button" class="bsh-btn bsh-btn--primary" data-bsh-copy-link>Copy Link</button>` +
            `<button type="button" class="bsh-btn" data-bsh-copy-coupon>Copy Coupon</button>` +
            `<button type="button" class="bsh-btn" data-bsh-native hidden>Share</button>` +
          `</div>` +
          `<div class="bsh-qr-wrap" data-bsh-qr-wrap hidden>` +
            `<p class="bsh-qr-label">QR Code</p>` +
            `<img class="bsh-qr" data-bsh-qr src="" alt="" width="168" height="168" />` +
          `</div>` +
        `</div>` +
      `</div>`;

    const host = $(".bet-slip-panel") || document.body;
    host.appendChild(overlay);

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeBetSlipShare();
    });
    $("#bsh-close", overlay)?.addEventListener("click", closeBetSlipShare);

    overlay.querySelector("[data-bsh-copy-link]")?.addEventListener("click", () => {
      const text = activeShareSession?.url || overlay.querySelector("[data-bsh-url]")?.value || "";
      copyTextToClipboard(text).then(
        () => showToast("Link copied"),
        () => showToast("Could not copy link")
      );
    });
    overlay.querySelector("[data-bsh-copy-coupon]")?.addEventListener("click", () => {
      const text = activeShareSession?.code || overlay.querySelector("[data-bsh-code]")?.textContent || "";
      copyTextToClipboard(text).then(
        () => showToast("Coupon copied"),
        () => showToast("Could not copy coupon")
      );
    });
    overlay.querySelector("[data-bsh-native]")?.addEventListener("click", async () => {
      if (!activeShareSession || typeof navigator.share !== "function") return;
      try {
        await navigator.share({
          title: "Bet Slip",
          text: "Coupon " + activeShareSession.code,
          url: activeShareSession.url,
        });
      } catch (err) {
        if (err && err.name === "AbortError") return;
        showToast("Share cancelled");
      }
    });

    return overlay;
  }

  function mountBetSlipShareHost(overlay) {
    if (!overlay) return;
    const panel = $(".bet-slip-panel");
    const mobile = isMobileViewport();
    const target = mobile ? document.body : panel || document.body;
    if (overlay.parentElement !== target) target.appendChild(overlay);
  }

  function closeBetSlipShare() {
    const overlay = $("#bsh-overlay");
    if (!overlay) return;
    overlay.hidden = true;
    document.body.classList.remove("bss-open");
  }

  function openBetSlipShare() {
    closeBetSlipSettings();
    closeTicketPopovers();
    if (!state.betSlip.length) {
      showToast("Add events to the bet slip before sharing");
      return;
    }
    const code = generateCouponCode();
    saveSharedCoupon(code, state.betSlip);
    activeShareSession = { code, url: buildCouponShareUrl(code) };

    const overlay = ensureBetSlipShareModal();
    if (!overlay) return;
    mountBetSlipShareHost(overlay);
    syncShareModalContent(overlay);
    overlay.hidden = false;
    if (isMobileViewport()) document.body.classList.add("bss-open");
    else document.body.classList.remove("bss-open");
    $("#bsh-close", overlay)?.focus();
  }

  function isBetSlipShareTrigger(el) {
    if (!el) return false;
    if (el.closest("[data-ticket-popover]")) return false;
    if (el.closest(".ticket-settings")) return false;
    const btn = el.closest(".bet-icon-btn");
    if (!btn) return false;
    const label = (btn.getAttribute("aria-label") || btn.getAttribute("title") || "").toLowerCase();
    return label === "share";
  }

  window.BetSlipShare = {
    open: openBetSlipShare,
    close: closeBetSlipShare,
    importCode: importCouponCode,
    fromQuery: importCouponFromQuery,
  };

  function loadBaselineOdds() {
    try {
      const raw = localStorage.getItem(BASELINE_ODDS_KEY);
      if (!raw) return { ...BASELINE_ODDS_DEFAULTS };
      return { ...BASELINE_ODDS_DEFAULTS, ...JSON.parse(raw) };
    } catch (e) {
      return { ...BASELINE_ODDS_DEFAULTS };
    }
  }

  function saveBaselineOdds(next) {
    state.baselineOdds = { ...BASELINE_ODDS_DEFAULTS, ...next };
    try {
      localStorage.setItem(BASELINE_ODDS_KEY, JSON.stringify(state.baselineOdds));
    } catch (e) { /* ignore */ }
  }

  function loadStakePrefs() {
    try {
      const raw = localStorage.getItem(STAKE_PREFS_KEY);
      if (!raw) return { ...STAKE_PREFS_DEFAULTS, quick: [...STAKE_PREFS_DEFAULTS.quick] };
      const parsed = JSON.parse(raw);
      const quick = Array.isArray(parsed.quick)
        ? parsed.quick.map((n) => Number(n) || 0).filter((n) => n > 0).slice(0, 3)
        : [...STAKE_PREFS_DEFAULTS.quick];
      while (quick.length < 3) quick.push(STAKE_PREFS_DEFAULTS.quick[quick.length]);
      return {
        increment: Math.max(1, Number(parsed.increment) || STAKE_PREFS_DEFAULTS.increment),
        quick,
      };
    } catch (e) {
      return { ...STAKE_PREFS_DEFAULTS, quick: [...STAKE_PREFS_DEFAULTS.quick] };
    }
  }

  function saveStakePrefs(next) {
    const quick = (next.quick || STAKE_PREFS_DEFAULTS.quick)
      .map((n) => Math.max(1, Number(n) || 1))
      .slice(0, 3);
    while (quick.length < 3) quick.push(STAKE_PREFS_DEFAULTS.quick[quick.length]);
    state.stakePrefs = {
      increment: Math.max(1, Number(next.increment) || STAKE_PREFS_DEFAULTS.increment),
      quick,
    };
    try {
      localStorage.setItem(STAKE_PREFS_KEY, JSON.stringify(state.stakePrefs));
    } catch (e) { /* ignore */ }
  }

  function applyStakePrefs() {
    const prefs = state.stakePrefs || STAKE_PREFS_DEFAULTS;
    const inc = Math.max(1, Number(prefs.increment) || 10);
    $$("[data-stake-step]").forEach((btn) => {
      const cur = Number(btn.getAttribute("data-stake-step")) || 0;
      const dir = cur < 0 ? -1 : 1;
      btn.setAttribute("data-stake-step", String(dir * inc));
    });
    const buttons = $$(".quick-stakes [data-quick-stake]");
    (prefs.quick || STAKE_PREFS_DEFAULTS.quick).forEach((val, i) => {
      if (!buttons[i]) return;
      buttons[i].setAttribute("data-quick-stake", String(val));
      buttons[i].textContent = `+${val}`;
    });
  }

  function mountTicketPopoverHost(overlay) {
    if (!overlay) return;
    const panel = $(".bet-slip-panel");
    const mobile = isMobileViewport();
    const target = mobile ? document.body : panel || document.body;
    if (overlay.parentElement !== target) target.appendChild(overlay);
  }

  function closeTicketPopovers() {
    ["#tsp-baseline-overlay", "#tsp-stake-overlay"].forEach((sel) => {
      const el = $(sel);
      if (el) el.hidden = true;
    });
    document.body.classList.remove("tsp-open");
  }

  function ensureBaselineOddsModal() {
    let overlay = $("#tsp-baseline-overlay");
    if (overlay) return overlay;

    overlay = document.createElement("div");
    overlay.className = "bss-backdrop tsp-backdrop";
    overlay.id = "tsp-baseline-overlay";
    overlay.hidden = true;
    overlay.innerHTML =
      `<div class="bss-panel tsp-panel" role="dialog" aria-modal="true" aria-labelledby="tsp-baseline-title">` +
        `<div class="bss-head tsp-head">` +
          `<div class="tsp-title-row">` +
            `<h2 class="bss-title" id="tsp-baseline-title">Baseline odds</h2>` +
            `<button type="button" class="tsp-info" id="tsp-baseline-info" aria-label="About baseline odds" title="About baseline odds">i</button>` +
          `</div>` +
          `<button type="button" class="bss-close" id="tsp-baseline-close" aria-label="Close">&times;</button>` +
        `</div>` +
        `<div class="bss-body tsp-body">` +
          `<label class="tsp-field">` +
            `<span class="tsp-label">Set baseline odds</span>` +
            `<input type="text" class="tsp-input" id="tsp-baseline-input" inputmode="decimal" autocomplete="off" />` +
          `</label>` +
          `<label class="tsp-check-row">` +
            `<input type="checkbox" class="tsp-check" id="tsp-baseline-cancel" />` +
            `<span>Cancel request if the score changes</span>` +
          `</label>` +
          `<div class="tsp-actions">` +
            `<button type="button" class="bss-save tsp-save" id="tsp-baseline-save">Save</button>` +
            `<button type="button" class="tsp-trash" id="tsp-baseline-clear" aria-label="Clear baseline odds">` +
              `<img src="assets/images/account/icon-trash.svg" alt="" width="16" height="16" />` +
            `</button>` +
          `</div>` +
        `</div>` +
      `</div>`;

    const host = $(".bet-slip-panel") || document.body;
    host.appendChild(overlay);

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeTicketPopovers();
    });
    $("#tsp-baseline-close", overlay)?.addEventListener("click", closeTicketPopovers);
    $("#tsp-baseline-info", overlay)?.addEventListener("click", () => {
      showToast("Baseline odds: place only if odds stay at or above your set value (demo)");
    });
    $("#tsp-baseline-save", overlay)?.addEventListener("click", () => {
      const odds = String($("#tsp-baseline-input", overlay)?.value || "").trim();
      const cancelOnScoreChange = !!$("#tsp-baseline-cancel", overlay)?.checked;
      saveBaselineOdds({ odds, cancelOnScoreChange });
      closeTicketPopovers();
      showToast(odds ? `Baseline odds set to ${odds}` : "Baseline odds cleared");
    });
    $("#tsp-baseline-clear", overlay)?.addEventListener("click", () => {
      saveBaselineOdds({ ...BASELINE_ODDS_DEFAULTS });
      const input = $("#tsp-baseline-input", overlay);
      const check = $("#tsp-baseline-cancel", overlay);
      if (input) input.value = "";
      if (check) check.checked = false;
      showToast("Baseline odds cleared");
    });

    return overlay;
  }

  function openBaselineOddsSettings() {
    closeBetSlipSettings();
    closeTicketPopovers();
    const overlay = ensureBaselineOddsModal();
    if (!overlay) return;
    mountTicketPopoverHost(overlay);
    const s = state.baselineOdds || loadBaselineOdds();
    const input = $("#tsp-baseline-input", overlay);
    const check = $("#tsp-baseline-cancel", overlay);
    if (input) input.value = s.odds || "";
    if (check) check.checked = !!s.cancelOnScoreChange;
    overlay.hidden = false;
    if (isMobileViewport()) document.body.classList.add("tsp-open");
    else document.body.classList.remove("tsp-open");
    input?.focus();
  }

  function ensureStakeSettingsModal() {
    let overlay = $("#tsp-stake-overlay");
    if (overlay) return overlay;

    overlay = document.createElement("div");
    overlay.className = "bss-backdrop tsp-backdrop";
    overlay.id = "tsp-stake-overlay";
    overlay.hidden = true;
    overlay.innerHTML =
      `<div class="bss-panel tsp-panel" role="dialog" aria-modal="true" aria-labelledby="tsp-stake-title">` +
        `<div class="bss-head tsp-head">` +
          `<h2 class="bss-title" id="tsp-stake-title">Stake</h2>` +
          `<button type="button" class="bss-close" id="tsp-stake-close" aria-label="Close">&times;</button>` +
        `</div>` +
        `<div class="bss-body tsp-body">` +
          `<label class="tsp-field">` +
            `<span class="tsp-label">Set stake increase/decrease increment</span>` +
            `<input type="number" class="tsp-input" id="tsp-stake-increment" min="1" step="1" />` +
          `</label>` +
          `<div class="tsp-divider" aria-hidden="true"></div>` +
          `<fieldset class="tsp-fieldset">` +
            `<legend class="tsp-label">Edit quick amounts</legend>` +
            `<input type="number" class="tsp-input" data-tsp-quick="0" min="1" step="1" />` +
            `<input type="number" class="tsp-input" data-tsp-quick="1" min="1" step="1" />` +
            `<input type="number" class="tsp-input" data-tsp-quick="2" min="1" step="1" />` +
          `</fieldset>` +
          `<div class="tsp-actions tsp-actions--single">` +
            `<button type="button" class="bss-save tsp-save" id="tsp-stake-save">Save</button>` +
          `</div>` +
        `</div>` +
      `</div>`;

    const host = $(".bet-slip-panel") || document.body;
    host.appendChild(overlay);

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeTicketPopovers();
    });
    $("#tsp-stake-close", overlay)?.addEventListener("click", closeTicketPopovers);
    $("#tsp-stake-save", overlay)?.addEventListener("click", () => {
      const increment = Number($("#tsp-stake-increment", overlay)?.value) || STAKE_PREFS_DEFAULTS.increment;
      const quick = [0, 1, 2].map((i) => {
        const el = overlay.querySelector(`[data-tsp-quick="${i}"]`);
        return Number(el?.value) || STAKE_PREFS_DEFAULTS.quick[i];
      });
      saveStakePrefs({ increment, quick });
      applyStakePrefs();
      closeTicketPopovers();
      showToast("Stake settings saved");
    });

    return overlay;
  }

  function openStakeSettings() {
    closeBetSlipSettings();
    closeTicketPopovers();
    const overlay = ensureStakeSettingsModal();
    if (!overlay) return;
    mountTicketPopoverHost(overlay);
    const prefs = state.stakePrefs || loadStakePrefs();
    const inc = $("#tsp-stake-increment", overlay);
    if (inc) inc.value = String(prefs.increment || 10);
    (prefs.quick || STAKE_PREFS_DEFAULTS.quick).forEach((val, i) => {
      const el = overlay.querySelector(`[data-tsp-quick="${i}"]`);
      if (el) el.value = String(val);
    });
    overlay.hidden = false;
    if (isMobileViewport()) document.body.classList.add("tsp-open");
    else document.body.classList.remove("tsp-open");
    inc?.focus();
  }

  function openTicketPopover(kind) {
    if (kind === "baseline") openBaselineOddsSettings();
    else if (kind === "stake") openStakeSettings();
  }

  function ensureTicketFooter() {
    const footer = $("#bet-footer");
    if (!footer) return;
    if (footer.dataset.ticketLayout !== "true") {
      footer.dataset.ticketLayout = "true";
      footer.innerHTML = `
      <div class="bet-type-row">
        <div class="bet-type-wrap">
          <button type="button" class="ticket-select" id="bet-type-select" aria-haspopup="listbox" aria-expanded="false" aria-controls="bet-type-menu">
            <span id="bet-type-label">Single bet</span>
            <span class="select-chevron" aria-hidden="true"></span>
          </button>
          <ul class="bet-type-menu" id="bet-type-menu" role="listbox" aria-label="Bet type" hidden></ul>
        </div>
        <button type="button" class="ticket-trash" id="clear-bets" aria-label="Clear bet slip">
          <img src="assets/icons/rb-close.svg" alt="" width="12" height="12" />
        </button>
      </div>
      <div class="ticket-summary-row">
        <span>Overall odds</span>
        <strong id="total-odds">1.00</strong>
        <button type="button" class="ticket-settings" data-ticket-popover="baseline" aria-label="Baseline odds settings" title="Baseline odds">
          <img src="assets/icons/rb-settings.svg" alt="" width="12" height="12" />
        </button>
      </div>
      <div class="ticket-stake-block">
        <label class="stake-title" for="stake-input">Stake amount (MYR)</label>
        <div class="stake-control">
          <button type="button" class="stake-step" data-stake-step="-10" aria-label="Decrease stake">-</button>
          <input type="number" id="stake-input" min="1" step="1" value="50" />
          <button type="button" class="stake-step" data-stake-step="10" aria-label="Increase stake">+</button>
          <button type="button" class="ticket-settings" data-ticket-popover="stake" aria-label="Stake settings" title="Stake settings">
            <img src="assets/icons/rb-settings.svg" alt="" width="12" height="12" />
          </button>
        </div>
        <div class="quick-stakes" aria-label="Quick stake amounts">
          <button type="button" data-quick-stake="1">+1</button>
          <button type="button" data-quick-stake="100">+100</button>
          <button type="button" data-quick-stake="250">+250</button>
        </div>
      </div>
      <div class="ticket-account-meta" id="ticket-account-meta">
        <button type="button" class="max-stake-link">
          <span>Maximum stake</span>
          <strong data-wallet-max>0 MYR</strong>
        </button>
        <button type="button" class="ticket-meta-link" data-ticket-meta="balance">
          <span>Balance</span>
          <strong data-wallet-main>0 MYR</strong>
        </button>
        <button type="button" class="ticket-meta-link" data-ticket-meta="advancebet">
          <span>Available Advancebet</span>
          <strong class="ticket-meta-adv">0 MYR <span class="ticket-meta-refresh" aria-hidden="true">↻</span></strong>
        </button>
      </div>
      <div class="ticket-field odds-change-field">
        <span id="odds-change-label">When odds change:</span>
        <div class="odds-change-wrap">
          <button type="button" class="ticket-select" id="odds-change-select" aria-haspopup="listbox" aria-expanded="false" aria-controls="odds-change-menu" aria-labelledby="odds-change-label">
            <span id="odds-change-value">Accept if odds increase</span>
            <span class="select-chevron" aria-hidden="true"></span>
          </button>
          <ul class="odds-change-menu" id="odds-change-menu" role="listbox" aria-label="When odds change" hidden></ul>
        </div>
      </div>
      <label class="promo-code-field" for="promo-code-input">
        <span class="visually-hidden">Promo code</span>
        <input type="text" id="promo-code-input" class="promo-code-input" placeholder="Promo code" autocomplete="off" spellcheck="false" />
      </label>
      <div class="ticket-winnings-row">
        <span>Potential winnings</span>
        <strong><span id="potential-return">0</span> MYR</strong>
      </div>
      <button type="button" class="btn-place" id="place-bet">Place Bet</button>
    `;
    }
    syncBetSlipAuthUi();
    applyBetSlipSettings();
    applyStakePrefs();
    syncBetTypeSelect();
    syncOddsChangeSelect();
    syncPromoCodeField();
  }

  function closeBetTypeMenu() {
    const select = $("#bet-type-select");
    const menu = $("#bet-type-menu");
    const wrap = $(".bet-type-wrap");
    if (menu) menu.hidden = true;
    if (select) select.setAttribute("aria-expanded", "false");
    if (wrap) wrap.classList.remove("is-open");
  }

  function renderBetTypeMenu() {
    const menu = $("#bet-type-menu");
    if (!menu) return;
    const current = state.betTypeMode;
    menu.innerHTML = BET_TYPE_MULTI_OPTIONS.map((opt) => {
      const selected = opt.id === current;
      return (
        `<li role="presentation">` +
        `<button type="button" class="bet-type-option${selected ? " is-active" : ""}" role="option" data-bet-type="${opt.id}" aria-selected="${selected ? "true" : "false"}">${opt.label}</button>` +
        `</li>`
      );
    }).join("");
  }

  function openBetTypeMenu() {
    if (state.betSlip.length <= 1) return;
    const select = $("#bet-type-select");
    const menu = $("#bet-type-menu");
    const wrap = $(".bet-type-wrap");
    if (!select || !menu) return;
    closeOddsChangeMenu();
    renderBetTypeMenu();
    menu.hidden = false;
    select.setAttribute("aria-expanded", "true");
    if (wrap) wrap.classList.add("is-open");
  }

  function syncBetTypeSelect() {
    const select = $("#bet-type-select");
    const label = $("#bet-type-label");
    if (!select || !label) return;

    const multi = state.betSlip.length > 1;
    if (!multi) {
      state.betTypeMode = "single";
      closeBetTypeMenu();
      select.classList.add("is-disabled");
      select.setAttribute("aria-disabled", "true");
      select.setAttribute("title", "Add another selection to change bet type");
    } else {
      if (state.betTypeMode === "single" || !BET_TYPE_MULTI_OPTIONS.some((o) => o.id === state.betTypeMode)) {
        state.betTypeMode = "accumulator";
      }
      select.classList.remove("is-disabled");
      select.setAttribute("aria-disabled", "false");
      select.removeAttribute("title");
    }

    label.textContent = BET_TYPE_LABELS[state.betTypeMode] || (multi ? "Accumulator" : "Single bet");
    if (multi && !$("#bet-type-menu")?.hidden) renderBetTypeMenu();
  }

  function setBetTypeMode(id) {
    if (state.betSlip.length <= 1) return;
    if (!BET_TYPE_MULTI_OPTIONS.some((o) => o.id === id)) return;
    state.betTypeMode = id;
    syncBetTypeSelect();
    closeBetTypeMenu();
    showToast(`Bet type: ${BET_TYPE_LABELS[id]}`);
  }

  function loadOddsChangeMode() {
    try {
      const saved = sessionStorage.getItem(ODDS_CHANGE_KEY);
      if (saved && ODDS_CHANGE_OPTIONS.some((o) => o.id === saved)) return saved;
    } catch (e) { /* ignore */ }
    return "increase";
  }

  function saveOddsChangeMode(id) {
    state.oddsChangeMode = id;
    try {
      sessionStorage.setItem(ODDS_CHANGE_KEY, id);
    } catch (e) { /* ignore */ }
  }

  function loadPromoCode() {
    try {
      return sessionStorage.getItem(PROMO_CODE_KEY) || "";
    } catch (e) {
      return "";
    }
  }

  function savePromoCode(value) {
    state.promoCode = String(value || "");
    try {
      sessionStorage.setItem(PROMO_CODE_KEY, state.promoCode);
    } catch (e) { /* ignore */ }
  }

  function closeOddsChangeMenu() {
    const select = $("#odds-change-select");
    const menu = $("#odds-change-menu");
    const wrap = $(".odds-change-wrap");
    if (menu) menu.hidden = true;
    if (select) select.setAttribute("aria-expanded", "false");
    if (wrap) wrap.classList.remove("is-open");
  }

  function renderOddsChangeMenu() {
    const menu = $("#odds-change-menu");
    if (!menu) return;
    const current = state.oddsChangeMode || "increase";
    menu.innerHTML = ODDS_CHANGE_OPTIONS.map((opt) => {
      const selected = opt.id === current;
      return (
        `<li role="presentation">` +
        `<button type="button" class="odds-change-option${selected ? " is-active" : ""}" role="option" data-odds-change="${opt.id}" aria-selected="${selected ? "true" : "false"}">${opt.label}</button>` +
        `</li>`
      );
    }).join("");
  }

  function openOddsChangeMenu() {
    const select = $("#odds-change-select");
    const menu = $("#odds-change-menu");
    const wrap = $(".odds-change-wrap");
    if (!select || !menu) return;
    closeBetTypeMenu();
    renderOddsChangeMenu();
    menu.hidden = false;
    select.setAttribute("aria-expanded", "true");
    if (wrap) wrap.classList.add("is-open");
  }

  function syncOddsChangeSelect() {
    const label = $("#odds-change-value");
    if (!label) return;
    const opt = ODDS_CHANGE_OPTIONS.find((o) => o.id === state.oddsChangeMode) || ODDS_CHANGE_OPTIONS[0];
    label.textContent = opt.label;
    if ($("#odds-change-menu") && !$("#odds-change-menu").hidden) renderOddsChangeMenu();
  }

  function setOddsChangeMode(id) {
    if (!ODDS_CHANGE_OPTIONS.some((o) => o.id === id)) return;
    saveOddsChangeMode(id);
    syncOddsChangeSelect();
    closeOddsChangeMenu();
  }

  function syncPromoCodeField() {
    const input = $("#promo-code-input");
    if (!input) return;
    if (document.activeElement !== input) {
      input.value = state.promoCode || "";
    }
  }

  function syncBetEmptyCopy() {
    const text = $("#bet-empty .bet-empty-text");
    if (!text) return;
    if (!text.dataset.desktopEmptyCopy) {
      text.dataset.desktopEmptyCopy = text.innerHTML;
    }
    /* Pages with bet-slip generator use .bet-empty-gen__alt on ≤900 */
    if ($("#bet-empty .bet-empty-gen")) {
      if (!isMobileViewport()) text.innerHTML = text.dataset.desktopEmptyCopy;
      return;
    }
    if (!isMobileViewport()) {
      text.innerHTML = text.dataset.desktopEmptyCopy;
      return;
    }
    text.textContent = isBetSlipLoggedIn()
      ? "Your bet slip is empty. Add an event to place a bet"
      : "Register to place a bet";
  }

  function syncBetSlipAuthUi() {
    const loggedIn = isBetSlipLoggedIn();
    const panel = $(".bet-slip-panel");
    if (panel) panel.classList.toggle("is-logged-in", loggedIn);

    syncBetTypeSelect();
    syncBetEmptyCopy();

    const wallet = window.DsWallet;
    const balance = loggedIn && wallet ? Number(wallet.get()) || 0 : 0;
    const balLabel = wallet ? wallet.format(balance) : "0";

    const meta = $("#ticket-account-meta");
    if (meta) {
      meta.classList.toggle("is-guest", !loggedIn);
      const balanceRow = meta.querySelector('[data-ticket-meta="balance"]');
      const advRow = meta.querySelector('[data-ticket-meta="advancebet"]');
      if (balanceRow) {
        balanceRow.hidden = !loggedIn;
        const strong = balanceRow.querySelector("strong");
        if (strong) strong.textContent = balLabel + " MYR";
      }
      if (advRow) advRow.hidden = !loggedIn;
      const maxStrong = meta.querySelector(".max-stake-link strong");
      if (maxStrong && loggedIn) maxStrong.textContent = balLabel + " MYR";
    }

    const place = $("#place-bet");
    if (place) {
      if (!loggedIn) {
        place.textContent = "Registration";
        place.dataset.cta = "register";
      } else if (balance <= 0) {
        place.textContent = "Deposit";
        place.dataset.cta = "deposit";
      } else {
        place.textContent = "Place Bet";
        place.dataset.cta = "place";
      }
    }

    const regCta = $("#bet-reg-cta");
    if (regCta) {
      /* Empty slip before login: show Registration (screenshot). Hide when slip has bets (CTA is in footer). */
      regCta.hidden = loggedIn || state.betSlip.length > 0;
    }

    syncMyBetsAuthUi();
  }

  window.syncBetSlipAuthUi = syncBetSlipAuthUi;

  if (typeof window.matchMedia === "function") {
    const emptyCopyMq = window.matchMedia("(max-width: 900px)");
    const onEmptyCopyViewport = () => syncBetEmptyCopy();
    if (typeof emptyCopyMq.addEventListener === "function") {
      emptyCopyMq.addEventListener("change", onEmptyCopyViewport);
    } else if (typeof emptyCopyMq.addListener === "function") {
      emptyCopyMq.addListener(onEmptyCopyViewport);
    }
  }

  function ticketScore(b) {
    if (b.score) return b.score;
    return b.live ? "[ 0:0 ]" : "";
  }

  function ticketSportIcon(b) {
    if (b.sportIcon) return `<img class="ticket-sport-icon" src="${b.sportIcon}" alt="" width="14" height="14" />`;
    return `<span class="ticket-sport-icon ticket-sport-dot" aria-hidden="true"></span>`;
  }

  function hydrateTicketData(data) {
    const source = { ...data };
    const sourceEventId = betEventId(source);
    for (const league of [...liveLeagues, ...lineLeagues]) {
      const event = league.events.find(
        (ev) => ev.id === sourceEventId || (source.id && source.id.startsWith(`${ev.id}-`))
      );
      if (!event) continue;
      const e = normalizeMatchEvent(event);
      const score =
        e.status === "live" && (e.score.home != null || e.score.away != null)
          ? `[ ${e.score.home ?? 0}:${e.score.away ?? 0} ]`
          : "";
      return {
        ...source,
        eventId: e.id,
        league: source.league || league.name,
        live: e.status === "live",
        score,
        match: source.match || `${e.home} - ${e.away}`,
        sportIcon: sportHeaderIconMap[league.sport] || `assets/icons/sport-${league.sport}.svg`,
      };
    }
    return {
      ...source,
      eventId: sourceEventId || source.eventId || source.id,
      live: Boolean(source.live),
      score: source.score || "",
    };
  }

  function renderTicketCards(items) {
    return items
      .map((b) => {
        const closed = b.status === "closed";
        const changed = b.status === "changed";
        const statusClass = closed ? " is-closed" : changed ? " is-odds-changed" : "";
        const oddsClass = changed ? " ticket-odds-pill is-updated" : " ticket-odds-pill";
        const oddsHtml = changed
          ? `<span class="${oddsClass.trim()}">${formatOdd(b.odds)}</span><span class="ticket-odds-prev">${formatOdd(b.previousOdds)}</span>`
          : `<span class="${oddsClass.trim()}">${formatOdd(closed && b.previousOdds != null ? b.previousOdds : b.odds)}</span>`;
        const changedMsg =
          changed && b.statusMsg
            ? `<p class="ticket-status-msg ticket-status-msg--odds">${b.statusMsg}</p>`
            : "";
        const blockedOverlay = closed
          ? `<div class="ticket-blocked-overlay" aria-hidden="true"><span class="ticket-blocked-label">Event blocked</span></div>`
          : "";
        return `
      <article class="bet-item ticket-card${statusClass}" data-bet-id="${b.id}"${closed ? ' aria-disabled="true"' : ""}>
        <button type="button" class="bet-remove" data-remove="${b.id}" aria-label="Remove selection">×</button>
        ${blockedOverlay}
        <div class="ticket-card-body">
          <div class="ticket-meta-line">
            ${b.live ? '<span class="ticket-live-badge">LIVE</span>' : ""}
            ${ticketSportIcon(b)}
            <span class="ticket-event-id">${b.eventId || b.id}</span>
            <span class="bet-item-league">${b.league || "Top Events"}</span>
          </div>
          <div class="bet-item-match">${b.match}</div>
          ${ticketScore(b) ? `<div class="ticket-score">${ticketScore(b)}</div>` : ""}
          <div class="ticket-selection-row">
            ${oddsHtml}
            <span class="ticket-market">${formatTicketMarket(b)}</span>
          </div>
          ${changedMsg}
        </div>
      </article>`;
      })
      .join("");
  }

  function renderBetSlip(opts) {
    const options = opts || {};
    const empty = $("#bet-empty");
    const list = $("#bet-list");
    const footer = $("#bet-footer");
    const body = $("#bet-slip-body");
    syncBetTabCount();
    syncMobileBetCount();
    const railCount = $("#rc-bet-count");
    if (railCount) railCount.textContent = String(state.betSlip.length);
    window.__betSlipCount = state.betSlip.length;
    if (body) body.classList.toggle("has-bets", state.betSlip.length > 0);

    if (!state.betSlip.length) {
      empty.hidden = false;
      list.hidden = true;
      footer.hidden = true;
      footer.classList.remove("is-sticky");
      list.innerHTML = "";
      syncBetSlipAuthUi();
      syncOddButtons();
      if (typeof window.DsBetSlipGenerator?.ensureEmptyCta === "function") {
        window.DsBetSlipGenerator.ensureEmptyCta();
      }
      return;
    }

    const prevIds = new Set(
      Array.from(list.querySelectorAll("[data-bet-id]")).map((el) => el.getAttribute("data-bet-id"))
    );
    const animateId = options.animateId || null;

    empty.hidden = true;
    list.hidden = false;
    footer.hidden = false;
    footer.classList.add("is-sticky");
    ensureTicketFooter();
    list.innerHTML = renderTicketCards(state.betSlip);

    list.querySelectorAll(".ticket-card[data-bet-id]").forEach((card) => {
      const id = card.getAttribute("data-bet-id");
      const isNew = animateId ? id === animateId : !prevIds.has(id);
      if (!isNew) return;
      card.classList.add("is-entering");
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          card.classList.add("is-entered");
        });
      });
      const clearEnter = () => {
        card.classList.remove("is-entering", "is-entered");
        card.removeEventListener("transitionend", clearEnter);
      };
      card.addEventListener("transitionend", clearEnter);
      window.setTimeout(clearEnter, 420);
    });

    /* Keep newest ticket in view when the stack grows */
    const focusId = animateId || (prevIds.size < state.betSlip.length ? state.betSlip[state.betSlip.length - 1]?.id : null);
    if (focusId) {
      const newest = list.querySelector(`[data-bet-id="${String(focusId).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"]`);
      if (newest && typeof newest.scrollIntoView === "function") {
        window.setTimeout(() => {
          newest.scrollIntoView({ block: "nearest", behavior: "smooth" });
        }, 40);
      }
    }

    updateTotals();
    syncOddButtons();
  }

  function updateTotals() {
    const total = productOdds(state.betSlip);
    const stakeInput = $("#stake-input");
    const totalOdds = $("#total-odds");
    const potentialReturn = $("#potential-return");
    const stake = Number(stakeInput?.value) || 0;
    if (totalOdds) totalOdds.textContent = formatOdd(total);
    if (potentialReturn) {
      const win = stake * total;
      potentialReturn.textContent = Number.isFinite(win) ? String(Math.round(win)) : "0";
    }
  }

  function toggleOdd(data) {
    const idx = state.betSlip.findIndex((b) => b.id === data.id);
    if (idx >= 0) {
      state.betSlip.splice(idx, 1);
      renderBetSlip();
    } else {
      // One selection per match: Draw (X), Double Chance 12, or any other market replaces the previous pick.
      const eventId = betEventId(data);
      state.betSlip = state.betSlip.filter((b) => betEventId(b) !== eventId);
      const next = hydrateTicketData({ ...data, eventId });
      state.betSlip.push(next);
      renderBetSlip({ animateId: next.id });
      if (isEsportsPage && !isMobileViewport()) {
        const right = $(".right-sidebar");
        const layout = document.querySelector(".sportsbook-layout");
        right?.classList.remove("collapsed");
        layout?.classList.remove("right-collapsed");
      }
    }
    openRightDrawer();
  }

  /* Esports page: map .es-odd / .es-odd-dark → data-odd ticket payloads (live esports/real slip). */
  function hydrateEsportsOdds() {
    if (!isEsportsPage) return;
    let seq = 204291;
    $$(".es-odd, .es-odd-dark").forEach((btn) => {
      if (btn.getAttribute("data-odd")) return;
      const marketSel = (btn.getAttribute("data-market") || "W1").trim();
      const odds = Number(btn.getAttribute("data-val"));
      if (!Number.isFinite(odds) || odds <= 0) return;

      const row = btn.closest(".es-row");
      const card = btn.closest(".es-pop-card");
      let home = "";
      let away = "";
      let scoreH = "0";
      let scoreA = "0";
      let league = "Esports";
      let sportIcon = "assets/icons/sport-esports.svg";
      let live = true;

      if (row) {
        const names = $$(".es-team-name", row);
        const scores = $$(".es-score", row);
        home = names[0]?.textContent.trim() || "";
        away = names[1]?.textContent.trim() || "";
        scoreH = scores[0]?.textContent.trim() || "0";
        scoreA = scores[1]?.textContent.trim() || "0";
        const leagueBlock = row.closest(".es-league");
        league = leagueBlock?.querySelector(".es-league-name")?.textContent.trim() || league;
        const iconSrc = leagueBlock?.querySelector(".es-league-icon img")?.getAttribute("src");
        if (iconSrc) sportIcon = iconSrc;
        live = !row.closest(".es-line-section");
      } else if (card) {
        const names = $$(".es-pop-team-name", card);
        const scores = $$(".es-pop-score", card);
        home = names[0]?.textContent.trim() || "";
        away = names[1]?.textContent.trim() || "";
        scoreH = scores[0]?.textContent.trim() || "0";
        scoreA = scores[1]?.textContent.trim() || "0";
        const leagueEl = card.querySelector(".es-pop-card-league");
        league = (leagueEl?.textContent || league).replace(/\s+/g, " ").trim();
        const iconSrc = leagueEl?.querySelector("img")?.getAttribute("src");
        if (iconSrc) sportIcon = iconSrc;
        const sectionLabel = (card.closest(".es-pop-section")?.getAttribute("aria-label") || "").toLowerCase();
        live = !sectionLabel.includes("pre-match");
      }

      const eventId = String(seq++);
      const selection = marketSel === "1" ? "W1" : marketSel === "2" ? "W2" : marketSel;
      const payload = {
        id: `${eventId}-1X2-${selection}`,
        eventId,
        league,
        match: `${home} - ${away}`,
        market: "1X2",
        selection,
        odds,
        live,
        score: live ? `[ ${scoreH} : ${scoreA} ]` : "",
        sportIcon,
      };
      btn.setAttribute("data-odd", JSON.stringify(payload));
    });
  }

  function parseOddAttr(el) {
    const raw = el.getAttribute("data-odd");
    if (!raw) return null;
    try {
      return JSON.parse(raw.replace(/&quot;/g, '"'));
    } catch (_) {
      return null;
    }
  }

  /* ---------- Promo slider ---------- */

  function setPromoSlide(index) {
    const slides = $$(".promo-slide");
    if (!slides.length) return;
    state.promoIndex = ((index % slides.length) + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle("active", i === state.promoIndex));
    $$(".promo-dot").forEach((d, i) => d.classList.toggle("active", i === state.promoIndex));
  }

  function initPromoSlider() {
    const slides = $$(".promo-slide");
    const dots = $("#promo-dots");
    if (!slides.length || !dots) return;

    dots.innerHTML = slides
      .map((_, i) => `<button type="button" class="promo-dot${i === 0 ? " active" : ""}" data-promo-dot="${i}" aria-label="Slide ${i + 1}"></button>`)
      .join("");

    $("#promo-prev").addEventListener("click", () => setPromoSlide(state.promoIndex - 1));
    $("#promo-next").addEventListener("click", () => setPromoSlide(state.promoIndex + 1));
    dots.addEventListener("click", (e) => {
      const dot = e.target.closest("[data-promo-dot]");
      if (dot) setPromoSlide(Number(dot.getAttribute("data-promo-dot")));
    });

    $$(".btn-promo").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        if (btn.tagName === "A" && btn.getAttribute("href") && btn.getAttribute("href") !== "#") return;
        e.preventDefault();
        showToast("Demo only — promotion not opened");
      });
    });

    setInterval(() => setPromoSlide(state.promoIndex + 1), 6000);
  }

  function initPlayersOnlineCounter() {
    const counters = $$("[data-online-counter]");
    if (!counters.length) return;

    const formatCount = (value) => {
      try {
        return new Intl.NumberFormat("en-US").format(value);
      } catch (_) {
        return String(value);
      }
    };

    counters.forEach((counter, index) => {
      const valueEl = counter.querySelector("[data-online-value]");
      if (!valueEl) return;

      const base = Number(counter.getAttribute("data-online-base")) || 5556;
      const swing = Number(counter.getAttribute("data-online-swing")) || 40;
      let current = base;

      const render = () => {
        const formatted = formatCount(current);
        valueEl.textContent = formatted;
        counter.setAttribute("aria-label", `${formatted} players online`);
      };

      render();

      window.setInterval(() => {
        const delta = Math.round((Math.random() - 0.5) * swing);
        current = Math.max(base - swing, Math.min(base + swing, current + delta));
        render();
      }, 4200 + index * 600);
    });
  }

  /* ---------- Interactions ---------- */

  function initHeaderDropdowns() {
    document.addEventListener("click", (e) => {
      const trigger = e.target.closest(".nav-item.has-dropdown > .nav-link");
      if (trigger) {
        const href = trigger.getAttribute("href");
        const isPageLink =
          trigger.tagName === "A" &&
          href &&
          !href.startsWith("#") &&
          href !== "";
        const onCaret = e.target.closest(".nav-dd-caret, .nav-chevron");
        /* Sports (and similar): click label → navigate; click chevron → toggle menu */
        if (isPageLink && !onCaret) {
          $$(".nav-item.open").forEach((n) => {
            n.classList.remove("open");
            const btn = n.querySelector(".nav-link");
            if (btn) btn.setAttribute("aria-expanded", "false");
          });
          return;
        }
        e.preventDefault();
        const item = trigger.closest(".nav-item");
        const open = item.classList.contains("open");
        $$(".nav-item.open").forEach((n) => {
          n.classList.remove("open");
          const btn = n.querySelector(".nav-link");
          if (btn) btn.setAttribute("aria-expanded", "false");
        });
        if (!open) {
          item.classList.add("open");
          trigger.setAttribute("aria-expanded", "true");
        }
        return;
      }
      if (!e.target.closest(".nav-item.has-dropdown")) {
        $$(".nav-item.open").forEach((n) => {
          n.classList.remove("open");
          const btn = n.querySelector(".nav-link");
          if (btn) btn.setAttribute("aria-expanded", "false");
        });
      }
    });
  }

  function sidebarMatchCardHtml(league, event) {
    const e = normalizeMatchEvent(event);
    const favOn = state.favorites.has(e.id);
    const status =
      e.status === "live"
        ? e.elapsedTime || e.clock || e.time || "Event in progress"
        : e.startTime || e.time || "";
    const scoreH = e.status === "live" && e.score.home != null ? e.score.home : "";
    const scoreA = e.status === "live" && e.score.away != null ? e.score.away : "";
    const homeLogo = e.homeLogo || "assets/images/mobile-home/teams/team-01.webp";
    const awayLogo = e.awayLogo || "assets/images/mobile-home/teams/team-02.webp";
    const stream =
      e.status === "live" && e.hasLiveStream
        ? `<img class="sb-match-card__stream" src="assets/icons/lnt/icon-stream.svg" alt="" width="14" height="13" title="Live stream" />`
        : "";
    const hasDraw = e.ox != null && e.ox !== 0;
    const odds = [
      { lab: "W1", val: e.o1, sel: "1" },
      hasDraw ? { lab: "X", val: e.ox, sel: "X" } : null,
      { lab: "W2", val: e.o2, sel: "2" },
    ].filter(Boolean);

    const oddsHtml = odds
      .map((o) => {
        const disabled = !o.val;
        const data = JSON.stringify({
          id: `${e.id}-${o.sel.toLowerCase()}`,
          league: league.name,
          match: `${e.home} vs ${e.away}`,
          market: "1X2",
          selection: o.sel,
          odds: o.val || 0,
        });
        return `<button type="button" class="sb-match-card__odd tg-odd" data-odd='${data}' ${
          disabled ? "disabled" : ""
        }>${o.lab} <span>${o.val ? formatOdd(o.val) : "—"}</span></button>`;
      })
      .join("");

    return `
      <article class="sb-match-card" data-event-id="${e.id}">
        <div class="sb-match-card__head">
          <span class="sb-match-card__league">${league.name}</span>
          <div class="sb-match-card__actions">
            ${stream}
            <button type="button" class="sb-match-card__fav${favOn ? " active" : ""}" data-fav="${e.id}" aria-label="Favourite" aria-pressed="${favOn ? "true" : "false"}" title="Favourite">★</button>
          </div>
        </div>
        <div class="sb-match-card__status">${status}</div>
        <div class="sb-match-card__teams">
          <div class="sb-match-card__team-col">
            <div class="sb-match-card__team"><img src="${homeLogo}" alt="" width="16" height="16" /><span>${e.home}</span></div>
            <div class="sb-match-card__team"><img src="${awayLogo}" alt="" width="16" height="16" /><span>${e.away}</span></div>
          </div>
          <div class="sb-match-card__score"><span>${scoreH}</span><span>${scoreA}</span></div>
        </div>
        <button type="button" class="sb-match-card__detail" data-event-info="${e.id}">Detailed score</button>
        <div class="sb-match-card__odds">${oddsHtml}</div>
      </article>`;
  }

  function collectSidebarEvents(mode) {
    const out = [];
    const recIds = mode === "recommended" ? new Set(getRecommendedEventIds()) : null;
    liveLeagues.forEach((league) => {
      (league.events || []).forEach((event) => {
        if (mode === "favorites") {
          if (!state.favorites.has(event.id)) return;
        } else if (mode === "recommended") {
          if (!recIds.has(event.id)) return;
        }
        out.push({ league, event });
      });
    });
    return out;
  }

  function renderSidebarInlinePanels() {
    ["favorites", "recommended"].forEach((mode) => {
      const body = document.querySelector(`[data-sb-panel-body="${mode}"]`);
      if (!body || body.hidden) return;
      const items = collectSidebarEvents(mode);
      if (!items.length) {
        body.innerHTML =
          mode === "favorites"
            ? `<p class="sb-inline-empty">No favorite matches</p>`
            : `<p class="sb-inline-empty">No recommended matches</p>`;
        return;
      }
      body.innerHTML = items.map(({ league, event }) => sidebarMatchCardHtml(league, event)).join("");
    });
  }

  function setSidebarPanelOpen(mode, open) {
    const wrap = document.querySelector(`.sidebar-row-wrap[data-sb-panel="${mode}"]`);
    const body = document.querySelector(`[data-sb-panel-body="${mode}"]`);
    const chevron = wrap && wrap.querySelector(`[data-sb-toggle="${mode}"]`);
    if (!wrap || !body) return;
    wrap.classList.toggle("is-expanded", open);
    body.hidden = !open;
    if (chevron) {
      chevron.setAttribute("aria-expanded", open ? "true" : "false");
      chevron.setAttribute(
        "aria-label",
        open
          ? mode === "favorites"
            ? "Collapse favorite matches"
            : "Collapse recommended"
          : mode === "favorites"
            ? "Expand favorite matches"
            : "Expand recommended"
      );
    }
    if (open) {
      /* Accordion: only one quick panel open */
      ["favorites", "recommended"].forEach((other) => {
        if (other === mode) return;
        setSidebarPanelOpen(other, false);
      });
      renderSidebarInlinePanels();
    }
  }

  function initSidebar() {
    let tgIndex = 0;
    renderTopGame(tgIndex);

    const prev = $("#tg-prev");
    const next = $("#tg-next");
    if (prev) {
      prev.addEventListener("click", () => {
        tgIndex = (tgIndex - 1 + topGamesSlides.length) % topGamesSlides.length;
        renderTopGame(tgIndex);
      });
    }
    if (next) {
      next.addEventListener("click", () => {
        tgIndex = (tgIndex + 1) % topGamesSlides.length;
        renderTopGame(tgIndex);
      });
    }

    const sportsPanel = $(".sidebar-sports-panel");
    if (sportsPanel) {
      sportsPanel.addEventListener("click", (e) => {
        const item = e.target.closest(".sport-item");
        if (!item) return;
        $$(".sport-item.active").forEach((el) => el.classList.remove("active"));
        item.classList.add("active");
      });
    }

    $$(".sidebar-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        $$(".sidebar-tab").forEach((t) => {
          t.classList.remove("active");
          t.setAttribute("aria-selected", "false");
        });
        tab.classList.add("active");
        tab.setAttribute("aria-selected", "true");
        state.lineType = tab.getAttribute("data-line");
        showToast(state.lineType === "live" ? "Showing LIVE line" : "Showing SPORTS line");
      });
    });

    const collapse = $("#sidebar-collapse");
    if (collapse) {
      collapse.addEventListener("click", () => {
        const sb = $(".left-sidebar");
        if (isMobileViewport()) {
          closeAllMobileDrawers();
          return;
        }
        const collapsed = sb.classList.toggle("collapsed");
        const layout = document.querySelector(".sportsbook-layout");
        if (layout) layout.classList.toggle("left-collapsed", collapsed);
        collapse.setAttribute("aria-expanded", collapsed ? "false" : "true");
        collapse.setAttribute("aria-label", collapsed ? "Expand block" : "Collapse block");
      });
    }

    const liveCountEl = $("#sidebar-live-count");
    const sfAll = document.querySelector(".sf-all span");
    if (liveCountEl && sfAll) {
      liveCountEl.textContent = sfAll.textContent.trim() || "700";
    }

    const quick = $(".sidebar-quick");
    if (quick) {
      quick.addEventListener("click", (e) => {
        const toggle = e.target.closest("[data-sb-toggle]");
        if (toggle) {
          e.preventDefault();
          const mode = toggle.getAttribute("data-sb-toggle");
          const wrap = toggle.closest(".sidebar-row-wrap");
          const willOpen = !wrap?.classList.contains("is-expanded");
          setSidebarPanelOpen(mode, willOpen);
          return;
        }

        const openBtn = e.target.closest("[data-sb-open]");
        if (openBtn) {
          e.preventDefault();
          const mode = openBtn.getAttribute("data-sb-open");
          if (mode === "favorites") {
            if (isHomePage) {
              setLiveView("favorites");
              showToast("Favorite matches");
            } else {
              window.location.href = "favourites.html";
            }
          } else if (mode === "recommended") {
            if (isHomePage) {
              setLiveView("recommended");
              showToast("Recommended");
            } else {
              const live = $("#live-events");
              if (live) live.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }
          return;
        }

        const oddBtn = e.target.closest(".sb-match-card__odd[data-odd], .tg-odd[data-odd]");
        if (oddBtn && !oddBtn.disabled) {
          e.preventDefault();
          e.stopPropagation();
          try {
            const data = JSON.parse(oddBtn.getAttribute("data-odd"));
            if (!data.odds) return;
            toggleOdd(data);
            renderSidebarInlinePanels();
          } catch (_) {}
        }
      });
    }

    const tgOdds = $(".tg-odds");
    if (tgOdds) {
      tgOdds.addEventListener("click", (e) => {
        const btn = e.target.closest(".tg-odd[data-odd]");
        if (!btn || btn.disabled) return;
        e.preventDefault();
        e.stopPropagation();
        try {
          const data = JSON.parse(btn.getAttribute("data-odd"));
          if (!data.odds) return;
          toggleOdd(data);
          $$(".tg-odd").forEach((b) => {
            try {
              const d = JSON.parse(b.getAttribute("data-odd"));
              b.classList.toggle("selected", state.betSlip.some((x) => x.id === d.id));
            } catch (_) {}
          });
        } catch (_) {}
      });
    }
  }

  /* Desktop compact rails — match live xxs collapse (no hover overlay) */
  (function initSidebarCollapsible() {
    /* Esports wires collapse in js/esports.js (keeps dark chrome + compact rail). */
    if (isEsportsPage) return;
    const layout = document.querySelector(".sportsbook-layout");
    const left = document.querySelector(".left-sidebar");
    const right = document.querySelector(".right-sidebar");
    /* Multi-LIVE has no left rail — still wire right collapse when present */
    if (!right || !layout) return;
    if (!left) {
      $("#right-collapse")?.addEventListener("click", () => {
        if (isMobileViewport()) {
          closeAllMobileDrawers();
          return;
        }
        const collapsed = !right.classList.contains("collapsed");
        right.classList.toggle("collapsed", collapsed);
        layout.classList.toggle("right-collapsed", collapsed);
        const btn = $("#right-collapse");
        if (btn) {
          btn.setAttribute("aria-expanded", collapsed ? "false" : "true");
          btn.setAttribute("aria-label", collapsed ? "Expand block" : "Collapse block");
        }
      });
      return;
    }

    function setRightCollapsed(collapsed) {
      right.classList.toggle("collapsed", collapsed);
      layout.classList.toggle("right-collapsed", collapsed);
      const btn = $("#right-collapse");
      if (btn) {
        btn.setAttribute("aria-expanded", collapsed ? "false" : "true");
        btn.setAttribute("aria-label", collapsed ? "Expand block" : "Collapse block");
      }
    }

    function setLeftCollapsed(collapsed) {
      left.classList.toggle("collapsed", collapsed);
      layout.classList.toggle("left-collapsed", collapsed);
      const btn = $("#sidebar-collapse");
      if (btn) {
        btn.setAttribute("aria-expanded", collapsed ? "false" : "true");
        btn.setAttribute("aria-label", collapsed ? "Expand block" : "Collapse block");
      }
    }

    // Sync initial state from markup (default open)
    layout.classList.toggle("left-collapsed", left.classList.contains("collapsed"));
    layout.classList.toggle("right-collapsed", right.classList.contains("collapsed"));

    $("#right-collapse")?.addEventListener("click", () => {
      if (isMobileViewport()) {
        closeAllMobileDrawers();
        return;
      }
      setRightCollapsed(!right.classList.contains("collapsed"));
    });

    $("#right-expand")?.addEventListener("click", () => {
      if (isMobileViewport()) return;
      setRightCollapsed(false);
    });

    $("#rc-reg")?.addEventListener("click", (e) => {
      if (isMobileViewport()) return;
      e.preventDefault();
      setRightCollapsed(false);
      $("#reg-form")?.scrollIntoView({ block: "nearest" });
    });

    $("#rc-bet")?.addEventListener("click", () => {
      if (isMobileViewport()) return;
      setRightCollapsed(false);
    });

    $("#rc-generator")?.addEventListener("click", () => {
      if (isMobileViewport()) return;
      setRightCollapsed(false);
      document.querySelector(".generator-panel")?.scrollIntoView({ block: "nearest" });
    });

    $("#rc-save")?.addEventListener("click", () => {
      if (isMobileViewport()) return;
      setRightCollapsed(false);
      document.querySelector(".bet-save-link")?.focus();
    });

    $("#rc-app")?.addEventListener("click", () => {
      if (isMobileViewport()) return;
      setRightCollapsed(false);
      $("#app-panel")?.removeAttribute("hidden");
      $("#app-panel")?.scrollIntoView({ block: "nearest" });
    });

    // Keep compact bet count in sync
    const syncRailCount = () => {
      const el = $("#rc-bet-count");
      if (el) el.textContent = String(state.betSlip?.length || 0);
    };
    syncRailCount();
  })();

  function initToolbar() {
    document.addEventListener("click", (e) => {
      const tab = e.target.closest(".section-tab");
      if (!tab) return;
      const group = tab.closest(".section-tabs");
      if (!group) return;
      $$(".section-tab", group).forEach((t) => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");

      const view = tab.getAttribute("data-tab");
      const isLiveTabs = group.getAttribute("aria-label") === "Live views";
      if (isLiveTabs && view) {
        const mapped =
          view === "recommended"
            ? "recommended"
            : view === "upcoming"
              ? "upcoming"
              : view === "p1" || view === "p2"
                ? view
                : "matches";
        setLiveView(mapped, { scroll: false });
        return;
      }

      showToast(`View: ${tab.textContent.trim()}`);
    });

    const eventSearch = $("#event-search");
    if (eventSearch) {
      const goSearchPage = () => {
        if (window.matchMedia("(max-width: 900px)").matches) {
          const q = eventSearch.value.trim();
          window.location.href = q
            ? `search.html?q=${encodeURIComponent(q)}`
            : "search.html";
          return true;
        }
        return false;
      };
      eventSearch.addEventListener("focus", () => {
        goSearchPage();
      });
      eventSearch.addEventListener("input", (e) => {
        if (goSearchPage()) return;
        state.liveSearch = e.target.value.trim();
        renderTables();
      });
      eventSearch.closest(".te-search")?.querySelector(".te-search-btn")?.addEventListener("click", (e) => {
        e.preventDefault();
        if (goSearchPage()) return;
      });
    }

    const lineSearch = $("#line-search");
    if (lineSearch) {
      const goLineSearchPage = () => {
        if (window.matchMedia("(max-width: 900px)").matches) {
          const q = lineSearch.value.trim();
          window.location.href = q
            ? `search.html?q=${encodeURIComponent(q)}`
            : "search.html";
          return true;
        }
        return false;
      };
      lineSearch.addEventListener("focus", () => {
        goLineSearchPage();
      });
      lineSearch.addEventListener("input", (e) => {
        if (goLineSearchPage()) return;
        state.lineSearch = e.target.value.trim();
        renderTables();
      });
    }

    const collapseAll = $("#collapse-all-leagues");
    if (collapseAll) {
      collapseAll.addEventListener("click", () => {
        const allIds = [...liveLeagues, ...lineLeagues].map((l) => l.id);
        const allCollapsed = allIds.every((id) => state.collapsedLeagues.has(id));
        if (allCollapsed) state.collapsedLeagues.clear();
        else allIds.forEach((id) => state.collapsedLeagues.add(id));
        renderTables();
      });
    }

    const liveStreamToggle = $("#live-stream-toggle");
    const liveFilterList = $("#live-filter-list");
    const homePopularSports = $(".home-popular-sports");
    if (homePopularSports) {
      homePopularSports.addEventListener("click", (e) => {
        const card = e.target.closest(".home-sport-card[data-home-sport]");
        if (!card) return;
        window.selectHomeSportFilter(card.getAttribute("data-home-sport"));
      });
    }

    if (liveFilterList) {
      liveFilterList.addEventListener("click", (e) => {
        const chip = e.target.closest(".filter-chip");
        if (!chip) return;
        selectLiveSportFilter(chip.getAttribute("data-filter"));
      });
    }

    if (liveStreamToggle) {
      liveStreamToggle.addEventListener("change", () => {
        state.streamOnly = !!liveStreamToggle.checked;
        if (liveStreamToggle.checked) {
          if (state.activeLiveFilter === "stream") {
            /* keep */
          }
        }
        renderLiveFilterBar();
        renderTables();
        showToast(liveStreamToggle.checked ? "Showing events with live streams" : "All live events");
      });
    }

    window.applyNtStreamFilter = (on) => {
      state.streamOnly = !!on;
      if (liveStreamToggle) liveStreamToggle.checked = !!on;
      renderTables();
    };

    const moreBtn = $("#te-more-btn");
    const moreMenu = $("#te-more-menu");
    const moreSearch = $("#te-more-search");
    if (moreBtn && moreMenu) {
      moreBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const open = moreBtn.getAttribute("aria-expanded") !== "true";
        setMoreMenuOpen(open);
      });
      moreMenu.addEventListener("click", (e) => {
        e.stopPropagation();
        const item = e.target.closest(".te-more-item");
        if (!item) return;
        selectLiveSportFilter(item.getAttribute("data-filter"));
        setMoreMenuOpen(false);
      });
    }
    if (moreSearch) {
      moreSearch.addEventListener("input", () => renderMoreMenu(moreSearch.value));
      moreSearch.addEventListener("keydown", (e) => {
        if (e.key === "Escape") setMoreMenuOpen(false);
      });
    }

    const esportsBtn = $("#te-esports-btn");
    const esportsMenu = $("#te-esports-menu");
    const esportsSearch = $("#te-esports-search");
    if (esportsBtn && esportsMenu) {
      esportsBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const open = esportsBtn.getAttribute("aria-expanded") !== "true";
        setEsportsMenuOpen(open);
      });
      esportsMenu.addEventListener("click", (e) => {
        e.stopPropagation();
        const league = e.target.closest("[data-esports-league]");
        if (league) {
          const name = league.querySelector("span")?.textContent || "Esports";
          setEsportsMenuOpen(false);
          showToast(name);
          return;
        }
        const item = e.target.closest(".te-esports-item");
        if (!item) return;
        const id = item.getAttribute("data-esports-id");
        renderEsportsFlyout(id, item);
      });
      esportsMenu.addEventListener("mouseover", (e) => {
        if (window.matchMedia("(max-width: 900px)").matches) return;
        const item = e.target.closest(".te-esports-item");
        if (!item || !esportsMenu.contains(item)) return;
        const id = item.getAttribute("data-esports-id");
        if (id && id !== esportsFlyoutId) renderEsportsFlyout(id, item);
      });
    }
    if (esportsSearch) {
      esportsSearch.addEventListener("input", () => renderEsportsMenu(esportsSearch.value));
      esportsSearch.addEventListener("keydown", (e) => {
        if (e.key === "Escape") setEsportsMenuOpen(false);
      });
    }

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".te-more-wrap")) setMoreMenuOpen(false);
      if (!e.target.closest(".te-esports-wrap")) setEsportsMenuOpen(false);
    });
    window.addEventListener("resize", () => {
      layoutLiveFilterOverflow();
    });

    const lineFilters = $("#line-filters");
    if (lineFilters) {
      lineFilters.addEventListener("click", (e) => {
        const chip = e.target.closest(".filter-chip");
        if (!chip) return;
        const id = chip.getAttribute("data-filter");
        state.activeLineFilter = state.activeLineFilter === id ? null : id;
        renderFilters("#line-filters", "activeLineFilter");
        renderTables();
      });
    }

    /* National Team Live | Sports mode bar uses <a> page links — no in-place filter */
  }

  function stashEventPending(payload) {
    try {
      sessionStorage.setItem("ds-event-pending", JSON.stringify(payload));
    } catch (_) {
      /* ignore */
    }
  }

  function openEventPage(eventId) {
    if (!eventId || document.body?.dataset?.page === "event") return;
    const ctx = findEventContext(eventId);
    const ev = ctx?.event;
    const league = ctx?.league;
    const sport = league?.sport || ev?.sport || "football";
    const payload = { id: eventId };
    if (ev?.home) payload.home = ev.home;
    if (ev?.away) payload.away = ev.away;
    if (league?.name) payload.league = league.name;
    if (sport) {
      payload.sport = sport;
      payload.sportIcon =
        (typeof sportHeaderIconMap !== "undefined" && sportHeaderIconMap[sport]) ||
        `assets/icons/sport-${sport}.svg`;
    }
    if (ev?.homeLogo) payload.homeLogo = ev.homeLogo;
    if (ev?.awayLogo) payload.awayLogo = ev.awayLogo;
    if (ev?.live != null) payload.live = Boolean(ev.live);
    if (ev?.scoreH != null) payload.scoreH = ev.scoreH;
    if (ev?.scoreA != null) payload.scoreA = ev.scoreA;
    if (ev?.clock || ev?.time) payload.clock = ev.clock || ev.time;
    if (ev?.venue) payload.venue = ev.venue;
    payload.tabs = ["Main", "1st Quarter", "2nd Quarter", "3rd Quarter", "4th Quarter"];
    stashEventPending(payload);
    window.location.href = `event.html?id=${encodeURIComponent(eventId)}`;
  }

  function initTablesDelegation() {
    document.addEventListener("click", (e) => {
      const eventInfoBtn = e.target.closest("[data-event-info], .event-card-more");
      if (eventInfoBtn) {
        e.preventDefault();
        e.stopPropagation();
        const row = eventInfoBtn.closest("[data-event-id]");
        const id =
          eventInfoBtn.getAttribute("data-event-info") ||
          (row && row.getAttribute("data-event-id"));
        if (id) openEventInfo(id);
        return;
      }

      const oddBtn = e.target.closest("[data-odd]");
      if (oddBtn) {
        e.preventDefault();
        const data = parseOddAttr(oddBtn);
        if (data) toggleOdd(data);
        return;
      }

      const pinBtn = e.target.closest("[data-pin]");
      if (pinBtn) {
        e.preventDefault();
        const id = pinBtn.getAttribute("data-pin");
        if (id) togglePinnedMatch(id);
        return;
      }

      const fav = e.target.closest("[data-fav]");
      if (fav) {
        const id = fav.getAttribute("data-fav");
        if (!id) return;
        const adding = !state.favorites.has(id);
        if (adding) state.favorites.add(id);
        else state.favorites.delete(id);
        persistFavouriteToggle(id, adding);
        document.querySelectorAll(`[data-fav="${id}"]`).forEach((btn) => {
          btn.classList.toggle("active", adding);
          btn.setAttribute("aria-pressed", adding ? "true" : "false");
        });
        syncEventInfoFavUi();
        if (state.liveView === "favorites") renderTables();
        renderSidebarInlinePanels();
        return;
      }

      const toggle = e.target.closest("[data-toggle-league]");
      if (toggle) {
        const id = toggle.getAttribute("data-toggle-league");
        if (state.collapsedLeagues.has(id)) state.collapsedLeagues.delete(id);
        else state.collapsedLeagues.add(id);
        renderTables();
        return;
      }

      const expandBtn = e.target.closest("[data-expand-event]");
      if (expandBtn) {
        e.preventDefault();
        e.stopPropagation();
        const id = expandBtn.getAttribute("data-expand-event");
        if (!id) return;
        if (state.expandedEvents.has(id)) state.expandedEvents.delete(id);
        else state.expandedEvents.add(id);
        renderTables();
        return;
      }

      if (e.target.closest("button, input, label, [data-odd], .stats-cell, .event-meta-actions, .event-expand-btn")) return;

      const moreLink = e.target.closest(".more-link");
      if (moreLink) {
        e.preventDefault();
        const moreRow = moreLink.closest(".event-row[data-event-id], .event-row[data-parent-event]");
        const moreId =
          (moreRow && moreRow.getAttribute("data-event-id")) ||
          (moreRow && moreRow.getAttribute("data-parent-event"));
        if (moreId) openEventPage(moreId);
        return;
      }

      if (e.target.closest("a")) return;
      const row = e.target.closest(".event-row[data-event-id]");
      if (row && !row.classList.contains("event-row--sub")) {
        const id = row.getAttribute("data-event-id");
        if (id) openEventPage(id);
      }
    });
  }

  const EI_ICO = "mobile/assets/icons/";
  let eventInfoCurrentId = "";

  function findEventContext(eventId) {
    const pools = [];
    if (typeof liveLeagues !== "undefined") pools.push(...liveLeagues);
    if (typeof lineLeagues !== "undefined") pools.push(...lineLeagues);
    for (const league of pools) {
      const event = (league.events || []).find((ev) => ev.id === eventId);
      if (event) return { event, league };
    }
    const current = window.__dsCurrentEvent;
    if (current && (current.id === eventId || !eventId)) {
      return { event: current, league: { name: current.league || "Event" } };
    }
    try {
      const raw = sessionStorage.getItem("ds-event-pending");
      const pending = raw ? JSON.parse(raw) : null;
      if (pending && (!eventId || pending.id === eventId)) {
        return { event: pending, league: { name: pending.league || "Event" } };
      }
    } catch (_) {
      /* ignore */
    }
    return null;
  }

  const EI_NOTIF_KEYS = ["score", "corners", "yellow"];
  const EI_NOTIF_DEFAULT = {
    instantOn: true,
    matchOn: true,
    instant: { score: true, corners: false, yellow: false },
    match: { score: false, corners: false, yellow: false },
  };

  function loadEventNotifPrefs(eventId) {
    try {
      const raw = localStorage.getItem("ds-event-notif:" + eventId);
      if (!raw) return structuredClone(EI_NOTIF_DEFAULT);
      return { ...structuredClone(EI_NOTIF_DEFAULT), ...JSON.parse(raw) };
    } catch (_) {
      return structuredClone(EI_NOTIF_DEFAULT);
    }
  }

  function saveEventNotifPrefs(eventId, prefs) {
    try {
      localStorage.setItem("ds-event-notif:" + eventId, JSON.stringify(prefs));
    } catch (_) {
      /* ignore */
    }
  }

  function buildTeamInfoDemo(event) {
    const home = event?.home || "Lazio";
    const away = event?.away || "Avellino 1912";
    const homeLogo = event?.homeLogo || "assets/images/mobile-home/teams/team-01.webp";
    const awayLogo = event?.awayLogo || "assets/images/mobile-home/teams/team-02.webp";
    const logos = [
      homeLogo,
      awayLogo,
      "assets/images/mobile-home/teams/team-03.webp",
      "assets/images/mobile-home/teams/team-04.webp",
      "assets/images/mobile-home/teams/team-05.webp",
      "assets/images/mobile-home/teams/team-06.webp",
    ];
    const homeGames = [
      {
        date: "27/07/2026",
        home,
        away: "A.S.D. Flaminia Civita Castellana",
        homeScore: 6,
        awayScore: 0,
        homeLogo,
        awayLogo: logos[2],
      },
      {
        date: "25/07/2026",
        home,
        away: "Pisa",
        homeScore: 2,
        awayScore: 1,
        homeLogo,
        awayLogo: logos[3],
      },
      {
        date: "23/07/2026",
        home: "Roma",
        away: home,
        homeScore: 2,
        awayScore: 0,
        homeLogo: logos[4],
        awayLogo: homeLogo,
      },
      {
        date: "04/07/2026",
        home,
        away: "Internazionale Milano",
        homeScore: 0,
        awayScore: 2,
        homeLogo,
        awayLogo: logos[5],
      },
      {
        date: "27/06/2026",
        home,
        away: "Internazionale Milano",
        homeScore: 0,
        awayScore: 3,
        homeLogo,
        awayLogo: logos[5],
      },
    ];
    const awayGames = [
      {
        date: "28/07/2026",
        home: away,
        away: "Benevento",
        homeScore: 1,
        awayScore: 1,
        homeLogo: awayLogo,
        awayLogo: logos[2],
      },
      {
        date: "20/07/2026",
        home: "Cosenza",
        away,
        homeScore: 0,
        awayScore: 2,
        homeLogo: logos[3],
        awayLogo: awayLogo,
      },
      {
        date: "12/07/2026",
        home: away,
        away: "Salernitana",
        homeScore: 3,
        awayScore: 1,
        homeLogo: awayLogo,
        awayLogo: logos[4],
      },
    ];
    const meetings = [
      {
        date: "15/07/2025",
        home,
        away,
        homeScore: 2,
        awayScore: 1,
        homeLogo,
        awayLogo,
      },
      {
        date: "03/01/2024",
        home: away,
        away: home,
        homeScore: 0,
        awayScore: 0,
        homeLogo: awayLogo,
        awayLogo: homeLogo,
      },
    ];
    return {
      home,
      away,
      homeLogo,
      awayLogo,
      homeGames,
      awayGames,
      meetings,
      injured: [
        { team: home, name: "Demo Player A", reason: "Injury" },
        { team: away, name: "Demo Player B", reason: "Suspended" },
      ],
    };
  }

  function notifCheckRow(group, key, label, checked) {
    return `<label class="ds-ei-notif__row${checked ? " is-checked" : ""}">
      <input type="checkbox" data-ds-ei-notif-opt="${group}:${key}" ${checked ? "checked" : ""} />
      <span class="ds-ei-notif__box" aria-hidden="true"></span>
      <span>${label}</span>
    </label>`;
  }

  function matchCardHtml(m) {
    return `<article class="ds-ei-team__match">
      <p class="ds-ei-team__date">${escapeHtml(m.date)}</p>
      <div class="ds-ei-team__line">
        <img src="${escapeHtml(m.homeLogo)}" alt="" width="18" height="18" />
        <span class="ds-ei-team__name">${escapeHtml(m.home)}</span>
        <span class="ds-ei-team__score">${escapeHtml(m.homeScore)}</span>
      </div>
      <div class="ds-ei-team__line">
        <img src="${escapeHtml(m.awayLogo)}" alt="" width="18" height="18" />
        <span class="ds-ei-team__name">${escapeHtml(m.away)}</span>
        <span class="ds-ei-team__score">${escapeHtml(m.awayScore)}</span>
      </div>
      <button type="button" class="ds-ei-team__more" data-ds-ei-toast="Find out more">
        Find out more
        <img src="assets/icons/te-chevron-down.svg" alt="" width="10" height="10" />
      </button>
    </article>`;
  }

  function teamAccordionHtml(name, logo, games, open) {
    return `<section class="ds-ei-team__acc${open ? " is-open" : ""}">
      <button type="button" class="ds-ei-team__acc-head" data-ds-ei-acc aria-expanded="${open ? "true" : "false"}">
        <img src="${escapeHtml(logo)}" alt="" width="22" height="22" />
        <span>${escapeHtml(name)}</span>
        <img class="ds-ei-team__chev" src="assets/icons/te-chevron-down.svg" alt="" width="12" height="12" />
      </button>
      <div class="ds-ei-team__acc-body"${open ? "" : " hidden"}>
        ${(games || []).map(matchCardHtml).join("")}
      </div>
    </section>`;
  }

  function ensureEventInfoPanel() {
    let sheet = document.getElementById("ds-event-info");
    if (sheet) return sheet;

    document.body.insertAdjacentHTML(
      "beforeend",
      `<div class="ds-event-info" id="ds-event-info" hidden>
        <div class="ds-event-info__panel" role="dialog" aria-modal="true" aria-labelledby="ds-ei-title">
          <div class="ds-event-info__view is-active" data-ds-ei-view="menu">
            <div class="ds-event-info__subbar">
              <button type="button" class="ds-event-info__back" data-ds-ei-close aria-label="Back">
                <img src="${EI_ICO}sp-back.svg" alt="" width="10" height="16" />
              </button>
              <h2 class="ds-event-info__title" id="ds-ei-title">Event info</h2>
            </div>
            <div class="ds-event-info__scroll">
              <section class="ds-event-info__card" aria-label="Event actions">
                <div class="ds-event-info__menu" role="menu">
                  <button type="button" class="ds-event-info__item" role="menuitem" data-ds-ei-open="notif">
                    <img src="${EI_ICO}ei-bell.svg" alt="" width="20" height="20" />
                    <span>Notifications</span>
                  </button>
                  <button type="button" class="ds-event-info__item ds-event-info__item--fav" role="menuitem" data-ds-ei-fav>
                    <img src="${EI_ICO}ei-star.svg" alt="" width="20" height="20" />
                    <span data-ds-ei-fav-label>Add to favorites</span>
                  </button>
                  <button type="button" class="ds-event-info__item" role="menuitem" data-ds-ei-toast="Live Stream">
                    <img src="assets/icons/lnt/icon-stream.svg" alt="" width="20" height="20" />
                    <span>Live Stream</span>
                  </button>
                  <button type="button" class="ds-event-info__item" role="menuitem" data-ds-ei-toast="1xZone">
                    <img src="${EI_ICO}ei-zone.svg" alt="" width="20" height="20" />
                    <span>1xZone</span>
                  </button>
                  <button type="button" class="ds-event-info__item" role="menuitem" data-ds-ei-toast="Statistics">
                    <img src="${EI_ICO}ei-stats.svg" alt="" width="20" height="20" />
                    <span>Statistics</span>
                  </button>
                  <button type="button" class="ds-event-info__item" role="menuitem" data-ds-ei-open="team">
                    <img src="${EI_ICO}ei-info.svg" alt="" width="20" height="20" />
                    <span>Team information</span>
                  </button>
                </div>
              </section>
              <section class="ds-event-info__card ds-event-info__weather" aria-label="Weather conditions">
                <div class="ds-event-info__weather-item">
                  <img src="${EI_ICO}ei-cloud.svg" alt="" width="20" height="20" />
                  <span data-ds-ei-temp>+24°C</span>
                </div>
                <div class="ds-event-info__weather-item">
                  <img src="${EI_ICO}ei-wind.svg" alt="" width="20" height="20" />
                  <span data-ds-ei-wind>4.4</span>
                </div>
                <div class="ds-event-info__weather-item">
                  <img src="${EI_ICO}ei-pressure.svg" alt="" width="20" height="20" />
                  <span data-ds-ei-pressure>757</span>
                </div>
                <div class="ds-event-info__weather-item">
                  <img src="${EI_ICO}ei-drop.svg" alt="" width="20" height="20" />
                  <span data-ds-ei-humidity>52</span>
                </div>
              </section>
            </div>
          </div>

          <div class="ds-event-info__view" data-ds-ei-view="notif" hidden>
            <div class="ds-event-info__subbar">
              <button type="button" class="ds-event-info__back" data-ds-ei-back aria-label="Back">
                <img src="${EI_ICO}sp-back.svg" alt="" width="10" height="16" />
              </button>
              <h2 class="ds-event-info__title">Notification settings</h2>
            </div>
            <div class="ds-event-info__scroll ds-ei-notif__scroll">
              <section class="ds-event-info__card ds-ei-notif__card">
                <div class="ds-ei-notif__head">
                  <span>Instant notifications</span>
                  <label class="ds-ei-switch ds-ei-switch--green">
                    <input type="checkbox" data-ds-ei-notif-toggle="instant" checked />
                    <span class="ds-ei-switch__track" aria-hidden="true"></span>
                  </label>
                </div>
                <div class="ds-ei-notif__list" data-ds-ei-notif-list="instant"></div>
              </section>
              <section class="ds-event-info__card ds-ei-notif__card">
                <div class="ds-ei-notif__head">
                  <span>Match details</span>
                  <label class="ds-ei-switch ds-ei-switch--blue">
                    <input type="checkbox" data-ds-ei-notif-toggle="match" checked />
                    <span class="ds-ei-switch__track" aria-hidden="true"></span>
                  </label>
                </div>
                <div class="ds-ei-notif__list" data-ds-ei-notif-list="match"></div>
              </section>
            </div>
            <div class="ds-ei-notif__footer">
              <button type="button" class="ds-ei-notif__delete" data-ds-ei-notif-delete aria-label="Delete settings">
                <img src="assets/images/account/icon-trash.svg" alt="" width="16" height="16" />
              </button>
              <button type="button" class="ds-ei-notif__apply" data-ds-ei-notif-apply>Apply</button>
            </div>
          </div>

          <div class="ds-event-info__view" data-ds-ei-view="team" hidden>
            <div class="ds-event-info__subbar">
              <button type="button" class="ds-event-info__back" data-ds-ei-back aria-label="Back">
                <img src="${EI_ICO}sp-back.svg" alt="" width="10" height="16" />
              </button>
              <h2 class="ds-event-info__title">Team information</h2>
            </div>
            <div class="ds-ei-team__tabs" role="tablist" aria-label="Team information">
              <button type="button" class="ds-ei-team__tab is-active" role="tab" aria-selected="true" data-ds-ei-team-tab="recent">Recent Games</button>
              <button type="button" class="ds-ei-team__tab" role="tab" aria-selected="false" data-ds-ei-team-tab="meetings">Previous meetings</button>
              <button type="button" class="ds-ei-team__tab" role="tab" aria-selected="false" data-ds-ei-team-tab="players">Players not in the lineup</button>
            </div>
            <div class="ds-event-info__scroll ds-ei-team__scroll" data-ds-ei-team-body></div>
          </div>
        </div>
      </div>`
    );

    sheet = document.getElementById("ds-event-info");
    sheet.addEventListener("click", (e) => {
      if (e.target === sheet) {
        closeEventInfo();
        return;
      }
      if (e.target.closest("[data-ds-ei-close]")) {
        closeEventInfo();
        return;
      }
      if (e.target.closest("[data-ds-ei-back]")) {
        showEventInfoView("menu");
        return;
      }
      const openBtn = e.target.closest("[data-ds-ei-open]");
      if (openBtn) {
        showEventInfoView(openBtn.getAttribute("data-ds-ei-open"));
        return;
      }
      const toastBtn = e.target.closest("[data-ds-ei-toast]");
      if (toastBtn) {
        showToast(toastBtn.getAttribute("data-ds-ei-toast") || "Coming soon");
        return;
      }
      if (e.target.closest("[data-ds-ei-fav]")) {
        if (!eventInfoCurrentId) return;
        const adding = !state.favorites.has(eventInfoCurrentId);
        if (adding) state.favorites.add(eventInfoCurrentId);
        else state.favorites.delete(eventInfoCurrentId);
        persistFavouriteToggle(eventInfoCurrentId, adding);
        document.querySelectorAll(`[data-fav="${eventInfoCurrentId}"]`).forEach((btn) => {
          btn.classList.toggle("active", adding);
          btn.setAttribute("aria-pressed", adding ? "true" : "false");
        });
        syncEventInfoFavUi();
        showToast(adding ? "Added to favorites" : "Removed from favorites");
        return;
      }
      const accBtn = e.target.closest("[data-ds-ei-acc]");
      if (accBtn) {
        const acc = accBtn.closest(".ds-ei-team__acc");
        if (!acc) return;
        const open = !acc.classList.contains("is-open");
        acc.classList.toggle("is-open", open);
        accBtn.setAttribute("aria-expanded", open ? "true" : "false");
        const body = acc.querySelector(".ds-ei-team__acc-body");
        if (body) body.hidden = !open;
        return;
      }
      const teamTab = e.target.closest("[data-ds-ei-team-tab]");
      if (teamTab) {
        const key = teamTab.getAttribute("data-ds-ei-team-tab");
        sheet.querySelectorAll("[data-ds-ei-team-tab]").forEach((t) => {
          const on = t === teamTab;
          t.classList.toggle("is-active", on);
          t.setAttribute("aria-selected", on ? "true" : "false");
        });
        renderTeamInfoBody(key);
        return;
      }
      if (e.target.closest("[data-ds-ei-notif-delete]")) {
        fillNotifSettings(structuredClone(EI_NOTIF_DEFAULT));
        showToast("Notification settings cleared");
        return;
      }
      if (e.target.closest("[data-ds-ei-notif-apply]")) {
        const prefs = readNotifSettingsFromUi();
        if (eventInfoCurrentId) saveEventNotifPrefs(eventInfoCurrentId, prefs);
        showToast("Notification settings applied");
        showEventInfoView("menu");
      }
    });

    sheet.addEventListener("change", (e) => {
      const toggle = e.target.closest("[data-ds-ei-notif-toggle]");
      if (toggle) {
        const group = toggle.getAttribute("data-ds-ei-notif-toggle");
        const list = sheet.querySelector(`[data-ds-ei-notif-list="${group}"]`);
        if (list) list.classList.toggle("is-disabled", !toggle.checked);
        return;
      }
      const opt = e.target.closest("[data-ds-ei-notif-opt]");
      if (opt) {
        const row = opt.closest(".ds-ei-notif__row");
        if (row) row.classList.toggle("is-checked", opt.checked);
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape" || !isEventInfoOpen()) return;
      const active = sheet.querySelector(".ds-event-info__view.is-active");
      const view = active?.getAttribute("data-ds-ei-view");
      if (view && view !== "menu") showEventInfoView("menu");
      else closeEventInfo();
      e.stopPropagation();
    });

    return sheet;
  }

  function fillNotifSettings(prefs) {
    const sheet = document.getElementById("ds-event-info");
    if (!sheet) return;
    const instantToggle = sheet.querySelector('[data-ds-ei-notif-toggle="instant"]');
    const matchToggle = sheet.querySelector('[data-ds-ei-notif-toggle="match"]');
    if (instantToggle) instantToggle.checked = !!prefs.instantOn;
    if (matchToggle) matchToggle.checked = !!prefs.matchOn;

    const labels = { score: "Score", corners: "Corners", yellow: "Yellow cards" };
    ["instant", "match"].forEach((group) => {
      const list = sheet.querySelector(`[data-ds-ei-notif-list="${group}"]`);
      if (!list) return;
      const on = group === "instant" ? prefs.instantOn : prefs.matchOn;
      const map = prefs[group] || {};
      list.innerHTML = EI_NOTIF_KEYS.map((key) =>
        notifCheckRow(group, key, labels[key], !!map[key])
      ).join("");
      list.classList.toggle("is-disabled", !on);
    });
  }

  function readNotifSettingsFromUi() {
    const sheet = document.getElementById("ds-event-info");
    const prefs = structuredClone(EI_NOTIF_DEFAULT);
    if (!sheet) return prefs;
    prefs.instantOn = !!sheet.querySelector('[data-ds-ei-notif-toggle="instant"]')?.checked;
    prefs.matchOn = !!sheet.querySelector('[data-ds-ei-notif-toggle="match"]')?.checked;
    EI_NOTIF_KEYS.forEach((key) => {
      prefs.instant[key] = !!sheet.querySelector(
        `[data-ds-ei-notif-opt="instant:${key}"]`
      )?.checked;
      prefs.match[key] = !!sheet.querySelector(`[data-ds-ei-notif-opt="match:${key}"]`)?.checked;
    });
    return prefs;
  }

  function renderTeamInfoBody(tab) {
    const sheet = document.getElementById("ds-event-info");
    const body = sheet?.querySelector("[data-ds-ei-team-body]");
    if (!body) return;
    const ctx = findEventContext(eventInfoCurrentId);
    const demo = buildTeamInfoDemo(ctx?.event);
    const key = tab || "recent";
    if (key === "meetings") {
      body.innerHTML = `<section class="ds-ei-team__acc is-open">
        <div class="ds-ei-team__acc-body">
          ${demo.meetings.map(matchCardHtml).join("")}
        </div>
      </section>`;
      return;
    }
    if (key === "players") {
      body.innerHTML = `<section class="ds-event-info__card ds-ei-team__players">
        ${demo.injured
          .map(
            (p) => `<div class="ds-ei-team__player">
            <strong>${escapeHtml(p.name)}</strong>
            <span>${escapeHtml(p.team)} · ${escapeHtml(p.reason)}</span>
          </div>`
          )
          .join("")}
      </section>`;
      return;
    }
    body.innerHTML =
      teamAccordionHtml(demo.home, demo.homeLogo, demo.homeGames, true) +
      teamAccordionHtml(demo.away, demo.awayLogo, demo.awayGames, false);
  }

  function showEventInfoView(name) {
    const sheet = ensureEventInfoPanel();
    if (!sheet) return;
    const view = name || "menu";
    sheet.querySelectorAll("[data-ds-ei-view]").forEach((el) => {
      const on = el.getAttribute("data-ds-ei-view") === view;
      el.classList.toggle("is-active", on);
      el.hidden = !on;
    });
    if (view === "notif") {
      fillNotifSettings(loadEventNotifPrefs(eventInfoCurrentId || "default"));
    }
    if (view === "team") {
      sheet.querySelectorAll("[data-ds-ei-team-tab]").forEach((t, i) => {
        const on = i === 0;
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-selected", on ? "true" : "false");
      });
      renderTeamInfoBody("recent");
    }
  }

  function syncEventInfoFavUi() {
    const sheet = document.getElementById("ds-event-info");
    if (!sheet || !eventInfoCurrentId) return;
    const on = state.favorites.has(eventInfoCurrentId);
    const btn = sheet.querySelector("[data-ds-ei-fav]");
    const label = sheet.querySelector("[data-ds-ei-fav-label]");
    if (btn) btn.classList.toggle("is-fav", on);
    if (label) label.textContent = on ? "Remove from favorites" : "Add to favorites";
  }

  function isEventInfoOpen() {
    const sheet = document.getElementById("ds-event-info");
    return !!(sheet && !sheet.hidden);
  }

  function openEventInfo(eventId) {
    const sheet = ensureEventInfoPanel();
    if (!sheet) return;
    const ctx = findEventContext(eventId);
    eventInfoCurrentId = eventId;
    const note = sheet.querySelector("[data-ds-ei-note]");
    const leagueName = ctx?.league?.name || "Event";
    const event = ctx?.event;
    if (note) {
      const stage =
        event?.note ||
        [leagueName, event?.round || (event?.live ? "Live" : null)].filter(Boolean).join(". ");
      note.textContent = stage || "Event details";
    }

    const weather = event?.weather || {};
    const map = {
      "[data-ds-ei-temp]": weather.temp || "+33°C",
      "[data-ds-ei-wind]": weather.wind || "2",
      "[data-ds-ei-pressure]": weather.pressure || "759",
      "[data-ds-ei-humidity]": weather.humidity || "37",
    };
    Object.entries(map).forEach(([sel, val]) => {
      const el = sheet.querySelector(sel);
      if (el) el.textContent = val;
    });

    syncEventInfoFavUi();
    showEventInfoView("menu");
    sheet.hidden = false;
    document.body.classList.add("ds-event-info-open");
    requestAnimationFrame(() => sheet.classList.add("is-open"));
  }

  function closeEventInfo() {
    const sheet = document.getElementById("ds-event-info");
    if (!sheet) return;
    sheet.classList.remove("is-open");
    sheet.hidden = true;
    document.body.classList.remove("ds-event-info-open");
    eventInfoCurrentId = "";
    showEventInfoView("menu");
  }

  function initBetSlip() {
    initMyBetsPanel();
    state.slipSettings = loadSlipSettings();
    state.baselineOdds = loadBaselineOdds();
    state.stakePrefs = loadStakePrefs();
    state.oddsChangeMode = loadOddsChangeMode();
    state.promoCode = loadPromoCode();
    ensureBetSlipSettingsModal();
    ensureBaselineOddsModal();
    ensureStakeSettingsModal();
    applyBetSlipSettings();
    applyStakePrefs();

    $$(".bet-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        $$(".bet-tab").forEach((t) => {
          t.classList.remove("active");
          t.setAttribute("aria-selected", "false");
        });
        tab.classList.add("active");
        tab.setAttribute("aria-selected", "true");
        const which = tab.getAttribute("data-bet-tab");
        $("#bet-slip-body").hidden = which !== "slip";
        $("#my-bets-body").hidden = which !== "mybets";
        if (which !== "mybets" && state.myBetsViewAll) {
          state.myBetsViewAll = false;
          syncMyBetsViewAllChrome();
        }
        if (which !== "slip") {
          closeBetSlipSettings();
          closeBetSlipShare();
          closeTicketPopovers();
          closeBetTypeMenu();
          closeOddsChangeMenu();
        }
      });
    });

    $("#bet-slip-body")?.addEventListener("input", (e) => {
      if (e.target && e.target.id === "promo-code-input") {
        savePromoCode(e.target.value);
      }
    });
    $("#bet-slip-body")?.addEventListener("change", (e) => {
      if (e.target && e.target.id === "promo-code-input") {
        savePromoCode(e.target.value);
      }
    });

    $("#bet-list").addEventListener("click", (e) => {
      const rm = e.target.closest("[data-remove]");
      if (!rm) return;
      const id = rm.getAttribute("data-remove");
      const card = rm.closest(".bet-item");
      if (card) {
        card.classList.add("is-removing");
        setTimeout(() => {
          state.betSlip = state.betSlip.filter((b) => b.id !== id);
          renderBetSlip();
        }, 180);
      } else {
        state.betSlip = state.betSlip.filter((b) => b.id !== id);
        renderBetSlip();
      }
    });

    $("#bet-slip-body")?.addEventListener("click", (e) => {
      const betTypeOpt = e.target.closest("[data-bet-type]");
      if (betTypeOpt) {
        setBetTypeMode(betTypeOpt.getAttribute("data-bet-type"));
        return;
      }

      const oddsChangeOpt = e.target.closest("[data-odds-change]");
      if (oddsChangeOpt) {
        setOddsChangeMode(oddsChangeOpt.getAttribute("data-odds-change"));
        return;
      }

      const betTypeSelect = e.target.closest("#bet-type-select");
      if (betTypeSelect) {
        if (betTypeSelect.classList.contains("is-disabled") || betTypeSelect.getAttribute("aria-disabled") === "true") {
          return;
        }
        const menu = $("#bet-type-menu");
        if (menu && !menu.hidden) closeBetTypeMenu();
        else openBetTypeMenu();
        return;
      }

      const oddsChangeSelect = e.target.closest("#odds-change-select");
      if (oddsChangeSelect) {
        const menu = $("#odds-change-menu");
        if (menu && !menu.hidden) closeOddsChangeMenu();
        else openOddsChangeMenu();
        return;
      }

      if (!e.target.closest(".bet-type-wrap")) closeBetTypeMenu();
      if (!e.target.closest(".odds-change-wrap")) closeOddsChangeMenu();

      const ticketPopover = e.target.closest("[data-ticket-popover]");
      if (ticketPopover) {
        openTicketPopover(ticketPopover.getAttribute("data-ticket-popover"));
        return;
      }

      if (isBetSlipShareTrigger(e.target)) {
        openBetSlipShare();
        return;
      }

      if (isBetSlipSettingsTrigger(e.target)) {
        openBetSlipSettings();
        return;
      }

      const step = e.target.closest("[data-stake-step]");
      const quick = e.target.closest("[data-quick-stake]");
      const clear = e.target.closest("#clear-bets");
      const place = e.target.closest("#place-bet");
      const stakeInput = $("#stake-input");

      if (e.target.closest(".max-stake-link") && stakeInput) {
        const bal = window.DsWallet ? Math.max(0, Math.floor(Number(window.DsWallet.get()) || 0)) : 0;
        stakeInput.value = String(bal > 0 ? bal : 1);
        updateTotals();
        syncBetSlipAuthUi();
        return;
      }

      if (step && stakeInput) {
        const next = Math.max(1, (Number(stakeInput.value) || 0) + Number(step.getAttribute("data-stake-step")));
        stakeInput.value = String(next);
        updateTotals();
        syncBetSlipAuthUi();
        return;
      }

      if (quick && stakeInput) {
        stakeInput.value = String((Number(stakeInput.value) || 0) + Number(quick.getAttribute("data-quick-stake")));
        updateTotals();
        syncBetSlipAuthUi();
        return;
      }

      if (clear) {
        state.betSlip = [];
        renderBetSlip();
        showToast("Bet slip cleared");
        return;
      }

      if (place) {
        const cta = place.dataset.cta || "place";
        if (cta === "register") {
          const reg = $("#reg-form");
          if (reg) {
            reg.scrollIntoView({ behavior: "smooth", block: "nearest" });
            $("#reg-promo")?.focus?.();
          }
          showToast("Register to place bets");
          return;
        }
        if (cta === "deposit") {
          window.location.href = "deposit.html";
          return;
        }
        if (state.betSlip.some((b) => b.status === "closed")) {
          showToast("Remove closed markets before placing");
          return;
        }
        if (!state.betSlip.length) {
          showToast("Add events to the bet slip");
          return;
        }
        const stake = Number(stakeInput?.value) || 0;
        if (!Number.isFinite(stake) || stake <= 0) {
          showToast("Enter a valid stake");
          return;
        }
        const wallet = window.DsWallet;
        if (!wallet) {
          showToast("Login required to place bets");
          return;
        }
        const result = wallet.debit(stake);
        if (!result.ok) {
          showToast(
            result.reason === "insufficient"
              ? "Insufficient balance — please deposit"
              : "Could not place bet"
          );
          syncBetSlipAuthUi();
          return;
        }
        const slipSnapshot = state.betSlip.slice();
        const openBet = buildOpenBetFromSlip(slipSnapshot, stake);
        MOCK_RUNNING_BETS.unshift(openBet);
        persistOpenBets();
        showToast(`Bet placed — ${wallet.format(stake)} MYR`);
        state.betSlip = [];
        renderBetSlip();
        wallet.sync();
        showMyBetsOpenPanel();
        return;
      }

      if (e.target.closest('[data-ticket-meta="balance"]')) {
        window.location.href = "deposit.html";
        return;
      }
      if (e.target.closest('[data-ticket-meta="advancebet"]')) {
        showToast("Advancebet refreshed (demo)");
      }
    });

    $("#bet-slip-body")?.addEventListener("input", (e) => {
      if (e.target.closest("#stake-input")) {
        updateTotals();
        syncBetSlipAuthUi();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (window.DsBetSlipGenerator?.isOpen?.()) {
        window.DsBetSlipGenerator.close();
        return;
      }
      if (state.myBetsViewAll) {
        setMyBetsViewAll(false);
        return;
      }
      const shareOverlay = $("#bsh-overlay");
      if (shareOverlay && !shareOverlay.hidden) {
        closeBetSlipShare();
        return;
      }
      const overlay = $("#bss-overlay");
      if (overlay && !overlay.hidden) closeBetSlipSettings();
    });

    window.addEventListener("ds:bsg-create", (e) => {
      const detail = e.detail || {};
      const picks = Array.isArray(detail.picks) ? detail.picks : [];
      if (!picks.length) return;
      const stake = Number(detail.opts?.stake);
      if (Number.isFinite(stake) && stake > 0) {
        const stakeInput = $("#stake-input");
        if (stakeInput) stakeInput.value = String(stake);
      }
      picks.forEach((p) => {
        if (!state.betSlip.some((b) => b.id === p.id)) {
          state.betSlip.push(typeof hydrateTicketData === "function" ? hydrateTicketData(p) : p);
        }
      });
      detail.handled = true;
      renderBetSlip();
      openRightDrawer();
    });

    $$("[data-acc-add]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const n = btn.getAttribute("data-acc-add");
        accumulators[n].forEach((a) => {
          const item = {
            id: a.id,
            league: a.league,
            match: a.match,
            market: a.market,
            selection: a.selection,
            odds: a.odds,
          };
          if (!state.betSlip.some((b) => b.id === item.id)) state.betSlip.push(item);
        });
        renderBetSlip();
        showToast("Accumulator added to bet slip");
      });
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function getMyBetsData(tab) {
    return tab === "history" ? MOCK_SETTLED_BETS : MOCK_RUNNING_BETS;
  }

  function formatMyBetsStake(stake) {
    const n = parseFloat(stake);
    if (!Number.isFinite(n)) return stake;
    return Number.isInteger(n) ? String(n) : n.toFixed(2);
  }

  function formatMoneyMyr(amount) {
    const n = parseFloat(amount);
    if (!Number.isFinite(n)) return "MYR " + amount;
    return "MYR " + n.toFixed(2);
  }

  function parseDateKey(key) {
    const parts = String(key).split("-").map(Number);
    if (parts.length !== 3) return null;
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  function startOfDay(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  function ensureMockBetHistory() {
    if (!MOCK_BET_HISTORY.length) MOCK_BET_HISTORY = buildMockBetHistory();
  }

  function getBetHistoryRangeBounds() {
    const today = startOfDay(new Date());
    const range = state.betHistoryRange;
    if (range === "today") {
      return { from: today, to: today };
    }
    if (range === "yesterday") {
      const y = new Date(today);
      y.setDate(y.getDate() - 1);
      return { from: y, to: y };
    }
    if (range === "7d") {
      const from = new Date(today);
      from.setDate(from.getDate() - 6);
      return { from, to: today };
    }
    if (range === "30d") {
      const from = new Date(today);
      from.setDate(from.getDate() - 29);
      return { from, to: today };
    }
    if (range === "90d") {
      const from = new Date(today);
      from.setDate(from.getDate() - 89);
      return { from, to: today };
    }
    if (range === "custom") {
      const from = state.betHistoryCustomFrom
        ? parseDateKey(state.betHistoryCustomFrom)
        : null;
      const to = state.betHistoryCustomTo
        ? parseDateKey(state.betHistoryCustomTo)
        : null;
      return {
        from: from ? startOfDay(from) : null,
        to: to ? startOfDay(to) : null,
      };
    }
    return { from: null, to: null };
  }

  function getFilteredBetHistory() {
    ensureMockBetHistory();
    const cat = state.betHistoryCategory;
    const status = state.betHistoryStatus;
    const { from, to } = getBetHistoryRangeBounds();
    return MOCK_BET_HISTORY.filter((bet) => {
      if (cat !== "all" && bet.category !== cat) return false;
      if (status !== "all") {
        const betStatus = String(bet.status || "").toLowerCase();
        const matchOpen = status === "open" && (betStatus === "open" || betStatus === "running");
        if (!matchOpen && betStatus !== status) return false;
      }
      const d = parseDateKey(bet.dateKey);
      if (!d) return true;
      if (from && d < from) return false;
      if (to && d > to) return false;
      return true;
    });
  }

  function renderMyBetsOpenCard(bet) {
    const oddsLine =
      escapeHtml(bet.odds) +
      (bet.oddsTag ? ` <span class="mybets-card-odds-tag">(${escapeHtml(bet.oddsTag)})</span>` : "");
    const cashOutBtn = bet.cashOut
      ? `<button type="button" class="mybets-cashout">Cash Out</button>`
      : `<button type="button" class="mybets-cashout is-disabled" disabled>Cash Out not available</button>`;
    const eventName = bet.eventName || bet.event || "";
    const eventDate = bet.eventDate ? `<span class="mybets-card-event-date">${escapeHtml(bet.eventDate)}</span>` : "";

    return (
      `<article class="mybets-card">` +
        `<header class="mybets-card-head">${escapeHtml(bet.sport)} - ${escapeHtml(bet.market)}</header>` +
        `<div class="mybets-card-main">` +
          `<div class="mybets-card-pick">` +
            `<span class="mybets-selection-accent" aria-hidden="true"></span>` +
            `<div class="mybets-card-pick-body">` +
              `<div class="mybets-card-score">${escapeHtml(bet.pick)}</div>` +
              `<div class="mybets-card-odds-line">${oddsLine}</div>` +
              eventDate +
            `</div>` +
          `</div>` +
          `<div class="mybets-card-stake">` +
            `<span class="mybets-card-stake-currency">RM</span>` +
            `<span class="mybets-card-stake-value">${escapeHtml(formatMyBetsStake(bet.stake))}</span>` +
          `</div>` +
        `</div>` +
        `<div class="mybets-card-event">` +
          `<div class="mybets-card-match">${escapeHtml(bet.match)}</div>` +
          `<div class="mybets-card-league">${escapeHtml(eventName)}</div>` +
        `</div>` +
        `<div class="mybets-card-meta">` +
          `<div class="mybets-card-meta-left">` +
            `<span class="mybets-card-id">ID: ${escapeHtml(bet.id)}</span>` +
            `<span class="mybets-card-time">${escapeHtml(bet.placedDate)} ${escapeHtml(bet.placedTime)} GMT-4</span>` +
          `</div>` +
          `<span class="mybets-status mybets-status--${bet.status.toLowerCase()}">${escapeHtml(bet.status)}</span>` +
        `</div>` +
        `<div class="mybets-card-payout">` +
          `<span class="mybets-card-payout-label">Max payout</span>` +
          `<strong class="mybets-card-payout-value">RM ${escapeHtml(bet.maxPayout)}</strong>` +
        `</div>` +
        cashOutBtn +
      `</article>`
    );
  }

  function renderMyBetsHistoryEmpty() {
    return (
      `<div class="mybets-empty mybets-empty--history">` +
        `<div class="mybets-empty-icon" aria-hidden="true">` +
          `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">` +
            `<rect x="10" y="8" width="28" height="34" rx="3" stroke="currentColor" stroke-width="2"/>` +
            `<path d="M16 16h16M16 22h16M16 28h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>` +
            `<circle cx="34" cy="34" r="9" fill="var(--surface-primary)" stroke="currentColor" stroke-width="2"/>` +
            `<path d="M34 30v5l3 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>` +
          `</svg>` +
        `</div>` +
        `<p class="bet-empty-text">There are no settled bet slips for the last session.</p>` +
        `<button type="button" class="mybets-view-history" id="mybets-view-history">View Bet History</button>` +
      `</div>`
    );
  }

  function renderMyBetsContent() {
    const container = $("#mybets-content");
    if (!container) return;

    const tab = state.myBetsTab;
    const bets = getMyBetsData(tab);

    if (!bets.length) {
      if (tab === "history") {
        container.innerHTML = renderMyBetsHistoryEmpty();
      } else {
        container.innerHTML =
          `<div class="mybets-empty"><p class="bet-empty-text">No open bets. Place a bet to see it here.</p></div>`;
      }
      return;
    }

    const showAll = tab === "open" && state.myBetsViewAll;
    const visible =
      tab === "open" && !showAll ? bets.slice(0, MYBETS_OPEN_PREVIEW) : bets;

    container.innerHTML =
      `<div class="mybets-cards">${visible.map((bet) => renderMyBetsOpenCard(bet)).join("")}</div>`;
  }

  function updateMyBetsBadges() {
    const openCount = MOCK_RUNNING_BETS.length;
    const historyCount = MOCK_SETTLED_BETS.length;
    const openBadge = $("#mybets-open-count");
    const historyBadge = $("#mybets-history-count");
    if (openBadge) openBadge.textContent = String(openCount);
    if (historyBadge) historyBadge.textContent = String(historyCount);
  }

  function syncMyBetsViewAllChrome() {
    const app = $("#mybets-app");
    if (!app) return;
    const expanded = !!state.myBetsViewAll && state.myBetsTab === "open";
    app.classList.toggle("is-view-all", expanded);

    const subtabs = app.querySelector(".mybets-subtabs");
    const controls = $("#mybets-open-controls");
    const viewAllBtn = $("#mybets-view-all");
    const hasMore = MOCK_RUNNING_BETS.length > MYBETS_OPEN_PREVIEW;

    if (subtabs) subtabs.hidden = false;
    if (controls) controls.hidden = state.myBetsTab !== "open";
    /* View All only when Open has hidden cards; hide once expanded */
    if (viewAllBtn) {
      viewAllBtn.hidden =
        state.myBetsTab !== "open" || !hasMore || expanded;
    }
    updateMyBetsBadges();
  }

  function setMyBetsViewAll(on) {
    state.myBetsViewAll = !!on;
    if (state.myBetsViewAll) state.myBetsTab = "open";
    const legacy = $("#mba-overlay");
    if (legacy) {
      legacy.remove();
      document.body.classList.remove("mba-open");
    }
    syncMyBetsViewAllChrome();
    renderMyBetsContent();
    if (state.myBetsViewAll) {
      $("#mybets-content")?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }

  function setMyBetsTab(tab) {
    state.myBetsTab = tab;
    if (tab !== "open") state.myBetsViewAll = false;
    $$(".mybets-subtab").forEach((btn) => {
      const isActive = btn.getAttribute("data-mybets-tab") === tab;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-selected", isActive ? "true" : "false");
    });
    syncMyBetsViewAllChrome();
    renderMyBetsContent();
    updateMyBetsBadges();
  }

  function showMyBetsOpenPanel() {
    $$(".bet-tab").forEach((t) => {
      const isMyBets = t.getAttribute("data-bet-tab") === "mybets";
      t.classList.toggle("active", isMyBets);
      t.setAttribute("aria-selected", isMyBets ? "true" : "false");
    });
    const slipBody = $("#bet-slip-body");
    const myBetsBody = $("#my-bets-body");
    if (slipBody) slipBody.hidden = true;
    if (myBetsBody) myBetsBody.hidden = false;
    closeBetSlipSettings();
    closeBetSlipShare();
    closeTicketPopovers();
    closeBetTypeMenu();
    closeOddsChangeMenu();
    state.myBetsViewAll = false;
    syncMyBetsAuthUi();
    setMyBetsTab("open");
  }

  function buildOpenBetFromSlip(items, stake) {
    const active = (items || []).filter((b) => b && b.status !== "closed");
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const placedDate = `${pad(now.getMonth() + 1)}/${pad(now.getDate())}/${now.getFullYear()}`;
    const placedTime = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    const id = String(480000000 + Math.floor(Math.random() * 19999999));
    const oddsVal = productOdds(active);
    const maxPayout = (Number(stake) * oddsVal).toFixed(2);
    const oddsStr = formatOdd(oddsVal);

    if (active.length === 1) {
      const b = active[0];
      return {
        id,
        placedDate,
        placedTime,
        sport: "Sports",
        market: b.market || "1X2",
        pick: formatTicketMarket(b) || b.selection,
        match: String(b.match || "").replace(" - ", " -vs- "),
        eventName: b.league || "",
        eventDate: "",
        maxPayout,
        odds: oddsStr,
        oddsTag: "",
        stake: formatMyBetsStake(stake),
        status: "Running",
        cashOut: true,
      };
    }

    return {
      id,
      placedDate,
      placedTime,
      sport: "Sports",
      market: active.length > 1 ? "Accumulator" : "Single",
      pick: active.map((b) => b.selection || formatTicketMarket(b)).join(" · "),
      match: active.map((b) => String(b.match || "").replace(" - ", " -vs- ")).join(" | "),
      eventName: active.length ? `${active.length} events` : "",
      eventDate: "",
      maxPayout,
      odds: oddsStr,
      oddsTag: "",
      stake: formatMyBetsStake(stake),
      status: "Running",
      cashOut: true,
    };
  }

  function renderBetHistoryCard(bet) {
    const won = bet.status === "Won";
    const winningsClass = won ? " bh-desk-winnings--won" : "";
    return (
      `<article class="bh-desk-card">` +
        `<div class="bh-desk-card-top">` +
          `<div class="bh-desk-card-league">` +
            `<span class="bh-desk-sport-icon"><img src="${escapeHtml(bet.icon)}" alt="" width="16" height="16" /></span>` +
            `<span class="bh-desk-league-name">${escapeHtml(bet.league)}</span>` +
          `</div>` +
          `<span class="mybets-status mybets-status--${bet.status.toLowerCase()}">${escapeHtml(bet.status)}</span>` +
        `</div>` +
        `<div class="bh-desk-card-match">${escapeHtml(bet.match)}</div>` +
        `<div class="bh-desk-card-grid">` +
          `<div class="bh-desk-field">` +
            `<span class="bh-desk-label">Type</span>` +
            `<span class="bh-desk-value">${escapeHtml(bet.betType)}</span>` +
          `</div>` +
          `<div class="bh-desk-field">` +
            `<span class="bh-desk-label">Odds</span>` +
            `<span class="bh-desk-value">${escapeHtml(bet.odds)}</span>` +
          `</div>` +
          `<div class="bh-desk-field">` +
            `<span class="bh-desk-label">Stake</span>` +
            `<span class="bh-desk-value">${escapeHtml(formatMoneyMyr(bet.stake))}</span>` +
          `</div>` +
          `<div class="bh-desk-field">` +
            `<span class="bh-desk-label">Winnings</span>` +
            `<span class="bh-desk-value${winningsClass}">${escapeHtml(formatMoneyMyr(bet.winnings))}</span>` +
          `</div>` +
          `<div class="bh-desk-field bh-desk-field--meta">` +
            `<span class="bh-desk-label">Bet ID</span>` +
            `<span class="bh-desk-value">${escapeHtml(bet.id)}</span>` +
          `</div>` +
          `<div class="bh-desk-field bh-desk-field--meta">` +
            `<span class="bh-desk-label">Placed</span>` +
            `<span class="bh-desk-value">${escapeHtml(bet.placedAt)}</span>` +
          `</div>` +
        `</div>` +
      `</article>`
    );
  }

  function renderBetHistoryResults() {
    const root = $("#bh-desktop-results");
    if (!root) return;

    const bets = getFilteredBetHistory();
    if (!bets.length) {
      root.innerHTML =
        `<div class="bh-desk-empty" role="status">` +
          `<p class="bet-empty-text">No bets found for the selected filters.</p>` +
        `</div>`;
      return;
    }

    const groups = [];
    const map = new Map();
    bets.forEach((bet) => {
      if (!map.has(bet.dateKey)) {
        const group = { key: bet.dateKey, label: bet.dateLabel, items: [] };
        map.set(bet.dateKey, group);
        groups.push(group);
      }
      map.get(bet.dateKey).items.push(bet);
    });

    root.innerHTML = groups
      .map(
        (g) =>
          `<section class="bh-desk-group">` +
            `<h3 class="bh-desk-group-title">${escapeHtml(g.label)}</h3>` +
            `<div class="bh-desk-group-list">${g.items.map(renderBetHistoryCard).join("")}</div>` +
          `</section>`
      )
      .join("");
  }

  function syncBetHistoryControls() {
    const panel = $("#bh-desktop-panel");
    if (!panel) return;

    $$("[data-bh-cat]", panel).forEach((btn) => {
      const on = btn.getAttribute("data-bh-cat") === state.betHistoryCategory;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-selected", on ? "true" : "false");
    });

    const rangeLabel = $("#bh-desktop-range-label");
    if (rangeLabel) {
      rangeLabel.textContent = BH_RANGE_LABELS[state.betHistoryRange] || "Last 7 Days";
    }

    $$("[data-bh-range]", panel).forEach((btn) => {
      const on = btn.getAttribute("data-bh-range") === state.betHistoryRange;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-checked", on ? "true" : "false");
    });

    const statusLabel = $("#bh-desktop-status-label");
    if (statusLabel) {
      statusLabel.textContent = BH_STATUS_LABELS[state.betHistoryStatus] || "All";
    }

    $$("[data-bh-status]", panel).forEach((btn) => {
      const on = btn.getAttribute("data-bh-status") === state.betHistoryStatus;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-checked", on ? "true" : "false");
    });

    const custom = $("#bh-desktop-custom");
    if (custom) custom.hidden = state.betHistoryRange !== "custom";

    const fromInput = $("#bh-desktop-from");
    const toInput = $("#bh-desktop-to");
    if (fromInput) fromInput.value = state.betHistoryCustomFrom || "";
    if (toInput) toInput.value = state.betHistoryCustomTo || "";
  }

  function setBetHistoryRangeMenu(open) {
    const menu = $("#bh-desktop-range-menu");
    const btn = $("#bh-desktop-range-btn");
    if (!menu || !btn) return;
    menu.hidden = !open;
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) setBetHistoryStatusMenu(false);
  }

  function setBetHistoryStatusMenu(open) {
    const menu = $("#bh-desktop-status-menu");
    const btn = $("#bh-desktop-status-btn");
    if (!menu || !btn) return;
    menu.hidden = !open;
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) setBetHistoryRangeMenu(false);
  }

  /**
   * @param {{ category?: 'all'|'sports'|'esports'|'casino' }} [opts]
   */
  function openBetHistoryPanel(opts) {
    ensureBetHistoryPanel();
    const backdrop = $("#bh-desktop-backdrop");
    if (!backdrop) return;
    const cat = opts && opts.category;
    if (cat === "all" || cat === "sports" || cat === "esports" || cat === "casino") {
      state.betHistoryCategory = cat;
    }
    backdrop.hidden = false;
    document.body.classList.add("bh-desktop-open");
    syncBetHistoryControls();
    renderBetHistoryResults();
    const closeBtn = $("#bh-desktop-close");
    if (closeBtn) closeBtn.focus();
  }

  function closeBetHistoryPanel() {
    const backdrop = $("#bh-desktop-backdrop");
    if (!backdrop) return;
    backdrop.hidden = true;
    document.body.classList.remove("bh-desktop-open");
    setBetHistoryRangeMenu(false);
    setBetHistoryStatusMenu(false);
  }

  function ensureBetHistoryPanel() {
    if ($("#bh-desktop-backdrop")) return;

    const el = document.createElement("div");
    el.className = "bh-desktop-backdrop";
    el.id = "bh-desktop-backdrop";
    el.hidden = true;
    el.innerHTML =
      `<div class="bh-desktop-panel" id="bh-desktop-panel" role="dialog" aria-modal="true" aria-labelledby="bh-desktop-title">` +
        `<header class="bh-desktop-head">` +
          `<h2 class="bh-desktop-title" id="bh-desktop-title">Bet History</h2>` +
          `<button type="button" class="bh-desktop-close" id="bh-desktop-close" aria-label="Close bet history">` +
            `<span aria-hidden="true">×</span>` +
          `</button>` +
        `</header>` +
        `<div class="bh-desktop-toolbar">` +
          `<div class="bh-desktop-cats" role="tablist" aria-label="Bet category">` +
            `<button type="button" class="bh-desktop-cat is-active" role="tab" aria-selected="true" data-bh-cat="all">All</button>` +
            `<button type="button" class="bh-desktop-cat" role="tab" aria-selected="false" data-bh-cat="sports">Sports</button>` +
            `<button type="button" class="bh-desktop-cat" role="tab" aria-selected="false" data-bh-cat="esports">Esports</button>` +
            `<button type="button" class="bh-desktop-cat" role="tab" aria-selected="false" data-bh-cat="casino">Casino</button>` +
          `</div>` +
          `<div class="bh-desktop-filter-row">` +
            `<div class="bh-desktop-range" id="bh-desktop-range">` +
              `<button type="button" class="bh-desktop-range-btn" id="bh-desktop-range-btn" aria-haspopup="listbox" aria-expanded="false" aria-controls="bh-desktop-range-menu">` +
                `<span id="bh-desktop-range-label">Last 7 Days</span>` +
                `<img src="assets/icons/account-subnav/calendar-check.svg" alt="" width="14" height="14" />` +
              `</button>` +
              `<div class="bh-desktop-range-menu" id="bh-desktop-range-menu" role="listbox" hidden>` +
                Object.keys(BH_RANGE_LABELS)
                  .map(
                    (key) =>
                      `<button type="button" class="bh-desktop-range-option${key === "7d" ? " is-active" : ""}" role="option" data-bh-range="${key}" aria-checked="${key === "7d" ? "true" : "false"}">` +
                        `<span>${BH_RANGE_LABELS[key]}</span>` +
                        `<span class="bh-desktop-range-check" aria-hidden="true">✓</span>` +
                      `</button>`
                  )
                  .join("") +
              `</div>` +
            `</div>` +
            `<div class="bh-desktop-status" id="bh-desktop-status">` +
              `<button type="button" class="bh-desktop-status-btn" id="bh-desktop-status-btn" aria-haspopup="listbox" aria-expanded="false" aria-controls="bh-desktop-status-menu" aria-label="Filter by status">` +
                `<span id="bh-desktop-status-label">All</span>` +
                `<span class="bh-desktop-status-chevron" aria-hidden="true">▾</span>` +
              `</button>` +
              `<div class="bh-desktop-status-menu" id="bh-desktop-status-menu" role="listbox" hidden>` +
                Object.keys(BH_STATUS_LABELS)
                  .map(
                    (key) =>
                      `<button type="button" class="bh-desktop-status-option${key === "all" ? " is-active" : ""}" role="option" data-bh-status="${key}" aria-checked="${key === "all" ? "true" : "false"}">` +
                        `<span>${BH_STATUS_LABELS[key]}</span>` +
                        `<span class="bh-desktop-status-check" aria-hidden="true">✓</span>` +
                      `</button>`
                  )
                  .join("") +
              `</div>` +
            `</div>` +
          `</div>` +
        `</div>` +
        `<div class="bh-desktop-custom" id="bh-desktop-custom" hidden>` +
          `<label class="bh-desktop-custom-field">` +
            `<span>From</span>` +
            `<input type="date" id="bh-desktop-from" class="bh-desktop-date-input" />` +
          `</label>` +
          `<label class="bh-desktop-custom-field">` +
            `<span>To</span>` +
            `<input type="date" id="bh-desktop-to" class="bh-desktop-date-input" />` +
          `</label>` +
          `<button type="button" class="bh-desktop-apply" id="bh-desktop-apply">Apply</button>` +
        `</div>` +
        `<div class="bh-desktop-results" id="bh-desktop-results" aria-live="polite"></div>` +
        `<p class="bh-desktop-note">All transactions are time stamped at GMT-4.</p>` +
      `</div>`;

    document.body.appendChild(el);

    el.addEventListener("click", (e) => {
      if (e.target === el || e.target.closest("#bh-desktop-close")) {
        closeBetHistoryPanel();
        return;
      }

      const cat = e.target.closest("[data-bh-cat]");
      if (cat) {
        state.betHistoryCategory = cat.getAttribute("data-bh-cat");
        syncBetHistoryControls();
        renderBetHistoryResults();
        return;
      }

      if (e.target.closest("#bh-desktop-range-btn")) {
        const menu = $("#bh-desktop-range-menu");
        setBetHistoryRangeMenu(menu?.hidden !== false);
        return;
      }

      if (e.target.closest("#bh-desktop-status-btn")) {
        const menu = $("#bh-desktop-status-menu");
        setBetHistoryStatusMenu(menu?.hidden !== false);
        return;
      }

      const rangeOpt = e.target.closest("[data-bh-range]");
      if (rangeOpt) {
        state.betHistoryRange = rangeOpt.getAttribute("data-bh-range");
        setBetHistoryRangeMenu(false);
        syncBetHistoryControls();
        if (state.betHistoryRange !== "custom") {
          renderBetHistoryResults();
        }
        return;
      }

      const statusOpt = e.target.closest("[data-bh-status]");
      if (statusOpt) {
        state.betHistoryStatus = statusOpt.getAttribute("data-bh-status") || "all";
        setBetHistoryStatusMenu(false);
        syncBetHistoryControls();
        renderBetHistoryResults();
        return;
      }

      if (e.target.closest("#bh-desktop-apply")) {
        const fromInput = $("#bh-desktop-from");
        const toInput = $("#bh-desktop-to");
        state.betHistoryCustomFrom = fromInput?.value || "";
        state.betHistoryCustomTo = toInput?.value || "";
        renderBetHistoryResults();
        return;
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !el.hidden) closeBetHistoryPanel();
    });

    document.addEventListener("click", (e) => {
      const range = $("#bh-desktop-range");
      const rangeMenu = $("#bh-desktop-range-menu");
      if (rangeMenu && !rangeMenu.hidden && range && !range.contains(e.target)) {
        setBetHistoryRangeMenu(false);
      }

      const status = $("#bh-desktop-status");
      const statusMenu = $("#bh-desktop-status-menu");
      if (statusMenu && !statusMenu.hidden && status && !status.contains(e.target)) {
        setBetHistoryStatusMenu(false);
      }
    });
  }

  function resetMyBetsTipShift(btn) {
    const tip = btn && btn.querySelector(".mybets-tip");
    if (!tip) return;
    tip.style.removeProperty("--tip-shift");
    tip.style.removeProperty("--tip-arrow-shift");
  }

  /** Keep tip fully inside the bet-slip panel / viewport (esp. mobile left clip). */
  function clampMyBetsTip(btn) {
    const tip = btn && btn.querySelector(".mybets-tip");
    if (!tip) return;
    resetMyBetsTipShift(btn);
    requestAnimationFrame(() => {
      const tipRect = tip.getBoundingClientRect();
      const panel =
        btn.closest(".bet-slip-panel") ||
        btn.closest(".right-sidebar") ||
        btn.closest(".mybets-open-controls");
      const bounds = (panel || document.body).getBoundingClientRect();
      const pad = 12;
      let shift = 0;
      if (tipRect.left < bounds.left + pad) {
        shift = bounds.left + pad - tipRect.left;
      } else if (tipRect.right > bounds.right - pad) {
        shift = bounds.right - pad - tipRect.right;
      }
      if (!shift) return;
      tip.style.setProperty("--tip-shift", `${shift}px`);
      tip.style.setProperty("--tip-arrow-shift", `${-shift}px`);
    });
  }

  function syncMyBetsAuthUi() {
    const body = $("#my-bets-body");
    if (!body || !body.dataset.initialized) return;
    const loggedIn = isBetSlipLoggedIn();
    const guest = body.querySelector(".mybets-guest");
    const app = body.querySelector(".mybets-app");
    if (guest) guest.hidden = loggedIn;
    if (app) app.hidden = !loggedIn;
    body.classList.toggle("is-guest", !loggedIn);
    if (loggedIn) {
      updateMyBetsBadges();
      setMyBetsTab(state.myBetsTab || "open");
    }
  }

  function initMyBetsPanel() {
    const body = $("#my-bets-body");
    if (!body || body.dataset.initialized) return;
    body.dataset.initialized = "1";

    body.innerHTML =
      `<div class="mybets-guest" id="mybets-guest">` +
        `<div class="mybets-guest-card">` +
          `<p class="bet-empty-text">Please log in to your account or register</p>` +
        `</div>` +
        `<a href="#reg-form" class="btn-slip-reg mybets-guest-cta" data-auth-open="register">Registration</a>` +
      `</div>` +
      `<div class="mybets-app" id="mybets-app" hidden>` +
        `<div class="mybets-subtabs" role="tablist" aria-label="My bets views">` +
          `<button type="button" class="mybets-subtab active" role="tab" aria-selected="true" data-mybets-tab="open">` +
            `Open <span class="mybets-badge" id="mybets-open-count">0</span>` +
          `</button>` +
          `<button type="button" class="mybets-subtab" role="tab" aria-selected="false" data-mybets-tab="history">` +
            `History <span class="mybets-badge" id="mybets-history-count">0</span>` +
          `</button>` +
        `</div>` +
        `<div class="mybets-open-controls" id="mybets-open-controls">` +
          `<div class="mybets-controls-row">` +
            `<label class="mybets-check">` +
              `<input type="checkbox" class="mybets-check-input" id="mybets-cashout-toggle" />` +
              `<span class="mybets-check-label">Cash Out</span>` +
              `<button type="button" class="mybets-info" data-mybets-tip aria-expanded="false" aria-label="Cash Out information">` +
                `i` +
                `<span class="mybets-tip" role="tooltip">Cash Out Value Includes Stake.</span>` +
              `</button>` +
            `</label>` +
            `<button type="button" class="mybets-refresh" aria-label="Refresh bets">` +
              `<span class="mybets-refresh-icon" aria-hidden="true">↻</span> 98` +
            `</button>` +
          `</div>` +
          `<label class="mybets-check mybets-check--full">` +
            `<input type="checkbox" class="mybets-check-input" id="mybets-accept-cashout" />` +
            `<span class="mybets-check-label">Accept Any Cash Out Value</span>` +
            `<button type="button" class="mybets-info mybets-info--accept" data-mybets-tip aria-expanded="false" aria-label="Accept any cash out value information">` +
              `i` +
              `<span class="mybets-tip" role="tooltip">Cash Out on the value offered at that time. It helps you to Cash Out faster.</span>` +
            `</button>` +
          `</label>` +
        `</div>` +
        `<div class="mybets-content" id="mybets-content"></div>` +
        `<button type="button" class="mybets-view-all" id="mybets-view-all">View All</button>` +
        `<p class="mybets-footer-note">All transactions are time stamped at GMT-4.</p>` +
      `</div>`;

    body.addEventListener("click", (e) => {
      const tipBtn = e.target.closest("[data-mybets-tip]");
      if (tipBtn) {
        e.preventDefault();
        e.stopPropagation();
        const open = tipBtn.classList.contains("is-open");
        $$("[data-mybets-tip]", body).forEach((btn) => {
          btn.classList.remove("is-open");
          btn.setAttribute("aria-expanded", "false");
          resetMyBetsTipShift(btn);
        });
        if (!open) {
          tipBtn.classList.add("is-open");
          tipBtn.setAttribute("aria-expanded", "true");
          clampMyBetsTip(tipBtn);
        }
        return;
      }

      $$("[data-mybets-tip]", body).forEach((btn) => {
        btn.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
        resetMyBetsTipShift(btn);
      });

      const subtab = e.target.closest("[data-mybets-tab]");
      if (subtab) {
        setMyBetsTab(subtab.getAttribute("data-mybets-tab"));
        return;
      }
      if (e.target.closest(".mybets-refresh")) {
        showToast("Bets refreshed (demo)");
      }
      if (e.target.closest(".mybets-view-all")) {
        setMyBetsViewAll(true);
        return;
      }
      if (e.target.closest(".mybets-view-history") || e.target.closest("#mybets-view-history")) {
        if (isMobileViewport()) {
          /* Esports page → land on Esports category tab */
          openBetHistoryPanel(isEsportsPage ? { category: "esports" } : undefined);
        } else {
          window.location.href = "bet-history.html";
        }
        return;
      }
      if (e.target.closest(".mybets-cashout:not(.is-disabled)")) {
        showToast("Cash Out — demo only");
      }
    });

    syncMyBetsAuthUi();
  }

  function initRegistration() {
    $$(".reg-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        $$(".reg-tab").forEach((t) => {
          t.classList.remove("active");
          t.setAttribute("aria-selected", "false");
        });
        tab.classList.add("active");
        tab.setAttribute("aria-selected", "true");
        const panel = tab.getAttribute("data-reg");
        $$(".reg-fields").forEach((f) => {
          f.hidden = f.getAttribute("data-panel") !== panel;
        });
      });
    });

    $("#reg-form").addEventListener("submit", (e) => {
      e.preventDefault();
      $("#reg-demo").hidden = false;
      showToast("Demo only — no account created");
    });
  }

  function initRightBlock() {
    const appClose = $("#app-close");
    if (appClose) {
      appClose.addEventListener("click", () => {
        const panel = $("#app-panel");
        if (panel) panel.hidden = true;
      });
    }

    $$(".app-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        $$(".app-tab").forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        const platform = tab.getAttribute("data-app");
        const dl = $("#app-download");
        if (dl) {
          const icon = dl.querySelector(".app-dl-icon");
          if (icon) {
            icon.src =
              platform === "ios"
                ? "assets/icons/rb-apple.svg"
                : "assets/icons/rb-android.svg";
          }
        }
        showToast(platform === "ios" ? "iOS app" : "Android app");
      });
    });

    if (window.BetSaveLoad && typeof window.BetSaveLoad.init === "function") {
      window.BetSaveLoad.init();
    }
  }

  function initCarousel() {
    const track = $("#game-track");
    const prev = $("#games-prev");
    const next = $("#games-next");
    if (!track || !prev || !next) return;
    prev.addEventListener("click", () => {
      track.scrollBy({ left: -240, behavior: "smooth" });
    });
    next.addEventListener("click", () => {
      track.scrollBy({ left: 240, behavior: "smooth" });
    });
  }

  function initHeaderLang() {
    const root = $("#header-lang");
    const btn = $("#header-lang-btn");
    const menu = $("#header-lang-menu");
    const flagEl = $("#header-lang-flag");
    const labelEl = $("#header-lang-label");
    if (!root || !btn || !menu || !flagEl || !labelEl) return;

    const LANG_KEY = "header-lang";
    const FLAG_BASE = "assets/images/account/flags/";
    let languages = [
      { code: "en", label: "English", flag: FLAG_BASE + "lang-en.svg" },
      { code: "ms", label: "Bahasa Melayu", flag: FLAG_BASE + "lang-ms.svg" },
      { code: "cn", label: "汉语", flag: FLAG_BASE + "lang-cn.svg" },
    ];

    function esc(s) {
      return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/"/g, "&quot;");
    }

    function setLang(item) {
      flagEl.src = item.flag;
      labelEl.textContent = item.label;
      btn.setAttribute("data-lang", item.code);
      $$(".header-lang-option", menu).forEach((opt) => {
        const on = opt.getAttribute("data-lang") === item.code;
        opt.classList.toggle("is-active", on);
        opt.setAttribute("aria-selected", on ? "true" : "false");
      });
      try {
        sessionStorage.setItem(LANG_KEY, item.code);
      } catch (e) { /* ignore */ }
    }

    function closeMenu() {
      root.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
      menu.hidden = true;
    }

    function openMenu() {
      root.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
      menu.hidden = false;
    }

    function renderMenu() {
      menu.innerHTML = languages
        .map(
          (item) =>
            `<li><button type="button" class="header-lang-option" role="option" data-lang="${esc(item.code)}" data-flag="${esc(item.flag)}" data-label="${esc(item.label)}" aria-selected="false">` +
            `<img src="${esc(item.flag)}" alt="" class="lang-flag" width="20" height="20" />` +
            `<span class="header-lang-option__code">${esc(String(item.code).toUpperCase())}</span>` +
            `<span class="header-lang-option__sep" aria-hidden="true"></span>` +
            `<span class="header-lang-option__name">${esc(item.label)}</span></button></li>`
        )
        .join("");
    }

    function applySaved() {
      let saved = "en";
      try {
        saved = sessionStorage.getItem(LANG_KEY) || "en";
      } catch (e) { /* ignore */ }
      const initial = languages.find((l) => l.code === saved) || languages.find((l) => l.code === "en") || languages[0];
      setLang(initial);
    }

    function wire() {
      renderMenu();
      applySaved();

      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (root.classList.contains("is-open")) closeMenu();
        else openMenu();
      });

      menu.addEventListener("click", (e) => {
        const opt = e.target.closest(".header-lang-option");
        if (!opt) return;
        const item = languages.find((l) => l.code === opt.getAttribute("data-lang"));
        if (!item) return;
        setLang(item);
        closeMenu();
        showToast("Language set to " + item.label + " (demo)");
      });

      document.addEventListener("click", (e) => {
        if (!e.target.closest("#header-lang")) closeMenu();
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeMenu();
      });
    }

    fetch(FLAG_BASE + "languages.json")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((list) => {
        if (Array.isArray(list) && list.length) {
          languages = list.map((row) => ({
            code: row.code,
            label: row.label || row.name || row.code,
            flag: FLAG_BASE + (row.file || `lang-${row.code}.svg`),
          }));
        }
      })
      .catch(() => { /* keep fallback */ })
      .finally(wire);
  }

  function initHeaderClock() {
    const el = $("#header-clock");
    if (!el) return;
    const tick = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, "0");
      const m = String(now.getMinutes()).padStart(2, "0");
      el.textContent = `${h}:${m}`;
    };
    tick();
    setInterval(tick, 30000);
  }

  function isMobileViewport() {
    return window.matchMedia("(max-width: 900px)").matches;
  }

  function setDrawerBackdrop(visible) {
    const backdrop = $("#drawer-backdrop");
    if (!backdrop) return;
    backdrop.hidden = !visible;
    backdrop.classList.toggle("is-visible", visible);
    document.body.classList.toggle("drawer-open", visible);
  }

  function closeAllMobileDrawers() {
    const left = $("#left-sidebar");
    const right = $("#right-sidebar");
    const nav = $("#header-bottom");
    const menuBtn = $("#mobile-menu-btn");
    const menuTab = $("#mobile-menu-tab");
    const sportsBtn = $("#mobile-sports-btn");
    const betBtn = $("#mobile-betslip-btn");
    if (left) left.classList.remove("open");
    if (right) right.classList.remove("is-open");
    if (nav) nav.classList.remove("is-open");
    if (window.DesktopFullMenu) window.DesktopFullMenu.close();
    if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
    if (menuTab) menuTab.setAttribute("aria-expanded", "false");
    if (sportsBtn && !sportsBtn.hasAttribute("data-mt-flyout-open")) {
      sportsBtn.setAttribute("aria-expanded", "false");
    }
    if (betBtn) betBtn.setAttribute("aria-expanded", "false");
    if (typeof window.closeSportsTabFlyout === "function") window.closeSportsTabFlyout();
    setDrawerBackdrop(false);
    document.body.classList.remove("ds-menu-open");
    syncMobileBetCount();
  }

  function openLeftDrawer() {
    if (!isMobileViewport()) return;
    const left = $("#left-sidebar");
    const right = $("#right-sidebar");
    const nav = $("#header-bottom");
    if (right) right.classList.remove("is-open");
    if (nav) nav.classList.remove("is-open");
    if (window.DesktopFullMenu) window.DesktopFullMenu.close();
    $("#mobile-menu-btn")?.setAttribute("aria-expanded", "false");
    $("#mobile-menu-tab")?.setAttribute("aria-expanded", "false");
    $("#mobile-betslip-btn")?.setAttribute("aria-expanded", "false");
    left?.classList.add("open");
    $("#mobile-sports-btn")?.setAttribute("aria-expanded", "true");
    setDrawerBackdrop(true);
  }

  function openRightDrawer() {
    if (!isMobileViewport()) return;
    const left = $("#left-sidebar");
    const right = $("#right-sidebar");
    const nav = $("#header-bottom");
    const layout = document.querySelector(".sportsbook-layout");
    left?.classList.remove("open");
    if (nav) nav.classList.remove("is-open");
    if (window.DesktopFullMenu) window.DesktopFullMenu.close();
    $("#mobile-menu-btn")?.setAttribute("aria-expanded", "false");
    $("#mobile-menu-tab")?.setAttribute("aria-expanded", "false");
    $("#mobile-sports-btn")?.setAttribute("aria-expanded", "false");
    /* ≤900 sheet uses full slip chrome — clear desktop compact-rail collapse */
    right?.classList.remove("collapsed");
    layout?.classList.remove("right-collapsed");
    right?.classList.add("is-open");
    $("#mobile-betslip-btn")?.setAttribute("aria-expanded", "true");
    setDrawerBackdrop(true);
    syncMobileBetCount();
  }

  function toggleMobileNav() {
    if (!isMobileViewport()) return;
    if (!window.DesktopFullMenu) {
      const pending = document.querySelector("script[data-ds-menu-src]");
      if (pending) {
        pending.addEventListener("load", () => toggleMobileNav(), { once: true });
        return;
      }
    }
    if (window.DesktopFullMenu) {
      const wasOpen = window.DesktopFullMenu.isOpen();
      closeAllMobileDrawers();
      if (!wasOpen) {
        window.DesktopFullMenu.open();
        setDrawerBackdrop(false);
      }
      return;
    }
    /* Fallback: legacy dark drawer if companion script missing */
    const nav = $("#header-bottom");
    const open = !nav?.classList.contains("is-open");
    closeAllMobileDrawers();
    if (open && nav) {
      nav.classList.add("is-open");
      $("#mobile-menu-btn")?.setAttribute("aria-expanded", "true");
      $("#mobile-menu-tab")?.setAttribute("aria-expanded", "true");
      setDrawerBackdrop(true);
    }
  }

  function initMobileChrome() {
    if (document.documentElement.dataset.mobileChromeWired === "1") return;
    document.documentElement.dataset.mobileChromeWired = "1";

    const backdrop = $("#drawer-backdrop");
    const rightClose = $("#right-drawer-close");

    document.addEventListener("click", (e) => {
      const toastEl = e.target.closest("[data-toast]");
      if (toastEl) {
        const msg = toastEl.getAttribute("data-toast");
        if (msg) showToast(msg);
      }

      const menuBtn = e.target.closest("#mobile-menu-btn, #mobile-menu-tab");
      if (menuBtn) {
        e.stopPropagation();
        if (typeof window.closeSportsTabFlyout === "function") window.closeSportsTabFlyout();
        toggleMobileNav();
        return;
      }

      const sportsBtn = e.target.closest("#mobile-sports-btn");
      if (sportsBtn && !sportsBtn.hasAttribute("data-mt-flyout-open")) {
        e.stopPropagation();
        if ($("#left-sidebar")?.classList.contains("open")) closeAllMobileDrawers();
        else openLeftDrawer();
        return;
      }

      const betBtn = e.target.closest("#mobile-betslip-btn");
      if (betBtn) {
        e.stopPropagation();
        if (typeof window.closeSportsTabFlyout === "function") window.closeSportsTabFlyout();
        if ($("#right-sidebar")?.classList.contains("is-open")) closeAllMobileDrawers();
        else openRightDrawer();
      }
    });

    rightClose?.addEventListener("click", closeAllMobileDrawers);
    backdrop?.addEventListener("click", () => {
      if (typeof window.closeSportsTabFlyout === "function") window.closeSportsTabFlyout();
      closeAllMobileDrawers();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeAllMobileDrawers();
    });

    window.addEventListener("resize", () => {
      if (!isMobileViewport()) {
        closeAllMobileDrawers();
        closeEventInfo();
      }
      const overlay = $("#bss-overlay");
      if (overlay && !overlay.hidden) {
        mountBetSlipSettingsHost(overlay);
        if (isMobileViewport()) document.body.classList.add("bss-open");
        else document.body.classList.remove("bss-open");
      }
      syncMobileBetCount();
      syncBetEmptyCopy();
      layoutLiveFilterOverflow();
    });

    $("#left-sidebar")?.addEventListener("click", (e) => {
      if (!isMobileViewport()) return;
      if (e.target.closest("a[href^='#']")) closeAllMobileDrawers();
    });

    $("#header-bottom")?.addEventListener("click", (e) => {
      if (!isMobileViewport()) return;
      if (e.target.closest("a[href]")) closeAllMobileDrawers();
    });

    document.querySelectorAll('a[href="#reg-form"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        if (!isMobileViewport()) return;
        e.preventDefault();
        const loginTrigger = document.querySelector('[data-auth-open="register"], [data-auth-open="login"]');
        if (loginTrigger) {
          loginTrigger.click();
          return;
        }
        openRightDrawer();
      });
    });

    window.closeAllMobileDrawers = closeAllMobileDrawers;
    window.syncMobileBetCount = syncMobileBetCount;
  }

  /* ---------- Init ---------- */

  function init() {
    if (window.SbFavourites?.ensureDemo) window.SbFavourites.ensureDemo();
    state.favorites = loadFavouriteIdSet();

    if (!isEsportsPage) {
      renderSportsList();
      renderFilters("#live-filter-list", "activeLiveFilter");
      renderFilters("#line-filters", "activeLineFilter");
      renderTables();
      renderAccumulators();
    }
    hydrateEsportsOdds();
    renderBetSlip();
    initHeaderDropdowns();
    initHeaderLang();
    initHeaderClock();
    if (!isEsportsPage) initSidebar();
    initToolbar();
    initTablesDelegation();
    initBetSlip();
    initRegistration();
    initRightBlock();
    if (!isEsportsPage) {
      initCarousel();
      initPromoSlider();
      initPlayersOnlineCounter();
      initMobileChrome();
      initHomeReferral();
      initHomePayoutMarquee();
      initSportsPageChrome();
    } else {
      window.syncMobileBetCount = syncMobileBetCount;
    }
    syncBetSlipAuthUi();
    if (!isEsportsPage) {
      requestAnimationFrame(() => {
        layoutLiveFilterOverflow();
        renderMoreMenu("");
      });
    }
    importCouponFromQuery();
  }

  function bindSpHScroll(viewport, root) {
    if (!viewport || !root) return () => {};
    const bar = $("[data-sp-hscroll]", root);
    const barTrack = $("[data-sp-hscroll-track]", root);
    const thumb = $("[data-sp-hscroll-thumb]", root);
    const DRAG_THRESHOLD = 5;
    let suppressClick = false;
    let railDrag = null;
    let thumbDrag = null;

    function hasOverflow() {
      return viewport.scrollWidth > viewport.clientWidth + 2;
    }

    function syncBar() {
      const overflow = hasOverflow();
      root.classList.toggle("has-overflow", overflow);
      viewport.classList.toggle("has-overflow", overflow);
      if (bar) bar.hidden = !overflow;
      if (!overflow || !bar || !barTrack || !thumb) return;
      const trackW = barTrack.clientWidth || 1;
      const ratio = viewport.clientWidth / viewport.scrollWidth;
      const thumbW = Math.max(36, Math.round(trackW * ratio));
      const maxScroll = Math.max(1, viewport.scrollWidth - viewport.clientWidth);
      const maxThumb = Math.max(0, trackW - thumbW);
      const left = (viewport.scrollLeft / maxScroll) * maxThumb;
      thumb.style.width = `${thumbW}px`;
      thumb.style.transform = `translate(${left}px, -50%)`;
    }

    function onWheel(e) {
      if (!hasOverflow()) return;
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      viewport.scrollLeft += e.deltaY;
    }

    function onRailPointerDown(e) {
      if (e.button !== 0 || !hasOverflow()) return;
      if (
        e.target.closest(
          "button, a:not(.sp-top-card__link):not(.sp-top-card__more), .odd-btn, .sp-top-card__fav, .sp-hscroll, input, select, textarea"
        )
      ) {
        return;
      }
      /* Do not capture yet — capturing on pointerdown steals the click from
         competition cards / interactive children and blocks selection. */
      railDrag = {
        pointerId: e.pointerId,
        startX: e.clientX,
        startScroll: viewport.scrollLeft,
        moved: false,
      };
      suppressClick = false;
    }

    function onRailPointerMove(e) {
      if (!railDrag || e.pointerId !== railDrag.pointerId) return;
      const dx = e.clientX - railDrag.startX;
      if (!railDrag.moved) {
        if (Math.abs(dx) < DRAG_THRESHOLD) return;
        railDrag.moved = true;
        suppressClick = true;
        viewport.classList.add("is-dragging");
        try {
          viewport.setPointerCapture?.(railDrag.pointerId);
        } catch (_) {
          /* capture unsupported */
        }
      }
      viewport.scrollLeft = railDrag.startScroll - (e.clientX - railDrag.startX);
    }

    function endRailDrag(e) {
      if (!railDrag || (e && e.pointerId !== railDrag.pointerId)) return;
      const moved = railDrag.moved;
      if (moved) {
        suppressClick = true;
        window.setTimeout(() => {
          suppressClick = false;
        }, 80);
      }
      try {
        if (moved) viewport.releasePointerCapture?.(railDrag.pointerId);
      } catch (_) {
        /* already released */
      }
      railDrag = null;
      viewport.classList.remove("is-dragging");
    }

    function onThumbPointerDown(e) {
      if (!thumb || !barTrack || e.button !== 0 || !hasOverflow()) return;
      e.preventDefault();
      e.stopPropagation();
      const trackW = barTrack.clientWidth || 1;
      const thumbW = thumb.offsetWidth || 36;
      thumbDrag = {
        pointerId: e.pointerId,
        startX: e.clientX,
        startScroll: viewport.scrollLeft,
        trackW,
        thumbW,
      };
      bar?.classList.add("is-dragging");
      thumb.setPointerCapture?.(e.pointerId);
    }

    function onThumbPointerMove(e) {
      if (!thumbDrag || e.pointerId !== thumbDrag.pointerId) return;
      const maxScroll = Math.max(1, viewport.scrollWidth - viewport.clientWidth);
      const maxThumb = Math.max(1, thumbDrag.trackW - thumbDrag.thumbW);
      const dx = e.clientX - thumbDrag.startX;
      viewport.scrollLeft = thumbDrag.startScroll + (dx / maxThumb) * maxScroll;
    }

    function endThumbDrag(e) {
      if (!thumbDrag || (e && e.pointerId !== thumbDrag.pointerId)) return;
      thumbDrag = null;
      bar?.classList.remove("is-dragging");
    }

    function onBarTrackPointerDown(e) {
      if (!barTrack || !thumb || e.button !== 0 || !hasOverflow()) return;
      if (e.target.closest("[data-sp-hscroll-thumb]")) return;
      const rect = barTrack.getBoundingClientRect();
      const thumbW = thumb.offsetWidth || 36;
      const maxScroll = Math.max(1, viewport.scrollWidth - viewport.clientWidth);
      const maxThumb = Math.max(1, rect.width - thumbW);
      const x = e.clientX - rect.left - thumbW / 2;
      viewport.scrollLeft = (Math.min(maxThumb, Math.max(0, x)) / maxThumb) * maxScroll;
    }

    viewport.addEventListener("scroll", syncBar, { passive: true });
    viewport.addEventListener("wheel", onWheel, { passive: false });
    viewport.addEventListener("pointerdown", onRailPointerDown);
    viewport.addEventListener("pointermove", onRailPointerMove);
    viewport.addEventListener("pointerup", endRailDrag);
    viewport.addEventListener("pointercancel", endRailDrag);
    thumb?.addEventListener("pointerdown", onThumbPointerDown);
    thumb?.addEventListener("pointermove", onThumbPointerMove);
    thumb?.addEventListener("pointerup", endThumbDrag);
    thumb?.addEventListener("pointercancel", endThumbDrag);
    barTrack?.addEventListener("pointerdown", onBarTrackPointerDown);
    window.addEventListener("resize", syncBar);
    requestAnimationFrame(syncBar);

    return {
      sync: syncBar,
      shouldSuppressClick: () => suppressClick,
      clearSuppressClick: () => {
        suppressClick = false;
      },
    };
  }

  function initSportsPageChrome() {
    if (!isSportsPage) return;
    const nav = $("[data-sp-competition-nav]");
    const viewport = $("[data-sp-competition-viewport]", nav);
    const track = $("[data-sp-competition-track]", nav);
    const topRail = $("[data-sp-top-rail]");
    const topTrack = $("[data-sp-top-track]", topRail);
    if (!nav || !viewport || !track) return;

    track.innerHTML = SPORTS_COMPETITIONS.map((comp) => {
      const sportIcon = `assets/icons/sport-${comp.sport || "football"}.svg`;
      return (
        `<button type="button" class="sp-competition-card" data-sp-competition="${escapeHtml(comp.id)}" data-group="${escapeHtml(comp.group)}" aria-pressed="false" title="${escapeHtml(comp.name)}">` +
          `<img class="sp-competition-card__sport" src="${escapeHtml(sportIcon)}" alt="" width="10" height="10" />` +
          `<span class="sp-competition-card__icon"><img src="${escapeHtml(comp.icon)}" alt="" width="26" height="26" /></span>` +
          `<span class="sp-competition-card__name">${escapeHtml(comp.name)}</span>` +
        `</button>`
      );
    }).join("");

    function syncCompetitionCards() {
      $$("[data-sp-competition]", track).forEach((card) => {
        const active =
          card.getAttribute("data-sp-competition") === state.sportsCompetition;
        card.classList.toggle("is-active", active);
        card.setAttribute("aria-pressed", active ? "true" : "false");
      });
    }

    const competitionScroll = bindSpHScroll(viewport, nav);
    const topScroll = topTrack && topRail ? bindSpHScroll(topTrack, topRail) : null;

    function openSportsTopCard(card) {
      const eventId = card.getAttribute("data-event-id");
      if (!eventId) return;
      const teams = Array.from(card.querySelectorAll(".sp-top-card__team > span")).map(
        (el) => el.textContent.trim()
      );
      const logos = Array.from(card.querySelectorAll(".sp-top-card__team .team-logo")).map(
        (img) => img.getAttribute("src") || ""
      );
      const sport = card.getAttribute("data-sport") || "football";
      const league =
        card.querySelector(".sp-top-card__league")?.textContent.trim() || "";
      const clock = card.querySelector("time")?.textContent.trim() || "";
      stashEventPending({
        id: eventId,
        home: teams[0] || "",
        away: teams[1] || "",
        league,
        sport,
        sportIcon:
          (typeof sportHeaderIconMap !== "undefined" && sportHeaderIconMap[sport]) ||
          `assets/icons/sport-${sport}.svg`,
        homeLogo: logos[0] || "",
        awayLogo: logos[1] || "",
        live: false,
        clock,
        tabs: ["Main", "1st Quarter", "2nd Quarter", "3rd Quarter", "4th Quarter"],
      });
      window.location.href = `event.html?id=${encodeURIComponent(eventId)}`;
    }

    if (topTrack) {
      topTrack.addEventListener(
        "click",
        (e) => {
          if (topScroll?.shouldSuppressClick()) {
            e.preventDefault();
            e.stopPropagation();
            topScroll.clearSuppressClick();
            return;
          }
          if (e.target.closest(".odd-btn, .sp-top-card__fav, .sp-hscroll")) return;
          const link = e.target.closest(".sp-top-card__link, .sp-top-card__more");
          const card = (link && link.closest(".sp-top-card")) || e.target.closest(".sp-top-card");
          if (!card || !topTrack.contains(card)) return;
          if (link || card.querySelector(".sp-top-card__link")) {
            e.preventDefault();
            openSportsTopCard(card);
          }
        },
        true
      );
    }

    viewport.addEventListener(
      "click",
      (e) => {
        if (competitionScroll?.shouldSuppressClick()) {
          e.preventDefault();
          e.stopPropagation();
          competitionScroll.clearSuppressClick();
          return;
        }
        const card = e.target.closest("[data-sp-competition]");
        if (!card || !viewport.contains(card)) return;
        const id = card.getAttribute("data-sp-competition");
        if (!SPORTS_COMPETITIONS.some((comp) => comp.id === id)) return;
        /* Click active again → clear filter and show all matches */
        state.sportsCompetition = state.sportsCompetition === id ? null : id;
        clearSportsCompetitionSelection();
        syncCompetitionCards();
        renderTables();
        /* Mobile / device-emulation: drop sticky focus so the rail doesn’t flash */
        if (window.matchMedia("(hover: none), (pointer: coarse)").matches) {
          card.blur();
        }
        card.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        competitionScroll?.sync();
      },
      true
    );

    /* Always open with no competition selected (ignore any stale storage) */
    state.sportsCompetition = null;
    clearSportsCompetitionSelection();
    syncCompetitionCards();
    renderTables();
    requestAnimationFrame(() => {
      competitionScroll?.sync();
      topScroll?.sync();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.syncOddButtons = syncOddButtons;
  window.openEventInfo = openEventInfo;
  window.closeEventInfo = closeEventInfo;
  window.openBetHistoryPanel = openBetHistoryPanel;
  window.closeBetHistoryPanel = closeBetHistoryPanel;
})();
