require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const date = require('../date');
const ItemTable = require('./tables').ItemTable;
const ListTable = require('./tables').ListTable;
const ListEngine = require('./queries');
const getItemsofList = require('./helper');

const app = express();
const listHandler = new ListEngine();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('public'));

app.get('/', function(req, res){

    let day = date.getDate()
    let listItems = [];
    let listLists = [];
    let list = 'home';

    listLists = listHandler.getLists();
    
    // listItems = listHandler.getItemsofList(list);
    getItemsofList({list})
        .then( items => {
            console.log(items);
            listItems = items;
        })
    res.render('list', {listTitle: day, items: listItems, lists: listLists});
})

app.post('/createlist', function(req, res){
    let newList = {
        title: req.body.newList
    }

    listHandler.saveList(newList);

    res.redirect('/' + newList.title);
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

    listLists = listHandler.getLists();
    res.render('createlist', {lists: listLists});
})

app.get('/:customListName', function(req, res){
    let newList = {
        title: req.params.customListName
    }
    let list = newList.title;
    let listLists = [];
    let listItems = [];

    listHandler.saveList(newList);

    listLists = listHandler.getLists();

    // listItems = listHandler.getItemsofList(list);
    getItemsofList({list})
        .then( items => {
            console.log(items);
            listItems = items;
        })
    res.render('list', {listTitle: newList.title, items: listItems, lists: listLists});
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