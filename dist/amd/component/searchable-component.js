define(['exports'], function (exports) {
    'use strict';

    var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    Object.defineProperty(exports, '__esModule', {
        value: true
    });

    var SearchableComponent = (function () {
        function SearchableComponent(owner) {
            _classCallCheck(this, SearchableComponent);

            this.owner = owner;
        }

        _createClass(SearchableComponent, [{
            key: 'getSearchText',
            value: function getSearchText() {
                if (!this.searchText) {
                    this.searchText = '';
                }

                return this.searchText;
            }
        }, {
            key: 'setSearchText',
            value: function setSearchText(searchText) {
                this.searchText = searchText;
                if (this.owner._dispatchSearch) {
                    this.owner._dispatchSearch(searchText);
                }
            }
        }], [{
            key: 'decorate',
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
        }]);

        return SearchableComponent;
    })();

    exports.SearchableComponent = SearchableComponent;
    exports['default'] = SearchableComponent;
});
//# sourceMappingURL=searchable-component.js.map