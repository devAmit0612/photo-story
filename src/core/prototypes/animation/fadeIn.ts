import { getWindow } from 'ssr-window';

import { prefersReducedMotion } from '../../shared/utils';
import { ANIMATION_DURATION } from '../../const';
import type { CallbackFunType, EasingFunction } from '../../types';

interface FadeInContext {
  resolveEasing(easing: string): EasingFunction;
}

export default function fadeIn(
  this: FadeInContext,
  el: HTMLElement | null,
  duration: number = ANIMATION_DURATION,
  easing: string = 'linear',
  cb?: CallbackFunType
): boolean | void {
  if (!el) {
    return false;
  }

  if (prefersReducedMotion() || duration <= 0) {
    el.style.opacity = '1';
    el.style.display = 'block';

    if (cb) {
      cb();
    }
    return;
  }

  el.style.opacity = '0';
  el.style.display = 'block';

  let startTime: number | null = null;
  const easingFn = this.resolveEasing(easing);
  const window = getWindow();

  const fade = (timestamp: number) => {
    if (startTime === null) {
      startTime = timestamp;
    }

    // Calculate how many milliseconds have passed
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Calculate the current opacity based on eased progress (max 1)
    const currentOpacity = easingFn(progress);

    el.style.opacity = currentOpacity.toString();

    if (elapsed < duration) {
      window.requestAnimationFrame(fade);
    } else {
      el.style.opacity = '1';

      if (cb) {
        cb();
      }
    }
  };

  // Start the animation loop
  window.requestAnimationFrame(fade);
}
