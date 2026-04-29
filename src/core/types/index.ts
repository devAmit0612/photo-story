export const mediaNames = ['image', 'video', 'youtube', 'vimeo', 'dailymotion'] as const;

export type EffectTypes = 'default' | 'fade' | 'scale';
export type TransitionEffectTypes = EffectTypes | 'slide';

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

export interface Transition extends Omit<Effect, 'name'> {
  name: TransitionEffectTypes;
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
}

export interface Fullscreen {
  enterIcon: string;
  exitIcon: string;
}

export interface Options {
  gallery: Gallery;

  // Lightbox options
  fullscreen: boolean | Fullscreen;
  showCounter: boolean;
  download: boolean;
  captions: boolean;
  loop: boolean;

  // Bullets
  bullets: boolean;

  // Amount of preload image
  preload: number;

  // Effects
  enterEffect: Effect;
  exitEffect: Effect;
  transitionEffect: Transition;

  backdrop: Backdrop;

  // Right to left
  rtl: boolean;

  template: Template;
}
