define(["exports", "../utils"], function (exports, _utils) {
    "use strict";

    var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

    var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var DecoratorUtils = _interopRequire(_utils);

    var FilterableStoreDecorator = exports.FilterableStoreDecorator = (function () {
        function FilterableStoreDecorator(owner) {
            _classCallCheck(this, FilterableStoreDecorator);

            this.owner = owner;

            this.filtered = [];
            this.filters = new Map();
        }

        _createClass(FilterableStoreDecorator, {
            onItemsChanged: {
                value: function onItemsChanged() {
                    this.doFilter();
                }
            },
            doFilter: {
                value: function doFilter() {
                    var filtered = this.owner.items.slice();
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = this.filters.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var filterFn = _step.value;

                            filtered = filterFn(filtered);
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

                    this.filtered = filtered;
                    this.owner.onItemsFiltered(filtered);
                }
            },
            onFilterChange: {
                value: function onFilterChange(filterName, filter) {
                    var _this = this;

                    if (Object.prototype.toString.call(filter) === "[object String]") {
                        this.filters.set(filterName, function (items) {
                            return _this.owner.filterService("filter")(items, filter);
                        });
                    } else {
                        this.filters.set(filterName, function (items) {
                            return items.filter(function (item) {
                                var exclude = filter.exclude;
                                var filterProperty = filter.property;
                                var filterValues = filter.value;
                                var value = item[filterProperty];

                                if (filterValues) {
                                    if (!Array.isArray(filterValues)) {
                                        filterValues = [filterValues];
                                    }

                                    for (var i = 0, ln = filterValues.length; i < ln; i++) {
                                        var filterValue = filterValues[i];
                                        if (value === filterValue) {
                                            return !exclude;
                                        }
                                    }
                                }

                                return !!exclude;
                            });
                        });
                    }
                    this.doFilter();
                }
            },
            onFilterClear: {
                value: function onFilterClear(filterName) {
                    this.filters["delete"](filterName);
                    this.doFilter();
                }
            },
            onSearchClear: {
                value: function onSearchClear() {
                    this.onFilterClear("__search");
                }
            },
            onSearchChange: {
                value: function onSearchChange(expression) {
                    this.onFilterChange("__search", expression);
                }
            },
            onItemsFiltered: {
                value: function onItemsFiltered() {}
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
                    var filterable = new FilterableStoreDecorator(owner);

                    Object.defineProperties(owner, {
                        filterable: {
                            value: filterable
                        },
                        filtered: {
                            get: function () {
                                return filterable.filtered;
                            }
                        }
                    });

                    DecoratorUtils.intercept(owner, filterable, "doFilter");
                    DecoratorUtils.intercept(owner, filterable, "onFilterChange");
                    DecoratorUtils.intercept(owner, filterable, "onFilterClear");
                    DecoratorUtils.intercept(owner, filterable, "onSearchChange");
                    DecoratorUtils.intercept(owner, filterable, "onSearchClear");
                    DecoratorUtils.intercept(owner, filterable, "onItemsFiltered");
                    DecoratorUtils.sequence(owner, filterable, "onItemsChanged");
                }
            }
        });

        return FilterableStoreDecorator;
    })();

    exports["default"] = FilterableStoreDecorator;
});
//# sourceMappingURL=filterable-store.js.map