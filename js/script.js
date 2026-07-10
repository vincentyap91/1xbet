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

  const flagIconMap = {
    MY: "assets/icons/lnt/flag-my-league.png",
    ES: "assets/icons/lnt/flag-spain.svg",
    BE: "assets/icons/lnt/flag-belgium.svg",
    NO: "assets/icons/lnt/flag-norway.svg",
    GB: "assets/icons/lnt/flag-england.svg",
    AR: "assets/icons/lnt/flag-argentina.svg",
    CH: "assets/icons/lnt/flag-switzerland.svg",
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
        { id: "lv9", time: "Live", live: true, home: "West Coast Rangers (Women)", away: "Western Springs (Women)", scoreH: 1, scoreA: 0, o1: 1.65, ox: 3.80, o2: 4.50, total: 2.5, over: 1.95, under: 1.84, hcap: "-0.5", h1: 1.90, h2: 1.88, more: 6 },
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
        { id: "ln1", time: "10 July", live: false, home: "Spain", away: "Belgium", scoreH: null, scoreA: null, o1: 2.15, ox: 3.20, o2: 3.45, total: 2.5, over: 1.95, under: 1.84, hcap: "0", h1: 1.70, h2: 2.15, more: 1444 },
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

  const state = {
    betSlip: [],
    favorites: new Set(),
    collapsedLeagues: new Set(),
    activeLiveFilter: null,
    activeLineFilter: null,
    sportsExpanded: false,
    searchQuery: "",
    liveSearch: "",
    lineSearch: "",
    lineType: "live",
    promoIndex: 0,
  };

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

  function formatOdd(v) {
    if (v == null || Number.isNaN(v)) return "—";
    return Number(v).toFixed(2);
  }

  function productOdds(items) {
    return items.reduce((acc, b) => acc * Number(b.odds), 1);
  }

  /* ---------- Table rendering ---------- */

  function oddButton(event, market, selection, value, leagueName) {
    if (value == null) {
      return `<span class="odd-btn odd-btn-locked" aria-disabled="true" title="Suspended"><img src="assets/icons/lnt/icon-lock.svg" alt="" width="11" height="12" /></span>`;
    }
    const id = `${event.id}-${market}-${selection}`;
    const selected = state.betSlip.some((b) => b.id === id) ? " selected" : "";
    const payload = JSON.stringify({
      id,
      league: leagueName,
      match: `${event.home} vs ${event.away}`,
      market,
      selection,
      odds: value,
    }).replace(/"/g, "&quot;");
    return `<button type="button" class="odd-btn${selected}" data-odd="${payload}" aria-pressed="${selected ? "true" : "false"}">${formatOdd(value)}</button>`;
  }

  function renderEventRow(event, leagueName, searchQuery) {
    const fav = state.favorites.has(event.id) ? " active" : "";
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
      ? `<img class="team-logo" src="${event.homeLogo}" alt="" width="16" height="16" />`
      : "";
    const awayLogo = event.awayLogo
      ? `<img class="team-logo" src="${event.awayLogo}" alt="" width="16" height="16" />`
      : "";
    const streamIcon = event.stream
      ? `<img class="event-stream-icon" src="assets/icons/lnt/icon-stream.svg" alt="" width="12" height="11" title="Live stream" />`
      : "";

    return `
      <div class="event-row${hidden}" data-event-id="${event.id}">
        <div class="event-main">
          <button type="button" class="icon-tiny fav${fav}" data-fav="${event.id}" aria-label="Favourite" aria-pressed="${fav ? "true" : "false"}">★</button>
          <div class="event-teams">
            <div class="team-line">${homeLogo}<span>${event.home}</span><span class="score">${scoreH}</span></div>
            <div class="team-line">${awayLogo}<span>${event.away}</span><span class="score">${scoreA}</span></div>
            <div class="${timeClass}">${timeLabel}${streamIcon}</div>
          </div>
        </div>
        <div class="stats-cell" title="Statistics">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 20V10h3v10H4zm7 0V4h3v16h-3zm7 0v-7h3v7h-3z"/></svg>
        </div>
        <div class="odd-cell desktop-odds">${oddButton(event, "1X2", "1", event.o1, leagueName)}</div>
        <div class="odd-cell desktop-odds">${oddButton(event, "1X2", "X", event.ox, leagueName)}</div>
        <div class="odd-cell desktop-odds">${oddButton(event, "1X2", "2", event.o2, leagueName)}</div>
        <div class="event-odds-mobile">
          ${oddButton(event, "1X2", "1", event.o1, leagueName)}
          ${oddButton(event, "1X2", "X", event.ox, leagueName)}
          ${oddButton(event, "1X2", "2", event.o2, leagueName)}
          <a href="#" class="more-link">+${event.more}</a>
        </div>
        <div class="total-val desktop-odds">${event.total != null ? event.total : "—"}</div>
        <div class="desktop-odds">${oddButton(event, "Total", "Over", event.over, leagueName)}</div>
        <div class="desktop-odds">${oddButton(event, "Total", "Under", event.under, leagueName)}</div>
        <div class="handicap-val desktop-odds">${event.hcap != null ? event.hcap : "—"}</div>
        <div class="desktop-odds">${oddButton(event, "Handicap", "1", event.h1, leagueName)}</div>
        <div class="desktop-odds">${oddButton(event, "Handicap", "2", event.h2, leagueName)}</div>
        <div class="more-cell desktop-odds"><a href="#" class="more-link">+${event.more}</a></div>
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

  function renderLeague(league, filterSport, searchQuery) {
    if (filterSport && filterSport !== "stream" && league.sport !== filterSport) {
      return "";
    }
    const collapsed = state.collapsedLeagues.has(league.id);
    const favLeague = state.favorites.has("league-" + league.id) ? " active" : "";
    return `
      <section class="league-block" data-league="${league.id}" data-sport="${league.sport}">
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
          <div class="col-label">Stats</div>
          <div class="col-label">1</div>
          <div class="col-label">X</div>
          <div class="col-label">2</div>
          <div class="col-label">Total</div>
          <div class="col-label">Over</div>
          <div class="col-label">Under</div>
          <div class="col-label">Hcap</div>
          <div class="col-label">1</div>
          <div class="col-label">2</div>
          <div class="col-label">More</div>
        </header>
        <div class="league-body" ${collapsed ? "hidden" : ""}>
          ${league.events.map((e) => renderEventRow(e, league.name, searchQuery)).join("")}
        </div>
      </section>
    `;
  }

  function renderTables() {
    const liveEl = $("#live-table");
    const lineEl = $("#line-table");
    if (liveEl) {
      liveEl.innerHTML = liveLeagues
        .map((l) => renderLeague(l, state.activeLiveFilter, state.liveSearch))
        .join("");
    }
    if (lineEl) {
      lineEl.innerHTML = lineLeagues
        .map((l) => renderLeague(l, state.activeLineFilter, state.lineSearch))
        .join("");
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
    $$(".odd-btn[data-odd]").forEach((btn) => {
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
    if (!badge) return;
    const n = state.betSlip.length;
    badge.hidden = n === 0;
    badge.textContent = String(n);
  }

  function renderBetSlip() {
    const empty = $("#bet-empty");
    const list = $("#bet-list");
    const footer = $("#bet-footer");
    const regCta = $("#bet-reg-cta");
    syncMobileBetCount();

    if (!state.betSlip.length) {
      empty.hidden = false;
      list.hidden = true;
      footer.hidden = true;
      if (regCta) regCta.hidden = false;
      list.innerHTML = "";
      syncOddButtons();
      return;
    }

    empty.hidden = true;
    list.hidden = false;
    footer.hidden = false;
    if (regCta) regCta.hidden = true;
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

    updateTotals();
    syncOddButtons();
  }

  function updateTotals() {
    const total = productOdds(state.betSlip);
    const stake = Number($("#stake-input").value) || 0;
    $("#total-odds").textContent = formatOdd(total);
    $("#potential-return").textContent = (stake * total).toFixed(2);
  }

  function toggleOdd(data) {
    const idx = state.betSlip.findIndex((b) => b.id === data.id);
    if (idx >= 0) state.betSlip.splice(idx, 1);
    else state.betSlip.push(data);
    renderBetSlip();
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
      btn.addEventListener("click", () => showToast("Demo only — promotion not opened"));
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
        try {
          const data = JSON.parse(btn.getAttribute("data-odd"));
          if (!data.odds) return;
          const exists = state.betSlip.findIndex((b) => b.id === data.id);
          if (exists >= 0) state.betSlip.splice(exists, 1);
          else state.betSlip.push(data);
          renderBetSlip();
          syncOddButtons();
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

      const fav = e.target.closest("[data-fav]");
      if (fav) {
        const id = fav.getAttribute("data-fav");
        if (state.favorites.has(id)) state.favorites.delete(id);
        else state.favorites.add(id);
        fav.classList.toggle("active");
        fav.setAttribute("aria-pressed", fav.classList.contains("active") ? "true" : "false");
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
      state.betSlip = state.betSlip.filter((b) => b.id !== rm.getAttribute("data-remove"));
      renderBetSlip();
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
      link.addEventListener("click", () => {
        if (!isMobileViewport()) return;
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
