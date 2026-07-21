(() => {
  const SESSION_KEY = "mh-logged-in-v1";

  function setLoggedIn() {
    try {
      localStorage.setItem(SESSION_KEY, "1");
    } catch (_) {
      /* ignore */
    }
  }

  function completeLogin(message) {
    setLoggedIn();
    const toast = document.getElementById("mh-toast");
    if (toast) {
      toast.hidden = false;
      toast.textContent = message;
    }
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

  function initForms() {
    document.querySelectorAll(".mh-auth-form").forEach((form) => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const isRegister = document.body.classList.contains("mh-page--register");
        completeLogin(isRegister ? "Registration submitted (demo)" : "Logged in (demo)");
      });
    });

    document.querySelector("[data-auth-email-next]")?.addEventListener("click", () => {
      const email = document.querySelector('[data-auth-panel="email"] input[type="email"]');
      if (email && !email.value.trim()) {
        email.focus();
        return;
      }
      completeLogin("Registration submitted (demo)");
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
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
