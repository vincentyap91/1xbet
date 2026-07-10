/* about-us.js — hero carousel + shared header interactions */
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
    function open() {
      nav.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      if (backdrop) { backdrop.hidden = false; document.body.classList.add('drawer-open'); }
    }
    function close() {
      nav.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      if (backdrop) { backdrop.hidden = true; document.body.classList.remove('drawer-open'); }
    }
    btn.addEventListener('click', () => nav.classList.contains('is-open') ? close() : open());
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

  /* ── Hero: static single layer (no carousel) ───────────── */
  /* Slider controls removed from markup; keep this no-op safe. */
  /* ── Toast helper ───────────────────────────────────────── */
  window.showToast = function (msg, duration = 3000) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.hidden = false;
    t.classList.add('show');
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => { t.hidden = true; }, 300); }, duration);
  };

})();
