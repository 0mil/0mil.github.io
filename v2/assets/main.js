(function () {
  const root = document.body;
  const storageKey = "jin-park-v2-theme";
  const toggle = document.querySelector("[data-theme-toggle]");
  const themeIcon = document.querySelector("[data-theme-icon]");

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem(storageKey, theme);
    if (toggle) {
      const isLight = theme === "light";
      toggle.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
      if (themeIcon) {
        themeIcon.classList.toggle("fa-moon", !isLight);
        themeIcon.classList.toggle("fa-sun", isLight);
      }
    }
  }

  const savedTheme = localStorage.getItem(storageKey);
  setTheme(savedTheme || "light");

  if (toggle) {
    toggle.addEventListener("click", function () {
      const nextTheme = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      setTheme(nextTheme);
    });
  }

  const collapses = Array.prototype.slice.call(document.querySelectorAll("[data-pub-collapse]"), 0);
  collapses.forEach(function (collapseRoot) {
    const toggleButton = collapseRoot.querySelector("[data-pub-collapse-toggle]");
    const panel = collapseRoot.querySelector("[data-pub-collapse-panel]");
    if (!toggleButton || !panel) {
      return;
    }

    toggleButton.addEventListener("click", function () {
      const isOpen = collapseRoot.classList.toggle("is-open");
      panel.hidden = !isOpen;
      toggleButton.setAttribute("aria-expanded", String(isOpen));
    });
  });

  const lightbox = document.querySelector("[data-gallery-lightbox]");
  if (!lightbox) {
    return;
  }

  const dialog = lightbox.querySelector(".gallery-lightbox-dialog");
  const image = lightbox.querySelector(".gallery-lightbox-image");
  const title = lightbox.querySelector(".gallery-lightbox-title");
  const meta = lightbox.querySelector(".gallery-lightbox-meta");
  const closeButton = lightbox.querySelector(".gallery-lightbox-close");
  const triggers = Array.prototype.slice.call(document.querySelectorAll("[data-gallery-item]"), 0);
  let lastTrigger = null;

  function openLightbox(trigger) {
    lastTrigger = trigger;
    image.src = trigger.getAttribute("href");
    image.alt = trigger.dataset.title || trigger.querySelector("img")?.alt || "Artwork preview";
    title.textContent = trigger.dataset.title || "";
    meta.textContent = trigger.dataset.year || "";
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeButton.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    image.src = "";
    image.alt = "";
    document.body.style.overflow = "";
    if (lastTrigger) {
      lastTrigger.focus();
    }
  }

  triggers.forEach(function (trigger) {
    trigger.addEventListener("click", function (event) {
      event.preventDefault();
      openLightbox(trigger);
    });
  });

  closeButton.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
      closeLightbox();
    }
  });

  dialog.addEventListener("click", function (event) {
    event.stopPropagation();
  });
})();