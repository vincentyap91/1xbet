/* bet-history.js — Bet History page: render rows + compact filters */
(function () {
  'use strict';

  if (document.body.dataset.page !== 'bet-history') return;

  var MOCK_BETS = [
    { game: 'Holi Bac 1', type: 'Live casino', transaction: '2926570233103', date: '13/07 / 10:27', provider: 'Holi', amount: '2.62 MYR', txType: 'Real money', action: 'Bet' },
    { game: 'Holi Bac 1', type: 'Live casino', transaction: '2926569475683', date: '13/07 / 10:26', provider: 'Holi', amount: '2.5 MYR', txType: 'Real money', action: 'Bet' },
    { game: 'Holi Bac 1', type: 'Live casino', transaction: '2926568882359', date: '13/07 / 10:26', provider: 'Holi', amount: '2.5 MYR', txType: 'Real money', action: 'Bet' },
    { game: 'Holi Bac 1', type: 'Live casino', transaction: '2926568511871', date: '13/07 / 10:25', provider: 'Holi', amount: '7.62 MYR', txType: 'Real money', action: 'Paid out' },
    { game: 'Holi Bac 1', type: 'Live casino', transaction: '2926568286373', date: '13/07 / 10:25', provider: 'Holi', amount: '3.63 MYR', txType: 'Real money', action: 'Bet' },
    { game: 'Holi Bac 1', type: 'Live casino', transaction: '2926567688709', date: '13/07 / 10:24', provider: 'Holi', amount: '2.5 MYR', txType: 'Real money', action: 'Bet' },
    { game: 'Holi Bac 1', type: 'Live casino', transaction: '2926567307797', date: '13/07 / 10:24', provider: 'Holi', amount: '5.25 MYR', txType: 'Real money', action: 'Paid out' },
    { game: 'Holi Bac 1', type: 'Live casino', transaction: '2926566885007', date: '13/07 / 10:23', provider: 'Holi', amount: '2.5 MYR', txType: 'Real money', action: 'Bet' },
    { game: 'Holi Bac 1', type: 'Live casino', transaction: '292656249243', date: '13/07 / 10:23', provider: 'Holi', amount: '2.5 MYR', txType: 'Real money', action: 'Bet' },
    { game: 'Holi Bac 1', type: 'Live casino', transaction: '2926565877837', date: '13/07 / 10:22', provider: 'Holi', amount: '5.88 MYR', txType: 'Real money', action: 'Paid out' },
    { game: 'Holi Bac 1', type: 'Live casino', transaction: '2926565659703', date: '13/07 / 10:22', provider: 'Holi', amount: '2.8 MYR', txType: 'Real money', action: 'Bet' },
    { game: 'Amazing Baccarat', type: 'Live casino', transaction: '2926562413125', date: '13/07 / 10:19', provider: 'Pragmatic Play', amount: '3.6 MYR', txType: 'Real money', action: 'Bet' },
    { game: 'Amazing Baccarat', type: 'Live casino', transaction: '2926561910159', date: '13/07 / 10:18', provider: 'Pragmatic Play', amount: '3.6 MYR', txType: 'Real money', action: 'Bet' },
  ];

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderCard(bet) {
    var isPaid = bet.action === 'Paid out';
    var pillClass = isPaid ? 'bh-pill bh-pill--paid' : 'bh-pill';

    return (
      '<article class="bh-card">' +
        '<header class="bh-card-head">' +
          '<div class="bh-game">' +
            '<span class="bh-game-icon"><img src="assets/icons/icon-dice.svg" alt="" width="16" height="16" /></span>' +
            '<span><strong>' + escapeHtml(bet.game) + '</strong><small>' + escapeHtml(bet.type) + '</small></span>' +
          '</div>' +
          '<span class="' + pillClass + '">' + escapeHtml(bet.action) + '</span>' +
        '</header>' +
        '<div class="bh-card-grid">' +
          '<div class="bh-field"><span class="bh-field-label">Transaction</span><span class="bh-field-value">' + escapeHtml(bet.transaction) + '</span></div>' +
          '<div class="bh-field"><span class="bh-field-label">Date</span><span class="bh-field-value">' + escapeHtml(bet.date) + '</span></div>' +
          '<div class="bh-field"><span class="bh-field-label">Provider</span><span class="bh-field-value">' + escapeHtml(bet.provider) + '</span></div>' +
          '<div class="bh-field bh-field--amount"><span class="bh-field-label">Amount</span><span class="bh-field-value">' + escapeHtml(bet.amount) + '</span></div>' +
          '<div class="bh-field bh-field--type"><span class="bh-field-label">Transaction type</span><span class="bh-field-value">' + escapeHtml(bet.txType) + '</span></div>' +
        '</div>' +
      '</article>'
    );
  }

  function renderList() {
    var list = document.getElementById('bh-list');
    if (!list) return;
    list.innerHTML = MOCK_BETS.map(renderCard).join('');
  }

  function setFiltersOpen(open) {
    var panel = document.getElementById('bh-filters-panel');
    var backdrop = document.getElementById('bh-filters-backdrop');
    var btn = document.getElementById('bh-filters-btn');
    if (!panel) return;

    panel.classList.toggle('is-open', open);
    if (backdrop) backdrop.hidden = !open;
    if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.classList.toggle('bh-filters-open', open);
  }

  function initFilters() {
    var filtersBtn = document.getElementById('bh-filters-btn');
    var closeBtn = document.getElementById('bh-filters-close');
    var backdrop = document.getElementById('bh-filters-backdrop');
    var form = document.querySelector('.bh-filter-form');

    if (filtersBtn) {
      filtersBtn.addEventListener('click', function () {
        var isOpen = document.getElementById('bh-filters-panel').classList.contains('is-open');
        setFiltersOpen(!isOpen);
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        setFiltersOpen(false);
      });
    }

    if (backdrop) {
      backdrop.addEventListener('click', function () {
        setFiltersOpen(false);
      });
    }

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        setFiltersOpen(false);
        if (typeof window.showToast === 'function') {
          window.showToast('Filters applied (demo)');
        }
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setFiltersOpen(false);
    });
  }

  function initToolbar() {
    var emailBtn = document.getElementById('bh-email-btn');
    if (emailBtn) {
      emailBtn.addEventListener('click', function () {
        if (typeof window.showToast === 'function') {
          window.showToast('Send to e-mail — demo only');
        }
      });
    }
  }

  function initTabMenu() {
    var menuBtn = document.getElementById('bh-tabs-menu-btn');
    var menu = document.getElementById('bh-tabs-menu');
    if (!menuBtn || !menu) return;

    menuBtn.addEventListener('click', function () {
      var open = !menu.hidden;
      menu.hidden = open;
      menuBtn.setAttribute('aria-expanded', open ? 'false' : 'true');
    });

    document.addEventListener('click', function (e) {
      if (!menuBtn.contains(e.target) && !menu.contains(e.target)) {
        menu.hidden = true;
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  renderList();
  initFilters();
  initToolbar();
  initTabMenu();
})();
