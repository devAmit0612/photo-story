import { getDocument } from 'ssr-window';
import {
  extend,
  deleteProps,
  getCurrentObj,
  getElement,
  getGallery,
  getGalleryGroup,
  getGalleryType,
  isNodeList,
  isObject,
} from './shared/utils';

import { type Options, type GalleryItem } from './types';

// Prototypes
import dom from './prototypes/dom';
import eventsProto from './prototypes/events';
import eventEmitter from './prototypes/eventEmitter';
import fullscreen from './prototypes/fullscreen';
import animation from './prototypes/animation';
import slides from './prototypes/slides';
import toolbar from './prototypes/toolbar';
import media from './prototypes/media';
import effect from './prototypes/effect';

import extendModuleDefaults from './shared/extendModule';
import defaults from './defaults';
import { PREFIX } from './const';

// Group prototypes for the mixin loop
const prototypes: Record<string, any> = {
  dom,
  events: eventsProto,
  eventEmitter,
  fullscreen,
  animation,
  toolbar,
  slides,
  media,
  effect,
};

// Define the shape of a PhotoStory Module
export type PhotoStoryModule = (context: {
  ps: PhotoStory;
  moduleDefaults: ReturnType<typeof extendModuleDefaults>;
  on: PhotoStory['on'];
  off: PhotoStory['off'];
  emit: PhotoStory['emit'];
}) => void;

interface PhotoStory {
  createEl(classes?: string, tag?: string): HTMLElement;
  toolbar(gallery: GalleryItem[]): HTMLElement;
  downloadURL(): void;
  getIdName(name: string): string;
  getChildByClassName(name: string): HTMLElement[];
  attachEvents(
    element: HTMLElement | Window | Document,
    events: string,
    handler: EventListenerOrEventListenerObject
  ): void;
  detachEvents(element: HTMLElement | Window | Document, events: string): void;
  on(events: string, handler: Function): this;
  off(events: string, handler?: Function): this;
  emit(event: string, data?: any): this;
  enterFullscreen(): void;
  exitFullscreen(): void;
  enterEffect(): void;
  exitEffect(): void;
  fullscreen(): void;
  fadeIn(el: HTMLElement, cb?: () => void, duration?: number, easing?: string): void;
  fadeOut(el: HTMLElement, cb?: () => void, duration?: number, easing?: string): void;
  setSlides(gallery: GalleryItem[]): void;
  changeSlide(newIndex: number, isInitial?: boolean): void;
}

class PhotoStory {
  static __modules: PhotoStoryModule[] = [];

  public options: Options;
  public element: HTMLElement[];
  public currentIndex: number = 0;
  public originalGallery: Map<string, HTMLElement[]> = new Map();
  public eventsListeners: Record<string, Function[]> = {};
  public modules: PhotoStoryModule[];
  public galleryId: string | null = null;
  public el!: HTMLElement;
  public wrapperEl!: HTMLElement;
  public slidesEl!: HTMLElement;
  public backdropEl!: HTMLElement;
  public currentMediaEl: HTMLElement | null = null;
  public currentThumbEl: HTMLElement | null = null;
  public tools: Record<string, HTMLElement | HTMLAnchorElement | HTMLButtonElement | null> = {};
  public events: { click: string };

