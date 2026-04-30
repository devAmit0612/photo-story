import { getDocument } from 'ssr-window';

import { PREFIX } from '../../const';
import type { PhotoStoryModule } from '../..';
import type { FullscreenOptions } from '../../types';

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

const Fullscreen: PhotoStoryModule = ({ ps, moduleDefaults, on }) => {
  moduleDefaults({
    fullscreen: {
      enabled: true,
      enterIcon: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M216,48V88a8,8,0,0,1-16,0V56H168a8,8,0,0,1,0-16h40A8,8,0,0,1,216,48ZM88,200H56V168a8,8,0,0,0-16,0v40a8,8,0,0,0,8,8H88a8,8,0,0,0,0-16Zm120-40a8,8,0,0,0-8,8v32H168a8,8,0,0,0,0,16h40a8,8,0,0,0,8-8V168A8,8,0,0,0,208,160ZM88,40H48a8,8,0,0,0-8,8V88a8,8,0,0,0,16,0V56H88a8,8,0,0,0,0-16Z"></path></svg>`,
      exitIcon: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M152,96V48a8,8,0,0,1,16,0V88h40a8,8,0,0,1,0,16H160A8,8,0,0,1,152,96ZM96,152H48a8,8,0,0,0,0,16H88v40a8,8,0,0,0,16,0V160A8,8,0,0,0,96,152Zm112,0H160a8,8,0,0,0-8,8v48a8,8,0,0,0,16,0V168h40a8,8,0,0,0,0-16ZM96,40a8,8,0,0,0-8,8V88H48a8,8,0,0,0,0,16H96a8,8,0,0,0,8-8V48A8,8,0,0,0,96,40Z"></path></svg>`,
    },
  });

  function isFullscreen(): boolean {
    const document = getDocument() as FsDocument;
    return !!(
      document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement
    );
  }

  // Centralized UI updater that reacts to the browser's actual state
  function updateIcon() {
    if (!ps.tools?.fullscreen || typeof ps.options.fullscreen === 'boolean') return;

    const fsOptions = ps.options.fullscreen as FullscreenOptions;
    ps.tools.fullscreen.innerHTML = isFullscreen()
      ? (fsOptions.exitIcon as string)
      : (fsOptions.enterIcon as string);
  }

  function init() {
    const fsOptions = ps.options.fullscreen as FullscreenOptions;

    // Create fullscreen button
    const fsBtn = ps.createButton(
      fsOptions.enterIcon as string,
      () => toggle(),
      'Toggle Fullscreen'
    ) as HTMLButtonElement;

    ps.tools.fullscreen = fsBtn;
    const optionsContainer = ps.toolbarEl?.querySelector(
      `.${PREFIX}__toolbar__options`
    ) as HTMLElement;

    if (optionsContainer) {
      optionsContainer.prepend(fsBtn);
    }

    // Listen to browser-level fullscreen changes (handles 'Esc' key)
    const document = getDocument();
    ps.attachEvents(
      document,
      'fullscreenchange webkitfullscreenchange mozfullscreenchange MSFullscreenChange',
      updateIcon
    );
  }

  function enter(): void {
    const document = getDocument() as FsDocument;
    const docEl = document.documentElement as FsHTMLElement;

    if (!docEl) return;

    const requestFs =
      docEl.requestFullscreen ||
      docEl.webkitRequestFullscreen ||
      docEl.mozRequestFullScreen ||
      docEl.msRequestFullscreen;

    if (requestFs) {
      requestFs.call(docEl).catch((err: Error) => {
        console.warn(`PhotoStory: Error attempting to enable fullscreen: ${err.message}`);
      });
    }
  }

  function exit(): void {
    const document = getDocument() as FsDocument;

    if (!isFullscreen()) return;

    const exitFs =
      document.exitFullscreen ||
      document.webkitExitFullscreen ||
      document.mozCancelFullScreen ||
      document.msExitFullscreen;

    if (exitFs) {
      exitFs.call(document).catch((err: Error) => {
        console.warn(`PhotoStory: Error attempting to exit fullscreen: ${err.message}`);
      });
    }
  }

  function toggle(): void {
    if (isFullscreen()) {
      exit();
    } else {
      enter();
    }
  }

  // Life cycle hooks
  on('init', () => {
    const enabled =
      (typeof ps.options.fullscreen === 'object' && ps.options.fullscreen.enabled) ||
      ps.options.fullscreen;

    if (!enabled) return;
    init();
  });

  on('close', () => {
    const enabled =
      (typeof ps.options.fullscreen === 'object' && ps.options.fullscreen.enabled) ||
      ps.options.fullscreen;

    if (!enabled) return;
    exit();

    // Prevent memory leaks by removing the event listeners when lightbox closes
    const document = getDocument();
    ps.detachEvents(
      document,
      'fullscreenchange webkitfullscreenchange mozfullscreenchange MSFullscreenChange'
    );
  });
};

export default Fullscreen;
