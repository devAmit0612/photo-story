import { getWindow } from 'ssr-window';

import resolveEasing from './easing';
import { prefersReducedMotion } from '../../shared/utils';
import type { CallbackFunType } from '../../types';

export default function fadeIn(
  el: HTMLElement | null,
  cb?: CallbackFunType,
  duration: number = 300,
  easing: string = 'linear'
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
  const easingFn = resolveEasing(easing);
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
