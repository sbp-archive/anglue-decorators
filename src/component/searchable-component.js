export class SearchableComponent {
    static decorate(owner) {
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

    constructor(owner) {
        this.owner = owner;
    }

    getSearchText() {
        if (!this.searchText) {
            this.searchText = '';
        }

        return this.searchText;
    }

    setSearchText(searchText) {
        this.searchText = searchText;
        if (this.owner._dispatchSearch) {
            this.owner._dispatchSearch(searchText);
        }
    }
}

export default SearchableComponent;
