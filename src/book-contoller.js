export class BookController {
  constructor(context) {
    // Models
    this.navigator = context.navigator;
    this.rendition = context.rendition;
  }

  async openFirstPage() {
    return this.navigator.gotoBegin();
  }

  async nextPage() {
    return this.navigator.nextScreen();
  }

  async previousPage() {
    return this.navigator.previousScreen();
  }

  async setFontSize(value) {
    return this.rendition.updateViewSettings({
      name: "font-size",
      value: value
    });
  }

  addLocationChangedListener(callback) {
    this.rendition.viewport.addLocationChangedListener(async () => {
      const location = await this.navigator.getCurrentLocationAsync();
      callback(location.href);
    });
  }
}
