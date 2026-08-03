(() => {
  const ROOT_ID = "mh-mf";

  /** Capture while script is evaluating (currentScript is null after DOMContentLoaded). */
  const SCRIPT_EL =
    document.currentScript ||
    document.querySelector('script[src*="mobile-markets-filter.js"]');

  /** Asset base: works from mobile/*.html and desktop pages that load this script */
  function assetBase() {
    if (!SCRIPT_EL || !SCRIPT_EL.src) return "assets/";
    try {
      const url = new URL(SCRIPT_EL.src, window.location.href);
      // .../mobile/js/mobile-markets-filter.js → .../mobile/assets/
      return new URL("../assets/", url).href;
    } catch (_) {
      return "assets/";
    }
  }

  function icon(name) {
    return `${assetBase()}icons/${name}`;
  }

  function isLiveVariant() {
    return (
      document.body?.dataset?.page === "live-national-team" ||
      document.body?.dataset?.page === "live" ||
      !!document.querySelector('[data-mh-mf-variant="live"]')
    );
  }

  function bodyHtml() {
    const markets = `
        <section class="mh-mf__card">
          <button type="button" class="mh-mf__acc" data-mh-mf-acc aria-expanded="true" aria-controls="mh-mf-markets">
            <span>Markets</span>
            <img src="${icon("icon-chevron-down.svg")}" alt="" width="12" height="12" />
          </button>
          <div class="mh-mf__panel" id="mh-mf-markets">
            <label class="mh-mf__check"><input type="checkbox" name="mf_market" value="1x2" /><span class="mh-mf__box" aria-hidden="true"></span><span>1x2</span></label>
            <label class="mh-mf__check"><input type="checkbox" name="mf_market" value="double" /><span class="mh-mf__box" aria-hidden="true"></span><span>Double chance</span></label>
            <label class="mh-mf__check"><input type="checkbox" name="mf_market" value="total" /><span class="mh-mf__box" aria-hidden="true"></span><span>Total</span></label>
            <label class="mh-mf__check"><input type="checkbox" name="mf_market" value="handicap" /><span class="mh-mf__box" aria-hidden="true"></span><span>Handicap</span></label>
          </div>
        </section>`;

    if (isLiveVariant()) {
      return `
        <section class="mh-mf__card mh-mf__card--stream">
          <div class="mh-mf__stream">
            <div class="mh-mf__stream-copy">
              <strong>Only matches with a live stream</strong>
              <span>Only show events that are being streamed live</span>
            </div>
            <label class="mh-mf__switch">
              <input type="checkbox" id="mh-mf-stream" name="mf_stream" />
              <span class="mh-mf__switch-ui" aria-hidden="true"></span>
              <span class="visually-hidden">Only matches with a live stream</span>
            </label>
          </div>
        </section>
        ${markets}`;
    }

    return `
        ${markets}
        <section class="mh-mf__card">
          <button type="button" class="mh-mf__acc" data-mh-mf-acc aria-expanded="true" aria-controls="mh-mf-period">
            <span>Show markets for period</span>
            <img src="${icon("icon-chevron-down.svg")}" alt="" width="12" height="12" />
          </button>
          <div class="mh-mf__panel" id="mh-mf-period">
            <label class="mh-mf__radio"><input type="radio" name="mf_period" value="all" checked /><span class="mh-mf__dot" aria-hidden="true"></span><span>All time</span></label>
            <label class="mh-mf__radio"><input type="radio" name="mf_period" value="hourly" /><span class="mh-mf__dot" aria-hidden="true"></span><span>Hourly</span></label>
            <label class="mh-mf__radio"><input type="radio" name="mf_period" value="date" /><span class="mh-mf__dot" aria-hidden="true"></span><span>By date</span></label>
            <label class="mh-mf__radio"><input type="radio" name="mf_period" value="event" /><span class="mh-mf__dot" aria-hidden="true"></span><span>Event display dates</span></label>
          </div>
        </section>`;
  }

  function ensureOverlay() {
    let root = document.getElementById(ROOT_ID);
    if (root) return root;

    root = document.createElement("div");
    root.id = ROOT_ID;
    root.className = "mh-mf";
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");
    root.setAttribute("aria-labelledby", "mh-mf-title");
    root.hidden = true;
    root.innerHTML = `
      <div class="mh-mf__head">
        <button type="button" class="mh-mf__back" data-mh-mf-close aria-label="Back">
          <img src="${icon("sp-back.svg")}" alt="" width="10" height="16" />
        </button>
        <h2 class="mh-mf__title" id="mh-mf-title">Filters</h2>
      </div>
      <div class="mh-mf__body">${bodyHtml()}</div>
      <div class="mh-mf__foot">
        <button type="button" class="mh-mf__btn mh-mf__btn--cancel" data-mh-mf-close>Cancel</button>
        <button type="button" class="mh-mf__btn mh-mf__btn--save" data-mh-mf-save>Save</button>
      </div>`;
    document.body.appendChild(root);
    return root;
  }

  function syncStreamToggle() {
    const input = document.getElementById("mh-mf-stream");
    if (!input) return;
    const desk = document.getElementById("live-stream-toggle");
    if (desk) input.checked = !!desk.checked;
    else if (typeof window.__ntStreamOnly === "boolean") input.checked = window.__ntStreamOnly;
  }

  function openMf() {
    const root = ensureOverlay();
    syncStreamToggle();
    root.hidden = false;
    requestAnimationFrame(() => root.classList.add("is-open"));
    document.body.classList.add("mh-mf-open");
  }

  function closeMf() {
    const root = document.getElementById(ROOT_ID);
    if (!root) return;
    root.classList.remove("is-open");
    document.body.classList.remove("mh-mf-open");
    window.setTimeout(() => {
      if (!root.classList.contains("is-open")) root.hidden = true;
    }, 240);
  }

  function applySave() {
    const stream = document.getElementById("mh-mf-stream");
    if (stream) {
      const on = !!stream.checked;
      window.__ntStreamOnly = on;
      const desk = document.getElementById("live-stream-toggle");
      if (desk) {
        desk.checked = on;
        desk.dispatchEvent(new Event("change", { bubbles: true }));
      } else if (typeof window.applyNtStreamFilter === "function") {
        window.applyNtStreamFilter(on);
      }
    }
    if (typeof window.showToast === "function") window.showToast("Filters saved");
    closeMf();
  }

  function init() {
    const openers = document.querySelectorAll("[data-mh-mf-open]");
    if (!openers.length) return;

    ensureOverlay();

    openers.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        openMf();
      });
    });

    document.addEventListener("click", (e) => {
      const closeBtn = e.target.closest("[data-mh-mf-close]");
      if (closeBtn) {
        e.preventDefault();
        closeMf();
        return;
      }
      const saveBtn = e.target.closest("[data-mh-mf-save]");
      if (saveBtn) {
        e.preventDefault();
        applySave();
        return;
      }
      const acc = e.target.closest("[data-mh-mf-acc]");
      if (acc) {
        const id = acc.getAttribute("aria-controls");
        const panel = id ? document.getElementById(id) : null;
        const open = acc.getAttribute("aria-expanded") !== "true";
        acc.setAttribute("aria-expanded", open ? "true" : "false");
        if (panel) panel.hidden = !open;
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && document.body.classList.contains("mh-mf-open")) {
        closeMf();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
