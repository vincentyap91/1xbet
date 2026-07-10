/* payments.js — category filter, tabs, deposit toast, header */
(function () {
  'use strict';

  /* ── Clock ──────────────────────────────────────────────── */
  (function clock() {
    const el = document.getElementById('header-clock');
    if (!el) return;
    function tick() {
      const n = new Date();
      el.textContent = n.getHours().toString().padStart(2, '0') + ':' + n.getMinutes().toString().padStart(2, '0');
    }
    tick();
    setInterval(tick, 30000);
  })();

  /* ── Mobile menu ────────────────────────────────────────── */
  (function mobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const nav = document.getElementById('header-bottom');
    const backdrop = document.getElementById('drawer-backdrop');
    if (!btn || !nav) return;
    function close() {
      nav.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      if (backdrop) { backdrop.hidden = true; document.body.classList.remove('drawer-open'); }
    }
    btn.addEventListener('click', () => {
      const open = nav.classList.contains('is-open');
      open ? close() : (() => {
        nav.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
        if (backdrop) { backdrop.hidden = false; document.body.classList.add('drawer-open'); }
      })();
    });
    if (backdrop) backdrop.addEventListener('click', close);
  })();

  /* ── Header dropdowns ───────────────────────────────────── */
  (function dropdowns() {
    document.querySelectorAll('.nav-item.has-dropdown').forEach(item => {
      const btn = item.querySelector('.nav-link');
      const dd = item.querySelector('.dropdown');
      if (!btn || !dd) return;
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const open = btn.getAttribute('aria-expanded') === 'true';
        document.querySelectorAll('.nav-link[aria-expanded="true"]').forEach(b => {
          b.setAttribute('aria-expanded', 'false');
          b.closest('.nav-item')?.querySelector('.dropdown')?.classList.remove('open');
        });
        if (!open) { btn.setAttribute('aria-expanded', 'true'); dd.classList.add('open'); }
      });
    });
    document.addEventListener('click', () => {
      document.querySelectorAll('.nav-link[aria-expanded="true"]').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        b.closest('.nav-item')?.querySelector('.dropdown')?.classList.remove('open');
      });
    });
  })();

  /* ── Toast ──────────────────────────────────────────────── */
  function showToast(msg, duration) {
    duration = duration || 3000;
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.hidden = false;
    t.classList.add('show');
    setTimeout(function () {
      t.classList.remove('show');
      setTimeout(function () { t.hidden = true; }, 300);
    }, duration);
  }

  /* ── Deposit / Withdrawal tabs ──────────────────────────── */
  const tabBtns = document.querySelectorAll('.payments-tab');
  const grid = document.getElementById('payments-grid');

  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      tabBtns.forEach(function (b) {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      // Update heading
      const title = document.querySelector('.payments-page-title');
      if (title) title.textContent = btn.dataset.tab === 'withdrawal' ? 'Withdrawal' : 'Deposit';
      // Refresh card button labels
      document.querySelectorAll('.payments-card-btn').forEach(function (b) {
        b.textContent = btn.dataset.tab === 'withdrawal' ? 'Withdraw' : 'Deposit';
      });
      // Reset category filter
      setActiveCategory('all');
    });
  });

  /* ── Category filter ────────────────────────────────────── */
  const catBtns = document.querySelectorAll('.payments-cat-btn');

  function setActiveCategory(cat) {
    catBtns.forEach(function (b) {
      b.classList.toggle('active', b.dataset.cat === cat);
    });
    if (!grid) return;
    const cards = grid.querySelectorAll('.payments-card');
    cards.forEach(function (card) {
      if (cat === 'all') {
        card.hidden = false;
      } else {
        const cardCats = (card.dataset.cat || '').split(' ');
        card.hidden = !cardCats.includes(cat);
      }
    });
  }

  catBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      setActiveCategory(btn.dataset.cat);
    });
  });

  /* ── Deposit button toasts ──────────────────────────────── */
  if (grid) {
    grid.addEventListener('click', function (e) {
      const btn = e.target.closest('.payments-card-btn');
      if (!btn) return;
      const method = btn.dataset.method || 'payment';
      const action = btn.textContent.trim();
      showToast(action + ' via ' + method + ' — demo only. No real transaction has been made.', 4000);
    });
  }

  /* ── Region button ──────────────────────────────────────── */
  const regionBtn = document.getElementById('payments-region-btn');
  if (regionBtn) {
    regionBtn.addEventListener('click', function () {
      showToast('Region selection — demo only.', 2500);
    });
  }

})();
