/* bet-save-load.js — Save/load events expand panel + hover tip */
(function () {
  "use strict";

  function toast(msg) {
    if (typeof window.showToast === "function") {
      window.showToast(msg);
      return;
    }
    const el = document.getElementById("toast");
    if (!el) return;
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => {
      el.hidden = true;
    }, 2200);
  }

  function slipCount() {
    if (window.__betSlipCount != null) return Number(window.__betSlipCount) || 0;
    return document.querySelectorAll("#bet-list .bet-item, #bet-list .ticket-card").length;
  }

  function initBetSaveLoad() {
    const links = Array.from(document.querySelectorAll(".bet-save-link"));
    if (!links.length) return;

    links.forEach((saveLink) => {
      if (saveLink.dataset.saveLoadInit === "1") return;
      saveLink.dataset.saveLoadInit = "1";

      const block = document.createElement("div");
      block.className = "bet-save-block";
      saveLink.parentNode.insertBefore(block, saveLink);
      block.appendChild(saveLink);

      const tip = document.createElement("div");
      tip.className = "bet-save-tip";
      tip.setAttribute("role", "tooltip");
      tip.hidden = true;
      tip.textContent =
        "Load a bet slip using its code, or save it to share with your friends and win together!";
      block.insertBefore(tip, saveLink);

      const panel = document.createElement("div");
      panel.className = "bet-save-panel";
      panel.hidden = true;
      panel.innerHTML =
        '<label class="bet-save-field">' +
        '<span class="visually-hidden">Event code</span>' +
        '<input type="text" class="bet-save-input" placeholder="Event code" autocomplete="off" spellcheck="false" />' +
        "</label>" +
        '<div class="bet-save-actions">' +
        '<button type="button" class="bet-save-btn bet-save-btn--save">Save</button>' +
        '<button type="button" class="bet-save-btn bet-save-btn--load" disabled>Load</button>' +
        "</div>";
      block.appendChild(panel);

      const input = panel.querySelector(".bet-save-input");
      const loadBtn = panel.querySelector(".bet-save-btn--load");
      const saveBtn = panel.querySelector(".bet-save-btn--save");

      function setOpen(open) {
        block.classList.toggle("is-open", open);
        panel.hidden = !open;
        saveLink.setAttribute("aria-expanded", open ? "true" : "false");
        if (open) {
          tip.hidden = true;
          block.classList.remove("is-tip-visible");
          requestAnimationFrame(function () {
            input && input.focus();
          });
        }
      }

      function syncLoadEnabled() {
        const hasCode = Boolean((input && input.value ? input.value : "").trim());
        if (loadBtn) loadBtn.disabled = !hasCode;
      }

      saveLink.setAttribute("aria-expanded", "false");

      saveLink.addEventListener("mouseenter", function () {
        if (block.classList.contains("is-open")) return;
        tip.hidden = false;
        block.classList.add("is-tip-visible");
      });
      saveLink.addEventListener("mouseleave", function () {
        tip.hidden = true;
        block.classList.remove("is-tip-visible");
      });
      saveLink.addEventListener("focus", function () {
        if (block.classList.contains("is-open")) return;
        tip.hidden = false;
        block.classList.add("is-tip-visible");
      });
      saveLink.addEventListener("blur", function () {
        tip.hidden = true;
        block.classList.remove("is-tip-visible");
      });

      saveLink.addEventListener(
        "click",
        function (e) {
          e.preventDefault();
          e.stopImmediatePropagation();
          setOpen(!block.classList.contains("is-open"));
        },
        true
      );

      if (input) input.addEventListener("input", syncLoadEnabled);

      if (saveBtn) {
        saveBtn.addEventListener("click", function () {
          if (!slipCount()) {
            toast("Add events to the bet slip before saving");
            return;
          }
          const code = "XB" + String(Date.now()).slice(-8);
          if (input) {
            input.value = code;
            syncLoadEnabled();
          }
          toast("Bet slip code: " + code);
        });
      }

      if (loadBtn) {
        loadBtn.addEventListener("click", function () {
          const code = (input && input.value ? input.value : "").trim();
          if (!code) return;
          toast('Loaded code "' + code + '" — demo only');
        });
      }
    });

    if (!document.documentElement.dataset.betSaveLoadDocClick) {
      document.documentElement.dataset.betSaveLoadDocClick = "1";
      document.addEventListener("click", function (e) {
        Array.from(document.querySelectorAll(".bet-save-block.is-open")).forEach(function (block) {
          if (block.contains(e.target)) return;
          block.classList.remove("is-open");
          const panel = block.querySelector(".bet-save-panel");
          const link = block.querySelector(".bet-save-link");
          if (panel) panel.hidden = true;
          if (link) link.setAttribute("aria-expanded", "false");
        });
      });
    }
  }

  window.BetSaveLoad = { init: initBetSaveLoad };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBetSaveLoad);
  } else {
    initBetSaveLoad();
  }
})();
