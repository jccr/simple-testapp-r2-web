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
  constructor(element) {
    this.viewportRoot = element;
    this.props = {
      viewAsVertical: false,
      viewportHeight: 600,
      viewportWidth: 800,
      pageHeight: 600,
      pageWidth: 800,
      enableScroll: false
    };
  }

  async openPublication(webpubUrl) {
    this.publication = await Publication.fromURL(webpubUrl);

    const loader = new IFrameLoader(this.publication.getBaseURI());
    loader.setReadiumCssBasePath(`/assets/readium-css`);

    const cvf = new ContentViewFactory(loader);
    const rendition = new Rendition(this.publication, this.viewportRoot, cvf);
    rendition.setViewAsVertical(this.props.viewAsVertical);

    const viewportSize = this.props.viewAsVertical
      ? this.viewportHeight
      : this.viewportWidth;
    const viewportSize2nd = this.props.viewAsVertical
      ? this.viewportWidth
      : this.viewportHeight;

    rendition.viewport.setViewportSize(viewportSize, viewportSize2nd);
    rendition.viewport.setPrefetchSize(Math.ceil(viewportSize * 0.1));
    rendition.setPageLayout({
      spreadMode: SpreadMode.FitViewportAuto,
      pageWidth: this.props.pageWidth,
      pageHeight: this.props.pageHeight
    });

    rendition.render();

    const scrollMode = this.props.enableScroll
      ? ScrollMode.Publication
      : ScrollMode.None;
    rendition.viewport.setScrollMode(scrollMode);

    this.rendCtx = new RenditionContext(rendition, loader);
    //this.props.onRenditionCreated(this.rendCtx);

    this.resizer = new ViewportResizer(this.rendCtx, this.onViewportResize);

    await this.rendCtx.navigator.gotoBegin();
  }

  onViewportResize() {
    console.log("resized");
  }
}
