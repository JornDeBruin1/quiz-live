const STORAGE_KEY = "pubquiz-theme";

function systemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

// Opgeslagen keuze, anders de instelling van het systeem
export function getInitialTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    // localStorage kan geblokkeerd zijn (bijv. privémodus): dan volgen we het systeem
  }
  return systemTheme();
}

export function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
}

export function saveTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // niet opslaan is geen ramp, de keuze geldt dan alleen tot de pagina sluit
  }
}