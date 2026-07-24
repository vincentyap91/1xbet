/* =========================================================
   Sportsbook homepage — mock data & interactions
   Structure: live site | Colors: modified-color reference
   ========================================================= */

(function () {
  "use strict";

  /* ---------- Mock data (live snapshot) ---------- */

  const isMarbleLivePage = document.body?.dataset?.page === "marble-live";
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
    WC: "assets/icons/lnt/crumb-trophy.svg",
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
          stream: true,
          home: "CF Montreal",
          away: "Toronto",
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
          clock: "10:37 / 2nd quarter / Including Overtime / Round of 8",
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

  const homeAccumulators = {
    1: [
      { id: "a1", match: "Utah Jazz vs Washington Wizards", selection: "Wizards", odds: 1.72, league: "NBA Summer League", market: "Winner" },
      { id: "a2", match: "Indiana Fever vs Phoenix Mercury", selection: "Fever", odds: 1.85, league: "WNBA", market: "Winner" },
      { id: "a3", match: "Spain vs Belgium", selection: "Spain", odds: 2.15, league: "World Cup 2026", market: "1X2", flags: ["ES", "BE"], sportIcon: "assets/icons/lnt/acc-football.svg" },
      { id: "a4", match: "Colorado Rockies vs Giants", selection: "Rockies", odds: 2.20, league: "MLB", market: "Winner" },
      { id: "a5", match: "Albuquerque vs Sugar Land", selection: "Isotopes", odds: 1.70, league: "MiLB", market: "Winner" },
    ],
    2: [
      { id: "a6", match: "Arizona Diamondbacks vs Padres", selection: "Padres", odds: 1.75, league: "MLB", market: "Winner" },
      { id: "a7", match: "Las Vegas Aces vs Portland Fire", selection: "Aces", odds: 1.55, league: "WNBA", market: "Winner" },
      { id: "a8", match: "Washington Freedom vs LAKR", selection: "LAKR", odds: 1.22, league: "USA Major League", market: "Winner" },
      { id: "a9", match: "West Coast Rangers vs Western Springs", selection: "Rangers", odds: 1.65, league: "NZ Championship", market: "1X2" },
    ],
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
      if (event) return { league, event };
    }
    return null;
  }

  function eventToFavouriteRecord(league, event) {
    const sport = league.sport || "football";
    return {
      id: event.id,
      sport,
      sportIcon: sportIconMap[sport] || `assets/icons/sport-${sport}.svg`,
      time: event.live ? event.clock || event.time || "Event in progress" : event.time || "",
      league: league.name || "",
      home: event.home || "",
      homeLogo: event.homeLogo || "assets/images/mobile-home/teams/team-01.webp",
      away: event.away || "",
      awayLogo: event.awayLogo || "assets/images/mobile-home/teams/team-02.webp",
      homeScore: event.scoreH != null ? event.scoreH : null,
      awayScore: event.scoreA != null ? event.scoreA : null,
      note: event.note || "",
      scope: event.live ? "live" : "sports",
      hasStream: Boolean(event.stream) || Boolean(event.live),
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

  const state = {
    betSlip: [],
    favorites: loadFavouriteIdSet(),
    pinnedMatches: loadPinnedMatches(),
    collapsedLeagues: new Set(),
    activeLiveFilter: null,
    activeLineFilter: null,
    sportsExpanded: false,
    searchQuery: "",
    liveSearch: "",
    lineSearch: "",
    lineType: "live",
    promoIndex: 0,
    myBetsTab: "open",
  };

  const PIN_ICON_SVG =
    '<svg class="pin-icon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z"/></svg>';

  const MOCK_RUNNING_BETS = [
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

  const MOCK_SETTLED_BETS = [];

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

  function formatOdd(v) {
    if (v == null || Number.isNaN(v)) return "—";
    return Number(v).toFixed(2);
  }

  function productOdds(items) {
    return items.reduce((acc, b) => acc * Number(b.odds), 1);
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

  function oddButton(event, market, selection, value, leagueName, stackLab) {
    const id = `${event.id}-${market}-${selection}`;
    const selected = state.betSlip.some((b) => b.id === id) ? " selected" : "";
    const title = oddTitle(market, selection);
    const stackClass = stackLab ? " odd-btn--stack" : "";
    if (value == null) {
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

  function renderEventOddsCells(event, leagueName, sport) {
    if (sportHasDoubleChance(sport)) {
      return `
        <div class="odd-cell desktop-odds">${oddButton(event, "1X2", "1", event.o1, leagueName)}</div>
        <div class="odd-cell desktop-odds">${oddButton(event, "1X2", "X", event.ox, leagueName)}</div>
        <div class="odd-cell desktop-odds">${oddButton(event, "1X2", "2", event.o2, leagueName)}</div>
        <div class="odd-cell desktop-odds">${oddButton(event, "Double Chance", "1X", doubleChanceOdd(event, "1X"), leagueName)}</div>
        <div class="odd-cell desktop-odds">${oddButton(event, "Double Chance", "12", doubleChanceOdd(event, "12"), leagueName)}</div>
        <div class="odd-cell desktop-odds">${oddButton(event, "Double Chance", "2X", doubleChanceOdd(event, "2X"), leagueName)}</div>
        <div class="desktop-odds">${oddButton(event, "Total", "Over", event.over, leagueName)}</div>
        <div class="total-val desktop-odds">${event.total != null ? event.total : "—"}</div>
        <div class="desktop-odds">${oddButton(event, "Total", "Under", event.under, leagueName)}</div>
        <div class="more-cell desktop-odds"><a href="#" class="more-link">+${event.more}</a></div>
        <div class="event-odds-mobile event-odds-mobile--card">
          <div class="mobile-odds-row mobile-odds-row--markets" role="group" aria-label="Main markets">
            ${oddButton(event, "1X2", "1", event.o1, leagueName, "W1")}
            ${oddButton(event, "1X2", "X", event.ox, leagueName, "DRAW")}
            ${oddButton(event, "1X2", "2", event.o2, leagueName, "W2")}
            ${oddButton(event, "Double Chance", "1X", doubleChanceOdd(event, "1X"), leagueName, "1X")}
            ${oddButton(event, "Double Chance", "12", doubleChanceOdd(event, "12"), leagueName, "12")}
          </div>
          <a href="#" class="more-link">+${event.more}</a>
        </div>`;
    }

    return `
      <div class="odd-cell desktop-odds">${oddButton(event, "1X2", "1", event.o1, leagueName)}</div>
      <div class="odd-cell desktop-odds">${oddButton(event, "1X2", "X", event.ox, leagueName)}</div>
      <div class="odd-cell desktop-odds">${oddButton(event, "1X2", "2", event.o2, leagueName)}</div>
      <div class="event-odds-mobile event-odds-mobile--card">
        <div class="mobile-odds-row mobile-odds-row--markets mobile-odds-row--markets-3" role="group" aria-label="Main markets">
          ${oddButton(event, "1X2", "1", event.o1, leagueName, "W1")}
          ${oddButton(event, "1X2", "X", event.ox, leagueName, "DRAW")}
          ${oddButton(event, "1X2", "2", event.o2, leagueName, "W2")}
        </div>
        <a href="#" class="more-link">+${event.more}</a>
      </div>
      <div class="total-val desktop-odds">${event.total != null ? event.total : "—"}</div>
      <div class="desktop-odds">${oddButton(event, "Total", "Over", event.over, leagueName)}</div>
      <div class="desktop-odds">${oddButton(event, "Total", "Under", event.under, leagueName)}</div>
      <div class="handicap-val desktop-odds">${event.hcap != null ? event.hcap : "—"}</div>
      <div class="desktop-odds">${oddButton(event, "Handicap", "1", event.h1, leagueName)}</div>
      <div class="desktop-odds">${oddButton(event, "Handicap", "2", event.h2, leagueName)}</div>
      <div class="more-cell desktop-odds"><a href="#" class="more-link">+${event.more}</a></div>`;
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

  function renderEventRow(event, leagueName, searchQuery, sport) {
    const fav = state.favorites.has(event.id) ? " active" : "";
    const pinned = isEventPinned(event.id);
    const timeClass = event.live ? "event-time live" : "event-time";
    const timeLabel = event.live ? (event.clock || event.time || "Live") : event.time;
    const scoreH = event.scoreH != null ? event.scoreH : "";
    const scoreA = event.scoreA != null ? event.scoreA : "";
    const q = (searchQuery || "").toLowerCase();
    const hidden =
      q &&
      !`${event.home} ${event.away} ${leagueName}`.toLowerCase().includes(q)
        ? " hidden-event"
        : "";
    const homeLogo = event.homeLogo
      ? `<img class="team-logo" src="${event.homeLogo}" alt="" width="18" height="18" />`
      : "";
    const awayLogo = event.awayLogo
      ? `<img class="team-logo" src="${event.awayLogo}" alt="" width="18" height="18" />`
      : "";
    const streamIcon = event.stream
      ? `<img class="event-stream-icon" src="assets/icons/lnt/icon-stream.svg" alt="" width="14" height="13" title="Live stream" />`
      : "";
    const sportSrc = sportHeaderIconMap[sport] || `assets/icons/sport-${sport}.svg`;

    return `
      <div class="event-row${pinned ? " event-row--pinned" : ""}${hidden}" data-event-id="${event.id}">
        <div class="event-card-top">
          <div class="event-card-status">
            <img class="event-sport-icon" src="${sportSrc}" alt="" width="16" height="16" />
            <div class="${timeClass}">${timeLabel}</div>
            ${streamIcon}
          </div>
          <div class="event-card-actions">
            ${pinButtonHtml(event.id)}
            <button type="button" class="icon-tiny fav${fav}" data-fav="${event.id}" aria-label="Favourite" aria-pressed="${fav ? "true" : "false"}">★</button>
            <button type="button" class="icon-tiny event-card-more" aria-label="More options">⋯</button>
          </div>
        </div>
        <div class="event-card-league">${leagueName}</div>
        <div class="event-main">
          <div class="event-side-actions">
            ${pinButtonHtml(event.id, "pin--desktop")}
            <button type="button" class="icon-tiny fav fav--desktop${fav}" data-fav="${event.id}" aria-label="Favourite" aria-pressed="${fav ? "true" : "false"}">★</button>
          </div>
          <div class="event-teams">
            <div class="team-line">${homeLogo}<span>${event.home}</span><span class="score">${scoreH}</span></div>
            <div class="team-line">${awayLogo}<span>${event.away}</span><span class="score">${scoreA}</span></div>
            <div class="${timeClass} event-time--desktop">${timeLabel}${streamIcon}</div>
          </div>
        </div>
        <div class="stats-cell" title="Statistics">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 20V10h3v10H4zm7 0V4h3v16h-3zm7 0v-7h3v7h-3z"/></svg>
        </div>
        ${renderEventOddsCells(event, leagueName, sport)}
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
    const flag = flagSrc
      ? `<img class="league-flag-icon" src="${flagSrc}" alt="" width="16" height="16" />`
      : `<span class="league-icon">${league.icon}</span>`;
    return `${sport}${flag}`;
  }

  function renderLeagueHeaders(sport) {
    if (sportHasDoubleChance(sport)) {
      return `
          <div class="col-label">Stats</div>
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
          <div class="col-label">Stats</div>
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
    return league.sport === filterSport;
  }

  function renderLeague(league, filterSport, searchQuery, eventsOverride) {
    if (eventsOverride == null && filterSport && filterSport !== "stream" && league.sport !== filterSport) {
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

  /** Pinned matches first (pin order), then remaining leagues in default API order. */
  function renderOrderedLeagues(leagues, filterSport, searchQuery) {
    const eventIndex = new Map();
    leagues.forEach((league) => {
      if (!leagueMatchesFilter(league, filterSport)) return;
      league.events.forEach((event) => {
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
      const events = league.events.filter((event) => !pinnedSet.has(event.id));
      if (events.length) sections.push({ league, events });
    });

    return sections
      .map(({ league, events }) => renderLeague(league, null, searchQuery, events))
      .join("");
  }

  function renderTables() {
    const liveEl = $("#live-table");
    const lineEl = $("#line-table");
    if (liveEl) {
      liveEl.innerHTML = renderOrderedLeagues(
        liveLeagues,
        state.activeLiveFilter,
        state.liveSearch
      );
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
    return `
      <li class="sport-item" data-sport-id="${s.id}">
        <a href="#live-events" class="sport-item-main">
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
        const active = state.activeLiveFilter === f.id ? " active" : "";
        return `<button type="button" class="filter-chip${active}" data-filter="${f.id}" data-group="${f.group}" aria-pressed="${active ? "true" : "false"}">
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
    return `<button type="button" class="te-more-item${active}" data-filter="${sport.id}">
      <img src="${teIconMap[sport.id] || sport.icon}" alt="" width="16" height="16" />
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
      renderMoreMenu($("#te-more-search")?.value || "");
      $("#te-more-search")?.focus();
    }
  }

  function selectLiveSportFilter(id) {
    state.activeLiveFilter = state.activeLiveFilter === id ? null : id;
    const liveStreamToggle = $("#live-stream-toggle");
    if (liveStreamToggle) liveStreamToggle.checked = false;
    renderLiveFilterBar();
    renderTables();
  }

  function renderAccumulators() {
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
      badge.hidden = n === 0;
      badge.textContent = String(n);
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
    fab.hidden = n === 0 || !isMobileViewport() || sheetOpen;
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

  function ensureTicketFooter() {
    const footer = $("#bet-footer");
    if (!footer || footer.dataset.ticketLayout === "true") return;
    footer.dataset.ticketLayout = "true";
    footer.innerHTML = `
      <div class="bet-type-row">
        <button type="button" class="ticket-select" id="bet-type-select" aria-haspopup="listbox">
          <span>Accumulator</span>
          <span class="select-chevron" aria-hidden="true"></span>
        </button>
        <button type="button" class="ticket-trash" id="clear-bets" aria-label="Clear bet slip">
          <img src="assets/icons/rb-close.svg" alt="" width="12" height="12" />
        </button>
      </div>
      <div class="ticket-summary-row">
        <span>Overall odds</span>
        <strong id="total-odds">1.00</strong>
        <button type="button" class="ticket-settings" aria-label="Place settings" title="Place settings">
          <img src="assets/icons/rb-settings.svg" alt="" width="12" height="12" />
        </button>
      </div>
      <div class="ticket-stake-block">
        <label class="stake-title" for="stake-input">Stake amount (MYR)</label>
        <div class="stake-control">
          <button type="button" class="stake-step" data-stake-step="-50" aria-label="Decrease stake">-</button>
          <input type="number" id="stake-input" min="1" step="1" value="50" />
          <button type="button" class="stake-step" data-stake-step="50" aria-label="Increase stake">+</button>
          <button type="button" class="ticket-settings" aria-label="Stake settings" title="Stake settings">
            <img src="assets/icons/rb-settings.svg" alt="" width="12" height="12" />
          </button>
        </div>
        <div class="quick-stakes" aria-label="Quick stake amounts">
          <button type="button" data-quick-stake="1">+1</button>
          <button type="button" data-quick-stake="100">+100</button>
          <button type="button" data-quick-stake="250">+250</button>
        </div>
      </div>
      <button type="button" class="max-stake-link">
        <span>Maximum stake</span>
        <strong>11700 MYR</strong>
      </button>
      <label class="ticket-field">
        <span>When odds change:</span>
        <button type="button" class="ticket-select">
          <span>Accept if odds increase</span>
          <span class="select-chevron" aria-hidden="true"></span>
        </button>
      </label>
      <button type="button" class="promo-code-toggle">
        <span>Promo code</span>
        <span class="select-chevron" aria-hidden="true"></span>
      </button>
      <button type="button" class="btn-place" id="place-bet">Place Bet</button>
    `;
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
      const score = event.scoreH != null || event.scoreA != null ? `[ ${event.scoreH ?? 0}:${event.scoreA ?? 0} ]` : "";
      return {
        ...source,
        eventId: event.id,
        league: source.league || league.name,
        live: Boolean(event.live),
        score,
        match: source.match || `${event.home} - ${event.away}`,
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
      .map(
        (b) => `
      <article class="bet-item ticket-card" data-bet-id="${b.id}">
        <button type="button" class="bet-remove" data-remove="${b.id}" aria-label="Remove selection">×</button>
        <div class="ticket-meta-line">
          ${b.live ? '<span class="ticket-live-badge">LIVE</span>' : ""}
          ${ticketSportIcon(b)}
          <span class="ticket-event-id">${b.eventId || b.id}</span>
          <span class="bet-item-league">${b.league || "Top Events"}</span>
        </div>
        <div class="bet-item-match">${b.match}</div>
        ${ticketScore(b) ? `<div class="ticket-score">${ticketScore(b)}</div>` : ""}
        <div class="ticket-selection-row">
          <span class="ticket-odds-pill">${formatOdd(b.odds)}</span>
          <span class="ticket-market">${formatTicketMarket(b)}</span>
        </div>
      </article>`
      )
      .join("");
  }

  function renderBetSlip() {
    const empty = $("#bet-empty");
    const list = $("#bet-list");
    const footer = $("#bet-footer");
    const regCta = $("#bet-reg-cta");
    syncBetTabCount();
    syncMobileBetCount();

    if (!state.betSlip.length) {
      empty.hidden = false;
      list.hidden = true;
      footer.hidden = true;
      footer.classList.remove("is-sticky");
      if (regCta) regCta.hidden = false;
      list.innerHTML = "";
      syncOddButtons();
      return;
    }

    empty.hidden = true;
    list.hidden = false;
    footer.hidden = false;
    footer.classList.add("is-sticky");
    if (regCta) regCta.hidden = true;
    ensureTicketFooter();
    list.innerHTML = state.betSlip
      .map(
        (b) => `
      <article class="bet-item" data-bet-id="${b.id}">
        <button type="button" class="bet-remove" data-remove="${b.id}" aria-label="Remove">×</button>
        <div class="bet-item-league">${b.league}</div>
        <div class="bet-item-match">${b.match}</div>
        <div class="bet-item-market">${b.market}</div>
        <div class="bet-item-sel">
          <span>${b.selection}</span>
          <span class="odds">${formatOdd(b.odds)}</span>
        </div>
      </article>`
      )
      .join("");
    list.innerHTML = renderTicketCards(state.betSlip);

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
    if (potentialReturn) potentialReturn.textContent = (stake * total).toFixed(2);
  }

  function toggleOdd(data) {
    const idx = state.betSlip.findIndex((b) => b.id === data.id);
    if (idx >= 0) {
      state.betSlip.splice(idx, 1);
    } else {
      // One selection per match: Draw (X), Double Chance 12, or any other market replaces the previous pick.
      const eventId = betEventId(data);
      state.betSlip = state.betSlip.filter((b) => betEventId(b) !== eventId);
      state.betSlip.push(hydrateTicketData({ ...data, eventId }));
    }
    renderBetSlip();
    openRightDrawer();
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

  /* ---------- Interactions ---------- */

  function initHeaderDropdowns() {
    document.addEventListener("click", (e) => {
      const trigger = e.target.closest(".nav-item.has-dropdown > .nav-link");
      if (trigger) {
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
        sb.classList.toggle("collapsed");
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
      showToast(`View: ${tab.textContent.trim()}`);
    });

    const eventSearch = $("#event-search");
    if (eventSearch) {
      eventSearch.addEventListener("input", (e) => {
        state.liveSearch = e.target.value.trim();
        renderTables();
      });
    }

    const lineSearch = $("#line-search");
    if (lineSearch) {
      lineSearch.addEventListener("input", (e) => {
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
    if (liveFilterList) {
      liveFilterList.addEventListener("click", (e) => {
        const chip = e.target.closest(".filter-chip");
        if (!chip) return;
        selectLiveSportFilter(chip.getAttribute("data-filter"));
      });
    }

    if (liveStreamToggle) {
      liveStreamToggle.addEventListener("change", () => {
        if (liveStreamToggle.checked) {
          state.activeLiveFilter = "stream";
        } else if (state.activeLiveFilter === "stream") {
          state.activeLiveFilter = null;
        }
        renderLiveFilterBar();
        renderTables();
        showToast(liveStreamToggle.checked ? "Showing events with live streams" : "All live events");
      });
    }

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
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".te-more-wrap")) setMoreMenuOpen(false);
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
  }

  function initTablesDelegation() {
    document.addEventListener("click", (e) => {
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
        return;
      }

      const toggle = e.target.closest("[data-toggle-league]");
      if (toggle) {
        const id = toggle.getAttribute("data-toggle-league");
        if (state.collapsedLeagues.has(id)) state.collapsedLeagues.delete(id);
        else state.collapsedLeagues.add(id);
        renderTables();
      }
    });
  }

  function initBetSlip() {
    initMyBetsPanel();

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
      });
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
      const step = e.target.closest("[data-stake-step]");
      const quick = e.target.closest("[data-quick-stake]");
      const clear = e.target.closest("#clear-bets");
      const place = e.target.closest("#place-bet");
      const stakeInput = $("#stake-input");

      if (step && stakeInput) {
        const next = Math.max(1, (Number(stakeInput.value) || 0) + Number(step.getAttribute("data-stake-step")));
        stakeInput.value = String(next);
        updateTotals();
        return;
      }

      if (quick && stakeInput) {
        stakeInput.value = String((Number(stakeInput.value) || 0) + Number(quick.getAttribute("data-quick-stake")));
        updateTotals();
        return;
      }

      if (clear) {
        state.betSlip = [];
        renderBetSlip();
        showToast("Bet slip cleared");
        return;
      }

      if (place) {
        showToast("Demo only — bet not placed");
      }
    });

    $("#bet-slip-body")?.addEventListener("input", (e) => {
      if (e.target.closest("#stake-input")) updateTotals();
    });

    $("#clear-bets").addEventListener("click", () => {
      state.betSlip = [];
      renderBetSlip();
      showToast("Bet slip cleared");
    });

    $("#place-bet").addEventListener("click", () => {
      showToast("Demo only — bet not placed");
    });

    $("#stake-input").addEventListener("input", updateTotals);

    $("#generate-slip").addEventListener("click", () => {
      const pool = [];
      [...liveLeagues, ...lineLeagues].forEach((l) => {
        l.events.forEach((ev) => {
          if (ev.o1 != null) {
            pool.push({
              id: `gen-${ev.id}-1`,
              league: l.name,
              match: `${ev.home} vs ${ev.away}`,
              market: "1X2",
              selection: "1",
              odds: ev.o1,
            });
          }
        });
      });
      const picks = [];
      const used = new Set();
      while (picks.length < 3 && used.size < pool.length) {
        const i = Math.floor(Math.random() * pool.length);
        if (used.has(i)) continue;
        used.add(i);
        picks.push(pool[i]);
      }
      picks.forEach((p) => {
        if (!state.betSlip.some((b) => b.id === p.id)) state.betSlip.push(p);
      });
      renderBetSlip();
      showToast("Generated selections added");
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

  function renderMyBetsContent() {
    const container = $("#mybets-content");
    if (!container) return;

    const tab = state.myBetsTab;
    const bets = getMyBetsData(tab);

    if (!bets.length) {
      const emptyMsg =
        tab === "history"
          ? "There are no settled bet slips for the last session"
          : "No open bets. Place a bet to see it here.";
      container.innerHTML = `<div class="mybets-empty"><p class="bet-empty-text">${emptyMsg}</p></div>`;
      return;
    }

    container.innerHTML =
      `<div class="mybets-cards">${bets.map((bet) => renderMyBetsOpenCard(bet)).join("")}</div>`;
  }

  function updateMyBetsBadges() {
    const openCount = MOCK_RUNNING_BETS.length;
    const historyCount = MOCK_SETTLED_BETS.length;
    const openBadge = $("#mybets-open-count");
    const historyBadge = $("#mybets-history-count");
    if (openBadge) openBadge.textContent = String(openCount);
    if (historyBadge) historyBadge.textContent = String(historyCount);
  }

  function setMyBetsTab(tab) {
    state.myBetsTab = tab;
    $$(".mybets-subtab").forEach((btn) => {
      const isActive = btn.getAttribute("data-mybets-tab") === tab;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-selected", isActive ? "true" : "false");
    });
    const controls = $("#mybets-open-controls");
    const viewAll = $("#mybets-view-all");
    if (controls) controls.hidden = tab !== "open";
    if (viewAll) viewAll.hidden = tab !== "open";
    renderMyBetsContent();
  }

  function initMyBetsPanel() {
    const body = $("#my-bets-body");
    if (!body || body.dataset.initialized) return;
    body.dataset.initialized = "1";

    body.innerHTML =
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
            `<span class="mybets-info" title="Enable cash out for eligible bets" tabindex="0" role="img" aria-label="Cash Out information">i</span>` +
          `</label>` +
          `<button type="button" class="mybets-refresh" aria-label="Refresh bets">` +
            `<span class="mybets-refresh-icon" aria-hidden="true">↻</span> 98` +
          `</button>` +
        `</div>` +
        `<label class="mybets-check mybets-check--full">` +
          `<input type="checkbox" class="mybets-check-input" id="mybets-accept-cashout" />` +
          `<span class="mybets-check-label">Accept Any Cash Out Value</span>` +
          `<span class="mybets-info" title="Accept any offered cash out amount" tabindex="0" role="img" aria-label="Accept any cash out value information">i</span>` +
        `</label>` +
      `</div>` +
      `<div class="mybets-content" id="mybets-content"></div>` +
      `<button type="button" class="mybets-view-all" id="mybets-view-all">View All</button>` +
      `<p class="mybets-footer-note">All transactions are time stamped at GMT-4.</p>`;

    body.addEventListener("click", (e) => {
      const subtab = e.target.closest("[data-mybets-tab]");
      if (subtab) {
        setMyBetsTab(subtab.getAttribute("data-mybets-tab"));
        return;
      }
      if (e.target.closest(".mybets-refresh")) {
        showToast("Bets refreshed (demo)");
      }
      if (e.target.closest(".mybets-view-all")) {
        showToast("View all bets — demo only");
      }
      if (e.target.closest(".mybets-cashout:not(.is-disabled)")) {
        showToast("Cash Out — demo only");
      }
    });

    updateMyBetsBadges();
    setMyBetsTab("open");
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
    const rightCollapse = $("#right-collapse");
    if (rightCollapse) {
      rightCollapse.addEventListener("click", () => {
        $(".right-sidebar").classList.toggle("collapsed");
      });
    }

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

    const saveLink = $(".bet-save-link");
    if (saveLink) {
      saveLink.addEventListener("click", () => {
        showToast("Demo only — save/load unavailable");
      });
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
    if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
    if (menuTab) menuTab.setAttribute("aria-expanded", "false");
    if (sportsBtn) sportsBtn.setAttribute("aria-expanded", "false");
    if (betBtn) betBtn.setAttribute("aria-expanded", "false");
    setDrawerBackdrop(false);
    syncMobileBetCount();
  }

  function openLeftDrawer() {
    if (!isMobileViewport()) return;
    const left = $("#left-sidebar");
    const right = $("#right-sidebar");
    const nav = $("#header-bottom");
    if (right) right.classList.remove("is-open");
    if (nav) nav.classList.remove("is-open");
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
    left?.classList.remove("open");
    if (nav) nav.classList.remove("is-open");
    $("#mobile-menu-btn")?.setAttribute("aria-expanded", "false");
    $("#mobile-menu-tab")?.setAttribute("aria-expanded", "false");
    $("#mobile-sports-btn")?.setAttribute("aria-expanded", "false");
    right?.classList.add("is-open");
    $("#mobile-betslip-btn")?.setAttribute("aria-expanded", "true");
    setDrawerBackdrop(true);
    syncMobileBetCount();
  }

  function toggleMobileNav() {
    if (!isMobileViewport()) return;
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
    const menuBtn = $("#mobile-menu-btn");
    const menuTab = $("#mobile-menu-tab");
    const sportsBtn = $("#mobile-sports-btn");
    const betBtn = $("#mobile-betslip-btn");
    const backdrop = $("#drawer-backdrop");
    const rightClose = $("#right-drawer-close");

    menuBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMobileNav();
    });
    menuTab?.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMobileNav();
    });
    sportsBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      if ($("#left-sidebar")?.classList.contains("open")) closeAllMobileDrawers();
      else openLeftDrawer();
    });
    betBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      if ($("#right-sidebar")?.classList.contains("is-open")) closeAllMobileDrawers();
      else openRightDrawer();
    });
    rightClose?.addEventListener("click", closeAllMobileDrawers);
    backdrop?.addEventListener("click", closeAllMobileDrawers);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeAllMobileDrawers();
    });

    window.addEventListener("resize", () => {
      if (!isMobileViewport()) closeAllMobileDrawers();
      syncMobileBetCount();
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
  }

  /* ---------- Init ---------- */

  function init() {
    renderSportsList();
    renderFilters("#live-filter-list", "activeLiveFilter");
    renderFilters("#line-filters", "activeLineFilter");
    renderTables();
    renderAccumulators();
    renderBetSlip();
    initHeaderDropdowns();
    initHeaderLang();
    initHeaderClock();
    initSidebar();
    initToolbar();
    initTablesDelegation();
    initBetSlip();
    initRegistration();
    initRightBlock();
    initCarousel();
    initPromoSlider();
    initMobileChrome();
    initHomeReferral();
    requestAnimationFrame(() => {
      layoutLiveFilterOverflow();
      renderMoreMenu("");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
