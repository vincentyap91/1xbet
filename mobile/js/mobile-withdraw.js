(() => {
  "use strict";

  if (!document.body.classList.contains("mh-page--withdraw")) return;

  const PAY = "assets/payments/";
  const PRESETS = [10, 50, 100, 200, 500, 1000];
  const REFRESH_COOLDOWN_S = 15;
  let requestsRefreshTimer = null;

  const METHODS = {
    touchngo: {
      id: "touchngo",
      name: "Touch N Go Ewallet",
      min: 10,
      max: 5000,
      logo: PAY + "touchngo.png",
      type: "ewallet",
      fields: ["amount", "account"],
    },
    "my-online-banking": {
      id: "my-online-banking",
      name: "Malaysia Online Banking",
      min: 20,
      max: 30000,
      logo: PAY + "online-banking.svg",
      type: "banking",
      fields: ["amount", "bank"],
    },
    fpx: {
      id: "fpx",
      name: "FPX",
      min: 20,
      max: 30000,
      logo: PAY + "fpx.svg",
      type: "banking",
      fields: ["amount", "bank"],
    },
    "duitnow-qr": {
      id: "duitnow-qr",
      name: "Duitnow QR",
      min: 10,
      max: 10000,
      logo: PAY + "duitnow.png",
      type: "ewallet",
      fields: ["amount", "account"],
    },
    visa: {
      id: "visa",
      name: "Visa",
      min: 20,
      max: 20000,
      logo: PAY + "visa.svg",
      type: "card",
      muted: true,
      fields: ["amount", "account"],
    },
    mastercard: {
      id: "mastercard",
      name: "MasterCard",
      min: 20,
      max: 20000,
      logo: PAY + "mastercard.svg",
      type: "card",
      muted: true,
      fields: ["amount", "account"],
    },
    grabpay: {
      id: "grabpay",
      name: "GrabPay",
      min: 10,
      max: 5000,
      logo: PAY + "grabpay.png",
      type: "ewallet",
      fields: ["amount", "account"],
    },
    help2pay: {
      id: "help2pay",
      name: "Help2Pay",
      min: 20,
      max: 15000,
      logo: PAY + "help2pay.png",
      type: "ewallet",
      fields: ["amount", "account"],
    },
    paynow: {
      id: "paynow",
      name: "Paynow",
      min: 10,
      max: 5000,
      logo: PAY + "paynow.svg",
      type: "ewallet",
      fields: ["amount", "account"],
    },
    bitcoin: {
      id: "bitcoin",
      name: "Bitcoin (BTC)",
      min: 50,
      max: 100000,
      logo: PAY + "bitcoin.png",
      type: "crypto",
      fields: ["amount", "crypto"],
    },
    tether: {
      id: "tether",
      name: "Tether TRC20",
      min: 20,
      max: 100000,
      logo: PAY + "tether.png",
      type: "crypto",
      fields: ["amount", "crypto"],
    },
  };

  const SECTIONS = [
    {
      id: "recommended",
      title: "Recommended",
      ids: ["touchngo", "my-online-banking", "fpx", "duitnow-qr"],
    },
    { id: "card", title: "Payment cards", ids: ["visa", "mastercard"] },
    {
      id: "ewallet",
      title: "E-wallets",
      ids: ["touchngo", "grabpay", "duitnow-qr", "help2pay", "paynow"],
    },
    { id: "banking", title: "Internet banking", ids: ["my-online-banking", "fpx"] },
    { id: "transfer", title: "Bank transfer", ids: ["fpx"] },
    {
      id: "crypto",
      title: "Cryptocurrencies",
      ids: ["bitcoin", "tether"],
    },
  ];

  const TYPE_OPTIONS = [
    { id: "recommended", label: "Recommended" },
    { id: "all", label: "All Method" },
    { id: "card", label: "Payment Cards" },
    { id: "ewallet", label: "E-wallet" },
    { id: "banking", label: "Internet Banking" },
    { id: "transfer", label: "Bank Transfer" },
    { id: "crypto", label: "Cryptocurrency" },
  ];

  const state = {
    step: "methods",
    methodId: null,
    amount: 0,
    accountName: "",
    accountNumber: "",
    cryptoAddress: "",
    typeFilter: "all",
  };

  const SUBMIT_MS = 1200;
  let modalMode = "confirm";
  let isSubmitting = false;
  let lastFocusedBeforeModal = null;

  /* Demo: incomplete rollover blocks withdraw by default (Figma 297:701).
     Bypass with ?rollover=0 or open confirm/success QA params. */
  let rolloverIncomplete = true;
  const DEMO_ROLLOVER = {
    percent: 38.33,
    latestTopUp: "100.00",
    date: "24 Mar 2026, 4:14 PM",
    remaining: "740.00",
    target: "1200.00",
  };

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

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

  function formatAmount(value) {
    const n = Number(value);
    return (isFinite(n) ? n : 0).toFixed(2);
  }

  function renderModalConfirm() {
    const m = getMethod();
    modalMode = "confirm";
    const icon = $("#mh-wd-modal-icon");
    const title = $("#mh-wd-modal-title");
    const text = $("#mh-wd-modal-text");
    const meta = $("#mh-wd-modal-meta");
    const actions = $("#mh-wd-modal-actions");
    if (icon) {
      icon.className = "auth-confirm-icon auth-confirm-icon--warn";
      icon.textContent = "?";
    }
    if (title) title.textContent = "Confirm action";
    if (text) {
      text.innerHTML =
        `Are you sure you want to withdraw` +
        `<span class="wd-modal__amount" id="mh-wd-modal-amount">${esc(formatAmount(state.amount))} MYR</span>?`;
    }
    if (meta) {
      meta.hidden = !m;
      meta.textContent = m ? `Via ${m.name} · Demo only — no real funds move.` : "";
    }
    if (actions) {
      actions.className = "auth-confirm-actions";
      actions.innerHTML =
        `<button type="button" class="auth-btn auth-btn--login" data-mh-wd-modal-close>Cancel</button>` +
        `<button type="button" class="auth-btn auth-btn--register" id="mh-wd-modal-confirm">Confirm</button>`;
      $("#mh-wd-modal-confirm")?.addEventListener("click", confirmWithdrawFromModal);
    }
  }

  function renderModalSuccess() {
    const m = getMethod();
    modalMode = "success";
    const icon = $("#mh-wd-modal-icon");
    const title = $("#mh-wd-modal-title");
    const text = $("#mh-wd-modal-text");
    const meta = $("#mh-wd-modal-meta");
    const actions = $("#mh-wd-modal-actions");
    if (icon) {
      icon.className = "auth-confirm-icon auth-confirm-icon--warn wd-modal__icon--success";
      icon.textContent = "✓";
    }
    if (title) title.textContent = "Withdrawal submitted";
    if (text) {
      text.textContent = m
        ? `Your withdrawal of ${formatAmount(state.amount)} MYR via ${m.name} has been submitted successfully.`
        : `Your withdrawal of ${formatAmount(state.amount)} MYR has been submitted successfully.`;
    }
    if (meta) {
      meta.hidden = false;
      meta.textContent = "Demo only — no real transaction has been made.";
    }
    if (actions) {
      actions.className = "auth-confirm-actions auth-confirm-actions--single";
      actions.innerHTML =
        `<button type="button" class="auth-btn auth-btn--register" data-mh-wd-modal-ok id="mh-wd-modal-ok">OK</button>`;
    }
  }

  function syncRolloverDemo() {
    const pct = DEMO_ROLLOVER.percent;
    const ring = $("#mh-wd-rollover-ring");
    const pctEl = $("#mh-wd-rollover-pct");
    const topup = $("#mh-wd-rollover-topup");
    const date = $("#mh-wd-rollover-date");
    const remain = $("#mh-wd-rollover-remain");
    if (ring) {
      ring.style.setProperty("--pct", String(pct));
      ring.setAttribute("aria-valuenow", String(pct));
      ring.setAttribute("aria-label", `Deposit rollover progress ${pct} percent`);
    }
    if (pctEl) pctEl.textContent = String(pct);
    if (topup) topup.textContent = `Latest Top-Up/Bonus : ${DEMO_ROLLOVER.latestTopUp}`;
    if (date) date.textContent = DEMO_ROLLOVER.date;
    if (remain) remain.textContent = `${DEMO_ROLLOVER.remaining} / ${DEMO_ROLLOVER.target}`;
  }

  function openRolloverModal() {
    const backdrop = $("#mh-wd-rollover-backdrop");
    const modal = $("#mh-wd-rollover-modal");
    if (!backdrop) return;
    syncRolloverDemo();
    lastFocusedBeforeModal = document.activeElement;
    backdrop.hidden = false;
    requestAnimationFrame(() => backdrop.classList.add("is-open"));
    document.body.classList.add("wd-modal-open");
    modal?.focus({ preventScroll: true });
  }

  function closeRolloverModal() {
    const backdrop = $("#mh-wd-rollover-backdrop");
    if (!backdrop) return;
    backdrop.classList.remove("is-open");
    document.body.classList.remove("wd-modal-open");
    window.setTimeout(() => {
      backdrop.hidden = true;
      lastFocusedBeforeModal?.focus?.({ preventScroll: true });
      lastFocusedBeforeModal = null;
    }, 180);
  }

  function openWithdrawModal(mode) {
    const backdrop = $("#mh-wd-modal-backdrop");
    const modal = $("#mh-wd-modal");
    if (!backdrop) return;
    if (mode === "success") renderModalSuccess();
    else renderModalConfirm();
    lastFocusedBeforeModal = document.activeElement;
    backdrop.hidden = false;
    requestAnimationFrame(() => backdrop.classList.add("is-open"));
    document.body.classList.add("wd-modal-open");
    modal?.focus({ preventScroll: true });
  }

  function closeWithdrawModal() {
    const backdrop = $("#mh-wd-modal-backdrop");
    if (!backdrop) return;
    backdrop.classList.remove("is-open");
    document.body.classList.remove("wd-modal-open");
    window.setTimeout(() => {
      backdrop.hidden = true;
      lastFocusedBeforeModal?.focus?.({ preventScroll: true });
      lastFocusedBeforeModal = null;
    }, 180);
  }

  function confirmWithdrawFromModal() {
    if (isSubmitting || modalMode !== "confirm") return;
    isSubmitting = true;
    const confirmBtn = $("#mh-wd-modal-confirm");
    if (confirmBtn) {
      confirmBtn.disabled = true;
      confirmBtn.textContent = "Processing…";
    }
    window.setTimeout(() => {
      isSubmitting = false;
      const m = getMethod();
      const desc = $("#mh-wd-success-desc");
      if (desc) {
        desc.textContent = m
          ? `Your withdrawal of ${formatAmount(state.amount)} MYR via ${m.name} was submitted. Processing usually completes within a few hours.`
          : "Your withdrawal request was submitted.";
      }
      renderModalSuccess();
      toast("Withdrawal submitted — demo only");
    }, SUBMIT_MS);
  }

  function finishSuccessModal() {
    closeWithdrawModal();
    showStep("success");
  }

  function bindWithdrawModal() {
    const rolloverBackdrop = $("#mh-wd-rollover-backdrop");
    if (rolloverBackdrop) {
      rolloverBackdrop.addEventListener("click", (e) => {
        if (
          e.target === rolloverBackdrop ||
          e.target.closest("[data-mh-wd-rollover-close]") ||
          e.target.closest("[data-mh-wd-rollover-ok]")
        ) {
          closeRolloverModal();
        }
      });
    }

    const backdrop = $("#mh-wd-modal-backdrop");
    if (backdrop) {
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop || e.target.closest("[data-mh-wd-modal-close]")) {
          if (isSubmitting) return;
          closeWithdrawModal();
          return;
        }
        if (e.target.closest("[data-mh-wd-modal-ok]")) {
          finishSuccessModal();
        }
      });

      $("#mh-wd-modal-confirm")?.addEventListener("click", confirmWithdrawFromModal);
    }

    try {
      const params = new URLSearchParams(window.location.search);
      const demo = params.get("wd-modal");
      const rolloverParam = params.get("rollover");

      if (rolloverParam === "0" || rolloverParam === "false") {
        rolloverIncomplete = false;
      }
      if (demo === "confirm" || demo === "1" || demo === "success") {
        rolloverIncomplete = false;
      }

      if (demo === "confirm" || demo === "1") {
        state.amount = state.amount || 50;
        state.methodId = state.methodId || "touchngo";
        openWithdrawModal("confirm");
      } else if (demo === "success") {
        state.amount = state.amount || 50;
        state.methodId = state.methodId || "touchngo";
        openWithdrawModal("success");
      } else if (rolloverIncomplete) {
        /* Force rollover popup on every Withdraw entry (mobile). */
        openRolloverModal();
      }
    } catch (_) {
      /* ignore */
    }

    /* Re-open when tapping Withdraw / Withdrawal while already on this page. */
    document.addEventListener("click", (e) => {
      if (!rolloverIncomplete) return;
      const navWithdraw = e.target.closest(
        'a[href*="withdraw.html"], [data-mh-withdraw], .mh-dep-mode__btn[href*="withdraw"]'
      );
      if (!navWithdraw) return;
      if (
        navWithdraw.getAttribute("aria-selected") === "true" ||
        navWithdraw.getAttribute("aria-current") === "page" ||
        navWithdraw.classList.contains("is-active")
      ) {
        e.preventDefault();
        openRolloverModal();
      }
    });

    document.addEventListener("mh:open-rollover", () => {
      if (rolloverIncomplete) openRolloverModal();
    });
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function methodLogo(m) {
    if (m.logo) return `<img src="${esc(m.logo)}" alt="" width="88" height="36" loading="lazy" />`;
    return `<span class="mh-dep-card__ph" style="background:#2f69b1">${esc(m.name)}</span>`;
  }

  function notesFor(m) {
    if (m.type === "banking" || m.type === "card") {
      return "Bank / card withdrawals may take up to 24 hours. Account details must match your registered profile.";
    }
    if (m.type === "crypto") {
      return "Crypto withdrawals may take up to 1 hour. Double-check the wallet address and network.";
    }
    return "E-wallet withdrawals are usually processed within 15 minutes. Account name must match your profile.";
  }

  function cardHtml(id) {
    const m = METHODS[id];
    if (!m) return "";
    const muted = m.muted ? " mh-dep-card--muted" : "";
    return `<button type="button" class="mh-dep-card${muted}" data-mh-wd-method="${esc(id)}" aria-label="${esc(m.name)}">
      <span class="mh-dep-card__logo">${methodLogo(m)}</span>
      <span class="mh-dep-card__name">${esc(m.name)}</span>
    </button>`;
  }

  function visibleSections() {
    if (state.typeFilter === "all") return SECTIONS;
    return SECTIONS.filter((sec) => sec.id === state.typeFilter);
  }

  function renderTypeList() {
    const root = $("#mh-wd-type-list");
    if (!root) return;
    root.innerHTML = TYPE_OPTIONS.map((opt) => {
      const on = opt.id === state.typeFilter;
      return `<li>
        <button type="button" class="mh-dep-type-list__btn${on ? " is-active" : ""}" role="option" aria-selected="${on ? "true" : "false"}" data-mh-wd-type="${esc(opt.id)}">
          <span>${esc(opt.label)}</span>
          <span class="mh-dep-type-list__check" aria-hidden="true"></span>
        </button>
      </li>`;
    }).join("");
  }

  const TYPE_SHEET_OPEN_MS = 320;
  const TYPE_SHEET_CLOSE_MS = 260;
  const TYPE_SHEET_PHASES = ["closed", "opening", "open", "closing", "is-open"];
  /** @type {"closed"|"opening"|"open"|"closing"} */
  let typeSheetPhase = "closed";
  let typeSheetFocus = null;
  let typeSheetScrollY = 0;

  function lockTypeSheetScroll(lock) {
    if (lock) {
      if (document.body.classList.contains("mh-sheet-scroll-lock")) return;
      typeSheetScrollY = window.scrollY || document.documentElement.scrollTop || 0;
      document.body.classList.add("mh-sheet-scroll-lock");
      document.body.style.top = `-${typeSheetScrollY}px`;
      return;
    }
    if (!document.body.classList.contains("mh-sheet-scroll-lock")) return;
    document.body.classList.remove("mh-sheet-scroll-lock");
    document.body.style.top = "";
    window.scrollTo(0, typeSheetScrollY);
  }

  function setTypeSheetPhase(sheet, phase) {
    sheet.classList.remove(...TYPE_SHEET_PHASES);
    sheet.classList.add(phase);
    if (phase === "open") sheet.classList.add("is-open");
    typeSheetPhase = phase;
  }

  function setTypeSheetOpen(open) {
    const sheet = $("#mh-wd-type-sheet");
    const btn = $("[data-mh-wd-types]");
    if (!sheet) return;

    window.clearTimeout(setTypeSheetOpen._t);
    if (setTypeSheetOpen._raf) {
      cancelAnimationFrame(setTypeSheetOpen._raf);
      setTypeSheetOpen._raf = 0;
    }

    if (open) {
      if (typeSheetPhase === "open" || typeSheetPhase === "opening") return;
      if (typeSheetPhase === "closing") return;

      renderTypeList();
      typeSheetFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      sheet.hidden = false;
      setTypeSheetPhase(sheet, "closed");
      void sheet.offsetWidth;
      lockTypeSheetScroll(true);
      setTypeSheetPhase(sheet, "opening");
      if (btn) btn.setAttribute("aria-expanded", "true");

      setTypeSheetOpen._raf = requestAnimationFrame(() => {
        setTypeSheetOpen._raf = requestAnimationFrame(() => {
          if (typeSheetPhase !== "opening") return;
          setTypeSheetPhase(sheet, "open");
          sheet.querySelector(".mh-dep-type-sheet__close")?.focus?.({ preventScroll: true });
          setTypeSheetOpen._raf = 0;
        });
      });
      return;
    }

    if (typeSheetPhase === "closed" || typeSheetPhase === "closing") return;
    setTypeSheetPhase(sheet, "closing");
    if (btn) btn.setAttribute("aria-expanded", "false");

    setTypeSheetOpen._t = window.setTimeout(() => {
      setTypeSheetPhase(sheet, "closed");
      sheet.hidden = true;
      lockTypeSheetScroll(false);
      typeSheetFocus?.focus?.({ preventScroll: true });
      typeSheetFocus = null;
    }, TYPE_SHEET_CLOSE_MS);
  }

  function renderMethods() {
    const root = $("#mh-wd-methods-list");
    if (!root) return;
    const sections = visibleSections();
    if (!sections.length) {
      root.innerHTML = `<div class="mh-dep-empty"><p>No methods in this category.</p></div>`;
      return;
    }
    root.innerHTML = sections
      .map((sec) => {
        const cards = sec.ids.map(cardHtml).join("");
        return `<section class="mh-dep-section" data-section="${esc(sec.id)}">
        <h2 class="mh-dep-section__title">${esc(sec.title)}</h2>
        <div class="mh-dep-grid">${cards}</div>
      </section>`;
      })
      .join("");
  }

  function showStep(name) {
    state.step = name;
    $$("[data-mh-wd-step]").forEach((el) => {
      el.hidden = el.getAttribute("data-mh-wd-step") !== name;
    });
    const modeBar = $(".mh-dep-mode");
    if (modeBar) modeBar.hidden = name !== "methods";
    const title = $("#mh-wd-subbar-title");
    if (title) {
      const map = {
        methods: "Withdrawal",
        amount: "Withdrawal amount",
        confirm: "Confirm withdrawal",
        success: "Withdrawal success",
      };
      title.textContent = map[name] || "Withdrawal";
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function getMethod() {
    return state.methodId ? METHODS[state.methodId] : null;
  }

  function fillMethodSummary(sel) {
    const m = getMethod();
    const box = $(sel);
    if (!m || !box) return;
    box.innerHTML = `
      <div class="mh-dep-method-summary__logo">${methodLogo(m)}</div>
      <div class="mh-dep-method-summary__meta">
        <p class="mh-dep-method-summary__name">${esc(m.name)}</p>
        <p class="mh-dep-method-summary__limits">Min ${m.min} MYR · Max ${m.max.toLocaleString()} MYR</p>
      </div>`;
  }

  function renderDestFields(m) {
    const root = $("#mh-wd-dest-fields");
    if (!root) return;
    if (m.fields.includes("crypto")) {
      root.innerHTML = `
        <div class="mh-dep-field mh-wd-field">
          <label for="mh-wd-crypto">Wallet address</label>
          <input class="mh-wd-input" id="mh-wd-crypto" type="text" placeholder="Enter wallet address" value="${esc(state.cryptoAddress)}" autocomplete="off" />
        </div>`;
      return;
    }
    const numLabel = m.fields.includes("bank") ? "Account number" : "Account / Wallet ID";
    root.innerHTML = `
      <div class="mh-dep-field mh-wd-field">
        <label for="mh-wd-acct-name">Account name</label>
        <input class="mh-wd-input" id="mh-wd-acct-name" type="text" placeholder="Enter account name" value="${esc(state.accountName)}" autocomplete="name" />
      </div>
      <div class="mh-dep-field mh-wd-field">
        <label for="mh-wd-acct-num">${esc(numLabel)}</label>
        <input class="mh-wd-input" id="mh-wd-acct-num" type="text" placeholder="Enter account number" value="${esc(state.accountNumber)}" autocomplete="off" />
      </div>`;
  }

  function readDestFields() {
    const name = $("#mh-wd-acct-name");
    const num = $("#mh-wd-acct-num");
    const crypto = $("#mh-wd-crypto");
    if (name) state.accountName = name.value.trim();
    if (num) state.accountNumber = num.value.trim();
    if (crypto) state.cryptoAddress = crypto.value.trim();
  }

  function renderAmountStep() {
    const m = getMethod();
    if (!m) return;
    fillMethodSummary("#mh-wd-amount-method");
    $("#mh-wd-min").textContent = `${m.min} MYR`;
    $("#mh-wd-max").textContent = `${m.max.toLocaleString()} MYR`;
    $("#mh-wd-notes").innerHTML = `<strong>Notes:</strong> ${esc(notesFor(m))}`;
    renderDestFields(m);

    $("#mh-wd-presets").innerHTML = PRESETS.map((n) => {
      const active = Number(state.amount) === n ? " is-active" : "";
      return `<button type="button" class="mh-dep-preset${active}" data-mh-wd-preset="${n}">${n >= 1000 ? "1k" : n}</button>`;
    }).join("");

    const input = $("#mh-wd-amount-input");
    if (input) input.value = state.amount > 0 ? String(state.amount) : "";
    showStep("amount");
  }

  function renderConfirmStep() {
    const m = getMethod();
    if (!m) return;
    fillMethodSummary("#mh-wd-confirm-method");
    let dest = "—";
    if (m.fields.includes("crypto")) dest = state.cryptoAddress || "—";
    else if (state.accountNumber) dest = `${state.accountName || "—"} · ${state.accountNumber}`;
    $("#mh-wd-confirm-rows").innerHTML = `
      <li><span>Method</span><strong>${esc(m.name)}</strong></li>
      <li><span>Amount</span><strong>${Number(state.amount).toFixed(2)} MYR</strong></li>
      <li><span>Destination</span><strong>${esc(dest)}</strong></li>
      <li><span>From account</span><strong>1737116847</strong></li>`;
    showStep("confirm");
  }

  function openMethod(id) {
    if (!METHODS[id]) return;
    /* Earliest gate: selecting a method starts a withdraw attempt */
    if (rolloverIncomplete) {
      openRolloverModal();
      return;
    }
    state.methodId = id;
    state.amount = 0;
    state.accountName = "";
    state.accountNumber = "";
    state.cryptoAddress = "";
    renderAmountStep();
  }

  function validateAmount() {
    const m = getMethod();
    if (!m) return false;
    readDestFields();

    if (m.fields.includes("crypto")) {
      if (!state.cryptoAddress) {
        toast("Enter your wallet address");
        return false;
      }
    } else {
      if (!state.accountName) {
        toast("Enter account name");
        return false;
      }
      if (!state.accountNumber) {
        toast("Enter account number");
        return false;
      }
    }

    const n = Number(state.amount);
    if (!isFinite(n) || n < m.min) {
      toast(`Minimum withdrawal is ${m.min} MYR`);
      return false;
    }
    if (n > m.max) {
      toast(`Maximum withdrawal is ${m.max.toLocaleString()} MYR`);
      return false;
    }
    return true;
  }

  function syncPresets() {
    $$("[data-mh-wd-preset]").forEach((btn) => {
      btn.classList.toggle("is-active", Number(btn.getAttribute("data-mh-wd-preset")) === Number(state.amount));
    });
  }

  function formatRefreshTimer(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  function clearRequestsRefresh() {
    if (requestsRefreshTimer) {
      window.clearInterval(requestsRefreshTimer);
      requestsRefreshTimer = null;
    }
  }

  function setRequestsOpen(open) {
    const btn = $("#mh-wd-btn-requests");
    const panel = $("#mh-wd-requests");
    if (!btn || !panel) return;
    panel.hidden = !open;
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function startRequestsRefresh() {
    const refreshBtn = document.querySelector("#mh-wd-requests [data-wd-requests-refresh]");
    const timerEl = document.querySelector("#mh-wd-requests [data-wd-requests-timer]");
    if (!refreshBtn || !timerEl || refreshBtn.disabled) return;

    let remaining = REFRESH_COOLDOWN_S;
    clearRequestsRefresh();
    refreshBtn.disabled = true;
    timerEl.hidden = false;
    timerEl.textContent = formatRefreshTimer(remaining);

    requestsRefreshTimer = window.setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        clearRequestsRefresh();
        refreshBtn.disabled = false;
        timerEl.hidden = true;
        timerEl.textContent = "";
        return;
      }
      timerEl.textContent = formatRefreshTimer(remaining);
    }, 1000);
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

    renderTypeList();
    renderMethods();
    showStep("methods");
    bindWithdrawModal();

    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      const rolloverBackdrop = $("#mh-wd-rollover-backdrop");
      if (rolloverBackdrop && !rolloverBackdrop.hidden) {
        e.preventDefault();
        closeRolloverModal();
        return;
      }
      const backdrop = $("#mh-wd-modal-backdrop");
      if (backdrop && !backdrop.hidden) {
        if (isSubmitting) return;
        e.preventDefault();
        if (modalMode === "success") finishSuccessModal();
        else closeWithdrawModal();
        return;
      }
      setTypeSheetOpen(false);
    });

    document.addEventListener("click", (e) => {
      if (e.target.closest("#mh-wd-btn-requests")) {
        const panel = $("#mh-wd-requests");
        setRequestsOpen(!!panel?.hidden);
        return;
      }

      if (e.target.closest("#mh-wd-requests [data-wd-requests-refresh]")) {
        startRequestsRefresh();
        return;
      }

      if (e.target.closest("[data-mh-wd-types]")) {
        setTypeSheetOpen(true);
        return;
      }

      if (e.target.closest("[data-mh-wd-types-close]")) {
        setTypeSheetOpen(false);
        return;
      }

      const typeOpt = e.target.closest("[data-mh-wd-type]");
      if (typeOpt) {
        state.typeFilter = typeOpt.getAttribute("data-mh-wd-type") || "all";
        renderTypeList();
        renderMethods();
        setTypeSheetOpen(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      const method = e.target.closest("[data-mh-wd-method]");
      if (method) {
        openMethod(method.getAttribute("data-mh-wd-method"));
        return;
      }

      const preset = e.target.closest("[data-mh-wd-preset]");
      if (preset) {
        state.amount = Number(preset.getAttribute("data-mh-wd-preset"));
        const input = $("#mh-wd-amount-input");
        if (input) input.value = String(state.amount);
        syncPresets();
        return;
      }

      const copy = e.target.closest("[data-mh-wd-copy]");
      if (copy) {
        navigator.clipboard?.writeText(copy.getAttribute("data-mh-wd-copy") || "").catch(() => {});
        toast("Copied");
        return;
      }

      if (e.target.closest("[data-mh-wd-back]")) {
        if (state.step === "amount") showStep("methods");
        else if (state.step === "confirm") renderAmountStep();
        else if (state.step === "success") showStep("methods");
        else window.history.length > 1 ? history.back() : (window.location.href = "profile.html");
        return;
      }

      if (e.target.closest("[data-mh-wd-to-confirm]")) {
        if (rolloverIncomplete) {
          openRolloverModal();
          return;
        }
        const input = $("#mh-wd-amount-input");
        if (input) state.amount = Number(input.value);
        if (!validateAmount()) return;
        renderConfirmStep();
        return;
      }

      if (e.target.closest("[data-mh-wd-submit]")) {
        if (rolloverIncomplete) {
          openRolloverModal();
          return;
        }
        openWithdrawModal("confirm");
        return;
      }

      if (e.target.closest("[data-mh-wd-again]")) {
        state.methodId = null;
        state.amount = 0;
        showStep("methods");
      }
    });

    $("#mh-wd-amount-input")?.addEventListener("input", (e) => {
      state.amount = Number(e.target.value) || 0;
      syncPresets();
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
