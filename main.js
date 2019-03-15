import { Sidebar } from "./ui/sidebar.js";
import { Navigator } from "./navigator.js";

const tocSidebar = new Sidebar(document.querySelector(".sidebar.toc"));
const settingsSidebar = new Sidebar(
  document.querySelector(".sidebar.settings")
);

const tocButton = document.querySelector(".action.toc");
const settingsButton = document.querySelector(".action.settings");
const bookmarkButton = document.querySelector(".action.bookmark");

tocButton.addEventListener("click", () => tocSidebar.toggle());
settingsButton.addEventListener("click", () => settingsSidebar.toggle());
bookmarkButton.addEventListener("click", () => {});

const navigator = new Navigator(document.querySelector(".viewport"));

navigator.openPublication(new URL("/assets/publications/metamorphosis/manifest.json", window.location).toString());
