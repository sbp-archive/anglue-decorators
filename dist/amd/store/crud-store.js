define(["exports", "../utils"], function (exports, _utils) {
    "use strict";

    var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

    var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var DecoratorUtils = _interopRequire(_utils);

    var CrudStoreDecorator = exports.CrudStoreDecorator = (function () {
        function CrudStoreDecorator(owner) {
            _classCallCheck(this, CrudStoreDecorator);

            this.owner = owner;

            this.items = [];
            this.isLoaded = false;
            this.isLoading = false;
            this.isSaving = false;

            this.hasDetailsMap = {};
        }

        _createClass(CrudStoreDecorator, {
            isEmpty: {
                get: function () {
                    return this.isLoaded && this.items.length === 0;
                }
            },
            getById: {
                value: function getById(id) {
                    return this.items.find(function (element) {
                        return element.id === id;
                    });
                }
            },
            hasDetails: {
                value: function hasDetails(id) {
                    return !!this.hasDetailsMap[id];
                }
            },
            onLoadStarted: {
                value: function onLoadStarted() {
                    this.isLoading = true;
                }
            },
            onGetStarted: {
                value: function onGetStarted() {
                    this.isLoading = true;
                }
            },
            onUpdateStarted: {
                value: function onUpdateStarted() {
                    this.isSaving = true;
                }
            },
            onCreateStarted: {
                value: function onCreateStarted() {
                    this.isSaving = true;
                }
            },
            onDeleteStarted: {
                value: function onDeleteStarted() {
                    this.isSaving = true;
                }
            },
            onLoadCompleted: {
                value: function onLoadCompleted(all) {
                    this.isLoading = false;
                    this.isLoaded = true;
                    this.items = all;
                    this.owner.onItemsChanged();
                }
            },
            onGetCompleted: {
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
            },
            onCreateCompleted: {
                value: function onCreateCompleted(item) {
                    this.isSaving = false;
                    this.items.push(item);
                    this.owner.onItemsChanged();
                }
            },
            onUpdateCompleted: {
                value: function onUpdateCompleted(item) {
                    this.isSaving = false;
                    Object.assign(this.getById(item.id), item);

                    if ("appActions" in this && "publishSuccessMessage" in this.appActions) {
                        this.appActions.publishSuccessMessage("Update completed");
                    }

                    this.owner.onItemsChanged();
                }
            },
            onDeleteCompleted: {
                value: function onDeleteCompleted(item) {
                    this.isSaving = false;
                    item = this.getById(item.id);
                    if (item) {
                        this.items.splice(this.items.indexOf(item), 1);
                    }
                    this.owner.onItemsChanged();
                }
            },
            onLoadFailed: {
                value: function onLoadFailed(response) {
                    this.onFailed(response);
                }
            },
            onCreateFailed: {
                value: function onCreateFailed(response) {
                    this.onFailed(response);
                }
            },
            onGetFailed: {
                value: function onGetFailed(response) {
                    this.onFailed(response);
                }
            },
            onUpdateFailed: {
                value: function onUpdateFailed(response) {
                    this.onFailed(response);
                }
            },
            onDeleteFailed: {
                value: function onDeleteFailed(response) {
                    this.onFailed(response);
                }
            },
            onFailed: {
                value: function onFailed(response) {
                    this.isLoading = false;
                    this.isSaving = false;

                    if ("appActions" in this && "publishErrorMessage" in this.appActions) {
                        this.appActions.publishErrorMessage(response.statusText, JSON.stringify(response.data));
                    }

                    if ("onFailed" in this.owner) {
                        this.owner.onFailed(response);
                    }
                }
            }
        }, {
            decorate: {
                value: function decorate(owner) {
                    var crud = new CrudStoreDecorator(owner);

                    Object.defineProperties(owner, {
                        crud: {
                            value: crud
                        },
                        items: {
                            get: function () {
                                return crud.items;
                            },
                            set: function (items) {
                                crud.items = items;
                            }
                        },
                        isLoaded: {
                            get: function () {
                                return crud.isLoaded;
                            },
                            set: function (isLoaded) {
                                crud.isLoaded = isLoaded;
                            }
                        },
                        isLoading: {
                            get: function () {
                                return crud.isLoading;
                            },
                            set: function (isLoading) {
                                crud.isLoading = isLoading;
                            }
                        },
                        isSaving: {
                            get: function () {
                                return crud.isSaving;
                            },
                            set: function (isSaving) {
                                crud.isSaving = isSaving;
                            }
                        },
                        isEmpty: {
                            get: function () {
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
                            value: function () {}
                        }
                    });

                    DecoratorUtils.intercept(owner, crud, "onLoadStarted");
                    DecoratorUtils.intercept(owner, crud, "onCreateStarted");
                    DecoratorUtils.intercept(owner, crud, "onGetStarted");
                    DecoratorUtils.intercept(owner, crud, "onUpdateStarted");
                    DecoratorUtils.intercept(owner, crud, "onDeleteStarted");

                    DecoratorUtils.intercept(owner, crud, "onLoadCompleted");
                    DecoratorUtils.intercept(owner, crud, "onCreateCompleted");
                    DecoratorUtils.intercept(owner, crud, "onGetCompleted");
                    DecoratorUtils.intercept(owner, crud, "onUpdateCompleted");
                    DecoratorUtils.intercept(owner, crud, "onDeleteCompleted");

                    DecoratorUtils.intercept(owner, crud, "onLoadFailed");
                    DecoratorUtils.intercept(owner, crud, "onCreateFailed");
                    DecoratorUtils.intercept(owner, crud, "onGetFailed");
                    DecoratorUtils.intercept(owner, crud, "onUpdateFailed");
                    DecoratorUtils.intercept(owner, crud, "onDeleteFailed");
                }
            }
        });

        return CrudStoreDecorator;
    })();

    exports["default"] = CrudStoreDecorator;
});
//# sourceMappingURL=crud-store.js.map