define(["exports"], function (exports) {
    "use strict";

    var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var SearchableComponent = exports.SearchableComponent = (function () {
        function SearchableComponent(owner) {
            _classCallCheck(this, SearchableComponent);

            this.owner = owner;
        }

        _createClass(SearchableComponent, {
            getSearchText: {
                value: function getSearchText() {
                    if (!this.searchText) {
                        this.searchText = "";
                    }

                    return this.searchText;
                }
            },
            setSearchText: {
                value: function setSearchText(searchText) {
                    this.searchText = searchText;
                    if (this.owner._dispatchSearch) {
                        this.owner._dispatchSearch(searchText);
                    }
                }
            }
        }, {
            decorate: {
                value: function decorate(owner) {
                    var searchable = new SearchableComponent(owner);
                    Object.defineProperties(owner, {
                        searchable: {
                            configurable: false,
                            writable: false,
                            enumerable: false,
                            value: searchable
                        },
                        searchText: {
                            get: searchable.getSearchText.bind(searchable),
                            set: searchable.setSearchText.bind(searchable)
                        }
                    });
                }
            }
        });

        return SearchableComponent;
    })();

    exports["default"] = SearchableComponent;
});
//# sourceMappingURL=searchable-component.js.map