export class Sidebar {
  constructor(element) {
    this.element = element;
    this.hide();
  }

  show() {
    this.element.style.display = "block";
  }

  hide() {
    this.element.style.display = "none";
  }

  toggle() {
    if (this.element.style.display === "none") {
      this.element.style.display = "block";
    } else {
      this.element.style.display = "none";
    }
  }
}
