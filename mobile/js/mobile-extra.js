(() => {
  "use strict";

  if (!document.body.classList.contains("mh-page--extra")) return;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const page = document.body.getAttribute("data-page") || "";

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

  function initReferral() {
    const topTabs = $$("[data-ref-top]");
    const topPanels = $$("[data-ref-panel]");
    topTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const key = tab.getAttribute("data-ref-top");
        topTabs.forEach((t) => {
          const on = t.getAttribute("data-ref-top") === key;
          t.classList.toggle("is-active", on);
          t.setAttribute("aria-selected", on ? "true" : "false");
        });
        topPanels.forEach((p) => {
          p.hidden = p.getAttribute("data-ref-panel") !== key;
        });
      });
    });

    const histTabs = $$("[data-ref-history]");
    const histPanels = $$("[data-ref-history-panel]");
    histTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const key = tab.getAttribute("data-ref-history");
        histTabs.forEach((t) => {
          const on = t.getAttribute("data-ref-history") === key;
          t.classList.toggle("is-active", on);
          t.setAttribute("aria-selected", on ? "true" : "false");
        });
        histPanels.forEach((p) => {
          p.hidden = p.getAttribute("data-ref-history-panel") !== key;
        });
      });
    });

    document.addEventListener("click", (e) => {
      const copyBtn = e.target.closest("[data-ref-copy-target]");
      if (copyBtn) {
        e.preventDefault();
        const id = copyBtn.getAttribute("data-ref-copy-target");
        const el = id ? document.getElementById(id) : null;
        const text = el?.textContent?.trim() || "";
        if (text && navigator.clipboard?.writeText) {
          navigator.clipboard.writeText(text).then(() => toast("Referral link copied")).catch(() => toast("Copied (demo)"));
        } else {
          toast("Copied (demo)");
        }
        return;
      }
      const share = e.target.closest("[data-ref-share]");
      if (share) {
        e.preventDefault();
        toast(`Share via ${share.getAttribute("data-ref-share")} (demo)`);
        return;
      }
      const claim = e.target.closest("[data-ref-claim]");
      if (claim) {
        e.preventDefault();
        toast("Nothing to claim (demo)");
        return;
      }
      if (e.target.closest("#ref-downlines-btn")) {
        e.preventDefault();
        toast("No downlines yet (demo)");
      }
    });
  }

  function initRebate() {
    const tabs = $$("[data-rb-tab]");
    const panels = $$("[data-rb-panel]");
    const params = new URLSearchParams(window.location.search);
    const initial = params.get("tab") || "unclaim";

    function setTab(key) {
      tabs.forEach((t) => {
        const on = t.getAttribute("data-rb-tab") === key;
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-selected", on ? "true" : "false");
      });
      panels.forEach((p) => {
        p.hidden = p.getAttribute("data-rb-panel") !== key;
      });
    }

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => setTab(tab.getAttribute("data-rb-tab")));
    });

    if (tabs.some((t) => t.getAttribute("data-rb-tab") === initial)) setTab(initial);
    else setTab("unclaim");
  }

  function initCheckin() {
    const claimedIcon =
      '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    const backdrop = $("#dci-claim-backdrop");
    const claimText = $("#dci-claim-text");
    const claimOk = $("#dci-claim-ok");
    const modal = backdrop?.querySelector(".mh-ex-modal");
    const MODAL_CLOSE_MS = 220;
    let modalCloseTimer = 0;
    let modalOpenRaf = 0;

    function motionMs(ms) {
      try {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return 1;
      } catch (_) {
        /* ignore */
      }
      return ms;
    }

    function openClaimPopup(reward) {
      if (!backdrop) return;
      clearTimeout(modalCloseTimer);
      if (modalOpenRaf) {
        cancelAnimationFrame(modalOpenRaf);
        modalOpenRaf = 0;
      }
      if (claimText) claimText.textContent = `You have earned ${reward} in your wallet.`;
      backdrop.hidden = false;
      backdrop.classList.remove("is-open", "is-closing");
      void backdrop.offsetWidth;
      backdrop.classList.add("is-open");
      modalOpenRaf = requestAnimationFrame(() => {
        modal?.focus();
        modalOpenRaf = 0;
      });
    }

    function closeClaimPopup() {
      if (!backdrop) return;
      if (backdrop.hidden && !backdrop.classList.contains("is-open")) return;
      clearTimeout(modalCloseTimer);
      if (modalOpenRaf) {
        cancelAnimationFrame(modalOpenRaf);
        modalOpenRaf = 0;
      }
      backdrop.classList.remove("is-open");
      backdrop.classList.add("is-closing");
      modalCloseTimer = window.setTimeout(() => {
        backdrop.classList.remove("is-closing");
        backdrop.hidden = true;
        modalCloseTimer = 0;
      }, motionMs(MODAL_CLOSE_MS));
    }

    claimOk?.addEventListener("click", closeClaimPopup);
    backdrop?.addEventListener("click", (e) => {
      if (e.target === backdrop) closeClaimPopup();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && backdrop && (backdrop.classList.contains("is-open") || !backdrop.hidden)) {
        closeClaimPopup();
      }
    });

    $$("[data-dci-claim]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const card = btn.closest(".mh-ex-day, .dci-day");
        if (!card || card.classList.contains("is-claimed")) return;
        const reward = card.getAttribute("data-reward") || "reward";
        card.classList.remove("is-claimable");
        card.classList.add("is-claimed");
        btn.classList.remove("mh-ex-day__btn--claim", "dci-day-btn--claim");
        btn.removeAttribute("data-dci-claim");
        btn.disabled = true;
        btn.innerHTML = claimedIcon;
        btn.setAttribute("aria-label", "Claimed");
        const status = $("#dci-status");
        if (status) status.innerHTML = 'You have accumulated <strong>Day 2</strong> check-in';
        openClaimPopup(reward);
      });
    });

    document.addEventListener("click", (e) => {
      if (e.target.closest("[data-mh-checkin-history]")) {
        e.preventDefault();
        toast("Check-in record (demo)");
      }
    });
  }

  function initLiveChat() {
    const form = $("#lc-form");
    const input = $("#lc-input");
    const messages = $("#lc-messages");

    function scrollBottom() {
      if (messages) messages.scrollTop = messages.scrollHeight;
    }

    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = input?.value.trim();
      if (!text || !messages) return;

      const now = new Date();
      const timeLabel = now
        .toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })
        .replace(",", "");

      const article = document.createElement("article");
      article.className = "mh-ex-msg mh-ex-msg--user";
      article.innerHTML =
        '<img class="mh-ex-msg__avatar" src="../assets/images/account/icon-user.svg" alt="" width="36" height="36" />' +
        '<div class="mh-ex-bubble mh-ex-bubble--user">' +
        '<div class="mh-ex-bubble__head">' +
        '<span class="mh-ex-sender">You</span>' +
        `<time class="mh-ex-time">${timeLabel}</time>` +
        "</div>" +
        '<p class="mh-ex-bubble__text"></p>' +
        "</div>";
      article.querySelector(".mh-ex-bubble__text").textContent = text;
      messages.appendChild(article);
      input.value = "";
      scrollBottom();
    });

    document.addEventListener("click", (e) => {
      if (e.target.closest(".mh-ex-composer__icon")) {
        e.preventDefault();
        toast("Attachment / voice (demo)");
      }
    });

    scrollBottom();
  }

  function init() {
    if (!requireAuth()) return;

    if (page === "referral") initReferral();
    if (page === "rebate") initRebate();
    if (page === "daily-checkin") initCheckin();
    if (page === "live-chat") initLiveChat();
    // membership uses ../js/membership.js
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
