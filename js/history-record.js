/* history-record.js — shared History Record table pages */
(function () {
  'use strict';

  var HISTORY_PAGES = [
    'transaction-history',
    'bet-history',
    'commission-record',
    'rebate-record',
    'checkin-record',
    'promotion-record'
  ];

  var pageKey = document.body.dataset.page;
  if (HISTORY_PAGES.indexOf(pageKey) === -1) return;
  if (!document.querySelector('.tx-record-content')) return;

  /* Demo deposit / withdrawal rows (Transaction History reference) */
  var TX_DEMO_ROWS = [
    {
      id: '12638',
      type: 'Withdrawal',
      typeKey: 'withdrawals',
      remark: 'Processed',
      amount: '-69.00',
      amountValue: -69,
      amountTone: 'neg',
      date: '27/07/2026 14:06 (GMT+8)',
      status: 'Approved',
      statusKey: 'approved'
    },
    {
      id: '12637',
      type: 'Deposit',
      typeKey: 'deposits',
      remark: 'Processed',
      amount: '50.00',
      amountValue: 50,
      amountTone: 'pos',
      date: '27/07/2026 13:54 (GMT+8)',
      status: 'Approved',
      statusKey: 'approved'
    },
    {
      id: '11775',
      type: 'Deposit',
      typeKey: 'deposits',
      remark: 'Processed',
      amount: '50.00',
      amountValue: 50,
      amountTone: 'pos',
      date: '13/07/2026 15:18 (GMT+8)',
      status: 'Approved',
      statusKey: 'approved'
    },
    {
      id: '11774',
      type: 'Deposit',
      typeKey: 'deposits',
      remark: 'Processed',
      amount: '50.00',
      amountValue: 50,
      amountTone: 'pos',
      date: '13/07/2026 15:02 (GMT+8)',
      status: 'Approved',
      statusKey: 'approved'
    }
  ];

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function pad2(n) {
    return String(n).padStart(2, '0');
  }

  function formatDate(d) {
    return pad2(d.getDate()) + '-' + pad2(d.getMonth() + 1) + '-' + d.getFullYear();
  }

  function formatMoney(n) {
    var abs = Math.abs(n).toFixed(2);
    return (n < 0 ? '-' : '') + abs;
  }

  function startOfDay(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  function periodRange(key) {
    var now = new Date();
    var today = startOfDay(now);
    var start;
    var end = today;

    switch (key) {
      case 'today':
        start = today;
        break;
      case 'yesterday':
        start = new Date(today);
        start.setDate(start.getDate() - 1);
        end = start;
        break;
      case 'last-week': {
        var day = today.getDay();
        var mondayThisWeek = new Date(today);
        mondayThisWeek.setDate(today.getDate() - ((day + 6) % 7));
        end = new Date(mondayThisWeek);
        end.setDate(end.getDate() - 1);
        start = new Date(end);
        start.setDate(start.getDate() - 6);
        break;
      }
      case 'this-week': {
        var dow = today.getDay();
        start = new Date(today);
        start.setDate(today.getDate() - ((dow + 6) % 7));
        break;
      }
      case 'this-month':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case 'last-month':
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      default:
        start = today;
    }

    return { start: formatDate(start), end: formatDate(end) };
  }

  function parseDateInput(value) {
    var parts = String(value || '').trim().split('-');
    if (parts.length !== 3) return null;
    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10) - 1;
    var year = parseInt(parts[2], 10);
    if (!day || month < 0 || !year) return null;
    return new Date(year, month, day);
  }

  function toast(msg) {
    if (typeof window.showToast === 'function') window.showToast(msg);
  }

  function filterTxRows(typeValue, statusValue) {
    return TX_DEMO_ROWS.filter(function (row) {
      var typeOk =
        !typeValue ||
        typeValue === 'all' ||
        (typeValue === 'deposits' && row.typeKey === 'deposits') ||
        (typeValue === 'withdrawals' && row.typeKey === 'withdrawals');
      var statusOk =
        !statusValue ||
        statusValue === 'all' ||
        row.statusKey === statusValue ||
        (statusValue === 'completed' && row.statusKey === 'approved');
      return typeOk && statusOk;
    });
  }

  function loadBetHistorySource() {
    if (window.DsBetFlow && typeof window.DsBetFlow.getBetHistory === 'function') {
      return window.DsBetFlow.getBetHistory();
    }
    return [];
  }

  function betMatchesType(bet, typeValue) {
    var category = String(bet.category || '').toLowerCase();
    var league = String(bet.league || '');
    if (!typeValue || typeValue === 'all') return true;
    if (typeValue === 'sports') return category === 'sports' || category === 'esports';
    if (typeValue === 'casino') return category === 'casino' && !/live/i.test(league);
    if (typeValue === 'live') {
      return category === 'casino' && /live/i.test(league);
    }
    return true;
  }

  function betMatchesStatus(bet, statusValue) {
    var statusKey = String(bet.status || '').toLowerCase();
    if (!statusValue || statusValue === 'all') return true;
    if (statusValue === 'open') {
      return statusKey === 'open' || statusKey === 'running' || statusKey === 'unsettled';
    }
    if (statusValue === 'lost') {
      return statusKey === 'lost' || statusKey === 'loss';
    }
    return statusKey === statusValue;
  }

  function betMatchesDateRange(bet, start, end) {
    if (!start && !end) return true;
    var parts = String(bet.dateKey || '').split('-').map(Number);
    if (parts.length !== 3 || !parts[0]) return true;
    var day = new Date(parts[0], parts[1] - 1, parts[2]);
    if (start && day < startOfDay(start)) return false;
    if (end && day > startOfDay(end)) return false;
    return true;
  }

  function filterRawBets(typeValue, statusValue, start, end) {
    return loadBetHistorySource().filter(function (bet) {
      return (
        betMatchesType(bet, typeValue) &&
        betMatchesStatus(bet, statusValue) &&
        betMatchesDateRange(bet, start, end)
      );
    });
  }

  function isOpenBetStatus(status) {
    return /^(open|running|unsettled)$/i.test(String(status || ''));
  }

  function isSettledBetStatus(status) {
    return !isOpenBetStatus(status);
  }

  function normalizeBetStatusDisplay(status) {
    var raw = String(status || 'Open');
    if (/^lost$/i.test(raw)) return 'Loss';
    if (/^(unsettled|running)$/i.test(raw)) return 'Open';
    return raw;
  }

  function parseBetNumber(value) {
    var n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }

  function potentialWinAmount(bet) {
    var stake = parseBetNumber(bet.stake);
    var odds = parseBetNumber(bet.odds);
    if (odds > 0) return roundMoney(stake * odds);
    return parseBetNumber(bet.winnings);
  }

  function roundMoney(n) {
    return Math.round((Number(n) + Number.EPSILON) * 100) / 100;
  }

  function settledReturnAmount(bet) {
    var status = String(bet.status || '').toLowerCase();
    var stake = parseBetNumber(bet.stake);
    if (status === 'won') return parseBetNumber(bet.winnings) || potentialWinAmount(bet);
    if (status === 'sold') return parseBetNumber(bet.winnings);
    if (status === 'void' || status === 'cancelled') return stake;
    if (status === 'lost' || status === 'loss') return 0;
    return 0;
  }

  function formatBetDate(bet) {
    var parts = String(bet.dateKey || '').split('-');
    var time = '';
    var placed = String(bet.placedAt || '');
    var timeMatch = placed.match(/(\d{1,2}:\d{2})\s*$/);
    if (timeMatch) time = timeMatch[1];
    if (parts.length === 3) {
      return parts[2] + '/' + parts[1] + '/' + parts[0] + (time ? ' / ' + time : '');
    }
    return placed || bet.dateLabel || '—';
  }

  function getProviderName(bet) {
    var category = String(bet.category || '').toLowerCase();
    if (category === 'casino') return bet.league || 'Casino';
    if (category === 'esports') return 'Esports';
    return 'SBO Sports';
  }

  function toBetDetailRow(bet) {
    var statusRaw = String(bet.status || 'Open');
    var statusKey = statusRaw.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (statusKey === 'lost') statusKey = 'lost';
    var stake = parseBetNumber(bet.stake);
    var winAmount = 0;
    var winStrike = false;
    var winTone = '';

    if (/^lost$/i.test(statusRaw)) {
      winAmount = potentialWinAmount(bet);
      winStrike = true;
    } else if (/^won$/i.test(statusRaw)) {
      winAmount = parseBetNumber(bet.winnings) || potentialWinAmount(bet);
      winTone = 'pos';
    } else if (/^sold$/i.test(statusRaw)) {
      winAmount = parseBetNumber(bet.winnings);
      winTone = winAmount >= stake ? 'pos' : 'neg';
    } else if (/^(void|cancelled)$/i.test(statusRaw)) {
      winAmount = stake;
    } else {
      winAmount = potentialWinAmount(bet);
      winTone = 'open';
    }

    return {
      id: String(bet.id || ''),
      icon: bet.icon || 'assets/icons/sport-football.svg',
      match: bet.match || '—',
      league: bet.league || '',
      slip: String(bet.id || '—'),
      date: formatBetDate(bet),
      betType: bet.betType || 'Single',
      stake: stake.toFixed(2),
      stakeValue: stake,
      odds: bet.odds && String(bet.odds) !== '—' ? String(bet.odds) : '—',
      status: normalizeBetStatusDisplay(statusRaw),
      statusKey: statusKey === 'loss' ? 'lost' : statusKey,
      win: winAmount.toFixed(2),
      winValue: winAmount,
      winStrike: winStrike,
      winTone: winTone,
      provider: getProviderName(bet),
      category: bet.category || '',
      isOpen: isOpenBetStatus(statusRaw),
      isSettled: isSettledBetStatus(statusRaw),
      returnValue: isSettledBetStatus(statusRaw) ? settledReturnAmount(bet) : 0
    };
  }

  function filterBetDetailRows(typeValue, statusValue, start, end) {
    return filterRawBets(typeValue, statusValue, start, end).map(toBetDetailRow);
  }

  function computeBetKpis(rows) {
    var totalStake = 0;
    var settledStake = 0;
    var totalReturn = 0;
    var openStake = 0;

    rows.forEach(function (row) {
      totalStake += row.stakeValue;
      if (row.isOpen) {
        openStake += row.stakeValue;
      } else {
        settledStake += row.stakeValue;
        totalReturn += row.returnValue;
      }
    });

    return {
      totalStake: roundMoney(totalStake),
      totalReturn: roundMoney(totalReturn),
      net: roundMoney(totalReturn - settledStake),
      openStake: roundMoney(openStake),
      settledStake: roundMoney(settledStake)
    };
  }

  function aggregateProviderSummary(rows) {
    var map = {};
    var order = [];

    rows.forEach(function (row) {
      if (row.isOpen) return;
      var key = row.provider || 'Other';
      if (!map[key]) {
        map[key] = { provider: key, turnover: 0, winLoss: 0 };
        order.push(key);
      }
      map[key].turnover += row.stakeValue;
      map[key].winLoss += row.returnValue - row.stakeValue;
    });

    return order.map(function (key) {
      var item = map[key];
      return {
        provider: item.provider,
        turnover: roundMoney(item.turnover).toFixed(2),
        turnoverValue: roundMoney(item.turnover),
        winLoss: formatMoney(roundMoney(item.winLoss)),
        winLossValue: roundMoney(item.winLoss),
        amountTone: item.winLoss < 0 ? 'neg' : item.winLoss > 0 ? 'pos' : ''
      };
    });
  }

  function updateBetKpi(kpis) {
    var root = document.getElementById('bh-kpi');
    if (!root) return;
    var stakeEl = root.querySelector('[data-bh-kpi="stake"]');
    var settledEl = root.querySelector('[data-bh-kpi="settled"]');
    var netEl = root.querySelector('[data-bh-kpi="net"]');
    if (stakeEl) stakeEl.textContent = kpis.totalStake.toFixed(2);
    if (settledEl) settledEl.textContent = kpis.settledStake.toFixed(2);
    if (netEl) {
      netEl.textContent = kpis.net > 0 ? '+' + kpis.net.toFixed(2) : formatMoney(kpis.net);
      netEl.classList.toggle('is-pos', kpis.net > 0);
      netEl.classList.toggle('is-neg', kpis.net < 0);
      netEl.classList.toggle('is-zero', kpis.net === 0);
    }
  }

  function renderBetDetailRows(rows) {
    return rows
      .map(function (row) {
        var winCls = 'tx-record-cell tx-record-cell--win tx-record-cell--amount';
        if (row.winTone) winCls += ' is-' + row.winTone;
        if (row.winStrike) winCls += ' is-strike';
        var winHtml = row.winStrike
          ? '<span class="bh-win-strike">' + escapeHtml(row.win) + ' MYR</span>'
          : escapeHtml(row.win) + ' MYR';

        return (
          '<div class="tx-record-row bh-detail-row">' +
            '<div class="tx-record-cell tx-record-cell--event">' +
              '<div class="bh-event">' +
                '<span class="bh-event-icon"><img src="' + escapeHtml(row.icon) + '" alt="" width="16" height="16" /></span>' +
                '<span class="bh-event-text">' +
                  '<strong class="bh-event-match">' + escapeHtml(row.match) + '</strong>' +
                  (row.league ? '<small class="bh-event-league">' + escapeHtml(row.league) + '</small>' : '') +
                '</span>' +
              '</div>' +
            '</div>' +
            '<div class="tx-record-cell tx-record-cell--slip">' +
              '<button type="button" class="bh-slip-id" data-bh-copy-slip="' + escapeHtml(row.slip) + '" title="Copy bet slip ID">' +
                escapeHtml(row.slip) +
              '</button>' +
            '</div>' +
            '<div class="tx-record-cell tx-record-cell--date">' + escapeHtml(row.date) + '</div>' +
            '<div class="tx-record-cell tx-record-cell--betType">' + escapeHtml(row.betType) + '</div>' +
            '<div class="tx-record-cell tx-record-cell--stake tx-record-cell--amount">' + escapeHtml(row.stake) + ' MYR</div>' +
            '<div class="tx-record-cell tx-record-cell--odds">' + escapeHtml(row.odds) + '</div>' +
            '<div class="tx-record-cell tx-record-cell--status">' +
              '<span class="tx-status tx-status--' + escapeHtml(row.statusKey) + '">' + escapeHtml(row.status) + '</span>' +
            '</div>' +
            '<div class="' + winCls + '">' + winHtml + '</div>' +
          '</div>'
        );
      })
      .join('');
  }

  function renderBetDetailFooter(kpis) {
    var tone = kpis.net < 0 ? 'neg' : kpis.net > 0 ? 'pos' : '';
    return (
      '<div class="tx-record-row tx-record-row--total bh-detail-total" role="row">' +
        '<div class="tx-record-cell tx-record-cell--total-label">Filter total</div>' +
        '<div class="tx-record-cell" aria-hidden="true"></div>' +
        '<div class="tx-record-cell" aria-hidden="true"></div>' +
        '<div class="tx-record-cell" aria-hidden="true"></div>' +
        '<div class="tx-record-cell tx-record-cell--stake tx-record-cell--amount">' +
          '<span class="bh-total-cap">Stake</span>' +
          '<strong>' + escapeHtml(kpis.totalStake.toFixed(2)) + '</strong>' +
        '</div>' +
        '<div class="tx-record-cell" aria-hidden="true"></div>' +
        '<div class="tx-record-cell" aria-hidden="true"></div>' +
        '<div class="tx-record-cell tx-record-cell--win tx-record-cell--amount' +
          (tone ? ' is-' + tone : '') +
          '">' +
          '<span class="bh-total-cap">Win/Loss</span>' +
          '<strong>' + escapeHtml(formatMoney(kpis.net)) + '</strong>' +
        '</div>' +
      '</div>'
    );
  }

  function renderBetSummaryRows(rows) {
    return rows
      .map(function (row) {
        return (
          '<div class="tx-record-row bh-summary-row">' +
            '<div class="tx-record-cell tx-record-cell--provider">' + escapeHtml(row.provider) + '</div>' +
            '<div class="tx-record-cell tx-record-cell--turnover tx-record-cell--amount">' +
              escapeHtml(row.turnover) +
            '</div>' +
            '<div class="tx-record-cell tx-record-cell--winLoss tx-record-cell--amount' +
              (row.amountTone ? ' is-' + row.amountTone : '') +
              '">' +
              escapeHtml(row.winLoss) +
            '</div>' +
          '</div>'
        );
      })
      .join('');
  }

  function renderBetSummaryFooter(rows) {
    var turnover = rows.reduce(function (sum, row) {
      return sum + row.turnoverValue;
    }, 0);
    var winLoss = rows.reduce(function (sum, row) {
      return sum + row.winLossValue;
    }, 0);
    var tone = winLoss < 0 ? 'neg' : winLoss > 0 ? 'pos' : '';
    return (
      '<div class="tx-record-row tx-record-row--total bh-summary-total" role="row">' +
        '<div class="tx-record-cell tx-record-cell--total-label">Total</div>' +
        '<div class="tx-record-cell tx-record-cell--turnover tx-record-cell--amount">' +
          escapeHtml(roundMoney(turnover).toFixed(2)) +
        '</div>' +
        '<div class="tx-record-cell tx-record-cell--winLoss tx-record-cell--amount' +
          (tone ? ' is-' + tone : '') +
          '">' +
          escapeHtml(formatMoney(roundMoney(winLoss))) +
        '</div>' +
      '</div>'
    );
  }

  function renderBetSlipCards(rows) {
    return (
      '<div class="bh-slip-cards">' +
      rows
        .map(function (row) {
          var winCls = 'bh-slip-card__value';
          if (row.winTone === 'pos') winCls += ' is-pos';
          if (row.winTone === 'neg') winCls += ' is-neg';
          if (row.winTone === 'open') winCls += ' is-open';
          if (row.winStrike) winCls += ' is-strike';
          var winHtml = row.winStrike
            ? '<span class="bh-win-strike">MYR ' + escapeHtml(row.win) + '</span>'
            : 'MYR ' + escapeHtml(row.win);
          var placed = String(row.date || '')
            .replace(/^(\d{2})\/(\d{2})\/(\d{4})\s*\/\s*/, function (_, d, m, y) {
              var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              return Number(d) + ' ' + (months[Number(m) - 1] || m) + ', ';
            });

          return (
            '<article class="bh-slip-card">' +
              '<header class="bh-slip-card__head">' +
                '<div class="bh-slip-card__league">' +
                  '<span class="bh-slip-card__icon"><img src="' + escapeHtml(row.icon) + '" alt="" width="16" height="16" /></span>' +
                  '<span class="bh-slip-card__league-name">' + escapeHtml(row.league || 'Sports') + '</span>' +
                '</div>' +
                '<span class="tx-status tx-status--' + escapeHtml(row.statusKey) + '">' + escapeHtml(row.status) + '</span>' +
              '</header>' +
              '<h3 class="bh-slip-card__match">' + escapeHtml(row.match) + '</h3>' +
              '<div class="bh-slip-card__grid">' +
                '<div class="bh-slip-card__field"><span class="bh-slip-card__label">Type</span><strong class="bh-slip-card__value">' + escapeHtml(row.betType) + '</strong></div>' +
                '<div class="bh-slip-card__field"><span class="bh-slip-card__label">Odds</span><strong class="bh-slip-card__value">' + escapeHtml(row.odds) + '</strong></div>' +
                '<div class="bh-slip-card__field"><span class="bh-slip-card__label">Stake</span><strong class="bh-slip-card__value">MYR ' + escapeHtml(row.stake) + '</strong></div>' +
                '<div class="bh-slip-card__field"><span class="bh-slip-card__label">Payout</span><strong class="' + winCls + '">' + winHtml + '</strong></div>' +
                '<div class="bh-slip-card__field"><span class="bh-slip-card__label">Bet ID</span><button type="button" class="bh-slip-id" data-bh-copy-slip="' + escapeHtml(row.slip) + '">' + escapeHtml(row.slip) + '</button></div>' +
                '<div class="bh-slip-card__field"><span class="bh-slip-card__label">Placed</span><span class="bh-slip-card__meta">' + escapeHtml(placed || row.date) + '</span></div>' +
              '</div>' +
            '</article>'
          );
        })
        .join('') +
      '</div>'
    );
  }

  function renderBetHistoryResults(detailRows) {
    var body = document.getElementById('tx-record-body');
    var summaryBody = document.getElementById('bh-summary-body');
    var kpis = computeBetKpis(detailRows);
    updateBetKpi(kpis);
    var useCards = window.matchMedia && window.matchMedia('(max-width: 900px)').matches;

    if (body) {
      if (!detailRows.length) {
        body.innerHTML =
          '<div class="acc-empty-panel pq-empty tx-record-empty" id="tx-record-empty" role="status">' +
            '<p class="acc-empty-title">No Data Found</p>' +
          '</div>';
      } else if (useCards) {
        body.innerHTML = renderBetSlipCards(detailRows) + renderBetDetailFooter(kpis);
      } else {
        body.innerHTML = renderBetDetailRows(detailRows) + renderBetDetailFooter(kpis);
      }
    }

    if (summaryBody) {
      var summaryRows = aggregateProviderSummary(detailRows);
      if (!summaryRows.length) {
        summaryBody.innerHTML =
          '<div class="acc-empty-panel pq-empty tx-record-empty" role="status">' +
            '<p class="acc-empty-title">No Data Found</p>' +
          '</div>';
      } else {
        summaryBody.innerHTML = renderBetSummaryRows(summaryRows) + renderBetSummaryFooter(summaryRows);
      }
    }
  }

  function setBetHistoryView(view) {
    var detailsPanel = document.getElementById('bh-details-panel');
    var summaryPanel = document.getElementById('bh-summary-panel');
    var tabs = document.querySelectorAll('[data-bh-view]');
    var isSummary = view === 'summary';

    tabs.forEach(function (tab) {
      var on = tab.getAttribute('data-bh-view') === view;
      tab.classList.toggle('is-active', on);
      tab.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    if (detailsPanel) detailsPanel.hidden = isSummary;
    if (summaryPanel) summaryPanel.hidden = !isSummary;
  }

  function renderRows(rows, columns) {
    return rows
      .map(function (row) {
        return (
          '<div class="tx-record-row">' +
            columns
              .map(function (col) {
                var val = row[col.key] || '';
                if (col.key === 'status' && row.statusKey) {
                  return (
                    '<div class="tx-record-cell tx-record-cell--status">' +
                      '<span class="tx-status tx-status--' + escapeHtml(row.statusKey) + '">' + escapeHtml(val) + '</span>' +
                    '</div>'
                  );
                }
                var cls = 'tx-record-cell tx-record-cell--' + col.key;
                if (col.key === 'amount' || col.key === 'stake' || col.key === 'bonus' || col.key === 'reward') {
                  cls += ' tx-record-cell--amount';
                  if (row.amountTone) cls += ' is-' + row.amountTone;
                }
                if (
                  col.key === 'description' ||
                  col.key === 'event' ||
                  col.key === 'source' ||
                  col.key === 'type' ||
                  col.key === 'promotion' ||
                  col.key === 'remark'
                ) {
                  cls += ' tx-record-cell--desc';
                }
                if (col.key === 'date' || col.key === 'day') {
                  cls += ' tx-record-cell--date';
                }
                return '<div class="' + cls + '">' + escapeHtml(val) + '</div>';
              })
              .join('') +
          '</div>'
        );
      })
      .join('');
  }

  function renderGrandTotal(rows, columns) {
    if (pageKey !== 'transaction-history' || !rows.length) return '';
    var total = rows.reduce(function (sum, row) {
      return sum + (typeof row.amountValue === 'number' ? row.amountValue : 0);
    }, 0);
    var tone = total < 0 ? 'neg' : 'pos';

    return (
      '<div class="tx-record-row tx-record-row--total" role="row">' +
        '<div class="tx-record-cell tx-record-cell--total-label">Grand Total</div>' +
        '<div class="tx-record-cell tx-record-cell--amount is-' +
        tone +
        '">' +
        escapeHtml(formatMoney(total)) +
        '</div>' +
      '</div>'
    );
  }

  function renderResults(rows, columns) {
    var body = document.getElementById('tx-record-body');
    if (!body) return;

    if (!rows.length) {
      body.innerHTML =
        '<div class="acc-empty-panel pq-empty tx-record-empty" id="tx-record-empty" role="status">' +
          '<p class="acc-empty-title">No Data Found</p>' +
        '</div>';
      return;
    }

    body.innerHTML = renderRows(rows, columns) + renderGrandTotal(rows, columns);
  }

  function readColumns() {
    var head = document.querySelector('.tx-record-table-head');
    if (!head) return [];
    return Array.prototype.slice.call(head.children).map(function (el, index) {
      var label = el.textContent.trim();
      var key = el.getAttribute('data-col') || label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      return { key: key, label: label, index: index };
    });
  }

  var RECORD_TYPE_OPTIONS = [
    { page: 'transaction-history', href: 'transaction-history.html', label: 'Transaction Record' },
    { page: 'commission-record', href: 'commission-record.html', label: 'Commission Record' },
    { page: 'rebate-record', href: 'rebate-record.html', label: 'Rebate Record' },
    { page: 'checkin-record', href: 'checkin-record.html', label: 'Daily Check In Record' }
  ];

  var STATUS_OPTIONS = [
    { value: 'all', label: 'All' },
    { value: 'approved', label: 'Approved' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  function fillSelect(select, options, selectedValue) {
    if (!select) return;
    select.innerHTML = '';
    options.forEach(function (opt) {
      var option = document.createElement('option');
      var value = opt.value || opt.href;
      option.value = value;
      option.textContent = opt.label;
      if (opt.page === selectedValue || value === selectedValue) {
        option.selected = true;
      }
      select.appendChild(option);
    });
  }

  function initTypeStatusFilters() {
    var form = document.getElementById('tx-record-form');
    if (!form) return;

    var nestedPages = RECORD_TYPE_OPTIONS.map(function (opt) {
      return opt.page;
    }).filter(function (page) {
      return page !== 'transaction-history';
    });

    var typeSelect = document.getElementById('tx-filter-type');
    var statusSelect = document.getElementById('tx-filter-status');

    /* Nested record pages: inject Type + Status if missing */
    if (nestedPages.indexOf(pageKey) !== -1 && !document.querySelector('.tx-record-filter-stack')) {
      var stack = document.createElement('div');
      stack.className = 'tx-record-filter-stack';
      stack.innerHTML =
        '<label class="tx-record-select-field">' +
          '<span class="tx-record-label">Type</span>' +
          '<select class="tx-record-select" id="tx-filter-type" name="type" aria-label="Type"></select>' +
        '</label>' +
        '<label class="tx-record-select-field">' +
          '<span class="tx-record-label">Status</span>' +
          '<select class="tx-record-select" id="tx-filter-status" name="status" aria-label="Status"></select>' +
        '</label>';
      form.insertBefore(stack, form.firstChild);
      typeSelect = document.getElementById('tx-filter-type');
      statusSelect = document.getElementById('tx-filter-status');
      fillSelect(typeSelect, RECORD_TYPE_OPTIONS, pageKey);
      fillSelect(statusSelect, STATUS_OPTIONS, 'all');
    }
  }

  function init() {
    initTypeStatusFilters();

    var form = document.getElementById('tx-record-form');
    var startInput = document.getElementById('tx-start-date');
    var endInput = document.getElementById('tx-end-date');
    var periodBtns = document.querySelectorAll('[data-tx-period]');
    var tabs = document.querySelectorAll('[data-tx-type]');
    var columns = readColumns();
    var recordLabel = document.querySelector('.account-content-title');
    var labelText = recordLabel ? recordLabel.textContent.trim() : 'Record';
    var typeSelect = document.getElementById('tx-filter-type');
    var statusSelect = document.getElementById('tx-filter-status');
    var isTxPage = pageKey === 'transaction-history';
    var isBetHistoryPage = pageKey === 'bet-history';

    function setPeriod(key) {
      var range = periodRange(key);
      if (startInput) startInput.value = range.start;
      if (endInput) endInput.value = range.end;
      periodBtns.forEach(function (btn) {
        btn.classList.toggle('is-active', btn.getAttribute('data-tx-period') === key);
      });
    }

    function currentDateRange() {
      return {
        start: parseDateInput(startInput && startInput.value),
        end: parseDateInput(endInput && endInput.value)
      };
    }

    function refreshTxResults() {
      var typeValue = typeSelect ? typeSelect.value : 'all';
      var statusValue = statusSelect ? statusSelect.value : 'all';
      if (typeValue && typeValue.indexOf('.html') !== -1) {
        renderResults([], columns);
        return;
      }

      if (isTxPage) {
        renderResults(filterTxRows(typeValue, statusValue), columns);
        return;
      }

      if (isBetHistoryPage) {
        var range = currentDateRange();
        renderBetHistoryResults(
          filterBetDetailRows(typeValue, statusValue, range.start, range.end)
        );
        return;
      }

      renderResults([], columns);
    }

    setPeriod(isTxPage ? 'last-month' : 'this-week');
    refreshTxResults();

    var recordTypeSelect = document.getElementById('tx-record-type');
    if (recordTypeSelect) {
      recordTypeSelect.addEventListener('change', function () {
        var href = recordTypeSelect.value;
        if (href && href !== pageKey + '.html') {
          window.location.href = href;
        }
      });
    }

    periodBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        setPeriod(btn.getAttribute('data-tx-period'));
        if (isBetHistoryPage) refreshTxResults();
      });
    });

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');
        refreshTxResults();
      });
    });

    if (isBetHistoryPage) {
      document.querySelectorAll('[data-bh-view]').forEach(function (tab) {
        tab.addEventListener('click', function () {
          setBetHistoryView(tab.getAttribute('data-bh-view'));
        });
      });

      document.addEventListener('click', function (e) {
        var copyBtn = e.target.closest('[data-bh-copy-slip]');
        if (!copyBtn) return;
        var slipId = copyBtn.getAttribute('data-bh-copy-slip') || '';
        if (!slipId) return;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(slipId).then(
            function () {
              toast('Bet slip ID copied');
            },
            function () {
              toast(slipId);
            }
          );
        } else {
          toast(slipId);
        }
      });

      var cardMq = window.matchMedia('(max-width: 900px)');
      var onCardMq = function () {
        refreshTxResults();
      };
      if (cardMq.addEventListener) cardMq.addEventListener('change', onCardMq);
      else if (cardMq.addListener) cardMq.addListener(onCardMq);
    }

    if (typeSelect) {
      typeSelect.addEventListener('change', function () {
        var value = typeSelect.value;
        if (!value) return;
        if (value.indexOf('.html') !== -1) {
          window.location.href = value;
          return;
        }
        refreshTxResults();
      });
    }

    if (statusSelect) {
      statusSelect.addEventListener('change', function () {
        refreshTxResults();
      });
    }

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var start = parseDateInput(startInput && startInput.value);
        var end = parseDateInput(endInput && endInput.value);
        if (!start || !end) {
          toast('Enter valid start and end dates (DD-MM-YYYY)');
          if (isBetHistoryPage) renderBetHistoryResults([]);
          else renderResults([], columns);
          return;
        }
        if (start > end) {
          toast('Start date must be before end date');
          if (isBetHistoryPage) renderBetHistoryResults([]);
          else renderResults([], columns);
          return;
        }

        if (isTxPage || isBetHistoryPage) {
          refreshTxResults();
          if (isBetHistoryPage) {
            var rows = filterBetDetailRows(
              typeSelect ? typeSelect.value : 'sports',
              statusSelect ? statusSelect.value : 'all',
              start,
              end
            );
            if (!rows.length) {
              var typeLabel = typeSelect && typeSelect.options[typeSelect.selectedIndex]
                ? typeSelect.options[typeSelect.selectedIndex].text
                : labelText;
              var statusLabel = statusSelect && statusSelect.value !== 'all'
                ? statusSelect.options[statusSelect.selectedIndex].text
                : '';
              toast(
                'No ' +
                  typeLabel.toLowerCase() +
                  (statusLabel ? ' (' + statusLabel.toLowerCase() + ')' : '') +
                  ' found for selected period'
              );
            }
          }
          return;
        }

        renderResults([], columns);
        var emptyTypeLabel = typeSelect && typeSelect.options[typeSelect.selectedIndex]
          ? typeSelect.options[typeSelect.selectedIndex].text
          : labelText;
        var emptyStatusLabel = statusSelect && statusSelect.value !== 'all'
          ? statusSelect.options[statusSelect.selectedIndex].text
          : '';
        toast(
          'No ' +
            emptyTypeLabel.toLowerCase() +
            (emptyStatusLabel ? ' (' + emptyStatusLabel.toLowerCase() + ')' : '') +
            ' found for selected period (demo)'
        );
      });
    }
  }

  init();
})();
