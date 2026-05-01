import { getWindow } from 'ssr-window';

import { prefersReducedMotion } from '../../shared/utils';
import { ANIMATION_DURATION, ANIMATION_EFFECT } from '../../const';
import type { Options } from '../../types';

export interface TransitionContext {
  options: Options;
  transitionTimer?: number;
  emit(event: string, data?: any): this;
  cssEasing(easing: string): string;
}

export default function transition(
  this: TransitionContext,
  slide: HTMLElement,
  domIndex: number,
  shouldAnimate: boolean
): boolean | void {
  const window = getWindow();
  const effect = this.options.transitionEffect || { name: ANIMATION_EFFECT };
  const duration = effect.duration || ANIMATION_DURATION;
  const easing = this.cssEasing(effect.easing || 'cubic-bezier(0.25, 1, 0.5, 1)');
  const isCurrent = domIndex === 1;

  if (prefersReducedMotion() || duration <= 0 || effect.name === 'default') {
    return false;
  }

  if (isCurrent && shouldAnimate) {
    // Clear any running rapid-click timers
    if (this.transitionTimer) {
      clearTimeout(this.transitionTimer);
    }

    this.emit('transitionStart');

    this.transitionTimer = window.setTimeout(() => {
      this.emit('transitionEnd');
    }, duration);
  }

  slide.style.transition = shouldAnimate
    ? `transform ${duration}ms ${easing}, opacity ${duration}ms ${easing}`
    : 'none';

  let position = (domIndex - 1) * 100;
  if (this.options.rtl) position *= -1;

  switch (effect.name) {
    case 'fade':
      slide.style.transform = `translate3d(0%, 0, 0)`;
      slide.style.opacity = isCurrent ? '1' : '0';
      slide.style.zIndex = isCurrent ? '1' : '0';
      break;

    case 'scale':
      const scale = effect.scaleAmount || 0.75;
      slide.style.transform = `translate3d(${position}%, 0, 0) scale(${isCurrent ? 1 : scale})`;
      slide.style.opacity = isCurrent ? '1' : '0.5';
      slide.style.zIndex = '';
      break;

    case 'slide':
    default:
      slide.style.transform = `translate3d(${position}%, 0, 0)`;
      slide.style.opacity = '1';
      slide.style.zIndex = '';
      break;
  }
}
