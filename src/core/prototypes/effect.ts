import { getDocument, getWindow } from 'ssr-window';

import { ANIMATION_DELAY } from '../const';
import type { Options } from '../types';

export interface EffectContext {
  el: HTMLElement;
  wrapperEl: HTMLElement;
  slidesEl: HTMLElement;
  currentThumbEl: HTMLElement;
  currentMediaEl: HTMLElement | null;
  currentIndex: number;
  galleryId: string | null;
  options: Options;
  fadeIn(el: HTMLElement, duration?: number, easing?: string, cb?: () => void): void;
  fadeOut(el: HTMLElement, duration?: number, easing?: string, cb?: () => void): void;
  scaleUp(
    el: HTMLElement,
    targetEl: HTMLElement,
    duration?: number,
    easing?: string,
    cb?: () => void
  ): void;
  scaleDown(
    el: HTMLElement,
    targetEl: HTMLElement,
    duration?: number,
    easing?: string,
    cb?: () => void
  ): void;
}

export default {
  enterEffect(this: EffectContext): void {
    const window = getWindow();
    const effect = this.options.enterEffect || { name: 'default' };
    const currentMedia = this.options.gallery[this.galleryId!][this.currentIndex];
    const isFade =
      effect.name === 'fade' ||
      (effect.name === 'scale' &&
        (currentMedia.type !== 'image' || !this.currentMediaEl || !this.currentThumbEl));

    this.wrapperEl.style.opacity = '0';
    this.slidesEl.style.opacity = '0';

    if (effect.name === 'default') {
      this.wrapperEl.style.opacity = '1';
      this.slidesEl.style.opacity = '1';
      return;
    }

    if (isFade) {
      this.fadeIn(this.wrapperEl, effect.duration, effect.easing);
      window.setTimeout(() => {
        this.fadeIn(this.slidesEl, effect.duration, effect.easing);
      }, ANIMATION_DELAY);
      return;
    }

    if (effect.name === 'scale') {
      this.slidesEl.style.opacity = '1';
      this.scaleUp(
        this.currentMediaEl as HTMLElement,
        this.currentThumbEl,
        effect.duration,
        effect.easing
      );
      window.setTimeout(() => {
        this.fadeIn(this.wrapperEl, effect.duration, effect.easing);
      }, ANIMATION_DELAY);
      return;
    }
  },

  exitEffect(this: EffectContext): void {
    const document = getDocument();
    const window = getWindow();
    const effect = this.options.exitEffect || { name: 'default' };
    const currentMedia = this.options.gallery[this.galleryId!][this.currentIndex];
    const isFade =
      effect.name === 'fade' ||
      (effect.name === 'scale' &&
        (currentMedia.type !== 'image' || !this.currentMediaEl || !this.currentThumbEl));

    if (effect.name === 'default') {
      this.wrapperEl.style.opacity = '0';
      this.slidesEl.style.opacity = '0';
      document.body.removeChild(this.el);
      this.currentMediaEl = null;
      return;
    }

    if (isFade) {
      this.fadeOut(this.wrapperEl, effect.duration, effect.easing);
      this.fadeOut(this.slidesEl, effect.duration, effect.easing, () => {
        document.body.removeChild(this.el);
        this.currentMediaEl = null;
      });
      return;
    }

    if (effect.name === 'scale') {
      this.fadeOut(this.wrapperEl, effect.duration, effect.easing);
      window.setTimeout(() => {
        this.scaleDown(
          this.currentMediaEl as HTMLElement,
          this.currentThumbEl,
          effect.duration,
          effect.easing,
          () => {
            document.body.removeChild(this.el);
            this.currentMediaEl = null;
          }
        );
      }, ANIMATION_DELAY);
      return;
    }
  },
};
