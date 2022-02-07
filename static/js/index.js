//Icons
let icon_sun =
  '<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" fill="currentColor" stroke="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
let icon_moon =
  '<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';

//Button that toggles theme
let btn = document.getElementById("toggle");
// Add Icon To Button
btn.innerHTML = setIcon();

//Function to return the next theme as  string
function nextTheme() {
  switch (localStorage.theme) {
    case "dark":
      return "light";
    case "light":
      return "dark";
    default:
      return defaultTheme;
  }
}

//Return
function setIcon() {
  switch (localStorage.theme) {
    case "dark":
      return icon_moon;
    case "light":
      return icon_sun;
  }
}

//Tooggles Theme
function toggleTheme() {
  localStorage.theme = nextTheme();
  btn.innerHTML = setIcon();
  applyTheme();
}


function compact(n) {
  return n.toLocaleString("en", {
    notation: "compact",
    compactDisplay: "short",
  });
}


