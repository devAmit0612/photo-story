import { prefix } from '../shared/utils';
import type { CallbackFunType } from '../types';

export interface LoaderContext {
  currentIndex: number;
  el: HTMLElement;
  options: { loader: boolean };
  fadeIn(el: HTMLElement, cb?: () => void, duration?: number, easing?: string): void;
  fadeOut(el: HTMLElement, cb?: () => void, duration?: number, easing?: string): void;
  createEl(classes?: string, tag?: string): HTMLElement;
  hideLoader(): void;
  emit(event: string, data?: any): this;
}

function getLoaderElement(context: LoaderContext): HTMLElement | null {
  return context.el.querySelector(`#${prefix}_loader`);
}

function getCurrentMedia(context: LoaderContext): HTMLElement | null {
  return context.el.querySelector(`[data-current="true"]`);
}

export default {
  createLoader(this: LoaderContext): HTMLElement {
    const loader = this.createEl();
    loader.id = `${prefix}_loader`;
    loader.hidden = !this.options.loader;
    loader.setAttribute('role', 'status');
    loader.setAttribute('aria-live', 'polite');
    loader.innerHTML = '<div><span></span><span></span><span></span></div>';
    return loader;
  },

  showLoader(this: LoaderContext): void {
    if (!this.options.loader) return;

    const loader = getLoaderElement(this);
    if (loader) {
      loader.hidden = false;
      this.fadeIn(loader, undefined, 300);
    }
  },

  hideLoader(this: LoaderContext): void {
    const loader = getLoaderElement(this);
    if (loader) {
      this.fadeOut(
        loader,
        () => {
          loader.hidden = true;
        },
        300
      );
    }
  },

  mount(this: LoaderContext, callback?: CallbackFunType): void {
    const media = getCurrentMedia(this);

    const finish = () => {
      this.hideLoader();
      this.emit('currentMediaLoad', { index: this.currentIndex, media });
      if (callback) callback();
    };

    if (!media) {
      finish();
      return;
    }

    if (media instanceof HTMLImageElement) {
      if (media.complete && media.naturalWidth > 0) {
        finish();
        return;
      }

      const onLoad = () => finish();
      const onError = () => finish();

      media.addEventListener('load', onLoad, { once: true });
      media.addEventListener('error', onError, { once: true });
      return;
    }

    if (media instanceof HTMLVideoElement) {
      if (media.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        finish();
        return;
      }

      media.addEventListener('loadeddata', finish, { once: true });
      media.addEventListener('error', finish, { once: true });
      return;
    }

    if (media instanceof HTMLIFrameElement) {
      media.addEventListener('load', finish, { once: true });
      media.addEventListener('error', finish, { once: true });
      return;
    }

    finish();
  },
};
