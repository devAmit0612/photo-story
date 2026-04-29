import { getDocument, getWindow } from 'ssr-window';

import { PREFIX } from '../const';
import { type Options, type GalleryItem } from '../types';

export interface DOMContext {
  currentIndex: number;
  galleryId: string;
  options: Options;
  tools: {
    download: HTMLAnchorElement;
    [key: string]: any;
  };
  el: HTMLElement;
  events: { click: string };

  addClass(el: HTMLElement, className: string): void;
  attachEvents(
    element: HTMLElement | Window | Document,
    events: string,
    handler: EventListenerOrEventListenerObject
  ): void;
  createEl(classes?: string, tag?: string): HTMLElement;
  hasClass(el: HTMLElement, className: string): boolean;
  getClassName(name?: string): string;
  getCSSVariable(varName: string): string;
  getIdName(name?: string): string;
}

export default {
  createButton(
    this: DOMContext,
    html: string,
    onClick: () => void,
    ariaLabel?: string,
    className?: string,
    tag: string = 'button'
  ): HTMLElement {
    const btn = this.createEl(`${PREFIX}__button`, tag);
    if (tag === 'button') (btn as HTMLButtonElement).type = 'button';
    if (className) this.addClass(btn, `${PREFIX}__button--${className}`);

    if (ariaLabel) btn.setAttribute('aria-label', ariaLabel);
    if (html) btn.innerHTML = html;

    this.attachEvents(btn, this.events.click, onClick);
    return btn;
  },

  createEl(this: DOMContext, classes?: string, tag?: string): HTMLElement {
    const document = getDocument();
    const el = document.createElement(tag || 'div');
    if (classes) {
      // Use regex split to handle accidental double spaces safely
      classes
        .trim()
        .split(/\s+/)
        .forEach((className) => {
          this.addClass(el, className);
        });
    }
    return el;
  },

  counter(this: DOMContext): void {
    const document = getDocument();
    const counterEl = document.getElementById(this.getIdName('ps_current_slide'));
    if (counterEl) {
      counterEl.innerHTML = (this.currentIndex + 1).toString();
    }
  },

  downloadURL(this: DOMContext): void {
    const item: GalleryItem | undefined = this.options.gallery[this.galleryId]?.[this.currentIndex];

    if (item && item.src && this.tools && this.tools.download) {
      this.tools.download.href = item.src;
    }
  },

  addClass(this: DOMContext, el: HTMLElement, className: string): void {
    const fullClassName = this.getClassName(className);
    if (fullClassName) {
      el.classList.add(fullClassName);
    }
  },

  hasClass(this: DOMContext, el: HTMLElement, className: string): boolean {
    const fullClassName = this.getClassName(className);
    return fullClassName ? el.classList.contains(fullClassName) : false;
  },

  removeClass(this: DOMContext, el: HTMLElement, className: string): void {
    const fullClassName = this.getClassName(className);
    if (fullClassName) {
      el.classList.remove(fullClassName);
    }
  },

  getCSSVariable(varName: string): string {
    const window = getWindow();
    const document = getDocument();
    const root = window.getComputedStyle(document.documentElement);
    const property = '--ps-' + varName;
    return root.getPropertyValue(property).trim();
  },

  setCSS(el: HTMLElement, varName: string, varValue: string): void {
    if (el && el.style) {
      el.style.setProperty(varName, varValue);
    }
  },

  getClassName(this: DOMContext, name?: string): string {
    if (!name) return '';

    const prefix = this.getCSSVariable('prefix');
    if (prefix) {
      return prefix + name;
    }
    return name;
  },

  getIdName(this: DOMContext, name?: string): string {
    if (!name) return '';

    let prefix = this.getCSSVariable('prefix');
    if (prefix) {
      prefix = prefix.replace(/-/g, '_');
      return prefix + name;
    }
    return name;
  },

  getChildByClassName(this: DOMContext, name: string): HTMLElement[] {
    if (!this.el || !this.el.children) return [];

    const children = Array.from(this.el.children) as HTMLElement[];
    return children.filter((child) => this.hasClass(child, name));
  },
};
