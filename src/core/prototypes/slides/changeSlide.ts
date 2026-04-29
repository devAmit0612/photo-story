import { getIndex } from '../../shared/utils';
import { PREFIX } from '../../const';
import type { GalleryItem, Options } from '../../types';

export interface NavigationContext {
  currentIndex: number;
  galleryId: string | null;
  options: Options;
  slidesEl: HTMLElement;
  currentMediaEl: HTMLElement | null;
  media(slideEl: HTMLElement, item: GalleryItem, isCurrent: boolean): void;
}

export default function changeSlide(
  this: NavigationContext,
  newIndex: number,
  isInitial: boolean = false
): void {
  if (!this.galleryId || !this.options.gallery[this.galleryId]) return;

  const slideWrapperEl = this.slidesEl.querySelector(`.${PREFIX}__slides__wrapper`) as HTMLElement;
  const gallery = this.options.gallery[this.galleryId];
  const total = gallery.length;

  // Detect if the user clicked a bullet point to jump multiple slides at once
  const jumpSize = Math.abs(newIndex - this.currentIndex);
  const isSequential = jumpSize === 1 || jumpSize === total - 1; // total-1 covers loop boundaries

  if (!isSequential) {
    isInitial = true;
  }

  // Determine direction for the DOM shift
  let direction: 'next' | 'prev' = 'next';
  if (!isInitial) {
    if (newIndex > this.currentIndex || (this.currentIndex === total - 1 && newIndex === 0))
      direction = 'next';
    if (newIndex < this.currentIndex || (this.currentIndex === 0 && newIndex === total - 1))
      direction = 'prev';
  }

  this.currentIndex = newIndex;

  // Get the physical DOM slides
  const slides = Array.from(slideWrapperEl.children) as HTMLElement[];

  // DOM RECYCLING: Shift the physical nodes around without destroying them
  if (!isInitial) {
    if (direction === 'next') {
      const first = slides.shift()!;
      slideWrapperEl.appendChild(first); // Move first node to the end
      slides.push(first);
    } else {
      const last = slides.pop()!;
      slideWrapperEl.prepend(last); // Move last node to the beginning
      slides.unshift(last);
    }
  }

  // Calculate the gallery array indexes for the 3 active slides
  const indexes = [
    getIndex(this.options, this.currentIndex - 1, total), // Prev
    this.currentIndex, // Current
    getIndex(this.options, this.currentIndex + 1, total), // Next
  ];

  // Apply absolute positions and update media
  slides.forEach((slide, domIndex) => {
    const sIndex = indexes[domIndex];
    const isCurrent = domIndex === 1;

    // Mathematical positioning for absolute slides (-100%, 0%, 100%)
    const position = (domIndex - 1) * 100;
    slide.style.transform = `translate3d(${position}%, 0, 0)`;
    slide.setAttribute('aria-hidden', isCurrent ? 'false' : 'true');

    if (sIndex !== null && gallery[sIndex]) {
      // PERFORMANCE BOOST: Only inject media into the NEW slide that just cycled in.
      // If it is the initial load or a large jump, reload all 3.
      if (
        isInitial ||
        (direction === 'next' && domIndex === 2) ||
        (direction === 'prev' && domIndex === 0)
      ) {
        this.media(slide, gallery[sIndex], isCurrent);
      } else if (isCurrent) {
        // If we didn't re-render the media, we still need to update the currentMediaEl pointer!
        const img = slide.querySelector(`.${PREFIX}__slide__media`);
        if (img) this.currentMediaEl = img as HTMLElement;
      }
    }
  });
}
