(() => {
  "use strict";

  if (!document.body.classList.contains("mh-page--deposit")) return;

  const PAY = "assets/payments/";
  const PRESETS = [10, 50, 100, 200, 500, 1000];

  const METHODS = {
    "tether-tron": {
      id: "tether-tron",
      name: "Tether on Tron",
      min: 20,
      max: 100000,
      logos: [PAY + "tether.png", PAY + "tron.svg"],
      logoClass: "mh-dep-card__logo--duo",
      type: "crypto",
      fields: ["amount", "qr", "wallet"],
      wallet: "TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf",
    },
    "my-online-banking": {
      id: "my-online-banking",
      name: "Malaysia Online Banking",
      min: 20,
      max: 30000,
      logo: PAY + "online-banking.svg",
      type: "banking",
      badge: "+10%",
      fields: ["amount"],
    },
    directpay: {
      id: "directpay",
      name: "Directpay ewallets",
      min: 10,
      max: 5000,
      logos: [PAY + "touchngo.png", PAY + "duitnow.png", PAY + "grabpay.png"],
      logoClass: "mh-dep-card__logo--stack",
      type: "ewallet",
      fields: ["amount", "qr", "wallet"],
      wallet: "DP-1737116847",
    },
    touchngo: {
      id: "touchngo",
      name: "Touch N Go Ewallet",
      min: 10,
      max: 5000,
      logo: PAY + "touchngo.png",
      type: "ewallet",
      badge: "+10%",
      wallet: "60123456789",
      fields: ["amount", "qr", "wallet"],
    },
    "duitnow-qr": {
      id: "duitnow-qr",
      name: "Duitnow QR",
      min: 10,
      max: 10000,
      logo: PAY + "duitnow.png",
      type: "ewallet",
      badge: "+10%",
      fields: ["amount", "qr", "wallet"],
      wallet: "DUITNOW@1XBET",
    },
    fpx: {
      id: "fpx",
      name: "FPX",
      min: 20,
      max: 30000,
      logo: PAY + "fpx.svg",
      type: "banking",
      badge: "+10%",
      fields: ["amount"],
    },
    paynow: {
      id: "paynow",
      name: "Paynow",
      min: 10,
      max: 5000,
      logo: PAY + "paynow.svg",
      type: "ewallet",
      fields: ["amount"],
    },
    "touchngo-direct": {
      id: "touchngo-direct",
      name: "Touch N Go Direct",
      min: 10,
      max: 5000,
      logo: PAY + "touchngo.png",
      type: "ewallet",
      fields: ["amount", "qr", "wallet"],
      wallet: "60123456789",
    },
    help2pay: {
      id: "help2pay",
      name: "Help2Pay",
      min: 20,
      max: 15000,
      logo: PAY + "help2pay.png",
      type: "ewallet",
      fields: ["amount", "wallet"],
      wallet: "H2P-1737116847",
    },
    grabpay: {
      id: "grabpay",
      name: "GrabPay",
      min: 10,
      max: 5000,
      logo: PAY + "grabpay.png",
      type: "ewallet",
      fields: ["amount", "qr", "wallet"],
      wallet: "60198765432",
    },
    visa: {
      id: "visa",
      name: "Visa",
      min: 10,
      max: 20000,
      placeholder: { text: "Visa", style: "background:#1a1f71;" },
      type: "card",
      fields: ["amount"],
    },
    mastercard: {
      id: "mastercard",
      name: "Mastercard",
      min: 10,
      max: 20000,
      placeholder: { text: "Mastercard", style: "background:linear-gradient(135deg,#eb001b,#f79e1b);" },
      type: "card",
      fields: ["amount"],
    },
    bitcoin: {
      id: "bitcoin",
      name: "Bitcoin (BTC)",
      min: 50,
      max: 100000,
      logo: PAY + "bitcoin.png",
      type: "crypto",
      fields: ["amount", "qr", "wallet"],
      wallet: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    },
    "tether-erc20": {
      id: "tether-erc20",
      name: "Tether ERC20",
      min: 20,
      max: 100000,
      logo: PAY + "tether.png",
      type: "crypto",
      fields: ["amount", "qr", "wallet"],
      wallet: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
    },
  };

  const SECTIONS = [
    {
      id: "recommended",
      title: "Recommended",
      ids: [
        "tether-tron",
        "my-online-banking",
        "directpay",
        "touchngo",
        "duitnow-qr",
        "fpx",
        "paynow",
        "touchngo-direct",
      ],
    },
    { id: "card", title: "Payment cards", ids: ["visa", "mastercard"] },
    {
      id: "ewallet",
      title: "E-wallets",
      ids: ["touchngo", "grabpay", "duitnow-qr", "help2pay", "paynow", "directpay"],
    },
    { id: "banking", title: "Internet banking", ids: ["my-online-banking", "fpx"] },
    { id: "transfer", title: "Bank transfer", ids: ["fpx"] },
    {
      id: "crypto",
      title: "Cryptocurrencies",
      ids: ["tether-tron", "tether-erc20", "bitcoin"],
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

  const state = { step: "methods", methodId: null, amount: 0, typeFilter: "all" };
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

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function methodLogo(m, forSummary) {
    if (m.logos && m.logos.length) {
      const cls = forSummary ? "" : m.logoClass || "";
      return m.logos
        .map((src) => `<img src="${esc(src)}" alt="" width="40" height="36" loading="lazy" />`)
        .join("");
    }
    if (m.logo) return `<img src="${esc(m.logo)}" alt="" width="88" height="36" loading="lazy" />`;
    const ph = m.placeholder || { text: m.name, style: "background:#2f69b1;" };
    return `<span class="mh-dep-card__ph" style="${esc(ph.style)}">${esc(ph.text)}</span>`;
  }

  function cardHtml(id) {
    const m = METHODS[id];
    if (!m) return "";
    const badge = m.badge ? `<span class="mh-dep-card__badge">${esc(m.badge)}</span>` : "";
    const logoCls = m.logoClass ? ` ${m.logoClass}` : "";
    return `<button type="button" class="mh-dep-card" data-mh-dep-method="${esc(id)}" aria-label="${esc(m.name)}">
      ${badge}
      <span class="mh-dep-card__logo${logoCls}">${methodLogo(m)}</span>
      <span class="mh-dep-card__name">${esc(m.name)}</span>
    </button>`;
  }

  function visibleSections() {
    if (state.typeFilter === "all") return SECTIONS;
    return SECTIONS.filter((sec) => sec.id === state.typeFilter);
  }

  function renderTypeList() {
    const root = $("#mh-dep-type-list");
    if (!root) return;
    root.innerHTML = TYPE_OPTIONS.map((opt) => {
      const on = opt.id === state.typeFilter;
      return `<li>
        <button type="button" class="mh-dep-type-list__btn${on ? " is-active" : ""}" role="option" aria-selected="${on ? "true" : "false"}" data-mh-dep-type="${esc(opt.id)}">
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
    const sheet = $("#mh-dep-type-sheet");
    const btn = $("[data-mh-dep-types]");
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
    const root = $("#mh-dep-methods-list");
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
        <div class="mh-dep-grid${sec.single ? " mh-dep-grid--single" : ""}">${cards}</div>
      </section>`;
      })
      .join("");
  }

  function showStep(name) {
    state.step = name;
    $$("[data-mh-dep-step]").forEach((el) => {
      el.hidden = el.getAttribute("data-mh-dep-step") !== name;
    });
    const modeBar = $(".mh-dep-mode");
    if (modeBar) modeBar.hidden = name !== "methods";
    const title = $("#mh-dep-subbar-title");
    if (title) {
      const map = {
        methods: "Deposit",
        amount: "Deposit amount",
        confirm: "Confirm deposit",
        success: "Deposit success",
      };
      title.textContent = map[name] || "Deposit";
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
      <div class="mh-dep-method-summary__logo">${methodLogo(m, true)}</div>
      <div class="mh-dep-method-summary__meta">
        <p class="mh-dep-method-summary__name">${esc(m.name)}</p>
        <p class="mh-dep-method-summary__limits">Min ${m.min} MYR · Max ${m.max.toLocaleString()} MYR</p>
      </div>`;
  }

  function renderAmountStep() {
    const m = getMethod();
    if (!m) return;
    fillMethodSummary("#mh-dep-amount-method");
    $("#mh-dep-min").textContent = `${m.min} MYR`;
    $("#mh-dep-max").textContent = `${m.max.toLocaleString()} MYR`;

    const presets = $("#mh-dep-presets");
    presets.innerHTML = PRESETS.map((n) => {
      const active = Number(state.amount) === n ? " is-active" : "";
      return `<button type="button" class="mh-dep-preset${active}" data-mh-dep-preset="${n}">${n >= 1000 ? "1k" : n}</button>`;
    }).join("");

    const input = $("#mh-dep-amount-input");
    if (input) input.value = state.amount > 0 ? String(state.amount) : "";

    const extra = $("#mh-dep-amount-extra");
    let html = "";
    if (m.fields.includes("qr")) {
      html += `<div class="mh-dep-qr">
        <img src="${PAY}qr-code.jpg" alt="Payment QR" width="140" height="140" />
        <p class="mh-dep-note" style="margin:0">Scan QR with your payment app</p>`;
      if (m.wallet) {
        html += `<div class="mh-dep-wallet"><span>${esc(m.wallet)}</span>
          <button type="button" data-mh-dep-copy="${esc(m.wallet)}">Copy</button></div>`;
      }
      html += `</div>`;
    } else if (m.fields.includes("wallet") && m.wallet) {
      html += `<div class="mh-dep-field"><label>Wallet / reference</label>
        <div class="mh-dep-wallet"><span>${esc(m.wallet)}</span>
        <button type="button" data-mh-dep-copy="${esc(m.wallet)}">Copy</button></div></div>`;
    }
    extra.innerHTML = html;
    showStep("amount");
  }

  function renderConfirmStep() {
    const m = getMethod();
    if (!m) return;
    fillMethodSummary("#mh-dep-confirm-method");
    $("#mh-dep-confirm-rows").innerHTML = `
      <li><span>Method</span><strong>${esc(m.name)}</strong></li>
      <li><span>Amount</span><strong>${Number(state.amount).toFixed(2)} MYR</strong></li>
      <li><span>Account</span><strong>1737116847</strong></li>`;
    showStep("confirm");
  }

  function openMethod(id) {
    if (!METHODS[id]) return;
    state.methodId = id;
    state.amount = 0;
    renderAmountStep();
  }

  function validateAmount() {
    const m = getMethod();
    if (!m) return false;
    const n = Number(state.amount);
    if (!isFinite(n) || n < m.min) {
      toast(`Minimum deposit is ${m.min} MYR`);
      return false;
    }
    if (n > m.max) {
      toast(`Maximum deposit is ${m.max.toLocaleString()} MYR`);
      return false;
    }
    return true;
  }

  function syncPresets() {
    $$("[data-mh-dep-preset]").forEach((btn) => {
      btn.classList.toggle("is-active", Number(btn.getAttribute("data-mh-dep-preset")) === Number(state.amount));
    });
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

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setTypeSheetOpen(false);
    });

    document.addEventListener("click", (e) => {
      if (e.target.closest("[data-mh-dep-types]")) {
        setTypeSheetOpen(true);
        return;
      }

      if (e.target.closest("[data-mh-dep-types-close]")) {
        setTypeSheetOpen(false);
        return;
      }

      const typeOpt = e.target.closest("[data-mh-dep-type]");
      if (typeOpt) {
        state.typeFilter = typeOpt.getAttribute("data-mh-dep-type") || "all";
        renderTypeList();
        renderMethods();
        setTypeSheetOpen(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      const method = e.target.closest("[data-mh-dep-method]");
      if (method) {
        openMethod(method.getAttribute("data-mh-dep-method"));
        return;
      }

      const preset = e.target.closest("[data-mh-dep-preset]");
      if (preset) {
        state.amount = Number(preset.getAttribute("data-mh-dep-preset"));
        const input = $("#mh-dep-amount-input");
        if (input) input.value = String(state.amount);
        syncPresets();
        return;
      }

      const copy = e.target.closest("[data-mh-dep-copy]");
      if (copy) {
        const val = copy.getAttribute("data-mh-dep-copy") || "";
        navigator.clipboard?.writeText(val).catch(() => {});
        toast("Copied");
        return;
      }

      if (e.target.closest("[data-mh-dep-back]")) {
        if (state.step === "amount") showStep("methods");
        else if (state.step === "confirm") renderAmountStep();
        else if (state.step === "success") showStep("methods");
        else window.history.length > 1 ? history.back() : (window.location.href = "profile.html");
        return;
      }

      if (e.target.closest("[data-mh-dep-to-confirm]")) {
        const input = $("#mh-dep-amount-input");
        if (input) state.amount = Number(input.value);
        if (!validateAmount()) return;
        renderConfirmStep();
        return;
      }

      if (e.target.closest("[data-mh-dep-submit]")) {
        const btn = e.target.closest("[data-mh-dep-submit]");
        btn.disabled = true;
        btn.textContent = "Processing…";
        window.setTimeout(() => {
          btn.disabled = false;
          btn.textContent = "Confirm deposit";
          const m = getMethod();
          $("#mh-dep-success-desc").textContent = m
            ? `Your deposit of ${Number(state.amount).toFixed(2)} MYR via ${m.name} was submitted. Funds are usually credited within a few minutes.`
            : "Your deposit was submitted.";
          showStep("success");
        }, 1200);
        return;
      }

      if (e.target.closest("[data-mh-dep-again]")) {
        state.methodId = null;
        state.amount = 0;
        showStep("methods");
      }
    });

    $("#mh-dep-amount-input")?.addEventListener("input", (e) => {
      state.amount = Number(e.target.value) || 0;
      syncPresets();
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
