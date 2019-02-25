require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + '/date.js');
const ItemGeneration = require('./queries');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('public'));

let item1 = 'Add any new items you\'d like';
let item2 = 'Delete the items just by clicking the checkbox'
const defaultItems= [item1, item2];

app.get('/', function(req, res){

    let day = date.getDate()

    res.render('list', {listTitle: day, items: defaultItems});
})

app.post('/', function(req, res){
    let list = req.body.list;
    let newItem = {
        todo: req.body.newItem
    }

    defaultItems.push(newItem.todo);

    ItemGeneration.storeItem(newItem);
    res.redirect('/');
})

app.get('/work', function(req, res){

    res.render('list', {listTitle: 'Work List', items: newWorkItems});
})

app.get('/:newListName', function(req, res){
    let newListName = req.params.newListName;

    res.render('list', {listTitle: newListName, items: defaultItems});
})

app.post('/:newListName', function(req, res){
    let newListName = req.params.newListName;
    let newItem = req.body.newItem;
    defaultItems.push(newItem);

    ItemGeneration.storeItem(newItem);
    
    res.redirect('/' + newListName);
})

app.listen(3000, function(){
    console.log('The server is running on port 3000');
})