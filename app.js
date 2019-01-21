const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-ana:Ha7aIBDCaoMmNzhf@cluster0-hbymp.mongodb.net/todolistDB", {useNewUrlParser: true});

var itemSchema = mongoose.Schema({
    item: {
        type: String,
        required: true
    }
})

const Item = mongoose.model('Item', itemSchema);

const listSchema = {
    name: {
        type: String,
        required: true
    },
    items: [itemSchema]
}

const List = mongoose.model('List', listSchema);

const item1 = new Item({
    item: "Add your own items"
})

const item2 = new Item({
    item: "Delete by checking the checkbox"
})

const item3 = new Item({
    item: "Create your own custom list just by typing its name in the url"
})

const defaultItems = [item1, item2, item3];


app.get("/", function(req, res){

    let day = date.getDate()

    let listLists = [];

    Item.find({}, function(err, items){
        if (!err) {
        
        if (items.length === 0) {
            Item.insertMany(defaultItems, function(err){
                if (!err) {
                    console.log("Default items successfully saved");
                }
            })
        }

        List.find({}, function(err, lists){
            if (!err) {
                lists.forEach(function(list){
                    listLists.push(list.name);
                })
            }
        
        res.render("list", {listTitle: day, items: items, lists: listLists});
        })
        }  
    })
})

app.get("/favicon.ico", function(req, res){
    res.redirect("/");
})

app.get("/:customListName", function(req, res){

    const customListName = _.capitalize(req.params.customListName);
    let listLists = [];
  
    List.findOne({name: customListName}, function(err, foundList){
        if (err){ throw err} else {
           
            if (foundList === null){
                const list = new List({
                    name: customListName,
                    items: defaultItems
                })

                list.save();
                res.redirect("/" + customListName);
            } else {
                List.find({}, function(err, lists){
                    if (!err) {
                        lists.forEach(function(list){
                            listLists.push(list.name);
                        })
                    }
                   
                res.render("list", {listTitle: foundList.name, items: foundList.items, lists: listLists});
                })
            }
        }
    })
})

app.post("/", function(req, res){
    let listTitle = req.body.list;
    const item = new Item({item: req.body.newItem});

    if (listTitle.includes("Sunday") || listTitle.includes("Monday") || listTitle.includes("Tuesday") || listTitle.includes("Wednesday") || listTitle.includes("Thursday") || listTitle.includes("Friday") || listTitle.includes("Saturday")){
    
        item.save();

        res.redirect("/");
    } else {

        List.findOne({name: listTitle}, function(err, foundList){
            foundList.items.push(item);
            foundList.save();
            if (!err){
            res.redirect("/" + listTitle);
            }
        })
    }
})

app.post("/delete", function(req, res){
   
    let deleteItem = req.body.checkbox;
    let listTitle = req.body.listName;

    if (listTitle.includes("Sunday") || listTitle.includes("Monday") || listTitle.includes("Tuesday") || listTitle.includes("Wednesday") || listTitle.includes("Thursday") || listTitle.includes("Friday") || listTitle.includes("Saturday")){
        Item.deleteOne({item: deleteItem}, function(err){
            if (err) { throw err} 
    
            res.redirect("/");
        }) 
    } else {

        List.findOne({name: listTitle}, function(err, foundList){
            foundList.items.pop(deleteItem);
            foundList.save();
            if (!err) {
            res.redirect("/" + listTitle);
            }
        })  
    }
})

app.post("/deletelist", function(req, res){
    let listTitle = req.body.listName;

    List.deleteOne({name: listTitle}, function(err){
        if (!err) {
            res.redirect("/");
        }
    })
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function(){
    console.log("The server has started successfully");
})