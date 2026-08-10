(() => {
  "use strict";

  if (!document.body.classList.contains("mh-page--history-record")) return;

  const page = document.body.dataset.page || "";
  const isTxPage = page === "transaction-history";
  const isBetHistoryPage = page === "bet-history";

  const TX_DEMO_ROWS = [
    {
      id: "12638",
      type: "Withdrawal",
      typeKey: "withdrawals",
      remark: "Processed",
      amount: "-69.00",
      amountValue: -69,
      amountTone: "neg",
      date: "27/07/2026 14:06 (GMT+8)",
      status: "Approved",
      statusKey: "approved",
    },
    {
      id: "12637",
      type: "Deposit",
      typeKey: "deposits",
      remark: "Processed",
      amount: "50.00",
      amountValue: 50,
      amountTone: "pos",
      date: "27/07/2026 13:54 (GMT+8)",
      status: "Approved",
      statusKey: "approved",
    },
    {
      id: "11775",
      type: "Deposit",
      typeKey: "deposits",
      remark: "Processed",
      amount: "50.00",
      amountValue: 50,
      amountTone: "pos",
      date: "13/07/2026 15:18 (GMT+8)",
      status: "Approved",
      statusKey: "approved",
    },
    {
      id: "11774",
      type: "Deposit",
      typeKey: "deposits",
      remark: "Processed",
      amount: "50.00",
      amountValue: 50,
      amountTone: "pos",
      date: "13/07/2026 15:02 (GMT+8)",
      status: "Approved",
      statusKey: "approved",
    },
  ];

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function toast(msg) {
    const el = $("#mh-toast");
    if (!el) return;
    el.hidden = false;
    el.textContent = msg;
    window.clearTimeout(toast._t);
    toast._t = window.setTimeout(() => {
      el.hidden = true;
    }, 2200);
  }

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function formatDate(d) {
    return `${pad2(d.getDate())}-${pad2(d.getMonth() + 1)}-${d.getFullYear()}`;
  }

  function formatMoney(n) {
    const abs = Math.abs(n).toFixed(2);
    return (n < 0 ? "-" : "") + abs;
  }

  function startOfDay(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  function periodRange(key) {
    const now = new Date();
    const today = startOfDay(now);
    let start = today;
    let end = today;

    switch (key) {
      case "today":
        start = today;
        break;
      case "yesterday":
        start = new Date(today);
        start.setDate(start.getDate() - 1);
        end = start;
        break;
      case "last-week": {
        const day = today.getDay();
        const mondayThisWeek = new Date(today);
        mondayThisWeek.setDate(today.getDate() - ((day + 6) % 7));
        end = new Date(mondayThisWeek);
        end.setDate(end.getDate() - 1);
        start = new Date(end);
        start.setDate(start.getDate() - 6);
        break;
      }
      case "this-week": {
        const dow = today.getDay();
        start = new Date(today);
        start.setDate(today.getDate() - ((dow + 6) % 7));
        break;
      }
      case "this-month":
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case "last-month":
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      default:
        start = today;
    }

    return { start: formatDate(start), end: formatDate(end) };
  }

  function parseDateInput(value) {
    const parts = String(value || "").trim().split("-");
    if (parts.length !== 3) return null;
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    if (!day || month < 0 || !year) return null;
    return new Date(year, month, day);
  }

  function emptyHtml() {
    return `<div class="mh-hr-empty" id="mh-hr-empty" role="status">
      <p class="mh-hr-empty__title">No Data Found</p>
    </div>`;
  }

  function readColumns() {
    return $$(".mh-hr-table-head [data-col]").map((el, index) => ({
      key: el.getAttribute("data-col") || "",
      label: el.textContent.trim(),
      index,
    }));
  }

  function filterTxRows(typeValue, statusValue) {
    return TX_DEMO_ROWS.filter((row) => {
      const typeOk =
        !typeValue ||
        typeValue === "all" ||
        (typeValue === "deposits" && row.typeKey === "deposits") ||
        (typeValue === "withdrawals" && row.typeKey === "withdrawals");
      const statusOk =
        !statusValue ||
        statusValue === "all" ||
        row.statusKey === statusValue ||
        (statusValue === "completed" && row.statusKey === "approved");
      return typeOk && statusOk;
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function roundMoney(n) {
    return Math.round((Number(n) + Number.EPSILON) * 100) / 100;
  }

  function parseNum(value) {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }

  /* —— Bet History (synced with DsBetFlow / desktop account) —— */
  function loadBetHistorySource() {
    if (window.DsBetFlow && typeof window.DsBetFlow.getBetHistory === "function") {
      return window.DsBetFlow.getBetHistory();
    }
    return [];
  }

  function betMatchesType(bet, typeValue) {
    const category = String(bet.category || "").toLowerCase();
    const league = String(bet.league || "");
    if (!typeValue || typeValue === "all") return true;
    if (typeValue === "sports") return category === "sports" || category === "esports";
    if (typeValue === "casino") return category === "casino" && !/live/i.test(league);
    if (typeValue === "live") return category === "casino" && /live/i.test(league);
    return true;
  }

  function betMatchesStatus(bet, statusValue) {
    const statusKey = String(bet.status || "").toLowerCase();
    if (!statusValue || statusValue === "all") return true;
    if (statusValue === "open") {
      return statusKey === "open" || statusKey === "running" || statusKey === "unsettled";
    }
    if (statusValue === "lost") return statusKey === "lost" || statusKey === "loss";
    return statusKey === statusValue;
  }

  function betMatchesDateRange(bet, start, end) {
    if (!start && !end) return true;
    const parts = String(bet.dateKey || "").split("-").map(Number);
    if (parts.length !== 3 || !parts[0]) return true;
    const day = new Date(parts[0], parts[1] - 1, parts[2]);
    if (start && day < startOfDay(start)) return false;
    if (end && day > startOfDay(end)) return false;
    return true;
  }

  function isOpenStatus(status) {
    return /^(open|running|unsettled)$/i.test(String(status || ""));
  }

  function normalizeStatus(status) {
    const raw = String(status || "Open");
    if (/^lost$/i.test(raw)) return "Loss";
    if (/^(unsettled|running)$/i.test(raw)) return "Open";
    return raw;
  }

  function potentialWin(bet) {
    const stake = parseNum(bet.stake);
    const odds = parseNum(bet.odds);
    if (odds > 0) return roundMoney(stake * odds);
    return parseNum(bet.winnings);
  }

  function settledReturn(bet) {
    const status = String(bet.status || "").toLowerCase();
    const stake = parseNum(bet.stake);
    if (status === "won") return parseNum(bet.winnings) || potentialWin(bet);
    if (status === "sold") return parseNum(bet.winnings);
    if (status === "void" || status === "cancelled") return stake;
    if (status === "lost" || status === "loss") return 0;
    return 0;
  }

  function formatPlacedShort(bet) {
    const placed = String(bet.placedAt || "");
    if (placed) return placed.replace(", ", ", ");
    const parts = String(bet.dateKey || "").split("-");
    if (parts.length === 3) {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const m = months[Number(parts[1]) - 1] || parts[1];
      return `${Number(parts[2])} ${m}`;
    }
    return "—";
  }

  function toBetCard(bet) {
    const statusRaw = String(bet.status || "Open");
    const statusKey = statusRaw.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const stake = parseNum(bet.stake);
    let winnings = 0;
    let winTone = "";

    if (/^lost$/i.test(statusRaw)) {
      winnings = potentialWin(bet);
      winTone = "strike";
    } else if (/^won$/i.test(statusRaw)) {
      winnings = parseNum(bet.winnings) || potentialWin(bet);
      winTone = "pos";
    } else if (/^sold$/i.test(statusRaw)) {
      winnings = parseNum(bet.winnings);
      winTone = winnings >= stake ? "pos" : "neg";
    } else if (/^(void|cancelled)$/i.test(statusRaw)) {
      winnings = stake;
    } else {
      winnings = potentialWin(bet);
      winTone = "open";
    }

    return {
      id: String(bet.id || ""),
      icon: bet.icon || "../assets/icons/sport-football.svg",
      league: bet.league || "",
      match: bet.match || "—",
      betType: bet.betType || "Single",
      odds: bet.odds && String(bet.odds) !== "—" ? String(bet.odds) : "—",
      stake: stake.toFixed(2),
      stakeValue: stake,
      winnings: winnings.toFixed(2),
      winTone,
      status: normalizeStatus(statusRaw),
      statusKey: statusKey === "loss" ? "lost" : statusKey,
      placed: formatPlacedShort(bet),
      isOpen: isOpenStatus(statusRaw),
      returnValue: isOpenStatus(statusRaw) ? 0 : settledReturn(bet),
      category: bet.category || "",
    };
  }

  function filterBetCards(typeValue, statusValue, start, end) {
    return loadBetHistorySource()
      .filter(
        (bet) =>
          betMatchesType(bet, typeValue) &&
          betMatchesStatus(bet, statusValue) &&
          betMatchesDateRange(bet, start, end)
      )
      .map(toBetCard);
  }

  function computeKpis(cards) {
    let totalStake = 0;
    let settledStake = 0;
    let totalReturn = 0;
    cards.forEach((row) => {
      totalStake += row.stakeValue;
      if (!row.isOpen) {
        settledStake += row.stakeValue;
        totalReturn += row.returnValue;
      }
    });
    return {
      totalStake: roundMoney(totalStake),
      settledStake: roundMoney(settledStake),
      net: roundMoney(totalReturn - settledStake),
    };
  }

  function updateBetKpi(kpis, hasRows) {
    const root = $("#mh-bh-kpi");
    if (!root) return;
    root.hidden = !hasRows;
    const stakeEl = root.querySelector('[data-mh-bh-kpi="stake"]');
    const settledEl = root.querySelector('[data-mh-bh-kpi="settled"]');
    const netEl = root.querySelector('[data-mh-bh-kpi="net"]');
    if (stakeEl) stakeEl.textContent = kpis.totalStake.toFixed(2);
    if (settledEl) settledEl.textContent = kpis.settledStake.toFixed(2);
    if (netEl) {
      netEl.textContent = kpis.net > 0 ? `+${kpis.net.toFixed(2)}` : formatMoney(kpis.net);
      netEl.classList.toggle("is-pos", kpis.net > 0);
      netEl.classList.toggle("is-neg", kpis.net < 0);
    }
  }

  function resolveIconPath(icon) {
    const src = String(icon || "");
    if (!src) return "../assets/icons/sport-football.svg";
    if (src.startsWith("assets/")) return `../${src}`;
    if (src.startsWith("../") || src.startsWith("/") || src.startsWith("http")) return src;
    return src;
  }

  function renderBetCards(cards) {
    return cards
      .map((row) => {
        const winCls = ["mh-bh-card__value"];
        if (row.winTone === "pos") winCls.push("is-pos");
        if (row.winTone === "neg") winCls.push("is-neg");
        if (row.winTone === "open") winCls.push("is-open");
        if (row.winTone === "strike") winCls.push("is-strike");

        const winHtml =
          row.winTone === "strike"
            ? `<span class="mh-bh-card__strike">MYR ${escapeHtml(row.winnings)}</span>`
            : `MYR ${escapeHtml(row.winnings)}`;

        return (
          `<article class="mh-bh-card" data-bet-id="${escapeHtml(row.id)}">` +
            `<header class="mh-bh-card__head">` +
              `<div class="mh-bh-card__league">` +
                `<span class="mh-bh-card__icon" aria-hidden="true">` +
                  `<img src="${escapeHtml(resolveIconPath(row.icon))}" alt="" width="18" height="18" />` +
                `</span>` +
                `<span class="mh-bh-card__league-name">${escapeHtml(row.league || "Sports")}</span>` +
              `</div>` +
              `<span class="mh-bh-card__status mh-bh-card__status--${escapeHtml(row.statusKey)}">${escapeHtml(row.status)}</span>` +
            `</header>` +
            `<h3 class="mh-bh-card__match">${escapeHtml(row.match)}</h3>` +
            `<div class="mh-bh-card__grid">` +
              `<div class="mh-bh-card__field">` +
                `<span class="mh-bh-card__label">Type</span>` +
                `<strong class="mh-bh-card__value">${escapeHtml(row.betType)}</strong>` +
              `</div>` +
              `<div class="mh-bh-card__field">` +
                `<span class="mh-bh-card__label">Odds</span>` +
                `<strong class="mh-bh-card__value">${escapeHtml(row.odds)}</strong>` +
              `</div>` +
              `<div class="mh-bh-card__field">` +
                `<span class="mh-bh-card__label">Stake</span>` +
                `<strong class="mh-bh-card__value">MYR ${escapeHtml(row.stake)}</strong>` +
              `</div>` +
              `<div class="mh-bh-card__field">` +
                `<span class="mh-bh-card__label">Payout</span>` +
                `<strong class="${winCls.join(" ")}">${winHtml}</strong>` +
              `</div>` +
              `<div class="mh-bh-card__field">` +
                `<span class="mh-bh-card__label">Bet ID</span>` +
                `<button type="button" class="mh-bh-card__id" data-mh-bh-copy="${escapeHtml(row.id)}">${escapeHtml(row.id)}</button>` +
              `</div>` +
              `<div class="mh-bh-card__field">` +
                `<span class="mh-bh-card__label">Placed</span>` +
                `<span class="mh-bh-card__meta">${escapeHtml(row.placed)}</span>` +
              `</div>` +
            `</div>` +
          `</article>`
        );
      })
      .join("");
  }

  function renderBetHistoryResults(cards) {
    const body = $("#mh-hr-body");
    if (!body) return;
    const kpis = computeKpis(cards);
    updateBetKpi(kpis, cards.length > 0);
    if (!cards.length) {
      body.innerHTML = emptyHtml();
      return;
    }
    body.innerHTML = `<div class="mh-bh-cards">${renderBetCards(cards)}</div>`;
  }

  function currentBetFilters() {
    const typeSelect = $("#mh-hr-type");
    const statusSelect = $("#mh-hr-status");
    const start = parseDateInput($("#mh-hr-start")?.value);
    const end = parseDateInput($("#mh-hr-end")?.value);
    return {
      typeValue: typeSelect?.value || "sports",
      statusValue: statusSelect?.value || "all",
      start,
      end,
    };
  }

  function refreshBetHistory() {
    const { typeValue, statusValue, start, end } = currentBetFilters();
    renderBetHistoryResults(filterBetCards(typeValue, statusValue, start, end));
  }

  function renderRows(rows, columns) {
    return rows
      .map((row) => {
        return (
          `<div class="mh-hr-row">` +
          columns
            .map((col) => {
              const val = row[col.key] || "";
              if (col.key === "status" && row.statusKey) {
                return (
                  `<div class="mh-hr-cell mh-hr-cell--status">` +
                  `<span class="mh-hr-status mh-hr-status--${escapeHtml(row.statusKey)}">${escapeHtml(val)}</span>` +
                  `</div>`
                );
              }
              let cls = `mh-hr-cell mh-hr-cell--${col.key}`;
              if (col.key === "amount") {
                cls += " mh-hr-cell--amount";
                if (row.amountTone) cls += ` is-${row.amountTone}`;
              }
              return `<div class="${cls}">${escapeHtml(val)}</div>`;
            })
            .join("") +
          `</div>`
        );
      })
      .join("");
  }

  function renderGrandTotal(rows) {
    if (!isTxPage || !rows.length) return "";
    const total = rows.reduce((sum, row) => sum + (typeof row.amountValue === "number" ? row.amountValue : 0), 0);
    const tone = total < 0 ? "neg" : "pos";

    return (
      `<div class="mh-hr-row mh-hr-row--total" role="row">` +
      `<div class="mh-hr-cell mh-hr-cell--total-label">Grand Total</div>` +
      `<div class="mh-hr-cell mh-hr-cell--amount is-${tone}">${escapeHtml(formatMoney(total))}</div>` +
      `</div>`
    );
  }

  function renderResults(rows) {
    const body = $("#mh-hr-body");
    if (!body) return;
    const columns = readColumns();
    if (!rows.length) {
      body.innerHTML = emptyHtml();
      return;
    }
    body.innerHTML = renderRows(rows, columns) + renderGrandTotal(rows);
  }

  function renderEmpty() {
    if (isBetHistoryPage) {
      renderBetHistoryResults([]);
      return;
    }
    renderResults([]);
  }

  function setPeriod(key) {
    const range = periodRange(key);
    const startInput = $("#mh-hr-start");
    const endInput = $("#mh-hr-end");
    if (startInput) startInput.value = range.start;
    if (endInput) endInput.value = range.end;
    $$("[data-mh-hr-period]").forEach((btn) => {
      btn.classList.toggle("is-active", btn.getAttribute("data-mh-hr-period") === key);
    });
  }

  function refreshTxResults() {
    if (isBetHistoryPage) {
      refreshBetHistory();
      return;
    }
    if (!isTxPage) {
      renderEmpty();
      return;
    }
    const typeSelect = $("#mh-hr-type");
    const statusSelect = $("#mh-hr-status");
    const typeValue = typeSelect?.value || "all";
    const statusValue = statusSelect?.value || "all";
    if (typeValue.indexOf(".html") !== -1) {
      renderEmpty();
      return;
    }
    renderResults(filterTxRows(typeValue, statusValue));
  }

  function initAuth() {
    try {
      if (localStorage.getItem("mh-logged-in-v1") !== "1") {
        window.location.replace("login.html");
        return false;
      }
    } catch (_) {
      /* continue */
    }
    return true;
  }

  function init() {
    if (!initAuth()) return;

    const form = $("#mh-hr-form");
    const typeSelect = $("#mh-hr-type");
    const statusSelect = $("#mh-hr-status");
    const recordTypeSelect = $("#mh-hr-record-type");
    const titleEl = $(".mh-hr-subbar__title");
    const labelText = titleEl ? titleEl.textContent.trim() : "Record";

    setPeriod(isTxPage ? "last-month" : "this-week");
    refreshTxResults();

    recordTypeSelect?.addEventListener("change", () => {
      const href = recordTypeSelect.value;
      const current = `${page}.html`;
      if (href && href !== current) {
        window.location.href = href;
      }
    });

    $$("[data-mh-hr-period]").forEach((btn) => {
      btn.addEventListener("click", () => {
        setPeriod(btn.getAttribute("data-mh-hr-period"));
        if (isBetHistoryPage) refreshBetHistory();
      });
    });

    typeSelect?.addEventListener("change", () => {
      const value = typeSelect.value;
      if (value && value.indexOf(".html") !== -1) {
        toast(`${typeSelect.options[typeSelect.selectedIndex].text} (demo)`);
        typeSelect.value = isBetHistoryPage ? "sports" : "all";
        refreshTxResults();
        return;
      }
      refreshTxResults();
    });

    statusSelect?.addEventListener("change", () => {
      refreshTxResults();
    });

    if (isBetHistoryPage) {
      document.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-mh-bh-copy]");
        if (!btn) return;
        const id = btn.getAttribute("data-mh-bh-copy") || "";
        if (!id) return;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(id).then(
            () => toast("Bet ID copied"),
            () => toast(id)
          );
        } else {
          toast(id);
        }
      });
    }

    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const start = parseDateInput($("#mh-hr-start")?.value);
      const end = parseDateInput($("#mh-hr-end")?.value);
      if (!start || !end) {
        toast("Enter valid start and end dates (DD-MM-YYYY)");
        renderEmpty();
        return;
      }
      if (start > end) {
        toast("Start date must be before end date");
        renderEmpty();
        return;
      }

      if (isTxPage) {
        refreshTxResults();
        return;
      }

      if (isBetHistoryPage) {
        const cards = filterBetCards(
          typeSelect?.value || "sports",
          statusSelect?.value || "all",
          start,
          end
        );
        renderBetHistoryResults(cards);
        if (!cards.length) {
          const typeLabel = typeSelect?.options[typeSelect.selectedIndex]?.text || labelText;
          const statusLabel =
            statusSelect && statusSelect.value !== "all"
              ? statusSelect.options[statusSelect.selectedIndex].text
              : "";
          toast(
            `No ${typeLabel.toLowerCase()}${
              statusLabel ? ` (${statusLabel.toLowerCase()})` : ""
            } found for selected period`
          );
        }
        return;
      }

      renderEmpty();
      const typeLabel = typeSelect?.options[typeSelect.selectedIndex]?.text || labelText;
      const statusLabel =
        statusSelect && statusSelect.value !== "all"
          ? statusSelect.options[statusSelect.selectedIndex].text
          : "";
      toast(
        `No ${typeLabel.toLowerCase()}${
          statusLabel ? ` (${statusLabel.toLowerCase()})` : ""
        } found for selected period (demo)`
      );
    });

    document.body.dataset.mhHistoryReady = page || "1";
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
