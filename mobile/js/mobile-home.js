(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const STORAGE_KEY = "mh-qbs-bets";
  const SESSION_KEY = "mh-logged-in-v1";
  const header = $("#mh-header");
  const toast = $("#mh-toast");
  const menuSheet = $("#mh-menu-sheet");
  const betCount = $("#mh-bet-count");
  const qbs = $("#mh-qbs");
  const qbsRail = $("[data-mh-qbs-rail]");
  const qbsCountEls = $$("[data-mh-qbs-count]");
  const qbsCountWrap = $("[data-mh-qbs-count-wrap]");
  const qbsEmpty = $("[data-mh-qbs-empty]");
  const qbsFilled = $("[data-mh-qbs-filled]");
  const qbsOverall = $("[data-mh-qbs-overall]");
  const qbsOverallVal = $("[data-mh-qbs-overall-val]");

  let toastTimer = 0;
  let qbsCloseTimer = 0;
  let qbsOpenRaf = 0;
  /** @type {"closed"|"opening"|"open"|"closing"} */
  let qbsPhase = "closed";
  let qbsFocusRestore = null;
  let qbsScrollY = 0;
  /** @type {{ id: string, event: string, market: string, odd: number, oddLabel: string }[]} */
  let bets = [];

  const QBS_OPEN_MS = 320;
  const QBS_CLOSE_MS = 260;
  const QBS_PHASES = ["closed", "opening", "open", "closing", "is-open"];

  function isLoggedIn() {
    try {
      return localStorage.getItem(SESSION_KEY) === "1";
    } catch (_) {
      return false;
    }
  }

  function setLoggedIn(on) {
    try {
      if (on) localStorage.setItem(SESSION_KEY, "1");
      else localStorage.removeItem(SESSION_KEY);
    } catch (_) {
      /* ignore */
    }
  }

  function iconPath(name) {
    const scripts = document.querySelectorAll("script[src*='mobile-home.js']");
    const src = scripts[scripts.length - 1]?.getAttribute("src") || "js/mobile-home.js";
    const base = src.replace(/js\/mobile-home\.js.*$/, "");
    return `${base}assets/icons/${name}`;
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toast.hidden = true;
    }, 1800);
  }

  function loadBets() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  }

  function saveBets() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(bets));
    } catch (_) {
      /* ignore quota */
    }
  }

  function formatOdd(n) {
    const v = Number(n);
    if (!Number.isFinite(v)) return String(n);
    return String(Math.round(v * 1000) / 1000);
  }

  function marketFromLab(lab) {
    const t = (lab || "").trim();
    if (/^(W1|W2|X)$/i.test(t)) return `Team Wins: ${t.toUpperCase() === "X" ? "X" : t.toUpperCase()}`;
    if (/^(1X|12|2X)$/i.test(t)) return `Double Chance: ${t}`;
    if (/^T\d/i.test(t) || /total/i.test(t)) return t.replace(/^T/, "Total ");
    return t || "Selection";
  }

  function eventNameFromOddBtn(btn) {
    const matchCard = btn.closest(".mh-match-card");
    if (matchCard) {
      const teams = $$(".mh-match-card__team", matchCard).map((el) =>
        el.textContent.replace(/\s+/g, " ").trim()
      );
      if (teams.length >= 2) return `${teams[0]} - ${teams[1]}`;
      if (teams.length === 1) return teams[0];
    }

    const ntEvent = btn.closest(".mh-nt-event");
    if (ntEvent) {
      const teamsEl = $(".mh-nt-event__teams", ntEvent);
      if (teamsEl) {
        const parts = teamsEl.innerHTML
          .split(/<br\s*\/?>/i)
          .map((s) => s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim())
          .filter(Boolean);
        if (parts.length >= 2) return `${parts[0]} - ${parts[1]}`;
        return parts.join(" - ") || "Event";
      }
    }

    const spCard = btn.closest(".mh-sp-card");
    if (spCard) {
      const teams = $$(".mh-sp-card__team", spCard).map((el) =>
        el.textContent.replace(/\s+/g, " ").trim()
      );
      if (teams.length >= 2) return `${teams[0]} - ${teams[1]}`;
      if (teams.length === 1) return teams[0];
    }

    const spMatch = btn.closest(".mh-sp-match");
    if (spMatch) {
      const teams = $$(".mh-sp-match__team", spMatch).map((el) =>
        el.textContent.replace(/\s+/g, " ").trim()
      );
      if (teams.length >= 2) return `${teams[0]} - ${teams[1]}`;
      if (teams.length === 1) return teams[0];
    }

    return "Event";
  }

  function ensureOddId(btn) {
    let id = btn.getAttribute("data-mh-odd-id");
    if (id) return id;
    const lab = ($(".mh-odds__lab, .mh-nt-odd__lab", btn)?.textContent || "").trim();
    const odd = btn.getAttribute("data-odd") || "";
    const event = eventNameFromOddBtn(btn);
    id = `${event}|${lab}|${odd}`.toLowerCase().replace(/\s+/g, " ");
    btn.setAttribute("data-mh-odd-id", id);
    return id;
  }

  function syncOddButtons() {
    const ids = new Set(bets.map((b) => b.id));
    $$(".mh-odds__btn, .mh-nt-odd").forEach((btn) => {
      const id = ensureOddId(btn);
      btn.classList.toggle("is-selected", ids.has(id));
    });
  }

  function updateBadge() {
    const n = bets.length;
    if (betCount) {
      betCount.hidden = n === 0;
      betCount.textContent = String(n);
    }
    qbsCountEls.forEach((el) => {
      el.textContent = String(n);
    });
    if (qbsCountWrap) qbsCountWrap.hidden = n === 0;
  }

  function overallOdds() {
    if (!bets.length) return 0;
    return bets.reduce((acc, b) => acc * (Number(b.odd) || 1), 1);
  }

  function ensureQbsBackdrop() {
    let el = $("#mh-qbs-backdrop");
    if (el || !qbs || !qbs.parentNode) return el;
    el = document.createElement("div");
    el.id = "mh-qbs-backdrop";
    el.className = "mh-qbs-backdrop";
    el.hidden = true;
    el.setAttribute("aria-hidden", "true");
    qbs.parentNode.insertBefore(el, qbs);
    el.addEventListener("click", () => setQbsOpen(false));
    return el;
  }

  function lockSheetScroll(lock) {
    if (lock) {
      if (document.body.classList.contains("mh-sheet-scroll-lock")) return;
      qbsScrollY = window.scrollY || document.documentElement.scrollTop || 0;
      document.body.classList.add("mh-sheet-scroll-lock");
      document.body.style.top = `-${qbsScrollY}px`;
      return;
    }
    if (!document.body.classList.contains("mh-sheet-scroll-lock")) return;
    document.body.classList.remove("mh-sheet-scroll-lock");
    document.body.style.top = "";
    window.scrollTo(0, qbsScrollY);
  }

  function setQbsPhase(phase) {
    if (!qbs) return;
    qbs.classList.remove(...QBS_PHASES);
    qbs.classList.add(phase);
    if (phase === "open") qbs.classList.add("is-open");
    qbsPhase = phase;
  }

  function qbsIsOpenish() {
    return qbsPhase === "open" || qbsPhase === "opening";
  }

  function setQbsOpen(open) {
    if (!qbs) return;
    clearTimeout(qbsCloseTimer);
    if (qbsOpenRaf) {
      cancelAnimationFrame(qbsOpenRaf);
      qbsOpenRaf = 0;
    }

    const backdrop = ensureQbsBackdrop();

    if (open) {
      if (qbsPhase === "open" || qbsPhase === "opening") return;
      if (qbsPhase === "closing") return;

      qbsFocusRestore = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      qbs.hidden = false;
      if (backdrop) {
        backdrop.hidden = false;
        backdrop.classList.remove("is-hiding", "is-visible");
      }
      setQbsPhase("closed");
      void qbs.offsetWidth;
      lockSheetScroll(true);
      document.body.classList.add("mh-qbs-open");
      setQbsPhase("opening");
      if (backdrop) backdrop.classList.add("is-visible");
      qbs.setAttribute("aria-hidden", "false");

      qbsOpenRaf = requestAnimationFrame(() => {
        qbsOpenRaf = requestAnimationFrame(() => {
          if (qbsPhase !== "opening") return;
          setQbsPhase("open");
          const focusEl = qbs.querySelector("[data-mh-qbs-collapse], button, a");
          if (focusEl instanceof HTMLElement) focusEl.focus({ preventScroll: true });
          qbsOpenRaf = 0;
        });
      });
      return;
    }

    if (qbsPhase === "closed" || qbsPhase === "closing") return;

    setQbsPhase("closing");
    qbs.setAttribute("aria-hidden", "true");
    document.body.classList.remove("mh-qbs-open");
    if (backdrop) {
      backdrop.classList.remove("is-visible");
      backdrop.classList.add("is-hiding");
    }

    qbsCloseTimer = window.setTimeout(() => {
      setQbsPhase("closed");
      qbs.hidden = true;
      if (backdrop) {
        backdrop.classList.remove("is-hiding", "is-visible");
        backdrop.hidden = true;
      }
      lockSheetScroll(false);
      if (qbsFocusRestore && typeof qbsFocusRestore.focus === "function") {
        qbsFocusRestore.focus({ preventScroll: true });
      }
      qbsFocusRestore = null;
    }, QBS_CLOSE_MS);
  }

  function renderQbs(options = {}) {
    const { open = null } = options;
    updateBadge();

    const empty = bets.length === 0;
    if (qbsEmpty) qbsEmpty.hidden = !empty;
    if (qbsFilled) qbsFilled.hidden = empty;

    if (!empty && qbsRail) {
      const multi = bets.length > 1;
      qbsRail.classList.toggle("is-single", !multi);
      qbsRail.innerHTML = bets
        .map(
          (b) => `
      <article class="mh-qbs__item" data-mh-qbs-id="${b.id.replace(/"/g, "&quot;")}">
        <button type="button" class="mh-qbs__item-remove" data-mh-qbs-remove="${b.id.replace(/"/g, "&quot;")}" aria-label="Remove">
          <img src="assets/icons/icon-close.svg" alt="" width="12" height="12" />
        </button>
        <p class="mh-qbs__item-event">${escapeHtml(b.event)}</p>
        <p class="mh-qbs__item-market">${escapeHtml(b.market)}</p>
        <p class="mh-qbs__item-odd">${escapeHtml(b.oddLabel)}</p>
      </article>`
        )
        .join("");

      if (qbsOverall) qbsOverall.hidden = !multi;
      if (qbsOverallVal) qbsOverallVal.textContent = formatOdd(overallOdds());
    }

    if (open === true) setQbsOpen(true);
    else if (open === false) setQbsOpen(false);
  }
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function addBetFromBtn(btn) {
    const id = ensureOddId(btn);
    if (bets.some((b) => b.id === id)) return;
    const lab = ($(".mh-odds__lab, .mh-nt-odd__lab", btn)?.textContent || "").trim();
    const valEl = $(".mh-odds__val, .mh-nt-odd__val", btn);
    const oddRaw = btn.getAttribute("data-odd") || valEl?.textContent || "0";
    const odd = Number(oddRaw);
    bets.push({
      id,
      event: eventNameFromOddBtn(btn),
      market: marketFromLab(lab),
      odd: Number.isFinite(odd) ? odd : 0,
      oddLabel: formatOdd(oddRaw),
    });
    saveBets();
    renderQbs({ open: true });
  }

  function removeBet(id) {
    const wasOpen = qbsIsOpenish();
    bets = bets.filter((b) => b.id !== id);
    saveBets();
    syncOddButtons();
    renderQbs();
    if (!bets.length && wasOpen) setQbsOpen(false);
  }
  function toggleBetFromBtn(btn) {
    const id = ensureOddId(btn);
    if (bets.some((b) => b.id === id)) {
      removeBet(id);
    } else {
      addBetFromBtn(btn);
      syncOddButtons();
    }
  }

  function initHeaderScroll() {
    if (!header) return;
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 4);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function initQuickNav() {
    const tabs = $$("[data-mh-tab]");
    const livePanel = $('[data-mh-panel="live"]');
    const sportsPanel = $('[data-mh-panel="sports"]');

    if (livePanel) livePanel.hidden = false;
    if (sportsPanel) sportsPanel.hidden = false;

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const key = tab.getAttribute("data-mh-tab");

        if (key === "fav") {
          window.location.href = "favourites.html";
          return;
        }
        if (key === "search") {
          window.location.href = "search.html";
          return;
        }

        tabs.forEach((t) => {
          const isToggleTab = t.getAttribute("data-mh-tab") === "live" || t.getAttribute("data-mh-tab") === "sports";
          if (!isToggleTab) return;
          const on = t.getAttribute("data-mh-tab") === key;
          t.classList.toggle("is-active", on);
          t.setAttribute("aria-pressed", on ? "true" : "false");
        });

        const target = key === "sports" ? sportsPanel : livePanel;
        if (target) {
          const top = target.getBoundingClientRect().top + window.scrollY - 64;
          window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
        }
      });
    });
  }

  function initOdds() {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".mh-odds__btn, .mh-nt-odd");
      if (!btn) return;
      e.preventDefault();
      toggleBetFromBtn(btn);
    });
  }

  function initQuickBetSlip() {
    if (!qbs) return;

    bets = loadBets();
    $$(".mh-odds__btn, .mh-nt-odd").forEach((btn) => ensureOddId(btn));
    syncOddButtons();
    renderQbs({ open: false });
    setQbsPhase("closed");
    if (bets.length) setQbsOpen(true);

    qbs.addEventListener("click", (e) => {
      const removeBtn = e.target.closest("[data-mh-qbs-remove]");
      if (removeBtn) {
        e.preventDefault();
        removeBet(removeBtn.getAttribute("data-mh-qbs-remove"));
        return;
      }
      if (e.target.closest("[data-mh-qbs-collapse]")) {
        e.preventDefault();
        setQbsOpen(false);
      }
    });

    $("#mh-betslip-btn")?.addEventListener("click", () => {
      closeTabFlyout();
      if (qbsIsOpenish()) {
        setQbsOpen(false);
        return;
      }
      renderQbs();
      setQbsOpen(true);
    });
  }
  function setMenuOpen(open) {
    if (!menuSheet) return;
    menuSheet.hidden = !open;
    document.body.classList.toggle("mh-sheet-open", open);
    $("#mh-menu-btn")?.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) {
      closeTabFlyout();
      setQbsOpen(false);
    }
  }

  function initMenu() {
    $("#mh-menu-btn")?.addEventListener("click", () => setMenuOpen(true));
    $$("[data-mh-close-menu]").forEach((el) => {
      el.addEventListener("click", () => setMenuOpen(false));
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        closeTabFlyout();
        setQbsOpen(false);
      }
    });
  }

  function closeTabFlyout() {
    const backdrop = $("#mh-tab-flyout-backdrop");
    if (backdrop) backdrop.hidden = true;
    $$("[data-mh-flyout-slot]").forEach((slot) => {
      slot.classList.remove("is-open");
      const panel = slot.querySelector(".mh-tab-flyout");
      const btn = slot.querySelector("[data-mh-flyout-open]");
      if (panel) panel.hidden = true;
      if (btn) btn.setAttribute("aria-expanded", "false");
    });
  }

  function openTabFlyout(key) {
    setMenuOpen(false);
    setQbsOpen(false);
    const backdrop = $("#mh-tab-flyout-backdrop");
    if (backdrop) backdrop.hidden = false;
    $$("[data-mh-flyout-slot]").forEach((slot) => {
      const on = slot.getAttribute("data-mh-flyout-slot") === key;
      const panel = slot.querySelector(".mh-tab-flyout");
      const btn = slot.querySelector("[data-mh-flyout-open]");
      slot.classList.toggle("is-open", on);
      if (panel) panel.hidden = !on;
      if (btn) btn.setAttribute("aria-expanded", on ? "true" : "false");
    });
  }

  function initTabFlyouts() {
    $$("[data-mh-flyout-open]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.getAttribute("data-mh-flyout-open");
        const slot = btn.closest("[data-mh-flyout-slot]");
        if (!key || !slot) return;
        if (slot.classList.contains("is-open")) {
          closeTabFlyout();
          return;
        }
        openTabFlyout(key);
      });
    });

    $$("[data-mh-flyout-close]").forEach((btn) => {
      btn.addEventListener("click", () => closeTabFlyout());
    });

    $("#mh-tab-flyout-backdrop")?.addEventListener("click", () => closeTabFlyout());

    $$('[data-auth-open="login"]').forEach((btn) => {
      btn.addEventListener("click", () => closeTabFlyout(), true);
    });

    // Mobile pages: open dedicated login / register screens instead of desktop modals
    document.addEventListener(
      "click",
      (e) => {
        const login = e.target.closest('[data-auth-open="login"]');
        const reg = e.target.closest('[data-auth-open="register"]');
        if (!login && !reg) return;
        if (!document.body.classList.contains("mh-page")) return;
        e.preventDefault();
        e.stopImmediatePropagation();
        closeTabFlyout();
        window.location.href = login ? "login.html" : "register.html";
      },
      true
    );
  }

  function initAccordions() {
    $$("[data-mh-acc]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const panel = btn.nextElementSibling;
        const open = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", open ? "false" : "true");
        if (panel) panel.hidden = open;
      });
    });
  }

  function attachDragScroll(el) {
    if (!el || el.dataset.mhDragBound === "1") return;
    el.dataset.mhDragBound = "1";

    let pointerId = null;
    let startX = 0;
    let startLeft = 0;
    let moved = false;

    el.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if (el.scrollWidth <= el.clientWidth) return;
      pointerId = e.pointerId;
      startX = e.clientX;
      startLeft = el.scrollLeft;
      moved = false;
      el.classList.add("is-dragging");
      el.setPointerCapture(pointerId);
    });

    el.addEventListener("pointermove", (e) => {
      if (pointerId !== e.pointerId) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 3) moved = true;
      el.scrollLeft = startLeft - dx;
    });

    function endDrag(e) {
      if (pointerId !== e.pointerId) return;
      el.classList.remove("is-dragging");
      try {
        el.releasePointerCapture(pointerId);
      } catch (_) {
        /* already released */
      }
      pointerId = null;
    }

    el.addEventListener("pointerup", endDrag);
    el.addEventListener("pointercancel", endDrag);

    el.addEventListener(
      "click",
      (e) => {
        if (!moved) return;
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      },
      true
    );
  }

  function initHScrollHints() {
    $$("[data-mh-scroll]").forEach((el) => {
      el.addEventListener(
        "wheel",
        (e) => {
          if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && el.scrollWidth > el.clientWidth) {
            el.scrollLeft += e.deltaY;
          }
        },
        { passive: true }
      );
    });

    $$("[data-mh-drag-scroll]").forEach((el) => attachDragScroll(el));
  }

  function initToastButtons() {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-mh-toast]");
      if (!btn) return;
      const msg = btn.getAttribute("data-mh-toast");
      if (msg) showToast(msg);
    });
  }

  function initNtChips() {
    $$("[data-mh-nt-chip]").forEach((chip) => {
      chip.addEventListener("click", () => {
        $$("[data-mh-nt-chip]").forEach((c) => c.classList.remove("is-active"));
        chip.classList.add("is-active");
      });
    });
  }

  function initSpChips() {
    $$("[data-mh-sp-chip]").forEach((chip) => {
      chip.addEventListener("click", () => {
        $$("[data-mh-sp-chip]").forEach((c) => c.classList.remove("is-active"));
        chip.classList.add("is-active");
        const key = chip.getAttribute("data-mh-sp-chip");
        const blocks = $$("[data-mh-sp-league]");
        if (!blocks.length) return;
        blocks.forEach((block) => {
          const id = block.getAttribute("data-mh-sp-league");
          block.hidden = Boolean(key && key !== "all" && key !== "football" && id !== key);
        });
        if (key && key !== "all" && key !== "football") {
          showToast(`${chip.textContent.trim()} — sample events coming soon`);
        }
      });
    });
  }

  function applyLoggedInChrome() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("loggedIn") === "1") setLoggedIn(true);
    if (params.get("loggedIn") === "0") setLoggedIn(false);

    const loggedIn = isLoggedIn();
    document.body.classList.toggle("is-logged-in", loggedIn);
    if (!loggedIn) return;

    const actions = $(".mh-header__actions");
    if (actions && !actions.dataset.mhAuthReady) {
      actions.dataset.mhAuthReady = "1";
      actions.innerHTML = `
        <button type="button" class="mh-btn-deposit" data-mh-deposit>Deposit</button>
        <button type="button" class="mh-header__account" data-mh-account aria-label="Account">
          <img src="${iconPath("mh-account.svg")}" alt="" width="14" height="14" />
          <span class="mh-header__account-badge" aria-hidden="true"></span>
        </button>`;
    }

    const loginTab = $('.mh-tabbar .mh-tab[data-auth-open="login"]');
    if (loginTab && !loginTab.hasAttribute("data-mh-deposit-tab")) {
      loginTab.removeAttribute("data-auth-open");
      loginTab.setAttribute("data-mh-deposit-tab", "");
      loginTab.setAttribute("aria-label", "Deposit");
      loginTab.innerHTML = `
        <img src="${iconPath("tab-deposit.svg")}" alt="" width="20" height="20" />
        <span>Deposit</span>`;
    }

    const qbsActions = $(".mh-qbs__actions");
    if (qbsActions && !qbsActions.dataset.mhAuthSwapped) {
      qbsActions.dataset.mhAuthSwapped = "1";
      qbsActions.innerHTML = `
        <button type="button" class="mh-qbs__btn mh-qbs__btn--reg" data-mh-deposit>Deposit</button>
        <button type="button" class="mh-qbs__btn mh-qbs__btn--login" data-mh-logout>Log out</button>`;
    }

    const nav = $(".mh-sheet__nav");
    if (nav && !nav.querySelector("[data-mh-logout]")) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "mh-sheet__logout";
      btn.setAttribute("data-mh-logout", "");
      btn.textContent = "Log out";
      nav.appendChild(btn);
    }
  }

  function initSessionChrome() {
    applyLoggedInChrome();

    document.addEventListener("click", (e) => {
      const deposit = e.target.closest("[data-mh-deposit], [data-mh-deposit-tab]");
      if (deposit) {
        e.preventDefault();
        if (document.body.classList.contains("mh-page--deposit")) return;
        if (!isLoggedIn()) {
          window.location.href = "login.html";
          return;
        }
        window.location.href = "deposit.html";
        return;
      }
      const withdraw = e.target.closest("[data-mh-withdraw]");
      if (withdraw) {
        e.preventDefault();
        if (document.body.classList.contains("mh-page--withdraw")) return;
        if (!isLoggedIn()) {
          window.location.href = "login.html";
          return;
        }
        window.location.href = "withdraw.html";
        return;
      }
      const bets = e.target.closest("[data-mh-bets]");
      if (bets) {
        e.preventDefault();
        if (document.body.classList.contains("mh-page--bet-history")) return;
        if (!isLoggedIn()) {
          window.location.href = "login.html";
          return;
        }
        window.location.href = "bet-history.html";
        return;
      }
      const txHistory = e.target.closest("[data-mh-tx-history]");
      if (txHistory) {
        e.preventDefault();
        if (document.body.classList.contains("mh-page--tx-history")) return;
        if (!isLoggedIn()) {
          window.location.href = "login.html";
          return;
        }
        window.location.href = "transaction-history.html";
        return;
      }
      const promoRecord = e.target.closest("[data-mh-promo-record]");
      if (promoRecord) {
        e.preventDefault();
        if (document.body.classList.contains("mh-page--promo-record")) return;
        if (!isLoggedIn()) {
          window.location.href = "login.html";
          return;
        }
        window.location.href = "promotion-record.html";
        return;
      }
      const personal = e.target.closest("[data-mh-personal-profile]");
      if (personal) {
        e.preventDefault();
        if (document.body.classList.contains("mh-page--personal-profile")) return;
        if (!isLoggedIn()) {
          window.location.href = "login.html";
          return;
        }
        window.location.href = "personal-profile.html";
        return;
      }
      const security = e.target.closest("[data-mh-security]");
      if (security) {
        e.preventDefault();
        if (document.body.classList.contains("mh-page--security")) return;
        if (!isLoggedIn()) {
          window.location.href = "login.html";
          return;
        }
        window.location.href = "security.html";
        return;
      }
      const account = e.target.closest("[data-mh-account]");
      if (account) {
        e.preventDefault();
        if (document.body.classList.contains("mh-page--profile")) return;
        window.location.href = "profile.html";
        return;
      }
      const logout = e.target.closest("[data-mh-logout]");
      if (logout) {
        e.preventDefault();
        setLoggedIn(false);
        if (document.body.classList.contains("mh-page--profile")) {
          window.location.href = "index.html";
        } else {
          window.location.reload();
        }
      }
    });
  }

  function init() {
    initSessionChrome();
    initHeaderScroll();
    initQuickNav();
    initOdds();
    initQuickBetSlip();
    initMenu();
    initTabFlyouts();
    initAccordions();
    initHScrollHints();
    initToastButtons();
    initNtChips();
    initSpChips();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
