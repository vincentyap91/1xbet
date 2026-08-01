(() => {
  const SAMPLE = [
    {
      sport: "Football",
      sportIcon: "assets/icons/sport-football.svg",
      league: "UEFA Champions League",
      scope: "line",
      home: "Paris Saint-Germain",
      homeLogo: "assets/images/mobile-home/teams/team-01.webp",
      away: "Borussia Dortmund",
      awayLogo: "assets/images/mobile-home/teams/team-02.webp",
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
      homeLogo: "assets/images/mobile-home/teams/team-03.webp",
      away: "Manchester City",
      awayLogo: "assets/images/mobile-home/teams/team-04.webp",
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
      homeLogo: "assets/images/mobile-home/teams/team-05.webp",
      away: "Barcelona",
      awayLogo: "assets/images/mobile-home/teams/team-06.webp",
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
      homeLogo: "assets/images/mobile-home/teams/team-07.webp",
      away: "Vitality",
      awayLogo: "assets/images/mobile-home/teams/team-08.webp",
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
      homeLogo: "assets/images/mobile-home/teams/team-09.webp",
      away: "Chelsea",
      awayLogo: "assets/images/mobile-home/teams/team-10.webp",
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
      return (
        hay.split(/\s+/).includes(q) ||
        item.league.toLowerCase() === q ||
        item.home.toLowerCase() === q ||
        item.away.toLowerCase() === q
      );
    }
    return hay.includes(q);
  }

  function renderList(items) {
    const list = $("#se-list");
    if (!list) return;

    if (!items.length) {
      list.innerHTML = `<p class="se-none">No events found</p>`;
      return;
    }

    const groups = new Map();
    items.forEach((item) => {
      const key = `${item.sport}::${item.league}`;
      if (!groups.has(key)) {
        groups.set(key, {
          sport: item.sport,
          sportIcon: item.sportIcon,
          league: item.league,
          matches: [],
        });
      }
      groups.get(key).matches.push(item);
    });

    list.innerHTML = Array.from(groups.values())
      .map((group) => {
        const matchesHtml = group.matches
          .map((m) => {
            const odds = m.odds
              .map(
                (o) =>
                  `<button type="button" class="se-odds__btn" data-toast="Odds ${escapeHtml(o.val)}"><span class="se-odds__lab">${escapeHtml(o.lab)}</span><span class="se-odds__val">${escapeHtml(o.val)}</span></button>`
              )
              .join("");
            return `<article class="se-match">
              <div class="se-match__teams">
                <p class="se-match__team"><img src="${escapeHtml(m.homeLogo)}" alt="" width="20" height="20" />${escapeHtml(m.home)}</p>
                <p class="se-match__team"><img src="${escapeHtml(m.awayLogo)}" alt="" width="20" height="20" />${escapeHtml(m.away)}</p>
              </div>
              <p class="se-match__meta">${escapeHtml(m.meta)}</p>
              <div class="se-match__odds">${odds}</div>
            </article>`;
          })
          .join("");

        return `<section class="se-group">
          <p class="se-group__sport"><img src="${escapeHtml(group.sportIcon)}" alt="" width="14" height="14" />${escapeHtml(group.sport)}</p>
          <div class="se-league">
            <button type="button" class="se-league__star" data-toast="Favourites — sign in to sync" aria-label="Favourite">
              <img src="mobile/assets/icons/sp-star.svg" alt="" width="16" height="16" />
            </button>
            <a href="#" class="se-league__name">${escapeHtml(group.league)}</a>
          </div>
          ${matchesHtml}
        </section>`;
      })
      .join("");
  }

  function initSearchPage() {
    if (document.body.getAttribute("data-page") !== "search") return;

    const input = $("#se-input");
    const clearBtn = $("#se-clear");
    const empty = $("#se-empty");
    const results = $("#se-results");
    const exactBtn = $("#se-exact");
    const back = $("#se-back");
    let tab = "all";

    if (back) {
      back.addEventListener("click", (e) => {
        if (history.length <= 1) {
          e.preventDefault();
          window.location.href = "index.html";
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

    $$("[data-se-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        tab = btn.getAttribute("data-se-tab") || "all";
        $$("[data-se-tab]").forEach((t) => {
          const on = t === btn;
          t.classList.toggle("is-active", on);
          t.setAttribute("aria-selected", on ? "true" : "false");
        });
        update();
      });
    });

    document.addEventListener("click", (e) => {
      const toastBtn = e.target.closest("[data-toast]");
      if (!toastBtn) return;
      e.preventDefault();
      const msg = toastBtn.getAttribute("data-toast");
      if (msg && typeof window.showToast === "function") window.showToast(msg);
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
    if (qParam && input) input.value = qParam;

    update();
    window.setTimeout(() => input?.focus(), 50);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSearchPage);
  } else {
    initSearchPage();
  }
})();
