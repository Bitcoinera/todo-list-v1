require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + '/date.js');
const ItemTable = require('./queries').ItemTable;
const ListTable = require('./queries').ListTable;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('public'));

let item1 = 'Add any new items you\'d like';

let item2 = 'Delete the items just by clicking the checkbox';

const defaultItems= [item1, item2];

app.get('/', function(req, res){

    let day = date.getDate()
    let listItems = [];
    let listLists = [];
    let list = 'home';

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

app.post('/createlist', function(req, res){
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

app.post('/', function(req, res){
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

app.get("/favicon.ico", function(req, res){
    
    res.redirect("/");
})

app.get('/createlist', function(req, res){
    let listLists = [];

    ListTable.getLists()
    .then(({lists}) => {
        listLists = lists;
        res.render('createlist', {lists: listLists});
    })
    .catch(error => console.error(error))
})

app.get('/:customListName', function(req, res){
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

app.post('/delete', function(req, res){
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

app.post('/deleteList', function(req, res){
    let title = req.body.list;

    ListTable.deleteList({title})
        .then(() => {
            console.log(`list ${title} has been deleted`);
            res.redirect('/');
        })
        .catch(error => console.error(error));
})

app.listen(3000, function(){
    console.log('The server is running on port 3000');
})