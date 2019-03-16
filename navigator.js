import {
  IFrameLoader,
  Publication,
  R2ContentViewFactory as ContentViewFactory,
  Rendition,
  RenditionContext,
  ScrollMode,
  SpreadMode,
  ViewportResizer
} from "./node_modules/@readium/navigator-web/dist/readium-navigator-web.esm.js";

export class Navigator {
  constructor(viewportRoot) {
    this.viewportRoot = viewportRoot;

    this.viewportElement = document.createElement('div');
    this.viewportRoot.appendChild(this.viewportElement)

    this.viewAsVertical = false;
    this.enableScroll = false;

    this._calcViewportDimensions();
  }

  _calcViewportDimensions() {
    this.viewportHeight = this.viewportRoot.clientHeight;
    this.viewportWidth = this.viewportRoot.clientWidth;
    this.pageHeight = this.viewportRoot.clientHeight;
    this.pageWidth = this.viewportRoot.clientWidth;
  }

  async openPublication(webpubUrl) {
    this.publication = await Publication.fromURL(webpubUrl);

    const loader = new IFrameLoader(this.publication.getBaseURI());
    loader.setReadiumCssBasePath(`/assets/readium-css`);

    const cvf = new ContentViewFactory(loader);

    const rendition = new Rendition(this.publication, this.viewportElement, cvf);
    rendition.setViewAsVertical(this.viewAsVertical);

    const viewportSize = this.viewAsVertical
      ? this.viewportHeight
      : this.viewportWidth;
    const viewportSize2nd = this.viewAsVertical
      ? this.viewportWidth
      : this.viewportHeight;

    rendition.viewport.setViewportSize(viewportSize, viewportSize2nd);
    rendition.viewport.setPrefetchSize(Math.ceil(viewportSize * 0.1));
    rendition.setPageLayout({
      spreadMode: SpreadMode.FitViewportAuto,
      pageWidth: this.pageWidth,
      pageHeight: this.pageHeight
    });

    rendition.render();

    const scrollMode = this.enableScroll
      ? ScrollMode.Publication
      : ScrollMode.None;
    rendition.viewport.setScrollMode(scrollMode);

    this.rendCtx = new RenditionContext(rendition, loader);

    this.navigator = this.rendCtx.navigator;
    this.rendition = rendition;
    //this.props.onRenditionCreated(this.rendCtx);

    this.resizer = new ViewportResizer(this.rendCtx, () => {
      this.onViewportResize();
    });

    await this.navigator.gotoBegin();
  }

  onViewportResize() {
    this._calcViewportDimensions();

    const viewportSize = this.viewAsVertical
      ? this.viewportHeight
      : this.viewportWidth;
    const viewportSize2nd = this.viewAsVertical
      ? this.viewportWidth
      : this.viewportHeight;

    this.rendition.viewport.setViewportSize(viewportSize, viewportSize2nd);
    this.rendition.refreshPageLayout();
  }

  async nextScreen() {
    return this.navigator.nextScreen();
  }

  async previousScreen() {
    return this.navigator.previousScreen();
  }
}
