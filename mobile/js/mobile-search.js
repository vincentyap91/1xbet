(() => {
  const SAMPLE = [
    {
      sport: "Football",
      sportIcon: "assets/icons/sport-football.svg",
      league: "UEFA Champions League",
      scope: "line",
      home: "Paris Saint-Germain",
      homeLogo: "assets/logos/psg.webp",
      away: "Borussia Dortmund",
      awayLogo: "assets/logos/partner-barcelona.webp",
      meta: "League Stage · 22/07 21:00",
      odds: [
        { lab: "1", val: "1.85" },
        { lab: "X", val: "3.40" },
        { lab: "2", val: "3.25" },
        { lab: "TOTAL", val: "1.95" },
      ],
    },
    {
      sport: "Football",
      sportIcon: "assets/icons/sport-football.svg",
      league: "UEFA Champions League",
      scope: "line",
      home: "Copenhagen",
      homeLogo: "assets/logos/partner-caf.webp",
      away: "Manchester City",
      awayLogo: "assets/logos/partner-fiba.webp",
      meta: "13.02, 21:00",
      odds: [
        { lab: "1", val: "11.5" },
        { lab: "X", val: "7.1" },
        { lab: "2", val: "1.25" },
        { lab: "TOTAL", val: "1.88" },
      ],
    },
    {
      sport: "Football",
      sportIcon: "assets/icons/sport-football.svg",
      league: "Spain. La Liga",
      scope: "line",
      home: "Real Madrid",
      homeLogo: "assets/logos/partner-serie-a.webp",
      away: "Barcelona",
      awayLogo: "assets/logos/partner-barcelona.webp",
      meta: "Round 1 · 23/07 20:00",
      odds: [
        { lab: "1", val: "2.20" },
        { lab: "X", val: "3.50" },
        { lab: "2", val: "3.15" },
        { lab: "TOTAL", val: "1.90" },
      ],
    },
    {
      sport: "Esports",
      sportIcon: "assets/icons/sport-esports.svg",
      league: "CS2. ESL Pro League",
      scope: "cyber",
      home: "Natus Vincere",
      homeLogo: "assets/logos/partner-pgl.webp",
      away: "Vitality",
      awayLogo: "assets/logos/partner-mibr.webp",
      meta: "Bo3 · 21/07 19:00",
      odds: [
        { lab: "1", val: "1.72" },
        { lab: "2", val: "2.05" },
        { lab: "TOTAL", val: "1.85" },
        { lab: "HANDICAP", val: "1.90" },
      ],
    },
    {
      sport: "Football",
      sportIcon: "assets/icons/sport-football.svg",
      league: "England. Premier League",
      scope: "live",
      home: "Arsenal",
      homeLogo: "assets/logos/partner-dallas-open.webp",
      away: "Chelsea",
      awayLogo: "assets/logos/partner-billie-jean.webp",
      meta: "LIVE · 67′",
      odds: [
        { lab: "1", val: "1.95" },
        { lab: "X", val: "3.20" },
        { lab: "2", val: "3.80" },
        { lab: "TOTAL", val: "1.70" },
      ],
    },
  ];

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function matchesQuery(item, q, exact) {
    const hay = `${item.league} ${item.home} ${item.away} ${item.sport}`.toLowerCase();
    if (exact) {
      return hay.split(/\s+/).includes(q) || item.league.toLowerCase() === q || item.home.toLowerCase() === q || item.away.toLowerCase() === q;
    }
    return hay.includes(q);
  }

  function renderList(items) {
    const list = $("#mh-se-list");
    if (!list) return;

    if (!items.length) {
      list.innerHTML = `<p class="mh-se-none">No events found</p>`;
      return;
    }

    const groups = new Map();
    items.forEach((item) => {
      const key = `${item.sport}::${item.league}`;
      if (!groups.has(key)) groups.set(key, { sport: item.sport, sportIcon: item.sportIcon, league: item.league, matches: [] });
      groups.get(key).matches.push(item);
    });

    list.innerHTML = Array.from(groups.values())
      .map((group) => {
        const matchesHtml = group.matches
          .map((m) => {
            const odds = m.odds
              .map(
                (o) =>
                  `<button type="button" class="mh-odds__btn" data-odd="${escapeHtml(o.val)}"><span class="mh-odds__lab">${escapeHtml(o.lab)}</span><span class="mh-odds__val">${escapeHtml(o.val)}</span></button>`
              )
              .join("");
            return `<article class="mh-se-match">
              <div class="mh-se-match__teams">
                <p class="mh-se-match__team"><img src="${escapeHtml(m.homeLogo)}" alt="" width="20" height="20" />${escapeHtml(m.home)}</p>
                <p class="mh-se-match__team"><img src="${escapeHtml(m.awayLogo)}" alt="" width="20" height="20" />${escapeHtml(m.away)}</p>
              </div>
              <p class="mh-se-match__meta">${escapeHtml(m.meta)}</p>
              <div class="mh-se-match__odds mh-odds">${odds}</div>
            </article>`;
          })
          .join("");

        return `<section class="mh-se-group">
          <p class="mh-se-group__sport"><img src="${escapeHtml(group.sportIcon)}" alt="" width="14" height="14" />${escapeHtml(group.sport)}</p>
          <div class="mh-se-league">
            <button type="button" class="mh-se-league__star" data-mh-toast="Favourites — sign in to sync" aria-label="Favourite">
              <img src="assets/icons/sp-star.svg" alt="" width="16" height="16" />
            </button>
            <a href="#" class="mh-se-league__name">${escapeHtml(group.league)}</a>
          </div>
          ${matchesHtml}
        </section>`;
      })
      .join("");
  }

  function initSearchPage() {
    if (!document.body.classList.contains("mh-page--search")) return;

    const input = $("#mh-se-input");
    const clearBtn = $("#mh-se-clear");
    const empty = $("#mh-se-empty");
    const results = $("#mh-se-results");
    const exactBtn = $("#mh-se-exact");
    const back = $("#mh-se-back");
    let tab = "all";

    if (back) {
      back.addEventListener("click", (e) => {
        if (history.length <= 1) {
          e.preventDefault();
          window.location.href = "sports.html";
        }
      });
    }

    if (exactBtn) {
      exactBtn.addEventListener("click", () => {
        const on = exactBtn.getAttribute("aria-checked") !== "true";
        exactBtn.setAttribute("aria-checked", on ? "true" : "false");
        update();
      });
    }

    $$("[data-mh-se-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        tab = btn.getAttribute("data-mh-se-tab") || "all";
        $$("[data-mh-se-tab]").forEach((t) => {
          const on = t === btn;
          t.classList.toggle("is-active", on);
          t.setAttribute("aria-selected", on ? "true" : "false");
        });
        update();
      });
    });

    function update() {
      const q = (input?.value || "").trim();
      const exact = exactBtn?.getAttribute("aria-checked") === "true";

      if (clearBtn) clearBtn.hidden = q.length === 0;

      if (q.length < 1) {
        if (empty) empty.hidden = false;
        if (results) results.hidden = true;
        return;
      }

      if (empty) empty.hidden = true;
      if (results) results.hidden = false;

      const needle = q.toLowerCase();
      const filtered = SAMPLE.filter((item) => {
        if (tab !== "all" && item.scope !== tab) return false;
        return matchesQuery(item, needle, exact);
      });
      renderList(filtered);
    }

    input?.addEventListener("input", update);
    clearBtn?.addEventListener("click", () => {
      if (!input) return;
      input.value = "";
      input.focus();
      update();
    });

    const params = new URLSearchParams(window.location.search);
    const qParam = params.get("q");
    if (qParam && input) {
      input.value = qParam;
    }

    update();
    window.setTimeout(() => input?.focus(), 50);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSearchPage);
  } else {
    initSearchPage();
  }
})();
