import { getWindow } from 'ssr-window';

import { prefersReducedMotion } from '../../shared/utils';
import { ANIMATION_DURATION } from '../../const';
import type { CallbackFunType, EasingFunction } from '../../types';

interface FadeOutContext {
  resolveEasing(easing: string): EasingFunction;
}

export default function fadeOut(
  this: FadeOutContext,
  el: HTMLElement | null,
  duration: number = ANIMATION_DURATION,
  easing: string = 'linear',
  cb?: CallbackFunType
): boolean | void {
  if (!el) {
    return false;
  }

  if (prefersReducedMotion() || duration <= 0) {
    el.style.opacity = '0';
    el.style.display = 'none';

    if (cb) {
      cb();
    }
    return;
  }

  el.style.opacity = '1';

  const window = getWindow();
  const easingFn = this.resolveEasing(easing);
  let startTime: number | null = null;

  const fade = (timestamp: number) => {
    if (startTime === null) {
      startTime = timestamp;
    }

    // Calculate how many milliseconds have passed
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Calculate the current opacity based on eased progress (from 1 down to 0)
    const currentOpacity = 1 - easingFn(progress);

    el.style.opacity = currentOpacity.toString();

    if (elapsed < duration) {
      window.requestAnimationFrame(fade);
    } else {
      el.style.opacity = '0';
      el.style.display = 'none';

      if (cb) {
        cb();
      }
    }
  };

  // Start the animation loop
  window.requestAnimationFrame(fade);
}
