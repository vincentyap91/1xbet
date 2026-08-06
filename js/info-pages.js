/* info-pages.js — shared Information menu (mobile select) */
(function () {
  "use strict";

  var select = document.querySelector("[data-info-nav-select]");
  if (!select) return;

  select.addEventListener("change", function () {
    var href = String(select.value || "").trim();
    if (!href || href === "#") return;
    var page = window.location.pathname.split("/").pop() || "";
    if (href === page) return;
    window.location.href = href;
  });
})();
