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
    
    ItemTable.getItem()
        .then(({items}) => {
            if (items.length === 0) {
                listItems.push(defaultItems);
            }

            listItems = items;
            res.render('list', {listTitle: day, items: listItems});
        })
        .catch((error) => console.error(error));
})

app.post('/', function(req, res){
    let list = req.body.list;
    let newItem = {
        todo: req.body.newItem
    }

    defaultItems.push(newItem.todo);

    ItemTable.storeItem(newItem)
        .then(itemId => console.log('new item', itemId, newItem.todo, 'created'))
        .catch(error => console.error(error));
            
    res.redirect('/');
})

app.get("/favicon.ico", function(req, res){
    
    res.redirect("/");
})

app.get('/:newListName', function(req, res){
    let newList = {
        title: req.params.newListName
    }

    ListTable.storeList(newList)
        .then(listId => console.log('new list', listId, newList.title, 'created'))
        .catch(error => console.error(error));

    res.render('list', {listTitle: newList.title, items: defaultItems});
})

app.post('/:newListName', function(req, res){
    let newListName = req.params.newListName;
    let newItem = {
        todo: req.body.newItem  // property to adapt to DDBB
    }
    
    defaultItems.push(newItem.todo);

    ItemTable.storeItem(newItem)
        .then(({itemId}) => {
            console.log('new item', itemId, newItem.todo);
        })
        .catch(error => console.error(error));
    
    res.redirect('/' + newListName);
})

app.listen(3000, function(){
    console.log('The server is running on port 3000');
})