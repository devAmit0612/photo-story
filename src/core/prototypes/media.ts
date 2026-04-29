import { getDocument, getWindow } from 'ssr-window';

import { PREFIX } from '../const';
import type { GalleryItem, Options } from '../types';

export interface MediaContext {
  options: Options;
  currentMediaEl: HTMLElement | null;
  createEl(classes?: string, tag?: string): HTMLElement;
  placeholder(imgEl: HTMLImageElement, item: GalleryItem): void;
  lazyLoad(
    media: HTMLImageElement,
    fullSrc: string,
    fullSrcset?: string,
    callback?: () => void
  ): void;
}

function escapeHTML(value?: string): string {
  if (!value) return '';

  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export default {
  media(this: MediaContext, slideEl: HTMLElement, item: GalleryItem, isCurrent: boolean): void {
    if (isCurrent) {
      slideEl.setAttribute('aria-hidden', 'false');
    }

    const mediaViewport = this.createEl(`${PREFIX}__slide__viewport`);
    slideEl.innerHTML = '';

    if (!item.type || item.type === 'image') {
      const imgEl = this.createEl(`${PREFIX}__slide__media`, 'img') as HTMLImageElement;
      imgEl.alt = item.alt || item.title || '';
      imgEl.decoding = 'async';
      imgEl.loading = 'eager';

      if (item.width) imgEl.width = Number(item.width);
      if (item.height) imgEl.height = Number(item.height);

      if (item.thumb && item.thumb !== item.src) {
        imgEl.src = item.thumb;
        this.lazyLoad(imgEl, item.src, item.srcset);
      } else {
        // No thumbnail or they are the same? Just load high-res directly
        if (item.src) imgEl.src = item.src;
        if (item.srcset) imgEl.srcset = item.srcset;
      }

      this.placeholder(imgEl, item);
      mediaViewport.appendChild(imgEl);
      slideEl.appendChild(mediaViewport);

      // Store the active media element for the Zoom/Drag modules!
      if (isCurrent) {
        this.currentMediaEl = imgEl;
      }
    }

    if (this.options.captions) {
      const captionText = item.captions || item.title || item.alt || '';
      if (captionText) {
        const caption = this.createEl(`${PREFIX}__slide__caption`);
        caption.innerHTML = escapeHTML(captionText);
        slideEl.appendChild(caption);
      }
    }
  },

  lazyLoad(media: HTMLImageElement, fullSrc: string, fullSrcset?: string, callback?: () => void) {
    const document = getDocument();
    const preloadImage = document.createElement('img') as HTMLImageElement;
    preloadImage.decoding = 'async';

    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;

      if (media.isConnected) {
        if (fullSrcset) {
          media.srcset = fullSrcset;
        } else {
          media.removeAttribute('srcset');
        }
        media.src = fullSrc;
      }

      if (callback) callback();
    };

    const onLoad = () => {
      if (typeof preloadImage.decode === 'function') {
        preloadImage
          .decode()
          .catch(() => undefined)
          .finally(finish);
        return;
      }
      finish();
    };

    preloadImage.addEventListener('load', onLoad, { once: true });
    preloadImage.addEventListener('error', finish, { once: true });

    if (fullSrcset) preloadImage.srcset = fullSrcset;
    preloadImage.src = fullSrc;

    // Trigger instantly if already cached
    if (preloadImage.complete && preloadImage.naturalWidth > 0) {
      onLoad();
    }
  },

  placeholder(imgEl: HTMLImageElement, item: GalleryItem): void {
    const width = Number(item.width);
    const height = Number(item.height);

    if (!width || !height) {
      return;
    }

    const window = getWindow();
    const document = getDocument();

    let rootFontSize = 16;
    if (typeof window.getComputedStyle === 'function' && document.documentElement) {
      rootFontSize = Number.parseFloat(
        window.getComputedStyle(document.documentElement).fontSize || '16'
      );
    }

    // Fallback values if clientWidth/innerHeight aren't available during SSR
    const clientWidth = document.documentElement?.clientWidth || 1024;
    const innerHeight = window.innerHeight || 768;

    const maxWidth = Math.min(Math.max(clientWidth - 32, 0), 72 * rootFontSize);
    const maxHeight = Math.max(innerHeight - 128, 0);
    const scale = Math.min(maxWidth / width, maxHeight / height, 1);

    imgEl.style.width = `${width * scale}px`;
    imgEl.style.height = `${height * scale}px`;
  },
};
