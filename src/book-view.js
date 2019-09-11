import {
  IFrameLoader,
  Publication,
  R2ContentViewFactory as ContentViewFactory,
  Rendition,
  RenditionContext,
  ScrollMode,
  SpreadMode,
  ViewportResizer
} from "@readium/navigator-web";

export class BookView {
  constructor(viewportRoot) {
    this.viewportRoot = viewportRoot;

    this.viewportElement = document.createElement("div");
    this.viewportRoot.appendChild(this.viewportElement);

    this.viewAsVertical = false;
    this.enableScroll = false;

    this._calcViewportDimensions();
  }

  async initialize(manifestURL) {
    const publication = await Publication.fromURL(manifestURL);

    const loader = new IFrameLoader(publication.getBaseURI());
    loader.setReadiumCssBasePath(`/readium-css`);

    const rendition = await this._render(publication, loader);

    const context = new RenditionContext(rendition, loader);

    new ViewportResizer(context, () => {
      this._onViewportResize(rendition);
    });

    return context;
  }

  async _render(publication, loader) {
    const cvf = new ContentViewFactory(loader);

    const rendition = new Rendition(publication, this.viewportElement, cvf);
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

    await rendition.render();

    const scrollMode = this.enableScroll
      ? ScrollMode.Publication
      : ScrollMode.None;
    rendition.viewport.setScrollMode(scrollMode);

    return rendition;
  }

  _onViewportResize(rendition) {
    this._calcViewportDimensions();

    const viewportSize = this.viewAsVertical
      ? this.viewportHeight
      : this.viewportWidth;
    const viewportSize2nd = this.viewAsVertical
      ? this.viewportWidth
      : this.viewportHeight;

    rendition.viewport.setViewportSize(viewportSize, viewportSize2nd);
    rendition.refreshPageLayout();
  }

  _calcViewportDimensions() {
    this.viewportHeight = this.viewportRoot.clientHeight;
    this.viewportWidth = this.viewportRoot.clientWidth;
    this.pageHeight = this.viewportRoot.clientHeight;
    this.pageWidth = this.viewportRoot.clientWidth;
  }
}
