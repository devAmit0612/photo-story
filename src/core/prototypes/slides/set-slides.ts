import { prefix } from '../../shared/utils';
import { type Options, type GalleryItem, type MediaType } from '../../types';

type SlideNodeMap = {
  slide: HTMLElement;
  media: HTMLElement;
  caption: HTMLElement | null;
};

export interface SlideContext {
  currentIndex: number;
  options: Options;
  el: HTMLElement;
  createEl(classes?: string, tag?: string): HTMLElement;
  fadeIn(el: HTMLElement, cb?: () => void, duration?: number, easing?: string): void;
  fadeOut(el: HTMLElement, cb?: () => void, duration?: number, easing?: string): void;
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

function getCaption(item: GalleryItem): string {
  return item.captions || item.title || item.alt || '';
}

function normalizeIndex(index: number, total: number): number {
  return ((index % total) + total) % total;
}

function getPreloadIndexes(
  total: number,
  currentIndex: number,
  amount: number,
  loop: boolean,
  includeCurrent: boolean = true
): number[] {
  const indexes = new Set<number>();
  const preloadCount = Math.max(0, amount);

  if (total <= 0) return [];
  if (includeCurrent) indexes.add(currentIndex);

  for (let offset = 1; offset <= preloadCount; offset += 1) {
    const nextIndex = currentIndex + offset;
    const prevIndex = currentIndex - offset;

    if (loop) {
      indexes.add(normalizeIndex(nextIndex, total));
      indexes.add(normalizeIndex(prevIndex, total));
      continue;
    }

    if (prevIndex >= 0) indexes.add(prevIndex);
    if (nextIndex < total) indexes.add(nextIndex);
  }

  return Array.from(indexes);
}

function preloadImages(
  gallery: GalleryItem[],
  currentIndex: number,
  preloadCount: number,
  loop: boolean
): void {
  const indexes = getPreloadIndexes(gallery.length, currentIndex, preloadCount, loop, false);

  indexes.forEach((index) => {
    const item = gallery[index];
    if (!item || item.type !== 'image' || !item.src) return;

    const img = new Image();
    img.decoding = 'async';
    img.src = item.src;
    if (item.srcset) img.srcset = item.srcset;
  });
}

function getEmbedURL(src: string, type?: MediaType): string {
  if (type === 'youtube') {
    const match = src.match(
      /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/)([^?&/]+)/
    );
    return match ? `https://www.youtube.com/embed/${match[1]}` : src;
  }

  if (type === 'vimeo') {
    const match = src.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    return match ? `https://player.vimeo.com/video/${match[1]}` : src;
  }

  if (type === 'dailymotion') {
    const match = src.match(/dailymotion\.com\/video\/([^?&_]+)|dai\.ly\/([^?&_]+)/);
    const id = match?.[1] || match?.[2];
    return id ? `https://www.dailymotion.com/embed/video/${id}` : src;
  }

  return src;
}

function createImageMedia(
  context: SlideContext,
  item: GalleryItem,
  shouldLoad: boolean
): HTMLImageElement {
  const img = context.createEl(`${prefix}__slide__media`, 'img') as HTMLImageElement;
  img.alt = item.alt || item.title || '';
  img.decoding = 'async';
  img.loading = shouldLoad ? 'eager' : 'lazy';
  img.dataset.src = item.src;
  if (item.srcset) img.dataset.srcset = item.srcset;
  if (item.width) img.width = Number(item.width);
  if (item.height) img.height = Number(item.height);

  if (!shouldLoad) {
    return img;
  }

  img.src = item.src;
  if (item.srcset) img.srcset = item.srcset;

  return img;
}

function createVideoMedia(context: SlideContext, item: GalleryItem): HTMLVideoElement {
  const video = context.createEl(`${prefix}__slide__media`, 'video') as HTMLVideoElement;
  video.controls = true;
  video.preload = 'metadata';
  video.src = item.src;

  if (item.width) video.width = Number(item.width);
  if (item.height) video.height = Number(item.height);

  return video;
}

function createEmbedMedia(context: SlideContext, item: GalleryItem): HTMLIFrameElement {
  const frame = context.createEl(`${prefix}__slide__media`, 'iframe') as HTMLIFrameElement;
  frame.src = getEmbedURL(item.src, item.type);
  frame.allow =
    'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  frame.allowFullscreen = true;
  frame.referrerPolicy = 'strict-origin-when-cross-origin';
  frame.title = item.title || item.alt || 'Embedded media';

  return frame;
}

function createMedia(context: SlideContext, item: GalleryItem, shouldLoad: boolean): HTMLElement {
  if (item.type === 'video') return createVideoMedia(context, item);
  if (item.type === 'youtube' || item.type === 'vimeo' || item.type === 'dailymotion') {
    return createEmbedMedia(context, item);
  }
  return createImageMedia(context, item, shouldLoad);
}

function createSlide(
  context: SlideContext,
  item: GalleryItem,
  index: number,
  preloadIndexes: Set<number>
): SlideNodeMap {
  const slide = context.createEl(`${prefix}__slide`, 'figure');
  const mediaWrap = context.createEl(`${prefix}__slide__viewport`, 'div');
  const shouldLoad = item.type !== 'image' || preloadIndexes.has(index);
  const media = createMedia(context, item, shouldLoad);

  if (index === context.currentIndex) {
    slide.dataset.active = 'true';
    media.dataset.current = 'true';
  } else {
    slide.hidden = true;
  }

  mediaWrap.appendChild(media);
  slide.appendChild(mediaWrap);

  let caption: HTMLElement | null = null;
  if (context.options.captions) {
    const captionText = getCaption(item);
    if (captionText) {
      caption = context.createEl(`${prefix}__caption`, 'figcaption');
      caption.innerHTML = escapeHTML(captionText);
      slide.appendChild(caption);
    }
  }

  return {
    slide,
    media,
    caption,
  };
}

export default function setSlides(this: SlideContext, gallery: GalleryItem[]): void {
  const psSlides = this.createEl();
  psSlides.id = `${prefix}_slides`;

  const slidesWrapper = this.createEl(`${prefix}__slides__wrapper`);
  const slides = this.createEl(`${prefix}__slides`, 'div');
  const preloadIndexes = new Set(
    getPreloadIndexes(gallery.length, this.currentIndex, this.options.preload, this.options.loop)
  );

  gallery.forEach((item, index) => {
    const slide = createSlide(this, item, index, preloadIndexes);
    slides.appendChild(slide.slide);
  });

  slidesWrapper.appendChild(slides);
  psSlides.appendChild(slidesWrapper);
  this.el.appendChild(psSlides);

  if (this.options.preload > 0) {
    preloadImages(gallery, this.currentIndex, this.options.preload, this.options.loop);
  }
}
