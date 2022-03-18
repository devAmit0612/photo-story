import {
    extend,
    deleteProps, 
    getCurrentObj, 
    getElement, 
    getGallery,
    getGalleryGroup,
    getGalleryType,
    isObject } from './shared/utils';

// Prototypes
import dom from './prototypes/dom';
import events from './prototypes/events';
import eventEmitter from './prototypes/event-emitter';
import fullscreen from './prototypes/fullscreen';
import animation from './prototypes/animation';
import slide from './prototypes/slide';

// Modules
import Modules from './modules/index';

import extendModuleDefaults from './shared/extendModule';
import defaults from './defaults';

const prototypes = {
    dom,
    events,
    eventEmitter,
    fullscreen,
    animation,
    slide,
};


class PhotoStory {
    constructor(...args) {
        const initial = args[0];
        
        if (initial.constructor && isObject(initial)) {
            [this.options, this.element] = args;
        } else {
            [this.element, this.options] = args;
        }
        
        if (this.element) {
            if (typeof this.element === 'string' || this.element instanceof String) {
                this.element = getElement(this.element);
            }
		} else {
            alert("Element is undefined");
            return false;
        }
        
        this.options = extend(this.options, defaults);
        this.currentIndex = 0;
        this.originalGallery = {};
        this.eventsListeners = {};
        this.modules = [...this.__modules];
        
        const ps = this;
        this.modules.forEach((initial) => {
            initial({
                ps,
                moduleDefaults: extendModuleDefaults(this.options, defaults, ps),
                on: ps.on.bind(ps),
                off: ps.off.bind(ps),
                emit: ps.emit.bind(ps)
            });
        });
        
        const links = [];
        this.element.forEach(el => {
            if (el && el.nodeName === 'A') {
                links.push(el);
            } else {
                const anchor = el.getElementsByTagName('a');
                links.push(...anchor);
            }
        });
        
        // Build gallery object
        let gallery = this.options.gallery;

        if (gallery && Object.keys(gallery).length === 0 && Object.getPrototypeOf(gallery) === Object.prototype) {
            this.originalGallery = getGalleryGroup(links);
            gallery = getGallery(this.originalGallery);
        }
        // Bind type of gallery with gallery
        gallery = getGalleryType(gallery);
        Object.assign(this.options.gallery, gallery);

        this.events = {
            click: 'click touchstart'
        };
        
        links.forEach(link => {
            this.attachEvents(link, this.events.click, (event) => {
                event.preventDefault();

                this.currentIndex = getCurrentObj(this.originalGallery, event.currentTarget).index;
                this.galleryId = getCurrentObj(this.originalGallery, event.currentTarget).id;
                this.open();
            });
        });
    }

    build() {
        const gallery = this.options.gallery[this.galleryId];
        const backdrop = this.createEl('lightbox__backdrop');

        this.el = this.createEl('lightbox');
        this.el.append(backdrop, this.toolbar(gallery));
        this.setSlides(gallery);
        document.body.appendChild(this.el);
        this.fadeIn(backdrop);
    }

    toolbar(gallery) {
        this.tools = {};
        const toolbar = this.createEl('lightbox__toolbar');
        const options = this.createEl('lightbox__toolbar__options');

        this.tools.close = this.createEl('button button--close', 'button');
        this.tools.close.type = 'button';
        this.tools.close.ariaLabel = 'Close gallery';
        this.tools.close.innerHTML = this.options.template.close;
        this.attachEvents(this.tools.close, this.events.click, () => {
            this.close();
        });

        if (this.options.showCounter) {
            const galleryItems = gallery.length;
            const html = `<span id="${this.getIdName('current_slide')}">${ps.currentIndex + 1}</span><span> / ${galleryItems}</span>`;
            this.tools.counter = this.createEl('lightbox__counter');
            this.tools.counter.innerHTML = html;
            toolbar.appendChild(this.tools.counter);
        }

        if (this.options.fullscreen) {
            this.tools.fullscreen = this.createEl('button button--fullscreen', 'button');
            this.tools.fullscreen.type = 'button';
            this.tools.fullscreen.ariaLabel = 'Fullscreen';
            this.tools.fullscreen.innerHTML = this.options.template.enterFullscreen;
            this.attachEvents(this.tools.fullscreen, this.events.click, () => {
                this.fullscreen();
            });
            options.appendChild(this.tools.fullscreen);
        }

        if (this.options.download) {
            this.tools.download = this.createEl('button button--download', 'a');
            this.downloadURL();
            this.tools.download.innerHTML = this.options.template.download;
            this.tools.download.download = '';
            this.tools.download.ariaLabel = 'Download image';
            options.appendChild(this.tools.download);
        }

        // Append elements
        options.appendChild(this.tools.close);
        toolbar.appendChild(options);
        
        return toolbar;
    }

    init() {
        if (!isObject(this)) {
            alert("Photo story is undefined");
            return false;
        }

        this.emit('beforeInit');
        this.build();
        this.emit('init');
        this.emit('afterInit');
    }

    open() {
        if (!isObject(this.options.gallery)) {
            alert("Gallery is undefined");
            return false;
        }

        if (!this.galleryId) {
            this.galleryId = Object.keys(this.options.gallery)[0];
        }

        this.init();
    }

    close() {
        this.exitFullscreen();
        
        this.currentIndex = 0;
        this.galleryId = null;
        
        
        Object.keys(this.tools).forEach((tool) => {
            this.detachEvents(this.tools[tool], ps.events.click);
            this.tools[tool] = null;
        });
        
        this.tools = null;

        const toolbar = this.getChildByClassName('lightbox__toolbar')[0];
        const backdrop = this.getChildByClassName('lightbox__backdrop')[0];
        const buttons = this.getChildByClassName('button');
        
        toolbar.style.opacity = 0;
        buttons.forEach(button => {
            button.style.opacity = 0;
        });

        this.fadeOut(backdrop, () => {
            document.body.removeChild(this.el);
        });
    }

    destroy() {
        this.emit('destroy');

        // Detach emitter events
        Object.keys(this.eventsListeners).forEach((eventName) => {
            this.off(eventName);
        });

        this.close();

        deleteProps(this);
    }

    static install(initial) {
        if (!PhotoStory.prototype.__modules) {
            PhotoStory.prototype.__modules = [];
        }
        const modules = PhotoStory.prototype.__modules;
        if (typeof initial === 'function' && modules.indexOf(initial) < 0) {
            modules.push(initial);
        }
    }

    static module(module) {
        if (Array.isArray(module)) {
            module.forEach((m) => PhotoStory.install(m));
            return PhotoStory;
        }
    }
}

Object.keys(prototypes).forEach((prototypeGroup) => {
    Object.keys(prototypes[prototypeGroup]).forEach((protoMethod) => {
        PhotoStory.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
    });
});

PhotoStory.module(Modules.Modules);

export default PhotoStory;