// Default Theme
const DEFAULT_THEME = "cupcake";

// KittyChef Version
export const VERSION = "0.0.2";

// Get theme from localStorage or Default Theme
export function getTheme() {
  return localStorage.getItem("expresso-theme") || DEFAULT_THEME;
}

// Apply theme to #main element
export const applyTheme = theme => {
  localStorage.setItem("expresso-theme", theme);
  document.getElementById("expresso-main")?.setAttribute("data-theme", theme);
};
