import type { FadeCallback } from '../../types';

export default function fadeIn(
  el: HTMLElement | null,
  cb?: FadeCallback,
  duration: number = 300
): boolean | void {
  if (!el) {
    return false;
  }

  el.style.opacity = '0';
  el.style.display = 'block';

  let startTime: number | null = null;

  const fade = (timestamp: number) => {
    if (startTime === null) {
      startTime = timestamp;
    }

    // Calculate how many milliseconds have passed
    const elapsed = timestamp - startTime;
    // Calculate the current opacity based on progress (max 1)
    const currentOpacity = Math.min(elapsed / duration, 1);

    el.style.opacity = currentOpacity.toString();

    if (elapsed < duration) {
      requestAnimationFrame(fade);
    } else {
      el.style.opacity = '1';

      if (cb) {
        cb();
      }
    }
  };

  // Start the animation loop
  requestAnimationFrame(fade);
}
