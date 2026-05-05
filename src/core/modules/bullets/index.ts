import { getDocument, getWindow } from 'ssr-window';

import { PREFIX } from '../../const';
import type { PhotoStoryModule } from '../..';
import type { BulletsOptions } from '../../types';

import './style.scss';

const Bullets: PhotoStoryModule = ({ ps, moduleDefaults, on }) => {
  let bulletsEl: HTMLDivElement | null = null;
  const defaults = { enabled: true, dynamicAmount: 5 };
  const activeBullets = new Map<number, HTMLElement>();

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
    if (!config || !config.enabled || !bulletsEl || !ps.galleryId) return;

    const gallery = ps.options.gallery[ps.galleryId];
    if (!gallery) return;

    const window = getWindow();
    const document = getDocument();
    const total = gallery.length;

    // If there's only 1 slide, don't show pagination
    if (total <= 1) {
      bulletsEl.innerHTML = '';
      activeBullets.clear();
      return;
    }

    const maxVisible = config.dynamicAmount || 5;
    let start = ps.currentIndex - Math.floor(maxVisible / 2);
    let end = start + maxVisible - 1;

    // Clamp the window to the array boundaries
    if (start < 0) {
      start = 0;
      end = Math.min(total - 1, start + maxVisible - 1);
    } else if (end >= total) {
      end = total - 1;
      start = Math.max(0, end - maxVisible + 1);
    }

    const requiredBullets = new Set<number>();
    for (let i = start; i <= end; i++) requiredBullets.add(i);

    // Remove nodes that are no longer in the window
    activeBullets.forEach((node, index) => {
      if (!requiredBullets.has(index)) {
        node.classList.add(`${PREFIX}__bullet--exit`);
        activeBullets.delete(index);

        // Wait for the CSS shrink animation to finish before destroying the node
        window.setTimeout(() => node.remove(), 300);
      }
    });

    // Create missing nodes
    for (let i = start; i <= end; i++) {
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

        ps.removeClass(node, 'enter');
        activeBullets.set(i, node);
      }
    }

    // Apply dynamic classes based on distance
    const statesToRemove = ['active', 'next', 'prev', 'next-sibling', 'prev-sibling'];
    const sortedBullets = Array.from(activeBullets.keys()).sort((a, b) => a - b);

    sortedBullets.forEach((index) => {
      const node = activeBullets.get(index)!;

      bulletsEl!.appendChild(node);
      node.classList.remove(...statesToRemove);

      // Calculate distance from the active slide!
      const dist = index - ps.currentIndex;

      if (dist === 0) ps.addClass(node, statesToRemove[0]);
      else if (dist === 1) ps.addClass(node, statesToRemove[1]);
      else if (dist === -1) ps.addClass(node, statesToRemove[2]);
      else if (dist >= 2) ps.addClass(node, statesToRemove[3]);
      else if (dist <= -2) ps.addClass(node, statesToRemove[4]);

      // Trigger reflow to remove the enter class, starting the grow animation
      window.requestAnimationFrame(() => {
        ps.removeClass(node, 'enter');
      });
    });
  }

  // Life cycle hooks
  on('init', init);
  on('change', update);
};

export default Bullets;
