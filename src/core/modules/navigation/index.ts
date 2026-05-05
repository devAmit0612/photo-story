import { PREFIX } from '../../const';
import type { PhotoStoryModule } from '../..';
import type { NavigationOptions } from '../../types';

import './style.scss';

const Navigation: PhotoStoryModule = ({ ps, moduleDefaults, on }) => {
  let nextBtn: HTMLButtonElement | null = null;
  let prevBtn: HTMLButtonElement | null = null;
  const defaults = {
    enabled: true,
    nextIcon: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path></svg>`,
    prevIcon: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path></svg>`,
  };

  moduleDefaults({
    navigation: defaults,
  });

  function getConfig(): NavigationOptions | false {
    const config = ps.options.navigation;
    if (config === false) return false;
    if (config === true) return defaults;
    return config as NavigationOptions;
  }

  function init() {
    const config = getConfig();
    if (!config || !config.enabled || !ps.galleryId || !ps.options.gallery[ps.galleryId]) return;

    nextBtn = ps.createButton(
      config.nextIcon as string,
      () => next(),
      'Next Slide'
    ) as HTMLButtonElement;
    ps.addClass(nextBtn, `${PREFIX}__button--next`);

    prevBtn = ps.createButton(
      config.prevIcon as string,
      () => prev(),
      'Previous Slide'
    ) as HTMLButtonElement;
    ps.addClass(prevBtn, `${PREFIX}__button--prev`);

    ps.tools.next = nextBtn;
    ps.tools.prev = prevBtn;

    ps.wrapperEl.append(nextBtn, prevBtn);

    update();
  }

  function next() {
    if (!ps.galleryId || !ps.options.gallery[ps.galleryId]) return;
    const total = ps.options.gallery[ps.galleryId].length;
    let nextIndex = ps.currentIndex + 1;

    if (nextIndex >= total) {
      if (ps.options.loop) nextIndex = 0;
      else return;
    }
    ps.changeSlide(nextIndex);
  }

  function prev() {
    if (!ps.galleryId || !ps.options.gallery[ps.galleryId]) return;
    const total = ps.options.gallery[ps.galleryId].length;
    let prevIndex = ps.currentIndex - 1;

    if (prevIndex < 0) {
      if (ps.options.loop) prevIndex = total - 1;
      else return;
    }
    ps.changeSlide(prevIndex);
  }

  function update() {
    const config = getConfig();
    if (
      !config ||
      !config.enabled ||
      !ps.galleryId ||
      !ps.options.gallery[ps.galleryId] ||
      !prevBtn ||
      !nextBtn ||
      ps.options.loop
    )
      return;

    const total = ps.options.gallery[ps.galleryId].length;
    ps.isAtStart = ps.currentIndex === 0;
    ps.isAtEnd = ps.currentIndex === total - 1;

    if (ps.options.rtl) {
      prevBtn.disabled = ps.isAtEnd;
      nextBtn.disabled = ps.isAtStart;
    } else {
      prevBtn.disabled = ps.isAtStart;
      nextBtn.disabled = ps.isAtEnd;
    }
  }

  // Life cycle hooks
  on('init', init);
  on('change', update);
};

export default Navigation;
