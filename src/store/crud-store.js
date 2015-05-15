import utils from '../utils';

export class CrudStoreDecorator {
    static decorate(owner) {
        var crud        = new CrudStoreDecorator(owner);
        var properties  = [
            "items",
            "isLoaded",
            "isLoading",
            "isSaving",
            "isEmpty",
            "loadFailed",
            "getFailed",
            "createFailed",
            "updateFailed",
            "deleteFailed"
        ];

        utils.addDecoratorProperties(owner, crud, properties);

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
                value: () => {}
            }
        });

        utils.intercept(owner, crud, 'initialize');

        utils.intercept(owner, crud, 'onLoadStarted');
        utils.intercept(owner, crud, 'onCreateStarted');
        utils.intercept(owner, crud, 'onGetStarted');
        utils.intercept(owner, crud, 'onUpdateStarted');
        utils.intercept(owner, crud, 'onDeleteStarted');

        utils.intercept(owner, crud, 'onLoadCompleted');
        utils.intercept(owner, crud, 'onCreateCompleted');
        utils.intercept(owner, crud, 'onGetCompleted');
        utils.intercept(owner, crud, 'onUpdateCompleted');
        utils.intercept(owner, crud, 'onDeleteCompleted');

        utils.intercept(owner, crud, 'onLoadFailed');
        utils.intercept(owner, crud, 'onCreateFailed');
        utils.intercept(owner, crud, 'onGetFailed');
        utils.intercept(owner, crud, 'onUpdateFailed');
        utils.intercept(owner, crud, 'onDeleteFailed');
    }

    constructor(owner) {
        this.owner = owner;

        this.initialize();
    }

    initialize() {
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
        this.loadFailed = false;
    }

    onGetStarted() {
        this.isLoading = true;
        this.getFailed = false;
    }

    onUpdateStarted() {
        this.isSaving = true;
        this.updateFailed = false;
    }

    onCreateStarted() {
        this.isSaving = true;
        this.createFailed = false;
    }

    onDeleteStarted() {
        this.isSaving = true;
        this.deleteFailed = false;
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
        this.loadFailed = true;
        this.onFailed(response);
    }

    onCreateFailed(response) {
        this.createFailed = true;
        this.onFailed(response);
    }

    onGetFailed(response) {
        this.getFailed = true;
        this.onFailed(response);
    }

    onUpdateFailed(response) {
        this.updateFailed = true;
        this.onFailed(response);
    }

    onDeleteFailed(response) {
        this.deleteFailed = true;
        this.onFailed(response);
    }

    onFailed(response) {
        this.isLoading = false;
        this.isSaving = false;

        if ('appActions' in this && 'publishErrorMessage' in this.appActions) {
            this.appActions.publishErrorMessage(
                response.statusText,
                JSON.stringify(response.data)
            );
        }

        if ('onFailed' in this.owner) {
            this.owner.onFailed(response);
        }
    }
}

export default CrudStoreDecorator;
