import { getWindow } from 'ssr-window';

import { prefersReducedMotion } from '../../shared/utils';
import { ANIMATION_DURATION } from '../../const';
import type { CallbackFunType, EasingFunction } from '../../types';

interface ScaleUpContext {
  resolveEasing(easing: string): EasingFunction;
}

export default function scaleUp(
  this: ScaleUpContext,
  el: HTMLElement | null,
  targetEl: HTMLElement | null,
  duration: number = ANIMATION_DURATION,
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

  // Calculate Scale difference
  const targetScale = thumbRect.width / targetRect.width;

  // Calculate X and Y translation differences (Center to Center)
  const startX = thumbRect.left + thumbRect.width / 2 - (targetRect.left + targetRect.width / 2);
  const startY = thumbRect.top + thumbRect.height / 2 - (targetRect.top + targetRect.height / 2);

  let startTime: number | null = null;
  const easingFn = this.resolveEasing(easing);
  const window = getWindow();

  el.style.transformOrigin = 'center center';

  const scale = (timestamp: number) => {
    if (startTime === null) startTime = timestamp;

    const elapsed = timestamp - startTime;
    let progress = Math.min(elapsed / duration, 1);

    const easeProgress = easingFn(progress);

    // Calculate current position & scale
    const currentX = startX * (1 - easeProgress);
    const currentY = startY * (1 - easeProgress);
    const currentScale = targetScale + (1 - targetScale) * easeProgress;

    el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) scale(${currentScale})`;

    if (progress < 1) {
      window.requestAnimationFrame(scale);
    } else {
      // Clean up and ensure exact final state
      el.style.transform = 'translate3d(0, 0, 0) scale(1)';
      if (cb) cb();
    }
  };

  window.requestAnimationFrame(scale);
}
