import { checkPassiveListener } from '../shared/utils';

export type NamespacedElement = (HTMLElement | Document | Window) & {
  namespaces?: Record<string, EventListenerOrEventListenerObject>;
};

export default {
  attachEvents(
    element: NamespacedElement,
    events: string,
    handler: EventListenerOrEventListenerObject,
    options?: AddEventListenerOptions | boolean
  ): void {
    const isPassiveSupported = checkPassiveListener();

    events.split(' ').forEach((event) => {
      if (!element.namespaces) {
        element.namespaces = {};
      }

      const isTouch = ['touchstart', 'touchmove', 'wheel'].includes(event);

      let param: boolean | AddEventListenerOptions = false;
      if (isTouch && isPassiveSupported) {
        param = { passive: true };
      }

      // OVERRIDE options if provided!
      if (options !== undefined) {
        if (typeof options === 'object' && typeof param === 'object') {
          param = { ...param, ...options };
        } else {
          param = options;
        }
      }

      // Fallback for ancient browsers that don't support objects in addEventListener
      if (typeof param === 'object' && !isPassiveSupported) {
        param = param.capture || false;
      }

      // Make this an array in the future: element.namespaces[event] = [handlers...]
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
