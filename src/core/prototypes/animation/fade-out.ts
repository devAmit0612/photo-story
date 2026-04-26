import type { FadeCallback } from '../../types';

export default function fadeOut(
  el: HTMLElement | null,
  cb?: FadeCallback,
  duration: number = 300
): boolean | void {
  if (!el) {
    return false;
  }

  el.style.opacity = '1';

  let startTime: number | null = null;

  const fade = (timestamp: number) => {
    if (startTime === null) {
      startTime = timestamp;
    }

    // Calculate how many milliseconds have passed
    const elapsed = timestamp - startTime;
    // Calculate the current opacity based on progress (from 1 down to 0)
    const currentOpacity = Math.max(1 - elapsed / duration, 0);

    el.style.opacity = currentOpacity.toString();

    if (elapsed < duration) {
      requestAnimationFrame(fade);
    } else {
      el.style.opacity = '0';
      el.style.display = 'none';

      if (cb) {
        cb();
      }
    }
  };

  // Start the animation loop
  requestAnimationFrame(fade);
}
