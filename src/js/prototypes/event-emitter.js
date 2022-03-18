export default {
    on(events, handler) {
        if (typeof handler !== 'function') {
            return this;
        }
        
        events.split(' ').forEach((event) => {
            if (!this.eventsListeners[event]) {
                this.eventsListeners[event] = [];
            }
            this.eventsListeners[event].push(handler);
        });

        return this;
    },

    off(events, handler) {
        if (!this.eventsListeners) {
            return this;
        }

        events.split(' ').forEach((event) => {
            if (typeof handler === 'undefined') {
                this.eventsListeners[event] = [];
            } else if (this.eventsListeners[event]) {
                this.eventsListeners[event].forEach((eventHandler, index) => {
                    if (eventHandler === handler) {
                        this.eventsListeners[event].splice(index, 1);
                    }
                });
            }
        });

        return this;
    },

    emit(event, data) {
        if (!this.eventsListeners) {
            this.eventsListeners = {};
        }
        // console.log('this.eventsListeners :>> ', this.eventsListeners);

        if (typeof event === 'string') {
            data = event;
        }

        if (this.eventsListeners && this.eventsListeners[event]) {
            this.eventsListeners[event].forEach((eventHandler) => {
                eventHandler(data);
            });
        }

        return this;
    }
}