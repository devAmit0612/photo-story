import { getIndex } from '../../shared/utils';
import { PREFIX } from '../../const';
import type { Options, GalleryItem } from '../../types';

export interface SlideContext {
  currentIndex: number;
  options: Options;
  el: HTMLElement;
  slidesEl: HTMLElement;
  createEl(classes?: string, tag?: string): HTMLElement;
  media(slideEl: HTMLElement, item: GalleryItem, isCurrent: boolean): void;
  changeSlide(newIndex: number, isInitial?: boolean): void;
}

export default function setSlides(this: SlideContext, gallery: GalleryItem[]): void {
  const slides = [] as HTMLElement[];
  const indexes = [
    getIndex(this.options, this.currentIndex - 1, gallery.length), // Prev
    this.currentIndex, // Current
    getIndex(this.options, this.currentIndex + 1, gallery.length), // Next
  ];

  for (let i = 0; i < 3; i++) {
    const slide = this.createEl(`${PREFIX}__slide`);
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-hidden', 'true');
    slides.push(slide);
  }

  // Slide & DOM indexes to load media and set HTML content into the Slides
  indexes.forEach((sIndex, dIndex) => {
    if (sIndex !== null && gallery[sIndex] && slides) {
      this.media(slides[dIndex], gallery[sIndex], sIndex === this.currentIndex);
    }
  });

  const slideWrapperEl = this.createEl(`${PREFIX}__slides__wrapper`);
  slideWrapperEl.append(...slides);

  this.slidesEl = this.createEl();
  this.slidesEl.id = `${PREFIX}_slides`;
  this.slidesEl.append(slideWrapperEl);
  this.el.append(this.slidesEl);

  this.changeSlide(this.currentIndex, true);
}
