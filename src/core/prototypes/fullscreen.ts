import { getDocument } from 'ssr-window';
import { type Options } from '../types';

export interface FullscreenContext {
  options: Options;
  tools: {
    fullscreen: HTMLElement;
    [key: string]: any;
  };
  enterFullscreen(): void;
  exitFullscreen(): void;
}

interface FsHTMLElement extends HTMLElement {
  mozRequestFullScreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
  webkitRequestFullscreen?: () => Promise<void>;
}

interface FsDocument extends Document {
  mozFullScreenElement?: Element;
  msFullscreenElement?: Element;
  webkitFullscreenElement?: Element;
  mozCancelFullScreen?: () => Promise<void>;
  msExitFullscreen?: () => Promise<void>;
  webkitExitFullscreen?: () => Promise<void>;
}

export default {
  enterFullscreen(this: FullscreenContext): void {
    const document = getDocument() as FsDocument;
    const docEl = document.documentElement as FsHTMLElement;

    if (!docEl) return;

    // Use standard 'requestFullscreen' first, fallback to vendor prefixes
    const requestFs =
      docEl.requestFullscreen ||
      docEl.webkitRequestFullscreen ||
      docEl.mozRequestFullScreen ||
      docEl.msRequestFullscreen;

    if (requestFs) {
      // Modern fullscreen APIs return a Promise, catching it prevents unhandled rejections
      requestFs.call(docEl).catch((err: Error) => {
        console.warn(`Error attempting to enable fullscreen: ${err.message}`);
      });
    }

    if (this.tools?.fullscreen && this.options?.template?.exitFullscreen) {
      this.tools.fullscreen.innerHTML = this.options.template.exitFullscreen;
    }
  },

  exitFullscreen(this: FullscreenContext): void {
    const document = getDocument() as FsDocument;
    const isCurrentlyFullscreen = !!(
      document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement
    );

    if (!isCurrentlyFullscreen) return;

    // Use standard 'exitFullscreen' first, fallback to vendor prefixes
    const exitFs =
      document.exitFullscreen ||
      document.webkitExitFullscreen ||
      document.mozCancelFullScreen ||
      document.msExitFullscreen;

    if (exitFs) {
      exitFs.call(document).catch((err: Error) => {
        console.warn(`Error attempting to exit fullscreen: ${err.message}`);
      });
    }

    if (this.tools?.fullscreen && this.options?.template?.enterFullscreen) {
      this.tools.fullscreen.innerHTML = this.options.template.enterFullscreen;
    }
  },

  fullscreen(this: FullscreenContext): void {
    const document = getDocument() as FsDocument;

    // Accurately check if any fullscreen element exists across all browsers
    const isCurrentlyFullscreen = !!(
      document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement
    );

    if (isCurrentlyFullscreen) {
      this.exitFullscreen();
    } else {
      this.enterFullscreen();
    }
  },
};
