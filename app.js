const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolist", {useNewUrlParser: true});

var itemSchema = mongoose.Schema({
    item: {
        type: String,
        required: true
    }
})

const Item = mongoose.model('Item', itemSchema);

var workItemSchema = mongoose.Schema({
    item: {
        type: String,
        required: true
    }
})

const Workitem = mongoose.model('Workitem', workItemSchema);

app.get("/", function(req, res){
    let route = "/work";

    let day = date.getDate()

    res.render("list", {listTitle: day, items: Item, route: route});
})

app.post("/", function(req, res){
    let list = req.body.list;

    if (list === "Work"){

        const workitem = new Workitem({item: req.body.newItem});
        
        workitem.save();

        res.redirect("/work");
    } else {

    const item = new Item({item: req.body.newItem});
    
    item.save();
        
    res.redirect("/");
    }
})

app.get("/work", function(req, res){

    let route = "/";
   
    res.render("list", {listTitle: "Work List", items: Workitem, route: route});
})

app.listen(3000, function(){
    console.log("The server is running on port 3000");
})