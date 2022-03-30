let defaultTheme = "dark";

// Render blocking script
function applyTheme() {
  //Dark Mode
  if (localStorage.theme === "dark") {
    document.documentElement.className = "dark";
  }
  //Light Mode
  else if (localStorage.theme === "light") {
    document.documentElement.className = "light";
  }
  //First Time, Set Theme
  else {
    localStorage.theme = defaultTheme;
    applyTheme();
  }
}

applyTheme();
