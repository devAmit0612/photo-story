import { PREFIX } from '../const';
import type { Options, GalleryItem } from '../types';

export interface ToolbarContext {
  options: Options;
  tools: Record<string, HTMLElement | HTMLAnchorElement | HTMLButtonElement | null>;
  currentIndex: number;
  events: { click: string };

  createEl(classes?: string, tag?: string): HTMLElement;
  createButton(
    html: string,
    onClick: () => void,
    ariaLabel?: string,
    className?: string,
    tag?: string
  ): HTMLElement;
  attachEvents(
    element: HTMLElement | Window | Document,
    events: string,
    handler: EventListenerOrEventListenerObject
  ): void;
  getIdName(name: string): string;

  // Actions triggered by the toolbar
  close(): void;
  fullscreen(): void;
  downloadURL(): void;
}

export default {
  toolbar(this: ToolbarContext, gallery: GalleryItem[]): HTMLElement {
    this.tools = {};
    const toolbar = this.createEl(`${PREFIX}__toolbar`);
    const optionsContainer = this.createEl(`${PREFIX}__toolbar__options`);

    // Gallery image counter (1 / 3)
    if (this.options.showCounter) {
      const html = `<span id="${this.getIdName('current_slide')}">${this.currentIndex + 1}</span><span> / ${gallery.length}</span>`;
      const counterEl = this.createEl(`${PREFIX}__counter`);
      counterEl.innerHTML = html;

      this.tools.counter = counterEl;
      toolbar.appendChild(counterEl);
    }

    // Download Button
    if (this.options.download && this.options.template?.download) {
      // Anchor tags need slightly different handling than buttons
      const dlBtn = this.createButton(
        this.options.template.download,
        () => {},
        'Download image',
        '',
        'a'
      ) as HTMLAnchorElement;
      dlBtn.download = '';

      this.tools.download = dlBtn;
      this.downloadURL();

      optionsContainer.appendChild(dlBtn);
    }

    // Close Button
    if (this.options.template?.close) {
      const closeBtn = this.createButton(
        this.options.template.close,
        () => {
          this.close();
        },
        'Close gallery'
      ) as HTMLButtonElement;

      this.tools.close = closeBtn;
      optionsContainer.appendChild(closeBtn);
    }

    // Assemble the toolbar
    toolbar.appendChild(optionsContainer);

    return toolbar;
  },
};
