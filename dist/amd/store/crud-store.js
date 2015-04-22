define(['exports', '../utils'], function (exports, _utils) {
    'use strict';

    var _interopRequire = function (obj) { return obj && obj.__esModule ? obj['default'] : obj; };

    var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    Object.defineProperty(exports, '__esModule', {
        value: true
    });

    var _DecoratorUtils = _interopRequire(_utils);

    var CrudStoreDecorator = (function () {
        function CrudStoreDecorator(owner) {
            _classCallCheck(this, CrudStoreDecorator);

            this.owner = owner;

            this.items = [];
            this.isLoaded = false;
            this.isLoading = false;
            this.isSaving = false;

            this.hasDetailsMap = {};
        }

        _createClass(CrudStoreDecorator, [{
            key: 'isEmpty',
            get: function () {
                return this.isLoaded && this.items.length === 0;
            }
        }, {
            key: 'getById',
            value: function getById(id) {
                return this.items.find(function (element) {
                    return element.id === id;
                });
            }
        }, {
            key: 'hasDetails',
            value: function hasDetails(id) {
                return !!this.hasDetailsMap[id];
            }
        }, {
            key: 'onLoadStarted',
            value: function onLoadStarted() {
                this.isLoading = true;
            }
        }, {
            key: 'onGetStarted',
            value: function onGetStarted() {
                this.isLoading = true;
            }
        }, {
            key: 'onUpdateStarted',
            value: function onUpdateStarted() {
                this.isSaving = true;
            }
        }, {
            key: 'onCreateStarted',
            value: function onCreateStarted() {
                this.isSaving = true;
            }
        }, {
            key: 'onDeleteStarted',
            value: function onDeleteStarted() {
                this.isSaving = true;
            }
        }, {
            key: 'onLoadCompleted',
            value: function onLoadCompleted(all) {
                this.isLoading = false;
                this.isLoaded = true;
                this.items = all;
                this.owner.onItemsChanged();
            }
        }, {
            key: 'onGetCompleted',
            value: function onGetCompleted(item) {
                this.isLoading = false;
                if (!this.getById(item.id)) {
                    this.items.push(item);
                } else {
                    Object.assign(this.getById(item.id), item);
                }
                this.hasDetailsMap[item.id] = true;
                this.owner.onItemsChanged();
            }
        }, {
            key: 'onCreateCompleted',
            value: function onCreateCompleted(item) {
                this.isSaving = false;
                this.items.push(item);
                this.owner.onItemsChanged();
            }
        }, {
            key: 'onUpdateCompleted',
            value: function onUpdateCompleted(item) {
                this.isSaving = false;
                Object.assign(this.getById(item.id), item);

                if ('appActions' in this && 'publishSuccessMessage' in this.appActions) {
                    this.appActions.publishSuccessMessage('Update completed');
                }

                this.owner.onItemsChanged();
            }
        }, {
            key: 'onDeleteCompleted',
            value: function onDeleteCompleted(item) {
                this.isSaving = false;
                item = this.getById(item.id);
                if (item) {
                    this.items.splice(this.items.indexOf(item), 1);
                }
                this.owner.onItemsChanged();
            }
        }, {
            key: 'onLoadFailed',
            value: function onLoadFailed(response) {
                this.onFailed(response);
            }
        }, {
            key: 'onCreateFailed',
            value: function onCreateFailed(response) {
                this.onFailed(response);
            }
        }, {
            key: 'onGetFailed',
            value: function onGetFailed(response) {
                this.onFailed(response);
            }
        }, {
            key: 'onUpdateFailed',
            value: function onUpdateFailed(response) {
                this.onFailed(response);
            }
        }, {
            key: 'onDeleteFailed',
            value: function onDeleteFailed(response) {
                this.onFailed(response);
            }
        }, {
            key: 'onFailed',
            value: function onFailed(response) {
                this.isLoading = false;
                this.isSaving = false;

                if ('appActions' in this && 'publishErrorMessage' in this.appActions) {
                    this.appActions.publishErrorMessage(response.statusText, JSON.stringify(response.data));
                }

                if ('onFailed' in this.owner) {
                    this.owner.onFailed(response);
                }
            }
        }], [{
            key: 'decorate',
            value: function decorate(owner) {
                var crud = new CrudStoreDecorator(owner);

                Object.defineProperties(owner, {
                    crud: {
                        value: crud
                    },
                    items: {
                        get: function get() {
                            return crud.items;
                        },
                        set: function set(items) {
                            crud.items = items;
                        }
                    },
                    isLoaded: {
                        get: function get() {
                            return crud.isLoaded;
                        },
                        set: function set(isLoaded) {
                            crud.isLoaded = isLoaded;
                        }
                    },
                    isLoading: {
                        get: function get() {
                            return crud.isLoading;
                        },
                        set: function set(isLoading) {
                            crud.isLoading = isLoading;
                        }
                    },
                    isSaving: {
                        get: function get() {
                            return crud.isSaving;
                        },
                        set: function set(isSaving) {
                            crud.isSaving = isSaving;
                        }
                    },
                    isEmpty: {
                        get: function get() {
                            return crud.isEmpty;
                        }
                    },
                    hasDetails: {
                        value: crud.hasDetails.bind(crud)
                    },
                    getById: {
                        value: crud.getById.bind(crud)
                    },
                    onItemsChanged: {
                        configurable: true,
                        writable: true,
                        value: function value() {}
                    }
                });

                _DecoratorUtils.intercept(owner, crud, 'onLoadStarted');
                _DecoratorUtils.intercept(owner, crud, 'onCreateStarted');
                _DecoratorUtils.intercept(owner, crud, 'onGetStarted');
                _DecoratorUtils.intercept(owner, crud, 'onUpdateStarted');
                _DecoratorUtils.intercept(owner, crud, 'onDeleteStarted');

                _DecoratorUtils.intercept(owner, crud, 'onLoadCompleted');
                _DecoratorUtils.intercept(owner, crud, 'onCreateCompleted');
                _DecoratorUtils.intercept(owner, crud, 'onGetCompleted');
                _DecoratorUtils.intercept(owner, crud, 'onUpdateCompleted');
                _DecoratorUtils.intercept(owner, crud, 'onDeleteCompleted');

                _DecoratorUtils.intercept(owner, crud, 'onLoadFailed');
                _DecoratorUtils.intercept(owner, crud, 'onCreateFailed');
                _DecoratorUtils.intercept(owner, crud, 'onGetFailed');
                _DecoratorUtils.intercept(owner, crud, 'onUpdateFailed');
                _DecoratorUtils.intercept(owner, crud, 'onDeleteFailed');
            }
        }]);

        return CrudStoreDecorator;
    })();

    exports.CrudStoreDecorator = CrudStoreDecorator;
    exports['default'] = CrudStoreDecorator;
});
//# sourceMappingURL=crud-store.js.map