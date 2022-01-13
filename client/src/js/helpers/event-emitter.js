class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(event, cb) {
        if (!this.events[event]) {
            this.events[event] = [];
        }

        this.events[event].push(cb);

        return () => {
            this.events[event] = this.events[event].filter(
                (callbacks) => callbacks !== cb
            );
        };
    }

    emit(event, payload) {
        if (!this.events[event]) {
            return;
        }

        this.events[event].forEach((cb) => {
            cb(payload);
        });
    }
}

export const ee = new EventEmitter();
