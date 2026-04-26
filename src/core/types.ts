export const mediaNames = ['image', 'video', 'youtube', 'vimeo', 'dailymotion'] as const;

export type EffectTypes = 'default' | 'Slide' | 'fade' | 'scale';
export type RevealTypes = 'default' | 'fade' | 'zoom';

export type MediaType = (typeof mediaNames)[number];

export type FadeCallback = () => void;

export type Gallery = Record<string, GalleryItem[]>;

export interface GalleryItem {
  src: string;
  srcset?: string;
  width?: string | number;
  height?: string | number;
  alt?: string;
  thumb?: string;
  title?: string;
  captions?: string;
  type?: MediaType;
}

export interface CurrentObject {
  index: number;
  id?: string;
}

export interface JQueryElement {
  jquery: string;
  [index: number]: HTMLElement;
}

export interface Template {
  download: string;
  close: string;
  enterFullscreen: string;
  exitFullscreen: string;
}

export interface Options {
  gallery: Gallery;

  // Lightbox options
  fullscreen: boolean;
  showCounter: boolean;
  download: boolean;
  captions: boolean;
  loop: boolean;

  // Bullets
  bullets: boolean;

  // Set image loader and amount of preload image
  loader: boolean;
  preload: number;

  // Effects
  effect: EffectTypes;
  revealImage: RevealTypes;
  backdropDuration: number;

  // Right to left
  rtl: boolean;

  template: Template;
}
