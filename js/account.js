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

    function isMobileDepositViewport() {
      return window.matchMedia('(max-width: 900px)').matches;
    }

    function enhanceMobileAccordions(container, cat) {
      var sections = Array.prototype.slice.call(
        container.querySelectorAll('.dep-section')
      );
      if (!sections.length || !isMobileDepositViewport()) return;

      var useAccordion = cat === 'all';

      sections.forEach(function (section, index) {
        var label = section.querySelector('.dep-group-label, .dep-section-toggle');
        var grid = section.querySelector('.dep-grid');
        if (!grid) return;

        var titleText = '';
        if (label) {
          titleText = (label.querySelector('.dep-section-toggle-title') || label)
            .textContent
            .trim();
        }
        if (!titleText) titleText = section.dataset.section || 'Methods';

        var body = section.querySelector('.dep-section-body');
        if (!body) {
          body = document.createElement('div');
          body.className = 'dep-section-body';
          grid.parentNode.insertBefore(body, grid);
          body.appendChild(grid);
        }

        var count = grid.querySelectorAll('.pay-method-card').length;
        var toggle = section.querySelector('.dep-section-toggle');

        if (!toggle) {
          toggle = document.createElement('button');
          toggle.type = 'button';
          toggle.className = 'dep-section-toggle';
          if (label && label.parentNode === section) {
            section.replaceChild(toggle, label);
          } else {
            section.insertBefore(toggle, body);
          }
        }

        toggle.innerHTML =
          '<span class="dep-section-toggle-text">' +
            '<span class="dep-section-toggle-title"></span>' +
          '</span>' +
          '<span class="dep-section-toggle-count"></span>' +
          '<span class="dep-section-chevron" aria-hidden="true"></span>';
        toggle.querySelector('.dep-section-toggle-title').textContent = titleText;
        toggle.querySelector('.dep-section-toggle-count').textContent = String(count);

        section.classList.toggle('dep-section--accordion', useAccordion);

        if (!useAccordion) {
          section.classList.add('is-open');
          toggle.setAttribute('aria-expanded', 'true');
          toggle.disabled = true;
          toggle.setAttribute('tabindex', '-1');
          return;
        }

        toggle.disabled = false;
        toggle.removeAttribute('tabindex');

        var shouldOpen =
          section.dataset.section === 'recommended' ||
          (index === 0 && !container.querySelector('[data-section="recommended"]'));
        section.classList.toggle('is-open', shouldOpen);
        toggle.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
      });

      if (!useAccordion) return;

      container.querySelectorAll('.dep-section-toggle').forEach(function (toggle) {
        toggle.addEventListener('click', function () {
          var section = toggle.closest('.dep-section');
          if (!section) return;
          var willOpen = !section.classList.contains('is-open');

          container.querySelectorAll('.dep-section--accordion').forEach(function (s) {
            var open = willOpen && s === section;
            s.classList.toggle('is-open', open);
            var t = s.querySelector('.dep-section-toggle');
            if (t) t.setAttribute('aria-expanded', open ? 'true' : 'false');
          });
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
        enhanceMobileAccordions(sectionsPanel, cat);
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

    function syncCategoryControls(cat) {
      catBtns.forEach(function (b) {
        var on = b.dataset.cat === cat;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-selected', on ? 'true' : 'false');
      });
    }

    function selectCategory(cat, animate) {
      if (cat === activeCategory && animate) return;
      syncCategoryControls(cat);
      renderCategory(cat, animate);
    }

    catBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        selectCategory(btn.dataset.cat, true);
      });
    });

    renderCategory('all', false);

    var wasMobileDeposit = isMobileDepositViewport();
    window.addEventListener('resize', function () {
      var nowMobile = isMobileDepositViewport();
      if (nowMobile === wasMobileDeposit) return;
      wasMobileDeposit = nowMobile;
      /* Mobile always uses All-methods accordion; restore rail filter on desktop */
      if (nowMobile) selectCategory('all', false);
      else renderCategory(activeCategory, false);
    });
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

  /* ── Daily Check-In ────────────────────────────────────── */
  if (pageKey === 'daily-checkin') {
    var claimedIcon =
      '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    var claimBackdrop = document.getElementById('dci-claim-backdrop');
    var claimText = document.getElementById('dci-claim-text');
    var claimOk = document.getElementById('dci-claim-ok');
    var claimModal = claimBackdrop && claimBackdrop.querySelector('.dci-claim-modal');

    function openClaimPopup(reward) {
      if (!claimBackdrop) return;
      if (claimText) {
        claimText.textContent = 'You have earned ' + reward + ' in your wallet.';
      }
      claimBackdrop.hidden = false;
      claimBackdrop.classList.add('is-open');
      document.body.classList.add('dci-claim-open');
      if (claimModal) claimModal.focus();
    }

    function closeClaimPopup() {
      if (!claimBackdrop) return;
      claimBackdrop.classList.remove('is-open');
      claimBackdrop.hidden = true;
      document.body.classList.remove('dci-claim-open');
    }

    if (claimOk) claimOk.addEventListener('click', closeClaimPopup);
    if (claimBackdrop) {
      claimBackdrop.addEventListener('click', function (e) {
        if (e.target === claimBackdrop) closeClaimPopup();
      });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && claimBackdrop && !claimBackdrop.hidden) closeClaimPopup();
    });

    Array.prototype.slice.call(document.querySelectorAll('[data-dci-claim]')).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var card = btn.closest('.dci-day');
        if (!card || card.classList.contains('is-claimed')) return;
        var reward = card.getAttribute('data-reward') || 'reward';
        card.classList.remove('is-claimable');
        card.classList.add('is-claimed');
        btn.classList.remove('dci-day-btn--claim');
        btn.removeAttribute('data-dci-claim');
        btn.disabled = true;
        btn.innerHTML = claimedIcon;
        btn.setAttribute('aria-label', 'Claimed');
        openClaimPopup(reward);
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
        {
          key: 'transaction-history',
          href: 'transaction-history.html',
          label: 'Transaction History',
          pages: ['transaction-history', 'commission-record', 'rebate-record', 'checkin-record']
        },
        { key: 'bet-history', href: 'bet-history.html', label: 'Bet History', pages: ['bet-history'] },
        { key: 'promotion-record', href: 'promotion-record.html', label: 'Promotion Record', pages: ['promotion-record'] }
      ]
    },
    {
      label: 'Extra',
      items: [
        { key: 'referral', href: 'referral-invite.html', label: 'Referral' },
        { key: 'membership', href: 'membership-invite.html', label: 'Membership', icon: 'rewards' },
        { key: 'rebate', href: 'rebate-invite.html', label: 'Rebate', icon: 'rebate' },
        { key: 'daily-checkin', href: 'daily-checkin.html', label: 'Daily Check In', pages: ['daily-checkin'] },
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
    deposit: 'wallet',
    withdraw: 'wallet',
    'bet-history': 'dice',
    'transaction-history': 'exchange',
    'payment-queries': 'info-circle',
    messages: 'messages',
    'commission-record': 'percent',
    'rebate-record': 'gift',
    'checkin-record': 'calendar-check',
    'promotion-record': 'bullhorn',
    'personal-profile': 'user-circle',
    security: 'key',
    referral: 'user-plus',
    membership: 'gift',
    rebate: 'percent',
    'daily-checkin': 'calendar-check',
    promo: 'bullhorn',
    'live-chat': 'headset'
  };

  /* Figma 96:9 exported glyphs → assets/icons/account-subnav/*.svg (mask + currentColor) */
  function accSubnavIcon(name) {
    var fileMap = {
      wallet: 'wallet.svg',
      'user-plus': 'user-plus.svg',
      percent: 'percent.svg',
      'user-circle': 'user-circle.svg',
      exchange: 'exchange.svg',
      dice: 'dice.svg',
      gift: 'gift.svg',
      'calendar-check': 'calendar-check.svg',
      bullhorn: 'bullhorn.svg',
      globe: 'globe.svg',
      key: 'key.svg',
      headset: 'headset.svg',
      'info-circle': 'info-circle.svg',
      messages: 'messages.svg',
      deposit: 'wallet.svg',
      withdraw: 'wallet.svg',
      history: 'dice.svg',
      transactions: 'exchange.svg',
      queries: 'info-circle.svg',
      profile: 'user-circle.svg',
      security: 'key.svg',
      referral: 'user-plus.svg',
      rewards: 'gift.svg',
      commission: 'percent.svg',
      rebate: 'percent.svg',
      checkin: 'calendar-check.svg',
      promotion: 'bullhorn.svg',
      gifts: 'gift.svg',
      promo: 'bullhorn.svg',
      support: 'headset.svg',
      language: 'globe.svg',
      password: 'key.svg',
      info: 'info-circle.svg'
    };
    var file = fileMap[name] || 'user-circle.svg';
    var url = 'assets/icons/account-subnav/' + file;
    return (
      '<span class="acc-subnav-icon" aria-hidden="true">' +
        '<img src="' + url + '" alt="" width="18" height="18" decoding="async" />' +
      '</span>'
    );
  }

  function messagesUnreadBadge() {
    try {
      var data = window.MessagesData;
      if (!data || typeof data.load !== 'function') return '';
      var list = data.load();
      var n = typeof data.unreadCount === 'function'
        ? data.unreadCount(list)
        : (list || []).filter(function (m) { return m && m.unread; }).length;
      return n > 0 ? String(n) : '';
    } catch (err) {
      return '';
    }
  }

  function buildAccSubnavItems() {
    /* Mobile chips only: hide Payment Queries; insert Messages after Withdraw. */
    var items = [];
    accountNavItemsFlat().forEach(function (item) {
      if (item.key === 'payment-queries') return;
      items.push({
        key: item.key,
        href: item.href,
        label: item.label,
        icon: SUBNAV_ICON_KEYS[item.key] || item.icon || 'profile',
        pages: item.pages,
        badge: item.badge,
        demo: item.demo
      });
      if (item.key === 'withdraw') {
        var msgBadge = messagesUnreadBadge();
        items.push({
          key: 'messages',
          href: '#',
          label: 'Messages',
          icon: 'messages',
          action: 'messages',
          badge: msgBadge || undefined
        });
      }
    });
    return items;
  }

  function initAccSubnav() {
    if (accountPageKey() === 'live-chat') return;
    var main = document.querySelector('.account-main');
    if (!main || document.querySelector('.acc-subnav')) return;

    var page = accountPageKey();
    var items = buildAccSubnavItems();

    var cards = items.map(function (item) {
      var active = item.pages && item.pages.indexOf(page) !== -1;
      var badgeLabel = item.action === 'messages' ? ' unread' : ' action required';
      var badge = item.badge
        ? '<span class="acc-subnav-badge" aria-label="' + item.badge + badgeLabel + '">' + item.badge + '</span>'
        : '';
      var cls = 'acc-subnav-card' + (active ? ' is-active' : '');
      var current = active ? ' aria-current="page"' : '';

      if (item.action === 'messages') {
        return (
          '<button type="button" class="' + cls + ' acc-subnav-card--messages" data-acc-sub-messages>' +
            badge + accSubnavIcon(item.icon) + '<span>' + item.label + '</span>' +
          '</button>'
        );
      }

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

    Array.prototype.slice.call(nav.querySelectorAll('[data-acc-sub-messages]')).forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (window.MessagesUI && typeof window.MessagesUI.toggle === 'function') {
          window.MessagesUI.toggle();
          return;
        }
        var headerBtn = document.querySelector('.header-msg-btn');
        if (headerBtn) headerBtn.click();
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
    /* Universal tabbar is built in js/script.js (guest + logged-in). */
    var tabbar = document.querySelector('.mobile-tabbar');
    if (tabbar && tabbar.dataset.mainTabbar === '1') return;
  }

  initAccountSidebar();
  initAccSubnav();
  initAccountTabbar();

})();
