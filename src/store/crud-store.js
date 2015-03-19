import DecoratorUtils from '../utils';

export class CrudStoreDecorator {
    static decorate(owner) {
        var crud = new CrudStoreDecorator(owner);

        Object.defineProperties(owner, {
            crud: {
                value: crud
            },
            items: {
                get: () => {
                    return crud.items;
                }
            },
            isLoaded: {
                get: () => {
                    return crud.isLoaded;
                }
            },
            isLoading: {
                get: () => {
                    return crud.isLoading;
                }
            },
            isSaving: {
                get: () => {
                    return crud.isSaving;
                }
            },
            isEmpty: {
                get: () => {
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
                value: () => {}
            }
        });

        DecoratorUtils.intercept(owner, crud, 'onLoadStarted');
        DecoratorUtils.intercept(owner, crud, 'onCreateStarted');
        DecoratorUtils.intercept(owner, crud, 'onGetStarted');
        DecoratorUtils.intercept(owner, crud, 'onUpdateStarted');
        DecoratorUtils.intercept(owner, crud, 'onDeleteStarted');

        DecoratorUtils.intercept(owner, crud, 'onLoadCompleted');
        DecoratorUtils.intercept(owner, crud, 'onCreateCompleted');
        DecoratorUtils.intercept(owner, crud, 'onGetCompleted');
        DecoratorUtils.intercept(owner, crud, 'onUpdateCompleted');
        DecoratorUtils.intercept(owner, crud, 'onDeleteCompleted');

        DecoratorUtils.intercept(owner, crud, 'onLoadFailed');
        DecoratorUtils.intercept(owner, crud, 'onCreateFailed');
        DecoratorUtils.intercept(owner, crud, 'onGetFailed');
        DecoratorUtils.intercept(owner, crud, 'onUpdateFailed');
        DecoratorUtils.intercept(owner, crud, 'onDeleteFailed');
    }

    constructor(owner) {
        this.owner = owner;

        this.items = [];
        this.isLoaded = false;
        this.isLoading = false;
        this.isSaving = false;

        this.hasDetailsMap = {};
    }

    get isEmpty() {
        return this.isLoaded && this.items.length === 0;
    }

    getById(id) {
        return this.items.find((element) => {
            return element.id === id;
        });
    }

    hasDetails(id) {
        return !!this.hasDetailsMap[id];
    }

    onLoadStarted() {
        this.isLoading = true;
    }

    onGetStarted() {
        this.isLoading = true;
    }

    onUpdateStarted() {
        this.isSaving = true;
    }

    onCreateStarted() {
        this.isSaving = true;
    }

    onDeleteStarted() {
        this.isSaving = true;
    }

    onLoadCompleted(all) {
        this.isLoading = false;
        this.isLoaded = true;
        this.items = all;
        this.owner.onItemsChanged();
    }

    onGetCompleted(item) {
        this.isLoading = false;
        if (!this.getById(item.id)) {
            this.items.push(item);
        } else {
            Object.assign(this.getById(item.id), item);
        }
        this.hasDetailsMap[item.id] = true;
        this.owner.onItemsChanged();
    }

    onCreateCompleted(item) {
        this.isSaving = false;
        this.items.push(item);
        this.owner.onItemsChanged();
    }

    onUpdateCompleted(item) {
        this.isSaving = false;
        Object.assign(this.getById(item.id), item);

        if ('appActions' in this && 'publishSuccessMessage' in this.appActions) {
            this.appActions.publishSuccessMessage(
                'Update completed'
            );
        }

        this.owner.onItemsChanged();
    }

    onDeleteCompleted(item) {
        this.isSaving = false;
        item = this.getById(item.id);
        if (item) {
            this.items.splice(this.items.indexOf(item), 1);
        }
        this.owner.onItemsChanged();
    }

    onLoadFailed(response) {
        this.onFailed(response);
    }

    onCreateFailed(response) {
        this.onFailed(response);
    }

    onGetFailed(response) {
        this.onFailed(response);
    }

    onUpdateFailed(response) {
        this.onFailed(response);
    }

    onDeleteFailed(response) {
        this.onFailed(response);
    }

    onFailed(response) {
        this.isLoading = false;
        this.isSaving = false;

        if ('appActions' in this && 'publishErrorMessage' in this.appActions) {
            this.appActions.publishErrorMessage(
                'Error: ' + response.statusText,
                JSON.stringify(response.data)
            );
        }

        if ('onFailed' in this.owner) {
            this.owner.onFailed(response);
        }
    }
}

export default CrudStoreDecorator;
