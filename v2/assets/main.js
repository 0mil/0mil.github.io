(function () {
  const root = document.body;
  const storageKey = "jin-park-v2-theme";
  const toggle = document.querySelector("[data-theme-toggle]");

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem(storageKey, theme);
    if (toggle) {
      toggle.textContent = theme === "light" ? "Moon" : "Sun";
      toggle.setAttribute("aria-label", theme === "light" ? "Switch to dark theme" : "Switch to light theme");
    }
  }

  const savedTheme = localStorage.getItem(storageKey);
  setTheme(savedTheme || "dark");

  if (toggle) {
    toggle.addEventListener("click", function () {
      const nextTheme = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      setTheme(nextTheme);
    });
  }
})();
