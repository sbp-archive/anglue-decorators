export class SortableComponent {
    static decorate(owner) {
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

    constructor(owner) {
        this.owner = owner;
    }

    setSortProperty(sortProperty) {
        this.sortBy(sortProperty, this.sortReverse);
    }

    setSortReverse(sortReverse) {
        this.sortBy(this.sortProperty, sortReverse);
    }

    getSortProperty() {
        if (this.sortProperty === undefined) {
            this.sortProperty = null;
        }
        return this.sortProperty;
    }

    getSortReverse() {
        if (this.sortReverse === undefined) {
            this.sortReverse = false;
        }
        return this.sortReverse;
    }

    sortBy(sortProperty, sortReverse) {
        if (this.sortProperty === sortProperty) {
            if (sortReverse === undefined) {
                sortReverse = !this.sortReverse;
            }
        } else if (sortReverse === undefined) {
            sortReverse = false;
        }

        if (
            this.sortProperty !== sortProperty ||
            this.sortReverse !== sortReverse
        ) {
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

export default SortableComponent;
