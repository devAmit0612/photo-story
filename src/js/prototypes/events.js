import { checkPassiveListener } from '../shared/utils';

export default {
    attachEvents(element, events, handler) {
        events.split(' ').forEach((event) => {
            if (!element.namespaces) {
                element.namespaces = {};
            }

            const touch = ['touchstart', 'touchmove'].indexOf(event) >= 0;
            const passive = checkPassiveListener();
            let param = false;

            if (touch && passive) {
                param = { passive: true };
            }

            element.namespaces[event] = handler;
            element.addEventListener(event, handler, param);
        });
    },

    detachEvents(element, events) {
        events.split(' ').forEach((event) => {
            if(element.namespaces && element.namespaces[event]) {
                element.removeEventListener(event, element.namespaces[event]);
                delete element.namespaces[event];
            }
        });
    }
    
}