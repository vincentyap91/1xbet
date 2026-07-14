/* account.js — shared logic for personal-profile, deposit, withdraw */
(function () {
  'use strict';

  /* ── Clock ───────────────────────────────────────────────── */
  function updateClock() {
    var el = document.getElementById('header-clock');
    if (!el) return;
    var now = new Date();
    el.textContent =
      String(now.getHours()).padStart(2, '0') + ':' +
      String(now.getMinutes()).padStart(2, '0');
  }
  updateClock();
  setInterval(updateClock, 30000);

  /* ── Category tab filter (deposit / withdraw) ───────────── */
  var catBtns = Array.prototype.slice.call(document.querySelectorAll('.dep-cat-btn'));
  var sectionsPanel = document.getElementById('dep-sections-panel');
  var depMethods = document.querySelector('.dep-methods');

  if (catBtns.length && sectionsPanel) {
    var FADE_MS = 200;
    var sectionRegistry = {};
    var sectionOrder = [];
    var activeCategory = 'all';
    var isTransitioning = false;

    Array.prototype.slice.call(
      sectionsPanel.querySelectorAll('.dep-section')
    ).forEach(function (section) {
      var key = section.dataset.section;
      if (!key) return;
      sectionRegistry[key] = section;
      sectionOrder.push(key);
      section.remove();
    });

    var categoryMap = {
      all: sectionOrder.slice(),
      recommended: ['recommended'],
      card: ['card'],
      ewallet: ['ewallet'],
      banking: ['banking'],
      transfer: ['transfer'],
      crypto: ['crypto']
    };

    if (sectionRegistry['banking-transfer']) {
      categoryMap.all = sectionOrder.filter(function (key) {
        return key !== 'banking' && key !== 'transfer';
      });
    }

    function getCardsInSection(section) {
      return section.querySelectorAll('.pay-method-card');
    }

    function sectionHasMethods(section) {
      return getCardsInSection(section).length > 0;
    }

    function createEmptyState() {
      var empty = document.createElement('div');
      empty.className = 'dep-empty-state';
      empty.setAttribute('role', 'status');
      empty.innerHTML =
        '<div class="dep-empty-icon" aria-hidden="true">📭</div>' +
        '<p class="dep-empty-title">No payment methods available.</p>' +
        '<p class="dep-empty-text">Please choose another payment category or contact customer support.</p>';
      return empty;
    }

    function buildCategoryContent(cat) {
      var fragment = document.createDocumentFragment();
      var keys = categoryMap[cat] || categoryMap.all;
      var hasContent = false;

      keys.forEach(function (key) {
        var section = sectionRegistry[key];
        if (!section) return;

        if (sectionHasMethods(section)) {
          fragment.appendChild(section.cloneNode(true));
          hasContent = true;
        }
      });

      if (!hasContent) {
        fragment.appendChild(createEmptyState());
      }

      return fragment;
    }

    function bindMethodCardSelection(container) {
      var cards = Array.prototype.slice.call(
        container.querySelectorAll('.pay-method-card')
      );

      cards.forEach(function (card) {
        card.addEventListener('click', function () {
          cards.forEach(function (c) { c.classList.remove('is-selected'); });
          card.classList.add('is-selected');
        });
      });
    }

    function scrollMethodsToTop() {
      if (depMethods) {
        depMethods.scrollTop = 0;
      }
      sectionsPanel.scrollTop = 0;
    }

    function renderCategory(cat, animate) {
      if (isTransitioning && animate) return;
      activeCategory = cat;

      var applyContent = function () {
        sectionsPanel.innerHTML = '';
        sectionsPanel.appendChild(buildCategoryContent(cat));
        bindMethodCardSelection(sectionsPanel);
        scrollMethodsToTop();

        if (animate) {
          requestAnimationFrame(function () {
            sectionsPanel.classList.remove('is-fading');
          });
        } else {
          sectionsPanel.classList.remove('is-fading');
        }

        isTransitioning = false;
      };

      if (animate && sectionsPanel.childElementCount) {
        isTransitioning = true;
        sectionsPanel.classList.add('is-fading');
        setTimeout(applyContent, FADE_MS);
      } else {
        applyContent();
      }
    }

    catBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cat = btn.dataset.cat;
        if (cat === activeCategory) return;

        catBtns.forEach(function (b) {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');

        renderCategory(cat, true);
      });
    });

    renderCategory('all', false);
  } else {
    /* Fallback: payment card selection when sections panel is absent */
    var methodCards = Array.prototype.slice.call(document.querySelectorAll('.pay-method-card'));
    methodCards.forEach(function (card) {
      card.addEventListener('click', function () {
        methodCards.forEach(function (c) { c.classList.remove('is-selected'); });
        card.classList.add('is-selected');
      });
    });
  }

  /* ── Balance refresh animation ──────────────────────────── */
  var refreshBtn = document.querySelector('.header-balance-refresh');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', function () {
      refreshBtn.style.transition = 'transform .5s';
      refreshBtn.style.transform = 'rotate(360deg)';
      setTimeout(function () {
        refreshBtn.style.transition = '';
        refreshBtn.style.transform = '';
      }, 520);
    });
  }

  /* ── Profile save ──────────────────────────────────────── */
  function accountToast(msg) {
    if (typeof window.showToast === 'function') {
      window.showToast(msg);
      return;
    }
    var el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(accountToast._t);
    accountToast._t = setTimeout(function () {
      el.hidden = true;
    }, 2200);
  }

  var profileForm = document.getElementById('profile-form');
  if (profileForm) {
    profileForm.addEventListener('submit', function (e) {
      e.preventDefault();
      accountToast('Profile saved (demo)');
    });
  }

  var promoEndBtn = document.getElementById('pf-promo-end-btn');
  if (promoEndBtn) {
    promoEndBtn.addEventListener('click', function () {
      accountToast('End promo (demo)');
    });
  }

  /* ── Security menu cards ───────────────────────────────── */
  var secCards = Array.prototype.slice.call(document.querySelectorAll('.sec-menu-card'));
  if (secCards.length) {
    var secLabels = {
      language: 'Change Language',
      password: 'Change Password',
      info: 'Information Center'
    };
    secCards.forEach(function (card) {
      card.addEventListener('click', function (e) {
        var action = card.getAttribute('data-sec-action') || '';
        var href = card.getAttribute('href') || '#';
        secCards.forEach(function (c) { c.classList.remove('is-active'); });
        card.classList.add('is-active');
        if (href === '#' || href === '') {
          e.preventDefault();
          accountToast((secLabels[action] || 'Security option') + ' (demo)');
        }
      });
    });
  }

  /* ── Referral page ─────────────────────────────────────── */
  var pageKey = document.body.getAttribute('data-page') || '';

  if (pageKey === 'referral') {
    Array.prototype.slice.call(document.querySelectorAll('[data-ref-copy-target]')).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var targetId = btn.getAttribute('data-ref-copy-target');
        var target = targetId ? document.getElementById(targetId) : null;
        if (!target) return;
        var value = (target.value != null ? target.value : target.textContent || '').trim();
        var label = 'Referral link';
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(value).then(function () {
            accountToast(label + ' copied');
          }).catch(function () {
            accountToast(label + ' ready to copy');
          });
        } else {
          accountToast(label + ' ready to copy');
        }
      });
    });

    var downlinesBtn = document.getElementById('ref-downlines-btn');
    var dlBackdrop = document.getElementById('dl-backdrop');
    var dlClose = document.getElementById('dl-close');
    var dlModal = dlBackdrop && dlBackdrop.querySelector('.dl-modal');

    function openDownlines() {
      if (!dlBackdrop) return;
      dlBackdrop.hidden = false;
      document.body.classList.add('dl-modal-open');
      if (dlModal) dlModal.focus();
    }

    function closeDownlines() {
      if (!dlBackdrop) return;
      dlBackdrop.hidden = true;
      document.body.classList.remove('dl-modal-open');
    }

    if (downlinesBtn) {
      downlinesBtn.addEventListener('click', openDownlines);
    }
    if (dlClose) dlClose.addEventListener('click', closeDownlines);
    if (dlBackdrop) {
      dlBackdrop.addEventListener('click', function (e) {
        if (e.target === dlBackdrop) closeDownlines();
      });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && dlBackdrop && !dlBackdrop.hidden) closeDownlines();
    });

    var dlTabs = Array.prototype.slice.call(document.querySelectorAll('[data-dl-tab]'));
    var dlPanels = Array.prototype.slice.call(document.querySelectorAll('[data-dl-panel]'));
    dlTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var key = tab.getAttribute('data-dl-tab');
        dlTabs.forEach(function (t) {
          var on = t === tab;
          t.classList.toggle('is-active', on);
          t.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        dlPanels.forEach(function (panel) {
          panel.hidden = panel.getAttribute('data-dl-panel') !== key;
        });
      });
    });

    function formatDlDate(date) {
      var d = String(date.getDate()).padStart(2, '0');
      var m = String(date.getMonth() + 1).padStart(2, '0');
      var y = date.getFullYear();
      return d + '-' + m + '-' + y;
    }

    function startOfWeek(date) {
      var d = new Date(date);
      var day = d.getDay();
      var diff = day === 0 ? -6 : 1 - day;
      d.setDate(d.getDate() + diff);
      d.setHours(0, 0, 0, 0);
      return d;
    }

    function applyDlPeriod(period) {
      var now = new Date();
      var start = new Date(now);
      var end = new Date(now);

      if (period === 'today') {
        /* same day */
      } else if (period === 'yesterday') {
        start.setDate(now.getDate() - 1);
        end.setDate(now.getDate() - 1);
      } else if (period === 'this-week') {
        start = startOfWeek(now);
        end = new Date(now);
      } else if (period === 'last-week') {
        end = startOfWeek(now);
        end.setDate(end.getDate() - 1);
        start = startOfWeek(end);
      } else if (period === 'this-month') {
        start = new Date(now.getFullYear(), now.getMonth(), 1);
      } else if (period === 'last-month') {
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        end = new Date(now.getFullYear(), now.getMonth(), 0);
      }

      var startInput = document.getElementById('dl-start-date');
      var endInput = document.getElementById('dl-end-date');
      if (startInput) startInput.value = formatDlDate(start);
      if (endInput) endInput.value = formatDlDate(end);
    }

    Array.prototype.slice.call(document.querySelectorAll('[data-dl-period]')).forEach(function (btn) {
      btn.addEventListener('click', function () {
        Array.prototype.slice.call(document.querySelectorAll('[data-dl-period]')).forEach(function (b) {
          b.classList.toggle('is-active', b === btn);
        });
        applyDlPeriod(btn.getAttribute('data-dl-period'));
      });
    });

    Array.prototype.slice.call(document.querySelectorAll('[data-ref-share]')).forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        accountToast('Share via ' + (btn.getAttribute('data-ref-share') || 'social') + ' (demo)');
      });
    });

    var topTabs = Array.prototype.slice.call(document.querySelectorAll('[data-ref-top]'));
    var topPanels = Array.prototype.slice.call(document.querySelectorAll('[data-ref-panel]'));

    function setReferralTopTab(key) {
      topTabs.forEach(function (t) {
        var on = t.getAttribute('data-ref-top') === key;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      topPanels.forEach(function (panel) {
        panel.hidden = panel.getAttribute('data-ref-panel') !== key;
      });
      if (history.replaceState) {
        history.replaceState(null, '', key === 'rewards' ? '#rewards' : (location.pathname + location.search));
      }
    }

    topTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        setReferralTopTab(tab.getAttribute('data-ref-top'));
      });
    });

    if ((location.hash || '').toLowerCase() === '#rewards') {
      setReferralTopTab('rewards');
    }

    Array.prototype.slice.call(document.querySelectorAll('[data-ref-claim]')).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var type = btn.getAttribute('data-ref-claim') || 'bonus';
        accountToast('Claim ' + type + ' bonus (demo)');
      });
    });

    var historyTabs = Array.prototype.slice.call(document.querySelectorAll('[data-ref-history]'));
    var historyPanels = Array.prototype.slice.call(document.querySelectorAll('[data-ref-history-panel]'));
    historyTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var key = tab.getAttribute('data-ref-history');
        historyTabs.forEach(function (t) {
          var on = t === tab;
          t.classList.toggle('is-active', on);
          t.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        historyPanels.forEach(function (panel) {
          panel.hidden = panel.getAttribute('data-ref-history-panel') !== key;
        });
      });
    });
  }

  /* ── Live chat ─────────────────────────────────────────── */
  if (pageKey === 'live-chat') {
    var lcForm = document.getElementById('lc-form');
    var lcInput = document.getElementById('lc-input');
    var lcMessages = document.getElementById('lc-messages');

    function lcScrollBottom() {
      if (lcMessages) lcMessages.scrollTop = lcMessages.scrollHeight;
    }

    if (lcForm && lcInput && lcMessages) {
      lcForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var text = lcInput.value.trim();
        if (!text) return;

        var now = new Date();
        var timeLabel = now.toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).replace(',', '');

        var article = document.createElement('article');
        article.className = 'lc-msg';
        article.innerHTML =
          '<img class="lc-avatar" src="assets/images/account/icon-user.svg" alt="" width="44" height="44" />' +
          '<div class="lc-msg-main">' +
            '<div class="lc-bubble lc-bubble--user">' +
              '<div class="lc-bubble-head">' +
                '<span class="lc-sender lc-sender--user">You</span>' +
                '<time class="lc-time">' + timeLabel + '</time>' +
              '</div>' +
              '<p class="lc-text"></p>' +
            '</div>' +
          '</div>';
        article.querySelector('.lc-text').textContent = text;
        lcMessages.appendChild(article);
        lcInput.value = '';
        lcScrollBottom();
      });

      lcInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          lcForm.requestSubmit();
        }
      });
    }

    var lcAttach = document.querySelector('.lc-attach');
    if (lcAttach) {
      lcAttach.addEventListener('click', function () {
        accountToast('Attach file (demo)');
      });
    }

    var lcMic = document.querySelector('.lc-mic');
    if (lcMic) {
      lcMic.addEventListener('click', function () {
        accountToast('Voice message (demo)');
      });
    }

    lcScrollBottom();
  }

  /* ── Change language ───────────────────────────────────── */
  if (pageKey === 'change-language') {
    var langList = document.getElementById('lang-list');
    var LANG_CHECK_HTML =
      '<span class="lang-check" aria-hidden="true">' +
        '<svg viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2.5 6l2.5 2.5 4.5-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '</span>';

    if (langList) {
      langList.addEventListener('click', function (e) {
        var btn = e.target.closest('.lang-chip');
        if (!btn || btn.classList.contains('is-active')) return;

        langList.querySelectorAll('.lang-chip').forEach(function (item) {
          item.classList.remove('is-active');
          item.setAttribute('aria-selected', 'false');
          var check = item.querySelector('.lang-check');
          if (check) check.remove();
        });

        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');
        btn.insertAdjacentHTML('beforeend', LANG_CHECK_HTML);

        var labelEl = btn.querySelector('.lang-label');
        var label = labelEl ? labelEl.textContent.trim() : 'Language';
        var code = btn.getAttribute('data-lang') || 'en';
        var flagImg = btn.querySelector('.lang-flag');
        var flag = flagImg ? flagImg.getAttribute('src') : '';

        try {
          sessionStorage.setItem('header-lang', code);
        } catch (err) { /* ignore */ }

        var headerFlag = document.getElementById('header-lang-flag');
        var headerLabel = document.getElementById('header-lang-label');
        var headerBtn = document.getElementById('header-lang-btn');
        if (headerFlag && flag) headerFlag.src = flag;
        if (headerLabel) headerLabel.textContent = label;
        if (headerBtn) headerBtn.setAttribute('data-lang', code);

        accountToast('Language set to ' + label + ' (demo)');
      });
    }
  }

  /* ── Change password ───────────────────────────────────── */
  var cpwForm = document.getElementById('change-password-form');
  if (cpwForm) {
    var EYE_OFF =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 002.8 2.8"/><path d="M9.9 5.1A10.5 10.5 0 0121 12c-.7 1.2-1.6 2.3-2.7 3.2M6.1 6.1C4.7 7.2 3.6 8.5 3 12c1.5 4 5.2 7 9 7a9.5 9.5 0 005.1-1.5"/></svg>';
    var EYE_ON =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';

    Array.prototype.slice.call(document.querySelectorAll('[data-cpw-eye]')).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-cpw-eye');
        var input = document.getElementById(id);
        if (!input) return;
        var show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        btn.innerHTML = show ? EYE_ON : EYE_OFF;
        btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
      });
    });

    var newPass = document.getElementById('cpw-new');
    var confirmPass = document.getElementById('cpw-confirm');
    var reqItems = Array.prototype.slice.call(document.querySelectorAll('#cpw-reqs [data-req]'));
    var errEl = document.getElementById('cpw-error');

    function validPassword(value) {
      var v = value || '';
      return {
        len: v.length >= 8 && /[A-Za-z]/.test(v) && /[0-9]/.test(v),
        alnum: v.length > 0 && /^[A-Za-z0-9]+$/.test(v),
        nosym: v.length > 0 && !/[^A-Za-z0-9]/.test(v)
      };
    }

    function syncReqs() {
      var state = validPassword(newPass ? newPass.value : '');
      reqItems.forEach(function (li) {
        var key = li.getAttribute('data-req');
        li.classList.toggle('is-ok', !!state[key]);
      });
      if (errEl && confirmPass) {
        var mismatch = confirmPass.value.length > 0 && newPass.value !== confirmPass.value;
        errEl.hidden = !mismatch;
      }
    }

    if (newPass) newPass.addEventListener('input', syncReqs);
    if (confirmPass) confirmPass.addEventListener('input', syncReqs);

    cpwForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var current = document.getElementById('cpw-current');
      var state = validPassword(newPass ? newPass.value : '');
      if (!current || !current.value) {
        accountToast('Enter your current password');
        return;
      }
      if (!state.len || !state.alnum || !state.nosym) {
        accountToast('Please meet the password requirements');
        return;
      }
      if (!confirmPass || newPass.value !== confirmPass.value) {
        if (errEl) errEl.hidden = false;
        accountToast('Passwords do not match');
        return;
      }
      accountToast('Password updated (demo)');
      cpwForm.reset();
      syncReqs();
      if (errEl) errEl.hidden = true;
    });
  }

  /* ── Payment Queries tabs ──────────────────────────────── */
  var pqTabs = Array.prototype.slice.call(document.querySelectorAll('[data-pq-tab]'));
  if (pqTabs.length) {
    var pqPanels = Array.prototype.slice.call(document.querySelectorAll('[data-pq-panel]'));
    pqTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var key = tab.getAttribute('data-pq-tab');
        pqTabs.forEach(function (t) {
          var on = t === tab;
          t.classList.toggle('is-active', on);
          t.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        pqPanels.forEach(function (panel) {
          panel.hidden = panel.getAttribute('data-pq-panel') !== key;
        });
      });
    });

    Array.prototype.slice.call(document.querySelectorAll('#pq-create-btn, [data-pq-create]')).forEach(function (btn) {
      btn.addEventListener('click', function () {
        accountToast('Create query (demo)');
      });
    });
  }

  /* ── Logout uses AuthModals confirm dialog ─────────────── */
  // Handled by auth-modals.js via [data-auth-open="logout"]

  /* ── Mobile account chrome (subnav + sticky tabbar) ───── */
  function accountPageKey() {
    return document.body.getAttribute('data-page') || '';
  }

  var ACCOUNT_NAV_GROUPS = [
    {
      label: 'My Wallet and Bets',
      items: [
        { key: 'deposit', href: 'deposit.html', label: 'Deposit', pages: ['deposit'] },
        { key: 'withdraw', href: 'withdraw.html', label: 'Withdraw Funds', pages: ['withdraw'] },
        { key: 'payment-queries', href: 'payment-queries.html', label: 'Payment Queries', pages: ['payment-queries'] }
      ]
    },
    {
      label: 'Profile',
      items: [
        { key: 'personal-profile', href: 'personal-profile.html', label: 'Personal Profile', pages: ['personal-profile'], badge: '1' },
        { key: 'security', href: 'security.html', label: 'Security', pages: ['security', 'change-password', 'information-center', 'change-language'], badge: '1' }
      ]
    },
    {
      label: 'History Record',
      items: [
        { key: 'transaction-history', href: 'transaction-history.html', label: 'Transaction History', pages: ['transaction-history'] },
        { key: 'bet-history', href: 'bet-history.html', label: 'Bet History', pages: ['bet-history'] },
        { key: 'commission-record', href: 'commission-record.html', label: 'Commission Record', pages: ['commission-record'] },
        { key: 'rebate-record', href: 'rebate-record.html', label: 'Rebate Record', pages: ['rebate-record'] },
        { key: 'checkin-record', href: 'checkin-record.html', label: 'Daily Check In Record', pages: ['checkin-record'] },
        { key: 'promotion-record', href: 'promotion-record.html', label: 'Promotion Record', pages: ['promotion-record'] }
      ]
    },
    {
      label: 'Extra',
      items: [
        { key: 'referral', href: 'referral.html', label: 'Referral', pages: ['referral', 'my-rewards'] },
        { key: 'gifts', label: 'Bonuses and Gifts', demo: 'Bonuses and Gifts (demo)' },
        { key: 'promo', href: 'promo.html', label: 'Promotions', pages: ['promo'] },
        { key: 'live-chat', href: 'live-chat.html', label: 'Live Chat', pages: ['live-chat'] }
      ]
    }
  ];

  function accountNavItemsFlat() {
    var items = [];
    ACCOUNT_NAV_GROUPS.forEach(function (group) {
      group.items.forEach(function (item) {
        items.push(item);
      });
    });
    return items;
  }

  function isAccountNavActive(item, page) {
    return !!(item.pages && item.pages.indexOf(page) !== -1);
  }

  function accountSidebarCardHtml() {
    return (
      '<div class="acc-card">' +
        '<div class="acc-card-top">' +
          '<div class="acc-ring" aria-label="Profile completion 20%" role="img">' +
            '<svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">' +
              '<circle class="acc-ring-track" cx="24" cy="24" r="19" />' +
              '<circle class="acc-ring-fill" cx="24" cy="24" r="19" />' +
            '</svg>' +
            '<div class="acc-ring-label">1/5</div>' +
          '</div>' +
          '<div class="acc-card-info">' +
            '<div class="acc-card-number">Account №1733760863</div>' +
            '<div class="acc-card-email">m***@gmail.com</div>' +
          '</div>' +
        '</div>' +
        '<div class="acc-card-balances">' +
          '<div class="acc-balance-row">' +
            '<span class="acc-balance-label">Bonus points</span>' +
            '<span class="acc-balance-value">0</span>' +
          '</div>' +
          '<div class="acc-balance-row">' +
            '<span class="acc-balance-label">Main account (MYR)</span>' +
            '<span class="acc-balance-value">0</span>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function accountNavLinkHtml(item, page, opts) {
    opts = opts || {};
    var active = isAccountNavActive(item, page);
    var cls = 'acc-nav-link' + (active ? ' is-active' : '');
    var current = active ? ' aria-current="page"' : '';
    var badge = item.badge
      ? '<span class="acc-nav-badge" aria-label="' + item.badge + ' action required">' + item.badge + '</span>'
      : '';
    var iconKey = item.icon || SUBNAV_ICON_KEYS[item.key] || 'profile';
    var iconHtml = opts.withIcon
      ? '<span class="acc-nav-link-icon" aria-hidden="true">' + accSubnavIcon(iconKey) + '</span>'
      : '';
    var chevronHtml = opts.withChevron
      ? '<span class="acc-nav-link-chevron" aria-hidden="true"></span>'
      : '';
    var inner =
      iconHtml +
      '<span class="acc-nav-link-text">' + item.label + '</span>' +
      badge +
      chevronHtml;

    if (item.demo) {
      return (
        '<button type="button" class="' + cls + '" data-acc-nav-demo="' + item.demo.replace(/"/g, '') + '">' +
          inner +
        '</button>'
      );
    }

    return (
      '<a href="' + item.href + '" class="' + cls + '"' + current + '>' +
        inner +
      '</a>'
    );
  }

  function accountSidebarNavHtml(page) {
    return ACCOUNT_NAV_GROUPS.map(function (group) {
      var links = group.items
        .map(function (item) {
          return accountNavLinkHtml(item, page);
        })
        .join('');

      return (
        '<div class="acc-nav-group">' +
          '<div class="acc-nav-group-label">' + group.label + '</div>' +
          links +
        '</div>'
      );
    }).join('');
  }

  function initAccountSidebar() {
    var sidebar = document.querySelector('.account-sidebar');
    if (!sidebar || !document.querySelector('.account-main')) return;
    if (accountPageKey() === 'live-chat') return;

    var page = accountPageKey();
    sidebar.innerHTML =
      accountSidebarCardHtml() +
      '<div class="acc-sidebar-nav">' + accountSidebarNavHtml(page) + '</div>' +
      '<button type="button" class="account-logout" data-auth-open="logout">Log out</button>';

    Array.prototype.slice.call(sidebar.querySelectorAll('[data-acc-nav-demo]')).forEach(function (btn) {
      btn.addEventListener('click', function () {
        accountToast(btn.getAttribute('data-acc-nav-demo') || 'Demo');
      });
    });
  }

  var SUBNAV_ICON_KEYS = {
    deposit: 'deposit',
    withdraw: 'withdraw',
    'bet-history': 'history',
    'transaction-history': 'transactions',
    'payment-queries': 'queries',
    'commission-record': 'commission',
    'rebate-record': 'rebate',
    'checkin-record': 'checkin',
    'promotion-record': 'promotion',
    'personal-profile': 'profile',
    security: 'security',
    referral: 'referral',
    gifts: 'gifts',
    promo: 'promo',
    'live-chat': 'support'
  };

  function accSubnavIcon(name) {
    var icons = {
      deposit: '<path d="M4 8.5h16v10.5A1.5 1.5 0 0118.5 20.5h-13A1.5 1.5 0 014 19V8.5z" stroke="currentColor" stroke-width="1.6"/><path d="M4 10.5h16M8 8.5V7a2 2 0 012-2h4a2 2 0 012 2v1.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M9 14.5h6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
      withdraw: '<path d="M12 4v9M8.5 9.5L12 13l3.5-3.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 16.5c1 1.8 3.2 3 7 3s6-1.2 7-3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
      history: '<path d="M12 8v4l2.5 2.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 12a8 8 0 1 0 1.5-4.7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M4 4v4h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
      transactions: '<path d="M7 7h13M7 12h13M7 17h9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="4.5" cy="7" r="1.2" fill="currentColor"/><circle cx="4.5" cy="12" r="1.2" fill="currentColor"/><circle cx="4.5" cy="17" r="1.2" fill="currentColor"/>',
      queries: '<path d="M5 6.5A2.5 2.5 0 017.5 4h9A2.5 2.5 0 0119 6.5v7A2.5 2.5 0 0116.5 16H11l-4 3v-3H7.5A2.5 2.5 0 015 13.5v-7z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
      profile: '<circle cx="12" cy="8" r="3" stroke="currentColor" stroke-width="1.6"/><path d="M5 19c.8-3.2 3.2-5 7-5s6.2 1.8 7 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
      security: '<path d="M12 3.5l7 3v5.2c0 4.2-2.8 7.3-7 8.8-4.2-1.5-7-4.6-7-8.8V6.5l7-3z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9.5 12l1.8 1.8L15 10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
      settings: '<circle cx="12" cy="12" r="2.4" stroke="currentColor" stroke-width="1.5"/><path d="M12 4.5v2M12 17.5v2M4.5 12h2M17.5 12h2M6.6 6.6l1.4 1.4M16 16l1.4 1.4M17.4 6.6L16 8M8 16l-1.4 1.4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
      referral: '<circle cx="9" cy="8" r="2.6" stroke="currentColor" stroke-width="1.6"/><path d="M4 19c.7-2.8 2.6-4.2 5-4.2s4.3 1.4 5 4.2M16 8h4M18 6v4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
      rewards: '<path d="M12 3.5l2.2 4.5 4.9.7-3.5 3.4.8 4.9L12 14.8 7.6 16.5l.8-4.9L5 8.7l4.9-.7L12 3.5z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
      commission: '<path d="M9 7.5a3 3 0 116 0c0 2.2-3 2.8-3 4.5M12 17v1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
      rebate: '<path d="M8 8V6.5A2 2 0 0110 4.5h4A2 2 0 0116 6.5V8M5 8h14v11a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 015 19V8z" stroke="currentColor" stroke-width="1.6"/><path d="M12 8v12.5" stroke="currentColor" stroke-width="1.6"/>',
      checkin: '<path d="M8 5h8a1.5 1.5 0 011.5 1.5V19a1.5 1.5 0 01-1.5 1.5H8A1.5 1.5 0 016.5 19V6.5A1.5 1.5 0 018 5z" stroke="currentColor" stroke-width="1.6"/><path d="M9 4v2M15 4v2M8 10h8M10.5 13.5l1.5 1.5 3-3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
      promotion: '<path d="M6 9l2-4h8l2 4v8H6V9z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 14h6M12 9v8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
      gifts: '<path d="M8 8V6.5A2 2 0 0110 4.5h4A2 2 0 0116 6.5V8M5 8h14v11a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 015 19V8z" stroke="currentColor" stroke-width="1.6"/><path d="M12 8v12.5" stroke="currentColor" stroke-width="1.6"/>',
      promo: '<path d="M5 9l2-5h10l2 5H5zM5 9v10h14V9" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 14h6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
      support: '<path d="M5.5 11a2.5 2.5 0 012.5-2.5h1V16H8A2.5 2.5 0 015.5 13.5V11zM18.5 11a2.5 2.5 0 00-2.5-2.5h-1V16H16a2.5 2.5 0 002.5-2.5V11z" stroke="currentColor" stroke-width="1.6"/><path d="M8 8.5a4 4 0 018 0" stroke="currentColor" stroke-width="1.6"/>'
    };
    return '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' + (icons[name] || icons.profile) + '</svg>';
  }

  function initAccSubnav() {
    if (accountPageKey() === 'live-chat') return;
    var main = document.querySelector('.account-main');
    if (!main || document.querySelector('.acc-subnav')) return;

    var page = accountPageKey();
    var items = accountNavItemsFlat().map(function (item) {
      return {
        key: item.key,
        href: item.href,
        label: item.label,
        icon: SUBNAV_ICON_KEYS[item.key] || 'profile',
        pages: item.pages,
        badge: item.badge,
        demo: item.demo
      };
    });

    var cards = items.map(function (item) {
      var active = item.pages && item.pages.indexOf(page) !== -1;
      var badge = item.badge
        ? '<span class="acc-subnav-badge" aria-label="' + item.badge + ' action required">' + item.badge + '</span>'
        : '';
      var cls = 'acc-subnav-card' + (active ? ' is-active' : '');
      var current = active ? ' aria-current="page"' : '';

      if (item.demo) {
        return (
          '<button type="button" class="' + cls + '" data-acc-sub-demo="' + item.demo.replace(/"/g, '') + '">' +
            badge + accSubnavIcon(item.icon) + '<span>' + item.label + '</span>' +
          '</button>'
        );
      }

      return (
        '<a href="' + item.href + '" class="' + cls + '"' + current + '>' +
          badge + accSubnavIcon(item.icon) + '<span>' + item.label + '</span>' +
        '</a>'
      );
    }).join('');

    var nav = document.createElement('nav');
    nav.className = 'acc-subnav';
    nav.setAttribute('aria-label', 'Account menu');
    nav.innerHTML = '<div class="acc-subnav-track">' + cards + '</div>';

    var shell = main.querySelector('.account-shell');
    if (shell) main.insertBefore(nav, shell);
    else main.prepend(nav);

    Array.prototype.slice.call(nav.querySelectorAll('[data-acc-sub-demo]')).forEach(function (btn) {
      btn.addEventListener('click', function () {
        accountToast(btn.getAttribute('data-acc-sub-demo') || 'Demo');
      });
    });

    var activeCard = nav.querySelector('.acc-subnav-card.is-active');
    if (activeCard && typeof activeCard.scrollIntoView === 'function') {
      setTimeout(function () {
        activeCard.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
      }, 50);
    }
  }

  function initAccountTabbar() {
    var tabbar = document.querySelector('.mobile-tabbar');
    if (!tabbar || !document.querySelector('.account-main')) return;
    if (tabbar.dataset.accountTabbar === '1') return;

    document.body.classList.add('has-account-tabbar');
    tabbar.classList.add('mobile-tabbar--account');
    tabbar.setAttribute('aria-label', 'Account mobile navigation');
    tabbar.dataset.accountTabbar = '1';
    tabbar.innerHTML =
      '<a href="index.html" class="mobile-tab">' +
        '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 10.5L12 4l8 6.5V20a1 1 0 01-1 1h-5v-6H10v6H5a1 1 0 01-1-1v-9.5z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>' +
        '<span>Home</span>' +
      '</a>' +
      '<a href="promo.html" class="mobile-tab">' +
        '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 7V5.8A1.8 1.8 0 019.8 4h4.4A1.8 1.8 0 0116 5.8V7M5 7h14v12a2 2 0 01-2 2H7a2 2 0 01-2-2V7z" stroke="currentColor" stroke-width="1.7"/><path d="M12 11v5M9.5 13.5h5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>' +
        '<span>Promotion</span>' +
      '</a>' +
      '<a href="deposit.html" class="mobile-tab mobile-tab--fab">' +
        '<span class="mobile-tab-fab-btn" aria-hidden="true">' +
          '<svg viewBox="0 0 24 24" fill="none"><path d="M12 6v12M6 12h12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>' +
        '</span>' +
        '<span>Deposit</span>' +
      '</a>' +
      '<a href="live-chat.html" class="mobile-tab" id="mobile-livechat-btn">' +
        '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 6.5A2.5 2.5 0 017.5 4h9A2.5 2.5 0 0119 6.5v7A2.5 2.5 0 0116.5 16H11l-4 3v-3H7.5A2.5 2.5 0 015 13.5v-7z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="9" cy="10" r="1" fill="currentColor"/><circle cx="12" cy="10" r="1" fill="currentColor"/><circle cx="15" cy="10" r="1" fill="currentColor"/></svg>' +
        '<span>Livechat</span>' +
      '</a>' +
      '<a href="personal-profile.html" class="mobile-tab is-active">' +
        '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="8" r="3.2" stroke="currentColor" stroke-width="1.7"/><path d="M5.5 19c.8-3.2 3.3-5 6.5-5s5.7 1.8 6.5 5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>' +
        '<span>Account</span>' +
      '</a>';

    var chatBtn = document.getElementById('mobile-livechat-btn');
    if (chatBtn && accountPageKey() === 'live-chat') {
      chatBtn.classList.add('is-active');
      var accountTab = tabbar.querySelector('a[href="personal-profile.html"]');
      if (accountTab) accountTab.classList.remove('is-active');
    }
  }

  initAccountSidebar();
  initAccSubnav();
  initAccountTabbar();

})();
