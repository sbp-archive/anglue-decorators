define(["exports"], function (exports) {
    "use strict";

    var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var SortableComponent = exports.SortableComponent = (function () {
        function SortableComponent(owner) {
            _classCallCheck(this, SortableComponent);

            this.owner = owner;
        }

        _createClass(SortableComponent, {
            setSortProperty: {
                value: function setSortProperty(sortProperty) {
                    this.sortBy(sortProperty, this.sortReverse);
                }
            },
            setSortReverse: {
                value: function setSortReverse(sortReverse) {
                    this.sortBy(this.sortProperty, sortReverse);
                }
            },
            getSortProperty: {
                value: function getSortProperty() {
                    if (this.sortProperty === undefined) {
                        this.sortProperty = null;
                    }
                    return this.sortProperty;
                }
            },
            getSortReverse: {
                value: function getSortReverse() {
                    if (this.sortReverse === undefined) {
                        this.sortReverse = false;
                    }
                    return this.sortReverse;
                }
            },
            sortBy: {
                value: function sortBy(sortProperty, sortReverse) {
                    if (this.sortProperty === sortProperty) {
                        if (sortReverse === undefined) {
                            sortReverse = !this.sortReverse;
                        }
                    } else if (sortReverse === undefined) {
                        sortReverse = false;
                    }

                    if (this.sortProperty !== sortProperty || this.sortReverse !== sortReverse) {
                        this.sortProperty = sortProperty;
                        this.sortReverse = sortReverse;

                        if (this.owner._dispatchSort) {
                            this.owner._dispatchSort({
                                property: this.sortProperty,
                                reverse: this.sortReverse
                            });
                        }
                    }
                }
            }
        }, {
            decorate: {
                value: function decorate(owner) {
                    var sortable = new SortableComponent(owner);
                    Object.defineProperties(owner, {
                        sortable: {
                            configurable: false,
                            writable: false,
                            enumerable: false,
                            value: sortable
                        },
                        sortProperty: {
                            get: sortable.getSortProperty.bind(sortable),
                            set: sortable.setSortProperty.bind(sortable)
                        },
                        sortReverse: {
                            get: sortable.getSortReverse.bind(sortable),
                            set: sortable.setSortReverse.bind(sortable)
                        },
                        sortBy: {
                            configurable: false,
                            writable: false,
                            enumerable: false,
                            value: sortable.sortBy.bind(sortable)
                        }
                    });
                }
            }
        });

        return SortableComponent;
    })();

    exports["default"] = SortableComponent;
});
//# sourceMappingURL=sortable-component.js.map