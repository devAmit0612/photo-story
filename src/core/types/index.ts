export const mediaNames = ['image', 'video', 'youtube', 'vimeo', 'dailymotion'] as const;

export type RevealTypes = 'default' | 'fade' | 'scale';
export type EffectTypes = RevealTypes | 'slide';

export type MediaType = (typeof mediaNames)[number];

export type CallbackFunType = () => void;

export type Gallery = Record<string, GalleryItem[]>;

export interface Backdrop {
  duration?: number;
  easing?: string;
}

export interface Effect {
  name: EffectTypes;
  duration?: number;
  easing?: string;
}

export interface Reveal {
  effect: RevealTypes;
  duration?: number;
  easing?: string;
}

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
  effect: Effect;
  reveal: Reveal;
  backdrop: Backdrop;

  // Right to left
  rtl: boolean;

  template: Template;
}
