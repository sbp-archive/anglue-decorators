export class Observable {
    static decorate(instance) {
        var observable = new Observable(instance);
        Object.defineProperties(instance, {
            observable: {
                configurable: false,
                writable: false,
                enumerable: false,
                value: observable
            },
            'on': {
                value: observable.addListener.bind(observable)
            },
            'addListener': {
                value: observable.addListener.bind(observable)
            },
            'removeListener': {
                value: observable.removeListener.bind(observable)
            },
            'emit': {
                value: observable.emit.bind(observable)
            }
        });
    }

    constructor(instance) {
        this.instance = instance;
    }

    get events() {
        if (!this._events) {
            this._events = new Map();
        }
        return this._events;
    }

    addListener(event, handler) {
        var events = this.events;
        if (!events[event]) {
            events[event] = new Set();
        }
        events[event].add(handler);
    }

    removeListener(event, handler) {
        var events = this.events;
        if (!events[event]) {
            return;
        }
        events.delete(handler);
    }

    emit(event) {
        var events = this.events;
        if (!events[event]) {
            return;
        }

        var args = Array.from(arguments).slice(1);
        for (let handler of events[event]) {
            handler.apply(this.instance, args);
        }
    }
}
export default Observable;
