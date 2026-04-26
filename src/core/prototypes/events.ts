import { checkPassiveListener } from '../shared/utils';

export type NamespacedElement = (HTMLElement | Document | Window) & {
  namespaces?: Record<string, EventListenerOrEventListenerObject>;
};

export default {
  attachEvents(
    element: NamespacedElement,
    events: string,
    handler: EventListenerOrEventListenerObject
  ): void {
    events.split(' ').forEach((event) => {
      if (!element.namespaces) {
        element.namespaces = {};
      }

      const isTouch = ['touchstart', 'touchmove'].includes(event);
      const isPassiveSupported = checkPassiveListener();
      let param: boolean | AddEventListenerOptions = false;

      if (isTouch && isPassiveSupported) {
        param = { passive: true };
      }

      element.namespaces[event] = handler;
      element.addEventListener(event, handler, param);
    });
  },

  detachEvents(element: NamespacedElement, events: string): void {
    events.split(' ').forEach((event) => {
      if (element.namespaces && element.namespaces[event]) {
        const handler = element.namespaces[event];
        element.removeEventListener(event, handler);

        delete element.namespaces[event];
      }
    });
  },
};
