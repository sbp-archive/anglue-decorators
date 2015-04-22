define(['exports'], function (exports) {
    'use strict';

    var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    Object.defineProperty(exports, '__esModule', {
        value: true
    });

    var Observable = (function () {
        function Observable(instance) {
            _classCallCheck(this, Observable);

            this.instance = instance;
        }

        _createClass(Observable, [{
            key: 'events',
            get: function () {
                if (!this._events) {
                    this._events = new Map();
                }
                return this._events;
            }
        }, {
            key: 'addListener',
            value: function addListener(event, handler) {
                var events = this.events;
                if (!events[event]) {
                    events[event] = new Set();
                }
                events[event].add(handler);
            }
        }, {
            key: 'removeListener',
            value: function removeListener(event, handler) {
                var events = this.events;
                if (!events[event]) {
                    return;
                }
                events['delete'](handler);
            }
        }, {
            key: 'emit',
            value: function emit(event) {
                var events = this.events;
                if (!events[event]) {
                    return;
                }

                var args = Array.from(arguments).slice(1);
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = events[event][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var handler = _step.value;

                        handler.apply(this.instance, args);
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator['return']) {
                            _iterator['return']();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            }
        }], [{
            key: 'decorate',
            value: function decorate(instance) {
                var observable = new Observable(instance);
                Object.defineProperties(instance, {
                    observable: {
                        configurable: false,
                        writable: false,
                        enumerable: false,
                        value: observable
                    },
                    on: {
                        value: observable.addListener.bind(observable)
                    },
                    addListener: {
                        value: observable.addListener.bind(observable)
                    },
                    removeListener: {
                        value: observable.removeListener.bind(observable)
                    },
                    emit: {
                        value: observable.emit.bind(observable)
                    }
                });
            }
        }]);

        return Observable;
    })();

    exports.Observable = Observable;
    exports['default'] = Observable;
});
//# sourceMappingURL=observable.js.map