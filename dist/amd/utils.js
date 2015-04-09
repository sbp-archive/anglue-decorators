define(["exports"], function (exports) {
    "use strict";

    var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var DecoratorUtils = exports.DecoratorUtils = (function () {
        function DecoratorUtils() {
            _classCallCheck(this, DecoratorUtils);
        }

        _createClass(DecoratorUtils, null, {
            addInjections: {
                value: function addInjections(cls, newInjections) {
                    var injectionsProperty = Object.getOwnPropertyDescriptor(cls, "injections");
                    var oldInjectionsGetter = injectionsProperty.get;

                    Object.defineProperty(cls, "injections", {
                        get: function () {
                            var injections = oldInjectionsGetter();
                            var _iteratorNormalCompletion = true;
                            var _didIteratorError = false;
                            var _iteratorError = undefined;

                            try {
                                for (var _iterator = Object.keys(newInjections)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                    var binding = _step.value;

                                    if (injections[binding] === undefined) {
                                        injections[binding] = newInjections[binding];
                                    }
                                }
                            } catch (err) {
                                _didIteratorError = true;
                                _iteratorError = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion && _iterator["return"]) {
                                        _iterator["return"]();
                                    }
                                } finally {
                                    if (_didIteratorError) {
                                        throw _iteratorError;
                                    }
                                }
                            }

                            return injections;
                        }
                    });
                }
            },
            intercept: {
                value: function intercept(obj, decorator, methodName) {
                    Object.defineProperty(obj, methodName, {
                        configurable: true,
                        writeable: true,
                        value: (function (originalMethod) {
                            var args = Array.from(arguments).slice(1);
                            var retVal = decorator[methodName].apply(decorator, args);
                            if (originalMethod instanceof Function) {
                                args.push(retVal);
                                retVal = originalMethod.apply(obj, args);
                            }
                            return retVal;
                        }).bind(decorator, obj[methodName])
                    });
                }
            },
            sequence: {
                value: function sequence(obj, decorator, methodName) {
                    Object.defineProperty(obj, methodName, {
                        configurable: true,
                        writeable: true,
                        value: (function (originalMethod) {
                            var args = Array.from(arguments).slice(1);
                            if (originalMethod instanceof Function) {
                                args.push(originalMethod.apply(obj, args));
                            }
                            return decorator[methodName].apply(decorator, args);
                        }).bind(decorator, obj[methodName])
                    });
                }
            }
        });

        return DecoratorUtils;
    })();

    exports["default"] = DecoratorUtils;
});
//# sourceMappingURL=utils.js.map