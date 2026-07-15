/* membership-invite.js — Guest VIP info board; logged-in → membership.html */
(function () {
  "use strict";

  var AUTH_KEY = "1xbet_logged_in";

  try {
    if (sessionStorage.getItem(AUTH_KEY) === "1") {
      location.replace("membership.html");
    }
  } catch (e) { /* ignore */ }
})();
