/**
 * auth-modals.js — Login / Register / Confirm popups
 * Login layout: screenshot 1 · Confirm dialogs: screenshot 2
 * Colors: DESIGN_SYSTEM.md
 */
(function () {
  "use strict";

  const EYE_OFF =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
  const EYE_ON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
  const CLOSE_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>';

  let otpTimerId = null;
  let otpSeconds = 0;

  function ensureCss() {
    if (document.getElementById("auth-modals-css")) return;
    const link = document.createElement("link");
    link.id = "auth-modals-css";
    link.rel = "stylesheet";
    link.href = "css/auth-modals.css";
    document.head.appendChild(link);
  }

  function artCol() {
    return (
      '<div class="auth-dialog-art" aria-hidden="true">' +
      '<img src="assets/images/auth/auth-hero.png" alt="" width="280" height="116" />' +
      "</div>"
    );
  }

  function head(title, titleId) {
    const idAttr = titleId ? ' id="' + titleId + '"' : "";
    return (
      '<div class="auth-dialog-head">' +
      '<div class="auth-dialog-brand">' +
      '<img class="auth-dialog-logo" src="assets/icons/logo-1xbet.svg" alt="1xBet" width="90" height="26" />' +
      '<h2 class="auth-dialog-title"' +
      idAttr +
      ">" +
      title +
      "</h2>" +
      "</div>" +
      '<button type="button" class="auth-dialog-close" data-auth-close aria-label="Close">' +
      CLOSE_SVG +
      "</button>" +
      "</div>"
    );
  }

  /** Screenshot 2 — white confirm card */
  function confirmDialog(opts) {
    const iconClass = opts.warn
      ? "auth-confirm-icon auth-confirm-icon--warn"
      : "auth-confirm-icon";
    const iconChar = opts.icon || "?";
    const primaryClass = opts.primaryClass || "auth-btn--login";
    const secondaryClass = opts.secondaryClass || "auth-btn--register";
    const primaryAttr = opts.primaryAttr || 'data-auth-close';
    const secondaryAttr = opts.secondaryAttr || 'data-auth-close';

    return (
      '<div class="auth-dialog auth-dialog--confirm">' +
      '<div class="auth-confirm">' +
      '<button type="button" class="auth-confirm-close" data-auth-close aria-label="Close">' +
      CLOSE_SVG +
      "</button>" +
      '<div class="' +
      iconClass +
      '" aria-hidden="true">' +
      iconChar +
      "</div>" +
      '<h2 class="auth-confirm-title" id="' +
      opts.titleId +
      '">' +
      opts.title +
      "</h2>" +
      '<p class="auth-confirm-text">' +
      opts.text +
      "</p>" +
      '<div class="auth-confirm-actions">' +
      '<button type="button" class="auth-btn ' +
      primaryClass +
      '" ' +
      primaryAttr +
      ">" +
      opts.primary +
      "</button>" +
      '<button type="button" class="auth-btn ' +
      secondaryClass +
      '" ' +
      secondaryAttr +
      ">" +
      opts.secondary +
      "</button>" +
      "</div>" +
      "</div>" +
      "</div>"
    );
  }

  function buildMarkup() {
    return (
      '<div class="auth-backdrop" id="auth-backdrop" hidden>' +
      /* LOGIN */
      '<div class="auth-panel" data-auth-panel="login" role="dialog" aria-modal="true" aria-labelledby="auth-login-title">' +
      '<div class="auth-dialog">' +
      head("Log In", "auth-login-title") +
      '<div class="auth-dialog-body">' +
      artCol() +
      '<form class="auth-dialog-form" id="auth-login-form" novalidate>' +
      '<div class="auth-field">' +
      '<label class="auth-label" for="auth-login-user">Enter Username or Phone Number</label>' +
      '<input class="auth-input" id="auth-login-user" name="username" type="text" autocomplete="username" placeholder="e.g: johndoe or 60123456789" required />' +
      '<p class="auth-hint">Phone number must include country code (60xxxxxxxxxx)</p>' +
      "</div>" +
      '<div class="auth-field">' +
      '<label class="auth-label" for="auth-login-pass">Enter Password</label>' +
      '<div class="auth-password-wrap">' +
      '<input class="auth-input" id="auth-login-pass" name="password" type="password" autocomplete="current-password" placeholder="Enter Password" required />' +
      '<button type="button" class="auth-eye" data-auth-eye="auth-login-pass" aria-label="Show password">' +
      EYE_OFF +
      "</button>" +
      "</div>" +
      "</div>" +
      '<div class="auth-row">' +
      '<label class="auth-check"><input type="checkbox" name="remember" /> Remember Me</label>' +
      "</div>" +
      '<div class="auth-actions">' +
      '<button type="submit" class="auth-btn auth-btn--login">Log In</button>' +
      '<button type="button" class="auth-btn auth-btn--ghost" data-auth-open="forgot">Forgot Password</button>' +
      "</div>" +
      '<p class="auth-switch">Do not have an account yet? <button type="button" data-auth-open="register">Register Now!</button></p>' +
      "</form>" +
      "</div></div></div>" +
      /* REGISTER */
      '<div class="auth-panel" data-auth-panel="register" role="dialog" aria-modal="true" aria-labelledby="auth-register-title" hidden>' +
      '<div class="auth-dialog">' +
      head("Register", "auth-register-title") +
      '<div class="auth-dialog-body">' +
      artCol() +
      '<form class="auth-dialog-form" id="auth-register-form" novalidate>' +
      '<div class="auth-field">' +
      '<label class="auth-label" for="auth-reg-user">Enter Username</label>' +
      '<input class="auth-input" id="auth-reg-user" name="username" type="text" autocomplete="username" placeholder="Username" required />' +
      "</div>" +
      '<div class="auth-field">' +
      '<label class="auth-label" for="auth-reg-phone">Mobile Number</label>' +
      '<div class="auth-phone-row">' +
      '<select class="auth-select" id="auth-reg-cc" name="countryCode" aria-label="Country code">' +
      '<option value="+60" selected>+60</option>' +
      '<option value="+65">+65</option>' +
      '<option value="+62">+62</option>' +
      '<option value="+66">+66</option>' +
      '<option value="+63">+63</option>' +
      "</select>" +
      '<input class="auth-input" id="auth-reg-phone" name="phone" type="tel" inputmode="numeric" placeholder="Phone number" required />' +
      "</div>" +
      "</div>" +
      '<div class="auth-field">' +
      '<label class="auth-label" for="auth-reg-pass">Enter Your Password</label>' +
      '<div class="auth-password-wrap">' +
      '<input class="auth-input" id="auth-reg-pass" name="password" type="password" autocomplete="new-password" placeholder="Password" required />' +
      '<button type="button" class="auth-eye" data-auth-eye="auth-reg-pass" aria-label="Show password">' +
      EYE_OFF +
      "</button>" +
      "</div>" +
      '<ul class="auth-req-list" id="auth-pass-reqs" aria-live="polite">' +
      '<li data-req="len">Include at least 8 characters, containing both a letter and a number, with no symbols allowed.</li>' +
      '<li data-req="alnum">Only letters (A-Z, a-z) and numbers (0-9).</li>' +
      '<li data-req="nosym">No special characters / symbols.</li>' +
      "</ul>" +
      "</div>" +
      '<div class="auth-field">' +
      '<label class="auth-label" for="auth-reg-ref">Referral Code</label>' +
      '<input class="auth-input" id="auth-reg-ref" name="referral" type="text" placeholder="Optional" />' +
      "</div>" +
      '<button type="submit" class="auth-btn auth-btn--register auth-btn--block">Register</button>' +
      '<p class="auth-switch">Already have an account? <button type="button" data-auth-open="login">Login Now!</button></p>' +
      "</form>" +
      "</div>" +
      '<div class="auth-social">' +
      '<p class="auth-social-label">Register Through Social Media</p>' +
      '<button type="button" class="auth-social-btn" aria-label="WhatsApp">' +
      '<img src="assets/images/auth/whatsapp.png" alt="" width="28" height="28" />' +
      "</button>" +
      "</div>" +
      "</div></div>" +
      /* FORGOT — confirm style (screenshot 2) */
      '<div class="auth-panel" data-auth-panel="forgot" role="dialog" aria-modal="true" aria-labelledby="auth-forgot-title" hidden>' +
      confirmDialog({
        titleId: "auth-forgot-title",
        title: "Confirm action",
        text: "To reset your password please contact our Customer Support via live chat for assistance.",
        icon: "?",
        primary: "Live Chat",
        secondary: "Cancel",
        primaryAttr: 'data-auth-close data-auth-action="live-chat"',
        secondaryAttr: 'data-auth-open="login"',
      }) +
      "</div>" +
      /* LOGOUT — screenshot 2 */
      '<div class="auth-panel" data-auth-panel="logout" role="dialog" aria-modal="true" aria-labelledby="auth-logout-title" hidden>' +
      confirmDialog({
        titleId: "auth-logout-title",
        title: "Confirm action",
        text: "Are you sure you want to log out?",
        icon: "?",
        primary: "Log Out",
        secondary: "Cancel",
        primaryAttr: 'data-auth-action="logout"',
        secondaryAttr: "data-auth-close",
      }) +
      "</div>" +
      /* VERIFY */
      '<div class="auth-panel" data-auth-panel="verify" role="dialog" aria-modal="true" aria-labelledby="auth-verify-title" hidden>' +
      '<div class="auth-dialog">' +
      head("Verify Your Number", "auth-verify-title") +
      '<div class="auth-dialog-body">' +
      artCol() +
      '<form class="auth-dialog-form" id="auth-verify-form" novalidate>' +
      '<div class="auth-verify-copy">' +
      "<h3>Verify Your Number</h3>" +
      '<p id="auth-verify-sub">Enter the code we sent to your phone.</p>' +
      "</div>" +
      '<div class="auth-otp" id="auth-otp">' +
      '<input type="text" inputmode="numeric" maxlength="1" aria-label="Digit 1" />' +
      '<input type="text" inputmode="numeric" maxlength="1" aria-label="Digit 2" />' +
      '<input type="text" inputmode="numeric" maxlength="1" aria-label="Digit 3" />' +
      '<input type="text" inputmode="numeric" maxlength="1" aria-label="Digit 4" />' +
      '<input type="text" inputmode="numeric" maxlength="1" aria-label="Digit 5" />' +
      '<input type="text" inputmode="numeric" maxlength="1" aria-label="Digit 6" />' +
      "</div>" +
      '<p class="auth-otp-timer" id="auth-otp-timer">TAC Code Sent. 60s</p>' +
      '<button type="submit" class="auth-btn auth-btn--register auth-btn--block">Confirm and Join Now</button>' +
      "</form>" +
      "</div></div></div>" +
      /* COMPLETE — confirm style success */
      '<div class="auth-panel" data-auth-panel="complete" role="dialog" aria-modal="true" aria-labelledby="auth-complete-title" hidden>' +
      confirmDialog({
        titleId: "auth-complete-title",
        title: "Registration Completed!",
        text: "Your account is ready. Log in to start playing.",
        icon: "!",
        warn: true,
        primary: "Log In",
        secondary: "Close",
        primaryAttr: 'data-auth-open="login"',
        secondaryAttr: "data-auth-close",
        primaryClass: "auth-btn--login",
        secondaryClass: "auth-btn--ghost",
      }) +
      "</div>" +
      "</div>"
    );
  }

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function $$(sel, root) {
    return Array.from((root || document).querySelectorAll(sel));
  }

  const AUTH_KEY = "1xbet_logged_in";

  function ensureAccountCss() {
    if (document.getElementById("account-css")) return;
    const link = document.createElement("link");
    link.id = "account-css";
    link.rel = "stylesheet";
    link.href = "css/account.css";
    document.head.appendChild(link);
  }

  function userHeaderHtml() {
    return (
      '<div class="header-user-block" id="header-user-block" hidden>' +
      '<div class="header-user-cluster">' +
      '<a href="personal-profile.html" class="header-account-btn" aria-label="My account">' +
      '<img src="assets/images/account/icon-user.svg" alt="" width="16" height="16" />' +
      '<img src="assets/images/account/icon-chevron.svg" alt="" class="meta-chevron" width="10" height="6" />' +
      '<span class="header-account-dot" aria-hidden="true"></span>' +
      "</a>" +
      '<div class="header-balance-chip">' +
      '<div class="header-balance-rows">' +
      '<div class="header-balance-row"><span>MYR</span><span>0</span></div>' +
      '<div class="header-balance-row"><span>Bonus points</span><span>0</span></div>' +
      "</div>" +
      '<button type="button" class="header-balance-refresh" aria-label="Update balance">' +
      '<img src="assets/images/account/icon-refresh.svg" alt="" width="10" height="10" />' +
      "</button>" +
      "</div>" +
      "</div>" +
      '<a href="deposit.html" class="btn-deposit">Make a deposit</a>' +
      '<button type="button" class="icon-btn icon-btn-square header-msg-btn" aria-label="Messages">' +
      '<span class="icon-btn-inner">' +
      '<img src="assets/images/account/icon-messages.svg" alt="" width="16" height="16" />' +
      '<span class="icon-badge">1</span>' +
      "</span>" +
      '<img src="assets/images/account/icon-chevron.svg" alt="" class="meta-chevron" width="10" height="6" />' +
      "</button>" +
      "</div>"
    );
  }

  function ensureUserHeader() {
    const actions = $(".header-actions");
    if (!actions) return;
    ensureAccountCss();

    // Account pages already ship a logged-in header — still normalize assets
    const hasStaticUser = $(".header-user-cluster", actions) || $("#header-user-block", actions);

    // Mark guest-only controls
    $$(".btn-register, .btn-login", actions).forEach((el) => el.classList.add("header-guest-only"));
    $$(".desktop-only-action", actions).forEach((el) => el.classList.add("header-guest-only"));

    // Upgrade gift / settings / lang icons to Figma assets when present
    const giftImg = $('button[aria-label="Bonus"] img, button[aria-label="Bonus"] .icon-btn-inner img', actions);
    if (giftImg) giftImg.src = "assets/images/account/icon-gift.svg";
    const settingsImg = $(".settings-btn img:first-child", actions);
    if (settingsImg) settingsImg.src = "assets/images/account/icon-settings.svg";
    $$(".settings-btn .meta-chevron, .lang-time-btn .meta-chevron, .header-account-btn .meta-chevron, .header-msg-btn .meta-chevron", actions).forEach((img) => {
      img.src = "assets/images/account/icon-chevron.svg";
    });
    const langImg = $(".lang-time-btn .lang-flag", actions);
    if (langImg) langImg.src = "assets/images/account/icon-lang-en.svg";

    if (hasStaticUser) return;

    const meta = $(".header-meta-group", actions);
    if (meta) {
      meta.insertAdjacentHTML("beforebegin", userHeaderHtml());
    } else {
      actions.insertAdjacentHTML("beforeend", userHeaderHtml());
    }
  }

  function setLoggedIn(on) {
    ensureUserHeader();
    document.body.classList.toggle("is-logged-in", !!on);
    try {
      if (on) sessionStorage.setItem(AUTH_KEY, "1");
      else sessionStorage.removeItem(AUTH_KEY);
    } catch (e) { /* ignore */ }

    const userBlock = $("#header-user-block");
    if (userBlock) userBlock.hidden = !on;

    $$(".header-guest-only").forEach((el) => {
      el.hidden = !!on;
    });
  }

  function isLoggedIn() {
    try {
      return sessionStorage.getItem(AUTH_KEY) === "1" || document.body.classList.contains("is-logged-in");
    } catch (e) {
      return document.body.classList.contains("is-logged-in");
    }
  }

  function openPanel(name) {
    const backdrop = $("#auth-backdrop");
    if (!backdrop) return;
    backdrop.hidden = false;
    requestAnimationFrame(() => backdrop.classList.add("is-open"));
    document.body.classList.add("auth-open");

    $$("[data-auth-panel]", backdrop).forEach((panel) => {
      const match = panel.getAttribute("data-auth-panel") === name;
      panel.hidden = !match;
    });

    if (name === "verify") startOtpTimer(60);

    const focusEl = $(
      '[data-auth-panel="' + name + '"] input, [data-auth-panel="' + name + '"] button',
      backdrop
    );
    focusEl?.focus();
  }

  function closeAuth() {
    const backdrop = $("#auth-backdrop");
    if (!backdrop) return;
    backdrop.classList.remove("is-open");
    document.body.classList.remove("auth-open");
    stopOtpTimer();
    setTimeout(() => {
      if (!backdrop.classList.contains("is-open")) backdrop.hidden = true;
    }, 200);
  }

  function startOtpTimer(sec) {
    stopOtpTimer();
    otpSeconds = sec;
    const el = $("#auth-otp-timer");
    const tick = () => {
      if (el) el.textContent = otpSeconds > 0 ? "TAC Code Sent. " + otpSeconds + "s" : "Resend code";
      if (otpSeconds <= 0) {
        stopOtpTimer();
        return;
      }
      otpSeconds -= 1;
    };
    tick();
    otpTimerId = setInterval(tick, 1000);
  }

  function stopOtpTimer() {
    if (otpTimerId) {
      clearInterval(otpTimerId);
      otpTimerId = null;
    }
  }

  function toast(msg) {
    if (typeof window.showToast === "function") {
      window.showToast(msg);
      return;
    }
    let el = $("#auth-toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "auth-toast";
      el.style.cssText =
        "position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:10001;background:#0f2744;color:#fff;padding:10px 16px;border-radius:8px;font-size:13px;font-weight:600;box-shadow:0 8px 24px rgba(0,0,0,.3)";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(el._t);
    el._t = setTimeout(() => {
      el.hidden = true;
    }, 2200);
  }

  function updatePassReqs(value) {
    const len = value.length >= 8 && /[A-Za-z]/.test(value) && /\d/.test(value);
    const alnum = value.length === 0 || /^[A-Za-z0-9]+$/.test(value);
    const nosym = value.length === 0 || !/[^A-Za-z0-9]/.test(value);
    const map = { len, alnum, nosym };
    $$("#auth-pass-reqs [data-req]").forEach((li) => {
      const key = li.getAttribute("data-req");
      li.classList.toggle("is-ok", !!map[key] && value.length > 0);
    });
    return len && alnum && nosym;
  }

  function wireOtp() {
    const inputs = $$("#auth-otp input");
    inputs.forEach((input, i) => {
      input.addEventListener("input", () => {
        input.value = input.value.replace(/\D/g, "").slice(0, 1);
        if (input.value && inputs[i + 1]) inputs[i + 1].focus();
      });
      input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && !input.value && inputs[i - 1]) {
          inputs[i - 1].focus();
        }
      });
      input.addEventListener("paste", (e) => {
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData("text").replace(/\D/g, "").slice(0, 6);
        text.split("").forEach((ch, idx) => {
          if (inputs[idx]) inputs[idx].value = ch;
        });
        const next = inputs[Math.min(text.length, inputs.length - 1)];
        next?.focus();
      });
    });
  }

  function bindTriggers() {
    document.addEventListener("click", (e) => {
      const logoutOpen = e.target.closest("[data-auth-open='logout']");
      if (logoutOpen) {
        e.preventDefault();
        openPanel("logout");
        return;
      }

      const loginBtn = e.target.closest(".btn-login");
      if (loginBtn) {
        e.preventDefault();
        openPanel("login");
        return;
      }

      const regBtn = e.target.closest(".btn-register, a[href='#reg-form'], .btn-slip-reg, .btn-get-bonus");
      if (regBtn) {
        e.preventDefault();
        openPanel("register");
      }
    });
  }

  function bindModal() {
    const backdrop = $("#auth-backdrop");
    if (!backdrop) return;

    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) {
        closeAuth();
        return;
      }

      const actionBtn = e.target.closest("[data-auth-action]");
      if (actionBtn) {
        e.preventDefault();
        const action = actionBtn.getAttribute("data-auth-action");
        if (action === "logout") {
          setLoggedIn(false);
          toast("Logged out");
          closeAuth();
          if (/personal-profile|deposit|withdraw/.test(location.pathname)) {
            location.href = "index.html";
          }
          return;
        }
        if (action === "live-chat") {
          toast("Opening live chat…");
          closeAuth();
          return;
        }
      }

      const openBtn = e.target.closest("[data-auth-open]");
      if (openBtn) {
        e.preventDefault();
        openPanel(openBtn.getAttribute("data-auth-open"));
        return;
      }

      const closeBtn = e.target.closest("[data-auth-close]");
      if (closeBtn) {
        e.preventDefault();
        closeAuth();
        return;
      }

      const eye = e.target.closest("[data-auth-eye]");
      if (eye) {
        e.preventDefault();
        const id = eye.getAttribute("data-auth-eye");
        const input = document.getElementById(id);
        if (!input) return;
        const show = input.type === "password";
        input.type = show ? "text" : "password";
        eye.innerHTML = show ? EYE_ON : EYE_OFF;
        eye.setAttribute("aria-label", show ? "Hide password" : "Show password");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && backdrop.classList.contains("is-open")) closeAuth();
    });

    $("#auth-login-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      setLoggedIn(true);
      toast("Demo only — signed in");
      closeAuth();
    });

    const regPass = $("#auth-reg-pass");
    regPass?.addEventListener("input", () => updatePassReqs(regPass.value));

    $("#auth-register-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const pass = $("#auth-reg-pass")?.value || "";
      if (!updatePassReqs(pass)) {
        toast("Please meet the password requirements");
        return;
      }
      const phone = ($("#auth-reg-phone")?.value || "").trim();
      const cc = $("#auth-reg-cc")?.value || "+60";
      const masked = phone ? cc + " *******" + phone.slice(-4) : "your phone";
      const sub = $("#auth-verify-sub");
      if (sub) sub.textContent = "Enter the code we sent to " + masked + ".";
      openPanel("verify");
    });

    $("#auth-verify-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const code = $$("#auth-otp input")
        .map((i) => i.value)
        .join("");
      if (code.length < 6) {
        toast("Enter the 6-digit code");
        return;
      }
      openPanel("complete");
    });

    wireOtp();
  }

  function init() {
    ensureCss();
    ensureAccountCss();
    // Always rebuild so markup stays in sync with this script
    const existing = $("#auth-backdrop");
    if (existing) existing.remove();
    document.body.insertAdjacentHTML("beforeend", buildMarkup());
    bindModal();
    bindTriggers();
    ensureUserHeader();

    // Restore session or honor page-level is-logged-in (account pages)
    if (isLoggedIn()) setLoggedIn(true);
    else setLoggedIn(false);

    window.AuthModals = {
      open: openPanel,
      close: closeAuth,
      setLoggedIn: setLoggedIn,
      isLoggedIn: isLoggedIn,
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
