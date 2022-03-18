export default function Navigation({ps, moduleDefaults, on, emit}) {

    moduleDefaults({
        navigation: {
            next: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M7.828 11H20v2H7.828l5.364 5.364-1.414 1.414L4 12l7.778-7.778 1.414 1.414z"/>
                </svg>`,
            prev: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"/>
                </svg>`
        }
    });

    const options = ps.options;
    if (!options.navigation.enable) {
        return false;
    }

    ps.navigation = {
        nextEl: null,
        prevEl: null,
    }

    function init() {
        let {nextEl, prevEl} = ps.navigation;
        
        nextEl = ps.createEl('button button--next', 'button');
        prevEl = ps.createEl('button button--prev', 'button');
        nextEl.type = prevEl.type = 'button';
        nextEl.innerHTML = options.navigation.next;
        prevEl.innerHTML = options.navigation.prev;
        nextEl.ariaLabel = 'Next slide';
        prevEl.ariaLabel = 'Prev slide';

        ps.attachEvents(nextEl, ps.events.click, () => {
            ps.currentIndex++;
            ps.counter();
        });
        
        ps.attachEvents(prevEl, ps.events.click, () => {
            ps.currentIndex--;
            ps.counter();
        });

        ps.el.append(nextEl, prevEl);
        Object.assign(ps.navigation, {nextEl, prevEl});
    }

    function destroy() {
        const navigation = ps.navigation;

        Object.keys(navigation).forEach((nav) => {
            ps.detachEvents(navigation[nav], ps.events.click);
            navigation[nav] = null;
        });
    }

    on('init', () => {
        init();
    });

    on('destroy', () => {
        destroy();
    });
    
}