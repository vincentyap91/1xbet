/* membership.js — VIP tier tables (data from 12winkh.vip/en/membership) */
(function () {
  "use strict";

  var TIER_DATA = {
    normal: {
      benefits: [
        ["Deposits and Withdrawals", "High Priority"],
        ["Daily Withdrawal Limitation", "No Limit"],
        ["Birthday Bonus", "0"],
      ],
      rebates: [
        ["Sport", "5%"],
        ["Live Casino", "5%"],
        ["Slot", "5%"],
        ["Fish Hunt", "5%"],
        ["ESport", "5%"],
      ],
      requirements: [
        { title: "Monthly Level Upgrade Requirement", rows: [["Progressive Deposit", "-"]] },
        { title: "Monthly Level Retention Requirement", rows: [["Past 3 Months Accumulated Deposit", "-"]] },
        { title: "Membership Renewal", rows: [["Membership Renewal", "Lifetime"]] },
      ],
    },
    bronze: {
      benefits: [
        ["Deposits and Withdrawals", "High Priority"],
        ["Daily Withdrawal Limitation", "20,000"],
        ["Birthday Bonus", "58"],
      ],
      rebates: [
        ["Sport", "6%"],
        ["Live Casino", "6%"],
        ["Slot", "6%"],
        ["Fish Hunt", "6%"],
        ["ESport", "6%"],
      ],
      requirements: [
        { title: "Monthly Level Upgrade Requirement", rows: [["Progressive Deposit", "15,000"]] },
        { title: "Monthly Level Retention Requirement", rows: [["Past 3 Months Accumulated Deposit", "-"]] },
        { title: "Membership Renewal", rows: [["Membership Renewal", "Lifetime"]] },
      ],
    },
    silver: {
      benefits: [
        ["Deposits and Withdrawals", "High Priority"],
        ["Daily Withdrawal Limitation", "30,000"],
        ["Birthday Bonus", "188"],
      ],
      rebates: [
        ["Sport", "7%"],
        ["Live Casino", "7%"],
        ["Slot", "7%"],
        ["Fish Hunt", "7%"],
        ["ESport", "7%"],
      ],
      requirements: [
        { title: "Monthly Level Upgrade Requirement", rows: [["Progressive Deposit", "30,000"]] },
        { title: "Monthly Level Retention Requirement", rows: [["Past 3 Months Accumulated Deposit", "-"]] },
        { title: "Membership Renewal", rows: [["Membership Renewal", "Lifetime"]] },
      ],
    },
    gold: {
      benefits: [
        ["Deposits and Withdrawals", "High Priority"],
        ["Daily Withdrawal Limitation", "50,000"],
        ["Birthday Bonus", "388"],
      ],
      rebates: [
        ["Sport", "8%"],
        ["Live Casino", "8%"],
        ["Slot", "8%"],
        ["Fish Hunt", "8%"],
        ["ESport", "8%"],
      ],
      requirements: [
        { title: "Monthly Level Upgrade Requirement", rows: [["Progressive Deposit", "50,000"]] },
        { title: "Monthly Level Retention Requirement", rows: [["Past 3 Months Accumulated Deposit", "-"]] },
        { title: "Membership Renewal", rows: [["Membership Renewal", "Lifetime"]] },
      ],
    },
    platinum: {
      benefits: [
        ["Deposits and Withdrawals", "High Priority"],
        ["Daily Withdrawal Limitation", "80,000"],
        ["Birthday Bonus", "588"],
      ],
      rebates: [
        ["Sport", "9%"],
        ["Live Casino", "9%"],
        ["Slot", "9%"],
        ["Fish Hunt", "9%"],
        ["ESport", "9%"],
      ],
      requirements: [
        { title: "Monthly Level Upgrade Requirement", rows: [["Progressive Deposit", "80,000"]] },
        { title: "Monthly Level Retention Requirement", rows: [["Past 3 Months Accumulated Deposit", "-"]] },
        { title: "Membership Renewal", rows: [["Membership Renewal", "Lifetime"]] },
      ],
    },
    diamond: {
      benefits: [
        ["Deposits and Withdrawals", "High Priority"],
        ["Daily Withdrawal Limitation", "100,000"],
        ["Birthday Bonus", "888"],
      ],
      rebates: [
        ["Sport", "10%"],
        ["Live Casino", "10%"],
        ["Slot", "10%"],
        ["Fish Hunt", "10%"],
        ["ESport", "10%"],
      ],
      requirements: [
        { title: "Monthly Level Upgrade Requirement", rows: [["Progressive Deposit", "100,000"]] },
        { title: "Monthly Level Retention Requirement", rows: [["Past 3 Months Accumulated Deposit", "-"]] },
        { title: "Membership Renewal", rows: [["Membership Renewal", "Lifetime"]] },
      ],
    },
  };

  function rowsHtml(rows) {
    return rows
      .map(function (row) {
        return "<tr><td>" + row[0] + "</td><td>" + row[1] + "</td></tr>";
      })
      .join("");
  }

  function renderTier(key) {
    var data = TIER_DATA[key] || TIER_DATA.normal;
    var benefitsBody = document.getElementById("mem-benefits-body");
    var rebatesBody = document.getElementById("mem-rebates-body");
    var reqGrid = document.getElementById("mem-req-grid");

    if (benefitsBody) benefitsBody.innerHTML = rowsHtml(data.benefits);
    if (rebatesBody) rebatesBody.innerHTML = rowsHtml(data.rebates);
    if (reqGrid) {
      reqGrid.innerHTML = data.requirements
        .map(function (card) {
          return (
            '<div class="mem-table-card">' +
            '<div class="mem-table-head">' +
            card.title +
            "</div>" +
            '<table class="mem-table"><tbody>' +
            rowsHtml(card.rows) +
            "</tbody></table></div>"
          );
        })
        .join("");
    }
  }

  function setTier(key) {
    Array.prototype.forEach.call(document.querySelectorAll("[data-mem-tier]"), function (btn) {
      var on = btn.getAttribute("data-mem-tier") === key;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-selected", on ? "true" : "false");
    });
    renderTier(key);
  }

  function setView(view) {
    Array.prototype.forEach.call(document.querySelectorAll("[data-mem-view]"), function (btn) {
      var on = btn.getAttribute("data-mem-view") === view;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-selected", on ? "true" : "false");
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-mem-panel]"), function (panel) {
      panel.hidden = panel.getAttribute("data-mem-panel") !== view;
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!document.querySelector(".mem-content, .mem-body")) return;

    Array.prototype.forEach.call(document.querySelectorAll("[data-mem-tier]"), function (btn) {
      btn.addEventListener("click", function () {
        setTier(btn.getAttribute("data-mem-tier"));
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll("[data-mem-view]"), function (btn) {
      btn.addEventListener("click", function () {
        setView(btn.getAttribute("data-mem-view"));
      });
    });

    setTier("normal");
    setView("benefits");
  });
})();
