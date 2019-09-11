import { Popup } from "./popup";
import { BookView } from "./book-view";
import { BookController } from "./book-contoller";

const tocSidebar = new Popup(document.querySelector(".sidebar.toc"));
const settingsSidebar = new Popup(
  document.querySelector(".sidebar.settings")
);

const tocButton = document.querySelector(".action.toc");
const settingsButton = document.querySelector(".action.settings");
const bookmarkButton = document.querySelector(".action.bookmark");

tocButton.addEventListener("click", () => {
  tocSidebar.toggle();
});
settingsButton.addEventListener("click", () => {
  settingsSidebar.toggle();
});
bookmarkButton.addEventListener("click", () => {
  // bookmark page
});

async function bookSetup() {
  const bookView = new BookView(document.querySelector(".viewport"));

  const context = await bookView.initialize(
    new URL(
      "/publications/MarketsAndJustice/manifest.json",
      window.location
    ).toString()
  );

  const bookController = new BookController(context);

  const nextPageButton = document.querySelector(".action.flip-page.right");
  const previousPageButton = document.querySelector(".action.flip-page.left");

  nextPageButton.addEventListener("click", () => {
    // flip to next page
    bookController.nextPage();
  });
  previousPageButton.addEventListener("click", () => {
    // flip to previous page
    bookController.previousPage();
  });

  await bookController.openFirstPage();
}

bookSetup();
