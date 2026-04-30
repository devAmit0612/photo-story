import type { MEDIA } from '../const';

export type EffectTypes = 'default' | 'fade' | 'scale';
export type TransitionEffectTypes = EffectTypes | 'slide';

export type MediaType = (typeof MEDIA)[number];

export type CallbackFunType = () => void;

export type Gallery = Record<string, GalleryItem[]>;

export interface BackdropOptions {
  duration?: number;
  easing?: string;
}

export interface EffectOptions {
  name: EffectTypes;
  duration?: number;
  easing?: string;
}

export interface TransitionOptions extends Omit<EffectOptions, 'name'> {
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
  targetEl?: HTMLImageElement;
}

export interface TemplateOptions {
  download?: string;
  close?: string;
}

export interface FullscreenOptions {
  enabled?: boolean;
  enterIcon?: string;
  exitIcon?: string;
}

export interface NavigationOptions {
  enabled?: boolean;
  nextIcon?: string;
  prevIcon?: string;
}

export interface Options {
  gallery: Gallery;

  // Lightbox options
  showCounter?: boolean;
  download?: boolean;
  captions?: boolean;
  loop?: boolean;

  // Bullets
  bullets?: boolean;

  // Amount of preload image
  preload?: number;

  // Modules
  fullscreen?: boolean | FullscreenOptions;
  navigation?: boolean | NavigationOptions;

  // Effects
  enterEffect?: EffectOptions;
  exitEffect?: EffectOptions;
  transitionEffect?: TransitionOptions;

  backdrop?: BackdropOptions;

  // Right to left
  rtl?: boolean;

  template?: TemplateOptions;
}
