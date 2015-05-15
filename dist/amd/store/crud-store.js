define(["exports", "../utils"], function (exports, _utils) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _interopRequire(obj) { return obj && obj.__esModule ? obj["default"] : obj; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    var _utils2 = _interopRequire(_utils);

    var CrudStoreDecorator = (function () {
        function CrudStoreDecorator(owner) {
            _classCallCheck(this, CrudStoreDecorator);

            this.owner = owner;

            this.initialize();
        }

        _createClass(CrudStoreDecorator, [{
            key: "initialize",
            value: function initialize() {
                this.items = [];
                this.isLoaded = false;
                this.isLoading = false;
                this.isSaving = false;

                this.loadFailed = false;
                this.getFailed = false;
                this.createFailed = false;
                this.updateFailed = false;
                this.deleteFailed = false;

                this.hasDetailsMap = {};
            }
        }, {
            key: "isEmpty",
            get: function () {
                return this.isLoaded && this.items.length === 0;
            }
        }, {
            key: "getById",
            value: function getById(id) {
                return this.items.find(function (element) {
                    return element.id === id;
                });
            }
        }, {
            key: "hasDetails",
            value: function hasDetails(id) {
                return !!this.hasDetailsMap[id];
            }
        }, {
            key: "onLoadStarted",
            value: function onLoadStarted() {
                this.isLoading = true;
                this.loadFailed = false;
            }
        }, {
            key: "onGetStarted",
            value: function onGetStarted() {
                this.isLoading = true;
                this.getFailed = false;
            }
        }, {
            key: "onUpdateStarted",
            value: function onUpdateStarted() {
                this.isSaving = true;
                this.updateFailed = false;
            }
        }, {
            key: "onCreateStarted",
            value: function onCreateStarted() {
                this.isSaving = true;
                this.createFailed = false;
            }
        }, {
            key: "onDeleteStarted",
            value: function onDeleteStarted() {
                this.isSaving = true;
                this.deleteFailed = false;
            }
        }, {
            key: "onLoadCompleted",
            value: function onLoadCompleted(all) {
                this.isLoading = false;
                this.isLoaded = true;
                this.items = all;
                this.owner.onItemsChanged();
            }
        }, {
            key: "onGetCompleted",
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
            key: "onCreateCompleted",
            value: function onCreateCompleted(item) {
                this.isSaving = false;
                this.items.push(item);
                this.owner.onItemsChanged();
            }
        }, {
            key: "onUpdateCompleted",
            value: function onUpdateCompleted(item) {
                this.isSaving = false;
                Object.assign(this.getById(item.id), item);

                if ("appActions" in this && "publishSuccessMessage" in this.appActions) {
                    this.appActions.publishSuccessMessage("Update completed");
                }

                this.owner.onItemsChanged();
            }
        }, {
            key: "onDeleteCompleted",
            value: function onDeleteCompleted(item) {
                this.isSaving = false;
                item = this.getById(item.id);
                if (item) {
                    this.items.splice(this.items.indexOf(item), 1);
                }
                this.owner.onItemsChanged();
            }
        }, {
            key: "onLoadFailed",
            value: function onLoadFailed(response) {
                this.loadFailed = true;
                this.onFailed(response);
            }
        }, {
            key: "onCreateFailed",
            value: function onCreateFailed(response) {
                this.createFailed = true;
                this.onFailed(response);
            }
        }, {
            key: "onGetFailed",
            value: function onGetFailed(response) {
                this.getFailed = true;
                this.onFailed(response);
            }
        }, {
            key: "onUpdateFailed",
            value: function onUpdateFailed(response) {
                this.updateFailed = true;
                this.onFailed(response);
            }
        }, {
            key: "onDeleteFailed",
            value: function onDeleteFailed(response) {
                this.deleteFailed = true;
                this.onFailed(response);
            }
        }, {
            key: "onFailed",
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
        }], [{
            key: "decorate",
            value: function decorate(owner) {
                var crud = new CrudStoreDecorator(owner);
                var properties = ["items", "isLoaded", "isLoading", "isSaving", "isEmpty", "loadFailed", "getFailed", "createFailed", "updateFailed", "deleteFailed"];

                _utils2.addDecoratorProperties(owner, crud, properties);

                Object.defineProperties(owner, {
                    crud: {
                        value: crud
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

                _utils2.intercept(owner, crud, "initialize");

                _utils2.intercept(owner, crud, "onLoadStarted");
                _utils2.intercept(owner, crud, "onCreateStarted");
                _utils2.intercept(owner, crud, "onGetStarted");
                _utils2.intercept(owner, crud, "onUpdateStarted");
                _utils2.intercept(owner, crud, "onDeleteStarted");

                _utils2.intercept(owner, crud, "onLoadCompleted");
                _utils2.intercept(owner, crud, "onCreateCompleted");
                _utils2.intercept(owner, crud, "onGetCompleted");
                _utils2.intercept(owner, crud, "onUpdateCompleted");
                _utils2.intercept(owner, crud, "onDeleteCompleted");

                _utils2.intercept(owner, crud, "onLoadFailed");
                _utils2.intercept(owner, crud, "onCreateFailed");
                _utils2.intercept(owner, crud, "onGetFailed");
                _utils2.intercept(owner, crud, "onUpdateFailed");
                _utils2.intercept(owner, crud, "onDeleteFailed");
            }
        }]);

        return CrudStoreDecorator;
    })();

    exports.CrudStoreDecorator = CrudStoreDecorator;
    exports["default"] = CrudStoreDecorator;
});
//# sourceMappingURL=crud-store.js.map