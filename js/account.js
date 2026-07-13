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
  var profileForm = document.getElementById('profile-form');
  if (profileForm) {
    profileForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (typeof window.showToast === 'function') {
        window.showToast('Profile saved (demo)');
      } else if (window.AuthModals) {
        /* fallback */
        alert('Profile saved (demo)');
      }
    });
  }

  /* ── Logout uses AuthModals confirm dialog ─────────────── */
  // Handled by auth-modals.js via [data-auth-open="logout"]

})();
