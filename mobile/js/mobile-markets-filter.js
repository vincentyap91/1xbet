(() => {
  const ROOT_ID = "mh-mf";

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
          <img src="assets/icons/sp-back.svg" alt="" width="10" height="16" />
        </button>
        <h2 class="mh-mf__title" id="mh-mf-title">Filters</h2>
      </div>
      <div class="mh-mf__body">
        <section class="mh-mf__card">
          <button type="button" class="mh-mf__acc" data-mh-mf-acc aria-expanded="true" aria-controls="mh-mf-markets">
            <span>Markets</span>
            <img src="assets/icons/icon-chevron-down.svg" alt="" width="12" height="12" />
          </button>
          <div class="mh-mf__panel" id="mh-mf-markets">
            <label class="mh-mf__check"><input type="checkbox" name="mf_market" value="1x2" /><span class="mh-mf__box" aria-hidden="true"></span><span>1x2</span></label>
            <label class="mh-mf__check"><input type="checkbox" name="mf_market" value="double" /><span class="mh-mf__box" aria-hidden="true"></span><span>Double chance</span></label>
            <label class="mh-mf__check"><input type="checkbox" name="mf_market" value="total" /><span class="mh-mf__box" aria-hidden="true"></span><span>Total</span></label>
            <label class="mh-mf__check"><input type="checkbox" name="mf_market" value="handicap" /><span class="mh-mf__box" aria-hidden="true"></span><span>Handicap</span></label>
          </div>
        </section>
        <section class="mh-mf__card">
          <button type="button" class="mh-mf__acc" data-mh-mf-acc aria-expanded="true" aria-controls="mh-mf-period">
            <span>Show markets for period</span>
            <img src="assets/icons/icon-chevron-down.svg" alt="" width="12" height="12" />
          </button>
          <div class="mh-mf__panel" id="mh-mf-period">
            <label class="mh-mf__radio"><input type="radio" name="mf_period" value="all" checked /><span class="mh-mf__dot" aria-hidden="true"></span><span>All time</span></label>
            <label class="mh-mf__radio"><input type="radio" name="mf_period" value="hourly" /><span class="mh-mf__dot" aria-hidden="true"></span><span>Hourly</span></label>
            <label class="mh-mf__radio"><input type="radio" name="mf_period" value="date" /><span class="mh-mf__dot" aria-hidden="true"></span><span>By date</span></label>
            <label class="mh-mf__radio"><input type="radio" name="mf_period" value="event" /><span class="mh-mf__dot" aria-hidden="true"></span><span>Event display dates</span></label>
          </div>
        </section>
      </div>
      <div class="mh-mf__foot">
        <button type="button" class="mh-mf__btn mh-mf__btn--cancel" data-mh-mf-close>Cancel</button>
        <button type="button" class="mh-mf__btn mh-mf__btn--save" data-mh-mf-save>Save</button>
      </div>`;
    document.body.appendChild(root);
    return root;
  }

  function openMf() {
    const root = ensureOverlay();
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
        closeMf();
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
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
