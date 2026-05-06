import { getDocument, getWindow } from 'ssr-window';

import { ANIMATION_DURATION, PREFIX } from '../../const';
import type { PhotoStoryModule } from '../..';
import type { BulletsOptions } from '../../types';

import './style.scss';

const Bullets: PhotoStoryModule = ({ ps, moduleDefaults, on }) => {
  let bulletsEl: HTMLDivElement | null = null;
  let bulletsTrackEl: HTMLDivElement | null = null;
  let timer: number | null = null;
  const defaults = { enabled: true, dynamicAmount: 5 };
  const activeBullets = new Map<number, HTMLElement>();
  const bulletStates = ['active', 'next', 'prev', 'next-sibling', 'prev-sibling'];
  const animationStates = ['enter', 'exit', 'enter-next', 'enter-prev', 'exit-next', 'exit-prev'];

  moduleDefaults({
    bullets: defaults,
  });

  function getConfig(): BulletsOptions | false {
    const config = ps.options.bullets;
    if (config === false) return false;
    if (config === true) return defaults;
    return config as BulletsOptions;
  }

  function init() {
    const config = getConfig();
    if (!config || !config.enabled || !ps.galleryId || !ps.options.gallery[ps.galleryId]) return;

    bulletsEl = ps.createEl(`${PREFIX}__bullets`) as HTMLDivElement;
    bulletsTrackEl = ps.createEl(`${PREFIX}__bullets__track`) as HTMLDivElement;
    bulletsEl.append(bulletsTrackEl);

    ps.attachEvents(bulletsEl, 'click', onClick);
    ps.tools.bullets = bulletsEl;
    ps.wrapperEl.append(bulletsEl);

    update();
  }

  function onClick(e: Event) {
    const target = e.target as HTMLElement;
    const bullet = target.closest(`.${PREFIX}__bullet`) as HTMLElement;

    if (bullet) {
      const index = bullet.getAttribute('data-ps-slide-index');
      if (index !== null) {
        ps.changeSlide(Number(index));
      }
    }
  }

  function update() {
    const config = getConfig();
    if (!config || !config.enabled || !bulletsEl || !bulletsTrackEl || !ps.galleryId) return;

    const gallery = ps.options.gallery[ps.galleryId];
    if (!gallery) return;

    const window = getWindow();
    const document = getDocument();
    const total = gallery.length;

    if (timer !== null) {
      window.clearTimeout(timer);
      timer = null;
    }

    // Remove exiting nodes
    bulletsTrackEl.querySelectorAll('[data-ps-exiting="true"]').forEach((node) => node.remove());
    resetTrack();

    // If there's only 1 slide, don't show pagination
    if (total <= 1) {
      bulletsTrackEl.innerHTML = '';
      activeBullets.clear();
      bulletsEl.style.width = '';
      ps.previousIndex = ps.currentIndex;
      return;
    }

    const maxVisible = config.dynamicAmount || 5;
    const currentWindow = getWindowRange(ps.currentIndex, total, maxVisible);
    const previousWindow =
      ps.previousIndex === null
        ? currentWindow
        : getWindowRange(ps.previousIndex, total, maxVisible);
    const windowShift = currentWindow.start - previousWindow.start;
    const direction = getDirection(total);
    const shouldAnimate = ps.previousIndex !== null && ps.previousIndex !== ps.currentIndex;

    const requiredBullets = new Set<number>();
    for (let i = currentWindow.start; i <= currentWindow.end; i++) requiredBullets.add(i);

    const exitingBullets: Array<{ index: number; node: HTMLElement }> = [];

    // Remove nodes that are no longer in the window
    activeBullets.forEach((node, index) => {
      if (!requiredBullets.has(index)) {
        activeBullets.delete(index);
        resetNodeState(node);
        ps.addClass(node, 'exit');
        if (direction) {
          ps.addClass(node, `exit-${direction}`);
        }
        node.setAttribute('data-ps-exiting', 'true');
        exitingBullets.push({ index, node });
      }
    });

    // Create missing nodes
    for (let i = currentWindow.start; i <= currentWindow.end; i++) {
      if (!activeBullets.has(i)) {
        let node: HTMLElement;

        if (config.renderBullet) {
          const html = config.renderBullet(i, `${PREFIX}__bullet`, i === ps.currentIndex);
          const template = document.createElement('template');
          template.innerHTML = html.trim();
          node = template.content.firstElementChild as HTMLElement;
          node.setAttribute('data-ps-slide-index', String(i)); // Failsafe
        } else {
          node = document.createElement('button');
          (node as HTMLButtonElement).type = 'button';
          ps.addClass(node, `${PREFIX}__bullet`);
          node.setAttribute('data-ps-slide-index', String(i));
          node.setAttribute('aria-label', `Go to slide ${i + 1}`);
        }

        if (shouldAnimate) {
          ps.addClass(node, 'enter');
          if (direction) {
            ps.addClass(node, `enter-${direction}`);
          }
        }
        activeBullets.set(i, node);
      }
    }

    // Apply dynamic classes based on distance
    const sortedBullets = Array.from(activeBullets.keys()).sort((a, b) => a - b);
    const sortedActiveNodes = sortedBullets.map((index) => activeBullets.get(index)!);
    const sortedExitingNodes = exitingBullets
      .sort((a, b) => a.index - b.index)
      .map(({ node }) => node);

    if (windowShift > 0) {
      [...sortedExitingNodes, ...sortedActiveNodes].forEach((node) =>
        bulletsTrackEl!.appendChild(node)
      );
    } else if (windowShift < 0) {
      [...sortedActiveNodes, ...sortedExitingNodes].forEach((node) =>
        bulletsTrackEl!.appendChild(node)
      );
    } else {
      sortedActiveNodes.forEach((node) => bulletsTrackEl!.appendChild(node));
      sortedExitingNodes.forEach((node) => bulletsTrackEl!.appendChild(node));
    }

    sortedBullets.forEach((index) => {
      const node = activeBullets.get(index)!;
      removeClasses(node, bulletStates);

      // Calculate distance from the active slide!
      const dist = index - ps.currentIndex;

      if (dist === 0) ps.addClass(node, bulletStates[0]);
      else if (dist === 1) ps.addClass(node, bulletStates[1]);
      else if (dist === -1) ps.addClass(node, bulletStates[2]);
      else if (dist >= 2) ps.addClass(node, bulletStates[3]);
      else if (dist <= -2) ps.addClass(node, bulletStates[4]);
    });

    // Update track width
    const styles = window.getComputedStyle(bulletsTrackEl);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || '0') || 0;
    const firstBullet = activeBullets.values().next().value as HTMLElement | undefined;
    const width = firstBullet?.offsetWidth || 0;
    const visibleCount = sortedActiveNodes.length;
    bulletsEl.style.width = `${width * visibleCount + gap * Math.max(visibleCount - 1, 0)}px`;

    // Update track transition
    trackTransition(window, sortedActiveNodes, exitingBullets, windowShift, shouldAnimate, {
      gap,
      width,
    });
  }

  function trackTransition(
    window: ReturnType<typeof getWindow>,
    activeNodes: HTMLElement[],
    exitingNodes: Array<{ index: number; node: HTMLElement }>,
    windowShift: number,
    shouldAnimate: boolean,
    styles: { gap: number; width: number }
  ) {
    if (!bulletsTrackEl) return;

    const { gap, width } = styles;
    const shiftAmount = Math.abs(windowShift);
    const offset = shiftAmount * (width + gap);
    const canShiftTrack =
      shouldAnimate &&
      exitingNodes.length > 0 &&
      shiftAmount > 0 &&
      shiftAmount < activeNodes.length;

    if (canShiftTrack) {
      bulletsTrackEl.style.transition = 'none';
      bulletsTrackEl.style.transform =
        windowShift > 0 ? 'translate3d(0, 0, 0)' : `translate3d(-${offset}px, 0, 0)`;
    } else {
      bulletsTrackEl.style.transition = 'none';
      bulletsTrackEl.style.transform = 'translate3d(0, 0, 0)';
    }

    window.requestAnimationFrame(() => {
      activeNodes.forEach((node) => removeClasses(node, animationStates));

      if (canShiftTrack) {
        bulletsTrackEl!.style.transition = `transform ${ANIMATION_DURATION}ms ease`;
        bulletsTrackEl!.style.transform =
          windowShift > 0 ? `translate3d(-${offset}px, 0, 0)` : 'translate3d(0, 0, 0)';
      }
    });

    if (exitingNodes.length > 0) {
      timer = window.setTimeout(() => {
        exitingNodes.forEach(({ node }) => node.remove());
        resetTrack();
        timer = null;
      }, ANIMATION_DURATION);
    }
  }

  function getWindowRange(index: number, total: number, maxVisible: number) {
    let start = index - Math.floor(maxVisible / 2);
    let end = start + maxVisible - 1;

    if (start < 0) {
      start = 0;
      end = Math.min(total - 1, start + maxVisible - 1);
    } else if (end >= total) {
      end = total - 1;
      start = Math.max(0, end - maxVisible + 1);
    }

    return { start, end };
  }

  function getDirection(total: number): 'next' | 'prev' | null {
    if (ps.previousIndex === null || ps.previousIndex === ps.currentIndex) {
      return null;
    }

    if (!ps.options.loop) {
      return ps.currentIndex > ps.previousIndex ? 'next' : 'prev';
    }

    const forwardDistance = (ps.currentIndex - ps.previousIndex + total) % total;
    const backwardDistance = (ps.previousIndex - ps.currentIndex + total) % total;

    return forwardDistance <= backwardDistance ? 'next' : 'prev';
  }

  function resetTrack() {
    if (!bulletsTrackEl) return;
    bulletsTrackEl.style.transition = 'none';
    bulletsTrackEl.style.transform = 'translate3d(0, 0, 0)';
  }

  function resetNodeState(node: HTMLElement) {
    removeClasses(node, bulletStates);
    removeClasses(node, animationStates);
    node.removeAttribute('data-ps-exiting');
  }

  function removeClasses(node: HTMLElement, classNames: string[]) {
    classNames.forEach((className) => ps.removeClass(node, className));
  }

  // Life cycle hooks
  on('init', init);
  on('change', update);
};

export default Bullets;
