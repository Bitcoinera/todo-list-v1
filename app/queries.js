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

    // getItemsofList(list) {
//     ListTable.getItemsOfList({list})
//     .then(({itemsOfList}) => {
//         if (itemsOfList.length === 0) {
//             this.listItems = this.defaultItems;

//         } else {
//             this.listItems = [...this.defaultItems, ...itemsOfList];
//             console.log(this.listItems);
//         }
//     })
//     .catch((error) => console.error(error));

//     return this.listItems;
// }
}

module.exports = ListEngine;