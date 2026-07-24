/**
 * auth-modals.js — Login / Register / Confirm popups
 * Login layout: screenshot 1 · Confirm dialogs: screenshot 2
 * Colors: DESIGN_SYSTEM.md
 */
(function () {
  "use strict";

  /* Force mobile layout viewport for Figma captures: ?mobile=1 */
  try {
    if (new URLSearchParams(window.location.search).get("mobile") === "1") {
      var meta = document.querySelector('meta[name="viewport"]');
      if (meta) meta.setAttribute("content", "width=390, initial-scale=1");
      else {
        meta = document.createElement("meta");
        meta.name = "viewport";
        meta.content = "width=390, initial-scale=1";
        document.head.appendChild(meta);
      }
      document.documentElement.classList.add("capture-mobile");
    }
  } catch (e) { /* ignore */ }

  const EYE_OFF =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
  const EYE_ON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
  const CLOSE_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>';

  let otpTimerId = null;
  let otpSeconds = 0;
  /* Demo TAC — any other 6-digit code shows error */
  const DEMO_TAC = "123456";

  function clearOtpError() {
    const err = $("#auth-otp-error");
    if (err) {
      err.hidden = true;
      err.textContent = "Invalid code. Please try again.";
    }
    $$("#auth-otp input").forEach((input) => input.classList.remove("is-invalid"));
  }

  function showOtpError(msg) {
    const err = $("#auth-otp-error");
    if (err) {
      err.textContent = msg || "Invalid code. Please try again.";
      err.hidden = false;
    }
    $$("#auth-otp input").forEach((input) => input.classList.add("is-invalid"));
  }

  function readOtpCode() {
    return $$("#auth-otp input")
      .map((i) => i.value)
      .join("");
  }

  function checkOtpAndAdvance() {
    const code = readOtpCode();
    if (code.length < 6) return;
    if (code === DEMO_TAC) {
      clearOtpError();
      openPanel("complete");
      return;
    }
    showOtpError("Invalid code. Please try again.");
  }

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
      /* VERIFY — TAC after Register step 1 (split auth-dialog) */
      '<div class="auth-panel" data-auth-panel="verify" role="dialog" aria-modal="true" aria-labelledby="auth-verify-title" hidden>' +
      '<div class="auth-dialog">' +
      head("Verify Your Number", "auth-verify-title") +
      '<div class="auth-dialog-body">' +
      artCol() +
      '<form class="auth-dialog-form auth-verify-form" id="auth-verify-form" novalidate>' +
      '<div class="auth-verify-copy">' +
      "<h3>Verify Your Number</h3>" +
      '<p id="auth-verify-sub">Enter the code we sent to *******0000.</p>' +
      "</div>" +
      '<div class="auth-otp" id="auth-otp">' +
      '<input type="text" inputmode="numeric" maxlength="1" aria-label="Digit 1" autocomplete="one-time-code" />' +
      '<input type="text" inputmode="numeric" maxlength="1" aria-label="Digit 2" />' +
      '<input type="text" inputmode="numeric" maxlength="1" aria-label="Digit 3" />' +
      '<input type="text" inputmode="numeric" maxlength="1" aria-label="Digit 4" />' +
      '<input type="text" inputmode="numeric" maxlength="1" aria-label="Digit 5" />' +
      '<input type="text" inputmode="numeric" maxlength="1" aria-label="Digit 6" />' +
      "</div>" +
      '<p class="auth-otp-timer" id="auth-otp-timer">TAC Code Sent. 60s</p>' +
      '<p class="auth-otp-error" id="auth-otp-error" hidden role="alert">Invalid code. Please try again.</p>' +
      '<button type="button" class="auth-btn auth-btn--cs auth-btn--block" data-auth-action="live-chat">Contact Customer Service</button>' +
      "</form>" +
      "</div></div></div>" +
      /* COMPLETE — same split auth-dialog as Login / Register */
      '<div class="auth-panel" data-auth-panel="complete" role="dialog" aria-modal="true" aria-labelledby="auth-complete-title" hidden>' +
      '<div class="auth-dialog">' +
      head("Log In", "auth-complete-title") +
      '<div class="auth-dialog-body">' +
      artCol() +
      '<div class="auth-dialog-form auth-complete-form">' +
      "<h3>Registration Completed!</h3>" +
      '<button type="button" class="auth-btn auth-btn--login auth-btn--block" data-auth-open="login">Log In</button>' +
      "</div>" +
      "</div></div></div>" +
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

  function accountMenuHtml(menuId) {
    const chevron =
      '<svg viewBox="0 0 8 8" width="8" height="8" aria-hidden="true"><path d="M1.5 2.75L4 5.25 6.5 2.75" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    const icons = {
      deposit:
        '<svg viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M9 2.5v8M9 10.5L6.25 7.75M9 10.5l2.75-2.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M3.5 12.5c.9 1.6 2.9 2.7 5.5 2.7s4.6-1.1 5.5-2.7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
      withdraw:
        '<svg viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M9 15.5v-8M9 7.5l2.75 2.75M9 7.5L6.25 10.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M3.5 5.5c.9-1.6 2.9-2.7 5.5-2.7s4.6 1.1 5.5 2.7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
      invite:
        '<svg viewBox="0 0 18 18" fill="none" aria-hidden="true"><circle cx="6.5" cy="6" r="2.25" stroke="currentColor" stroke-width="1.5"/><circle cx="12.25" cy="7" r="1.75" stroke="currentColor" stroke-width="1.4"/><path d="M2.5 14.5c.4-2.2 2.1-3.5 4-3.5s3.6 1.3 4 3.5M10.5 11.2c1.1-.4 2.3-.2 3.2.7.7.8 1 1.7 1.1 2.6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
      profile:
        '<svg viewBox="0 0 18 18" fill="none" aria-hidden="true"><circle cx="9" cy="6" r="2.5" stroke="currentColor" stroke-width="1.5"/><path d="M4 14.5c.6-2.4 2.5-3.7 5-3.7s4.4 1.3 5 3.7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
      history:
        '<svg viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M9 6v3l1.9 1.9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 9a6 6 0 1 0 1.1-3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M3 3v3h3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      settings:
        '<svg viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M9 1.65l1.2.32.42 1.4c.42.12.81.3 1.16.54l1.38-.42 1.2 1.2-.42 1.38c.24.35.42.74.54 1.16l1.4.42.32 1.2-.32 1.2-1.4.42c-.12.42-.3.81-.54 1.16l.42 1.38-1.2 1.2-1.38-.42a4.6 4.6 0 01-1.16.54l-.42 1.4L9 16.35l-1.2-.32-.42-1.4a4.6 4.6 0 01-1.16-.54l-1.38.42-1.2-1.2.42-1.38a4.6 4.6 0 01-.54-1.16l-1.4-.42L1.65 9l.32-1.2 1.4-.42c.12-.42.3-.81.54-1.16l-.42-1.38 1.2-1.2 1.38.42c.35-.24.74-.42 1.16-.54l.42-1.4L9 1.65z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><circle cx="9" cy="9" r="2.2" stroke="currentColor" stroke-width="1.45"/></svg>',
      logout:
        '<svg viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M7.5 3.5H4.2A1.7 1.7 0 002.5 5.2v7.6A1.7 1.7 0 004.2 14.5h3.3M8 9h7.5M12.5 5.5L16 9l-3.5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      avatar:
        '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="7" r="3.2" stroke="currentColor" stroke-width="1.5"/><path d="M4 16.5c.7-2.8 2.9-4.2 6-4.2s5.3 1.4 6 4.2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    };

    return (
      '<div class="acc-menu" id="' +
      menuId +
      '" role="menu" hidden>' +
      '<div class="acc-menu-arrow" aria-hidden="true"></div>' +
      '<div class="acc-menu-head">' +
      '<span class="acc-menu-avatar">' +
      icons.avatar +
      "</span>" +
      '<div class="acc-menu-user">' +
      '<p class="acc-menu-id">№1733760863</p>' +
      '<p class="acc-menu-email">wendy.h@example.net</p>' +
      "</div>" +
      "</div>" +
      '<div class="acc-menu-balances">' +
      '<div class="acc-menu-balance-row"><span class="acc-menu-balance-label">Bonus points ' +
      chevron +
      '</span><span class="acc-menu-balance-value">0</span></div>' +
      '<div class="acc-menu-balance-row"><span class="acc-menu-balance-label">Main account (MYR) ' +
      chevron +
      '</span><span class="acc-menu-balance-value">0</span></div>' +
      '<div class="acc-menu-balance-row"><span class="acc-menu-balance-label">Unsettled bets</span><span class="acc-menu-balance-value">0</span></div>' +
      "</div>" +
      '<nav class="acc-menu-nav" aria-label="Account">' +
      '<a href="deposit.html" class="acc-menu-link" role="menuitem"><span class="acc-menu-icon">' +
      icons.deposit +
      "</span>Make a Deposit</a>" +
      '<a href="withdraw.html" class="acc-menu-link" role="menuitem"><span class="acc-menu-icon">' +
      icons.withdraw +
      "</span>Withdraw Funds</a>" +
      '<a href="referral-invite.html" class="acc-menu-link" role="menuitem"><span class="acc-menu-icon">' +
      icons.invite +
      "</span>Invite friends</a>" +
      '<a href="personal-profile.html" class="acc-menu-link" role="menuitem"><span class="acc-menu-icon">' +
      icons.profile +
      '<span class="acc-menu-icon-dot" aria-hidden="true"></span></span>Personal Profile</a>' +
      '<a href="bet-history.html" class="acc-menu-link" role="menuitem"><span class="acc-menu-icon">' +
      icons.history +
      "</span>Bet History</a>" +
      '<a href="security.html" class="acc-menu-link" role="menuitem"><span class="acc-menu-icon">' +
      icons.settings +
      "</span>Account settings</a>" +
      '<button type="button" class="acc-menu-link" role="menuitem" data-auth-open="logout"><span class="acc-menu-icon">' +
      icons.logout +
      "</span>Log out</button>" +
      "</nav>" +
      "</div>"
    );
  }

  function closeAccountMenus(exceptWrap) {
    $$(".header-account-wrap.is-open").forEach((wrap) => {
      if (exceptWrap && wrap === exceptWrap) return;
      wrap.classList.remove("is-open");
      const btn = $(".header-account-btn", wrap);
      const menu = $(".acc-menu", wrap);
      if (btn) btn.setAttribute("aria-expanded", "false");
      if (menu) menu.hidden = true;
    });
  }

  function enhanceAccountDropdown(btn) {
    if (!btn || btn.dataset.accMenuReady === "1") return;

    let wrap = btn.closest(".header-account-wrap");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.className = "header-account-wrap";
      btn.parentNode.insertBefore(wrap, btn);
      wrap.appendChild(btn);
    }

    if (btn.tagName === "A") {
      const button = document.createElement("button");
      button.type = "button";
      button.className = btn.className;
      button.setAttribute("aria-label", btn.getAttribute("aria-label") || "My account");
      button.innerHTML = btn.innerHTML;
      btn.replaceWith(button);
      btn = button;
      wrap = btn.closest(".header-account-wrap");
    }

    let menu = $(".acc-menu", wrap);
    const menuId = "acc-menu-" + Math.random().toString(36).slice(2, 9);
    if (!menu) {
      wrap.insertAdjacentHTML("beforeend", accountMenuHtml(menuId));
      menu = $(".acc-menu", wrap);
    }

    btn.setAttribute("aria-haspopup", "menu");
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-controls", menu.id || menuId);
    btn.dataset.accMenuReady = "1";

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const willOpen = !wrap.classList.contains("is-open");
      closeAccountMenus(willOpen ? wrap : null);
      wrap.classList.toggle("is-open", willOpen);
      btn.setAttribute("aria-expanded", willOpen ? "true" : "false");
      if (menu) menu.hidden = !willOpen;
    });
  }

  function initAccountDropdowns() {
    $$(".header-account-btn").forEach(enhanceAccountDropdown);

    if (!document.body.dataset.accMenuDocBound) {
      document.body.dataset.accMenuDocBound = "1";
      document.addEventListener("click", (e) => {
        if (e.target.closest(".header-account-wrap")) return;
        closeAccountMenus();
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeAccountMenus();
      });
    }
  }

  function userHeaderHtml() {
    return (
      '<div class="header-user-block" id="header-user-block" hidden>' +
      '<div class="header-user-cluster">' +
      '<div class="header-account-wrap">' +
      '<button type="button" class="header-account-btn" aria-label="My account" aria-haspopup="menu" aria-expanded="false">' +
      '<img src="assets/images/account/icon-user.svg" alt="" width="16" height="16" />' +
      '<img src="assets/images/account/icon-chevron.svg" alt="" class="meta-chevron" width="10" height="6" />' +
      '<span class="header-account-dot" aria-hidden="true"></span>' +
      "</button>" +
      "</div>" +
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
      '<a href="deposit.html" class="btn-deposit">Make a Deposit</a>' +
      '<button type="button" class="icon-btn icon-btn-square header-msg-btn" aria-label="Messages" aria-haspopup="dialog" aria-expanded="false">' +
      '<span class="icon-btn-inner">' +
      '<img src="assets/images/account/icon-messages.svg" alt="" width="16" height="16" />' +
      '<span class="icon-badge">6</span>' +
      "</span>" +
      '<img src="assets/images/account/icon-chevron.svg" alt="" class="meta-chevron" width="10" height="6" />' +
      "</button>" +
      "</div>"
    );
  }

  function authScriptBase() {
    const scripts = document.getElementsByTagName("script");
    for (let i = scripts.length - 1; i >= 0; i--) {
      const src = scripts[i].getAttribute("src") || "";
      if (/auth-modals\.js(\?|$)/.test(src)) {
        return src.replace(/auth-modals\.js.*$/, "");
      }
    }
    return "js/";
  }

  function loadScriptOnce(id, src, onload) {
    const existing = document.getElementById(id);
    if (existing) {
      if (onload) {
        if (existing.dataset.loaded === "1") onload();
        else existing.addEventListener("load", onload);
      }
      return;
    }
    const s = document.createElement("script");
    s.id = id;
    s.src = src;
    s.onload = function () {
      s.dataset.loaded = "1";
      if (onload) onload();
    };
    document.head.appendChild(s);
  }

  function ensureMessagesUI() {
    const base = authScriptBase();
    const run = () => {
      if (window.MessagesUI && typeof window.MessagesUI.init === "function") {
        window.MessagesUI.init();
      }
    };
    if (window.MessagesUI) {
      run();
      return;
    }
    loadScriptOnce("messages-data-js", base + "messages-data.js", () => {
      loadScriptOnce("messages-js", base + "messages.js", run);
    });
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

    // Upgrade gift / lang icons to Figma assets when present
    const giftBtn = $('button[aria-label="Bonus"], button.header-gift-btn, a.header-gift-btn', actions);
    if (giftBtn) {
      giftBtn.classList.add("header-gift-btn");
      const giftImg = $("img", giftBtn);
      if (giftImg) giftImg.src = "assets/images/account/icon-gift.svg";
    }
    $$(".header-lang-btn .meta-chevron, .header-account-btn .meta-chevron, .header-msg-btn .meta-chevron", actions).forEach((img) => {
      img.src = "assets/images/account/icon-chevron.svg";
    });

    wireHeaderGiftBtn();

    if (hasStaticUser) return;

    const meta = $(".header-meta-group", actions);
    if (meta) {
      meta.insertAdjacentHTML("beforebegin", userHeaderHtml());
    } else {
      actions.insertAdjacentHTML("beforeend", userHeaderHtml());
    }
  }

  function wireHeaderGiftBtn() {
    const gift =
      document.querySelector(".header-actions .header-gift-btn") ||
      document.querySelector('.header-actions button[aria-label="Bonus"]');
    if (!gift || gift.dataset.giftWired === "1") {
      syncHeaderGiftBtn();
      return;
    }
    gift.classList.add("header-gift-btn");
    gift.dataset.giftWired = "1";
    gift.addEventListener("click", (e) => {
      e.preventDefault();
      if (isLoggedIn()) {
        window.location.href = "daily-checkin.html";
        return;
      }
      openPanel("login");
    });
    syncHeaderGiftBtn();
  }

  function syncHeaderGiftBtn() {
    const gift =
      document.querySelector(".header-actions .header-gift-btn") ||
      document.querySelector('.header-actions button[aria-label="Bonus"]');
    if (!gift) return;
    gift.classList.add("header-gift-btn");
    const loggedIn = isLoggedIn();
    gift.setAttribute(
      "aria-label",
      loggedIn ? "Daily Check-In" : "Bonus — log in to claim"
    );
    gift.setAttribute("title", loggedIn ? "Daily Check-In" : "Log in");
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

    syncHeaderGiftBtn();

    if (on) {
      initAccountDropdowns();
      ensureMessagesUI();
    } else {
      closeAccountMenus();
      if (window.MessagesUI && typeof window.MessagesUI.destroy === "function") {
        window.MessagesUI.destroy();
      }
    }

    const tabbar = document.querySelector(".mobile-tabbar");
    if (tabbar) {
      delete tabbar.dataset.mainTabbar;
      delete tabbar.dataset.accountTabbar;
    }
    initMobileTabbar();
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
        clearOtpError();
        if (input.value && inputs[i + 1]) inputs[i + 1].focus();
        checkOtpAndAdvance();
      });
      input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && !input.value && inputs[i - 1]) {
          inputs[i - 1].focus();
        }
      });
      input.addEventListener("paste", (e) => {
        e.preventDefault();
        clearOtpError();
        const text = (e.clipboardData || window.clipboardData).getData("text").replace(/\D/g, "").slice(0, 6);
        text.split("").forEach((ch, idx) => {
          if (inputs[idx]) inputs[idx].value = ch;
        });
        const next = inputs[Math.min(text.length, inputs.length - 1)];
        next?.focus();
        checkOtpAndAdvance();
      });
    });
  }

  function bindTriggers() {
    document.addEventListener("click", (e) => {
      const authOpen = e.target.closest("[data-auth-open]");
      if (authOpen) {
        e.preventDefault();
        const panel = authOpen.getAttribute("data-auth-open");
        if (panel === "logout") closeAccountMenus();
        openPanel(panel);
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
          location.href = "live-chat.html";
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
      if (/referral-invite\.html|membership-invite\.html|rebate-invite\.html/i.test(location.pathname + location.href)) {
        location.reload();
      }
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
      const phone = ($("#auth-reg-phone")?.value || "").replace(/\D/g, "");
      const last4 = phone.length >= 4 ? phone.slice(-4) : "0000";
      const sub = $("#auth-verify-sub");
      if (sub) sub.textContent = "Enter the code we sent to *******" + last4 + ".";
      $$("#auth-otp input").forEach((input) => {
        input.value = "";
      });
      clearOtpError();
      openPanel("verify");
    });

    $("#auth-verify-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      checkOtpAndAdvance();
    });

    wireOtp();
  }

  function initMobileTabbar() {
    const tabbar = document.querySelector(".mobile-tabbar");
    if (!tabbar || tabbar.dataset.mainTabbar === "1") return;

    const loggedIn = isLoggedIn() || document.body.classList.contains("is-logged-in");
    const page = document.body.dataset.page || "";
    const file = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();

    const accountPages = [
      "personal-profile", "security", "change-password", "information-center", "change-language",
      "deposit", "withdraw", "payment-queries", "transaction-history", "bet-history",
      "commission-record", "rebate-record", "checkin-record", "promotion-record",
      "daily-checkin", "live-chat"
    ];

    let active = "home";
    if (file === "promo.html" || page === "promo") active = "promo";
    else if (file === "deposit.html" || page === "deposit") active = "deposit";
    else if (file === "live-chat.html" || page === "live-chat") active = "livechat";
    else if (accountPages.indexOf(page) !== -1 || document.querySelector(".account-main")) {
      active = "account";
    }

    function tabClass(key) {
      return "mobile-tab" + (active === key ? " is-active" : "");
    }

    function iconWrap(svg, badge) {
      return (
        '<span class="mobile-tab-icon" aria-hidden="true">' +
        svg +
        (badge ? '<span class="mobile-tab-badge">' + badge + "</span>" : "") +
        "</span>"
      );
    }

    const iconHome =
      '<svg viewBox="0 0 24 24" fill="none"><path d="M4 10.5L12 4l8 6.5V20a1 1 0 01-1 1h-5v-6H10v6H5a1 1 0 01-1-1v-9.5z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>';
    const iconPromo =
      '<img src="assets/icons/icon-bottom-promo.svg" alt="" width="22" height="22" />';
    const iconPlus =
      '<svg viewBox="0 0 24 24" fill="none"><path d="M12 6v12M6 12h12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>';
    const iconChat =
      '<svg viewBox="0 0 24 24" fill="none"><path d="M7 15.5H5.8A1.8 1.8 0 014 13.7V6.8A1.8 1.8 0 015.8 5h9.4A1.8 1.8 0 0117 6.8v1.2" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M9 10.5h9.2A1.8 1.8 0 0120 12.3v6.4a.8.8 0 01-1.3.6L16 17.5H9.8A1.8 1.8 0 018 15.7v-3.4A1.8 1.8 0 019.8 10.5H9z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>';
    const iconAccount =
      '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.2" stroke="currentColor" stroke-width="1.7"/><path d="M5.5 19c.8-3.2 3.3-5 6.5-5s5.7 1.8 6.5 5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>';

    function authItem(key, label, iconHtml, extraClass) {
      return (
        '<button type="button" class="' +
        tabClass(key) +
        (extraClass ? " " + extraClass : "") +
        '" data-auth-open="login">' +
        iconHtml +
        '<span class="mobile-tab-label">' +
        label +
        "</span>" +
        "</button>"
      );
    }

    function linkItem(key, href, label, iconHtml, extraClass, id) {
      return (
        '<a href="' +
        href +
        '" class="' +
        tabClass(key) +
        (extraClass ? " " + extraClass : "") +
        '"' +
        (id ? ' id="' + id + '"' : "") +
        (active === key ? ' aria-current="page"' : "") +
        ">" +
        iconHtml +
        '<span class="mobile-tab-label">' +
        label +
        "</span>" +
        "</a>"
      );
    }

    const home = linkItem("home", "index.html", "Home", iconWrap(iconHome));
    const promo = linkItem("promo", "promo.html", "Promotion", iconWrap(iconPromo, "1"));
    const depositIcon =
      '<span class="mobile-tab-icon" aria-hidden="true"><span class="mobile-tab-fab-btn">' +
      iconPlus +
      "</span></span>";
    const deposit = loggedIn
      ? linkItem("deposit", "deposit.html", "Deposit", depositIcon, "mobile-tab--fab")
      : authItem("deposit", "Deposit", depositIcon, "mobile-tab--fab");
    const livechat = loggedIn
      ? linkItem("livechat", "live-chat.html", "Livechat", iconWrap(iconChat, "1"), "", "mobile-livechat-btn")
      : authItem("livechat", "Livechat", iconWrap(iconChat, "1"));
    const account = loggedIn
      ? linkItem("account", "personal-profile.html", "Account", iconWrap(iconAccount))
      : authItem("account", "Account", iconWrap(iconAccount));

    document.body.classList.add("has-account-tabbar");
    tabbar.classList.add("mobile-tabbar--account");
    tabbar.setAttribute("aria-label", "Mobile navigation");
    tabbar.dataset.mainTabbar = "1";
    tabbar.dataset.accountTabbar = "1";
    tabbar.innerHTML = home + promo + deposit + livechat + account;
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

    initMobileTabbar();

    window.AuthModals = {
      open: openPanel,
      close: closeAuth,
      setLoggedIn: setLoggedIn,
      isLoggedIn: isLoggedIn,
    };

    /* Deep-link for Figma / demos: ?modal=… or ?auth=1 (logged-in shell) */
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("auth") === "1") {
        setLoggedIn(true);
      }
      const modal = (params.get("modal") || "").toLowerCase();
      if (
        modal === "login" ||
        modal === "register" ||
        modal === "logout" ||
        modal === "verify" ||
        modal === "complete" ||
        modal === "forgot"
      ) {
        if (modal === "logout") setLoggedIn(true);
        else setLoggedIn(false);
        if (modal === "verify") {
          const sub = $("#auth-verify-sub");
          if (sub) sub.textContent = "Enter the code we sent to *******4894.";
        }
        requestAnimationFrame(() => openPanel(modal));
      }
    } catch (e) { /* ignore */ }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
