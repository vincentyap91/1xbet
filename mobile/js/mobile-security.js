(() => {
  "use strict";

  if (!document.body.classList.contains("mh-page--security-flow")) return;

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
    }, 2000);
  }

  function requireAuth() {
    try {
      if (localStorage.getItem("mh-logged-in-v1") !== "1") {
        window.location.replace("login.html");
        return false;
      }
    } catch (_) {
      /* continue */
    }
    return true;
  }

  const EYE_OFF =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 002.8 2.8"/><path d="M9.9 5.1A10.5 10.5 0 0121 12c-.7 1.2-1.6 2.3-2.7 3.2M6.1 6.1C4.7 7.2 3.6 8.5 3 12c1.5 4 5.2 7 9 7a9.5 9.5 0 005.1-1.5"/></svg>';
  const EYE_ON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';

  function initPassword() {
    const form = $("#mh-cpw-form");
    if (!form) return;

    $$("[data-mh-cpw-eye]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-mh-cpw-eye");
        const input = document.getElementById(id);
        if (!input) return;
        const show = input.type === "password";
        input.type = show ? "text" : "password";
        btn.innerHTML = show ? EYE_ON : EYE_OFF;
        btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
      });
    });

    const newPass = $("#mh-cpw-new");
    const confirmPass = $("#mh-cpw-confirm");
    const errEl = $("#mh-cpw-error");
    const reqItems = $$("#mh-cpw-reqs [data-req]");

    function validPassword(value) {
      const v = value || "";
      return {
        len: v.length >= 8 && /[A-Za-z]/.test(v) && /[0-9]/.test(v),
        alnum: v.length > 0 && /^[A-Za-z0-9]+$/.test(v),
        nosym: v.length > 0 && !/[^A-Za-z0-9]/.test(v),
      };
    }

    function syncReqs() {
      const state = validPassword(newPass ? newPass.value : "");
      reqItems.forEach((li) => {
        li.classList.toggle("is-ok", !!state[li.getAttribute("data-req")]);
      });
      if (errEl && confirmPass && newPass) {
        const mismatch = confirmPass.value.length > 0 && newPass.value !== confirmPass.value;
        errEl.hidden = !mismatch;
      }
    }

    newPass?.addEventListener("input", syncReqs);
    confirmPass?.addEventListener("input", syncReqs);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const current = $("#mh-cpw-current")?.value || "";
      const neu = newPass?.value || "";
      const conf = confirmPass?.value || "";
      const state = validPassword(neu);
      if (!current) {
        toast("Enter current password");
        return;
      }
      if (!state.len || !state.alnum || !state.nosym) {
        toast("New password does not meet requirements");
        syncReqs();
        return;
      }
      if (neu !== conf) {
        if (errEl) errEl.hidden = false;
        toast("Passwords do not match");
        return;
      }
      toast("Password updated (demo)");
      form.reset();
      syncReqs();
    });
  }

  function initLanguage() {
    const list = $("#mh-lang-list");
    if (!list) return;

    list.addEventListener("click", (e) => {
      const btn = e.target.closest(".mh-lang-chip");
      if (!btn || btn.classList.contains("is-active")) return;

      $$(".mh-lang-chip", list).forEach((item) => {
        item.classList.remove("is-active");
        item.setAttribute("aria-selected", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-selected", "true");

      const label = btn.querySelector(".mh-lang-chip__label")?.textContent.trim() || "Language";
      const code = btn.getAttribute("data-lang") || "en";
      try {
        sessionStorage.setItem("header-lang", code);
      } catch (_) {
        /* ignore */
      }
      toast(`Language set to ${label} (demo)`);
    });
  }

  function init() {
    if (!requireAuth()) return;
    initPassword();
    initLanguage();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
