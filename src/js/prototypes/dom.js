export default {
    createEl(classes, tag) {
        const el = document.createElement(tag || 'div');
        if (classes) {
            classes.split(' ').forEach((className) => {
                this.addClass(el, className);
            });
        }
        return el;
    },

    counter() {
        const counter = document.getElementById(this.getIdName('current_slide'));
        counter.innerHTML = this.currentIndex + 1;
    },

    downloadURL() {
        const item = this.options.gallery[this.galleryId][this.currentIndex];
        this.tools.download.href = item.main;
    },

    addClass(el, className) {
        if (!this.hasClass(el, className) ) {
            el.className += (el.className ? ' ' : '') + this.getClassName(className);
        }
    },

    hasClass(el, className) {
        return el.className && new RegExp('(^|\\s)' + this.getClassName(className) + '(\\s|$)').test(el.className);
    },

    removeClass(el, className) {
        var reg = new RegExp('(\\s|^)' + this.getClassName(className) + '(\\s|$)');
        el.className = el.className.replace(reg, ' ').replace(/^\s\s*/, '').replace(/\s\s*$/, ''); 
    },

    getCSSVariable(varName) {
        const root = window.getComputedStyle(document.documentElement);
        const property = '--ps-' + varName;
        return root.getPropertyValue(property).replace(' ', '');
    },

    setCSS(el, varName, varValue) {
        el.style.setProperty(varName, varValue);
    },

    getClassName(name) {
        if (name && this.getCSSVariable('prefix')) {
            return this.getCSSVariable('prefix') + name;
        }
        
        return name;
    },

    getIdName(name) {
        if (name && this.getCSSVariable('prefix')) {
            let prefix = this.getCSSVariable('prefix');
            prefix = prefix.replace("-", "_");
            return prefix + name;
        }

        return name;
    },

    getChildByClassName(name) {
        const child = this.el.children;
        const childEl = [];

        for (let i = 0; i < child.length; i++) {
            if (this.hasClass(child[i], name)) {
                childEl.push(child[i]);
            }
        }

        return childEl;
    }
};