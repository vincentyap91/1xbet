(() => {
  "use strict";

  if (!document.body.classList.contains("mh-page--personal-profile")) return;

  const $ = (sel, root = document) => root.querySelector(sel);

  function toast(msg) {
    const el = $("#mh-toast");
    if (!el) return;
    el.hidden = false;
    el.textContent = msg;
    window.clearTimeout(toast._t);
    toast._t = window.setTimeout(() => {
      el.hidden = true;
    }, 1800);
  }

  function init() {
    try {
      if (localStorage.getItem("mh-logged-in-v1") !== "1") {
        window.location.replace("login.html");
        return;
      }
    } catch (_) {
      /* continue */
    }

    $("#mh-pp-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      toast("Profile saved (demo)");
    });

    document.addEventListener("click", (e) => {
      if (e.target.closest("[data-mh-pp-end-promo]")) {
        toast("Promo ended (demo)");
      }
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
