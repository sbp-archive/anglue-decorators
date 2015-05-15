define(['exports', '../utils'], function (exports, _utils) {
    'use strict';

    Object.defineProperty(exports, '__esModule', {
        value: true
    });

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    var _DecoratorUtils = _interopRequire(_utils);

    var FilterableStoreDecorator = (function () {
        function FilterableStoreDecorator(owner) {
            _classCallCheck(this, FilterableStoreDecorator);

            this.owner = owner;

            this.filtered = [];
            this.filters = new Map();
        }

        _createClass(FilterableStoreDecorator, [{
            key: 'onItemsChanged',
            value: function onItemsChanged() {
                this.doFilter();
            }
        }, {
            key: 'doFilter',
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
                        if (!_iteratorNormalCompletion && _iterator['return']) {
                            _iterator['return']();
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
        }, {
            key: 'onFilterChange',
            value: function onFilterChange(filterName, filter) {
                var _this = this;

                if (Object.prototype.toString.call(filter) === '[object String]') {
                    this.filters.set(filterName, function (items) {
                        return _this.owner.filterService('filter')(items, filter);
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
        }, {
            key: 'onFilterClear',
            value: function onFilterClear(filterName) {
                this.filters['delete'](filterName);
                this.doFilter();
            }
        }, {
            key: 'onSearchClear',
            value: function onSearchClear() {
                this.onFilterClear('__search');
            }
        }, {
            key: 'onSearchChange',
            value: function onSearchChange(expression) {
                this.onFilterChange('__search', expression);
            }
        }, {
            key: 'onItemsFiltered',
            value: function onItemsFiltered() {}
        }], [{
            key: 'decorateClass',
            value: function decorateClass(cls) {
                _DecoratorUtils.addInjections(cls, {
                    'filterService': '$filter'
                });
            }
        }, {
            key: 'decorate',
            value: function decorate(owner) {
                var filterable = new FilterableStoreDecorator(owner);

                Object.defineProperties(owner, {
                    filterable: {
                        value: filterable
                    },
                    filtered: {
                        get: function get() {
                            return filterable.filtered;
                        }
                    }
                });

                _DecoratorUtils.intercept(owner, filterable, 'doFilter');
                _DecoratorUtils.intercept(owner, filterable, 'onFilterChange');
                _DecoratorUtils.intercept(owner, filterable, 'onFilterClear');
                _DecoratorUtils.intercept(owner, filterable, 'onSearchChange');
                _DecoratorUtils.intercept(owner, filterable, 'onSearchClear');
                _DecoratorUtils.intercept(owner, filterable, 'onItemsFiltered');
                _DecoratorUtils.sequence(owner, filterable, 'onItemsChanged');
            }
        }]);

        return FilterableStoreDecorator;
    })();

    exports.FilterableStoreDecorator = FilterableStoreDecorator;
    exports['default'] = FilterableStoreDecorator;
});
//# sourceMappingURL=filterable-store.js.map