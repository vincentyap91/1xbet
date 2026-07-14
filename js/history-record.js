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
                }
                if (col.key === 'description' || col.key === 'event' || col.key === 'source' || col.key === 'type' || col.key === 'promotion') {
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

    body.innerHTML = renderRows(rows, columns);
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

  function init() {
    var form = document.getElementById('tx-record-form');
    var startInput = document.getElementById('tx-start-date');
    var endInput = document.getElementById('tx-end-date');
    var periodBtns = document.querySelectorAll('[data-tx-period]');
    var tabs = document.querySelectorAll('[data-tx-type]');
    var columns = readColumns();
    var recordLabel = document.querySelector('.account-content-title');
    var labelText = recordLabel ? recordLabel.textContent.trim() : 'Record';

    function setPeriod(key) {
      var range = periodRange(key);
      if (startInput) startInput.value = range.start;
      if (endInput) endInput.value = range.end;
      periodBtns.forEach(function (btn) {
        btn.classList.toggle('is-active', btn.getAttribute('data-tx-period') === key);
      });
    }

    setPeriod('this-week');

    periodBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        setPeriod(btn.getAttribute('data-tx-period'));
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
        renderResults([], columns);
      });
    });

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var start = parseDateInput(startInput && startInput.value);
        var end = parseDateInput(endInput && endInput.value);
        if (!start || !end) {
          toast('Enter valid start and end dates (DD-MM-YYYY)');
          renderResults([], columns);
          return;
        }
        if (start > end) {
          toast('Start date must be before end date');
          renderResults([], columns);
          return;
        }

        renderResults([], columns);
        toast('No ' + labelText.toLowerCase() + ' found for selected period (demo)');
      });
    }
  }

  init();
})();
