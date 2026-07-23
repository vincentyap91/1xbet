/* mobile-payment-methods.js — Payments catalog (Deposit / Withdrawal) */
(() => {
  "use strict";

  if (!document.body.classList.contains("mh-page--payment-methods")) return;

  const PAY = "assets/payments/";

  const DEPOSIT_METHODS = [
    {
      id: "duitnow-qr",
      name: "DuitNow QR",
      type: "ewallet",
      min: 30,
      max: 10000,
      note: "No fees, up to 5 minutes",
      logo: PAY + "duitnow.png",
    },
    {
      id: "touchngo",
      name: "Touch 'N Go eWallet",
      type: "ewallet",
      min: 5,
      max: 10000,
      note: "No fees, up to 5 minutes",
      logo: PAY + "touchngo.png",
    },
    {
      id: "my-online-banking",
      name: "Malaysia Online Banking",
      type: "banking",
      min: 30,
      max: 100000,
      note: "No fees, up to 15 minutes",
      logo: PAY + "online-banking.svg",
    },
    {
      id: "grabpay",
      name: "GrabPay",
      type: "ewallet",
      min: 5,
      max: 5000,
      note: "No fees, up to 5 minutes",
      logo: PAY + "grabpay.png",
    },
    {
      id: "help2pay",
      name: "Help2Pay",
      type: "ewallet",
      min: 20,
      max: 15000,
      note: "No fees, up to 15 minutes",
      logo: PAY + "help2pay.png",
    },
    {
      id: "fpx",
      name: "FPX",
      type: "banking",
      min: 20,
      max: 30000,
      note: "No fees, up to 15 minutes",
      logo: PAY + "fpx.svg",
    },
    {
      id: "paynow",
      name: "PayNow",
      type: "ewallet",
      min: 10,
      max: 5000,
      note: "No fees, Instant",
      logo: PAY + "paynow.svg",
    },
    {
      id: "visa",
      name: "Visa",
      type: "card",
      min: 10,
      max: 20000,
      note: "No fees, Instant",
      logo: PAY + "visa.svg",
    },
    {
      id: "mastercard",
      name: "Mastercard",
      type: "card",
      min: 10,
      max: 20000,
      note: "No fees, Instant",
      logo: PAY + "mastercard.svg",
    },
    {
      id: "bitcoin",
      name: "Bitcoin",
      type: "crypto",
      min: 50,
      max: 100000,
      note: "Network fee, 1 confirm.",
      logo: PAY + "bitcoin.png",
    },
    {
      id: "tether-tron",
      name: "Tether (TRC20)",
      type: "crypto",
      min: 20,
      max: 100000,
      note: "Network fee, Instant",
      logo: PAY + "tether.png",
    },
    {
      id: "tether-erc20",
      name: "Tether (ERC20)",
      type: "crypto",
      min: 20,
      max: 100000,
      note: "Network fee, Instant",
      logo: PAY + "tether.png",
    },
  ];

  const WITHDRAW_METHODS = [
    {
      id: "touchngo",
      name: "Touch N Go Ewallet",
      type: "ewallet",
      min: 50,
      max: 5000,
      note: "No fees, 15 minutes",
      logo: PAY + "touchngo.png",
    },
    {
      id: "my-online-banking",
      name: "Malaysia Online Banking",
      type: "banking",
      min: 50,
      max: 30000,
      note: "No fees, 15m to 1h",
      logo: PAY + "online-banking.svg",
    },
    {
      id: "help2pay",
      name: "Help2Pay",
      type: "ewallet",
      min: 50,
      max: 15000,
      note: "No fees, 15 minutes",
      logo: PAY + "help2pay.png",
    },
    {
      id: "fasttransfers",
      name: "FastTransfers Malaysia",
      type: "banking",
      min: 50,
      max: 30000,
      note: "No fees, 15m to 1h",
      logos: [
        PAY + "banks/aba.svg",
        PAY + "banks/acleda.svg",
        PAY + "banks/wing.svg",
        PAY + "fpx.svg",
        PAY + "online-banking.svg",
      ],
    },
    {
      id: "fpx",
      name: "FPX",
      type: "banking",
      min: 50,
      max: 30000,
      note: "No fees, 15m to 1h",
      logo: PAY + "fpx.svg",
    },
    {
      id: "grabpay",
      name: "GrabPay",
      type: "ewallet",
      min: 50,
      max: 5000,
      note: "No fees, 15 minutes",
      logo: PAY + "grabpay.png",
    },
    {
      id: "bitcoin",
      name: "Bitcoin",
      type: "crypto",
      min: 100,
      max: 100000,
      note: "Network fee, 1 confirm.",
      logo: PAY + "bitcoin.png",
    },
    {
      id: "tether-tron",
      name: "Tether (TRC20)",
      type: "crypto",
      min: 50,
      max: 100000,
      note: "Network fee, Instant",
      logo: PAY + "tether.png",
    },
  ];

  const TYPE_LABELS = {
    all: "All methods",
    ewallet: "E-wallets",
    banking: "Banking",
    card: "Cards",
    crypto: "Cryptocurrency",
  };

  const state = {
    mode: "deposit",
    type: "all",
  };

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
  }

  function fmtAmt(n) {
    return `${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} MYR`;
  }

  function methods() {
    return state.mode === "withdrawal" ? WITHDRAW_METHODS : DEPOSIT_METHODS;
  }

  function filtered() {
    const list = methods();
    if (state.type === "all") return list;
    return list.filter((m) => m.type === state.type);
  }

  function typeCounts() {
    const list = methods();
    const counts = { all: list.length };
    list.forEach((m) => {
      counts[m.type] = (counts[m.type] || 0) + 1;
    });
    return counts;
  }

  function logoHtml(m) {
    if (m.logos && m.logos.length) {
      return `<div class="mh-pm-card__logo mh-pm-card__logo--banks">${m.logos
        .map((src) => `<img src="${esc(src)}" alt="" loading="lazy" />`)
        .join("")}</div>`;
    }
    if (m.logo) {
      return `<div class="mh-pm-card__logo"><img src="${esc(m.logo)}" alt="" loading="lazy" /></div>`;
    }
    if (m.placeholder) {
      return `<div class="mh-pm-card__logo"><span class="mh-pm-card__ph" style="${esc(m.placeholder.style)}">${esc(m.placeholder.text)}</span></div>`;
    }
    return `<div class="mh-pm-card__logo"></div>`;
  }

  function cardHtml(m) {
    const cta =
      state.mode === "deposit"
        ? `<a class="mh-pm-card__cta" href="deposit.html" data-mh-deposit>Deposit</a>`
        : "";

    return `<article class="mh-pm-card" data-pm-card data-pm-type="${esc(m.type)}">
      <div class="mh-pm-card__top">
        ${logoHtml(m)}
        <h3 class="mh-pm-card__name">${esc(m.name)}</h3>
      </div>
      <div class="mh-pm-card__foot">
        <p>Minimum: ${esc(fmtAmt(m.min))}</p>
        <p>Maximum: ${esc(fmtAmt(m.max))}</p>
        <p class="mh-pm-card__note">${esc(m.note)}</p>
        ${cta}
      </div>
    </article>`;
  }

  function updateIntro() {
    const title = document.getElementById("mh-pm-intro-title");
    const copy = document.getElementById("mh-pm-intro-copy");
    const methodLabel = document.getElementById("mh-pm-method-label");
    const sheetTitle = document.getElementById("mh-pm-sheet-title");
    if (state.mode === "withdrawal") {
      if (title) title.textContent = "Withdrawal";
      if (copy) copy.textContent = "Select a payment system to withdraw funds";
      if (methodLabel) methodLabel.textContent = "Deposit method";
      if (sheetTitle) sheetTitle.textContent = "Deposit method";
    } else {
      if (title) title.textContent = "Deposit";
      if (copy) copy.textContent = "Select a payment system to top up your account";
      if (methodLabel) methodLabel.textContent = "Deposit method";
      if (sheetTitle) sheetTitle.textContent = "Deposit method";
    }
  }

  function updateMethodValue() {
    const el = document.getElementById("mh-pm-method-value");
    const counts = typeCounts();
    const n = state.type === "all" ? counts.all : counts[state.type] || 0;
    const label = TYPE_LABELS[state.type] || TYPE_LABELS.all;
    if (el) el.textContent = `${label} (${n})`;
  }

  function renderGrid() {
    const grid = document.getElementById("mh-pm-grid");
    const empty = document.getElementById("mh-pm-empty");
    if (!grid) return;
    const list = filtered();
    grid.innerHTML = list.map(cardHtml).join("");
    if (empty) empty.hidden = list.length > 0;
    updateMethodValue();
  }

  function renderTypeList() {
    const root = document.getElementById("mh-pm-type-list");
    if (!root) return;
    const counts = typeCounts();
    const keys = ["all", "ewallet", "banking", "card", "crypto"].filter(
      (k) => k === "all" || counts[k]
    );
    root.innerHTML = keys
      .map((k) => {
        const active = state.type === k ? " is-active" : "";
        return `<li><button type="button" class="mh-pm-sheet__item${active}" role="option" data-pm-type="${k}" aria-selected="${state.type === k}">
          ${esc(TYPE_LABELS[k])} <span>${counts[k] || 0}</span>
        </button></li>`;
      })
      .join("");
  }

  const SHEET_PHASES = ["closed", "opening", "open", "closing"];
  const SHEET_CLOSE_MS = 220;
  let sheetPhase = "closed";
  let sheetCloseTimer = 0;
  let sheetOpenRaf = 0;

  function motionMs(ms) {
    try {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return 1;
    } catch (_) {
      /* ignore */
    }
    return ms;
  }

  function setSheetPhase(sheet, phase) {
    sheet.classList.remove(...SHEET_PHASES);
    sheet.classList.add(phase);
    sheetPhase = phase;
  }

  function openSheet() {
    const sheet = document.getElementById("mh-pm-type-sheet");
    const btn = document.getElementById("mh-pm-method-btn");
    if (!sheet) return;
    if (sheetPhase === "open" || sheetPhase === "opening") return;
    if (sheetPhase === "closing") return;

    clearTimeout(sheetCloseTimer);
    if (sheetOpenRaf) {
      cancelAnimationFrame(sheetOpenRaf);
      sheetOpenRaf = 0;
    }

    renderTypeList();
    sheet.hidden = false;
    setSheetPhase(sheet, "closed");
    void sheet.offsetWidth;
    setSheetPhase(sheet, "opening");
    if (btn) btn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";

    sheetOpenRaf = requestAnimationFrame(() => {
      sheetOpenRaf = requestAnimationFrame(() => {
        if (sheetPhase !== "opening") return;
        setSheetPhase(sheet, "open");
        sheetOpenRaf = 0;
      });
    });
  }

  function closeSheet() {
    const sheet = document.getElementById("mh-pm-type-sheet");
    const btn = document.getElementById("mh-pm-method-btn");
    if (!sheet) return;
    if (sheetPhase === "closed" || sheetPhase === "closing") {
      if (sheet.hidden && sheetPhase === "closed") return;
      if (sheetPhase === "closing") return;
    }

    clearTimeout(sheetCloseTimer);
    if (sheetOpenRaf) {
      cancelAnimationFrame(sheetOpenRaf);
      sheetOpenRaf = 0;
    }

    setSheetPhase(sheet, "closing");
    if (btn) btn.setAttribute("aria-expanded", "false");

    sheetCloseTimer = window.setTimeout(() => {
      setSheetPhase(sheet, "closed");
      sheet.hidden = true;
      document.body.style.overflow = "";
      sheetCloseTimer = 0;
    }, motionMs(SHEET_CLOSE_MS));
  }

  function setMode(mode) {
    state.mode = mode === "withdrawal" ? "withdrawal" : "deposit";
    state.type = "all";
    document.querySelectorAll("[data-pm-mode]").forEach((btn) => {
      const on = btn.getAttribute("data-pm-mode") === state.mode;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-selected", on ? "true" : "false");
    });
    updateIntro();
    renderGrid();
    closeSheet();
    const url = new URL(window.location.href);
    if (state.mode === "withdrawal") url.searchParams.set("mode", "withdrawal");
    else url.searchParams.delete("mode");
    history.replaceState(null, "", url.pathname + url.search + url.hash);
  }

  function initModeFromUrl() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("mode") === "withdrawal" || window.location.hash === "#withdrawal") {
      setMode("withdrawal");
    } else {
      updateIntro();
      renderGrid();
    }
  }

  document.querySelectorAll("[data-pm-mode]").forEach((btn) => {
    btn.addEventListener("click", () => setMode(btn.getAttribute("data-pm-mode")));
  });

  const methodBtn = document.getElementById("mh-pm-method-btn");
  if (methodBtn) methodBtn.addEventListener("click", openSheet);

  const sheet = document.getElementById("mh-pm-type-sheet");
  if (sheet) {
    sheet.addEventListener("click", (e) => {
      if (e.target.closest("[data-pm-sheet-close]")) {
        closeSheet();
        return;
      }
      const item = e.target.closest("[data-pm-type]");
      if (!item || !item.classList.contains("mh-pm-sheet__item")) return;
      state.type = item.getAttribute("data-pm-type") || "all";
      renderGrid();
      closeSheet();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeSheet();
  });

  initModeFromUrl();
})();
