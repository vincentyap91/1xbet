/* terms.js — TOC navigation, search filter, header interactions */
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
    btn.addEventListener('click', function () {
      if (nav.classList.contains('is-open')) {
        close();
      } else {
        nav.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
        if (backdrop) { backdrop.hidden = false; document.body.classList.add('drawer-open'); }
      }
    });
    if (backdrop) backdrop.addEventListener('click', close);
  })();

  /* ── Header dropdowns ───────────────────────────────────── */
  (function dropdowns() {
    document.querySelectorAll('.nav-item.has-dropdown').forEach(function (item) {
      const btn = item.querySelector('.nav-link');
      const dd = item.querySelector('.dropdown');
      if (!btn || !dd) return;
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const open = btn.getAttribute('aria-expanded') === 'true';
        document.querySelectorAll('.nav-link[aria-expanded="true"]').forEach(function (b) {
          b.setAttribute('aria-expanded', 'false');
          const p = b.closest('.nav-item');
          if (p) { const d = p.querySelector('.dropdown'); if (d) d.classList.remove('open'); }
        });
        if (!open) { btn.setAttribute('aria-expanded', 'true'); dd.classList.add('open'); }
      });
    });
    document.addEventListener('click', function () {
      document.querySelectorAll('.nav-link[aria-expanded="true"]').forEach(function (b) {
        b.setAttribute('aria-expanded', 'false');
        const p = b.closest('.nav-item');
        if (p) { const d = p.querySelector('.dropdown'); if (d) d.classList.remove('open'); }
      });
    });
  })();

  /* ── TOC section switching ──────────────────────────────── */
  const tocItems = document.querySelectorAll('.terms-toc-item');
  const sections = document.querySelectorAll('.terms-section');

  function showSection(sectionNum) {
    tocItems.forEach(function (item) {
      item.classList.toggle('active', item.dataset.section === String(sectionNum));
    });
    sections.forEach(function (section) {
      section.classList.toggle('active', section.dataset.section === String(sectionNum));
    });
    // Scroll content back to top
    const content = document.getElementById('terms-content');
    if (content) content.scrollTop = 0;
  }

  tocItems.forEach(function (item) {
    const btn = item.querySelector('button');
    if (!btn) return;
    btn.addEventListener('click', function () {
      showSection(item.dataset.section);
    });
  });

  /* ── Search filter ──────────────────────────────────────── */
  const searchInput = document.getElementById('terms-search');
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      const q = searchInput.value.trim().toLowerCase();
      tocItems.forEach(function (item) {
        if (!q) {
          item.hidden = false;
        } else {
          const text = (item.querySelector('button') || item).textContent.toLowerCase();
          item.hidden = !text.includes(q);
        }
      });
    });

    // Clear search on Escape
    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        searchInput.value = '';
        tocItems.forEach(function (item) { item.hidden = false; });
      }
    });
  }

  /* ── Show all button ────────────────────────────────────── */
  const showAllBtn = document.getElementById('terms-show-all');
  if (showAllBtn) {
    showAllBtn.addEventListener('click', function () {
      if (searchInput) searchInput.value = '';
      tocItems.forEach(function (item) { item.hidden = false; });
      showSection(1);
    });
  }

})();
