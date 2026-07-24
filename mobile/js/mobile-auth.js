(() => {
  const SESSION_KEY = "mh-logged-in-v1";
  const DONE_SECONDS = 10;

  const COUNTRIES = [
    { code: "MY", name: "Malaysia", flag: "assets/logos/flag-my.svg" },
    { code: "SG", name: "Singapore", flag: "assets/logos/flag-my.svg" },
    { code: "TH", name: "Thailand", flag: "assets/logos/flag-my.svg" },
    { code: "ID", name: "Indonesia", flag: "assets/logos/flag-my.svg" },
    { code: "PH", name: "Philippines", flag: "assets/logos/flag-my.svg" },
    { code: "VN", name: "Vietnam", flag: "assets/logos/flag-my.svg" },
    { code: "AU", name: "Australia", flag: "assets/logos/flag-my.svg" },
    { code: "GB", name: "United Kingdom", flag: "assets/logos/flag-my.svg" },
    { code: "US", name: "United States", flag: "assets/logos/flag-my.svg" },
  ];

  const CURRENCIES = [
    { code: "MYR", name: "Malaysian ringgit" },
    { code: "EUR", name: "Euro" },
    { code: "USD", name: "US dollar" },
    { code: "RUB", name: "Russian rouble" },
    { code: "AUD", name: "Australian dollar" },
    { code: "AZN", name: "Azerbaijani manat" },
    { code: "ALL", name: "Albanian lek" },
    { code: "DZDM", name: "Algerian dinar (manual)" },
    { code: "AOA", name: "Angolan kwanza" },
    { code: "ARS", name: "Argentine peso" },
    { code: "AMD", name: "Armenian dram" },
    { code: "AFN", name: "Afghan afghani" },
    { code: "BDT", name: "Bangladeshi taka" },
    { code: "BHD", name: "Bahraini dinar" },
    { code: "BOB", name: "Bolivian boliviano" },
  ];

  const BONUS_META = {
    casino: {
      title: "Casino + 1xGames",
      desc: "The maximum bonus amount is 7959.96 MYR + FS",
      icon: "assets/icons/icon-dice.svg",
    },
    "sport-single": {
      title: "Sport Single",
      desc: "100% up to 808 MYR — only 3 bets for your bonus!",
      icon: "assets/icons/sport-football.svg",
    },
    sport: {
      title: "Bonus for sports",
      desc: "First deposit bonus up to 588 MYR",
      icon: "assets/icons/sport-football.svg",
    },
    reject: {
      title: "Reject bonuses",
      desc: "Make your choice later",
      icon: "",
    },
  };

  function setLoggedIn() {
    try {
      localStorage.setItem(SESSION_KEY, "1");
    } catch (_) {
      /* ignore */
    }
  }

  function showToast(message) {
    const toast = document.getElementById("mh-toast");
    if (!toast) return;
    toast.hidden = false;
    toast.textContent = message;
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => {
      toast.hidden = true;
    }, 1800);
  }

  function completeLogin(message) {
    setLoggedIn();
    showToast(message);
    window.setTimeout(() => {
      window.location.href = "index.html";
    }, 500);
  }

  function initTabs() {
    const tabs = Array.from(document.querySelectorAll("[data-auth-tab]"));
    const panels = Array.from(document.querySelectorAll("[data-auth-panel]"));
    if (!tabs.length || !panels.length) return;

    const activate = (id) => {
      tabs.forEach((tab) => {
        const on = tab.getAttribute("data-auth-tab") === id;
        tab.classList.toggle("is-active", on);
        tab.setAttribute("aria-selected", on ? "true" : "false");
      });
      panels.forEach((panel) => {
        panel.hidden = panel.getAttribute("data-auth-panel") !== id;
      });
      if (id === "email" && document.body.classList.contains("mh-page--register")) {
        setEmailStep(1);
      }
    };

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => activate(tab.getAttribute("data-auth-tab")));
    });
  }

  function initPasswordToggles() {
    document.querySelectorAll("[data-auth-eye]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const wrap = btn.closest(".mh-auth-field--password");
        const input = wrap?.querySelector("input");
        const img = btn.querySelector("img");
        if (!input) return;
        const show = input.type === "password";
        input.type = show ? "text" : "password";
        if (img) {
          img.src = show ? "assets/icons/auth-eye.svg" : "assets/icons/auth-eye-off.svg";
        }
        btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
      });
    });
  }

  function setEmailStep(step) {
    const form = document.querySelector("[data-auth-email-form]");
    if (!form) return;
    const steps = form.querySelectorAll("[data-auth-email-step]");
    steps.forEach((el) => {
      el.hidden = Number(el.getAttribute("data-auth-email-step")) !== step;
    });

    const label = form.querySelector("[data-auth-email-label]");
    if (label) label.textContent = `Step ${step} of 3`;

    const steproot = form.querySelector("[data-auth-email-steps]");
    if (steproot) steproot.setAttribute("aria-label", `Step ${step} of 3`);

    form.querySelectorAll("[data-auth-step-dot]").forEach((dot) => {
      const n = Number(dot.getAttribute("data-auth-step-dot"));
      dot.classList.toggle("is-done", n < step);
      dot.classList.toggle("is-current", n === step);
    });
    form.querySelectorAll("[data-auth-step-line]").forEach((line) => {
      const n = Number(line.getAttribute("data-auth-step-line"));
      line.classList.toggle("is-done", n < step);
    });

    form.dataset.emailStep = String(step);
  }

  function getEmailStep() {
    const form = document.querySelector("[data-auth-email-form]");
    return Number(form?.dataset.emailStep || 1);
  }

  function openOverlay(el) {
    if (!el) return;
    el.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeOverlay(el) {
    if (!el) return;
    el.hidden = true;
    if (!document.querySelector(".mh-auth-overlay:not([hidden])")) {
      document.body.style.overflow = "";
    }
  }

  function renderCountryList(filter = "") {
    const list = document.querySelector("[data-auth-country-list]");
    if (!list) return;
    const q = filter.trim().toLowerCase();
    const selected = document.querySelector("[data-auth-country-value]")?.value || "MY";
    list.innerHTML = "";
    COUNTRIES.filter((c) => !q || c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)).forEach((c) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "mh-auth-overlay__row";
      btn.classList.toggle("is-selected", c.code === selected);
      btn.setAttribute("role", "option");
      btn.setAttribute("aria-selected", c.code === selected ? "true" : "false");
      btn.innerHTML = `
        <img src="${c.flag}" alt="" width="18" height="12" style="border-radius:2px;object-fit:cover" />
        <span class="mh-auth-overlay__code">${c.code}</span>
        <span class="mh-auth-overlay__name">(${c.name})</span>`;
      btn.addEventListener("click", () => {
        const value = document.querySelector("[data-auth-country-value]");
        const label = document.querySelector("[data-auth-country-label]");
        const flag = document.querySelector("[data-auth-country-flag]");
        if (value) value.value = c.code;
        if (label) label.textContent = c.name;
        if (flag) flag.src = c.flag;
        closeOverlay(document.getElementById("mh-auth-country"));
      });
      li.appendChild(btn);
      list.appendChild(li);
    });
  }

  function renderCurrencyList(filter = "") {
    const list = document.querySelector("[data-auth-currency-list]");
    if (!list) return;
    const q = filter.trim().toLowerCase();
    const selected = document.querySelector("[data-auth-currency-value]")?.value || "MYR";
    list.innerHTML = "";
    CURRENCIES.filter((c) => !q || c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)).forEach((c) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "mh-auth-overlay__row";
      btn.classList.toggle("is-selected", c.code === selected);
      btn.setAttribute("role", "option");
      btn.setAttribute("aria-selected", c.code === selected ? "true" : "false");
      btn.innerHTML = `
        <span class="mh-auth-overlay__code">${c.code}</span>
        <span class="mh-auth-overlay__name">(${c.name})</span>`;
      btn.addEventListener("click", () => {
        const value = document.querySelector("[data-auth-currency-value]");
        const label = document.querySelector("[data-auth-currency-label]");
        if (value) value.value = c.code;
        if (label) label.textContent = `${c.code} (${c.name})`;
        closeOverlay(document.getElementById("mh-auth-currency"));
      });
      li.appendChild(btn);
      list.appendChild(li);
    });
  }

  function syncBonusSelectionUI() {
    document.querySelectorAll("[data-auth-bonus-opt]").forEach((input) => {
      const row = input.closest(".mh-auth-bonus-opt");
      row?.classList.toggle("is-selected", input.checked);
    });
  }

  function applyBonusChoice(id) {
    const meta = BONUS_META[id] || BONUS_META.casino;
    const value = document.querySelector("[data-auth-bonus-value]");
    const title = document.querySelector("[data-auth-bonus-title]");
    const desc = document.querySelector("[data-auth-bonus-desc]");
    const icon = document.querySelector("[data-auth-bonus-icon]");
    if (value) value.value = id;
    if (title) title.textContent = meta.title;
    if (desc) desc.textContent = meta.desc;
    if (icon) {
      if (meta.icon) {
        icon.hidden = false;
        icon.src = meta.icon;
      } else {
        icon.hidden = true;
      }
    }
  }

  function applyDoneChrome() {
    document.body.classList.add("is-logged-in", "is-reg-done");

    const actions = document.querySelector(".mh-header__actions");
    if (actions) {
      actions.innerHTML = `
        <button type="button" class="mh-btn-deposit" data-mh-deposit>Deposit</button>
        <button type="button" class="mh-header__account" data-mh-account aria-label="Account">
          <img src="assets/icons/mh-account.svg" alt="" width="14" height="16" />
          <span class="mh-header__account-badge" aria-hidden="true"></span>
        </button>`;
    }

    const loginTab =
      document.querySelector('.mh-tabbar .mh-tab[data-auth-open="login"]') ||
      document.querySelector('.mh-tabbar .mh-tab[href="login.html"]') ||
      document.querySelector(".mh-tabbar .mh-tab.is-active");
    if (loginTab) {
      loginTab.classList.remove("is-active");
      loginTab.removeAttribute("aria-current");
      loginTab.removeAttribute("data-auth-open");
      if (loginTab.tagName === "A") {
        loginTab.setAttribute("href", "deposit.html");
      } else {
        loginTab.setAttribute("data-mh-deposit-tab", "");
        loginTab.addEventListener(
          "click",
          (e) => {
            e.preventDefault();
            window.location.href = "deposit.html";
          },
          { once: true }
        );
      }
      loginTab.setAttribute("aria-label", "Deposit");
      loginTab.innerHTML = `
        <img src="assets/icons/tab-deposit.svg" alt="" width="20" height="20" />
        <span>Deposit</span>`;
    }
  }

  function startDoneCountdown() {
    const timerEl = document.querySelector("[data-auth-done-timer]");
    const barEl = document.querySelector("[data-auth-done-bar]");
    let left = DONE_SECONDS;
    const tick = () => {
      const mm = String(Math.floor(left / 60)).padStart(2, "0");
      const ss = String(left % 60).padStart(2, "0");
      if (timerEl) timerEl.textContent = `${mm}:${ss}`;
      if (barEl) barEl.style.transform = `scaleX(${Math.max(left / DONE_SECONDS, 0)})`;
      if (left <= 0) {
        window.location.href = "deposit.html";
        return;
      }
      left -= 1;
      window.setTimeout(tick, 1000);
    };
    tick();
  }

  function showRegistrationDone() {
    setLoggedIn();
    applyDoneChrome();

    const form = document.querySelector("[data-auth-email-form]");
    const done = document.querySelector("[data-auth-email-done]");
    const methods = document.querySelector(".mh-auth-methods");
    if (form) form.hidden = true;
    if (methods) methods.hidden = true;
    if (done) done.hidden = false;

    startDoneCountdown();
  }

  function initEmailFlow() {
    const form = document.querySelector("[data-auth-email-form]");
    if (!form) return;

    setEmailStep(1);
    renderCountryList();
    renderCurrencyList();

    form.querySelectorAll("[data-auth-email-next]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const step = getEmailStep();
        if (step === 1) {
          const email = form.querySelector("[data-auth-email-input]");
          if (!email?.value.trim() || !email.checkValidity()) {
            email?.reportValidity();
            email?.focus();
            return;
          }
          setEmailStep(2);
          return;
        }
        if (step === 2) setEmailStep(3);
      });
    });

    form.querySelectorAll("[data-auth-email-back]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const step = getEmailStep();
        if (step > 1) setEmailStep(step - 1);
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const pass = form.querySelector("[data-auth-password]");
      const confirm = form.querySelector("[data-auth-password-confirm]");
      if (!pass?.value) {
        pass?.focus();
        return;
      }
      if (pass.value !== confirm?.value) {
        showToast("Passwords do not match");
        confirm?.focus();
        return;
      }
      showRegistrationDone();
    });

    document.querySelector("[data-auth-open-country]")?.addEventListener("click", () => {
      renderCountryList(document.querySelector("[data-auth-country-search]")?.value || "");
      openOverlay(document.getElementById("mh-auth-country"));
    });
    document.querySelector("[data-auth-close-country]")?.addEventListener("click", () => {
      closeOverlay(document.getElementById("mh-auth-country"));
    });
    document.querySelector("[data-auth-country-search]")?.addEventListener("input", (e) => {
      renderCountryList(e.target.value);
    });

    document.querySelector("[data-auth-open-currency]")?.addEventListener("click", () => {
      renderCurrencyList(document.querySelector("[data-auth-currency-search]")?.value || "");
      openOverlay(document.getElementById("mh-auth-currency"));
    });
    document.querySelector("[data-auth-close-currency]")?.addEventListener("click", () => {
      closeOverlay(document.getElementById("mh-auth-currency"));
    });
    document.querySelector("[data-auth-currency-search]")?.addEventListener("input", (e) => {
      renderCurrencyList(e.target.value);
    });

    document.querySelector("[data-auth-open-bonus]")?.addEventListener("click", () => {
      const current = document.querySelector("[data-auth-bonus-value]")?.value || "casino";
      document.querySelectorAll("[data-auth-bonus-opt]").forEach((input) => {
        input.checked = input.value === current;
      });
      syncBonusSelectionUI();
      openOverlay(document.getElementById("mh-auth-bonuses"));
    });
    document.querySelectorAll("[data-auth-close-bonus]").forEach((btn) => {
      btn.addEventListener("click", () => closeOverlay(document.getElementById("mh-auth-bonuses")));
    });
    document.querySelectorAll("[data-auth-bonus-opt]").forEach((input) => {
      input.addEventListener("change", syncBonusSelectionUI);
    });
    document.querySelector("[data-auth-save-bonus]")?.addEventListener("click", () => {
      const picked = document.querySelector("[data-auth-bonus-opt]:checked");
      applyBonusChoice(picked?.value || "casino");
      closeOverlay(document.getElementById("mh-auth-bonuses"));
    });

    document.querySelector("[data-auth-promo-close]")?.addEventListener("click", () => {
      const promo = document.querySelector("[data-auth-done-promo]");
      if (promo) promo.hidden = true;
    });
  }

  function initForms() {
    document.querySelectorAll(".mh-auth-form").forEach((form) => {
      if (form.hasAttribute("data-auth-email-form")) return;
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const isRegister = document.body.classList.contains("mh-page--register");
        completeLogin(isRegister ? "Registration submitted (demo)" : "Logged in (demo)");
      });
    });

    document.querySelectorAll(".mh-auth-social").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        completeLogin("Logged in (demo)");
      });
    });
  }

  function init() {
    if (!document.body.classList.contains("mh-page--auth")) return;
    initTabs();
    initPasswordToggles();
    initForms();
    if (document.body.classList.contains("mh-page--register")) {
      initEmailFlow();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
