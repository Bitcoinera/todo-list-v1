const {Router} = require('express');
const ItemTable = require('./tables').ItemTable;
const ListTable = require('./tables').ListTable;
const { ListEngine, ItemEngine } = require('./queries');
const getItemsofList = require('./helper');
const date = require('../date');

const router = new Router;
const listHandler = new ListEngine();

let item1 = 'Add any new items you\'d like';
let item2 = 'Delete the items just by clicking the checkbox';

const defaultItems= [item1, item2];

router.get('/', (req, res) => {

    let day = date.getDate()
    let listItems = [];
    let listLists = [];
    let list = 'home';

    // listLists = listHandler.getLists(); ---> modular alternative
    
    ListTable.getLists()
        .then(({lists}) => {
            listLists = lists;
        })
        .catch(error => console.error(error))
    
    ListTable.getItemsOfList({list})
        .then(({itemsOfList}) => {
            if (itemsOfList.length === 0) {
                listItems = defaultItems;

            } else {
                listItems = [...defaultItems, ...itemsOfList];
            }
            res.render('list', {listTitle: day, items: listItems, lists: listLists});
        })
        .catch((error) => console.error(error));
})

router.post('/', (req, res) => {
    let listTitle = req.body.list;
    let newItem = {
        todo: req.body.newItem,
        list: req.body.list
    }
     
    if (newItem.todo === '') {
        console.log('item todo cannot be empty');
        res.redirect('/');
    }

    if (listTitle.includes("Sunday") || listTitle.includes("Monday") || listTitle.includes("Tuesday") || listTitle.includes("Wednesday") || listTitle.includes("Thursday") || listTitle.includes("Friday") || listTitle.includes("Saturday")) {
        newItem.list = 'home';
        
        ItemTable.storeItem(newItem)
            .then(itemId => {
                console.log('new item', itemId, newItem.todo, newItem.list, 'created');
                res.redirect('/');
                })
            .catch(error => console.error(error));
    } else {
        ItemTable.storeItem(newItem)
            .then(itemId => {
                console.log('new item', itemId, newItem.todo, newItem.list, 'created');
                res.redirect('/' + listTitle);
            })
            .catch(error => console.error(error));
            }
})

router.post('/createlist', function(req, res){
    let newList = {
        title: req.body.newList
    }

    ListTable.storeList(newList)
    .then(listId => {
        console.log('new list', listId, newList.title, 'created');
        res.redirect('/' + newList.title);
    })
    .catch(error => console.error(error));
})

router.get('/createlist', function(req, res){
    let listLists = [];

    ListTable.getLists()
    .then(({lists}) => {
        listLists = lists;
        res.render('createlist', {lists: listLists});
    })
    .catch(error => console.error(error))
})

router.get('/:customListName', function(req, res){
    let newList = {
        title: req.params.customListName
    }
    let list = newList.title;
    let listLists = [];

    ListTable.storeList(newList)
        .then(listId => console.log('new list', listId, newList.title, 'created'))
        .catch(error => console.error(error));
    
    ListTable.getLists()
    .then(({lists}) => {
        listLists = lists;
    })
    .catch(error => console.error(error))

    ListTable.getItemsOfList({list})
        .then(({itemsOfList}) => {
            let items = [...defaultItems, ...itemsOfList];

            res.render('list', {listTitle: newList.title, items: items, lists: listLists});
        })
        .catch(error => console.error(error));
})

router.post('/delete', (req, res) => {
    let todo = req.body.checkbox;
    let listTitle = req.body.list;

    if (listTitle.includes("Sunday") || listTitle.includes("Monday") || listTitle.includes("Tuesday") || listTitle.includes("Wednesday") || listTitle.includes("Thursday") || listTitle.includes("Friday") || listTitle.includes("Saturday")) {
        listTitle = '';
    }
    
    ItemTable.deleteItem(todo)
        .then(() => {
            console.log(`Item deleted with todo: ${todo}`);
            res.redirect('/' + listTitle);
        })
        .catch(error => console.error(error));
})

router.post('/deleteList', (req, res) => {
    let title = req.body.list;

    ListTable.deleteList({title})
        .then(() => {
            console.log(`list ${title} has been deleted`);
            res.redirect('/');
        })
        .catch(error => console.error(error));
})

router.get("/favicon.ico", (req, res) => {
    
    res.redirect("/");
})

module.exports = router;