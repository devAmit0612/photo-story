import { getDocument } from 'ssr-window';

import { PRELOADED_CACHE_IMAGES } from '../const';
import type { GalleryItem } from '../types';

export default {
  lazyLoad(media: HTMLImageElement, fullSrc: string, fullSrcset?: string, callback?: () => void) {
    const document = getDocument();
    let preloadImage = PRELOADED_CACHE_IMAGES.get(fullSrc);

    if (!preloadImage) {
      preloadImage = document.createElement('img') as HTMLImageElement;
      preloadImage.decoding = 'async';
      PRELOADED_CACHE_IMAGES.set(fullSrc, preloadImage);

      if (fullSrcset) preloadImage.srcset = fullSrcset;
      preloadImage.src = fullSrc;
    }

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

    if (preloadImage.complete && preloadImage.naturalWidth > 0) {
      onLoad();
    } else {
      preloadImage.addEventListener('load', onLoad, { once: true });
      preloadImage.addEventListener('error', finish, { once: true });
    }
  },

  preload(item: GalleryItem): void {
    if (!item || !item.src || PRELOADED_CACHE_IMAGES.has(item.src)) return;

    const document = getDocument();
    const img = document.createElement('img') as HTMLImageElement;
    img.decoding = 'async';
    PRELOADED_CACHE_IMAGES.set(item.src, img);

    if (item.srcset) img.srcset = item.srcset;
    img.src = item.src;
  },
};
