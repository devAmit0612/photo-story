import { getDocument, getWindow } from 'ssr-window';

import { MEDIA } from '../const';
import type { Gallery, GalleryItem, MediaType, Options } from '../types';

type CurrentObjectTypes = {
  index: number;
  id?: string;
};

type JQueryElementTypes = {
  jquery: string;
  [index: number]: HTMLElement;
};

let isPassiveSupported: boolean | null = null;

export function prefersReducedMotion(): boolean {
  const window = getWindow();

  if (typeof window.matchMedia !== 'function') {
    return false;
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function checkPassiveListener(): boolean {
  if (isPassiveSupported !== null) return isPassiveSupported;

  const window = getWindow();
  if (!window.addEventListener || !window.removeEventListener) {
    return (isPassiveSupported = false);
  }

  let supportsPassive = false;
  try {
    const opts = Object.defineProperty({}, 'passive', {
      get: function () {
        supportsPassive = true;
      },
    });
    window.addEventListener('testPassive', null as any, opts);
    window.removeEventListener('testPassive', null as any, opts);
  } catch (e) {}

  return (isPassiveSupported = supportsPassive);
}

export function deleteProps(obj: Record<string, unknown>): void {
  Object.keys(obj).forEach((key) => {
    try {
      obj[key] = null;
    } catch (e) {}
    try {
      delete obj[key];
    } catch (e) {}
  });
}

export function extend<T extends Record<string, any>>(...args: Partial<T>[]): T {
  const target = {} as Record<string, any>;

  args.forEach((source) => {
    if (!isObject(source)) {
      return;
    }

    Object.keys(source).forEach((key) => {
      const value = source[key];

      if (Array.isArray(value)) {
        target[key] = value.slice();
        return;
      }

      if (isObject(value)) {
        const base = isObject(target[key]) ? target[key] : {};
        target[key] = extend(base, value);
        return;
      }

      target[key] = value;
    });
  });

  return target as T;
}

export function getCurrentObj(
  list: Map<string, HTMLElement[]> | null | undefined,
  el: HTMLElement
): CurrentObjectTypes {
  const currentObj: CurrentObjectTypes = { index: 0 };

  if (list && list.size > 0) {
    Array.from(list.entries()).forEach(([key, values]) => {
      const index = values.indexOf(el);
      if (index > -1) {
        currentObj.index = index;
        currentObj.id = key;
      }
    });
  } else {
    const rel = el.getAttribute('rel');
    if (rel) {
      currentObj.id = rel;
    } else if (el.dataset.galleryId) {
      currentObj.id = el.dataset.galleryId;
    }
  }

  return currentObj;
}

export function getFileType(value: string | null): MediaType | undefined {
  if (!value) return undefined;

  const imgReg = /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i;
  const videoReg = /\.(mp4|mkv|wmv|m4v|mov|avi|flv|webm|flac|mka|m4a|aac|ogg)$/i;

  if (imgReg.test(value)) return MEDIA[0]; // image
  if (videoReg.test(value)) return MEDIA[1]; // video
  if (value.includes('youtu')) return MEDIA[2]; // youtube
  if (value.includes('vimeo')) return MEDIA[3]; // vimeo
  if (value.includes('dailymotion')) return MEDIA[4]; // dailymotion

  return undefined;
}

export function getElement(
  obj: string | HTMLElement | JQueryElementTypes | unknown
): HTMLElement | NodeListOf<HTMLElement> | null {
  if (isElement(obj)) {
    return (obj as JQueryElementTypes).jquery
      ? (obj as JQueryElementTypes)[0]
      : (obj as HTMLElement);
  }
  if (typeof obj === 'string' && obj.trim().length > 0) {
    const document = getDocument();
    return document.querySelectorAll<HTMLElement>(obj);
  }
  return null;
}

export function getGallery(group: Map<string, HTMLElement[]>): Gallery {
  const gallery: Gallery = {};
  group.forEach((values, key) => {
    const item: GalleryItem[] = [];

    values.forEach((val) => {
      const innerImg = val.querySelector('img');
      const o: GalleryItem = {
        src: val.getAttribute('href') || '',
        srcset: val.dataset.psSrcset || undefined,
        width: val.dataset.psWidth || innerImg?.getAttribute('width') || undefined,
        height: val.dataset.psHeight || innerImg?.getAttribute('height') || undefined,
        alt: innerImg?.getAttribute('alt') || val.getAttribute('title') || undefined,
        type: getFileType(val.getAttribute('href')) || undefined,
        thumb: getThumb(val) || undefined,
        title: getTitle(val) || undefined,
        captions: val.dataset.psCaptions,
        targetEl: innerImg || undefined,
      };
      item.push(o);
    });

    gallery[key] = item;
  });

  return gallery;
}

export function getGalleryGroup(
  elList: HTMLElement[] | NodeListOf<HTMLElement>
): Map<string, HTMLElement[]> {
  const listArray = Array.from(elList);

  return groupBy(listArray, (element) => {
    const rel = element.getAttribute('rel');
    if (rel && rel !== 'nofollow') {
      return rel;
    }
    return getRel(element);
  });
}

export function getGalleryType(obj: Gallery): Gallery {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const gallery = obj[key];
      gallery.forEach((gal) => {
        gal.type = getFileType(gal.src);
        if (!gal.thumb) {
          gal.thumb = gal.src;
        }
      });
    }
  }
  return obj;
}