  // Constructor Overloads to allow (options, element) or (element, options)
  constructor(element: string | HTMLElement | NodeListOf<HTMLElement>, options?: Partial<Options>);
  constructor(options: Partial<Options>, element?: string | HTMLElement | NodeListOf<HTMLElement>);
  constructor(...args: any[]) {
    const initial = args[0];
    let rawElement: any;
    let rawOptions: any;

    if (initial && initial.constructor && isObject(initial)) {
      [rawOptions, rawElement] = args;
    } else {
      [rawElement, rawOptions] = args;
    }

    // Normalize the Element into a strict HTMLElement Array
    this.element = [];
    if (rawElement) {
      const retrieved = typeof rawElement === 'string' ? getElement(rawElement) : rawElement;

      if (isNodeList(retrieved) || Array.isArray(retrieved)) {
        this.element = Array.from(retrieved as ArrayLike<HTMLElement>);
      } else if (retrieved) {
        this.element = [retrieved as HTMLElement];
      }
    }

    if (this.element.length === 0) {
      console.warn('PhotoStory: Element is undefined or not found in the DOM.');
    }

    // Options Setup
    this.options = extend({}, defaults, rawOptions || {}) as Options;
    this.modules = [...PhotoStory.__modules];

    const ps = this;
    this.modules.forEach((moduleInit) => {
      moduleInit({
        ps,
        moduleDefaults: extendModuleDefaults(this.options, defaults, ps),
        on: ps.on.bind(ps),
        off: ps.off.bind(ps),
        emit: ps.emit.bind(ps),
      });
    });

    // Extract Links
    const links: HTMLElement[] = [];
    this.element.forEach((el) => {
      if (el && el.nodeName === 'A') {
        links.push(el);
      } else {
        const anchors = Array.from(el.getElementsByTagName('a'));
        links.push(...anchors);
      }
    });

    // Build gallery object
    let gallery = this.options.gallery as any;

    if (gallery && Object.keys(gallery).length === 0) {
      this.originalGallery = getGalleryGroup(links);
      gallery = getGallery(this.originalGallery);
    }

    gallery = getGalleryType(gallery);
    Object.assign(this.options.gallery, gallery);

    this.events = {
      click: 'click touchstart',
    };

    // Attach core click events
    links.forEach((link) => {
      this.attachEvents(link, this.events.click, (event: Event) => {
        event.preventDefault();
        const target = event.currentTarget as HTMLElement;
        const currentObj = getCurrentObj(this.originalGallery, target);

        this.currentThumbEl = target.querySelector('img') as HTMLImageElement;
        this.currentIndex = currentObj.index;
        this.galleryId = currentObj.id || null;
        this.open();
      });
    });
  }

  build(): void {
    if (!this.galleryId || !this.options.gallery[this.galleryId]) return;

    const document = getDocument();
    if (!document.body?.appendChild) return;

    this.wrapperEl = this.createEl();
    this.wrapperEl.id = `${PREFIX}_wrapper`;

    const gallery = this.options.gallery[this.galleryId];
    const tb = this.toolbar(gallery);

    this.backdropEl = this.createEl(`${PREFIX}__backdrop`);
    this.wrapperEl.append(this.backdropEl, tb);

    this.el = this.createEl(`${PREFIX}`);
    this.el.append(this.wrapperEl);

    if (typeof this.setSlides === 'function') {
      this.setSlides(gallery);
    }

    document.body.appendChild(this.el);
    this.enterEffect();
  }

  init(): boolean | void {
    if (!isObject(this)) {
      console.error('Photo story is undefined');
      return false;
    }

    this.emit('beforeInit');
    this.build();
    this.emit('init');
    this.emit('afterInit');
  }

  open(): boolean | void {
    if (!isObject(this.options.gallery)) {
      console.error('Gallery is undefined');
      return false;
    }

    if (!this.galleryId) {
      this.galleryId = Object.keys(this.options.gallery)[0];
    }

    this.init();
  }

  close(): void {
    this.exitFullscreen();
    this.exitEffect();

    this.currentIndex = 0;
    this.galleryId = null;

    // Detach events from tools
    Object.keys(this.tools).forEach((tool) => {
      const toolEl = this.tools[tool];
      if (toolEl) {
        this.detachEvents(toolEl, this.events.click);
        this.tools[tool] = null;
      }
    });
  }

  destroy(): void {
    this.emit('destroy');

    Object.keys(this.eventsListeners).forEach((eventName) => {
      this.off(eventName);
    });

    this.close();
    deleteProps(this as any);
  }

  static install(moduleInit: PhotoStoryModule): void {
    if (typeof moduleInit === 'function' && PhotoStory.__modules.indexOf(moduleInit) < 0) {
      PhotoStory.__modules.push(moduleInit);
    }
  }

  static module(module: PhotoStoryModule[]): typeof PhotoStory | void {
    if (Array.isArray(module)) {
      module.forEach((m) => PhotoStory.install(m));
      return PhotoStory;
    }
  }
}

// Apply Prototypes to Class
Object.keys(prototypes).forEach((prototypeGroup) => {
  Object.keys(prototypes[prototypeGroup]).forEach((protoMethod) => {
    (PhotoStory.prototype as any)[protoMethod] = prototypes[prototypeGroup][protoMethod];
  });
});

export default PhotoStory;
