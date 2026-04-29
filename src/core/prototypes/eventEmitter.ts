export type EventHandler = (data?: any) => void;

export interface EmitterContext {
  eventsListeners?: Record<string, EventHandler[]>;
  on(events: string, handler: EventHandler): this;
  off(events: string, handler?: EventHandler): this;
  emit(event: string, data?: any): this;
}

export default {
  on(this: EmitterContext, events: string, handler: EventHandler): EmitterContext {
    if (typeof handler !== 'function') {
      return this;
    }

    if (!this.eventsListeners) {
      this.eventsListeners = {};
    }

    events.split(' ').forEach((event) => {
      if (!this.eventsListeners![event]) {
        this.eventsListeners![event] = [];
      }
      this.eventsListeners![event].push(handler);
    });

    return this;
  },

  off(this: EmitterContext, events: string, handler?: EventHandler): EmitterContext {
    if (!this.eventsListeners) {
      return this;
    }

    events.split(' ').forEach((event) => {
      if (typeof handler === 'undefined') {
        this.eventsListeners![event] = [];
      } else if (this.eventsListeners![event]) {
        this.eventsListeners![event].forEach((eventHandler, index) => {
          if (eventHandler === handler) {
            this.eventsListeners![event].splice(index, 1);
          }
        });
      }
    });

    return this;
  },

  emit(this: EmitterContext, event: string, data?: any): EmitterContext {
    if (!this.eventsListeners) {
      this.eventsListeners = {};
    }

    if (this.eventsListeners[event]) {
      this.eventsListeners[event].forEach((eventHandler) => {
        eventHandler(data);
      });
    }

    return this;
  },
};
