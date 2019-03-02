const ListTable = require('./tables').ListTable;

class ListEngine {

    constructor() {
        this.listLists = [];
        this.listItems = [];
        this.item1 = 'Add any new items you\'d like';
        this.item2 = 'Delete the items just by clicking the checkbox';
        this.defaultItems= [this.item1, this.item2];

    }

    getLists() {
    ListTable.getLists()
            .then(({lists}) => {
                this.listLists = lists;
            })
            .catch(error => console.error(error))

        return this.listLists;
    }

    saveList(newList) {
        ListTable.storeList(newList)
            .then(listId => console.log('new list', listId, newList.title, 'created'))
            .catch(error => console.error(error));
    }
}

module.exports = ListEngine;