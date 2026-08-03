/* Long-term bets — sport chip filtering (demo) */
(function () {
  "use strict";

  function $$(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function filterSport(key) {
    $$("[data-mh-sp-chip]").forEach(function (chip) {
      var on = chip.getAttribute("data-mh-sp-chip") === key;
      chip.classList.toggle("is-active", on);
    });
    $$("[data-mh-lt-sport]").forEach(function (block) {
      var match = block.getAttribute("data-mh-lt-sport") === key;
      block.hidden = !match;
    });
  }

  function initChips() {
    var chips = $$("[data-mh-sp-chip]");
    if (!chips.length) return;

    var active = chips.find(function (c) {
      return c.classList.contains("is-active");
    });
    if (active) filterSport(active.getAttribute("data-mh-sp-chip"));

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        filterSport(chip.getAttribute("data-mh-sp-chip"));
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initChips);
  } else {
    initChips();
  }
})();
