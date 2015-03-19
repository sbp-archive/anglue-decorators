import DecoratorUtils from '../utils';

export class FilterableStoreDecorator {
    static decorateClass(cls) {
        DecoratorUtils.addInjections(cls, {
            'filterService': '$filter'
        });
    }

    static decorate(owner) {
        var filterable = new FilterableStoreDecorator(owner);

        Object.defineProperties(owner, {
            filterable: {
                value: filterable
            },
            filtered: {
                get: () => {
                    return filterable.filtered;
                }
            }
        });

        DecoratorUtils.intercept(owner, filterable, 'doFilter');
        DecoratorUtils.intercept(owner, filterable, 'onFilterChange');
        DecoratorUtils.intercept(owner, filterable, 'onFilterClear');
        DecoratorUtils.intercept(owner, filterable, 'onSearchChange');
        DecoratorUtils.intercept(owner, filterable, 'onSearchClear');
        DecoratorUtils.intercept(owner, filterable, 'onItemsFiltered');
        DecoratorUtils.sequence(owner, filterable, 'onItemsChanged');
    }

    constructor(owner) {
        this.owner = owner;

        this.filtered = [];
        this.filters = new Map();
    }

    onItemsChanged() {
        this.doFilter();
    }

    doFilter() {
        var filtered = this.owner.items.slice();
        for (let filterFn of this.filters.values()) {
            filtered = filterFn(filtered);
        }
        this.filtered = filtered;
        this.owner.onItemsFiltered(filtered);
    }

    onFilterChange(filterName, filter) {
        if (Object.prototype.toString.call(filter) === '[object String]') {
            this.filters.set(filterName, (items) => {
                return this.owner.filterService('filter')(items, filter);
            });
        } else {
            this.filters.set(filterName, (items) => {
                return items.filter((item) => {
                    var exclude = filter.exclude;
                    var filterProperty = filter.property;
                    var filterValues = filter.value;
                    var value = item[filterProperty];

                    if (filterValues) {
                        if (!Array.isArray(filterValues)) {
                            filterValues = [filterValues];
                        }

                        for (let i = 0, ln = filterValues.length; i < ln; i++) {
                            let filterValue = filterValues[i];
                            if (value === filterValue) {
                                return !exclude;
                            }
                        }
                    }

                    return !!exclude;
                });
            });
        }
        this.doFilter();
    }

    onFilterClear(filterName) {
        this.filters.delete(filterName);
        this.doFilter();
    }

    onSearchClear() {
        this.onFilterClear('__search');
    }

    onSearchChange(expression) {
        this.onFilterChange('__search', expression);
    }

    onItemsFiltered() {}
}

export default FilterableStoreDecorator;
