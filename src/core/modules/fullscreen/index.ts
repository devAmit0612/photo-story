import { getDocument } from 'ssr-window';
import { type Options } from '../../types';
import type { PhotoStoryModule } from '../..';
import { PREFIX } from '../../const';

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

const Fullscreen: PhotoStoryModule = ({ ps, moduleDefaults, on, emit }) => {
  void ps;
  void moduleDefaults;
  void on;
  void emit;

  moduleDefaults({
    fullscreen: {
      enterIcon: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M216,48V88a8,8,0,0,1-16,0V56H168a8,8,0,0,1,0-16h40A8,8,0,0,1,216,48ZM88,200H56V168a8,8,0,0,0-16,0v40a8,8,0,0,0,8,8H88a8,8,0,0,0,0-16Zm120-40a8,8,0,0,0-8,8v32H168a8,8,0,0,0,0,16h40a8,8,0,0,0,8-8V168A8,8,0,0,0,208,160ZM88,40H48a8,8,0,0,0-8,8V88a8,8,0,0,0,16,0V56H88a8,8,0,0,0,0-16Z"></path></svg>`,
      exitIcon: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M152,96V48a8,8,0,0,1,16,0V88h40a8,8,0,0,1,0,16H160A8,8,0,0,1,152,96ZM96,152H48a8,8,0,0,0,0,16H88v40a8,8,0,0,0,16,0V160A8,8,0,0,0,96,152Zm112,0H160a8,8,0,0,0-8,8v48a8,8,0,0,0,16,0V168h40a8,8,0,0,0,0-16ZM96,40a8,8,0,0,0-8,8V88H48a8,8,0,0,0,0,16H96a8,8,0,0,0,8-8V48A8,8,0,0,0,96,40Z"></path></svg>`,
    },
  });

  function init() {}

  function enterFullscreen(): void {
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

    // if (ps.tools?.fullscreen && ps.options?.fullscreen?.exitFullscreen) {
    //   ps.tools.fullscreen.innerHTML = this.options.template.exitFullscreen;
    // }
  }

  function exitFullscreen(): void {
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

    // if (ps.tools?.fullscreen && this.options?.template?.enterFullscreen) {
    //   ps.tools.fullscreen.innerHTML = this.options.template.enterFullscreen;
    // }
  }

  function fullscreen(): void {
    const document = getDocument() as FsDocument;

    // Accurately check if any fullscreen element exists across all browsers
    const isCurrentlyFullscreen = !!(
      document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement
    );

    if (isCurrentlyFullscreen) {
      ps.exitFullscreen();
    } else {
      ps.enterFullscreen();
    }
  }
};

export default Fullscreen;
