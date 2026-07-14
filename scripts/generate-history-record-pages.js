const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const template = fs.readFileSync(path.join(root, "transaction-history.html"), "utf8");

function buildTabs(tabs, aria) {
  if (!tabs || !tabs.length) return "";
  return (
    `            <nav class="tx-record-tabs" role="tablist" aria-label="${aria}">\n` +
    tabs
      .map(function (tab, index) {
        var active = index === 0;
        return (
          `              <button type="button" class="tx-record-tab${active ? " is-active" : ""}" role="tab" aria-selected="${active ? "true" : "false"}" data-tx-type="${tab.id}">${tab.label}</button>`
        );
      })
      .join("\n") +
    "\n            </nav>\n"
  );
}

function buildColumns(cols) {
  return cols
    .map(function (col) {
      return `                  <div class="tx-record-col-label" data-col="${col.key}">${col.label}</div>`;
    })
    .join("\n");
}

function buildContent(config) {
  return (
    `        <section class="account-content tx-record-content" aria-label="${config.title}">\n\n` +
    `          <div class="account-content-head">\n` +
    `            <h1 class="account-content-title">${config.title}</h1>\n` +
    `          </div>\n\n` +
    `          <div class="account-content-body">\n` +
    buildTabs(config.tabs, config.tabAria || config.title) +
    `            <section class="pq-panel tx-record-panel" aria-label="Filters">\n` +
    `              <form class="tx-record-form" id="tx-record-form" action="#" novalidate>\n` +
    `                <div class="tx-record-date-grid">\n` +
    `                  <label class="tx-record-field">\n` +
    `                    <span class="tx-record-label">Start date</span>\n` +
    `                    <input type="text" class="tx-record-input" id="tx-start-date" name="start" inputmode="numeric" placeholder="DD-MM-YYYY" autocomplete="off" />\n` +
    `                  </label>\n` +
    `                  <label class="tx-record-field">\n` +
    `                    <span class="tx-record-label">End date</span>\n` +
    `                    <input type="text" class="tx-record-input" id="tx-end-date" name="end" inputmode="numeric" placeholder="DD-MM-YYYY" autocomplete="off" />\n` +
    `                  </label>\n` +
    `                </div>\n\n` +
    `                <div class="tx-record-period-row" role="group" aria-label="Quick date range">\n` +
    `                  <button type="button" class="tx-record-period-btn" data-tx-period="today">Today</button>\n` +
    `                  <button type="button" class="tx-record-period-btn" data-tx-period="yesterday">Yesterday</button>\n` +
    `                  <button type="button" class="tx-record-period-btn" data-tx-period="last-week">Last Week</button>\n` +
    `                  <button type="button" class="tx-record-period-btn is-active" data-tx-period="this-week">This Week</button>\n` +
    `                  <button type="button" class="tx-record-period-btn" data-tx-period="this-month">This Month</button>\n` +
    `                  <button type="button" class="tx-record-period-btn" data-tx-period="last-month">Last Month</button>\n` +
    `                </div>\n\n` +
    `                <button type="submit" class="tx-record-submit">Submit</button>\n` +
    `              </form>\n` +
    `            </section>\n\n` +
    `            <section class="pq-panel tx-record-panel tx-record-panel--results" aria-label="Results">\n` +
    `              <div class="tx-record-table-wrap">\n` +
    `                <div class="tx-record-table-head" aria-hidden="true">\n` +
    buildColumns(config.columns) +
    `\n                </div>\n` +
    `                <div class="tx-record-table-body" id="tx-record-body" aria-live="polite">\n` +
    `                  <div class="acc-empty-panel pq-empty tx-record-empty" id="tx-record-empty" role="status">\n` +
    `                    <p class="acc-empty-title">No Data Found</p>\n` +
    `                  </div>\n` +
    `                </div>\n` +
    `              </div>\n` +
    `            </section>\n` +
    `          </div>\n\n` +
    `        </section>`
  );
}

function buildPage(config) {
  var contentRe =
    /        <section class="account-content tx-record-content"[\s\S]*?        <\/section>/;
  var page = template
    .replace(
      /<body data-page="transaction-history" class="is-logged-in history-record-page">/,
      `<body data-page="${config.page}" class="is-logged-in history-record-page">`
    )
    .replace(
      /<body data-page="transaction-history" class="is-logged-in">/,
      `<body data-page="${config.page}" class="is-logged-in history-record-page">`
    )
    .replace(/<title>Transaction Record — 1xBet<\/title>/, `<title>${config.title} — 1xBet</title>`)
    .replace(contentRe, buildContent(config))
    .replace(/js\/transaction-history\.js/, "js/history-record.js");
  return page;
}

var pages = [
  {
    file: "commission-record.html",
    page: "commission-record",
    title: "Commission Record",
    tabAria: "Commission type",
    tabs: [
      { id: "direct", label: "Direct" },
      { id: "team", label: "Team" }
    ],
    columns: [
      { key: "date", label: "Date" },
      { key: "amount", label: "Amount" },
      { key: "status", label: "Status" },
      { key: "source", label: "Source" }
    ]
  },
  {
    file: "rebate-record.html",
    page: "rebate-record",
    title: "Rebate Record",
    tabAria: "Rebate type",
    tabs: [
      { id: "casino", label: "Casino" },
      { id: "sports", label: "Sports" }
    ],
    columns: [
      { key: "date", label: "Date" },
      { key: "amount", label: "Amount" },
      { key: "status", label: "Status" },
      { key: "type", label: "Type" }
    ]
  },
  {
    file: "checkin-record.html",
    page: "checkin-record",
    title: "Daily Check-In Record",
    tabs: null,
    columns: [
      { key: "date", label: "Date" },
      { key: "reward", label: "Reward" },
      { key: "status", label: "Status" },
      { key: "day", label: "Day" }
    ]
  },
  {
    file: "promotion-record.html",
    page: "promotion-record",
    title: "Promotion Record",
    tabAria: "Promotion status",
    tabs: [
      { id: "active", label: "Active" },
      { id: "completed", label: "Completed" }
    ],
    columns: [
      { key: "date", label: "Date" },
      { key: "bonus", label: "Bonus" },
      { key: "status", label: "Status" },
      { key: "promotion", label: "Promotion" }
    ]
  }
];

pages.forEach(function (config) {
  fs.writeFileSync(path.join(root, config.file), buildPage(config));
  console.log("created " + config.file);
});
