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
  var catBtns    = Array.prototype.slice.call(document.querySelectorAll('.dep-cat-btn'));
  var methodCards = Array.prototype.slice.call(document.querySelectorAll('.pay-method-card'));

  if (catBtns.length) {
    catBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        catBtns.forEach(function (b) {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');

        var cat = btn.dataset.cat;
        methodCards.forEach(function (card) {
          if (cat === 'all') {
            card.style.display = '';
          } else {
            var cats = (card.dataset.category || '').split(' ');
            card.style.display = cats.indexOf(cat) !== -1 ? '' : 'none';
          }
        });
      });
    });
  }

  /* ── Payment card selection ─────────────────────────────── */
  methodCards.forEach(function (card) {
    card.addEventListener('click', function () {
      methodCards.forEach(function (c) { c.classList.remove('is-selected'); });
      card.classList.add('is-selected');
    });
  });

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