export function getIndex(options: Options, index: number, total: number): number | null {
  if (index >= 0 && index < total) {
    return index; // Normal bounds
  }
  if (options.loop) {
    // Safely wrap around negative and out-of-bound indexes
    return ((index % total) + total) % total;
  }
  return null; // Out of bounds and loop is disabled
}

// Internal Helper Methods
function getRel(el: HTMLElement): string {
  const rel = el.getAttribute('rel');
  if (rel && rel !== 'nofollow') {
    return rel;
  }
  return 'gallery';
}

function getThumb(el: HTMLElement): string | null {
  const imgCollection = el.getElementsByTagName('img');
  const img = isCollection(imgCollection);

  if (img) {
    return img.getAttribute('src');
  } else if (typeof el.dataset.psThumb !== 'undefined') {
    return el.dataset.psThumb || null;
  } else {
    return el.getAttribute('href');
  }
}

function getTitle(el: HTMLElement): string | null {
  const title = el.getAttribute('title');
  if (title) {
    return title;
  } else if (typeof el.dataset.psTitle !== 'undefined') {
    return el.dataset.psTitle || null;
  }
  return null;
}

function groupBy<T, K>(list: T[], keyGetter: (item: T) => K): Map<K, T[]> {
  const map = new Map<K, T[]>();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}

export function isElement(obj: unknown): obj is HTMLElement | JQueryElementTypes {
  if (!obj || typeof obj !== 'object') {
    return false;
  }
  if (typeof (obj as JQueryElementTypes).jquery !== 'undefined') {
    return true;
  }
  return typeof (obj as HTMLElement).nodeType !== 'undefined';
}

export function isNodeList(obj: unknown): obj is NodeListOf<HTMLElement> {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  return (
    typeof (obj as NodeListOf<HTMLElement>).length === 'number' &&
    typeof (obj as NodeListOf<HTMLElement>).item === 'function'
  );
}

export function isObject(obj: unknown): obj is Record<string, unknown> {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    obj.constructor !== undefined &&
    Object.prototype.toString.call(obj).slice(8, -1) === 'Object'
  );
}

function isCollection(collection: unknown): HTMLElement | undefined {
  if (
    typeof HTMLCollection !== 'undefined' &&
    collection instanceof HTMLCollection &&
    collection.length > 0
  ) {
    return collection[0] as HTMLElement;
  }
  return undefined;
}
