/* =========================================================
   multi-live.js — Multi-LIVE board
   Default empty. Sport chips → game/league cascade → pin match panels → bet via data-odd.
   ========================================================= */

(function () {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const MAX_PANELS = 6;

  const CATALOG = {
    esports: {
      label: "Esports",
      mode: "games",
      games: [
        {
          id: "cs2",
          name: "CS 2",
          icon: "assets/icons/esports/icon-cs2.svg",
          leagues: [
            {
              id: "cs2-berserk",
              name: "CS 2. Berserk League",
              matches: [
                match("ml-cs2-havoc", "CS 2. Berserk League", "Havoc", "Phantom", "0:0", "Best of 1 map", {
                  w1: 1.72,
                  w2: 2.05,
                  total: 2.5,
                  over: 1.85,
                  under: 1.9,
                  h1: 1.95,
                  h2: 1.8,
                  hLine: "-1.5",
                }),
              ],
            },
            {
              id: "cs2-winners",
              name: "CS 2. Winners series 1x1",
              matches: [
                match("ml-cs2-nova", "CS 2. Winners series 1x1", "Nova", "Pulse", "1:0", "Map 2 · 08:42", {
                  w1: 1.48,
                  w2: 2.55,
                  total: 21.5,
                  over: 1.92,
                  under: 1.82,
                  h1: 1.88,
                  h2: 1.86,
                  hLine: "-2.5",
                }),
              ],
            },
            {
              id: "cs2-ultras",
              name: "CS 2. Ultras League",
              matches: [
                match("ml-cs2-apex", "CS 2. European Pro League", "Passion Academy", "Phantom Academy", "0:1", "2 map", {
                  w1: 2.2,
                  w2: 1.62,
                  total: 20.5,
                  over: 1.88,
                  under: 1.86,
                  h1: 2.05,
                  h2: 1.72,
                  hLine: "+1.5",
                }),
              ],
            },
            {
              id: "cs2-eternity",
              name: "CS 2. Eternity League",
              matches: [
                match("ml-cs2-glyph", "CS 2. Eternity League", "GLYPH", "PlayTime", "0:1", "Map 2 · 12:08", {
                  w1: 1.315,
                  w2: 3.25,
                  total: 22.5,
                  over: 1.9,
                  under: 1.84,
                  h1: 1.7,
                  h2: 2.1,
                  hLine: "-1.5",
                }),
              ],
            },
          ],
        },
        {
          id: "dota2",
          name: "Dota 2",
          icon: "assets/icons/esports/icon-dota2.svg",
          leagues: [
            {
              id: "dota-gof",
              name: "Dota 2. Games of the Future",
              matches: [
                match("ml-dota-clyph", "Dota 2. Games of the Future", "CLYPH", "PlayTime", "0:1", "Game 2 · 18:40", {
                  w1: 1.315,
                  w2: 3.4,
                  total: 48.5,
                  over: 1.87,
                  under: 1.87,
                  h1: 1.95,
                  h2: 1.8,
                  hLine: "-8.5",
                }),
              ],
            },
            {
              id: "dota-wkbk",
              name: "WKBK. Future's League",
              matches: [
                match("ml-dota-orbit", "WKBK. Future's League", "Orbit", "Nexus", "15:18", "Game 1 · 22:10", {
                  w1: 2.05,
                  w2: 1.72,
                  total: 50.5,
                  over: 1.9,
                  under: 1.84,
                  h1: 1.85,
                  h2: 1.9,
                  hLine: "+4.5",
                }),
              ],
            },
          ],
        },
        {
          id: "lol",
          name: "League of Legends",
          icon: "assets/icons/esports/icon-lol.svg",
          leagues: [
            {
              id: "lol-china",
              name: "China. Wufeng Cup",
              matches: [
                match("ml-lol-wufeng", "China. Wufeng Cup", "Thunder", "Jade", "0:0", "Draft · Best of 3", {
                  w1: 1.9,
                  w2: 1.85,
                  total: 2.5,
                  over: 1.8,
                  under: 1.95,
                  h1: 1.92,
                  h2: 1.82,
                  hLine: "-1.5",
                }),
              ],
            },
          ],
        },
        {
          id: "hok",
          name: "Honor of Kings",
          icon: "assets/icons/esports/icon-hok.svg",
          leagues: [
            {
              id: "hok-cup",
              name: "Honor of Kings. Pro Cup",
              matches: [
                match("ml-hok-pro", "Honor of Kings. Pro Cup", "Dragon", "Phoenix", "1:1", "Game 3 · 08:00", {
                  w1: 1.78,
                  w2: 1.98,
                  total: 2.5,
                  over: 1.86,
                  under: 1.88,
                  h1: 1.9,
                  h2: 1.84,
                  hLine: "-1.5",
                }),
              ],
            },
          ],
        },
        {
          id: "mlbb",
          name: "Mobile Legends",
          icon: "assets/icons/esports/icon-mlbb.svg",
          leagues: [
            {
              id: "mlbb-sea",
              name: "Mobile Legends. SEA Open",
              matches: [
                match("ml-mlbb-sea", "Mobile Legends. SEA Open", "Alpha", "Bravo", "0:0", "Ban/Pick", {
                  w1: 1.65,
                  w2: 2.15,
                  total: 2.5,
                  over: 1.88,
                  under: 1.86,
                  h1: 1.8,
                  h2: 1.95,
                  hLine: "-1.5",
                }),
              ],
            },
          ],
        },
      ],
    },
    basketball: {
      label: "Basketball",
      mode: "leagues",
      leagues: [
        {
          id: "bk-wkbl",
          name: "WKBL. Women",
          matches: [
            match(
              "ml-bk-samsung",
              "WKBL. Women",
              "Samsung Life Blueminx",
              "Victoria Select",
              "33:32",
              "1st half 28:43",
              { w1: 1.95, w2: 1.8, total: 133.5, over: 1.88, under: 1.86, h1: 1.9, h2: 1.84, hLine: "+2.5" }
            ),
          ],
        },
        {
          id: "bk-moscow",
          name: "All Moscow. Women",
          matches: [
            match("ml-bk-moscow", "All Moscow. Women", "Sparta", "Dynamo", "0:30", "1st quarter · 03:40", {
              w1: 2.4,
              w2: 1.55,
              total: 138.5,
              over: 1.9,
              under: 1.84,
              h1: 2.1,
              h2: 1.7,
              hLine: "+6.5",
            }),
          ],
        },
      ],
    },
    tennis: {
      label: "Tennis",
      mode: "leagues",
      leagues: [
        {
          id: "tn-wta",
          name: "WTA. Challenger",
          matches: [
            match("ml-tn-vorobyeva", "WTA. Challenger", "Natalya Vorobyeva", "Elena Korsun", "15:15", "2nd set · 3:3", {
              w1: 1.7,
              w2: 2.1,
              total: 21.5,
              over: 1.85,
              under: 1.9,
              h1: 1.88,
              h2: 1.86,
              hLine: "-2.5",
            }),
          ],
        },
      ],
    },
    football: {
      label: "Football",
      mode: "leagues",
      leagues: [
        {
          id: "fb-piala",
          name: "Indonesia. Piala Presiden",
          matches: [
            match(
              "ml-fb-persib",
              "Indonesia. Piala Presiden",
              "Persib Bandung",
              "Persija Jakarta",
              "2:0",
              "1st half 28:43",
              {
                w1: 1.48,
                ox: 4.2,
                w2: 6.1,
                total: 2.5,
                over: 1.82,
                under: 1.92,
                h1: 1.95,
                h2: 1.8,
                hLine: "-0.5",
                dc1x: 1.12,
                dc12: 1.22,
                dcx2: 2.45,
              }
            ),
          ],
        },
        {
          id: "fb-friendly",
          name: "Club Friendlies",
          matches: [
            match("ml-fb-santos", "Club Friendlies", "Santos Laguna", "America de Cali", "1:0", "2nd half · 68'", {
              w1: 1.55,
              ox: 3.8,
              w2: 5.2,
              total: 2.5,
              over: 1.9,
              under: 1.84,
              h1: 1.85,
              h2: 1.9,
              hLine: "-0.5",
              dc1x: 1.15,
              dc12: 1.28,
              dcx2: 2.2,
            }),
          ],
        },
      ],
    },
    volleyball: {
      label: "Volleyball",
      mode: "leagues",
      icon: "assets/icons/te-volleyball.svg",
      leagues: [
        {
          id: "vb-china-uni",
          name: "China. University League",
          icon: "assets/icons/nav-globe.svg",
          matches: [
            match(
              "ml-vb-sjt",
              "China. University League",
              "Shanghai Jiao Tong University",
              "Beijing Sport University",
              "2:1",
              "3rd set, Event in progress / Round of 4",
              { w1: 1.72, w2: 2.05, total: 3.5, over: 1.88, under: 1.86, h1: 1.9, h2: 1.84, hLine: "-1.5" },
              { homeSets: "25 25 10", awaySets: "20 18 8", serving: "home" }
            ),
            match(
              "ml-vb-tsinghua",
              "China. University League",
              "Tsinghua University",
              "Fudan University",
              "1:1",
              "3rd set, Event in progress / Round of 4",
              { w1: 1.9, w2: 1.85, total: 3.5, over: 1.9, under: 1.84, h1: 1.88, h2: 1.86, hLine: "-1.5" },
              { homeSets: "25 22 12", awaySets: "23 25 10", serving: "away" }
            ),
          ],
        },
        {
          id: "vb-world",
          name: "World. Club Friendly",
          icon: "assets/icons/nav-globe.svg",
          matches: [
            match(
              "ml-vb-world",
              "World. Club Friendly",
              "Zenit St. Petersburg",
              "Lube Civitanova",
              "0:0",
              "1st set, Event in progress",
              { w1: 1.95, w2: 1.8, total: 3.5, over: 1.87, under: 1.87, h1: 1.9, h2: 1.84, hLine: "-1.5" },
              { homeSets: "8", awaySets: "6", serving: "home" }
            ),
          ],
        },
        {
          id: "vb-pro",
          name: "Pro Volleyball League",
          icon: "assets/icons/te-volleyball.svg",
          matches: [
            match(
              "ml-vb-pro",
              "Pro Volleyball League",
              "North Stars",
              "South Kings",
              "2:1",
              "3rd set, Event in progress",
              { w1: 1.82, w2: 1.92, total: 3.5, over: 1.88, under: 1.86, h1: 1.9, h2: 1.84, hLine: "-1.5" },
              { homeSets: "25 22 18", awaySets: "20 25 16", serving: "away" }
            ),
          ],
        },
      ],
    },
    hockey: {
      label: "Ice Hockey",
      mode: "leagues",
      leagues: [
        {
          id: "hk-ahl",
          name: "AHL Exhibition",
          matches: [
            match("ml-hk-ahl", "AHL Exhibition", "Rangers", "Bruins", "2:1", "2nd period · 08:20", {
              w1: 2.05,
              ox: 3.6,
              w2: 2.9,
              total: 5.5,
              over: 1.87,
              under: 1.87,
              h1: 1.9,
              h2: 1.84,
              hLine: "-0.5",
            }),
          ],
        },
      ],
    },
    tabletennis: {
      label: "Table Tennis",
      mode: "leagues",
      leagues: [
        {
          id: "tt-open",
          name: "TT Cup Open",
          matches: [
            match("ml-tt-open", "TT Cup Open", "Chen Wei", "Park Jin", "7:5", "Game 3", {
              w1: 1.68,
              w2: 2.12,
              total: 19.5,
              over: 1.86,
              under: 1.88,
              h1: 1.9,
              h2: 1.84,
              hLine: "-2.5",
            }),
          ],
        },
      ],
    },
  };

  function match(id, league, home, away, score, period, odds, meta) {
    return Object.assign({ id, league, home, away, score, period, odds: odds || {} }, meta || {});
  }

  function toast(msg) {
    if (typeof window.showToast === "function") {
      window.showToast(msg);
      return;
    }
    const el = $("#toast");
    if (!el) return;
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => {
      el.hidden = true;
    }, 2200);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function oddPayload(m, market, selection, value) {
    return JSON.stringify({
      id: `${m.id}-${market}-${selection}`,
      eventId: m.id,
      league: m.league,
      match: `${m.home} - ${m.away}`,
      market,
      selection,
      odds: value,
    }).replace(/"/g, "&quot;");
  }

  function oddBtn(m, market, selection, value, lab) {
    if (value == null) return "";
    const display = lab
      ? `<span class="odd-btn-lab">${escapeHtml(lab)}</span><span class="odd-btn-val">${formatOdd(value)}</span>`
      : formatOdd(value);
    return `<button type="button" class="odd-btn odd-btn--stack" data-odd="${oddPayload(m, market, selection, value)}" title="${escapeHtml(market)} ${escapeHtml(selection)}" aria-pressed="false">${display}</button>`;
  }

  function formatOdd(v) {
    const n = Number(v);
    if (!Number.isFinite(n)) return "—";
    return n.toFixed(2);
  }

  function gameCount(game) {
    return (game.leagues || []).reduce((sum, lg) => sum + (lg.matches || []).length, 0);
  }

  const state = {
    sportId: null,
    gameId: null,
    leagueId: null,
    panels: [],
  };

  function sportData(id) {
    return CATALOG[id] || null;
  }

  function closeFlyout() {
    const flyout = $("#ml-flyout");
    if (flyout) {
      flyout.hidden = true;
      flyout.innerHTML = "";
      flyout.style.left = "";
    }
    $$(".ml-chip[data-sport]").forEach((chip) => {
      chip.classList.remove("active");
      chip.setAttribute("aria-selected", "false");
      chip.setAttribute("aria-expanded", "false");
    });
    state.sportId = null;
    state.gameId = null;
    state.leagueId = null;
  }

  /** Align cascade under the active sport chip (clamped to the filter wrap). */
  function positionFlyout() {
    const flyout = $("#ml-flyout");
    const wrap = $(".ml-filters-wrap");
    const chip = state.sportId
      ? document.querySelector(`.ml-chip[data-sport="${state.sportId}"]`)
      : null;
    if (!flyout || !wrap || !chip || flyout.hidden) return;

    const wrapRect = wrap.getBoundingClientRect();
    const chipRect = chip.getBoundingClientRect();
    const width = flyout.offsetWidth || 260;
    const maxLeft = Math.max(0, wrapRect.width - width);
    const left = Math.min(Math.max(0, chipRect.left - wrapRect.left), maxLeft);
    flyout.style.left = `${Math.round(left)}px`;
  }

  function openSport(sportId, opts) {
    const data = sportData(sportId);
    const flyout = $("#ml-flyout");
    if (!flyout) return;

    const toggle = opts && opts.toggle;
    if (toggle && state.sportId === sportId && !flyout.hidden) {
      closeFlyout();
      return;
    }

    if (state.sportId === sportId && !flyout.hidden) {
      positionFlyout();
      return;
    }

    $$(".ml-chip[data-sport]").forEach((chip) => {
      const on = chip.dataset.sport === sportId;
      chip.classList.toggle("active", on);
      chip.setAttribute("aria-selected", on ? "true" : "false");
      chip.setAttribute("aria-expanded", on ? "true" : "false");
    });

    state.sportId = sportId;
    state.gameId = null;
    state.leagueId = null;

    if (!data) {
      flyout.hidden = false;
      flyout.innerHTML = `<div class="ml-flyout-col"><p class="ml-flyout-empty">No live events</p></div>`;
      positionFlyout();
      return;
    }

    /* Step 1 only: games (esports) or leagues — next columns open on hover/click */
    flyout.hidden = false;
    renderFlyout();
  }

  function sportIcon(sportId) {
    const chip = document.querySelector(`.ml-chip[data-sport="${sportId}"] img`);
    if (chip?.getAttribute("src")) return chip.getAttribute("src");
    const data = sportData(sportId);
    return data?.icon || "assets/icons/te-football.svg";
  }

  function leagueRowHtml(lg, active) {
    const count = (lg.matches || []).length;
    const ico = lg.icon || "assets/icons/nav-globe.svg";
    return `<li>
      <button type="button" class="ml-flyout-item${active ? " is-active" : ""}" data-ml-league="${lg.id}" role="menuitem">
        <img class="ml-flyout-ico" src="${ico}" alt="" width="18" height="18" />
        <span class="ml-flyout-label">${escapeHtml(lg.name)}</span>
        <span class="ml-flyout-count">${count}</span>
      </button>
    </li>`;
  }

  function renderFlyout() {
    const flyout = $("#ml-flyout");
    const data = sportData(state.sportId);
    if (!flyout || !data) return;

    const parts = [];

    if (data.mode === "games") {
      const games = data.games || [];
      parts.push(`<div class="ml-flyout-col" data-col="games">
        <ul class="ml-flyout-list" role="none">
          ${games
            .map((g) => {
              const active = g.id === state.gameId ? " is-active" : "";
              return `<li>
                <button type="button" class="ml-flyout-item${active}" data-ml-game="${g.id}" role="menuitem">
                  <img class="ml-flyout-ico" src="${g.icon}" alt="" width="18" height="18" />
                  <span class="ml-flyout-label">${escapeHtml(g.name)}</span>
                  <span class="ml-flyout-count">${gameCount(g)}</span>
                </button>
              </li>`;
            })
            .join("")}
        </ul>
      </div>`);

      const game = games.find((g) => g.id === state.gameId);
      if (game) {
        parts.push(`<div class="ml-flyout-col" data-col="league">
          <ul class="ml-flyout-list" role="none">
            ${(game.leagues || []).map((lg) => leagueRowHtml(lg, lg.id === state.leagueId)).join("")}
          </ul>
        </div>`);

        const league = (game.leagues || []).find((lg) => lg.id === state.leagueId);
        if (league) parts.push(matchPreviewCol(league));
      }
    } else {
      const leagues = data.leagues || [];
      parts.push(`<div class="ml-flyout-col" data-col="league">
        <ul class="ml-flyout-list" role="none">
          ${leagues.map((lg) => leagueRowHtml(lg, lg.id === state.leagueId)).join("")}
        </ul>
      </div>`);

      const league = leagues.find((lg) => lg.id === state.leagueId);
      if (league) parts.push(matchPreviewCol(league));
    }

    flyout.innerHTML = parts.join("");
    positionFlyout();
  }

  function matchPreviewCol(league) {
    const matches = league?.matches || [];
    if (!matches.length) {
      return `<div class="ml-flyout-col ml-flyout-col--preview"><p class="ml-flyout-empty">No live matches</p></div>`;
    }
    const ico = sportIcon(state.sportId);
    return `<div class="ml-flyout-col ml-flyout-col--preview" data-col="match">
      ${matches
        .map((m) => {
          const pinned = state.panels.some((p) => p.id === m.id);
          const [hs, as] = String(m.score || "0:0").split(":");
          const homeSets = m.homeSets || "";
          const awaySets = m.awaySets || "";
          return `<button type="button" class="ml-match-card${pinned ? " is-pinned" : ""}" data-ml-match="${escapeHtml(m.id)}">
            <div class="ml-match-card-head">
              <img class="ml-match-card-sport" src="${ico}" alt="" width="14" height="14" />
              <span class="ml-match-card-league">${escapeHtml(m.league || league.name)}</span>
              <span class="ml-match-card-star" aria-hidden="true" title="Favourite">☆</span>
            </div>
            <div class="ml-match-card-row">
              <span class="ml-match-card-badge" aria-hidden="true">${escapeHtml(teamInitials(m.home))}</span>
              <span class="ml-match-card-team">${escapeHtml(m.home)}</span>
              <span class="ml-match-card-pts">${escapeHtml(hs || "0")}</span>
              ${homeSets ? `<span class="ml-match-card-sets">${escapeHtml(homeSets)}</span>` : ""}
              ${m.serving === "home" ? `<img class="ml-match-card-serve" src="${ico}" alt="" width="10" height="10" />` : `<span class="ml-match-card-serve-spacer"></span>`}
            </div>
            <div class="ml-match-card-row">
              <span class="ml-match-card-badge" aria-hidden="true">${escapeHtml(teamInitials(m.away))}</span>
              <span class="ml-match-card-team">${escapeHtml(m.away)}</span>
              <span class="ml-match-card-pts">${escapeHtml(as || "0")}</span>
              ${awaySets ? `<span class="ml-match-card-sets">${escapeHtml(awaySets)}</span>` : ""}
              ${m.serving === "away" ? `<img class="ml-match-card-serve" src="${ico}" alt="" width="10" height="10" />` : `<span class="ml-match-card-serve-spacer"></span>`}
            </div>
            <div class="ml-match-card-status">${escapeHtml(m.period)}</div>
          </button>`;
        })
        .join("")}
    </div>`;
  }

  function findMatchById(id) {
    for (const sport of Object.values(CATALOG)) {
      if (sport.mode === "games") {
        for (const g of sport.games || []) {
          for (const lg of g.leagues || []) {
            const m = (lg.matches || []).find((x) => x.id === id);
            if (m) return m;
          }
        }
      } else {
        for (const lg of sport.leagues || []) {
          const m = (lg.matches || []).find((x) => x.id === id);
          if (m) return m;
        }
      }
    }
    return null;
  }

  function addMatch(id) {
    const m = findMatchById(id);
    if (!m) return;
    if (state.panels.some((p) => p.id === id)) {
      toast("Already on Multi-LIVE board");
      closeFlyout();
      highlightPanel(id);
      return;
    }
    if (state.panels.length >= MAX_PANELS) {
      toast(`Maximum ${MAX_PANELS} events on board`);
      return;
    }
    state.panels.push(m);
    closeFlyout();
    renderBoard();
    toast(`Added ${m.home} vs ${m.away}`);
  }

  function removeMatch(id) {
    state.panels = state.panels.filter((p) => p.id !== id);
    renderBoard();
  }

  function highlightPanel(id) {
    const panel = document.querySelector(`.ml-panel[data-match-id="${id}"]`);
    if (!panel) return;
    panel.classList.add("is-flash");
    panel.scrollIntoView({ behavior: "smooth", inline: "nearest", block: "nearest" });
    setTimeout(() => panel.classList.remove("is-flash"), 900);
  }

  function invertLine(line) {
    const n = parseFloat(String(line).replace("+", ""));
    if (!Number.isFinite(n)) return line;
    const inv = -n;
    return (inv > 0 ? "+" : "") + inv;
  }

  function teamInitials(name) {
    const parts = String(name)
      .split(/\s+/)
      .filter(Boolean);
    if (!parts.length) return "?";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  function marketsHtml(m) {
    const o = m.odds || {};
    const hasDraw = o.ox != null;
    const oneX2 = hasDraw
      ? `${oddBtn(m, "1X2", "1", o.w1, "1")}${oddBtn(m, "1X2", "X", o.ox, "X")}${oddBtn(m, "1X2", "2", o.w2, "2")}`
      : `${oddBtn(m, "1X2", "W1", o.w1, "W1")}${oddBtn(m, "1X2", "W2", o.w2, "W2")}`;

    const dc =
      o.dc1x != null
        ? `<details class="ml-market" open data-ml-group="popular">
          <summary><span>Double Chance</span><img src="assets/icons/te-chevron-down.svg" alt="" class="ml-market-chevron" width="10" height="6" /></summary>
          <div class="ml-odds ml-odds--3">
            ${oddBtn(m, "Double Chance", "1X", o.dc1x, "1X")}
            ${oddBtn(m, "Double Chance", "12", o.dc12, "12")}
            ${oddBtn(m, "Double Chance", "X2", o.dcx2, "X2")}
          </div>
        </details>`
        : "";

    const totalLabel = o.total != null ? escapeHtml(String(o.total)) : "";
    const hHome = o.hLine || "";
    const hAway = o.hLine ? invertLine(o.hLine) : "";

    const marketBlocks = `
      <details class="ml-market" open data-ml-group="popular">
        <summary><span>1X2</span><img src="assets/icons/te-chevron-down.svg" alt="" class="ml-market-chevron" width="10" height="6" /></summary>
        <div class="ml-odds ${hasDraw ? "ml-odds--3" : "ml-odds--2"}">${oneX2}</div>
      </details>
      ${dc}
      <details class="ml-market" open data-ml-group="total">
        <summary><span>Total ${totalLabel}</span><img src="assets/icons/te-chevron-down.svg" alt="" class="ml-market-chevron" width="10" height="6" /></summary>
        <div class="ml-odds ml-odds--2">
          ${oddBtn(m, "Total", "Over", o.over, `Over ${o.total ?? ""}`)}
          ${oddBtn(m, "Total", "Under", o.under, `Under ${o.total ?? ""}`)}
        </div>
      </details>
      <details class="ml-market" open data-ml-group="handicap">
        <summary><span>Handicap</span><img src="assets/icons/te-chevron-down.svg" alt="" class="ml-market-chevron" width="10" height="6" /></summary>
        <div class="ml-odds ml-odds--2">
          ${oddBtn(m, "Handicap", "1", o.h1, `${m.home.split(" ")[0]} ${hHome}`)}
          ${oddBtn(m, "Handicap", "2", o.h2, `${m.away.split(" ")[0]} ${hAway}`)}
        </div>
      </details>`;

    const counts = {
      all: hasDraw ? (o.dc1x != null ? 4 : 3) : 3,
      total: 1,
      handicap: 1,
      popular: hasDraw ? (o.dc1x != null ? 2 : 1) : 1,
    };

    return `
      <div class="ml-market-bar">
        <div class="ml-market-chips" role="tablist" aria-label="Markets">
          <button type="button" class="ml-mchip active" data-ml-filter="all">All markets (${counts.all})</button>
          <button type="button" class="ml-mchip" data-ml-filter="total">Total (${counts.total})</button>
          <button type="button" class="ml-mchip" data-ml-filter="handicap">Handicap (${counts.handicap})</button>
          <button type="button" class="ml-mchip" data-ml-filter="popular">Popular (${counts.popular})</button>
        </div>
        <div class="ml-market-tools">
          <button type="button" class="ml-market-tool" data-ml-market-search aria-label="Search markets" title="Search markets">
            <img src="assets/icons/te-search.svg" alt="" width="12" height="12" />
          </button>
          <button type="button" class="ml-market-tool" data-ml-market-filter aria-label="Filter markets" title="Filter markets">
            <img src="mobile/assets/icons/sp-filter.svg" alt="" width="12" height="12" />
          </button>
        </div>
      </div>
      <div class="ml-markets">${marketBlocks}</div>`;
  }

  function panelHtml(m) {
    const score = String(m.score || "0:0");
    return `<article class="ml-panel" data-match-id="${escapeHtml(m.id)}">
      <header class="ml-panel-head">
        <span class="ml-panel-league">${escapeHtml(m.league)}. ${escapeHtml(m.home)} - ${escapeHtml(m.away)}</span>
        <div class="ml-panel-actions">
          <button type="button" class="ml-panel-ico" aria-label="Live stream" title="Live stream">
            <img src="assets/icons/nav-stream.svg" alt="" width="14" height="14" />
          </button>
          <button type="button" class="ml-panel-ico" aria-label="Information" title="Information">
            <img src="assets/icons/account-subnav/info-circle.svg" alt="" width="14" height="14" />
          </button>
          <button type="button" class="ml-panel-ico ml-panel-close" data-ml-remove="${escapeHtml(m.id)}" aria-label="Remove event" title="Remove">
            <img src="assets/icons/rb-close.svg" alt="" width="12" height="12" />
          </button>
        </div>
      </header>
      <div class="ml-panel-tabs" role="tablist">
        <button type="button" class="ml-ptab active" data-ml-tab="summary" role="tab" aria-selected="true">Summary</button>
        <button type="button" class="ml-ptab" data-ml-tab="stats" role="tab" aria-selected="false">Statistics</button>
        <button type="button" class="ml-ptab" data-ml-tab="info" role="tab" aria-selected="false">Information</button>
      </div>
      <div class="ml-panel-score">
        <div class="ml-score-side ml-score-side--home">
          <span class="ml-team-badge" aria-hidden="true">${escapeHtml(teamInitials(m.home))}</span>
          <span class="ml-team">${escapeHtml(m.home)}</span>
        </div>
        <div class="ml-score-center">
          <div class="ml-score-main">${escapeHtml(score)}</div>
          <div class="ml-period">${escapeHtml(m.period)}</div>
        </div>
        <div class="ml-score-side ml-score-side--away">
          <span class="ml-team-badge" aria-hidden="true">${escapeHtml(teamInitials(m.away))}</span>
          <span class="ml-team">${escapeHtml(m.away)}</span>
        </div>
      </div>
      <div class="ml-panel-body" data-ml-pane="summary">
        ${marketsHtml(m)}
      </div>
      <div class="ml-panel-body" data-ml-pane="stats" hidden>
        <p class="ml-pane-copy">Live statistics for this event will appear here.</p>
      </div>
      <div class="ml-panel-body" data-ml-pane="info" hidden>
        <p class="ml-pane-copy">${escapeHtml(m.league)} · ${escapeHtml(m.home)} vs ${escapeHtml(m.away)}. Live markets update as the event progresses.</p>
      </div>
    </article>`;
  }

  function seedDemoPanels() {
    /* One panel by default — left ⅓ column (live multi / screenshot parity) */
    const ids = ["ml-cs2-apex"];
    ids.forEach((id) => {
      const m = findMatchById(id);
      if (m && !state.panels.some((p) => p.id === id)) state.panels.push(m);
    });
  }

  function renderBoard() {
    const board = $("#ml-board");
    const empty = $("#ml-board-empty");
    const grid = $("#ml-board-grid");
    if (!board || !empty || !grid) return;

    const has = state.panels.length > 0;
    board.classList.toggle("is-empty", !has);
    empty.hidden = has;
    grid.hidden = !has;
    grid.dataset.count = String(state.panels.length);
    grid.innerHTML = state.panels.map(panelHtml).join("");

    if (typeof window.syncOddButtons === "function") {
      window.syncOddButtons();
    }
  }

  function bindFlyout() {
    const wrap = $(".ml-filters-wrap");
    const filters = $(".ml-filters");
    let leaveTimer = 0;

    document.addEventListener("click", (e) => {
      const chip = e.target.closest(".ml-chip[data-sport]");
      if (chip) {
        e.preventDefault();
        openSport(chip.dataset.sport, { toggle: true });
        return;
      }

      if (e.target.closest(".ml-chip-more")) {
        toast("More sports — demo only");
        return;
      }

      const gameBtn = e.target.closest("[data-ml-game]");
      if (gameBtn) {
        /* Step 2: pick game → show leagues (do not auto-open matches) */
        state.gameId = gameBtn.getAttribute("data-ml-game");
        state.leagueId = null;
        renderFlyout();
        return;
      }

      const leagueBtn = e.target.closest("[data-ml-league]");
      if (leagueBtn) {
        /* Step 3: pick league → show match cards */
        state.leagueId = leagueBtn.getAttribute("data-ml-league");
        renderFlyout();
        return;
      }

      const matchBtn = e.target.closest(".ml-match-card");
      if (matchBtn) {
        addMatch(matchBtn.getAttribute("data-ml-match"));
        return;
      }

      if (!e.target.closest(".ml-filters-wrap")) {
        if (!$("#ml-flyout")?.hidden) closeFlyout();
      }
    });

    /* Hover chip → open that sport's menu under the chip; inner columns still cascade. */
    document.addEventListener("pointerover", (e) => {
      const chip = e.target.closest(".ml-chip[data-sport]");
      if (chip) {
        openSport(chip.dataset.sport);
        return;
      }

      const gameBtn = e.target.closest("[data-ml-game]");
      if (gameBtn && state.sportId) {
        const id = gameBtn.getAttribute("data-ml-game");
        if (id !== state.gameId) {
          state.gameId = id;
          state.leagueId = null;
          renderFlyout();
        }
        return;
      }
      const leagueBtn = e.target.closest("[data-ml-league]");
      if (leagueBtn && state.sportId) {
        const id = leagueBtn.getAttribute("data-ml-league");
        if (id !== state.leagueId) {
          state.leagueId = id;
          renderFlyout();
        }
      }
    });

    if (wrap) {
      wrap.addEventListener("pointerenter", () => {
        window.clearTimeout(leaveTimer);
      });
      wrap.addEventListener("pointerleave", () => {
        window.clearTimeout(leaveTimer);
        leaveTimer = window.setTimeout(() => {
          if (!$("#ml-flyout")?.hidden) closeFlyout();
        }, 160);
      });
    }

    filters?.addEventListener("scroll", positionFlyout);
    window.addEventListener("resize", positionFlyout);
  }

  function bindBoard() {
    const grid = $("#ml-board-grid");
    if (!grid) return;

    grid.addEventListener("click", (e) => {
      const remove = e.target.closest("[data-ml-remove]");
      if (remove) {
        removeMatch(remove.getAttribute("data-ml-remove"));
        return;
      }

      const tab = e.target.closest(".ml-ptab");
      if (tab) {
        const panel = tab.closest(".ml-panel");
        if (!panel) return;
        const key = tab.dataset.mlTab;
        $$(".ml-ptab", panel).forEach((t) => {
          const on = t === tab;
          t.classList.toggle("active", on);
          t.setAttribute("aria-selected", on ? "true" : "false");
        });
        $$(".ml-panel-body", panel).forEach((pane) => {
          pane.hidden = pane.dataset.mlPane !== key;
        });
        return;
      }

      const chip = e.target.closest(".ml-mchip");
      if (chip) {
        const panel = chip.closest(".ml-panel");
        if (!panel) return;
        const filter = chip.dataset.mlFilter;
        $$(".ml-mchip", panel).forEach((c) => c.classList.toggle("active", c === chip));
        $$(".ml-market", panel).forEach((mk) => {
          if (filter === "all") {
            mk.hidden = false;
            return;
          }
          if (filter === "popular") {
            mk.hidden = mk.dataset.mlGroup !== "popular";
            return;
          }
          mk.hidden = mk.dataset.mlGroup !== filter;
        });
        return;
      }

      if (e.target.closest("[data-ml-market-search]")) {
        toast("Market search — demo only");
        return;
      }
      if (e.target.closest("[data-ml-market-filter]")) {
        toast("Market filter — demo only");
      }
    });
  }

  function bindSearch() {
    const input = $("#ml-search");
    if (!input) return;
    input.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      e.preventDefault();
      const q = input.value.trim().toLowerCase();
      if (!q) return;
      const hit = [];
      Object.values(CATALOG).forEach((sport) => {
        const leagues =
          sport.mode === "games"
            ? (sport.games || []).flatMap((g) => g.leagues || [])
            : sport.leagues || [];
        leagues.forEach((lg) => {
          (lg.matches || []).forEach((m) => {
            const blob = `${m.league} ${m.home} ${m.away}`.toLowerCase();
            if (blob.includes(q)) hit.push(m);
          });
        });
      });
      if (!hit.length) {
        toast("No matching live events");
        return;
      }
      addMatch(hit[0].id);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    bindFlyout();
    bindBoard();
    bindSearch();
    seedDemoPanels();
    renderBoard();
  });
})();
