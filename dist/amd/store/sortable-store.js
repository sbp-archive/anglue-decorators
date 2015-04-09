define(["exports", "../utils"], function (exports, _utils) {
    "use strict";

    var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

    var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

    var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var DecoratorUtils = _interopRequire(_utils);

    var SortableStoreDecorator = exports.SortableStoreDecorator = (function () {
        function SortableStoreDecorator(owner) {
            _classCallCheck(this, SortableStoreDecorator);

            this.owner = owner;
            this.sorters = new Map();
        }

        _createClass(SortableStoreDecorator, {
            onItemsChanged: {
                value: function onItemsChanged() {
                    this.doSort();
                }
            },
            doSort: {
                value: function doSort() {
                    var sorted = this.owner.items;
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = this.sorters.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var _step$value = _slicedToArray(_step.value, 2);

                            var key = _step$value[0];
                            var sortFn = _step$value[1];

                            sorted = sortFn(sorted);
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

                    this.owner.items = sorted;
                    this.owner.onItemsSorted(sorted);
                }
            },
            onSortChange: {
                value: function onSortChange(sortInfo) {
                    var _this = this;

                    var property = sortInfo.property;
                    var reverse = sortInfo.reverse;

                    this.sorters.set("__sort", function (items) {
                        return _this.owner.filterService("orderBy")(items, property, reverse);
                    });

                    // We have to go through onItemsChanged so that other decorators can react
                    // to this as well.
                    this.owner.onItemsChanged();
                }
            },
            onItemsSorted: {
                value: function onItemsSorted() {}
            }
        }, {
            decorateClass: {
                value: function decorateClass(cls) {
                    DecoratorUtils.addInjections(cls, {
                        filterService: "$filter"
                    });
                }
            },
            decorate: {
                value: function decorate(owner) {
                    var sortable = new SortableStoreDecorator(owner);

                    Object.defineProperties(owner, {
                        sortable: {
                            value: sortable
                        }
                    });

                    DecoratorUtils.intercept(owner, sortable, "doSort");
                    DecoratorUtils.intercept(owner, sortable, "onSortChange");
                    DecoratorUtils.intercept(owner, sortable, "onItemsSorted");
                    DecoratorUtils.intercept(owner, sortable, "onItemsChanged");
                }
            }
        });

        return SortableStoreDecorator;
    })();

    exports["default"] = SortableStoreDecorator;
});
//# sourceMappingURL=sortable-store.js.map