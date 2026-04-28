import { getWindow } from 'ssr-window';

import type { CallbackFunType } from '../../types';
import resolveEasing from './easing';

export default function fadeOut(
  el: HTMLElement | null,
  cb?: CallbackFunType,
  duration: number = 300,
  easing: string = 'linear'
): boolean | void {
  if (!el) {
    return false;
  }

  el.style.opacity = '1';

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
