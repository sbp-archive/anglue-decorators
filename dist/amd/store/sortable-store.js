define(['exports', '../utils'], function (exports, _utils) {
    'use strict';

    var _interopRequire = function (obj) { return obj && obj.__esModule ? obj['default'] : obj; };

    var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } };

    var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    Object.defineProperty(exports, '__esModule', {
        value: true
    });

    var _DecoratorUtils = _interopRequire(_utils);

    var SortableStoreDecorator = (function () {
        function SortableStoreDecorator(owner) {
            _classCallCheck(this, SortableStoreDecorator);

            this.owner = owner;
            this.sorters = new Map();
        }

        _createClass(SortableStoreDecorator, [{
            key: 'onItemsChanged',
            value: function onItemsChanged() {
                this.doSort();
            }
        }, {
            key: 'doSort',
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
                        if (!_iteratorNormalCompletion && _iterator['return']) {
                            _iterator['return']();
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
        }, {
            key: 'onSortChange',
            value: function onSortChange(sortInfo) {
                var _this = this;

                var property = sortInfo.property;
                var reverse = sortInfo.reverse;

                this.sorters.set('__sort', function (items) {
                    return _this.owner.filterService('orderBy')(items, property, reverse);
                });

                // We have to go through onItemsChanged so that other decorators can react
                // to this as well.
                this.owner.onItemsChanged();
            }
        }, {
            key: 'onItemsSorted',
            value: function onItemsSorted() {}
        }], [{
            key: 'decorateClass',
            value: function decorateClass(cls) {
                _DecoratorUtils.addInjections(cls, {
                    filterService: '$filter'
                });
            }
        }, {
            key: 'decorate',
            value: function decorate(owner) {
                var sortable = new SortableStoreDecorator(owner);

                Object.defineProperties(owner, {
                    sortable: {
                        value: sortable
                    }
                });

                _DecoratorUtils.intercept(owner, sortable, 'doSort');
                _DecoratorUtils.intercept(owner, sortable, 'onSortChange');
                _DecoratorUtils.intercept(owner, sortable, 'onItemsSorted');
                _DecoratorUtils.intercept(owner, sortable, 'onItemsChanged');
            }
        }]);

        return SortableStoreDecorator;
    })();

    exports.SortableStoreDecorator = SortableStoreDecorator;
    exports['default'] = SortableStoreDecorator;
});
//# sourceMappingURL=sortable-store.js.map