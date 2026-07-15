/* promo-detail.js — sticky Register CTA on mobile */
(function () {
  'use strict';

  if (document.body.dataset.page !== 'promo-detail') return;

  var sticky = document.getElementById('pd-sticky-cta');
  var cardCta = document.querySelector('.pd-cta-wrap');
  if (!sticky || !cardCta || !('IntersectionObserver' in window)) return;

  var observer = new IntersectionObserver(
    function (entries) {
      var entry = entries[0];
      if (!entry) return;
      sticky.classList.toggle('is-hidden', entry.isIntersecting);
    },
    { root: null, threshold: 0.2 }
  );

  observer.observe(cardCta);
})();
