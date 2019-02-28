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
let item2 = 'Delete the items just by clicking the checkbox'
const defaultItems= [item1, item2];

app.get('/', function(req, res){

    let day = date.getDate()
    let listItems = [];
    let listLists = [];

    ListTable.getLists()
        .then(({lists}) => {
            listLists = lists;
            console.log(listLists)
        })
        .catch(err => console.error(err))
    
    ItemTable.getItem()
        .then(({items}) => {
            if (items.length === 0) {
                listItems.push(defaultItems);
            }

            listItems = items;
            res.render('list', {listTitle: day, items: listItems, lists: listLists});
        })
        .catch((error) => console.error(error));
})

app.post('/', function(req, res){
    let listTitle = req.body.list;
    let newItem = {
        todo: req.body.newItem,
        list: req.body.list
    }

    defaultItems.push(newItem.todo);
    
    if (listTitle.includes("Sunday") || listTitle.includes("Monday") || listTitle.includes("Tuesday") || listTitle.includes("Wednesday") || listTitle.includes("Thursday") || listTitle.includes("Friday") || listTitle.includes("Saturday")) {
        newItem.list = null;
        
        ItemTable.storeItem(newItem)
        .then(itemId => console.log('new item', itemId, newItem.todo, newItem.list, 'created'))
        .catch(error => console.error(error));

        res.redirect('/');
    } else {
        ItemTable.storeItem(newItem)
        .then(itemId => console.log('new item', itemId, newItem.todo, newItem.list, 'created'))
        .catch(error => console.error(error));

        res.redirect('/' + listTitle);
    }
})

app.get("/favicon.ico", function(req, res){
    
    res.redirect("/");
})

app.get('/:customListName', function(req, res){
    let newList = {
        title: req.params.customListName
    }

    ListTable.storeList(newList)
        .then(listId => console.log('new list', listId, newList.title, 'created'))
        .catch(error => console.error(error));

    ListTable.getItemsofList();

    res.render('list', {listTitle: newList.title, items: defaultItems});
})

app.listen(3000, function(){
    console.log('The server is running on port 3000');
})