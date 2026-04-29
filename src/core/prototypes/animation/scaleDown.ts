import { getWindow } from 'ssr-window';

import resolveEasing from './easing';
import { prefersReducedMotion } from '../../shared/utils';
import type { CallbackFunType } from '../../types';

export default function scaleDown(
  el: HTMLElement | null,
  targetEl: HTMLElement | null,
  duration: number = 300,
  easing: string = 'linear',
  cb?: CallbackFunType
): boolean | void {
  if (!el || !targetEl) {
    return false;
  }

  if (prefersReducedMotion() || duration <= 0) {
    if (cb) {
      cb();
    }
    return;
  }

  const thumbRect = targetEl.getBoundingClientRect();
  const targetRect = el.getBoundingClientRect();

  const targetScale = thumbRect.width / targetRect.width;
  const targetX = thumbRect.left + thumbRect.width / 2 - (targetRect.left + targetRect.width / 2);
  const targetY = thumbRect.top + thumbRect.height / 2 - (targetRect.top + targetRect.height / 2);

  let startTime: number | null = null;
  const easingFn = resolveEasing(easing);

  el.style.transformOrigin = 'center center';

  const scale = (timestamp: number) => {
    if (startTime === null) startTime = timestamp;

    const elapsed = timestamp - startTime;
    let progress = Math.min(elapsed / duration, 1);
    const window = getWindow();

    // Apply Easing (Accelerates smoothly towards the thumbnail)
    const easeProgress = easingFn(progress);

    // Calculate current position & scale
    const currentX = targetX * easeProgress;
    const currentY = targetY * easeProgress;
    const currentScale = 1 - (1 - targetScale) * easeProgress;

    el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) scale(${currentScale})`;

    if (progress < 1) {
      window.requestAnimationFrame(scale);
    } else {
      if (cb) cb();
    }
  };

  window.requestAnimationFrame(scale);
}
