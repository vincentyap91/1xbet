/* transaction-history.js — Transaction history page */
(function () {
  'use strict';

  if (document.body.dataset.page !== 'transaction-history') return;

  var ACCOUNT_NO = '1733760863';

  var MOCK_TRANSACTIONS = [
    {
      type: 'in',
      description: "Receipt of payment No. 22532991911 made using 'E-wallets', payment amount: 10.00 MYR",
      datetime: '13/07/2026 15:08',
    },
    {
      type: 'in',
      description: "Receipt of payment No. 22531887442 made using 'Bank Transfer', payment amount: 50.00 MYR",
      datetime: '12/07/2026 09:14',
    },
    {
      type: 'out',
      description: "Withdrawal No. 22530112298 made using 'FPX', payment amount: 75.00 MYR",
      datetime: '10/07/2026 14:22',
    },
    {
      type: 'in',
      description: 'Receipt of payment No. 22529876501 made using \'Touch \'n Go\', payment amount: 100.00 MYR',
      datetime: '08/07/2026 11:05',
    },
    {
      type: 'in',
      description: "Receipt of payment No. 22528765432 made using 'Bitcoin', payment amount: 250.00 MYR",
      datetime: '05/07/2026 18:40',
    },
    {
      type: 'out',
      description: "Transfer to bonus account, amount: 5.00 MYR",
      datetime: '04/07/2026 10:30',
    },
  ];

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderIcon(type) {
    if (type === 'out') {
      return (
        '<span class="tx-item-icon tx-item-icon--out" aria-hidden="true">' +
          '<svg viewBox="0 0 16 16" focusable="false"><path d="M8 3v8M4.5 7.5 8 11l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '</span>'
      );
    }
    return (
      '<span class="tx-item-icon tx-item-icon--in" aria-hidden="true">' +
        '<svg viewBox="0 0 16 16" focusable="false"><path d="M8 13V5M4.5 8.5 8 5l3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '</span>'
    );
  }

  function renderItem(tx) {
    return (
      '<article class="tx-item tx-item--' + escapeHtml(tx.type) + '">' +
        renderIcon(tx.type) +
        '<div class="tx-item-body">' +
          '<p class="tx-item-desc">' + escapeHtml(tx.description) + '</p>' +
          '<time class="tx-item-time" datetime="' + escapeHtml(tx.datetime) + '">' + escapeHtml(tx.datetime) + '</time>' +
        '</div>' +
      '</article>'
    );
  }

  function renderList() {
    var list = document.getElementById('tx-list');
    if (!list) return;
    list.innerHTML = MOCK_TRANSACTIONS.map(renderItem).join('');
  }

  function initTabs() {
    var tabs = document.querySelectorAll('[data-tx-tab]');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function (e) {
        e.preventDefault();
        tabs.forEach(function (t) {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');
        if (typeof window.showToast === 'function') {
          window.showToast((tab.textContent.trim() || 'Tab') + ' — demo only');
        }
      });
    });
  }

  function initActions() {
    var queriesBtn = document.getElementById('tx-queries-btn');
    var archiveBtn = document.getElementById('tx-archive-btn');

    if (queriesBtn) {
      queriesBtn.addEventListener('click', function () {
        if (typeof window.showToast === 'function') {
          window.showToast('Payment queries — demo only');
        }
      });
    }

    if (archiveBtn) {
      archiveBtn.addEventListener('click', function () {
        if (typeof window.showToast === 'function') {
          window.showToast('Load archive — demo only');
        }
      });
    }
  }

  function initCopy() {
    var btn = document.getElementById('tx-copy-account');
    var accountEl = document.getElementById('tx-account-no');
    if (!btn || !accountEl) return;

    btn.addEventListener('click', function () {
      var text = ACCOUNT_NO;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          if (typeof window.showToast === 'function') {
            window.showToast('Account number copied');
          }
        }).catch(fallbackCopy);
      } else {
        fallbackCopy();
      }

      function fallbackCopy() {
        try {
          var ta = document.createElement('textarea');
          ta.value = text;
          ta.setAttribute('readonly', '');
          ta.style.position = 'absolute';
          ta.style.left = '-9999px';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          if (typeof window.showToast === 'function') {
            window.showToast('Account number copied');
          }
        } catch (err) {
          if (typeof window.showToast === 'function') {
            window.showToast('Could not copy account number');
          }
        }
      }
    });
  }

  renderList();
  initTabs();
  initActions();
  initCopy();
})();
