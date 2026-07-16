/* referral.js — Referral dashboard (standalone invite page + legacy account page) */
(function () {
  "use strict";

  function toast(msg) {
    if (typeof window.showToast === "function") {
      window.showToast(msg);
      return;
    }
    if (typeof window.accountToast === "function") {
      window.accountToast(msg);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!document.querySelector(".ref-content")) return;

    Array.prototype.slice.call(document.querySelectorAll("[data-ref-copy-target]")).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var targetId = btn.getAttribute("data-ref-copy-target");
        var target = targetId ? document.getElementById(targetId) : null;
        if (!target) return;
        var value = (target.value != null ? target.value : target.textContent || "").trim();
        var label = "Referral link";
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(value).then(function () {
            toast(label + " copied");
          }).catch(function () {
            toast(label + " ready to copy");
          });
        } else {
          toast(label + " ready to copy");
        }
      });
    });

    var downlinesBtn = document.getElementById("ref-downlines-btn");
    var dlBackdrop = document.getElementById("dl-backdrop");
    var dlClose = document.getElementById("dl-close");
    var dlModal = dlBackdrop && dlBackdrop.querySelector(".dl-modal");

    function openDownlines() {
      if (!dlBackdrop) return;
      dlBackdrop.hidden = false;
      document.body.classList.add("dl-modal-open");
      if (dlModal) dlModal.focus();
    }

    function closeDownlines() {
      if (!dlBackdrop) return;
      dlBackdrop.hidden = true;
      document.body.classList.remove("dl-modal-open");
    }

    if (downlinesBtn) downlinesBtn.addEventListener("click", openDownlines);
    if (dlClose) dlClose.addEventListener("click", closeDownlines);
    if (dlBackdrop) {
      dlBackdrop.addEventListener("click", function (e) {
        if (e.target === dlBackdrop) closeDownlines();
      });
    }
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && dlBackdrop && !dlBackdrop.hidden) closeDownlines();
    });

    var dlTabs = Array.prototype.slice.call(document.querySelectorAll("[data-dl-tab]"));
    var dlPanels = Array.prototype.slice.call(document.querySelectorAll("[data-dl-panel]"));
    dlTabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var key = tab.getAttribute("data-dl-tab");
        dlTabs.forEach(function (t) {
          var on = t === tab;
          t.classList.toggle("is-active", on);
          t.setAttribute("aria-selected", on ? "true" : "false");
        });
        dlPanels.forEach(function (panel) {
          panel.hidden = panel.getAttribute("data-dl-panel") !== key;
        });
      });
    });

    function formatDlDate(date) {
      var d = String(date.getDate()).padStart(2, "0");
      var m = String(date.getMonth() + 1).padStart(2, "0");
      var y = date.getFullYear();
      return d + "-" + m + "-" + y;
    }

    function startOfWeek(date) {
      var d = new Date(date);
      var day = d.getDay();
      var diff = day === 0 ? -6 : 1 - day;
      d.setDate(d.getDate() + diff);
      d.setHours(0, 0, 0, 0);
      return d;
    }

    function applyDlPeriod(period) {
      var now = new Date();
      var start = new Date(now);
      var end = new Date(now);

      if (period === "yesterday") {
        start.setDate(now.getDate() - 1);
        end.setDate(now.getDate() - 1);
      } else if (period === "this-week") {
        start = startOfWeek(now);
        end = new Date(now);
      } else if (period === "last-week") {
        end = startOfWeek(now);
        end.setDate(end.getDate() - 1);
        start = startOfWeek(end);
      } else if (period === "this-month") {
        start = new Date(now.getFullYear(), now.getMonth(), 1);
      } else if (period === "last-month") {
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        end = new Date(now.getFullYear(), now.getMonth(), 0);
      }

      var startInput = document.getElementById("dl-start-date");
      var endInput = document.getElementById("dl-end-date");
      if (startInput) startInput.value = formatDlDate(start);
      if (endInput) endInput.value = formatDlDate(end);
    }

    Array.prototype.slice.call(document.querySelectorAll("[data-dl-period]")).forEach(function (btn) {
      btn.addEventListener("click", function () {
        Array.prototype.slice.call(document.querySelectorAll("[data-dl-period]")).forEach(function (b) {
          b.classList.toggle("is-active", b === btn);
        });
        applyDlPeriod(btn.getAttribute("data-dl-period"));
      });
    });

    Array.prototype.slice.call(document.querySelectorAll("[data-ref-share]")).forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        toast("Share via " + (btn.getAttribute("data-ref-share") || "social") + " (demo)");
      });
    });

    var topTabs = Array.prototype.slice.call(document.querySelectorAll("[data-ref-top]"));
    var topPanels = Array.prototype.slice.call(document.querySelectorAll("[data-ref-panel]"));

    function setReferralTopTab(key) {
      topTabs.forEach(function (t) {
        var on = t.getAttribute("data-ref-top") === key;
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-selected", on ? "true" : "false");
      });
      topPanels.forEach(function (panel) {
        panel.hidden = panel.getAttribute("data-ref-panel") !== key;
      });
      if (history.replaceState) {
        history.replaceState(null, "", key === "rewards" ? "#rewards" : (location.pathname + location.search));
      }
    }

    topTabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        setReferralTopTab(tab.getAttribute("data-ref-top"));
      });
    });

    if ((location.hash || "").toLowerCase() === "#rewards") {
      setReferralTopTab("rewards");
    }

    Array.prototype.slice.call(document.querySelectorAll("[data-ref-claim]")).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var type = btn.getAttribute("data-ref-claim") || "bonus";
        toast("Claim " + type + " bonus (demo)");
      });
    });

    var historyTabs = Array.prototype.slice.call(document.querySelectorAll("[data-ref-history]"));
    var historyPanels = Array.prototype.slice.call(document.querySelectorAll("[data-ref-history-panel]"));
    historyTabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var key = tab.getAttribute("data-ref-history");
        historyTabs.forEach(function (t) {
          var on = t === tab;
          t.classList.toggle("is-active", on);
          t.setAttribute("aria-selected", on ? "true" : "false");
        });
        historyPanels.forEach(function (panel) {
          panel.hidden = panel.getAttribute("data-ref-history-panel") !== key;
        });
      });
    });
  });
})();
