import DecoratorUtils from '../utils';

export class SortableStoreDecorator {
    static decorateClass(cls) {
        DecoratorUtils.addInjections(cls, {
            'filterService': '$filter'
        });
    }

    static decorate(owner) {
        var sortable = new SortableStoreDecorator(owner);

        Object.defineProperties(owner, {
            sortable: {
                value: sortable
            }
        });

        DecoratorUtils.intercept(owner, sortable, 'doSort');
        DecoratorUtils.intercept(owner, sortable, 'onSortChange');
        DecoratorUtils.intercept(owner, sortable, 'onItemsSorted');
        DecoratorUtils.intercept(owner, sortable, 'onItemsChanged');
    }

    constructor(owner) {
        this.owner = owner;
        this.sorters = new Map();
    }

    onItemsChanged() {
        this.doSort();
    }

    doSort() {
        var sorted = this.owner.items;
        for (let [key, sortFn] of this.sorters.entries()) {
            sorted = sortFn(sorted);
        }
        this.owner.items = sorted;
        this.owner.onItemsSorted(sorted);
    }

    onSortChange(sortInfo) {
        var {
            property,
            reverse
        } = sortInfo;

        this.sorters.set('__sort', (items) => {
            return this.owner.filterService('orderBy')(items, property,
                reverse);
        });

        // We have to go through onItemsChanged so that other decorators can react
        // to this as well.
        this.owner.onItemsChanged();
    }

    onItemsSorted() {}
}

export default SortableStoreDecorator;
